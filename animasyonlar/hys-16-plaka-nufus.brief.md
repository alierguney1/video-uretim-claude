# hys-16-plaka-nufus — brif

Seri: Harita Yalan Söyler · Bölüm 16 · Fikir havuzu (docs/fikirler.md §00, sıra 1).
Ali (24 Kas): "1. fikri yap. Viral videos skill kullan, direkt videoyu üret." → Sahne listesi onayı ve süzgeç onayı
bu bölüm için atlandı (kullanıcı isteği); süzgeç turu kod öncesine alındı, rapor `hys-16-plaka-nufus.suzgec.md`.

Numara notu: 21 Kas'ta yayınlanan "plakalar bugünkü adların alfabe sırasıyla" reel'inin dosyaları repoda yok;
o bölüm hys-15 sayıldı, bu bölüm 16.

**Tek cümle:** Plakaları nüfus sırasıyla (en kalabalık 01, en az nüfuslu 81) dağıtınca **81 ilin hiçbiri plakasını
koruyamıyor**; Adana 01'i kaybedip Antalya'nın 07'sini alıyor, Konya Ankara'nın 06'sını, Şanlıurfa Artvin'in 08'ini.

## Veri ve doğrulama (ekrana çıkan her sayı buradan)

Hesap: `tools/hys-16-plaka-nufus.mjs` → `veri/hys-16/plaka-nufus.json` (+ çizim için `plaka-nufus.js`).
Girdi: `veri/hys-16/nufus-2025.json` — TÜİK ADNKS 2025 (31.12.2025). TÜİK veri portalı otomatik isteklere kapalı
olduğu için iki ikincil kopyadan alındı (Vikipedi "Türkiye'nin illeri" Nüfus (2025) sütunu ve nufusu.com/iller);
**81 ilin 81'inde birebir aynı**, toplam 86.092.168.

| Bulgu | Değer |
| --- | --- |
| Plakasını koruyan il (nüfus kuralı) | **0** |
| Plakasını koruyan il (alfabe kuralı, önceki bölüm) | 4 (Adana, Adıyaman, Afyonkarahisar, Ağrı) — kodda yeniden hesaplandı |
| İstanbul | 34 → **01** (15.754.053) |
| Ankara | 06 → **02** |
| Konya | 42 → **06** (Ankara'nın eski plakası) |
| Adana | 01 → **07** (Antalya'nın eski plakası) · Antalya 07 → 05 |
| Şanlıurfa | 63 → **08**, **55 basamak** (en çok yükselen) |
| Artvin | 08 → **76**, 68 basamak (en çok düşen) — 08'i Şanlıurfa alıyor |
| Son plaka 81 | Bayburt (82.836) · Düzce 81 → 48 |

Dürüstlük notu (dipnot + açıklama): düşünce deneyi; plakalar 1960'larda il adlarının alfabe sırasıyla verildi, sonradan
kurulan iller (68–81) sona eklendi. Nüfus 2025 ADNKS; sıra yıldan yıla değişebilir.

## Normal insan testi (viral-analiz §4a)

1. Önceden fikri var mı? **Evet.** Herkes kendi plakasını ve "01 Adana, 06 Ankara, 34 İstanbul"u bilir.
2. Kendisi sorar mı? **Evet.** "Plakalar neye göre verildi, neden İstanbul 34?" klasik soru; önceki bölüm 756 yorum aldı.
3. Kime gönderir? **Adanalı** arkadaşına ("01 gitti"), **Konyalı ↔ Ankaralı** ("06 artık bizim"), **Urfalı ↔ Artvinli**
   ("08'inizi aldık"), herkes yorumda "eski → yeni" plakasını yazar.

## Brif (15 parça)

1. **Rol:** animasyon yönetmeni + bilgi tasarımcısı (merak motoru).
2. **Hedef:** "Plakalar nüfusa göre verilseydi 81 ilin hiçbiri plakasını koruyamazdı; Adana 01'i kaybederdi."
3. **Format:** ~41 sn, 1080x1920, 60 fps, Charon TTS (tempo 1.12) + motor ses katmanları.
4. **Sahne listesi:** aşağıda.
5. **Sanat yönü:** STYLE.md. İl haritası kâğıt; **plaka = serinin yeni nesnesi**: beyaz plaka, sol mavi şerit "TR",
   Plex Mono rakam. Eski plaka kâğıt/gri, yeni (gerçek hesap) plaka **turuncu rakam**. Nüfus = il dolgusunun koyuluğu.
6. **Hareket dili:** (a) **plaka rakamı yuvarlanır** (slot / flap gibi dikey kayma) eski → yeni; (b) 81 il merkezindeki
   küçük plaka rakamları nüfus sırasıyla dalga hâlinde turuncuya döner (kuralın görsel kanıtı); (c) **plaka el değiştirir:**
   08 Artvin'den kopup yay çizerek Şanlıurfa'ya uçar; (d) kamera yavaş itme/kayma, kesme yok.
7. **Yasaklar:** MOTION_RULES + "plakalar değişmeli" gibi öneri yok; nüfus üzerinden il kıyaslaması yorumsuz.
8. **Kanca türü:** **kayıp (sahiplik kaybı) + sayı şoku finali.** (Son üçü: 13 sayı şoku, 14 yanlış inanış + ya…olursa,
   15 alfabe plaka ya…olursa.) Açılış kalıbı 14'ün "X artık Y değil"inden farklı: özne + kayıp fiili.
9. **Ara ödüller:** ~1 sn 01 plakası Adana'dan kopar · ~4 sn 81 rakam dalga hâlinde döner · ~7 sn "81: Bayburt" ·
   ~9 sn İstanbul 34→01 · ~13 sn Ankara 06→02 · ~15 sn KONYA 06 (ters köşe 1) · ~19 sn Adana 07 = Antalya'nın plakası ·
   ~23 sn Urfa sayacı 63→08, "55 basamak" · ~27 sn 08 Artvin'den Urfa'ya uçar, Artvin 76 · ~33 sn alfabe 4 / nüfus "?" ·
   ~34 sn **0** (81 plaka birden döner) · ~36 sn 81 il tablosu.
10. **Gönderilme sebebi:** Adanalıya "01 gitti, 07'siniz"; Konyalı Ankaralıya "06 artık bizim"; Urfalı Artvinliye "08'inizi aldık".
11. **Farklılık:** Seride ilk plaka nesnesi + rakam yuvarlanması, ilk "nesne el değiştirir" (plaka uçar), ilk nüfus koyuluğu
    haritası. 14'ün Voronoi daireleri ve sıralama yarışı yok.
12. **Yayın paketi:** aşağıda.
13. **Hikâye omurgası:** İstek: her ile hakkı olan plakayı vermek · Engel: kural adil ama herkes kaybediyor, başkent bile 01 değil ·
    Bedel: Artvin 68 basamak düşüyor. Orta nokta kırılması: "asıl sürpriz 06'da" → Konya. Tuhaf detay: en çok yükselen il
    tam olarak en çok düşen ilin plakasını alıyor (hesaptan).
14. **Döngü haritası:** `window.__beats` (aşağıdaki merak haritası).
15. **Ses planı:** her plaka dönüşünde tık dizisi (slot) + `pop`; dalga boyunca artan tık; Konya öncesi 0,35 sn durgunluk →
    `sub` + `ping`; Urfa sayacında tık dizisi + `rise`; plaka uçarken `whoosh` + `chime`; "hiçbiri" öncesi durgunluk → `sub` + `ping2`;
    tabloda tık dizisi; döngüde `whoosh`.

## Sahne listesi

| # | Süre | Ses | Görüntü | Kamera | Geçiş nesnesi |
| --- | --- | --- | --- | --- | --- |
| 1 | 0–2 | "Adana, 01'i KAYBEDİYOR." | Adana turuncu; üstte büyük plaka **01 · ADANA**; 0,8 sn'de 01 çizilir, rakam yuvarlanıp "?" olur. Ekran: "ADANA 01'İ KAYBEDİYOR" | Adana'ya itme | Plaka |
| 2 | 2–8 | "Kural: plakaları NÜFUSA göre dağıttım. En kalabalık il 01, en az nüfuslu 81." | Türkiye; iller nüfusa göre koyulaşır; 81 il merkezinde eski plaka rakamı, nüfus sırasıyla turuncu yeni rakama döner. Köşede "81 · Bayburt" | Geri çekilme | Rakam dalgası |
| 3 | 8–12 | "01 tabii İSTANBUL. Ama asıl sürpriz 06'da." | İstanbul plakası 34→01; "06 = ?" | İstanbul'a kayma | 06 rozeti |
| 4 | 12–17 | "Ankara 02'ye düşüyor. 06'yı alan il ise… KONYA." | Ankara 06→02; 0,35 sn durgunluk; Konya 42→06 pop | İç Anadolu | Konya plakası |
| 5 | 17–21 | "Adana mı? 07. Yani Antalya'nın plakası." | Adana 01→07; Antalya 07→05 (küçük) | Akdeniz | Antalya |
| 6 | 21–25 | "En büyük sıçrama Şanlıurfa'nın: 63'ten 08'e, ELLİ BEŞ basamak." | Urfa plakası sayaç gibi 63→08 yuvarlanır; "+55" pill | Güneydoğu | 08 |
| 7 | 25–30 | "08 kimin plakasıydı? Artvin'in. Artvin ise 76'ya düşüyor." | 08 Artvin'den kopar, yay çizerek Urfa'ya uçar; Artvin 08→76, "−68" | Doğuya geri çekilme | 81 plaka |
| 8 | 30–34 | "Alfabeyle dört il plakasını korumuştu. Nüfusla kaç il koruyor?" | 81 küçük plaka ızgarası (9×9); "alfabe: 4" pill; "nüfus: ?" | Sabit, itme | Izgara |
| 9 | 34–36 | "HİÇBİRİ." | Izgaradaki 81 plaka aynı anda döner; dev **0** | — | Tablo |
| 10 | 36–41 | "Senin plakan kaç oldu? Durdur, bul." | **81 il durdur-bul** (3×27, alfabetik): il · eski → yeni; turuncu = yükselen. Dipnot: TÜİK ADNKS 2025 | Yavaş itme | Harita |
| 11 | 41–42 | (sessiz döngü) | Adana + 01 plakası = ilk kare | Geri | — |

Harita ekranda: sahne 1–7, 11 → ~%70 (≥ %50 ✓). Haritaya ek görseller: plaka nesnesi + rakam yuvarlanması, uçan plaka,
81 plaka ızgarası, tablo (STYLE §3 ✓).

## Merak haritası

| Döngü | Açılış | Soru | Kapanış |
| --- | --- | --- | --- |
| A | 0,3 | Adana 01'i kime, neden kaybediyor? Kaç oluyor? | 17–19 (07, Antalya'nın) |
| B | 2 | Hangi kural? Herkesin plakası ne oluyor? | 8 (dalga) |
| C | 10 | 06'yı kim alıyor? (asıl sürpriz) | 15 (Konya) |
| D | 21 | En çok kim yükseliyor? 08 kimin? | 27 (Artvin) |
| E | 30 | Kaç il plakasını koruyor? | 34 (hiçbiri) |
| F | 36 | Benim plakam kaç oldu? | izleyici durdurunca / yorum |

- **Ters köşe:** 06 Ankara'nın değil Konya'nın; en büyük kazanan en büyük kaybedenin plakasını alıyor; alfabe 4 → nüfus 0.
- **Gerilim:** Konya öncesi ve "hiçbiri" öncesi durgunluk.
- **Cliffhanger/döngü:** son kare = ilk kare (Adana 01). Sabit yorum: "Senin plakan kaç oldu? Eski → yeni yaz 👇"

## Yayın paketi

- **Kapak** (3 varyant, `hys-16-plaka-nufus.kapak.json`): kayıp "ADANA *01*'İ KAYBETTİ" · sayı şoku "81 İL, *0* KORUYAN" ·
  ters köşe "*06* ARTIK KONYA'NIN".
- **Başlık:** Plakalar nüfusa göre verilseydi 😳 Adana 01'i kaybeder, Konya 06 olur #plaka #harita
- **Açıklama:** kural + bulgular + dürüstlük notu + kaynak (TÜİK ADNKS 2025).
- **Etiketler:** plaka, harita, türkiye, nüfus, adana, konya, şanlıurfa, artvin
- **AI etiketi:** açık (sentetik seslendirme).
