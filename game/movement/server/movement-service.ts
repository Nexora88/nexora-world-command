import { getProvince, setProvinceOwner } from "@/game/world/server/world-store";
import { climateMovementCost } from "@/game/world/server/climate-service";
import { getTerrainModifiers } from "@/game/world/terrain";
import { createOrder, getOrders, tickOrders, resetOrders } from "@/game/core/server/order-manager";
import { getGameClock, nowGameTimestamp } from "@/game/core/server/game-clock";
import { STARTING_ARMIES } from "@/data/world/starting-armies";
import { provinces } from "@/data/provinces";
import type { MovementAction, Army } from "./types";

const DEMO_COUNTRY_ID = "TR";
const armies = new Map<string, Army>();
const aiArmies = new Map<string, Army>();
const stockpile = new Map<string, { infantry: number; tanks: number }>();
function province(id: string) { return getProvince(id); }
function assertOwned(id: string) { const p = province(id); if (!p || p.ownerId !== DEMO_COUNTRY_ID) throw new Error("Province is not controlled by the player."); return p; }
function assertArmyOwner(a: Army) { if (a.countryId !== DEMO_COUNTRY_ID) throw new Error("Army is not controlled by the player."); return a; }
function recalc(a: Army) { a.strength = Math.max(0, a.infantry + a.tanks * 3); a.updatedAt = Date.now(); }

function initializeStartingArmies() {
  if (armies.size || aiArmies.size) return;
  for (const seed of STARTING_ARMIES) {
    const p = province(seed.provinceId) ?? provinces.find(x => x.id === seed.provinceId);
    if (!p || p.ownerId !== seed.countryId || (p.barracksLevel ?? p.buildings?.barracks ?? 0) < 1) continue;
    const army:Army={id:`start-${seed.provinceId}`,countryId:seed.countryId,name:seed.name,provinceId:seed.provinceId,infantry:seed.infantry,tanks:seed.tanks,strength:0,morale:100,organization:100,supply:100,fuel:100,maintenancePerHour:Math.round(seed.infantry*.02+seed.tanks*.75),status:"ready",createdAt:Date.now(),updatedAt:Date.now()};
    recalc(army);
    (seed.countryId===DEMO_COUNTRY_ID ? armies : aiArmies).set(army.id,army);
  }
}

initializeStartingArmies();

export function addProducedUnits(provinceId: string, infantry: number, tanks = 0) {
  assertOwned(provinceId); const c = stockpile.get(provinceId) ?? { infantry: 0, tanks: 0 };
  stockpile.set(provinceId, { infantry: c.infantry + infantry, tanks: c.tanks + tanks });
}
export function getArmy(id: string) { return armies.get(id) ?? aiArmies.get(id); }
export function getArmies() { return [...armies.values(), ...aiArmies.values()].map(a => ({ ...a, order: a.order ? { ...a.order } : undefined })); }
export function getStockpile() { return Object.fromEntries([...stockpile.entries()].map(([k, v]) => [k, { ...v }])); }
export function resetMovement() { armies.clear(); aiArmies.clear(); stockpile.clear(); resetOrders(); }

export function createAIArmy(countryId: string, provinceId: string, infantry: number, tanks = 0, name = "AI Field Army") {
  const p = province(provinceId); if (!p || p.ownerId !== countryId) throw new Error("AI can only raise armies in owned provinces.");
  if (infantry + tanks <= 0) throw new Error("AI army must contain units.");
  const a: Army = { id: crypto.randomUUID(), countryId, name, provinceId, infantry, tanks, strength: 0, morale: 100, organization: 100, supply: 100, fuel: 100, maintenancePerHour: Math.round(infantry * .02 + tanks * .75), status: "ready", createdAt: Date.now(), updatedAt: Date.now() };
  recalc(a); aiArmies.set(a.id, a); return { ...a };
}

export function moveArmyForCountry(armyId: string, targetId: string, allowNeutral = false) {
  const a = aiArmies.get(armyId); if (!a || a.status === "destroyed") throw new Error("AI army unavailable.");
  const from = province(a.provinceId), to = province(targetId);
  if (!from || !to || !from.neighbors.includes(to.id)) throw new Error("Destination is not adjacent.");
  if (to.ownerId !== a.countryId && !(allowNeutral && to.ownerId === "neutral")) throw new Error("AI cannot enter this province under current rules.");
  a.organization = Math.max(0, a.organization - Math.ceil(climateMovementCost(to) / 35));
  a.provinceId = to.id; a.status = "moving"; recalc(a);
  if (to.ownerId === "neutral" && allowNeutral) { setProvinceOwner(to.id, a.countryId); a.status = "ready"; }
  return { ...a };
}

export function performMovementAction(action: MovementAction): Army {
  if (action.type === "mergeArmies") {
    if (!action.sourceArmyId || !action.targetArmyId || action.sourceArmyId === action.targetArmyId) throw new Error("Two different armies are required.");
    const sourceRaw = armies.get(action.sourceArmyId); const targetRaw = armies.get(action.targetArmyId); if (!sourceRaw || !targetRaw) throw new Error("Army does not exist."); const source = assertArmyOwner(sourceRaw); const target = assertArmyOwner(targetRaw);
    if (!source || !target) throw new Error("Army does not exist.");
    if (source.status !== "ready" || target.status !== "ready" || source.provinceId !== target.provinceId) throw new Error("Armies must be ready in the same province.");
    target.infantry += source.infantry; target.tanks += source.tanks; target.morale = Math.round((target.morale + source.morale) / 2); target.organization = Math.min(target.organization, source.organization); target.supply = Math.min(target.supply, source.supply); target.fuel = Math.min(target.fuel, source.fuel); recalc(target); armies.delete(source.id); return { ...target };
  }

  if (action.type === "splitArmy") {
    if (!action.armyId) throw new Error("Army is required.");
    const sourceRaw = action.armyId ? armies.get(action.armyId) : undefined; if (!sourceRaw) throw new Error("Army does not exist.");
    const source = assertArmyOwner(sourceRaw); if (source.status !== "ready") throw new Error("Army is not available for splitting.");
    const infantry = Math.max(0, Math.floor(action.infantry ?? 0)); const tanks = Math.max(0, Math.floor(action.tanks ?? 0));
    if (infantry + tanks <= 0 || infantry > source.infantry || tanks > source.tanks || infantry + tanks >= source.infantry + source.tanks) throw new Error("Invalid split composition.");
    source.infantry -= infantry; source.tanks -= tanks; recalc(source);
    const created: Army = { ...source, id: crypto.randomUUID(), name: `${source.name} · Detached`, infantry, tanks, strength: 0, morale: source.morale, organization: source.organization, supply: source.supply, fuel: source.fuel, maintenancePerHour: Math.round(infantry*.02+tanks*.75), createdAt: Date.now(), updatedAt: Date.now() }; recalc(created); armies.set(created.id, created); return { ...created };
  }

  if (action.type === "createArmy") {
    if (!action.provinceId) throw new Error("Province is required.");
    const p = assertOwned(action.provinceId); const pool = stockpile.get(p.id) ?? { infantry: 0, tanks: 0 };
    const infantry = Math.max(0, Math.floor(action.infantry ?? pool.infantry));
    const tanks = Math.max(0, Math.floor(action.tanks ?? pool.tanks));
    if (infantry + tanks <= 0) throw new Error("No units available to form an army.");
    if (infantry > pool.infantry || tanks > pool.tanks) throw new Error("Requested units exceed stockpile.");
    const army: Army = { id: crypto.randomUUID(), countryId: DEMO_COUNTRY_ID, name: action.name?.trim() || "Field Army", provinceId: p.id, infantry, tanks, strength: 0, morale: 100, organization: 100, supply: 100, fuel: 100, maintenancePerHour: Math.round(infantry * .02 + tanks * .75), status: "ready", createdAt: Date.now(), updatedAt: Date.now() };
    recalc(army); armies.set(army.id, army);
    stockpile.set(p.id, { infantry: pool.infantry - infantry, tanks: pool.tanks - tanks });
    return { ...army };
  }

  if (!action.armyId || !action.provinceId) throw new Error("Army and destination are required.");
  const army = armies.get(action.armyId); if (!army) throw new Error("Army does not exist.");
  assertArmyOwner(army);
  if (army.status === "destroyed") throw new Error("Destroyed army cannot move.");
  if (army.order && army.order.type === "move") throw new Error("Army already has an active movement order.");
  const target = province(action.provinceId), current = province(army.provinceId);
  if (!target || !current || !current.neighbors.includes(target.id)) throw new Error("Destination is not adjacent.");
  if (target.ownerId !== DEMO_COUNTRY_ID) throw new Error("Armies may only move into friendly provinces before combat.");

  const cost = climateMovementCost(target) / Math.max(target.movementModifier ?? getTerrainModifiers(target.terrain).movementModifier, 0.1);
  const issuedAt = nowGameTimestamp();
  const durationMinutes = Math.max(30, Math.round(cost * 20));
  const order = createOrder({
    type: "move", actorId: army.id, sourceId: current.id, targetId: target.id,
    createdAt: issuedAt, startsAt: issuedAt, finishesAt: issuedAt + durationMinutes,
    payload: { route: current.id + "," + target.id }
  });
  army.organization = Math.max(0, army.organization - Math.ceil(cost / 45));
  army.status = "moving";
  army.order = {
    type: "move", orderId: order.id, fromProvinceId: current.id, targetProvinceId: target.id,
    route: [current.id, target.id], issuedAt, eta: order.finishesAt ?? issuedAt + durationMinutes
  };
  recalc(army);
  return { ...army };
}

export function tickMovement() {
  const clock = getGameClock();
  const completed = tickOrders(nowGameTimestamp());
  for (const army of armies.values()) {
    if (!army.order?.orderId) continue;
    const order = completed.find(o => o.id === army.order?.orderId);
    if (order?.status !== "completed") continue;
    const target = province(army.order.targetProvinceId);
    if (target) army.provinceId = target.id;
    army.status = "ready";
    army.order = undefined;
    army.updatedAt = Date.now();
  }
  return { clock, orders: getOrders(), armies: getArmies() };
}

export function getMovementSnapshot() {
  return { clock: getGameClock(), orders: getOrders(), armies: getArmies(), stockpile: getStockpile() };
}

export function retreatArmy(armyId: string, destinationId: string): Army {
  const army = armies.get(armyId); if (!army) throw new Error("Army does not exist.");
  const from = province(army.provinceId), to = province(destinationId);
  if (!from || !to || !from.neighbors.includes(to.id) || to.ownerId !== army.countryId) throw new Error("Invalid retreat destination.");
  army.provinceId = to.id; army.status = "retreating"; army.order = undefined;
  army.organization = Math.max(0, army.organization - 5); recalc(army); return { ...army };
}
