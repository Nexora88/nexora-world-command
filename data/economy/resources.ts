export const RESOURCE_KEYS=["money","manpower","oil","steel","food","rareMaterials"] as const;
export type ResourceKey=(typeof RESOURCE_KEYS)[number];
export interface Resources{money:number;manpower:number;oil:number;steel:number;food?:number;rareMaterials?:number}
export const STARTING_RESOURCES:Resources={money:2450000,manpower:1250000,oil:352000,steel:610000,food:480000,rareMaterials:90000};
export const RESOURCE_LABELS:Record<ResourceKey,string>={money:"Money",manpower:"Manpower",oil:"Oil",steel:"Steel",food:"Food",rareMaterials:"Rare Materials"};
