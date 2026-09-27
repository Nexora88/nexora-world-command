import { getWorld, getProvince } from "@/game/world/server/world-store";
import { BUILDING_MAX_LEVEL, BUILDINGS, type BuildingType } from "@/data/economy/buildings";
import { calculateConstructionCost } from "../construction";
import { calculateProductionCost, calculateProductionTime } from "../production";
import { calculatePlayerIncome } from "../resource-engine";
import { applyResourceDelta } from "../resource-engine";
import type { ProvinceBuildingLevels, QueueItem } from "@/lib/game-store";
import type { EconomyAction, EconomySnapshot, EconomyState, ResourceTransaction } from "./types";
import { DEMO_COUNTRY_ID, DEMO_PLAYER_ID, getEconomyState } from "./memory-store";
import { addProducedUnits, getArmies, getArmy } from "@/game/movement/server/movement-service";

export class EconomyValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EconomyValidationError";
  }
}

const ownedProvinces = () => getWorld().filter((province) => province.ownerId === DEMO_COUNTRY_ID);
const provinceById = (provinceId: string) => getProvince(provinceId);

function transaction(
  state: EconomyState,
  resource: ResourceTransaction["resource"],
  amount: number,
  reason: string,
  provinceId?: string,
  referenceId?: string,
): void {
  if (amount === 0) return;
  state.transactions.push({
    id: crypto.randomUUID(),
    playerId: state.playerId,
    resource,
    amount,
    reason,
    provinceId,
    referenceId,
    createdAt: Date.now(),
  });
}
function tick(state: EconomyState, now: number): void {
  if (now <= state.lastUpdatedAt) return;
  const hours = (now - state.lastUpdatedAt) / 3_600_000;
  const income = calculatePlayerIncome(ownedProvinces());
  const delta = {
    money: Math.floor(income.money * hours),
    manpower: Math.floor(income.manpower * hours),
    oil: Math.floor(income.oil * hours),
    steel: Math.floor(income.steel * hours),
    food: Math.floor((income.food??0) * hours),
    rareMaterials: Math.floor((income.rareMaterials??0) * hours),
  };
  const upkeep = getArmies().filter(a=>a.countryId===DEMO_COUNTRY_ID&&a.status!=="destroyed").reduce((sum,a)=>sum+a.maintenancePerHour,0);
  delta.money -= Math.floor(upkeep * hours);
  state.resources = applyResourceDelta(state.resources, delta);
  for(const snapshotArmy of getArmies().filter(a=>a.countryId===DEMO_COUNTRY_ID&&a.status!=="destroyed")){const army=getArmy(snapshotArmy.id);if(army){army.supply=Math.max(0,army.supply-hours*2);army.fuel=Math.max(0,army.fuel-hours*(army.tanks*.5+1));}}
  (Object.keys(delta) as Array<keyof typeof delta>).forEach((resource) => {
    transaction(state, resource, delta[resource], "ECONOMY_TICK");
  });
  state.lastUpdatedAt = now;
}

function resolveCompleted(state: EconomyState, now: number): void {
  const completedConstruction = state.constructionQueue.filter((item) => item.finishesAt <= now);
  const completedProduction = state.productionQueue.filter((item) => item.finishesAt <= now);

  for (const item of completedProduction) {
    if (item.kind === "production" && item.type === "infantry") addProducedUnits(item.provinceId, 1000, 0);
    if (item.kind === "production" && item.type === "tank") addProducedUnits(item.provinceId, 0, 1);
  }

  for (const item of completedConstruction) {
    if (item.kind !== "construction" || item.level === undefined) continue;
    state.provinceBuildings[item.provinceId] = {
      ...state.provinceBuildings[item.provinceId],
      [item.type as BuildingType]: item.level,
    };
  }

  state.constructionQueue = state.constructionQueue.filter((item) => item.finishesAt > now);
  state.productionQueue = state.productionQueue.filter((item) => item.finishesAt > now);
}

function snapshot(state: EconomyState, now: number): EconomySnapshot {
  return {
    playerId: state.playerId,
    resources: { ...state.resources },
    income: { ...calculatePlayerIncome(ownedProvinces()) },
    provinceBuildings: Object.fromEntries(
      Object.entries(state.provinceBuildings).map(([id, levels]) => [id, { ...levels }]),
    ),
    constructionQueue: state.constructionQueue.map((item) => ({ ...item })),
    productionQueue: state.productionQueue.map((item) => ({ ...item })),
    serverTime: now,
  };
}

function requireOwnedProvince(provinceId: string) {
  const province = provinceById(provinceId);
  if (!province) throw new EconomyValidationError("Province does not exist.");
  if (province.ownerId !== DEMO_COUNTRY_ID) {
    throw new EconomyValidationError("Province is not owned by the player.");
  }
  return province;
}
export function getEconomySnapshot(now = Date.now()): EconomySnapshot {
  const state = getEconomyState();
  tick(state, now);
  resolveCompleted(state, now);
  return snapshot(state, now);
}

export function performEconomyAction(action: EconomyAction, now = Date.now()): EconomySnapshot {
  const state = getEconomyState();
  tick(state, now);
  resolveCompleted(state, now);

  if (state.playerId !== DEMO_PLAYER_ID) {
    throw new EconomyValidationError("Player state is unavailable.");
  }

  if (action.type === "resolveCompleted") return snapshot(state, now);

  const province = requireOwnedProvince(action.provinceId);

  if (action.type === "startConstruction") {
    const type = action.buildingType;
    if (!BUILDINGS[type]) throw new EconomyValidationError("Invalid building type.");

    const currentLevel = state.provinceBuildings[province.id]?.[type] ?? ((province.buildings as Record<string,number>)[type] ?? 0);
    if (!Number.isInteger(currentLevel) || currentLevel < 0 || currentLevel > BUILDING_MAX_LEVEL) {
      throw new EconomyValidationError("Invalid building level.");
    }

    const cost = calculateConstructionCost(type, currentLevel);
    if (!cost) throw new EconomyValidationError("Building is already at maximum level.");
    if (state.constructionQueue.some((item) => item.provinceId === province.id && item.type === type)) {
      throw new EconomyValidationError("Construction is already queued for this building.");
    }
    if (state.resources.money < cost.money || state.resources.steel < cost.steel) {
      throw new EconomyValidationError("Insufficient resources.");
    }

    const id = crypto.randomUUID();
    state.resources = {
      ...state.resources,
      money: state.resources.money - cost.money,
      steel: state.resources.steel - cost.steel,
    };
    transaction(state, "money", -cost.money, "CONSTRUCTION_START", province.id, id);
    transaction(state, "steel", -cost.steel, "CONSTRUCTION_START", province.id, id);

    const item: QueueItem = {
      id,
      provinceId: province.id,
      type,
      kind: "construction",
      startedAt: now,
      finishesAt: now + cost.constructionMinutes * 60_000,
      level: currentLevel + 1,
    };
    state.constructionQueue = [...state.constructionQueue, item];
    return snapshot(state, now);
  }
  if (action.type === "startProduction") {
    const unit = action.unitType;
    if (unit !== "infantry") {
      throw new EconomyValidationError("This phase only exposes infantry production.");
    }

    const barracksLevel = state.provinceBuildings[province.id]?.barracks ?? province.buildings.barracks;
    const unitConfig = unit === "infantry" ? 1 : 3;
    if (barracksLevel < unitConfig) {
      throw new EconomyValidationError("Required barracks level is not available.");
    }

    const cost = calculateProductionCost(unit);
    if (state.resources.manpower < cost.manpower) {
      throw new EconomyValidationError("Insufficient manpower.");
    }
    if (state.resources.steel < cost.steel) {
      throw new EconomyValidationError("Insufficient steel.");
    }

    const id = crypto.randomUUID();
    state.resources = {
      ...state.resources,
      manpower: state.resources.manpower - cost.manpower,
      steel: state.resources.steel - cost.steel,
    };
    transaction(state, "manpower", -cost.manpower, "PRODUCTION_START", province.id, id);
    transaction(state, "steel", -cost.steel, "PRODUCTION_START", province.id, id);

    const minutes = calculateProductionTime(unit, barracksLevel);
    state.productionQueue = [
      ...state.productionQueue,
      {
        id,
        provinceId: province.id,
        type: unit,
        kind: "production",
        startedAt: now,
        finishesAt: now + minutes * 60_000,
      },
    ];
  }

  return snapshot(state, now);
}
