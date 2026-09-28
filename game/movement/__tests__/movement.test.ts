import { describe, it, expect, beforeEach } from "vitest";
import { resetMovement, addProducedUnits, performMovementAction, getArmies } from "@/game/movement/server/movement-service";
import { resetWorld } from "@/game/world/server/world-store";

describe("real world movement graph", () => {
  beforeEach(() => { resetMovement(); resetWorld(); });
  it("forms an army from produced units", () => {
    addProducedUnits("TR_ISTANBUL", 1000);
    const a = performMovementAction({ type: "createArmy", provinceId: "TR_ISTANBUL" });
    expect(a.infantry).toBe(1000); expect(a.strength).toBe(1000);
  });
  it("only allows adjacent friendly movement and creates an ETA order", () => {
    addProducedUnits("TR_ISTANBUL", 1000);
    const a = performMovementAction({ type: "createArmy", provinceId: "TR_ISTANBUL" });
    expect(() => performMovementAction({ type: "moveArmy", armyId: a.id, provinceId: "TR_GAZIANTEP" })).toThrow();
    const moving = performMovementAction({ type: "moveArmy", armyId: a.id, provinceId: "TR_BURSA" });
    expect(getArmies()[0].provinceId).toBe("TR_ISTANBUL");
    expect(moving.status).toBe("moving");
    expect(moving.order?.targetProvinceId).toBe("TR_BURSA");
    expect(moving.order?.eta).toBeGreaterThan(moving.order?.issuedAt ?? 0);
  });
  it("rejects zero-unit armies", () => {
    expect(() => performMovementAction({ type: "createArmy", provinceId: "TR_ISTANBUL" })).toThrow();
  });
});
