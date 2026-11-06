# Kütüphaneler

Saf Canvas her şeyi yapabilir ama bazen tekerleği yeniden icat etmeye gerek yok. Brife tek bir
kütüphane adı eklemek ("sallanan çizgiler için Rough.js, CDN'den") Claude'un yüz satır yardımcı
kod yerine işin özüne odaklanmasını sağlar.

**Bu repoda kural:** Kütüphane `draw(t)` sözleşmesini bozmamalı. Kendi zaman çizelgesi ya da
fizik döngüsü olanlar (GSAP, Matter.js, Theatre.js) `t`'ye bağlanmalı. Örneğin GSAP'te
`timeline.pause(); timeline.seek(t)`. Fizik motorları için simülasyonu önceden sabit adımla
çalıştırıp kareleri bir diziye kaydet, `draw(t)` diziden okusun. Ardından `npm run check`.

| Kütüphane | Ne yapar | Ne zaman | `t`'ye bağlama |
| --- | --- | --- | --- |
| [GSAP](https://gsap.com) | Zaman çizelgesi, easing, yazı bölme, morph | Karmaşık zamanlama | `tl.pause()` + `tl.seek(t)` |
| [Rough.js](https://roughjs.com) | El çizimi görünümü | Defter/tahta stili | `seed` parametresi sabit ver |
| [simplex-noise](https://github.com/jwagner/simplex-noise.js) | Akışkan gürültü | Su, duman, organik hareket | `createNoise3D(mulberry32(seed))`, `noise(x, y, t)` |
| [D3](https://d3js.org) | Ölçek, eksen, harita | Veri animasyonu | Sadece ölçek/geometri için kullan, geçişlerini değil |
| [KaTeX](https://katex.org) | Formül | Eğitici | DOM katmanı ya da SVG'ye çevirip canvas'a çiz |
| [opentype.js](https://opentype.js.org) | Fontu yollara çevirir | Harflerin çizilerek belirmesi | yol uzunluğu × ilerleme(t) |
| [Paper.js](http://paperjs.org) | Vektör yol işlemleri | Şekil dönüşümleri | `view.onFrame` kullanma, `t`'den çiz |
| [PixiJS](https://pixijs.com) | Hızlı 2D, binlerce sprite | Kalabalık sahneler | `app.ticker.stop()`, `app.render()` |
| [Matter.js](https://brm.io/matter-js/) | 2D fizik | Düşme, çarpışma | Önceden simüle et, kaydet |
| [Zdog](https://zzz.dog) | Sahte 3D | Basit sevimli 3D | `illo.rotate` = f(t), `illo.updateRenderGraph()` |
| [Three.js](https://threejs.org) | 3D motor | Uzay, mimari, bilim | `preserveDrawingBuffer: true`, `__setTime` içinde `render` |
| [troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text) | 3D'de net yazı | 3D etiketler | `sync()` tamamlanınca `__ready` |
| [Tone.js](https://tonejs.github.io) | Koddan müzik | Müziği de kodla | `Tone.Offline` ile render, `--audio` ver |
| [Meyda](https://meyda.js.org) | Ses analizi | Müzikten enerji/tını | Önceden analiz et → JSON |
| [Remotion](https://www.remotion.dev) | React ile video | Tekrar kullanılan ürün videoları | Kendi render hattı var |
| [Motion Canvas](https://motioncanvas.io) / [Manim](https://www.manim.community) | Eğitici/matematik animasyonu | Adım adım anlatım | Kendi render hattı var |

Müzikle senkron işlerde müzik canlı analiz edilmez: önce `ffmpeg` + Python (`librosa`) ile
BPM, vuruşlar, enerji ve bölümler bir JSON'a çıkarılır, `draw(t)` o JSON'u okur.
Seslendirmede kelime düzeyinde zaman damgası için Whisper kullanılır.
