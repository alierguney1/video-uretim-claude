# 12 — Kapak (thumbnail) rehberi

Render bittikten sonra, yayından önce **her videoda** yapılır. Çıktı: 3 kapak varyantı, bir önizleme
sayfası ve seçilen kapağın 0. kareye gömüldüğü bir MP4.

```
npm run kapak -- animasyonlar/<ad>.kapak.json             # 3 varyant + out/<ad>/kapak-onizleme.png
npm run kapak -- animasyonlar/<ad>.kapak.json --sec <ad>  # seçileni videonun 0. karesine göm → <ad>-kapakli.mp4
```

Kapak, videonun kendisinden sonra en büyük tıklama kaldıracıdır. Kaydırma akışında kapak görünmez,
ama **kanal ızgarası, arama, öneri rafı, profil ziyareti ve paylaşılan link** kapakla karar verir.
Profile gelen kişi 10 videoya bakar; bizim ızgaramız onları tek tek izletmeli.

## 1. Araştırma özeti (12 Kasım 2026)

**Kaynaklar:** vidIQ'da son 3 ayın patlayan harita/coğrafya Shorts'ları (kanal ortalamasının 5 ila 21 katı
izlenme alanlar: "Countries With A Secret Twin" 462 B, "Countries That Look Like They Touch" 357 B,
"Which is bigger? Sweden vs Cameroon"). Bunlara ek olarak YouTube, Instagram ve TikTok kapak rehberleri ile
Paddy Galloway'in (MrBeast stratejisti) tıklama psikolojisi üzerine söyledikleri incelendi.
Kaynakların çoğu ajans blogu. Kesin CTR rakamı yok, ama konuştukları kurallar birbiriyle tutarlı.

Gözlemler:

1. **Tek fikir, tek odak.** Kazanan kapaklarda tek bir özne var: bir ülke, bir tepe ya da bir çizgi. Göz 1 saniyede
   neye bakacağını biliyor.
2. **2 ila 5 kelime, kalın büyük harf.** "SAME SHAPE. SAME SIZE." ya da "WHICH IS BIGGER?" gibi. Yoğun, dar bir yazı tipi
   kullanılıyor (Anton/Impact ailesi). Beyaz yazı, sarı vurgu, kalın siyah kontur ve gölge var.
3. **Merak boşluğu.** Kapak soruyu sorar ama cevabı vermez. Galloway'e göre tıklamanın %80–90'ı psikoloji,
   %10–20'si tasarım. Sırayla önce fikir, sonra çerçeve, en son süs gelir.
4. **Yönlendirici.** Kırmızı ok ya da halka gözü özneye götürür. Bir emoji (🤔 🤯 👀) duyguyu yüklenir.
   Yüzü olmayan kanalların "yüzü" bu emojidir.
5. **Bayrak = anında tanıma.** Ülke şeklinin içi bayrakla doldurulur ya da yanına bayrak konur. Okumadan anlaşılır.
6. **Karşılaştırma kalıbı.** "A mı B mi?" ya da "aynı boyut" gibi iki nesneyi yan yana koymak harita nişinin en güçlü kalıbı.
7. **Doygun renk.** Uydu görünümü ya da canlı bayrak renkleri kullanılıyor. Bizim koyu arka planımız sakin ve
   tanınır, ama kapakta karşıtlığı artırmak şart.

Kendi kapaklarımızın sorunları (hys-03 ve hys-10'un ilk kapağı): yazı küçük ve ince, altyazı kutusu kapağa girmiş,
3–4 yazı katmanı yarışıyor ve %25 boyutta hiçbir şey okunmuyor.

## 2. Altı kapak formülü (her videoda en az 3'ünü dene)

| Formül | Kapak metni (örnek) | Görsel | Ne zaman |
| --- | --- | --- | --- |
| **İmkânsız iddia** | BU SAHİLDEN *BAŞKA ÜLKE* GÖRÜNÜYOR | İddianın kanıt anı (tepe, çizgi) + ok | Videonun "büyük an"ı görselse |
| **Sayı şoku** | İL MERKEZİ 179 KM / *KIBRIS 76 KM* | Mesafe çizgisi, sayı rozeti | Karşılaştırılan iki sayı varsa |
| **Karşılaştırma** | HANGİSİ *BÜYÜK?* | İki şekil yan yana, bayraklı | Alan/boyut/mesafe yarışında |
| **Kendi ilin** | İLİN HANGİ *BAŞKENTLE* AYNI HİZADA? | 81 il haritası/listesi, il ikonları | Durdur-bul karesi olan il videolarında |
| **Gizem nesnesi** | BU *NERESİ?* | Tek nokta/şekil + kocaman "?" + halka | Cold open kancalı bölümlerde |
| **Yanlış inanış** | HARİTA *YALAN* SÖYLÜYOR | Yanlış (kâğıt) vs gerçek (turuncu) | Mercator/boyut yanılgısı bölümlerinde |

Varyantlar **farklı formüllerden** seçilir. Aynı formülün üç tonu deneme sayılmaz.

## 3. Kurallar

**Metin**
- 2 ila 5 kelime ve en fazla 3 satır. Başlığı tekrar etme, başlığı tamamla.
  (Başlık: "Tunus'tan daha güneyde bir Türk ilçesi var" → kapak: "BU SAHİLDEN BAŞKA ÜLKE GÖRÜNÜYOR")
- Anton, Türkçe büyük harf (`toLocaleUpperCase('tr')`: i→İ), 130–160 px. En önemli kelimeler `*sarı*`.
- İkinci satır (`alt`) isteğe bağlı: Inter 900, 60–70 px, en fazla 5 kelime. Çoğu zaman "Neresi?" gibi bir soru olur.
- Cevabı yazma. Kapak soruyu taşır, video cevaplar. Kullanıcı bir kelimeyi istemiyorsa
  (ör. "Tunus deme") o kelime kapağa girmez.

**Kompozisyon** (1080x1920 üzerinde)
- Başlık y 250–750 arasında ve sola hizalı. Özne y 700–1300 arasında. `alt` y 1450–1620 arasında.
- **IG/TikTok ızgarası 3:4:** üstten ve alttan ~240 px kesilir. Önemli her şey y 240–1680 arasında kalmalı.
- **YouTube:** sağ alt köşe (beğen/paylaş düğmeleri) ve alt 300 px boş kalmalı.
- Özneyi büyüt: `zoom` ile 1,15–1,4 kat yakınlaş, `dy` ile başlığa yer aç. Gereksiz harita boşluğu kesilir.
- Tek ok **ya da** tek halka, tek emoji, en fazla 2 bayrak. Toplamda en fazla 4 görsel öğe.
- Altyazı kutusu ve video başlık bandı kapağa girmez (araç `?nocap&nohead` ile temiz kare alır).

**Renk ve kimlik**
- Arka plan videodaki kare olur, böylece seri kimliği (koyu okyanus, kâğıt kara, turuncu gerçek) korunur.
- Kapakta STYLE.md'deki "gölge yok" kuralı askıya alınır. Yazı konturu, gölge ve ok gölgesi serbest.
- Sarı (`#FFD23F`) yalnızca kapak vurgusudur. Turuncu (`#FF6B2C`) videodaki "gerçek" anlamını korur.
- Açık zeminde (kâğıt rengi kara) araç başlık arkasına otomatik koyu geçiş koyar. Yetmezse `karart: 0.3` kullan.

**Dürüstlük** (kanalın adı "Harita Yalan Söyler"; kapak yalan söylemez)
- Kapaktaki her iddia videoda gösterilir ve kodla hesaplanmıştır.
- Abartı serbest, yalan yasak. "Afrika'dan güneyde" değil "Afrika'nın 2 başkentinden güneyde".
- Siyasi sembol yok. Tartışmalı bölgelerde bayrak kullanılmaz (ör. Kıbrıs'ta bayrak yok, ada adı yeter).
- Aşağılayıcı stereotip yok (MOTION_RULES §3b ikon kuralı geçerli).

## 4. Süreç

1. **Senaryo bitince** `animasyonlar/<ad>.kapak.json` yazılır, en az 3 varyant, her biri farklı formülden.
   Her varyant için videonun hangi anı (`t`) kullanılacağı kontak sayfasından seçilir.
   İyi kare: özne büyük, arka plan sade, ekranda yazı az.
2. `npm run kapak -- animasyonlar/<ad>.kapak.json` çalıştırılır.
3. `out/<ad>/kapak-onizleme.png` **Read ile açılır** ve şu kontrol listesi uygulanır:
   - [ ] %25 boyutta ("kanal rafı") başlık okunuyor mu?
   - [ ] 1 saniyede tek fikir anlaşılıyor mu? Göz nereye gidiyor?
   - [ ] IG/TikTok 3:4 kırpmasında başlık ve özne kesilmiyor mu?
   - [ ] YouTube 16:9 görünümünde (yanlar bulanık) ortadaki kapak hâlâ çalışıyor mu?
   - [ ] Açık temada kenarlar kayboluyor mu?
   - [ ] Cevap kapakta mı? (Olmamalı)
   - [ ] Ok/halka doğru yeri mi gösteriyor (zoom sonrası koordinat)?
   Sorun varsa JSON düzeltilir ve araç tekrar çalıştırılır. En fazla 3 tur.
4. **Seçim:** önerilen varyant tek satırlık gerekçesiyle kullanıcıya sunulur, üçü de gösterilir.
   İsteğe bağlı olarak vidIQ `vidiq_score_thumbnail` ile ikinci görüş alınır (karar yine kontrol listesine göre verilir).
5. `npm run kapak -- … --sec <varyant>`: kapak videonun **0. karesine** gömülür (1/60 sn, gözle görülmez;
   süre ve ses değişmez). Böylece:
   - **YouTube Shorts:** kapak seçicide ilk kare seçilir. Mobil Studio "görsel yükle" sunuyorsa doğrudan `kapak-<varyant>.png` yüklenir.
   - **TikTok:** kapak seçicide ilk kare seçilir. Kapak metni eklenmez, çünkü yazı zaten görselde.
   - **Instagram:** "Kapağı düzenle", sonra "Kameradan yükle" ile `kapak-<varyant>.png` seçilir. "Profil ızgarası" önizlemesine bakılır.
6. Yayın için `<ad>-kapakli.mp4` kullanılır. Kapak PNG'leri `/mnt/project-files/<bölüm>/` klasörüne kopyalanır.
7. `yayinlar.csv` `notlar` sütununa `kapak: <formül>` yazılır. 10 videoda bir, kapak formülüne göre
   izlenme ve profil ziyareti karşılaştırılır ve bu tablo güncellenir.

## 5. Spec örneği

`animasyonlar/hys-10-anamur.kapak.json` dosyasına bak. Alanlar `tools/kapak.mjs` başındaki yorumda tanımlı:
`t`, `zoom {x,y,olcek,dx,dy}`, `karart`, `baslik[]`, `baslikY`, `boyut`, `alt`, `altY`, `oklar[]`, `halkalar[]`,
`emoji[]` (`lib/ikon-seti.js` adları: thinking-face, exploding-head, eyes, red-question-mark, fire…),
`bayraklar[]` (ISO kodu), `etiketler[]` (sarı rozet, ör. "ANKARA = PEKİN").

Ok: `x,y` okun ucu. `aci` ise okun gövdesinin uzandığı yön: 0 sağ, 90 aşağı, 180 sol.
Zoom sonrası koordinat hesabı: `x' = zx + (x − zx)·olcek + dx`, `y' = zy + (y − zy)·olcek + dy`.
