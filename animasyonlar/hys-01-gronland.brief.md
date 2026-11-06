# hys-01-gronland — brif

Seri: Harita Yalan Söyler · Bölüm 1

- **Rol:** Harita anlatıcısı ve bilgi tasarımcısı.
- **Hedef:** İzleyici şunu hatırlamalı: dünya haritası kutuplara yaklaştıkça her şeyi şişirir; Grönland Türkiye'nin 27 katı değil, 2,8 katı.
- **Format:** ~23 sn (seslendirmeye göre kesinleşir), 1080x1920, 60 fps, Türkçe TTS + sentez imza sesi.
- **Sanat yönü / hareket dili:** STYLE.md.
- **Yasaklar:** MOTION_RULES.md. Bu işe özel: ülke boyutunu elle ölçekleme yok, her kare gerçek yeniden projeksiyon.
- **Kanca türü:** tahmin et (yanlış inanış ailesi). Seride ilk.
- **Ara ödüller:**
  - ~8 sn: kayarken sayaç canlı düşüyor ("İngiltere hizasında: 9 kat")
  - ~13 sn: "2,8 kat" büyük açılış
  - ~17 sn: Afrika haritada Grönland'la aynı görünüyor, gerçekte 13,9 katı
- **Gönderilme sebebi:** Coğrafyasına güvenen arkadaşa "bil bakalım kaç kat" diye; çoğu kişi yanılır.
- **Tek izlemede kaçan detay:** Kayarken sayaç her enlemde değişiyor; köşede küçük enlem göstergesi.
- **Farklılık:** İlk bölüm.
- **Gerçek (kodda hesaplanır, 1:50m Natural Earth):**
  Grönland 2,155 M km² · Türkiye 0,780 M km² → 2,76 · Mercator'da 27,28 ·
  Afrika 29,99 M km² → Grönland'ın 13,9 katı · Mercator'da 0,95.
- **Paket:**
  - Kapak: 0 sn
  - Başlık: "Grönland gerçekte Türkiye'nin kaç katı?"
  - Açıklama: "Okulda gördüğümüz dünya haritası (Mercator) kutuplara yaklaştıkça alanları şişirir. Grönland haritada Türkiye'nin 27 katı görünür, gerçekte 2,8 katı. Veri: Natural Earth."
  - Etiketler: #harita #coğrafya #grönland #mercator #bilgi
  - AI etiketi: seslendirme sentetik olduğu için **aç** (TikTok etiketin dağıtımı düşürmediğini söylüyor; emin değilken açmak daha güvenli).

## Sahne listesi (taslak, onay bekliyor)

| Sn | Sahne | Ekranda | Seslendirme | Geçiş nesnesi |
| --- | --- | --- | --- | --- |
| 0–3 | Kanca | Mercator dünya; Grönland ve Türkiye vurgu konturunda, yanlarında "27x". 0. karede harita yavaşça itiyor. | "Bu haritada Grönland, Türkiye'nin tam yirmi yedi katı." | Grönland |
| 3–5.5 | Tahmin | "Gerçekte kaç katı?" + 600 ms durgunluk | "Sence gerçekte kaç katı?" | Grönland |
| 5.5–12 | Kayma | Grönland haritadan kalkar, Türkiye'nin enlemine kayar ve kaydıkça küçülür; sayaç canlı düşer (27 → 9 → 2,8), köşede enlem | "Onu kutuptan alıp Türkiye'nin hizasına taşıyalım." | Grönland |
| 12–15 | Gerçek | Durgunluk 400 ms → "2,8 kat" büyük, vurgu renginde. Ping. | "Gerçekte sadece iki virgül sekiz katı." | Grönland'ın gerçek boyutu |
| 15–19.5 | Neden + bonus | Mercator ızgarası: kutba doğru büyüyen eşit daireler. Afrika ve Grönland yan yana: "haritada aynı, gerçekte 14 kat". | "Çünkü bu harita kutuplara yaklaştıkça her şeyi şişiriyor. Afrika bile aslında Grönland'ın on dört katı." | Afrika → ızgara |
| 19.5–23 | Döngü | Grönland kuzeye geri kayar ve şişer, "27x" geri gelir. Son kare = ilk kare. | (sessiz, sadece drone) | Grönland |
