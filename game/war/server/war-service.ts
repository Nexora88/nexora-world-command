import { countries } from "@/data/provinces";
import { getProvince, setProvinceOwner } from "@/game/world/server/world-store";
import { getArmy, getArmies } from "@/game/movement/server/movement-service";
import { WAR_CONFIG, FORTIFICATION_CONFIG } from "@/data/war/config";
import type { BattleResult, War } from "./types";

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
function power(id:string) {
  const a = getArmy(id);
  if (!a || a.status === "destroyed") throw new WarValidationError("Army is unavailable.");
  return a.strength * (1 + a.morale / 100 * WAR_CONFIG.armyMoraleMultiplier)
    * (1 + a.organization / 100 * WAR_CONFIG.armyOrganizationMultiplier);
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
  wars.set(w.warId,w); return {...w};
}
export function attackProvince(warId:string,armyId:string,provinceId:string,randomSeed?:number){
  const w=wars.get(warId);
  if(!w||w.status!=="active") throw new WarValidationError("War is not active.");
  const army=getArmy(armyId), target=getProvince(provinceId);
  if(!army||army.countryId!==w.attacker) throw new WarValidationError("Invalid attacking army.");
  if(!target||target.ownerId===w.attacker) throw new WarValidationError("Target province is not enemy-controlled.");
  const origin=getProvince(army.provinceId);
  if(!origin||!origin.neighbors.includes(target.id)) throw new WarValidationError("Target is not adjacent.");
  const defender=getArmies().filter(a=>a.countryId===w.defender&&a.provinceId===target.id&&a.status!=="destroyed")
    .sort((a,b)=>b.strength-a.strength)[0];
  const ap=power(army.id);
  const dp=defender?power(defender.id):WAR_CONFIG.baseAttackStrength;
  const fort=Math.max(0,Math.min(3,target.fortificationLevel)) as 0|1|2|3;
  const defense=dp*(1+FORTIFICATION_CONFIG[fort]);
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
    army.provinceId=target.id; army.status="ready";
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
