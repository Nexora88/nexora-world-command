import type { TerrainType } from "@/lib/types";

export interface TerrainModifiers {
  movementModifier: number;
  defenseModifier: number;
  visibilityModifier: number;
  supplyModifier: number;
}

export const terrainModifiers: Record<TerrainType, TerrainModifiers> = {
  plains: { movementModifier: 1, defenseModifier: 1, visibilityModifier: 1, supplyModifier: 1 },
  forest: { movementModifier: .75, defenseModifier: 1.15, visibilityModifier: .65, supplyModifier: .9 },
  mountain: { movementModifier: .5, defenseModifier: 1.3, visibilityModifier: .75, supplyModifier: .8 },
  hills: { movementModifier: .8, defenseModifier: 1.12, visibilityModifier: .82, supplyModifier: .9 },
  urban: { movementModifier: .65, defenseModifier: 1.25, visibilityModifier: .85, supplyModifier: .9 },
  coast: { movementModifier: .9, defenseModifier: 1.05, visibilityModifier: .95, supplyModifier: 1 },
  desert: { movementModifier: .7, defenseModifier: 1.05, visibilityModifier: 1.1, supplyModifier: .65 },
  tundra: { movementModifier: .55, defenseModifier: 1.15, visibilityModifier: .8, supplyModifier: .6 },
};

export const terrainLabels: Record<TerrainType, string> = {
  plains: "PLAINS", forest: "FOREST", mountain: "MOUNTAIN", urban: "URBAN",
  coast: "COAST", desert: "DESERT", tundra: "TUNDRA", hills: "HILLS",
};

export function getTerrainModifiers(terrain: TerrainType) {
  return terrainModifiers[terrain];
}
