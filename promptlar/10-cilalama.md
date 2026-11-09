# Cilalama döngüsü

**Nerede:** Animasyonun yapıldığı **aynı** sohbet, ilk sürüm beğenildikten sonra.

İlk sürüm taslaktır. Model yazarken sanatçı, okurken eleştirmen olmalı ama ikisini aynı anda
iyi yapamaz; kendi işini beğenmeye meyillidir. Bu yüzden rol açıkça değiştirilir.
En güçlü soru: **"Yapay zeka şablonu gibi duran anları listele."**

## Prompt

```text
Rolün değişiyor: sert bir motion tasarım direktörüsün. İlk sürümün final olmadığını varsay.

Henüz kodu değiştirme.
1. npm run contact ile kontak sayfası al (gerekirse --times ile geçiş ortalarını ekle), Read ile aç, incele.
2. 1–10 puanla: hikaye netliği, zamanlama/ritim, easing, tipografi, hiyerarşi, kompozisyon,
   geçiş sürekliliği, renk, okunabilirlik, KANCA (ilk 1 sn), DÖNGÜ (son→ilk kare),
   MERAK (her an açık bir soru var mı), BEDEL (izleyici kaybedilecek şeyi biliyor mu).
   Seslendirme satırlarına "ve sonra" testini uygula (docs/hikaye-rehberi.md §5): araya "ama" ya da
   "bu yüzden" konamayan her geçişi listele. Her sahne sınırında "izleyici burada neden kalsın?" diye sor.
3. Listele: yapay zeka şablonu gibi duran anlar, aceleye gelen anlar, ölü zaman
   (0.5 sn'den uzun hiçbir şeyin olmadığı anlar), ses kapalıyken anlaşılmayan anlar.
4. Her madde için saniye ve kare numarası ver.
5. Sırala: P0 (şart), P1 (büyük iyileştirme), P2 (cila).

Sonra P0 ve P1'i uygula, npm run check ve contact'ı tekrar çalıştır, aynı puanlamayı yap.
Tüm puanlar 8+ olana kadar devam et, en fazla 3 tur. Her tur sonunda kısa değişiklik listesi ver.
```

## Küçük düzeltmeler: kare dili

- "Logoyu 12 kare geciktir."
- "Son kareyi 30 kare uzat."
- "14. saniyedeki başlığı %20 büyüt, okunma süresini 1.5 sn'ye çıkar."

60 fps'te 60 kare = 1 sn, 30 fps'te 30 kare.

## Sık sorunlar → aynı sohbete yaz

| Sorun | Neden | Yaz |
| --- | --- | --- |
| Güzel ama bir şey anlatmıyor | Hedef cümlesi yok | "Tek cümlelik hedef şu: […]. Her sahneyi buna hizmet edecek şekilde düzenle." |
| Şablon gibi duruyor | Her geçiş farklı, nesneler kopuk | "2–3 geçiş ailesi seç, hep onları kullan. Her sahne öncekinde görünen bir nesneden doğsun." |
| Her şey zıplıyor | Varsayılan elastik easing | "Elastiği kaldır: arayüzde `spring`, kamerada `inOutCubic`, sadece tıkta `outBackSoft`." |
| Yazılar okunmuyor | Metin uzun, süre kısa | "Metinleri kısalt, her başlık en az 1.2 sn tam okunur kalsın." |
| Çok hızlı | Durgunluk yok | "Her büyük andan önce 400 ms durgunluk ekle." |
| Her render farklı | Tohumsuz rastgelelik / biriken durum | `npm run check` → determinizm satırına bak. |
| Ses görüntüden kayıyor | Ses saate bağlı değil | Sesleri `SOUNDS` listesine taşı; render WAV'ı aynı listeden üretir. |
| Ortada izleyici kaçıyor | Ana soru erken cevaplanmış ya da açık soru kalmamış | `check` döngü haritası uyarısına bak; cevabı sona taşı, araya yeni bir soru aç. |
| Hikâye düz akıyor | Olaylar "ve sonra" ile bağlı | "Her geçişi ama/bu yüzden ile yeniden yaz; bağlanamayanı çıkar." |
| Arayüz/veri uyduruyor | Gerçek varlık verilmemiş | "Sadece verdiğim bilgileri kullan. Uydurduğun her şeyi listele ve çıkar." |
| Türkçe harf bozuk / ilk karede farklı | Font alt kümesi geç yükleniyor | Fontu `CONFIG.fonts`'a ekle; `GLYPHS` ile yüklenir. |
| 3D karelerde siyah | Çizim tamponu korunmuyor | `preserveDrawingBuffer: true`. |
