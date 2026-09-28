import { describe,it,expect } from "vitest";
import { getOrCreateWorld } from "@/game/campaign/server/campaign-world";
import { CAMPAIGNS } from "@/data/campaigns";
describe("campaign world",()=>{it("creates stable world and advances day",()=>{const c=CAMPAIGNS[0];const s={campaignId:c.id,accountId:"a",nationId:"TR",mode:"online_live" as const,createdAt:0,lastPlayedAt:0,gameDay:1,status:"active" as const};const a=getOrCreateWorld(c,s,1_000_000);const b=getOrCreateWorld(c,s,1_000_000+c.estimatedDayLength*60_000);expect(a.worldId).toBe(b.worldId);expect(b.gameDay).toBeGreaterThan(a.gameDay);expect(b.online).toBe(true)})});
