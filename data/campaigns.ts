import type { CampaignDefinition } from "@/game/campaign/types";

export const CAMPAIGNS: CampaignDefinition[] = [
  {
    id: "europe-live-01", name: "EUROPEAN FRONT", shortName: "EUROPE", mode: "online_live", map: "europe", status: "live",
    description: "Avrupa merkezli sürekli çevrimiçi dünya. Ülkeler, ekonomi, diplomasi ve savaş aynı sunucu saatinde ilerler.",
    playerCapacity: 40, estimatedDayLength: 20, recommendedPlayers: 24,
    features: ["LIVE WORLD", "DIPLOMACY", "ECONOMY", "PROVINCES", "BATTLEFRONTS"],
  },
  {
    id: "world-live-01", name: "WORLD THEATRE", shortName: "WORLD", mode: "online_live", map: "world", status: "live",
    description: "Daha geniş harita için temel çevrimiçi dünya. Bölgesel genişleme ve küresel diplomasi üzerine kurulu.",
    playerCapacity: 80, estimatedDayLength: 30, recommendedPlayers: 48,
    features: ["LIVE WORLD", "GLOBAL MAP", "DIPLOMACY", "TRADE", "INTELLIGENCE"],
  },
  {
    id: "guest-europe", name: "EUROPE SANDBOX", shortName: "GUEST", mode: "offline_guest", map: "europe", status: "offline",
    description: "İnternetsiz deneme kampanyası. Yerel cihazda çalışır ve 3 oyun günüyle sınırlıdır.",
    playerCapacity: 1, estimatedDayLength: 1, recommendedPlayers: 1,
    features: ["OFFLINE", "3-DAY LIMIT", "LOCAL SAVE"],
  },
];

export const getCampaign = (id: string) => CAMPAIGNS.find((campaign) => campaign.id === id);
