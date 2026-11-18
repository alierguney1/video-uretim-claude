# hys-14-konya — brif

Seri: Harita Yalan Söyler · Bölüm 14 · Fikir havuzu (docs/fikirler.md §0, sıra 1b "Voronoi, yeniden çerçeve").
Ali (18 Kas): "Bi güzel yaratıcı bi video fikri bulalım da üretip otomatik gönderelim. Güzel ve tutacak bi video olsun."

**Tek cümle:** Türkiye'yi "her yer kuşuçuşu en yakın il merkezine bağlansın" kuralıyla yeniden çizince
en büyük il Konya değil **Karaman** oluyor; Efes, Bergama, Hattuşa ve Uzungöl il değiştiriyor.

## Veri ve doğrulama (ekrana çıkan her sayı buradan)

Hesap: `tools/hys-14-konya.mjs` → `veri/hys-14/konya.json` (+ çizim için `konya.js`).
Yöntem: 0,01° ızgara (~1 km), her hücre kuşuçuşu (küresel) en yakın il merkezine atanır; alan = hücre alanı toplamı.

| Girdi | Birincil | Çapraz kontrol |
| --- | --- | --- |
| İl sınırları | geoBoundaries TUR ADM1 (gbOpen) | Natural Earth 1:10m (`veri/iller.topo.json`) |
| İl merkezleri | GeoNames TR dökümü, PPLA/PPLC noktaları | Wikidata il başkenti P625 · repo NE/GeoNames karışığı |
| Resmî alan ve sıra | HGM "İl ve İlçe Yüz Ölçümleri" (Vikipedi "Türkiye'nin illeri" tablosu üzerinden) | — |
| Ünlü yerler | GeoNames + Wikidata koordinatları; resmî il = geoBoundaries poligon testi | iki merkez kümesi |

**Sağlamlık:** 2 sınır × 3 merkez kümesi = 6 hesabın **6'sında da Karaman birinci** (fark 200–490 km², %0,8–2).
Tüm 81 merkez rastgele ±3 km oynatıldığında 24 denemenin 23'ünde Karaman birinci. → İddia doğru ama **kıl payı**;
bu videoda gerilim olarak kullanılır ve açıklamada dürüstçe yazılır.

| Bulgu | Değer (gb + GeoNames) | 6 hesap aralığı |
| --- | --- | --- |
| Karaman | resmî 8.678 km², **36.** → ~24.700 km², **1.** | 24.566–24.765, hep 1. |
| Konya | resmî 40.838 km², 1. → ~24.300 km², **2.**; toprağının **%42**'si başka ile | %41–42 |
| İzmir | 23. → 70.; toprağının **%57**'si başka ile (Manisa, Aydın) | %56–61 |
| Uşak | 61. → 14. | 14. |
| Mersin | 9. → 43. | — |
| İl değiştiren toprak | Türkiye'nin **%27**'si | %27,0–27,6 |
| Efes | İzmir merkezine 55 km, **Aydın**'a 45 km | iki kaynakta aynı |
| Bergama (Pergamon) | İzmir 80 km, **Manisa** 62 km | aynı |
| Hattuşa | Çorum 65 km, **Yozgat** 27 km | aynı |
| Uzungöl | Trabzon 64 km, **Bayburt** 40 km | aynı |
| Anamur | Mersin 184 km, **Karaman** 128 km (hys-10 göndermesi) | aynı |
| Karaman | 15.06.1989'da il oldu; öncesinde Konya'ya bağlı ilçe (Resmî Gazete 21.06.1989) | — |

Elenen iddialar: Nemrut (Adıyaman'da kalıyor), Ağrı Dağı (zaten Iğdır sınırında), Sümela (fark 5 km, zayıf), Abant (3 km).

**Dürüstlük notları (ekranda dipnot + açıklamada):** kuşuçuşu mesafe; dağ, yol, nüfus hesaba katılmadı. Bu bir
düşünce deneyi, sınır önerisi değil. Alanlar göller dahil harita alanı; fark küçük, merkez noktası birkaç km oynarsa sıra değişebilir.

## Normal insan testi (viral-analiz §4a)

1. Önceden fikri var mı? **Evet.** "En büyük il Konya" okulda ezberlenir; "Efes İzmir'in" herkes bilir.
2. Kendisi sorar mı? **Evet.** "Biz X'e daha yakınız, oraya bağlı olmalıydık" ilçelerde yaygın bir şikâyet.
3. Kime gönderir? **Karamanlı ↔ Konyalı** arkadaşına ("1989'a kadar ilçemizdiniz"), İzmirli ↔ Aydınlı (Efes),
   Çorumlu ↔ Yozgatlı (Hattuşa), Trabzonlu (Uzungöl). Ve 81 il durdur-bul: "bizim il kaçıncı oldu?"

## Brif (15 parça)

1. **Rol:** animasyon yönetmeni + bilgi tasarımcısı (merak motoru).
2. **Hedef:** "Sınırları en yakın il merkezine göre çizsen Konya değil Karaman en büyük il olur; Efes Aydın'a geçer."
3. **Format:** ~44 sn, 1080x1920, 60 fps, Charon TTS (tempo 1.12) + `lib/ses.js` katmanları.
4. **Sahne listesi:** aşağıda.
5. **Sanat yönü:** STYLE.md. İl haritası kâğıt; **resmî sınır = koyu ince çizgi**, **yeni (en yakın merkez) sınır = turuncu**
   (vurgu = gerçeği gösteren hesap). Kazanan il turuncu dolgu, kaybeden kâğıt kontur.
6. **Hareket dili:** (a) 81 merkezden **eşit hızla büyüyen daireler** birbirine değince durur → yeni sınır kendiliğinden doğar
   (kuralın görsel kanıtı); (b) ünlü yer işareti eski ilinden yeni iline **zıplar** (yay, pop); (c) kamera yavaş itme/kayma, kesme yok.
7. **Yasaklar:** MOTION_RULES + "sınırlar böyle olmalı" gibi öneri/siyasi çıkarım yok; doğrulanmamış yer adı yok.
8. **Kanca türü:** **yanlış inanış + ya …olursa.** (Son dört: 10 gizem, 11 itiraf, 12 yanlış inanış+geri sayım, 13 sayı şoku.)
9. **Ara ödüller:** ~1 sn Konya'yı turuncu çizgi keser · ~6 sn daireler büyüyüp harita kendini yeniden çizer · ~9 sn %27 ·
   ~12 sn Efes Aydın'a zıplar · ~14 sn Bergama Manisa'ya · ~17 sn Hattuşa Yozgat'a · ~19 sn Uzungöl Bayburt'a ·
   ~25 sn sıralama yarışı: Karaman yukarı fırlar · ~29 sn Konya–Karaman başa baş, sessizlik, KARAMAN · ~32 sn "1989'a kadar ilçe" · ~35 sn 81 il tablosu.
10. **Gönderilme sebebi:** Karamanlı Konyalıya: "1989'a kadar ilçemizdiniz, şimdi en büyük biziz." (ve İzmir/Aydın, Çorum/Yozgat).
11. **Farklılık:** Seride ilk Voronoi / büyüyen daire hareketi, ilk sıralama yarışı (bar race), ilk "yer işareti zıplaması".
    13'ün grafik dili (sütun, terazi, kare, halka) yok.
12. **Yayın paketi:** aşağıda.
13. **Hikâye omurgası:** İstek: Türkiye'nin en büyük ilini bulmak · Engel: kural değişince herkes toprak kaybediyor, Konya da ·
    Bedel: Konya'nın %42'si. Orta nokta kırılması: "Peki en büyük kim?" → başa baş yarış. Tuhaf detay: kazanan Karaman 1989'a kadar
    Konya'nın ilçesiydi (Resmî Gazete). Hikâye testi: 13/16.
14. **Döngü haritası:** aşağıda (`window.__beats`).
15. **Ses planı:** daireler büyürken yükselen `rise` + tık dizisi, çarpışmada yumuşak `pop`'lar; her zıplamada `pop` + `chime`;
    yarışta artan `tick` dizisi → 0,4 sn sessizlik → `sub` + seri `ping` (KARAMAN); tabloda tık dizisi; döngüde `whoosh`.

## Sahne listesi (onay için)

| # | Süre | Ses (taslak) | Görüntü | Kamera | Geçiş nesnesi |
| --- | --- | --- | --- | --- | --- |
| 1 | 0–3 | "Türkiye'nin en büyük ili artık KONYA DEĞİL." | Türkiye il haritası, Konya turuncu kontur + "1." rozeti. 0. sn'de turuncu bir çizgi Konya'yı ikiye keser, Konya'nın yarısı kâğıda döner. Ekran: "EN BÜYÜK İL / KONYA DEĞİL" | Konya'ya hafif itme | Turuncu çizgi |
| 2 | 3–8 | "Tek bir kural koydum: her yer, kuşuçuşu EN YAKIN il merkezine bağlansın." | 81 il merkezinde nokta yanar; her birinden eşit hızla daire büyür, değdiği yerde durur → yeni turuncu sınırlar. Eski sınırlar ince koyu çizgi olarak altta kalır. | Tüm Türkiye, geri çekilme | Turuncu ağ |
| 3 | 8–11 | "Türkiye'nin DÖRTTE BİRİ il değiştiriyor." | İl değiştiren alanlar tarama/turuncu ışıltı; sayaç %0→%27. | Sabit + %3 itme | Batıya kayma |
| 4 | 11–16 | "İzmir toprağının YARISINDAN fazlasını kaybediyor. Efes Aydın'a, Bergama Manisa'ya geçiyor." | Ege'ye yakınlaşma: İzmir resmî kontur kâğıt, yeni hücresi küçük turuncu. Efes ve Bergama işaretleri yay çizerek Aydın ve Manisa'ya zıplar. İzmir rozeti 23. → 70. | Ege'ye itme | Hattuşa işareti |
| 5 | 16–21 | "Hititlerin başkenti Hattuşa, Çorum'dan Yozgat'a. Trabzon'un Uzungöl'ü bile Bayburt'a." | Kamera İç Anadolu → Karadeniz; işaretler zıplar, km farkları küçük etiket (65 → 27 km, 64 → 40 km). | Kayma | Konya |
| 6 | 21–26 | "Peki en büyük il kim oldu? Konya, toprağının yüzde kırk ikisini kaybediyor." | Konya'ya dönüş: Konya resmî alanı kâğıt, yeni hücresi küçülür (%42 pill). İller haritadan kalkıp **sıralama çubuklarına** dizilir. | Konya'ya itme → yukarı kayma | Çubuklar |
| 7 | 26–31 | "Zirvede başa baş iki il var… Birinci: KARAMAN. Otuz altıncı sıradan, birinciliğe." | **Sıralama yarışı:** resmî sıra (Konya, Sivas, Ankara…) yeni alanlara akar; Karaman 36.'dan yukarı fırlar; Konya ile yan yana, sayaçlar; 0,4 sn durgunluk → Karaman öne geçer, ping. Fark: ~%2 "kıl payı". | Sabit, hafif itme | Karaman hücresi |
| 8 | 31–34 | "Üstelik Karaman, 1989'a kadar Konya'nın bir İLÇESİYDİ." | Haritada Karaman yeni hücresi turuncu (Anamur da içinde, küçük işaret); "1989'a kadar ilçe" damgası. | Karaman'a itme | Tablo |
| 9 | 34–42 | "Senin ilin büyüdü mü, küçüldü mü? Durdur, bul." | **81 il durdur-bul** (3×27): il · resmî sıra → yeni sıra, ▲ turuncu / ▼ gri. Dipnot: kuşuçuşu, kaynaklar. | Sabit, yavaş itme | Harita |
| 10 | 42–44 | (sessiz döngü) | Harita + Konya'yı kesen çizgi = ilk kare. | Geri | — |

Harita ekranda: sahne 1–6, 8, 10 → ~%70 (kural ≥ %50 ✓). Haritaya ek görseller: büyüyen daireler, sıralama yarışı, zıplayan işaretler, tablo (STYLE §3 ✓).

## Merak haritası

| Döngü | Açılış | Soru | Kapanış |
| --- | --- | --- | --- |
| A | 0,3 | Konya değilse en büyük il kim? | 29 (Karaman) |
| B | 3 | Hangi kural? Ne değişiyor? | 8 (daireler) |
| C | 11 | Başka ne el değiştiriyor? (İzmir/Efes) | 21 |
| D | 21 | Konya ne kadar kaybediyor, kim yetişiyor? | 29 |
| E | 34 | Benim ilim kaçıncı oldu? | izleyici durdurunca |
| F (cliffhanger) | 42 | "Hangi il haksızlığa uğradı? Yaz." → ilk kareye döngü | yorumlar |

- **Ters köşe:** en büyük il Konya → Karaman (36. sıradan); ikinci ters köşe: Karaman 1989'a kadar Konya'nın ilçesiydi.
- **Gerilim:** sahne 7'de iki çubuk başa baş, sayaçlar, 0,4 sn sessizlik.
- **Cliffhanger/döngü:** son kare = ilk kare (Konya'yı kesen çizgi). Sabit yorum: "Senin ilin kaçıncı oldu? Yaz 👇"

## Yayın paketi (taslak)

- **Kapak** (3 varyant, `hys-14-konya.kapak.json`): yanlış inanış "EN BÜYÜK İL *KONYA DEĞİL*" · paradoks "*36.* SIRADAN *1.*'LİĞE" · kimlik "EFES ARTIK *AYDIN'IN*".
- **Başlık:** Türkiye'nin en büyük ili artık Konya değil 😳 Sınırları tek kuralla yeniden çizdim #harita #konya #karaman
- **Açıklama:** kural + bulgular + dürüstlük notu + kaynaklar (HGM yüzölçümleri, geoBoundaries, GeoNames).
- **Etiketler:** harita, konya, karaman, türkiye, il, coğrafya
- **AI etiketi:** açık (sentetik seslendirme).
