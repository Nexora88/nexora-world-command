import {NextResponse} from "next/server"; import {getWorldMap} from "@/game/world/server/world-store"; export async function GET(){return NextResponse.json(getWorldMap())}
