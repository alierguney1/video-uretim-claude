// Ortak yardımcılar: animasyon sayfasını headless Chromium'da açıp kare kare sürmek.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);

export function loadPlaywright() {
  try { return require('playwright'); }
  catch { /* yerel kurulum yoksa global dene */ }
  try { return require(path.join(process.env.NODE_PATH || '/usr/lib/node_modules', 'playwright')); }
  catch {
    console.error('Playwright bulunamadı. Kur: npm i -D playwright && npx playwright install chromium');
    process.exit(1);
  }
}

/** Basit argüman ayrıştırıcı: --anahtar deger, --bayrak, konumsal argümanlar. */
export function parseArgs(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) out[key] = true;
      else { out[key] = next; i++; }
    } else out._.push(a);
  }
  return out;
}

export function resolveInput(file) {
  if (!file) { console.error('Kullanım: <komut> animasyonlar/ad.html [seçenekler]'); process.exit(1); }
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) { console.error(`Dosya yok: ${abs}`); process.exit(1); }
  return abs;
}

export function outDir(file, override) {
  const dir = override ? path.resolve(override)
    : path.resolve('out', path.basename(file, path.extname(file)));
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Sayfayı açar, __ready'yi bekler, viewport'u __size'a göre ayarlar.
 * Döner: { browser, context, page, meta: {duration, fps, width, height, scenes} }
 */
export async function openAnimation(file, { query = '', scale = 1, browser } = {}) {
  const { chromium } = loadPlaywright();
  const ownBrowser = !browser;
  browser = browser || await chromium.launch();
  const url = pathToFileURL(file).href + '?render=1' + (query ? '&' + query : '');

  // Önce boyutu öğren
  const probe = await browser.newPage();
  const errors = [];
  probe.on('pageerror', e => errors.push(e.message));
  await probe.goto(url);
  const size = await probe.evaluate(() => window.__size || null);
  await probe.close();
  const width = size?.width || 1920, height = size?.height || 1080;

  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  await page.evaluate(() => window.__ready);

  const meta = await page.evaluate(() => ({
    duration: window.__duration,
    fps: window.__fps,
    hasSetTime: typeof window.__setTime === 'function',
    scenes: window.__scenes || null,
    hasAudio: typeof window.__renderAudio === 'function',
  }));
  Object.assign(meta, { width, height, errors, url });

  const close = async () => { await context.close(); if (ownBrowser) await browser.close(); };
  return { browser, context, page, meta, close };
}

/**
 * t anını çizip PNG Buffer döner.
 * Sayfa tek bir tam boy canvas ise pikseller doğrudan canvas'tan okunur (kesin ve
 * ekran görüntüsündeki kompozisyon gecikmesinden etkilenmez). SVG/DOM animasyonlarında
 * iki kare bekleyip ekran görüntüsü alınır. WebGL için preserveDrawingBuffer: true gerekir.
 */
export async function frameAt(page, meta, t) {
  const dataUrl = await page.evaluate(async ({ t, w, h }) => {
    window.__setTime(t);
    const cs = document.querySelectorAll('canvas');
    const c = cs.length === 1 ? cs[0] : null;
    const r = c && c.getBoundingClientRect();
    if (c && Math.round(r.width) === w && Math.round(r.height) === h) return c.toDataURL('image/png');
    await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
    return null;
  }, { t, w: meta.width, h: meta.height });
  if (dataUrl) return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
  return page.screenshot({ clip: { x: 0, y: 0, width: meta.width, height: meta.height }, type: 'png' });
}

export function requireContract(meta) {
  const missing = [];
  if (!meta.hasSetTime) missing.push('window.__setTime(t)');
  if (!(meta.duration > 0)) missing.push('window.__duration');
  if (missing.length) {
    console.error('Sözleşme eksik: ' + missing.join(', ') + '. MOTION_RULES.md bölüm 1\'e bak.');
    process.exit(1);
  }
}

export const fmtT = t => t.toFixed(2) + ' sn';
