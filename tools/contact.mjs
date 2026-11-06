#!/usr/bin/env node
// Kontak sayfası: her sahnenin başı/ortası/sonu + her geçişin ortası + kapak ve son kare.
// Kullanım: npm run contact -- animasyonlar/ad.html [--times 0,1.5,3] [--cols 6] [--no-guides]
// Çıktı: out/<ad>/contact.png (+ tek tek kareler out/<ad>/contact/)
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, resolveInput, outDir, openAnimation, frameAt, requireContract } from './lib.mjs';

const args = parseArgs();
const file = resolveInput(args._[0]);
const dir = outDir(file, args.out);
const anim = await openAnimation(file);
const { page, meta } = anim;
requireContract(meta);

const d = meta.duration, eps = 1 / (meta.fps || 60);
let shots = [];
if (args.times) {
  shots = String(args.times).split(',').map(Number).map(t => ({ t, label: '' }));
} else if (meta.scenes?.length) {
  shots.push({ t: 0, label: 'KAPAK' });
  meta.scenes.forEach((s, i) => {
    const len = s.end - s.start;
    shots.push({ t: s.start + len * 0.15, label: `${s.name} · baş` });
    shots.push({ t: s.start + len * 0.5, label: `${s.name} · orta` });
    shots.push({ t: s.end - len * 0.1, label: `${s.name} · son` });
    if (i < meta.scenes.length - 1) shots.push({ t: s.end, label: `geçiş ${i + 1}→${i + 2}` });
  });
  shots.push({ t: d - eps, label: 'SON KARE' });
} else {
  const n = 12;
  for (let i = 0; i < n; i++) shots.push({ t: (d - eps) * i / (n - 1), label: '' });
}
shots = shots.filter(s => s.t >= 0 && s.t <= d).sort((a, b) => a.t - b.t);

const framesDir = path.join(dir, 'contact');
fs.mkdirSync(framesDir, { recursive: true });
const imgs = [];
for (const s of shots) {
  const buf = await frameAt(page, meta, s.t);
  const name = `t${s.t.toFixed(2).padStart(6, '0')}.png`;
  fs.writeFileSync(path.join(framesDir, name), buf);
  imgs.push({ ...s, b64: buf.toString('base64'), frame: Math.round(s.t * (meta.fps || 60)) });
}

// Izgara sayfası: güvenli alan katmanı araçtan çizilir (her animasyonda çalışsın diye)
const vertical = meta.height > meta.width;
const cols = +args.cols || (vertical ? 6 : 4);
const thumbW = vertical ? 300 : 460, thumbH = Math.round(thumbW * meta.height / meta.width);
const guides = !args['no-guides'] && vertical;
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:24px;background:#1b1b1b;color:#ddd;font:13px/1.3 ui-monospace,Menlo,monospace}
h1{font-size:15px;margin:0 0 16px;color:#fff}
.g{display:grid;grid-template-columns:repeat(${cols},${thumbW}px);gap:18px 14px}
.c{position:relative;width:${thumbW}px}
.c img{display:block;width:${thumbW}px;height:${thumbH}px;outline:1px solid #333}
.c .s{position:absolute;left:0;top:0;width:${thumbW}px;height:${thumbH}px;pointer-events:none}
.s .top{position:absolute;left:0;right:0;top:0;height:12%;background:rgba(255,0,80,.18);border-bottom:1px dashed rgba(255,0,80,.8)}
.s .bot{position:absolute;left:0;right:0;bottom:0;height:20%;background:rgba(255,0,80,.18);border-top:1px dashed rgba(255,0,80,.8)}
.s .rgt{position:absolute;top:12%;bottom:20%;right:0;width:12%;background:rgba(255,0,80,.10);border-left:1px dashed rgba(255,0,80,.6)}
.l{margin-top:6px;display:flex;justify-content:space-between;gap:8px}.l b{color:#fff;font-weight:600}
</style><h1>${path.basename(file)} · ${meta.width}x${meta.height} · ${meta.fps || 60} fps · ${d} sn${guides ? ' · kırmızı = güvenli alan dışı' : ''}</h1>
<div class="g">${imgs.map(i => `<div class="c"><img src="data:image/png;base64,${i.b64}">${guides ? '<div class="s"><div class="top"></div><div class="bot"></div><div class="rgt"></div></div>' : ''}
<div class="l"><b>${i.t.toFixed(2)} sn</b><span>kare ${i.frame}</span></div><div>${i.label}</div></div>`).join('')}</div>`;

const sheet = await anim.browser.newPage({ viewport: { width: 48 + cols * thumbW + (cols - 1) * 14, height: 400 } });
await sheet.setContent(html);
await sheet.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
const out = path.join(dir, 'contact.png');
await sheet.screenshot({ path: out, fullPage: true });
await sheet.close();
await anim.close();
console.log(`Kontak sayfası: ${out} (${imgs.length} kare)`);
console.log('Şimdi incele: taşan yazı, çakışma, okunmayan metin, güvenli alan dışı öğe, kopuk geçiş.');
