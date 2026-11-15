// Harita Yalan Söyler — seri motoru (V2).
// Bölüm dosyası sadece hikâyeyi yazar (sahneler, kamera, çizim, ses); render sözleşmesi, harita verisi,
// altyazı (kutu + kinetik), çakışma önleyici etiket, otomatik sığan başlık, görsel bileşenler,
// çok katmanlı ses sentezi ve oynatıcı buradadır.
//
// Kullanım (bölüm dosyasında, d3/topojson CDN script'lerinden ve bu dosyadan sonra):
//   HYS.run({ vo: VO, cover, times(L, at, DUR), scenes(T, at, DUR), keys(T, at, DUR),
//             flat?, projection?(cam), init?(D), draw(t, g), header(t, g), sounds(T, at, DUR),
//             captionSkip?: [indeks], captionStyle?: 'box'|'kinetic', drone?: false|{}, ikonlar?: [] })
'use strict';
(function () {
  const W = 1080, H = 1920, FPS = 60;
  const C = {
    bg: '#0B141B', ocean: '#0F1C26', land: '#E8E2D4', text: '#F4F1EA',
    mute: '#8FA1AD', accent: '#FF6B2C', grid: 'rgba(232,226,212,.10)',
  };
  const SANS = 'Inter, system-ui, sans-serif', MONO = '"IBM Plex Mono", ui-monospace, monospace';
  const FONTS = ['800 10px Inter', '700 10px Inter', '600 10px Inter', '500 10px "IBM Plex Mono"'];
  const GLYPHS = "AaBbCcÇçDdEeFfGgĞğHhIıİiJjKkLlMmNnOoÖöPpRrSsŞşTtUuÜüVvYyZz0123456789%.,:;!?+-−×÷=≠≈<>°′″…'’\"“”()[]/→←↔·—–⏸ ";
  const SAFE = { x0: W * .08, x1: W * .88, y0: H * .12, y1: H * .80 };
  const GLOBE = { cx: W * .5, cy: H * .53, r: W * .42 };
  const RAD = Math.PI / 180, R_EARTH = 6371.0088;

  // ── yardımcılar ──
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, a, b) => b <= a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a));
  const win = (t, a, b, f = .3) => Math.min(prog(t, a, a + f), 1 - prog(t, b - f, b));
  const ease = {
    linear: k => k,
    outCubic: k => 1 - Math.pow(1 - k, 3),
    inCubic: k => k * k * k,
    inOutCubic: k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
    outExpo: k => k >= 1 ? 1 : 1 - Math.pow(2, -10 * k),
    inOutSine: k => -(Math.cos(Math.PI * k) - 1) / 2,
    spring: k => k <= 0 ? 0 : k >= 1 ? 1 : (1 - (1 + 8 * k) * Math.exp(-8 * k)) / (1 - 9 * Math.exp(-8)),
    outBackSoft: k => { const c = .6; return k <= 0 ? 0 : 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
  };
  const km = (a, b) => d3.geoDistance(a, b) * R_EARTH;
  const fmtNum = (v, d = 0) => v.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });

  // ── kanvas ──
  const params = new URLSearchParams(location.search);
  const RENDER = params.has('render'), GUIDES = params.has('guides');
  // kapak aracı (tools/kapak.mjs) temiz kare ister: ?nocap altyazısız, ?nohead başlıksız
  const NOCAP = params.has('nocap'), NOHEAD = params.has('nohead');
  if (RENDER) document.body.classList.add('render');
  const canvas = document.getElementById('c'), ctx = canvas.getContext('2d');
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
  function fit() {
    if (RENDER) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; return; }
    const s = Math.min(innerWidth / W, innerHeight / H);
    canvas.style.width = W * s + 'px'; canvas.style.height = H * s + 'px';
  }
  addEventListener('resize', fit); fit();

  // ── veri ──
  const D = {};
  async function loadData() {
    const base = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/';
    const files = ['land-50m.json', 'countries-50m.json', 'land-110m.json', 'countries-110m.json'];
    const [l50, c50, l110, c110] = await Promise.all(files.map(f => fetch(base + f).then(r => r.json())));
    D.LAND = topojson.feature(l50, l50.objects.land);
    D.BORDERS = topojson.mesh(c50, c50.objects.countries, (a, b) => a !== b);
    D.LAND110 = topojson.feature(l110, l110.objects.land);
    D.BORDERS110 = topojson.mesh(c110, c110.objects.countries, (a, b) => a !== b);
    D.TOPO = c50;
    D.COUNTRIES = topojson.feature(c50, c50.objects.countries).features;
    D.country = name => D.COUNTRIES.find(f => f.properties.name === name);
    D.GRAT = d3.geoGraticule10();
    D.SPHERE = { type: 'Sphere' };
  }

  // ── kamera ──
  function camera(keys, t, flat) {
    let i = 0; while (i < keys.length - 2 && t >= keys[i + 1][0]) i++;
    const a = keys[i], b = keys[i + 1], k = ease.inOutCubic(prog(t, a[0], b[0]));
    const c = flat ? [lerp(a[1], b[1], k), lerp(a[2], b[2], k)] : d3.geoInterpolate([a[1], a[2]], [b[1], b[2]])(k);
    const g = a.length > 4 ? lerp(a[4] || 0, b[4] || 0, k) : 0;
    return { lon: c[0], lat: c[1], k: Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), k)), gamma: g };
  }
  const globeProjection = cam => d3.geoOrthographic().translate([GLOBE.cx, GLOBE.cy]).scale(GLOBE.r * cam.k)
    .rotate([-cam.lon, -cam.lat, cam.gamma || 0]).clipAngle(90).precision(.3);
  const mercatorProjection = cam => d3.geoMercator().scale(W / (2 * Math.PI) * cam.k).center([cam.lon, cam.lat])
    .translate([W / 2, GLOBE.cy]).precision(.3);
  const visible = (cam, p) => d3.geoDistance([cam.lon, cam.lat], p) < Math.PI / 2 - .02;

  // ── tipografi ve çizim yardımcıları ──
  function fitFont(str, size, weight, font, maxW) {
    ctx.font = `${weight} ${size}px ${font}`;
    let w = ctx.measureText(str).width;
    if (maxW > 0 && w > maxW && w > 0) {
      size = Math.max(16, size * (maxW / w) * .99);
      ctx.font = `${weight} ${size}px ${font}`;
      w = ctx.measureText(str).width;
    }
    return { size, w };
  }

  function text(str, x, y, size, { font = SANS, weight = 800, color = C.text, alpha = 1, align = 'left',
    baseline = 'alphabetic', maxW = null, stroke = null, strokeWidth = 0 } = {}) {
    if (alpha <= .001 || str === undefined || str === null || str === '') return 0;
    const s = String(str);
    const m = fitFont(s, size, weight, font, maxW);
    ctx.globalAlpha = alpha;
    ctx.textAlign = align; ctx.textBaseline = baseline;
    if (stroke && strokeWidth > 0) {
      ctx.lineJoin = 'round'; ctx.strokeStyle = stroke; ctx.lineWidth = strokeWidth; ctx.strokeText(s, x, y);
    }
    ctx.fillStyle = color; ctx.fillText(s, x, y);
    ctx.globalAlpha = 1; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    return m.w;
  }

  /** Sabit hücreli rakam çizimi: değişen sayaçlarda titremez; align & maxW destekler. */
  function textTab(str, x, y, size, { font = MONO, weight = 500, color = C.text, alpha = 1, align = 'left',
    baseline = 'alphabetic', maxW = null, stroke = null, strokeWidth = 0 } = {}) {
    if (alpha <= .001 || str === undefined || str === null || str === '') return 0;
    const s = String(str);
    const measureTab = (sz) => {
      ctx.font = `${weight} ${sz}px ${font}`;
      const cell = ctx.measureText('0').width;
      let total = 0;
      const chars = [...s].map(ch => {
        const cw = ctx.measureText(ch).width;
        const step = (ch >= '0' && ch <= '9') ? cell : cw;
        const off = (ch >= '0' && ch <= '9') ? (cell - cw) / 2 : 0;
        const item = { ch, step, off };
        total += step;
        return item;
      });
      return { total, chars };
    };
    let m = measureTab(size);
    if (maxW > 0 && m.total > maxW && m.total > 0) {
      size = Math.max(16, size * (maxW / m.total) * .99);
      m = measureTab(size);
    }
    let cx = align === 'right' ? x - m.total : align === 'center' ? x - m.total / 2 : x;
    ctx.globalAlpha = alpha; ctx.textAlign = 'left'; ctx.textBaseline = baseline;
    if (stroke && strokeWidth > 0) { ctx.lineJoin = 'round'; ctx.strokeStyle = stroke; ctx.lineWidth = strokeWidth; }
    ctx.fillStyle = color;
    for (const it of m.chars) {
      if (stroke && strokeWidth > 0) ctx.strokeText(it.ch, cx + it.off, y);
      ctx.fillText(it.ch, cx + it.off, y);
      cx += it.step;
    }
    ctx.globalAlpha = 1; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    return m.total;
  }

  function wrapLines(str, maxW, size, { font = SANS, weight = 800 } = {}) {
    ctx.font = `${weight} ${size}px ${font}`;
    const words = String(str).split(' '), lines = [];
    let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (cur && ctx.measureText(test).width > maxW) { lines.push(cur); cur = w; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // Her karedeki etiket ve altyazı kutuları (çakışma önleme)
  let FRAME_BOXES = [];
  let CAP_LAYOUT = null;
  const boxesOverlap = (a, b, pad = 6) => !(a.x + a.w + pad <= b.x || b.x + b.w + pad <= a.x || a.y + a.h + pad <= b.y || b.y + b.h + pad <= a.y);

  /** Harita etiketi: altyazı ve diğer etiketlerle çakışmayacak şekilde güvenli alana yerleşir. */
  function label(str, x, y, { size = 46, font = MONO, weight = 500, color = C.text, alpha = 1, dx = 28, dy = -24,
    bg = C.ocean, stroke = 'rgba(244,241,234,.14)', maxW = SAFE.x1 - SAFE.x0 } = {}) {
    if (alpha <= .001 || !str) return null;
    const s = String(str);
    const m = fitFont(s, size, weight, font, maxW - 28);
    size = m.size;
    const w = m.w, padX = 14, h = size * 1.25;
    let lx = x + dx;
    if (lx + w + padX > SAFE.x1) lx = x - Math.abs(dx) - w;
    lx = clamp(lx, SAFE.x0, SAFE.x1 - w - padX);

    const minY = SAFE.y0 + 260 + h;
    const capTop = CAP_LAYOUT ? CAP_LAYOUT.top : SAFE.y1 - 24;
    const idleCeil = CAP_STYLE === 'kinetic' ? SAFE.y1 - 170 : SAFE.y1 - 230;
    const maxY = Math.max(minY, Math.min(idleCeil, capTop - 14 - size * .32));
    let ly = clamp(y + dy, minY, maxY);

    const makeBox = (bx, by) => ({ x: bx - padX, y: by - size * .95, w: w + padX * 2, h });
    let box = makeBox(lx, ly);

    // Çakışma varsa önce zıt yönde (üst/alt), sonra müsait boşluğa kaydır
    if (FRAME_BOXES.some(b => boxesOverlap(box, b, 6))) {
      const cands = [
        clamp(y - Math.abs(dy) - h * .3, minY, maxY),
        clamp(y + Math.abs(dy) + h * .9, minY, maxY),
      ];
      for (const b of FRAME_BOXES) {
        cands.push(clamp(b.y - 8 - (h - size * .95), minY, maxY));
        cands.push(clamp(b.y + b.h + 8 + size * .95, minY, maxY));
      }
      for (const cy of cands) {
        const tb = makeBox(lx, cy);
        if (!FRAME_BOXES.some(b => boxesOverlap(tb, b, 6))) { ly = cy; box = tb; break; }
      }
    }
    FRAME_BOXES.push(box);

    ctx.globalAlpha = alpha * .92; ctx.fillStyle = bg;
    ctx.beginPath(); ctx.roundRect(box.x, box.y, Math.max(0, box.w), Math.max(0, box.h), 10); ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
    ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.fillText(s, lx, ly);
    ctx.globalAlpha = 1;
    return box;
  }

  function pin(xy, { color = C.land, r = 13, alpha = 1, pulse = 0 } = {}) {
    if (!xy || alpha <= .001) return;
    const [x, y] = xy;
    if (pulse > 0) {
      ctx.globalAlpha = alpha * (1 - pulse) * .7; ctx.strokeStyle = color; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(x, y, Math.max(0, r + pulse * 46), 0, 2 * Math.PI); ctx.stroke();
    }
    ctx.globalAlpha = alpha; ctx.fillStyle = C.ocean;
    ctx.beginPath(); ctx.arc(x, y, Math.max(0, r + 5), 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, 2 * Math.PI); ctx.fill();
    ctx.globalAlpha = 1;
  }

  /** Coğrafi çizgi; outline=true ise koyu dış çizgiyle (kara ve denizde görünür) */
  function line(path, coords, { color = C.land, width = 5, dash = null, alpha = 1, outline = false } = {}) {
    if (alpha <= .001 || coords.length < 2) return;
    const geo = { type: 'LineString', coordinates: coords };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash(dash || []);
    if (outline) { ctx.globalAlpha = alpha; ctx.strokeStyle = C.ocean; ctx.lineWidth = width + 6; ctx.beginPath(); path(geo); ctx.stroke(); }
    ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); path(geo); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = 1;
  }

  const greatCircle = (a, b, k = 1, n = 96) => {
    const ip = d3.geoInterpolate(a, b);
    return Array.from({ length: n + 1 }, (_, i) => ip(clamp(k) * i / n));
  };

  /** İlerleyen rota ucu: k (0..1) oranında büyük daire çizer ve uçta yönlü başlık/pulse gösterir. */
  function tracer(path, pr, a, b, k, { color = C.accent, width = 7, headR = 11, alpha = 1, outline = true, arrow = true, pulse = 0, n = 96 } = {}) {
    k = clamp(k);
    if (alpha <= .001 || k <= .001) return null;
    const coords = greatCircle(a, b, k, n);
    line(path, coords, { color, width, alpha, outline });
    const endCoord = coords[coords.length - 1];
    const prevCoord = coords[Math.max(0, coords.length - 3)];
    const p1 = pr(prevCoord), p2 = pr(endCoord);
    if (!p2) return null;
    if (arrow && p1 && Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) > 1) {
      const ang = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p2[0], p2[1]);
      ctx.rotate(ang);
      if (pulse > 0) {
        ctx.globalAlpha = alpha * (1 - pulse) * .65;
        ctx.strokeStyle = color; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.arc(0, 0, Math.max(0, headR + pulse * 36), 0, 2 * Math.PI); ctx.stroke();
        ctx.globalAlpha = alpha;
      }
      ctx.fillStyle = C.ocean;
      ctx.beginPath(); ctx.moveTo(headR * 1.45, 0); ctx.lineTo(-headR, -headR * .95); ctx.lineTo(-headR * .55, 0); ctx.lineTo(-headR, headR * .95); ctx.closePath(); ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.moveTo(headR * 1.15, 0); ctx.lineTo(-headR * .72, -headR * .68); ctx.lineTo(-headR * .38, 0); ctx.lineTo(-headR * .72, headR * .68); ctx.closePath(); ctx.fill();
      ctx.restore();
    } else {
      pin(p2, { color, r: headR, alpha, pulse });
    }
    return p2;
  }

  function arrow(x1, y1, x2, y2, { color = C.accent, width = 5, head = 18, alpha = 1, dash = null, outline = false } = {}) {
    if (alpha <= .001) return;
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    if (len < 2) return;
    const ang = Math.atan2(dy, dx);
    ctx.save();
    ctx.globalAlpha = alpha; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash(dash || []);
    if (outline) {
      ctx.strokeStyle = C.ocean; ctx.lineWidth = width + 6;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(ang) * head * .55, y2 - Math.sin(ang) * head * .55); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(ang - .42), y2 - head * Math.sin(ang - .42));
    ctx.lineTo(x2 - head * Math.cos(ang + .42), y2 - head * Math.sin(ang + .42));
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  /** Karşılaştırma çubuğu (ör. 46.555 km vs 40.075 km Ekvator eşiği). */
  function meter(x, y, w, h, val, maxVal, { color = C.accent, bg = 'rgba(232,226,212,.16)', border = 'rgba(244,241,234,.20)',
    card = true, cardBg = 'rgba(11,20,27,.88)', marker = null, markerColor = C.text, markerLabel = '', label = '',
    valueText = '', radius = 12, alpha = 1, fontSize = 32 } = {}) {
    if (alpha <= .001) return null;
    const refMax = Math.max(1e-6, maxVal, marker || 0);
    const fillFrac = clamp(val / refMax);
    const padX = card ? 20 : 0;
    const bx = x + padX, bw = Math.max(20, w - padX * 2);
    const fillW = Math.max(0, bw * fillFrac);
    const hasTop = !!(label || valueText), hasBot = !!markerLabel;
    const mSize = Math.max(24, fontSize - 4);
    const padTop = card ? (hasTop ? fontSize + 24 : 16) : 0;
    const padBot = card ? (hasBot ? mSize + 28 : 16) : 0;
    const cy = y - padTop, ch = h + padTop + padBot;
    ctx.save();
    if (card) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = cardBg;
      ctx.beginPath(); ctx.roundRect(x, cy, Math.max(0, w), Math.max(0, ch), 16); ctx.fill();
      ctx.strokeStyle = 'rgba(244,241,234,.16)'; ctx.lineWidth = 1.5; ctx.stroke();
    }
    if (hasTop) {
      if (label) text(label, bx, y - 14, fontSize, { weight: 600, color: C.mute, alpha, stroke: card ? null : C.bg, strokeWidth: card ? 0 : 4 });
      if (valueText) textTab(valueText, bx + bw, y - 14, fontSize, { font: MONO, weight: 500, color: C.text, alpha, align: 'right', stroke: card ? null : C.bg, strokeWidth: card ? 0 : 4 });
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(bx, y, Math.max(0, bw), Math.max(0, h), Math.max(0, radius)); ctx.fill();
    if (border) { ctx.strokeStyle = border; ctx.lineWidth = 1.5; ctx.stroke(); }
    if (fillW > 2) {
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.roundRect(bx, y, fillW, Math.max(0, h), Math.max(0, Math.min(radius, fillW / 2, h / 2))); ctx.fill();
    }
    if (marker !== null && marker >= 0 && marker <= refMax) {
      const mx = bx + bw * (marker / refMax);
      ctx.strokeStyle = markerColor; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(mx, y - 8); ctx.lineTo(mx, y + h + 8); ctx.stroke();
      if (markerLabel) {
        const align = mx < bx + bw * .25 ? 'left' : mx > bx + bw * .75 ? 'right' : 'center';
        textTab(markerLabel, mx, y + h + 36, mSize, { font: MONO, weight: 500, color: markerColor, alpha: alpha * .95, align, stroke: card ? null : C.bg, strokeWidth: card ? 0 : 5 });
      }
    }
    ctx.restore();
    const box = { x, y: cy - (hasTop && !card ? fontSize + 14 : 0), w, h: ch + (!card && hasTop ? fontSize + 14 : 0) + (!card && hasBot ? mSize + 24 : 0) };
    FRAME_BOXES.push(box);
    return box;
  }

  /** Yüksek kontrastlı veri rozeti / köşe bilgi kartı. */
  function statPill(x, y, main, { sub = null, color = C.text, accentDot = null, bg = 'rgba(11,20,27,.90)',
    border = 'rgba(244,241,234,.18)', size = 38, subSize = 26, alpha = 1, align = 'left', padX = 18, padY = 12, tabular = false } = {}) {
    if (alpha <= .001 || !main) return null;
    const s = String(main);
    ctx.font = `${tabular ? 500 : 700} ${size}px ${tabular ? MONO : SANS}`;
    const mw = ctx.measureText(s).width;
    let sw = 0;
    if (sub) { ctx.font = `600 ${subSize}px ${SANS}`; sw = ctx.measureText(String(sub)).width; }
    const dotW = accentDot ? 22 : 0;
    const w = Math.max(mw, sw) + padX * 2 + dotW;
    const h = sub ? size + subSize + padY * 2 + 8 : size * 1.15 + padY * 2;
    let bx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    bx = clamp(bx, SAFE.x0, SAFE.x1 - w);
    const by = y;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(bx, by, Math.max(0, w), Math.max(0, h), 14); ctx.fill();
    if (border) { ctx.strokeStyle = border; ctx.lineWidth = 1.5; ctx.stroke(); }
    let tx = bx + padX;
    if (accentDot) {
      ctx.fillStyle = accentDot;
      ctx.beginPath(); ctx.arc(bx + padX + 6, by + padY + size * .52, 7, 0, 2 * Math.PI); ctx.fill();
      tx += dotW;
    }
    const drawFn = tabular ? textTab : text;
    drawFn(s, tx, by + padY + size * .85, size, { font: tabular ? MONO : SANS, weight: tabular ? 500 : 700, color, alpha });
    if (sub) text(String(sub), tx, by + padY + size + subSize + 4, subSize, { font: SANS, weight: 600, color: C.mute, alpha: alpha * .92 });
    ctx.restore();
    const box = { x: bx, y: by, w, h };
    FRAME_BOXES.push(box);
    return box;
  }

  function vignette(alpha = .45, cx = W * .5, cy = H * .52, inner = W * .35, outer = W * .9) {
    if (alpha <= .001) return;
    const g = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    g.addColorStop(0, 'rgba(11,20,27,0)');
    g.addColorStop(1, `rgba(11,20,27,${alpha})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function baseMap(path, { landAlpha = 1, fine = true, sphere = true, landColor = C.land, oceanColor = C.ocean, borderColor = 'rgba(15,28,38,.6)' } = {}) {
    if (sphere) { ctx.fillStyle = oceanColor; ctx.beginPath(); path(D.SPHERE); ctx.fill(); }
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5; ctx.beginPath(); path(D.GRAT); ctx.stroke();
    ctx.globalAlpha = landAlpha; ctx.fillStyle = landColor; ctx.beginPath(); path(fine ? D.LAND : D.LAND110); ctx.fill();
    ctx.strokeStyle = borderColor; ctx.lineWidth = 1.2; ctx.beginPath(); path(fine ? D.BORDERS : D.BORDERS110); ctx.stroke();
    ctx.globalAlpha = 1;
    if (sphere) { ctx.strokeStyle = 'rgba(232,226,212,.25)'; ctx.lineWidth = 2; ctx.beginPath(); path(D.SPHERE); ctx.stroke(); }
  }

  function fillFeature(path, f, { color = C.accent, alpha = 1, stroke = null, width = 3 } = {}) {
    if (!f || alpha <= .001) return;
    ctx.globalAlpha = alpha;
    if (color) { ctx.fillStyle = color; ctx.beginPath(); path(f); ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.beginPath(); path(f); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }

  function headerBand({ solidH = SAFE.y0 + 265, fadeH = 115 } = {}) {
    const band = ctx.createLinearGradient(0, solidH, 0, solidH + fadeH);
    band.addColorStop(0, 'rgba(11,20,27,0.95)'); band.addColorStop(1, 'rgba(11,20,27,0)');
    ctx.fillStyle = 'rgba(11,20,27,0.95)'; ctx.fillRect(0, 0, W, solidH);
    ctx.fillStyle = band; ctx.fillRect(0, solidH, W, fadeH);
  }

  // Başlık yardımcıları (üst bant içinde, sağ güvenli alana otomatik sığar)
  const HX = SAFE.x0, HY = SAFE.y0 + 40;
  function heading(str, a, { sub = null, color = C.text, size = 76, subColor = C.mute, subSize = 50,
    maxW = SAFE.x1 - HX, dy = 0, tabular = false } = {}) {
    if (a <= .001) return;
    const fn = tabular ? textTab : text;
    fn(str, HX, HY + 80 + dy, size, { alpha: a, color, maxW });
    if (sub) text(sub, HX, HY + 80 + dy + size * .95, subSize, { weight: 600, color: subColor, alpha: a, maxW });
  }

  /** Çakışmasız sıralı başlık oynatıcısı: eski başlık biterken silinir, yenisi kesim anında aşağıdan net girer. */
  function headerSeq(t, items, { fadeOut = .12, fadeIn = .16, slide = 16 } = {}) {
    for (const it of items) {
      if (t < it.a || t >= it.b) continue;
      const inK = prog(t, it.a, Math.min(it.b, it.a + fadeIn));
      const outK = prog(t, Math.max(it.a, it.b - fadeOut), it.b);
      const aIn = it.noFadeIn ? 1 : lerp(.32, 1, ease.outCubic(inK));
      const aOut = it.noFadeOut ? 1 : 1 - outK;
      const a = Math.min(aIn, aOut);
      if (a <= .001) continue;
      const dy = (it.noFadeIn ? 0 : (1 - ease.outCubic(inK)) * slide) - (it.noFadeOut ? 0 : ease.inCubic(outK) * (slide * .6));
      if (typeof it.render === 'function') it.render(a, dy, inK, outK);
      else heading(typeof it.str === 'function' ? it.str(t) : it.str, a, {
        sub: typeof it.sub === 'function' ? it.sub(t) : it.sub,
        size: it.size || 74, subSize: it.subSize || 48, color: it.color || C.text,
        subColor: it.subColor || C.mute, dy, tabular: !!it.tabular,
      });
    }
  }

  // ── altyazı (kutu + kinetik V2) ──
  const CAP = { size: 54, lineH: 70, maxW: SAFE.x1 - SAFE.x0, y: SAFE.y1 - 168 };
  const KCAP = { size: 48, lineH: 60, maxLineW: (SAFE.x1 - SAFE.x0) - 64, maxChars: 28, y: SAFE.y1 - 74 };
  let CHUNKS = [], L = [], CAP_STYLE = 'box';

  function buildCaptions(skip, style = 'box') {
    CAP_STYLE = style || 'box';
    CHUNKS = [];
    if (CAP_STYLE === 'kinetic') {
      ctx.font = `700 ${KCAP.size}px ${SANS}`;
      const sp = ctx.measureText(' ').width;
      L.forEach((l, li) => {
        if (skip.includes(li)) return;
        const words = l.text.split(/\s+/).filter(Boolean), total = l.text.length, dur = Math.max(.05, l.end - l.start);
        let lines = [[]], lw = 0, chars = 0, chunkWords = [], acc = 0;
        const flush = () => {
          if (chunkWords.length) CHUNKS.push({ li, words: chunkWords, lines: lines.filter(x => x.length) });
          chunkWords = []; lines = [[]]; lw = 0; chars = 0;
        };
        for (const word of words) {
          const w = ctx.measureText(word).width;
          const forceBreak = chunkWords.length >= 2 && /[,;:.!?—…]$/.test(chunkWords[chunkWords.length - 1].word);
          if (forceBreak) flush();
          else if (lw && (lw + sp + w > KCAP.maxLineW || chars + word.length + 1 > KCAP.maxChars)) {
            if (lines.length >= 2 || chunkWords.length >= 5) flush();
            else { lines.push([]); lw = 0; chars = 0; }
          }
          const t0 = l.start + dur * acc / Math.max(1, total); acc += word.length + 1;
          const item = { word, w, t0, t1: l.start + dur * acc / Math.max(1, total) };
          lines[lines.length - 1].push(item); chunkWords.push(item);
          lw += (lw ? sp : 0) + w; chars += (chars ? 1 : 0) + word.length;
        }
        flush();
      });
    } else {
      ctx.font = `600 ${CAP.size}px ${SANS}`;
      const sp = ctx.measureText(' ').width;
      L.forEach((l, li) => {
        if (skip.includes(li)) return;
        const words = l.text.split(' '), total = l.text.length, dur = l.end - l.start;
        let lines = [[]], lw = 0, chunkWords = [], acc = 0;
        const flush = () => { if (chunkWords.length) CHUNKS.push({ li, words: chunkWords, lines: lines.filter(x => x.length) }); chunkWords = []; lines = [[]]; lw = 0; };
        for (const word of words) {
          const w = ctx.measureText(word).width;
          if (lw && lw + sp + w > CAP.maxW) { if (lines.length === 2) flush(); else { lines.push([]); lw = 0; } }
          const t0 = l.start + dur * acc / total; acc += word.length + 1;
          const item = { word, w, t0, t1: l.start + dur * acc / total };
          lines[lines.length - 1].push(item); chunkWords.push(item); lw += (lw ? sp : 0) + w;
        }
        flush();
      });
    }
    CHUNKS.forEach((c, i) => {
      const nextLineStart = L[c.li + 1] ? L[c.li + 1].start : Infinity;
      c.start = Math.max(0, c.words[0].t0 - .06);
      const next = CHUNKS[i + 1];
      c.end = next && next.li === c.li
        ? Math.max(c.start + .04, next.words[0].t0 - .02)
        : Math.min(L[c.li].end + .30, nextLineStart - .03);
      if (c.end <= c.start) c.end = c.start + .04;
      c.first = !CHUNKS[i - 1] || CHUNKS[i - 1].li !== c.li;
      c.last = !next || next.li !== c.li;
    });
  }

  function getCaptionLayout(t) {
    const c = CHUNKS.find(c => t >= c.start && t < c.end);
    if (!c) return null;
    const a = Math.min(c.first ? prog(t, c.start, c.start + .12) : 1, c.last ? 1 - prog(t, c.end - .12, c.end) : 1);
    if (a <= .001) return null;
    if (CAP_STYLE === 'kinetic') {
      ctx.font = `700 ${KCAP.size}px ${SANS}`;
      const sp = ctx.measureText(' ').width;
      const lineWidths = c.lines.map(ln => ln.reduce((s, w, i) => s + w.w + (i ? sp : 0), 0));
      const maxW = Math.max(...lineWidths);
      const padX = 24, padY = 14, boxW = Math.min(CAP.maxW, maxW + padX * 2);
      const boxH = c.lines.length * KCAP.lineH + padY * 2 - 10;
      const y0 = KCAP.y - (c.lines.length - 1) * KCAP.lineH;
      const cx = (SAFE.x0 + SAFE.x1) / 2;
      const bx = cx - boxW / 2, by = y0 - KCAP.size * .92 - padY + 4;
      return { c, a, style: 'kinetic', sp, y0, cx, bx, by, w: boxW, h: boxH, top: by, lineWidths };
    }
    ctx.font = `600 ${CAP.size}px ${SANS}`;
    const sp = ctx.measureText(' ').width, y0 = CAP.y - (c.lines.length - 1) * CAP.lineH;
    const bx = SAFE.x0 - 22, by = y0 - CAP.size - 6, w = CAP.maxW + 44, h = c.lines.length * CAP.lineH + 30;
    return { c, a, style: 'box', sp, y0, bx, by, w, h, top: by };
  }

  function drawCaption(layout) {
    if (!layout) return;
    const { c, a, style, sp, y0, bx, by, w, h } = layout;
    if (style === 'kinetic') {
      const kPop = ease.spring(prog(c.start === undefined ? 1 : (layout._t - c.start) / .14, 0, 1));
      const dy = c.first ? (1 - kPop) * 14 : 0;
      ctx.save();
      ctx.globalAlpha = .90 * a; ctx.fillStyle = C.bg;
      ctx.beginPath(); ctx.roundRect(bx, by + dy, Math.max(0, w), Math.max(0, h), 18); ctx.fill();
      ctx.strokeStyle = 'rgba(244,241,234,.16)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
      c.lines.forEach((ln, li) => {
        let x = layout.cx - layout.lineWidths[li] / 2;
        for (const wd of ln) {
          const active = layout._t >= wd.t0 && layout._t < wd.t1 + .05;
          const col = active ? C.accent : C.text;
          const wa = a * (layout._t >= wd.t0 ? 1 : .62);
          text(wd.word, x, y0 + dy + li * KCAP.lineH, KCAP.size, { weight: 700, alpha: wa, color: col });
          x += wd.w + sp;
        }
      });
      return;
    }
    ctx.globalAlpha = .9 * a; ctx.fillStyle = C.ocean;
    ctx.beginPath(); ctx.roundRect(bx, by, Math.max(0, w), Math.max(0, h), 18); ctx.fill();
    c.lines.forEach((ln, li) => {
      let x = SAFE.x0;
      for (const wd of ln) {
        const active = layout._t >= wd.t0 && layout._t < wd.t1 + .05;
        text(wd.word, x, y0 + li * CAP.lineH, CAP.size, { weight: 600, alpha: a * (layout._t >= wd.t0 ? 1 : .55), color: active ? C.accent : C.text });
        x += wd.w + sp;
      }
    });
  }

  // ── çok katmanlı ses sentezi ──
  let SOUNDS = [], SEED = 1;
  function createMaster(ac, dest) {
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -8; comp.knee.value = 12; comp.ratio.value = 4;
    comp.attack.value = .003; comp.release.value = .14;
    const out = ac.createGain(); out.gain.value = .84;
    comp.connect(out); out.connect(dest);
    return comp;
  }

  function synth(ac, s, dest) {
    const t0 = Math.max(0, s.t), g = ac.createGain(); g.connect(dest);
    const tone = (f, at, dur, gain, type = 'sine', fEnd = null) => {
      const o = ac.createOscillator(), e = ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(Math.max(20, f), at);
      if (fEnd) o.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), at + dur);
      e.gain.setValueAtTime(0, at); e.gain.linearRampToValueAtTime(gain, at + .006);
      e.gain.exponentialRampToValueAtTime(1e-4, at + Math.max(.02, dur));
      o.connect(e); e.connect(g); o.start(at); o.stop(at + dur + .05);
    };
    const noiseBuf = dur => {
      const len = Math.max(1, Math.floor(ac.sampleRate * dur)), buf = ac.createBuffer(1, len, ac.sampleRate);
      const ch = buf.getChannelData(0); let seed = (SEED + Math.round(t0 * 1000)) >>> 0;
      for (let i = 0; i < len; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; ch[i] = seed / 2147483648 - 1; }
      const src = ac.createBufferSource(); src.buffer = buf; return src;
    };

    if (s.type === 'ping') {
      tone(s.f || 880, t0, .9, s.gain); tone((s.f || 880) * 2, t0, .35, s.gain * .25);
    } else if (s.type === 'ping2') {
      tone(659, t0, 1.1, s.gain); tone(988, t0 + .14, 1.3, s.gain * .9); tone(1976, t0 + .14, .4, s.gain * .2);
    } else if (s.type === 'tick') {
      tone(s.f || 1500, t0, .065, s.gain);
    } else if (s.type === 'pop') {
      const f = s.f || 340;
      tone(f, t0, .075, s.gain, 'sine', f * 1.85);
    } else if (s.type === 'sub') {
      const dur = s.dur || .48;
      tone(s.f || 105, t0, dur, s.gain, 'sine', s.f1 || 38);
      tone((s.f || 105) * 1.5, t0, dur * .4, s.gain * .28, 'triangle', (s.f1 || 38) * 1.5);
    } else if (s.type === 'chime') {
      const notes = s.notes || [587.33, 880, 1174.66];
      notes.forEach((f, i) => tone(f, t0 + i * (s.step || .045), s.dur || .9, s.gain / Math.sqrt(notes.length)));
    } else if (s.type === 'pulse') {
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = s.cutoff || 380; lp.connect(g);
      const o = ac.createOscillator(), e = ac.createGain(), dur = s.dur || .28;
      o.type = s.wave || 'triangle'; o.frequency.setValueAtTime(s.f || 110, t0);
      e.gain.setValueAtTime(0, t0); e.gain.linearRampToValueAtTime(s.gain, t0 + .018);
      e.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
      o.connect(e); e.connect(lp); o.start(t0); o.stop(t0 + dur + .04);
    } else if (s.type === 'rise') {
      const dur = Math.max(.2, s.dur || 1.1);
      const src = noiseBuf(dur), f = ac.createBiquadFilter(), ng = ac.createGain();
      f.type = 'bandpass'; f.Q.value = 2.8;
      f.frequency.setValueAtTime(220, t0); f.frequency.exponentialRampToValueAtTime(2200, t0 + dur);
      ng.gain.setValueAtTime(0, t0); ng.gain.linearRampToValueAtTime(s.gain * .7, t0 + dur * .9); ng.gain.linearRampToValueAtTime(0, t0 + dur);
      src.connect(f); f.connect(ng); ng.connect(g); src.start(t0);
      tone(s.f0 || 220, t0, dur, s.gain * .45, 'sine', s.f1 || 440);
    } else if (s.type === 'drone') {
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = s.cutoff || 520; lp.connect(g);
      const root = s.f || 110;
      [[root, 'triangle'], [root * 1.498, 'sine'], [root * 2.004, 'sine']].forEach(([f, ty]) => {
        const o = ac.createOscillator(); o.type = ty; o.frequency.value = f; o.connect(lp); o.start(t0); o.stop(t0 + s.dur);
      });
      g.gain.setValueAtTime(s.gain, t0); g.gain.setValueAtTime(s.gain, t0 + Math.max(.06, s.dur - .05));
      g.gain.linearRampToValueAtTime(0, t0 + s.dur);
    } else if (s.type === 'whoosh') {
      const dur = Math.max(.1, s.dur || .4), src = noiseBuf(dur);
      const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 2;
      f.frequency.setValueAtTime(300, t0); f.frequency.exponentialRampToValueAtTime(2400, t0 + dur);
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(s.gain, t0 + dur * .8); g.gain.linearRampToValueAtTime(0, t0 + dur);
      src.connect(f); f.connect(g); src.start(t0);
    }
  }

  function wavBase64(buf) {
    const ch = buf.numberOfChannels, n = buf.length, bytes = 44 + n * ch * 2;
    const v = new DataView(new ArrayBuffer(bytes));
    const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    str(0, 'RIFF'); v.setUint32(4, bytes - 8, true); str(8, 'WAVE'); str(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, ch, true);
    v.setUint32(24, buf.sampleRate, true); v.setUint32(28, buf.sampleRate * ch * 2, true);
    v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * ch * 2, true);
    const data = [...Array(ch)].map((_, c) => buf.getChannelData(c));
    let o = 44;
    for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++, o += 2) v.setInt16(o, Math.max(-1, Math.min(1, data[c][i])) * 0x7fff, true);
    const u8 = new Uint8Array(v.buffer); let s = '';
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(s);
  }

  // ── çalıştırıcı ──
  function run(EP) {
    L = EP.vo.lines;
    const at = (i, k = 'start') => L[i] ? L[i][k] : 0;
    const DUR = EP.vo.duration;
    SEED = EP.seed || 7;
    let T = {}, SCENES = [], KEYS = [];
    const flat = !!EP.flat;

    function draw(t) { ctx.save(); try { frame(t); } finally { ctx.restore(); } }
    function frame(t) {
      t = clamp(t, 0, DUR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
      FRAME_BOXES = [];
      CAP_LAYOUT = NOCAP ? null : getCaptionLayout(t);
      if (CAP_LAYOUT) {
        CAP_LAYOUT._t = t;
        FRAME_BOXES.push({ x: CAP_LAYOUT.bx, y: CAP_LAYOUT.by, w: CAP_LAYOUT.w, h: CAP_LAYOUT.h });
      }
      const cam = camera(KEYS, t, flat);
      const pr = (EP.projection || (flat ? mercatorProjection : globeProjection))(cam);
      const path = d3.geoPath(pr, ctx);
      const g = { cam, pr, path, T, at, DUR, capTop: CAP_LAYOUT ? CAP_LAYOUT.top : SAFE.y1 - 20 };
      EP.draw(t, g);
      if (!NOHEAD) { headerBand(); EP.header(t, g); }
      if (!NOCAP) drawCaption(CAP_LAYOUT);
      if (GUIDES) {
        ctx.fillStyle = 'rgba(255,0,80,.12)';
        ctx.fillRect(0, 0, W, SAFE.y0); ctx.fillRect(0, SAFE.y1, W, H - SAFE.y1); ctx.fillRect(SAFE.x1, 0, W - SAFE.x1, H);
      }
    }

    let current = 0;
    window.__duration = DUR; window.__fps = FPS; window.__size = { width: W, height: H };
    window.__cover = EP.cover || 0;
    window.__setTime = t => { current = t; draw(t); };
    window.__renderAudio = async () => {
      if (!SOUNDS.length) return null;
      const sr = 48000, ac = new OfflineAudioContext(2, Math.ceil(sr * DUR), sr);
      const m = createMaster(ac, ac.destination);
      SOUNDS.forEach(s => synth(ac, s, m));
      return wavBase64(await ac.startRendering());
    };
    window.__ready = Promise.all([
      ...FONTS.map(f => document.fonts.load(f, GLYPHS).catch(() => null)),
      loadData(),
      window.IKON ? window.IKON.hazirla(EP.ikonlar || []) : null,
    ])
      .then(() => document.fonts.ready)
      .then(() => EP.init ? EP.init(D) : null)
      .then(() => {
        T = EP.times(L, at, DUR); SCENES = EP.scenes(T, at, DUR); KEYS = EP.keys(T, at, DUR);
        window.__scenes = SCENES;
        buildCaptions(EP.captionSkip || [], EP.captionStyle || 'box');
        const baseBed = EP.drone === false ? [] : [
          typeof EP.drone === 'object' ? { t: 0, type: 'drone', dur: DUR, gain: .025, ...EP.drone } : { t: 0, type: 'drone', dur: DUR, gain: .025 },
        ];
        SOUNDS = [...baseBed, ...EP.sounds(T, at, DUR)];
      });

    // oynatıcı
    const voEl = document.getElementById('vo');
    let playing = false, startWall = 0, ac = null;
    const sceneName = t => (SCENES.find(s => t < s.end) || SCENES[SCENES.length - 1] || { name: '' }).name;
    function hud() { const el = document.getElementById('hud'); if (el) el.textContent = `${current.toFixed(2)} sn · kare ${Math.round(current * FPS)} · ${sceneName(current)}` + (playing ? '' : '  (tıkla: oynat · ←/→ kare)'); }
    function play() {
      playing = true; startWall = performance.now() - current * 1000;
      if (!ac) ac = new AudioContext(); ac.resume();
      const base = ac.currentTime - current, out = createMaster(ac, ac.destination);
      SOUNDS.forEach(s => { if (s.t + (s.dur || .8) >= current) synth(ac, { ...s, t: Math.max(base + s.t, ac.currentTime) }, out); });
      play.out = out;
      try { voEl.currentTime = current; voEl.play(); } catch (e) {}
      requestAnimationFrame(loop);
    }
    function pause() { playing = false; if (play.out) play.out.disconnect(); try { voEl.pause(); } catch (e) {} }
    function loop(now) {
      if (!playing) return;
      const t = (now - startWall) / 1000;
      if (t >= DUR) { pause(); current = 0; play(); return; }
      window.__setTime(t); hud(); requestAnimationFrame(loop);
    }
    function step(dt) { pause(); window.__setTime(clamp(current + dt, 0, DUR)); hud(); }
    window.__ready.then(() => {
      const qt = params.get('t');
      if (qt !== null) { window.__setTime(parseFloat(qt) || 0); hud(); return; }
      window.__setTime(0); hud();
      if (RENDER) return;
      canvas.addEventListener('click', () => playing ? pause() : play());
      addEventListener('keydown', e => {
        if (e.key === ' ') { e.preventDefault(); playing ? pause() : play(); }
        if (e.key === 'ArrowRight') step(e.shiftKey ? 1 : 1 / FPS);
        if (e.key === 'ArrowLeft') step(e.shiftKey ? -1 : -1 / FPS);
      });
    });
  }

  window.HYS = {
    run, camera, W, H, C, SANS, MONO, SAFE, GLOBE, RAD, R_EARTH, D, ctx,
    clamp, lerp, prog, win, ease, km, fmtNum,
    text, textTab, wrapLines, label, pin, line, greatCircle, tracer, arrow, meter, statPill, vignette,
    baseMap, fillFeature, headerBand, heading, headerSeq, visible, globeProjection, mercatorProjection,
  };
})();
