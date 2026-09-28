import { countries } from "@/data/provinces";
import { getProvince, setProvinceOwner } from "@/game/world/server/world-store";
import { getArmy, getArmies } from "@/game/movement/server/movement-service";
import { WAR_CONFIG, FORTIFICATION_CONFIG } from "@/data/war/config";
import type { BattleResult, BattleRound, BattleState, War } from "./types";
import { weatherCombatModifier } from "@/game/world/server/weather-service";
import { pushWorldEvent } from "@/game/events/server/event-store";
import { pushAlert } from "@/game/alerts/server/alert-store";

const wars = new Map<string, War>();
const battles: BattleResult[] = [];
const activeBattles = new Map<string, BattleState>();
const now = () => Date.now();

export class WarValidationError extends Error {}
const activeWar = (a:string,d:string) => [...wars.values()].find(w => w.status === "active" && w.attacker === a && w.defender === d);

function factor(seed?:number, round=1) {
  const v = Math.abs(Math.sin((seed ?? now()) * 0.017 + round * 12.9898) * 43758.5453) % 1;
  return WAR_CONFIG.randomFactorMin + v * (WAR_CONFIG.randomFactorMax - WAR_CONFIG.randomFactorMin);
}
function power(id:string, terrainModifier=1, weatherModifier=1) {
  const a = getArmy(id);
  if (!a || a.status === "destroyed") throw new WarValidationError("Army is unavailable.");
  const supply=.55+.45*(a.supply/100), fuel=.65+.35*(a.fuel/100);
  return a.strength*(1+a.morale/100*WAR_CONFIG.armyMoraleMultiplier)*(1+a.organization/100*WAR_CONFIG.armyOrganizationMultiplier)*supply*fuel*terrainModifier*weatherModifier;
}
function recalcLosses(a:ReturnType<typeof getArmy>, casualties:number) {
  if (!a) throw new WarValidationError("Army is unavailable.");
  const total=a.infantry+a.tanks;
  const infantryLoss=Math.min(a.infantry,Math.round(casualties*a.infantry/Math.max(1,total)));
  const tankLoss=Math.min(a.tanks,Math.max(0,casualties-infantryLoss));
  a.infantry=Math.max(0,a.infantry-infantryLoss); a.tanks=Math.max(0,a.tanks-tankLoss);
  a.strength=Math.max(0,a.infantry+a.tanks*3);
  a.morale=Math.max(0,a.morale-WAR_CONFIG.moraleLossPerBattle);
  a.organization=Math.max(0,a.organization-WAR_CONFIG.organizationLossPerBattle);
  a.supply=Math.max(0,a.supply-8); a.fuel=Math.max(0,a.fuel-(a.tanks>0?12:4));
  if(a.strength===0)a.status="destroyed";
  a.updatedAt=now();
  return infantryLoss+tankLoss;
}
function finishCapture(w:War, armyId:string, provinceId:string) {
  const army=getArmy(armyId), target=getProvince(provinceId); if(!army||!target)return;
  setProvinceOwner(target.id,w.attacker);
  if(!w.occupiedProvinces.includes(target.id))w.occupiedProvinces.push(target.id);
  w.attackerScore+=WAR_CONFIG.captureWarScore;
  army.provinceId=target.id; army.status="ready"; army.battleId=undefined; army.order=undefined;
  pushWorldEvent({type:"capture",title:"PROVINCE CAPTURED",message:`${target.name} captured by ${w.attacker}`,provinceId:target.id,countryId:w.attacker});
  if(countries.some(c=>c.id===w.defender&&c.capitalProvinceId===target.id))
    pushAlert({key:`capital-${target.id}`,level:"critical",title:"CAPITAL UNDER ATTACK",message:`${target.name} has changed hands`,provinceId:target.id},60000);
}
function finishBattle(state:BattleState,status:"attacker_victory"|"defender_victory"|"draw") {
  state.status=status;
  const a=getArmy(state.attackerArmyId), d=state.defenderArmyId?getArmy(state.defenderArmyId):undefined;
  if(a)a.battleId=undefined;
  if(d)d.battleId=undefined;
  activeBattles.delete(state.battleId);
}
export function resetWars(){wars.clear();battles.length=0;activeBattles.clear();}
export function getWars(){return [...wars.values()].map(w=>({...w,occupiedProvinces:[...w.occupiedProvinces]}));}
export function getBattleHistory(warId?:string){return battles.filter(b=>!warId||b.warId===warId).map(b=>({...b}));}
export function getActiveBattles(){return [...activeBattles.values()].map(b=>({...b,rounds:b.rounds.map(r=>({...r}))}));}

export function declareWar(attacker:string,defender:string,warGoal:"conquest"="conquest"){
  if(!countries.some(c=>c.id===attacker)||!countries.some(c=>c.id===defender)||attacker===defender)throw new WarValidationError("Invalid countries.");
  if(activeWar(attacker,defender))throw new WarValidationError("War already active.");
  const w:War={warId:crypto.randomUUID(),attacker,defender,startedAt:now(),status:"active",warGoal,occupiedProvinces:[],attackerScore:0,defenderScore:0};
  wars.set(w.warId,w); pushWorldEvent({type:"war",title:"WAR DECLARED",message:`${attacker} declared war on ${defender}`,countryId:attacker}); return {...w};
}

function resolveRound(state:BattleState, randomSeed?:number):BattleResult{
  const w=wars.get(state.warId); if(!w)throw new WarValidationError("War no longer exists.");
  const attacker=getArmy(state.attackerArmyId), defender=state.defenderArmyId?getArmy(state.defenderArmyId):undefined, target=getProvince(state.provinceId);
  if(!attacker||!target)throw new WarValidationError("Battle forces are unavailable.");
  const origin=getProvince(attacker.provinceId);
  if(!origin)throw new WarValidationError("Attacking province is unavailable.");
  const terrainAttack=origin.terrain==="mountain"?.75:origin.terrain==="urban"?.9:origin.terrain==="forest"?.85:1;
  const terrainDefense=target.terrain==="mountain"?1.3:target.terrain==="urban"?1.2:target.terrain==="forest"?1.12:target.terrain==="hills"?1.08:1;
  const ap=power(attacker.id,terrainAttack,weatherCombatModifier(origin.weather));
  const dp=defender?power(defender.id,terrainDefense,weatherCombatModifier(target.weather)):WAR_CONFIG.baseAttackStrength;
  const fort=Math.max(0,Math.min(3,target.fortificationLevel??0)) as 0|1|2|3;
  const defense=dp*(1+FORTIFICATION_CONFIG[fort])*weatherCombatModifier(target.weather);
  const rf=factor(randomSeed,state.round+1);
  const ratio=ap*rf/Math.max(1,defense);
  const winner:BattleRound["winner"]=ratio>1.15?"attacker":ratio<.85?"defender":"draw";
  const ac=Math.max(1,Math.round((winner==="attacker"?.055:winner==="defender"?.09:.075)*(attacker.infantry+attacker.tanks)));
  const dc=defender?Math.max(1,Math.round((winner==="defender"?.055:winner==="attacker"?.09:.075)*(defender.infantry+defender.tanks))):0;
  const attackerCasualties=recalcLosses(attacker,ac), defenderCasualties=defender?recalcLosses(defender,dc):0;
  state.round++;
  const round:BattleRound={round:state.round,attackerStrength:Math.round(ap),defenderStrength:Math.round(defense),attackerCasualties,defenderCasualties,winner,randomFactor:rf,createdAt:now()};
  state.rounds.push(round); state.lastRoundAt=now(); state.nextRoundAt=now()+15000;
  let status:BattleResult["status"]="active"; let captured=false;
  if(!defender || winner==="attacker"&&attacker.strength>0&&ratio>=1.15){finishCapture(w,attacker.id,target.id);w.attackerScore+=WAR_CONFIG.battleWarScore;status="attacker_victory";captured=true;finishBattle(state,"attacker_victory");}
  else if(defender?.status==="destroyed"||winner==="defender"&&attacker.organization<=WAR_CONFIG.retreatOrganizationThreshold){w.defenderScore+=WAR_CONFIG.battleWarScore;status="defender_victory";finishBattle(state,"defender_victory");}
  else if(attacker.status==="destroyed"){w.defenderScore+=WAR_CONFIG.battleWarScore;status="defender_victory";finishBattle(state,"defender_victory");}
  const result:BattleResult={battleId:state.battleId,warId:state.warId,attackerArmyId:attacker.id,defenderArmyId:defender?.id,provinceId:target.id,attackerStrength:Math.round(ap),defenderStrength:Math.round(defense),attackerCasualties,defenderCasualties,attackerMorale:attacker.morale,defenderMorale:defender?.morale??0,attackerOrganization:attacker.organization,defenderOrganization:defender?.organization??0,winner,captured,randomFactor:rf,createdAt:now(),round:state.round,battleEnded:status!=="active",status};
  battles.push(result); return result;
}

export function attackProvince(warId:string,armyId:string,provinceId:string,randomSeed?:number){
  const w=wars.get(warId); if(!w||w.status!=="active")throw new WarValidationError("War is not active.");
  const army=getArmy(armyId),target=getProvince(provinceId);
  if(!army||army.countryId!==w.attacker||army.status==="destroyed"||army.status==="moving"||army.battleId)throw new WarValidationError("Invalid attacking army.");
  if(!target||target.ownerId!==w.defender)throw new WarValidationError("Target province is not controlled by the war defender.");
  const origin=getProvince(army.provinceId);
  if(!origin||!origin.neighbors.includes(target.id))throw new WarValidationError("Target is not adjacent.");
  if(army.supply<=0||army.fuel<=0)throw new WarValidationError("Army cannot attack without supply and fuel.");
  const defender=getArmies().filter(a=>a.countryId===w.defender&&a.provinceId===target.id&&a.status!=="destroyed"&&!a.battleId).sort((a,b)=>b.strength-a.strength)[0];
  const existing=[...activeBattles.values()].find(b=>b.provinceId===provinceId&&b.warId===warId);
  if(existing){return resolveRound(existing,randomSeed);}
  const battleId=crypto.randomUUID();
  const state:BattleState={battleId,warId,attackerArmyId:army.id,defenderArmyId:defender?.id,provinceId,status:"active",round:0,startedAt:now(),lastRoundAt:now(),nextRoundAt:now(),rounds:[]};
  army.battleId=battleId; if(defender)defender.battleId=battleId; activeBattles.set(battleId,state);
  return resolveRound(state,randomSeed);
}

export function tickBattles(gameTime=now()){
  const results:BattleResult[]=[];
  for(const state of [...activeBattles.values()])if(gameTime>=state.nextRoundAt)results.push(resolveRound(state));
  return {battles:results,active:getActiveBattles()};
}
