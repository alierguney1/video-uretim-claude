# STYLE.md: "Seyir Defteri" (çalışma adı)

Seri kimliği: MOTION_RULES.md §5'teki **sabit** sütun. Her bölüm buna uyar; kanca türü, durak
sayısı, araçlar, sahneler ve süre bölümden bölüme değişir. Plan ve gerekçeler: [PLAN.md](PLAN.md).
Çalışan örnek: [stil-testi.html](stil-testi.html).

## Niş

Tarihte gerçekten yaşamış tuhaf insanların yolculukları: maceracılar, casuslar, dönmeler, sürgünler,
elçiler. Ana hikâye haritada izlenir; her durakta piksel bir diorama o yerde ne olduğunu gösterir.
**Kural: her iddia kaynaklı, her mesafe kodda hesaplanır.** Kaynağı olmayan ekrana yazılmaz.

## Neden piksel (izometrik değil)

- **Üretim ucuz:** Karakter = 25–30 vektör şekillik bir liste (elips, çokgen, çizgi); kod onu piksele çevirir.
  Yeni kişi = yeni şapka, yeni kıyafet rengi, bir aksesuar.
  İzometrikte her bina ve karakter üç yüzlü çizilmeli, yürüyüş animasyonu da zor.
- **Harita bedava gelir:** Natural Earth kıyıları düşük çözünürlükte eşiklenince kendiliğinden piksel harita olur.
- **Deterministik ve tamsayı:** Her şey tam piksel ızgarada; `t` → aynı kare.
- **Ayrışır:** Tarih kanallarının çoğu parşömen haritası ya da AI görseli kullanıyor.
- İzometrik ileride özel bir sahne türü olabilir (ör. bir kuşatmanın kesiti), seri kimliği değil.

## Piksel ölçekleri (sabit)

| Ekran | Mantıksal | Piksel | Not |
| --- | --- | --- | --- |
| Harita, diorama, mini harita | 360x640 (yatay: 640x360) | **3x** | Her ekranda aynı piksel boyu |
| Yakın plan | 360x640 | 3x | Kamera yaklaşır, kukla **büyük çizilip yeniden pikselleşir**; piksel kabalaşmaz |
| Geçiş | mantıksal piksel | 3 px | Tek ölçek olduğu için yarım piksel sorunu yok |

**Neden 3x:** İlk testte harita 4x, diorama 6x idi. Telefonda yüz, gemi, mini harita ve ikonlar
okunmadı. 3x'te piksel hissi (merdiven kenar, dither, dış hat) korunuyor ve ayrıntı okunuyor.
2x'te piksel görünümü kayboluyor. 1080 ve 1920'yi tam bölen bu ölçek yatayda 640x360 verir.

Piksel sprite büyütülmez ve döndürülmez. Hareket, dönüş ve büyüme vektör kuklada yapılır, sonra
yeniden pikselleştirilir. Yazılar tam çözünürlükte çizilir (okunabilirlik için tek istisna).

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
Sağ üstte mini harita (3x, rota + yanıp sönen altın nokta). Altta anlatı kutusu (2–3 satır,
daktilo ile belirir, VO ile senkron).

**Karakter kartı ("vektörden piksele" kukla).** 52x94 mantıksal kutu (ekranda ~280 px), sağa bakar,
`flip` ile sola. Karakter, ressam sırasıyla bir `[renk, şekil]` listesidir: elips, çokgen, dikdörtgen,
kalın çizgi. Her şekil küçük tuvalde çizilir, alfa ≥ 128 ile eşiklenir (kenar yumuşatması kalmaz),
sonunda otomatik 1 px mürekkep dış hat eklenir. Kimlik 3 şeyden okunur: başlık (üç köşeli şapka,
sarık/kavuk, fes), kıyafet rengi, tek bir aksesuar (baston, çubuk, kılıç, mektup). Arka taraf bir ton
koyu (gölge). Göz kırpma, nefes, duman, kuyruk: şekil parametresi `t`'ye bağlanır. Sezonun ana
karakteri her bölümde aynı liste. Harita ikonları, gemi ve kedi de aynı yöntemle.

## Hareket dili

- **Rota çizilmesi = zamanın geçmesi.** Sabit hızla değil `inOutCubic`; durak öncesi yavaşlar.
- **İkona yaklaşma + dither çözülmesi = "içeri gir".** Tersi = "yola devam". Başka geçiş ailesi yok.
- **Altın yanıp sönme = "şu an buradayız".**
- **Soluk kırmızı rota = geçmiş bölümler** (defter büyür).
- Kamera: haritada yavaş itme/kaydırma (log-zoom); dioramada kamera sabit, yalnızca 2x yakın plan kesmesi.
- Ambiyans hareketi her zaman dünyaya bağlı (martı, dalga, kedi kuyruğu); süs parçacığı yok.

## Ses

Kurallar ve katmanlar: [docs/ses-rehberi.md](../../docs/ses-rehberi.md). Motor `lib/ses.js`.

- **Anlatıcı:** tercihen insan sesi; TTS ise Charon dışı, sakin ve gerilimli anlatıcı (aday: Algenib, Gacrux,
  Sadaltager, Sulafat; seçim kullanıcıda). Tempo 1,0–1,05.
- **Ses imzası (sabit):** defter kaydında `kayit` damgası · harita ↔ durak geçişinde `gecis` piksel çözülmesi +
  dioramaya inişte yumuşak `darbe` · anlatı kutusunda 8-bit daktilo (`blip`/`blip2`).
- **Harita sesi:** rota çizilirken her adımda `adim`; durak ikonunun yanından geçerken `cinlama`; varışta `onay`.
- **Durak ortamı:** her durak kendi yatağı (liman `dalga` + `marti`, zindan damla + metal, çatı `ruzgar`,
  ateş başı `ates`); konuşurken kısılır.
- **Büyük an:** `yukselis` → 300–600 ms sessizlik → `darbe`. Gerilim anlarında `gerilim` ya da `kalp`.
- **Müzik (sonra):** kodla chiptune tema (ZzFXM ya da Web Audio), sezon başına bir tema.

## Yasaklar

- Kenar yumuşatmalı şekil (yazılar hariç), CSS gradyanı (Bayer kullan), yumuşak gölge, ışıma, bulanıklık.
- 3x dışında piksel boyu; piksel sprite'ı büyütmek ya da döndürmek (vektörde yap, yeniden pikselleştir).
- Modern sınır, modern bina, döneme ait olmayan eşya (bkz. PLAN.md §4).
- Belirli bir oyunun karakteri, arayüzü, paleti ya da sahnesinin kopyası. Genel piksel sanatı dilini
  kullanırız, bir oyunu taklit etmeyiz.
