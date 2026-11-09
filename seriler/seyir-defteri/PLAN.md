# Seyir Defteri: plan

> **Çalışma adı.** Tarihin tuhaf insanlarının yolculukları, piksel haritada adım adım.
> Ad kesinleşince klasör ve dosya öneki (`sd-`) değişebilir. Diğer aday adlar: *Tarihin Rotası*, *Tuhaf Yolcular*, *İz*.
> "Seyir" hem yolculuk kaydı hem izlemek demek; Evliya Çelebi'nin *Seyahatname*'sine de selam veriyor.

Bu doküman "Harita Yalan Söyler"den (HYS) **ayrı** bir seri planıdır. Ortak olan şey üretim hattıdır
(araçlar, render sözleşmesi, TTS, denetim). Kimlik, format ve kurallar ayrıdır.
Görsel kimlik: [STYLE.md](STYLE.md). Kanıt: [stil-testi.html](stil-testi.html).

---

## 1. Ayrı kanal mı? **Evet.**

| | Harita Yalan Söyler | Seyir Defteri |
| --- | --- | --- |
| Vaat | "Harita seni kandırıyor, 40 saniyede gerçeği gör" | "Tarihte gerçekten yaşamış tuhaf biri, haritada peşinden git" |
| İzleme sebebi | Merak + meydan okuma (quiz, "tahmin et") | Hikâye + karakter (sonra ne oldu?) |
| Süre | 30–45 sn | 75–150 sn (sonra 8–12 dk) |
| Görünüş | Düz vektör harita, turuncu vurgu | Piksel harita + piksel diorama |
| Ses | Charon, hızlı, meydan okuyan | Sakin, gizemli anlatıcı (mümkünse senin sesin) |

Gerekçe:

1. **Algoritma kanalı bir kitle profili olarak öğrenir.** YouTube "bu kanalı izleyenler ne izliyor"
   sinyaliyle önerir. Quiz izleyicisiyle hikâye izleyicisi farklı; tek kanalda karışırsa iki tür
   video da yanlış kişilere gösterilir ve ikisinin metrikleri de düşer.
2. **Format farklı.** 35 sn'lik dikey video ile 2–3 dk'lık (sonra 10 dk'lık yatay) hikâye aynı
   izleyici alışkanlığına oturmaz.
3. **Seri imzası tek olmalı.** MOTION_RULES §5: tanınan bir seri kimliği. İki farklı görsel dil
   aynı kanalda ikisini de zayıflatır.
4. **Kaybedilecek kitle yok.** HYS'nin henüz yayın metriği yok (`yayinlar.csv` boş); ayırmanın
   bedeli bugün en düşük seviyede.
5. **Risk dağılır.** YouTube'un "özgün olmayan içerik" değerlendirmesi kanal düzeyinde; iki tutarlı
   kanal, tek karışık kanaldan daha güvenli.

Bedeli: iki kanal sıfırdan başlar ve yayın temposu bölünür. Hafifletme: hat ortak, sadece hikâye
dosyası yazılıyor. Öneri tempo: HYS haftada 3, Seyir Defteri haftada 1–2.
Instagram ve TikTok'ta da ayrı hesap (öneriler hesap bazlı). Kanalları birbirine bağlamak için
açıklamada tek satır yeter; içerikleri karıştırma.

---

## 2. Format

### Birim: sezon → bölüm → durak

- **Sezon = bir kişi ya da bir ağ** (Casanova; Sultanın Casusları; Seydi Ali Reis …). 4–6 bölüm.
- **Bölüm = bir macera**, tek başına anlaşılır, 75–150 sn (V), dikey 1080x1920.
  Örnek: "Casanova İstanbul'da", "Casanova Kurşun Damlar'dan kaçıyor".
- **Durak = haritada bir nokta**, 15–25 sn (V). Bölüm başına 3–6 durak.

**Neden "her bölüm tek macera" ve "bir bölümde bütün hayat" değil?**
Bir araştırmadan 4–6 video çıkar. Her bölüm tek başına kanca taşır. İzleyici bir sonraki bölümü
arar (seri izleme). 2–3 dk dikey hikâye Shorts/Reels/TikTok'ta artık mümkün (üçünde de 3 dk sınırı var).

### Seri imzası: defter büyür

Her bölüm Avrupa/Akdeniz genel görünümüyle açılır ve **sezonun önceki bölümlerinin rotaları soluk
kırmızıyla** zaten haritadadır. Bu bölümün rotası parlak çizilir. Sezon ilerledikçe harita dolar.
İzleyici "kaçırdığım bölümler var" görür; kapak karesi de bu yüzden her bölümde farklıdır.

### Uzun format (2. aşama)

İlk 3–5 bölümün tutma verisi iyiyse sezon **yatay 8–12 dk** uzun videoya genişletilir: aynı duraklar,
durak başına daha çok sahne. Motor baştan iki yerleşimi destekler (harita 270x480 / 480x270,
diorama 180x320 / 320x180). Render hızı sorun değil: stil testi 420 kareyi 19,5 sn'de çıkardı,
10 dk ≈ 30 dk render. Uzun formatta 30 fps yeterli (piksel hareketi zaten tam piksel adımlı).

### Bölüm iskeleti (dikey, ~120 sn)

| Zaman | Ne olur | Görsel |
| --- | --- | --- |
| 0–3 sn | **Kanca:** bölümün en tuhaf anı tek cümle + o anın diorama karesi | Diorama ya da yakın plan; yer/tarih kaydı |
| 3–8 sn | Geri sarma: genel harita, sezonun soluk rotaları, "defter kaydı" (tarih, yer) | Harita ekranı |
| 8–100 sn | 3–5 durak: rota çizilir → şehir ikonuna yaklaşma → diorama → geri | Harita ↔ durak döngüsü |
| 100–115 sn | Büyük an (kancada vaat edilen) | Yakın plan / seçim kutusu / nesne kartı |
| 115–120 sn | Sonraki bölümün yönü: rota yeni şehre doğru çizilmeye başlar ve **kesilir** | Yarım rota (outro kartı yok) |

---

## 3. Durak: her noktada hikâye nasıl görselleşir

Her durağın **tek bir işi** var (MOTION_RULES §3) ve aşağıdaki araçlardan **bir ana + en fazla bir yardımcı** seçer.

### Durak anatomisi (15–25 sn)

1. **Yaklaşma (1–1,5 sn):** Kamera şehir ikonuna iner. VT323 ile defter kaydı: `17 TEMMUZ 1745 · PERA`.
2. **Geçiş (0,8 sn):** İkondan dışarı doğru Bayer dither çözülmesi (12 px hücre). Geçiş, önceki
   sahnede görünen nesneden (ikon) doğar.
3. **Tablo (8–15 sn):** Diorama kurulur; anlatı kutusunda 1–2 cümle. Köşede mini harita
   ("neredeyiz" kaybolmaz).
4. **Ara ödül:** Durağın "aaa" anı (aşağıdaki araçlardan biri).
5. **Çıkış (0,8 sn):** Diorama ikona geri çözülür, rota devam eder.

### Görselleştirme araçları

| Araç | Ne zaman | Örnek |
| --- | --- | --- |
| **Tablo** (ana araç) | Bir karşılaşma, bir varış | Pera rıhtımında Casanova ve Bonneval Paşa (stil testi) |
| **Yakın plan** | Duygu, karar, şok | Diorama 2x büyür (6 px → 12 px piksel; yalnızca tamsayı katlar) |
| **Kesit** ("bebek evi") | Kaçış, soygun, gizli oda | Kurşun Damlar: hücre, tavan, çatı; kazma ilerleme çubuğu |
| **Nesne kartı** | Hikâyeyi döndüren eşya | Şifreli mektup, piyango bileti, sahte pasaport; ortada büyük sprite + tek satır |
| **Seçim kutusu** | Tarihî bir karar anı | İki seçenek, gerçekte seçilen yanar (ör. anılardaki evlilik teklifi; doğrulanacak) |
| **Belge çözme** | Casus hikâyeleri | Şifreli metin harf harf çözülür (kodla, deterministik) |
| **Harita olayı** | Hareket, ağ, yayılma | Kurye jetonları şehirler arası mektup taşır; filolar; haber kaç günde ulaştı |
| **Hesap anı** (HYS mirası) | Mesafe, süre | "Venedik → İstanbul deniz yolu ≈ X km": `d3.geoDistance` ile rotadan hesaplanır, uydurulmaz |

Karakter şiveleri (HYS'den farklı, hikâyeye özgü):
- **Çifte ajan:** sprite iki palet arasında gidip gelir (iki sadakat).
- **Rüşvet:** hazine ikonundan karaktere akan altın pikseller.
- **Sahte kimlik:** sprite aynı, ad etiketi ve kıyafet paleti değişir.

### Örnek: Casanova sezonu durak taslağı

| Bölüm | Duraklar | Ana araç(lar) |
| --- | --- | --- |
| B1 İstanbul (1745) | Venedik → Korfu (bekleyiş) → Pera → Bonneval Paşa → teklif (?) → dönüş | Tablo, seçim kutusu |
| B2 Kurşun Damlar (1755–56) | Venedik: tutuklama → hücre → çatıdan kaçış → Münih yolu | Kesit, harita olayı |
| B3 Paris | Piyango, maliye işleri | Nesne kartı, hesap anı |
| B4–B6 | Londra, Berlin, St. Petersburg, Varşova düellosu, Dux'ta kütüphaneci | Araştırılacak |

Bu tablo yön göstermek için; tarih ve olayların her biri bölüm brifinde kaynakla doğrulanacak.

---

## 4. Doğruluk kuralları (tarih için sıkılaştırılmış)

HYS'de sayılar kodda hesaplanıyordu; tarihte iddialar **kaynaktan** gelir. Kural aynı: emin
olmadığın şeyi ekrana yazma.

- **Her iddianın kaynağı brifte.** Birincil kaynak (anılar, mektuplar) ile akademik kaynak (ör. Gürkan)
  ayrı işaretlenir.
- **Kendi anlatısı = "anılarına göre".** Casanova'nın *Histoire de ma vie*'si kendi hikâyesi; abartı
  ihtimali olan yerde ekranda "anılarına göre" yazar. Bu dürüstlük notu yorumlarda güven kazandırır.
- **Sayı yoksa sayı yok.** "Birkaç hafta bekledi" diyorsa sayaç "3 hafta" demez.
- **Modern sınır çizilmez.** Haritada yalnızca kara ve deniz. Tarihî sınır gerekirse yaklaşık veri
  kullanılır ve ekranda "yaklaşık" yazar.
- **Anakronizm denetimi.** Diorama temsilidir ama yanlış olmamalı: 1745 İstanbul'unda Galata Köprüsü
  (1845) ya da Dolmabahçe (1856) yok. Silüet, kıyafet ve eşya dönemine uyar.
- **Rota:** Deniz yolu ara noktalarla çizilir ve **karadan geçmediği kodda denetlenir**
  (`d3.geoContains`). Kara yolu kaynakta yoksa "yaklaşık güzergâh" notu düşülür.
- **Kitaptan hikâye:** Olaylar telifli değildir, anlatım teliflidir. Kitabın cümlelerini
  izlemeyiz; olayları başka kaynaklarla da doğrularız ve açıklamada kitabı anarız ("Bu hikâyeyi
  Emrah Safa Gürkan'ın *Sultanın Casusları*'nda okudum"). Bu hem dürüst hem de videoya "insan"
  katıyor (bu hukuki görüş değil; kitaptan uzun alıntı gerekirse yayınevine sor).

---

## 5. Ses

- **En iyisi senin sesin.** Hikâye kanalında anlatıcı kanalın kişiliğidir ve AI yığınından en ucuz
  ayrışma yolu budur (platform-notlari.md §5). "Bu kitabı okurken şu hikâye beni çarptı" diyen bir
  insan sesi, sentetik anlatıcıdan daha çok tutar ve gönderilir.
- **TTS ise:** Charon değil (o HYS'nin sesi). Aday Gemini sesleri: Algenib, Gacrux, Sadaltager.
  Aynı paragrafla üçü denenir, sen seçersin. Stil: "sakin, gizemli, ateş başında hikâye anlatır gibi,
  önemli anlarda yavaşlayan". Tempo 1,0–1,05. `npm run tts` aynen çalışır.
- **Müzik kodla:** Kısa bir chiptune döngüsü (kare + üçgen dalga), sezon başına bir tema; Web Audio
  ile deterministik. Sürekli bir altlık olduğu için −14 LUFS tutar (HYS'deki drone'un yerini alır).
- **Ses imzası:** Geçişte kısa dither "şşt", rota çizilirken adım tıkları, defter kaydında daktilo tıkı.

---

## 6. Motor: `lib/piksel-motoru.js` (stil testinden çıkarılacak)

HYS motorundan aynen alınanlar: render sözleşmesi, `VO` bloğu + TTS zaman çizelgesi, kelime zamanlı
altyazı (burada anlatı kutusunda), `SOUNDS` sentezi + offline WAV, kamera anahtar kareleri
(log-zoom, `inOutCubic`), d3-geo + world-atlas, oynatıcı.

Yeni olanlar (hepsi stil testinde çalışır halde):

| Parça | Ne yapar |
| --- | --- |
| Piksel tamponu | `makeBuf / put / rect / sprite / frameBox`; ASCII sprite + palet harfi |
| Piksel harita | Kara maskesi → alfa eşiği (≥128) → kıyı çizgisi, sığ su halkası (dither), güney gölgesi, dünyaya sabitli dalgalar |
| Rota | Catmull-Rom → Bresenham → kesikli kırmızı + koyu kenar + gemi jetonu; **karadan geçiş denetimi** |
| İkonlar | Şehir başına küçük simge (kubbe-minare, çan kulesi, kale …) |
| Diorama | Katmanlar: gök (Bayer bantlı) → silüet → su → zemin → karakterler → ön plan |
| Karakter kartı | 20x35 ASCII sprite, sağa bakar, `flip` ile sola; göz kırpma = palet değişimi |
| Geçiş | Bayer çözülmesi, 12 px hücre (4 ile 6'nın EKOK'u: yarım piksel yok) |
| Mini harita | Diorama köşesinde, harita ölçeğinde (4x), rota + yanıp sönen nokta |
| Yerleşim | Dikey/yatay ön ayarları, güvenli alanlar |

Sonra eklenecekler: **otomatik deniz yolu** (kara maskesinde A*, kıyıdan uzak durma maliyetiyle;
ara nokta yazmak gerekmez), şehir dioramaları kütüphanesi (Venedik, İstanbul, Paris …; her sezon
büyür), parçalı karakter (şapka/kafa/gövde/bacak parçalarından karışım), kesit ve seçim kutusu bileşenleri.
`check`'e "rota karadan geçiyor" uyarısı.

Bölüm dosyası yalnızca hikâyeyi taşır: rota noktaları, durak listesi
(`{yer, tarih, sahne, oyuncular, olaylar}`), `VO`, ses olayları.

---

## 7. Kanca türleri (bu seriye özgü katalog önerisi, V)

MOTION_RULES §2 kataloğu geçerli; hikâyede en çok işe yarayacaklar:

| Tür | Örnek |
| --- | --- |
| Sonuçtan başla (soğuk açılış) | "Çatıdaydı. Altında Venedik. Arkasında hücre." → geri sar |
| Kim bu adam? | Tek sprite + tek tuhaf gerçek: "Bu Fransız kont, Osmanlı paşası oldu." |
| Yarım rota | Rota çizilirken durur: "Buradan sonra ne oldu?" |
| Belge | Şifreli bir mektupla açılış, ilk kelime çözülür |
| Seçim | Kişinin önündeki iki yol, "Ne yaptı?" (Casanova'ya İstanbul'da yapıldığı anlatılan evlilik teklifi; anılardan doğrulanacak) |

Aynı tür art arda en fazla 2 kez (HYS kuralı aynen).

---

## 8. Bölüm havuzu

Durum: ✓ kaynakla kısmen doğrulandı · ? araştırılacak · 📖 senin notların lazım.

| Sezon / hikâye | Neden haritada iyi | Acayiplik | Durum |
| --- | --- | --- | --- |
| **Casanova** (1725–1798) | Venedik, Korfu, İstanbul, Paris, Londra, Berlin, St. Petersburg, Varşova, Dux | İstanbul'da dönmüş bir Fransız paşa; kurşun çatıdan kaçış; piyango | ✓ 1745 İstanbul: Korfu'da bekleme, *Europa* fırkateyni, Temmuz ortası Pera, ertesi gün Bonneval ([anılar](https://www.bookrags.com/ebooks/2981/274.html)) · gerisi ? |
| **Sultanın Casusları** (Gürkan, 2017) | İstanbul–Venedik–Napoli–Madrid bilgi ağı: kurye jetonları, haber gecikmesi | Çifte ajanlar, sabotaj planları, rüşvet ağları | 📖 kitapta işaretlediğin 3–5 hikâye |
| **Bonneval / Humbaracı Ahmed Paşa** | Fransa → Avusturya → Bosna → İstanbul | Üç ordu değiştiren kont; Casanova bölümüyle bağlanır | ? |
| **Seydi Ali Reis** (1550'ler) | Basra → Hint Okyanusu → Hindistan → karadan Afganistan, İran → İstanbul | Donanmasını kaybeden amiral yürüyerek döner, *Mirat ül-Memalik* | ? |
| **Cem Sultan** | Rodos → Fransa → Roma → Napoli | Avrupa'da el değiştiren rehine şehzade | ? |
| **Lady Mary Wortley Montagu** (1717) | Londra → Viyana → Belgrad → İstanbul | Çiçek aşılamasını (variolasyon) İstanbul'da görüp İngiltere'de yaydı | ? |
| **Yirmisekiz Mehmed Çelebi** (1720–21) | İstanbul → Toulon → Paris | Bir Osmanlı elçisinin gözünden Paris | ? |
| **Evliya Çelebi** | 40 yıl, üç kıta | Adı seriyle kafiyeli; çok sezonluk | ? |
| **Piri Reis** | Haritanın içinde harita | 1513 haritası | ? |
| **Sultanın Korsanları / İmparatorluğun Ajanları** (Gürkan) | Akdeniz baskınları, şövalyeler, Cizvitler | Sonraki sezonlar | 📖 |

---

## 9. Yol haritası

1. **Kanal adı ve hesaplar** (sen). Ad müsait mi bak.
2. **Ses kararı:** kendi sesin mi, TTS mi? TTS ise 3 ses testi.
3. **Motor:** stil testinden `lib/piksel-motoru.js` çıkarılır; HYS'deki gibi bölüm dosyası sadece hikâye taşır.
4. **Pilot: Casanova B1 "İstanbul".** Brif → sahne/durak listesi → **onay** → kod → check → contact →
   cilalama → render (CLAUDE.md akışı aynen).
5. **3 bölüm yayınla, ölç.** Sonra süre (V), durak sayısı ve kanca türleri gözden geçirilir.
6. Tutma iyiyse: Casanova sezonu yatay uzun video.

## 10. Ölçüm

`yayinlar.csv` ortak; bölümler `sd-` önekiyle ayrılır (`sd-01-casanova-istanbul`).
Bu seride ek olarak bakılacaklar: ortalama izlenme **süresi** (yüzde kadar önemli, video uzun),
hangi durakta düşüş başlıyor (YouTube tutma grafiği), sonraki bölüme geçiş (seri izleme).

## 11. Bu seride öğrenilen teknik dersler

- **Piksel yazı tipinde rakamları test et.** Pixelify Sans'ta 5 ≈ S ("1745" "174S" okunuyor);
  Silkscreen'de İ Ş Ğ ı ş ğ yok (yedek yazı tipine düşüyor). Seçilen: Jersey 10 + VT323.
- **Piksel görünüm çizerek değil eşikleyerek.** Canvas yolları kenar yumuşatmalı çizer; küçük tuvale
  maske çiz, alfa ≥ 128 eşikle, sonra renklendir. Büyütme `imageSmoothingEnabled = false` ve tamsayı kat.
- **Farklı piksel ölçekleri karışmaz.** Harita 4x, diorama 6x; geçiş maskesi 12 px hücrede (EKOK).
- **Dünyaya sabitli doku.** Dalga, köpük gibi işaretler ekran koordinatına konursa kaydırmada
  "yüzer". Coğrafi noktalara bağla, her karede yeniden projekte et.
- **Dar boğazlar.** 50m veride Çanakkale açık ama dar; Korfu kanalı ve Kithira çevresi rotayı
  karaya değdirdi. `d3.geoContains` ızgarasıyla bak, ara noktayı kaydır ya da 10m veri kullan.
- **Bresenham + kesik desen** rotayı piksel ızgarasında boşluksuz ve titreşmeden çizer.
