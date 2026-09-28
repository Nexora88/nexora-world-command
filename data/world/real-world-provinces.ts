import type { Province, TerrainType } from "@/lib/types";

export interface ProvinceGeometry {
  type: "polygon";
  points: Array<{x:number;y:number}>;
}

export interface RealWorldProvince {
  id:string; name:string; country:string; countryCode:string; neighbors:string[];
  coordinates:{x:number;y:number}; geometry?:ProvinceGeometry; population?:number; terrain?:TerrainType;
}
type CitySeed={name:string;lat:number;lon:number;population:number;terrain:TerrainType};
type CountrySeed={id:string;name:string;displayName:string;capital:string;color:string;cities:CitySeed[]};

const C=(name:string,lat:number,lon:number,population:number,terrain:TerrainType):CitySeed=>({name,lat,lon,population,terrain});
const countrySeeds:CountrySeed[]=[
{id:"TR",name:"Turkey",displayName:"TÜRKİYE",capital:"Ankara",color:"#45c878",cities:[
C("Istanbul",41.01,28.98,15800000,"urban"),C("Edirne",41.68,26.56,420000,"plains"),C("Ankara",39.93,32.86,5800000,"urban"),C("Izmir",38.42,27.14,4400000,"coast"),C("Bursa",40.19,29.06,3200000,"urban"),C("Antalya",36.89,30.70,2700000,"coast"),C("Adana",37.00,35.32,2300000,"plains"),C("Gaziantep",37.07,37.38,2100000,"urban"),C("Konya",37.87,32.49,2300000,"plains"),C("Kayseri",38.72,35.48,1450000,"mountain"),C("Samsun",41.28,36.33,1400000,"coast"),C("Trabzon",41.00,39.72,820000,"coast"),C("Erzurum",39.90,41.27,750000,"mountain"),C("Malatya",38.35,38.31,810000,"mountain"),C("Diyarbakir",37.91,40.24,1800000,"plains"),C("Canakkale",40.15,26.41,550000,"coast")]},
{id:"PT",name:"Portugal",displayName:"PORTEKİZ",capital:"Lisbon",color:"#4a9d72",cities:[C("Lisbon",38.72,-9.14,2900000,"urban"),C("Porto",41.15,-8.61,1700000,"coast"),C("Faro",37.02,-7.93,500000,"coast")]},
{id:"ES",name:"Spain",displayName:"İSPANYA",capital:"Madrid",color:"#c99a4a",cities:[C("Madrid",40.42,-3.70,6700000,"urban"),C("Barcelona",41.39,2.17,5700000,"urban"),C("Seville",37.39,-5.99,1500000,"urban"),C("Valencia",39.47,-0.38,1600000,"coast")]},
{id:"FR",name:"France",displayName:"FRANSA",capital:"Paris",color:"#557fc5",cities:[C("Paris",48.86,2.35,11000000,"urban"),C("Lyon",45.76,4.84,2300000,"urban"),C("Marseille",43.30,5.37,1800000,"coast"),C("Bordeaux",44.84,-0.58,1000000,"coast")]},
{id:"BE",name:"Belgium",displayName:"BELÇİKA",capital:"Brussels",color:"#8e73b8",cities:[C("Brussels",50.85,4.35,2100000,"urban"),C("Antwerp",51.22,4.40,1100000,"coast"),C("Liege",50.63,5.58,620000,"urban")]},
{id:"NL",name:"Netherlands",displayName:"HOLLANDA",capital:"Amsterdam",color:"#d27b4b",cities:[C("Amsterdam",52.37,4.90,2500000,"urban"),C("Rotterdam",51.92,4.48,3200000,"coast"),C("Eindhoven",51.44,5.48,800000,"urban")]},
{id:"LU",name:"Luxembourg",displayName:"LÜKSEMBURG",capital:"Luxembourg",color:"#777fae",cities:[C("Luxembourg",49.61,6.13,130000,"urban"),C("Esch",49.50,5.98,37000,"urban")]},
{id:"DE",name:"Germany",displayName:"ALMANYA",capital:"Berlin",color:"#d5a84b",cities:[C("Berlin",52.52,13.41,3700000,"urban"),C("Hamburg",53.55,10.00,1900000,"coast"),C("Munich",48.14,11.58,1500000,"urban"),C("Frankfurt",50.11,8.68,800000,"urban"),C("Cologne",50.94,6.96,1100000,"urban"),C("Stuttgart",48.78,9.18,650000,"hills"),C("Dresden",51.05,13.74,560000,"hills"),C("Leipzig",51.34,12.37,620000,"plains"),C("Dusseldorf",51.23,6.78,620000,"urban"),C("Hannover",52.38,9.73,540000,"plains")]},
{id:"CH",name:"Switzerland",displayName:"İSVİÇRE",capital:"Bern",color:"#b84f59",cities:[C("Bern",46.95,7.45,420000,"hills"),C("Zurich",47.38,8.54,1500000,"urban"),C("Geneva",46.20,6.14,600000,"urban")]},
{id:"AT",name:"Austria",displayName:"AVUSTURYA",capital:"Vienna",color:"#b85b68",cities:[C("Vienna",48.21,16.37,2000000,"urban"),C("Graz",47.07,15.44,650000,"hills"),C("Salzburg",47.81,13.05,450000,"mountain")]},
{id:"IT",name:"Italy",displayName:"İTALYA",capital:"Rome",color:"#4f9a79",cities:[C("Rome",41.90,12.50,4300000,"urban"),C("Milan",45.46,9.19,4300000,"urban"),C("Naples",40.85,14.27,3000000,"coast"),C("Turin",45.07,7.69,1700000,"urban")]},
{id:"MC",name:"Monaco",displayName:"MONAKO",capital:"Monaco",color:"#9c6685",cities:[C("Monaco",43.74,7.42,39000,"coast")]},
{id:"SM",name:"San Marino",displayName:"SAN MARİNO",capital:"San Marino",color:"#6f87a9",cities:[C("San Marino",43.94,12.45,34000,"hills")]},
{id:"VA",name:"Vatican City",displayName:"VATİKAN",capital:"Vatican City",color:"#9d835d",cities:[C("Vatican City",41.90,12.45,800,"urban")]},
{id:"GB",name:"United Kingdom",displayName:"BİRLEŞİK KRALLIK",capital:"London",color:"#6f9fe8",cities:[C("London",51.51,-0.13,8900000,"urban"),C("Birmingham",52.48,-1.90,1150000,"urban"),C("Manchester",53.48,-2.24,550000,"urban"),C("Liverpool",53.41,-2.99,500000,"coast"),C("Leeds",53.80,-1.55,800000,"urban"),C("Bristol",51.45,-2.59,480000,"coast"),C("Sheffield",53.38,-1.47,590000,"hills"),C("Newcastle",54.98,-1.62,300000,"coast"),C("Nottingham",52.95,-1.15,330000,"plains")]},
{id:"IE",name:"Ireland",displayName:"İRLANDA",capital:"Dublin",color:"#4e9a68",cities:[C("Dublin",53.35,-6.26,1400000,"urban"),C("Cork",51.90,-8.47,220000,"coast"),C("Galway",53.27,-9.05,85000,"coast")]},
{id:"IS",name:"Iceland",displayName:"İZLANDA",capital:"Reykjavik",color:"#638eaa",cities:[C("Reykjavik",64.15,-21.94,140000,"coast"),C("Akureyri",65.68,-18.10,20000,"coast")]},
{id:"DK",name:"Denmark",displayName:"DANİMARKA",capital:"Copenhagen",color:"#a95c64",cities:[C("Copenhagen",55.68,12.57,1400000,"coast"),C("Aarhus",56.16,10.20,350000,"coast"),C("Odense",55.40,10.39,180000,"plains")]},
{id:"NO",name:"Norway",displayName:"NORVEÇ",capital:"Oslo",color:"#5b7fa3",cities:[C("Oslo",59.91,10.75,1100000,"urban"),C("Bergen",60.39,5.32,290000,"coast"),C("Trondheim",63.43,10.40,210000,"coast")]},
{id:"SE",name:"Sweden",displayName:"İSVEÇ",capital:"Stockholm",color:"#6d8e56",cities:[C("Stockholm",59.33,18.07,2400000,"coast"),C("Gothenburg",57.71,11.97,1050000,"coast"),C("Malmo",55.60,13.00,750000,"urban"),C("Umea",63.83,20.26,130000,"tundra")]},
{id:"FI",name:"Finland",displayName:"FİNLANDİYA",capital:"Helsinki",color:"#6d8797",cities:[C("Helsinki",60.17,24.94,1300000,"coast"),C("Tampere",61.50,23.76,400000,"forest"),C("Turku",60.45,22.27,300000,"coast"),C("Oulu",65.01,25.47,215000,"tundra")]},
{id:"EE",name:"Estonia",displayName:"ESTONYA",capital:"Tallinn",color:"#5b7f9e",cities:[C("Tallinn",59.44,24.75,450000,"coast"),C("Tartu",58.38,26.72,100000,"plains")]},
{id:"LV",name:"Latvia",displayName:"LETONYA",capital:"Riga",color:"#795d69",cities:[C("Riga",56.95,24.11,620000,"urban"),C("Daugavpils",55.87,26.52,80000,"plains")]},
{id:"LT",name:"Lithuania",displayName:"LİTVANYA",capital:"Vilnius",color:"#71875b",cities:[C("Vilnius",54.69,25.28,590000,"urban"),C("Kaunas",54.90,23.90,300000,"urban"),C("Klaipeda",55.70,21.14,150000,"coast")]},
{id:"PL",name:"Poland",displayName:"POLONYA",capital:"Warsaw",color:"#a96c6c",cities:[C("Warsaw",52.23,21.01,1800000,"urban"),C("Krakow",50.06,19.94,800000,"urban"),C("Gdansk",54.35,18.65,470000,"coast"),C("Wroclaw",51.11,17.03,670000,"urban"),C("Poznan",52.41,16.93,540000,"plains")]},
{id:"CZ",name:"Czech Republic",displayName:"ÇEKYA",capital:"Prague",color:"#66809a",cities:[C("Prague",50.08,14.44,1400000,"urban"),C("Brno",49.20,16.61,400000,"urban"),C("Ostrava",49.83,18.28,280000,"urban")]},
{id:"SK",name:"Slovakia",displayName:"SLOVAKYA",capital:"Bratislava",color:"#758d70",cities:[C("Bratislava",48.15,17.11,475000,"urban"),C("Kosice",48.72,21.26,230000,"urban")]},
{id:"HU",name:"Hungary",displayName:"MACARİSTAN",capital:"Budapest",color:"#9b6d57",cities:[C("Budapest",47.50,19.04,1800000,"urban"),C("Debrecen",47.53,21.63,200000,"plains"),C("Szeged",46.25,20.15,160000,"plains")]},
{id:"SI",name:"Slovenia",displayName:"SLOVENYA",capital:"Ljubljana",color:"#6f8d78",cities:[C("Ljubljana",46.06,14.51,300000,"urban"),C("Maribor",46.55,15.65,115000,"hills")]},
{id:"HR",name:"Croatia",displayName:"HIRVATİSTAN",capital:"Zagreb",color:"#8d6674",cities:[C("Zagreb",45.81,15.98,800000,"urban"),C("Split",43.51,16.44,180000,"coast"),C("Rijeka",45.33,14.44,130000,"coast")]},
{id:"BA",name:"Bosnia and Herzegovina",displayName:"BOSNA HERSEK",capital:"Sarajevo",color:"#6f788c",cities:[C("Sarajevo",43.86,18.41,275000,"hills"),C("Banja Luka",44.77,17.19,185000,"hills"),C("Mostar",43.34,17.81,110000,"hills")]},
{id:"RS",name:"Serbia",displayName:"SIRBİSTAN",capital:"Belgrade",color:"#9a6b6b",cities:[C("Belgrade",44.79,20.45,1400000,"urban"),C("Novi Sad",45.27,19.83,300000,"plains"),C("Nis",43.32,21.90,190000,"hills")]},
{id:"ME",name:"Montenegro",displayName:"KARADAĞ",capital:"Podgorica",color:"#777b92",cities:[C("Podgorica",42.44,19.26,190000,"urban"),C("Niksic",42.77,18.95,55000,"hills")]},
{id:"MK",name:"North Macedonia",displayName:"KUZEY MAKEDONYA",capital:"Skopje",color:"#9c744c",cities:[C("Skopje",42.00,21.43,600000,"urban"),C("Bitola",41.03,21.34,70000,"hills")]},
{id:"AL",name:"Albania",displayName:"ARNAVUTLUK",capital:"Tirana",color:"#925d67",cities:[C("Tirana",41.33,19.82,900000,"urban"),C("Durres",41.32,19.45,200000,"coast"),C("Vlore",40.47,19.49,130000,"coast")]},
{id:"RO",name:"Romania",displayName:"ROMANYA",capital:"Bucharest",color:"#637e9e",cities:[C("Bucharest",44.43,26.10,2200000,"urban"),C("Cluj-Napoca",46.77,23.59,325000,"hills"),C("Constanta",44.17,28.65,300000,"coast"),C("Iasi",47.16,27.59,370000,"plains")]},
{id:"BG",name:"Bulgaria",displayName:"BULGARİSTAN",capital:"Sofia",color:"#78905f",cities:[C("Sofia",42.70,23.32,1300000,"urban"),C("Plovdiv",42.14,24.75,340000,"plains"),C("Varna",43.21,27.91,330000,"coast")]},
{id:"GR",name:"Greece",displayName:"YUNANİSTAN",capital:"Athens",color:"#5e7fa1",cities:[C("Athens",37.98,23.73,3700000,"urban"),C("Thessaloniki",40.64,22.94,1050000,"urban"),C("Patras",38.25,21.73,215000,"coast")]},
{id:"MD",name:"Moldova",displayName:"MOLDOVA",capital:"Chisinau",color:"#7b8a68",cities:[C("Chisinau",47.01,28.86,700000,"urban"),C("Balti",47.76,27.93,100000,"plains")]},
{id:"UA",name:"Ukraine",displayName:"UKRAYNA",capital:"Kyiv",color:"#7d8d52",cities:[C("Kyiv",50.45,30.52,2900000,"urban"),C("Lviv",49.84,24.03,720000,"urban"),C("Odesa",46.48,30.72,1000000,"coast"),C("Dnipro",48.46,35.05,970000,"urban"),C("Kharkiv",49.99,36.23,1400000,"urban")]},
{id:"BY",name:"Belarus",displayName:"BELARUS",capital:"Minsk",color:"#72826b",cities:[C("Minsk",53.90,27.56,2100000,"urban"),C("Brest",52.10,23.69,340000,"plains"),C("Gomel",52.43,31.00,500000,"plains")]},
{id:"RU",name:"Russia",displayName:"RUSYA",capital:"Moscow",color:"#c96b6b",cities:[C("Moscow",55.76,37.62,13000000,"urban"),C("Saint Petersburg",59.93,30.33,5600000,"coast"),C("Nizhny Novgorod",56.33,44.00,1250000,"plains"),C("Kazan",55.79,49.12,1300000,"plains"),C("Voronezh",51.67,39.18,1050000,"plains"),C("Rostov",47.24,39.71,1100000,"plains"),C("Volgograd",48.71,44.51,1000000,"plains"),C("Samara",53.20,50.15,1200000,"plains"),C("Yekaterinburg",56.84,60.61,1500000,"hills"),C("Novosibirsk",55.03,82.92,1600000,"plains")]},

]
// Phase 11 seed expansion: a small, verified set of additional provinces for major playable countries.
const EXTRA_PROVINCES:Record<string,CitySeed[]>={
  TR:[C("Kocaeli",40.77,29.94,2050000,"urban"),C("Manisa",38.62,27.43,1450000,"plains"),C("Mersin",36.80,34.63,1900000,"coast"),C("Hatay",36.20,36.16,1650000,"coast"),C("Sivas",39.75,37.02,650000,"hills")],
  DE:[C("Bremen",53.08,8.80,680000,"coast"),C("Essen",51.46,7.01,580000,"urban"),C("Nuremberg",49.45,11.08,550000,"urban"),C("Bonn",50.74,7.10,340000,"urban")],
  FR:[C("Toulouse",43.60,1.44,1050000,"urban"),C("Nice",43.71,7.26,950000,"coast"),C("Nantes",47.22,-1.55,650000,"coast"),C("Strasbourg",48.57,7.75,500000,"urban")],
  GB:[C("Edinburgh",55.95,-3.19,530000,"hills"),C("Glasgow",55.86,-4.25,1200000,"urban"),C("Cardiff",51.48,-3.18,370000,"coast"),C("Belfast",54.60,-5.93,340000,"coast")],
  RU:[C("Smolensk",54.78,32.04,330000,"hills"),C("Kursk",51.73,36.19,440000,"plains"),C("Krasnodar",45.04,38.98,1100000,"plains"),C("Saratov",51.53,46.03,840000,"plains")]
};
for(const country of countrySeeds){const extra=EXTRA_PROVINCES[country.id];if(extra)country.cities.push(...extra);}
const FLAGS:Record<string,string>={TR:"🇹🇷",PT:"🇵🇹",ES:"🇪🇸",FR:"🇫🇷",BE:"🇧🇪",NL:"🇳🇱",LU:"🇱🇺",DE:"🇩🇪",CH:"🇨🇭",AT:"🇦🇹",IT:"🇮🇹",MC:"🇲🇨",SM:"🇸🇲",VA:"🇻🇦",GB:"🇬🇧",IE:"🇮🇪",IS:"🇮🇸",DK:"🇩🇰",NO:"🇳🇴",SE:"🇸🇪",FI:"🇫🇮",EE:"🇪🇪",LV:"🇱🇻",LT:"🇱🇹",PL:"🇵🇱",CZ:"🇨🇿",SK:"🇸🇰",HU:"🇭🇺",SI:"🇸🇮",HR:"🇭🇷",BA:"🇧🇦",RS:"🇷🇸",ME:"🇲🇪",MK:"🇲🇰",AL:"🇦🇱",RO:"🇷🇴",BG:"🇧🇬",GR:"🇬🇷",MD:"🇲🇩",UA:"🇺🇦",BY:"🇧🇾",RU:"🇷🇺"};
const X=(lon:number)=>Math.max(0.5,Math.min(99.5,((lon+180)/360)*100));
const Y=(lat:number)=>Math.max(0.5,Math.min(55.75,((90-lat)/180)*56.25));
const terrainDefaults=(terrain:TerrainType)=>({movementModifier:terrain==="mountain"?.5:terrain==="forest"?.75:terrain==="urban"?.65:terrain==="coast"?.9:terrain==="hills"?.8:terrain==="tundra"?.65:1,defenseModifier:terrain==="mountain"?1.3:terrain==="forest"?1.15:terrain==="urban"?1.25:terrain==="hills"?1.1:1,visibilityModifier:terrain==="forest"?.65:terrain==="mountain"?.75:1,supplyModifier:terrain==="mountain"?.8:terrain==="tundra"?.8:1});
const cityId=(code:string,name:string)=>`${code}_${name.toUpperCase().replace(/[^A-Z]+/g,"_").replace(/^_|_$/g,"")}`;
const distance=(a:CitySeed,b:CitySeed)=>Math.hypot(a.lat-b.lat,a.lon-b.lon);
const COUNTRY_BORDERS:[string,string][]= [
["PT","ES"],["ES","FR"],["FR","BE"],["FR","LU"],["FR","DE"],["FR","CH"],["FR","IT"],["BE","NL"],["BE","DE"],["BE","LU"],["NL","DE"],["LU","DE"],["LU","BE"],
["DE","CH"],["DE","AT"],["DE","CZ"],["DE","PL"],["DE","DK"],["CH","AT"],["CH","IT"],["AT","IT"],["AT","CZ"],["AT","SK"],["AT","HU"],["CZ","PL"],["CZ","SK"],["PL","SK"],["PL","LT"],["PL","BY"],["PL","UA"],["SK","HU"],["SK","UA"],["HU","SI"],["HU","HR"],["HU","RS"],["SI","IT"],["SI","HR"],["HR","BA"],["HR","RS"],["BA","RS"],["BA","ME"],["RS","ME"],["RS","MK"],["RS","BG"],["ME","AL"],["ME","MK"],["AL","MK"],["AL","GR"],["MK","GR"],["BG","GR"],["BG","RO"],["RO","HU"],["RO","RS"],["RO","MD"],["RO","UA"],["MD","UA"],["UA","BY"],["UA","RU"],["BY","RU"],["BY","LT"],["BY","LV"],["LT","LV"],["LT","RU"],["LV","EE"],["EE","RU"],["FI","RU"],["NO","SE"],["SE","FI"],["DK","DE"],["IT","SM"],["IT","VA"],["IT","MC"]
];COUNTRY_BORDERS.push(["TR","BG"],["TR","GR"]);
const seeds:RealWorldProvince[]=[];
for(const country of countrySeeds){
  for(const city of country.cities){
    seeds.push({id:cityId(country.id,city.name),name:city.name,country:country.name,countryCode:country.id,neighbors:[],coordinates:{x:X(city.lon),y:Y(city.lat)},population:city.population,terrain:city.terrain});
  }
}
const byId=new Map(seeds.map(p=>[p.id,p]));
const seedByCode=new Map(countrySeeds.map(c=>[c.id,c]));

function clipCell(subject:{x:number;y:number}[], site:{x:number;y:number}, other:{x:number;y:number}[]){
  if(subject.length<3)return subject;
  const out:{x:number;y:number}[]=[];
  const value=(p:{x:number;y:number})=>(p.x-site.x)*(p.x-site.x)+(p.y-site.y)*(p.y-site.y)-((p.x-other[0].x)*(p.x-other[0].x)+(p.y-other[0].y)*(p.y-other[0].y));
  for(let i=0;i<subject.length;i++){
    const a=subject[i],b=subject[(i+1)%subject.length],va=value(a),vb=value(b),ain=va<=0,bin=vb<=0;
    if(ain)out.push(a);
    if(ain!==bin){const t=va/(va-vb);out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});}
  }
  return out;
}
function buildVoronoiGeometry(){
  const sites=seeds.map(p=>({id:p.id,x:p.coordinates.x,y:p.coordinates.y}));
  const bounds=[{x:0,y:0},{x:100,y:0},{x:100,y:56.25},{x:0,y:56.25}];
  for(const site of sites){
    let cell=bounds.map(p=>({...p}));
    for(const other of sites){if(other.id===site.id||cell.length<3)continue;cell=clipCell(cell,{x:site.x,y:site.y},[{x:other.x,y:other.y}]);}
    const province=byId.get(site.id);if(province&&cell.length>=3)province.geometry={type:"polygon",points:cell};
  }
}
buildVoronoiGeometry();
const addEdge=(a:string,b:string)=>{
  const pa=byId.get(a),pb=byId.get(b);if(!pa||!pb)return;
  if(!pa.neighbors.includes(pb.id))pa.neighbors.push(pb.id);
  if(!pb.neighbors.includes(pa.id))pb.neighbors.push(pa.id);
};
for(const country of countrySeeds){
  const cities=country.cities;
  for(const city of cities){
    const nearest=[...cities].filter(other=>other!==city).sort((a,b)=>distance(city,a)-distance(city,b)).slice(0,2);
    for(const other of nearest)addEdge(cityId(country.id,city.name),cityId(country.id,other.name));
  }
}
for(const [a,b] of COUNTRY_BORDERS){
  const ca=seedByCode.get(a),cb=seedByCode.get(b);if(!ca||!cb)continue;
  let bestA=ca.cities[0],bestB=cb.cities[0],best=Infinity;
  for(const x of ca.cities)for(const y of cb.cities){const d=distance(x,y);if(d<best){best=d;bestA=x;bestB=y;}}
  addEdge(cityId(a,bestA.name),cityId(b,bestB.name));
}
export const REAL_WORLD_PROVINCES:Record<string,RealWorldProvince>=Object.fromEntries(seeds.map(p=>[p.id,p]));
export const REAL_WORLD_COUNTRIES=countrySeeds.map(c=>({id:c.id,name:c.name,displayName:c.displayName,countryCode:c.id,capitalProvinceId:cityId(c.id,c.capital),color:c.color,flag:FLAGS[c.id]}));
export const EUROPEAN_COUNTRY_COUNT=REAL_WORLD_COUNTRIES.length;
export const EUROPEAN_PROVINCE_COUNT=seeds.length;
export const getCountryFlag=(countryId:string)=>FLAGS[countryId]??"🏳️";
export const realWorldProvincesAsGameData:Province[]=seeds.map((p,i)=>{
  const dev=Math.min(10,Math.max(1,Math.round((p.population??500000)/1500000)));
  const industrial=Math.max(1,Math.round((p.population??500000)/1000000));
  const capital=p.id===REAL_WORLD_COUNTRIES.find(c=>c.id===p.countryCode)?.capitalProvinceId;
  const strategic=p.countryCode==="TR"&&["TR_ISTANBUL","TR_IZMIR","TR_KOCAELI","TR_GAZIANTEP"].includes(p.id);
  const baseBuildings={industrialComplex:Math.min(3,Math.max(1,Math.round(industrial/2))),barracks:capital||strategic||i%3===0?2:1,fortification:capital||i%5===0?2:1};
  return {id:p.id,name:p.name,ownerId:p.countryCode,countryId:p.countryCode,population:p.population??0,terrain:p.terrain??"plains",neighbors:p.neighbors,industryLevel:industrial,barracksLevel:baseBuildings.barracks,fortificationLevel:baseBuildings.fortification,infrastructureLevel:Math.min(5,Math.max(1,Math.round(dev/2))),buildings:baseBuildings,coordinates:[p.coordinates.x,p.coordinates.y],weather:"clear",developmentLevel:dev,...terrainDefaults(p.terrain??"plains")};
});
