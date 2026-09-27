"use client";

import { create } from "zustand";
import type { Resources } from "@/data/economy/resources";
import type { BuildingType } from "@/data/economy/buildings";
import type { UnitType } from "@/data/economy/units";
import type { Province } from "@/lib/types";
import type { EconomySnapshot } from "@/game/economy/server/types";

export type ProvinceBuildingLevels = {
  industrialComplex: number;
  barracks: number;
  fortification: number;
};

export interface QueueItem {
  id: string;
  provinceId: string;
  type: BuildingType | UnitType;
  kind: "construction" | "production";
  startedAt: number;
  finishesAt: number;
  level?: number;
}

interface GameState {
  selectedProvinceId: string | null;
  gameMinutes: number;
  resources: Resources;
  income: Resources;
  provinceBuildings: Record<string, ProvinceBuildingLevels>;
  productionQueue: QueueItem[];
  constructionQueue: QueueItem[];
  selectedBuilding: BuildingType | null;
  loading: boolean;
  error: string | null;
  selectProvince: (id: string | null) => void;
  loadServerState: () => Promise<void>;
  advanceTime: (minutes: number) => Promise<void>;
  selectBuilding: (building: BuildingType | null) => void;
  syncQueues: () => Promise<void>;
  startConstruction: (province: Province, type: BuildingType) => Promise<boolean>;
  startProduction: (province: Province, unit: UnitType) => Promise<boolean>;
}
const EMPTY_RESOURCES: Resources = { money: 0, manpower: 0, oil: 0, steel: 0 };

function applySnapshot(snapshot: EconomySnapshot, set: (state: Partial<GameState>) => void) {
  set({
    resources: snapshot.resources,
    income: snapshot.income,
    provinceBuildings: snapshot.provinceBuildings,
    constructionQueue: snapshot.constructionQueue,
    productionQueue: snapshot.productionQueue,
    loading: false,
    error: null,
  });
}

async function requestEconomy(
  action?: Record<string, string>,
): Promise<EconomySnapshot> {
  const response = await fetch("/api/economy", {
    method: action ? "POST" : "GET",
    headers: action ? { "content-type": "application/json" } : undefined,
    body: action ? JSON.stringify(action) : undefined,
    cache: "no-store",
  });
  const payload = (await response.json()) as EconomySnapshot & { error?: string };
  if (!response.ok) throw new Error(payload.error ?? "Economy request failed.");
  return payload;
}

export const useGameStore = create<GameState>((set) => ({
  selectedProvinceId: null,
  gameMinutes: 0,
  resources: EMPTY_RESOURCES,
  income: EMPTY_RESOURCES,
  provinceBuildings: {},
  productionQueue: [],
  constructionQueue: [],
  selectedBuilding: null,
  loading: true,
  error: null,

  selectProvince: (id) => set({ selectedProvinceId: id }),
  selectBuilding: (building) => set({ selectedBuilding: building }),
  loadServerState: async () => {
    set({ loading: true, error: null });
    try {
      const snapshot = await requestEconomy();
      applySnapshot(snapshot, set);
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : "Economy unavailable." });
    }
  },
  advanceTime: async (minutes) => {
    if (minutes > 0) set((state) => ({ gameMinutes: state.gameMinutes + minutes }));
    await useGameStore.getState().syncQueues();
  },

  syncQueues: async () => {
    try {
      const snapshot = await requestEconomy();
      applySnapshot(snapshot, set);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Economy sync failed." });
    }
  },

  startConstruction: async (province, type) => {
    try {
      const snapshot = await requestEconomy({
        type: "startConstruction",
        provinceId: province.id,
        buildingType: type,
      });
      applySnapshot(snapshot, set);
      set({ selectedBuilding: type });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Construction request failed." });
      return false;
    }
  },

  startProduction: async (province, unit) => {
    try {
      const snapshot = await requestEconomy({
        type: "startProduction",
        provinceId: province.id,
        unitType: unit,
      });
      applySnapshot(snapshot, set);
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Production request failed." });
      return false;
    }
  },
}));
