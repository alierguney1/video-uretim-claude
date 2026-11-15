# video-uretim-claude

Claude ile **sadece kodla** animasyon üretme hattı: görüntü modeli yok, hazır görsel yok,
her piksel `draw(t)` ile çiziliyor. Shorts / Reels / TikTok için dikey, YouTube için yatay.

Claude video çizmez, videoyu çizen makineyi yazar. Bu yüzden düzenlemek kolay (bir sayıyı
değiştirirsin), tekrarlanabilir (aynı `t` her zaman aynı kare) ve hassas (yazı, grafik, formül
kusursuz). Zayıf olduğu yer gerçekçi insan yüzü ve kamera görüntüsü; bu yöntem *tasarlanmış hareket* için.

## Hızlı başlangıç

```bash
cp template.html animasyonlar/benim-videom.html   # sözleşmesi hazır iskelet
npm run check   -- animasyonlar/benim-videom.html # sözleşme + determinizm denetimi
npm run contact -- animasyonlar/benim-videom.html # out/benim-videom/contact.png
npm run render  -- animasyonlar/benim-videom.html # out/benim-videom/benim-videom.mp4
```

Tarayıcıda önizleme: dosyayı aç (tıkla: oynat · ←/→ kare). `?t=3.2` o anı gösterir,
`?guides=1` güvenli alanları çizer.

Gereksinimler: Node 18+, Playwright (Chromium) ve FFmpeg. Bağımlılık kurulumu yok; Playwright
bulunamazsa araç ne kuracağını söyler.

## Dosyalar

| Dosya | Ne |
| --- | --- |
| [MOTION_RULES.md](MOTION_RULES.md) | Kurallar: render sözleşmesi, görünüm yasakları, ses, kontrol döngüsü, dağıtım |
| [CLAUDE.md](CLAUDE.md) | Claude'un bu repoda izlediği iş akışı ve öğrenilmiş dersler |
| [template.html](template.html) | Çalışan iskelet: `__setTime`, `?t=`, mulberry32, easing seti, tabular rakam, Web Audio + offline WAV |
| [tools/check.mjs](tools/check.mjs) | `Math.random`, tüm karelerde hata, determinizm, `?t=`, ilk saniye hareketi, font sayısı |
| [tools/contact.mjs](tools/contact.mjs) | Her sahnenin başı/ortası/sonu + geçişler, güvenli alan katmanıyla kontak sayfası |
| [tools/tts.mjs](tools/tts.mjs) | `npm run tts -- animasyonlar/<ad>.voice.json`: Gemini TTS ile cümle cümle seslendirme (önbellekli), zaman çizelgesi ve animasyondaki `VO` bloğu |
| [tools/firsat.mjs](tools/firsat.mjs) | `npm run firsat`: YouTube Data API + Gemini ile video türü bazında talep/arz (fırsat) raporu. Bkz. [docs/firsat-analizi.md](docs/firsat-analizi.md) |
| [lib/harita-motoru.js](lib/harita-motoru.js) | "Harita Yalan Söyler" seri motoru: küre/Mercator, altyazı, etiket, ses, render sözleşmesi |
| [lib/ikon-katmani.js](lib/ikon-katmani.js) | Bayrak + il ikonu katmanı (çıkartma görünümü): 81 il eşlemesi `lib/ikonlar.js`, emoji/bayrak seti `lib/ikon-seti.js` (MIT, `npm run ikon-seti` üretir), katalog `npm run ikonlar` |
| [STYLE.md](STYLE.md) | Seri kimliği (sabit): palet, yazı tipleri, hareket dili, ses |
| [tools/render.mjs](tools/render.mjs) | Paralel kare kare PNG → FFmpeg H.264 MP4, sentez sesi ya da `--audio` |
| [promptlar/](promptlar/) | Brif, dikey video, cilalama döngüsü, kapak rehberi, skill'e çevirme |
| [docs/fikirler.md](docs/fikirler.md) | Seri durumu, sıradaki video fikirleri ve üretim/algoritma stratejisi |
| [docs/platform-notlari.md](docs/platform-notlari.md) | Instagram / YouTube / TikTok algoritmaları ve AI içerik kuralları (Kasım 2026) |
| [docs/kutuphaneler.md](docs/kutuphaneler.md) | Kütüphaneler ve her birini `draw(t)`'ye nasıl bağlayacağın |
| [animasyonlar/ornek-yuzde-bir.html](animasyonlar/ornek-yuzde-bir.html) | Örnek: "Her gün %1 daha iyi → 1 yılda 37,8x" (10 sn, dikey, sesli) |

## İş akışı

1. Brif ([promptlar/02-brif.md](promptlar/02-brif.md)): tek cümlelik hedef + **farklılık** satırı
2. Sahne listesi ve süreler → **onay** → kod
3. `check` → `contact` → gözle incele → düzelt
4. Cilalama turu ([promptlar/10-cilalama.md](promptlar/10-cilalama.md)), hedef her başlıkta 8+
5. `render`

## Kontrol listesi

- [ ] Tek cümlelik hedef ve farklılık satırı yazıldı
- [ ] Sahne listesi ve süreler onaylandı, kod ondan sonra yazıldı
- [ ] `npm run check` temiz
- [ ] Kontak sayfası incelendi (taşma, çakışma, güvenli alan, ölü zaman)
- [ ] Cilalama turu yapıldı
- [ ] İlk kare kapak gibi çalışıyor, son kare ilk kareye bağlanıyor (dikeyse)
- [ ] Müzik ve sesin kullanım hakkı sende
- [ ] Final kare kare render edildi

## Kaynak

Kurallar ve yaklaşım [eraycoskunai/opus-animasyon-rehberi](https://github.com/eraycoskunai/opus-animasyon-rehberi)
([@AIMevzulari](https://x.com/AIMevzulari)) rehberinden alınıp bu repoda çalışan araçlara
dönüştürüldü ve platform notlarıyla genişletildi.
