import { provinces as initialProvinces } from "@/data/provinces";
import { getCountries, getCountry, applyCapitalLoss, resetCountries } from "@/game/nation/server/nation-store";
import type { Province } from "@/lib/types";
import { nations } from "@/data/world/countries";
import { districts } from "@/data/world/districts";
import { cities } from "@/data/world/cities";
import { populationStates } from "@/data/world/population";
import { provinceDevelopment } from "@/data/world/development";
import { resourcesMap } from "@/data/world/resources-map";
let world:Province[]=initialProvinces.map(p=>({...p,neighbors:[...p.neighbors],buildings:{...p.buildings}}));
let capitalLoss=new Set<string>();
export const getWorld=()=>world.map(p=>({...p,neighbors:[...p.neighbors],buildings:{...p.buildings}}));
export const getProvince=(id:string)=>world.find(p=>p.id===id);
export const getNation=(id:string)=>getCountry(id);
export const getDistricts=(provinceId?:string)=>districts.filter(d=>!provinceId||d.provinceId===provinceId);
export const getCities=(districtId?:string)=>cities.filter(c=>!districtId||c.districtId===districtId);
export const getPopulation=(provinceId?:string)=>populationStates.filter(p=>!provinceId||p.provinceId===provinceId).map(p=>({...p,groups:{...p.groups}}));
export const getDevelopment=(provinceId?:string)=>provinceDevelopment.filter(p=>!provinceId||p.provinceId===provinceId);
export const getResourcesMap=(provinceId?:string)=>resourcesMap.filter(p=>!provinceId||p.provinceId===provinceId);
export function setProvinceOwner(provinceId:string,ownerId:string){
 const province=getProvince(provinceId); if(!province)throw new Error("Province does not exist.");
 if(!nations.some(c=>c.id===ownerId))throw new Error("Country does not exist.");
 province.ownerId=ownerId; province.countryId=ownerId;
 if(nations.some(n=>n.capitalProvinceId===provinceId&&n.id!==ownerId)){const lost=nations.find(n=>n.capitalProvinceId===provinceId)!.id;capitalLoss.add(lost);applyCapitalLoss(lost);}
 return {...province,neighbors:[...province.neighbors],buildings:{...province.buildings}};
}
export function resetWorld(){world=initialProvinces.map(p=>({...p,neighbors:[...p.neighbors],buildings:{...p.buildings}}));capitalLoss.clear();resetCountries();}
export function getCapitalState(countryId:string){const n=getNation(countryId);if(!n)return undefined;const p=getProvince(n.capitalProvinceId);return {capitalProvinceId:n.capitalProvinceId,lost:p?.ownerId!==countryId||capitalLoss.has(countryId)};}
export function getWorldMap(){return {countries:getCountries(),provinces:getWorld(),districts,cities,population:populationStates,development:provinceDevelopment,resources:resourcesMap,capitalLoss:[...capitalLoss]};}
