#!/usr/bin/env node
// İkon seti üretici: lisansı uygun hazır parçaları depoya gömülü JS'e çevirir.
//   lib/ikon-seti.js  → Fluent Emoji Flat (Microsoft, MIT) + flag-icons bayrakları (MIT) + ülke kodu/Türkçe ad
//   lib/iller.js      → veri/iller.topo.json (Natural Earth 1:10m) + her ilin ikon noktası
// Neden gömülü: kareler canvas.toDataURL ile okunuyor; file:// görselleri tuvali "kirletir", data: URL kirletmez.
// Ayrıca CDN'e erişilemeyen ortamda da çalışır.
//
// Kullanım: node tools/ikon-seti.mjs [--bayrak xx,yy] [--emoji ad1,ad2]
// Paketler npm'den bir kez indirilir (.cache/ikon-seti/), sabit sürüm.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { parseArgs } from './lib.mjs';

const args = parseArgs();
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE = path.join(ROOT, '.cache', 'ikon-seti');
const PKGS = {
  emoji: ['@iconify-json/fluent-emoji-flat', '1.2.6'],
  flags: ['flag-icons', '7.6.0'],
  iso: ['i18n-iso-countries', '7.14.0'],
  topo: ['topojson-client', '3.1.0'],
};

function pkgDir([name, ver]) {
  const dir = path.join(CACHE, name.replace('/', '__') + '@' + ver);
  if (!fs.existsSync(path.join(dir, 'package'))) {
    fs.mkdirSync(dir, { recursive: true });
    const tgz = execFileSync('npm', ['pack', `${name}@${ver}`, '--silent'], { cwd: dir }).toString().trim().split('\n').pop();
    execFileSync('tar', ['xzf', tgz], { cwd: dir });
    fs.rmSync(path.join(dir, tgz));
  }
  return path.join(dir, 'package');
}

// Sık kullanılacak bayraklar: komşular, Avrupa, büyük ülkeler, önceki bölümler (Samoa, Tonga, Grönland…)
const FLAGS = ('tr gr bg ge am az ir iq sy cy eg ly tn dz ma it es pt fr de gb ie nl be ch at pl ua ru by ro hu rs ba hr si me mk al xk md ' +
  'cz sk dk se no fi is ee lv lt us ca mx br ar cl co pe ve cu jp cn kr kp in pk af bd id my th vn ph au nz sa ae qa kw bh om ye jo lb il ps ' +
  'kz uz tm kg tj mn ng et ke za ws to fj gl va mc sm li lu mt ad as nc pf aq').split(' ');
// İl ikonları dışında genel amaçlı emoji (dünya videoları, tepkiler)
const EXTRA = ('airplane globe-showing-europe-africa globe-showing-americas globe-showing-asia-australia world-map compass red-question-mark ' +
  'exploding-head eyes fire crown chequered-flag triangular-flag straight-ruler hourglass-done alarm-clock sun-with-face snowflake ' +
  'desert-island volcano polar-bear penguin camel palm-tree ship round-pushpin tear-off-calendar face-with-tears-of-joy thinking-face ' +
  'star-struck face-screaming-in-fear kangaroo moai statue-of-liberty tokyo-tower snowman sun crescent-moon ringed-planet rocket ' +
  'pizza croissant baguette-bread hamburger sushi taco spaghetti kiwi-bird kangaroo bison tiger panda koala elephant').split(' ');

const emojiJson = JSON.parse(fs.readFileSync(path.join(pkgDir(PKGS.emoji), 'icons.json'), 'utf8'));
const flagsDir = path.join(pkgDir(PKGS.flags), 'flags', '4x3');
const isoDir = pkgDir(PKGS.iso);
const codes = JSON.parse(fs.readFileSync(path.join(isoDir, 'codes.json'), 'utf8'));
const trNames = JSON.parse(fs.readFileSync(path.join(isoDir, 'langs', 'tr.json'), 'utf8')).countries;

// İl kataloğundaki f: anahtarlarını topla
const katalog = fs.readFileSync(path.join(ROOT, 'lib', 'ikonlar.js'), 'utf8');
const used = [...katalog.matchAll(/'f:([a-z0-9-]+)'/g)].map(m => m[1]);
const wantEmoji = [...new Set([...used, ...EXTRA, ...String(args.emoji || '').split(',').filter(Boolean)])];
const emoji = {}, missing = [];
for (const k of wantEmoji) {
  const name = emojiJson.icons[k] ? k : emojiJson.aliases?.[k]?.parent;
  const ic = name && emojiJson.icons[name];
  if (!ic) { missing.push(k); continue; }
  const w = ic.width || emojiJson.width || 32, h = ic.height || emojiJson.height || 32;
  emoji[k] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${ic.body}</svg>`;
}
const wantFlags = [...new Set([...FLAGS, ...String(args.bayrak || '').split(',').filter(Boolean)])];
const bayrak = {};
for (const c of wantFlags) {
  const f = path.join(flagsDir, c + '.svg');
  if (!fs.existsSync(f)) { missing.push('bayrak:' + c); continue; }
  bayrak[c] = fs.readFileSync(f, 'utf8').replace(/\s*\n\s*/g, ' ').trim();
}
const ulke = {};
for (const [a2, , num] of codes) ulke[a2.toLowerCase()] = [num, trNames[a2] ? [].concat(trNames[a2])[0] : a2];

const head = `// ÜRETİLDİ: node tools/ikon-seti.mjs — elle düzenleme. Lisanslar:
//   Fluent Emoji Flat © Microsoft Corporation, MIT (github.com/microsoft/fluentui-emoji), @iconify-json/fluent-emoji-flat@${PKGS.emoji[1]}
//   flag-icons © Panayiotis Lipiridis, MIT (github.com/lipis/flag-icons), flag-icons@${PKGS.flags[1]}
//   Ülke kodları ve Türkçe adlar: i18n-iso-countries@${PKGS.iso[1]}, MIT
`;
fs.writeFileSync(path.join(ROOT, 'lib', 'ikon-seti.js'),
  head + 'window.IKON_SETI = ' + JSON.stringify({ emoji, bayrak, ulke }) + ';\n');

// ── İller: topo + ikon noktası (ilin içinde, sınırlara en uzak nokta; merkez kıyıdaysa ikon taşmasın) ──
const require = createRequire(import.meta.url);
const topojson = require(path.join(pkgDir(PKGS.topo), 'dist', 'topojson-client.js'));
const topo = JSON.parse(fs.readFileSync(path.join(ROOT, 'veri', 'iller.topo.json'), 'utf8'));
const feats = topojson.feature(topo, topo.objects.iller).features;
const kx = Math.cos(39 * Math.PI / 180);
function rings(g) { return g.type === 'Polygon' ? [g.coordinates] : g.coordinates; }
function inside(p, polys) {
  let c = false;
  for (const poly of polys) for (const r of poly) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function segDist(p, a, b) {
  const ax = a[0] * kx, ay = a[1], bx = b[0] * kx, by = b[1], px = p[0] * kx, py = p[1];
  const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
  const t = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0;
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
function edgeDist(p, polys) {
  let d = Infinity;
  for (const poly of polys) for (const r of poly) for (let i = 1; i < r.length; i++) d = Math.min(d, segDist(p, r[i - 1], r[i]));
  return d;
}
const nokta = {};
for (const f of feats) {
  const polys = rings(f.geometry);
  let [x0, y0, x1, y1] = [180, 90, -180, -90];
  for (const poly of polys) for (const [x, y] of poly[0]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  let best = null, bestD = -1;
  const N = 60;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
    const p = [x0 + (x1 - x0) * i / N, y0 + (y1 - y0) * j / N];
    if (!inside(p, polys)) continue;
    // merkeze yakınlığı hafifçe ödüllendir: ikon ilin "kalbinde" dursun
    const m = f.properties.merkez, d = edgeDist(p, polys) - .08 * Math.hypot((p[0] - m[0]) * kx, p[1] - m[1]);
    if (d > bestD) { bestD = d; best = p; }
  }
  nokta[f.properties.ad] = best.map(v => +v.toFixed(3));
}
fs.writeFileSync(path.join(ROOT, 'lib', 'iller.js'),
  '// ÜRETİLDİ: node tools/ikon-seti.mjs. İl sınırları Natural Earth 1:10m (kamu malı), il merkezleri NE + GeoNames.\n' +
  '// nokta = ikonun konacağı yer: ilin içinde, sınırlara en uzak nokta.\n' +
  'window.ILLER = ' + JSON.stringify({ topo, nokta }) + ';\n');

const kb = f => (fs.statSync(path.join(ROOT, 'lib', f)).size / 1024).toFixed(0) + ' KB';
console.log(`emoji ${Object.keys(emoji).length}, bayrak ${Object.keys(bayrak).length}, ülke ${Object.keys(ulke).length} → lib/ikon-seti.js (${kb('ikon-seti.js')})`);
console.log(`il ${Object.keys(nokta).length} → lib/iller.js (${kb('iller.js')})`);
if (missing.length) console.log('bulunamadı (atlandı): ' + missing.join(', '));
