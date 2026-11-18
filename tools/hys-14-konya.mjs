// hys-14-konya: "Her yer kuşuçuşu en yakın il merkezine bağlansaydı" (küresel Voronoi Türkiye).
// Kullanım: node tools/hys-14-konya.mjs [adım=0.01]
// Girdi:  veri/hys-14/merkezler.json (GeoNames + Wikidata il merkezleri), veri/hys-14/hgm-alan.json (HGM resmî alan),
//         geoBoundaries TUR ADM1 (indirilir → .cache/hys-14/), veri/iller.topo.json (NE 1:10m, çapraz kontrol).
// Çıktı:  veri/hys-14/konya.json (özet) + veri/hys-14/konya.js (animasyonun okuduğu: alanlar, Voronoi hücreleri, yerler).
// Bağımlılık: d3-geo-voronoi@2.1.0 (repo node_modules kullanmıyor; `npm i d3-geo-voronoi@2.1.0` yapılan klasörün
//   node_modules/x.js yolunu VORONOI_MODULES ortam değişkeniyle ver).
// Yöntem: adım° ızgara, her hücre merkezi en yakın il merkezine (büyük daire) atanır, alan = Σ (adım·R)²·cos φ.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ST = +(process.argv[2] || 0.01);
const R = Math.PI / 180, RK = 6371.0088;
const GB_URL = 'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/TUR/ADM1/geoBoundaries-TUR-ADM1.geojson';
const CACHE = path.join(ROOT, '.cache/hys-14');
fs.mkdirSync(CACHE, { recursive: true });
const gbFile = path.join(CACHE, 'gb-adm1.geojson');
if (!fs.existsSync(gbFile)) {
  const r = await fetch(GB_URL); if (!r.ok) throw new Error('geoBoundaries indirilemedi: ' + r.status);
  fs.writeFileSync(gbFile, Buffer.from(await r.arrayBuffer()));
}
const AD = n => ({ 'Hakkâri': 'Hakkari' }[n] || n);              // repo (lib/iller.js) adlarına eşle
const MZ = JSON.parse(fs.readFileSync(path.join(ROOT, 'veri/hys-14/merkezler.json')));
const HGM = JSON.parse(fs.readFileSync(path.join(ROOT, 'veri/hys-14/hgm-alan.json')));
const gbM = ad => MZ.gn[ad] || MZ.gn[ad === 'Hakkari' ? 'Hakkâri' : ad];
const wdM = ad => MZ.wd[ad] || MZ.wd[ad === 'Hakkâri' ? 'Hakkari' : ad] || gbM(ad);

function loadGB() {
  const d = JSON.parse(fs.readFileSync(gbFile));
  return d.features.map(f => ({ ad: AD(f.properties.shapeName), polys: f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates }));
}
function loadNE() {
  const t = JSON.parse(fs.readFileSync(path.join(ROOT, 'veri/iller.topo.json')));
  const [sx, sy] = t.transform.scale, [tx, ty] = t.transform.translate;
  const arcs = t.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
  const arc = i => i >= 0 ? arcs[i] : arcs[~i].slice().reverse();
  const ring = r => r.flatMap((i, k) => { const a = arc(i); return k ? a.slice(1) : a; });
  return t.objects.iller.geometries.map(g => ({ ad: AD(g.properties.ad), polys: (g.type === 'Polygon' ? [g.arcs] : g.arcs).map(p => p.map(ring)) }));
}
const vec = ([x, y]) => [Math.cos(y * R) * Math.cos(x * R), Math.cos(y * R) * Math.sin(x * R), Math.sin(y * R)];
const km = (a, b) => { const s = Math.sin((b[1] - a[1]) * R / 2) ** 2 + Math.cos(a[1] * R) * Math.cos(b[1] * R) * Math.sin((b[0] - a[0]) * R / 2) ** 2; return 2 * RK * Math.asin(Math.sqrt(s)); };

// ızgara taraması (çift-tek kuralı, satır kesişimleri)
function hesapla(G, merkez) {
  const C = G.map(g => merkez(g.ad).slice(0, 2)), CV = C.map(vec);
  const near = (x, y) => { const v = vec([x, y]); let bi = 0, bd = -2; for (let i = 0; i < CV.length; i++) { const d = v[0] * CV[i][0] + v[1] * CV[i][1] + v[2] * CV[i][2]; if (d > bd) { bd = d; bi = i; } } return bi; };
  const res = G.map(g => ({ ad: g.ad, harita: 0, vor: 0, kalan: 0, kayip: {}, kazanc: {} }));
  for (const [gi, g] of G.entries()) {
    const edges = []; let y0 = 1e9, y1 = -1e9;
    for (const p of g.polys) for (const r of p) for (let i = 0; i < r.length - 1; i++) { edges.push([r[i], r[i + 1]]); y0 = Math.min(y0, r[i][1]); y1 = Math.max(y1, r[i][1]); }
    for (let y = (Math.floor(y0 / ST) + .5) * ST; y <= y1; y += ST) {
      const A = (ST * R * RK) ** 2 * Math.cos(y * R), xs = [];
      for (const [[xa, ya], [xb, yb]] of edges) if ((ya > y) !== (yb > y)) xs.push(xa + (y - ya) * (xb - xa) / (yb - ya));
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) for (let x = (Math.ceil(xs[k] / ST - .5) + .5) * ST; x < xs[k + 1]; x += ST) {
        const bi = near(x, y), o = res[gi];
        o.harita += A; res[bi].vor += A;
        if (bi === gi) o.kalan += A; else { o.kayip[G[bi].ad] = (o.kayip[G[bi].ad] || 0) + A; res[bi].kazanc[g.ad] = (res[bi].kazanc[g.ad] || 0) + A; }
      }
    }
  }
  const sira = k => Object.fromEntries(res.slice().sort((a, b) => b[k] - a[k]).map((r, i) => [r.ad, i + 1]));
  const sv = sira('vor');
  const top = res.reduce((s, r) => s + r.harita, 0), deg = res.reduce((s, r) => s + r.harita - r.kalan, 0);
  res.forEach(r => { r.sVor = sv[r.ad]; });
  return { res, degisenPct: deg / top * 100, C };
}

const GB = loadGB();
const ana = hesapla(GB, gbM);
const capraz = [['gb', 'wd', GB, wdM], ['ne', 'gn', loadNE(), gbM], ['ne', 'wd', null, wdM]].map(([s, m, G, f]) => {
  const r = hesapla(G || loadNE(), f); const by = Object.fromEntries(r.res.map(o => [o.ad, o]));
  return { sinir: s, merkez: m, birinci: r.res.find(o => o.sVor === 1).ad, karaman: Math.round(by.Karaman.vor), konya: Math.round(by.Konya.vor), degisenPct: +r.degisenPct.toFixed(1) };
});

// resmî sıra (HGM)
const hgmAd = Object.fromEntries(Object.entries(HGM.alan).map(([k, v]) => [AD(k), v]));
const sh = Object.fromEntries(Object.entries(hgmAd).sort((a, b) => b[1] - a[1]).map(([k], i) => [k, i + 1]));
const iller = ana.res.map(r => ({
  ad: r.ad, hgm: hgmAd[r.ad], sResmi: sh[r.ad], vor: Math.round(r.vor), sVor: r.sVor, harita: Math.round(r.harita),
  kayipPct: +(100 - r.kalan / r.harita * 100).toFixed(1),
  kayip: Object.fromEntries(Object.entries(r.kayip).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, Math.round(v)])),
  kazanc: Object.fromEntries(Object.entries(r.kazanc).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, Math.round(v)])),
})).sort((a, b) => a.sVor - b.sVor);

// ünlü yerler: resmî il (geoBoundaries poligonu) ve en yakın merkez, iki merkez kümesinde
const inRing = (x, y, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
const ilOf = p => (GB.find(g => g.polys.some(q => inRing(p[0], p[1], q[0]) && !q.slice(1).some(h => inRing(p[0], p[1], h)))) || {}).ad;
const YER = {   // koordinat: GeoNames (S.ANS / T.TRR / P.PPLA3), Wikidata ile ±1 km tutarlı
  'Efes': [27.34083, 37.93972], 'Bergama': [27.18412, 39.13212], 'Hattuşa': [34.61548, 40.01994],
  'Uzungöl': [40.28853, 40.61594], 'Anamur': [32.8, 36.08],
};
const yerler = Object.entries(YER).map(([ad, p]) => {
  const resmi = ilOf(p), mesafe = f => Object.fromEntries(GB.map(g => [g.ad, km(p, f(g.ad))]));
  const dg = mesafe(gbM), dw = mesafe(wdM), yeni = Object.keys(dg).sort((a, b) => dg[a] - dg[b])[0];
  const yeniW = Object.keys(dw).sort((a, b) => dw[a] - dw[b])[0];
  return { ad, p, resmi, yeni, kmResmi: Math.round(dg[resmi]), kmYeni: Math.round(dg[yeni]), wdAyni: yeni === yeniW };
});

// Voronoi hücreleri (çizim için): gerçek 81 merkez + Türkiye'den ~700 km uzakta kukla halka (hücreler yerel kalsın)
const require = createRequire(path.join(CACHE, 'x.js'));
let geoVoronoi;
try { ({ geoVoronoi } = require('d3-geo-voronoi')); } catch (e) {
  ({ geoVoronoi } = createRequire(process.env.VORONOI_MODULES || path.join(ROOT, 'node_modules/x.js'))('d3-geo-voronoi'));
}
const kukla = [];
for (let x = 14; x <= 56; x += 2) kukla.push([x, 26], [x, 52]);
for (let y = 28; y <= 50; y += 2) kukla.push([14, y], [56, y]);
const sites = [...ana.C, ...kukla];
const polys = geoVoronoi(sites).polygons().features.slice(0, ana.C.length);
const yuv = v => Math.round(v * 1000) / 1000;
const sik = ring => {           // kenarları ≤ 0,05° sıklaştır (düz çizim = büyük daire farkı ihmal edilir)
  const out = [];
  for (let i = 0; i < ring.length - 1; i++) { const [a, b] = [ring[i], ring[i + 1]], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / .05)); for (let k = 0; k < n; k++) out.push([yuv(a[0] + (b[0] - a[0]) * k / n), yuv(a[1] + (b[1] - a[1]) * k / n)]); }
  out.push(out[0]); return out;
};
const hucre = Object.fromEntries(polys.map((f, i) => [GB[i].ad, f.geometry.coordinates.map(sik)]));
const merkez = Object.fromEntries(GB.map((g, i) => [g.ad, ana.C[i].map(yuv)]));

const by = Object.fromEntries(iller.map(o => [o.ad, o]));
const ozet = {
  yontem: `${ST}° ızgara, küresel en yakın il merkezi; alan göller dahil harita alanı`,
  kaynak: { sinir: 'geoBoundaries TUR ADM1 (gbOpen)', merkez: MZ.kaynak.gn, resmiAlan: HGM.kaynak },
  degisenPct: +ana.degisenPct.toFixed(1),
  birinci: iller[0].ad, ikinci: iller[1].ad, fark: iller[0].vor - iller[1].vor, farkPct: +((iller[0].vor - iller[1].vor) / iller[1].vor * 100).toFixed(1),
  capraz, yerler,
};
fs.writeFileSync(path.join(ROOT, 'veri/hys-14/konya.json'), JSON.stringify({ ...ozet, iller }, null, 1));
fs.writeFileSync(path.join(ROOT, 'veri/hys-14/konya.js'),
  '// ÜRETİLDİ: node tools/hys-14-konya.mjs — elle düzenleme.\nwindow.KONYA = ' + JSON.stringify({ ...ozet, iller, merkez, hucre }) + ';\n');
console.log(`birinci ${ozet.birinci} ${by[ozet.birinci].vor} · ${ozet.ikinci} ${by[ozet.ikinci].vor} · fark ${ozet.fark} km² (%${ozet.farkPct}) · değişen %${ozet.degisenPct}`);
for (const n of ['Konya', 'Karaman', 'İzmir', 'Uşak', 'Mersin']) { const o = by[n]; console.log(`  ${n}: resmî ${o.hgm} (${o.sResmi}.) → ${o.vor} (${o.sVor}.) kayıp %${o.kayipPct}`); }
console.log('çapraz:', capraz.map(c => `${c.sinir}/${c.merkez}: ${c.birinci} (Kar ${c.karaman} / Kon ${c.konya})`).join(' · '));
console.log('yerler:', yerler.map(y => `${y.ad} ${y.resmi} ${y.kmResmi} → ${y.yeni} ${y.kmYeni}${y.wdAyni ? '' : ' (WD FARKLI!)'}`).join(' · '));
