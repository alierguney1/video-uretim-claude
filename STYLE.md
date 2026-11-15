# STYLE.md — "Harita Yalan Söyler"

Seri kimliği: MOTION_RULES.md §5'teki **sabit** sütun. Bu dosya yalnızca HYS içindir; diğer seriler
kendi repolarında kendi STYLE dosyasını taşır (Seyir Defteri: `haritada-hikayeler`). Her bölüm buna uyar; kanca türü,
yapı, konu ve süre bölümden bölüme değişir.

## Niş

Haritaların yanılttığı şeyler ve uçuş rotalarının gizli geometrisi. Alan, mesafe, rota,
antipot, saat dilimi, ölçek. **Kural: ekrandaki her sayı kodda gerçek veriden hesaplanır**
(Natural Earth sınırları + d3-geo). Hesaplanamayan iddia ekrana yazılmaz.

Neden bu niş: harita = kodun en güçlü olduğu görsel; gerçekler hesaplanabildiği için araştırma
yükü ve hata riski düşük; "tahmin et → yanıldın" yapısı yorum ve gönderme getirir; küre ve
harita doğal olarak başladığı yere döner (döngü).

## Görsel

| Öğe | Değer |
| --- | --- |
| Okyanus (arka plan) | `#0F1C26` |
| Kara | `#E8E2D4` (kâğıt) |
| Sınır çizgisi | `#0F1C26` %60, 1 px |
| Grid / meridyen | `#E8E2D4` %10 |
| Metin | `#F4F1EA` ana, `#8FA1AD` ikincil |
| **Vurgu = gerçek** | `#FF6B2C`. Yalnızca "gerçek" olan şey vurgu renginde: gerçek boyut, gerçek rota, gerçek sayı. Yanıltıcı olan kâğıt renginde kalır. |
| Yazı tipleri | Inter 800/600 (başlık, ana metin) · IBM Plex Mono 500 (sayılar, koordinat, km) |
| Doku | Yok. Düz, keskin, harita gibi. Gölge yok, parlama yok. |
| İkon / bayrak | Çıkartma (die-cut) görünüm: düz renkli ikon, kâğıt beyazı kenar, ince koyu dış çizgi. Ülkeye bayrak, ile ikon (MOTION_RULES §3b). Haritaya saplanan bayrak (`direk`) serinin imzası. |
| Kapak düzeni | Üstte soru (2 satır, sola hizalı), altında harita, sorulan nesne vurgu renginde kontur, köşede "?" |

## Hareket dili

- **Projeksiyon değişimi = gerçeği göstermek.** Mercator → küre / eşit alan geçişi serinin imza hareketi.
- **Vurgu çizgisinin çizilerek uzaması = rota / mesafe.** Sabit hız, `linear` değil `inOutCubic`.
- **Ülke kayarken boyut değişir = gerçek boyut.** Geometri yeni enleme taşınıp yeniden projekte edilir; elle ölçekleme yok.
- Kamera: yavaş itme ve kaydırma (`inOutCubic`), dönüş sadece küre üzerinde ve tek yönde.
- Sayaçlar her karede gerçek değerden hesaplanır (`textTab`, Plex Mono).

## Ses

- **Seslendirme:** Gemini 3.8 Flash TTS, Türkçe. Ses: **Charon** (sabit). Stil: "enerjik ve merak uyandıran, hızlı tempolu, önemli kelimeleri vurgulayan, izleyiciye meydan okur gibi". Üretimden sonra `atempo=1.12` (perde değişmeden %12 hız).
- **Süre:** 30–45 sn; 4–6 ara ödül.
- Her cümle ayrı üretilir; sahne süreleri cümle sürelerinden hesaplanır.
- **Ses imzası:** gerçek ortaya çıktığında iki notalı yumuşak "ping" (sentez). Altında çok alçak drone (−14 LUFS'u tutturmak için sürekli doku).

## Teknik

- d3-geo `@3.1.1` ve world-atlas `@2.0.2` (countries-50m) jsDelivr'dan, sabit sürüm.
- Veri yüklenmeden `__ready` çözülmez.
- Alan: `d3.geoArea × R²` (R = 6371,0088 km). Mesafe: `d3.geoDistance`. Rota: `d3.geoInterpolate`.
