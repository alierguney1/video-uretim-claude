// Ortak yardımcılar: animasyon sayfasını headless Chromium'da açıp kare kare sürmek.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

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
 * cdn.jsdelivr.net/npm/<paket>@<sürüm>/<yol> isteklerini önce ağdan dener; ağ engelliyse (bazı bulut
 * ortamları jsDelivr'ı kapatır, npm kayıt deposu açıktır) aynı sürümü `npm pack` ile .cache/cdn/'e indirip
 * oradan sunar. Sabit sürüm olduğu için içerik aynıdır; çıktı değişmez.
 */
const CDN_CACHE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '.cache', 'cdn');
const MIME = { '.js': 'application/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml' };
function npmFile(spec, rel) {
  const dir = path.join(CDN_CACHE, spec.replace('/', '__'));
  if (!fs.existsSync(path.join(dir, 'package'))) {
    fs.mkdirSync(dir, { recursive: true });
    const tgz = execFileSync('npm', ['pack', spec, '--silent'], { cwd: dir }).toString().trim().split('\n').pop();
    execFileSync('tar', ['xzf', tgz], { cwd: dir });
  }
  return path.join(dir, 'package', rel);
}
export async function cdnFallback(target) {
  await target.route(/^https:\/\/cdn\.jsdelivr\.net\/npm\//, async route => {
    const url = route.request().url();
    try { const r = await route.fetch({ timeout: 8000 }); if (r.ok()) return route.fulfill({ response: r }); } catch { /* ağ yok: npm'e düş */ }
    const m = url.match(/\/npm\/((?:@[^/]+\/)?[^/@]+@[^/]+)\/(.+)$/);
    if (!m) return route.abort();
    try {
      const f = npmFile(m[1], m[2]);
      route.fulfill({ status: 200, body: fs.readFileSync(f), contentType: MIME[path.extname(f)] || 'application/octet-stream', headers: { 'access-control-allow-origin': '*' } });
    } catch (e) { console.error('CDN yedeği başarısız: ' + url + ' — ' + e.message); route.abort(); }
  });
}

export function findChromium(chromium) {
  const def = chromium?.executablePath?.();
  if (def && fs.existsSync(def)) return def;
  for (const p of [process.env.CHROMIUM_PATH, '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome']) {
    if (p && fs.existsSync(p)) return p;
  }
  return undefined;
}

export async function launchBrowser(opts = {}) {
  const { chromium } = loadPlaywright();
  const executablePath = opts.executablePath || findChromium(chromium);
  return chromium.launch({ ...opts, ...(executablePath ? { executablePath } : {}) });
}

/**
 * Sayfayı açar, __ready'yi bekler, viewport'u __size'a göre ayarlar.
 * Döner: { browser, context, page, meta: {duration, fps, width, height, scenes} }
 */
export async function openAnimation(file, { query = '', scale = 1, browser } = {}) {
  const ownBrowser = !browser;
  browser = browser || await launchBrowser();
  const url = pathToFileURL(file).href + '?render=1' + (query ? '&' + query : '');

  // Önce boyutu öğren (proxy TLS sertifikası Google Fonts'u düşürmesin diye ignoreHTTPSErrors)
  const probeCtx = await browser.newContext({ ignoreHTTPSErrors: true });
  const probe = await probeCtx.newPage();
  await cdnFallback(probe);
  const errors = [];
  probe.on('pageerror', e => errors.push(e.message));
  await probe.goto(url);
  const size = await probe.evaluate(() => window.__size || null);
  await probeCtx.close();
  const width = size?.width || 1920, height = size?.height || 1080;

  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  await cdnFallback(page);
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  await page.evaluate(() => window.__ready);

  const meta = await page.evaluate(() => ({
    duration: window.__duration,
    fps: window.__fps,
    cover: window.__cover,
    hasSetTime: typeof window.__setTime === 'function',
    scenes: window.__scenes || null,
    hasAudio: typeof window.__renderAudio === 'function',
    loadedFonts: [...document.fonts].filter(f => f.status === 'loaded').length,
    failedFonts: [...document.fonts].filter(f => f.status === 'error').map(f => f.family),
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
