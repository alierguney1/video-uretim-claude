// Harita Yalan Söyler — seri motoru.
// Bölüm dosyası sadece hikâyeyi yazar (sahneler, kamera, çizim, ses); render sözleşmesi, harita verisi,
// altyazı, etiket, işaret, ses sentezi ve oynatıcı buradadır. Bölüm 1 bu motordan önce yazıldı ve
// kendi içinde tek dosyadır; 2. bölümden itibaren bölümler bu dosyayı kullanır.
//
// Kullanım (bölüm dosyasında, d3/topojson CDN script'lerinden ve bu dosyadan sonra):
//   HYS.run({ vo: VO, cover, times(L), scenes(T), keys(T), flat?, projection?(cam), init?(D),
//             draw(t, g), header(t, g), sounds(T), captionSkip?: [indeks] })
'use strict';
(function () {
  const W = 1080, H = 1920, FPS = 60;
  const C = { bg: '#0B141B', ocean: '#0F1C26', land: '#E8E2D4', text: '#F4F1EA', mute: '#8FA1AD', accent: '#FF6B2C', grid: 'rgba(232,226,212,.10)' };
  const SANS = 'Inter, system-ui, sans-serif', MONO = '"IBM Plex Mono", ui-monospace, monospace';
  const FONTS = ['800 10px Inter', '600 10px Inter', '500 10px "IBM Plex Mono"'];
  const GLYPHS = 'AaİıŞşĞğÜüÖöÇç0123456789%.,:°′…’→×';
  const SAFE = { x0: W * .08, x1: W * .88, y0: H * .12, y1: H * .80 };
  const GLOBE = { cx: W * .5, cy: H * .53, r: W * .42 };
  const RAD = Math.PI / 180, R_EARTH = 6371.0088;

  // ── yardımcılar ──
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, a, b) => b <= a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a));
  const win = (t, a, b, f = .3) => Math.min(prog(t, a, a + f), 1 - prog(t, b - f, b));   // aralıkta görünür
  const ease = {
    outCubic: k => 1 - Math.pow(1 - k, 3),
    inOutCubic: k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
    inOutSine: k => -(Math.cos(Math.PI * k) - 1) / 2,
  };
  const km = (a, b) => d3.geoDistance(a, b) * R_EARTH;
  const fmtNum = (v, d = 0) => v.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });

  // ── kanvas ──
  const params = new URLSearchParams(location.search);
  const RENDER = params.has('render'), GUIDES = params.has('guides');
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
  // Mercator: k=1 iken dünya genişliği = W
  const mercatorProjection = cam => d3.geoMercator().scale(W / (2 * Math.PI) * cam.k).center([cam.lon, cam.lat])
    .translate([W / 2, GLOBE.cy]).precision(.3);
  const visible = (cam, p) => d3.geoDistance([cam.lon, cam.lat], p) < Math.PI / 2 - .02;

  // ── çizim yardımcıları ──
  function text(str, x, y, size, { font = SANS, weight = 800, color = C.text, alpha = 1, align = 'left' } = {}) {
    if (alpha <= .001) return 0;
    ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.textAlign = align;
    ctx.font = `${weight} ${size}px ${font}`; ctx.fillText(str, x, y);
    const w = ctx.measureText(str).width; ctx.globalAlpha = 1; ctx.textAlign = 'left';
    return w;
  }
  function label(str, x, y, { size = 46, font = MONO, weight = 500, color = C.text, alpha = 1, dx = 28, dy = -24 } = {}) {
    if (alpha <= .001) return;
    ctx.font = `${weight} ${size}px ${font}`;
    const w = ctx.measureText(str).width, padX = 14, h = size * 1.25;
    let lx = x + dx, ly = y + dy;
    if (lx + w + padX > SAFE.x1) lx = x - Math.abs(dx) - w;
    lx = clamp(lx, SAFE.x0, SAFE.x1 - w - padX);
    ly = clamp(ly, SAFE.y0 + 260 + h, SAFE.y1 - 230);
    ctx.globalAlpha = alpha * .92; ctx.fillStyle = C.ocean;
    ctx.beginPath(); ctx.roundRect(lx - padX, ly - size * .95, w + padX * 2, h, 10); ctx.fill();
    ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.fillText(str, lx, ly);
    ctx.globalAlpha = 1;
  }
  function pin(xy, { color = C.land, r = 13, alpha = 1, pulse = 0 } = {}) {
    if (!xy || alpha <= .001) return;
    const [x, y] = xy;
    if (pulse > 0) {
      ctx.globalAlpha = alpha * (1 - pulse) * .7; ctx.strokeStyle = color; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(x, y, r + pulse * 46, 0, 2 * Math.PI); ctx.stroke();
    }
    ctx.globalAlpha = alpha; ctx.fillStyle = C.ocean;
    ctx.beginPath(); ctx.arc(x, y, r + 5, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
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
  const greatCircle = (a, b, k = 1, n = 96) => { const ip = d3.geoInterpolate(a, b); return Array.from({ length: n + 1 }, (_, i) => ip(k * i / n)); };
  function baseMap(path, { landAlpha = 1, fine = true, sphere = true } = {}) {
    if (sphere) { ctx.fillStyle = C.ocean; ctx.beginPath(); path(D.SPHERE); ctx.fill(); }
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5; ctx.beginPath(); path(D.GRAT); ctx.stroke();
    ctx.globalAlpha = landAlpha; ctx.fillStyle = C.land; ctx.beginPath(); path(fine ? D.LAND : D.LAND110); ctx.fill();
    ctx.strokeStyle = 'rgba(15,28,38,.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); path(fine ? D.BORDERS : D.BORDERS110); ctx.stroke();
    ctx.globalAlpha = 1;
    if (sphere) { ctx.strokeStyle = 'rgba(232,226,212,.25)'; ctx.lineWidth = 2; ctx.beginPath(); path(D.SPHERE); ctx.stroke(); }
  }
  function fillFeature(path, f, { color = C.accent, alpha = 1, stroke = null, width = 3 } = {}) {
    if (alpha <= .001) return;
    ctx.globalAlpha = alpha;
    if (color) { ctx.fillStyle = color; ctx.beginPath(); path(f); ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.beginPath(); path(f); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function headerBand() {
    const band = ctx.createLinearGradient(0, SAFE.y0 + 250, 0, SAFE.y0 + 340);
    band.addColorStop(0, 'rgba(11,20,27,0.94)'); band.addColorStop(1, 'rgba(11,20,27,0)');
    ctx.fillStyle = 'rgba(11,20,27,0.94)'; ctx.fillRect(0, 0, W, SAFE.y0 + 250);
    ctx.fillStyle = band; ctx.fillRect(0, SAFE.y0 + 250, W, 90);
  }
  // Başlık yardımcıları (üst bant içinde)
  const HX = SAFE.x0, HY = SAFE.y0 + 40;
  function heading(str, a, { sub = null, color = C.text, size = 76, subColor = C.mute } = {}) {
    text(str, HX, HY + 80, size, { alpha: a, color });
    if (sub) text(sub, HX, HY + 80 + size * .95, 50, { weight: 600, color: subColor, alpha: a });
  }

  // ── altyazı ──
  const CAP = { size: 54, lineH: 70, maxW: SAFE.x1 - SAFE.x0, y: SAFE.y1 - 168 };
  let CHUNKS = [], L = [];
  function buildCaptions(skip) {
    ctx.font = `600 ${CAP.size}px ${SANS}`;
    const sp = ctx.measureText(' ').width;
    CHUNKS = [];
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
    CHUNKS.forEach((c, i) => {
      c.start = c.words[0].t0 - .08;
      const next = CHUNKS[i + 1];
      c.end = next && next.li === c.li ? next.words[0].t0 - .08 : L[c.li].end + .35;
      c.first = !CHUNKS[i - 1] || CHUNKS[i - 1].li !== c.li;
      c.last = !next || next.li !== c.li;
    });
  }
  function drawCaption(t) {
    const c = CHUNKS.find(c => t >= c.start && t < c.end);
    if (!c) return;
    const a = Math.min(c.first ? prog(t, c.start, c.start + .12) : 1, c.last ? 1 - prog(t, c.end - .12, c.end) : 1);
    ctx.font = `600 ${CAP.size}px ${SANS}`;
    const sp = ctx.measureText(' ').width, y0 = CAP.y - (c.lines.length - 1) * CAP.lineH;
    ctx.globalAlpha = .9 * a; ctx.fillStyle = C.ocean;
    ctx.beginPath(); ctx.roundRect(SAFE.x0 - 22, y0 - CAP.size - 6, CAP.maxW + 44, c.lines.length * CAP.lineH + 30, 18); ctx.fill();
    c.lines.forEach((ln, li) => {
      let x = SAFE.x0;
      for (const w of ln) {
        const active = t >= w.t0 && t < w.t1 + .05;
        text(w.word, x, y0 + li * CAP.lineH, CAP.size, { weight: 600, alpha: a * (t >= w.t0 ? 1 : .55), color: active ? C.accent : C.text });
        x += w.w + sp;
      }
    });
  }

  // ── ses ──
  let SOUNDS = [], SEED = 1;
  function synth(ac, s, dest) {
    const t0 = s.t, g = ac.createGain(); g.connect(dest);
    const tone = (f, at, dur, gain, type = 'sine') => {
      const o = ac.createOscillator(), e = ac.createGain(); o.type = type; o.frequency.value = f;
      e.gain.setValueAtTime(0, at); e.gain.linearRampToValueAtTime(gain, at + .008);
      e.gain.exponentialRampToValueAtTime(1e-4, at + dur);
      o.connect(e); e.connect(g); o.start(at); o.stop(at + dur + .05);
    };
    if (s.type === 'ping') { tone(s.f || 880, t0, .9, s.gain); tone((s.f || 880) * 2, t0, .35, s.gain * .25); }
    else if (s.type === 'ping2') { tone(659, t0, 1.1, s.gain); tone(988, t0 + .14, 1.3, s.gain * .9); tone(1976, t0 + .14, .4, s.gain * .2); }
    else if (s.type === 'tick') { tone(s.f || 1500, t0, .07, s.gain); }
    else if (s.type === 'drone') {
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520; lp.connect(g);
      [[110, 'triangle'], [164.81, 'sine'], [220.5, 'sine']].forEach(([f, ty]) => {
        const o = ac.createOscillator(); o.type = ty; o.frequency.value = f; o.connect(lp); o.start(t0); o.stop(t0 + s.dur); });
      g.gain.setValueAtTime(s.gain, t0); g.gain.setValueAtTime(s.gain, t0 + s.dur - .05); g.gain.linearRampToValueAtTime(0, t0 + s.dur);
    } else if (s.type === 'whoosh') {
      const len = Math.max(1, Math.floor(ac.sampleRate * s.dur)), buf = ac.createBuffer(1, len, ac.sampleRate);
      const ch = buf.getChannelData(0); let seed = SEED + Math.round(t0 * 1000);
      for (let i = 0; i < len; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; ch[i] = seed / 2147483648 - 1; }
      const src = ac.createBufferSource(); src.buffer = buf;
      const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 2;
      f.frequency.setValueAtTime(300, t0); f.frequency.exponentialRampToValueAtTime(2400, t0 + s.dur);
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(s.gain, t0 + s.dur * .8); g.gain.linearRampToValueAtTime(0, t0 + s.dur);
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
      const cam = camera(KEYS, t, flat);
      const pr = (EP.projection || (flat ? mercatorProjection : globeProjection))(cam);
      const path = d3.geoPath(pr, ctx);
      const g = { cam, pr, path, T, at, DUR };
      EP.draw(t, g);
      headerBand();
      EP.header(t, g);
      drawCaption(t);
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
      const m = ac.createGain(); m.gain.value = .8; m.connect(ac.destination);
      SOUNDS.forEach(s => synth(ac, s, m));
      return wavBase64(await ac.startRendering());
    };
    window.__ready = Promise.all([...FONTS.map(f => document.fonts.load(f, GLYPHS).catch(() => null)), loadData()])
      .then(() => document.fonts.ready)
      .then(() => EP.init ? EP.init(D) : null)
      .then(() => {
        T = EP.times(L, at, DUR); SCENES = EP.scenes(T, at, DUR); KEYS = EP.keys(T, at, DUR);
        window.__scenes = SCENES;
        buildCaptions(EP.captionSkip || []);
        SOUNDS = [{ t: 0, type: 'drone', dur: DUR, gain: .025 }, ...EP.sounds(T, at, DUR)];
      });

    // oynatıcı
    const voEl = document.getElementById('vo');
    let playing = false, startWall = 0, ac = null;
    const sceneName = t => (SCENES.find(s => t < s.end) || SCENES[SCENES.length - 1] || { name: '' }).name;
    function hud() { const el = document.getElementById('hud'); if (el) el.textContent = `${current.toFixed(2)} sn · kare ${Math.round(current * FPS)} · ${sceneName(current)}` + (playing ? '' : '  (tıkla: oynat · ←/→ kare)'); }
    function play() {
      playing = true; startWall = performance.now() - current * 1000;
      if (!ac) ac = new AudioContext(); ac.resume();
      const base = ac.currentTime - current, out = ac.createGain(); out.gain.value = .8; out.connect(ac.destination);
      SOUNDS.forEach(s => { if (s.t + (s.dur || 0) >= current) synth(ac, { ...s, t: Math.max(base + s.t, ac.currentTime) }, out); });
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

  window.HYS = { run, W, H, C, SANS, MONO, SAFE, GLOBE, RAD, R_EARTH, D, ctx,
    clamp, lerp, prog, win, ease, km, fmtNum, text, label, pin, line, greatCircle, baseMap, fillFeature,
    heading, visible, globeProjection, mercatorProjection };
})();
