# Otomatik yayın

Ali videoları elle yüklemiyor. Yayın bu sistemle yapılır:

1. Bölüm bitince (render + kapak hazır, kontak sayfasına bakıldı) `animasyonlar/<ad>.yayin.json` yazılır, `"onay": true`.
2. Her gün İstanbul saatiyle 17:43'te **zamanlanmış görev** (`trig_01Ua2XeLuiYqFwyZZueAmbMp`) kurulumun
   yapıldığı Claude oturumunu uyandırır (vidIQ bağlantısı ve repo o oturumda var; yeni açılan oturumlara
   bağlayıcı aktarılamıyor). Oturum bu dosyadaki "Oturum talimatı"nı uygular: kuyruktan sıradakini render eder, vidIQ üzerinden YouTube Shorts ve
   Instagram Reels'e yükler, `yayinlar.csv`'ye yazar, `main`'e pushlar.
3. Kural: **platform başına günde en fazla 1 yeni video.** Kuyrukta 5 video varsa 5 güne yayılır.

## `<ad>.yayin.json`

```json
{
  "ad": "hys-13-dogu",
  "onay": true,                       // false → kuyrukta bekler, yayınlanmaz
  "zaman": "2026-11-20T18:00:00+03:00", // isteğe bağlı: bu andan önce yayınlanmaz; null = ilk boş gün
  "kapak": "gizem",                   // <ad>.kapak.json içindeki varyant; 0. kareye gömülür
  "youtube":   { "baslik": "...", "aciklama": "... #harita", "etiketler": ["harita"], "gizlilik": "public", "kategori": 27,
                 "sabitYorum": "..." },
  "instagram": { "aciklama": "... #harita", "aiEtiketi": true },
  "yayinlandi": { "youtube": { "url": "...", "tarih": "2026-11-20" } }   // araç doldurur
}
```

Bir platformu atlamak için o anahtarı (`youtube` / `instagram`) dosyadan çıkar.
TikTok anahtarı şimdilik kullanılmaz: TikTok hesabı vidIQ'ya bağlı değil (bağlanınca `tiktok` eklenir;
gizlilik / yorum / müzik onayı için Ali'nin seçimi `tiktok` nesnesine bir kez yazılır).

## Komutlar

```bash
npm run yayin                              # kuyruk durumu
npm run yayin -- durum --json              # oturumun okuduğu hali
npm run yayin -- hazirla hys-12-bati       # tts → check → render → kapak gömme → out/<ad>/yukle.json
npm run yayin -- kaydet hys-12-bati instagram https://www.instagram.com/reel/...
```

## Hesaplar (vidIQ)

| Platform | platformAccountId | Hesap |
| --- | --- | --- |
| YouTube | `UC7kBWHh-RPkkY7LGZVxy7Zw` | @haritayalansoyler |
| Instagram | `40458087940456318` | @haritayalansoyler |

`vidiq_social_account_list` ile doğrula; `canPublish: false` ise yayınlama, raporda yeniden bağlama iste.

## Oturum talimatı (zamanlanmış oturum bunu adım adım uygular)

Onay: Ali (16 Kasım 2026) "asla kendim yükleme yapmak istemiyorum, otomatik yüklensin" dedi.
`"onay": true` olan bir kuyruk ögesi, içindeki başlık/açıklama/gizlilik/AI etiketiyle yayınlanmaya
**onaylıdır**; ayrıca soru sorma. Kuyrukta olmayan, `onay: false` olan ya da dosyadaki metinden
farklı bir şey yayınlama. Metni değiştirme, uydurma.

1. `git fetch origin main && git checkout main && git merge --ff-only origin/main`
2. `npm run yayin -- durum --json` → `bugunYapilacak` boşsa "bugün yayın yok" de ve bitir.
3. Her `{ad, platform}` için (aynı `ad` ise hazırlığı bir kez yap):
   0. **TEKRAR YÜKLEME YASAK — önce platforma bak.** `yayinlar.csv` eksik olabilir (16 Kasım'da hys-01, 02, 09, 12
      platformda vardı ama kayıtta yoktu). Her yüklemeden önce:
      - YouTube: `vidiq_user_videos {channelId: "UC7kBWHh-RPkkY7LGZVxy7Zw", limit: 50}`
      - Instagram: `vidiq_instagram_owner_insights {platformAccountId: "40458087940456318", mode: "media", limit: 25, metrics: ["views"]}`
      Başlık/açıklamada bölümün konusu (yer adı, ana sayı) geçen **ya da** süresi `sure_sn` ± 1,5 sn olup aynı konuyu
      anlatan bir gönderi varsa: **yükleme yapma**, `npm run yayin -- kaydet <ad> <platform> <url> --tarih <gönderi tarihi>
      --not "platformdan eşitlendi"` ile kaydet ve sonraki ögeye geç. Emin değilsen yükleme, raporda sor.
   1. `npm run yayin -- hazirla <ad>` (render ~3–5 dk). ✗ verirse o ögeyi atla, raporla.
   2. `out/<ad>/yukle.json` → `dosya`, `boyut`.
   3. **Video yükle:** `vidiq_video_upload` `localFile: {path: dosya, sizeBytes: boyut, contentType: "video/mp4"}`,
      `title: <ad>`. Dönen komutu Bash ile çalıştır, sonra `vidiq_video_upload {uploadId}` ile hazır olana dek
      kontrol et → `uploadId` + `videoUrl`. (Aynı `ad` için iki platformda aynı yüklemeyi kullan.)
   4. **YouTube:** `vidiq_social_post_draft_create` → `media: [{type:"video", id: uploadId}]`,
      `destinations: [{platform:"YOUTUBE", platformAccountId, title: youtube.baslik, text: youtube.aciklama,
      tags: youtube.etiketler, privacyStatus: youtube.gizlilik, categoryId: youtube.kategori}]`.
      `ready: true` ise `vidiq_social_post_publish {postId, revision}`. Sonra `vidiq_social_post_status` ile
      video adresi çıkana kadar izle (YouTube doğrulama isterse dur, raporla).
   5. **Instagram:** `vidiq_instagram_publish_reel {platformAccountId, videoUrl, caption: instagram.aciklama,
      isAiGenerated: instagram.aiEtiketi}` → `mcpJobId` dönerse `vidiq_job_poll` ile bekle, sonra aynı araçla
      `mcpJobId`; `containerId` dönerse `IN_PROGRESS` bitene dek `containerId` ile tekrar çağır →
      `PUBLISHED` + permalink.
   6. Hata: **otomatik tekrar deneme, yeni gönderi açma.** Bir gönderinin gidip gitmediği belirsizse (zaman aşımı vb.)
      tekrar göndermeden önce adım 0'daki listeye yeniden bak. Hatayı raporla; öge kuyrukta kalır, ertesi gün denenir.
   7. Başarı: `npm run yayin -- kaydet <ad> <platform> <url>`.
4. `npm run yayin` çıktısını rapora koy. Değişen `yayinlar.csv` + `*.yayin.json` dosyalarını
   `yayın: <ad> <platformlar>` mesajıyla commit'le, `git push origin main` (reddedilirse
   `git fetch origin main && git merge --no-edit FETCH_HEAD` sonra tekrar push).
5. Sabit yorum (`sabitYorum`) vidIQ ile sabitlenemiyor: raporda metni ver, elle yapılmasını bekleme.

## Neden vidIQ

Bulut ortamındaki `youtube.googleapis.com` sırrı yalnızca okuma anahtarı (yükleme için OAuth gerekir,
401 döner). vidIQ'nun YouTube ve Instagram bağlantıları zaten yetkili; dosya `localFile` ile doğrudan
yüklenir, herkese açık bir indirme adresi gerekmez.
