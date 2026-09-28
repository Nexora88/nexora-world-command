export type WarStatus = "active" | "ended";
export type WarGoal = "conquest";
export type BattleStatus = "active" | "attacker_victory" | "defender_victory" | "draw" | "retreated";
export interface War { warId:string; attacker:string; defender:string; startedAt:number; status:WarStatus; warGoal:WarGoal; occupiedProvinces:string[]; endedAt?:number; attackerScore:number; defenderScore:number; }
export interface BattleRound { round:number; attackerStrength:number; defenderStrength:number; attackerCasualties:number; defenderCasualties:number; winner:"attacker"|"defender"|"draw"; randomFactor:number; createdAt:number; }
export interface BattleResult { battleId:string; warId:string; attackerArmyId:string; defenderArmyId?:string; provinceId:string; attackerStrength:number; defenderStrength:number; attackerCasualties:number; defenderCasualties:number; attackerMorale:number; defenderMorale:number; attackerOrganization:number; defenderOrganization:number; winner:"attacker"|"defender"|"draw"; captured:boolean; randomFactor:number; createdAt:number; round?:number; battleEnded?:boolean; status?:BattleStatus; }
export interface BattleState { battleId:string; warId:string; attackerArmyId:string; defenderArmyId?:string; provinceId:string; status:BattleStatus; round:number; startedAt:number; lastRoundAt:number; nextRoundAt:number; rounds:BattleRound[]; }
