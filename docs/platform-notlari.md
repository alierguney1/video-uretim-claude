# Platform notları: AI ile üretilen hareketli videolar algoritmada nasıl performans gösterir?

*Araştırma tarihi: Kasım 2026. Platform kuralları sık değişir; bu notu kural koymadan önce güncelle.*

## Kısa cevap

"Hangi AI video stili en iyi performans gösteriyor" sorusuna güvenilir, kamuya açık bir veri
**yok**. Platformlar bunu yayınlamıyor. "AI videolar %58 daha fazla izlenme oranı alıyor",
"AI içeriğin erişimi %80 düşüyor" gibi rakamlar araç satan blog'lardan geliyor ve kaynaksız.

Platformların kendi açıklamalarından çıkan sonuç:
**Algoritma "AI" etiketini ödüllendirmez ya da cezalandırmaz; izleyicinin videoyla ne
yaptığını ödüllendirir ve seri üretilmiş görünen her şeyi cezalandırır.**

## Platform platform

| Platform | Ana sinyaller | AI ile ilgili risk |
| --- | --- | --- |
| Instagram Reels | İzlenme süresi, **erişim başına DM ile gönderme**, erişim başına beğeni (Mosseri'nin adını verdiği üç sinyal) | Nisan 2026'dan beri yalnızca yeniden paylaşım yapan hesaplar önerilerden çıkarılabiliyor. Mosseri'nin 2025 yıl sonu notu: 2026'da "ham, gerçek insan içeriği" önceliklendirilecek. Mayıs 2026'dan beri "AI Creator" hesap etiketi test ediliyor. |
| YouTube Shorts | Kaydırıp geçme / izlemeye devam etme, tamamlanma, tekrar izleme | Temmuz 2025'te "tekrarlayan içerik" politikası "inauthentic content" (özgün olmayan içerik) adını aldı. Hedefi *seri üretilmiş, şablon gibi* videolar; raporlara göre kanal düzeyinde değerlendiriliyor. AI kullanmak tek başına para kazanmaya engel değil. |
| TikTok | Tamamlanma, tekrar izleme, paylaşım, yorum | Yardım merkezine göre AI etiketini açmak dağıtımı düşürmüyor. Etiket *gerçekçi* sentetik insan/yer/olay için zorunlu. Özgün olmayan / kopya içerik Creator Rewards'tan para kazanamıyor. Temmuz 2026'dan beri AI spam hesaplarına yönelik tespit test ediliyor. |

## Bu repoya etkisi → MOTION_RULES.md bölüm 5

1. **İlk saniye her şeyi belirler.** Hareketin ortasından ya da sonuçla başla. Kod animasyonu burada
   avantajlı: ilk karedeki hareket, konuşan kafa görüntüsünden daha iyi kaydırmayı durdurur.
   → `check` ilk 0.3 sn durağansa uyarır.
2. **Tekrar izleme ve döngü.** Son kareyi ilk kareye bağla; tek izlemede yakalanamayacak kadar
   detay koy. Tekrar izlemeler tamamlanma oranını %100'ün üstüne çıkarır.
3. **Gönderilmeye değer olsun.** Instagram'da DM paylaşımı beğeniden ağır basar. Açıklayan,
   şaşırtıcı karşılaştırma yapan videolar gönderilir; anlamı olmayan güzel animasyon gönderilmez.
4. **Her videoyu farklılaştır (AI hatları için en büyük risk).** Aynı şablondan aynı ses, düzen ve
   ritimle 30 video çıkarmak tam olarak YouTube'un kanal düzeyindeki tespitinin ve Instagram'ın
   özgünlük sıralamasının yakalamak için kurulduğu şey. Sadece metni değil yapıyı, paleti, kanca
   türünü ve sesi değiştir. → brifteki zorunlu "farklılık" satırı.
5. **Bir yerde insan olsun.** Gerçek bir seslendirme, gerçek bir görüş, konuyu kendi alanından
   seçmek. Görseller tamamen kodla üretilse bile.
6. **Etiket.** Motion graphics ve kinetik tipografi genelde "gerçekçi sentetik içerik" sayılmaz
   (bunu doğrudan söyleyen bir kaynak bulamadım). Gerçekçi AI görüntüsü kullanırsan etiketle.

## Kendi verini üret

Gerçek cevap sadece kendi analizlerinde var. Aynı fikri **üç farklı kancayla** yayınla
(hızlı hareketle açılış / ekranda bir sayı / yazılı soru) ve karşılaştır:

- Shorts: kaydırıp geçme oranı (swipe-away) ve 3 sn tutma
- TikTok: ortalama izlenme yüzdesi
- Instagram: erişim başına gönderme

10–15 paylaşımda kendi kitlen için hangi hareket stilinin işe yaradığını görürsün.
Şablondaki `SCENES` / kanca kısmını değiştirmek bunun için yeterli.

## Kaynaklar

- [Engadget: Instagram's algorithm overhaul will reward original content](https://www.engadget.com/instagrams-algorithm-overhaul-will-reward-original-content-and-penalize-aggregators-130018977.html)
- [Tubefilter: Instagram removes recommendations for repost aggregators (Nisan 2026)](https://www.tubefilter.com/2026/04/30/instagram-removes-algorithm-recommendations-repost-content-aggregator/amp/)
- [eClincher: How the Instagram Algorithm Works in 2026](https://www.eclincher.com/articles/how-the-instagram-algorithm-works-in-2026)
- [AIR Media-Tech: YouTube Monetization Policy Changes 2026](https://air.io/en/monetization/youtube-monetization-policy-changes-2026-a-complete-dated-timeline)
- [ytgrowth.io: YouTube AI policy](https://ytgrowth.io/blog/youtube-ai-policy)
- [Cinerads: TikTok AI-Generated Content Policy 2026](https://www.cinerads.com/blog/tiktok-ai-content-policy)
- [Storrito: How to label AI content on TikTok without losing reach](https://storrito.com/resources/how-to-label-ai-content-on-tiktok-without-losing-reach/)
- [Kinovela: Short-form video retention benchmarks 2026](https://kinovela.com/insights/short-form-video-retention-benchmarks)
