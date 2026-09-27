import type { Resources } from "@/data/economy/resources";
import type { BuildingType } from "@/data/economy/buildings";
import type { UnitType } from "@/data/economy/units";
import type { ProvinceBuildingLevels, QueueItem } from "@/lib/game-store";

export type EconomyAction =
  | { type: "startConstruction"; provinceId: string; buildingType: BuildingType }
  | { type: "startProduction"; provinceId: string; unitType: UnitType }
  | { type: "resolveCompleted" };

export interface ResourceTransaction {
  id: string;
  playerId: string;
  resource: keyof Resources;
  amount: number;
  reason: string;
  provinceId?: string;
  referenceId?: string;
  createdAt: number;
}

export interface EconomySnapshot {
  playerId: string;
  resources: Resources;
  income: Resources;
  provinceBuildings: Record<string, ProvinceBuildingLevels>;
  constructionQueue: QueueItem[];
  productionQueue: QueueItem[];
  serverTime: number;
}

export interface EconomyState {
  playerId: string;
  resources: Resources;
  provinceBuildings: Record<string, ProvinceBuildingLevels>;
  constructionQueue: QueueItem[];
  productionQueue: QueueItem[];
  lastUpdatedAt: number;
  transactions: ResourceTransaction[];
}
