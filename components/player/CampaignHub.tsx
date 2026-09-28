"use client";
import { Radio, Globe2, WifiOff, ArrowRight, Users, Clock3 } from "lucide-react";
import { CAMPAIGNS } from "@/data/campaigns";
import type { CampaignDefinition } from "@/game/campaign/types";

interface Props { guest: boolean; onSelect: (campaign: CampaignDefinition) => void; }

export function CampaignHub({ guest, onSelect }: Props) {
  const available = CAMPAIGNS.filter((c) => guest ? c.mode === "offline_guest" : c.mode === "online_live");
  return (
    <div className="campaign-hub">
      <div className="campaign-header">
        <div><p className="entry-kicker">{guest ? "OFFLINE CAMPAIGN SELECT" : "LIVE WORLD NETWORK"}</p><h1>{guest ? "LOCAL CAMPAIGN" : "CHOOSE YOUR WORLD"}</h1><p>Her kampanya kendi dünya durumu, zaman akışı ve oyuncu oturumları için ayrı bir kimliğe sahiptir.</p></div>
        <div className="campaign-network"><Radio/><b>{guest ? "LOCAL ONLY" : "SERVER LIVE"}</b><span>{guest ? "NO NETWORK" : "AUTHORITATIVE SIMULATION"}</span></div>
      </div>
      <div className="campaign-grid">
        {available.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} onSelect={onSelect} />)}
      </div>
    </div>
  );
}

function CampaignCard({ campaign, onSelect }: { campaign: CampaignDefinition; onSelect: Props["onSelect"] }) {
  const live = campaign.status === "live";
  return (
    <article className={`campaign-card ${campaign.map} ${live ? "live" : ""}`}>
      <div className="campaign-map-art"><span>{campaign.map === "europe" ? "EUROPE" : "WORLD"}</span><Globe2/></div>
      <div className="campaign-card-body"><div className="campaign-meta"><span className={`campaign-status ${campaign.status}`}>{live ? "● LIVE" : "◐ STARTING"}</span><small>{campaign.id.toUpperCase()}</small></div>
      <h2>{campaign.name}</h2><p>{campaign.description}</p>
      <div className="campaign-stats"><span><Users/> {campaign.playerCapacity} MAX</span><span><Clock3/> {campaign.estimatedDayLength}m / DAY</span></div>
      <div className="campaign-tags">{campaign.features.map((feature) => <b key={feature}>{feature}</b>)}</div>
      <button type="button" disabled={!live && campaign.mode === "online_live"} onClick={() => onSelect(campaign)}>{live ? "ENTER WORLD" : "JOIN QUEUE"} <ArrowRight/></button></div>
    </article>
  );
}
