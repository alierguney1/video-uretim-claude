# hys-09-gunes — brif

Seri: Harita Yalan Söyler · Bölüm 9 (fikir 10'un 81 ile genişletilmiş hali, 20 fikrin dışından)

Durum: **brif + sahne listesi onay bekliyor.** Onaydan önce `.html` yazılmaz (CLAUDE.md adım 2).
Önceki aday (`hys-09-baskentler.*`) Ali beğenmediği için rafta; verisi seride ileride kullanılabilir.

## Neden bu fikir

- **Durdur-bul karesi (Ali'nin fikri):** 28–31 sn'de 2,5 sn boyunca 81 ilin doğuş/batış saati tek ekranda. Okunacak kadar uzun değil; izleyici kendi ilini bulmak için videoyu durdurur ya da başa sarar. Durdurma ve tekrar izleme Shorts ve TikTok'ta güçlü sinyal.
- **Mevsimi tam:** Sabahlar karardı; her kış "kalıcı yaz saati" tartışması açılıyor. Yayın penceresi 1–15 Aralık, 21 Aralık'ta story ile tekrar.
- **Herkes kendi sabahını biliyor:** Sayı kendi deneyimiyle tartılır, "bizde daha erken kararıyor" yorumu gelir.
- **Kanal nişinde:** saat dilimi, STYLE.md niş listesinde. Her sayı kodla hesaplanır (`tools/hys-09-gunes.mjs`).
- **81 il hesabına 81 ayrı sayı:** her il hesabının paylaşacağı kendi saati var.

## Brif (12 parça)

1. **Rol:** Bilgi tasarımcısı + harita anlatıcısı.
2. **Hedef:** İzleyici şunu hatırlamalı: "Türkiye'de saat aynı ama güneş değil: 21 Aralık'ta Hakkari'de güneş Edirne'den 81 dakika önce doğuyor."
3. **Format:** ~34 sn, 1080x1920, 60 fps. Charon + sentez: il aydınlandığında çok kısa tık, gerçek anında ping, alçak drone.
4. **Sahne listesi:** aşağıda.
5. **Sanat yönü:** STYLE.md. Düz Mercator, 81 il sınırı. Gece = okyanus tonunun koyusu üstünde kâğıt %25; gündüz = kâğıt `#E8E2D4`; gece-gündüz çizgisi (terminatör) ve "gerçek" saatler vurgu `#FF6B2C`. Saat sayacı IBM Plex Mono, `textTab`.
6. **Hareket dili:** (a) Terminatör gerçek güneş konumundan hesaplanır, saat sayacıyla birebir kayar (elle animasyon yok). (b) Bir il, kendi doğuş dakikasında aydınlanır (tık). (c) Saat ilerlerken kamera durur; saat dururken kamera kayar.
7. **Yasaklar:** MOTION_RULES.md. Bu işe özel:
   - "Türkiye'nin saati yanlış" ya da yaz saati politikası hakkında yargı yok; sadece saatler. Tartışmayı yorumlar açar.
   - İl küçümseyen ifade yok ("erken kararıyor, karanlıkta kalıyor" değil; "güneş önce orada").
   - Rakım/dağ etkisi hesaplanmadı: ekranda "il merkezi, deniz seviyesi, ±2 dk" notu.
8. **Kanca türü:** görsel paradoks (aynı saat, haritanın yarısı gündüz yarısı gece). Son yayınlananlar: tahmin et (06), ya …olursa (07), yanlış inanış (08) → tekrar yok.
9. **Ara ödüller:** 0 sn saat 08:00, harita ikiye bölünmüş · ~4 sn "aynı saat, aynı güneş değil" · ~8 sn Hakkari 07:16 ilk doğuş · ~12 sn terminatör batıya kayar, iller tek tek yanar · ~17 sn Edirne 08:37, "81 dakika" · ~22 sn akşam tersine: Iğdır 16:42 ilk batış, İzmir 17:54 son · ~28 sn **durdur-bul karesi** (81 il) · köşede kaçan detay: en kısa gün Sinop 9 sa 7 dk, en uzun Hatay 9 sa 41 dk.
10. **Gönderilme sebebi:** Memleketlisine "bizde güneş saat kaçta doğuyor bak" diye atar; doğu-batı arkadaş çiftleri birbirine gönderir ("sen kalkarken bizde öğle gibi").
11. **Farklılık:** Seride ilk kez saat/zaman ana eksen; ilk "durdur-bul" karesi; ilk tarih bağlı (mevsimlik) bölüm.
12. **Yayın paketi:** aşağıda.

## Gerçekler (kodla hesaplandı)

`node tools/hys-09-gunes.mjs` (varsayılan 2026-12-21) → `veri/hys-09/gunes-2026-12-21.json`.
Yöntem: NOAA güneş denklemleri, ufuk 90,833° (kırılma + güneş yarıçapı), il merkezi (Natural Earth 1:10m; 9 il GeoNames), deniz seviyesi, TSİ (UTC+3). Kontrol: İstanbul 08:25 / 17:39, Ankara 08:06 / 17:26 (bilinen değerlerle uyumlu, ±1 dk).

| | 21 Aralık 2026 |
| --- | --- |
| İlk doğan | Hakkari 07:16 |
| Son doğan | Edirne 08:37 → **81 dk fark** |
| İlk batan | Iğdır 16:42 (Kars 16:43) |
| Son batan | İzmir 17:54 → 72 dk fark |
| En kısa gün | Sinop 9 sa 7 dk |
| En uzun gün | Hatay 9 sa 41 dk |
| Saat 08:00'de | Doğu illerinde güneş doğmuş (Hakkari, Van, Iğdır…), Ankara 08:06, İstanbul 08:25, Edirne 08:37 henüz değil |

## Seslendirme metni (~80 kelime) → `hys-09-gunes.voice.json`

1. Saat sekiz. Hakkari'de güneş çoktan doğdu; Edirne'de hâlâ gece.
2. Türkiye'nin tamamı aynı saati kullanıyor. Güneş kullanmıyor.
3. Yılın en kısa günü, 21 Aralık. Güneş ilk Hakkari'de doğuyor: 07:16.
4. Sonra gece ile gündüzün sınırı batıya kayıyor ve iller tek tek aydınlanıyor.
5. Edirne'ye ancak 08:37'de ulaşıyor. Arada tam 81 dakika.
6. Akşam tersine: Iğdır'da güneş 16:42'de batıyor, İzmir'de 17:54'te.
7. Peki senin ilinde kaçta? Durdur, bak.
8. (Durdur-bul karesi, ses yok, sadece drone + tik)

## Sahne listesi (taslak, onay bekliyor)

| Sn | Sahne | Ekranda | Geçiş nesnesi |
| --- | --- | --- | --- |
| 0–3,5 | Kanca | 0. karede 81 il, terminatör Ankara'nın hemen doğusundan geçiyor: doğu aydınlık, batı karanlık. Üstte büyük saat "08:00" (saniye haneleri akıyor). Hakkari ve Edirne etiketli. | Saat |
| 3,5–6,5 | Paradoks | Saat 08:00'de donar, iki il yan yana kartta: "Hakkari: güneş doğdu · Edirne: gece". | Terminatör |
| 6,5–10 | Başlangıç | Saat 07:00'ye geri sarar, harita tamamen gece. 07:16'da Hakkari yanar (ping), "ilk ışık". | Hakkari |
| 10–17 | Süpürme | Saat 07:16 → 08:37 hızlı akar (≈11 dk/sn). Terminatör batıya kayar, her il kendi dakikasında yanar (tık). Köşede yanan il sayacı 1→81. | Terminatör |
| 17–20,5 | Gerçek | Edirne yanar, 500 ms durgunluk, büyük "81 dk". | "81 dk" yazısı |
| 20,5–26 | Akşam | Saat 16:40 → 17:54. Terminatör bu kez doğudan söndürür: Iğdır 16:42 ilk kararan, İzmir 17:54 son. | Terminatör |
| 26–28 | Soru | "Senin ilinde kaçta?" Harita küçülerek üste kayar. | Harita |
| 28–30,5 | **Durdur-bul** | 81 il, 3 sütun, alfabetik: il · doğuş · batış. Uç değerler vurgu renginde. Altta "⏸ durdur, ilini bul". Taslak: `/mnt/project-files/hys-09/dondur-kare-taslak.png`. | Liste |
| 30,5–34 | Döngü | Liste dağılır, harita geri gelir, saat 08:00'e akar; son kare ilk kare. Köşede Sinop/Hatay gün uzunluğu notu bir an. | Saat |

## Yayın paketi

- **Kapak (`__cover`):** 0 sn: saat 08:00, ikiye bölünmüş harita, üstte "Aynı saat, aynı güneş değil".
- **Başlık (YouTube Shorts):** 21 Aralık'ta güneş senin ilinde kaçta doğuyor?
- **AI etiketi:** aç (sentetik seslendirme).
- **Sabit yorum:** "İlini ve kaçta kalktığını yaz: güneşten önce mi kalkıyorsun, sonra mı?"

**YouTube açıklama:**
> Türkiye'nin tamamı UTC+3 kullanıyor ama güneş doğudan batıya 81 dakikada geçiyor. 21 Aralık 2026'da güneş Hakkari'de 07:16'da, Edirne'de 08:37'de doğuyor; Iğdır'da 16:42'de, İzmir'de 17:54'te batıyor. 81 ilin listesi videoda, durdur ve bak. Hesap: NOAA güneş denklemleri, il merkezi, deniz seviyesi (±2 dk).
> #harita #türkiye #güneş #kışsaati #iller

**Instagram açıklama:**
> 21 Aralık'ta güneş senin ilinde kaçta doğuyor? ⏸ Videoyu durdur, 81 il listede.
> Hakkari 07:16, Edirne 08:37: aynı saat, 81 dakika fark.
> Hesap: NOAA güneş denklemleri, il merkezi (±2 dk).
> #harita #türkiye #güneş #kışsaati #memleket

**TikTok açıklama:**
> Aynı saat, aynı güneş değil ☀️ 81 ilin listesi 28. saniyede, durdur ve bak.
> #harita #türkiye #güneş #kışsaati #memleket

## İl hesaplarıyla paylaşım planı

1. **Uç iller önce:** Hakkari (ilk doğuş), Edirne (son doğuş), Iğdır (ilk batış), İzmir (son batış), Sinop (en kısa gün), Hatay (en uzun gün). Her biri kendi "en"iyle: "21 Aralık'ta Türkiye'de güneşin ilk doğduğu il: Hakkari, 07:16."
2. **Büyük şehirler:** İstanbul 08:25 / 17:39, Ankara 08:06 / 17:26, İzmir, Bursa, Antalya, Konya, Adana: yerel haber ve "…lılar" sayfalarına kendi saatleriyle.
3. **Story kartları (öneri, ayrı iş):** Aynı koddan il başına tek kare "21 Aralık · [il] · ☀ 07:16 ↓ 16:50". 81 kart toplu render; il hesaplarına DM'de video linkiyle.
4. **21 Aralık günü:** IG story'de "bugün" hatırlatması + videoya link; TikTok'ta yorumlara il bazlı yanıt videoları.

Ton: Tarafsız. "Saat yanlış" demiyoruz; sayı konuşur, tartışmayı izleyici açar.
