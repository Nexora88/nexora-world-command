import {BUILDING_MAX_LEVEL,BUILDINGS,type BuildingType} from "@/data/economy/buildings";import type {Resources} from "@/data/economy/resources";
export interface ConstructionCost{money:number;steel:number;constructionMinutes:number}
export function getProvinceBuildingLevel(province: {buildings: {industrialComplex:number;barracks:number;fortification:number}}, type: BuildingType): number { return province.buildings[type]; }
export function calculateConstructionCost(type:BuildingType,currentLevel:number):ConstructionCost|null{if(currentLevel>=BUILDING_MAX_LEVEL)return null;const n=BUILDINGS[type].levels[currentLevel+1];return n?{...n.upgradeCost,constructionMinutes:n.constructionMinutes}:null}
export function canAfford(r:Resources,c:Pick<ConstructionCost,"money"|"steel">){return r.money>=c.money&&r.steel>=c.steel}
export function deductConstructionCost(r:Resources,c:ConstructionCost):Resources|null{return canAfford(r,c)?{...r,money:r.money-c.money,steel:r.steel-c.steel}:null}