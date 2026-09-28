export type CampaignMode = "online_live" | "offline_guest";
export type CampaignMap = "europe" | "world";
export interface CampaignDefinition {
  id: string;
  name: string;
  shortName: string;
  mode: CampaignMode;
  map: CampaignMap;
  status: "live" | "starting" | "offline";
  description: string;
  playerCapacity: number;
  estimatedDayLength: number;
  recommendedPlayers: number;
  features: string[];
}

export interface CampaignSession {
  campaignId: string;
  accountId?: string;
  nationId: string;
  mode: CampaignMode;
  createdAt: number;
  lastPlayedAt: number;
  gameDay: number;
  status: "active" | "completed" | "abandoned";
}
