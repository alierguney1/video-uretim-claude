# Sıradaki Fikirler ve Öğrenimler (`Harita Yalan Söyler`)

Bu dosya diğer ajanların aynı araştırmayı sıfırdan tekrarlamaması için hazırlanmış **aktif fikir havuzu, içerik stratejisi ve üretim öğrenimleri** özetidir. Her yeni fikir veya bölüm kararı doğrudan buraya eklenir ve varsayılan dala (`main` / `claude/clever-newton-v18p72`) pushlanır.

> Temel kural ([MOTION_RULES.md](../MOTION_RULES.md) · [STYLE.md](../STYLE.md)):
> Ekrandaki her sayı **kodda gerçek veriden** hesaplanır. Uydurma istatistik yok. Her video kendi kancası, ters köşesi, ara ödülleri ve döngüsüyle ayrışır.

## 0. Değerlendirme (18 Kas 2026, Instagram verisiyle)

**Paylaşım / 1000 izlenme** (vidIQ owner insights, 18 Kas): Anamur 10,4 · Kuzey 7,3 · Kırşehir 6,5 · Batı 3,7 ·
Plaka 3,3 · Vergi 2,3 (1 günlük) · Grönland 1,6 · Rota 0,8 · **New York (hys-04 v2) 0,39**.

- **viral-analiz §7 testi sonuçlandı:** hys-04 v2 41 bin izlenme ve %59,5 izlenme oranı aldı (seride en yüksek) ama
  paylaşım 0,39/1000. Yabancı karşılaştırma **izletiyor ama göndertmiyor.** Kanalı büyüten şey gönderme → yabancı
  odaklı fikirler (meridyen ikizleri, NY tipi) son sıraya.
- **Tek kanıtlı formül:** okulda öğrenilmiş bir Türkiye bilgisini bozmak + o yerin insanına gönderme. Ama uç nokta
  serisi yoruluyor (10,4 → 7,3 → 3,7); aynı kalıbı dördüncü kez düz tekrarlamak yetmez, yeni bir ters köşe lazım.

| Sıra | Fikir | Test (fikir/sorar/gönderir) | Neden | Karar |
| :-: | --- | :-: | --- | --- |
| 1 | **hys-14-dogu: "En doğu Iğdır. Ama güneş Türkiye'de ilk orada doğmuyor."** | ✓ ✓ ✓ | Cliffhanger borcu (12'de söz verildi) + okul bilgisi doğru olduğu için ters köşe güneşten gelir: 21 Aralık'ta güneş Hakkari'de 07:16, Iğdır'da 07:22 (`veri/hys-09/gunes-2026-12-21.json`, il merkezi; kış gündönümünde güney avantajı boylamı yener). Uç noktalar (Dilucu / Şemdinli) için ayrı hesap şart. | **Hemen** |
| 2 | **hys-09-gunes** ("21 Aralık'ta güneş senin ilinde kaçta doğuyor?") | ✓ ✓ ✓ | Her kış "sabahlar karanlık" derdi; 81 il durdur-bul = herkesin kendi sayısı. Veri + brif hazır. **Pencere 1–21 Aralık.** 1 ile aynı veriyi paylaşır: 14 ↔ 09-gunes arasına en az 3 gün koy ya da 14 teaser, 09-gunes ana video olsun. | **Aralık başı** |
| 3 | **ilçe ↔ komşu il** (Fikir D, yeniden çerçeve: "Bu ilçeler il olmak istiyor / aslında komşu ile bağlı olmalı") | ✓ ✓ ✓ | Mevcut tartışma (il olma talepleri, "biz X'e daha yakınız"). Kimlik tetikleyicisi en güçlüsü: ilçe adı ekranda = o ilçenin grupları. Kuşuçuşu / yol farkı dürüstlük notu. Koordinat doğrulaması ağır. | Yüksek |
| 4 | **"Türkiye'nin en soğuk yeri"** (yeni) | ✓ ✓ ✓ | Herkesin cevabı var (Erzurum / Kars / Sarıkamış / Ardahan); kış mevsimi; memleket rekabeti yorumları açar. Ters köşe ancak MGM rekor verisi yaygın inanışı bozuyorsa var; **önce MGM ekstrem kayıtlarıyla doğrula, bozmuyorsa ele.** | Araştır |
| 5 | İstanbul trafikte yılda kaç gün (2b) | ✓ ✓ ✓ | Herkesin derdi, İstanbullu iş arkadaşına gider. TomTom Traffic Index yıllık "kayıp saat" doğrulanınca. Haritadan çıkma riski: rota + takvimden silinen günler. | Orta-yüksek |
| 6 | En az nüfuslu kaç il = İstanbul (Fikir B) | ✓ ~ ✓ | Tahmin kancası + küçük iller kimliği. Ama vergi bölümünün "İstanbul = 80 il" mesajına çok yakın; en az 3 bölüm ara ver. TÜİK ADNKS 2025. | Orta (sonra) |
| 7 | İstanbul barajları (2b) | ✓ ✓ ~ | Gündemdeyse güçlü (aile grubuna gider), değilse sönük. İSKİ günlük veriyle anlık karar. | Gündeme bağlı |
| 8 | Erivan'a Ankara'dan yakın iller (baskentler) | ~ ✗ ✓ | Doğu illeri bunu zaten biliyor; yabancı karşılaştırma (NY dersi). | Düşük |
| 9 | Van Gölü kaç il (E) | ~ ✗ ~ | Boyut karşılaştırması Grönland'da 1,6 aldı. | Düşük |
| 1b | **Voronoi (A), yeniden çerçeve: "Türkiye'nin en büyük ili Konya değil(miş)"** | ✓ ✓ ✓ | Ali'nin itirazıyla (18 Kas) hesaplandı (`tools/hys-voronoi.mjs`, taslak): sınırlar en yakın il merkezine göre çizilirse **Karaman 35. sıradan 1.'ye** çıkar (24.777 km², Konya 24.563), **Uşak 68. → 14.** (alanı 3,1 kat), **İzmir 20. → 68.** (toprağının %59'u başka ile). Türkiye'nin %27'si il değiştirir. Okul bilgisi ("en büyük il Konya") bozuluyor + Karaman–Konya rekabeti (Karaman 1989'a kadar Konya'nındı) = gönderme. **Dikkat:** Karaman–Konya farkı %0,9; ince ızgara + iki kaynaklı il merkezi (valilik/HGM) ile yeniden hesaplanmadan ekrana çıkmaz. Fark kapanırsa kanca Uşak/İzmir'e kayar. | **Hemen (1 ile yarışır)** |
| — | plaka 2 (C), meridyen ikizleri (F), sınırlar (G), 100 kişilik köy, İstanbul ülke olsa, elektrik | ✗ | Kimse sormuyor / ders kitabı / yabancı / zayıf bölümün devamı. | **Ele** |

**Önerilen sıra:** 14-dogu → (3 gün) → 09-gunes (1–10 Aralık) → ilçe ↔ komşu il → trafik. "En soğuk" doğrulamadan geçerse Aralık ortasına.

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
