export type ArmyStatus = "ready" | "moving" | "retreating" | "destroyed";

export interface Army {
  id: string;
  countryId: string;
  name: string;
  provinceId: string;
  infantry: number;
  tanks: number;
  strength: number;
  morale: number;
  organization: number;
  status: ArmyStatus;
  createdAt: number;
  updatedAt: number;
}

export interface MovementAction {
  type: "createArmy" | "moveArmy";
  armyId?: string;
  provinceId?: string;
  name?: string;
  infantry?: number;
  tanks?: number;
}
