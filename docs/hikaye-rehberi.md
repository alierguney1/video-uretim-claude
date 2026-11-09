# Hikâye ve dikkat rehberi

*Araştırma: Kasım 2026. İki seri için de geçerli; en çok Seyir Defteri (uzun, hikâyeli) için yazıldı.*

İzleyiciyi videoda tutan şey efekt değil, **cevabını beklediği bir soru**dur. Film ve dizilerin
"başından kalkamadığın" hissi tesadüf değil; birkaç bilinen mekanizmanın düzenli kullanımı. Bu
rehber o mekanizmaları kaynaklarıyla toplar, bizim formatımıza çevirir ve denetlenebilir kurallara
bağlar. Kuralların kısa hali [MOTION_RULES.md](../MOTION_RULES.md) §2'de; döngü haritası `npm run check` ile ölçülür.

> **Öncelik değişmez:** MOTION_RULES §0'da "Doğru" birinci sırada. Bu rehberdeki her teknik gerçek bir
> cevabı daha merakla bekletmek içindir; olmayan bir cevabı vaat etmek için değil (§8).

---

## 1. İzleyici neden kalır: mekanizmalar

| Mekanizma | Ne söylüyor | Bizdeki karşılığı |
| --- | --- | --- |
| **Merak boşluğu** (Loewenstein 1994) | Merak, bilgide bir boşluk fark edildiğinde doğan bir yoksunluk hissidir. En güçlü hâli kişinin bir tahmini olduğu ama emin olmadığı andır. Boşluk kapatılabilir görünmelidir; hiç bilgi yoksa merak da yoktur. | Kanca önce bir kırıntı verir, sonra soruyu sorar. "Kimse bilmiyor" değil, "cevap bu videoda" hissi. |
| **Gerilim > sürpriz** (Hitchcock, Truffaut söyleşisi) | Masanın altındaki bombayı izleyiciye önceden gösterirsen 15 saniyelik sürpriz yerine 15 dakikalık gerilim elde edersin. İzleyici karakterden çok şey bildiğinde sahne daha sürükleyicidir. | Tehlikeyi izleyiciye önce söyle: "Bilmiyordu ama…". Haritada devriyeyi, yoldaki kuryeyi önceden göster. |
| **Ama / bu yüzden** (Parker ve Stone) | Sahneler arasına "ve sonra" giriyorsa hikâye sıkıcıdır. Her olay öncekine "ama" (engel) ya da "bu yüzden" (sonuç) ile bağlanmalı. | Seslendirme cümleleri bu testten geçer (§5). |
| **Gizem kutusu** (J.J. Abrams, TED 2007) | Saklanan bilgi potansiyeldir, merak üretir. Eleştirisi de meşhur: kutuyu hiç açmamak izleyiciyi küstürür. | Her açılan soru kapanır ya da açıkça sonraki bölüme bırakılır (`check` denetler). |
| **Hikâyeye dalma** (Green ve Brock 2000) | Odaklı dikkat, duygu ve zihinde canlanan imge izleyiciyi hikâyenin içine "taşır". Etki, hikâyenin gerçek ya da kurgu olduğunu bilmekten bağımsız. | Soyut değil somut: "hapis" değil, hücrenin kendisi, ışığı, sesi. Tek kişi, tek an. |
| **Bitmemiş iş** (Zeigarnik) | Yarım kalan şey zihinde kalır. Popüler ama deneysel kanıtı karışık. | Kural değil sezgi: bölüm sonunda yeni bir soru açılır. |

## 2. Film ve dizilerin araç kutusu

| Araç | Filmde / dizide | Bizde |
| --- | --- | --- |
| **Soğuk açılış (teaser)** | Jenerikten önce en gergin an; izleyici kanalı değiştirmesin diye. | 0–3 sn: bölümün en gergin anı, şimdiki zamanla. Sonra geri sarma. |
| **İstek + engel + bedel** | Kahraman ne istiyor, onu ne durduruyor, kaybederse ne kaybeder? | İlk 15 sn'de üçü de söylenmiş olur. Bedel yoksa hikâye yok. |
| **Saat** (ticking clock) | Bombanın sayacı, sabaha kadar süre. | VT323 sayaç: "3 gün", "nöbet değişimine 1 saat". Sadece kaynakta varsa. |
| **Dramatik ironi** | İzleyici biliyor, karakter bilmiyor. | "Casusun kim olduğunu sultan bilmiyordu. Biz biliyoruz." |
| **Orta nokta kırılması** | Yarıda her şey tersine döner. | Sürenin %40–60'ında bir "ama": plan bozulur, yer değişir. |
| **Ara ödül + yeni soru** | Her sahne küçük bir soruyu kapatır, yenisini açar. | Her durak bir şeyi cevaplar, bir şeyi sorar (§4). |
| **Önceki bölümde** | 20 sn'lik özet, yeni izleyici kaybolmasın. | 3 sn: sezonun soluk rotası + tek cümle. |
| **Bölüm sonu askısı** (cliffhanger) | Bölümün olayı çözülür, daha büyük bir soru açılır. | Ana soru cevaplanır; sonraki şehre rota çizilmeye başlar ve kesilir. |
| **Tek tuhaf detay** | İzleyicinin arkadaşına anlattığı sahne. | Her bölümde "yok artık" dedirten, görselleşebilen tek bir ayrıntı (kaynaklı). |
| **Durgunluk** | Büyük andan önce müzik susar. | Büyük andan önce 300–600 ms durgunluk (MOTION_RULES §3). |
| **Karakter** | Sevilmesi gerekmez, merak edilmesi gerekir: yetenek + kusur + tutarlı bir tuhaflık. | İlk sahnede kişiyi tek bir eylemle tanıt, sıfatla değil. |

## 3. İlk saniyeler ve ilk dakika

MrBeast ekibinin sızan üretim kılavuzu ilk dakikayı videonun en önemli dakikası sayar, çünkü
izleyici en çok orada çıkar. Bir videoda ilk dakikada 21 milyon izleyici kaybettiklerini ve bunun bile
platform ortalamasından iyi olduğunu yazar. Ayrıca açılış başlık ve kapakta verilen sözü hemen
karşılamalıdır: izleyici en çok buna bakar.

| Format | Kanca penceresi | Yapı |
| --- | --- | --- |
| Dikey (30–150 sn) | 0–3 sn | 0–1 sn: soru, vaat ya da çelişki ekranda okunur (MOTION_RULES §2) · ≤ 3 sn: seste de sorulmuş |
| Uzun yatay (8–12 dk) | 0–60 sn | Soğuk açılış (≤ 15 sn) → vaat ("sonunda …") → bedel → yolculuk başlar. Logo, "merhaba", içerik listesi yok. |

**Kanca kalıpları (Seyir Defteri):**

1. **Soğuk açılış:** `[En gergin an, şimdiki zaman]. [Bir saat / bir gün önce] [tam tersi bir durum].`
2. **Çelişki:** `[Bir kimlik] olan biri [o kimliğe imkânsız görünen bir şey] yaptı.`
3. **Seçim:** `[Kişi]nin önünde iki yol vardı. [Yol 1]. [Yol 2]. Hangisini seçti?`
4. **Belge:** `Bu mektup [kişi]yi ya kurtaracak ya da öldürecekti.`
5. **Bedel sayısı:** Sadece hesaplanabilen ya da kaynaklı sayı: `[N] km, [N] yıl, [tek bir şey olmadan].`

**Yasak açılışlar:** tarihle başlamak ("1756 yılında…"), "Merhaba", "Bu videoda…", kanıtsız
üstünlük ("tarihin en büyük…"), yavaş açılan siyah ekran.

## 4. Döngü haritası (araçla denetlenir)

Her video bir **döngü haritası** taşır: hangi soru ne zaman açılıyor, hangi ara ödül ne zaman geliyor,
hangi soru ne zaman cevaplanıyor. Brifte tablo olarak yazılır, kodda `window.__beats` olarak durur.

```js
const BEATS = [
  { t: 0.0, ac: 'A', soru: 'Nasıl kaçtı?' },        // ana soru = kanca
  { t: 6.5, ac: 'B', soru: 'Neden hapisteydi?' },
  { t: 14,  kapa: 'B' },                              // kapanan soru da ödüldür
  { t: 18,  odul: 'kurşun damların kesiti' },
  { t: 95,  kapa: 'A' },
  { t: 98,  ac: 'Z', soru: 'Paris\'te onu ne bekliyordu?', sonraki: true },  // sonraki bölüme
];
```

HYS motorunda `beats(T, at, DUR)` alanı aynı listeyi döner. `npm run check` şunları uyarır (V):

| Kural | Dikey | Uzun (> 3 dk) |
| --- | --- | --- |
| Kanca penceresinde en az bir soru açılır | ≤ 3 sn | ≤ 10 sn |
| Ara ödül (ödül ya da kapanan soru) aralığı | ≤ 5 sn | ≤ 90 sn |
| Açık soru olmayan aralık | ≤ 3 sn | ≤ 20 sn |
| Ana soru (ilk açılan) cevabı | son %40'ta | son %40'ta |
| Aynı anda açık soru | ≤ 3 | ≤ 3 |
| Her soru kapanır ya da `sonraki: true` | ✓ | ✓ |

**İlk ölçüm (hys-08-samoa, yayından sonra eklenen harita):** 5 soru, 8 ödül; tek uyarı 14,4–20,1 sn
arası ödülsüz. Sebep: 7 sn'lik tek cümle ("…Auckland'dan 23 saat") ve "−23 saat" başlığının ekrana
12,75. sn'de, yani seste söylenmeden 6 sn önce gelmesi. Ders §5'te.

Uzun videoda ek kural: her 60–90 sn'de bir **desen kırıcı** (yeni yer, yeni ölçek, yakın plan,
harita ↔ diorama geçişi).

## 5. Seslendirme metni kuralları

- **İlk cümle ≤ 12 kelime** ve içinde bir çatışma var.
- **"Ve sonra" testi:** Ardışık iki cümlenin arasına "ama" ya da "bu yüzden" konamıyorsa biri gereksizdir
  ya da yeniden yazılmalıdır. Cilalama turunda tüm VO satırlarına uygulanır.
- **Somut isim, somut fiil.** Bir cümlede en fazla bir sayı.
- **İzleyicinin sorusunu sesli sor** ("Peki ama nasıl?"), bölüm başına 2–3 kez; daha fazlası tik olur.
- **Her durak bir sonrakini çağırır:** son cümle bir soru açar ya da bir tehdit gösterir.
- **Önce tehlike, sonra olay** (gerilim > sürpriz).
- **Görüntü sesin ödülünü önceden harcamasın.** Seste cümlenin sonunda gelecek sayı ya da cevap ekrana
  söylendiği anda gelir, cümlenin başında değil. Uzun cümleyi (> 5 sn) ikiye böl ve araya bir görsel ödül koy.
- **Diyalog:** Sadece kaynakta geçen söz, "anılarına göre" ile. Uydurma diyalog yok. Canlandırma
  gerekirse ekranda "temsilî".

## 6. Bölüm sonu ve seri: devamı için sayfaya gelsin

- **Bölüm kendi ana sorusunu cevaplar, sonra yeni bir soru açar.** Ana soruyu cevapsız bırakıp
  "devamı 2. bölümde" demek izleyiciyi aldatmaktır: yorumda öfke, kanaldan çıkış, düşük memnuniyet puanı.
- **Görsel askı:** sonraki şehre rota çizilmeye başlar ve kesilir (yarım hareket). Outro kartı ve
  "abone ol" yok (MOTION_RULES §2).
- **Kapakta seri numarası** ("Bölüm 2/5") ve büyüyen harita: izleyici kaçırdığı bölümleri görür.
- **3 sn "önceki bölümde":** sezonun soluk rotası + tek cümle. Yeni gelen kaybolmaz, eski izleyici sıkılmaz.
- **YouTube Shorts "ilgili video" bağlantısı:** Studio → Ayrıntılar → İlgili video. Sonraki bölüme ya da
  uzun versiyona bağlanır. Uzun videonun ilk 5–10 sn'si Short'un vaadini hemen karşılamalı.
- **Sabit yorum:** sonraki bölümün bağlantısı + izleyiciye bir soru ("Sen olsan kaçar mıydın?").
- **Oynatma listesi = sezon**, sırayla.

## 7. Hikâye seçme testi

Her aday hikâye brife girmeden puanlanır. Sekiz ölçüt, her biri 0–2:

| Ölçüt | 2 puan |
| --- | --- |
| İstek | Kişi somut bir şey istiyor (kaçmak, eve dönmek, tahta çıkmak). |
| Engel | Güçlü bir karşı güç ya da imkânsız görünen durum var. |
| Bedel | Kaybederse hayatını, özgürlüğünü ya da kimliğini kaybeder. |
| Saat | Zaman baskısı var. |
| Kırılma | En az bir güçlü "ama" var. |
| Tuhaf detay | Tek cümleyle anlatınca "yok artık" dedirten, çizilebilen bir ayrıntı (kaynaklı). |
| Cevap | Sonuç, kancanın sorusunu tatmin edici biçimde cevaplıyor. |
| Harita ve bağ | Rota haritada anlam taşıyor ve izleyiciyle bir bağı var. |

**≥ 12: pilot ya da sezon açılışı · 9–11: güçlü iki bölüm arasında · ≤ 8: tek başına bölüm değil,
başka bölümün içinde bir sahne.**

Örnek puanlar (Kasım 2026, kaynakla kesinleşecek):

| Hikâye | İs | En | Be | Sa | Kı | De | Ce | Ha | Toplam |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Casanova, İstanbul 1745 | 0 | 0 | 1 | 0 | 1 | 1 | 0 | 2 | **5** |
| Casanova, Kurşun Damlar'dan kaçış 1756 | 2 | 2 | 2 | 2 | 2 | 1 | 2 | 1 | **14** |
| Seydi Ali Reis, Hindistan'dan karadan dönüş | 2 | 2 | 2 | 1 | 2 | 1 | 2 | 2 | **14** |
| Cem Sultan, Avrupa'da rehine | 2 | 2 | 2 | 1 | 2 | 2 | 1 | 2 | **14** |

## 8. Etik sınır: neyi yapmayız

Psikolojik teknikler gerçek bir karşılığı daha merakla bekletmek içindir. Şunlar yasak:

- **Yalan kanca:** Başlıkta, kapakta ya da ilk saniyede vaat edilen şey videoda yoksa kanca yalandır.
- **Sahte askı:** Bölümün kendi sorusunu cevapsız bırakıp izleyiciyi sonraki bölüme zorlamak.
- **Uydurma olay ya da diyalog**u gerçek gibi sunmak.
- **Sahte aciliyet** ("silinmeden izle"), öfke yemi, doğrulanamayan genelleme ("insanların %99'u bilmiyor").
- **Hassas konuyu kışkırtma için kullanmak:** din, milliyet, mezhep konuları kaynaklı ve saygılı anlatılır.

Neden sadece etik değil, stratejik de: YouTube önerilerde izleyicilere bir videoyu 1–5 yıldızla
puanlatıyor ve yalnızca 4–5 yıldız alan izlenmeleri "değerli izlenme süresi" sayıyor. Kandırılmış
izleyici videoyu izlese de düşük puan verir; bu, aynı videonun daha az önerilmesi demek.

## 9. Kontrol listesi

**Brifte:**
- [ ] Hikâye testi puanı (§7) yazıldı
- [ ] İstek, engel, bedel tek cümleyle yazıldı
- [ ] Döngü haritası tablosu (açılış, ödül, kapanış saniyeleri) yazıldı
- [ ] Kanca kalıbı seçildi (§3), yasak açılış yok
- [ ] Tuhaf detay ve kaynağı yazıldı
- [ ] Bölüm sonu askısı (sonraki soru) yazıldı

**Cilalamada:**
- [ ] "Ve sonra" testi tüm seslendirme satırlarında
- [ ] Her sahne sınırında: "İzleyici burada neden kalsın?" sorusunun cevabı var
- [ ] `check` döngü haritası uyarısı yok
- [ ] Yalan kanca, sahte askı, uydurma diyalog yok

## Kaynaklar

- Loewenstein, G. (1994). *The Psychology of Curiosity: A Review and Reinterpretation.* Psychological Bulletin 116(1). [Özet ve tartışma (PBS NOVA)](https://www.pbs.org/wgbh/nova/article/how-to-stimulate-curiosity/), [Nautilus](https://nautil.us/curiosity-depends-on-what-you-already-know-235803)
- Hitchcock'un bomba örneği (*Hitchcock/Truffaut*, 1967): [Futility Closet](https://www.futilitycloset.com/2023/12/20/hitchcocks-bomb-theory/), [David Bordwell](https://davidbordwell.net/blog/2013/11/29/hitchcock-lessing-and-the-bomb-under-the-table/)
- Parker ve Stone, "but / therefore": [Cheatsheet](https://www.cheatsheet.com/entertainment/south-park-trey-parker-and-matt-stone-1-rule.html/), [David Perell](https://perell.com/note/but-therefore-rule/)
- J.J. Abrams, *The mystery box* (TED 2007): [TED](https://www.ted.com/talks/j_j_abrams_mystery_box/transcript)
- Green ve Brock (2000), anlatıya dalma: [Wikipedia: Transportation theory](https://en.wikipedia.org/wiki/Transportation_theory_(psychology))
- Zeigarnik etkisi ve kanıtın sınırları: [GoodTherapy](https://goodtherapy.org/blog/psychpedia/zeigarnik-effect), [Hub Entertainment Research, "Window Pains"](https://hubintel.substack.com/p/the-next-era-of-content-discovery)
- Soğuk açılış: [Wikipedia: Cold open](https://wikipedia.com/wiki/Cold_open), [SlashFilm](https://www.slashfilm.com/1924736/cold-open-meaning-television-explained)
- MrBeast üretim kılavuzu (sızıntı, 2024; doğruluğu "iddia edilen"): [Passionfruit](https://passionfru.it/?p=81151), [Gigazine](https://gigazine.net/gsc_news/en/20240917-mrbeast-youtube-production)
- YouTube öneri sistemi ve memnuniyet anketleri: [YouTube Blog](https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/), [How YouTube Works](https://www.youtube.com/howyoutubeworks/product-features/recommendations)
- Shorts'tan uzun videoya "ilgili video" bağlantısı: [Tubefilter](https://tubefilter.com/2023/09/01/youtube-related-links-multi-format-creators-shorts-live-long-form/), [Search Engine Land](https://searchengineland.com/youtube-enables-linking-shorts-long-form-videos-430655)
- Açık döngü ve tutma grafiği (yaratıcı blogları, kanıt düzeyi düşük): [Search Engine Land: audience retention](https://searchengineland.com/guide/audience-retention)
