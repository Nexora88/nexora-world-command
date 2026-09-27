"use client";
import {create} from "zustand";
import type {Resources} from "@/data/economy/resources";
import {STARTING_RESOURCES} from "@/data/economy/resources";
import type {BuildingType} from "@/data/economy/buildings";
import type {UnitType} from "@/data/economy/units";
import {calculateConstructionCost,deductConstructionCost} from "@/game/economy/construction";
import {calculateProductionCost,calculateProductionTime,deductProductionCost} from "@/game/economy/production";
import {provinces} from "@/data/provinces";
import type {Province} from "@/lib/types";

export type ProvinceBuildingLevels={industrialComplex:number;barracks:number;fortification:number};
export interface QueueItem{id:string;provinceId:string;type:BuildingType|UnitType;kind:"construction"|"production";startedAt:number;finishesAt:number;level?:number}

const initialBuildingLevels=Object.fromEntries(provinces.map(p=>[p.id,p.buildings])) as Record<string,ProvinceBuildingLevels>;

interface GameState{
 selectedProvinceId:string|null;gameMinutes:number;resources:Resources;provinceBuildings:Record<string,ProvinceBuildingLevels>;productionQueue:QueueItem[];constructionQueue:QueueItem[];selectedBuilding:BuildingType|null;
 selectProvince:(id:string|null)=>void;advanceTime:(minutes:number)=>void;selectBuilding:(building:BuildingType|null)=>void;syncQueues:(now:number)=>void;startConstruction:(province:Province,type:BuildingType)=>boolean;startProduction:(province:Province,unit:UnitType)=>boolean;
}

export const useGameStore=create<GameState>((set,get)=>({
 selectedProvinceId:null,gameMinutes:0,resources:STARTING_RESOURCES,provinceBuildings:initialBuildingLevels,productionQueue:[],constructionQueue:[],selectedBuilding:null,
 selectProvince:id=>set({selectedProvinceId:id}),
 advanceTime:minutes=>{const now=Date.now()+minutes*60000;get().syncQueues(now);set(s=>({gameMinutes:s.gameMinutes+minutes}))},
 selectBuilding:building=>set({selectedBuilding:building}),
 syncQueues:now=>set(s=>{
   const completed=s.constructionQueue.filter(q=>q.finishesAt<=now);
   const completedProduction=s.productionQueue.filter(q=>q.finishesAt<=now);
   if(completed.length===0&&completedProduction.length===0)return s;
   const provinceBuildings={...s.provinceBuildings};
   for(const item of completed){if(item.kind==="construction"&&item.level){provinceBuildings[item.provinceId]={...provinceBuildings[item.provinceId],[item.type as BuildingType]:item.level}}}
   return{...s,provinceBuildings,constructionQueue:s.constructionQueue.filter(q=>q.finishesAt>now),productionQueue:s.productionQueue.filter(q=>q.finishesAt>now)};
 }),
 startConstruction:(province,type)=>{
   const level=get().provinceBuildings[province.id]?.[type]??province.buildings[type];
   const cost=calculateConstructionCost(type,level);if(!cost)return false;
   const next=deductConstructionCost(get().resources,cost);if(!next)return false;
   const active=get().constructionQueue.some(q=>q.provinceId===province.id&&q.type===type);if(active)return false;
   const now=Date.now();const item:QueueItem={id:crypto.randomUUID(),provinceId:province.id,type,kind:"construction",startedAt:now,finishesAt:now+cost.constructionMinutes*60000,level:level+1};
   set(s=>({resources:next,constructionQueue:[...s.constructionQueue,item],selectedBuilding:type}));return true;
 },
 startProduction:(province,unit)=>{
   const cost=calculateProductionCost(unit);const next=deductProductionCost(get().resources,cost);if(!next)return false;
   const minutes=calculateProductionTime(unit,get().provinceBuildings[province.id]?.barracks??province.buildings.barracks);const now=Date.now();
   const item:QueueItem={id:crypto.randomUUID(),provinceId:province.id,type:unit,kind:"production",startedAt:now,finishesAt:now+minutes*60000};
   set(s=>({resources:next,productionQueue:[...s.productionQueue,item]}));return true;
 }
}));