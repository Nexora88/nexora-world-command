import { beforeEach, describe, expect, it } from "vitest";
import { getEconomyState, resetEconomyStateForTests } from "../server/memory-store";
import {
  EconomyValidationError,
  getEconomySnapshot,
  performEconomyAction,
} from "../server/economy-service";

const construction = {
  type: "startConstruction" as const,
  provinceId: "nwc-03",
  buildingType: "fortification" as const,
};

const production = {
  type: "startProduction" as const,
  provinceId: "nwc-03",
  unitType: "infantry" as const,
};

beforeEach(() => resetEconomyStateForTests());

function expectRejected(action: Parameters<typeof performEconomyAction>[0], now = Date.now()) {
  expect(() => performEconomyAction(action, now)).toThrow(EconomyValidationError);
}

describe("server-authoritative economy", () => {
  it("valid construction request succeeds", () => {
    const result = performEconomyAction(construction, 1_000);
    expect(result.constructionQueue).toHaveLength(1);
    expect(result.resources.money).toBe(2_449_300);
    expect(result.resources.steel).toBe(609_640);
  });

  it("rejects insufficient construction resources", () => {
    const state = getEconomyState();
    state.resources.money = 0;
    expectRejected(construction, 1_000);
  });

  it("rejects invalid province ownership", () => {
    expectRejected({ ...construction, provinceId: "nwc-04" }, 1_000);
  });

  it("rejects invalid building level", () => {
    getEconomyState().provinceBuildings["nwc-03"].fortification = 99;
    expectRejected(construction, 1_000);
  });

  it("valid production request succeeds", () => {
    const result = performEconomyAction(production, 1_000);
    expect(result.productionQueue).toHaveLength(1);
    expect(result.resources.manpower).toBe(1_249_000);
    expect(result.resources.steel).toBe(609_750);
  });
  it("rejects insufficient manpower", () => {
    getEconomyState().resources.manpower = 500;
    expectRejected(production, 1_000);
  });

  it("rejects insufficient steel", () => {
    getEconomyState().resources.steel = 100;
    expectRejected(production, 1_000);
  });

  it("ignores a client-supplied fake resource amount", () => {
    const action = { ...construction, resourceAmount: 999_999_999 } as typeof construction & {
      resourceAmount: number;
    };
    const result = performEconomyAction(action, 1_000);
    expect(result.resources.money).toBe(2_449_300);
    expect(result.resources.steel).toBe(609_640);
  });

  it("completes construction from server time", () => {
    const started = performEconomyAction(construction, 10_000);
    const finishesAt = started.constructionQueue[0].finishesAt;
    const before = performEconomyAction({ type: "resolveCompleted" }, finishesAt - 1);
    expect(before.constructionQueue).toHaveLength(1);
    const after = performEconomyAction({ type: "resolveCompleted" }, finishesAt);
    expect(after.constructionQueue).toHaveLength(0);
    expect(after.provinceBuildings["nwc-03"].fortification).toBe(2);
  });

  it("completes production from server time", () => {
    const started = performEconomyAction(production, 20_000);
    const finishesAt = started.productionQueue[0].finishesAt;
    const before = performEconomyAction({ type: "resolveCompleted" }, finishesAt - 1);
    expect(before.productionQueue).toHaveLength(1);
    const after = performEconomyAction({ type: "resolveCompleted" }, finishesAt);
    expect(after.productionQueue).toHaveLength(0);
  });
  it("never allows a negative resource balance", () => {
    const state = getEconomyState();
    state.resources = { money: 0, manpower: 0, oil: 0, steel: 0 };
    expect(() => performEconomyAction(production, 1_000)).toThrow();
    expect(getEconomySnapshot(1_000).resources).toEqual({
      money: 0,
      manpower: 0,
      oil: 0,
      steel: 0,
    });
  });

  it("does not double-spend concurrent resource deductions", () => {
    const state = getEconomyState();
    state.resources.manpower = 2_000;
    state.resources.steel = 250;
    const results = [
      () => performEconomyAction(production, 1_000),
      () => performEconomyAction(production, 1_001),
    ].map((run) => {
      try {
        return { ok: true, value: run() };
      } catch (error) {
        return { ok: false, error };
      }
    });
    expect(results.filter((result) => result.ok)).toHaveLength(1);
    expect(getEconomyState().resources.steel).toBe(0);
    expect(getEconomyState().resources.manpower).toBe(1_000);
  });
});
