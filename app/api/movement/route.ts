import { NextResponse } from "next/server";
import {requireAccount} from "@/game/auth/server/request-auth";
import { getMovementSnapshot,performMovementAction,tickMovement } from "@/game/movement/server/movement-service";
export const runtime="nodejs";
export async function GET(req:Request){try{requireAccount(req);return NextResponse.json(tickMovement())}catch{return NextResponse.json({error:"ONLINE_ACCOUNT_REQUIRED"},{status:401})}}
export async function POST(req:Request){try{requireAccount(req);return NextResponse.json(performMovementAction(await req.json()))}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Movement failed."},{status:400})}}
