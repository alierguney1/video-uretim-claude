# hys-02-gronland — brif

Seri: Harita Yalan Söyler · Bölüm 2

- **Hedef:** Okulda gördüğümüz dünya haritası (Mercator) kutuplara yaklaştıkça şişirir; Grönland Türkiye'nin 27 katı değil, 2,8 katı.
- **Format:** 35,4 sn, 1080x1920, 60 fps. Charon (enerjik, %12 hızlı) + sentez imza sesi.
- **Kanca türü:** tahmin et (önceki: yanlış inanış).
- **Ara ödüller:** canlı oran sayacı 27 → 2,8 (taşıma) · "Gerçekte 2,8×" · eşit daireler kutupta şişiyor · Afrika haritada 0,9×, gerçekte 13,9×.
- **Gönderilme sebebi:** "Bil bakalım kaç kat"; çoğu kişi yanılır.
- **Tek izlemede kaçan detay:** Grönland kayarken dönüyor (küre üzerinde gerçek taşıma) ve sayaç her karede değişiyor.
- **Farklılık:** Bölüm 1 küre + canlı hesap; bu bölüm düz Mercator + şekil taşıma.
- **Gerçekler (kodda hesaplanır, Natural Earth 1:50m):** Mercator alan oranı Grönland/Türkiye 27,3 · gerçek 2,76 · Afrika/Grönland Mercator 0,95, gerçek 13,9. Taşıma: `d3.geoRotation` ile merkez Türkiye'nin merkezine döndürülür.
- **Paket:**
  - Başlık: "Grönland gerçekte Türkiye'nin kaç katı?"
  - Açıklama: "Okulda gördüğümüz dünya haritası (Mercator) kutuplara yaklaştıkça alanları şişirir. Grönland haritada Türkiye'nin 27 katı görünür, gerçekte 2,8 katı. Afrika'ya ise neredeyse 14 Grönland sığar. Veri: Natural Earth."
  - Etiketler: #harita #coğrafya #grönland #mercator #bilgi
  - AI etiketi: aç (sentetik seslendirme)
  - Sabit yorum: "Tahminin kaçtı?"
