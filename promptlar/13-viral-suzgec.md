# Viral süzgeç turu

**Nerede:** İlk sürüm (adım 3–5: kod, denetim, kontak sayfası) bittikten sonra, cilalamadan (adım 6) **önce**.
**Kaynak:** [vyralcontent/content-skills](https://github.com/vyralcontent/content-skills) (MIT) — `.claude/skills/` altında kuruludur.

İlk sürüm taslaktır. Süzgeç turu onu bağımsız bir gözle, bu skill'lerin kontrol listeleriyle eleştirir,
sonra animasyon **yeniden üretilir** (kod değişir). Platform ayrımı yok: tek video, tek optimizasyon.

## Kullanılan skill'ler (sırayla)

| # | Skill | Neye bakar | Çıktı |
|---|---|---|---|
| 1 | `viral-hooks` | İlk 1–3 sn: görsel + sözel + ekran yazısı katmanları, anti-pattern'ler. `assets/hook-checklist.md` | Kanca puanı + en az 3 alternatif kanca |
| 2 | `viral-short-form` | Retention: hook → tırmanış → ödül → CTA; hangi saniyede izleyici düşer. `references/retention.md` | Drop-off riski olan saniyeler |
| 3 | `viral-captions-and-ctas` | Ekrandaki yazılar, kinetik altyazı, kapanış CTA'sı, yayın açıklaması / sabit yorum. `assets/bait-check.md` | Yazı düzeltmeleri + açıklama taslağı |
| 4 | `viral-short-form-ideas` | Yalnızca kanca/açı zayıfsa: aynı konuya farklı açı. `references/idea-evaluation.md` | Gerekirse yeni açı |

**Şimdilik kullanılmayanlar:** `viral-tiktok-content`, `viral-youtube-shorts`, `viral-instagram-reels`
kuruludur ama platform bazlı optimizasyon istenene kadar çağrılmaz.

## Uyarlama kuralları

- Skill'ler çoğunlukla konuşan kafa / senaryo içindir; bizde her şey kodla çizilen animasyon.
  "Sözel kanca" = ekrandaki ilk yazı + varsa sesli satır; "kesme" = sahne geçişi / kamera hareketi.
- Skill önerisi MOTION_RULES.md veya `STYLE.md` ile çelişirse **onlar kazanır**. Çelişkiyi raporda yaz.
- Gerçek veri kuralı geçerli: skill'in örnek sayı/iddialarını videoya taşıma.
- Skill'deki "viral olur" tonu garanti vermez; metrik uydurma, `yayinlar.csv` gerçek veridir.

## Prompt

```text
Rolün değişiyor: viral kısa video editörüsün. İlk sürüm final değil. Henüz kodu değiştirme.

1. out/<ad>/contact.png ve animasyonlar/<ad>.brief.md dosyalarını oku.
2. Sırayla .claude/skills/ altındaki viral-hooks, viral-short-form, viral-captions-and-ctas
   skill'lerini oku (SKILL.md + ilgili references/assets) ve videoyu her birinin kontrol listesinden geçir.
3. Rapor yaz (saniye + kare numarasıyla):
   - KANCA: ilk 1–3 sn'nin üç katmanı, 1–10 puan, anti-pattern var mı, 3 alternatif kanca.
   - RETENTION: izleyicinin düşeceği saniyeler, her biri için çözüm (daha erken ödül, ters köşe, ritim).
   - YAZI/CTA: ekran yazıları, kapanış, yayın açıklaması + sabit yorum taslağı, bait-check sonucu.
4. Bulguları etki sırasına diz, MOTION_RULES.md / STYLE.md ile çelişenleri ele.
5. Bana göster, onay al. Onaydan sonra animasyonlar/<ad>.html'i güncelle (sözleşme bloğuna dokunma),
   check + contact'ı tekrar çalıştır, kontak sayfasına yeniden bak. Raporu animasyonlar/<ad>.suzgec.md olarak kaydet.
```

Bu tur **bir kez** yapılır. Ardından adım 6 (cilalama) normal akışla devam eder.
