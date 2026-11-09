#!/usr/bin/env node
// Fırsat analizi: hangi video TÜRÜ çok izleniyor ama az yapılıyor?
// Kullanım: npm run firsat [-- arastirma/firsat-tohumlar.json] [--yenile]
//
// 1) YouTube Data API v3 ile tohum sorgularından son N günün Türkçe kısa videolarını toplar
//    (search 100 birim/sorgu + videos/channels 1'er birim; günlük ücretsiz kota 10.000 birim).
// 2) Gemini her videoyu başlık + açıklamaya bakarak bir TÜRE koyar (türler tohum dosyasında).
// 3) Tür bazında talep (günlük izlenme), arz (örnekteki pay, kanal sayısı) ve kırılma oranını
//    (kanalın abone sayısının 3 katından fazla izlenen video) hesaplar; fırsat skoruna göre sıralar.
//
// Çıktı: out/firsat/rapor.md, out/firsat/videolar.csv. API yanıtları out/firsat/onbellek/ altında
// saklanır; --yenile verilmezse aynı gün tekrar çalıştırmak kota harcamaz.
//
// Anahtarlar koda yazılmaz. Ortamın ağ sırları (youtube.googleapis.com ve
// generativelanguage.googleapis.com için x-goog-api-key) proxy tarafından eklenir.
// Yerelde YOUTUBE_API_KEY ve GEMINI_API_KEY ortam değişkenleri kullanılır.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
const cfgPath = path.resolve(args.find(a => !a.startsWith('--')) || 'arastirma/firsat-tohumlar.json');
const refresh = args.includes('--yenile');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const outDir = path.resolve('out/firsat');
const cacheDir = path.join(outDir, 'onbellek');
fs.mkdirSync(cacheDir, { recursive: true });

const MAX_SN = 180;                 // Shorts üst sınırı
const day = 86400e3;
const today = new Date().toISOString().slice(0, 10);
const after = new Date(Date.now() - (cfg.gun || 90) * day).toISOString();

// ---------- YouTube ----------
async function yt(endpoint, params) {
  const key = crypto.createHash('sha1').update(today + endpoint + JSON.stringify(params)).digest('hex');
  const file = path.join(cacheDir, `${endpoint}-${key}.json`);
  if (!refresh && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const url = new URL(`https://youtube.googleapis.com/youtube/v3/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const headers = {};
  if (process.env.YOUTUBE_API_KEY) headers['x-goog-api-key'] = process.env.YOUTUBE_API_KEY;
  const res = await fetch(url, { headers });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`YouTube ${endpoint} HTTP ${res.status}: ${JSON.stringify(j).slice(0, 300)}`);
  fs.writeFileSync(file, JSON.stringify(j));
  return j;
}
const chunks = (a, n) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));
const isoSec = d => { const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(d || '') || []; return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0); };

const found = new Map();            // videoId -> sorgu
const totals = {};
let units = 0;
for (const q of cfg.sorgular) {
  const r = await yt('search', { part: 'snippet', type: 'video', videoDuration: 'short', q, maxResults: 50,
    regionCode: cfg.bolge || 'TR', relevanceLanguage: cfg.dil || 'tr', publishedAfter: after, order: 'relevance' });
  units += 100;
  totals[q] = r.pageInfo?.totalResults ?? null;
  for (const it of r.items || []) if (!found.has(it.id.videoId)) found.set(it.id.videoId, q);
  process.stdout.write(`  ${q}: ${(r.items || []).length}\n`);
}

const videos = [];
for (const ids of chunks([...found.keys()], 50)) {
  const r = await yt('videos', { part: 'snippet,statistics,contentDetails', id: ids.join(','), maxResults: 50 });
  units += 1;
  for (const v of r.items || []) {
    const sec = isoSec(v.contentDetails.duration);
    if (sec === 0 || sec > MAX_SN) continue;
    const ageDays = Math.max(1, (Date.now() - Date.parse(v.snippet.publishedAt)) / day);
    videos.push({
      id: v.id, sorgu: found.get(v.id), baslik: v.snippet.title, aciklama: (v.snippet.description || '').slice(0, 300),
      kanalId: v.snippet.channelId, kanal: v.snippet.channelTitle, tarih: v.snippet.publishedAt.slice(0, 10), sn: sec,
      izlenme: +v.statistics.viewCount || 0, begeni: +v.statistics.likeCount || 0, yorum: +v.statistics.commentCount || 0,
      gunluk: (+v.statistics.viewCount || 0) / ageDays,
    });
  }
}
const subs = {};
for (const ids of chunks([...new Set(videos.map(v => v.kanalId))], 50)) {
  const r = await yt('channels', { part: 'statistics', id: ids.join(','), maxResults: 50 });
  units += 1;
  for (const c of r.items || []) subs[c.id] = c.statistics.hiddenSubscriberCount ? null : +c.statistics.subscriberCount;
}
for (const v of videos) v.abone = subs[v.kanalId] ?? null;
console.log(`${videos.length} kısa video, ${Object.keys(subs).length} kanal · ~${units} YouTube kota birimi`);

// ---------- Gemini ile tür etiketi ----------
const turler = cfg.turler;
async function classify(batch) {
  const key = crypto.createHash('sha1').update(JSON.stringify([turler, batch.map(v => v.id)])).digest('hex');
  const file = path.join(cacheDir, `tur-${key}.json`);
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const prompt = `Aşağıdaki YouTube Shorts videolarını FORMATINA göre sınıflandır (konu değil, anlatım kalıbı).
Türler:\n${Object.entries(turler).map(([k, d]) => `- ${k}: ${d}`).join('\n')}
Ayrıca "konu": "turkiye" | "dunya" | "harita-disi" (video harita/coğrafya/ülkelerle ilgili değilse harita-disi).
Yalnızca JSON dizi döndür: [{"id": "...", "tur": "...", "konu": "..."}]
Videolar:\n${batch.map(v => JSON.stringify({ id: v.id, baslik: v.baslik, aciklama: v.aciklama.slice(0, 150) })).join('\n')}`;
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.GEMINI_API_KEY) headers['x-goog-api-key'] = process.env.GEMINI_API_KEY;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${cfg.model || 'gemini-3.8-flash'}:generateContent`, {
      method: 'POST', headers,
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0 } }),
    });
    const j = await res.json().catch(() => ({}));
    const text = j.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
    try { const out = JSON.parse(text); fs.writeFileSync(file, JSON.stringify(out)); return out; }
    catch { console.warn(`  ! Gemini deneme ${attempt}: HTTP ${res.status} ${JSON.stringify(j).slice(0, 200)}`); }
    await new Promise(r => setTimeout(r, 2000 * attempt));
  }
  return [];
}
const labels = {};
const batches = chunks(videos, 40);
for (const group of chunks(batches, 6)) {   // 6 istek aynı anda
  for (const res of await Promise.all(group.map(classify))) for (const l of res) labels[l.id] = l;
  process.stdout.write(`  tür etiketi: ${Object.keys(labels).length}/${videos.length}\n`);
}
for (const v of videos) { v.tur = turler[labels[v.id]?.tur] ? labels[v.id].tur : 'diger'; v.konu = labels[v.id]?.konu || '?'; }

// ---------- Tür bazında özet ----------
const med = a => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const pool = videos.filter(v => v.konu !== 'harita-disi');
const rows = Object.keys(turler).map(tur => {
  const vs = pool.filter(v => v.tur === tur);
  const withSubs = vs.filter(v => v.abone != null);
  const breakout = withSubs.filter(v => v.izlenme >= 10000 && v.izlenme >= 3 * Math.max(v.abone, 1)).length;
  const r = {
    tur, n: vs.length, pay: vs.length / Math.max(pool.length, 1), kanal: new Set(vs.map(v => v.kanalId)).size,
    medGunluk: med(vs.map(v => v.gunluk)), medIzlenme: med(vs.map(v => v.izlenme)),
    kirilma: withSubs.length ? breakout / withSubs.length : 0,
    turkiye: vs.length ? vs.filter(v => v.konu === 'turkiye').length / vs.length : 0,
  };
  // Fırsat: talep × kırılma / arz. Kaba bir sıralama ölçüsü; tek başına karar değil.
  r.skor = r.n >= 3 ? r.medGunluk * (0.1 + r.kirilma) / Math.max(r.pay, 0.02) : 0;
  return r;
}).sort((a, b) => b.skor - a.skor);

const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1) + ' M' : n >= 1e3 ? (n / 1e3).toFixed(1) + ' B' : Math.round(n) + '';
const pct = x => Math.round(x * 100) + '%';
const top = tur => pool.filter(v => v.tur === tur).sort((a, b) => b.gunluk - a.gunluk).slice(0, 3)
  .map(v => `[${v.baslik.replace(/[|\[\]]/g, ' ').slice(0, 60)}](https://youtube.com/shorts/${v.id}) (${fmt(v.izlenme)})`).join('<br>');

const md = [
  `# Fırsat analizi (${today})`, '',
  `Kaynak: YouTube Data API, son ${cfg.gun || 90} gün, bölge ${cfg.bolge || 'TR'}, ${cfg.sorgular.length} sorgu, ` +
  `${pool.length} harita/coğrafya Shorts'u (${videos.length - pool.length} konu dışı video ayıklandı). Türler Gemini ile etiketlendi.`, '',
  '- **Günlük izlenme (medyan):** talep. Videonun yaşına bölünmüş izlenme, eski videolar avantajlı olmasın diye.',
  '- **Pay / kanal:** arz. Örnekte bu türden ne kadar var, kaç farklı kanal yapıyor.',
  '- **Kırılma:** abone sayısının 3 katından fazla (ve 10 B+) izlenen videoların oranı. Yüksekse algoritma bu formatı küçük kanallara da dağıtıyor.',
  '- **Skor** = günlük izlenme × (0,1 + kırılma) / pay. Kaba sıralama; en az 3 video yoksa 0.', '',
  '| Tür | Video | Pay | Kanal | Günlük izlenme | Medyan izlenme | Kırılma | Türkiye konulu | Skor | En iyi örnekler |',
  '| --- | --: | --: | --: | --: | --: | --: | --: | --: | --- |',
  ...rows.map(r => `| ${r.tur} | ${r.n} | ${pct(r.pay)} | ${r.kanal} | ${fmt(r.medGunluk)} | ${fmt(r.medIzlenme)} | ${pct(r.kirilma)} | ${pct(r.turkiye)} | ${fmt(r.skor)} | ${top(r.tur)} |`),
  '', '**Sorgu başına YouTube sonuç tahmini** (arama hacmi değil, YouTube\'un kabaca bulduğu video sayısı):', '',
  ...Object.entries(totals).map(([q, t]) => `- ${q}: ${t == null ? '?' : fmt(t)}`), '',
];
fs.writeFileSync(path.join(outDir, 'rapor.md'), md.join('\n'));
const cols = ['id', 'tur', 'konu', 'baslik', 'kanal', 'abone', 'izlenme', 'gunluk', 'begeni', 'yorum', 'sn', 'tarih', 'sorgu'];
const esc = x => /[",\n]/.test(String(x ?? '')) ? `"${String(x).replace(/"/g, '""')}"` : String(x ?? '');
fs.writeFileSync(path.join(outDir, 'videolar.csv'), [cols.join(','), ...videos.map(v => cols.map(c => esc(c === 'gunluk' ? Math.round(v[c]) : v[c])).join(','))].join('\n'));
console.log(`Rapor: ${path.join(outDir, 'rapor.md')}`);
