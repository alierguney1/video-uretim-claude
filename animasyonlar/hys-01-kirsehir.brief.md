# hys-01-kirsehir — brif

Seri: Harita Yalan Söyler · Bölüm 1

- **Rol:** Harita anlatıcısı ve bilgi tasarımcısı.
- **Hedef:** İzleyici şunu hatırlamalı: "Dünyanın merkezi" tek bir nokta değil, hesap yöntemine göre kayıyor; bilinen üç hesabın üçü de Karadeniz'in çevresine düşüyor.
- **Format:** ~36 sn (seslendirmeye göre kesinleşir), 1080x1920, 60 fps. Ses: Gemini TTS, Charon, enerjik stil, %12 hızlı + sentez imza sesi + alçak drone.
- **Sanat yönü / hareket dili:** STYLE.md. Bu bölümde küre (ortografik) kullanılıyor, düz harita yok.
- **Yasaklar:** MOTION_RULES.md. Bu işe özel:
  - Woods'un yöntemini bildiğimizi iddia etme.
  - "Türkiye merkez değil" ya da "merkez Romanya" gibi kesin yargı yok. Sadece "yönteme göre değişir".
  - Kutsal Topraklar notu kaynağın söylediği kadar.
- **Kanca türü:** yanlış inanış (soru biçiminde). Seride ilk.
- **Ara ödüller:**
  1. ~5 sn: 1973 hesabı, 39°K 34°D, Kırşehir'e 22 km
  2. ~10 sn: hesabı isteyen kurum Kutsal Topraklar'ı umuyordu
  3. ~15 sn: 2003 hesabı noktayı 213 km kuzeye, Çorum İskilip'e taşıyor
  4. ~22 sn: bizim hesabımız, kara parçaları alanıyla tartılıyor ve nokta kuzeybatıya kayıyor
  5. ~27 sn: Romanya, Köstence'nin 54 km kuzeyi (Woods'a 764 km)
  6. ~31 sn: üç nokta tek çemberde, "üçü de Karadeniz'in çevresinde"
- **Gönderilme sebebi:** Kırşehirli ya da Çorumlu arkadaşı etiketlemek ("senin memleket dünyanın merkeziymiş / değilmiş"). Memleket konusu Türkiye'de güçlü bir paylaşım tetikleyicisi.
- **Tek izlemede kaçan detay:** Hesap sahnesinde kayarken değişen canlı koordinat sayacı. Köşede, noktanın Kırşehir'den ne kadar uzaklaştığını gösteren km sayacı.
- **Farklılık:** İlk bölüm. Grönland bölümü 2. bölüme kaldı ve kancası "yanlış inanış" yerine "tahmin et" olacak.
- **Gerçekler ve kaynaklar:**
  - Woods (1973): 39°00′K 34°00′E, Kırşehir yakını. Institute for Creation Research isteğiyle yapıldı; kurum merkezin Kutsal Topraklar'da çıkmasını umuyordu. Kaynak: [Wikipedia: Geographical centre of Earth](https://en.wikipedia.org/wiki/Geographical_centre_of_Earth)
  - Isenberg (2003) / Google: 40°52′K 34°34′D, Çorum İskilip. Kaynak: [Hürriyet Daily News](https://hurriyetdailynews.com/google-marks-turkeys-corum-as-center-of-the-earth-100514)
  - Bizim hesabımız: Natural Earth 1:50m kara, 3600×1800 raster, alan ağırlıklı 3B ağırlık merkezi yüzeye izdüşümlü → 44,64°K 28,72°D, Romanya. Kodda canlı hesaplanacak.
  - Mesafeler (büyük daire): Woods→Kırşehir 22 km · Woods→Isenberg 213 km · Bizim→Woods 764 km · Bizim→Köstence 54 km.
- **Paket:**
  - Kapak: 0 sn
  - Başlık: "Kırşehir gerçekten dünyanın merkezi mi?"
  - Açıklama: "1973'te bir fizikçi dünyadaki tüm karaların merkezini hesapladı: Kırşehir. 2003'te başka bir hesap: Çorum. Biz bugünün haritasıyla hesapladık. Sonuç yönteme göre değişiyor. Kaynaklar: Wikipedia (Geographical centre of Earth), Natural Earth."
  - Etiketler: #kırşehir #çorum #dünyanınmerkezi #harita #coğrafya
  - AI etiketi: aç (sentetik seslendirme)
  - Sabit yorum önerisi: "Sence merkez nasıl hesaplanmalı?"

## Seslendirme metni (~85 kelime)

1. Kırşehir, gerçekten dünyanın merkezi mi?
2. 1973'te bir fizikçi, dünyadaki bütün karaların merkezini bilgisayarla hesapladı.
3. Sonuç: otuz dokuz kuzey, otuz dört doğu. Kırşehir'in hemen yanı.
4. İşin ilginci: hesabı isteyen kurum, merkezin Kutsal Topraklar'da çıkmasını umuyordu.
5. 2003'te başka bir hesap, noktayı Çorum İskilip'e taşıdı.
6. Biz de bugünün haritasıyla hesapladık. Her kara parçasını, büyüklüğüyle tarttık.
7. <short pause> Bizim noktamız… Romanya'da çıktı.
8. Yani tek bir merkez yok: yöntem değişince nokta kayıyor. Ama üç hesabın üçü de Karadeniz'in çevresinde.

## Sahne listesi (taslak, onay bekliyor)

| Sn | Sahne | Ekranda | Geçiş nesnesi |
| --- | --- | --- | --- |
| 0–3 | Kanca | Türkiye'ye dönük küre, 0. karede yavaş dönüyor. Kırşehir'de nabız atan işaret, üstte "Dünyanın merkezi?" | Kırşehir işareti |
| 3–9 | 1973 | Kırşehir'e yakınlaşma, koordinat yazılır (Plex Mono), "1973 · Woods" etiketi, Kırşehir'e 22 km | İşaret |
| 9–13 | Twist | Kamera güneye kayar, Kudüs çevresinde soluk bir halka: "umulan". Asıl nokta Kırşehir'de kalır. | Halka → işaret |
| 13–18 | 2003 | İkinci işaret Kırşehir'den Çorum İskilip'e bir çizgiyle uzanır, "213 km" | Çizgi |
| 18–26 | Bizim hesap | Kamera geri çekilir. Kıtalar noktalardan oluşan ızgaraya dönüşür; noktalar alanıyla tartılıyormuş gibi parlar. Vurgu renginde üçüncü işaret ağırlık merkezine doğru kayar, koordinat ve km sayacı canlı akar. | Izgara → vurgu işareti |
| 26–30 | Gerçek | 500 ms durgunluk → işaret Romanya'da durur, ping, "Romanya · 44,6°K 28,7°D" | Vurgu işareti |
| 30–34 | Sonuç | Üç işaret tek çember içinde, Karadeniz vurgulu: "Üçü de Karadeniz'in çevresinde" | Çember |
| 34–36 | Döngü | Küre dönerek ilk açıya gelir, çember Kırşehir işaretine küçülür; son kare ilk kare | Kırşehir işareti |
