#!/usr/bin/env python3
"""hys-13 verisi: Hazine ve Maliye Bakanlığı Muhasebat GM, "İller İtibarıyla Merkezi Yönetim Bütçe İstatistikleri"
2024 yılı, Aralık (yıl sonu kümülatif) sayfaları. Kullanım: python3 tools/hys-13-vergi.py <vergi.xls> <gider.xls> <gelir.xls>
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

vergi_xls, gider_xls, gelir_xls = sys.argv[1:4]
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
json.dump({'kaynak': 'HMB Muhasebat GM, İller İtibarıyla Merkezi Yönetim Bütçe İstatistikleri, 2024 Aralık (kümülatif), bin TL',
           'iller': out}, open('veri/hys-13/vergi-2024.json', 'w'), ensure_ascii=False, indent=1)
print(len(out), 'satır')
for k in list(out)[:3] + list(out)[-6:]: print(k, out[k])
