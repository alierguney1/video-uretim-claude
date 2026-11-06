# MOTION_RULES.md

Bu projedeki her animasyon bu kurallara uyar. Bölüm 1–4 temel sözleşmedir;
bölüm 5–6 bu repoya özel eklemelerdir.

## 1) Render sözleşmesi

* Tüm görsel durum zamanın saf fonksiyonu olsun: `draw(t)`. Önceki kareye bağlı biriken durum yok.
* Rastgelelik sadece tohumlu üreteçle (ör. mulberry32). `Math.random` yasak.
* Sayfada `window.__duration` ve `window.__setTime(t)` olsun. Böylece dışarıdan kare kare sürülebilsin.
* URL'de `?t=3.2` verilirse o anı çizip dursun (tek kare kontrolü için).
* Sabit çözünürlük ve fps. `devicePixelRatio` ile net çizim.
* Tek dosya HTML. Kütüphane gerekirse CDN'den.
* MP4 gerekiyorsa: headless tarayıcıyla kare kare PNG al, FFmpeg ile birleştir.

## 2) Görünüm yasakları

* Ortalanmış başlık + mor/mavi gradyan şablonu yok.
* Anlamı olmayan parçacık, lens flare, neon parlama, RGB kayması, sürekli kamera sallantısı yok.
* Her şeyin zıpladığı elastik easing yok. Easing işe göre seçilir.
* En fazla 2 yazı tipi, tek vurgu rengi.
* Her sahnenin tek bir işi var. Metin okunacak kadar ekranda kalır (en az 1.2 sn).
* Geçişler önceki sahnede zaten görünen bir nesneden doğar.
* Büyük anlardan önce 300–600 ms durgunluk bırak.

## 3) Ses

* Ses verilmezse Web Audio ile sentezle. Her ses ekranda görünen bir olaya bağlı olsun.
* Müzik verilirse önce analiz et (BPM, vuruşlar, enerji), görüntüyü ona göre zamanla.

## 4) Kontrol döngüsü

* Kod yazmadan önce sahne listesi ve süreleri göster.
* Final render'dan önce her sahneden kare alıp bir kontak sayfası yap, kendi gözünle incele.
* Taşan yazı, çakışma, okunmayan metin, güvenli alan dışı öğe varsa düzelt.
* "Kod çalışıyor" ile "görüntü doğru" aynı şey değil.

---

## 5) Dağıtım kuralları (Shorts / Reels / TikTok)

Algoritmalar "AI" etiketini değil izleyici davranışını ölçer: izlenme oranı,
tekrar izleme, paylaşım (özellikle Instagram'da DM ile gönderme). Ayrıntı:
[docs/platform-notlari.md](docs/platform-notlari.md).

* **İlk kare kapaktır.** 0. saniyede hareket ya da sonuç zaten ekranda olsun. Logo girişi, yavaş fade-in ile açılış yok.
* **Ses kapalıyken anlaşılmalı.** Ana fikir ekrandaki yazıyla da okunabilsin.
* **Döngü.** Dikey videolarda son kare ilk kareye bağlansın (tekrar izlemeyi artırır).
* **Güvenli alan (1080x1920).** Üstteki %12 ve alttaki %20 alana önemli içerik koyma; sağ kenarda ~%12 düğme bandı var.
* **Dikeyde yazı boyu** en az ekran genişliğinin %7'si. Sayılar tabular rakamlı.
* **Gönderilmeye değer olsun.** Her video tek bir şaşırtıcı bilgi, karşılaştırma ya da "aaa" anı taşısın.
* **Şablon tekrarı yok.** Art arda videolar aynı yapı, palet, kanca ve sesle çıkmasın. `brief.md` içindeki "bu videoyu öncekilerden ayıran şey" satırı zorunlu. (YouTube "inauthentic content" ve Instagram özgünlük sıralaması kanal düzeyinde bakar.)
* **Gerçek veri.** Verilmeyen arayüz, sayı, müşteri, özellik uydurma. Emin olunmayan bilgi ekrana yazılmaz.

## 6) Bu repodaki araçlar

* Yeni animasyon: `template.html` kopyalanarak başlar (sözleşme hazır gelir).
* `npm run check -- <dosya>` — sözleşme denetimi: `Math.random` / `requestAnimationFrame` ile biriken durum, `__setTime`, determinizm (aynı `t` iki kez aynı kare mi).
* `npm run contact -- <dosya>` — her sahneden ve geçiş ortasından kare alıp `out/<ad>/contact.png` üretir.
* `npm run render -- <dosya>` — kare kare PNG + FFmpeg ile H.264 MP4.
* Final render, `check` temiz geçmeden ve kontak sayfası incelenmeden yapılmaz.
