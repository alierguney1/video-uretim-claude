// hys-12-bati: 81 il merkezinde gün batımı (UTC+3) ve Gökçeada İncirburnu'na göre fark (durdur-bul listesi).
// Girdi: lib/iller.js (il merkezleri NE + GeoNames). Çıktı: veri/hys-12/gun-batimi.json
// Güneş: NOAA Solar Calculator (Meeus) algoritması, kırılma dahil (-0,833°), dakika hassasiyeti. Tarih argümanla: node tools/hys-12-bati.mjs 2026-11-16
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../lib/iller.js', import.meta.url), 'utf8');
const window = {}; new Function('window', src)(window);
const [y, m, d] = (process.argv[2] || '2026-11-16').split('-').map(Number);
const R = Math.PI / 180;
// NOAA Solar Calculator (Meeus) algoritması: Julian yüzyılı, denklem zamanı, sapma; kırılma dahil (90,833°).
function batim(lat, lon) {
  const jd = Date.UTC(y, m - 1, d, 12) / 864e5 + 2440587.5;
  const hesap = (jdx) => {
    const T = (jdx - 2451545) / 36525;
    const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
    const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
    const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
    const C = Math.sin(M * R) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * M * R) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * R) * 0.000289;
    const om = 125.04 - 1934.136 * T, lam = L0 + C - 0.00569 - 0.00478 * Math.sin(om * R);
    const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60, eps = eps0 + 0.00256 * Math.cos(om * R);
    const dec = Math.asin(Math.sin(eps * R) * Math.sin(lam * R));
    const yv = Math.tan(eps * R / 2) ** 2;
    const eot = 4 / R * (yv * Math.sin(2 * L0 * R) - 2 * e * Math.sin(M * R) + 4 * e * yv * Math.sin(M * R) * Math.cos(2 * L0 * R) - 0.5 * yv * yv * Math.sin(4 * L0 * R) - 1.25 * e * e * Math.sin(2 * M * R));
    const ha = Math.acos(Math.cos(90.833 * R) / (Math.cos(lat * R) * Math.cos(dec)) - Math.tan(lat * R) * Math.tan(dec)) / R;
    return 720 - 4 * lon - eot + 4 * ha;                 // dakika, UTC
  };
  let t = hesap(jd);                                      // ilk tahmin öğlene göre, sonra batış anında yeniden hesapla
  t = hesap(jd - 0.5 + t / 1440);
  return t + 180;                                         // UTC+3
}
const UC = { gokceada: [40.125, 25.6656], enez: [40.7292, 26.0358], babakale: [39.4797, 26.0633], dilucu: [39.65, 44.817] };
const ref = batim(...UC.gokceada);
const saat = x => { const r = Math.round(x); return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, "0")}`; };
const iller = window.ILLER.topo.objects.iller.geometries.map(g => {
  const [lon, lat] = g.properties.merkez, b = batim(lat, lon);
  return [g.properties.ad, saat(b), Math.round(ref) - Math.round(b)];          // fark: Gökçeada'dan kaç dk önce
}).sort((a, b) => b[2] - a[2] || a[0].localeCompare(b[0], "tr"));
const uclar = Object.fromEntries(Object.entries(UC).map(([k, v]) => [k, saat(batim(...v))]));
fs.writeFileSync(new URL('../veri/hys-12/gun-batimi.json', import.meta.url), JSON.stringify({ tarih: `${y}-${m}-${d}`, uclar, iller }));
console.log(`${y}-${m}-${d}`, uclar, '\nilk 5:', JSON.stringify(iller.slice(0, 5)), '\nson 5:', JSON.stringify(iller.slice(-5)));
