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
  supply: number;
  fuel: number;
  maintenancePerHour: number;
  status: ArmyStatus;
  battleId?: string;
  order?: ArmyOrder;
  createdAt: number;
  updatedAt: number;
}

export interface ArmyOrder {
  type: "move" | "attack";
  orderId?: string;
  fromProvinceId: string;
  targetProvinceId: string;
  route: string[];
  issuedAt: number;
  eta: number;
}

export interface MovementAction {
  type: "createArmy" | "moveArmy" | "mergeArmies" | "splitArmy";
  armyId?: string;
  provinceId?: string;
  name?: string;
  infantry?: number;
  tanks?: number;
  sourceArmyId?: string;
  targetArmyId?: string;
}
