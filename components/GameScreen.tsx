"use client";
import {useEffect} from "react";
import {Activity,Bell,Coins,Fuel,Hammer,Shield,Users} from "lucide-react";
import {WorldMap} from "@/components/map/WorldMap";
import {ProvincePanel} from "@/components/panels/ProvincePanel";
import {EconomyPanel} from "@/components/panels/EconomyPanel";
import {ProductionPanel} from "@/components/panels/ProductionPanel";
import {ConstructionPanel} from "@/components/panels/ConstructionPanel";
import {provinces} from "@/data/provinces";
import {useGameStore} from "@/lib/game-store";

export function GameScreen(){
  const selectedId=useGameStore(s=>s.selectedProvinceId);
  const selectProvince=useGameStore(s=>s.selectProvince);
  const resources=useGameStore(s=>s.resources);
  const provinceBuildings=useGameStore(s=>s.provinceBuildings);
  const productionQueue=useGameStore(s=>s.productionQueue);
  const constructionQueue=useGameStore(s=>s.constructionQueue);
  const syncQueues=useGameStore(s=>s.syncQueues);
  const startConstruction=useGameStore(s=>s.startConstruction);
  const startProduction=useGameStore(s=>s.startProduction);
  useEffect(()=>{const id=setInterval(()=>syncQueues(Date.now()),1000);return()=>clearInterval(id)},[syncQueues]);
  const selectedBase=provinces.find(p=>p.id===selectedId)??null;
  const selected=selectedBase?{...selectedBase,buildings:provinceBuildings[selectedBase.id]??selectedBase.buildings}:null;
  return <main className="command-shell">
    <header className="topbar"><div className="brand"><Shield size={19}/><span>NEXORA</span><b>WORLD COMMAND</b></div>
      <div className="resources"><span><Coins/> {Math.round(resources.money).toLocaleString()}</span><span><Users/> {Math.round(resources.manpower).toLocaleString()}</span><span><Fuel/> {Math.round(resources.oil).toLocaleString()}</span><span><Hammer/> {Math.round(resources.steel).toLocaleString()}</span></div>
      <div className="top-status"><Activity/> LIVE <span>DAY 01 · 06:42</span><Bell/></div></header>
    <section className="workspace"><aside className="left-panel"><div className="commander"><div className="avatar">NC</div><div><small>COMMANDER</small><strong>NEXORA COMMAND</strong><em>Industrial Doctrine</em></div></div>
      {['COMMAND','ARMIES','ECONOMY','DIPLOMACY','INTELLIGENCE'].map(item=><button key={item} className="nav">{item}</button>)}
      <div className="side-card"><small>WORLD STATUS</small><strong>STABLE</strong><span>8 provinces · 3 powers</span></div></aside>
      <div className="map-wrap"><WorldMap provinces={provinces} onSelect={selectProvince}/><div className="map-overlay"><span>SECTOR: NORTH CONTINENT</span><span>LIVE WORLD · TICK 0042</span></div><div className="minimap"><div className="mini-grid"/><b>TACTICAL MAP</b></div></div>
      <ProvincePanel province={selected} onUpgrade={t=>selected&&startConstruction(selected,t)} onInfantry={()=>selected&&startProduction(selected,"infantry")}/></section>
    <section className="lower-panels"><EconomyPanel resources={resources} provinces={provinces}/><ConstructionPanel province={selected??provinces[0]} queue={constructionQueue} onUpgrade={t=>selected&&startConstruction(selected,t)}/><ProductionPanel queue={productionQueue}/></section>
    <footer className="newsbar"><strong>WORLD NEWS</strong><span>Economic simulation active.</span><span>Construction and infantry production use client timers; server tick integration is next.</span></footer>
  </main>;
}