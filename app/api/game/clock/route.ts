import { NextResponse } from "next/server";
import { getGameClock, setGameClock } from "@/game/core/server/game-clock";
import { tickMovement } from "@/game/movement/server/movement-service";

export const runtime = "nodejs";

export async function GET() {
  const snapshot = tickMovement();
  return NextResponse.json({ clock: snapshot.clock, orders: snapshot.orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const clock = setGameClock({ speed: body.speed, paused: body.paused });
    const snapshot = tickMovement();
    return NextResponse.json({ clock, orders: snapshot.orders });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Clock update failed." }, { status: 400 });
  }
}
