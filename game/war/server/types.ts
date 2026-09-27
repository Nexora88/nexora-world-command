export type WarStatus = "active" | "ended";
export type WarGoal = "conquest";
export interface War {
  warId:string; attacker:string; defender:string; startedAt:number; status:WarStatus;
  warGoal:WarGoal; occupiedProvinces:string[]; endedAt?:number;
  attackerScore:number; defenderScore:number;
}
export interface BattleResult {
  battleId:string; warId:string; attackerArmyId:string; defenderArmyId?:string; provinceId:string;
  attackerStrength:number; defenderStrength:number; attackerCasualties:number; defenderCasualties:number;
  attackerMorale:number; defenderMorale:number; attackerOrganization:number; defenderOrganization:number;
  winner:"attacker"|"defender"; captured:boolean; randomFactor:number; createdAt:number;
}
