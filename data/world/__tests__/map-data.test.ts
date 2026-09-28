import { describe, expect, it } from "vitest";
import {
  REAL_WORLD_COUNTRIES,
  REAL_WORLD_PROVINCES,
  realWorldProvincesAsGameData,
} from "@/data/world/real-world-provinces";
import { STARTING_ARMIES } from "@/data/world/starting-armies";

describe("world map data", () => {
  it("uses unique province IDs", () => {
    const ids = realWorldProvincesAsGameData.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps world coordinates inside the global map bounds", () => {
    for (const province of Object.values(REAL_WORLD_PROVINCES)) {
      expect(province.coordinates.x).toBeGreaterThanOrEqual(0);
      expect(province.coordinates.x).toBeLessThanOrEqual(100);
      expect(province.coordinates.y).toBeGreaterThanOrEqual(0);
      expect(province.coordinates.y).toBeLessThanOrEqual(56.25);
    }
  });

  it("has every starting army on a real province with a barracks", () => {
    for (const army of STARTING_ARMIES) {
      const province = realWorldProvincesAsGameData.find((p) => p.id === army.provinceId);
      expect(province).toBeDefined();
      expect(province?.ownerId).toBe(army.countryId);
      expect(province?.barracksLevel ?? 0).toBeGreaterThan(0);
    }
  });

  it("has valid capitals for every playable country", () => {
    for (const country of REAL_WORLD_COUNTRIES) {
      expect(REAL_WORLD_PROVINCES[country.capitalProvinceId]).toBeDefined();
    }
  });
});
