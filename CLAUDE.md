# CLAUDE.md

Bu repo kodla (Canvas 2D / SVG / Three.js) animasyon üretir: görüntü modeli yok,
her piksel kodla çizilir. Her işte **[MOTION_RULES.md](MOTION_RULES.md)** geçerlidir.

## İş akışı (sırayı atlama)

1. **Brif.** Kullanıcı sadece konu verdiyse [promptlar/02-brif.md](promptlar/02-brif.md)'deki
   12 parçayı sen doldur, kararları tek satırla gerekçelendir. Brifi
   `animasyonlar/<ad>.brief.md` olarak kaydet. Kanca türü, ara ödüller, gönderilme sebebi ve
   farklılık satırları zorunlu: `animasyonlar/` içindeki son brifleri ve `yayinlar.csv`'yi oku,
   aynı kanca türünü art arda 2'den fazla kullanma. `STYLE.md` varsa sabit kimliğe uy.
2. **Sahne listesi + süreler + geçiş nesneleri.** Göster, **onay al**. Onaydan önce kod yazma.
3. **Kod.** `template.html` dosyasını `animasyonlar/<ad>.html` olarak kopyala. `CONFIG`, `SCENES`,
   `SOUNDS` ve çizim fonksiyonlarını değiştir. Sözleşme kısmına (en alttaki blok) dokunma.
4. **Denetim.** `npm run check -- animasyonlar/<ad>.html`. ✗ varsa düzelt; ! uyarılarını değerlendir.
5. **Kontak sayfası.** `npm run contact -- animasyonlar/<ad>.html`, sonra `out/<ad>/contact.png`
   dosyasını **Read ile aç ve gerçekten bak**. Taşan yazı, çakışma, okunmayan metin, güvenli alan
   dışı öge, kopuk geçiş, ölü zaman ara. Bulduklarını saniye + kare numarasıyla yaz, düzelt, tekrarla.
6. **Cilalama.** İlk sürüm taslaktır: [promptlar/10-cilalama.md](promptlar/10-cilalama.md)'deki
   direktör turunu uygula (en fazla 3 tur, hedef her başlıkta 8+).
7. **Render.** `npm run render -- animasyonlar/<ad>.html` → `out/<ad>/<ad>.mp4` + `cover.png`.
   Müzik/seslendirme dosyası varsa `--audio dosya.mp3`.
8. **Kayıt.** `yayinlar.csv`'ye satır ekle (metrikler boş). Kullanıcı 48 saat / 7 gün metriklerini
   verince doldur. Her 10 satırda bir kanca türü / süre / yapı karşılaştırması yap ve
   MOTION_RULES.md'deki (V) değerlerini güncellemeyi öner.

"Kod çalışıyor" ile "görüntü doğru" aynı şey değil. Kontak sayfasına bakmadan "bitti" deme.

## Kodlama notları (bu repoda öğrenilen dersler)

- **Türkçe glifler:** Google Fonts İ Ş Ğ ı ş ğ harflerini ayrı alt küme dosyasında verir.
  `document.fonts.load(font, 'İŞĞışğ…')` örnek metinle çağrılmazsa ilk kare yanlış fontla çizilir
  (şablondaki `GLYPHS` bunu çözer; yeni font eklersen `CONFIG.fonts`'a da ekle).
- **Tabular rakam:** Canvas'ta `font-variant-numeric` yok. Değişen sayılar için şablondaki
  `textTab()` kullan, yoksa sayaç titrer.
- **Easing taşması:** Yaylı/geri tepen eğriler boyut ve yarıçapı negatife düşürebilir.
  `roundRect` negatif yarıçapta hata fırlatır; boyutları `Math.max(0, …)` ile sınırla.
  `check` tüm kareleri çizerek bunu yakalar.
- **Durum:** Her şey `t`'den hesaplanır. Bir olayın "ne zaman olduğunu" bilmek gerekiyorsa
  (ör. ses tıkı) zamanı ters hesapla (`monthTime` örneği), kare kare sayaç tutma.
- **Ses:** `SOUNDS` dizisine `{t, type, gain}` ekle. Aynı liste canlı oynatmada Web Audio ile,
  render'da `OfflineAudioContext` ile WAV olarak çalınır; görüntüyle kayma olmaz.
- **WebGL/Three.js:** `preserveDrawingBuffer: true`, döngü yerine `__setTime(t)` içinde `renderer.render`.
- **Gerçek veri:** Kullanıcının vermediği sayı, özellik, müşteri, arayüz uydurma. Emin olmadığın
  bilgiyi ekrana yazma; hesaplanabiliyorsa kodda hesapla (ör. `1.01 ** 365`).

## Düzeltme dili

Kullanıcı kare ile konuşabilir: "logoyu 12 kare geciktir", "son kareyi 30 kare uzat".
60 fps'te 60 kare = 1 sn. Her düzeltmeden sonra ilgili anın karesini `--times` ile alıp göster:
`npm run contact -- animasyonlar/<ad>.html --times 4.2,4.4,4.6`.
