import { getProvince } from "@/game/world/server/world-store";
import type { MovementAction, Army } from "./types";

const DEMO_COUNTRY_ID = "aurora";
const armies = new Map<string, Army>();
const stockpile = new Map<string, { infantry: number; tanks: number }>();

function province(id: string) {
  return getProvince(id);
}
function assertOwned(id: string) {
  const p = province(id);
  if (!p || p.ownerId !== DEMO_COUNTRY_ID) throw new Error("Province is not controlled by the player.");
  return p;
}
function recalc(a: Army) {
  a.strength = Math.max(0, a.infantry * 1 + a.tanks * 3);
  a.updatedAt = Date.now();
}
export function addProducedUnits(provinceId: string, infantry: number, tanks = 0) {
  assertOwned(provinceId);
  const current = stockpile.get(provinceId) ?? { infantry: 0, tanks: 0 };
  stockpile.set(provinceId, { infantry: current.infantry + infantry, tanks: current.tanks + tanks });
}
export function getArmy(id: string) { return armies.get(id); }
export function getArmies() { return [...armies.values()].map((a) => ({ ...a })); }
export function getStockpile() { return Object.fromEntries([...stockpile.entries()].map(([k,v]) => [k, { ...v }])); }
export function resetMovement() { armies.clear(); stockpile.clear(); }

export function performMovementAction(action: MovementAction): Army {
  if (action.type === "createArmy") {
    if (!action.provinceId) throw new Error("Province is required.");
    const p = assertOwned(action.provinceId);
    const pool = stockpile.get(p.id) ?? { infantry: 0, tanks: 0 };
    const infantry = Math.max(0, Math.floor(action.infantry ?? pool.infantry));
    const tanks = Math.max(0, Math.floor(action.tanks ?? pool.tanks));
    if (infantry + tanks <= 0) throw new Error("No units available to form an army.");
    if (infantry > pool.infantry || tanks > pool.tanks) throw new Error("Requested units exceed stockpile.");
    const army: Army = {
      id: crypto.randomUUID(), countryId: DEMO_COUNTRY_ID,
      name: action.name?.trim() || "Field Army", provinceId: p.id,
      infantry, tanks, strength: 0, morale: 100, organization: 100,
      status: "ready", createdAt: Date.now(), updatedAt: Date.now(),
    };
    recalc(army); armies.set(army.id, army);
    stockpile.set(p.id, { infantry: pool.infantry - infantry, tanks: pool.tanks - tanks });
    return { ...army };
  }
  if (!action.armyId || !action.provinceId) throw new Error("Army and destination are required.");
  const army = armies.get(action.armyId);
  if (!army) throw new Error("Army does not exist.");
  if (army.status === "destroyed") throw new Error("Destroyed army cannot move.");
  const target = province(action.provinceId);
  const current = province(army.provinceId);
  if (!target || !current || !current.neighbors.includes(target.id)) throw new Error("Destination is not adjacent.");
  if (target.ownerId !== DEMO_COUNTRY_ID) throw new Error("Armies may only move into friendly provinces before combat.");
  army.provinceId = target.id; army.status = "ready"; recalc(army);
  return { ...army };
}

export function retreatArmy(armyId: string, destinationId: string): Army {
  const army = armies.get(armyId);
  if (!army) throw new Error("Army does not exist.");
  const from = province(army.provinceId), to = province(destinationId);
  if (!from || !to || !from.neighbors.includes(to.id) || to.ownerId !== army.countryId) throw new Error("Invalid retreat destination.");
  army.provinceId = to.id; army.status = "retreating"; army.organization = Math.max(0, army.organization - 5); recalc(army);
  return { ...army };
}
