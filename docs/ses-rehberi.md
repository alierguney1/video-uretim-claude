# Ses rehberi: efekt, ortam, seslendirme

*Kasım 2026. İki seri için de geçerli. Motor: [lib/ses.js](../lib/ses.js) · kütüphane: [ses/kutuphane/](../ses/kutuphane/)
(dinleme sayfası: `ses/kutuphane/index.html`).*

Video sessizken de anlaşılmalı (MOTION_RULES §4); ama sesi açık izleyen için ses, görüntünün
ağırlığını taşır. Kısa videoda kesmedeki whoosh, büyük andan önceki yükseliş ve vuruş çoğu zaman
müzikten daha çok iş görür. Ses tasarımı ayrı bir aşama değil, sahne listesinin parçası: brifte
**ses planı** tablosu olur, kodda `SOUNDS` listesi olur.

## 1. Katmanlar ve seviyeler (V)

| Katman | Ne | Seviye (seslendirmeye göre) | Örnek |
| --- | --- | --- | --- |
| Seslendirme | Anlatıcı | 0 dB (referans) | Gemini TTS ya da senin sesin |
| Vurgu | Büyük an, geçiş, kırılma | −6 … −10 dB | `darbe`, `yukselis`, `whoosh`, `gecis` |
| Olay | Ekranda bir şey olunca | −10 … −16 dB | `kapi-ac`, `para`, `adim-tas`, `zil` |
| Arayüz | Yazı, etiket, rota adımı | −16 … −22 dB | `blip`, `adim`, `tikla`, `kayit` |
| Yatak | Ortam, müzik, altlık | −20 … −26 dB; konuşurken 8 dB daha kısılır | `dalga`, `ruzgar`, `yagmur`, `gerilim` |

Yatak (`yatak: true`) seslendirme konuşurken otomatik kısılır: `SES.wav(SOUNDS, DUR, { konusma: [[başla, bitir], …] })`.
Bitmiş videoda hedef −14 LUFS, tepe ≤ −1 dBTP (render ölçer).

## 2. Kurallar

1. **Her görünür olayın bir sesi var.** Belirme, kayma, varış, sayı, kesme, geçiş. Sesi olmayan hareket
   "ucuz" hissettirir. Ama tersi de geçerli: **görüntüsü olmayan ses yok.**
2. **Aynı anda tek vurgu.** İki vurgu sesi çakışıyorsa biri gider; ses karmaşası görüntüdeki karmaşa kadar yorar.
3. **Büyük an üçlüsü:** `yukselis` (0,5–1 sn) → **300–600 ms sessizlik** (MOTION_RULES §3'teki durgunluk; yatak da susar)
   → `darbe` / cevap. Sessizlik bir efekttir; cevaptan önce kullan.
4. **Gerilim sesi bilgi taşır.** `gerilim` altlığı ya da `kalp` sadece izleyici tehlikeyi bildiğinde
   (dramatik ironi, saat). Süs olarak değil.
5. **Mekânın sesi.** Her durağın kendi ortamı var: liman = `dalga` + `marti`; hücre = damla, metal,
   uzaktan adım; çatı = `ruzgar`; ateş başı = `ates`. Geçişte ortamlar 0,5–0,8 sn çapraz geçer.
6. **Tekrar eden ses makineli tüfek olmasın.** Adım, daktilo gibi seslerde varyant (kütüphane adları birden
   çok dosya taşır, motor `t`'den seçer) ve küçük perde farkı (`hiz: 0.95–1.05`).
7. **Daktilo sesi seslendirmeyle yarışmaz.** Anlatı kutusu seslendirmeyle birlikteyse daktilo çok kısık
   (`gain ≤ .2`) ya da hiç yok; seslendirmesiz yazıda normal.
8. **Whoosh her kesmede değil**, sadece anlamlı geçişte (ölçek değişimi, harita ↔ durak). Her yerde whoosh
   şablon gibi durur (MOTION_RULES §5).
9. **Döngü sesi de bağlar.** Son kare ilk kareye bağlanıyorsa yatak sonu başa uyar, son vurgu ilk karenin sesine akar.
10. **Seri imzası sabit, gerisi değişir.** Seyir Defteri: `kayit` damgası + `gecis` piksel çözülmesi + 8-bit daktilo.
    HYS: iki notalı `ping2`. İmza her bölümde aynı; diğer sesler bölümden bölüme değişir.

## 3. Kaynaklar ve lisans

**Kullandıklarımız (hepsi bu repoda, internet gerektirmez):**

| Kaynak | Ne | Lisans | Not |
| --- | --- | --- | --- |
| Kod sentezi (`lib/ses.js`) | yükseliş, darbe, whoosh, ping, kalp, martı, dalga, rüzgâr, yağmur, ateş, gerilim | Bizim ürettiğimiz ses | Content ID riski yok; deterministik |
| [ZzFX](https://github.com/KilledByAPixel/ZzFX) (Frank Force) | 8-bit efektler: blip, adım, seçim, para, damga, çözülme… | MIT (kod) | Rastgelelik kapatıldı; sesler koddan üretilir |
| [Kenney](https://kenney.nl) ses paketleri | RPG (kapı, kitap, para, bıçak), Impact (adım, metal, tahta, zil, cam), Interface (tık, seçim, onay), Digital (8-bit) | CC0 1.0 | Ticari kullanım serbest, atıf gerekmez; lisans dosyaları her klasörde |

**Kullanmadıklarımız ve neden:**

| Kaynak | Neden değil |
| --- | --- |
| Platformun trend sesleri / telifli müzik | Kendi render ettiğimiz MP4'te lisansı yok: susturma, Content ID, hukuki risk |
| Pixabay | Ücretsiz ve ticari kullanıma açık, ama kendi SSS'si bazı parçaların Content ID tetikleyebileceğini söylüyor |
| Freesound | Lisans ses başına değişir (CC0 / CC-BY atıf / CC-BY-NC ticari yasak); indirme OAuth ister. Gerekirse yalnızca CC0 süzgeciyle, tek tek |
| BBC Sound Effects | Kişisel/eğitim amaçlı lisans; ticari değil |
| Sonniss GDC paketleri | Ticari kullanım serbest, atıfsız (yapay zekâ eğitimi yasak); ama onlarca GB ve bu ortamdan indirilemiyor. Yerelde iyi bir ek kaynak |
| ElevenLabs SFX | Ücretli; yapay zekâ ses efekti için en temiz lisans. Kütüphanede olmayan özel bir ses gerekirse |

**Ajan becerileri:** `social-media-skills:ai-music-and-sound` ilkeleri (kesmede whoosh, doruğa yükseliş,
Content ID'ye dikkat) bu rehbere işlendi. GitHub'daki `sxhzju/sfx` ve `vibe-motion/sound` becerileri
Pixabay/Freesound/Mixkit'ten ses çekiyor; lisansları karışık ve bu ortamda o siteler erişilemez, kullanılmadı.

## 4. Kullanım

```js
// sayfada: <script src="…/ses/kutuphane/katalog.js"></script><script src="…/lib/ses.js"></script>
const SOUNDS = [
  { t: 0,    tur: 'dalga', dur: 12, gain: .25, yatak: true },     // ortam (konuşurken kısılır)
  { t: .04,  tur: 'zzfx', ad: 'kayit', gain: .8 },                // 8-bit ön ayar
  { t: 3.2,  tur: 'yukselis', dur: .6, gain: .3 },                 // kod sentezi
  { t: 3.8,  tur: 'darbe', gain: .5 },
  { t: 5.0,  tur: 'dosya', ad: 'kapi-ac', gain: .6, pan: -.3 },    // kütüphane (CC0)
  ...SES.dizi(6, 8, .08, i => ({ tur: 'dosya', ad: 'adim-tas', gain: .4, hiz: i % 2 ? .97 : 1.03 })),
];
window.__renderAudio = () => SES.wav(SOUNDS, DUR, { konusma: VO.lines.map(l => [l.start, l.end]) });
window.__sfx = SES.dosyalar(SOUNDS);                                // render FFmpeg ile ekler
// canlı önizleme: SES.oynat(audioContext, SOUNDS, baslangicSn, { kok: '../../' })
```

- **Ad bulmak:** `ses/kutuphane/index.html` aç, tıkla, dinle. Ad listesi `ses/kutuphane/katalog.json`.
- **Yeni ses eklemek:** dosyayı (lisansıyla) `ses/kutuphane/<paket>/` altına koy, `tools/ses-katalog.mjs`
  içindeki `PAKETLER`/`ADLAR`'a yaz, `npm run sesler`. Lisansı belirsiz dosya eklenmez.
- **Render:** `npm run render -- <dosya> --audio ses/<ad>/voice.wav`. Sentez + kütüphane + seslendirme
  karışır, −14 LUFS'a çekilir. `--no-sfx` kütüphane seslerini atlar.
- **Kontrol:** Sesi duymadan da bakılabilir:
  `ffmpeg -i out/<ad>/<ad>.mp4 -filter_complex "[0:a]showspectrumpic=s=1400x300" -frames:v 1 spektrum.png`
  Olaylar doğru saniyede mi, sessizlik var mı, bir ses ötekini bastırıyor mu.

## 5. Brifteki ses planı

Sahne listesinin yanına bir tablo: `saniye · görsel olay · ses · katman`. Büyük anların üçlüsü
(yükseliş → sessizlik → vuruş), her durağın ortamı ve seri imzası bu tabloda görünür. Onaydan sonra
tablo aynen `SOUNDS` olur.
