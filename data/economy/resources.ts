export const RESOURCE_KEYS = ["money", "manpower", "oil", "steel"] as const;
export type ResourceKey = (typeof RESOURCE_KEYS)[number];
export type Resources = Record<ResourceKey, number>;
export const STARTING_RESOURCES: Resources = { money: 2450000, manpower: 1250000, oil: 352000, steel: 610000 };
export const RESOURCE_LABELS: Record<ResourceKey, string> = { money:"Money", manpower:"Manpower", oil:"Oil", steel:"Steel" };