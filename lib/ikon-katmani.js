// İkon katmanı: haritaya ülke bayrağı ve il ikonu (çıkartma görünümünde) koyar.
// Her şey t'nin saf fonksiyonu; durum yok. Önbellek sadece hazırlanmış görüntü tutar (çıktıyı değiştirmez).
//
// Sırayla ekle (harita-motoru'ndan önce ya da sonra fark etmez):
//   <script src="../lib/ikonlar.js"></script>      kendi çizimimiz ikonlar + 81 il eşlemesi
//   <script src="../lib/ikon-seti.js"></script>    Fluent Emoji Flat + bayraklar (MIT, üretilir)
//   <script src="../lib/iller.js"></script>        il sınırları + ikon noktaları (il haritası gerekiyorsa)
//   <script src="../lib/ikon-katmani.js"></script>
// harita-motoru.js, IKON varsa __ready'den önce IKON.hazirla()'yı kendisi bekler. Başka sayfada:
//   window.__ready = Promise.all([..., IKON.hazirla()])
//
// API (ctx = 2D bağlam, x/y = piksel, boyut = piksel):
//   IKON.ciz(ctx, anahtar, x, y, boyut, {alpha, olcek, aci, bicim:'cikartma'|'rozet'|'yalin'})
//   IKON.bayrak(ctx, 'gr', x, y, yukseklik, {alpha, olcek, aci, bicim:'kart'|'daire'|'direk', dalga: t})
//   IKON.etiket(ctx, 'Rize · çay', x, y, {boyut, alpha, renk})
//   IKON.pop(t, t0, sure) → {olcek, alpha, aci}    giriş: hafif taşma + düzelen dönüş (olayın kendisi)
//   IKON.zipla(t, t0, sure) → {dy, olcek}          konuşmada adı geçince bir kez zıplat
//   IKON.il('Rize' | 53) → {plaka, ad, ikon, etiket, merkez, nokta}
//   IKON.ilIkonu(ctx, il, projeksiyon, boyut, {t, t0, etiket, ...})
//   IKON.iller81(ctx, projeksiyon, t, {t0, aralik, boyut, sira})   81 ikon plaka sırasıyla düşer (durdur-bul karesi)
//   IKON.ulke('gr') → {kod, no, ad}   no = world-atlas id (ISO sayısal); IKON.ulkeBul(D.COUNTRIES, 'gr')
'use strict';
(function () {
  const SET = window.IKON_SETI || { emoji: {}, bayrak: {}, ulke: {} };
  const OZEL = window.IKON_OZEL || {}, BOZEL = window.BAYRAK_OZEL || {}, UOZEL = window.ULKE_OZEL || {};
  const PAPER = '#F4F1EA', INK = '#0F1C26', SANS = 'Inter, system-ui, sans-serif';
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const prog = (t, a, b) => b <= a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a));

  // ── yükleme ──
  const IMG = {};                                   // svg anahtarı → HTMLImageElement
  const svgFor = k => k.startsWith('f:') ? SET.emoji[k.slice(2)] : k.startsWith('b:') ? (BOZEL[k.slice(2)] || SET.bayrak[k.slice(2)]) : OZEL[k];
  function load(k) {
    if (IMG[k]) return IMG[k].ready;
    const svg = svgFor(k);
    if (!svg) return Promise.reject(new Error('İkon yok: ' + k));
    const img = new Image();
    img.ready = new Promise((res, rej) => { img.onload = () => res(img); img.onerror = () => rej(new Error('İkon çizilemedi: ' + k)); });
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    IMG[k] = img;
    return img.ready.then(() => img.decode ? img.decode().catch(() => null) : null);
  }
  const layersOf = ikon => Array.isArray(ikon) ? ikon.map((l, i) => i === 0 ? [l, 0, 0, 1] : l) : [[ikon, 0, 0, 1]];
  /** Tüm il ikonlarını, kendi çizimlerimizi, emoji ve bayrakları yükler. ekstra: ['f:camel', 'b:jp', …] */
  function hazirla(ekstra = []) {
    const keys = new Set([...Object.keys(OZEL), ...Object.keys(SET.emoji).map(k => 'f:' + k),
      ...Object.keys(SET.bayrak).map(k => 'b:' + k), ...Object.keys(BOZEL).map(k => 'b:' + k), ...ekstra]);
    (window.IL_IKON || []).forEach(r => layersOf(r[2]).forEach(l => keys.add(l[0])));
    return Promise.all([...keys].map(load)).then(() => true);
  }

  // ── çıkartma (die-cut sticker): ikonun etrafında kâğıt beyazı kenar + ince koyu dış çizgi ──
  const CACHE = new Map();
  function silhouette(src, color) {
    const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
    const x = c.getContext('2d'); x.drawImage(src, 0, 0);
    x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
    return c;
  }
  function build(ikon, px, bicim) {
    const id = JSON.stringify(ikon) + '|' + px + '|' + bicim;
    if (CACHE.has(id)) return CACHE.get(id);
    const pad = Math.ceil(px * .16), S = px + pad * 2;
    const art = document.createElement('canvas'); art.width = art.height = S;
    const a = art.getContext('2d');
    for (const [k, dx, dy, s] of layersOf(ikon)) {
      const img = IMG[k]; if (!img || !img.complete) continue;
      const w = px * s, u = px / 32;
      a.drawImage(img, pad + (px - w) / 2 + dx * u, pad + (px - w) / 2 + dy * u, w, w);
    }
    let out = art;
    if (bicim === 'cikartma') {
      out = document.createElement('canvas'); out.width = out.height = S;
      const o = out.getContext('2d'), r1 = Math.max(2, px * .075), r2 = r1 + Math.max(1.5, px * .03);
      const dark = silhouette(art, INK), light = silhouette(art, PAPER);
      for (const [img, r] of [[dark, r2], [light, r1]])
        for (let i = 0; i < 24; i++) { const q = i / 24 * Math.PI * 2; o.drawImage(img, Math.cos(q) * r, Math.sin(q) * r); }
      o.drawImage(art, 0, 0);
    }
    const res = { canvas: out, pad, px };
    CACHE.set(id, res);
    return res;
  }
  const dprOf = ctx => { const m = ctx.getTransform(); return Math.hypot(m.a, m.b) || 1; };

  function ciz(ctx, ikon, x, y, boyut, { alpha = 1, olcek = 1, aci = 0, bicim = 'cikartma', dy = 0 } = {}) {
    if (alpha <= .001 || olcek <= .001 || !(boyut > 0)) return;
    const px = Math.max(8, Math.ceil(boyut * dprOf(ctx) / 8) * 8);
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(x, y + dy); ctx.rotate(aci); ctx.scale(olcek, olcek);
    if (bicim === 'rozet') {
      const r = boyut * .66;
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, r + Math.max(2, boyut * .04), 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(0, 0, r, 0, 2 * Math.PI); ctx.fill();
    }
    const b = build(ikon, px, bicim === 'cikartma' ? 'cikartma' : 'yalin'), k = boyut / b.px, S = b.canvas.width * k;
    ctx.drawImage(b.canvas, -S / 2, -S / 2, S, S);
    ctx.restore();
  }

  // ── bayrak ──
  // SVG'nin iç boyutu tarayıcıya göre değişebilir; dilimlemeden önce sabit 640x480 tuvale bas
  const FLAG = {};
  function flagRaster(kod) {
    if (FLAG[kod]) return FLAG[kod];
    const img = IMG['b:' + kod]; if (!img || !img.complete) return null;
    const c = document.createElement('canvas'); c.width = 640; c.height = 480;
    c.getContext('2d').drawImage(img, 0, 0, 640, 480);
    return (FLAG[kod] = c);
  }
  function bayrak(ctx, kod, x, y, h, { alpha = 1, olcek = 1, aci = 0, bicim = 'kart', dalga = null } = {}) {
    const img = flagRaster(kod);
    if (!img || alpha <= .001 || olcek <= .001) return;
    const w = h * 4 / 3, ring = Math.max(2, h * .07);
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(x, y); ctx.rotate(aci); ctx.scale(olcek, olcek);
    if (bicim === 'daire') {
      const r = h / 2;
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, r + ring * 1.6, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(0, 0, r + ring, 0, 2 * Math.PI); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, r, 0, 2 * Math.PI); ctx.clip();
      ctx.drawImage(img, -r * 4 / 3, -r, r * 8 / 3, r * 2);
    } else if (bicim === 'direk') {
      // Haritaya saplanmış bayrak: (x, y) direğin ucu yere değdiği nokta
      const H = h * 1.9, pw = Math.max(2, h * .07);
      ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(0, 0, h * .22, h * .08, 0, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = PAPER; ctx.fillRect(-pw / 2 - 1.5, -H - 1.5, pw + 3, H + 1.5);
      ctx.fillStyle = INK; ctx.fillRect(-pw / 2, -H, pw, H);
      ctx.beginPath(); ctx.arc(0, -H, pw * 1.1, 0, 2 * Math.PI); ctx.fill();
      const fx = pw / 2, fy = -H + pw * .6, N = 24;
      const off = i => dalga === null ? 0 : Math.sin(dalga * 5 - i / N * 5) * h * .05 * (i / N);
      ctx.fillStyle = INK;
      for (let i = 0; i < N; i++) ctx.fillRect(fx + w * i / N, fy + off(i) - 2, w / N + 1, h + 4);
      ctx.fillRect(fx + w - 1, fy + off(N - 1) - 2, 3, h + 4);
      for (let i = 0; i < N; i++) {
        const sx = 640 * i / N, sw = 640 / N;
        ctx.drawImage(img, sx, 0, sw, 480, fx + w * i / N, fy + off(i), w / N + .6, h);
      }
    } else {
      const r = h * .12;
      ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(-w / 2 - ring * 1.6, -h / 2 - ring * 1.6, w + ring * 3.2, h + ring * 3.2, r + ring * 1.6); ctx.fill();
      ctx.fillStyle = PAPER; ctx.beginPath(); ctx.roundRect(-w / 2 - ring, -h / 2 - ring, w + ring * 2, h + ring * 2, r + ring); ctx.fill();
      ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, r); ctx.clip();
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
    }
    ctx.restore();
  }

  // ── etiket ──
  function etiket(ctx, str, x, y, { boyut = 34, alpha = 1, renk = PAPER, zemin = INK, agirlik = 600, hiza = 'center', alan = null } = {}) {
    if (alpha <= .001 || !str) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = `${agirlik} ${boyut}px ${SANS}`;
    const w = ctx.measureText(str).width, px = boyut * .45, h = boyut * 1.32;
    let x0 = hiza === 'center' ? x - w / 2 : hiza === 'right' ? x - w : x;
    const A = alan || (window.HYS && HYS.SAFE);                        // güvenli alanın dışına taşmasın
    if (A) x0 = clamp(x0, A.x0 + px, A.x1 - px - w);
    ctx.fillStyle = zemin; ctx.beginPath(); ctx.roundRect(x0 - px, y - h / 2, w + px * 2, h, h / 2); ctx.fill();
    ctx.fillStyle = renk; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(str, x0, y + boyut * .04);
    ctx.restore();
  }

  // ── hareket ──
  const outBack = (k, c = 1.5) => 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2);
  function pop(t, t0, sure = .42) {
    const k = prog(t, t0, t0 + sure);
    return { olcek: Math.max(0, k <= 0 ? 0 : outBack(k)), alpha: clamp(k * 4), aci: (1 - (1 - Math.pow(1 - k, 3))) * -.28 };
  }
  function zipla(t, t0, sure = .5) {
    const k = prog(t, t0, t0 + sure);
    if (k <= 0 || k >= 1) return { dy: 0, olcek: 1 };
    return { dy: -Math.sin(Math.PI * k), olcek: 1 + .08 * Math.sin(Math.PI * k) };
  }

  // ── il ──
  const IL = (window.IL_IKON || []).map(([plaka, ad, ikon, etk]) => ({ plaka, ad, ikon, etiket: etk }));
  if (window.ILLER) {
    const geos = window.ILLER.topo.objects.iller.geometries;
    IL.forEach(i => {
      const g = geos.find(g => g.properties.ad === i.ad);
      i.merkez = g ? g.properties.merkez : null;
      i.nokta = window.ILLER.nokta[i.ad] || i.merkez;
    });
  }
  const il = q => IL.find(i => i.plaka === q || i.ad === q) || null;
  let FEATS = null;
  function ilSekilleri() {
    if (!FEATS && window.ILLER && window.topojson) FEATS = topojson.feature(ILLER.topo, ILLER.topo.objects.iller).features;
    return FEATS || [];
  }
  function ilIkonu(ctx, q, pr, boyut, { t = 1, t0 = 0, etiket: etk = false, etiketBoyut = 30, alpha = 1, bicim = 'cikartma', merkez = false } = {}) {
    const i = typeof q === 'object' ? q : il(q);
    if (!i) return;
    const xy = pr(merkez ? i.merkez : i.nokta);
    if (!xy) return;
    const p = pop(t, t0);
    ciz(ctx, i.ikon, xy[0], xy[1], boyut, { alpha: alpha * p.alpha, olcek: p.olcek, aci: p.aci, bicim });
    if (etk) etiket(ctx, etk === true ? i.etiket : etk, xy[0], xy[1] + boyut * .72 + etiketBoyut * .7, { boyut: etiketBoyut, alpha: alpha * p.alpha });
  }
  /** 81 ikon sırayla düşer. sira: plaka dizisi (varsayılan 1..81). */
  function iller81(ctx, pr, t, { t0 = 0, aralik = .035, boyut = 44, sira = null, alpha = 1 } = {}) {
    const order = sira || IL.map(i => i.plaka);
    order.forEach((pl, n) => ilIkonu(ctx, pl, pr, boyut, { t, t0: t0 + n * aralik, alpha }));
  }

  // ── ülke ──
  function ulke(kod) {
    kod = kod.toLowerCase();
    const u = UOZEL[kod] || SET.ulke[kod];
    return u ? { kod, no: u[0], ad: u[1] } : null;
  }
  const ulkeBul = (features, kod) => { const u = ulke(kod); return u && u.no ? features.find(f => f.id === u.no) || null : null; };

  window.IKON = { hazirla, ciz, bayrak, etiket, pop, zipla, il, IL, ilSekilleri, ilIkonu, iller81, ulke, ulkeBul, PAPER, INK };
})();
