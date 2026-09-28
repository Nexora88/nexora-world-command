import { describe, expect, it } from "vitest";
import { advanceSimulation, getSimulationTickId } from "../server/simulation-engine";

describe("simulation engine", () => {
  it("advances all server domains through one authoritative tick", () => {
    const before = getSimulationTickId();
    const snapshot = advanceSimulation();
    expect(snapshot.tickId).toBe(before + 1);
    expect(snapshot.clock.day).toBeGreaterThanOrEqual(1);
    expect(snapshot.economy.resources).toBeDefined();
    expect(snapshot.movement.armies).toBeDefined();
    expect(snapshot.wars).toBeDefined();
    expect(snapshot.activeBattles).toBeDefined();
    expect(snapshot.serverTime).toBeTypeOf("number");
  });
});
