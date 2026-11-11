// hys-09 "Güneş senin ilinde kaçta doğuyor?" — doğrulama hesabı. Bağımlılık yok.
// Girdi: veri/hys-09/iller.topo.json içindeki il merkezleri (Natural Earth 1:10m + 9 il GeoNames).
// Yöntem: NOAA güneş denklemleri (Spencer serisi: zaman denklemi + deklinasyon), ufuk 90,833°
// (kırılma + güneş yarıçapı), deniz seviyesi, TSİ = UTC+3. Doğruluk ±1-2 dk.
//
//   node tools/hys-09-gunes.mjs              # 21 Aralık 2026 (yılın en kısa günü)
//   node tools/hys-09-gunes.mjs 2026-06-21   # başka bir tarih
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIR = path.join(ROOT, 'veri/hys-09');
const TARIH = process.argv[2] || '2026-12-21';
const RAD = Math.PI / 180, TZ = 3;

const d = new Date(TARIH + 'T00:00:00Z');
const doy = Math.round((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 864e5) + 1;
const gun = d.getUTCFullYear() % 4 === 0 ? 366 : 365;
const g = 2 * Math.PI / gun * (doy - 1);
const EQT = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
const DECL = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);

function gunes([lon, lat]) {
  const ha = Math.acos(Math.cos(90.833 * RAD) / (Math.cos(lat * RAD) * Math.cos(DECL)) - Math.tan(lat * RAD) * Math.tan(DECL)) / RAD;
  const ogle = 720 - 4 * lon - EQT + TZ * 60;          // dakika, TSİ
  return { dogus: ogle - 4 * ha, ogle, batis: ogle + 4 * ha };
}
const hm = m => { const r = Math.round(m); return `${String(Math.floor(r / 60)).padStart(2, '0')}:${String(r % 60).padStart(2, '0')}`; };
const sure = m => `${Math.floor(Math.round(m) / 60)} sa ${Math.round(m) % 60} dk`;

const topo = JSON.parse(fs.readFileSync(path.join(DIR, 'iller.topo.json'), 'utf8'));
const iller = topo.objects.iller.geometries.map(x => x.properties).map(p => {
  const s = gunes(p.merkez);
  return { il: p.ad, dogus: hm(s.dogus), ogle: hm(s.ogle), batis: hm(s.batis), gunBoyu: sure(s.batis - s.dogus),
    _d: s.dogus, _b: s.batis, _u: s.batis - s.dogus };
}).sort((a, b) => a.il.localeCompare(b.il, 'tr'));

const by = k => iller.slice().sort((a, b) => a[k] - b[k]);
const [ilkDogan, sonDogan] = [by('_d')[0], by('_d').at(-1)];
const [ilkBatan, sonBatan] = [by('_b')[0], by('_b').at(-1)];
const [kisa, uzun] = [by('_u')[0], by('_u').at(-1)];
console.log(`${TARIH} (yılın ${doy}. günü), TSİ\n`);
console.log(`İlk doğan:  ${ilkDogan.il} ${ilkDogan.dogus} · son doğan: ${sonDogan.il} ${sonDogan.dogus} · fark ${Math.round(sonDogan._d - ilkDogan._d)} dk`);
console.log(`İlk batan:  ${ilkBatan.il} ${ilkBatan.batis} · son batan: ${sonBatan.il} ${sonBatan.batis} · fark ${Math.round(sonBatan._b - ilkBatan._b)} dk`);
console.log(`En kısa gün: ${kisa.il} ${kisa.gunBoyu} · en uzun: ${uzun.il} ${uzun.gunBoyu}\n`);
for (const r of iller) console.log(`${r.il.padEnd(15)}${r.dogus}  ${r.ogle}  ${r.batis}  ${r.gunBoyu}`);

const out = path.join(DIR, `gunes-${TARIH}.json`);
fs.writeFileSync(out, JSON.stringify({ tarih: TARIH, tz: 'UTC+3', yontem: 'NOAA, ufuk 90.833°, deniz seviyesi',
  ilkDogan: [ilkDogan.il, ilkDogan.dogus], sonDogan: [sonDogan.il, sonDogan.dogus],
  ilkBatan: [ilkBatan.il, ilkBatan.batis], sonBatan: [sonBatan.il, sonBatan.batis],
  iller: iller.map(({ _d, _b, _u, ...r }) => r) }, null, 1));
console.log('\n→', path.relative(ROOT, out));
