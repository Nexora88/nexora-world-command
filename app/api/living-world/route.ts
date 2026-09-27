import {NextResponse} from "next/server";
import {tickAI,getAIStates} from "@/game/ai/server/ai-engine";
import {tickWeather} from "@/game/world/server/weather-service";
import {getClimateMap} from "@/game/world/server/climate-service";
import {getWorldEvents} from "@/game/events/server/event-store";
import {getAlerts} from "@/game/alerts/server/alert-store";
export async function GET(){const now=Date.now();tickWeather(now);tickAI(now);return NextResponse.json({serverTime:now,ai:getAIStates(),events:getWorldEvents(),alerts:getAlerts(),climate:getClimateMap()},{headers:{"Cache-Control":"no-store"}})}
