"use client";

import { Activity, Bell, Coins, Fuel, Hammer, Shield, Users } from "lucide-react";
import { WorldMap } from "@/components/map/WorldMap";
import { ProvincePanel } from "@/components/panels/ProvincePanel";
import { provinces } from "@/data/provinces";
import { useGameStore } from "@/lib/game-store";

export function GameScreen() {
  const selectedId = useGameStore((s) => s.selectedProvinceId);
  const selectProvince = useGameStore((s) => s.selectProvince);
  const selected = provinces.find((p) => p.id === selectedId) ?? null;
  return <main className="command-shell">
    <header className="topbar"><div className="brand"><Shield size={19}/><span>NEXORA</span><b>WORLD COMMAND</b></div>
      <div className="resources"><span><Coins/> 12,480</span><span><Users/> 84,200</span><span><Fuel/> 7,320</span><span><Hammer/> 4,180</span></div>
      <div className="top-status"><Activity/> LIVE <span>DAY 01 · 06:42</span><Bell/></div></header>
    <section className="workspace"><aside className="left-panel"><div className="commander"><div className="avatar">NC</div><div><small>COMMANDER</small><strong>NEXORA COMMAND</strong><em>Industrial Doctrine</em></div></div>
      {["COMMAND","ARMIES","ECONOMY","DIPLOMACY","INTELLIGENCE"].map((item)=><button key={item} className="nav">{item}</button>)}
      <div className="side-card"><small>WORLD STATUS</small><strong>STABLE</strong><span>8 provinces · 3 powers</span></div></aside>
      <div className="map-wrap"><WorldMap provinces={provinces} onSelect={selectProvince}/><div className="map-overlay"><span>SECTOR: NORTH CONTINENT</span><span>LIVE WORLD · TICK 0042</span></div><div className="minimap"><div className="mini-grid"/><b>TACTICAL MAP</b></div></div>
      <ProvincePanel province={selected}/></section>
    <footer className="newsbar"><strong>WORLD NEWS</strong><span>Trade routes remain stable across the Central Basin.</span><span>Weather front approaching Iron Coast.</span><span>Realtime simulation active.</span></footer>
  </main>;
}