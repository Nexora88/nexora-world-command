import {getWorld,setProvinceWeather} from "@/game/world/server/world-store";
import type {WeatherType} from "@/lib/types";
const cycle:WeatherType[]=["clear","rain","fog","storm","snow","blizzard","heatwave"];
let lastTick=0;
export function tickWeather(now=Date.now()){if(now-lastTick<15000)return false;lastTick=now;for(const p of getWorld()){const index=Math.abs(Math.floor(now/60000)+p.id.length+p.coordinates[0])%cycle.length;const w=cycle[index];setProvinceWeather(p.id,w)}return true}
export function weatherMovementModifier(w:WeatherType){return w==="blizzard"?1.8:w==="storm"?1.55:w==="snow"?1.35:w==="fog"?1.2:w==="heatwave"?1.15:w==="rain"?1.1:1}
export function weatherCombatModifier(w:WeatherType){return w==="blizzard"?.72:w==="storm"?.82:w==="fog"?.9:w==="snow"?.9:w==="heatwave"?.92:w==="rain"?.96:1}
