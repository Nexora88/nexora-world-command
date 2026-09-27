export type TerrainType = "plains" | "forest" | "mountain" | "urban" | "coast";
export type WeatherType = "clear" | "rain" | "storm" | "snow" | "fog" | "heatwave";

export interface Province {
  id: string;
  name: string;
  ownerId: string;
  countryId: string;
  population: number;
  terrain: TerrainType;
  neighbors: string[];
  industryLevel: number;
  barracksLevel: number;
  fortificationLevel: number;
  infrastructureLevel: number;
  buildings: {
    industrialComplex: number;
    barracks: number;
    fortification: number;
  };
  coordinates: [number, number];
  weather: WeatherType;
}

export interface Country {
  id: string;
  name: string;
  color: string;
  capitalProvinceId: string;
}