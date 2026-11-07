#!/usr/bin/env node
// Seslendirme: Gemini TTS ile her cümleyi ayrı üretir, süreleri ölçer, zaman çizelgesini çıkarır.
// Kullanım: npm run tts -- animasyonlar/<ad>.voice.json
//
// <ad>.voice.json:
// { "voice": "Charon", "style": "...", "tempo": 1.12, "lead": 0.15, "gap": 0.25, "tail": 2,
//   "lines": [ { "id": "l1", "text": "...", "caption": "(ekrandaki hali, ops.)", "pauseBefore": 0, "holdAfter": 0 } ] }
//
// Çıktılar:
//   ses/<ad>/<id>.wav      cümle başına ses (önbellek: metin/ses/stil/tempo değişmezse yeniden üretilmez)
//   ses/<ad>/voice.wav     tüm cümleler zaman çizelgesine yerleştirilmiş tek dosya (render --audio)
//   animasyonlar/<ad>.html içindeki /*VO:BEGIN*/ … /*VO:END*/ bloğu: const VO = {...}
//
// Anahtar: koda yazılmaz. Ortamın ağ sırrı (generativelanguage.googleapis.com, x-goog-api-key)
// proxy tarafından eklenir. Yerelde çalıştırıyorsan GEMINI_API_KEY ortam değişkeni kullanılır.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cfgPath = path.resolve(process.argv[2] || '');
if (!fs.existsSync(cfgPath)) { console.error('Kullanım: npm run tts -- animasyonlar/<ad>.voice.json'); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const name = path.basename(cfgPath).replace(/\.voice\.json$/, '');
const dir = path.resolve('ses', name);
fs.mkdirSync(dir, { recursive: true });
const manifestPath = path.join(dir, 'manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
const model = cfg.model || 'gemini-3.8-flash-tts';
const tempo = cfg.tempo || 1;

const ff = (args) => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error('ffmpeg: ' + r.stderr);
};
const duration = f => +spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).stdout.trim();

async function synth(text) {
  const body = {
    model,
    input: [{ type: 'user_input', content: [{ type: 'text', text,
      annotations: cfg.style ? [{ type: 'speech_metadata', style: cfg.style }] : [] }] }],
    response_format: { type: 'audio' },
    generation_config: { speech_config: [{ voice: cfg.voice || 'Charon' }] },
  };
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.GEMINI_API_KEY) headers['x-goog-api-key'] = process.env.GEMINI_API_KEY;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST', headers, body: JSON.stringify(body) });
    const j = await res.json().catch(() => ({}));
    const audio = (j.steps || []).filter(s => s.type === 'model_output')
      .flatMap(s => s.content || []).filter(c => c.type === 'audio').pop();
    if (res.ok && audio) return Buffer.from(audio.data, 'base64');
    console.warn(`  ! deneme ${attempt}: HTTP ${res.status} ${JSON.stringify(j).slice(0, 200)}`);
    await new Promise(r => setTimeout(r, 2000 * attempt));
  }
  throw new Error('TTS başarısız: ' + text);
}

// 1) Cümleleri üret (önbellekli, paralel)
await Promise.all(cfg.lines.map(async (l) => {
  const key = crypto.createHash('sha1').update(JSON.stringify([model, cfg.voice, cfg.style, tempo, l.text])).digest('hex');
  const out = path.join(dir, `${l.id}.wav`);
  if (manifest[l.id] === key && fs.existsSync(out)) { console.log(`  = ${l.id} (önbellek)`); return; }
  const raw = path.join(dir, `${l.id}.raw.wav`);
  fs.writeFileSync(raw, await synth(l.text));
  // Baştaki/sondaki sessizliği kırp, perdeyi bozmadan hızlandır, 48 kHz'e çevir
  ff(['-i', raw, '-af',
    `silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo=${tempo}`,
    '-ar', '48000', '-ac', '1', out]);
  fs.rmSync(raw);
  manifest[l.id] = key;
  console.log(`  + ${l.id} üretildi`);
}));
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

// 2) Zaman çizelgesi
const lead = cfg.lead ?? 0.15, gap = cfg.gap ?? 0.25, tail = cfg.tail ?? 2;
let t = lead;
const lines = cfg.lines.map((l, i) => {
  t += (i ? gap : 0) + (l.pauseBefore || 0);
  const d = duration(path.join(dir, `${l.id}.wav`));
  const start = +t.toFixed(3), end = +(t + d).toFixed(3);
  t = end + (l.holdAfter || 0);
  return { id: l.id, start, end, text: (l.caption || l.text).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() };
});
const total = +(t + tail).toFixed(2);

// 3) Tek dosya: her cümleyi başlangıcına yerleştir
const inputs = lines.flatMap(l => ['-i', path.join(dir, `${l.id}.wav`)]);
const delays = lines.map((l, i) => `[${i}:a]adelay=${Math.round(l.start * 1000)}:all=1[a${i}]`).join(';');
const mix = lines.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${lines.length}:normalize=0,apad=whole_dur=${total}[out]`;
ff([...inputs, '-filter_complex', `${delays};${mix}`, '-map', '[out]', '-t', String(total), '-ar', '48000', path.join(dir, 'voice.wav')]);

// 4) Animasyon dosyasına yaz
const vo = { duration: total, lines };
const html = path.resolve('animasyonlar', `${name}.html`);
if (fs.existsSync(html)) {
  const src = fs.readFileSync(html, 'utf8');
  const re = /\/\*VO:BEGIN\*\/[\s\S]*?\/\*VO:END\*\//;
  if (re.test(src)) {
    fs.writeFileSync(html, src.replace(re, `/*VO:BEGIN*/ const VO = ${JSON.stringify(vo)}; /*VO:END*/`));
    console.log(`  → ${path.relative('.', html)} içindeki VO bloğu güncellendi`);
  }
}
fs.writeFileSync(path.join(dir, 'timing.json'), JSON.stringify(vo, null, 2));
for (const l of lines) console.log(`  ${l.start.toFixed(2).padStart(6)}–${l.end.toFixed(2).padStart(6)}  ${l.text}`);
console.log(`Toplam: ${total} sn · ses: ${path.relative('.', path.join(dir, 'voice.wav'))}`);
