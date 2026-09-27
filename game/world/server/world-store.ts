import { provinces as initialProvinces, countries } from "@/data/provinces";
import type { Province } from "@/lib/types";

let world: Province[] = initialProvinces.map((p) => ({
  ...p,
  neighbors: [...p.neighbors],
  buildings: { ...p.buildings },
}));

export function getWorld(): Province[] {
  return world.map((p) => ({ ...p, neighbors: [...p.neighbors], buildings: { ...p.buildings } }));
}

export function getProvince(id: string): Province | undefined {
  return world.find((p) => p.id === id);
}

export function resetWorld(): void {
  world = initialProvinces.map((p) => ({
    ...p,
    neighbors: [...p.neighbors],
    buildings: { ...p.buildings },
  }));
}

export function setProvinceOwner(provinceId: string, ownerId: string): Province {
  const province = getProvince(provinceId);
  if (!province) throw new Error("Province does not exist.");
  const country = countries.find((c) => c.id === ownerId);
  if (!country) throw new Error("Country does not exist.");
  province.ownerId = ownerId;
  province.countryId = ownerId;
  return { ...province, neighbors: [...province.neighbors], buildings: { ...province.buildings } };
}
