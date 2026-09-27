import {REAL_WORLD_COUNTRIES,REAL_WORLD_PROVINCES} from "./real-world-provinces";

export interface StartingResources { money:number; food:number; steel:number; oil:number; rareMaterials:number; }
export interface Nation {
  id:string; name:string; displayName:string; countryCode:string; flag:string;
  capitalProvinceId:string; population:number; governmentType:string; stability:number;
  treasury:number; nationalPower:number; startingTechnologyLevel:number; startingResources:StartingResources;
  color:string;
}
const populationByCountry=(id:string)=>Object.values(REAL_WORLD_PROVINCES).filter(p=>p.countryCode===id).reduce((s,p)=>s+(p.population??0),0);
const government=(id:string)=>id==="GB"?"Constitutional Monarchy":id==="DE"?"Federal Republic":id==="FR"?"Republic":"Republic";
const nation=(c:(typeof REAL_WORLD_COUNTRIES)[number],i:number):Nation=>({
  id:c.id,name:c.name,displayName:c.displayName,countryCode:c.countryCode,flag:c.flag,
  capitalProvinceId:c.capitalProvinceId,population:populationByCountry(c.id),governmentType:government(c.id),
  stability:68+(i%5)*3,treasury:c.id==="TR"?125000:c.id==="DE"?140000:c.id==="GB"?135000:c.id==="RU"?150000:100000+i*2500,nationalPower:45+(i%9)*4,startingTechnologyLevel:1,
  startingResources:{money:100000+i*5000,food:50000+i*3000,steel:30000+i*2500,oil:20000+i*1800,rareMaterials:10000+i*700},
  color:c.color
});
export const nations:Nation[]=REAL_WORLD_COUNTRIES.map(nation);
export const getNationFlag=(id:string)=>nations.find(n=>n.id===id)?.flag??"🏳️";
