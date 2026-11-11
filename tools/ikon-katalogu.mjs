#!/usr/bin/env node
// İkon kataloğu: 81 il ikonu ve bayrakları tek PNG'de gösterir → out/ikon-katalogu.png
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { loadPlaywright, cdnFallback } from './lib.mjs';
const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2060, height: 1200 } });
await cdnFallback(page);
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto(pathToFileURL(path.resolve('tools/ikon-katalogu.html')).href);
await page.evaluate(() => window.__ready);
const size = await page.evaluate(() => window.__size);
await page.setViewportSize(size);
fs.mkdirSync('out', { recursive: true });
await page.locator('canvas').screenshot({ path: 'out/ikon-katalogu.png' });
await browser.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`out/ikon-katalogu.png (${size.width}x${size.height})`);
