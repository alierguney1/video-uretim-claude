# Viral analiz: yayınlanmamış 5 bölüm (16 Kasım 2026)

Yöntem: `viral-reverse-engineering` becerisi. Kaynak, Instagram'ın kendi verisi (vidIQ owner insights,
16 Kas 2026, 123 takipçi). Görüntüyü izlemedim; senaryo (`*.voice.json`), brif ve platform metrikleri
üzerinden çalıştım.

## 1. Veri: ne yayıldı?

| Bölüm | Konu | İzlenme | Paylaşım / 1000 | Kayıt / 1000 | İzlenme % | Atlama % |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| hys-10 Anamur | Türkiye'de Tunus'tan güneyde bir yer | 91.040 | **10,4** | 3,2 | 51,6 | 29,4 |
| hys-11 Kuzey | En kuzey Sinop değil, Kofçaz | 19.930 | **7,4** | 4,4 | 54,0 | 27,6 |
| hys-01 Kırşehir | Dünyanın merkezi mi? | 5.754 | 5,7 | 1,6 | 35,2 | **57,8** |
| hys-12 Batı | En batı Babakale değil | 28.680 | 3,8 | 2,8 | 47,5 | 30,5 |
| hys-09 Plaka | 81 il plaka sırasıyla | 3.833 | 3,7 | 5,5 | 45,8 | 35,8 |
| hys-02 Grönland | Mercator: Grönland kaç Türkiye? | 510 | 2,0 | 5,9 | 49,1 | 31,5 |
| hys-03 Rota | İstanbul–LA eğri rota | 3.724 | **0,8** | 1,1 | 48,2 | 33,3 |

**Ayıran şey izlenme süresi değil, paylaşım.** İzlenme oranı her videoda %45–54 (Kırşehir hariç).
Paylaşım oranı ise 13 kat değişiyor (0,8 → 10,4). Instagram'da erişimi büyüten ana sinyal paylaşım (DM).

## 2. Ayrıştırma: Anamur neden patladı?

| Katman | Anamur |
| --- | --- |
| Kanca (ilk cümle) | "Türkiye'de öyle bir yer var ki, Afrika'nın İKİ başkentinden daha güneyde." → **Türkiye'deki bir yer + herkesin bildiği yabancı bir yer + ters köşe konum** |
| İkinci açık döngü | "Üstelik oradan bakınca ufukta BAŞKA bir ülke görünüyor." |
| Duygu | Şaşkınlık + yerel gurur ("biz Tunus'tan güneydeyiz") |
| Paylaşım tetikleyici | **Kimlik:** "Anamurlu ya da Mersinli arkadaşına gönder"; "senin ilin hangi başkentle aynı hizada?" |
| Biçim | Harita + canlı sayaç + durdur-bul tablosu |

**Karşı-olgu testi (çıkarınca hâlâ yayılır mı?):**
- Harita/animasyon kalitesini çıkar: hys-03 Rota aynı kalitede, aynı izlenme oranında ama paylaşım 0,8. → **Görsel kalite sürücü değil.**
- Türkiye bağını çıkar: Rota ve Grönland'da Türkiye sadece başlangıç noktası; paylaşım 0,8–2. → **Türkiye'deki belirli bir yer = sürücü.**
- Ters köşeyi çıkar: Kırşehir Türkiye'de ama cevabı muğlak ("tek merkez yok"); atlama %57,8. → **Net, tek cümlelik bir şaşırtıcı iddia = sürücü.**

**Sürücüler (2 tane):** (1) Türkiye'deki tanıdık bir yeri, herkesin bildiği yabancı bir yerle şaşırtıcı biçimde karşılaştıran tek cümlelik iddia, ilk saniyede; (2) o yerin insanına gönderilecek kimlik tetikleyicisi.

## 3. Dürüstlük: ne kadar tekrarlanabilir?

- **Örneklem çok küçük:** 7 video, 123 takipçi. Bu bir hipotez, kanun değil.
- **Şans:** Anamur'un 91 bini tek bir paylaşım zincirinden de gelmiş olabilir. Kuzey (7,4/1k) aynı mekanizmayla ikinci kez işlediği için hipotez güçleniyor.
- **Karışan değişken:** V2 motoru (09'dan sonra) ile "Türkiye konusu" aynı döneme denk geliyor. Ama Rota ↔ Batı karşılaştırması kalite farkının paylaşımı açıklamadığını gösteriyor.
- **hys-09 Plaka henüz 1 günlük:** 3,7/1k erken ölçüm, karar verdirmez.
- **Yayılma garantisi yok.** Sadece oranları lehimize çeviriyoruz.

## 4. İlke

> **"[Türkiye'den tanıdık bir yer], [herkesin bildiği yabancı bir yer]den daha [ters yönde]."**
> İlk saniyede iddia, sonunda "o yerin insanına gönder".

## 5. Beş bölüm: puan ve iyileştirme

Puanlar (1–10): kanca gücü · Türkiye bağı · paylaşım tetikleyici.

| Bölüm | Eski kanca | Kanca | TR bağı | Tetikleyici | Karar |
| --- | --- | :-: | :-: | :-: | --- |
| **hys-04 Paralel** | "İstanbul'dan dümdüz doğuya gitsen kaç ülkeden geçerdin?" | 5 → **8** | 8 | 5 → **8** | **Yeniden kurgulandı ve yayına alındı.** İddia 16. saniyede gömülüydü; artık ilk kare. |
| hys-08 Samoa | "Bu ülkede 30 Aralık 2011 hiç yaşanmadı." | 8 | 2 | 4 → **8** | Kanca güçlü. Yeni tetikleyici: **"30 Aralık doğumlu arkadaşına gönder"** (doğum günü kimliği). Sıradaki aday. |
| hys-06 Diomede | "Bu iki ada arasında sadece 3,8 km var." | 6 | 2 | 4 → 6 | "3,8 km ötesi YARIN" başlığı. TR bağı önerisi (İstanbul Boğazı genişliğiyle kıyas) **doğrulanmadan kullanılmayacak.** |
| hys-05 Sandy | "Bu ada 100 yıldan fazla haritalarda duruyordu." | 7 | 1 | 4 → 5 | Kanal adının ta kendisi ("harita yalan söyler"). "Google Haritalar gösteriyordu" öne alındı. Merak/gizem testi. |
| hys-07 Sülün | "Bu ada yılın yarısında İspanya'nın…" | 7 | 1 | 3 → 5 | Tuhaflık iyi, TR bağı yok. En son yayınlansın. |

Önerilen yayın sırası: **04 → 08 → 06 → 05 → 07.** Hepsinin başlık ve açıklaması `*.yayin.json`
dosyalarında yenilendi. 05–08 videolarının kendisi değişmedi; yalnızca 04 yeniden kurgulandı.

## 6. hys-04 v2'de ne değişti?

| | Eski | Yeni |
| --- | --- | --- |
| 0. sn sesi | "İstanbul'dan dümdüz doğuya gitsen kaç ülkeden geçerdin?" | "New York, İstanbul'dan daha GÜNEYDE. İnanmıyor musun? Dümdüz doğuya gidelim." |
| 0. sn ekranı | "İstanbul'dan dümdüz doğuya / kaç ülke?" | "New York, İstanbul'dan / **daha GÜNEYDE**" + enlem merdiveni (41,01° / 40,71°) |
| 2. açık döngü | yok | "Dünyayı dönene kadar KAÇ ülkeden geçeceğiz?" |
| New York anı | "sadece 33 km GÜNEYDE!" | "İşte New York: tam 33 km GÜNEYDE." (açılıştaki sözün ödülü) |
| Kapak | — | "NEW YORK İSTANBUL'UN GÜNEYİNDE · Hem de 33 km" + Özgürlük Heykeli |
| Paylaşım | "Sen kaç tahmin etmiştin?" | + "New York'u bizden kuzeyde sanan arkadaşına gönder." |

Hesaplar kodda: İstanbul 41,0082° K, New York 40,7128° K → 33 km; Roma 41,9028° K → 99 km kuzey.

## 7. Ölçüm

48 saat sonra hys-04 v2'nin **paylaşım/1000** değerine bak. ≥ 5 ise ilke tutuyor, 08'i aynı mantıkla
kurgula. < 2 ise ilke en azından yabancı konularda işlemiyor; yöntemi gözden geçir.
