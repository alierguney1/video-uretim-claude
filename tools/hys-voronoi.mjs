// Voronoi Türkiye taslak hesabı: her 0,02° ızgara hücresi kuşuçuşu en yakın il merkezine atanır.
// Kullanım: node tools/hys-voronoi.mjs veri/hys-09/iller.topo.json  (alanlar km², sadeleştirilmiş sınır)
import fs from 'fs';
const t=JSON.parse(fs.readFileSync(process.argv[2]));
const [sx,sy]=t.transform.scale,[tx,ty]=t.transform.translate;
const arcs=t.arcs.map(a=>{let x=0,y=0;return a.map(([dx,dy])=>{x+=dx;y+=dy;return [x*sx+tx,y*sy+ty]})});
const arc=i=>i>=0?arcs[i]:arcs[~i].slice().reverse();
const ring=r=>r.flatMap((i,k)=>{const a=arc(i);return k?a.slice(1):a});
const G=t.objects.iller.geometries.map(g=>{const polys=g.type==='Polygon'?[g.arcs]:g.arcs;return {ad:g.properties.ad,m:g.properties.merkez,polys:polys.map(p=>p.map(ring))}});
function inRing(x,y,r){let c=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const[xi,yi]=r[i],[xj,yj]=r[j];if((yi>y)!=(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c}
const inG=(x,y,g)=>g.polys.some(p=>inRing(x,y,p[0])&&!p.slice(1).some(h=>inRing(x,y,h)));
const R=Math.PI/180;const dist=(a,b)=>{const s=Math.sin((b[1]-a[1])*R/2)**2+Math.cos(a[1]*R)*Math.cos(b[1]*R)*Math.sin((b[0]-a[0])*R/2)**2;return 2*6371*Math.asin(Math.sqrt(s))};
const st=0.02;const res=G.map(g=>({ad:g.ad,resmi:0,vor:0,kalan:0,kayip:{}}));
for(const [gi,g] of G.entries()){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of g.polys)for(const[x,y]of p[0]){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
 for(let y=Math.ceil(y0/st)*st;y<=y1;y+=st){const A=(st*111.32)**2*Math.cos(y*R);for(let x=Math.ceil(x0/st)*st;x<=x1;x+=st){if(!inG(x,y,g))continue;
  let bi=0,bd=1e9;G.forEach((h,hi)=>{const d=dist([x,y],h.m);if(d<bd){bd=d;bi=hi}});
  res[gi].resmi+=A;res[bi].vor+=A;if(bi===gi)res[gi].kalan+=A;else res[gi].kayip[G[bi].ad]=(res[gi].kayip[G[bi].ad]||0)+A}}}
for(const r of res){r.degisim=(r.vor-r.resmi)/r.resmi*100;r.kayipPct=(1-r.kalan/r.resmi)*100;const k=Object.entries(r.kayip).sort((a,b)=>b[1]-a[1])[0];r.enCok=k?`${k[0]} ${(k[1]/r.resmi*100).toFixed(0)}%`:''}
const f=r=>`${r.ad.padEnd(15)} resmi ${Math.round(r.resmi).toString().padStart(6)} vor ${Math.round(r.vor).toString().padStart(6)} değişim ${r.degisim.toFixed(0).padStart(5)}%  kendi topr. kaybı ${r.kayipPct.toFixed(0).padStart(3)}% → ${r.enCok}`;
console.log('EN ÇOK BÜYÜYEN');res.slice().sort((a,b)=>b.degisim-a.degisim).slice(0,10).forEach(r=>console.log(f(r)));
console.log('EN ÇOK KÜÇÜLEN');res.slice().sort((a,b)=>a.degisim-b.degisim).slice(0,10).forEach(r=>console.log(f(r)));
console.log('KENDİ TOPRAĞININ EN ÇOĞU BAŞKASINA');res.slice().sort((a,b)=>b.kayipPct-a.kayipPct).slice(0,10).forEach(r=>console.log(f(r)));
const tot=res.reduce((s,r)=>s+r.resmi,0),moved=res.reduce((s,r)=>s+r.resmi-r.kalan,0);console.log('toplam',Math.round(tot),'yer değiştiren %',(moved/tot*100).toFixed(1));
console.log('kalan>%50 il sayısı',res.filter(r=>r.kayipPct>50).length);
fs.writeFileSync('veri/hys-voronoi/sonuc-taslak.json',JSON.stringify(res,null,1));
