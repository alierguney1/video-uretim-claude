# hys-12-bati — brif

Seri: Harita Yalan Söyler · Bölüm 12 · Ali (14 Kasım 2026): "yeni video yapalım". Uç noktalar serisinin üçüncüsü
(10 Anamur → en güney, 11 Kofçaz → en kuzey, 12 → en batı). Bölüm 11'in sabit yorumunun cevabı:
"Türkiye'nin en batı ucu neresi? İpucu: Babakale değil." Senaryo [promptlar/03-senaryo.md](../promptlar/03-senaryo.md) merak motoruyla yazıldı.

Durum: **sahne listesi onay bekliyor.** Kod yazılmadı.

## Doğrulama

| Sıra | Nokta | Koordinat | Kaynak |
| --- | --- | --- | --- |
| 1 | **Gökçeada, İncirburnu (Avlaka Burnu)**: Türkiye'nin en batısı | 40°07′30″K 25°39′56″D (25,666° D) | Vikipedi "Extreme points of Turkey" / "İnce Burun, Gökçeada" (arama özetleri); NE 1:10m 25,663 |
| 2 | Bozcaada batı kıyısı | ~25,99° D (Sulubahçe Koyu 25°59′40″) | coastguidetr.com; **render öncesi doğrulanacak** |
| 3 | **Enez, Meriç'in denize döküldüğü yer**: anakaranın en batısı | 40°43′45″K 26°02′09″D (26,036° D) | Vikipedi "Türkiye'nin uç noktaları": "Baba Burnu'nun ~2,4 km batısı"; NE 1:10m 26,033 |
| 4 | **Babakale, Baba Burnu**: Anadolu'nun ve Asya'nın en batısı | 39°28′45″K 26°03′51″D (26,064° D) | Vikipedi "Babakale", Ayvacık Kaymakamlığı "Asya kıtasının en batı ucu" |

- Babakale yanlış değil: **Anadolu'nun ve Asya kıtasının** en batı ucu (orada sertifika bile veriliyor). Ama Türkiye'nin değil: Trakya'da Enez 2,4 km, Gökçeada ~34 km daha batıda.
- Bozcaada doğrulanamazsa sahneden çıkar, sıralama "Babakale 3." olur; kanca "ilk üçte bile değil" yerine "ikinci bile değil" olur. Geri kalan her şey aynı.
- Gökçeada–Gökçeada değil: İncirburnu ile Bölüm 11'deki Sinop İnceburun'un adı benziyor (bazı kaynaklar İncirburnu'na da "İnce Burun" diyor). Kaçan detay olarak kullanılabilir, karışıklık yaratırsa çıkar.
- **Gün batımı hesabı** (`tools/hys-12-bati.mjs`, NOAA formülü, 16 Kasım 2026, UTC+3): Gökçeada İncirburnu 18:01, Iğdır Dilucu (en doğu) 16:46 → **aynı saat diliminde 75 dakika fark**. 81 il merkezi: Iğdır 73 dk önce, İzmir 2 dk önce. Gökçeada'dan sonra batan il merkezi yok.
- "Güneşin en son battığı yer Gökçeada" **demiyoruz**: kışın enlem etkisiyle Babakale aynı dakikada batıyor (21 Aralık'ta Babakale bile 0,4 dk sonra). Sadece "en doğu ile en batı arasında 75 dakika" diyoruz.

## Neden bu fikir

- **Söz verildi:** Bölüm 11'in sabit yorumu bu soruyu sordu; izleyici cevabı bekliyor. Seri motoru (Anamur ≠ Hatay, İnceburun ≠ Kofçaz) üçüncü kez: Babakale ≠ Türkiye'nin en batısı.
- **Geri sayım:** "Herkes Babakale der. Babakale 4. sırada." 4→3→2→1 sırası her 5 sn'de bir ödül verir.
- **Aynı saat, farklı gökyüzü:** en batı neden önemli sorusunu tek görüntü cevaplar: saat 16:46'da Iğdır'da güneş batmış, Gökçeada'da 75 dk daha gündüz. Durdur-bul buna bağlanır.

## Brif (12 parça)

1. **Rol:** Animasyon yönetmeni + fragman kurgucusu (merak motoru) + bilgi tasarımcısı.
2. **Hedef:** İzleyici şunu hatırlamalı: "Türkiye'nin en batısı Babakale değil, Gökçeada. Babakale Asya'nın en batısı. Doğu ile batı arasında güneş 75 dk fark."
3. **Format:** ~45 sn, 1080x1920, 60 fps. Gemini TTS (Charon, tempo 1.12) + STYLE.md sentez sesleri; sıra rozetinde "tak", geri sayımda yükselen ton, 1 numarada ping.
4. **Sahne listesi:** aşağıda.
5. **Sanat yönü:** STYLE.md. Kuzey Ege + Trakya + Çanakkale kesiti, sonra tüm Türkiye. Boylam çizgisi = **dikey** kesikli vurgu `#FF6B2C` (Bölüm 11'in yatay çizgisinin dikey ikizi). İkon katmanı: Çanakkale (Truva atı), Edirne (yağlı güreş), Iğdır ikonları; Yunanistan bayrağı (Meriç sınırı, Ege), Bölüm 10–11 kartlarında Hatay/Sinop/Kırklareli ikonları (MOTION_RULES §3b).
6. **Hareket dili:** (a) dikey çizgi = boylam, hep yatay kayar; (b) **sıra rozeti** 4→1, her yeni nokta bir öncekini doğuya iter; (c) gece/gündüz terminatörü haritayı sağdan sola karartır.
7. **Yasaklar:** MOTION_RULES.md. Bu işe özel:
   - "Babakale yalan" deme: Anadolu'nun ve Asya'nın en batısı, doğru.
   - Gökçeada/Bozcaada için tarih, nüfus, siyaset (İmroz adı dahil) yok; sadece coğrafya.
   - Yunanistan adaları (Semadirek, Limni) etiketlenmez; bayrak sadece sınırda.
   - "Güneşin en son battığı yer" deme (yukarıya bak).
   - Yorumlarda ne yazıldığını uydurma ("herkes Babakale dedi" yok; "çoğu kişi Babakale bilir" + Asya sertifikası yeter).
8. **Kanca türü:** **yanlış inanış + geri sayım** (son ikisi: 10 gizem, 11 itiraf; yanlış inanış en son Bölüm 08'de).
9. **Ara ödüller:** ~1 sn "BABAKALE" + kırmızı "4." rozeti · ~6 sn Asya sertifikası (doğru ama...) · ~10 sn "3." Bozcaada · ~15 sn "2." Enez, Meriç ağzı, 2,4 km · ~20 sn "1." adsız "?" adada · ~24 sn GÖKÇEADA İncirburnu · ~29 sn aynı saat, gece–gündüz ikiye bölünmüş Türkiye · ~33 sn 75 dakika · ~37 sn durdur-bul.
10. **Gönderilme sebebi:** Çanakkaleli/Gökçeadalı/Edirneli arkadaşa "en batı biziz" ya da "Babakale'de aldığın sertifika yarım" diye atılır; doğulu arkadaşa "sizde güneş 75 dk erken batıyor".
11. **Farklılık:** Seride ilk geri sayım yapısı, ilk dikey (boylam) çizgisi, ilk gece–gündüz terminatörü; cliffhanger dört uçtan sonuncusunu açar.
12. **Yayın paketi:** aşağıda.

### Merak haritası (promptlar/03-senaryo.md §4)

| Döngü | Açılır | İzleyicinin sorusu | Kapanır |
| --- | --- | --- | --- |
| A | 0,0 sn | "Babakale neden 4.? Önünde kim var?" | 24 sn (Gökçeada) |
| B | 5 sn | "Sertifika veriliyorsa Babakale neyin en batısı?" | 7,5 sn (Asya'nın) |
| C | 8 sn | "3. kim?" | 10 sn (Bozcaada) |
| D | 12 sn | "Ada saymazsak? Karada Babakale'yi geçen var mı?" | 15 sn (Enez, 2,4 km) |
| G (gerilim) | 19 sn | "1. numara nerede? Sadece ? var" | 24 sn |
| P (paradoks) | 26 sn | "En batıda olmak neyi değiştirir?" | 33 sn (75 dk) |
| S (durdur-bul) | 35 sn | "Benim ilimde güneş kaç dk erken batıyor?" | izleyici durdurunca |
| K (cliffhanger) | 41 sn | "En doğu ucu neresi?" | yorumlar + Bölüm 13 |

A en uzun döngü (24 sn) ve tüm alt döngüleri taşıyor; açık döngüsüz 1 sn'den uzun aralık yok (A 24'te kapanmadan P'nin sorusu 24,5'te kurulur).

- **Kullanılan araçlar (7/7):** cold open (sonuçla aç: "Babakale 4."), merak boşluğu (önünde kim var?), katmanlı açık döngü (A taşıyor; B, C, D, G içinde), gizem (1. numara 5 sn boyunca adsız "?"), gerilim (geri sayım + 1'den önce 500 ms durgunluk), ters köşe (anakarada bile Babakale değil: Trakya'da Enez), cliffhanger (en doğu).

## Seslendirme metni (taslak, ~105 kelime)

1. Türkiye'nin en batı ucu dendiğinde herkes Babakale der. Babakale dördüncü.
2. Orada sertifika bile veriyorlar: Asya'nın en batı ucu. Doğru. Ama Türkiye'nin değil.
3. Üçüncü: Bozcaada.
4. Ada saymazsak? Yine Babakale değil. İkinci: Edirne, Enez. Meriç'in denize döküldüğü yer, 2,4 kilometre daha batıda.
5. Peki birinci?
6. Gökçeada, İncirburnu. Türkiye'nin gerçek en batı ucu.
7. Neden önemli? Aynı saat dilimindeyiz, ama güneş Iğdır'da batarken Gökçeada'da 75 dakika daha gündüz.
8. Senin ilinde güneş kaç dakika erken batıyor? Durdur, bul.
9. Güney, kuzey, batı tamam. Peki en doğu? Yaz.

## Sahne listesi (taslak, onay bekliyor)

Süreler tahmini; TTS sonrası cümle sürelerine oturtulur.

| Sn | Sahne | Ekranda | Geçiş nesnesi |
| --- | --- | --- | --- |
| 0–5 | **Cold open** (A) | Çanakkale yakın plan, Babakale'de nokta + Çanakkale ikonu (Truva atı). **BABAKALE** yazısı iner, 1,2 sn'de yanına kırmızı **4.** rozeti "tak". Dikey kesikli boylam çizgisi 26,06° D. | Boylam çizgisi |
| 5–8 | **Doğru ama** (B) | Çizginin yanında küçük sertifika kartı: "Asya'nın en batı ucu ✓". Altında gri: "Türkiye'nin ✗". | Kart |
| 8–11 | **3.** (C) | Kamera hafif batıya, çizgi Bozcaada'ya kayar, **3.** rozeti. Babakale rozeti doğuya itilir. | Çizgi |
| 11–17 | **Ters köşe: karada da değil** (D) | "Ada saymazsak?" Adalar soluklaşır. Kamera kuzeye, Trakya'ya: Meriç ağzı, Yunanistan bayrağı nehrin karşı kıyısında, Edirne ikonu (yağlı güreş). **2.** rozeti **ENEZ**. İki dikey çizgi arası ölçü: **2,4 km**. | İki çizgi |
| 17–21 | **Gerilim** (G) | Kamera güneybatıya Ege'ye kayar, adada adsız turuncu **?** ve boş **1.** rozeti. "Peki birinci?" 500 ms durgunluk, sadece dalga sesi. | "?" |
| 21–26 | **Cevap** (A kapanır) | "?" → **GÖKÇEADA · İncirburnu**, **1.** rozeti dolar, ping. Dört çizgi yan yana: 1 Gökçeada, 2 Bozcaada, 3 Enez, 4 Babakale, aradaki km farkları (Babakale'ye 34 km). Köşede küçük seri kartı: Anamur ≠ Hatay, İnceburun ≠ Kofçaz, Babakale ≠ Gökçeada. | Çizgiler |
| 26–34 | **Paradoks** (P) | Zoom geri: tüm Türkiye. Ortada büyük dijital saat **16:46**. Gece–gündüz sınırı sağdan sola kayar: Iğdır kararır (ay ikonu), batı hâlâ güneşli. Saat 18:01'e akar, Gökçeada'da güneş batar. Büyük sayı: **75 dakika**. Küçük not: "16 Kasım". | Terminatör |
| 34–40 | **Durdur-bul** (S) | 81 il, 3 sütun, doğudan batıya: il · gün batımı · Gökçeada'dan kaç dk önce (veri/hys-12/gun-batimi.json). Iğdır 73 dk ve İzmir 2 dk vurgu. "⏸ durdur, ilini bul". | Liste |
| 40–45 | **Cliffhanger** (K) | Liste dağılır; harita üzerinde üç işaretli uç (güney Hatay, kuzey Kırklareli, batı Çanakkale), doğu ucunda boş **?** Iğdır–Hakkari arasında yanıp söner. "En doğu? Yaz." Son kare ilk kareye döner (dikey çizgi). | "?" → ilk kare |

## Yayın paketi (taslak)

- **Kapak** (promptlar/12-kapak.md, 3 farklı formül, gereksiz ülke kıyası yok; render sonrası `hys-12-bati.kapak.json`):
  - **Yanlış inanış** (önerilen): "EN BATI *BABAKALE DEĞİL*" + alt "Neresi?" · Babakale üstünde kırmızı çarpı, Truva atı.
  - **Sayı şoku:** "BABAKALE *4.* ÇIKTI" · dört dikey çizgi, en sağdakinde kırmızı 4.
  - **Paradoks:** "AYNI SAAT, *75 DK* FARK" · ikiye bölünmüş Türkiye, doğu gece batı gündüz.
- **Başlık (YouTube Shorts):** Türkiye'nin en batısı Babakale değilmiş
  - A/B: "Babakale sadece 4. sırada"
- **Sabit yorum:** "Türkiye'nin en doğu ucu neresi? 👇 Cevap sonraki videoda."
- **Bölüm 11 köprüsü:** Kofçaz videosunun sabit yorumuna "Cevap geldi 👉 [link]".
- **AI etiketi:** aç.

## Memleket paylaşım planı (render sonrası hesaplar doğrulanır)

Resmi kurum yok (belediye, kaymakamlık, valilik önerilmez). Gayriresmi mizah/caps, "…lılar" toplulukları, yerel haber/gezi, yerel influencer; takipçi + son paylaşım + izlenmeyle sıralanır.

1. **Gökçeada önce** (kanca: "En batı biziz"), 2. **Enez / Edirne** ("Anakaranın en batısı Trakya'da"), 3. **Ayvacık / Babakale** (saygılı: "Asya'nın en batısı yine sizde"), 4. **Bozcaada**, 5. **Iğdır / Kars** ("güneş sizde 75 dk erken batıyor"), 6. Çanakkale genel.
