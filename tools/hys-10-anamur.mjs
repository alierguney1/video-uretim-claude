// hys-10 "Anamur" — doğrulama hesabı. Bağımlılık yok.
// Girdi: Natural Earth 1:10m GeoJSON (repo dışında): ne_10m_admin_0_countries, ne_10m_populated_places_simple.
//   İndir: https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
//   NE=/klasör/ node tools/hys-10-anamur.mjs   → tablo + veri/hys-10/anamur.json
// Mesafe: büyük daire (kuşuçuşu), R = 6371,0088 km (d3.geoDistance ile aynı).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const NE = process.env.NE || '/tmp/claude-0/ne/';
const R = 6371.0088, RAD = Math.PI / 180;
const read = f => JSON.parse(fs.readFileSync(path.join(NE, f), 'utf8'));
const A = read('ne_10m_admin_0_countries.geojson').features;
const P = read('ne_10m_populated_places_simple.geojson').features;

const km = ([lo1, la1], [lo2, la2]) => {
  const h = Math.sin((la2 - la1) * RAD / 2) ** 2 + Math.cos(la1 * RAD) * Math.cos(la2 * RAD) * Math.sin((lo2 - lo1) * RAD / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
};
const rings = f => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).flat();
const pts = a3 => rings(A.find(f => f.properties.ADM0_A3 === a3)).flat();
const minBy = (arr, g) => arr.reduce((b, x) => (g(x) < g(b) ? x : b));
const city = (n, cls = '') => P.find(p => p.properties.name === n && p.properties.featurecla.includes(cls)).geometry.coordinates.slice(0, 2);

const TUR = pts('TUR'), CYP = [...pts('CYP'), ...pts('CYN')];   // Kıbrıs: güney + kuzey (KKTC) birlikte
const turGuney = minBy(TUR, p => p[1]);                         // Türkiye'nin en güney noktası
const anadoluGuney = minBy(TUR.filter(p => p[0] < 35.5), p => p[1]); // İskenderun Körfezi'nin batısı = Anadolu yarımadası
const kibrisEnYakin = minBy(CYP, p => km(p, anadoluGuney));
// Türkiye kıyısının Kıbrıs'a en yakın noktası (tüm çiftler, Kıbrıs'ın kuzey yarısı yeter)
const cypN = CYP.filter(p => p[1] > 35.1), turS = TUR.filter(p => p[1] < 36.9 && p[0] > 31 && p[0] < 36.5);
let best = [Infinity];
for (const t of turS) for (const c of cypN) { const d = km(t, c); if (d < best[0]) best = [d, t, c]; }

const ANAMUR = [32.8311, 36.0800];   // Anamur ilçe merkezi (Wikipedia "Anamur": 36°04′48″K 32°49′52″D); NE'de yok
const MERSIN = city('Icel'), ANKARA = city('Ankara', 'Admin-0'), LEFKOSA = city('Nicosia', 'Admin-0'), GIRNE = city('Kyrenia');

// Anamur Burnu'nun enleminden kuzeyde kalan başkentler (Admin-0 capital), Ankara hariç
const lat0 = anadoluGuney[1];
const kuzeyde = P.filter(p => p.properties.featurecla === 'Admin-0 capital' && p.geometry.coordinates[1] > lat0 && p.properties.adm0name !== 'Turkey')
  .map(p => ({ ad: p.properties.name, ulke: p.properties.adm0name, lat: +p.geometry.coordinates[1].toFixed(4), lon: +p.geometry.coordinates[0].toFixed(4) }));
const afrika = ['Tunis', 'Algiers'].map(n => kuzeyde.find(c => c.ad === n));
const guneyde = P.filter(p => p.properties.featurecla === 'Admin-0 capital' && Math.abs(p.geometry.coordinates[1] - lat0) < 0.5)
  .map(p => ({ ad: p.properties.name, lat: +p.geometry.coordinates[1].toFixed(4) })).sort((a, b) => b.lat - a.lat);

// Ufuk: Kıbrıs'ın en yüksek noktası Olimpos (Troodos), 1.952 m — Wikipedia "Mount Olympus (Cyprus)", 34.93639 K 32.86333 D.
// Gözlemci Anamur Burnu kıyısında, göz 2 m. Geometrik ufuk d = √(2Rh); kırılmasız (kötümser) hesap.
const OLIMPOS = [32.86333, 34.93639], H_OL = 1952, H_GOZ = 2;
const ufuk = h => Math.sqrt(2 * R * (h / 1000));               // km
const dOl = km(anadoluGuney, OLIMPOS);
const gizlenen = d => ((Math.max(0, d - ufuk(H_GOZ))) ** 2) / (2 * R) * 1000;   // m, ufkun arkasında kalan yükseklik
const out = {
  turkiyeEnGuney: turGuney, anadoluEnGuney_AnamurBurnu: anadoluGuney,
  enGuneyFarki_km: +(km([turGuney[0], turGuney[1]], [turGuney[0], lat0])).toFixed(1),
  kibris: { anamurBurnu_enYakinKiyi_km: +km(anadoluGuney, kibrisEnYakin).toFixed(1), kiyi: kibrisEnYakin,
            turkiyeKibris_enKisa_km: +best[0].toFixed(1), turkiyeNoktasi: best[1], kibrisNoktasi: best[2] },
  anamur: { mersin_km: +km(ANAMUR, MERSIN).toFixed(1), ankara_km: +km(ANAMUR, ANKARA).toFixed(1),
            lefkosa_km: +km(ANAMUR, LEFKOSA).toFixed(1), girne_km: +km(ANAMUR, GIRNE).toFixed(1),
            kibrisKiyi_km: +km(ANAMUR, minBy(CYP, p => km(p, ANAMUR))).toFixed(1), kibrisKiyi: minBy(CYP, p => km(p, ANAMUR)) },
  enlem: { anamurBurnu: lat0, afrikaBaskentleri: afrika.map(c => ({ ...c, farkKm: +((c.lat - lat0) * 111.2).toFixed(0) })),
           kuzeydeKalanBaskentSayisi: kuzeyde.length, yakinEnlemBaskentler: guneyde },
  ufuk: { olimpos_km: +dOl.toFixed(1), olimposUfuk_km: +ufuk(H_OL).toFixed(1), gozUfuk_km: +ufuk(H_GOZ).toFixed(2),
          gorunurMu: ufuk(H_OL) + ufuk(H_GOZ) > dOl, gizlenen_m: +gizlenen(dOl).toFixed(0), gorunen_m: +(H_OL - gizlenen(dOl)).toFixed(0) },
};
fs.mkdirSync(path.join(ROOT, 'veri/hys-10'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'veri/hys-10/anamur.json'), JSON.stringify({ ...out, kuzeydeKalanBaskentler: kuzeyde }, null, 1));
console.log(JSON.stringify(out, null, 1));

// ── Kapanış (cliffhanger) için: Türkiye'nin en kuzey noktası ve yakın enlemdeki başkentler ──
const turKuzey = TUR.reduce((b, p) => (p[1] > b[1] ? p : b));
const kuzeyAlti = P.filter(p => p.properties.featurecla === 'Admin-0 capital' && p.geometry.coordinates[1] < turKuzey[1] && p.geometry.coordinates[1] > turKuzey[1] - 0.5)
  .map(p => ({ ad: p.properties.name, lat: +p.geometry.coordinates[1].toFixed(4), farkKm: +((turKuzey[1] - p.geometry.coordinates[1]) * 111.2).toFixed(0) }));
console.log('\nTürkiye en kuzey:', turKuzey, '\naltında kalan başkentler (0,5° içinde):', kuzeyAlti);

// ── Durdur-bul karesi: her il merkeziyle en yakın enlemdeki yabancı başkent ──
// İl merkezleri: veri/hys-09/iller.topo.json (PR #1). Yoksa ILLER=yol ile ver.
const IL = process.env.ILLER || path.join(ROOT, 'veri/hys-09/iller.topo.json');
if (fs.existsSync(IL)) {
  const caps = P.filter(p => p.properties.featurecla === 'Admin-0 capital' && p.properties.adm0name !== 'Turkey')
    .map(p => ({ ad: p.properties.name, ulke: p.properties.adm0name, lat: p.geometry.coordinates[1] }));
  const iller = JSON.parse(fs.readFileSync(IL, 'utf8')).objects.iller.geometries.map(g => g.properties);
  const esler = iller.map(il => { const c = minBy(caps, c => Math.abs(c.lat - il.merkez[1]));
    return { il: il.ad, enlem: il.merkez[1], baskent: c.ad, ulke: c.ulke, farkKm: +(Math.abs(c.lat - il.merkez[1]) * 111.2).toFixed(1) }; })
    .sort((a, b) => b.enlem - a.enlem);
  fs.writeFileSync(path.join(ROOT, 'veri/hys-10/enlem-esleri.json'), JSON.stringify(esler, null, 1));
  console.log('\nEnlem eşleri (81 il):');
  for (const e of esler) console.log(`${e.il.padEnd(16)} ${e.enlem.toFixed(2)}  ${e.baskent} (${e.ulke}) ${e.farkKm} km`);
}
