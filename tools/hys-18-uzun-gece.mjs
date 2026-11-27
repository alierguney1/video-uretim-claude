// hys-18 "21 Aralık: yılın en uzun gecesi" — hesap. Bağımlılık yok.
// Yöntem: hys-09-gunes.mjs ile aynı (NOAA / Spencer serisi, ufuk 90,833°, il merkezi, deniz seviyesi, TSİ).
// Ek: gece süresi (batıştan ertesi doğuşa), en erken batış ve en geç doğuş tarihleri (Kas 2026 – Şub 2027).
//   node tools/hys-18-uzun-gece.mjs → veri/hys-18/uzun-gece.json + uzun-gece.js
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const RAD = Math.PI / 180, TZ = 3;

function sun(dateStr, [lon, lat]) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const y = d.getUTCFullYear(), doy = Math.round((d - Date.UTC(y, 0, 1)) / 864e5) + 1;
  const g = 2 * Math.PI / (y % 4 === 0 ? 366 : 365) * (doy - 1);
  const EQT = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const DECL = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const ha = Math.acos(Math.cos(90.833 * RAD) / (Math.cos(lat * RAD) * Math.cos(DECL)) - Math.tan(lat * RAD) * Math.tan(DECL)) / RAD;
  const ogle = 720 - 4 * lon - EQT + TZ * 60;
  return { dogus: ogle - 4 * ha, batis: ogle + 4 * ha, decl: DECL / RAD, eqt: EQT };
}
const hm = m => { const r = Math.round(m); return `${String(Math.floor(r / 60)).padStart(2, '0')}:${String(r % 60).padStart(2, '0')}`; };
const dur = m => { const r = Math.round(m); return `${Math.floor(r / 60)} sa ${r % 60} dk`; };
const day = (s, n) => { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

const topo = JSON.parse(fs.readFileSync(path.join(ROOT, 'veri/hys-09/iller.topo.json'), 'utf8'));
const GUN = '2026-12-21', ERTESI = day(GUN, 1);
const DATES = Array.from({ length: 100 }, (_, i) => day('2026-11-15', i));
const iller = topo.objects.iller.geometries.map(x => x.properties).map(p => {
  const s = sun(GUN, p.merkez), n = sun(ERTESI, p.merkez);
  const gece = n.dogus + 1440 - s.batis;
  const seri = DATES.map(dt => ({ dt, ...sun(dt, p.merkez) }));
  const geçDog = seri.reduce((a, b) => b.dogus > a.dogus + 1e-9 ? b : a);
  const erkBat = seri.reduce((a, b) => b.batis < a.batis - 1e-9 ? b : a);
  return { il: p.ad, lon: p.merkez[0], lat: p.merkez[1], dogus: hm(s.dogus), batis: hm(s.batis), gece: dur(gece),
    gecDogusTarih: geçDog.dt, gecDogus: hm(geçDog.dogus), erkenBatisTarih: erkBat.dt, erkenBatis: hm(erkBat.batis),
    _d: s.dogus, _b: s.batis, _g: gece, _gd: geçDog.dogus };
}).sort((a, b) => a.il.localeCompare(b.il, 'tr'));
const by = k => iller.slice().sort((a, b) => a[k] - b[k]);
const out = {
  tarih: GUN, tz: 'UTC+3', yontem: 'NOAA (Spencer), ufuk 90.833°, il merkezi, deniz seviyesi; ±2 dk',
  ilkDogan: by('_d')[0].il, sonDogan: by('_d').at(-1).il, dogusFark: Math.round(by('_d').at(-1)._d - by('_d')[0]._d),
  ilkBatan: by('_b')[0].il, sonBatan: by('_b').at(-1).il, batisFark: Math.round(by('_b').at(-1)._b - by('_b')[0]._b),
  enUzunGece: by('_g').at(-1).il, enKisaGece: by('_g')[0].il, geceFark: Math.round(by('_g').at(-1)._g - by('_g')[0]._g),
  iller: iller.map(i => ({ il: i.il, lon: i.lon, lat: i.lat, dogus: i.dogus, batis: i.batis, gece: i.gece,
    dogusDk: +i._d.toFixed(2), batisDk: +i._b.toFixed(2), geceDk: +i._g.toFixed(2),
    gecDogusTarih: i.gecDogusTarih, gecDogus: i.gecDogus, erkenBatisTarih: i.erkenBatisTarih, erkenBatis: i.erkenBatis })),
};
// İstanbul: 1 Aralık – 31 Ocak doğuş/batış eğrisi (tuzak sahnesi)
const IST = topo.objects.iller.geometries.find(x => x.properties.ad === 'İstanbul').properties.merkez;
out.istSeri = Array.from({ length: 62 }, (_, i) => { const dt = day('2026-12-01', i), s = sun(dt, IST); return { dt, d: +s.dogus.toFixed(2), b: +s.batis.toFixed(2) }; });
fs.writeFileSync(path.join(ROOT, 'veri/hys-18/uzun-gece.json'), JSON.stringify(out, null, 1));
fs.writeFileSync(path.join(ROOT, 'veri/hys-18/uzun-gece.js'), '// tools/hys-18-uzun-gece.mjs çıktısı\nwindow.UZUN_GECE = ' + JSON.stringify(out) + ';\n');
const f = n => iller.find(i => i.il === n);
console.log(JSON.stringify({ ...out, iller: undefined }));
for (const n of ['Sinop', 'Hatay', 'Kars', 'Erzurum', 'Ardahan', 'Edirne', 'Hakkari', 'Iğdır', 'İzmir', 'İstanbul', 'Ankara', 'Kırklareli', 'Kilis', 'Mersin', 'Trabzon', 'Van'])
  { const i = f(n); console.log(n.padEnd(11), i.lat.toFixed(2), i.dogus, i.batis, 'gece', i.gece, '| en geç doğuş', i.gecDogusTarih, i.gecDogus, '| en erken batış', i.erkenBatisTarih, i.erkenBatis); }
console.log('gece sırası (uzun→):', by('_g').reverse().slice(0, 6).map(i => i.il + ' ' + i.gece).join(', '), '…', by('_g').slice(0, 3).map(i => i.il + ' ' + i.gece).join(', '));
console.log('geç doğuş tarihleri:', [...new Set(iller.map(i => i.gecDogusTarih))].sort().join(' '), '| erken batış:', [...new Set(iller.map(i => i.erkenBatisTarih))].sort().join(' '));
