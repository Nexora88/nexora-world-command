export type TerrainType="plains"|"forest"|"mountain"|"hills"|"urban"|"coast"|"desert"|"tundra";
export type WeatherType="clear"|"rain"|"storm"|"snow"|"fog"|"heatwave"|"blizzard";
export interface Province{id:string;name:string;ownerId:string;countryId:string;population:number;terrain:TerrainType;movementModifier?:number;defenseModifier?:number;visibilityModifier?:number;supplyModifier?:number;neighbors:string[];industryLevel:number;barracksLevel:number;fortificationLevel:number;infrastructureLevel:number;buildings:{industrialComplex:number;barracks:number;fortification:number};coordinates:[number,number];weather:WeatherType;}
export interface Country{id:string;name:string;color:string;capitalProvinceId:string;}
