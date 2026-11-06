# Brif: 7 parça + farklılık satırı

Her yeni animasyonda önce brif yazılır ve `animasyonlar/<ad>.brief.md` olarak kaydedilir.
Kısa prompt sürpriz üretir, uzun prompt kontrol üretir. Keşif aşamasında kısa yaz,
ne istediğini bulunca uzun yaz.

1. **Rol:** Hangi gözle bakılacak (motion designer, bilgi tasarımcısı, animasyon yönetmeni).
2. **Tek cümlelik hedef:** İzleyici videodan çıkınca neyi hatırlayacak?
3. **Format:** Süre, en-boy (1080x1920 / 1920x1080), fps, ses (yok / sentez / dosya).
4. **Sahne listesi:** Efekt listesi değil, fikir sırası. Her sahnenin tek işi var.
5. **Sanat yönü:** Arka plan, palet + tek vurgu rengi, en fazla 2 yazı tipi, doku.
6. **Hareket dili:** Hareketin anlamı, sabit kurallar (ör. sağa = ilerleme, büyüme = önem).
7. **Yasaklar:** MOTION_RULES.md + bu işe özel olanlar.
8. **Farklılık (bu repoya özel):** Bu videoyu son 5 videodan ayıran şey: kanca türü, yapı, palet, ses.

## Tam iskelet

```text
Rolün: [kıdemli motion designer / bilgi tasarımcısı / animasyon yönetmeni].

HEDEF: İzleyici videodan çıktığında şunu hatırlamalı: [tek cümle].
FORMAT: [süre] sn, [1080x1920 / 1920x1080], [30/60] fps, ses: [yok / sentez / dosya ekli].
PLATFORM: [Shorts / Reels / TikTok / YouTube yatay].

SAHNELER:
0–[x] sn: [kanca: ilk kare kapak, 0. saniyede hareket]
[x]–[y] sn: [sorun / soru]
[y]–[z] sn: [dönüşüm / açıklama]
[z]–son: [sonuç; dikeyse son kare ilk kareye bağlansın]

SANAT YÖNÜ: [arka plan], [palet + tek vurgu rengi], [yazı tipi], [doku], referans: [varsa].
HAREKET DİLİ: [3 kural, her sahnede tutarlı].
YASAKLAR: MOTION_RULES.md + [bu işe özel].
FARKLILIK: [son videolardan farkı].

Önce kod yazma. Sahne listesini, her sahnenin süresini ve sahneler arası geçişin
hangi nesne üzerinden olacağını göster. Onayımdan sonra kodla.
```

## Kısa yol: brifi Claude doldursun

```text
Konu: [bir cümle]
İzleyici videodan çıkınca şunu hatırlasın: [bir cümle]
Platform: [Shorts / Reels / TikTok / yatay]

Brifi sen doldur (8 parça). Kararlarını tek satırla gerekçelendir.
animasyonlar/ klasöründeki son brifleri oku ve farklılık satırını ona göre yaz.
Kod yazma; brifi göster, ben düzelteyim, onaydan sonra kodla.
```

> Konuyu ve fikri mümkünse sen bul. Aynı soruyu soran herkes benzer fikir alır;
> özgünlük (ve algoritmanın "özgün içerik" sinyali) senden gelir.

## İki altın kural

- **Kodu hemen isteme.** Önce sahne listesini onayla.
- **Düzeltmeyi kare ile ver.** "Logoyu 12 kare geciktir."
