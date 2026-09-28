import { NextResponse } from "next/server";
import {requireAccount} from "@/game/auth/server/request-auth";
import {
  EconomyValidationError,
  getEconomySnapshot,
  performEconomyAction,
} from "@/game/economy/server/economy-service";
import type { BuildingType } from "@/data/economy/buildings";
import type { UnitType } from "@/data/economy/units";
import type { EconomyAction } from "@/game/economy/server/types";

export const runtime = "nodejs";

function parseAction(body: unknown): EconomyAction {
  if (!body || typeof body !== "object") {
    throw new EconomyValidationError("Invalid economy request.");
  }

  const value = body as Record<string, unknown>;
  if (value.type === "startConstruction" &&
      typeof value.provinceId === "string" &&
      typeof value.buildingType === "string") {
    return {
      type: "startConstruction",
      provinceId: value.provinceId,
      buildingType: value.buildingType as BuildingType,
    };
  }
  if (value.type === "startProduction" &&
      typeof value.provinceId === "string" &&
      typeof value.unitType === "string") {
    return {
      type: "startProduction",
      provinceId: value.provinceId,
      unitType: value.unitType as UnitType,
    };
  }
  if (value.type === "resolveCompleted") return { type: "resolveCompleted" };
  throw new EconomyValidationError("Unknown economy action.");
}

export async function GET(request:Request) {
  try{requireAccount(request);}catch{return NextResponse.json({error:"ONLINE_ACCOUNT_REQUIRED"},{status:401});}
  return NextResponse.json(getEconomySnapshot());
}

export async function POST(request: Request) {
  try{requireAccount(request);}catch{return NextResponse.json({error:"ONLINE_ACCOUNT_REQUIRED"},{status:401});}
  try {
    const action = parseAction(await request.json());
    return NextResponse.json(performEconomyAction(action));
  } catch (error) {
    if (error instanceof EconomyValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Economy action failed." }, { status: 500 });
  }
}
