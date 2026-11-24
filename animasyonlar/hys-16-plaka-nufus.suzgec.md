# hys-16-plaka-nufus — viral süzgeç raporu

Skill'ler: `viral-hooks` (hook-checklist, anti-patterns), `viral-short-form` (retention), `viral-captions-and-ctas` (bait-check).
Ali isteğiyle (24 Kas) süzgeç kod öncesine alındı ve onay beklenmeden uygulandı; ilk sürümün kontak sayfasından sonra
ikinci tur yapıldı. Aşağıda: bulgu → yapılan değişiklik.

## KANCA (0–2 sn) · 8/10

| Katman | İçerik | Kontrol |
| --- | --- | --- |
| Görsel | Adana turuncu, üstünde büyük plaka **01 · ADANA**; 0,75 sn'de rakam yuvarlanıp turuncu **?** olur, plaka çerçevelenir | Sessizde okunur ✓, ilk karede hareket ✓ |
| Sözel | "Adana, 01'i KAYBEDİYOR." (1,73 sn) | < 2 sn ✓, somut isim + sayı ✓, kayıp (stake) ✓ |
| Yazı | "Plakalar nüfusa göre olsaydı / ADANA 01'İ / KAYBEDİYOR" | 6 kelime ✓, sözeli keskinleştiriyor (koşulu ekliyor) ✓ |

- Vaat ↔ ödeme: Adana'nın yeni plakası 18,8 sn'de (07, Antalya'nın) veriliyor ✓. Bait-and-switch yok.
- Anti-pattern taraması: hoş geldin / logo / belirsiz merak / erken takip isteği yok ✓.
- **Düzeltme (ilk sürüm, kare 0):** "KAYBEDİYOR" ilk 0,65 sn gizliydi; duraklatılmış oynatıcıda kanca yarımdı → ilk karede tam.
  "??" çift soru işareti tek "?"e indi, plaka 420 → 520 px.
- 14'ün açılış kalıbı ("X artık Y değil") tekrar edilmedi.

**Alternatif kancalar** (kapak varyantları ve ileride A/B için):
1. *Sayı şoku:* "81 ilin hiçbiri plakasını koruyamadı." — Yazı: "81 İL · 0 KORUYAN"
2. *Ters köşe:* "06 artık Ankara'nın değil." — Görsel: 06 plakası Ankara'dan Konya'ya kayar. Yazı: "06 = KONYA"
3. *Çatışma:* "Şanlıurfa, Artvin'in plakasını aldı." — Görsel: 08 uçar. Yazı: "08: ARTVİN → URFA"

## RETENTION

| Sn | Risk | Çözüm (uygulandı) |
| --- | --- | --- |
| 2–7,5 | Kural açıklaması 5,4 sn (kurulum sarkması) | Kamera geri çekilirken 81 eski rakam nüfus sırasıyla turuncu yeni rakama döner (dalga); 01 İstanbul / 81 Bayburt hapları; harita ölçeği 18,5 → 20, rakam 21 → 24 px (okunurluk) |
| 18,8 | Ana soru (Adana kaç?) %41'de kapanıyor (`check` uyarısı) | **Kalıcı açık döngü:** 8,3 sn'den 37 sn'ye köşede "korunan plaka: ?" sayacı; cevap (HİÇBİRİ) sonda. Ayrıca C (06 kimin?) ve D (08 kimin?) döngüleri arka arkaya |
| 19,6–24,9 | 5,3 sn ödülsüz (ilk sürüm) | Antalya 07 → 05 yuvarlanması ve Urfa plakasının (63) girişi ödül olarak işaretlendi; en uzun ödülsüz aralık < 3,5 sn |
| 28,3 | "08 kimin?" ile "ARTVİN'İN" başlıkları üst üste (kare 1698) | Sıralı geçiş; Artvin plakası başlık bandının karartmasından çıksın diye kamera aşağı alındı |
| 31,5–36 | Izgara "duvar" gibi, rakamlar okunmuyor (kare 2070) | Plaka karoları: ince mavi şerit + 40 px rakam; güvenli alana sığdırıldı |
| 44,9 | Döngüde 0,7 sn'de hızlı zoom | Kamera tablo arkasında Adana'ya taşınıyor; son kare = ilk kare, hareket yok |

Ritim: her 2–4 sn'de yeni nesne (plaka, dalga, sayaç, uçan plaka, ızgara, tablo) ✓. Tepe noktaları: KONYA (16 sn), uçan 08 (28 sn), HİÇBİRİ (36,6 sn).

## YAZI / CTA

- Kinetik altyazı tüm cümlelerde; tablo cümlesinde (l11) kapalı, tablo okunabilsin diye.
- Kapanış: "Senin plakan kaç oldu? Durdur, bul." → içeriği soruyor, eylemi değil ✓; tek istek ✓; değer anından (81 il tablosu) sonra ✓.
- **Bait-check:** "yorum yap / beğen / takip et" yok → geçti.
- **Sabit yorum:** "Senin plakan kaç oldu? Eski → yeni yaz 👇 (benimki 16 → 04)" — 15. bölümde yorumların "16'dan 21'e" kalıbı birebir bu.
- **Açıklamanın ilk satırı:** "Plakalar nüfusa göre verilseydi 81 ilin hiçbiri plakasını koruyamazdı 😳"
- **Gönderme cümlesi (açıklamada, bait değil):** "Adanalı arkadaşına göster: 01 artık İstanbul'un."

## Çelişki / elenenler

- Skill önerisi "hook'ta kişisel otorite sinyali" → seri kimliğiyle uyuşmuyor (yüz yok), elendi.
- "Bir kelimeyle yorum yaz" CTA'sı → bait sınırında, elendi; durdur-bul + sabit yorum yeterli.
