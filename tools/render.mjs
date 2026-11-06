#!/usr/bin/env node
// Kare kare render: her kareyi window.__setTime(t) ile çiz, PNG kaydet, FFmpeg ile MP4 yap.
// Kullanım:
//   npm run render -- animasyonlar/ad.html [--fps 60] [--scale 1] [--workers 4]
//                     [--from 0] [--to 10] [--audio ses.mp3] [--no-audio] [--keep-frames] [--crf 18]
// Ses: --audio verilirse o dosya; yoksa sayfada SOUNDS varsa __renderAudio() ile sentezlenen WAV.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs, resolveInput, outDir, openAnimation, frameAt, requireContract, loadPlaywright } from './lib.mjs';

const args = parseArgs();
const file = resolveInput(args._[0]);
const dir = outDir(file, args.out);
const name = path.basename(file, path.extname(file));

if (spawnSync('ffmpeg', ['-version']).status !== 0) { console.error('FFmpeg bulunamadı.'); process.exit(1); }

const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const scale = +args.scale || 1;
const main = await openAnimation(file, { browser, scale });
requireContract(main.meta);
const meta = main.meta;

const fps = +args.fps || meta.fps || 60;
const t0 = +args.from || 0;
const t1 = args.to !== undefined ? +args.to : meta.duration;
const total = Math.round((t1 - t0) * fps);
const framesDir = path.join(dir, 'frames');
fs.rmSync(framesDir, { recursive: true, force: true });
fs.mkdirSync(framesDir, { recursive: true });

// Paralel: her işçi kendi sayfasında kendi kare dilimini çizer (draw(t) saf olduğu için güvenli).
const workers = Math.max(1, Math.min(+args.workers || 4, total));
const pages = [main];
for (let i = 1; i < workers; i++) pages.push(await openAnimation(file, { browser, scale }));

console.log(`${name}: ${total} kare, ${fps} fps, ${meta.width * scale}x${meta.height * scale}, ${workers} işçi`);
let done = 0, lastLog = 0;
const started = Date.now();
await Promise.all(pages.map(async (p, w) => {
  for (let i = w; i < total; i += workers) {
    const t = t0 + i / fps;
    const buf = await frameAt(p.page, meta, t);
    fs.writeFileSync(path.join(framesDir, String(i).padStart(6, '0') + '.png'), buf);
    done++;
    if (Date.now() - lastLog > 1000) {
      lastLog = Date.now();
      process.stdout.write(`\r  ${done}/${total} kare (%${Math.round(done / total * 100)})`);
    }
  }
}));
process.stdout.write(`\r  ${total}/${total} kare · ${((Date.now() - started) / 1000).toFixed(1)} sn\n`);

// Ses
let audio = null;
if (args.audio) audio = path.resolve(args.audio);
else if (!args['no-audio'] && meta.hasAudio) {
  const b64 = await main.page.evaluate(() => window.__renderAudio());
  if (b64) { audio = path.join(dir, 'audio.wav'); fs.writeFileSync(audio, Buffer.from(b64, 'base64')); }
}
for (const p of pages) await p.close();
await browser.close();

const mp4 = path.join(dir, `${name}.mp4`);
const ff = ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(framesDir, '%06d.png')];
if (audio) ff.push('-ss', String(t0), '-i', audio);
ff.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', String(args.crf || 18), '-preset', 'slow',
  '-r', String(fps), '-movflags', '+faststart');
if (audio) ff.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
ff.push(mp4);
const r = spawnSync('ffmpeg', ff, { stdio: 'inherit' });
if (r.status !== 0) { console.error('FFmpeg başarısız.'); process.exit(1); }
if (!args['keep-frames']) fs.rmSync(framesDir, { recursive: true, force: true });
console.log(`MP4: ${mp4}${audio ? ' (sesli)' : ''}`);
