import { NextResponse } from "next/server";
import { getMovementSnapshot,performMovementAction,tickMovement } from "@/game/movement/server/movement-service";
export const runtime="nodejs";
export async function GET(){return NextResponse.json(tickMovement())}
export async function POST(req:Request){try{return NextResponse.json(performMovementAction(await req.json()))}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Movement failed."},{status:400})}}
