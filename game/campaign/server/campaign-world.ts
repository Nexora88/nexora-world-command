import { CAMPAIGNS } from "@/data/campaigns";
import type { CampaignDefinition, CampaignSession } from "@/game/campaign/types";

export interface CampaignWorldState {
  campaign: CampaignDefinition;
  session: CampaignSession;
  worldId: string;
  startedAt: number;
  gameDay: number;
  online: boolean;
}

const worlds = new Map<string, { startedAt:number }>();

export function getOrCreateWorld(campaign: CampaignDefinition, session: CampaignSession, now=Date.now()): CampaignWorldState {
  if (!worlds.has(campaign.id)) worlds.set(campaign.id,{startedAt:now});
  const start = worlds.get(campaign.id)!.startedAt;
  const elapsed = Math.max(0,now-start);
  const gameDay = Math.floor(elapsed/(campaign.estimatedDayLength*60_000))+1;
  return { campaign, session:{...session,lastPlayedAt:now,gameDay}, worldId:`world:${campaign.id}`,startedAt:start,gameDay,online:campaign.mode==="online_live" };
}

export function getLiveCampaigns(){return CAMPAIGNS.filter(c=>c.mode==="online_live");}
