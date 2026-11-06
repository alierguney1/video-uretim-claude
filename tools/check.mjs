#!/usr/bin/env node
// Sözleşme denetimi. Kullanım: npm run check -- animasyonlar/ad.html
// Hata (✗) varsa çıkış kodu 1. Uyarılar (!) render'ı engellemez ama bakılmalı.
import fs from 'node:fs';
import { parseArgs, resolveInput, openAnimation, frameAt, fmtT } from './lib.mjs';

const args = parseArgs();
const file = resolveInput(args._[0]);
const src = fs.readFileSync(file, 'utf8');

const errors = [], warns = [], oks = [];
const err = m => errors.push(m), warn = m => warns.push(m), ok = m => oks.push(m);

// ── Statik denetim ──
const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1'); // yorumları at
const lineOf = re => { const m = re.exec(code); return m ? code.slice(0, m.index).split('\n').length : null; };

if (/Math\.random\s*\(/.test(code)) err(`Math.random kullanılmış (satır ~${lineOf(/Math\.random\s*\(/)}). Tohumlu üreteç kullan.`);
else ok('Math.random yok');
if (/Date\.now\s*\(|new Date\s*\(/.test(code)) warn('Date.now / new Date var: çizim saate bağlıysa draw(t) saf olmaz.');
if (/setInterval\s*\(/.test(code)) warn('setInterval var: animasyon durumu zamanlayıcıyla ilerliyorsa kare kare render bozulur.');
const fontFamilies = new Set([...src.matchAll(/family=([^:&"']+)/g)].map(m => m[1]));
if (fontFamilies.size > 2) warn(`${fontFamilies.size} yazı tipi yükleniyor (kural: en fazla 2).`);

// ── Çalışma zamanı denetimi ──
const anim = await openAnimation(file);
const { page, meta } = anim;
if (!meta.hasSetTime) err('window.__setTime(t) yok.'); else ok('window.__setTime var');
if (!(meta.duration > 0)) err('window.__duration yok ya da 0.'); else ok(`süre ${meta.duration} sn`);
if (!meta.fps) warn('window.__fps yok (render 60 fps varsayacak).');
if (!meta.scenes) warn('window.__scenes yok (kontak sayfası eşit aralıklı kare alacak).');

if (meta.hasSetTime && meta.duration > 0) try {
  const d = meta.duration;
  const T = [0, d * 0.23, d * 0.51, d * 0.77, Math.max(0, d - 1 / (meta.fps || 60))];

  // Tüm kareleri yakalamadan çiz: herhangi bir karede hata (negatif yarıçap, NaN vb.) var mı?
  const sweep = await page.evaluate(({ d, fps }) => {
    const bad = [];
    for (let i = 0, n = Math.round(d * fps); i <= n; i++) {
      try { window.__setTime(Math.min(d, i / fps)); }
      catch (e) { bad.push({ t: i / fps, m: e.message }); if (bad.length >= 5) break; }
    }
    return bad;
  }, { d, fps: meta.fps || 60 });
  if (sweep.length) err('Şu karelerde çizim hatası: ' + sweep.map(b => `${b.t.toFixed(2)} sn (${b.m})`).join('; '));
  else ok(`tüm ${Math.round(d * (meta.fps || 60)) + 1} kare hatasız çiziliyor`);

  // Determinizm: ileri sırayla, sonra geri sırayla aynı kareler mi?
  const fwd = [];
  for (const t of T) fwd.push(await frameAt(page, meta, t));
  const bad = [];
  for (let i = T.length - 1; i >= 0; i--) {
    const again = await frameAt(page, meta, T[i]);
    if (!again.equals(fwd[i])) bad.push(fmtT(T[i]));
  }
  if (bad.length) err(`Determinizm bozuk: aynı t farklı kare veriyor (${bad.join(', ')}). Biriken durum ya da tohumsuz rastgelelik var.`);
  else ok('determinizm: aynı t → aynı kare (sıra fark etmiyor)');

  // ?t= tek kare kontrolü
  const tq = +(d * 0.51).toFixed(3);
  const single = await openAnimation(file, { query: `t=${tq}`, browser: anim.browser });
  // Zamanı ellemeden o anki kareyi oku
  const cur = await single.page.evaluate(() => {
    const cs = document.querySelectorAll('canvas');
    return cs.length === 1 ? cs[0].toDataURL('image/png') : null;
  });
  const viaUrl = cur ? Buffer.from(cur.split(',')[1], 'base64')
    : await single.page.screenshot({ clip: { x: 0, y: 0, width: meta.width, height: meta.height } });
  const viaSet = await frameAt(page, meta, tq);
  if (!viaUrl.equals(viaSet)) warn(`?t=${tq} ile açılan kare __setTime(${tq}) ile aynı değil. URL parametresi destekleniyor mu?`);
  else ok('?t= tek kare desteği');
  await single.close();

  // Kanca: ilk 0.3 sn'de ekranda bir şey hareket ediyor mu?
  const f0 = fwd[0], f03 = await frameAt(page, meta, Math.min(0.3, d));
  if (f0.equals(f03)) warn('İlk 0.3 sn tamamen durağan. Dikey videolarda ilk kare kapaktır: 0. saniyede hareket olsun.');
  else ok('ilk 0.3 sn içinde hareket var');

  // Boş kare: sıkıştırılmış PNG çok küçükse ekran büyük ihtimalle düz renk
  const tiny = T.filter((t, i) => fwd[i].length < 4000).map(fmtT);
  if (tiny.length) warn(`Neredeyse boş görünen kareler: ${tiny.join(', ')}`);

  // Dikey format için güvenli alan hatırlatması
  if (meta.height > meta.width) ok(`dikey ${meta.width}x${meta.height} — güvenli alanı kontak sayfasında kontrol et`);
} catch (e) {
  err('Çizim sırasında hata: ' + e.message.split('\n').slice(0, 2).join(' | '));
}

if (meta.errors.length) err('Sayfa hataları:\n    ' + [...new Set(meta.errors)].join('\n    '));
await anim.close();

for (const m of oks) console.log('  ✓ ' + m);
for (const m of warns) console.log('  ! ' + m);
for (const m of errors) console.log('  ✗ ' + m);
console.log(errors.length ? `\n${errors.length} hata, ${warns.length} uyarı.` : `\nSözleşme temiz (${warns.length} uyarı).`);
process.exit(errors.length ? 1 : 0);
