import type { Province, TerrainType } from "@/lib/types";

export interface RealWorldProvince {
  id:string; name:string; country:string; countryCode:string; neighbors:string[];
  coordinates:{x:number;y:number}; population?:number; terrain?:TerrainType;
}

type Seed=Omit<RealWorldProvince,"neighbors"> & {neighbors:string[]};

const TR="Turkey",DE="Germany",GB="United Kingdom",RU="Russia";
const seeds:Seed[]=[
{id:"TR_ISTANBUL",name:"Istanbul",country:TR,countryCode:"TR",coordinates:{x:43,y:55},population:15800000,terrain:"urban",neighbors:["TR_EDIRNE","TR_BURSA","TR_ANKARA"]},
{id:"TR_EDIRNE",name:"Edirne",country:TR,countryCode:"TR",coordinates:{x:37,y:53},population:420000,terrain:"plains",neighbors:["TR_ISTANBUL","TR_CANAKKALE"]},
{id:"TR_CANAKKALE",name:"Canakkale",country:TR,countryCode:"TR",coordinates:{x:38,y:60},population:550000,terrain:"coast",neighbors:["TR_EDIRNE","TR_IZMIR","TR_BURSA"]},
{id:"TR_BURSA",name:"Bursa",country:TR,countryCode:"TR",coordinates:{x:43,y:61},population:3200000,terrain:"urban",neighbors:["TR_ISTANBUL","TR_CANAKKALE","TR_ANKARA","TR_IZMIR"]},
{id:"TR_IZMIR",name:"Izmir",country:TR,countryCode:"TR",coordinates:{x:39,y:70},population:4400000,terrain:"coast",neighbors:["TR_CANAKKALE","TR_BURSA","TR_ANTALYA"]},
{id:"TR_ANKARA",name:"Ankara",country:TR,countryCode:"TR",coordinates:{x:52,y:64},population:5800000,terrain:"urban",neighbors:["TR_ISTANBUL","TR_BURSA","TR_KONYA","TR_KAYSERI","TR_SAMSUN"]},
{id:"TR_KONYA",name:"Konya",country:TR,countryCode:"TR",coordinates:{x:51,y:73},population:2300000,terrain:"plains",neighbors:["TR_ANKARA","TR_ANTALYA","TR_KAYSERI"]},
{id:"TR_ANTALYA",name:"Antalya",country:TR,countryCode:"TR",coordinates:{x:48,y:80},population:2700000,terrain:"coast",neighbors:["TR_IZMIR","TR_KONYA","TR_ADANA"]},
{id:"TR_ADANA",name:"Adana",country:TR,countryCode:"TR",coordinates:{x:59,y:81},population:2300000,terrain:"plains",neighbors:["TR_ANTALYA","TR_KAYSERI","TR_GAZIANTEP"]},
{id:"TR_KAYSERI",name:"Kayseri",country:TR,countryCode:"TR",coordinates:{x:60,y:69},population:1450000,terrain:"mountain",neighbors:["TR_ANKARA","TR_KONYA","TR_ADANA","TR_MALATYA","TR_ERZURUM"]},
{id:"TR_SAMSUN",name:"Samsun",country:TR,countryCode:"TR",coordinates:{x:61,y:55},population:1400000,terrain:"coast",neighbors:["TR_ANKARA","TR_TRABZON","TR_ERZURUM"]},
{id:"TR_TRABZON",name:"Trabzon",country:TR,countryCode:"TR",coordinates:{x:72,y:57},population:820000,terrain:"coast",neighbors:["TR_SAMSUN","TR_ERZURUM"]},
{id:"TR_ERZURUM",name:"Erzurum",country:TR,countryCode:"TR",coordinates:{x:72,y:68},population:750000,terrain:"mountain",neighbors:["TR_TRABZON","TR_SAMSUN","TR_KAYSERI","TR_MALATYA","TR_DIYARBAKIR"]},
{id:"TR_MALATYA",name:"Malatya",country:TR,countryCode:"TR",coordinates:{x:67,y:76},population:810000,terrain:"mountain",neighbors:["TR_KAYSERI","TR_ERZURUM","TR_DIYARBAKIR","TR_GAZIANTEP"]},
{id:"TR_GAZIANTEP",name:"Gaziantep",country:TR,countryCode:"TR",coordinates:{x:62,y:84},population:2100000,terrain:"urban",neighbors:["TR_ADANA","TR_MALATYA","TR_DIYARBAKIR"]},
{id:"TR_DIYARBAKIR",name:"Diyarbakir",country:TR,countryCode:"TR",coordinates:{x:74,y:82},population:1800000,terrain:"plains",neighbors:["TR_MALATYA","TR_ERZURUM","TR_GAZIANTEP"]},

{id:"DE_BERLIN",name:"Berlin",country:DE,countryCode:"DE",coordinates:{x:54,y:25},population:3700000,terrain:"urban",neighbors:["DE_HANNOVER","DE_DRESDEN","DE_LEIPZIG"]},
{id:"DE_HAMBURG",name:"Hamburg",country:DE,countryCode:"DE",coordinates:{x:47,y:20},population:1900000,terrain:"coast",neighbors:["DE_HANNOVER","DE_COLOGNE"]},
{id:"DE_MUNICH",name:"Munich",country:DE,countryCode:"DE",coordinates:{x:54,y:38},population:1500000,terrain:"urban",neighbors:["DE_STUTTGART","DE_LEIPZIG"]},
{id:"DE_FRANKFURT",name:"Frankfurt",country:DE,countryCode:"DE",coordinates:{x:45,y:32},population:800000,terrain:"urban",neighbors:["DE_COLOGNE","DE_STUTTGART","DE_HANNOVER"]},
{id:"DE_COLOGNE",name:"Cologne",country:DE,countryCode:"DE",coordinates:{x:39,y:31},population:1100000,terrain:"urban",neighbors:["DE_HAMBURG","DE_FRANKFURT","DE_DUSSELDORF","DE_STUTTGART"]},
{id:"DE_STUTTGART",name:"Stuttgart",country:DE,countryCode:"DE",coordinates:{x:43,y:38},population:650000,terrain:"hills",neighbors:["DE_FRANKFURT","DE_MUNICH","DE_COLOGNE"]},
{id:"DE_DRESDEN",name:"Dresden",country:DE,countryCode:"DE",coordinates:{x:61,y:31},population:560000,terrain:"hills",neighbors:["DE_BERLIN","DE_LEIPZIG"]},
{id:"DE_LEIPZIG",name:"Leipzig",country:DE,countryCode:"DE",coordinates:{x:56,y:30},population:620000,terrain:"plains",neighbors:["DE_BERLIN","DE_DRESDEN","DE_MUNICH","DE_HANNOVER"]},
{id:"DE_DUSSELDORF",name:"Dusseldorf",country:DE,countryCode:"DE",coordinates:{x:37,y:28},population:620000,terrain:"urban",neighbors:["DE_COLOGNE","DE_HAMBURG"]},
{id:"DE_HANNOVER",name:"Hannover",country:DE,countryCode:"DE",coordinates:{x:47,y:26},population:540000,terrain:"plains",neighbors:["DE_HAMBURG","DE_BERLIN","DE_FRANKFURT","DE_LEIPZIG"]},

{id:"GB_LONDON",name:"London",country:GB,countryCode:"GB",coordinates:{x:25,y:32},population:8900000,terrain:"urban",neighbors:["GB_BIRMINGHAM","GB_BRISTOL"]},
{id:"GB_MANCHESTER",name:"Manchester",country:GB,countryCode:"GB",coordinates:{x:21,y:23},population:550000,terrain:"urban",neighbors:["GB_LIVERPOOL","GB_LEEDS","GB_BIRMINGHAM"]},
{id:"GB_BIRMINGHAM",name:"Birmingham",country:GB,countryCode:"GB",coordinates:{x:22,y:29},population:1150000,terrain:"urban",neighbors:["GB_LONDON","GB_MANCHESTER","GB_NOTTINGHAM","GB_BRISTOL"]},
{id:"GB_LIVERPOOL",name:"Liverpool",country:GB,countryCode:"GB",coordinates:{x:18,y:25},population:500000,terrain:"coast",neighbors:["GB_MANCHESTER","GB_LEEDS"]},
{id:"GB_LEEDS",name:"Leeds",country:GB,countryCode:"GB",coordinates:{x:23,y:20},population:800000,terrain:"urban",neighbors:["GB_MANCHESTER","GB_SHEFFIELD","GB_NEWCASTLE"]},
{id:"GB_BRISTOL",name:"Bristol",country:GB,countryCode:"GB",coordinates:{x:17,y:35},population:480000,terrain:"coast",neighbors:["GB_LONDON","GB_BIRMINGHAM","GB_SHEFFIELD"]},
{id:"GB_SHEFFIELD",name:"Sheffield",country:GB,countryCode:"GB",coordinates:{x:24,y:25},population:590000,terrain:"hills",neighbors:["GB_LEEDS","GB_NOTTINGHAM","GB_BIRMINGHAM"]},
{id:"GB_NEWCASTLE",name:"Newcastle",country:GB,countryCode:"GB",coordinates:{x:26,y:15},population:300000,terrain:"coast",neighbors:["GB_LEEDS"]},
{id:"GB_NOTTINGHAM",name:"Nottingham",country:GB,countryCode:"GB",coordinates:{x:27,y:27},population:330000,terrain:"plains",neighbors:["GB_SHEFFIELD","GB_BIRMINGHAM"]},

{id:"RU_MOSCOW",name:"Moscow",country:RU,countryCode:"RU",coordinates:{x:78,y:20},population:13000000,terrain:"urban",neighbors:["RU_TVER","RU_NIZHNY_NOVGOROD","RU_VORONEZH"]},
{id:"RU_SAINT_PETERSBURG",name:"Saint Petersburg",country:RU,countryCode:"RU",coordinates:{x:72,y:11},population:5600000,terrain:"coast",neighbors:["RU_MOSCOW","RU_TVER"]},
{id:"RU_NOVOSIBIRSK",name:"Novosibirsk",country:RU,countryCode:"RU",coordinates:{x:94,y:39},population:1600000,terrain:"plains",neighbors:["RU_YEKATERINBURG","RU_SAMARA"]},
{id:"RU_KAZAN",name:"Kazan",country:RU,countryCode:"RU",coordinates:{x:86,y:27},population:1300000,terrain:"plains",neighbors:["RU_MOSCOW","RU_NIZHNY_NOVGOROD","RU_SAMARA"]},
{id:"RU_SAMARA",name:"Samara",country:RU,countryCode:"RU",coordinates:{x:89,y:35},population:1200000,terrain:"plains",neighbors:["RU_KAZAN","RU_VOLGOGRAD","RU_NOVOSIBIRSK","RU_VORONEZH"]},
{id:"RU_VOLGOGRAD",name:"Volgograd",country:RU,countryCode:"RU",coordinates:{x:84,y:45},population:1000000,terrain:"plains",neighbors:["RU_SAMARA","RU_ROSTOV","RU_VORONEZH"]},
{id:"RU_ROSTOV",name:"Rostov",country:RU,countryCode:"RU",coordinates:{x:78,y:49},population:1100000,terrain:"plains",neighbors:["RU_VOLGOGRAD","RU_VORONEZH"]},
{id:"RU_VORONEZH",name:"Voronezh",country:RU,countryCode:"RU",coordinates:{x:77,y:37},population:1050000,terrain:"plains",neighbors:["RU_MOSCOW","RU_SAMARA","RU_VOLGOGRAD","RU_ROSTOV"]},
{id:"RU_NIZHNY_NOVGOROD",name:"Nizhny Novgorod",country:RU,countryCode:"RU",coordinates:{x:84,y:24},population:1250000,terrain:"plains",neighbors:["RU_MOSCOW","RU_KAZAN"]},
{id:"RU_YEKATERINBURG",name:"Yekaterinburg",country:RU,countryCode:"RU",coordinates:{x:94,y:29},population:1500000,terrain:"hills",neighbors:["RU_KAZAN","RU_NOVOSIBIRSK"]}
];

export const REAL_WORLD_PROVINCES:Record<string,RealWorldProvince>=Object.fromEntries(seeds.map(p=>[p.id,p]));
export const REAL_WORLD_COUNTRIES=[
{id:"TR",name:"Turkey",displayName:"TÜRKİYE",countryCode:"TR",capitalProvinceId:"TR_ANKARA",color:"#45c878"},
{id:"DE",name:"Germany",displayName:"ALMANYA",countryCode:"DE",capitalProvinceId:"DE_BERLIN",color:"#d5a84b"},
{id:"GB",name:"United Kingdom",displayName:"İNGİLTERE",countryCode:"GB",capitalProvinceId:"GB_LONDON",color:"#6f9fe8"},
{id:"RU",name:"Russia",displayName:"RUSYA",countryCode:"RU",capitalProvinceId:"RU_MOSCOW",color:"#c96b6b"}
] as const;

const terrainDefaults=(terrain:TerrainType)=>({movementModifier:terrain==="mountain" ? .5 : terrain==="forest" ? .75 : terrain==="urban" ? .65 : terrain==="coast" ? .9 : terrain==="hills" ? .8 : 1,defenseModifier:terrain==="mountain"?1.3:terrain==="forest"?1.15:terrain==="urban"?1.25:1,visibilityModifier:terrain==="forest"?.65:terrain==="mountain"?.75:1,supplyModifier:terrain==="mountain"?.8:1});
export const realWorldProvincesAsGameData:Province[]=seeds.map((p,i)=>({id:p.id,name:p.name,ownerId:p.countryCode,countryId:p.countryCode,population:p.population??0,terrain:p.terrain??"plains",neighbors:p.neighbors,industryLevel:Math.max(1,Math.round((p.population??500000)/1000000)),barracksLevel:i%3===0?2:1,fortificationLevel:i%5===0?2:1,infrastructureLevel:Math.max(1,Math.round((p.population??500000)/1500000)),buildings:{industrialComplex:Math.max(1,Math.round((p.population??500000)/2000000)),barracks:i%3===0?2:1,fortification:i%5===0?2:1},coordinates:[p.coordinates.x,p.coordinates.y],weather:"clear",...terrainDefaults(p.terrain??"plains")}));
