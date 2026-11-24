#!/usr/bin/env node
// hys-16-plaka-nufus: plakalar nüfus sırasıyla dağıtılsaydı.
// Girdi: veri/hys-16/nufus-2025.json (TÜİK ADNKS 2025, iki kaynakla karşılaştırılmış)
// Çıktı: veri/hys-16/plaka-nufus.js (window.PLAKA_NUFUS) + .json
// Kural: en kalabalık il 01, en az nüfuslu il 81. Eşitlik yok (81 nüfus birbirinden farklı).
import fs from 'node:fs';

const src = JSON.parse(fs.readFileSync('veri/hys-16/nufus-2025.json', 'utf8'));
const iller = src.iller.map(i => ({ ...i }));
if (iller.length !== 81) throw new Error('81 il bekleniyordu');
if (new Set(iller.map(i => i.plaka)).size !== 81) throw new Error('plaka tekrarı');
if (new Set(iller.map(i => i.nufus)).size !== 81) throw new Error('nüfus eşitliği: kural belirsiz');

iller.sort((a, b) => b.nufus - a.nufus).forEach((i, n) => { i.yeni = n + 1; i.fark = i.plaka - i.yeni; });
const byPlaka = Object.fromEntries(iller.map(i => [i.plaka, i]));
// yeni plakanın eski sahibi (Adana 07 = Antalya'nın eski plakası)
iller.forEach(i => { i.eskiSahibi = byPlaka[i.yeni].ad; });

// alfabe kuralı (önceki bölümle karşılaştırma): bugünkü adların Türkçe alfabe sırası
const alfa = [...iller].sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
alfa.forEach((i, n) => { i.alfa = n + 1; });

const koruyan = iller.filter(i => i.fark === 0).map(i => i.ad);
const alfaKoruyan = alfa.filter(i => i.alfa === i.plaka).map(i => i.ad);
const enCokYukselen = [...iller].sort((a, b) => b.fark - a.fark)[0];
const enCokDusen = [...iller].sort((a, b) => a.fark - b.fark)[0];

const out = {
  kaynak: src.kaynak, toplam: src.toplam,
  koruyan, alfaKoruyan,
  enCokYukselen: enCokYukselen.ad, enCokDusen: enCokDusen.ad,
  ortMutlakFark: iller.reduce((s, i) => s + Math.abs(i.fark), 0) / 81,
  tekHaneliEski: iller.filter(i => i.plaka <= 9).map(i => i.ad),
  tekHaneliYeni: iller.filter(i => i.yeni <= 9).map(i => i.ad),
  iller: iller.map(({ ad, plaka, nufus, yeni, fark, eskiSahibi, alfa }) => ({ ad, plaka, nufus, yeni, fark, eskiSahibi, alfa })),
};
fs.writeFileSync('veri/hys-16/plaka-nufus.json', JSON.stringify(out, null, 1));
fs.writeFileSync('veri/hys-16/plaka-nufus.js', '// ÜRETİLDİ: node tools/hys-16-plaka-nufus.mjs\nwindow.PLAKA_NUFUS = ' + JSON.stringify(out) + ';\n');

const f2 = n => String(n).padStart(2, '0');
console.log('koruyan (nüfus):', koruyan.length, koruyan);
console.log('koruyan (alfabe):', alfaKoruyan.length, alfaKoruyan);
console.log('en çok yükselen:', enCokYukselen.ad, f2(enCokYukselen.plaka), '→', f2(enCokYukselen.yeni), '(' + enCokYukselen.fark + ')');
console.log('en çok düşen:', enCokDusen.ad, f2(enCokDusen.plaka), '→', f2(enCokDusen.yeni), '(' + enCokDusen.fark + ')');
for (const i of iller.slice(0, 10)) console.log(f2(i.yeni), i.ad.padEnd(12), 'eski', f2(i.plaka), '· plaka eskiden', i.eskiSahibi);
console.log('...', iller.slice(-3).map(i => f2(i.yeni) + ' ' + i.ad + ' (eski ' + f2(i.plaka) + ')').join(' · '));
