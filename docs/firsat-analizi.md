# Fırsat analizi: çok izlenen ama az yapılan video türleri

Amaç: "ne tutuyor" değil, **"ne tutuyor ve henüz kalabalık değil"** sorusunu sormak.
Bir video türü için iki şey ölçülür:

- **Talep:** o türdeki videolar ne kadar izleniyor (videonun yaşına bölünmüş günlük izlenme).
- **Arz:** o türde ne kadar video var, kaç kanal yapıyor.

Talep yüksek, arz düşükse orası boşluktur. Üçüncü sinyal **kırılma oranı**: küçük kanalların
(izlenme ≥ 3 × abone) o türde patlaması. Bu, algoritmanın kanala değil formata ödül verdiğini
gösterir ve yeni bir hesap için en önemli sinyaldir.

## Araç: `npm run firsat`

[tools/firsat.mjs](../tools/firsat.mjs) + [arastirma/firsat-tohumlar.json](../arastirma/firsat-tohumlar.json)

1. **Topla:** Tohum sorgularıyla YouTube Data API'den son 90 günün Türkçe Shorts'ları (sorgu başına 50).
2. **Etiketle:** Gemini her videoyu başlığından bir **türe** koyar (boyut karşılaştırma, sıralama,
   ya-olursa, rota, quiz, zaman atlamalı, tek hikâye, veri haritası, statik liste) ve konu dışı olanları ayıklar.
3. **Puanla:** Tür bazında günlük izlenme, örnekteki pay, kanal sayısı, kırılma oranı ve kaba fırsat
   skoru = günlük izlenme × (0,1 + kırılma) / pay.
4. **Çıktı:** `out/firsat/rapor.md` (tablo + her türün en iyi 3 örneği) ve `out/firsat/videolar.csv`.

Maliyet: **vidIQ kredisi harcamaz.** YouTube Data API günde 10.000 birim ücretsiz; bir çalıştırma
~2.500 birim (24 sorgu × 100 + birkaç birim). Gemini etiketleme birkaç istek. Yanıtlar önbellekte
tutulur, aynı gün tekrar çalıştırmak kota harcamaz.

Kurulum (bir kez): Google Cloud'da bir proje → "YouTube Data API v3"ü etkinleştir → API anahtarı oluştur.
Anahtar ortamın ağ sırrı olarak `youtube.googleapis.com` için kaydedilir; koda yazılmaz.

Yeni tür ya da konu denemek için tohum dosyasına sorgu/tür ekle, aracı tekrar çalıştır.
Skor kaba bir sıralamadır: tek çalıştırmaya değil, ayda bir tekrarlanan eğilime bak.

## Ücretsiz alternatifler (vidIQ kredisi harcamadan)

| Araç | Ne verir | Ne zaman |
| --- | --- | --- |
| **YouTube Studio → Araştırma (Research) sekmesi** | İzleyicinin aradığı konular ve YouTube'un "yetersiz içerik" diye işaretlediği aramalar. Arzu edilen boşluk analizinin YouTube'un kendi versiyonu | Her hafta, kanal biraz izlenme aldıktan sonra |
| **YouTube Studio → İlham (Inspiration)** | İzleyicinin izlediği benzer videolardan konu önerileri | Yeni bölüm konusu ararken |
| **TikTok Creative Center** (ads.tiktok.com/business/creativecenter) | Türkiye'de yükselen hashtag'ler, sesler, içerik üreticiler; reklam hesabı gerekmez | Haftada bir |
| **Google Trends** (YouTube Arama filtresi) | Bir konunun Türkiye'de arama eğilimi, mevsimsellik | Konu seçerken |
| **Instagram Profesyonel Pano + Deneme Reel'leri** | Kendi Reel'lerimizin takipçi dışı performansı; iki kancayı karşılaştırma | Her yayından 48 saat sonra |
| **`npm run firsat`** | Tür bazında talep/arz tablosu | Ayda bir |
| **vidIQ (kredili)** | Instagram/TikTok outlier araması ve kanal analizi; ücretsiz kaynaklarda olmayanlar | Ayda birkaç sorgu, sadece gerektiğinde |

## Şu an tek türdeyiz: denenebilecek türler

Mevcut 8 bölüm "tek hikâye / tahmin et" ağırlıklı (konu farklı, kalıp benzer). Hepsi kodla
çizilebilir ve STYLE.md kimliği korunabilir; yeni olan anlatım kalıbıdır.

| Tür | Örnek bölüm fikri | Neden (Kasım 2026 vidIQ gözlemi) | Veri |
| --- | --- | --- | --- |
| **Boyut karşılaştırma (sürükle)** | "Türkiye'yi Rusya'nın üstüne koyalım" serisi, izleyici yorumdan ülke ister | IG'de 751 takipçili hesap 453 B (85×) | Natural Earth, hesaplanır |
| **Sıralama / geri sayım** | "Haritada en çok yalan söylenen 10 ülke" (Mercator şişme oranı) | TikTok sıralama videoları 0,7–1,1 M | Hesaplanır |
| **Ya … olursa** | "Türkiye düz bir çizgide doğuya kaysa hangi iklime düşerdi" | "Türkiye'yi su bassa" 1 M | Enlem hesaplanır; deniz seviyesi için yükseklik verisi gerekir |
| **Rota / mümkün mü** | "İstanbul'dan yürüyerek Cape Town'a" | "Portekiz'den Arjantin'e yürümek" 1,5 M | Kara bağlantısı hesaplanır |
| **Quiz / 3 saniyede bul** | "Bu siluet hangi il?" 81 il serisi | Yorum ve tekrar izleme getirir | Natural Earth il sınırları |
| **Veri haritası (81 il)** | "Denize en uzak il merkezi" | Yerel ilgi; @haritakonusuyor 1 M | Hesaplanır |
| **Zaman atlamalı** | "Haritalar 500 yılda nasıl değişti" (projeksiyonlar tarihi) | Henüz ölçülmedi | Tarihî sınır verisi dikkat ister |

Öneri: fırsat raporu çıkınca en yüksek skorlu 2 türden birer bölüm yap, aynı hafta yayınla,
48 saat sonra `yayinlar.csv`'de mevcut türle karşılaştır (MOTION_RULES §7).

## İlk sonuç (9 Kasım 2026)

Rapor: [arastirma/firsat-2026-11-09.md](../arastirma/firsat-2026-11-09.md). 950 harita/coğrafya
Shorts'u, son 90 gün; 80 video etiketlenemedi (Gemini 502), "diger"e düştü. Örnekte İngilizce
videolar da var (quiz türünde çok).

- **Bizim ana türümüz (tek hikâye) en kalabalık, en az izlenen:** örneğin %27'si, 200 kanal,
  medyan günlük 59 izlenme, kırılma %11. Bölüm 5–8 (Sandy, Diomede, Sülün, Samoa) bu türde.
- **Boyut karşılaştırma:** kırılma %32 (büyük türler arasında en yüksek). "Türkiye haritalarda
  bize neden küçük gösteriliyor?" 947 B. Grönland bölümü bu türde, açılış için doğru seçim.
- **Ya … olursa:** büyük türler içinde en yüksek günlük izlenme (348), %42'si Türkiye konulu.
- **Statik liste / infografik:** sadece 20 video ama kırılma %65, günlük 5,6 B ("Türkiye'nin en
  iyi yemeklerine sahip illeri" 2,5 M). Örnek küçük; ucuz bir deneme ile doğrulanmalı.
- **Zaman atlamalı:** zayıf (günlük 51, kırılma %2). Şimdilik yapma.

Karar önerisi: sıradaki bölümler boyut karşılaştırma, Türkiye merkezli ya-olursa ve bir
statik-liste denemesi. Tek hikâye bölümleri yayın takviminde kalır ama yenisi üretilmez.
