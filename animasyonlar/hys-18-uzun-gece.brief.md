# hys-18-uzun-gece — brif

Seri: Harita Yalan Söyler · Bölüm 18 · `hys-09-gunes` brifinin yeniden yazımı (fikirler §00000, sıra 1).
Ali (27 Kas): "1'i yap. 21 Aralık en uzun gece diye gir, sonra bir şeyler anlat, viral olsun." Bu ifade, hys-16'daki gibi
sahne listesi onayını atlamak için yetki sayıldı.
Numara: hys-17 (7 harika) beklemede olduğu için bu bölüm 18.

**Tek cümle:** 21 Aralık yılın en uzun gecesi. Türkiye'de en uzun gece Kars ya da Erzurum'da değil, **Sinop'ta** (14 sa 54 dk).
Güneş Hakkari'de Edirne'den 81 dk önce doğuyor ve **sabahlar 21 Aralık'tan sonra da kararmaya devam ediyor** (en geç doğuş Ocak başında).

## Veri (ekrandaki her sayı)

`node tools/hys-18-uzun-gece.mjs` → `veri/hys-18/uzun-gece.json` / `.js`. Yöntem hys-09-gunes ile aynı: NOAA (Spencer serisi), ufuk 90,833°,
il merkezi (`veri/hys-09/iller.topo.json`), deniz seviyesi, TSİ, ±2 dk. Gece = 21 Aralık batışından 22 Aralık doğuşuna kadar.

| Bulgu | Değer |
| --- | --- |
| En uzun gece | Sinop 14 sa 54 dk (sonra Kırklareli 14:52, Edirne 14:51) |
| Kars / Erzurum | 14 sa 45 dk / 14 sa 40 dk |
| En kısa gece | Hatay 14 sa 19 dk → **35 dk** fark |
| İlk doğuş / son doğuş | Hakkari 07:16 / Edirne 08:37 → **81 dk** |
| İlk batış / son batış | Iğdır 16:42 / İzmir 17:54 → 72 dk |
| En geç doğuş (İstanbul) | **4 Ocak 08:29** (21 Aralık: 08:25); illerde 4–7 Ocak |
| En erken batış | illerde 7–10 Aralık (ekrana yazılmadı: tarih ±1 gün oynuyor) |

Dürüstlük: il merkezi, deniz seviyesi, rakım ve ufuk etkisi yok; tablo altında dipnot. Gün dönümü anı 21 Aralık 2026 gecesi TSİ;
"en uzun gece" 21→22 Aralık gecesi.

## Normal insan testi

1. **Fikri var mı?** Evet: "21 Aralık en uzun gece" herkesin bildiği cümle; çoğu kişi "en uzun gece doğuda / soğukta" sanır.
2. **Kendisi sorar mı?** Evet: kışın "sabahlar karanlık" derdi, 21 Aralık'ta her yıl gündem.
3. **Kime gönderir?** Sinoplu ("en uzun gece bizde"), Hataylı, Edirne–Hakkari arkadaş çiftleri; "4 Ocak'a kadar sabahlar kararıyor" herkese.

## Brif (özet)

- **Kanca türü:** tahmin et + yanlış inanış ("Kars mı? Erzurum mu? Hayır, Sinop"). Son üç: 14 yanlış inanış, 15 ya…olursa, 16 kayıp.
- **Görsel:** gece = mavi-gri il dolgusu, gündüz = kâğıt; **gece-gündüz çizgisi** her karede gerçek güneş konumundan hesaplanır (turuncu).
  Gece süresi tonu (uzun = koyu) + enlem çizgileri + kuzey oku. Tuzak sahnesi: İstanbul doğuş saati eğrisi (1 Ara–31 Oca).
  İl ikonları (Sinop, Hatay, Kars, Erzurum, Hakkari, Edirne, Iğdır, İzmir). 81 il durdur-bul tablosu.
- **Farklılık:** seride ilk canlı gece-gündüz çizgisi, ilk saat taraması, ilk zaman serisi grafiği.
- **Gönderilme sebebi:** Sinoplu arkadaşa "en uzun gece sizde"; herkese "sabahlar 4 Ocak'a kadar kararıyor".

## Sahne listesi (~47 sn)

| # | Ses | Görüntü |
| --- | --- | --- |
| 1 | "21 Aralık. Yılın en uzun gecesi." | Karanlık Türkiye, ay, "YILIN EN UZUN GECESİ" |
| 2 | "Peki en uzun gece hangi ilde? Kars mı? Erzurum mu?" | Kars, Erzurum ikonları "?" |
| 3 | "Hayır. Sinop. 14 saat 54 dakika." | Sinop turuncu; iller gece süresine göre koyulaşır; Kars/Erzurum değerleri |
| 4 | "En kısası Hatay'da: tam 35 dakika kısa." | Hatay; "35 dk daha kısa" |
| 5 | "Çünkü geceyi doğu değil, kuzey uzatıyor." | Enlem çizgileri, kuzey oku |
| 6 | "Doğu ise saati belirliyor: güneş ilk Hakkari'de doğuyor, 07:16'da." | Büyük saat, Hakkari aydınlanır |
| 7 | "Sonra batıya kayıyor, iller tek tek aydınlanıyor." | Gece-gündüz çizgisi batıya kayar, sayaç n/81 |
| 8 | "Edirne'ye ancak 08:37'de varıyor. Tam 81 dakika sonra." | Edirne; "81 dakika" |
| 9 | "Akşam tersi: Iğdır'da 16:42, İzmir'de 17:54." | Çizgi bu kez söndürür |
| 10 | "Asıl tuzak şu: en uzun gece bitince sabahlar aydınlanmıyor. En geç doğuş Ocak başında." | İstanbul eğrisi; 21 Ara 08:25 → **4 Ocak 08:29** |
| 11 | "Senin ilinde güneş kaçta doğuyor? Durdur, bak." | 81 il tablosu (doğuş · batış) |
| 12 | (döngü) | İlk kare |

## Merak haritası

| Döngü | Açılış | Soru | Kapanış |
| --- | --- | --- | --- |
| A | 0,3 | En uzun gece Türkiye'de nerede? | Sinop |
| B | 3 | Kars mı, Erzurum mu? | Sinop (ters köşe) |
| C | 8 | Neden Sinop? | "kuzey uzatıyor" |
| D | 16 | Güneş Edirne'ye ne zaman varıyor? | 08:37, 81 dk |
| H | 18 | Benim ilim kaçta aydınlanıyor? (sayaç) | tablo |
| E | 30 | Akşam ilk nerede kararıyor? | Iğdır 16:42 |
| F (tuzak) | 35 | En uzun geceden sonra sabahlar? | 4 Ocak |
| G | 41 | Benim ilim? | durdur-bul / yorumlar |

## Yayın paketi (taslak)

- **Kapak:** "EN UZUN GECE *SİNOP*'TA" · "SABAHLAR *4 OCAK*'A KADAR KARARIYOR" · "AYNI SAAT, *81 DK* FARK".
- **Başlık:** 21 Aralık: yılın en uzun gecesi Türkiye'de nerede? 😳 Kars değil… #21aralık #harita
- **Sabit yorum:** "Senin ilinde güneş kaçta doğuyor? İlini yaz 👇"
- **AI etiketi:** açık (sentetik seslendirme). Yayın penceresi: 1–21 Aralık.
