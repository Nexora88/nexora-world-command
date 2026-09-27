import {BUILDINGS} from "@/data/economy/buildings";import {UNITS,type UnitType} from "@/data/economy/units";import type {Resources} from "@/data/economy/resources";
export interface ProductionCost{manpower:number;steel:number}
export function calculateProductionTime(unit:UnitType,barracksLevel:number){const c=UNITS[unit];if(unit!=="infantry")return c.baseProductionMinutes;return BUILDINGS.barracks.levels[Math.min(Math.max(barracksLevel,0),3)]?.infantryProductionMinutes??c.baseProductionMinutes}
export function calculateProductionCost(unit:UnitType):ProductionCost{return{manpower:UNITS[unit].manpowerCost,steel:UNITS[unit].steelCost}}
export function canAffordProduction(r:Resources,c:ProductionCost){return r.manpower>=c.manpower&&r.steel>=c.steel}
export function deductProductionCost(r:Resources,c:ProductionCost):Resources|null{return canAffordProduction(r,c)?{...r,manpower:r.manpower-c.manpower,steel:r.steel-c.steel}:null}