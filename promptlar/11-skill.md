# Beğenilen stili skill'e çevirme

**Nerede:** Animasyonun cilalandığı aynı sohbet, final sürümden sonra.

Prompt bir kerelik konuşmadır; skill bir ustanın el alışkanlığıdır. Bir kez kurulur, sonra
yeni sohbette tek cümle yeter: *"kagit-tarih skill'iyle İstanbul'un fethini 90 sn'de anlat."*

- **Her stile ayrı skill.** Her şeyi bilen tek dev skill hiçbirini iyi yapmaz.
- **Açıklama satırı hayati.** Claude skill'i ne zaman açacağına o satırdan karar verir.
  "Animasyon skill'i" değil, "Kâğıt dokulu, el çizimi tarih hikayesi animasyonları için" yaz.

## Prompt

```text
Bu animasyonun stilini ve üretim hattını yeniden kullanılabilir bir skill'e çevir.
Adı: [stil-adi]. Konum: .claude/skills/[stil-adi]/

- SKILL.md: kısa. Açıklama satırı NE ZAMAN kullanılacağını söylesin. İstenecek girdiler:
  konu, süre, format, platform, seslendirme var mı. İş akışı: CLAUDE.md'deki 7 adım.
- STYLE.md: palet (hex), yazı tipleri, doku, ışık, kompozisyon, karakter kartı yapısı, yasaklar.
- MOTION.md: hareket dili, işe göre easing tablosu, geçiş aileleri, ritim, durgunluk süreleri.
- template.html: repodaki template.html'in bu stile uyarlanmış hali (sözleşme bloğu aynen kalsın).
- examples/: bu animasyonun final kodu.

Bu sohbette yaptığımız düzeltmelerden çıkan dersleri kurallara ekle.
Stilin değişmez kısımlarını (palet, font) ve her videoda DEĞİŞMESİ gerekenleri
(kanca türü, yapı, vurgu anı) ayrı listele: aynı skill'den çıkan videolar şablon gibi durmasın.
```

`.claude/skills/` altına konan skill bu repoda Claude Code tarafından otomatik bulunur.
Claude uygulamasında kullanmak için klasörü zip'leyip skill bölümünden yükle.
