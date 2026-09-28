import { NextResponse } from "next/server";
import { CAMPAIGNS, getCampaign } from "@/data/campaigns";
import { getSessions, enterSession } from "@/game/campaign/server/campaign-store";
import { getAuthenticatedAccount, requireAccount } from "@/game/auth/server/request-auth";
export const runtime="nodejs";

export async function GET(req: Request) {
  const account = getAuthenticatedAccount(req);
  return NextResponse.json({ campaigns: CAMPAIGNS.filter((c) => c.mode === "online_live"), sessions: account ? getSessions(account.id) : [] });
}

export async function POST(req: Request) {
  try {
    const account = requireAccount(req);
    const body = await req.json();
    const campaign = getCampaign(String(body.campaignId));
    const nationId = String(body.nationId || "");
    if (!campaign || campaign.mode !== "online_live") return NextResponse.json({ error: "Geçersiz çevrimiçi kampanya." }, { status: 400 });
    if (!/^[A-Z]{2}$/.test(nationId)) return NextResponse.json({ error: "Geçersiz ülke." }, { status: 400 });
    const session = enterSession(account.id, campaign.id, nationId);
    return NextResponse.json({ ok: true, session });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Campaign access failed." }, { status: 401 }); }
}
