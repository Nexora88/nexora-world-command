"use client";
import { create } from "zustand";
import type { Resources } from "@/data/economy/resources";
import type { BuildingType } from "@/data/economy/buildings";
import type { UnitType } from "@/data/economy/units";
import type { Province } from "@/lib/types";
import type { EconomySnapshot } from "@/game/economy/server/types";
import type { Army } from "@/game/movement/server/types";
import type { War,BattleResult } from "@/game/war/server/types";
export type ProvinceBuildingLevels={industrialComplex:number;barracks:number;fortification:number;airBase?:number;navalBase?:number;infrastructure?:number;resourceCenter?:number;[key:string]:number|undefined};
export interface QueueItem{id:string;provinceId:string;type:BuildingType|UnitType;kind:"construction"|"production";startedAt:number;finishesAt:number;level?:number}
interface GameState{
 selectedProvinceId:string|null;resources:Resources;income:Resources;provinceBuildings:Record<string,ProvinceBuildingLevels>;
 productionQueue:QueueItem[];constructionQueue:QueueItem[];unitStockpile:Record<string,{infantry:number;tanks:number}>;provinces:Province[];armies:Army[];wars:War[];battles:BattleResult[];loading:boolean;error:string|null;
 selectProvince:(id:string|null)=>void;loadServerState:()=>Promise<void>;syncAll:()=>Promise<void>;
 startConstruction:(province:Province,type:BuildingType)=>Promise<boolean>;startProduction:(province:Province,unit:UnitType)=>Promise<boolean>;
 createArmy:(provinceId:string,name?:string)=>Promise<boolean>;moveArmy:(armyId:string,provinceId:string)=>Promise<boolean>;mergeArmies:(sourceArmyId:string,targetArmyId:string)=>Promise<boolean>;splitArmy:(armyId:string,infantry:number,tanks:number)=>Promise<boolean>;
 declareWar:(defender:string)=>Promise<boolean>;attack:(warId:string,armyId:string,provinceId:string)=>Promise<boolean>;
}
const EMPTY:Resources={money:0,manpower:0,oil:0,steel:0};
async function economy(action?:Record<string,string>){const r=await fetch("/api/economy",{method:action?"POST":"GET",headers:action?{"content-type":"application/json"}:undefined,body:action?JSON.stringify(action):undefined,cache:"no-store"});const p=await r.json();if(!r.ok)throw new Error(p.error);return p as EconomySnapshot}
export const useGameStore=create<GameState>((set,get)=>({
 selectedProvinceId:null,resources:EMPTY,income:EMPTY,provinceBuildings:{},productionQueue:[],constructionQueue:[],unitStockpile:{},provinces:[],armies:[],wars:[],battles:[],loading:true,error:null,
 selectProvince:id=>set({selectedProvinceId:id}),
 loadServerState:async()=>{try{const e=await economy();const [w,m,world]=await Promise.all([fetch("/api/war").then(x=>x.json()),fetch("/api/movement").then(x=>x.json()),fetch("/api/world").then(x=>x.json())]);set({resources:e.resources,income:e.income,provinceBuildings:e.provinceBuildings,constructionQueue:e.constructionQueue,productionQueue:e.productionQueue,unitStockpile:e.unitStockpile??m.stockpile??{},wars:w.wars,battles:w.battles,armies:m.armies,provinces:world.provinces,loading:false,error:null})}catch(e){set({loading:false,error:e instanceof Error?e.message:"Server sync failed."})}},
 syncAll:async()=>{await get().loadServerState()},
 startConstruction:async(p,t)=>{try{await economy({type:"startConstruction",provinceId:p.id,buildingType:t});await get().syncAll();return true}catch(e){set({error:e instanceof Error?e.message:"Construction failed."});return false}},
 startProduction:async(p,u)=>{try{await economy({type:"startProduction",provinceId:p.id,unitType:u});await get().syncAll();return true}catch(e){set({error:e instanceof Error?e.message:"Production failed."});return false}},
 createArmy:async(provinceId,name)=>{try{const r=await fetch("/api/movement",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({type:"createArmy",provinceId,name})});const p=await r.json();if(!r.ok)throw new Error(p.error);await get().syncAll();return true}catch(e){set({error:e instanceof Error?e.message:"Army creation failed."});return false}},
 moveArmy:async(armyId,provinceId)=>{try{const r=await fetch("/api/movement",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({type:"moveArmy",armyId,provinceId})});const p=await r.json();if(!r.ok)throw new Error(p.error);await get().syncAll();return true}catch(e){set({error:e instanceof Error?e.message:"Movement failed."});return false}},
 mergeArmies:async(sourceArmyId,targetArmyId)=>{try{const r=await fetch("/api/movement",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({type:"mergeArmies",sourceArmyId,targetArmyId})});const p=await r.json();if(!r.ok)throw new Error(p.error);await get().syncAll();return true}catch(e){set({error:e instanceof Error?e.message:"Army merge failed."});return false}},
 splitArmy:async(armyId,infantry,tanks)=>{try{const r=await fetch("/api/movement",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({type:"splitArmy",armyId,infantry,tanks})});const p=await r.json();if(!r.ok)throw new Error(p.error);await get().syncAll();return true}catch(e){set({error:e instanceof Error?e.message:"Army split failed."});return false}},
 declareWar:async(defender)=>{try{const r=await fetch("/api/war",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({type:"declareWar",defender})});const p=await r.json();if(!r.ok)throw new Error(p.error);await get().syncAll();return true}catch(e){set({error:e instanceof Error?e.message:"War declaration failed."});return false}},
 attack:async(warId,armyId,provinceId)=>{try{const r=await fetch("/api/war",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({type:"attack",warId,armyId,provinceId})});const p=await r.json();if(!r.ok)throw new Error(p.error);await get().syncAll();return true}catch(e){set({error:e instanceof Error?e.message:"Attack failed."});return false}}
}));