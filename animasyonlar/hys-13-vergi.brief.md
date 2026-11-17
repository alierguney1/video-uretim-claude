# hys-13-vergi — brif

Seri: Harita Yalan Söyler · Bölüm 13 · Ali (17 Kas 2026): "Vergi nereden toplanıp nerede harcanıyor bunu yap.
Farklı şeyler koy ama haritadan çok uzaklaşma; kamera hareketleri hafif." STYLE.md "Konu ve görsel dil kuralları" ilk uygulaması.

Durum: **sahne listesi onaylandı** (Ali, 17 Kas: "Tamamdır, üret"). Kod + check + kontak tamam; **seslendirme bekliyor**
(Gemini TTS kredisi bitti, HTTP 402). VO bloğu şu an karakter sayısından tahmini taslak süre.

**Güncelleme: video 2025 verisini kullanır** (aynı kaynak, Temmuz 2026'da yayımlanan yıl sonu dosyası; `veri/hys-13/vergi-2025.js`):
toplam vergi 11,05 trilyon TL · İstanbul **%50,8** (5,61 trilyon) > diğer 80 il toplamı (5,37) · ilk 5 il %81,1 · 72/81 il ·
Hakkari 1 TL vergiye 16,0 TL · İstanbul 100 TL vergiye 11 TL · merkez gideri %60,3. Aşağıdaki tablo 2024 için ilk analizdir.

## Veri (resmî, tek kaynak)

**Hazine ve Maliye Bakanlığı, Muhasebat GM — "İller İtibarıyla Merkezi Yönetim Bütçe İstatistikleri", 2024, Aralık (yıl sonu kümülatif).**
Dosyalar: `2024-Genel-Butce-Kumulatif-Vergi-Gelirleri-TahTahs.xls` (vergi tahsilatı), `2024-Merkezi-Yonetim-Kumulatif-Butce-Giderleri.xls`
(gider). Ayrıştırma: `tools/hys-13-vergi.py` → `veri/hys-13/vergi-2024.json` (bin TL). Ekrandaki her oran bu dosyadan kodda hesaplanır.

| Bulgu | Değer | Hesap |
| --- | --- | --- |
| Toplam vergi tahsilatı | 7,31 trilyon TL | "Toplam" satırı |
| İstanbul'un payı | **%48,8** | 3,57 / 7,31 |
| İstanbul vs diğer 80 il | 3,57 vs 3,69 trilyon | ≈ eşit (İstanbul en küçük 79 ilin toplamından fazla) |
| İlk 5 il (İst, Ank, Kocaeli, İzmir, Bursa) | **%81,7** | |
| Harcaması vergisinden fazla olan il | **72 / 81** | il satırı gider > vergi tahsilatı |
| Vergisi harcamasından fazla 9 il | İstanbul, Kocaeli, İzmir, Ankara, Bursa, Tekirdağ, Yalova, Antalya, Mersin | |
| En yüksek oran | Hakkari: 1 TL vergiye **19,6 TL** harcama | 34,5 / 1,76 milyar |
| İstanbul oranı | 100 TL vergiye 13 TL il harcaması | 451,7 / 3.567,9 milyar |
| **Hiçbir ile yazılmayan harcama** | **%60** (faiz, transferler, merkez) | "Merkez" satırı / Toplam |

**Dürüstlük kuralları (zorunlu, ekranda ya da seste):**
1. Vergi, mükellefin **kayıtlı olduğu ilde** sayılır. Merkezi İstanbul'daki bir şirket Anadolu'daki satışının vergisini de İstanbul'da öder.
   → Ekranda dipnot + seste tek cümle ("kayıtlı olduğu ilde sayılıyor").
2. Harcamanın %60'ı hiçbir ile yazılmıyor; il karşılaştırması kalan %40 üzerinden. → Seste söylenir, ekranda halka grafik.
3. Yorum yok: "yük", "sömürü", "beleşçi", doğu/batı ayrımı yok. Bölgesel dengeleme bir bütçenin olağan işi; videoda "neden"
   hakkında iddia kurulmaz, sadece akış gösterilir.

## Normal insan testi (viral-analiz §4a)

1. Önceden fikri var mı? **Evet:** "İstanbul Türkiye'yi taşıyor", "vergimiz nereye gidiyor" herkesin ağzında.
2. Kendisi sorar mı? **Evet:** "Vergimiz nereye gidiyor?" en çok sorulan sorulardan.
3. Kime gönderir? **Memleketlisine:** "Bizim il verdiğinden fazla mı alıyor, bak" (81 il durdur-bul).

## Brif (15 parça)

1. **Rol:** bilgi tasarımcısı + animasyon yönetmeni (merak motoru).
2. **Hedef:** "Vergimin yarısı İstanbul'dan; 81 ilin 72'si topladığından fazla harcıyor; benim ilim ne durumda?"
3. **Format:** ~45 sn, 1080x1920, 60 fps, Charon TTS (tempo 1.12) + `lib/ses.js` katmanları.
4. **Sahne listesi:** aşağıda.
5. **Sanat yönü:** STYLE.md. Türkiye il haritası (`lib/iller.js`), kâğıt kara, **vergi = vurgu turuncu** (`#FF6B2C`),
   **harcama = soğuk mavi-yeşil** (`#3FB8AF`, yeni ikinci veri rengi; sadece bu bölümde "harcama" anlamında).
6. **Hareket dili:** (a) para **yukarı** = vergi (sütun yükselir), **aşağı/yayılma** = harcama (akış iller üzerine iner);
   (b) kamera her sahnede %3–8 yavaş itme, sahne değişiminde bir sonraki nesneye kayar (kesme yok);
   (c) haritadan çıkan her grafik haritaya geri döner.
7. **Yasaklar:** MOTION_RULES.md + yukarıdaki dürüstlük kuralları. Parti, hükümet, kişi adı yok. Yıl her zaman "2024".
8. **Kanca türü:** **sayı şoku + ters köşe.** (Son üçü: 10 gizem, 11 itiraf, 12 yanlış inanış. Sayı şoku en son 09'da.)
9. **Ara ödüller:** ~1 sn İstanbul sütunu ekranı deler · ~6 sn terazi: İstanbul = diğer 80 il · ~11 sn 100 kare, 82'si turuncu ·
   ~19 sn harita renk değiştirir, sayaç 0→72 · ~25 sn Hakkari 1 vs 19,6 · ~31 sn %60 halkası "kimseye yazılmıyor" · ~37 sn 81 il tablosu.
10. **Gönderilme sebebi:** Memleketlisine "bizim il verdiğinden ~kat fazla alıyor" ya da İstanbullu arkadaşına "verginin yarısını biz ödüyoruz".
11. **Farklılık:** Seride ilk ekonomi konusu, ilk **3B sütun**, ilk **terazi**, ilk **kare (waffle) grafik**, ilk ikinci veri rengi.
12. **Yayın paketi:** aşağıda.
13. **Hikâye omurgası:** İstek: vergimin nereye gittiğini bilmek · Engel: harcamanın çoğu ile yazılmıyor · Bedel: basit cevap yok, ama ilin kendi oranı var.
    Orta nokta kırılması: "Peki nerede harcanıyor?" sonrası 72/81. Tuhaf detay: Kocaeli verginin %10'unu ödüyor ama harcamadaki payı %2 (kaynak: aynı tablo).
14. **Döngü haritası:** aşağıda.
15. **Ses planı:** sütun yükselişinde `rise`, terazi dengeye gelince `pulse` + `chime`, karelerde hızlı `pop` dizisi, 72 sayacında tık,
    Hakkari'de büyük an üçlüsü (yükseliş → 0,3 sn sessizlik → `sub` vuruş), tabloda yumuşak drone.

## Sahne listesi (onay için)

| # | Süre | Ses (taslak) | Görüntü | Kamera | Geçiş nesnesi |
| --- | --- | --- | --- | --- | --- |
| 1 | 0–4 | "Türkiye'de toplanan verginin NEREDEYSE YARISI, tek bir ilden geliyor." | Türkiye il haritası hafif eğik (2,5B). Her ilden vergiyle orantılı **3B sütun** yükselir; İstanbul'unki ekranın tepesini deler. | Hafif yukarı kayma, sütunu takip | İstanbul sütunu |
| 2 | 4–9 | "İstanbul. 2024'te tek başına, neredeyse diğer seksen ilin TOPLAMI kadar vergi ödedi." | Sütunlar **teraziye** akar: sol kefe İstanbul 3,57 · sağ kefe 80 il 3,69 trilyon. Terazi sallanıp neredeyse dengede durur. Harita arkada %40. | Yavaş itme | Terazi kefeleri |
| 3 | 9–14 | "İlk beş ili ekle: verginin yüzde seksen ikisi." | Kefeler **100 kareye** dağılır; 82'si turuncu, 5 il adı yanında. Dipnot: "Vergi, mükellefin kayıtlı olduğu ilde sayılır." | Sabit + %3 itme | Kareler haritaya iner |
| 4 | 14–18 | "Peki bu para nerede HARCANIYOR?" | Kareler haritaya yağar, harita düz plana döner, **mavi-yeşil** harcama akışı Ankara'dan illere yayılır (oklar). | Geri çekilme, tüm Türkiye | Akış okları |
| 5 | 18–24 | "81 ilin 72'si, topladığı vergiden FAZLA harcama alıyor." | İller tek tek mavi-yeşile döner, sayaç 0→72. 9 il turuncu kalır, adları belirir. | Batıdan doğuya kayma | Hakkari |
| 6 | 24–30 | "En uçta Hakkari: bir liralık vergiye, yaklaşık yirmi lira harcama." | Hakkari'ye yakınlaşma; ilin içinden iki çubuk: 1 (turuncu) vs 19,6 (mavi-yeşil) ekranın üstüne uzar. | İtme + hafif yükselme | Çubuklar halkaya kıvrılır |
| 7 | 30–35 | "Ama dikkat: harcamanın yüzde altmışı faiz ve transferler gibi, hiçbir ile yazılmıyor." | **Halka grafik** %60 gri "Merkez" / %40 iller. İstanbul notu: il harcamasında 100 TL vergiye 13 TL. | Sabit, hafif itme | Halka → tablo |
| 8 | 35–43 | "Senin ilin verdiğinden fazla mı alıyor? Durdur, bul." | **81 il durdur-bul tablosu** (3×27): il · "1 TL vergiye X TL harcama", 9 il turuncu. Altında kaynak. | Sabit | Tablo çözülür |
| 9 | 43–45 | (sessiz döngü) | Harita + yükselen İstanbul sütunu = ilk kare | Kayma geri | — |

Harita ekranda: sahne 1, 2 (arka), 4, 5, 6, 9 → süre olarak ~%60 (kural ≥ %50 ✓).

## Merak haritası

| Soru | Açılış | Kapanış |
| --- | --- | --- |
| Hangi il? | 0,5 sn | 4 sn (İstanbul) |
| Ne kadar büyük? | 4 sn | 9 sn (terazi) |
| Para nerede harcanıyor? | 14 sn | 24 sn (72/81) |
| En uç kim? | 18 sn | 25 sn (Hakkari) |
| Peki benim ilim? | 35 sn | izleyici durdurunca |

- **Ters köşe:** "Verginin yarısı İstanbul'dan" → ama harcamanın %60'ı hiçbir ile yazılmıyor (sahne 7).
- **Cliffhanger/döngü:** son kare = ilk kare (İstanbul sütunu). Sabit yorum: "Senin ilin kaç kat aldı? 👇"

## Yayın paketi (taslak)

- **Kapak:** "VERGİNİN *YARISI* TEK İLDEN" + yükselen İstanbul sütunu (diğer 2 varyant: terazi "İSTANBUL = 80 İL", "81 İLİN *72*'Sİ").
- **Başlık:** Vergimizin yarısı tek bir ilden geliyor 😳 Peki nerede harcanıyor? #vergi #harita
- **Açıklama:** HMB Muhasebat 2024 il bazlı bütçe verisi; dipnotlar (kayıt ili, %60 merkez).
- **Etiketler:** vergi, bütçe, istanbul, harita, türkiye
- **AI etiketi:** aç (sentetik seslendirme).
