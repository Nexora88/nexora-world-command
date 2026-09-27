import {NextResponse} from "next/server"; import {getWorld} from "@/game/world/server/world-store"; export async function GET(){return NextResponse.json(getWorld())}
