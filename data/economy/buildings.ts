export type BuildingType = "industrialComplex" | "barracks" | "fortification";
export interface BuildingLevelConfig { level:number; productionMultiplier?:number; steelPerHour?:number; infantryProductionMinutes?:number; defenseBonus?:number; upgradeCost:{money:number;steel:number}; constructionMinutes:number; }
export const BUILDING_MAX_LEVEL=3;
export const BUILDINGS:Record<BuildingType,{name:string;levels:BuildingLevelConfig[]}> = {
 industrialComplex:{name:"Industrial Complex",levels:[
  {level:0,productionMultiplier:1,upgradeCost:{money:500,steel:200},constructionMinutes:5},
  {level:1,productionMultiplier:1.2,steelPerHour:100,upgradeCost:{money:750,steel:300},constructionMinutes:5},
  {level:2,productionMultiplier:1.5,steelPerHour:150,upgradeCost:{money:1000,steel:450},constructionMinutes:8},
  {level:3,productionMultiplier:1.9,steelPerHour:220,upgradeCost:{money:0,steel:0},constructionMinutes:0}]},
 barracks:{name:"Barracks",levels:[
  {level:0,infantryProductionMinutes:70,upgradeCost:{money:400,steel:150},constructionMinutes:4},
  {level:1,infantryProductionMinutes:60,upgradeCost:{money:600,steel:220},constructionMinutes:5},
  {level:2,infantryProductionMinutes:50,upgradeCost:{money:850,steel:300},constructionMinutes:6},
  {level:3,infantryProductionMinutes:40,upgradeCost:{money:0,steel:0},constructionMinutes:0}]},
 fortification:{name:"Fortification",levels:[
  {level:0,defenseBonus:0,upgradeCost:{money:350,steel:180},constructionMinutes:4},
  {level:1,defenseBonus:.1,upgradeCost:{money:500,steel:260},constructionMinutes:5},
  {level:2,defenseBonus:.2,upgradeCost:{money:700,steel:360},constructionMinutes:6},
  {level:3,defenseBonus:.3,upgradeCost:{money:0,steel:0},constructionMinutes:0}]}
};
export const getBuildingLevel=(type:BuildingType,level:number)=>BUILDINGS[type].levels[Math.min(Math.max(level,0),BUILDING_MAX_LEVEL)];