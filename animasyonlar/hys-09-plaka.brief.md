# hys-09-plaka — brif

Seri: Harita Yalan Söyler · Bölüm 9 · Ali'nin seçimi (11 Kasım 2026), 20 fikir listesinin dışından.

Durum: **brif + sahne listesi onay bekliyor.** Onaydan önce `.html` yazılmaz (CLAUDE.md adım 2).
Rafta kalan adaylar: `hys-09-baskentler.*` (beğenilmedi), `hys-09-gunes.*` (Aralık başı için mevsimlik yedek).

## Neden bu fikir

- **Tek cümlelik şok:** "81 ili plaka sırasıyla gezsen dünyanın çevresinden uzun yol yaparsın." 46.555 km > 40.075 km. Kodla hesaplandı.
- **Kanıtlanmış konu:** Plaka, Türkçe harita içeriğinin en büyük outlier'ı ("İstanbul neden 34?" 2,8M). Herkesin bir plakası var.
- **Harita yalan söyler:** Tanıdık bir sıra (01, 02, 03…) haritaya dökülünce saçma bir zikzağa dönüşüyor. Sebebi de bir "aaa": plakalar haritaya göre değil, alfabeye göre verildi.
- **Durdur-bul karesi:** 81 ilin plakası ve akıllı rotadaki durak numarası tek ekranda; izleyici kendi ilini bulmak için durdurur.
- **Seri potansiyeli:** "Kendi ilinden başlasan kaç km?" ve "Karayoluyla gerçek rota" devam bölümleri yorumlardan çıkar.

## Brif (12 parça)

1. **Rol:** Animasyon yönetmeni + bilgi tasarımcısı.
2. **Hedef:** İzleyici şunu hatırlamalı: "Plaka sırasıyla 81 il = dünyanın çevresinden uzun (46.555 km); akıllı sırayla 6.948 km, yaklaşık 7 kat kısa."
3. **Format:** ~35 sn, 1080x1920, 60 fps. Charon + sentez: her yeni ile varışta kısa tık (hızlandıkça tıklar sıklaşır), çevre geçişinde ping, alçak drone.
4. **Sahne listesi:** aşağıda.
5. **Sanat yönü:** STYLE.md. Düz Mercator, 81 il sınırı kâğıt rengi. Plaka rotası vurgu `#FF6B2C` (yanıltıcı olan değil, gerçek yol); akıllı rota da vurgu, plaka rotası o anda kâğıt %20'ye söner. Km sayacı IBM Plex Mono, `textTab`. Plaka numaraları Plex Mono, il adları Inter 600.
6. **Hareket dili:** (a) Çizgi il merkezleri arasında büyük daire boyunca çizilerek uzar (`d3.geoInterpolate`), km sayacı çizgiyle birebir. (b) Tempo: ilk 9 il yavaş (her il okunur), 10–66 hızlanır, 67–81 yeniden yavaşlar (çevre geçişi). (c) Kamera sabit; sadece İzmir→Kars sıçramasında hafif takip.
7. **Yasaklar:** MOTION_RULES.md. Bu işe özel:
   - "Yol" iması yok: ekranda "kuşuçuşu, il merkezinden" sabit not. Karayolu km'si iddia edilmez.
   - Akıllı rota "en kısa" diye değil "akıllı sırayla / bulduğumuz en kısa" diye anılır (kanıtlanmış optimum değil).
   - İl küçümseme yok; plaka sistemini alaya alan dil yok, sadece "alfabeye göre verilmiş".
8. **Kanca türü:** sayı şoku. Seride ilk kez (01–08: yanlış inanış, tahmin et, görsel paradoks, ya …olursa, sonuçtan başla, tahmin et, ya …olursa, yanlış inanış).
9. **Ara ödüller:** ~3 sn 01 Adana → 02 Adıyaman → 03 Afyon, daha 4. ilde 2.040 km · ~8 sn "neden? plakalar alfabeye göre" (Mersin 33 çünkü İçel) · ~13 sn 35 İzmir → 36 Kars, tek hamlede 1.387 km · ~18 sn sayaç küre şeridini doldurur, 70 Karaman'da dünya çevresi geçilir, "daha 11 il var" · ~22 sn toplam 46.555 km · ~26 sn akıllı rota 6.948 km, "yaklaşık 7 kat kısa" · ~30 sn durdur-bul karesi.
10. **Gönderilme sebebi:** Herkes kendi plakasını ve ilinin durak numarasını arkadaşına atar; "plakalar neden böyle" sorusu yorumda tartışılır.
11. **Farklılık:** Seride ilk sayı şoku kancası, ilk canlı km yarışı (çizgi vs. dünya çevresi), ilk durdur-bul karesi.
12. **Yayın paketi:** aşağıda.

## Gerçekler (kodla hesaplandı)

`node tools/hys-09-plaka.mjs` → `veri/hys-09/plaka.json`. İl merkezleri: Natural Earth 1:10m (9 il GeoNames). Mesafe: büyük daire, R = 6371,0088 km. Dünya çevresi: ekvator, 40.075 km (WGS84).
Akıllı rota: açık yol, her ilden başlayan en yakın komşu + 2-opt + or-opt; deterministik. Kanıtlanmış optimum değil.

| | Değer |
| --- | --- |
| Plaka sırasıyla (01→81) | **46.555 km** (dünya çevresinin 1,16 katı) |
| Dünya çevresi geçişi | 70 Karaman'a varırken (40.551 km); geride 11 il |
| Akıllı sırayla | **6.948 km**, Edirne'de başlar Sivas'ta biter; plaka sırası 6,7 kat uzun |
| İlk 4 il | 01 Adana → 02 Adıyaman 275 → 03 Afyon 683 → 04 Ağrı 1.081 · toplam 2.040 km |
| En uzun sıçramalar | 35 İzmir → 36 Kars 1.387 · 76 Iğdır → 77 Yalova 1.255 · 08 Artvin → 09 Aydın 1.253 · 21 Diyarbakır → 22 Edirne 1.238 · 64 Uşak → 65 Van 1.214 |
| En kısa sıçrama | 50 Nevşehir → 51 Niğde 72 km |

**Plakaların sırası (kaynak gerekli, ekrana çıkmadan doğrulanacak):** 01–67 il adlarının o dönemki alfabetik sırasıyla verildi (33 İçel → bugün Mersin, 46 Maraş, 63 Urfa); 68–81 sonradan kurulan illere kuruluş sırasıyla eklendi. Kaynak olarak Karayolları Trafik Yönetmeliği / Wikipedia "Türkiye il plaka kodları" sayfası kontrol edilecek.

## Seslendirme metni (~85 kelime) → `hys-09-plaka.voice.json`

1. 81 ili plaka sırasıyla gezsen, dünyanın çevresinden daha uzun yol yaparsın.
2. 01 Adana'dan başla: Adıyaman, Afyon, Ağrı… Daha dördüncü ilde iki bin kilometre.
3. Neden bu kadar dağınık? Çünkü plakalar haritaya göre değil, alfabeye göre verildi.
4. 35'ten 36'ya: İzmir'den Kars'a, tek hamlede 1.387 kilometre.
5. 70'te, Karaman'da, dünyanın çevresini geçiyorsun. Daha 11 il var.
6. Toplam: 46.555 kilometre.
7. Aynı 81 il, akıllı sırayla: 6.948 kilometre. Yaklaşık yedi kat kısa.
8. Senin ilin bu rotada kaçıncı durak? Durdur, bak.

## Sahne listesi (taslak, onay bekliyor)

| Sn | Sahne | Ekranda | Geçiş nesnesi |
| --- | --- | --- | --- |
| 0–3 | Kanca | 0. karede 81 il; Adana'dan Adıyaman'a çizgi zaten uzuyor. Üstte "81 ili plaka sırasıyla gezsen…", altta km sayacı ve yanında ince "dünya çevresi" şeridi (0 / 40.075). | Çizgi ucu |
| 3–7,5 | İlk iller | 02 Adıyaman, 03 Afyon, 04 Ağrı: çizgi batıya, sonra en doğuya savrulur. Her varışta plaka rozeti ("03") il üstünde belirir. Sayaç 2.040. | Çizgi |
| 7,5–11 | Neden | Çizgi durur. Sağda alfabe şeridi: "Adana · Adıyaman · Afyon · Ağrı…", "33 İçel" küçük not (bugün Mersin). | Alfabe şeridi → çizgi |
| 11–15 | Sıçrama | Hızlanma (05–35), 35 İzmir'e varış, sonra İzmir→Kars tek hamle, kamera hafif takip, "1.387 km". | Çizgi |
| 15–20 | Çevre | 36–70 hızlı akar, tıklar sıklaşır. Çevre şeridi dolar; 70 Karaman'da şerit taşar, ping, "Dünyanın çevresi geçildi · daha 11 il". | Çevre şeridi |
| 20–23 | Toplam | 71–81, son çizgi Düzce. Harita zikzakla dolu, büyük "46.555 km". | Sayaç |
| 23–28 | Akıllı rota | Plaka rotası %20'ye söner. Edirne'den Sivas'a tek temiz çizgi hızla çizilir, ikinci sayaç 6.948. Yan yana: 46.555 / 6.948, "≈7 kat". | Akıllı çizgi |
| 28–30,5 | **Durdur-bul** | 81 il, 3 sütun, plaka sırasıyla: plaka · il · durak no (vurgu). Altta "⏸ durdur, ilini bul". Taslak: `/mnt/project-files/hys-09/dondur-plaka.png`. | Liste |
| 30,5–35 | Döngü | Liste dağılır, harita temizlenir, Adana'da 01 rozeti; son kare ilk kare. Köşede kaçan detay: "En kısa adım: 50 Nevşehir → 51 Niğde, 72 km". | 01 rozeti |

## Yayın paketi

- **Kapak (`__cover`):** ~22 sn, zikzakla dolu harita + "81 ili plaka sırasıyla gezsen kaç km?" + "46.555 km". Taslak: `/mnt/project-files/hys-09/kapak-plaka.png`.
- **Başlık (YouTube Shorts):** 81 ili plaka sırasıyla gezsen kaç km yol yaparsın?
- **AI etiketi:** aç (sentetik seslendirme).
- **Sabit yorum:** "Plakan kaç, akıllı rotada kaçıncı duraksın? Yaz bakalım 👇"

**YouTube açıklama:**
> 01 Adana'dan 81 Düzce'ye, 81 ili plaka sırasıyla kuşuçuşu gezdik: 46.555 km, dünyanın çevresinden (40.075 km) uzun. Aynı 81 il akıllı sırayla 6.948 km. Hesap: il merkezleri (Natural Earth), büyük daire mesafesi; yol mesafesi değil.
> #plaka #harita #türkiye #81il #coğrafya

**Instagram açıklama:**
> 81 ili plaka sırasıyla gezsen dünyanın çevresinden uzun yol yaparsın 🌍
> 01→81: 46.555 km. Akıllı sırayla: 6.948 km. İzmir'den Kars'a (35→36) tek hamlede 1.387 km.
> Senin ilin akıllı rotada kaçıncı durak? Videoyu durdur ⏸
> #plaka #harita #türkiye #81il #memleket

**TikTok açıklama:**
> Plaka sırasıyla 81 il = dünyanın çevresinden uzun 🤯 İlini bulmak için 28. saniyede durdur ⏸
> #plaka #harita #türkiye #81il #memleket

## İl hesaplarıyla paylaşım planı

1. **Hikâyesi olan iller önce:** İzmir ve Kars (35→36, 1.387 km), Karaman (dünya çevresinin geçildiği il), Edirne (akıllı rotanın 1. durağı), Sivas (son durağı), Nevşehir ve Niğde (en kısa adım, 72 km), Adana (01, başlangıç), Düzce (81, bitiş). Her mesaj ilin kendi rolüyle: "Plaka rotasında dünya çevresi Karaman'da geçiliyor."
2. **Büyük kitleli iller:** İstanbul (34, akıllı rotada 21. durak), Ankara (06, 29. durak), İzmir (35, 7. durak), Bursa, Antalya, Konya: yerel haber ve "…lılar" sayfalarına kendi plaka + durak numarasıyla.
3. **Plaka/araba sayfaları:** Plaka temalı sayfalar ve otomobil toplulukları doğal ikinci dağıtım kanalı (collab daveti).
4. **TikTok:** il hashtag'leri ilk yorumda; yorumdaki "benim il kaçıncı" sorularına kısa yanıt videoları (aynı koddan, tek il vurgulu kare).
5. **Story kartları (öneri, ayrı iş):** il başına "34 İstanbul · akıllı rotada 21. durak" kartı, toplu render.
