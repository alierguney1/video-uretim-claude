# hys-10-anamur — brif

Seri: Harita Yalan Söyler · Bölüm 10 · Ali'nin isteği (11 Kasım 2026): "Anamur ile ilgili video, Hollywood hook taktikleri yoğun."
İlk kez [promptlar/03-senaryo.md](../promptlar/03-senaryo.md) (merak motoru) ile yazıldı.

Durum: sahne listesi onaylandı (Ali, 11 Kasım 2026). `hys-10-anamur.html` yazıldı; taslak render seslendirmesiz (bulut oturumunda Gemini anahtarı yoktu). Sıradaki: `npm run tts -- animasyonlar/hys-10-anamur.voice.json` → VO bloğu gerçek sürelerle güncellenir → contact → `npm run render -- animasyonlar/hys-10-anamur.html --audio ses/hys-10-anamur/voice.wav`.

## Neden bu fikir

- **Harita yalan söyler:** Türkiye'yi "kuzeyde", Afrika'yı "aşağıda" sanırız. Anamur Burnu Tunus'tan 86 km, Cezayir'den 82 km güneyde. Haritada çizgi çekince Afrika'nın iki başkenti Türkiye'nin "üstünde" kalıyor.
- **Tek ilçe, üç şok:** (1) Afrika başkentlerinden güneyde, (2) Kıbrıs kıyısı kendi il merkezinden 2,4 kat yakın (76 / 179 km; Lefkoşa bile 113), (3) Dünya'nın eğriliğine rağmen Kıbrıs'ın en yüksek dağının tepesi Anamur'dan ufkun üstünde kalıyor.
- **Ters köşe gerçek:** Anamur Burnu Anadolu'nun en güney ucu ama Türkiye'nin değil; Hatay 23 km daha güneyde. Çoğu izleyicinin varsayımını kırar, yorumda tartışılır.
- **Durdur-bul karesi:** 81 il merkezinin aynı enlemdeki yabancı başkenti (Ankara = Pekin 3 km, Mersin = Tunus 0,3 km, Kayseri = Lizbon 1 km, Hakkari = Seul 0,7 km). Herkes kendi ilini arar.
- **Cliffhanger = sonraki bölüm:** Türkiye'nin en kuzey ucu (Sinop, İnceburun, 42,10° K) Roma'dan 22 km kuzeyde. Aynı motorla bölüm 11 hazır.

## Brif (12 parça)

1. **Rol:** Animasyon yönetmeni + fragman kurgucusu (merak motoru) + bilgi tasarımcısı.
2. **Hedef:** İzleyici şunu hatırlamalı: "Anamur Tunus'tan güneyde, Kıbrıs'a Mersin'den yakın ve oradan bakınca Kıbrıs'ın dağı ufkun üstünde görünüyor."
3. **Format:** ~41 sn, 1080x1920, 60 fps. Charon + sentez: ping (gerçek), hafif rüzgâr/dalga dokusu yerine STYLE.md drone'u; gerilim sahnesinde drone yarım ton iner, büyük anda ping.
4. **Sahne listesi:** aşağıda.
5. **Sanat yönü:** STYLE.md. Mercator Akdeniz kesiti; enlem çizgisi vurgu `#FF6B2C` kesikli. Başkent noktaları kâğıt rengi, Anamur noktası vurgu. Ufuk kesiti (yan görünüş): deniz `#0F1C26`, Dünya yayı kâğıt %40, Olimpos üçgeni kâğıt, ufkun üstünde kalan kısım vurgu. Sayılar IBM Plex Mono, `textTab`.
6. **Hareket dili:** (a) **Yatay çizgi = enlem**; hep yatay kayar, eğilmez. (b) **Kuşuçuşu çizgi çizilerek uzar = mesafe** (STYLE.md). (c) **Haritadan kesite geçiş = gerçeği yandan görmek**: kamera haritadaki çizginin üstünden 90° "yatar", çizgi kesitin zemin çizgisi olur.
7. **Yasaklar:** MOTION_RULES.md. Bu işe özel:
   - "Afrika'dan güneyde" deme: doğru ifade "Afrika'nın iki başkentinden / Tunus'tan güneyde".
   - "Kıbrıs her gün görünür" deme: "açık havada", "hesaba göre ufkun üstünde". Fotoğraf iddiası yok.
   - Kesitte dikey ölçek abartılı olacak; ekranda "dikey ölçek abartılı" notu sabit.
   - Siyasi dil yok: "Kıbrıs" ada adı; Lefkoşa'yı ülke adıyla etiketleme.
8. **Kanca türü:** **gizem (cold open)**, kataloğa bu bölümle eklendi. Son bölümler: 07 ya …olursa, 08 yanlış inanış, 09 sayı şoku (onay bekliyor). Konunun adı 8. sn'ye kadar söylenmez.
9. **Ara ödüller:** ~2 sn Tunus ve Cezayir çizginin üstünde · ~6 sn ufuktaki "?" siluet · ~10 sn ad: Anamur, Anadolu'nun en güney ucu, Tunus'tan 86 km güneyde · ~15 sn ters köşe: en güney Hatay, 23 km · ~21 sn 179 km vs 76 km (Lefkoşa 113) · ~26 sn 1.063 m ufkun arkasında · ~31 sn 889 m ufkun üstünde · ~35 sn durdur-bul (Ankara = Pekin).
10. **Gönderilme sebebi:** Anamurlu/Mersinli arkadaşına "sizin oradan Kıbrıs görünüyormuş" diye atar; ayrıca herkes kendi ilinin "başkent ikizini" (Ankara = Pekin) gönderir.
11. **Farklılık:** Seride ilk gizem/cold open kancası, ilk yan kesit (Dünya eğriliği) sahnesi, ilk ilçe bölümü, ilk sonraki bölümü açan cliffhanger.
12. **Yayın paketi:** aşağıda.

### Merak haritası (promptlar/03-senaryo.md §4)

| Döngü | Açılır | İzleyicinin sorusu | Kapanır |
| --- | --- | --- | --- |
| A | 0,0 sn | "Türkiye'de Tunus'tan güneyde neresi var?" | 8,4 sn (Anamur) |
| B | 3,9 sn | "Hangi ülke? Nasıl görünür?" | 29,3 sn (889 m ufkun üstünde) |
| B′ (gerilim) | 23,9 sn | "Dünya yuvarlaksa nasıl görünecek?" | 29,3 sn |
| T (ters köşe) | 13,7 sn | "En güney Anamur değilse neresi?" | 16 sn (Hatay) |
| D (durdur-bul) | 34,3 sn | "Benim ilim hangi başkentle aynı hizada?" | izleyici durdurunca |
| C (cliffhanger) | 37,3 sn | "En kuzey ucu neresi, Roma'dan nasıl kuzeyde?" | yorumlar + bölüm 11 |

Açık döngüsüz 1 sn'den uzun aralık yok: A kapanmadan 4,5 sn önce B açılıyor; B açıkken T ve B′ açılıp kapanıyor.

- **Kullanılan araçlar (7/7):** cold open (çizgi + adsız nokta), merak boşluğu ("öyle bir yer var ki…"), katmanlı açık döngü (A→B), gizem (ad 8,4 sn'ye kadar saklı, ufukta "?" siluet), gerilim ("Ama Dünya yuvarlak" + 500 ms durgunluk), ters köşe (en güney Hatay), cliffhanger/döngü (en kuzey ucu → son kare ilk karenin aynası).
- **Ters köşe:** 13,7 sn, "Anamur Türkiye'nin en güneyi" varsayımı kırılır.
- **Cliffhanger / döngü:** "Türkiye'nin en kuzey ucu ise Roma'dan bile kuzeyde. Neresi? Yaz." Görselde enlem çizgisi bu kez 42,10° K'ye çıkar, Roma çizginin altında: ilk karenin aynası, izleyici fark etmeden başa döner.
- **Tek izlemede kaçan detay:** S3'te köşede "Mersin merkezi 36,80° K · Tunus 36,80° K" (0,3 km). S5'te "Ankara 429 km".

## Gerçekler (kodla hesaplandı)

`NE=<natural-earth-geojson-klasörü> node tools/hys-10-anamur.mjs` → `veri/hys-10/anamur.json`, `veri/hys-10/enlem-esleri.json`.
Sınırlar: Natural Earth 1:10m admin-0 (Kıbrıs = CYP + CYN birlikte). Başkentler: NE populated places (Admin-0 capital). Mesafe: büyük daire, R = 6371,0088 km.

| | Değer |
| --- | --- |
| Anamur Burnu (Anadolu'nun en güney noktası, İskenderun Körfezi batısı) | 36,027° K, 32,804° D |
| Türkiye'nin en güney noktası | 35,820° K, 36,138° D (Hatay); Anamur Burnu'ndan **23 km** güneyde |
| Tunus / Cezayir | 36,803° / 36,765° K → Anamur Burnu **86 / 82 km** güneyde |
| Anamur Burnu → Kıbrıs'ın en yakın kıyısı | **70,8 km** (Türkiye–Kıbrıs arası en kısa mesafe de bu) |
| Anamur ilçe merkezi → Kıbrıs kıyısı / Lefkoşa / Mersin merkez / Ankara | **76,3 / 112,5 / 178,9 / 428 km** |
| Olimpos (Troodos), 1.952 m → Anamur Burnu | 121,4 km |
| Ufuk hesabı (göz 2 m, kırılma yok) | Olimpos'un **1.063 m**'si ufkun arkasında, **889 m**'si üstünde |
| Türkiye'nin en kuzey noktası | 42,099° K (Sinop, İnceburun) · Roma 41,898° → **22 km** kuzeyde; Üsküp 11 km |
| Enlem eşleri (durdur-bul) | Mersin = Tunus 0,3 km · Hakkari = Seul 0,7 · Siirt = Aşkabat 0,7 · Niğde = Atina 1,0 · Kayseri = Lizbon 1,1 · Bingöl = Washington 1,8 · Ankara = Pekin 3,1 |

**Ekrana çıkmadan doğrulanacak (kaynak gerekli):**
- ~~Anamur ilçe merkezi koordinatı~~ Doğrulandı: Wikipedia "Anamur" 36,0800 K, 32,8311 D.
- Doğrulandı: Olimpos 1.952 m, 34,93639 K, 32,86333 D (Wikipedia). Wikipedia "Anamur": "deniz sisi yoksa Kıbrıs'ın silueti görünür".
- Türkiye'nin en güney noktasının ilçesi (Yayladağı olması beklenir); ekranda sadece "Hatay" yazılacak.
- Hesap kötümser: atmosferik kırılma eklenirse görünen kısım artar. Ekranda dürüstlük notu: "kırılma hariç; görünürlük havaya bağlı".

## Seslendirme metni (kısaltıldı, ~41 sn) → `hys-10-anamur.voice.json`

İlk taslak tahmini 54 sn çıktı (sayılar yazıyla okununca uzuyor); sayılar ekrana bırakılıp metin kısaltıldı.

1. Türkiye'de öyle bir yer var ki, Afrika'nın iki başkentinden daha güneyde.
2. Üstelik oradan bakınca, ufukta başka bir ülke görünüyor.
3. Burası Anamur. Anadolu'nun en güney ucu: Tunus'tan bile güneyde.
4. Ama dur. Türkiye'nin en güneyi burası değil: Hatay.
5. Gelelim o ülkeye: Kıbrıs, Anamur'a kendi il merkezinden iki kat daha yakın.
6. Ama Dünya yuvarlak. Kıbrıs'ın en yüksek dağının bin metresi ufkun arkasında kalıyor.
7. Ama zirvesi… ufkun üstünde. Açık havada Anamur'dan Kıbrıs görünür.
8. Senin ilin hangi başkentle aynı hizada? Durdur, bul.
9. Peki Türkiye'nin en kuzey ucu? O da Roma'dan kuzeyde. Neresi? Yaz.

## Sahne listesi (onaylandı)

Süreler seslendirme tahmininden (Charon, `atempo=1.12`); TTS sonrası cümle sürelerine oturtulur.

| Sn | Sahne | Ekranda | Geçiş nesnesi |
| --- | --- | --- | --- |
| 0–3,9 | **Cold open** (döngü A) | 0. karede kesikli turuncu yatay çizgi soldan sağa kayıyor. Üstünde kâğıt renkli iki nokta: "TUNUS 36,80°" ve "CEZAYİR 36,77°". Altında, sağ uçta adı olmayan turuncu nokta, yanında "?". Üstte: "Türkiye'de öyle bir yer var ki…". Harita yalnızca Akdeniz kesiti, ülke adları yok. | Enlem çizgisi |
| 3,9–8,1 | **İkinci kanca** (döngü B) | Kamera "?" noktasına iter, harita 90° yatar: nokta kıyıdaki bir göz olur, çizgi deniz yüzeyi. Ufukta küçük, adsız bir dağ silueti ve "?". Metin: "…ufukta başka bir ülke". | Ufuktaki "?" |
| 8,1–13,4 | **Kimlik** (A kapanır) | Kesit geri harita olur; "?" → **ANAMUR** (Inter 800). "Anadolu'nun en güney ucu · 36,03° K". Çizgi batıya Tunus'a uzar, Tunus ile çizgi arasında dikey ölçü "86 km". Köşede kaçan detay: "Mersin merkezi 36,80° K · Tunus 36,80° K". | Enlem çizgisi |
| 13,4–18,2 | **Ters köşe** | 300 ms durgunluk, sonra çizgi aşağı kayar; kamera doğuya Hatay'a, en güney nokta parlar: "Türkiye'nin en güneyi: Hatay · 23 km daha güneyde". Anamur etiketi yerinde soluk kalır. | Çizgi → Anamur noktası |
| 18,2–23,9 | **O ülke** | Kamera Anamur'a döner, güneyde Kıbrıs kâğıt renginde belirir. İki çizgi aynı anda uzar: Anamur → Mersin "179 km" (kâğıt), Anamur → Kıbrıs kıyısı "76 km" (vurgu). Altında iki çubuk. Küçük not: "Lefkoşa 113 km". Kaçan detay: "Ankara 429 km". | 76 km çizgisi |
| 23,9–29,3 | **Gerilim** (B′) | 76 km çizgisi Olimpos'a uzar (121 km), harita yeniden yatar: yan kesit, Dünya yayı. Olimpos üçgeni "1.952 m". Ufuk yükselerek dağın altını örter, sayaç "ufkun arkasında: 1.063 m". 500 ms durgunluk, drone iner. Sabit not: "dikey ölçek abartılı". | Görüş çizgisi |
| 29,3–34,0 | **Büyük an** (B kapanır) | Anamur gözünden görüş çizgisi ufku sıyırarak tepeye ulaşır; tepe vurgu renginde yanar, "889 m ufkun üstünde", ping. Alt satır küçük: "kırılma hariç · görünürlük havaya bağlı". | Görüş çizgisi → enlem çizgisi |
| 34,0–37,0 | **Durdur-bul** (D) | 81 il, 3 sütun, kuzeyden güneye: il · aynı enlemdeki başkent · fark km. Mersin satırı vurgu (Tunus, 0,3 km). Altta "⏸ durdur, ilini bul". | Liste |
| 37,0–41 | **Cliffhanger + döngü** (C) | Liste dağılır, Akdeniz haritası; kesikli çizgi bu kez yukarı, 42,10° K'ye çıkar. Roma noktası çizginin altında, Türkiye'nin kuzey ucunda "?". Son kare ilk karenin aynası (çizgi + başkentler + "?"). | Enlem çizgisi → ilk kare |

## Yayın paketi

- **Kapak (`__cover`):** ~1,5 sn: çizginin üstünde Tunus ve Cezayir, altında turuncu "?" + "Tunus'tan güneyde bir Türk kasabası?" (sol hizalı, 2 satır).
- **Başlık (YouTube Shorts):** Tunus'tan daha güneyde bir Türk kasabası var
  - A/B alternatifi: "Bu sahilden başka bir ülke görünüyor"
- **AI etiketi:** aç (sentetik seslendirme).
- **Sabit yorum:** "Türkiye'nin en kuzey ucu neresi, Roma'dan kaç km kuzeyde? Tahminini yaz, cevap bir sonraki videoda 👇"

**YouTube açıklama:**
> Mersin'in Anamur ilçesindeki Anamur Burnu Anadolu'nun en güney ucu: Tunus'tan 86 km, Cezayir'den 82 km güneyde. Anamur'dan Kıbrıs kıyısı 76 km, Mersin merkezi 179 km. Kıbrıs'ın en yüksek dağı Olimpos'un (1.952 m) yaklaşık 889 metresi Anamur'dan ufkun üstünde kalıyor. Hesap: Natural Earth sınırları, büyük daire mesafesi, geometrik ufuk (kırılma hariç).
> #anamur #mersin #kıbrıs #harita #coğrafya

**Instagram açıklama:**
> Türkiye'de Tunus'tan daha güneyde bir yer var 🌍
> Anamur Burnu: Anadolu'nun en güney ucu. Kıbrıs 76 km, Mersin merkez 179 km. Dünya yuvarlak ama Kıbrıs'ın dağı yine de ufkun üstünde.
> Senin ilin hangi başkentle aynı hizada? 35. saniyede durdur ⏸
> #anamur #mersin #kıbrıs #harita #memleket

**TikTok açıklama:**
> Anamur'dan bakınca başka bir ülke görünüyor 🤯 İlinin "başkent ikizini" bulmak için 35. saniyede durdur ⏸
> #anamur #mersin #kıbrıs #harita #türkiye

## İlçe/il hesaplarıyla paylaşım planı

1. **Anamur önce:** Anamur yerel haber ve "Anamurlular" sayfaları, Anamur Belediyesi ve Kaymakamlığı hesapları, muz üreticileri/kooperatif sayfaları. Mesaj: "Anamur Burnu'nun Tunus'tan güneyde olduğunu ve Kıbrıs'ın dağının hesapla ufkun üstünde kaldığını gösteren 40 sn'lik bir video yaptık; paylaşmak isterseniz kaynaklı." Video yayından sonraki ilk 2 saatte.
2. **Mersin:** Mersin il sayfaları ve yerel haber hesapları; kanca "Mersin merkezi tam olarak Tunus'un enleminde (0,3 km)".
3. **Ters köşe illeri:** Hatay sayfaları ("Türkiye'nin en güneyi Anamur değil, Hatay"). Yorumda tartışma getirir.
4. **Kıbrıs:** KKTC ve Kıbrıslı Türk sayfaları, "Anamur'dan Kıbrıs görünür mü?" sorusuyla. Siyasi etiket yok.
5. **Durdur-bul illeri:** Enlem ikizi çarpıcı olan iller kendi cümlesiyle: Ankara = Pekin, Kayseri = Lizbon, Niğde = Atina, Bingöl = Washington, Hakkari = Seul, Erzurum ve Iğdır = Pekin.
6. **Cliffhanger:** Sinop sayfalarına bölüm 11 yayınlanınca ("İnceburun Roma'dan kuzeyde"); bu videodaki sabit yorumun cevabı olarak.
7. **TikTok:** il hashtag'leri ilk yorumda; "benim ilim hangi başkent" sorularına aynı koddan tek il vurgulu kısa yanıt videoları.

## Bölüm 11 tohumu (cliffhanger'ın cevabı)

Türkiye'nin en kuzey noktası Sinop İnceburun, 42,099° K: Roma ve Vatikan'dan 22 km, Üsküp'ten 11 km kuzeyde (Tiflis 41, Tiran 86 km). Aynı araçla hesaplandı.
