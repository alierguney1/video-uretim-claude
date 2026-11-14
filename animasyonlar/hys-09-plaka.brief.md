# hys-09-plaka — brif

Seri: Harita Yalan Söyler · Bölüm 9 · Ali'nin seçimi.

Durum: **Ali onayladı — V2 motoruyla üretim ve render.**
Veri üretimi: `node tools/hys-09-plaka.mjs` → `veri/hys-09/plaka.json`.

## Neden bu fikir

- **Tek cümlelik şok:** "81 ili plaka sırasıyla gezsen dünyanın çevresinden uzun yol yaparsın." 46.555 km > 40.075 km. Kodla hesaplandı.
- **Kanıtlanmış konu:** Plaka, Türkçe harita içeriğinin en büyük outlier'ı. Herkesin bir plakası var.
- **Harita yalan söyler:** Tanıdık bir sıra (01, 02, 03…) haritaya dökülünce saçma bir zikzağa dönüşüyor. Sebebi de bir "aaa": plakalar haritaya göre değil, 1962 alfabesine göre verildi (`33 İçel → Mersin`, `46 Maraş`, `63 Urfa`).
- **Durdur-bul karesi:** 81 ilin plakası ve akıllı rotadaki durak numarası tek ekranda; izleyici kendi ilini bulmak için durdurur (bonus easter egg: **70 Karaman**, hem Dünya çevresini geçilen il hem de akıllı rotada tam **70. durak** — 81 il içinde plakası durak sırasına eşit tek il!).
- **Seri potansiyeli:** "Kendi ilinden başlasan kaç km?" ve "Karayoluyla gerçek rota" devam bölümleri yorumlardan çıkar.

## Brif (12 parça)

1. **Rol:** Animasyon yönetmeni + bilgi tasarımcısı.
2. **Hedef:** İzleyici şunu hatırlamalı: "Plaka sırasıyla 81 il = dünyanın çevresinden uzun (46.555 km); akıllı sırayla 6.948 km, yaklaşık 7 kat kısa."
3. **Format:** 42.85 sn, 1080x1920, 60 fps. Charon (`atempo=1.12`) + V2 çok katmanlı sentez (`sub`, `tick`, `pop`, `rise`, `ping`, `ping2`, `chime`, `drone`, dinamik kompresör).
4. **Sahne listesi:** aşağıda (`IKON` sütunu + V2 `headerSeq` + `captionStyle: 'kinetic'`).
5. **Sanat yönü:** STYLE.md + V2 motor (`#0B141B` / `#0F1C26` okyanus, `#E8E2D4` kâğıt kara, `#FF6B2C` vurgu). Düz Mercator, 81 il sınırı ince koyu çizgi. Plaka rotası `tracer` + koyu dış konturlu `#FF6B2C`; akıllı rota aşamasında plaka ağı kâğıt `%18`'e söner, akıllı rota `#FF6B2C` olarak Edirne→Sivas arasında çizilir. Km sayacı IBM Plex Mono `textTab`, başlık Inter 800, gövde Inter 600/700, `meter` ve `statPill` kartları.
6. **Hareket dili:** (a) Çizgi il merkezleri arasında büyük daire boyunca çizilerek uzar (`d3.geoInterpolate`), km sayacı ve Ekvator `meter` çubuğu çizgiyle birebir senkron. (b) Tempo: 01–04 arası okunaklı (`1. ilk iller`), 05–35 hızlanır, 35 İzmir→36 Kars dev sıçramasında kamera hafif takip + vurgu, 37–70 hızlanır ve 68–69'da gerilimli yavaşlama ile 70 Karaman'da 40.075 km çizgisi delinir. (c) İlgili illerde (`01, 02, 03, 04, 33, 35, 36, 70, 81, 22, 58, 50, 51`) çıkartma ikonlar (`≥ 54 px`, vurgulu ≥ 90 px) `IKON.pop` / `IKON.zipla` ile belirir (`#FF6B2C` ikon içinde kullanılmaz).
7. **Yasaklar:** MOTION_RULES.md. Bu işe özel:
   - "Yol" iması yok: ekranda "kuşuçuşu, il merkezleri" sabit dürüstlük notu. Karayolu km'si iddia edilmez.
   - Akıllı rota "kanıtlanmış mutlak en kısa" diye değil "akıllı sırayla / bulduğumuz en kısa" diye anılır.
   - İl küçümseme veya plaka sistemini alaya alan dil yok.
   - İçel/Mersin etiketinde başka il/ilçe adı karıştırılmaz (`33 İçel → Mersin`).
8. **Kanca türü:** sayı şoku (`01→81` vs `40.075 km`). Seride ilk kez (son yayınlar: `06 tahmin et`, `07 ya …olursa`, `08 yanlış inanış`).
9. **Ara ödüller + Merak haritası:**
   - **Ara ödüller:** `~3 sn` 01 Adana → 02 Adıyaman → 03 Afyon → 04 Ağrı (daha 4. ilde `2.040 km`) · `~8 sn` "neden? plakalar 1962 alfabesine göre" (`33 İçel → Mersin` şeridi) · `~12,5 sn` `35 İzmir → 36 Kars`, tek hamlede `1.387 km` · `~18 sn` `70 Karaman` Ekvator çubuğunu `40.551 km`'de deler + "daha 11 il var" · `~22 sn` toplam `46.555 km` · `~26 sn` akıllı rota `6.948 km`, "`≈7 kat kısa`" · `~29 sn` 81 il durdur-bul tablosu + kapanış `50→51` (`72 km`) gizli detayı.

   | Döngü | Açıldığı sn | Soru (izleyicinin kafasında) | Kapandığı sn |
   | --- | --- | --- | --- |
   | **A (ana vaat)** | 0,0 | 81 ili plaka sırasıyla gezmek gerçekten 40.075 km'yi (Dünya çevresi) geçer mi, kaç km tutar? | ~18 (70 Karaman geçer) → ~22 (46.555 km) |
   | **B (neden)** | ~4,0 | İlk 4 il neden Adana→Adıyaman→Afyon→Ağrı diye ülkeyi boydan boya kesiyor? | ~10,5 (1962 alfabetik kuralı + `33 İçel`) |
   | **C (dev adım)** | ~10,0 | En büyük tek sıçrama hangi iki ardışık plaka arasında? | ~14,5 (`35 İzmir → 36 Kars · 1.387 km`) |
   | **D (kalan + çözüm)** | ~17,8 | Çevre geçildi ama daha 11 il var; toplam kaç olacak ve akıllı gezmeyle ne kadar kısalır? | ~27,5 (`46.555` vs `6.948 km`, `6,7×`) |
   | **E (cliffhanger / etkileşim)** | ~28,0 | Benim kendi ilim bu 6.948 km'lik akıllı rotada kaçıncı durak? | İzleyici durdurur / yorumda paylaşır + `01 Adana` döngüsü |

   - **Ters köşe:** (~8 sn) Plakaların bölgesel olmadığı, 1962 alfabetiğine göre (`33 İçel`) dizildiği; VE (~23 sn) akıllı rotanın azıcık değil tam `6,7 kat` (`6.948 km`) kısalması!
   - **Cliffhanger / döngü:** "Senin ilin bu rotada kaçıncı durak? Durdur, bak." 81 il tablosu + köşede en kısa adım detayı (`50 Nevşehir → 51 Niğde · 72 km`) → tablo süzülüp harita temizlenir, `01 Adana` parlar ve `01→02` ilk çizgi uzamaya başlar (son kare = ilk kare).

10. **Gönderilme sebebi:** Herkes kendi plakasını ve akıllı rotadaki durak numarasını arkadaşına atar ("İstanbul 21, İzmir 7, Ankara 29, Edirne 1, Sivas 81, Karaman hem çevre geçişi hem 70. durak!"); "33 neden Mersin" yorumda tartışılır.
11. **Farklılık:** Seride ilk sayı şoku kancası, ilk V2 motor (`kinetic` altyazı, `meter`, `headerSeq`, `IKON` çıkartma katmanı, çok katmanlı ses), ilk canlı km vs. Ekvator yarışı, ilk 81 il durdur-bul matrisi.
12. **Yayın paketi:** aşağıda.

## Gerçekler (kodla hesaplandı)

`node tools/hys-09-plaka.mjs` → `veri/hys-09/plaka.json`. İl merkezleri: Natural Earth 1:10m (9 il GeoNames). Mesafe: büyük daire (kuşuçuşu), R = 6371,0088 km. Dünya çevresi: ekvator, 40.075 km (WGS84).
Akıllı rota: açık yol, her ilden başlayan en yakın komşu + 2-opt + or-opt; deterministik. Kanıtlanmış mutlak optimum değil ("bulduğumuz en kısa").

| | Değer |
| --- | --- |
| Plaka sırasıyla (01→81) | **46.555 km** (dünya çevresinin 1,16 katı) |
| Dünya çevresi geçişi | **70 Karaman**'a varırken (`40.551 km`); geride 11 il |
| Akıllı sırayla | **6.948 km**, Edirne'de başlar Sivas'ta biter; plaka sırası **6,70 kat** uzun |
| Sabit nokta (easter egg) | **70 Karaman** = akıllı rotada tam **70. durak** (`plaka === durak` olan tek il) |
| İlk 4 il | `01 Adana → 02 Adıyaman 275 → 03 Afyon 683 → 04 Ağrı 1.081` · toplam **2.040 km** |
| En uzun sıçramalar | `35 İzmir → 36 Kars 1.387 km` · `76 Iğdır → 77 Yalova 1.255 km` · `08 Artvin → 09 Aydın 1.253 km` |
| En kısa sıçrama | `50 Nevşehir → 51 Niğde 72 km` |

**Plakaların sırası (doğrulandı):** 27 Eylül 1962 tarihli Resmî Gazete yönetmeliğiyle `01–67` illere o dönemki adlarının alfabetik sırasıyla verildi (`33 İçel → Mersin`, `46 Maraş → Kahramanmaraş`, `63 Urfa → Şanlıurfa`, `67 Zonguldak`); `68–81` sonradan il olanlara kuruluş sırasıyla (`68 Aksaray` .. `81 Düzce`) eklendi.

## Seslendirme metni → `hys-09-plaka.voice.json`

1. Seksen bir ili PLAKA sırasıyla gezsen, dünyanın çevresinden daha uzun yol yaparsın.
2. Sıfır bir Adana'dan başla: Adıyaman, Afyon, Ağrı… Daha dördüncü ilde İKİ BİN kırk kilometre.
3. Neden bu kadar dağınık? Çünkü plakalar haritaya göre değil, ALFABEYE göre verildi.
4. Otuz beşten otuz altıya: İzmir'den Kars'a, tek hamlede bin üç yüz seksen yedi kilometre.
5. Yetmişte, Karaman'da, dünyanın çevresini geçiyorsun.
6. Daha on bir il var.
7. Toplam: kırk altı bin beş yüz elli beş kilometre.
8. Aynı seksen bir il, akıllı sırayla: altı bin dokuz yüz kırk sekiz kilometre. Yaklaşık YEDİ kat kısa.
9. Senin ilin bu rotada kaçıncı durak? Durdur, bak.

## Sahne listesi (V2)

| Sahne | Ekranda | Geçiş nesnesi | `IKON` |
| --- | --- | --- | --- |
| 1. Kanca | 0. karede 81 il + `01 Adana → 02 Adıyaman` uzayan `tracer`. Üstte "81 ili plaka sırasıyla gezsen…", altta km sayacı ve Ekvator `meter` (`40.075 km` eşik çizgisi). | `01→02` çizgi ucu | `01 Adana` (`sis`) |
| 2. İlk 4 il | `02 Adıyaman → 03 Afyonkarahisar → 04 Ağrı`: zikzak batıya sonra en doğuya savrulur. Sayaç `2.040 km`. | Çizgi + sayaç | `02 Adıyaman`, `03 Afyon`, `04 Ağrı` |
| 3. Neden (alfabe) | Çizgi duraksar, alfabetik şerit kartı açılır (`01 Adana..33 İçel → Mersin..67 Zonguldak`, 1962 kuralı). | Alfabe şeridi → harita | `33 Mersin` (`f:banana`, "33 İçel → Mersin") |
| 4. Dev sıçrama | `05→35` hızlanır; `35 İzmir → 36 Kars` tek hamlede tüm ülkeyi boydan boya geçer, kamera hafif takip, `1.387 km` etiketi. | Dev çizgi ucu | `35 İzmir` (`boyoz`) · `36 Kars` (`f:goose`) |
| 5–6. Ekvator geçişi + kalan | `37→69` hızla dolar, tıklar sıklaşır. `69 Bayburt` (`39.853 km`) gerilimli yavaşlama → `70 Karaman` (`40.551 km`) Ekvator çizgisini deler, `ping2`! Sonra `71→81` ("Daha 11 il var"). | Ekvator `meter` çubuğu | `70 Karaman` (`turkce`) · `81 Düzce` (`findik`) |
| 7. Toplam | Tüm 81 il zikzak ağı tamamlanır; büyük `46.555 km` + `%116` Ekvator çubuğu ve 500 ms durgunluk. | Km sayacı → karşılaştırma | `81 Düzce` |
| 8. Akıllı rota | Plaka zikzağı kâğıt `%18`'e söner. `22 Edirne → 58 Sivas` arası temiz `#FF6B2C` rota hızla çizilir; sayaç `6.948 km`. Yan yana barlar + `6,7× kısa (≈7 kat)` pill + "kuşuçuşu" notu. | Akıllı rota çizgisi | `22 Edirne` · `58 Sivas` |
| 9. Durdur-bul + döngü | Koyu cam kartta 3 sütun × 27 satır (`01..81` plaka · il · `#durak`), en alta kaçan detay (`50→51 · 72 km`), ardından kart çözülür, harita temizlenir ve `01 Adana` ilk kareye bağlanır. | `01 Adana` rozeti | `50 Nevşehir`, `51 Niğde`, `01 Adana` |

## Yayın paketi

- **Kapak (`__cover`):** 28.6 sn, zikzakla dolu harita + "Toplam: 46.555 km" + `81 Düzce` çıkartma ikonu.
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
> Plaka sırasıyla 81 il = dünyanın çevresinden uzun 🤯 İlini bulmak için 37. saniyede durdur ⏸
> #plaka #harita #türkiye #81il #memleket

## İl hesaplarıyla paylaşım planı

1. **Hikâyesi olan iller önce:** İzmir ve Kars (35→36, 1.387 km), Karaman (dünya çevresinin geçildiği il), Edirne (akıllı rotanın 1. durağı), Sivas (son durağı), Nevşehir ve Niğde (en kısa adım, 72 km), Adana (01, başlangıç), Düzce (81, bitiş). Her mesaj ilin kendi rolüyle: "Plaka rotasında dünya çevresi Karaman'da geçiliyor."
2. **Büyük kitleli iller:** İstanbul (34, akıllı rotada 21. durak), Ankara (06, 29. durak), İzmir (35, 7. durak), Bursa, Antalya, Konya: yerel haber ve "…lılar" sayfalarına kendi plaka + durak numarasıyla.
3. **Plaka/araba sayfaları:** Plaka temalı sayfalar ve otomobil toplulukları doğal ikinci dağıtım kanalı (collab daveti).
4. **TikTok:** il hashtag'leri ilk yorumda; yorumdaki "benim il kaçıncı" sorularına kısa yanıt videoları (aynı koddan, tek il vurgulu kare).
5. **Story kartları (öneri, ayrı iş):** il başına "34 İstanbul · akıllı rotada 21. durak" kartı, toplu render.
