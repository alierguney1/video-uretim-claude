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
if (meta.loadedFonts > 0) ok(`${meta.loadedFonts} yazı tipi yüzü yüklendi`);
else if (fontFamilies.size > 0) warn('Web yazı tipleri yüklenemedi (sistem yedek fontu kullanılıyor)');

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

  // Farklı deflate blokları aynı piksel görüntüsünü verebileceğinden gerekirse çözülmüş RGBA piksellerini karşılaştır
  const framesEqual = async (p, a, b) => {
    if (a.equals(b)) return true;
    return p.evaluate(async ([ba, bb]) => {
      const decode = b64 => new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => {
          const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
          const x = c.getContext('2d'); x.drawImage(im, 0, 0);
          const raw = x.getImageData(0, 0, im.width, im.height).data;
          res(new Uint32Array(raw.buffer, raw.byteOffset, raw.byteLength >>> 2));
        };
        im.onerror = rej;
        im.src = 'data:image/png;base64,' + b64;
      });
      const [pa, pb] = await Promise.all([decode(ba), decode(bb)]);
      if (pa.length !== pb.length) return false;
      for (let i = 0; i < pa.length; i++) if (pa[i] !== pb[i]) return false;
      return true;
    }, [a.toString('base64'), b.toString('base64')]);
  };

  // Determinizm: ileri sırayla, sonra geri sırayla aynı kareler mi?
  const fwd = [];
  for (const t of T) fwd.push(await frameAt(page, meta, t));
  const bad = [];
  for (let i = T.length - 1; i >= 0; i--) {
    const again = await frameAt(page, meta, T[i]);
    if (!(await framesEqual(page, again, fwd[i]))) bad.push(fmtT(T[i]));
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
  let viaUrl = cur ? Buffer.from(cur.split(',')[1], 'base64')
    : await single.page.screenshot({ clip: { x: 0, y: 0, width: meta.width, height: meta.height } });
  let viaSet = await frameAt(page, meta, tq);
  if (!(await framesEqual(page, viaUrl, viaSet))) {
    // Yükleme zamanlaması (geç gelen font alt kümesi vb.) yanıltmasın: bekle, iki tarafı yeniden oku
    await new Promise(r => setTimeout(r, 1000));
    const again = await single.page.evaluate(t => { window.__setTime(t); const cs = document.querySelectorAll('canvas'); return cs.length === 1 ? cs[0].toDataURL('image/png') : null; }, tq);
    if (again) viaUrl = Buffer.from(again.split(',')[1], 'base64');
    viaSet = await frameAt(page, meta, tq);
  }
  if (!(await framesEqual(page, viaUrl, viaSet))) warn(`?t=${tq} ile açılan kare __setTime(${tq}) ile aynı değil. URL parametresi destekleniyor mu?`);
  else ok('?t= tek kare desteği');
  await single.close();

  // Kanca: ilk 0.3 sn'de ekranda bir şey hareket ediyor mu?
  const f0 = fwd[0], f03 = await frameAt(page, meta, Math.min(0.3, d));
  if (await framesEqual(page, f0, f03)) warn('İlk 0.3 sn tamamen durağan. Dikey videolarda ilk kare kapaktır: 0. saniyede hareket olsun.');
  else ok('ilk 0.3 sn içinde hareket var');

  // Ölü zaman: 10 fps örnekle, 0.7 sn'den uzun tamamen aynı kalan aralıkları bul
  const step = 0.1;
  const dead = await page.evaluate(({ d, step, w, h }) => {
    const cs = document.querySelectorAll('canvas');
    const c = cs.length === 1 ? cs[0] : null;
    const r = c && c.getBoundingClientRect();
    const ctx2d = c && Math.round(r.width) === w && Math.round(r.height) === h ? c.getContext('2d') : null;
    if (!ctx2d) return null;
    const samePixels = (a, b) => {
      if (!a || a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
      return true;
    };
    const intervals = [];
    let prev = null, runStart = 0, idx = 0;
    for (let t = 0; t <= d + 1e-9; t += step, idx++) {
      window.__setTime(Math.min(d, t));
      const raw = ctx2d.getImageData(0, 0, c.width, c.height).data;
      const data = new Uint32Array(raw.buffer, raw.byteOffset, raw.byteLength >>> 2);
      if (idx > 0 && !samePixels(prev, data)) {
        const len = (idx - 1 - runStart) * step;
        if (len > 0.7 + 1e-6) intervals.push(`${(runStart * step).toFixed(1)}–${((idx - 1) * step).toFixed(1)} sn`);
        runStart = idx;
      }
      if (!prev) prev = new Uint32Array(data.length);
      prev.set(data);
    }
    const tailLen = (idx - 1 - runStart) * step;
    if (tailLen > 0.7 + 1e-6) intervals.push(`${(runStart * step).toFixed(1)}–${((idx - 1) * step).toFixed(1)} sn`);
    return intervals;
  }, { d, step, w: meta.width, h: meta.height });

  let deadList = dead;
  if (deadList === null) {
    const frames = [];
    for (let t = 0; t <= d + 1e-9; t += step) frames.push(await frameAt(page, meta, Math.min(t, d)));
    deadList = [];
    let runStart = 0;
    for (let i = 1; i <= frames.length; i++) {
      if (i < frames.length && frames[i].equals(frames[i - 1])) continue;
      const len = (i - 1 - runStart) * step;
      if (len > 0.7 + 1e-6) deadList.push(`${(runStart * step).toFixed(1)}–${((i - 1) * step).toFixed(1)} sn`);
      runStart = i;
    }
  }
  if (deadList.length) warn(`Ölü zaman (>0.7 sn durağan): ${deadList.join(', ')}. Bilinçli durgunluk değilse hareket ya da ara ödül ekle.`);
  else ok('ölü zaman yok (>0.7 sn durağan an bulunmadı)');

  const cover = await page.evaluate(() => window.__cover);
  if (typeof cover !== 'number') warn('window.__cover yok: render kapak için 0. kareyi kullanacak.');
  else ok(`kapak karesi ${cover} sn`);

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
