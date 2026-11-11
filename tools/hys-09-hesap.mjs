// hys-09 "Ankara'dan çok yabancı bir başkente yakın iller" — doğrulama hesabı.
// Bağımlılık yok. Girdi: veri/hys-09/iller.topo.json (Natural Earth 1:10m il sınırları + il merkezleri),
// veri/hys-09/baskentler.json (Natural Earth 1:10m başkentler). Çıktı: tablo + veri/hys-09/sonuc.json.
//
//   node tools/hys-09-hesap.mjs              # Lefkoşa hariç (ana sayı)
//   node tools/hys-09-hesap.mjs --lefkosa    # Lefkoşa dahil (dürüstlük notu)
//
// Mesafe: büyük daire (haversine), R = 6371,0088 km; d3.geoDistance ile aynı formül.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIR = path.join(ROOT, 'veri/hys-09');
const R = 6371.0088, RAD = Math.PI / 180;
const LEFKOSA = process.argv.includes('--lefkosa');

const TR = {
  Nicosia: 'Lefkoşa', Beirut: 'Beyrut', Bucharest: 'Bükreş', Damascus: 'Şam', Athens: 'Atina', 'Chișinău': 'Kişinev',
  Sofia: 'Sofya', 'Tel Aviv': 'Tel Aviv', Amman: 'Amman', Jerusalem: 'Kudüs', Skopje: 'Üsküp', Yerevan: 'Erivan',
  Tbilisi: 'Tiflis', Pristina: 'Priştine', Cairo: 'Kahire', Tirana: 'Tiran', Belgrade: 'Belgrad', Baghdad: 'Bağdat',
  Baku: 'Bakü', Budapest: 'Budapeşte', Tehran: 'Tahran', Kyiv: 'Kiev',
};
const trAd = c => TR[c.ad] || c.ad;

function km([lo1, la1], [lo2, la2]) {
  const p1 = la1 * RAD, p2 = la2 * RAD, dp = p2 - p1, dl = (lo2 - lo1) * RAD;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// ── TopoJSON çözücü (sadece Polygon / MultiPolygon) ──
const topo = JSON.parse(fs.readFileSync(path.join(DIR, 'iller.topo.json'), 'utf8'));
const { scale: [sx, sy], translate: [tx, ty] } = topo.transform;
const arcs = topo.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => [(x += dx) * sx + tx, (y += dy) * sy + ty]); });
const ring = ids => ids.flatMap((i, n) => { const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; return n ? a.slice(1) : a; });
const polys = g => g.type === 'Polygon' ? [g.arcs.map(ring)] : g.arcs.map(p => p.map(ring));
const iller = topo.objects.iller.geometries.map(g => ({ ...g.properties, polys: polys(g) }));

const caps = JSON.parse(fs.readFileSync(path.join(DIR, 'baskentler.json'), 'utf8'));
const ANKARA = caps.find(c => c.ad === 'Ankara').k;
const yabanci = caps.filter(c => c.ad !== 'Ankara' && (LEFKOSA || c.ad !== 'Nicosia'));
const enYakin = p => yabanci.map(c => ({ ad: trAd(c), km: km(p, c.k) })).sort((a, b) => a.km - b.km);

// ── 1) İl merkezi yöntemi (videonun ana sayısı) ──
const satirlar = iller.filter(i => i.ad !== 'Ankara').map(i => {
  const [b1, b2] = enYakin(i.merkez);
  const ank = km(i.merkez, ANKARA);
  return { il: i.ad, ankaraKm: Math.round(ank), baskent: b1.ad, baskentKm: Math.round(b1.km), farkKm: Math.round(ank - b1.km),
    ikinci: b2.ad, ikinciKm: Math.round(b2.km), kaynak: i.kaynak };
}).sort((a, b) => b.farkKm - a.farkKm);
const boyali = satirlar.filter(s => s.farkKm > 0);

// ── 2) Alan yöntemi: Türkiye yüzölçümünün yüzde kaçı? (0,02° ızgara, cos(enlem) ağırlıklı) ──
function icinde([x, y], rings) {
  let ins = false;
  for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
}
const STEP = 0.02;
let top = 0, yakin = 0;
const bbox = iller.map(i => { const pts = i.polys.flat(2); return [Math.min(...pts.map(p => p[0])), Math.min(...pts.map(p => p[1])), Math.max(...pts.map(p => p[0])), Math.max(...pts.map(p => p[1]))]; });
for (let y = 35.8; y < 42.2; y += STEP) {
  const w = Math.cos(y * RAD);
  for (let x = 25.6; x < 44.9; x += STEP) {
    const k = iller.findIndex((il, n) => x >= bbox[n][0] && x <= bbox[n][2] && y >= bbox[n][1] && y <= bbox[n][3] && il.polys.some(p => icinde([x, y], p)));
    if (k < 0) continue;
    top += w;
    if (enYakin([x, y])[0].km < km([x, y], ANKARA)) yakin += w;
  }
}
const alanYuzde = 100 * yakin / top;

// ── çıktı ──
const pad = (s, n) => String(s).padEnd(n);
console.log(`Lefkoşa ${LEFKOSA ? 'DAHİL' : 'hariç'} · ${boyali.length} / ${satirlar.length} il merkezi Ankara'dan çok yabancı bir başkente yakın`);
console.log(`Alan: Türkiye yüzölçümünün %${alanYuzde.toFixed(1)}'i\n`);
console.log(pad('il', 15) + pad('Ankara', 8) + pad('en yakın yabancı', 22) + pad('fark', 7) + 'ikinci');
for (const s of satirlar) {
  const isaret = s.farkKm > 0 ? (s.farkKm < 30 ? '≈' : '●') : (s.farkKm > -60 ? '·' : ' ');
  console.log(`${isaret} ${pad(s.il, 13)}${pad(s.ankaraKm, 8)}${pad(`${s.baskent} ${s.baskentKm}`, 22)}${pad(s.farkKm, 7)}${s.ikinci} ${s.ikinciKm}`);
}
const sayac = {};
for (const s of boyali) sayac[s.baskent] = (sayac[s.baskent] || 0) + 1;
console.log('\nBaşkent başına boyalı il:', Object.entries(sayac).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · '));
console.log('● boyalı · ≈ boyalı ama fark < 30 km (kıl payı) · · boyasız ama fark < 60 km');

const out = path.join(DIR, LEFKOSA ? 'sonuc-lefkosa.json' : 'sonuc.json');
fs.writeFileSync(out, JSON.stringify({ lefkosa: LEFKOSA, boyaliSayisi: boyali.length, ilSayisi: satirlar.length,
  alanYuzde: +alanYuzde.toFixed(1), baskentBasina: sayac, iller: satirlar }, null, 1));
console.log('→', path.relative(ROOT, out));
