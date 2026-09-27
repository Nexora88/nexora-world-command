import { NextResponse } from "next/server";
import { getWorld } from "@/game/world/server/world-store";
export const runtime="nodejs";
export async function GET(){return NextResponse.json({provinces:getWorld()})}
