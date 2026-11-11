// hys-09 "81 ili plaka sırasıyla gezsen" — doğrulama hesabı. Bağımlılık yok.
// Girdi: veri/hys-09/iller.topo.json içindeki il merkezleri (Natural Earth 1:10m + 9 il GeoNames).
// Mesafe: büyük daire (kuşuçuşu), R = 6371,0088 km (d3.geoDistance ile aynı). Yol mesafesi DEĞİL.
// Akıllı rota: açık yol, her ilden başlayan en yakın komşu + 2-opt + or-opt. Kanıtlanmış en kısa değil,
// "bulduğumuz en kısa"; deterministik (aynı girdi → aynı rota).
//
//   node tools/hys-09-plaka.mjs   → tablo + veri/hys-09/plaka.json
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIR = path.join(ROOT, 'veri/hys-09');
const R = 6371.0088, RAD = Math.PI / 180, DUNYA_CEVRE = 40075.017; // ekvator çevresi, WGS84

// Plaka kodu sırası (01–81)
const PLAKA = ('Adana Adıyaman Afyonkarahisar Ağrı Amasya Ankara Antalya Artvin Aydın Balıkesir Bilecik Bingöl Bitlis Bolu ' +
  'Burdur Bursa Çanakkale Çankırı Çorum Denizli Diyarbakır Edirne Elazığ Erzincan Erzurum Eskişehir Gaziantep Giresun ' +
  'Gümüşhane Hakkari Hatay Isparta Mersin İstanbul İzmir Kars Kastamonu Kayseri Kırklareli Kırşehir Kocaeli Konya Kütahya ' +
  'Malatya Manisa Kahramanmaraş Mardin Muğla Muş Nevşehir Niğde Ordu Rize Sakarya Samsun Siirt Sinop Sivas Tekirdağ Tokat ' +
  'Trabzon Tunceli Şanlıurfa Uşak Van Yozgat Zonguldak Aksaray Bayburt Karaman Kırıkkale Batman Şırnak Bartın Ardahan Iğdır ' +
  'Yalova Karabük Kilis Osmaniye Düzce').split(' ');

const topo = JSON.parse(fs.readFileSync(path.join(DIR, 'iller.topo.json'), 'utf8'));
const M = new Map(topo.objects.iller.geometries.map(g => [g.properties.ad, g.properties.merkez]));
if (PLAKA.length !== 81 || PLAKA.some(p => !M.has(p))) throw new Error('il listesi eşleşmiyor');
const P = PLAKA.map(ad => M.get(ad));

function km([lo1, la1], [lo2, la2]) {
  const h = Math.sin((la2 - la1) * RAD / 2) ** 2 + Math.cos(la1 * RAD) * Math.cos(la2 * RAD) * Math.sin((lo2 - lo1) * RAD / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
const D = P.map(a => P.map(b => km(a, b)));
const len = o => o.slice(1).reduce((s, v, i) => s + D[o[i]][v], 0);

// ── akıllı rota ──
function twoOpt(o) {
  for (let imp = true; imp;) {
    imp = false;
    for (let i = 0; i < o.length - 1; i++) for (let k = i + 1; k < o.length; k++) {
      const a = o[i - 1], b = o[i], c = o[k], d = o[k + 1];
      const eski = (a != null ? D[a][b] : 0) + (d != null ? D[c][d] : 0);
      const yeni = (a != null ? D[a][c] : 0) + (d != null ? D[b][d] : 0);
      if (yeni < eski - 1e-9) { o.splice(i, k - i + 1, ...o.slice(i, k + 1).reverse()); imp = true; }
    }
  }
  return o;
}
function orOpt(o) {               // 1–3 illik parçayı başka yere taşı
  for (let imp = true; imp;) {
    imp = false;
    for (let L = 1; L <= 3 && !imp; L++) for (let i = 0; i + L <= o.length && !imp; i++) {
      const seg = o.slice(i, i + L), rest = o.slice(0, i).concat(o.slice(i + L));
      const base = len(o);
      for (let j = 0; j <= rest.length; j++) for (const s of [seg, seg.slice().reverse()]) {
        const c = rest.slice(0, j).concat(s, rest.slice(j));
        if (len(c) < base - 1e-9) { o.splice(0, o.length, ...c); imp = true; break; }
      }
    }
  }
  return o;
}
let en = null;
for (let s = 0; s < 81; s++) {
  const kalan = new Set(PLAKA.keys()); kalan.delete(s);
  const o = [s];
  while (kalan.size) { const l = o.at(-1); let m = -1; for (const j of kalan) if (m < 0 || D[l][j] < D[l][m]) m = j; o.push(m); kalan.delete(m); }
  orOpt(twoOpt(o)); twoOpt(o);
  const L = len(o);
  if (!en || L < en.L - 1e-9) en = { o, L };
}

// ── plaka sırası ──
const plakaSira = [...PLAKA.keys()];
const plakaL = len(plakaSira);
let birikim = 0, cevreGecis = null;
const adimlar = plakaSira.slice(1).map((v, i) => {
  const d = D[i][v]; birikim += d;
  if (!cevreGecis && birikim > DUNYA_CEVRE) cevreGecis = { plaka: v + 1, il: PLAKA[v], km: Math.round(birikim) };
  return { den: i + 1, ye: v + 1, km: Math.round(d), toplam: Math.round(birikim) };
});
const sicrama = adimlar.slice().sort((a, b) => b.km - a.km);
const durak = new Map(en.o.map((v, i) => [v, i + 1]));

const tr = n => Math.round(n).toLocaleString('tr-TR');
const pz = n => String(n).padStart(2, '0');
console.log(`Plaka sırasıyla (01→81): ${tr(plakaL)} km · Dünya çevresi ${tr(DUNYA_CEVRE)} km · oran ${(plakaL / DUNYA_CEVRE).toFixed(2)}`);
console.log(`Çevreyi geçtiği an: ${pz(cevreGecis.plaka)} ${cevreGecis.il} (${tr(cevreGecis.km)} km)`);
console.log(`Akıllı rota (bulduğumuz en kısa): ${tr(en.L)} km · plaka sırası ${(plakaL / en.L).toFixed(2)} kat uzun`);
console.log(`Başlangıç ${PLAKA[en.o[0]]}, bitiş ${PLAKA[en.o.at(-1)]}`);
console.log('En uzun 5 sıçrama:', sicrama.slice(0, 5).map(s => `${pz(s.den)} ${PLAKA[s.den - 1]} → ${pz(s.ye)} ${PLAKA[s.ye - 1]} ${tr(s.km)} km`).join(' · '));
console.log('En kısa 3 sıçrama:', sicrama.slice(-3).map(s => `${pz(s.den)} ${PLAKA[s.den - 1]} → ${pz(s.ye)} ${PLAKA[s.ye - 1]} ${tr(s.km)} km`).join(' · '));
console.log('\nAkıllı rota:', en.o.map(v => `${pz(v + 1)}`).join(' '));

fs.writeFileSync(path.join(DIR, 'plaka.json'), JSON.stringify({
  yontem: 'kuşuçuşu, il merkezi; akıllı rota: en yakın komşu + 2-opt + or-opt, açık yol',
  plakaKm: Math.round(plakaL), dunyaCevreKm: Math.round(DUNYA_CEVRE), akilliKm: Math.round(en.L),
  kat: +(plakaL / en.L).toFixed(2), cevreGecis,
  akilliRota: en.o.map(v => v + 1),
  iller: PLAKA.map((ad, i) => ({ plaka: i + 1, il: ad, durak: durak.get(i), merkez: M.get(ad) })),
  adimlar,
}, null, 1));
console.log('→ veri/hys-09/plaka.json');
