# MOTION_RULES.md

Bu projedeki her animasyon bu kurallara uyar.

## 0) Öncelik sırası

Kurallar çatışırsa üstteki kazanır:

1. **Doğru.** Uydurma sayı, özellik, olay yok.
2. **Anlaşılır.** Ses kapalıyken de.
3. **İlk saniyede tutar.**
4. **Sonuna kadar tutar.**
5. **Tekrar izletir / gönderilir.**
6. **Güzel.**

Güzellik en sonda: güzel ama tutmayan video, çirkin ama tutan videodan kötüdür.
Algoritmanın ölçtüğü şey 3–5 arası; "AI ile yapılmış" olması ne ödül ne ceza
([docs/platform-notlari.md](docs/platform-notlari.md)).

> **(V)** ile işaretli sayılar platform gerçeği değil, **çalışma varsayımımız**.
> Kendi verimiz biriktikçe (bölüm 7) güncellenir.

## 1) Render sözleşmesi

* Tüm görsel durum zamanın saf fonksiyonu olsun: `draw(t)`. Önceki kareye bağlı biriken durum yok.
* Rastgelelik sadece tohumlu üreteçle (ör. mulberry32). `Math.random` yasak.
* Sayfada `window.__duration` ve `window.__setTime(t)` olsun. Böylece dışarıdan kare kare sürülebilsin.
* URL'de `?t=3.2` verilirse o anı çizip dursun (tek kare kontrolü için).
* Sabit çözünürlük ve fps. `devicePixelRatio` ile net çizim.
* Tek dosya HTML. Kütüphane gerekirse CDN'den. İstisna: bir serinin ortak motoru (`lib/<seri>-motoru.js`) bölüm dosyalarına göreli yolla eklenebilir; bölüm dosyası yalnızca hikâyeyi taşır.
* MP4 gerekiyorsa: headless tarayıcıyla kare kare PNG al, FFmpeg ile birleştir.
* `window.__cover` = kapak karesinin zamanı. Render bunu `cover.png` olarak da çıkarır.

## 2) Tutma yapısı

**Kanca (0–1 sn)**
* 0. karede hareket ve konu zaten ekranda. Logo, isim, "merhaba", yavaş fade-in, boş ekran yok.
* İlk 1 sn'de bir **soru, vaat ya da çelişki** okunur durumda olsun. İzleyici "sonunu görmem lazım" demeli.
* Kanca türü brifte seçilir ve kaydedilir (bölüm 7). Katalog:

  | Tür | Örnek |
  | --- | --- |
  | Sayı şoku | "Bir kâğıdı 42 kez katlarsan Ay'a ulaşır." |
  | Yanlış inanış | "Gökyüzü mavi, çünkü denizi yansıtıyor değil." |
  | Sonuçtan başla | Önce bitmiş şekil, sonra "bu nasıl oldu?" |
  | Görsel paradoks | İmkânsız görünen bir hareket ya da şekil |
  | "Ya …olursa?" | "Dünya dönmeyi bıraksa ne olur?" |
  | Yarım hareket | Tamamlanmak üzere duran bir şey: göz bitişini bekler |
  | Tahmin et | "Grönland gerçekte Türkiye'nin kaç katı?" Cevaptan önce 600 ms durgunluk. Yorum ve gönderme getirir. |

**Orta: neden kalsınlar?**
* **Açık döngü.** Kancada vaat edilen sonuç en büyük ana kadar saklanır. Yolda her **3–5 sn'de (V) bir ara ödül** gelsin: yeni sayı, yeni ölçek, yeni "aaa".
* **Anlamlı görsel değişim** her 1.5–2.5 sn'de (V). Değişim anlam taşımalı (yeni bilgi, ölçek, durum); süs değil.
* **Ölü zaman yok.** 0.7 sn'den uzun tamamen durağan an olmasın. Bilinçli durgunluk (aşağıda) hariç. `check` bunu ölçer.
* **Süre: sonucu taşıyan en kısa süre.** Dolgu sahne, tekrar eden açıklama yok. Kısalabiliyorsa kısalt.

**Son: tekrar izlet, gönderilsin**
* Video **en büyük andan hemen sonra biter.** Outro, "abone ol" kartı, logo kapanışı yok.
* Dikey videoda son kare ilk kareye bağlanır (döngü). İzleyici fark etmeden ikinci tura girer.
* **Tek izlemede yakalanmayacak bir detay** koy (hızlı geçen bir sayı, köşede küçük bir not). Tekrar izlemeyi bu getirir.
* **Gönderilme sebebi** brifte tek cümleyle yazılır: "Bunu kime, neden gönderir?" Cevap yoksa fikir zayıf.
* Abartı içeren şokun yanına küçük bir dürüstlük notu ekle. Yorumlarda güven kazandırır.

## 3) Görünüm

* Ortalanmış başlık + mor/mavi gradyan şablonu yok.
* Anlamı olmayan parçacık, lens flare, neon parlama, RGB kayması, sürekli kamera sallantısı yok.
* Her şeyin zıpladığı elastik easing yok. Easing işe göre seçilir: arayüzde sıkı yay, kamerada yumuşak gir-çık, taşma sadece etkileşim anında.
* En fazla 2 yazı tipi, tek vurgu rengi.
* Her sahnenin tek bir işi var. Ekranda aynı anda en fazla bir cümle.
* **Okuma süresi:** metin en az `max(1.2, 0.4 + kelime × 0.3)` sn tam okunur kalır (V).
* **Yazı boyu:** dikeyde ana metin ≥ genişliğin %7'si, ikincil metin ≥ %4.5. Yatayda ana metin ≥ yüksekliğin %6'sı. Sayılar tabular.
* **Kontrast:** metin ile arka plan arasında en az 4.5:1. Küçük telefon ekranında, güneşte okunmalı.
* Geçişler önceki sahnede zaten görünen bir nesneden doğar.
* Büyük anlardan önce 300–600 ms durgunluk bırak.
* **Güvenli alan (1080x1920):** üst %12, alt %20, sağ %12 boş. Kontak sayfasında kırmızı görünür.

## 3b) Bayrak ve ikon katmanı

Çıplak harita "ders kitabı" gibi durur. Yer adı geçen her sahnede o yer **görsel bir kimlikle** gelir:
ülke → bayrak, il/şehir → ikon. Araç: [lib/ikon-katmani.js](lib/ikon-katmani.js), örnek: [animasyonlar/ornek-ikonlar.html](animasyonlar/ornek-ikonlar.html),
gözden geçirme: `npm run ikonlar` → `out/ikon-katalogu.png`.

* **Ne zaman:** bir ülke ya da il ekranda **ilk kez adıyla** geçtiğinde ikonu/bayrağı `IKON.pop` ile düşer; seslendirmede
  tekrar geçerse `IKON.zipla` ile bir kez zıplar. Harita "durdur-bul" karesiyse 81 ikonun hepsi (`IKON.iller81`).
* **İkon seçimi:** ilin kendi insanının gururla anlattığı, herkesin bildiği şey (yemek, ürün, hayvan, doğa, yapı, isim
  şakası). Yasak: kişi, din, siyaset, etnik köken, kulüp logosu, afet/terör çağrışımı, telifli karakter/marka, aşağılayıcı
  kalıp yargı ("X'li cimri" türü). Komiklik nesneden ve hareketten gelir, ilden alay etmekten değil.
  Emin değilsen sor: "Bu ilden biri bunu görünce güler mi, alınır mı?"
* **Lisans:** yalnızca kendi çizimimiz (`lib/ikonlar.js`) ya da MIT/kamu malı setler (`lib/ikon-seti.js`: Fluent Emoji Flat,
  flag-icons). İnternetten görsel indirip koymak yok.
* **Renk kuralı korunur:** ikon ve bayrak süstür, gerçeği taşımaz. Turuncu vurgu (`#FF6B2C`) ikonun içinde ya da çerçevesinde
  kullanılmaz; çıkartma kenarı kâğıt beyazı + koyu çizgi.
* **Boyut (dikey 1080):** tek başına ikon ≥ 90 px, kalabalık haritada ≥ 44 px, bayrak yüksekliği ≥ 40 px. Daha küçüğü telefonda okunmaz.
* **Kalabalık:** aynı anda en fazla 1 vurgulu (büyük + etiketli) ikon. Vurgu varken diğerleri %40'a çekilir.
  Etiket `il · etiket` biçiminde, güvenli alanın içinde (kütüphane kırpar).
* **Hareket:** giriş hafif taşmalı (`pop`, ≤ %10), bu bir olaydır; sürekli sallanma/zıplama yok. Bayrak dalgası sadece `direk` biçiminde ve yavaş.
* **Doğruluk önce:** ikon iddia taşımaz ("en büyük", "ilk" gibi). Etikette sayı ya da tarih yazacaksan kaynağı brifte olsun.
* Brifte sahne listesinin yanına **hangi sahnede hangi bayrak/ikon** sütunu eklenir.

## 4) Ses

* **Ses kapalıyken de anlaşılmalı.** Ses güçlendirir, taşımaz.
* **İnsan sesi tercih edilir.** Kendi seslendirmen videoya "insan" öğesini getirir: Instagram açıkça insan içeriğini öne çıkarıyor, AI yığınından ayrışmanın en ucuz yolu bu. Seslendirme varsa Whisper ile kelime düzeyinde zamanla, altyazı ve sahneler ona otursun.
* Ses verilmezse Web Audio ile sentezle. Her ses ekranda görünen bir olaya bağlı olsun (`SOUNDS` listesi).
* Müzik verilirse önce analiz et (BPM, vuruşlar, enerji), görüntüyü ona göre zamanla. Kullanım hakkı sende olmalı.
* **Ses seviyesi:** hedef −14 LUFS, tepe ≤ −1 dBTP. Render iki geçişte ölçüp uygular ve sonucu yazar. Sadece seyrek efekt sesi varsa tepe sınırı yüzünden −16/−17'de kalır; bu kabul edilebilir. Altına sürekli bir doku (drone, müzik) eklenirse hedef tutar.

## 5) Kimlik ve çeşitlilik

Algoritma iki şeyi birden ister: tanınan bir seri (takip, geri dönen izleyici) ve şablon gibi
durmayan videolar (YouTube "inauthentic content", Instagram özgünlük sıralaması). Çözüm, neyin
sabit neyin değişken olduğunu açıkça ayırmak:

| Sabit (seri imzası, `STYLE.md`'de) | Her videoda değişir |
| --- | --- |
| Palet + vurgu rengi, yazı tipleri | Kanca türü |
| Doku, ışık, çizgi karakteri | Sahne yapısı ve sayısı |
| Ses imzası (bir tını, bir vuruş) | Konu, ana nesne, kamera hareketi |
| Hareket dili (ne neyi ifade eder) | Geçiş nesnesi, büyük anın biçimi |
| Seri adı / tekrar eden kapak düzeni | Süre |

* Brifteki **"farklılık"** satırı zorunlu: son 5 videodan kanca türü ve yapı olarak ayrılmalı.
* Aynı kanca türü art arda en fazla 2 kez.
* Niş ve stil seçilene kadar sabit sütun boş kalır; seçilince `STYLE.md` doldurulur.

## 6) Yayın paketi

Her video şu paketle çıkar (`animasyonlar/<ad>.brief.md` sonunda):

* **Kapak karesi** (`__cover`): tek başına soruyu ya da şoku taşır; yazı güvenli alanda.
* **Başlık:** kancanın yazılı hali. Merak bırakır, cevabı vermez. Tıklama tuzağı yok: video vaadi karşılar.
* **Açıklama + 3–5 etiket:** konuyu tarif eder (arama ve konu sınıflandırması için), etiket yığını değil.
* **AI etiketi:** gerçekçi sentetik insan, yer ya da olay varsa açılır. Motion graphics genelde gerekmez. Emin değilsen aç; TikTok etiketin dağıtımı düşürmediğini söylüyor.
* **Gerçek notu / kaynak:** sayı ya da iddia varsa kaynağı açıklamada.

## 7) Ölçüm ve öğrenme

* Her yayın [yayinlar.csv](yayinlar.csv)'ye bir satır olarak eklenir: ad, platform, tarih, süre, kanca türü, yapı, 48 saat ve 7 gün metrikleri.
* Metrikler:
  * **Shorts:** izlemeye devam oranı (swipe-away'in tersi), ortalama izlenme %
  * **TikTok:** ortalama izlenme %, tam izlenme %
  * **Reels:** erişim başına gönderme ve kaydetme
* **A/B kuralı:** Yeni bir fikir mümkünse aynı içerik, iki farklı kanca ile denenir. Sadece kanca değişir.
* **10 videoda bir gözden geçirme:** hangi kanca türü, süre ve yapı öndeyse (V) değerleri ve katalog güncellenir. Kararı tek video değil eğilim verir.

## 8) Kontrol döngüsü

* Kod yazmadan önce sahne listesi, süreler, kanca türü ve ara ödüllerin yeri gösterilir. Onaydan sonra kod.
* `npm run check` temiz geçer (determinizm, hata, ilk saniye hareketi, ölü zaman).
* Final render'dan önce kontak sayfası alınır ve gözle incelenir.
* Taşan yazı, çakışma, okunmayan metin, güvenli alan dışı öge, kısa okuma süresi varsa düzeltilir.
* "Kod çalışıyor" ile "görüntü doğru" aynı şey değil.

## 9) Bu repodaki araçlar

* Yeni animasyon: `template.html` kopyalanarak başlar (sözleşme hazır gelir).
* `npm run check -- <dosya>`: sözleşme denetimi, ölü zaman, kanca hareketi.
* `npm run contact -- <dosya>`: her sahneden ve geçişten kare, `out/<ad>/contact.png`.
* `npm run render -- <dosya>`: kare kare PNG + FFmpeg ile H.264 MP4, −14 LUFS ses, `cover.png`.
* `npm run ikonlar`: 81 il ikonu + bayraklar tek sayfada (`out/ikon-katalogu.png`). Yeni bayrak/emoji: `npm run ikon-seti -- --bayrak jp,kr --emoji camel`.
