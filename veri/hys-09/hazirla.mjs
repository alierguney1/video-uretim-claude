// Bir kerelik: Natural Earth 1:10m GeoJSON'dan iller.topo.json ve baskentler.json üretir.
// Gerekenler (repo dışında): npm i d3-geo@3.1.1 topojson-server@3 topojson-simplify@3 topojson-client@3
// ve nvkelso/natural-earth-vector/geojson altından ne_10m_admin_1_states_provinces, ne_10m_populated_places_simple.
// NE yolu: aşağıdaki NE sabiti. Çıktılar çalışılan klasöre yazılır.
import fs from 'fs';
import {topology} from 'topojson-server';
import {quantize} from 'topojson-client';
import {presimplify, simplify, quantile} from 'topojson-simplify';
import * as d3 from 'd3-geo';
const NE='/tmp/claude-0/ne/';
const A=JSON.parse(fs.readFileSync(NE+'ne_10m_admin_1_states_provinces.geojson'));
const ADI={Adiyaman:'Adıyaman',Agri:'Ağrı',Aydin:'Aydın',Balikesir:'Balıkesir','Bartın':'Bartın',Diyarbakir:'Diyarbakır',Elazig:'Elazığ',Eskisehir:'Eskişehir','Gümüshane':'Gümüşhane',Istanbul:'İstanbul',Izmir:'İzmir','Iğdir':'Iğdır','K. Maras':'Kahramanmaraş',Kinkkale:'Kırıkkale',Kirklareli:'Kırklareli',Kirsehir:'Kırşehir',Mugla:'Muğla',Mus:'Muş',Nevsehir:'Nevşehir',Nigde:'Niğde',Sanliurfa:'Şanlıurfa',Sirnak:'Şırnak',Tekirdag:'Tekirdağ',Usak:'Uşak',Zinguldak:'Zonguldak','Çankiri':'Çankırı'};
// İl merkezi: Natural Earth 1:10m populated places (Admin-1 capital); NE'de olmayan 9 il merkezi elle (GeoNames).
const P=JSON.parse(fs.readFileSync(NE+'ne_10m_populated_places_simple.geojson')).features.filter(f=>f.properties.adm0_a3==='TUR');
const NEMAP={Adana:'Adana','Adıyaman':'Adıyaman',Afyonkarahisar:'Afyon',Amasya:'Amasya',Ankara:'Ankara',Antalya:'Antalya',Artvin:'Artvin','Aydın':'Aydın','Ağrı':'Ağrı','Balıkesir':'Balıkesir',Batman:'Batman',Bilecik:'Bilecik','Bingöl':'Bingöl',Bitlis:'Bitlis',Bolu:'Bolu',Burdur:'Burdur',Bursa:'Bursa','Çorum':'Corum',Denizli:'Denizli','Diyarbakır':'Diyarbakır',Edirne:'Edirne','Elazığ':'Elâzığ',Erzincan:'Erzincan',Erzurum:'Erzurum','Eskişehir':'Eskişehir',Gaziantep:'Gaziantep',Giresun:'Giresun','Gümüşhane':'Gümüşhane',Hakkari:'Hakkâri',Hatay:'Antakya',Mersin:'Icel',Isparta:'Isparta','İstanbul':'Istanbul','Kahramanmaraş':'Kahramanmaraş','Karabük':'Karabük',Karaman:'Karaman',Kars:'Kars',Kastamonu:'Kastamonu',Kayseri:'Kayseri',Kilis:'Kilis',Konya:'Konya','Kütahya':'Kütahya','Kırklareli':'Kırklareli','Kırıkkale':'Kırıkkale','Kırşehir':'Kırşehir',Malatya:'Malatya',Manisa:'Manisa',Mardin:'Mardin','Muğla':'Muğla','Muş':'Muş','Nevşehir':'Nevşehir','Niğde':'Niğde',Ordu:'Ordu',Rize:'Rize',Sakarya:'Sakarya',Samsun:'Samsun',Siirt:'Siirt',Sinop:'Sinop',Sivas:'Sivas','Tekirdağ':'Tekirdağ',Tokat:'Tokat',Trabzon:'Trabzon',Tunceli:'Tunceli','Uşak':'Uşak',Van:'Van',Yozgat:'Yozgat',Zonguldak:'Zonguldak','Çanakkale':'Çanakkale','Çankırı':'Çankırı','İzmir':'İzmir',Kocaeli:'İzmit','Şanlıurfa':'Şanlıurfa'};
const MAN={'Aksaray':[34.0370,38.3687],'Ardahan':[42.7022,41.1105],'Bartın':[32.3375,41.6344],'Bayburt':[40.2249,40.2552],'Düzce':[31.1565,40.8438],'Iğdır':[44.0450,39.9237],'Osmaniye':[36.2478,37.0742],'Şırnak':[42.4611,37.5164],'Yalova':[29.2667,40.6500]};
const feats=A.features.filter(f=>f.properties.adm0_a3==='TUR').map(f=>{
  const ad=ADI[f.properties.name]||f.properties.name;
  let merkez, kaynak;
  if(MAN[ad]){merkez=MAN[ad];kaynak='geonames';}
  else{const q=P.find(p=>p.properties.name===NEMAP[ad]); if(!q) throw ad; merkez=q.geometry.coordinates.slice(0,2).map(v=>+v.toFixed(4)); kaynak='naturalearth';}
  return {type:'Feature',properties:{ad,merkez,kaynak},geometry:f.geometry};
});
console.log(feats.length);
let topo=topology({iller:{type:'FeatureCollection',features:feats}},1e5);
topo=presimplify(topo); topo=quantize(simplify(topo,quantile(topo,0.12)),1e5);
fs.writeFileSync('iller.topo.json',JSON.stringify(topo));
console.log(fs.statSync('iller.topo.json').size);
const caps=JSON.parse(fs.readFileSync(NE+'ne_10m_populated_places_simple.geojson')).features.filter(f=>f.properties.featurecla.startsWith('Admin-0 capital')).map(f=>({ad:f.properties.name,ulke:f.properties.adm0name,k:f.geometry.coordinates.slice(0,2).map(v=>+v.toFixed(4))}));
// Ankara'ya 1.600 km içindekiler yeter
const ank=caps.find(c=>c.ad==='Ankara').k;
const near=caps.filter(c=>d3.geoDistance(c.k,ank)*6371.0088<2200);
fs.writeFileSync('baskentler.json',JSON.stringify(near,null,1));
console.log(near.length, near.map(c=>c.ad).join(', '));
