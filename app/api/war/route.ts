import { NextResponse } from "next/server";
import { attackProvince,declareWar,getBattleHistory,getWars,WarValidationError } from "@/game/war/server/war-service";
export const runtime="nodejs";
export async function GET(){return NextResponse.json({wars:getWars(),battles:getBattleHistory()})}
export async function POST(request:Request){try{const b=await request.json() as Record<string,unknown>;if(b.type==="declareWar"&&typeof b.defender==="string")return NextResponse.json(declareWar("TR",b.defender));if(b.type==="attack"&&typeof b.warId==="string"&&typeof b.armyId==="string"&&typeof b.provinceId==="string")return NextResponse.json(attackProvince(b.warId,b.armyId,b.provinceId,typeof b.randomSeed==="number"?b.randomSeed:undefined));throw new WarValidationError("Unknown war action.")}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"War action failed."},{status:400})}}
