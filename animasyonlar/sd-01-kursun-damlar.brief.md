# sd-01-kursun-damlar — brif (ONAY BEKLİYOR)

Seri: Seyir Defteri (çalışma adı) · Sezon 1: Casanova · Bölüm 1 (pilot)
Kimlik: [seriler/seyir-defteri/STYLE.md](../seriler/seyir-defteri/STYLE.md) · Hikâye: [docs/hikaye-rehberi.md](../docs/hikaye-rehberi.md) · Ses: [docs/ses-rehberi.md](../docs/ses-rehberi.md)

1. **Rol:** Piksel sanatlı tarih anlatısı için animasyon yönetmeni + ses tasarımcısı.
2. **Hedef:** İzleyici şunu hatırlasın: Casanova, Venedik'in kurşun çatılı hapishanesinden bir demir çubuk,
   bir İncil, bir tabak makarna ve "sahte bir melek" sayesinde kaçtı ve sarayın kapısından yürüyerek çıktı.
3. **Format:** ~130 sn (V), 1080x1920, 60 fps, piksel 3x. Seslendirme: Gemini TTS (ses seçimi kullanıcıda) ya da kullanıcının sesi. Ses efekti: `lib/ses.js`.
4. **Sahne / durak listesi:** aşağıda (tablo).
5. **Sanat yönü:** STYLE.md sabitleri. Gece ve sis gök seti (yeni: `#0E1426 → #1B2440 → #2C3557`, sis `#8C93A8` %40 dither),
   hücre içi mum ışığı seti (yeni: `#1A1420 → #3A2A2A`, alev `#F2B544`). İkisi STYLE.md'ye eklenecek.
6. **Hareket dili:** STYLE.md. Bu bölüme özel: kesit (bebek evi) kamerası yatay kayar = "yan hücreye geçiş";
   kazı ilerleme çubuğu = zaman; dither çözülmesi sadece harita ↔ durak.
7. **Yasaklar:** MOTION_RULES + kaynaksız ayrıntı (sayılar, diyalog), modern bina, "kaçılmaz hapishane" gibi
   kanıtsız üstünlük, idam/işkence görüntüsü.
8. **Kanca türü:** Sonuçtan başla (soğuk açılış). Serinin ilk bölümü; önceki tür yok.
9. **Ara ödüller:** 3 sn yer/tarih · 9 sn suç · 18 sn çubuk nesne kartı · 27 sn kazı çubuğu · 36 sn "taşındı!" ·
   46 sn İncil + makarna · 54 sn gardiyan geçti · 62 sn muhbir · 68 sn melek rüyası · 74 sn tavandan ses ·
   83 sn ip · 90 sn sis ve kaygan çatı · 101 sn kapı açılıyor · 108 sn "yürüyerek çıktılar" · 116 sn kaçış rotası · 124 sn Paris.
10. **Gönderilme sebebi:** "Casanova'yı hapisten bir tabak makarna kurtardı": kaçış filmi sevenlere, "bunu
    bilmiyordum" diye gönderilir; melek hilesi yorumlarda konuşulur.
11. **Farklılık:** Serinin ilk bölümü. HYS'den farkı: veri değil karakter ve plan; harita az, durak çok
    (kesit ve nesne kartı ilk kez); süre ~3 kat.
12. **Yayın paketi:**
    - Kapak (0 sn): sisli kurşun çatıda iki siluet, köşede "1756", üstte "Nasıl kaçtı?"
    - Başlık: "Casanova'yı hapisten bir tabak makarna kurtardı"
    - Açıklama: "1755'te Venedik'te büyücülükle suçlanıp Doçe Sarayı'nın kurşun çatısı altındaki hücrelere atılan Casanova,
      15 ay sonra bir demir çubuk, bir İncil ve bir muhbire anlatılan 'melek' hikâyesiyle kaçtı. Kaynak: Casanova'nın
      kendi anlatısı (Histoire de ma vie), Britannica, Wikipedia (Piombi)."
    - Etiketler: #tarih #casanova #venedik #hapiskaçışı #seyirdefteri
    - AI etiketi: TTS kullanılırsa aç (sentetik seslendirme)
    - Sabit yorum: "Sen olsan çubuğu nereye saklardın?" + B2 bağlantısı (yayınlanınca)
13. **Hikâye omurgası:**
    - İstek: kaçmak · Engel: kurşun çatı, gardiyan, muhbir, suyla çevrili şehir · Bedel: 5 yıl hapis
    - Kırılma (%28, 36 sn): tam bitmek üzereyken başka hücreye taşınıyor, kazı boşa gidiyor
    - Tuhaf detay: çubuk İncil'in cildinde, üstünde ağzına kadar dolu tereyağlı makarna tabağı; muhbire "melek gelecek" demesi
    - Hikâye testi: İstek 2 · Engel 2 · Bedel 2 · Saat 1 · Kırılma 2 · Detay 2 · Cevap 2 · Harita/bağ 1 = **14/16**
14. **Döngü haritası:** aşağıda.
15. **Ses planı:** aşağıda.

## Sahneler ve süreler

| # | Süre | Sahne (tek iş) | Ekran | Geçiş nesnesi |
| --- | --- | --- | --- | --- |
| 0 | 0–7 | **Soğuk açılış:** gece, sis, kurşun çatıda iki adam. Soru: nasıl? | Diorama, yakın plan | Casanova'nın silueti → defter sayfası çevrilir |
| 1 | 7–16 | **Defter kaydı:** Avrupa → Venedik; 26 Temmuz 1755; büyücülükle suçlanıp Kurşun Damlar'a; ceza 5 yıl | Harita | Doçe Sarayı ikonu → dither |
| 2 | 16–42 | **Hücre (kesit):** çatı katının kesiti; çubuk (nesne kartı); yatağın altından kazı (ilerleme çubuğu) → **ama** başka hücreye taşınıyor | Kesit | Kamera yan hücreye kayar |
| 3 | 42–58 | **Ortak:** yan hücrede Peder Balbi; kitap sırtında mektuplar; çubuk İncil'in cildinde, üstünde makarna tabağı; gardiyan tepsiyi taşır (izleyici biliyor, gardiyan bilmiyor) | Kesit + nesne kartı | Tepsi kapıdan çıkar → muhbir girer |
| 4 | 58–78 | **Muhbir ve melek:** Soradaci hücreye konur; Casanova "rüyasını" anlatır; söylediği saatte tavandan sesler; Soradaci dehşet içinde; yukarıda kazan Balbi | Kesit (iki kat birden) | Tavandaki delik → gece göğü |
| 5 | 78–98 | **Çatı (31 Ekim 1756 gecesi):** çarşaf, battaniye, yatak kılıfından ip; kurşun levhalar sökülür; sis, dik ve kaygan çatı; çatı penceresinden saraya iniş. Açılıştaki kare burada yakalanır | Diorama | Pencere → saray koridoru |
| 6 | 98–112 | **Kapı:** sabah bir görevli kapıyı açar; "törenden sonra içeride kilitli kaldık"; **yürüyerek çıkarlar**, gondol | Diorama | Gondol → harita |
| 7 | 112–130 | **Kaçış rotası:** Venedik → Mestre → Münih → Paris (yaklaşık); Paris'te onu bekleyen iş: piyango. Rota Paris'e çizilmeye başlar ve **kesilir** | Harita | Yarım rota (döngü yok; seri askısı) |

## Döngü haritası (`window.__beats`)

| Soru | Açılış | Kapanış |
| --- | --- | --- |
| **A** Nasıl çıktılar? (ana) | 0 | 108 (%83) |
| B Neden hapisteydi? | 7 | 12 |
| C Delik işe yarayacak mı? | 24 | 36 (ama: taşındı) |
| D Şimdi ne yapacak? | 36 | 50 (Balbi + İncil) |
| E Gardiyan çubuğu görecek mi? | 50 | 56 |
| F Muhbir planı bozacak mı? | 60 | 76 (melek hilesi) |
| G Çatıdan nasıl inecekler? | 84 | 96 |
| **Z** Paris'te onu ne bekliyordu? (sonraki bölüm) | 122 | — |

Aynı anda en fazla 3 açık soru (A + D + E). Ödül aralığı ≤ 5 sn.

## Seslendirme taslağı (her satır kaynaklı; "?" = doğrulanmadan ekrana çıkmaz)

1. Gece yarısı. Sisli, kaygan bir kurşun çatıda iki adam var. Biri Casanova.
2. Birkaç saat önce ikisi de bu çatının altındaki hücrelerdeydi. Peki nasıl çıktılar?
3. On beş ay önce, otuz yaşındayken, büyücülükle suçlanıp buraya atılmıştı: Doçe Sarayı'nın kurşun çatısının altına. Cezası beş yıldı.
4. Ama Casanova beklemedi. Bir demir çubuğu sivriltti ve yatağının altından zemini oymaya başladı.
5. Kazdı, kazdı. Delik bitmek üzereydi.
6. Ama onu başka bir hücreye taşıdılar. Bütün emek boşa gitti.
7. Bu yüzden bir ortak buldu: yan hücredeki Peder Balbi. Kitapların sırtına gizlenmiş mektuplarla haberleştiler.
8. Çubuğu bir İncil'in cildine sakladı. Üstüne de ağzına kadar dolu, tereyağlı bir tabak makarna koydu.
9. Gardiyan tabağa baktı. Kitaba değil.
10. Ama hücresine bir muhbir koydular: Soradaci.
11. Casanova ona bir rüya anlattı: bir melek tavanı delip onları kurtaracaktı.
12. Söylediği saatte tavandan sesler geldi. Soradaci dehşet içindeydi. "Melek", çubuğu elinde tutan Balbi'ydi.
13. 31 Ekim 1756 gecesi, çarşaflardan, battaniyelerden ve yatak kılıfından bir ip yaptılar. Kurşun levhaları söküp çatıya çıktılar.
14. Çatı dikti, sis her yeri kaplamıştı. Bir çatı penceresinden sarayın içine indiler.
15. Sabah bir görevli kapıyı açtı. Casanova, bir törenden sonra içeride kilitli kaldıklarını söyledi.
16. Ve sarayın kapısından, yürüyerek çıktılar.
17. Bir gondol, sonra Münih. Birkaç ay sonra Paris'teydi.
18. Ve Paris'te bu kaçağı bir iş bekliyordu: bir devlet piyangosu.

Dürüstlük notu (ekranda küçük, 125 sn): "Ayrıntıların çoğu Casanova'nın kendi anlatısından."

## Kaynaklar ve doğrulama durumu

| İddia | Durum | Kaynak |
| --- | --- | --- |
| 26 Temmuz 1755 tutuklama, Devlet Engizisyonu, büyücülük/dine hakaret | ✓ | [Britannica](https://www.britannica.com/biography/Giacomo-Casanova), [History Daily](https://www.historydaily.com/the-arrest-of-casanova/) |
| Ceza 5 yıl, Doçe Sarayı'nın kurşun çatısı altındaki hücreler | ✓ (bir kaynak "belirsiz süre" diyor; ekranda "5 yıl", Britannica) | [Britannica](https://www.britannica.com/biography/Giacomo-Casanova), [Wikipedia: Piombi](https://en.wikipedia.org/wiki/Piombi) |
| Demir çubuk, yatağın altından alttaki salona doğru kazı | ✓ | [James Short](https://www.jamesshort.me/casanovas-escape-from-the-leads), [History Avenue](https://the-history-avenue.eu/2025/02/09/casanovas-great-escape-from-venices-most-secure-prison/) |
| Kaçıştan hemen önce başka hücreye taşınma | ✓ | [History Hit](https://www.historyhit.com/giacomo-casanova-master-of-seduction-or-a-misunderstood-intellectual/), James Short |
| Deliğin bulunması, gardiyan Lorenzo'ya şantaj | ? (kaynaklar çelişiyor; seslendirmede yok) | James Short |
| Peder Balbi, kitaplarda gizli mektuplar | ✓ | James Short, History Avenue |
| Çubuk İncil'in cildinde, üstünde tereyağlı makarna tabağı | ✓ (anılar; makarna, gnocchi değil) | [anılar, QQ okuma kopyası](https://inote.qq.com/read/1000793082/420), [Rau Antiques](https://rauantiques.com/blogs/canvases-carats-and-curiosities/venices-most-notorious-prisoner-and-the-paintings-that-immortalized-his-world) |
| Balbi'nin 8 günlük tavan kazısı, deliği resimle örtmesi | ✓ | Rau Antiques, anılar |
| Muhbir Soradaci | ✓ | [Griffiths, Italian Prisons](https://www.gutenberg.org/files/52175/52175-h/52175-h.htm), anılar |
| "Melek gelecek" rüyası, saatinde tavandan ses, Soradaci'nin korkusu | ✓ (anılara göre) | [Bartleby, anılardan bölüm](https://www.bartleby.com/library/prose/1216.html), [fullbooks](http://www.fullbooks.com/Under-the-Leads-Casanova-v102.html) |
| 31 Ekim 1756 gecesi; çarşaf, battaniye, yatak kılıfından ip; sis, dik çatı | ✓ | Britannica (tarih), Bartleby, History Avenue |
| Sabah görevliye yalan söyleyip kapıdan çıkış ("törenden sonra kilitli kaldık") | ✓ (iki ikincil kaynak, anılara göre) | [Odd Salon](https://www.oddsalon.com/jan-5-1757-giacomo-casanova-breaks-out-of-prison/), [italyonthisday](https://www.italyonthisday.com/search/label/Casanova?hl=en_US) |
| Gondol; Mestre, Münih üzerinden Paris, 1757 başı | ✓ (güzergâh yaklaşık) | History Avenue, [Falstaff](https://www.falstaff.com/at/news/giacomo-casanova-verfuehrer-betrueger-und-gourmet) |
| 1757'de Paris'te piyango | ✓ | Britannica |

Yayından önce: anıların İngilizce metni (Gutenberg #2981 vb.) bu ortamdan açılamadı; ? satırları ve
"yatağın altından" ifadesi yerelde anılardan bir kez daha kontrol edilmeli.

## Ses planı

| sn | Olay | Ses | Katman |
| --- | --- | --- | --- |
| 0–7 | Sisli çatı | `ruzgar` + uzak `dalga` | yatak |
| 0.1 | Açılış | `kalp` (iki atış) | vurgu |
| 6.8 | Sayfa çevrilir | `sayfa` + `kayit` damgası | arayüz (imza) |
| 7–16 | Harita, rota adımları, Venedik'e iniş | `adim`, `whoosh`, `gecis` | arayüz/vurgu |
| 16–42 | Hücre: mum, damla, uzak adım; kazı | `ates` (çok kısık), `damla`, `adim-tas`, `kazma` (varyantlı, ritmik) | yatak/olay |
| 36 | **Ama:** taşınma | `yukselis` → 400 ms sessizlik → `kapi-kapa` + `metal-agir` | vurgu |
| 46–56 | İncil + makarna, gardiyan geçer | `kitap-kapa`, `tabak`, `gerilim` + `kalp`, adımlar uzaklaşır | olay/yatak |
| 66–76 | Melek rüyası, tavandan ses | `sihir` (rüya), `kazma` yukarıdan (pan), Soradaci'nin korkusu `hata` değil, sessizlik | olay |
| 78–98 | Çatı | `ruzgar` güçlü, `kumas` (ip), `metal-orta` (kurşun levha), `gicirti` (çatı penceresi) | yatak/olay |
| 101 | **Büyük an:** kapı | `yukselis` → 500 ms sessizlik → `kapi-ac` + `darbe` | vurgu |
| 108 | Dışarı: gondol | `dalga`, `marti` | yatak |
| 112–130 | Kaçış rotası | `adim` (kara yolu, daha yavaş), Paris'e yaklaşırken `yukselen`, kesilme anında sessizlik | arayüz |
