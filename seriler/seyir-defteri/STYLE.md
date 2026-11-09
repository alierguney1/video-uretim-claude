# STYLE.md: "Seyir Defteri" (çalışma adı)

Seri kimliği: MOTION_RULES.md §5'teki **sabit** sütun. Her bölüm buna uyar; kanca türü, durak
sayısı, araçlar, sahneler ve süre bölümden bölüme değişir. Plan ve gerekçeler: [PLAN.md](PLAN.md).
Çalışan örnek: [stil-testi.html](stil-testi.html).

## Niş

Tarihte gerçekten yaşamış tuhaf insanların yolculukları: maceracılar, casuslar, dönmeler, sürgünler,
elçiler. Ana hikâye haritada izlenir; her durakta piksel bir diorama o yerde ne olduğunu gösterir.
**Kural: her iddia kaynaklı, her mesafe kodda hesaplanır.** Kaynağı olmayan ekrana yazılmaz.

## Neden piksel (izometrik değil)

- **Üretim ucuz:** Karakter = 20x35'lik bir ASCII tablosu. Yeni kişi bir palet ve birkaç satırdır.
  İzometrikte her bina ve karakter üç yüzlü çizilmeli, yürüyüş animasyonu da zor.
- **Harita bedava gelir:** Natural Earth kıyıları düşük çözünürlükte eşiklenince kendiliğinden piksel harita olur.
- **Deterministik ve tamsayı:** Her şey tam piksel ızgarada; `t` → aynı kare.
- **Ayrışır:** Tarih kanallarının çoğu parşömen haritası ya da AI görseli kullanıyor.
- İzometrik ileride özel bir sahne türü olabilir (ör. bir kuşatmanın kesiti), seri kimliği değil.

## Piksel ölçekleri (sabit)

| Ekran | Mantıksal | Piksel | Not |
| --- | --- | --- | --- |
| Harita (dikey) | 270x480 | 4x | Yatay: 480x270 |
| Diorama (dikey) | 180x320 | 6x | Yatay: 320x180 |
| Yakın plan | 90x160 | 12x | Diorama'nın 2x'i; sadece tamsayı kat |
| Geçiş maskesi | 90x160 hücre | 12 px | 4 ve 6'nın EKOK'u: yarım piksel oluşmaz |

Bir ekranda tek ölçek. Döndürme yok (piksel bozulur; dönük hâl ayrı sprite olarak çizilir).
Ölçekleme yalnızca tamsayı katlarla. Yazılar tam çözünürlükte çizilir (okunabilirlik için tek istisna).

## Palet

| Öğe | Değer |
| --- | --- |
| Mürekkep (metin kutusu, kenar, kıyı) | `#1A1420` |
| Kâğıt (metin, ikon) | `#F3E9D2` |
| **Vurgu = yol** | `#E2483D`. Yalnızca bu bölümün rotası, aktif jeton, seçilen seçenek. Önceki bölümlerin rotası aynı renk %35. |
| Altın = zaman ve önem | `#F2B544`. Yıllar, tarih satırı, mini haritadaki "buradayız" noktası, karakterdeki süs. |
| Kara | `#D9C8A0`, kıyı `#3A2E2A` |
| Deniz | derin `#1E2A44` · deniz `#26385A` · sığ `#2C4468` / `#33507A` (Bayer geçişli) · köpük `#5E86AE` · gölge `#18213A` |
| Diorama göğü (gün batımı seti) | `#2B2450 → #4A2F63 → #8A3F6B → #D06A5E → #F2A65A`, güneş `#F7D78A` |
| Silüet / su | `#3A2850`, `#4E3363` · `#3B3466`, `#2E2C57`, `#24234A` |
| Taş | `#B8AFA3`, `#8C8279`, `#6E655E` |

Durak başına gök seti değişebilir (gece, öğle, fırtına, sis); her set 5 bant + bir ışık kaynağı.
Yeni set eklenirse buraya yazılır.

## Yazı tipleri

- **Jersey 10:** yer adları, başlık, anlatı kutusu. Dar, okunaklı, Türkçe tam.
- **VT323:** tarih, yıl, koordinat, km, "defter kaydı". Eş genişlikli olduğu için sayaçlar titremez (tabular).
- Reddedilenler: Pixelify Sans (5 ≈ S), Silkscreen (Türkçe harf yok), Press Start 2P (çok geniş).

## Ekranlar

**Harita ekranı.** Yalnızca kara ve deniz (modern sınır yok). Kıyıda 1 px mürekkep çizgisi,
güneye 1 px gölge, sığ suda dither halkası, dünyaya sabitli yanıp sönen dalga izleri.
Şehirler küçük ikonlarla (kubbe+minare, çan kulesi, kale …), ad etiketi mürekkep plakada.
Rota kesikli kırmızı, mürekkep kenarlı; ucunda yolculuk jetonu (gemi; karada at ya da yaya).
Başlık her zaman çerçeveli kutuda: kâğıt rengi metin kara üstünde okunmaz.

**Durak ekranı (diorama).** Yandan görünüş, katmanlar: gök (Bayer bantları) → uzak silüet → su/arazi →
zemin → karakterler → ön plan. Üstte yer adı (Jersey, büyük) + tarih satırı (VT323, altın).
Sağ üstte mini harita (4x, rota + yanıp sönen altın nokta). Altta anlatı kutusu (2–3 satır,
daktilo ile belirir, VO ile senkron).

**Karakter kartı.** 20 sütun x ~35 satır, sağa bakar (`flip` ile sola). Harf = palet
(K mürekkep, S ten, s ten gölgesi, E göz …). Kimlik 3 şeyden okunur: başlık (şapka/kavuk/fes),
gövde rengi, tek bir aksesuar (baston, kılıç, mektup). Göz kırpma ve nefes palet/1 px ile;
bir karakterde en fazla 2 karelik döngü. Sezonun ana karakteri her bölümde aynı sprite.

## Hareket dili

- **Rota çizilmesi = zamanın geçmesi.** Sabit hızla değil `inOutCubic`; durak öncesi yavaşlar.
- **İkona yaklaşma + dither çözülmesi = "içeri gir".** Tersi = "yola devam". Başka geçiş ailesi yok.
- **Altın yanıp sönme = "şu an buradayız".**
- **Soluk kırmızı rota = geçmiş bölümler** (defter büyür).
- Kamera: haritada yavaş itme/kaydırma (log-zoom); dioramada kamera sabit, yalnızca 2x yakın plan kesmesi.
- Ambiyans hareketi her zaman dünyaya bağlı (martı, dalga, kedi kuyruğu); süs parçacığı yok.

## Ses

- Anlatıcı: tercihen insan sesi; TTS ise Charon dışı, sakin anlatıcı (PLAN.md §5).
- Müzik: kodla chiptune döngüsü (kare + üçgen dalga), sezon başına bir tema; −14 LUFS'u altlık tutar.
- Ses imzası: dither geçişinde kısa "şşt", rota adımlarında yumuşak tık, defter kaydında daktilo tıkı.

## Yasaklar

- Kenar yumuşatmalı şekil (yazılar hariç), CSS gradyanı (Bayer kullan), yumuşak gölge, ışıma, bulanıklık.
- Tamsayı dışı ölçek, döndürülmüş sprite, aynı ekranda iki piksel ölçeği.
- Modern sınır, modern bina, döneme ait olmayan eşya (bkz. PLAN.md §4).
- Belirli bir oyunun karakteri, arayüzü, paleti ya da sahnesinin kopyası. Genel piksel sanatı dilini
  kullanırız, bir oyunu taklit etmeyiz.
