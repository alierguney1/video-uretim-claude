#!/usr/bin/env node
// Otomatik yayın kuyruğu. Rehber: docs/otomatik-yayin.md
//
//   npm run yayin                          → kuyruk durumu (insan için)
//   npm run yayin -- durum --json          → aynı bilgi JSON (zamanlanmış oturum bunu okur)
//   npm run yayin -- hazirla <ad>          → tts (gerekirse) → check → render → kapak gömme; yüklenecek dosyayı yazar
//   npm run yayin -- kaydet <ad> <platform> <url> [--tarih YYYY-MM-DD] [--not "..."]
//                                          → <ad>.yayin.json + yayinlar.csv günceller
//
// TEKRAR YÜKLEME YASAK: yüklemeden önce platformun kendi listesine bakılır (docs/otomatik-yayin.md, adım 3.2).
// Platformda zaten varsa yükleme yapılmaz, sadece `kaydet` ile adresi yazılır.
//
// Kuyruk: animasyonlar/<ad>.yayin.json. "onay": true olan ve "zaman"ı gelmiş, o platformda henüz
// yayınlanmamış her öge "sırada"dır. Platform başına günde en fazla 1 yeni video (İstanbul saatiyle).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ANIM = path.join(ROOT, 'animasyonlar');
const CSV = path.join(ROOT, 'yayinlar.csv');
const PLATFORMLAR = ['youtube', 'instagram', 'tiktok'];
const TZ = 'Europe/Istanbul';

const [cmd = 'durum', ...rest] = process.argv.slice(2);
const flags = new Set(), opts = {}, pos = [];
for (let i = 0; i < rest.length; i++) {
  const a = rest[i];
  if (!a.startsWith('--')) pos.push(a);
  else if (['--tarih', '--not'].includes(a)) opts[a.slice(2)] = rest[++i];
  else flags.add(a);
}

// ---------- CSV (tırnak destekli) ----------
function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => x !== ''));
}
const esc = v => /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
function readCsv() {
  const [head, ...rows] = parseCsv(fs.readFileSync(CSV, 'utf8'));
  return { head, rows: rows.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? '']))) };
}
function writeCsv({ head, rows }) {
  fs.writeFileSync(CSV, [head, ...rows.map(r => head.map(h => r[h] ?? ''))].map(r => r.map(esc).join(',')).join('\n') + '\n');
}

// ---------- kuyruk ----------
const bugun = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()); // YYYY-MM-DD
function kuyruk() {
  return fs.readdirSync(ANIM).filter(f => f.endsWith('.yayin.json')).sort().map(f => {
    const j = JSON.parse(fs.readFileSync(path.join(ANIM, f), 'utf8'));
    j.ad ||= f.replace(/\.yayin\.json$/, '');
    j._dosya = path.join(ANIM, f);
    return j;
  });
}
function yayinlanmis(csv, ad, p) {
  const r = csv.rows.find(r => r.ad === ad && r.platform === p && r.url);
  return r ? { url: r.url, tarih: r.tarih } : null;
}
function durum() {
  const csv = readCsv();
  const today = bugun();
  const bugunYayin = Object.fromEntries(PLATFORMLAR.map(p => [p, csv.rows.some(r => r.platform === p && r.tarih === today && r.url)]));
  const now = Date.now();
  const ogeler = kuyruk().map(j => {
    const platformlar = PLATFORMLAR.filter(p => j[p]).map(p => {
      const y = j.yayinlandi?.[p] || yayinlanmis(csv, j.ad, p);
      let d;
      if (y) d = 'yayında';
      else if (!j.onay) d = 'onay bekliyor';
      else if (j.zaman && Date.parse(j.zaman) > now) d = 'zamanı gelmedi';
      else d = 'sırada';
      return { platform: p, durum: d, url: y?.url || null };
    });
    const sure = csv.rows.find(r => r.ad === j.ad && r.sure_sn)?.sure_sn;
    return { ad: j.ad, zaman: j.zaman || null, onay: !!j.onay, sure_sn: sure ? +sure : null,
      youtubeBaslik: j.youtube?.baslik || null, platformlar };
  });
  // Bugün yapılacaklar: her platformda (bugün o platformda yayın yoksa) zamanı en eski "sırada" öge.
  const bugunYapilacak = [];
  for (const p of PLATFORMLAR) {
    if (bugunYayin[p]) continue;
    const aday = ogeler.filter(o => o.platformlar.some(x => x.platform === p && x.durum === 'sırada'))
      .sort((a, b) => (Date.parse(a.zaman || 0) || 0) - (Date.parse(b.zaman || 0) || 0) || a.ad.localeCompare(b.ad))[0];
    if (aday) bugunYapilacak.push({ ad: aday.ad, platform: p });
  }
  return { bugun: today, bugunYayinVar: bugunYayin, bugunYapilacak, ogeler };
}

function run(cmdline, args) {
  console.log('\n$ ' + [cmdline, ...args].join(' '));
  const r = spawnSync(cmdline, args, { cwd: ROOT, stdio: 'inherit', env: process.env });
  if (r.status !== 0) { console.error(`✗ başarısız: ${cmdline} ${args.join(' ')}`); process.exit(r.status || 1); }
}
const yeni = (a, b) => fs.existsSync(a) && fs.existsSync(b) && fs.statSync(a).mtimeMs >= fs.statSync(b).mtimeMs;

function hazirla(ad) {
  const html = path.join(ANIM, ad + '.html');
  const j = kuyruk().find(x => x.ad === ad);
  if (!fs.existsSync(html)) { console.error('✗ yok: ' + html); process.exit(1); }
  const out = path.join(ROOT, 'out', ad);
  const voice = path.join(ANIM, ad + '.voice.json');
  if (fs.existsSync(voice) && !fs.existsSync(path.join(ROOT, 'ses', ad, 'voice.wav'))) run('npm', ['run', 'tts', '--', voice]);
  const mp4 = path.join(out, ad + '.mp4');
  if (!yeni(mp4, html) || flags.has('--yeniden')) {
    run('npm', ['run', 'check', '--', html]);
    run('npm', ['run', 'render', '--', html]);
  } else console.log('✓ render güncel: ' + path.relative(ROOT, mp4));
  let son = mp4;
  const kapakJson = path.join(ANIM, ad + '.kapak.json');
  if (j?.kapak && fs.existsSync(kapakJson)) {
    const kapakli = path.join(out, ad + '-kapakli.mp4');
    if (!yeni(kapakli, mp4) || !yeni(kapakli, kapakJson)) run('npm', ['run', 'kapak', '--', kapakJson, '--sec', j.kapak]);
    son = kapakli;
  }
  if (!fs.existsSync(son)) { console.error('✗ çıktı yok: ' + son); process.exit(1); }
  const info = { ad, dosya: son, boyut: fs.statSync(son).size, mime: 'video/mp4' };
  fs.writeFileSync(path.join(out, 'yukle.json'), JSON.stringify(info, null, 2));
  console.log('\nYÜKLENECEK ' + JSON.stringify(info));
}

function kaydet(ad, platform, url) {
  if (!PLATFORMLAR.includes(platform) || !/^https?:\/\//.test(url || '')) {
    console.error('Kullanım: npm run yayin -- kaydet <ad> <youtube|instagram|tiktok> <url>'); process.exit(1);
  }
  const tarih = opts.tarih || bugun();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tarih)) { console.error('✗ --tarih YYYY-MM-DD olmalı'); process.exit(1); }
  const j = kuyruk().find(x => x.ad === ad);
  if (j) {
    const { _dosya, ...veri } = j;
    veri.yayinlandi = { ...(veri.yayinlandi || {}), [platform]: { url, tarih } };
    fs.writeFileSync(_dosya, JSON.stringify(veri, null, 2) + '\n');
  }
  const csv = readCsv();
  let row = csv.rows.find(r => r.ad === ad && r.platform === platform);
  if (!row) row = csv.rows.find(r => r.ad === ad && !r.platform);
  if (!row) {
    const ornek = csv.rows.find(r => r.ad === ad) || {};
    row = Object.fromEntries(csv.head.map(h => [h, ['ad', 'sure_sn', 'kanca_turu', 'yapi'].includes(h) ? (ornek[h] || '') : '']));
    row.ad = ad;
    // Aynı bölümün son satırının hemen arkasına ekle (dosya bölüm sırasında kalsın).
    const son = csv.rows.map(r => r.ad).lastIndexOf(ad);
    csv.rows.splice(son >= 0 ? son + 1 : csv.rows.length, 0, row);
  }
  row.platform = platform; row.tarih = tarih; row.url = url;
  const not = 'otomatik yayın' + (platform === 'instagram' && j?.instagram?.aiEtiketi ? '; AI etiketi açık' : '') + (j?.kapak ? `; kapak: ${j.kapak}` : '');
  if (opts.not) row.notlar = [row.notlar, opts.not].filter(Boolean).join('; ');
  else if (!row.notlar) row.notlar = not;
  writeCsv(csv);
  console.log(`✓ kaydedildi: ${ad} · ${platform} · ${tarih} · ${url}`);
}

if (cmd === 'durum') {
  const d = durum();
  if (flags.has('--json')) { console.log(JSON.stringify(d, null, 2)); process.exit(0); }
  console.log(`Bugün (${d.bugun}, İstanbul)`);
  for (const p of PLATFORMLAR) console.log(`  ${p.padEnd(9)} ${d.bugunYayinVar[p] ? 'bugün zaten yayın var' : 'boş'}`);
  console.log('\nBugün yayınlanacak:' + (d.bugunYapilacak.length ? '' : ' (yok)'));
  for (const x of d.bugunYapilacak) console.log(`  → ${x.ad} · ${x.platform}`);
  console.log('\nKuyruk:');
  for (const o of d.ogeler) {
    console.log(`  ${o.ad}${o.zaman ? ' · ' + o.zaman : ''}${o.onay ? '' : ' · ONAYSIZ'}`);
    for (const p of o.platformlar) console.log(`      ${p.platform.padEnd(9)} ${p.durum}${p.url ? ' ' + p.url : ''}`);
  }
} else if (cmd === 'hazirla') {
  if (!pos[0]) { console.error('Kullanım: npm run yayin -- hazirla <ad>'); process.exit(1); }
  hazirla(pos[0]);
} else if (cmd === 'kaydet') {
  kaydet(pos[0], pos[1], pos[2]);
} else {
  console.error('Komutlar: durum [--json] · hazirla <ad> [--yeniden] · kaydet <ad> <platform> <url>');
  process.exit(1);
}
