import type { Province } from "@/lib/types";

export type CityMood = "content" | "uneasy" | "tense" | "unrest";
export type CityEvent = "festival" | "market_boom" | "food_shortage" | "labor_strike" | "border_fear" | "public_confidence";

export interface CitySocialState {
  approval: number;
  stability: number;
  unrest: number;
  migrationPressure: number;
  mood: CityMood;
  event: CityEvent;
  eventLabel: string;
  eventEffect: string;
}

const EVENT_LABELS: Record<CityEvent, string> = {
  festival: "ŞEHİR FESTİVALİ", market_boom: "PAZAR CANLILIĞI", food_shortage: "GIDA SIKIŞIKLIĞI",
  labor_strike: "İŞÇİ PROTESTOSU", border_fear: "SINIR GERGİNLİĞİ", public_confidence: "HALK GÜVENİ ARTIYOR",
};
const EVENT_EFFECTS: Record<CityEvent, string> = {
  festival: "Halk morali ve şehir bağlılığı yükseliyor.", market_boom: "Ticaret hareketlendi, ekonomik güven artıyor.",
  food_shortage: "Temel ihtiyaç baskısı huzursuzluğu artırıyor.", labor_strike: "Üretim yavaşlıyor, sosyal tansiyon yükseliyor.",
  border_fear: "Güvenlik kaygısı halkın günlük psikolojisini etkiliyor.", public_confidence: "Kamu hizmetlerine güven güçleniyor.",
};

function hash(id: string) { return [...id].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 997, 17); }

export function getCitySocialState(province: Province): CitySocialState {
  const h = hash(province.id);
  const industry = province.industryLevel ?? province.buildings?.industrialComplex ?? 0;
  const fort = province.fortificationLevel ?? province.buildings?.fortification ?? 0;
  const approval = Math.max(28, Math.min(94, 58 + (h % 25) + industry * 3 - fort));
  const pressure = Math.max(4, Math.min(82, 18 + ((h * 7) % 35) - industry * 2));
  const unrest = Math.max(3, Math.min(78, 100 - approval + Math.floor(pressure / 3)));
  const stability = Math.max(18, Math.min(96, Math.round((approval + (100 - unrest)) / 2)));
  const events: CityEvent[] = ["festival", "market_boom", "food_shortage", "labor_strike", "border_fear", "public_confidence"];
  const event = events[h % events.length];
  const mood: CityMood = unrest >= 60 ? "unrest" : unrest >= 42 ? "tense" : unrest >= 25 ? "uneasy" : "content";
  return { approval, stability, unrest, migrationPressure: pressure, mood, event, eventLabel: EVENT_LABELS[event], eventEffect: EVENT_EFFECTS[event] };
}
