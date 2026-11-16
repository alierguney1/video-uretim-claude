# CLAUDE.md

Bu repo kodla (Canvas 2D / SVG / Three.js) animasyon üretir: görüntü modeli yok,
her piksel kodla çizilir. Her işte **[MOTION_RULES.md](MOTION_RULES.md)** geçerlidir.

## İş akışı (sırayı atlama)

1. **Brif.** Kullanıcı sadece konu verdiyse [promptlar/02-brif.md](promptlar/02-brif.md)'deki
   12 parçayı sen doldur, kararları tek satırla gerekçelendir. Brifi
   `animasyonlar/<ad>.brief.md` olarak kaydet. Kanca türü, ara ödüller, gönderilme sebebi ve
   farklılık satırları zorunlu: `animasyonlar/` içindeki son brifleri ve `yayinlar.csv`'yi oku,
   aynı kanca türünü art arda 2'den fazla kullanma. `STYLE.md` varsa sabit kimliğe uy.
   **Senaryo her zaman merak motoruyla yazılır:** [promptlar/03-senaryo.md](promptlar/03-senaryo.md).
   Cold open, merak boşluğu, katmanlı açık döngüler, gizem, gerilim, ters köşe ve cliffhanger/döngü
   araçlarından en az 5'i kullanılır; brifte "merak haritası" tablosu zorunludur. Bilgi vermek yetmez,
   izleyici her an bir cevap beklemeli.
   Hikâye ve dikkat araçları ("ama / bu yüzden" testi, döngü haritası `__beats`, hikâye testi):
   [docs/hikaye-rehberi.md](docs/hikaye-rehberi.md).
2. **Sahne listesi + süreler + geçiş nesneleri.** Göster, **onay al**. Onaydan önce kod yazma.
3. **Kod.** `template.html` dosyasını `animasyonlar/<ad>.html` olarak kopyala. `CONFIG`, `SCENES`,
   `SOUNDS` ve çizim fonksiyonlarını değiştir. Sözleşme kısmına (en alttaki blok) dokunma.
4. **Denetim.** `npm run check -- animasyonlar/<ad>.html`. ✗ varsa düzelt; ! uyarılarını değerlendir.
   Döngü haritası (`window.__beats`) uyarıları hikâyenin yerinde nerede izleyici kaybedeceğini gösterir.
5. **Kontak sayfası.** `npm run contact -- animasyonlar/<ad>.html`, sonra `out/<ad>/contact.png`
   dosyasını **Read ile aç ve gerçekten bak**. Taşan yazı, çakışma, okunmayan metin, güvenli alan
   dışı öge, kopuk geçiş, ölü zaman ara. Bulduklarını saniye + kare numarasıyla yaz, düzelt, tekrarla.
6. **Cilalama.** İlk sürüm taslaktır: [promptlar/10-cilalama.md](promptlar/10-cilalama.md)'deki
   direktör turunu uygula (en fazla 3 tur, hedef her başlıkta 8+).
7. **Render.** `npm run render -- animasyonlar/<ad>.html` → `out/<ad>/<ad>.mp4` + `cover.png`.
   Müzik/seslendirme dosyası varsa `--audio dosya.mp3`.
8. **Kapak.** [promptlar/12-kapak.md](promptlar/12-kapak.md): `animasyonlar/<ad>.kapak.json` (en az 3 varyant, farklı
   formüller) → `npm run kapak -- animasyonlar/<ad>.kapak.json` → `out/<ad>/kapak-onizleme.png` dosyasını **Read ile aç**,
   kontrol listesini uygula → seçileni `--sec <varyant>` ile 0. kareye göm; yayında `<ad>-kapakli.mp4` kullanılır.
9. **Yayın kuyruğu (elle yükleme yok).** `animasyonlar/<ad>.yayin.json` yaz (`"onay": true`, kapak varyantı,
   brifteki yayın paketinin başlık/açıklama/etiketleri; şema [docs/otomatik-yayin.md](docs/otomatik-yayin.md)).
   Günlük zamanlanmış oturum YouTube + Instagram'a vidIQ ile yükler ve `npm run yayin -- kaydet` ile kaydeder.
   Kullanıcıdan yükleme yapmasını isteme.
10. **Kayıt.** `yayinlar.csv`'ye satır ekle (metrikler boş; otomatik yayında `kaydet` bunu yapar). Kullanıcı 48 saat / 7 gün metriklerini
   verince doldur. Her 10 satırda bir kanca türü / kapak formülü / süre / yapı karşılaştırması yap ve
   MOTION_RULES.md'deki (V) değerlerini güncellemeyi öner.

"Kod çalışıyor" ile "görüntü doğru" aynı şey değil. Kontak sayfasına bakmadan "bitti" deme.

## Seriler

Her seri ayrı kanal, ayrı kimlik; üretim hattı (araçlar, sözleşme, TTS) ortak.

| Seri | Önek | Kimlik | Motor | Durum |
| --- | --- | --- | --- | --- |
| Harita Yalan Söyler | `hys-` | [STYLE.md](STYLE.md) | [lib/harita-motoru.js](lib/harita-motoru.js) | 12 bölüm, 6'sı yayında |
| Seyir Defteri (çalışma adı) | `sd-` | **ayrı repo:** `alierguney1/haritada-hikayeler` | `lib/piksel-motoru.js` (orada) | Pilot `sd-01` orada |

Bu repoya yalnızca HYS bölümleri girer. Ortak araçlarda (`lib/ses.js`, `tools/`, `template.html`) yapılan
iyileştirme diğer repoya da elle taşınır.

## Kodlama notları (bu repoda öğrenilen dersler)

- **Türkçe glifler:** Google Fonts İ Ş Ğ ı ş ğ harflerini ayrı alt küme dosyasında verir.
  `document.fonts.load(font, 'İŞĞışğ…')` örnek metinle çağrılmazsa ilk kare yanlış fontla çizilir
  (şablondaki `GLYPHS` bunu çözer; yeni font eklersen `CONFIG.fonts`'a da ekle).
- **Tabular rakam:** Canvas'ta `font-variant-numeric` yok. Değişen sayılar için şablondaki
  `textTab()` kullan, yoksa sayaç titrer.
- **Easing taşması:** Yaylı/geri tepen eğriler boyut ve yarıçapı negatife düşürebilir.
  `roundRect` negatif yarıçapta hata fırlatır; boyutları `Math.max(0, …)` ile sınırla.
  `check` tüm kareleri çizerek bunu yakalar.
- **Canvas durumu da durumdur:** `lineCap`, `setLineDash`, `textAlign`, `globalAlpha` bir karede ayarlanıp
  bırakılırsa sonraki kareye taşınır ve aynı `t` farklı kare verir. Şablondaki `draw()` her kareyi
  `ctx.save()/restore()` içinde çizer; bu yapıyı koru. `check`'in `?t=` satırı bunu yakalar.
- **Durum:** Her şey `t`'den hesaplanır. Bir olayın "ne zaman olduğunu" bilmek gerekiyorsa
  (ör. ses tıkı) zamanı ters hesapla (`monthTime` örneği), kare kare sayaç tutma.
- **Ses:** `SOUNDS` dizisine olay ekle. Yeni işlerde `lib/ses.js` kullan (`{t, tur, ad, gain, pan, yatak}`):
  kod sentezi ve ZzFX `OfflineAudioContext` ile WAV olur, kütüphane dosyaları (`tur: 'dosya'`) render'da
  FFmpeg ile örnek-kesin eklenir. Ad bulmak için `ses/kutuphane/index.html`; kurallar `docs/ses-rehberi.md`.
  Sesi duyamazsın: spektrogram çiz (`showspectrumpic`) ve olayların saniyesini gözle doğrula.
- **WebGL/Three.js:** `preserveDrawingBuffer: true`, döngü yerine `__setTime(t)` içinde `renderer.render`.
- **Piksel sanatı:** Şekli küçük tuvale maske olarak çiz, alfa ≥ 128 ile eşikle, sonra renklendir;
  büyütme sadece tamsayı kat ve `imageSmoothingEnabled = false`. Piksel boyu okunurluğa göre seçilir:
  1080x1920'de 3x (360x640); 6x telefonda okunmuyor. Karakterleri ASCII ile değil vektör kukla ile çiz. Piksel yazı tipinin rakamlarını ve
  Türkçe harflerini dene (Pixelify'da 5 ≈ S, Silkscreen'de İŞĞ yok). Ayrıntı: haritada-hikayeler reposu, PLAN.md §11.
- **Rota karadan geçmesin:** Elle verilen deniz yolu ara noktalarını `d3.geoContains(LAND, p)` ile
  denetle; 50m veride dar boğazlar (Korfu kanalı, Çanakkale) neredeyse kapalı görünür.
- **Gerçek veri:** Kullanıcının vermediği sayı, özellik, müşteri, arayüz uydurma. Emin olmadığın
  bilgiyi ekrana yazma; hesaplanabiliyorsa kodda hesapla (ör. `1.01 ** 365`).
- **Bayrak ve ikon:** haritada geçen her ülke/il `lib/ikon-katmani.js` ile bayrağını/ikonunu alır (MOTION_RULES §3b).
  Dört script'i (`ikonlar.js`, `ikon-seti.js`, `iller.js`, `ikon-katmani.js`) `harita-motoru.js`'den önce ekle; motor
  `IKON.hazirla()`'yı kendisi bekler. Yeni il ikonu `lib/ikonlar.js`'e kendi SVG'miz olarak (32x32, düz renk) eklenir,
  `npm run ikonlar` ile katalogda göz ile kontrol edilir.
- **CDN engelliyse:** `tools/lib.mjs` jsDelivr isteklerini aynı sürümün npm paketinden sunar (`.cache/cdn/`); bulut ortamında render bu yüzden çalışır.
- **V2 seri motoru (`lib/harita-motoru.js`):** Yeni bölümlerde `textTab`, `headerSeq`, `captionStyle: 'kinetic'`, `tracer`, `meter`, `statPill`, `arrow`, çakışmasız `label` ve çok katmanlı ses (`sub`, `pop`, `chime`, `rise`, `pulse` + ana kompresör) hazırdır. Eski bölümler (`captionStyle: 'box'`, `headerBand`) bozulmaz.
- **`headerBand()` tuzağı (`y = 0..610`):** `headerBand()` `EP.draw()`'dan sonra `#0B141B` gölgesi basar. Üst yarıda net kalması gereken köşe rozeti, kart veya `Durdur-Bul` tablosunu `EP.header(t, g)` içinde (`headerSeq` sonrası) çiz; yoksa kararır.
- **Headless Chromium (SwiftShader) hızı (`BG_CACHE` + BBox):** `D.LAND` / `D.BORDERS` (50m) tüm dünya poligonlarını her karede çizmek kare başına ~160 ms harcar (`check` zaman aşımına düşebilir). Çalışma bölgesine göre bounding-box filtresi + kamera sabitken offscreen `BG_CACHE` + `MultiLineString` toplu çizimi süreyi ~5–10 kat hızlandırır.
- **Emoji kutuları yerine vektör:** Canvas `fillText` içinde `\u23F8` (`⏸`) sistemin turuncu kare emojisini basar. Düz harita dili için `drawPauseBars()` gibi vektörel çizim ya da `lib/ikonlar.js` kullan.
- **Geçiş ve döngü temizliği:** Tam ekran `Durdur-Bul` tablosunun arkasında önceki sahnenin çubukları/ikonları hayalet bırakmamalı (`win()` penceresini tablo girişinden önce kapat). Son 0.65 sn'de ilk karedeki rozet, sayaç ve başlangıç çizgisini geri getir ki son kare = ilk kare olsun.
- **Fikirler ve hızlı push disiplini:** Yeni bölüm fikirleri ve strateji notları [docs/fikirler.md](docs/fikirler.md) dosyasında toplanır. Birden fazla ajan paralel çalıştığı için işe başlamadan önce `git fetch origin`, iş bitiminde (temiz `check` sonrası) değişiklikleri bekletmeden doğrudan varsayılan dala (`claude/clever-newton-v18p72` / `main`) pushla.

## Düzeltme dili

Kullanıcı kare ile konuşabilir: "logoyu 12 kare geciktir", "son kareyi 30 kare uzat".
60 fps'te 60 kare = 1 sn. Her düzeltmeden sonra ilgili anın karesini `--times` ile alıp göster:
`npm run contact -- animasyonlar/<ad>.html --times 4.2,4.4,4.6`.

