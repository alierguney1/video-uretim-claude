// Ortak ses motoru (iki seri de kullanabilir). Rehber: docs/ses-rehberi.md
//
// Üç kaynak, tek olay listesi (SOUNDS):
//   1. ZzFX ön ayarları  { t, tur: 'zzfx', ad: 'blip' }          8-bit efekt, koddan (MIT, Frank Force)
//   2. Kod sentezi        { t, tur: 'yukselis', dur: 1 }           yükseliş, darbe, whoosh, ortam (dalga, rüzgâr…)
//   3. Kütüphane dosyası  { t, tur: 'dosya', ad: 'kapi-ac' }       ses/kutuphane (Kenney, CC0); render'da FFmpeg karıştırır
// Ortak alanlar: gain (0..1), pan (-1..1), yatak: true (ortam/altlık: seslendirme konuşurken kısılır).
//
// Determinizm: rastgelelik tohumlu (mulberry32); ZzFX'in randomness parametresi yok sayılır.
// Sayfada: <script src="…/ses/kutuphane/katalog.js"></script> (dosya adları için) ve bu dosya.
'use strict';
(function () {
  const PI2 = Math.PI * 2;
  function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const hash = n => { let h = (n | 0) ^ 0x9E3779B9; h = Math.imul(h ^ h >>> 16, 0x85EBCA6B); h = Math.imul(h ^ h >>> 13, 0xC2B2AE35); return (h ^ h >>> 16) >>> 0; };

  /*
    ZzFX - Zuper Zmall Zound Zynth v1.3.0 — MIT License — Copyright (c) 2019 Frank Force
    https://github.com/KilledByAPixel/ZzFX
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
    associated documentation files (the "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
    following conditions: The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
    ANY KIND, EXPRESS OR IMPLIED.
    Değişiklik: randomness yok sayılır (Math.random kaldırıldı), örnekleme hızı parametre, master ses 1.
  */
  function zzfx(sr, volume = 1, randomness = 0, frequency = 220, attack = 0, sustain = 0, release = .1, shape = 0, shapeCurve = 1,
    slide = 0, deltaSlide = 0, pitchJump = 0, pitchJumpTime = 0, repeatTime = 0, noise = 0, modulation = 0, bitCrush = 0,
    delay = 0, sustainVolume = 1, decay = 0, tremolo = 0, filter = 0) {
    const sign = v => v < 0 ? -1 : 1;
    let startSlide = slide *= 500 * PI2 / sr / sr, startFrequency = frequency *= PI2 / sr,
      b = [], t = 0, tm = 0, i = 0, j = 1, r = 0, c = 0, s = 0, f, length;
    const quality = 2, w = PI2 * Math.abs(filter) * 2 / sr, cos = Math.cos(w), alpha = Math.sin(w) / 2 / quality,
      a0 = 1 + alpha, a1 = -2 * cos / a0, a2 = (1 - alpha) / a0, b0 = (1 + sign(filter) * cos) / 2 / a0,
      b1 = -(sign(filter) + cos) / a0, b2 = b0;
    let x2 = 0, x1 = 0, y2 = 0, y1 = 0;
    attack = attack * sr + 9; decay *= sr; sustain *= sr; release *= sr; delay *= sr;
    deltaSlide *= 500 * PI2 / sr ** 3; modulation *= PI2 / sr; pitchJump *= PI2 / sr; pitchJumpTime *= sr;
    repeatTime = repeatTime * sr | 0;
    for (length = attack + decay + sustain + release + delay | 0; i < length; b[i++] = s * volume) {
      if (!(++c % (bitCrush * 100 | 0))) {
        s = shape ? shape > 1 ? shape > 2 ? shape > 3 ? Math.sin(t * t) : Math.max(Math.min(Math.tan(t), 1), -1)
          : 1 - (2 * t / PI2 % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(t / PI2) - t / PI2) : Math.sin(t);
        s = (repeatTime ? 1 - tremolo + tremolo * Math.sin(PI2 * i / repeatTime) : 1) * sign(s) * (Math.abs(s) ** shapeCurve) *
          (i < attack ? i / attack : i < attack + decay ? 1 - ((i - attack) / decay) * (1 - sustainVolume)
            : i < attack + decay + sustain ? sustainVolume : i < length - delay ? (length - i - delay) / release * sustainVolume : 0);
        s = delay ? s / 2 + (delay > i ? 0 : (i < length - delay ? 1 : (length - i) / delay) * b[i - delay | 0] / 2 / volume) : s;
        if (filter) s = y1 = b2 * x2 + b1 * (x2 = x1) + b0 * (x1 = s) - a2 * y2 - a1 * (y2 = y1);
      }
      f = (frequency += slide += deltaSlide) * Math.cos(modulation * tm++);
      t += f + f * noise * Math.sin(i ** 5);
      if (j && ++j > pitchJumpTime) { frequency += pitchJump; startFrequency += pitchJump; j = 0; }
      if (repeatTime && !(++r % repeatTime)) { frequency = startFrequency; slide = startSlide; j = j || 1; }
    }
    return Float32Array.from(b);
  }
  // Okunur ZzFX parametreleri → dizi
  const KEYS = ['v', 'rnd', 'f', 'a', 's', 'r', 'sh', 'cur', 'sl', 'dsl', 'pj', 'pjt', 'rep', 'nz', 'mod', 'bc', 'dl', 'sv', 'dc', 'tr', 'fl'];
  const Z = o => KEYS.map(k => o[k] ?? ({ v: 1, rnd: 0, f: 220, r: .1, cur: 1, sv: 1 })[k] ?? 0);
  // fl > 0 yüksek geçiren, fl < 0 alçak geçiren süzgeç (Hz). sh: 0 sinüs, 1 üçgen, 2 testere, 3 kare benzeri, 4 gürültü.
  const ON_AYAR = {
    blip:   Z({ v: .22, f: 988, s: .012, r: .035, sh: 3, fl: -5000 }),               // daktilo harfi
    blip2:  Z({ v: .2, f: 784, s: .012, r: .035, sh: 3, fl: -5000 }),
    adim:   Z({ v: .2, f: 440, s: .004, r: .05, sh: 1, sl: -20 }),                    // rota adımı
    secim:  Z({ v: .28, f: 523, s: .05, r: .12, sh: 3, pj: 262, pjt: .05, fl: -4000 }), // seçim kutusu
    onay:   Z({ v: .26, f: 523, s: .14, r: .2, sh: 1, pj: 262, pjt: .05, rep: .1 }),
    para:   Z({ v: .3, f: 1675, s: .06, r: .24, sh: 1, cur: 1.82, pj: 837, pjt: .06 }),
    kayit:  Z({ v: .7, f: 120, s: .02, r: .16, sh: 0, sl: -6, nz: .6, fl: -1800 }),    // defter damgası
    gecis:  Z({ v: .22, f: 180, a: .05, s: .35, r: .25, sh: 2, sl: 18, bc: .12, fl: -6000 }), // piksel çözülmesi
    hata:   Z({ v: .3, f: 180, s: .12, r: .2, sh: 2, pj: -40, pjt: .1, fl: -2000 }),
    vurus8: Z({ v: .5, f: 90, s: .03, r: .3, sh: 0, sl: -4, nz: 3, fl: -2500 }),       // 8-bit darbe
    sihir:  Z({ v: .2, f: 1200, s: .25, r: .4, sh: 0, mod: 12, tr: .5, rep: .06, pj: 300, pjt: .03 }),
    kapi8:  Z({ v: .35, f: 70, s: .08, r: .25, sh: 2, sl: -2, bc: .3, fl: -1200 }),
  };

  // ── kod sentezi: her biri (sr, olay) → Float32Array (mono) ──
  const fade = (out, sr, a = .01, b = .02) => {
    const na = Math.min(out.length, a * sr | 0), nb = Math.min(out.length, b * sr | 0);
    for (let i = 0; i < na; i++) out[i] *= i / na;
    for (let i = 0; i < nb; i++) out[out.length - 1 - i] *= i / nb;
    return out;
  };
  function svf(fc, q, sr) {                                           // durum-değişkenli süzgeç (bant geçiren)
    let lo = 0, bp = 0; return (x, f = fc) => { const F = 2 * Math.sin(Math.PI * Math.min(f, sr / 6) / sr); lo += F * bp; const hi = x - lo - q * bp; bp += F * hi; return bp; };
  }
  const GEN = {
    zzfx: (sr, s) => zzfx(sr, ...(s.p || ON_AYAR[s.ad] || ON_AYAR.blip)),
    yukselis(sr, s) {                                                 // büyük andan önce gerilim
      const d = s.dur || 1, n = d * sr | 0, out = new Float32Array(n), rnd = mulberry32(s.seed || 11), bp = svf(300, .8, sr);
      let ph = 0;
      for (let i = 0; i < n; i++) {
        const k = i / n, f = 140 * Math.pow(12, k); ph += PI2 * f / sr;
        const saw = ((ph / PI2) % 1) * 2 - 1, nz = bp(rnd() * 2 - 1, 300 + 3200 * k * k);
        out[i] = (k * k) * (.28 * saw + .9 * nz);
      }
      return fade(out, sr, .05, .015);
    },
    darbe(sr, s) {                                                    // sinematik vuruş (boom)
      const d = s.dur || 1.4, n = d * sr | 0, out = new Float32Array(n), rnd = mulberry32(s.seed || 13);
      let ph = 0, lp = 0;
      for (let i = 0; i < n; i++) {
        const t = i / sr, f = 34 + 70 * Math.exp(-t * 9); ph += PI2 * f / sr;
        lp += ((rnd() * 2 - 1) - lp) * .08;
        out[i] = Math.sin(ph) * Math.exp(-t * 3.2) * .95 + lp * Math.exp(-t * 22) * 1.6;
      }
      return fade(out, sr, .002, .1);
    },
    whoosh(sr, s) {
      const d = s.dur || .6, n = d * sr | 0, out = new Float32Array(n), rnd = mulberry32(s.seed || 17), bp = svf(300, .5, sr);
      for (let i = 0; i < n; i++) { const k = i / n, env = k < .8 ? k / .8 : (1 - k) / .2; out[i] = bp(rnd() * 2 - 1, 300 * Math.pow(8, k)) * env * 1.4; }
      return out;
    },
    ping(sr, s) {
      const f0 = s.f || 880, n = 1.2 * sr | 0, out = new Float32Array(n);
      for (let i = 0; i < n; i++) { const t = i / sr; out[i] = Math.sin(PI2 * f0 * t) * Math.exp(-t * 5) + .25 * Math.sin(PI2 * f0 * 2 * t) * Math.exp(-t * 12); }
      return fade(out, sr, .006, .05);
    },
    ping2(sr) {
      const n = 1.6 * sr | 0, out = new Float32Array(n), o = .14 * sr | 0;
      for (let i = 0; i < n; i++) { const t = i / sr, t2 = (i - o) / sr; out[i] = Math.sin(PI2 * 659 * t) * Math.exp(-t * 4) + (i > o ? .9 * Math.sin(PI2 * 988 * t2) * Math.exp(-t2 * 3.4) + .2 * Math.sin(PI2 * 1976 * t2) * Math.exp(-t2 * 10) : 0); }
      return fade(out, sr, .006, .05);
    },
    tick(sr, s) { const n = .08 * sr | 0, out = new Float32Array(n); for (let i = 0; i < n; i++) { const t = i / sr; out[i] = Math.sin(PI2 * (s.f || 1500) * t) * Math.exp(-t * 60); } return fade(out, sr, .002, .01); },
    kalp(sr) {                                                        // kalp atışı: lub-dub
      const n = .6 * sr | 0, out = new Float32Array(n);
      for (const [o, g] of [[0, 1], [.2, .7]]) for (let i = 0; i < .25 * sr; i++) { const t = i / sr, j = (o * sr | 0) + i; if (j < n) out[j] += g * Math.sin(PI2 * (52 - 12 * t) * t) * Math.exp(-t * 18); }
      return out;
    },
    marti(sr, s) {                                                    // martı: iki heceli süzülen çığlık
      const calls = s.kez || 2, n = (calls * .42 + .1) * sr | 0, out = new Float32Array(n);
      for (let c = 0; c < calls; c++) {
        const o = c * .42 * sr | 0, len = (c % 2 ? .22 : .34) * sr | 0; let ph = 0;
        for (let i = 0; i < len; i++) {
          const t = i / sr, k = i / len, f = (1650 - 700 * k) * (1 + .03 * Math.sin(PI2 * 28 * t)); ph += PI2 * f / sr;
          const env = Math.min(1, k * 14) * (1 - k) ** 1.5;
          out[o + i] += env * (.6 * Math.sin(ph) + .28 * Math.sin(2 * ph) + .14 * Math.sin(3 * ph));
        }
      }
      return out;
    },
    // ── ortam (yatak) ──
    dalga(sr, s) {                                                    // deniz: alçak uğultu + kabarıp kırılan dalgalar
      const d = s.dur || 10, n = d * sr | 0, out = new Float32Array(n), rnd = mulberry32(s.seed || 23);
      const p1 = rnd() * PI2, p2 = rnd() * PI2; let lp = 0, lp2 = 0, prev = 0;
      for (let i = 0; i < n; i++) {
        const t = i / sr, w = rnd() * 2 - 1;
        lp += (w - lp) * .06; lp2 += (w - lp2) * .35;
        const sw = Math.pow(.5 + .25 * Math.sin(PI2 * t / 5.3 + p1) + .25 * Math.sin(PI2 * t / 7.9 + p2), 2);
        const crash = Math.max(0, sw - prev) * sr * .9; prev = sw;
        out[i] = lp * (.35 + .9 * sw) * 2.2 + (lp2 - lp) * Math.min(1, crash * 3 + sw * .25) * .5;
      }
      return fade(out, sr, s.giris ?? .6, s.cikis ?? .6);
    },
    ruzgar(sr, s) {
      const d = s.dur || 10, n = d * sr | 0, out = new Float32Array(n), rnd = mulberry32(s.seed || 29), bp = svf(400, .35, sr), p = rnd() * PI2;
      for (let i = 0; i < n; i++) { const t = i / sr, m = .5 + .5 * Math.sin(PI2 * t / 6.1 + p), m2 = .5 + .5 * Math.sin(PI2 * t / 2.3 + p * 2); out[i] = bp(rnd() * 2 - 1, 220 + 520 * m * (.6 + .4 * m2)) * (.4 + .6 * m) * 1.3; }
      return fade(out, sr, s.giris ?? .8, s.cikis ?? .8);
    },
    yagmur(sr, s) {
      const d = s.dur || 10, n = d * sr | 0, out = new Float32Array(n), rnd = mulberry32(s.seed || 31); let lp = 0, drop = 0;
      for (let i = 0; i < n; i++) { const w = rnd() * 2 - 1; lp += (w - lp) * .5; if (rnd() < .0009) drop = .4 + rnd() * .6; drop *= .992; out[i] = (w - lp) * .35 + drop * (rnd() * 2 - 1) * .5; }
      return fade(out, sr, s.giris ?? .8, s.cikis ?? .8);
    },
    ates(sr, s) {
      const d = s.dur || 10, n = d * sr | 0, out = new Float32Array(n), rnd = mulberry32(s.seed || 37); let lp = 0, cr = 0, prev = 0;
      for (let i = 0; i < n; i++) { const w = rnd() * 2 - 1; lp += (w - lp) * .02; if (rnd() < .0012) cr = .5 + rnd() * .5; cr *= .96; const c = cr * (rnd() * 2 - 1); out[i] = lp * 1.6 + (c - prev) * .6; prev = c; }
      return fade(out, sr, s.giris ?? .8, s.cikis ?? .8);
    },
    gerilim(sr, s) {                                                  // alçak, nabız gibi gerilim altlığı
      const d = s.dur || 6, n = d * sr | 0, out = new Float32Array(n);
      for (let i = 0; i < n; i++) { const t = i / sr, tr = .75 + .25 * Math.sin(PI2 * (s.nabiz || 1.6) * t); out[i] = tr * (.5 * Math.sin(PI2 * 55 * t) + .4 * Math.sin(PI2 * 58.3 * t) + .15 * Math.sin(PI2 * 110 * t)); }
      return fade(out, sr, s.giris ?? 1, s.cikis ?? .6);
    },
    drone(sr, s) {                                                    // HYS altlığı
      const d = s.dur || 10, n = d * sr | 0, out = new Float32Array(n); let lp = 0;
      for (let i = 0; i < n; i++) { const t = i / sr, tri = 1 - 4 * Math.abs(Math.round(110 * t) - 110 * t); lp += ((.5 * tri + .35 * Math.sin(PI2 * 164.81 * t) + .3 * Math.sin(PI2 * 220.5 * t)) - lp) * .07; out[i] = lp; }
      return fade(out, sr, .3, .05);
    },
  };

  // ── kütüphane dosyaları ──
  const KAT = () => window.SES_KATALOG || { adlar: {}, sesler: {} };
  /** 'kapi-ac' ya da 'kenney-rpg/door_open_1' → depo köküne göre dosya yolu; varyant t'den deterministik */
  function dosyaYolu(s) {
    if (s.dosya) return s.dosya;
    const k = KAT(), list = k.adlar[s.ad] || (k.sesler[s.ad] ? [s.ad] : null);
    if (!list) throw new Error(`Ses kütüphanesinde yok: "${s.ad}" (ses/kutuphane/index.html)`);
    const id = list[(s.varyant ?? hash(Math.round(s.t * 1000) + (s.seed || 0))) % list.length];
    return k.sesler[id].dosya;
  }
  /** render için: dosya olaylarını çözülmüş yollarla döner → window.__sfx */
  const dosyalar = events => events.filter(s => s.tur === 'dosya').map(s => ({ t: s.t, dosya: dosyaYolu(s), gain: s.gain ?? 1, hiz: s.hiz || 1, pan: s.pan || 0 }));

  // ── çalma ──
  /** Kod sentezlerinin tepesi 0.9'a çekilir (seviye gain ile ayarlanır); ZzFX ön ayarları kendi seviyesinde kalır */
  function norm(data, hedef = .9) { let pk = 0; for (const v of data) pk = Math.max(pk, Math.abs(v)); if (pk > 0) for (let i = 0; i < data.length; i++) data[i] *= hedef / pk; return data; }
  function bufferOf(ac, s) {
    const g = GEN[s.tur]; if (!g) throw new Error(`Bilinmeyen ses türü: ${s.tur}`);
    const raw = g(ac.sampleRate, s), data = s.tur === 'zzfx' ? raw : norm(raw), b = ac.createBuffer(1, Math.max(1, data.length), ac.sampleRate);
    b.getChannelData(0).set(data); return b;
  }
  function schedule(ac, s, dest, at) {
    const src = ac.createBufferSource(); src.buffer = bufferOf(ac, s);
    const g = ac.createGain(); g.gain.value = s.gain ?? 1;
    let node = g; src.connect(g);
    if (s.pan) { const p = ac.createStereoPanner(); p.pan.value = s.pan; g.connect(p); node = p; }
    node.connect(dest); src.start(Math.max(0, at));
  }
  /** Seslendirme konuşurken yatak (ortam/altlık) kısılır: −8 dB, 120 ms iniş, 350 ms çıkış */
  function duck(param, konusma, seviye = .4, t0 = 0) {
    param.setValueAtTime(1, 0);
    for (const [a, b] of konusma) {
      if (b < t0) continue;
      param.setValueAtTime(1, Math.max(0, a - .12 - t0)); param.linearRampToValueAtTime(seviye, Math.max(0, a - t0));
      param.setValueAtTime(seviye, Math.max(0, b - t0)); param.linearRampToValueAtTime(1, Math.max(0, b + .35 - t0));
    }
  }
  /** Sentez olaylarını WAV'a (base64) çevirir. Dosya olayları render'da FFmpeg ile eklenir. */
  async function wav(events, dur, { konusma = [], kisma = .4, ana = .8 } = {}) {
    const sr = 48000, ac = new OfflineAudioContext(2, Math.ceil(sr * dur), sr);
    const master = ac.createGain(); master.gain.value = ana; master.connect(ac.destination);
    const bed = ac.createGain(); bed.connect(master); duck(bed.gain, konusma, kisma);
    for (const s of events) if (s.tur !== 'dosya') schedule(ac, s, s.yatak ? bed : master, s.t);
    return wavBase64(await ac.startRendering());
  }
  /** Canlı önizleme: from saniyesinden itibaren çalar; durdurmak için dönen fonksiyonu çağır */
  function oynat(ac, events, from, { konusma = [], kisma = .4, ana = .8, kok = '' } = {}) {
    const base = ac.currentTime - from, master = ac.createGain(); master.gain.value = ana; master.connect(ac.destination);
    const bed = ac.createGain(); bed.connect(master);
    const now = ac.currentTime; bed.gain.setValueAtTime(1, now);
    for (const [a, b] of konusma) if (b > from) { bed.gain.setValueAtTime(1, base + Math.max(from, a - .12)); bed.gain.linearRampToValueAtTime(kisma, base + Math.max(from, a)); bed.gain.setValueAtTime(kisma, base + b); bed.gain.linearRampToValueAtTime(1, base + b + .35); }
    const timers = [], audios = [];
    for (const s of events) {
      if (s.tur === 'dosya') {
        if (s.t < from) continue;
        timers.push(setTimeout(() => { const a = new Audio(kok + dosyaYolu(s)); a.volume = Math.min(1, (s.gain ?? 1) * ana); a.playbackRate = s.hiz || 1; a.play().catch(() => {}); audios.push(a); }, (s.t - from) * 1000));
      } else if (s.t + (s.dur || 2) >= from) {
        const src = ac.createBufferSource(); src.buffer = bufferOf(ac, s);
        const g = ac.createGain(); g.gain.value = s.gain ?? 1; src.connect(g);
        let node = g; if (s.pan) { const p = ac.createStereoPanner(); p.pan.value = s.pan; g.connect(p); node = p; }
        node.connect(s.yatak ? bed : master);
        const off = Math.max(0, from - s.t); src.start(base + s.t + off, off);
      }
    }
    return () => { master.disconnect(); timers.forEach(clearTimeout); audios.forEach(a => a.pause()); };
  }
  function wavBase64(buf) {
    const ch = buf.numberOfChannels, n = buf.length, bytes = 44 + n * ch * 2, v = new DataView(new ArrayBuffer(bytes));
    const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    str(0, 'RIFF'); v.setUint32(4, bytes - 8, true); str(8, 'WAVE'); str(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, ch, true);
    v.setUint32(24, buf.sampleRate, true); v.setUint32(28, buf.sampleRate * ch * 2, true);
    v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * ch * 2, true);
    const data = [...Array(ch)].map((_, c) => buf.getChannelData(c)); let o = 44;
    for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++, o += 2) v.setInt16(o, Math.max(-1, Math.min(1, data[c][i])) * 0x7fff, true);
    const u8 = new Uint8Array(v.buffer); let s = '';
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(s);
  }

  /** Yardımcı: bir aralığa yayılmış tekrar eden olay (adım, daktilo) — her n. olayda bir ses */
  const dizi = (t0, t1, aralik, ozel = {}) => { const out = []; for (let t = t0, i = 0; t < t1; t += aralik, i++) out.push({ t: +t.toFixed(4), ...(typeof ozel === 'function' ? ozel(i, t) : ozel) }); return out; };

  window.SES = { zzfx, Z, ON_AYAR, GEN, norm, TURLER: Object.keys(GEN).concat('dosya'), dosyaYolu, dosyalar, wav, oynat, dizi, mulberry32 };
})();
