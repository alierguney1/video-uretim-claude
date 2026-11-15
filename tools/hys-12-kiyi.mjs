// hys-12-bati: yakın plan kıyılar için Natural Earth 1:10m ülke sınırları (Türkiye + Yunanistan + Bulgaristan).
// world-atlas 50m Bozcaada'yı göstermiyor, il dosyası (lib/iller.js) çok sadeleştirilmiş; bu yüzden ayrı katman.
// Girdi: ne_10m_admin_0_countries.geojson (github.com/nvkelso/natural-earth-vector, kamu malı) — yol argümanla.
// Çıktı: veri/hys-12/kiyi.js → window.KIYI = { Turkey: Feature, Greece: Feature, Bulgaria: Feature }
import fs from 'node:fs';
const src = process.argv[2] || '/tmp/claude-0/ne12/a0.geojson';
const A = JSON.parse(fs.readFileSync(src, 'utf8'));
const r4 = v => Math.round(v * 1e4) / 1e4;
const out = {};
for (const ad of ['Turkey', 'Greece', 'Bulgaria']) {
  const f = A.features.find(f => f.properties.ADMIN === ad);
  const polys = (f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates])
    .filter(p => ad === 'Turkey' || p[0].some(([x, y]) => x > 19 && x < 30 && y > 36 && y < 43))
    .map(p => p.map(ring => ring.map(([x, y]) => [r4(x), r4(y)])));
  out[ad] = { type: 'Feature', properties: { ad }, geometry: { type: 'MultiPolygon', coordinates: polys } };
}
fs.writeFileSync(new URL('../veri/hys-12/kiyi.js', import.meta.url),
  '// ÜRETİLDİ: node tools/hys-12-kiyi.mjs. Natural Earth 1:10m admin-0 (kamu malı).\nwindow.KIYI = ' + JSON.stringify(out) + ';\n');
console.log(Object.entries(out).map(([k, v]) => k + ' ' + v.geometry.coordinates.length + ' poligon').join(', '));
