#!/usr/bin/env node
// Kapak (thumbnail) üretici. Rehber: promptlar/12-kapak.md
// Kullanım:
//   npm run kapak -- animasyonlar/<ad>.kapak.json            → tüm varyantlar + önizleme
//   npm run kapak -- animasyonlar/<ad>.kapak.json --sec ufuk  → seçilen varyantı videonun 0. karesine gömer
// Çıktı: out/<ad>/kapak-<varyant>.png, out/<ad>/kapak-onizleme.png, (--sec ile) out/<ad>/<ad>-kapakli.mp4
//
// Spec (JSON, koordinatlar 1080x1920 kare pikseli):
// { "kaynak": "hys-10-anamur.html",
//   "varyantlar": [{
//     "ad": "ufuk", "tur": "gizem",            // tür: rehberdeki 6 formülden biri
//     "t": 32.6,                                // animasyonun hangi anı (altyazı ve başlık bandı gizlenir)
//     "zoom": { "x": 700, "y": 900, "olcek": 1.3, "dy": 120 },   // isteğe bağlı: (x,y) etrafında büyüt, sonra dx/dy kaydır
//     "karart": 0.35,                           // isteğe bağlı: arka planı karart (0–1), metin öne çıksın
//     "baslik": ["BU SAHİLDEN", "*KIBRIS* GÖRÜNÜYOR"],  // *kelime* = sarı vurgu. 2–5 kelime, en fazla 3 satır
//     "baslikY": 330, "boyut": 150,             // isteğe bağlı
//     "alt": "Türkiye'de bir ilçe",             // isteğe bağlı küçük ikinci satır (en fazla 5 kelime)
//     "altY": 1450,
//     "oklar":   [{ "x": 820, "y": 760, "aci": 135, "boy": 220 }],   // ucu (x,y)'yi gösterir; aci: okun geldiği yön (derece, 0 = sağdan)
//     "halkalar":[{ "x": 820, "y": 760, "r": 90 }],
//     "emoji":   [{ "ad": "thinking-face", "x": 900, "y": 1250, "boyut": 170, "aci": -8 }],  // lib/ikon-seti.js adları
//     "bayraklar":[{ "kod": "cy", "x": 820, "y": 640, "h": 110, "aci": 6 }],
//     "etiketler":[{ "metin": "121 km", "x": 600, "y": 980, "boyut": 64 }]   // sayı/etiket rozeti
//   }]
// }
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs, resolveInput, outDir, openAnimation, frameAt, loadPlaywright } from './lib.mjs';

const args = parseArgs();
const specFile = resolveInput(args._[0]);
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
const anim = path.resolve(path.dirname(specFile), spec.kaynak);
const name = path.basename(anim, path.extname(anim));
const dir = outDir(anim, args.out);
const W = 1080, H = 1920;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SETI = fs.readFileSync(path.join(ROOT, 'lib/ikon-seti.js'), 'utf8');

const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const a = await openAnimation(anim, { browser, query: 'nocap&nohead' });

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const up = s => s.toLocaleUpperCase('tr');
const vurgu = s => esc(up(s)).replace(/\*([^*]+)\*/g, '<b>$1</b>');

function html(v, bg) {
  const z = v.zoom || { x: W / 2, y: H / 2, olcek: 1 };
  const bt = v.baslik || [], boyut = v.boyut || (bt.some(l => l.replace(/\*/g, '').length > 11) ? 132 : 158);
  const ok = o => {
    const L = o.boy || 220, w = 46;
    return `<svg style="position:absolute;left:${o.x}px;top:${o.y}px;overflow:visible;transform:rotate(${o.aci ?? 135}deg);transform-origin:0 0" width="1" height="1">
      <g transform="translate(0,0)"><path d="M0 0 L${w * 1.6} ${-w * 1.3} L${w * 1.6} ${-w * .45} L${L} ${-w * .45} L${L} ${w * .45} L${w * 1.6} ${w * .45} L${w * 1.6} ${w * 1.3} Z"
      fill="#FF2D2D" stroke="#fff" stroke-width="10" stroke-linejoin="round" paint-order="stroke" style="filter:drop-shadow(0 8px 10px rgba(0,0,0,.55))"/></g></svg>`;
  };
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@800;900&display=block" rel="stylesheet">
<style>
  html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#0B141B}
  #bg{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:${z.x}px ${z.y}px;transform:translate(${z.dx || 0}px,${z.dy || 0}px) scale(${z.olcek || 1})}
  .k{position:absolute;inset:0;background:rgba(5,10,14,${v.karart ?? 0})}
  .g{position:absolute;left:0;right:0;top:0;height:${(v.baslikY ?? 300) + bt.length * boyut * 1.02 + 160}px;background:linear-gradient(rgba(5,10,14,.82) 0%,rgba(5,10,14,.6) 65%,rgba(5,10,14,0) 100%)}
  .bas{position:absolute;left:70px;right:70px;top:${v.baslikY ?? 300}px;font-family:Anton,Impact,sans-serif;font-size:${boyut}px;line-height:1.02;color:#fff;
       text-shadow:9.0px 0.0px 0 #000,8.3px 3.4px 0 #000,6.4px 6.4px 0 #000,3.4px 8.3px 0 #000,0.0px 9.0px 0 #000,-3.4px 8.3px 0 #000,-6.4px 6.4px 0 #000,-8.3px 3.4px 0 #000,-9.0px 0.0px 0 #000,-8.3px -3.4px 0 #000,-6.4px -6.4px 0 #000,-3.4px -8.3px 0 #000,-0.0px -9.0px 0 #000,3.4px -8.3px 0 #000,6.4px -6.4px 0 #000,8.3px -3.4px 0 #000,0 14px 0 #000,0 20px 34px rgba(0,0,0,.6);letter-spacing:1px;text-align:${v.hiza || 'left'}}
  .bas b{color:#FFD23F;font-weight:400}
  .alt{position:absolute;left:70px;right:70px;top:${v.altY ?? 1450}px;font-family:Inter;font-weight:900;font-size:${v.altBoyut || 64}px;line-height:1.1;color:#fff;
       text-shadow:6.0px 0.0px 0 #000,5.5px 2.3px 0 #000,4.2px 4.2px 0 #000,2.3px 5.5px 0 #000,0.0px 6.0px 0 #000,-2.3px 5.5px 0 #000,-4.2px 4.2px 0 #000,-5.5px 2.3px 0 #000,-6.0px 0.0px 0 #000,-5.5px -2.3px 0 #000,-4.2px -4.2px 0 #000,-2.3px -5.5px 0 #000,-0.0px -6.0px 0 #000,2.3px -5.5px 0 #000,4.2px -4.2px 0 #000,5.5px -2.3px 0 #000,0 9px 0 #000;text-align:${v.hiza || 'left'}}
  .alt b{color:#FFD23F}
  .h{position:absolute;border:14px solid #FF2D2D;border-radius:50%;box-shadow:0 0 0 6px #fff,0 8px 20px rgba(0,0,0,.5)}
  .e{position:absolute;filter:drop-shadow(0 10px 14px rgba(0,0,0,.5))}
  .f{position:absolute;border:8px solid #fff;border-radius:10px;box-shadow:0 10px 18px rgba(0,0,0,.5)}
  .r{position:absolute;transform:translate(-50%,-50%);font-family:Anton;font-size:64px;color:#000;background:#FFD23F;padding:4px 22px;border-radius:14px;
     border:6px solid #000;box-shadow:0 8px 0 #000}
</style></head><body>
<img id="bg" src="${bg}"><div class="k"></div><div class="g"></div>
${(v.halkalar || []).map(h => `<div class="h" style="left:${h.x - h.r}px;top:${h.y - h.r}px;width:${2 * h.r - 28}px;height:${2 * h.r - 28}px"></div>`).join('')}
${(v.bayraklar || []).map(b => `<img class="f" data-flag="${b.kod}" style="left:${b.x}px;top:${b.y}px;height:${b.h || 110}px;transform:translate(-50%,-50%) rotate(${b.aci || 0}deg)">`).join('')}
${(v.etiketler || []).map(e => `<div class="r" style="left:${e.x}px;top:${e.y}px;font-size:${e.boyut || 64}px">${esc(e.metin)}</div>`).join('')}
${(v.oklar || []).map(ok).join('')}
${(v.emoji || []).map(e => `<img class="e" data-emoji="${e.ad}" style="left:${e.x}px;top:${e.y}px;width:${e.boyut || 170}px;transform:translate(-50%,-50%) rotate(${e.aci || 0}deg)">`).join('')}
<div class="bas">${bt.map(vurgu).join('<br>')}</div>
${v.alt ? `<div class="alt">${esc(v.alt).replace(/\*([^*]+)\*/g, '<b>$1</b>')}</div>` : ''}
<script>${SETI}
(() => {
const svg = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
document.querySelectorAll('[data-emoji]').forEach(i => { const s = IKON_SETI.emoji[i.dataset.emoji]; if (!s) throw new Error('emoji yok: ' + i.dataset.emoji); i.src = svg(s); });
document.querySelectorAll('[data-flag]').forEach(i => { const s = IKON_SETI.bayrak[i.dataset.flag]; if (!s) throw new Error('bayrak yok: ' + i.dataset.flag); i.src = svg(s); });
})();
</script></body></html>`;
}

const ctx = await browser.newContext({ viewport: { width: W, height: H } });
const shots = [];
for (const v of spec.varyantlar) {
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const frame = await frameAt(a.page, a.meta, v.t);
  await page.setContent(html(v, 'data:image/png;base64,' + frame.toString('base64')), { waitUntil: 'load' });
  await page.evaluate(async () => { await document.fonts.load('150px Anton', 'İŞĞÜÖÇ'); await document.fonts.load('900 64px Inter', 'İŞĞışğ'); await document.fonts.ready; });
  if (errs.length) { console.error('✗ ' + v.ad + ': ' + errs.join('; ')); process.exit(1); }
  const out = path.join(dir, `kapak-${v.ad}.png`);
  fs.writeFileSync(out, await page.screenshot({ type: 'png' }));
  shots.push({ v, out });
  await page.close();
  console.log('  ✓ ' + out);
}

// Önizleme: her varyant için tam kapak · IG ızgarası (3:4) · TikTok ızgarası (3:4) · YouTube arama (16:9, yanlar bulanık) · %25 boyut (telefonda raf)
const b64 = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const row = ({ v, out }) => {
  const s = b64(out);
  return `<div class="row"><div class="lab">${esc(v.ad)} · ${esc(v.tur || '')}</div>
  <figure><img src="${s}" style="width:270px"><figcaption>tam 9:16</figcaption></figure>
  <figure><div style="width:270px;height:360px;overflow:hidden;position:relative"><img src="${s}" style="width:270px;position:absolute;top:-60px"></div><figcaption>IG / TikTok ızgarası 3:4</figcaption></figure>
  <figure><div style="width:480px;height:270px;overflow:hidden;position:relative;background:#000"><img src="${s}" style="position:absolute;left:-20px;top:-200px;width:520px;filter:blur(18px) brightness(.6)"><img src="${s}" style="position:absolute;left:164px;top:0;height:270px"></div><figcaption>YouTube arama/öneri 16:9</figcaption></figure>
  <figure><div style="display:flex;gap:6px"><img src="${s}" style="width:96px"><div style="width:96px;height:170px;background:#333"></div><div style="width:96px;height:170px;background:#333"></div></div><figcaption>kanal rafı (küçük)</figcaption></figure>
  <figure><div style="padding:14px;background:#fff"><img src="${s}" style="width:96px"></div><figcaption>açık tema</figcaption></figure></div>`;
};
const page = await ctx.newPage();
await page.setViewportSize({ width: 1900, height: 100 });
await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:20px;background:#181818;color:#ddd;font:16px Inter,sans-serif}
 .row{display:flex;gap:22px;align-items:flex-start;margin-bottom:28px;flex-wrap:wrap}.lab{width:100%;font-weight:800;font-size:20px}
 figure{margin:0}figcaption{font-size:13px;color:#999;margin-top:6px}</style>
 <h2 style="margin:0 0 16px">${esc(name)} · kapak önizlemesi</h2>${shots.map(row).join('')}`);
const sheet = path.join(dir, 'kapak-onizleme.png');
fs.writeFileSync(sheet, await page.screenshot({ fullPage: true, type: 'png' }));
console.log('Önizleme: ' + sheet + '\nŞimdi Read ile aç: %25 boyutta okunuyor mu, 1 saniyede tek fikir mi, ızgarada başlık kesiliyor mu?');

// --sec: seçilen kapağı videonun 0. karesine göm (süre ve ses değişmez). YouTube/TikTok kare seçicide ilk kare seçilebilir.
if (args.sec) {
  const s = shots.find(x => x.v.ad === args.sec);
  const mp4 = path.join(dir, `${name}.mp4`);
  if (!s || !fs.existsSync(mp4)) { console.error('✗ --sec için varyant ya da ' + mp4 + ' yok (önce render).'); process.exit(1); }
  const outv = path.join(dir, `${name}-kapakli.mp4`);
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-i', s.out, '-filter_complex', "[0:v][1:v]overlay=0:0:enable='eq(n,0)'",
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-c:a', 'copy', '-movflags', '+faststart', outv], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(1);
  console.log('Kapaklı video: ' + outv);
}
await browser.close();
