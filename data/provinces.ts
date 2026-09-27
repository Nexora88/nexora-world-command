import { realWorldProvincesAsGameData, REAL_WORLD_COUNTRIES } from "@/data/world/real-world-provinces";
export const provinces = realWorldProvincesAsGameData;
export const countries = REAL_WORLD_COUNTRIES.map(c => ({id:c.id,name:c.name,color:c.color,capitalProvinceId:c.capitalProvinceId}));
