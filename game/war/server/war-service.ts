import { countries } from "@/data/provinces";
import { getProvince, setProvinceOwner } from "@/game/world/server/world-store";
import { getArmy, getArmies } from "@/game/movement/server/movement-service";
import { WAR_CONFIG, FORTIFICATION_CONFIG } from "@/data/war/config";
import type { BattleResult, War } from "./types";
import {weatherCombatModifier} from "@/game/world/server/weather-service";
import {climateMovementCost} from "@/game/world/server/climate-service";
import {pushWorldEvent} from "@/game/events/server/event-store";
import {pushAlert} from "@/game/alerts/server/alert-store";

const wars = new Map<string, War>();
const battles: BattleResult[] = [];
const now = () => Date.now();
export class WarValidationError extends Error {}

const active = (a:string,d:string) => [...wars.values()].find(w =>
  w.status === "active" && w.attacker === a && w.defender === d);
const factor = (seed?:number) => {
  const v = Math.abs(Math.sin(seed ?? now()) * 10000) % 1;
  return WAR_CONFIG.randomFactorMin + v * (WAR_CONFIG.randomFactorMax - WAR_CONFIG.randomFactorMin);
};
function power(id:string,terrainModifier=1,weatherModifier=1) {
  const a = getArmy(id);
  if (!a || a.status === "destroyed") throw new WarValidationError("Army is unavailable.");
  const supplyModifier=.55+.45*(a.supply/100),fuelModifier=.65+.35*(a.fuel/100);
  return a.strength*(1+a.morale/100*WAR_CONFIG.armyMoraleMultiplier)*(1+a.organization/100*WAR_CONFIG.armyOrganizationMultiplier)*supplyModifier*fuelModifier*terrainModifier*weatherModifier;
}
function losses(id:string,c:number) {
  const a = getArmy(id);
  if (!a) throw new WarValidationError("Army is unavailable.");
  const total = a.infantry + a.tanks;
  const il = Math.min(a.infantry, Math.round(c * a.infantry / Math.max(1,total)));
  const tl = Math.min(a.tanks, Math.max(0,c-il));
  a.infantry = Math.max(0,a.infantry-il);
  a.tanks = Math.max(0,a.tanks-tl);
  a.strength = Math.max(0,a.infantry+a.tanks*3);
  a.morale = Math.max(0,a.morale-WAR_CONFIG.moraleLossPerBattle);
  a.organization = Math.max(0,a.organization-WAR_CONFIG.organizationLossPerBattle);
  a.supply = Math.max(0,a.supply-8);
  a.fuel = Math.max(0,a.fuel-(a.tanks>0?12:4));
  if (a.strength === 0) a.status = "destroyed";
  a.updatedAt = now();
  return a;
}
export function resetWars(){ wars.clear(); battles.length=0; }
export function getWars(){ return [...wars.values()].map(w=>({...w,occupiedProvinces:[...w.occupiedProvinces]})); }
export function getBattleHistory(warId?:string){ return battles.filter(b=>!warId||b.warId===warId).map(b=>({...b})); }
export function declareWar(attacker:string,defender:string,warGoal:"conquest"="conquest"){
  if(!countries.some(c=>c.id===attacker)||!countries.some(c=>c.id===defender)||attacker===defender)
    throw new WarValidationError("Invalid countries.");
  if(active(attacker,defender)) throw new WarValidationError("War already active.");
  const w:War={warId:crypto.randomUUID(),attacker,defender,startedAt:now(),status:"active",
    warGoal,occupiedProvinces:[],attackerScore:0,defenderScore:0};
  wars.set(w.warId,w);pushWorldEvent({type:"war",title:"WAR DECLARED",message:`${attacker} declared war on ${defender}`,countryId:attacker});return {...w};
}
export function attackProvince(warId:string,armyId:string,provinceId:string,randomSeed?:number){
  const w=wars.get(warId);
  if(!w||w.status!=="active") throw new WarValidationError("War is not active.");
  const army=getArmy(armyId), target=getProvince(provinceId);
  if(!army||army.countryId!==w.attacker||army.status==="destroyed"||army.status==="moving") throw new WarValidationError("Invalid attacking army.");
  if(!target||target.ownerId!==w.defender) throw new WarValidationError("Target province is not controlled by the war defender.");
  const origin=getProvince(army.provinceId);
  if(!origin||!origin.neighbors.includes(target.id)) throw new WarValidationError("Target is not adjacent.");
  if(army.supply<=0||army.fuel<=0) throw new WarValidationError("Army cannot attack without supply and fuel.");
  army.order={type:"attack",fromProvinceId:origin.id,targetProvinceId:target.id,route:[origin.id,target.id],issuedAt:now(),eta:now()+Math.max(3000,Math.round(climateMovementCost(target)*900))};
  const defender=getArmies().filter(a=>a.countryId===w.defender&&a.provinceId===target.id&&a.status!=="destroyed")
    .sort((a,b)=>b.strength-a.strength)[0];
  const terrainAttack=origin.terrain==="mountain"?.75:origin.terrain==="urban"?.9:origin.terrain==="forest"?.85:1;
  const terrainDefense=target.terrain==="mountain"?1.3:target.terrain==="urban"?1.2:target.terrain==="forest"?1.12:target.terrain==="hills"?1.08:1;
  const ap=power(army.id,terrainAttack,weatherCombatModifier(origin.weather));
  const dp=defender?power(defender.id,terrainDefense,weatherCombatModifier(target.weather)):WAR_CONFIG.baseAttackStrength;
  const fort=Math.max(0,Math.min(5,target.fortificationLevel)) as 0|1|2|3|4|5;
  const defense=dp*(1+Math.min(.5,fort*.06))*weatherCombatModifier(target.weather);
  const rf=factor(randomSeed);
  const winner=ap*rf>=defense?"attacker":"defender";
  const ac=Math.max(0,Math.round((winner==="attacker"?defense/Math.max(1,ap):1.15)
    *WAR_CONFIG.attackerCasualtyRate*(army.infantry+army.tanks)));
  const dc=defender?Math.max(0,Math.round((winner==="defender"?ap/Math.max(1,defense):1.15)
    *WAR_CONFIG.defenderCasualtyRate*(defender.infantry+defender.tanks))):0;
  const aa=losses(army.id,ac);
  const da=defender?losses(defender.id,dc):undefined;
  const captured=winner==="attacker"&&aa.status!=="destroyed";
  if(captured){
    setProvinceOwner(target.id,w.attacker);
    if(!w.occupiedProvinces.includes(target.id)) w.occupiedProvinces.push(target.id);
    w.attackerScore+=WAR_CONFIG.captureWarScore;
    army.provinceId=target.id; army.status="ready"; army.order=undefined;
    pushWorldEvent({type:"capture",title:"PROVINCE CAPTURED",message:`${target.name} captured by ${w.attacker}`,provinceId:target.id,countryId:w.attacker});
    if(countries.some(c=>c.id===w.defender&&c.capitalProvinceId===target.id))pushAlert({key:`capital-${target.id}`,level:"critical",title:"CAPITAL UNDER ATTACK",message:`${target.name} has changed hands`,provinceId:target.id},60000);
  } else {
    w.defenderScore+=WAR_CONFIG.battleWarScore;
    if(aa.organization<=WAR_CONFIG.retreatOrganizationThreshold||aa.morale<=WAR_CONFIG.retreatOrganizationThreshold)
      aa.status="retreating";
  }
  const result:BattleResult={
    battleId:crypto.randomUUID(),warId,attackerArmyId:army.id,defenderArmyId:defender?.id,
    provinceId:target.id,attackerStrength:Math.round(ap),defenderStrength:Math.round(defense),
    attackerCasualties:ac,defenderCasualties:dc,attackerMorale:aa.morale,
    defenderMorale:da?.morale??0,attackerOrganization:aa.organization,
    defenderOrganization:da?.organization??0,winner,captured,randomFactor:rf,createdAt:now()
  };
  battles.push(result); return result;
}
