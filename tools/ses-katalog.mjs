#!/usr/bin/env node
// Ses kütüphanesi kataloğu: ses/kutuphane/ altındaki dosyaları tarar, anlamlı Türkçe adlar verir,
// katalog.json (render), katalog.js (sayfa) ve index.html (dinleme sayfası) üretir.
// Kullanım: npm run sesler            (yeni dosya ekledikten sonra yeniden çalıştır)
// Yeni paket: ses/kutuphane/<paket>/ altına koy, lisans dosyasını yanına ekle, PAKETLER'e yaz.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIR = path.join(ROOT, 'ses', 'kutuphane');

const PAKETLER = {
  'kenney-rpg':     { ad: 'Kenney RPG Audio', lisans: 'CC0-1.0', kaynak: 'https://kenney.nl/assets/rpg-audio', ayna: 'https://github.com/Boyquotes/kenney-rpg-audio-for-godot', icerik: 'kapı, kitap, kumaş, para, bıçak, adım, gıcırtı' },
  'kenney-darbe':   { ad: 'Kenney Impact Sounds', lisans: 'CC0-1.0', kaynak: 'https://kenney.nl/assets/impact-sounds', ayna: 'https://github.com/Boyquotes/kenney-impact-sounds-for-godot', icerik: 'adım (taş, tahta, çimen, kar), metal, tahta, cam, zil, yumruk' },
  'kenney-arayuz':  { ad: 'Kenney Interface Sounds', lisans: 'CC0-1.0', kaynak: 'https://kenney.nl/assets/interface-sounds', ayna: 'https://github.com/Calinou/kenney-interface-sounds', icerik: 'tık, seçim, onay, hata, aç/kapa, kaydır, glitch' },
  'kenney-dijital': { ad: 'Kenney Digital Audio', lisans: 'CC0-1.0', kaynak: 'https://kenney.nl/assets/digital-audio', ayna: 'https://github.com/Boyquotes/kenney-digital-audio-for-godot', icerik: '8-bit güç, lazer, zap, ton' },
};

// anlamlı ad → dosya kalıbı (paket/dosya-adı-öneki). Bir ad birden çok varyant taşır; motor t'den seçer.
const ADLAR = {
  'adim-tas': 'kenney-darbe/footstep_concrete_', 'adim-tahta': 'kenney-darbe/footstep_wood_', 'adim-cimen': 'kenney-darbe/footstep_grass_',
  'adim-kar': 'kenney-darbe/footstep_snow_', 'adim-hali': 'kenney-darbe/footstep_carpet_', 'adim-cizme': 'kenney-rpg/footstep_',
  'kapi-ac': 'kenney-rpg/door_open_', 'kapi-kapa': 'kenney-rpg/door_close_', 'gicirti': 'kenney-rpg/creak_',
  'kitap-ac': 'kenney-rpg/book_open', 'kitap-kapa': 'kenney-rpg/book_close', 'sayfa': 'kenney-rpg/book_flip_', 'kitap-birak': 'kenney-rpg/book_place_',
  'kumas': 'kenney-rpg/cloth_', 'kemer': 'kenney-rpg/belt_handle_', 'para': 'kenney-rpg/handle_coins', 'deri': 'kenney-rpg/handle_small_leather',
  'bicak-cek': 'kenney-rpg/draw_knife_', 'bicak-kes': 'kenney-rpg/knife_slice', 'balta': 'kenney-rpg/chop',
  'metal-klik': 'kenney-rpg/metal_click', 'mandal': 'kenney-rpg/metal_latch', 'tencere': 'kenney-rpg/metal_pot_',
  'zil': 'kenney-darbe/impact_bell_heavy_', 'metal-agir': 'kenney-darbe/impact_metal_heavy_', 'metal-orta': 'kenney-darbe/impact_metal_medium_',
  'metal-hafif': 'kenney-darbe/impact_metal_light_', 'tahta-agir': 'kenney-darbe/impact_wood_heavy_', 'tahta': 'kenney-darbe/impact_wood_medium_',
  'tahta-hafif': 'kenney-darbe/impact_wood_light_', 'kalas': 'kenney-darbe/impact_plank_medium_', 'kazma': 'kenney-darbe/impact_mining_',
  'cam-agir': 'kenney-darbe/impact_glass_heavy_', 'cam': 'kenney-darbe/impact_glass_medium_', 'cam-hafif': 'kenney-darbe/impact_glass_light_',
  'yumruk-agir': 'kenney-darbe/impact_punch_heavy_', 'yumruk': 'kenney-darbe/impact_punch_medium_',
  'yumusak-agir': 'kenney-darbe/impact_soft_heavy_', 'yumusak': 'kenney-darbe/impact_soft_medium_',
  'tabak-agir': 'kenney-darbe/impact_plate_heavy_', 'tabak': 'kenney-darbe/impact_plate_medium_', 'tabak-hafif': 'kenney-darbe/impact_plate_light_',
  'teneke': 'kenney-darbe/impact_tin_medium_', 'vurus-hafif': 'kenney-darbe/impact_generic_light_',
  'tik': 'kenney-arayuz/tick_', 'tikla': 'kenney-arayuz/click_', 'secim': 'kenney-arayuz/select_', 'onay': 'kenney-arayuz/confirmation_',
  'hata': 'kenney-arayuz/error_', 'pencere-ac': 'kenney-arayuz/open_', 'pencere-kapa': 'kenney-arayuz/close_', 'buyut': 'kenney-arayuz/maximize_',
  'kucult': 'kenney-arayuz/minimize_', 'kaydir': 'kenney-arayuz/scroll_', 'damla': 'kenney-arayuz/drop_', 'cinlama': 'kenney-arayuz/glass_',
  'glitch': 'kenney-arayuz/glitch_', 'soru': 'kenney-arayuz/question_', 'cizik': 'kenney-arayuz/scratch_', 'anahtar': 'kenney-arayuz/switch_',
  'pluck': 'kenney-arayuz/pluck_', 'bong': 'kenney-arayuz/bong_', 'geri': 'kenney-arayuz/back_',
  'guc': 'kenney-dijital/power_up_', 'yukselen': 'kenney-dijital/phaser_up_', 'alcalan': 'kenney-dijital/phaser_down_', 'lazer': 'kenney-dijital/laser_',
  'zap': 'kenney-dijital/zap_', 'ton': 'kenney-dijital/tone_', 'iki-ton': 'kenney-dijital/two_tone_', 'uc-ton': 'kenney-dijital/three_tone_',
  'pep': 'kenney-dijital/pep_sound_', 'sicrama': 'kenney-dijital/phase_jump_', 'hurda': 'kenney-dijital/space_trash_',
};

const dur = f => +(+spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).stdout.trim()).toFixed(3);
const sesler = {};
for (const p of fs.readdirSync(DIR).filter(d => fs.statSync(path.join(DIR, d)).isDirectory()).sort()) {
  if (!PAKETLER[p]) console.warn(`  ! ${p}: PAKETLER'de lisans bilgisi yok, atlandı`);
  else for (const f of fs.readdirSync(path.join(DIR, p)).filter(f => /\.(ogg|wav|mp3)$/i.test(f)).sort()) {
    const id = `${p}/${f.replace(/\.\w+$/, '')}`;
    sesler[id] = { dosya: `ses/kutuphane/${p}/${f}`, paket: p, sure: dur(path.join(DIR, p, f)) };
  }
}
const adlar = {};
for (const [ad, onek] of Object.entries(ADLAR)) {
  const ids = Object.keys(sesler).filter(id => id.startsWith(onek) && !id.slice(onek.length).match(/^[a-z]/i));
  if (!ids.length) console.warn(`  ! "${ad}" için dosya bulunamadı (${onek})`); else adlar[ad] = ids;
}
const katalog = { aciklama: 'npm run sesler ile üretilir. Elle düzenleme; tools/ses-katalog.mjs içindeki ADLAR/PAKETLER\'i değiştir.', paketler: PAKETLER, adlar, sesler };
fs.writeFileSync(path.join(DIR, 'katalog.json'), JSON.stringify(katalog, null, 1));
fs.writeFileSync(path.join(DIR, 'katalog.js'), `// npm run sesler ile üretilir\nwindow.SES_KATALOG = ${JSON.stringify({ adlar, sesler })};\n`);

// Dinleme sayfası: kod sentezi + ZzFX ön ayarları + kütüphane adları
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ses kütüphanesi</title>
<style>
:root{--bg:#14111c;--card:#1f1a2b;--ink:#f3e9d2;--mute:#9c93ae;--acc:#e2483d;--gold:#f2b544}
body{margin:0;padding:24px 16px 60px;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,sans-serif}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:28px 0 8px;color:var(--gold)}p{color:var(--mute);margin:4px 0 12px;max-width:760px}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px}
button{all:unset;cursor:pointer;background:var(--card);border:1px solid #2e2740;border-radius:8px;padding:8px 10px;display:flex;justify-content:space-between;gap:8px}
button:hover{border-color:var(--acc)}button b{font-weight:600}button span{color:var(--mute);font:12px ui-monospace,monospace}
code{font:13px ui-monospace,monospace;color:var(--gold)}table{border-collapse:collapse;margin-top:6px}td{padding:4px 10px 4px 0;color:var(--mute);vertical-align:top}td:first-child{color:var(--ink)}
</style></head><body>
<h1>Ses kütüphanesi</h1>
<p>Tıkla, dinle. Olay listesinde (<code>SOUNDS</code>) adıyla kullan. Kurallar: <code>docs/ses-rehberi.md</code>.
Kod sentezi ve ZzFX bizim ürettiğimiz ses (lisans sorunu yok); dosyalar CC0.</p>
<h2>Kod sentezi · <code>{ t, tur: 'darbe' }</code></h2><div class="g" id="gen"></div>
<h2>ZzFX 8-bit · <code>{ t, tur: 'zzfx', ad: 'blip' }</code></h2><div class="g" id="zz"></div>
<h2>Kütüphane · <code>{ t, tur: 'dosya', ad: 'kapi-ac' }</code></h2><p>Bir ad birden çok varyant taşır; motor aynı sesi art arda tekrarlamamak için t'ye göre seçer. Tıklayınca sıradaki varyant çalar.</p><div class="g" id="lib"></div>
<h2>Paketler ve lisans</h2><table>${Object.entries(PAKETLER).map(([k, p]) => `<tr><td>${esc(k)}</td><td>${esc(p.ad)} · ${p.lisans} · ${esc(p.icerik)}<br><a style="color:var(--mute)" href="${p.kaynak}">${p.kaynak}</a></td></tr>`).join('')}</table>
<script src="katalog.js"></script><script src="../../lib/ses.js"></script>
<script>
let ac; const ctx = () => (ac = ac || new AudioContext());
const btn = (el, label, sub, fn) => { const b = document.createElement('button'); b.innerHTML = '<b>' + label + '</b><span>' + sub + '</span>'; b.onclick = fn; document.getElementById(el).append(b); };
const play = s => { const a = ctx(); SES.oynat(a, [{ t: 0, ...s }], 0, {}); };
const GEN = { yukselis: { dur: 1.2 }, darbe: {}, whoosh: {}, ping: {}, ping2: {}, tick: {}, kalp: {}, marti: { kez: 3 }, dalga: { dur: 8 }, ruzgar: { dur: 8 }, yagmur: { dur: 6 }, ates: { dur: 6 }, gerilim: { dur: 5 }, drone: { dur: 4 } };
for (const [k, o] of Object.entries(GEN)) btn('gen', k, o.dur ? o.dur + ' sn' : '', () => play({ tur: k, ...o }));
for (const k of Object.keys(SES.ON_AYAR)) btn('zz', k, 'zzfx', () => play({ tur: 'zzfx', ad: k }));
const turn = {};
for (const [ad, ids] of Object.entries(SES_KATALOG.adlar)) btn('lib', ad, ids.length + ' varyant', () => { turn[ad] = ((turn[ad] ?? -1) + 1) % ids.length; new Audio('../../' + SES_KATALOG.sesler[ids[turn[ad]]].dosya).play(); });
</script></body></html>`;
fs.writeFileSync(path.join(DIR, 'index.html'), html);
console.log(`Katalog: ${Object.keys(sesler).length} dosya, ${Object.keys(adlar).length} ad → ses/kutuphane/katalog.json, katalog.js, index.html`);
