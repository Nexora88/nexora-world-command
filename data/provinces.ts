import type { Province } from "@/lib/types";

export const provinces: Province[] = [
  { id:"nwc-01", name:"Northport", ownerId:"aurora", countryId:"aurora", population:4200000, terrain:"coast", neighbors:["nwc-02","nwc-05"], industryLevel:4, barracksLevel:2, fortificationLevel:2, infrastructureLevel:4, buildings:{industrialComplex:3,barracks:2,fortification:2}, coordinates:[18,18], weather:"clear" },
  { id:"nwc-02", name:"Highland", ownerId:"aurora", countryId:"aurora", population:1800000, terrain:"mountain", neighbors:["nwc-01","nwc-03"], industryLevel:2, barracksLevel:3, fortificationLevel:3, infrastructureLevel:2, buildings:{industrialComplex:2,barracks:3,fortification:3}, coordinates:[38,13], weather:"snow" },
  { id:"nwc-03", name:"Riverland", ownerId:"aurora", countryId:"aurora", population:3100000, terrain:"plains", neighbors:["nwc-02","nwc-04","nwc-06"], industryLevel:3, barracksLevel:2, fortificationLevel:1, infrastructureLevel:4, buildings:{industrialComplex:3,barracks:2,fortification:1}, coordinates:[57,25], weather:"rain" },
  { id:"nwc-04", name:"Eastmarch", ownerId:"solaris", countryId:"solaris", population:5200000, terrain:"urban", neighbors:["nwc-03","nwc-07"], industryLevel:5, barracksLevel:3, fortificationLevel:2, infrastructureLevel:5, buildings:{industrialComplex:3,barracks:3,fortification:2}, coordinates:[78,30], weather:"clear" },
  { id:"nwc-05", name:"Westreach", ownerId:"verdant", countryId:"verdant", population:2600000, terrain:"forest", neighbors:["nwc-01","nwc-06"], industryLevel:2, barracksLevel:2, fortificationLevel:2, infrastructureLevel:3, buildings:{industrialComplex:2,barracks:2,fortification:2}, coordinates:[13,43], weather:"fog" },
  { id:"nwc-06", name:"Central Basin", ownerId:"verdant", countryId:"verdant", population:4600000, terrain:"plains", neighbors:["nwc-03","nwc-05","nwc-07","nwc-08"], industryLevel:4, barracksLevel:4, fortificationLevel:1, infrastructureLevel:4, buildings:{industrialComplex:3,barracks:3,fortification:1}, coordinates:[43,47], weather:"clear" },
  { id:"nwc-07", name:"Iron Coast", ownerId:"solaris", countryId:"solaris", population:3500000, terrain:"coast", neighbors:["nwc-04","nwc-06","nwc-08"], industryLevel:5, barracksLevel:2, fortificationLevel:3, infrastructureLevel:4, buildings:{industrialComplex:3,barracks:2,fortification:3}, coordinates:[72,51], weather:"storm" },
  { id:"nwc-08", name:"Southlands", ownerId:"neutral", countryId:"neutral", population:2900000, terrain:"plains", neighbors:["nwc-06","nwc-07"], industryLevel:3, barracksLevel:3, fortificationLevel:2, infrastructureLevel:3, buildings:{industrialComplex:3,barracks:3,fortification:2}, coordinates:[52,77], weather:"heatwave" },
];

export const countries = [
  { id:"aurora", name:"Aurora Union", color:"#4ade80", capitalProvinceId:"nwc-01" },
  { id:"solaris", name:"Solaris Pact", color:"#f59e0b", capitalProvinceId:"nwc-04" },
  { id:"verdant", name:"Verdant Republic", color:"#60a5fa", capitalProvinceId:"nwc-06" },
];
