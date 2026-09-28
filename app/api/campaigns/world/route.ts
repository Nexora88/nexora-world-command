import { NextResponse } from "next/server";
import { getCampaign } from "@/data/campaigns";
import { enterSession } from "@/game/campaign/server/campaign-store";
import { getOrCreateWorld } from "@/game/campaign/server/campaign-world";
import { requireAccount } from "@/game/auth/server/request-auth";
export const runtime="nodejs";
export async function GET(req:Request){
 try{const account=requireAccount(req);const url=new URL(req.url),campaignId=url.searchParams.get("campaignId"),nationId=url.searchParams.get("nationId");if(!campaignId||!nationId)return NextResponse.json({error:"campaignId and nationId required"},{status:400});const campaign=getCampaign(campaignId);if(!campaign||campaign.mode!=="online_live")return NextResponse.json({error:"Online campaign not found"},{status:404});const session=enterSession(account.id,campaign.id,nationId);return NextResponse.json(getOrCreateWorld(campaign,session));}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"World access denied"},{status:401});}
}
