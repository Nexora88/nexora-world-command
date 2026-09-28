"use client";
import { ArrowRight, Crown, Globe2, Medal, Newspaper, Radio, Shield, Swords, Trophy, Users, Zap } from "lucide-react";
import { getCommanderLevel } from "@/data/progression/commander-levels";
import { nations } from "@/data/world/countries";
import type { CampaignDefinition } from "@/game/campaign/types";

interface Props { callsign:string; countryId:string; onCampaign:()=>void; onProfile:()=>void; }
const xp=3450;
const ranking=["IRON COMMAND","NEXORA LEGION","WORLD FRONT","EAGLE CORPS","NORTHERN STAR"];
export function CommanderLobby({callsign,countryId,onCampaign,onProfile}:Props){
 const level=getCommanderLevel(xp); const nation=nations.find(n=>n.id===countryId)??nations[0];
 return <main className="commander-lobby"><div className="lobby-shell">
  <header className="lobby-top"><div className="lobby-brand"><b>NEXORA</b><span>WORLD COMMAND</span></div><div className="lobby-identity"><span>{nation.flag}</span><div><b>{callsign.toUpperCase()}</b><small>{nation.displayName} · {level.title}</small></div></div><button onClick={onProfile}>COMMAND PROFILE</button></header>
  <section className="lobby-hero"><div><small>GLOBAL COMMAND NETWORK · 2026</small><h1>THE WORLD IS WAITING.</h1><p>Canlı dünyalara katıl, ülkeni yönet, diplomasi kur ve komutanlık kariyerini geliştir.</p><div className="lobby-actions"><button onClick={onCampaign}><Globe2/> CAMPAIGN BROWSER <ArrowRight/></button><button className="secondary"><Newspaper/> WORLD BRIEFING</button></div></div><div className="lobby-rank-card"><Trophy/><span>WAR RANK</span><b>COMMANDER</b><strong>#128</strong><small>GLOBAL EXPERIENCE</small><div className="xp-bar"><i style={{width:`${level.progressToNext}%`}}/></div><em>{xp.toLocaleString()} XP · LVL {level.level}</em></div></section>
  <section className="lobby-grid"><article><div className="lobby-section-head"><h2><Radio/> LIVE CAMPAIGNS</h2><span>SERVER STATUS · ONLINE</span></div><div className="promo-grid"><Promo icon={<Globe2/>} title="EUROPEAN FRONT" text="Province-based Europe theatre with live diplomacy and economy." tag="40 PLAYERS"/><Promo icon={<Zap/>} title="WORLD THEATRE" text="A larger global command network with trade and intelligence." tag="80 PLAYERS"/></div></article>
  <aside><div className="lobby-section-head"><h2><Medal/> COMMAND LADDER</h2><span>SEASON 01</span></div><div className="ladder">{ranking.map((name,i)=><div key={name}><b>{i+1}</b><span>{name}</span><em>{(9820-i*640).toLocaleString()} XP</em></div>)}</div></aside></section>
  <footer className="lobby-footer"><span><Shield/> SECURE ACCOUNT</span><span><Users/> GLOBAL PLAYERS</span><span><Swords/> WAR HISTORY</span><span><Crown/> COMMANDER CAREER</span></footer>
 </div></main>;
}
function Promo({icon,title,text,tag}:{icon:React.ReactNode;title:string;text:string;tag:string}){return <div className="lobby-promo"><span>{icon}</span><div><b>{title}</b><p>{text}</p><small>{tag} · LIVE WORLD</small></div></div>}
