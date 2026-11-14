// hys-12-bati: 81 il merkezinde gün batımı (UTC+3) ve Gökçeada İncirburnu'na göre fark (durdur-bul listesi).
// Girdi: lib/iller.js (il merkezleri NE + GeoNames). Çıktı: veri/hys-12/gun-batimi.json
// Güneş: NOAA yaklaşık formülü (kırılma dahil, -0,833°), dakika hassasiyeti. Tarih argümanla: node tools/hys-12-bati.mjs 2026-11-16
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../lib/iller.js', import.meta.url), 'utf8');
const window = {}; new Function('window', src)(window);
const [y, m, d] = (process.argv[2] || '2026-11-16').split('-').map(Number);
const R = Math.PI / 180;
function batim(lat, lon) {
  const N = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 1)) / 864e5) + 1;
  const g = 2 * Math.PI / 365 * (N - 1 + 0.5);
  const eot = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const ha = Math.acos(Math.cos(90.833 * R) / (Math.cos(lat * R) * Math.cos(dec)) - Math.tan(lat * R) * Math.tan(dec)) / R;
  return 720 - 4 * lon - eot + 180 + 4 * ha;      // dakika, UTC+3
}
const UC = { gokceada: [40.125, 25.6656], enez: [40.7292, 26.0358], babakale: [39.4792, 26.0642], dilucu: [39.65, 44.817] };
const ref = batim(...UC.gokceada);
const saat = x => `${Math.floor(x / 60)}:${String(Math.round(x % 60)).padStart(2, '0')}`;
const iller = window.ILLER.topo.objects.iller.geometries.map(g => {
  const [lon, lat] = g.properties.merkez, b = batim(lat, lon);
  return [g.properties.ad, saat(b), Math.round(ref - b)];          // fark: Gökçeada'dan kaç dk önce
}).sort((a, b) => b[2] - a[2]);
const uclar = Object.fromEntries(Object.entries(UC).map(([k, v]) => [k, saat(batim(...v))]));
fs.writeFileSync(new URL('../veri/hys-12/gun-batimi.json', import.meta.url), JSON.stringify({ tarih: `${y}-${m}-${d}`, uclar, iller }));
console.log(`${y}-${m}-${d}`, uclar, '\nilk 5:', JSON.stringify(iller.slice(0, 5)), '\nson 5:', JSON.stringify(iller.slice(-5)));
