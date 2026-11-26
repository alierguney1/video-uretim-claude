import json,math
N={x['ad']:x for x in json.load(open('veri/hys-16/nufus-2025.json'))['iller']}
A=json.load(open('veri/hys-14/hgm-alan.json'))['alan'];A['Hakkari']=A.pop('Hakkâri')
M=json.load(open('veri/hys-14/merkezler.json'))['gn'];M['Hakkari']=M.pop('Hakkâri')
P={a:N[a]['plaka'] for a in N}; byP={v:k for k,v in P.items()}
miss=[a for a in N if a not in M or a not in A]; print('eksik',miss)
def hav(a,b):
    (l1,f1),(l2,f2)=M[a][:2],M[b][:2];r=math.radians
    h=math.sin(r(f2-f1)/2)**2+math.cos(r(f1))*math.cos(r(f2))*math.sin(r(l2-l1)/2)**2
    return 12742*math.asin(math.sqrt(h))
rules={
 'alan_buyuk':lambda a:-A[a],
 'yogunluk':lambda a:-N[a]['nufus']/A[a],
 'bati_dogu':lambda a:M[a][0],
 'kuzey_guney':lambda a:-M[a][1],
 'ankara_uzak':lambda a:hav('Ankara',a),
 'istanbul_uzak':lambda a:hav('İstanbul',a),
 'nufus_az':lambda a:N[a]['nufus'],
}
for k,f in rules.items():
    s=sorted(N,key=f); new={a:i+1 for i,a in enumerate(s)}
    keep=[a for a in N if new[a]==P[a]]
    d=sorted(N,key=lambda a:new[a]-P[a])
    print('\n##',k,'koruyan',len(keep),keep)
    print(' 01',s[0],'02',s[1],'06',s[5],'34',s[33],'81',s[80],'| Ank',new['Ankara'],'İst',new['İstanbul'],'İzm',new['İzmir'],'Ada',new['Adana'],'Kon',new['Konya'])
    print(' en çok yükselen',[(a,P[a],new[a]) for a in d[:3]],' düşen',[(a,P[a],new[a]) for a in d[-3:]])
    # takas: a gets b's plate and b gets a's
    sw=[(a,byP[new[a]]) for a in N if byP[new[a]]!=a and new[byP[new[a]]]==P[a] and a<byP[new[a]]]
    print(' karşılıklı takas',sw)
    print(' sıra',' '.join(f'{i+1}:{a}' for i,a in enumerate(s)))
print('\n--- sağlamlık (gn vs wd)')
W=json.load(open('veri/hys-14/merkezler.json'))['wd'];W['Bingöl']=M['Bingöl']
for src,MM in (('gn',M),('wd',W)):
    globals()['M']=MM
    for ref in ('Ankara','İstanbul'):
        s=sorted(N,key=lambda a:hav(ref,a)); new={a:i+1 for i,a in enumerate(s)}
        print(src,ref,'koruyan',[a for a in N if new[a]==P[a]], [(s[i],round(hav(ref,s[i]))) for i in (32,33,34)])
    for nm,f in (('bati',lambda a:MM[a][0]),('kuzey',lambda a:-MM[a][1])):
        s=sorted(N,key=f);new={a:i+1 for i,a in enumerate(s)}
        print(src,nm,'koruyan',[a for a in N if new[a]==P[a]],'Bursa',new['Bursa'],'Bilecik',new['Bilecik'],'Adana',new['Adana'])
