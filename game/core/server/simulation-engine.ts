import { getGameClock, type GameClockState } from "./game-clock";
import { getEconomySnapshot } from "@/game/economy/server/economy-service";
import { getMovementSnapshot, tickMovement } from "@/game/movement/server/movement-service";
import { getActiveBattles, getBattleHistory, getWars, tickBattles } from "@/game/war/server/war-service";

export interface SimulationSnapshot {
  clock: GameClockState;
  economy: ReturnType<typeof getEconomySnapshot>;
  movement: ReturnType<typeof getMovementSnapshot>;
  wars: ReturnType<typeof getWars>;
  activeBattles: ReturnType<typeof getActiveBattles>;
  recentBattles: ReturnType<typeof getBattleHistory>;
  serverTime: number;
  tickId: number;
}

let tickId = 0;
let ticking = false;

export function advanceSimulation(): SimulationSnapshot {
  if (ticking) return createSnapshot();
  ticking = true;
  try {
    const serverTime = Date.now();
    const clock = getGameClock();
    tickMovement();
    tickBattles(serverTime);
    const economy = getEconomySnapshot(serverTime);
    tickId += 1;
    return { clock, economy, movement: getMovementSnapshot(), wars: getWars(), activeBattles: getActiveBattles(), recentBattles: getBattleHistory(), serverTime, tickId };
  } finally {
    ticking = false;
  }
}

export function createSnapshot(): SimulationSnapshot {
  const serverTime = Date.now();
  return { clock: getGameClock(), economy: getEconomySnapshot(serverTime), movement: getMovementSnapshot(), wars: getWars(), activeBattles: getActiveBattles(), recentBattles: getBattleHistory(), serverTime, tickId };
}

export function getSimulationTickId() { return tickId; }
export function resetSimulation() { tickId = 0; ticking = false; }
