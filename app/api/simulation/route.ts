import { NextResponse } from "next/server";
import { advanceSimulation, createSnapshot } from "@/game/core/server/simulation-engine";
export const runtime="nodejs";
export async function GET(){return NextResponse.json(advanceSimulation());}
export async function POST(){return NextResponse.json(createSnapshot());}
