# hys-09-baskentler — brif

Seri: Harita Yalan Söyler · Bölüm 9 · "Senin ilin" serisinin açılışı (strateji dokümanında fikir 9)

Durum: **brif + sahne listesi onay bekliyor.** Onaydan önce `.html` yazılmaz (CLAUDE.md adım 2).

## Neden bu fikir (20 il fikri + 6 hazır bölüm arasından)

- **Herkesin ili ekranda.** Tek ilin değil 81 ilin videosu: izleyici haritada kendi ilini arar, yorumda "benim ilim" yazar. Kırşehir bölümünün IG'deki 16 göndermesi bu "memleket" sinyalinden geldi; bu video onu 81 ile yayar.
- **Sayı hem şaşırtıcı hem sağlam.** Hesap sonucu: **81 ilin 43'ü** (Ankara hariç 80 ilin 43'ü; Lefkoşa dahil, kullanıcı kararı) Ankara'dan çok yabancı bir başkente yakın. "Türkiye'nin yarısından fazlası" cümlesi kodla doğrulandı, uydurma yok.
- **İçinde ikinci bir şok var:** 43 ilin **23'ü** için en yakın yabancı başkent **Erivan**. Tahmin edilmesi zor, yorum getirir.
- **Seri motoru.** Sabit yorum "senin ilin hangisi?" diye sorar; yorumlar sıradaki tekil il bölümlerini (İzmir–Atina, Edirne–Sofya, Iğdır–Erivan…) seçer.
- **İl hesaplarına en geniş dağıtım:** 43 boyalı ilin her biri paylaşım için bir sebep (aşağıda plan).
- Neden 1 (Edirne–Budapeşte / Hakkari) değil: iki il konuşur ve Hakkari'yi "uzak" diye anma riski taşır (ton kuralı). Neden 3 (İzmir–Atina) değil: tek il; bu videonun bir karesi zaten o. İkisi seriye ikinci/üçüncü bölüm olarak kalır.

## Brif (12 parça)

1. **Rol:** Bilgi tasarımcısı + harita anlatıcısı. *Gerekçe: veri haritası; okunurluk her şeyden önce.*
2. **Hedef:** İzleyici şunu hatırlamalı: "Türkiye'nin yarısından fazlası, Ankara'dan çok bir komşu başkente yakın; en çok ile yakın olan Erivan."
3. **Format:** ~36 sn (seslendirmeye göre kesinleşir), 1080x1920, 60 fps. Charon (STYLE.md) + sentez: her il boyandığında kısa tık, gerçek anında iki notalı ping, alçak drone.
4. **Sahne listesi:** aşağıda (onay bekliyor).
5. **Sanat yönü:** STYLE.md. Düz Mercator harita (küre yok; bu bölümün işi karşılaştırma). Boyalı il = vurgu `#FF6B2C` (gerçek), boyasız il = kâğıt `#E8E2D4`. İl sınırları okyanus rengi %60, 1 px. Başkentler (Lefkoşa dahil): vurgu nokta + Inter 600 etiket; Ankara kâğıt halka.
6. **Hareket dili:** (a) İl → başkent çizgisi çizilerek uzar (`inOutCubic`) = mesafe. (b) Boyama başkentten dalga gibi yayılır (ile uzaklık sırasıyla), her il ayrı karede = sayım. (c) Kamera sadece kayar ve yaklaşır; son karede ilk kadraja döner.
7. **Yasaklar:** MOTION_RULES.md. Bu işe özel:
   - İlleri küçümseyen kelime yok ("uzak", "ücra", "geri kalmış"). Cümle hep "başkente yakın" yönünden kurulur.
   - Bayrak, siyasi yorum, sınır kapısı/ilişki yorumu yok. Erivan için sadece mesafe. Lefkoşa "KKTC'nin başkenti" olarak yazılır, "Nicosia" ya da Kıbrıs Cumhuriyeti adı kullanılmaz.
   - Yol/uçuş süresi iddiası yok: her şey **kuşuçuşu**, ekranda yazılı.
   - Kodda hesaplanmayan sayı yok; tüm sayılar `veri/hys-09/sonuc.json`'dan okunur.
8. **Kanca türü:** tahmin et ("81 ilin kaçı…? Tahmin et."). Cevaptan önce 600 ms durgunluk. Yayınlanmış son üç bölümün türleri: tahmin et (06), ya …olursa (07), yanlış inanış (08) → art arda 2 kuralı bozulmuyor.
9. **Ara ödüller:** ~5 sn İzmir: Atina 303, Ankara 519 · ~10 sn batı 9 il, sayaç 9 · ~15 sn güney 11 il (Lefkoşa 6, Beyrut 4, Şam 1), sayaç 20 · ~20 sn Erivan: tek başkent 23 il, sayaç 43'e fırlar · ~25 sn Iğdır–Erivan 49 km, Ankara 953 km · ~29 sn Kahramanmaraş kıl payı, 18 km · ~32 sn 43/81.
10. **Gönderilme sebebi:** Herkes kendi ilini bulur ve memleketlisine "bizim il boyalı" diye atar; boyasız ildekiler "biz neden yokuz" diye yorum yazar.
11. **Farklılık:** Seride ilk "81 il" veri haritası ve ilk canlı sayım; önceki bölümler tek nesne/tek rota üzerineydi. Küre yok, tamamı düz harita.
12. **Yayın paketi:** aşağıda.

## Gerçekler (kodla hesaplandı)

Kaynak: Natural Earth 1:10m (`admin_1_states_provinces` il sınırları, `populated_places` il merkezleri ve başkentler). Natural Earth'te merkezi olmayan 9 il (Aksaray, Ardahan, Bartın, Bayburt, Düzce, Iğdır, Osmaniye, Şırnak, Yalova) için koordinat GeoNames'ten elle girildi; `kaynak` alanında işaretli.
Mesafe: büyük daire, R = 6371,0088 km (d3.geoDistance ile aynı). Yeniden üretmek için:

```bash
node tools/hys-09-hesap.mjs                  # ana sonuç (Lefkoşa dahil)
node tools/hys-09-hesap.mjs --lefkosa-haric  # karşılaştırma
```

| Sonuç | Değer |
| --- | --- |
| Boyalı il (Lefkoşa dahil, ana sayı) | **43 / 80** (Ankara'nın kendisi hariç) → "81 ilin 43'ü" |
| Lefkoşa hariç | 41 (Antalya ve Karaman boyanmaz) |
| Alan olarak | Türkiye yüzölçümünün %51,0'i (Lefkoşa hariç %43,8) |
| Başkent başına | Erivan 23 · Atina 6 · Lefkoşa 6 (Mersin, Adana, Osmaniye, Karaman, Antalya, Kahramanmaraş) · Beyrut 4 · Sofya 2 · Bükreş 1 · Şam 1 |
| En büyük fark | Iğdır: Erivan 49 km, Ankara 953 km |
| Kıl payı | Kahramanmaraş: Lefkoşa 420, Ankara 438 (18 km) · Balıkesir: Atina 405, Ankara 426 (21 km) · Adıyaman: Beyrut 500, Ankara 527 (27 km) |
| Kıl payı boyasız | Giresun: Erivan 523, Ankara 480 · Malatya: Beyrut 559, Ankara 500 |
| İstanbul | Boyasız: Ankara 350, Bükreş 447 |

Hassasiyet notu: En dar fark Kahramanmaraş'ta 18 km; birkaç km'lik koordinat seçimi sonucu değiştirmez. Lefkoşa hariç tutulsaydı Kahramanmaraş'ın farkı 3 km'ye düşerdi (Beyrut 435). Videoda "kıl payı" diye söylenir. Ardahan'da Erivan (184) ile Tiflis (187), Artvin'de Erivan (253) ile Tiflis (255) neredeyse eşit; ekranda Ardahan için iki çizgi birden çizilebilir (tek izlemede kaçan detay).

**Strateji dokümanındaki düzeltmeler:** Hakkari'ye en yakın başkent Bağdat değil, Erivan (298 km). Kars ve Erzurum'a da en yakın yabancı başkent Bakü değil, Erivan (129 / 276 km). Fikir 2, 6 ve 8 bu sayılarla yeniden yazılmalı.

## Seslendirme metni (~85 kelime) → `hys-09-baskentler.voice.json`

1. 81 ilin kaçı, Ankara'dan çok yabancı bir başkente yakın? Tahmin et.
2. Kural basit: il merkezinden kuşuçuşu. Ankara mı yakın, komşu başkent mi?
3. Batıdan başlayalım: Edirne Sofya'ya, Kırklareli Bükreş'e, İzmir Atina'ya daha yakın.
4. Güneyde Lefkoşa, Beyrut ve Şam: Antalya'dan Hatay'a, on bir il daha.
5. Ama asıl sürpriz doğuda. Tek bir başkent, yirmi üç ile Ankara'dan yakın: Erivan.
6. Iğdır'dan Erivan kırk dokuz kilometre. Ankara dokuz yüz elli üç.
7. Kahramanmaraş ise kıl payı: fark sadece on sekiz kilometre.
8. Sonuç: 81 ilin 43'ü. Türkiye'nin yarısından fazlası.
9. Senin ilin boyalı mı?

## Sahne listesi (taslak, onay bekliyor)

| Sn | Sahne | Ekranda | Geçiş nesnesi |
| --- | --- | --- | --- |
| 0–3,5 | Kanca | 0. karede Türkiye 81 il sınırıyla, kâğıt renginde; Ankara halkası nabız atıyor; il sınırları hafifçe parlayıp sönüyor (0. saniyede hareket). Üstte "81 ilin kaçı Ankara'dan çok yabancı bir başkente yakın?". Sağ altta sayaç `?/81`. 600 ms durgunluk. | Ankara halkası |
| 3,5–7 | Kural | Kamera batıya kayar. İzmir merkezinden iki çizgi: Ankara'ya (kâğıt, 519 km) ve Atina'ya (vurgu, 303 km). Kısa olan vurgu renginde kalır; İzmir boyanır. Altta "kuşuçuşu · il merkezinden". | İzmir'den Atina çizgisi |
| 7–11 | Batı | Sofya, Bükreş, Atina etiketleri kadraja girer; Edirne, Kırklareli, Tekirdağ, Çanakkale, Balıkesir, Manisa, Aydın, Muğla sırayla boyanır, her biri tık. Sayaç 1→9. | Sayaç |
| 11–15,5 | Güney | Kamera güneye. Lefkoşa'dan dalga: Antalya, Karaman, Mersin, Adana, Osmaniye, Kahramanmaraş; Beyrut ve Şam'dan: Hatay, Kilis, Gaziantep, Adıyaman, Şanlıurfa. Sayaç 9→20. | Sayaç |
| 15,5–21 | Gerçek | Kamera doğuya, 500 ms durgunluk ("asıl sürpriz doğuda"). Erivan noktası belirir, ping. Tek dalgada 23 il boyanır, sayaç 20→43 fırlar. Köşede "Erivan · 23 il". | Erivan noktası |
| 21–25 | Iğdır | Iğdır'a yakınlaşma. İki çizgi: Erivan 49 km (vurgu, kısa) ve Ankara 953 km (kâğıt, kadrajdan taşarak uzar). Mono sayaçlar canlı akar. | Ankara çizgisi (geri çekilirken) |
| 25–28,5 | Kıl payı | Kahramanmaraş yanıp söner (boyalı ↔ boyasız iki kez), "Lefkoşa 420 · Ankara 438 · fark 18 km". Ardahan'da Erivan/Tiflis ikili çizgi bir an görünür (kaçan detay). | Kahramanmaraş |
| 28,5–33 | Sonuç | Kamera tüm Türkiye'ye çekilir. Ortada büyük "43 / 81", altında "Türkiye'nin yarısından fazlası". Köşede küçük not: "kuşuçuşu · il merkezinden". | Sayaç |
| 33–36 | Döngü | "Senin ilin boyalı mı?" Boyalar Ankara'dan dışa doğru söner, harita 0. kareye döner; son kare ilk kare. | Ankara halkası |

## Yayın paketi

- **Kapak (`__cover`):** ~31 sn, tam boyalı harita + üstte "Senin ilin boyalı mı?". Taslak: `/mnt/project-files/hys-09/kapak-taslak.png` (proje dosyaları).
- **Başlık (YouTube Shorts):** 81 ilin kaçı Ankara'dan çok yabancı bir başkente yakın?
- **AI etiketi:** aç (sentetik seslendirme).
- **Sabit yorum (üç platformda):** "Senin ilin boyalı mı? İlini yaz; en çok yazılan ilin hesabını sıradaki videoda tek tek yapıyoruz."

**YouTube açıklama:**
> 81 il merkezinden en yakın yabancı başkente ve Ankara'ya kuşuçuşu mesafeyi hesapladık. 43 il Ankara'dan çok yabancı bir başkente yakın; bunların 23'ü için en yakın başkent Erivan, 6'sı için Lefkoşa. Veri: Natural Earth (1:10m). Yol mesafesi değil, büyük daire mesafesi.
> #harita #türkiye #coğrafya #iller #bilgi

**Instagram açıklama:**
> 81 ilin 43'ü Ankara'dan çok yabancı bir başkente yakın. Senin ilin boyalı mı? 👇
> İl merkezinden kuşuçuşu hesapladık: 23 il için en yakın başkent Erivan, Iğdır'dan sadece 49 km. Mersin'den Lefkoşa 214 km. Kahramanmaraş kıl payı: 18 km.
> Veri: Natural Earth.
> #harita #türkiye #iller #coğrafya #memleket

**TikTok açıklama:**
> 81 ilin 43'ü Ankara'dan çok yabancı bir başkente yakın 🗺️ Seninki boyalı mı? Kuşuçuşu, veri: Natural Earth.
> #harita #türkiye #iller #memleket #coğrafya

## İl hesaplarıyla paylaşım planı

Sıra, takipçi gücü ve "şaşırtma" değerine göre. Hepsi yayından sonraki ilk 2 saatte.

1. **İlk dalga (en güçlü hikâye):** Iğdır (Erivan 49 km), Kars, Ağrı, Van, Hakkari, Ardahan → "Erivan" hikâyesi. Hesaplar: valilik, belediye, yerel haber hesapları ("Iğdır Haber" vb.), "…lılar" sayfaları. Mesaj: "İliniz videoda boyalı: Iğdır'dan Erivan 49 km, Ankara 953 km. Story'de paylaşmak isterseniz video linki: …"
2. **Büyük kitleli boyalı iller:** İzmir (Atina 303), Antalya (Lefkoşa 307), Mersin (Lefkoşa 214), Hatay (Beyrut 268), Gaziantep, Şanlıurfa, Diyarbakır, Adana, Trabzon, Erzurum, Edirne. Kendi sayılarıyla tek satır.
3. **Kıl payı iller (yorum kışkırtır):** Kahramanmaraş (18 km), Balıkesir (21 km), Adıyaman (27 km) ve boyasız kıl payılar Giresun, Malatya.
4. **TikTok:** İl hashtag'leri açıklamaya değil, ilk yoruma ve videoya yanıt videolarına: #iğdır #van #izmir #antalya #hatay. KKTC tarafında Lefkoşa hesapları da (Mersin–Lefkoşa 214 km) ayrı bir dağıtım kanalı.
5. **Story kartları (öneri):** Aynı koddan il başına tek kare "Iğdır → Erivan 49 km · Ankara 953 km" kartı render edilebilir; il hesaplarına DM'de video linkiyle gider. Onaylanırsa ayrı iş.

Ton kontrolü: Her mesaj "yakın" üzerinden kurulur, ilin "uzaklığı" vurgulanmaz. Erivan için siyasi çağrışımlı ifade yok; sadece sayı.

## Karar

- **Lefkoşa:** Ana sayıya dahil (Ali, 11 Kasım 2026). Ana sayı 43; Lefkoşa hariç karşılaştırma `--lefkosa-haric` ile 41.
