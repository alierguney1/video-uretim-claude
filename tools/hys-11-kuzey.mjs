// hys-11-kuzey: 81 ilin en kuzey noktası ve aynı enlemdeki tanınmış dünya şehri (durdur-bul listesi).
// Girdi: lib/iller.js (NE 1:10m il sınırları). Çıktı: veri/hys-11/kuzey-ikizler.json
// NE 1:10m genelleştirilmiş: Kırklareli'nin kuzey ucu 42,092 çıkıyor, Sinop'unki 42,099.
// Gerçek değerler (Vikipedi "Türkiye'nin uç noktaları"): Kofçaz sınırı ~42,106, İnceburun ~42,098 → elle düzeltilir.
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../lib/iller.js', import.meta.url), 'utf8');
const window = {}; new Function('window', src)(window);
const tp = window.ILLER.topo, tr = tp.transform;
const arcs = tp.arcs.map(a => { let x = 0, y = 0; return a.map(p => { x += p[0]; y += p[1]; return [x * tr.scale[0] + tr.translate[0], y * tr.scale[1] + tr.translate[1]]; }); });
const pts = i => i < 0 ? arcs[~i] : arcs[i];
const DUZELT = { 'Kırklareli': [27.241, 42.106], 'Sinop': [34.948, 42.0988] };
// tanınmış şehirler (Wikipedia koordinatları)
const S = [['Boston',42.3601,'us'],['Üsküp',41.9973,'mk'],['Roma',41.9028,'it'],['Chicago',41.8781,'us'],['Tiflis',41.7151,'ge'],
  ['Barselona',41.3874,'es'],['Tiran',41.3275,'al'],['Taşkent',41.2995,'uz'],['Napoli',40.8518,'it'],['New York',40.7128,'us'],
  ['Madrid',40.4168,'es'],['Bakü',40.4093,'az'],['Erivan',40.1872,'am'],['Philadelphia',39.9526,'us'],['Pekin',39.9042,'cn'],
  ['Pyongyang',39.0392,'kp'],['Washington',38.9072,'us'],['Lizbon',38.7223,'pt'],['Duşanbe',38.5598,'tj'],['Palermo',38.1157,'it'],
  ['Atina',37.9838,'gr'],['Aşkabat',37.9601,'tm'],['San Francisco',37.7749,'us'],['Seul',37.5665,'kr'],['Sevilla',37.3891,'es'],
  ['Tunus',36.8065,'tn'],['Cezayir',36.7538,'dz'],['Las Vegas',36.1699,'us'],['Valletta',35.8989,'mt'],['Tahran',35.6892,'ir'],['Tokyo',35.6762,'jp']];
const KM = 6371.0088 * Math.PI / 180;
const out = tp.objects.iller.geometries.map(g => {
  let mx = [0, -90];
  const walk = a => Array.isArray(a) ? a.forEach(walk) : pts(a).forEach(p => { if (p[1] > mx[1]) mx = p; });
  walk(g.arcs);
  const ad = g.properties.ad, p = DUZELT[ad] || mx;
  let b = null; for (const s of S) { const d = Math.abs(s[1] - p[1]) * KM; if (!b || d < b[3]) b = [s[0], s[2], s[1], d]; }
  return [ad, +p[1].toFixed(3), b[0], b[1], +b[3].toFixed(1), b[2] < p[1] ? 'g' : 'k'];   // g: şehir ilin kuzey ucunun güneyinde
}).sort((a, b) => b[1] - a[1]);
fs.writeFileSync(new URL('../veri/hys-11/kuzey-ikizler.json', import.meta.url), JSON.stringify(out));
console.log(out.length, 'il; en kuzey 3:', JSON.stringify(out.slice(0, 3)), '; en uzak eş:', JSON.stringify(out.reduce((a, b) => b[4] > a[4] ? b : a)));
