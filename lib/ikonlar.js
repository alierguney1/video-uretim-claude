// İkon kataloğu (elle yazılır): Türkiye'ye özgü kendi çizimimiz SVG ikonlar + 81 il eşlemesi.
// Hazır emoji ve bayraklar lib/ikon-seti.js'te (üretilir, MIT); çizim kodu lib/ikon-katmani.js'te.
//
// İkon anahtarı:
//   'cay'                      → bu dosyadaki kendi çizimimiz (IKON_OZEL)
//   'f:goat'                   → Fluent Emoji Flat (Microsoft, MIT), lib/ikon-seti.js
//   ['f:snow-capped-mountain', ['f:passenger-ship', dx, dy, ölçek]]  → üst üste katman
// Hepsi 32x32 görünüm kutusunda, düz renk, çizgisiz (Fluent Flat ile aynı dil).
//
// İL İKONU KURALI (MOTION_RULES §3b): ilin kendi insanının gururla anlattığı, herkesin bildiği şey:
// yemek, ürün, hayvan, doğa, yapı. Kişi, din, siyaset, etnik köken, kulüp logosu, afet, aşağılayıcı
// kalıp yargı yok. Komiklik nesneden ve hareketten gelir, ilden alay etmekten değil.
'use strict';
(function () {
  const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${body}</svg>`;
  const range = n => Array.from({ length: n }, (_, i) => i);
  const f1 = v => +v.toFixed(2);

  // Simit: halka + burgu + susam
  const simit = (() => {
    let s = '<circle cx="16" cy="16" r="10.2" fill="none" stroke="#c9782f" stroke-width="7.2"/>';
    s += '<circle cx="16" cy="16" r="10.2" fill="none" stroke="#e39a4c" stroke-width="3" stroke-dasharray="3.2 2.2" transform="rotate(8 16 16)"/>';
    range(22).forEach(i => {
      const a = i / 22 * Math.PI * 2, r = 8 + (i % 3) * 2;
      s += `<ellipse cx="${f1(16 + r * Math.cos(a))}" cy="${f1(16 + r * Math.sin(a))}" rx=".75" ry=".42" fill="#fbe7bf" transform="rotate(${f1(a * 57.3 + 40)} ${f1(16 + r * Math.cos(a))} ${f1(16 + r * Math.sin(a))})"/>`;
    });
    return svg(s);
  })();

  const IKON_OZEL = {
    // Rize: ince belli çay bardağı, tabak, buhar
    cay: svg(`<ellipse cx="16" cy="28" rx="11" ry="2.6" fill="#c9c9c9"/><ellipse cx="16" cy="27.6" rx="7.6" ry="1.6" fill="#e6e6e6"/>
      <path d="M10 6.5C10 11.5 13.4 13 13.4 16.5C13.4 19.6 11.4 21.5 11.4 26.6h9.2c0-5.1-2-7-2-10.1c0-3.5 3.4-5 3.4-10z" fill="#b8321a"/>
      <path d="M10 6.5h12c0 1.3-.3 2.4-.7 3.3H10.7c-.4-.9-.7-2-.7-3.3z" fill="#f4ece2"/>
      <path d="M11.4 26.6h9.2" stroke="#8e2412" stroke-width="1"/><path d="M12 11.5c.8 1.3 1.6 2.4 1.6 4.6" stroke="#e8705a" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path d="M14 4.6c-1-1 1-1.8 0-2.8M18 4.6c-1-1 1-1.8 0-2.8" stroke="#c9c9c9" stroke-width="1" fill="none" stroke-linecap="round"/>`),
    // İstanbul: simit
    simit,
    // Giresun / Düzce: fındık (kabuklu, yeşil zuruf)
    findik: svg(`<path d="M7 9c3-5 9-5 11-2c-3 0-6 2-7 5z" fill="#7cb342"/><path d="M25 10c-2-5-8-6-10-3c3 0 5.5 2 6 5z" fill="#8bc34a"/>
      <path d="M16 6c6.5 0 10 6.5 10 12.2c0 5.6-4.5 9.3-10 9.3S6 23.8 6 18.2C6 12.5 9.5 6 16 6z" fill="#a8622c"/>
      <path d="M8.2 22.5c2 3.2 4.8 5 7.8 5s5.8-1.8 7.8-5c-2.2 1-5 1.6-7.8 1.6s-5.6-.6-7.8-1.6z" fill="#e2c296"/>
      <path d="M11 11c-1.2 1.6-1.8 3.6-1.9 5.6" stroke="#cf8a52" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M16 6c-.4-1.4-.1-2.5.6-3.4" stroke="#6d3d17" stroke-width="1.2" fill="none" stroke-linecap="round"/>`),
    // Nevşehir: sıcak hava balonu + peri bacası
    balon: svg(`<path d="M2 31l2.4-7.4c.5-1.6 2.7-1.6 3.2 0L10 31z" fill="#e0b083"/><path d="M3.4 23.2a1.9 1.4 0 1 1 3.8 0z" fill="#9c6b45"/>
      <path d="M16 2c6.1 0 10 4.4 10 9.6c0 4.8-4.4 8.4-6.4 11.3h-7.2C10.4 20 6 16.4 6 11.6C6 6.4 9.9 2 16 2z" fill="#e8453c"/>
      <path d="M16 2c2.5 0 4.2 4.4 4.2 9.6c0 4.8-1.8 8.4-2.6 11.3h-3.2c-.8-2.9-2.6-6.5-2.6-11.3C11.8 6.4 13.5 2 16 2z" fill="#ffc83d"/>
      <path d="M16 2c.9 0 1.5 4.4 1.5 9.6c0 4.8-.7 8.4-1 11.3h-1c-.3-2.9-1-6.5-1-11.3C14.5 6.4 15.1 2 16 2z" fill="#2f7de1"/>
      <path d="M12.6 23l.8 2.8M19.4 23l-.8 2.8" stroke="#6d4c2f" stroke-width=".8"/><rect x="13" y="25.6" width="6" height="4" rx=".8" fill="#9b6a3c"/><path d="M13 27h6" stroke="#7a5230" stroke-width=".7"/>`),
    // Van: Van kedisi, bir gözü mavi bir gözü kehribar
    vankedi: svg(`<path d="M5 6l3.6 8.4L12.4 9zM27 6l-3.6 8.4L19.6 9z" fill="#f5f5f5"/><path d="M6.6 8.6l2.4 5 2-3.6zM25.4 8.6L23 13.6l-2-3.6z" fill="#f7b6c2"/>
      <ellipse cx="16" cy="18" rx="11" ry="9.6" fill="#fafafa"/><path d="M5.2 16.4C6.4 11.6 10.6 8.4 16 8.4s9.6 3.2 10.8 8c-2-1.4-4.2-1.8-5.6-1.6c-1.6-2.2-3.2-3-5.2-3s-3.6.8-5.2 3c-1.4-.2-3.6.2-5.6 1.6z" fill="#e7a565"/>
      <ellipse cx="11.4" cy="17.6" rx="2.3" ry="2.6" fill="#3c8ef0"/><ellipse cx="20.6" cy="17.6" rx="2.3" ry="2.6" fill="#f2b51b"/>
      <ellipse cx="11.6" cy="17.8" rx=".8" ry="1.7" fill="#1d2b36"/><ellipse cx="20.4" cy="17.8" rx=".8" ry="1.7" fill="#1d2b36"/><circle cx="12.2" cy="16.7" r=".55" fill="#fff"/><circle cx="21" cy="16.7" r=".55" fill="#fff"/>
      <path d="M14.8 21.2h2.4L16 22.6z" fill="#f48aa0"/><path d="M16 22.6v1.1M16 23.7c-.9.9-2 .9-2.6.3M16 23.7c.9.9 2 .9 2.6.3" stroke="#9a7b6d" stroke-width=".7" fill="none" stroke-linecap="round"/>
      <path d="M9.6 21.4l-6 .2M9.8 22.6l-5.6 1.6M22.4 21.4l6 .2M22.2 22.6l5.6 1.6" stroke="#bdbdbd" stroke-width=".6" stroke-linecap="round"/>`),
    // Adana / Tokat: şiş kebap (et, biber, domates)
    sis: svg(`<path d="M3 29L29 3" stroke="#9e9e9e" stroke-width="1.6" stroke-linecap="round"/><circle cx="28.6" cy="3.4" r="1.6" fill="#757575"/>
      <rect x="5.2" y="20.6" width="6.2" height="6.2" rx="2" transform="rotate(-45 8.3 23.7)" fill="#8d4a26"/>
      <rect x="10.6" y="15.2" width="6.2" height="6.2" rx="3.1" transform="rotate(-45 13.7 18.3)" fill="#e2412f"/>
      <rect x="15.4" y="10.4" width="6.2" height="6.2" rx="2" transform="rotate(-45 18.5 13.5)" fill="#8d4a26"/>
      <path d="M20.4 9.2c1.4-2.4 4-3.4 5.4-2.4s.6 3.8-1.8 5.2c-1.4.8-2.6.6-3.4-.2s-.9-1.6-.2-2.6z" fill="#5fa843"/>
      <path d="M6.4 22.2l2.4 2.4M16.6 12.2l2.4 2.4" stroke="#5b2c12" stroke-width=".9" stroke-linecap="round"/>`),
    // Afyonkarahisar: at nalı sucuk
    sucuk: svg(`<path d="M7 25C4 17 6.6 6.4 16 6.4S28 17 25 25" fill="none" stroke="#7d2318" stroke-width="7" stroke-linecap="round"/>
      <path d="M7 25C4 17 6.6 6.4 16 6.4S28 17 25 25" fill="none" stroke="#a63a2a" stroke-width="3.6" stroke-linecap="round" stroke-dasharray=".1 3.6"/>
      <path d="M5.4 26.6l3.2-1.4M23.4 25.2l3.2 1.4" stroke="#e8d7b6" stroke-width="1.4" stroke-linecap="round"/><path d="M25 27c.8 1.4 1.8 2.6 3.4 3" stroke="#e8d7b6" stroke-width="1" fill="none"/>`),
    // Aydın: incir (bütün + yarım)
    incir: svg(`<path d="M12 4c.4-1.4 1.6-2 2.8-1.6" stroke="#5b7f2c" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      <path d="M12.4 4.6c3.4 2.6 8.4 7.2 8.4 13.6c0 5.4-3.8 8.6-8.4 8.6S4 23.6 4 18.2c0-6.4 5-11 8.4-13.6z" fill="#6a2c70"/>
      <path d="M9.2 10.6c-1.6 2-2.6 4.4-2.6 7" stroke="#9a5aa0" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M22.4 13.2c2.6 1.8 6.2 5 6.2 9.4c0 3.8-2.8 6.2-6.2 6.2s-6.2-2.4-6.2-6.2c0-4.4 3.6-7.6 6.2-9.4z" fill="#7b3a80"/>
      <path d="M22.4 15.6c1.8 1.4 4.4 3.8 4.4 7c0 2.6-2 4.4-4.4 4.4s-4.4-1.8-4.4-4.4c0-3.2 2.6-5.6 4.4-7z" fill="#f1e1b8"/>
      <path d="M22.4 17.4c1.2 1 3 2.8 3 5c0 1.8-1.4 3-3 3s-3-1.2-3-3c0-2.2 1.8-4 3-5z" fill="#e2586d"/>
      ${range(9).map(i => `<circle cx="${f1(22.4 + 1.6 * Math.cos(i * .8) * (i % 2 ? .6 : 1))}" cy="${f1(22.4 + 1.6 * Math.sin(i * .8))}" r=".3" fill="#f5d77e"/>`).join('')}`),
    // Çanakkale: Truva atı (tekerlekli tahta at)
    truva: svg(`<rect x="4" y="24" width="23" height="2.6" rx="1" fill="#7a4a24"/><circle cx="8" cy="27.6" r="2.2" fill="#5a3418"/><circle cx="23" cy="27.6" r="2.2" fill="#5a3418"/>
      <rect x="7" y="18" width="2.6" height="6.4" fill="#a8693a"/><rect x="11" y="18" width="2.6" height="6.4" fill="#96592c"/><rect x="18.4" y="18" width="2.6" height="6.4" fill="#a8693a"/><rect x="22.2" y="18" width="2.6" height="6.4" fill="#96592c"/>
      <rect x="6" y="12.4" width="20" height="7" rx="3" fill="#c07a40"/><path d="M8 15.8h16" stroke="#9a5d2c" stroke-width=".8"/><rect x="13.4" y="14.2" width="3" height="3" rx=".4" fill="#5a3418"/>
      <path d="M21 13.4L23.4 4h4.2l1.6 4.2l-1.6 1.2l-1.6-.8L25 14z" fill="#c07a40"/><path d="M23.4 4c-.6-1.2-.2-2.2.8-2.6l.6 2.6" fill="#a8693a"/>
      <path d="M22 13l2.2-8.6" stroke="#6b3f1d" stroke-width="1.2" stroke-dasharray="1 1"/><circle cx="26.4" cy="6" r=".7" fill="#3b2410"/><path d="M6 14c-2 1-2.8 3.6-2 6" stroke="#6b3f1d" stroke-width="1.4" fill="none" stroke-linecap="round"/>`),
    // Çorum: kâğıt külahta leblebi
    leblebi: svg(`<path d="M5 12h22L16 30z" fill="#f2ead8"/><path d="M5 12h22l-1.4 2.6H6.4z" fill="#d84a3a"/><path d="M16 30L10 12M16 30l6-18" stroke="#ddd2b8" stroke-width=".7"/>
      ${[[8, 10], [11.4, 9], [14.8, 8.4], [18.2, 8.6], [21.6, 9.2], [24.4, 10.6], [10, 6.6], [13.4, 5.6], [17, 5.2], [20.4, 6], [15.4, 2.6], [12, 3]].map(([x, y]) =>
        `<circle cx="${x}" cy="${y + 1}" r="2" fill="#efc96a"/><circle cx="${x - .5}" cy="${y + .5}" r=".6" fill="#fbe6a8"/>`).join('')}`),
    // Tekirdağ / Sakarya / Burdur: köfte
    kofte: svg(`<ellipse cx="16" cy="24" rx="13.6" ry="5" fill="#e6e6e6"/><ellipse cx="16" cy="23.4" rx="11" ry="3.6" fill="#f7f7f7"/>
      ${[[9, 18.6, -14], [16, 16.4, 0], [23, 18.6, 14]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="5.2" ry="3.2" transform="rotate(${r} ${x} ${y})" fill="#7b3f1f"/>
        <path d="M${x - 3} ${y - 1.2}l2 2.4M${x} ${y - 1.6}l2 2.4M${x + 2.4} ${y - .6}l1.4 1.6" stroke="#4e2610" stroke-width=".7" transform="rotate(${r} ${x} ${y})"/>`).join('')}
      <path d="M21.6 24.4c2.4-1.6 5.6-1.4 6.6-.4" stroke="#4caf50" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="7" cy="24.4" r="1.6" fill="#e2412f"/>`),
    // Kayseri: mantı (kâse, yoğurt, kırmızı sos)
    manti: svg(`<path d="M2.6 15h26.8c0 7.2-6 12.6-13.4 12.6S2.6 22.2 2.6 15z" fill="#3f78c2"/><path d="M5 18.2c3 1 18.6 1 22 0" stroke="#7fb0ec" stroke-width=".9" fill="none"/>
      <ellipse cx="16" cy="15" rx="13.4" ry="3.6" fill="#fbfbf4"/>
      ${[[8, 14], [11, 12.6], [14.2, 13.6], [17.6, 12.4], [20.8, 13.4], [24, 14.2], [10.4, 15.6], [16, 15.8], [21.6, 15.6]].map(([x, y]) => `<rect x="${x - 1.2}" y="${y - 1.2}" width="2.4" height="2.4" rx=".8" transform="rotate(45 ${x} ${y})" fill="#f2deb0"/>`).join('')}
      <path d="M6.6 14.4c3 .8 4.8-.6 7.2.2s4.4 1 6.6-.2s4 .2 5.2.6" stroke="#d6452f" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="12" cy="11.6" r=".7" fill="#4caf50"/><circle cx="19.6" cy="11.8" r=".6" fill="#4caf50"/>`),
    // Gaziantep: fıstıklı baklava
    baklava: svg(`<rect x="2" y="20" width="28" height="7" rx="2" fill="#c7a15a"/><rect x="2" y="20" width="28" height="2.4" rx="1.2" fill="#ddb96d"/>
      ${[[9, 14], [16, 14], [23, 14], [12.5, 8], [19.5, 8]].map(([x, y]) => `<path d="M${x} ${y - 5.4}l4.6 5.4l-4.6 5.4l-4.6-5.4z" fill="#d99a33"/>
        <path d="M${x - 3.2} ${y - 1.6}h6.4M${x - 3.6} ${y}h7.2M${x - 3.2} ${y + 1.6}h6.4" stroke="#b9782a" stroke-width=".6"/>
        <path d="M${x} ${y - 5.4}l1.8 2.2h-3.6z" fill="#6fae3a"/>`).join('')}`),
    // Gümüşhane: pestil (katlanmış dut pestili) + ceviz
    pestil: svg(`<path d="M3 21l13-11l13 6l-13 11z" fill="#7a2f22"/><path d="M3 21l13-11l1.4 3.4L5 23.4z" fill="#953b2a"/><path d="M16 27l13-11v2.6L16 29.6z" fill="#5e2219"/>
      <path d="M8 19.6l6 2.8M11.6 16.6l6 2.8M15.2 13.6l6 2.8" stroke="#a54a36" stroke-width=".8"/>
      <circle cx="24.4" cy="8" r="4" fill="#b8814a"/><path d="M24.4 4v8M21.4 6.4c1.6 1 4.4 1 6 0M21.4 9.6c1.6-1 4.4-1 6 0" stroke="#8a5a2c" stroke-width=".7" fill="none"/>`),
    // Hatay: künefe (bakır tepsi, tel kadayıf, fıstık, uzayan peynir)
    kunefe: svg(`<ellipse cx="16" cy="19" rx="14" ry="9" fill="#b0642d"/><ellipse cx="16" cy="18" rx="12" ry="7.4" fill="#e89a2e"/>
      ${range(14).map(i => `<path d="M${f1(6 + i * 1.5)} ${f1(13.4 + (i % 3))}c.6 2 .2 3.6.8 5.4" stroke="#c97314" stroke-width=".6" fill="none"/>`).join('')}
      ${[[10, 15], [14, 13.6], [18.6, 14.2], [22, 16], [12.4, 19.6], [17.2, 18.6], [21, 20.4], [8.6, 18.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="#76b043"/>`).join('')}
      <path d="M20 18.4c2.4.6 4.4 3.6 4.8 7.4c.4 2.2 1.8 2.6 2.6 2.4" stroke="#fff6dc" stroke-width="1.8" fill="none" stroke-linecap="round"/>`),
    // İzmir: boyoz + yarım yumurta
    boyoz: svg(`<ellipse cx="13" cy="20" rx="11" ry="7.4" fill="#d9a04f"/><path d="M13 13.4c5 0 8.6 3 8.6 6.4s-3.8 5.6-8.6 5.6S4.6 23 4.6 19.8c0-2.6 2.6-4.4 6-4.4c3 0 5 1.6 5 3.6c0 1.6-1.4 2.6-3 2.6c-1.2 0-2-.8-2-1.8" stroke="#b07a2c" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M2.2 20.6c0 4 4.8 6.8 10.8 6.8s10.8-2.8 10.8-6.8" stroke="#c48a3c" stroke-width="1" fill="none"/>
      <ellipse cx="25" cy="10.4" rx="5.2" ry="6" fill="#fdfdf8"/><circle cx="25" cy="11" r="2.8" fill="#ffb81c"/>`),
    // Kırklareli: hardaliye şişesi
    hardaliye: svg(`<rect x="13.4" y="2" width="5.2" height="3" rx=".8" fill="#9e9e9e"/><path d="M13.6 5h4.8v4.4c3.4 1.4 4.6 3.8 4.6 6.6V28c0 1.2-.8 2-2 2H11c-1.2 0-2-.8-2-2V16c0-2.8 1.2-5.2 4.6-6.6z" fill="#6c1f4e"/>
      <rect x="9" y="17" width="14" height="7.4" fill="#f2ead8"/><circle cx="14.2" cy="20.6" r="1.4" fill="#8e2a63"/><circle cx="16.6" cy="19.6" r="1.4" fill="#8e2a63"/><circle cx="16.4" cy="22.2" r="1.4" fill="#8e2a63"/><circle cx="18.8" cy="20.8" r="1.4" fill="#8e2a63"/>
      <path d="M11.4 13c.6-1 1.4-1.8 2.4-2.2" stroke="#a0457c" stroke-width="1" fill="none" stroke-linecap="round"/>`),
    // Kırşehir: bağlama
    baglama: svg(`<path d="M11.6 30.4c-4.8 0-8.2-3.2-7.2-8.2c.8-4 4.6-7.4 9-9.6l6 6c-2.2 4.4-5.6 8.2-7.8 11.8z" fill="#9c5a2c"/>
      <path d="M8 26.6c-1.6-1.6-1.4-4 .4-6.4" stroke="#7a4220" stroke-width="1" fill="none"/><circle cx="12.4" cy="21.4" r="2" fill="#4a2810"/>
      <path d="M15.6 15.6L28.4 2.8" stroke="#6b3a17" stroke-width="2.4" stroke-linecap="round"/>
      ${range(6).map(i => `<path d="M${f1(17.6 + i * 1.6)} ${f1(14.6 - i * 1.6)}l1.4 1.4" stroke="#e8d3a8" stroke-width=".5"/>`).join('')}
      <path d="M26 3.2l-1.6-1.6M27.6 4.8l1.6 1.6M28.4 1.8l-.4-1.4" stroke="#3b200b" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M9.6 24.4l18-20" stroke="#f3eadb" stroke-width=".35"/>`),
    // Kocaeli: pişmaniye
    pismaniye: svg(`<rect x="3" y="20" width="26" height="8" rx="1.6" fill="#d7263d"/><path d="M3 23h26" stroke="#ffcf3f" stroke-width="1.4"/>
      ${[[8, 16, 5.4], [16, 13, 6.4], [24, 16, 5.4], [12, 19, 4.4], [20.4, 19, 4.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fbf6e8"/>`).join('')}
      ${range(10).map(i => `<path d="M${f1(5 + i * 2.4)} ${f1(13 + (i % 3) * 2)}c1.4-.8 2.6-.6 3.6.4" stroke="#e6dcc0" stroke-width=".6" fill="none"/>`).join('')}`),
    // Konya: uzun etli ekmek
    etliekmek: svg(`<path d="M4.4 30.6c-2-1-1.8-3.4-.4-4.8L25.4 4.4c1.4-1.4 3.8-1.6 4.8.4s.4 3.4-1 4.8L7.8 31c-1 .6-2.2.4-3.4-.4z" fill="#d79a4c"/>
      <path d="M6 28.4L27.6 6.8" stroke="#a5452c" stroke-width="4.4" stroke-linecap="round"/>
      ${range(12).map(i => `<circle cx="${f1(7.6 + i * 1.75 + (i % 2) * .6)}" cy="${f1(26.4 - i * 1.75 + (i % 2) * .6)}" r=".7" fill="#e45a2a"/>`).join('')}
      ${range(6).map(i => `<circle cx="${f1(9 + i * 3.2)}" cy="${f1(26 - i * 3.2)}" r=".5" fill="#5caa3d"/>`).join('')}`),
    // Kütahya: çini vazo
    cini: svg(`<path d="M12 3h8v2.4c-.6.6-1 1.4-1 2.4c4.4 2 7 6 7 11c0 6.4-4.4 11-10 11S6 25.2 6 18.8c0-5 2.6-9 7-11c0-1-.4-1.8-1-2.4z" fill="#f5f8fc"/>
      <path d="M12 3h8M13 7.8h6" stroke="#1d5bbf" stroke-width="1.2"/><path d="M6.6 22.6h18.8" stroke="#1d5bbf" stroke-width="1.2"/>
      <path d="M16 11.6c-1.6 1.6-2.4 3.4-1.2 5.4c.6 1 1 2 1.2 3.4c.2-1.4.6-2.4 1.2-3.4c1.2-2 .4-3.8-1.2-5.4z" fill="#d8312a"/>
      <path d="M16 20.4v5M16 23c-2-.4-3.4-1.6-4-3.4M16 23c2-.4 3.4-1.6 4-3.4" stroke="#2f8f4e" stroke-width="1" fill="none"/>
      <path d="M9 15c1.4.4 2 1.6 1.8 3M23 15c-1.4.4-2 1.6-1.8 3" stroke="#1d5bbf" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <circle cx="9.6" cy="25.6" r=".9" fill="#20a3a8"/><circle cx="22.4" cy="25.6" r=".9" fill="#20a3a8"/>`),
    // Malatya: kayısı
    kayisi: svg(`<path d="M17 7c2.6-3.6 7-4.6 10.6-3.4c-1.6 3.6-5.6 5.6-10.6 3.4z" fill="#6aa84f"/><path d="M16.4 8c.2-2 1-3.6 2-4.6" stroke="#6d4c2f" stroke-width="1" fill="none"/>
      <circle cx="12.4" cy="19" r="9.4" fill="#f59a23"/><circle cx="20.4" cy="19" r="9.4" fill="#f7a933"/><path d="M16.4 10.8c-1.2 4-1.2 11.2.6 16.8" stroke="#e07f12" stroke-width="1" fill="none"/>
      <ellipse cx="22.6" cy="15.4" rx="2.4" ry="1.4" fill="#ffc96e" transform="rotate(-30 22.6 15.4)"/><circle cx="11" cy="21" r="3.4" fill="#ef7f1a" opacity=".55"/>`),
    // Mardin: taş evler, kemerli pencere
    mardin: svg(`<rect x="2" y="18" width="12" height="12" fill="#d9b98a"/><rect x="11" y="10" width="11" height="20" fill="#e7cb9c"/><rect x="19" y="4" width="11" height="26" fill="#d4b080"/>
      ${[[5, 22], [14, 14], [14, 22], [22.4, 8], [22.4, 15], [22.4, 22]].map(([x, y]) => `<path d="M${x} ${y + 4.4}v-2.6a2 2 0 0 1 4 0v2.6z" fill="#7a5532"/>`).join('')}
      <path d="M2 18h12M11 10h11M19 4h11" stroke="#b89062" stroke-width="1.2"/><path d="M4 26h2M24 28h2M15 27h3" stroke="#c19c6b" stroke-width=".8"/>`),
    // Niğde: gazoz şişesi
    gazoz: svg(`<rect x="13" y="1.6" width="6" height="2.6" rx=".6" fill="#e53935"/><path d="M13.6 4.2h4.8v5c3 1.4 4.6 3.6 4.6 6.6V28a2.4 2.4 0 0 1-2.4 2.4h-9.2A2.4 2.4 0 0 1 9 28V15.8c0-3 1.6-5.2 4.6-6.6z" fill="#8fd3c9" opacity=".95"/>
      <path d="M9 17h14v8.4H9z" fill="#ffffff"/><path d="M11 21.2h10" stroke="#e53935" stroke-width="2.4"/>
      ${[[12, 13.4, .8], [15.4, 11.6, .6], [19, 14, .7], [13.8, 27.4, .6], [18.6, 28, .8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e9fbf7"/>`).join('')}`),
    // Samsun: Bafra pidesi (kayık biçimli)
    pide: svg(`<path d="M1.6 17.4C6 11.6 26 11.6 30.4 17.4C26 23 6 23 1.6 17.4z" fill="#d68d3e"/><path d="M5.6 17.4c3.6-3.2 17.2-3.2 20.8 0c-3.6 3.2-17.2 3.2-20.8 0z" fill="#9c4524"/>
      ${range(9).map(i => `<circle cx="${f1(8 + i * 2)}" cy="${f1(17.4 + (i % 2 ? 1 : -1))}" r=".7" fill="#c65c2e"/>`).join('')}
      <ellipse cx="16" cy="17.4" rx="3" ry="2.2" fill="#fdfdf6"/><circle cx="16" cy="17.4" r="1.4" fill="#ffb300"/>`),
    // Siirt: fıstık
    fistik: svg(`${[[10.6, 17, -25], [21.4, 17, 25]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})">
        <ellipse cx="${x}" cy="${y}" rx="6" ry="9" fill="#e9d5ae"/><ellipse cx="${x}" cy="${y + .6}" rx="3.2" ry="6.6" fill="#7cbf3c"/><ellipse cx="${x - .8}" cy="${y - 1}" rx="1.2" ry="3.4" fill="#a7d86a"/>
        <path d="M${x} ${y - 9}v3" stroke="#c6ad7e" stroke-width=".8"/></g>`).join('')}`),
    // Sinop: Diyojen'in fıçısı + feneri
    fici: svg(`<path d="M5 9c0-3 3.4-4.4 9-4.4S23 6 23 9v14c0 3-3.4 4.4-9 4.4S5 26 5 23z" fill="#b5713a"/>
      <path d="M5 11.4c4 1.4 14 1.4 18 0M5 20.6c4 1.4 14 1.4 18 0" stroke="#6b6b6b" stroke-width="1.6" fill="none"/>
      <path d="M9.6 5.2v21.6M14 4.6v22.8M18.4 5.2v21.6" stroke="#93582a" stroke-width=".7"/><ellipse cx="14" cy="9" rx="9" ry="3" fill="#3b2410"/>
      <path d="M26 15.6v-2.4M24.6 13.2h2.8" stroke="#555" stroke-width=".8"/><rect x="23.8" y="16" width="4.4" height="6.4" rx=".8" fill="#ffd54f"/><path d="M23.8 16h4.4M23.8 22.4h4.4" stroke="#555" stroke-width="1.2"/>`),
    // Uşak: halı
    hali: svg(`<rect x="5" y="3" width="22" height="26" rx="1" fill="#b3261e"/><rect x="7.4" y="5.4" width="17.2" height="21.2" fill="none" stroke="#f0d8a8" stroke-width="1.2"/>
      <path d="M16 8.6l6 7.4l-6 7.4l-6-7.4z" fill="#22356b"/><path d="M16 11.6l3.6 4.4l-3.6 4.4l-3.6-4.4z" fill="#f0d8a8"/><circle cx="16" cy="16" r="1.4" fill="#b3261e"/>
      ${[0, 1].map(k => range(8).map(i => `<path d="M${f1(6.4 + i * 2.7)} ${k ? 29 : 3}v${k ? 2 : -2}" stroke="#f3ead6" stroke-width=".8"/>`).join('')).join('')}`),
    // Zonguldak: lambalı maden bareti
    baret: svg(`<path d="M4 20c0-7 5.4-12.6 12-12.6S28 13 28 20z" fill="#fbc02d"/><path d="M16 7.4c1.4 0 2.6 1 2.6 2.4V20h-5.2V9.8c0-1.4 1.2-2.4 2.6-2.4z" fill="#f9a825"/>
      <rect x="1.6" y="19.4" width="28.8" height="3.6" rx="1.8" fill="#f9a825"/><circle cx="16" cy="13.6" r="3.2" fill="#ffffff"/><circle cx="16" cy="13.6" r="2" fill="#ffe082"/>
      <path d="M19.6 13l8.6-3.4v8z" fill="#fff59d" opacity=".55"/><rect x="9" y="25" width="14" height="4" rx="2" fill="#424242"/>`),
    // Karaman: Türkçe konuşma balonu
    turkce: svg(`<path d="M4 4h24a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H13l-6 6v-6H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#ffffff"/>
      <path d="M5.4 19l4.4-12.4h2.6L16.8 19h-2.8l-1-3h-4.4l-1 3zM9.4 13.6h2.8l-1.4-4.4z" fill="#e53935"/>
      <path d="M20.4 19.2c-1.8 0-3-1-3-2.6c0-1.8 1.4-2.6 3.6-2.8l1.8-.2v-.4c0-.8-.6-1.2-1.6-1.2c-.8 0-1.4.4-1.6 1l-2.2-.4c.4-1.6 1.8-2.6 3.8-2.6c2.4 0 3.8 1.2 3.8 3.4V19h-2.2v-1c-.6.8-1.4 1.2-2.4 1.2zm.8-1.8c1 0 1.6-.6 1.6-1.6v-.6l-1.4.2c-1 .1-1.6.4-1.6 1c0 .6.6 1 1.4 1z" fill="#1d2b36"/>
      <path d="M18.8 8.4c.4-.6 1-.8 1.4-.8M23.8 8.4c.4-.6 1-.8 1.4-.8" stroke="#1d2b36" stroke-width="0"/>`),
    // Kırıkkale: kale ve ortasında çatlak (adı bu)
    kirikkale: svg(`<path d="M3 30V12h3v-3h3v3h3V9h3v3h2V9h3v3h3V9h3v3h3v18z" fill="#9e9e9e"/><rect x="3" y="12" width="26" height="2" fill="#8a8a8a"/>
      <path d="M13 30v-6a3 3 0 0 1 6 0v6z" fill="#5d4037"/>
      ${[[6, 17], [10, 21], [22, 17], [25, 22], [7, 26]].map(([x, y]) => `<rect x="${x}" y="${y}" width="3" height="1.6" rx=".4" fill="#bdbdbd"/>`).join('')}
      <path d="M17.4 9l-2 4.4l2.6 2l-3 4.6l1.6 1.6" stroke="#2b2b2b" stroke-width="1.3" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`),
    // Karabük: Safranbolu evi
    safranbolu: svg(`<path d="M2 12L16 3l14 9z" fill="#b5532f"/><rect x="5" y="12" width="22" height="9" fill="#fbf6ec"/><rect x="7" y="21" width="18" height="9" fill="#f1e8d6"/>
      <path d="M5 12h22M5 16.4h22M5 21h22M11 12v9M16 12v9M21 12v9M7 25.4h18M12 21v9M20 21v9" stroke="#6d3f22" stroke-width=".9"/>
      ${[[7.4, 13.4], [17.4, 13.4], [12.4, 17.6], [22.4, 17.6]].map(([x, y]) => `<rect x="${x}" y="${y}" width="2.4" height="2.4" fill="#6d8fb3"/>`).join('')}<rect x="14.4" y="25.4" width="3.2" height="4.6" fill="#6d3f22"/>`),
  };

  // 81 il: [plaka, ad (iller.topo.json ile aynı yazım), ikon, etiket (ekrana yazılırsa)]
  const IL_IKON = [
    [1, 'Adana', 'sis', 'kebap'],
    [2, 'Adıyaman', 'f:sunrise-over-mountains', "Nemrut'ta gün doğumu"],
    [3, 'Afyonkarahisar', 'sucuk', 'sucuk'],
    [4, 'Ağrı', ['f:snow-capped-mountain', ['f:passenger-ship', 6, -9, .42]], "Nuh'un gemisi"],
    [5, 'Amasya', 'f:red-apple', 'elma'],
    [6, 'Ankara', 'f:goat', 'Ankara keçisi'],
    [7, 'Antalya', 'f:beach-with-umbrella', 'sahil'],
    [8, 'Artvin', 'f:ox', 'boğa güreşi'],
    [9, 'Aydın', 'incir', 'incir'],
    [10, 'Balıkesir', 'f:sandwich', 'Ayvalık tostu'],
    [11, 'Bilecik', 'f:deciduous-tree', 'Söğüt'],
    [12, 'Bingöl', 'f:water-wave', 'bin göl'],
    [13, 'Bitlis', 'f:cut-of-meat', 'büryan'],
    [14, 'Bolu', 'f:cooking', 'aşçılar diyarı'],
    [15, 'Burdur', 'kofte', 'Burdur şiş'],
    [16, 'Bursa', 'f:chestnut', 'kestane şekeri'],
    [17, 'Çanakkale', 'truva', 'Truva atı'],
    [18, 'Çankırı', 'f:salt', 'tuz mağarası'],
    [19, 'Çorum', 'leblebi', 'leblebi'],
    [20, 'Denizli', 'f:rooster', 'Denizli horozu'],
    [21, 'Diyarbakır', 'f:watermelon', 'karpuz'],
    [22, 'Edirne', 'f:person-wrestling', 'yağlı güreş'],
    [23, 'Elazığ', 'f:grapes', 'öküzgözü üzümü'],
    [24, 'Erzincan', 'f:cheese-wedge', 'tulum peyniri'],
    [25, 'Erzurum', 'f:skier', 'Palandöken'],
    [26, 'Eskişehir', 'f:dumpling', 'çibörek'],
    [27, 'Gaziantep', 'baklava', 'baklava'],
    [28, 'Giresun', 'findik', 'fındık'],
    [29, 'Gümüşhane', 'pestil', 'pestil'],
    [30, 'Hakkari', 'f:honeybee', 'bal'],
    [31, 'Hatay', 'kunefe', 'künefe'],
    [32, 'Isparta', 'f:rose', 'gül'],
    [33, 'Mersin', 'f:banana', 'Anamur muzu'],
    [34, 'İstanbul', 'simit', 'simit'],
    [35, 'İzmir', 'boyoz', 'boyoz'],
    [36, 'Kars', 'f:goose', 'Kars kazı'],
    [37, 'Kastamonu', 'f:garlic', 'sarımsak'],
    [38, 'Kayseri', 'manti', 'mantı'],
    [39, 'Kırklareli', 'hardaliye', 'hardaliye'],
    [40, 'Kırşehir', 'baglama', 'bağlama'],
    [41, 'Kocaeli', 'pismaniye', 'pişmaniye'],
    [42, 'Konya', 'etliekmek', 'etli ekmek'],
    [43, 'Kütahya', 'cini', 'çini'],
    [44, 'Malatya', 'kayisi', 'kayısı'],
    [45, 'Manisa', 'f:candy', 'mesir macunu'],
    [46, 'Kahramanmaraş', 'f:ice-cream', 'dondurma'],
    [47, 'Mardin', 'mardin', 'taş evler'],
    [48, 'Muğla', 'f:sailboat', 'mavi tur'],
    [49, 'Muş', 'f:tulip', 'Muş lalesi'],
    [50, 'Nevşehir', 'balon', 'balonlar'],
    [51, 'Niğde', 'gazoz', 'Niğde gazozu'],
    [52, 'Ordu', 'f:parachute', 'yamaç paraşütü'],
    [53, 'Rize', 'cay', 'çay'],
    [54, 'Sakarya', 'kofte', 'ıslama köfte'],
    [55, 'Samsun', 'pide', 'Bafra pidesi'],
    [56, 'Siirt', 'fistik', 'Siirt fıstığı'],
    [57, 'Sinop', 'fici', "Diyojen'in fıçısı"],
    [58, 'Sivas', 'f:dog', 'kangal'],
    [59, 'Tekirdağ', 'kofte', 'köfte'],
    [60, 'Tokat', 'sis', 'Tokat kebabı'],
    [61, 'Trabzon', 'f:fish', 'hamsi'],
    [62, 'Tunceli', 'f:droplet', 'Munzur gözeleri'],
    [63, 'Şanlıurfa', 'f:hot-pepper', 'isot'],
    [64, 'Uşak', 'hali', 'halı'],
    [65, 'Van', 'vankedi', 'Van kedisi'],
    [66, 'Yozgat', 'f:pot-of-food', 'arabaşı'],
    [67, 'Zonguldak', 'baret', 'maden'],
    [68, 'Aksaray', 'f:flamingo', 'Tuz Gölü'],
    [69, 'Bayburt', 'f:mountain', 'Kop Dağı'],
    [70, 'Karaman', 'turkce', 'Türkçe'],
    [71, 'Kırıkkale', 'kirikkale', 'kırık kale'],
    [72, 'Batman', 'f:oil-drum', 'petrol'],
    [73, 'Şırnak', 'f:snow-capped-mountain', 'Cudi Dağı'],
    [74, 'Bartın', 'f:leafy-green', 'Amasra salatası'],
    [75, 'Ardahan', 'f:sled', 'atlı kızak'],
    [76, 'Iğdır', 'f:melon', 'Iğdır kavunu'],
    [77, 'Yalova', 'f:hot-springs', 'kaplıca'],
    [78, 'Karabük', 'safranbolu', 'Safranbolu evi'],
    [79, 'Kilis', 'f:olive', 'zeytin'],
    [80, 'Osmaniye', 'f:peanuts', 'yer fıstığı'],
    [81, 'Düzce', 'findik', 'fındık'],
  ];

  // Bayrak eşlemesi için kendi çizimimiz (flag-icons'ta olmayanlar), 640x480 kutu
  const BAYRAK_OZEL = {
    kktc: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><rect width="640" height="480" fill="#fff"/>
      <rect y="52" width="640" height="38" fill="#e30a17"/><rect y="390" width="640" height="38" fill="#e30a17"/>
      <circle cx="282" cy="240" r="96" fill="#e30a17"/><circle cx="306" cy="240" r="77" fill="#fff"/>
      <path transform="translate(384 240) rotate(-90)" fill="#e30a17" d="M0-48L11.3-15.5L45.7-14.8L18.3 5.9L28.2 38.8L0 19.1L-28.2 38.8L-18.3 5.9L-45.7-14.8L-11.3-15.5z"/></svg>`,
  };
  const ULKE_OZEL = { kktc: ['', 'KKTC'] };

  window.IKON_OZEL = IKON_OZEL;
  window.IL_IKON = IL_IKON;
  window.BAYRAK_OZEL = BAYRAK_OZEL;
  window.ULKE_OZEL = ULKE_OZEL;
})();
