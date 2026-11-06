# Dikey video (Shorts / Reels / TikTok)

Dikey işlerde brife ek olarak bu kurallar geçerlidir. Gerekçeleri:
[docs/platform-notlari.md](../docs/platform-notlari.md).

## Kurallar

- **Ses kapalıyken anlaşılmalı.** Ana fikir ekrandaki yazıda olsun.
- **İlk kare kapaktır.** Tek başına durduğunda bile soruyu ya da şoku taşısın. 0. saniyede hareket
  olsun (`check` ilk 0.3 sn durağansa uyarır). Logo açılışı, yavaş fade-in yok.
- **Güvenli alan:** üst %12, alt %20, sağ %12 boş (kontak sayfasında kırmızı görünür).
- **Yazı boyu:** en az ekran genişliğinin %7'si (1080 px'te 75 px). Sayılar tabular (`textTab`).
- **Her an tek fikir.** Aynı anda en fazla bir cümle.
- **Döngü:** Son kare ilk kareye bağlanır; izleyici fark etmeden tekrar izler.
- **Gönderilmeye değer:** Şaşırtıcı bir sayı, karşılaştırma ya da "bu tam sen" anı olsun.
- **Dürüstlük notu:** Abartı içeren bir şok varsa küçük bir gerçek notu ekle ("Gerçekte rekor 12 katlama").
  Yorumlarda güven kazandırır.

## Bu yapıya oturan konular

Sayı ya da ölçek şoku taşıyan her şey: üstel büyüme, birikimli faiz, mesafeler, olasılıklar,
"X'i Y'ye çevirirsen". Doğru kamera hareketi çoğu zaman **logaritmik geri çekilme**:
insan üstel büyümeyi sezemez, ölçek referansları (kitap → insan → bina → dağ → Ay) sırayla
belirdiğinde bir saniyede anlar.

## Prompt

```text
Rolün: dikey sosyal video için motion designer.

KONU: [sayı/ölçek şoku taşıyan bir soru]
HESAP: [formül]. Her adımda gerçek değeri kodda hesapla ve göster; birimler otomatik değişsin.
FORMAT: [20–35] sn, 1080x1920, 60 fps, Canvas 2D, template.html'den başla. Ses kapalıyken anlaşılmalı.

AKIŞ:
0–2 sn: büyük soru + nesne. İlk kare kapak olarak tek başına çalışmalı, 0. saniyede hareket.
2–[x] sn: sayaç + ölçek referansları sırayla. Büyük andan önce 400 ms durgunluk.
[x]–[y] sn: sonuç rakamı büyük.
[y]–son: küçük dürüstlük notu; son kare ilk kareye bağlanır.

KURALLAR: promptlar/07-dikey-video.md + MOTION_RULES.md.
Önce sahne listesini ve süreleri göster, onaydan sonra kodla.
```
