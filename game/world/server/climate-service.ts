import {getProvince} from "@/game/world/server/world-store";
import type {Province} from "@/lib/types";
export type ClimateBand="arctic"|"tundra"|"temperate"|"tropical"|"desert"|"mediterranean";
export interface ClimateState{provinceId:string;band:ClimateBand;temperature:number;rainfall:number;agriculture:number;populationCapacity:number;movementDifficulty:number;resourceRichness:number;}
const bands:Record<string,ClimateBand>={"nwc-01":"temperate","nwc-02":"tundra","nwc-03":"temperate","nwc-04":"temperate","nwc-05":"tropical","nwc-06":"mediterranean","nwc-07":"desert","nwc-08":"tropical"};
const base:Record<ClimateBand,[number,number,number,number,number,number]>={arctic:[-18,180,8,12,92,35],tundra:[-5,320,18,28,78,40],temperate:[14,700,72,78,34,62],tropical:[27,1500,84,88,28,58],desert:[30,80,10,22,70,82],mediterranean:[18,520,68,70,36,65]};
export function getClimate(provinceId:string):ClimateState|undefined{const p=getProvince(provinceId);if(!p)return;const band=bands[provinceId]??"temperate";const [temperature,rainfall,agriculture,populationCapacity,movementDifficulty,resourceRichness]=base[band];const terrain=p.terrain;const terrainPenalty=terrain==="mountain"?18:terrain==="forest"?8:terrain==="coast"?-4:terrain==="urban"?-8:0;return{provinceId,band,temperature,rainfall,agriculture:Math.max(0,agriculture-terrainPenalty),populationCapacity:Math.max(10,populationCapacity-terrainPenalty),movementDifficulty:Math.min(100,Math.max(5,movementDifficulty+terrainPenalty)),resourceRichness};}
export function getClimateMap(){return getProvinceIds().map(id=>getClimate(id)).filter(Boolean) as ClimateState[];}
function getProvinceIds(){return ["nwc-01","nwc-02","nwc-03","nwc-04","nwc-05","nwc-06","nwc-07","nwc-08"] as string[];}
export function climateMovementCost(p:Province){return getClimate(p.id)?.movementDifficulty??40;}
