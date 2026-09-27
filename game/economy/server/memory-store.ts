import { STARTING_RESOURCES } from "@/data/economy/resources";
import { provinces } from "@/data/provinces";
import type { ProvinceBuildingLevels } from "@/lib/game-store";
import type { EconomyState } from "./types";

export const DEMO_PLAYER_ID = "demo-player";
export const DEMO_COUNTRY_ID = "aurora";

const initialBuildingLevels = Object.fromEntries(
  provinces.map((province) => [province.id, { ...province.buildings }]),
) as Record<string, ProvinceBuildingLevels>;

const createState = (): EconomyState => ({
  playerId: DEMO_PLAYER_ID,
  resources: { ...STARTING_RESOURCES },
  provinceBuildings: Object.fromEntries(
    Object.entries(initialBuildingLevels).map(([id, levels]) => [id, { ...levels }]),
  ),
  constructionQueue: [],
  productionQueue: [],
  lastUpdatedAt: Date.now(),
  transactions: [],
});

const globalKey = "__nexoraEconomyState";
const globalState = globalThis as typeof globalThis & {
  [globalKey]?: EconomyState;
};

export function getEconomyState(): EconomyState {
  globalState[globalKey] ??= createState();
  return globalState[globalKey]!;
}

export function resetEconomyStateForTests(): void {
  globalState[globalKey] = createState();
}
