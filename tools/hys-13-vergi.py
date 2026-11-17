#!/usr/bin/env python3
"""hys-13 verisi: Hazine ve Maliye Bakanlığı Muhasebat GM, "İller İtibarıyla Merkezi Yönetim Bütçe İstatistikleri"
YIL, Aralık (yıl sonu kümülatif) sayfaları. Kullanım: python3 tools/hys-13-vergi.py <vergi.xls> <gider.xls> <gelir.xls> <yıl>
Çıktı: veri/hys-13/vergi-2024.json (bin TL)."""
import json, sys
import xlrd.formatting as F
_orig = F.unpack_unicode
def _safe(data, pos, lenlen=2):          # dosyadaki bozuk sayı biçimi kaydı xlrd'yi düşürüyor; biçimler bize gerekmiyor
    try: return _orig(data, pos, lenlen)
    except Exception: return '?'
F.unpack_unicode = _safe
import xlrd

def rows(path, sheet='Aralık'):
    s = xlrd.open_workbook(path).sheet_by_name(sheet)
    for r in range(s.nrows):
        yield [s.cell_value(r, c) for c in range(s.ncols)]

def num(v):
    try: return float(v)
    except (TypeError, ValueError): return 0.0

vergi_xls, gider_xls, gelir_xls, yil = sys.argv[1:5]
out = {}
for r in rows(vergi_xls):
    ad = str(r[1]).strip()
    if ad and isinstance(r[3], float): out.setdefault(ad, {})['vergiTahsilat'] = r[3]
for r in rows(gider_xls):
    ad = str(r[1]).strip()
    if ad and isinstance(r[2], float): out.setdefault(ad, {})['gider'] = r[2]
for r in rows(gelir_xls):
    ad = str(r[1]).strip()
    if ad and isinstance(r[2], float): out.setdefault(ad, {})['merkeziGelir'] = r[2]
json.dump({'kaynak': f'HMB Muhasebat GM, İller İtibarıyla Merkezi Yönetim Bütçe İstatistikleri, {yil} Aralık (kümülatif), bin TL',
           'iller': out}, open(f'veri/hys-13/vergi-{yil}.json', 'w'), ensure_ascii=False, indent=1)
print(len(out), 'satır')
for k in list(out)[:3] + list(out)[-6:]: print(k, out[k])

# Animasyonun okuduğu hali: window.VERGI = {yil, toplam:{vergi,gider}, merkez:{vergi,gider}, iller:{ad:[vergi, gider]}} (milyar TL)
AD = {'Afyon Karahisar': 'Afyonkarahisar', 'K.Maraş': 'Kahramanmaraş', 'Urfa': 'Şanlıurfa'}
mlr = lambda v: round(v / 1e6, 3)       # bin TL → milyar TL
js = {'yil': int(yil), 'kaynak': 'HMB Muhasebat GM · İller İtibarıyla Merkezi Yönetim Bütçe İstatistikleri · ' + yil,
      'toplam': {'vergi': mlr(out['Toplam']['vergiTahsilat']), 'gider': mlr(out['Toplam']['gider'])},
      'merkez': {'vergi': mlr(out['Merkez']['vergiTahsilat']), 'gider': mlr(out['Merkez']['gider'])},
      'iller': {AD.get(k, k): [mlr(v['vergiTahsilat']), mlr(v['gider'])] for k, v in out.items() if k not in ('Toplam', 'Merkez')}}
open(f'veri/hys-13/vergi-{yil}.js', 'w').write('// ÜRETİLDİ: tools/hys-13-vergi.py — elle düzenleme\nwindow.VERGI = ' + json.dumps(js, ensure_ascii=False) + ';\n')
