# Sıradaki Fikirler ve Öğrenimler (`Harita Yalan Söyler`)

Bu dosya diğer ajanların aynı araştırmayı sıfırdan tekrarlamaması için hazırlanmış **aktif fikir havuzu, içerik stratejisi ve üretim öğrenimleri** özetidir. Her yeni fikir veya bölüm kararı doğrudan buraya eklenir ve varsayılan dala (`main` / `claude/clever-newton-v18p72`) pushlanır.

> Temel kural ([MOTION_RULES.md](../MOTION_RULES.md) · [STYLE.md](../STYLE.md)):
> Ekrandaki her sayı **kodda gerçek veriden** hesaplanır. Uydurma istatistik yok. Her video kendi kancası, ters köşesi, ara ödülleri ve döngüsüyle ayrışır.

---

## 1. Seri Durumu ve Açık Halkalar

| Bölüm | Konu | Kanca türü | Durum | Not |
| --- | --- | --- | --- | --- |
| `01`–`08` | Kırşehir, Grönland, Rota, Paralel, Sandy, Diomede, Sülün, Samoa | karışık | Yayında / hazır | Temel seri |
| **`09` (`hys-09-plaka`)** | **81 ili plaka sırasıyla gezsen (`46.555` vs `6.948 km`)** | Sayı şoku | **Üretildi (V2)** | V2 motor + `IKON` + `70 Karaman === #70` easter egg + durdur-bul |
| `10` (`hys-10-anamur`) | Türkiye'nin en güneyi Anamur değil (Hatay) | Gizem (cold open) | Yayında (YT/IG) | Uç noktalar 1 + 3 kapak varyantı |
| `11` (`hys-11-kuzey`) | Türkiye'nin en kuzeyi Sinop değil (Kofçaz) | İtiraf / düzeltme | Yayında (YT/IG) | Uç noktalar 2 (`~800 m`) |
| `12` (`hys-12-bati`) | Türkiye'nin en batısı Babakale değil (Gökçeada) | Yanlış inanış + geri sayım | Üretildi | **Açık cliffhanger:** *"Peki en doğu ucu? Yaz."* |

### Rafta / Hazır Adaylar
- **`hys-13-dogu` ("Türkiye'nin en doğusu neresi?")** — `hys-12-bati`'nin açık bıraktığı halkanın kapanışı (Dilucu / Iğdır sınır üçgeni; önce en az iki bağımsız kaynakla koordinat doğrulaması şart + ilk ışık / gün doğumu farkı + 81 il durdur-bul).
- **`hys-09-gunes` ("21 Aralık'ta güneş senin ilinde kaçta doğuyor?")** — Verisi (`veri/hys-09/gunes-2026-12-21.json`), seslendirmesi ve brifi hazır. **Mevsimlik pencere: 1–21 Aralık.**
- **`hys-09-baskentler` ("81 ilin 43'ü Ankara'dan çok yabancı başkente yakın")** — Verisi (`veri/hys-09/sonuc.json`) hazır. Tek video yerine **"Erivan'a Ankara'dan yakın 23 il"** veya tekil il ikilileri olarak uyarlanabilir.


## 2b. Yeni yön (Ali, 16 Kas): gündelik hayat + istatistik, sadece harita değil

Ali'nin örnekleri: "İstanbul trafiği neden böyle?", "Türkiye'nin kaynakları nasıl dağılıyor?", "İstanbul'daki garip
istatistikler". Hepsi normal insan testinden (viral-analiz §4a) geçmeli. Sayılar **doğrulanmadı**; brif aşamasında
kaynağı bulunmayan hiçbir sayı ekrana çıkmaz.

| Fikir | Neden tutar (test) | Veri kaynağı (doğrulanacak) | Görsel dil |
| --- | --- | --- | --- |
| İstanbul'da trafikte yılda kaç gün geçiriyorsun? | Herkes yaşıyor; İstanbullu iş arkadaşına gönderilir | TomTom Traffic Index (İstanbul), İBB Açık Veri | 24 saatlik dairesel ısı saati + takvimden silinen günler |
| İstanbul trafiği neden böyle? | Herkesin bir teorisi var | İBB boğaz geçiş sayıları, köprü/tünel kapasiteleri | Huni/akış animasyonu: milyonlarca araç 5 geçitten |
| Vergin nereden toplanıp nerede harcanıyor? | Herkesin fikri var; "benim ilim" | Strateji ve Bütçe / Muhasebat il bazında gelir-gider | Sankey akışı, il seçmeli |
| Türkiye 100 kişilik bir köy olsaydı | Kendini bulma; çok paylaşılır formatı | TÜİK ADNKS | Kare (waffle) grafik, insan ikonları |
| İstanbul bir ülke olsaydı Avrupa'da kaçıncı olurdu? | Şaşırtıcı ama tanıdık | TÜİK + Eurostat nüfus | Sıralama yarışı (bar race) |
| Suyun nereden geliyor? (İstanbul barajları) | Kuraklık gündemi, her ev | İSKİ günlük doluluk açık verisi | Dolup boşalan su tankları |
| Elektriğin nereden geliyor? | Fatura derdi | TEİAŞ / EPİAŞ kaynak dağılımı | Yığılmış çubuk + harita üzerinde santraller |

**Görsel çeşitlilik (harita yorgunluğu):** kare grafik, sankey, sıralama yarışı, dairesel saat ısı haritası,
izotip (insan ikonları), büyüyen 3B sütunlar (Three.js), bölünmüş ekran karşılaştırma, kinetik büyük sayılar.
Harita sadece bağlam için; ana sahne grafik. Ortak araçlar `lib/` altında tekrar kullanılabilir modül olarak yazılmalı.

---

## 2. Yüksek Potansiyelli Yeni Video Fikirleri (V2 Motoru İçin)

Algoritma hedefi: **İlk 1 sn hareketle durdur** → **her 3–5 sn'de ara ödül + merak boşluğu** → **DM ile arkadaşa attır** ("senin ilin", memleket gururu/şaşırması) → **Durdur-Bul / tek izlemede kaçan easter egg ile %100+ tamamlama**.

### Fikir A · `hys-voronoi` — "Sınırları silsek ilin kime bağlanırdı?" (Voronoi Türkiye)
- **Tek cümlelik şok:** İl sınırlarını çizgiyle değil, *"kuşuçuşu en yakın il merkezine göre"* (Voronoi diyagramı) yeniden çizsek hangi iller büyür, hangileri komşusuna gider?
- **Görsel güç:** 81 resmi il sınırı ince koyu kalırken, turuncu Voronoi sınırları canlı olarak büyür/morph eder. Tek izlemede kaçan detay + herkes kendi ilinin daralıp genişlemesini durdurup inceler.
- **Kanca türü:** Görsel paradoks ("Bu haritada 81 il var ama sınırlar böyle değil").
- **Doğrulama:** `veri/iller.topo.json` il merkezleri (`d3.geoDistance` ile yüksek çözünürlüklü ızgarada gerçek küresel Voronoi hesabı + il sınırlarına göre piksel/alan örtüşme yüzdesi).

### Fikir B · `hys-istanbul-esit` — "En az nüfuslu kaç ili toplarsan İstanbul eder?"
- **Tek cümlelik şok:** Haritanın sağından/Anadolu'dan illeri teker teker turuncuya boyuyoruz; sayaç İstanbul'un nüfusuna ulaşana kadar kaç il boyanır?
- **Neden paylaşılır (DM):** Boyanan her ilden izleyici videoyu hemşehrisine atar ("bizim 40 il birleşince anca İstanbul ediyor"); büyükşehir vs Anadolu dengesi yorumları patlatır.
- **Kanca türü:** Tahmin et ("Sence haritanın yüzde kaçı boyanacak? Tahmin et.").
- **Doğrulama:** Güncel resmî TÜİK ADNKS il nüfusları kaynaklı `veri/` JSON'u (kesin tarih ekranda ve açıklamada belirtilir; tahmin/eski yıl kullanılmaz).

### Fikir C · `hys-plaka-senin-ilin` — "`hys-09-plaka` Bölüm 2: Kendi ilinden başlasan kaç km?"
- **Tetikleyici:** `hys-09-plaka` yorumlarından doğar ("34 İstanbul'dan başlasak kaç km olur?").
- **İçerik:** Büyük nüfuslu 4–5 çıkış ili (ör. İstanbul `34`, Ankara `06`, İzmir `35`, Adana `01`) için `veri/hys-09/plaka.json`'daki aynı algoritma (`en yakın komşu + 2-opt + or-opt`, büyük daire kuşuçuşu) ile hesaplanan en kısa 81 il turu karşılaştırması + yorumdaki diğer iller için devam sözü.

### Fikir D · `hys-ilce-komsusu` — "Kendi il merkezinden çok komşu il merkezine yakın ilçeler"
- **Tek cümlelik şok:** Bazı ilçeler resmi olarak bağlı oldukları il merkezinden **2–3 kat daha yakın** başka bir il merkezine sahiptir (ör. geniş yüzölçümlü Konya, Antalya, Sivas, Erzurum, Muğla, Balıkesir ilçeleri).
- **Görsel:** İlçe noktasından iki ok çıkar: biri kendi il merkezine (kâğıt renk, uzun km), diğeri komşu il merkezine (turuncu `#FF6B2C`, kısa km).
- **Doğrulama:** Her ilçe koordinatı en az iki bağımsız kaynaktan (Resmî Gazete/HGM/GeoNames) doğrulanmadan eklenmez.

### Fikir E · `hys-gol-olcegi` — "Van Gölü gerçekte kaç il büyüklüğünde?"
- **Tek cümlelik şok:** Van Gölü uzaktan haritada küçük bir leke gibi durur ama gerçek yüzölçümü (`~3.713 km²` civarı — kodla sınır poligonundan doğrulanır) Türkiye'deki birden fazla ilden büyüktür (`Yalova`, `Bartın`, `Kilis` vb. ile sürükle-kıyasla).
- **Görsel:** `hys-01`/`hys-02`'nin çok sevilen **"haritadan söküp üzerine taşıma"** hareketinin V2 sürümü (`IKON` + alan `meter` çubuğu + dürüstlük notu).

### Fikir F · `hys-meridyen-ikizleri` — "Aynı anda öğle: Türkiye'nin boylam ikizleri"
- **Mekanik:** Enlem videoları (`hys-04`, `hys-10`, `hys-11`) hep yüksek etkileşim getiriyor; bunun dikey (meridyen) karşılığı: İstanbul (`~29° D`), Ankara (`~32,9° D`), Iğdır (`~44° D`) boylam çizgileri kuzeye/güneye süpürülünce hangi şaşırtıcı şehirler aynı anda öğleyi yaşıyor? (Kahire/İskenderiye, Kiev/St. Petersburg, Riyad/Bagdat vb.)

### Fikir G · `hys-sinir-komsu` — "Türkiye'nin en uzun kara sınırı & 4 ilin 3 ülke kesişimi"
- **Mekanik:** 8 komşu kara sınırını uzunluklarına göre tek tek haritada çizip dizmek (Suriye `911 km`'den Nahçıvan `18 km`'ye; kıyı şeridinde ada/girinti etkisi dürüstlük notuyla) + Iğdır / Edirne / Ardahan gibi çoklu ülke sınır illeri.

---

## 3. Algoritma & Tasarım İlkeleri (V2 Özeti)

1. **Tek izlemede kaçan detay + Durdur-Bul:** 81 il listesi veya kaçan harita detayı (`70 Karaman === #70`, `Ardahan 184 vs 187 km`), duraklatma ve tekrar izlemeyi (`%100+` tamamlama) doğrudan yükseltir.
2. **Ses kapalıyken tam anlaşılırlık:** V2'deki `headerSeq` + `captionStyle: 'kinetic'` + `statPill` + `meter` dörtlüsü anlatımı sessizde de tamamen okunur kılar.
3. **Kalıp kırma (Anti-Şablon):** Arka arkaya iki bölüm aynı kanca türüyle, aynı harita kadrajıyla ve aynı cümle açılışıyla çıkmaz ([STYLE.md](../STYLE.md) + `yayinlar.csv` son 5 satır kontrolü).
4. **Hızlı kapak döngüsü:** Üretim bitince `promptlar/12-kapak.md` ve `npm run kapak` ile mutlaka en az 3 farklı formülden (`?nocap&nohead`) kapak üretilip `kapak-onizleme.png` incelenir.
5. **Bilgiyi hemen main'e/varsayılan dala aktar:** Paralel çalışan tüm ajanların aynı motor iyileştirmelerinden ve derslerden yararlanması için her iş bitiminde güncel dala (`origin/claude/clever-newton-v18p72` / `main`) senkronize edilip pushlanır.
