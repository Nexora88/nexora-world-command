"use client";
import {useEffect} from "react";
import {Activity,Bell,Coins,Fuel,Hammer,Shield,Users} from "lucide-react";
import {WorldMap} from "@/components/map/WorldMap";
import {ProvincePanel} from "@/components/panels/ProvincePanel";
import {EconomyPanel} from "@/components/panels/EconomyPanel";
import {ProductionPanel} from "@/components/panels/ProductionPanel";
import {ConstructionPanel} from "@/components/panels/ConstructionPanel";
import {ArmyPanel} from "@/components/panels/ArmyPanel";
import {WarPanel} from "@/components/panels/WarPanel";
import {BattleResultPanel} from "@/components/panels/BattleResultPanel";
import {useGameStore} from "@/lib/game-store";
export function GameScreen(){
 const selectedId=useGameStore(s=>s.selectedProvinceId),select=useGameStore(s=>s.selectProvince),provinces=useGameStore(s=>s.provinces);
 const resources=useGameStore(s=>s.resources),income=useGameStore(s=>s.income),buildings=useGameStore(s=>s.provinceBuildings);
 const production=useGameStore(s=>s.productionQueue),construction=useGameStore(s=>s.constructionQueue),armies=useGameStore(s=>s.armies),wars=useGameStore(s=>s.wars),battles=useGameStore(s=>s.battles);
 const load=useGameStore(s=>s.loadServerState),sync=useGameStore(s=>s.syncAll),startC=useGameStore(s=>s.startConstruction),startP=useGameStore(s=>s.startProduction),createArmy=useGameStore(s=>s.createArmy),declareWar=useGameStore(s=>s.declareWar),attack=useGameStore(s=>s.attack);
 useEffect(()=>{void load();const id=setInterval(()=>void sync(),1500);return()=>clearInterval(id)},[load,sync]);
 const base=provinces.find(p=>p.id===selectedId)??null;const selected=base?{...base,buildings:buildings[base.id]??base.buildings}:null;
 const activeWar=wars.find(w=>w.status==="active");
 const attackArmy=armies.find(a=>a.countryId==="aurora"&&a.status!=="destroyed");
 const doAttack=async()=>{if(activeWar&&attackArmy&&selected)await attack(activeWar.warId,attackArmy.id,selected.id)};
 return <main className="command-shell"><header className="topbar"><div className="brand"><Shield size={19}/><span>NEXORA</span><b>WORLD COMMAND</b></div><div className="resources"><span><Coins/> {Math.round(resources.money).toLocaleString()}</span><span><Users/> {Math.round(resources.manpower).toLocaleString()}</span><span><Fuel/> {Math.round(resources.oil).toLocaleString()}</span><span><Hammer/> {Math.round(resources.steel).toLocaleString()}</span></div><div className="top-status"><Activity/> LIVE <span>SERVER AUTHORITATIVE</span><Bell/></div></header>
 <section className="workspace"><aside className="left-panel"><div className="commander"><div className="avatar">NC</div><div><small>COMMANDER</small><strong>NEXORA COMMAND</strong><em>World Operations</em></div></div>{["COMMAND","ARMIES","ECONOMY","WAR","FRONTLINE"].map(x=><button className="nav" key={x}>{x}</button>)}<div className="side-card"><small>WORLD STATUS</small><strong>{activeWar?"WAR ACTIVE":"STABLE"}</strong><span>{provinces.length} provinces · 3 powers</span></div></aside>
 <div className="map-wrap"><WorldMap provinces={provinces} onSelect={select}/><div className="map-overlay"><span>SECTOR: NORTH CONTINENT</span><span>LIVE WORLD · SERVER TICK</span></div></div>
 <ProvincePanel province={selected} onUpgrade={t=>selected&&startC(selected,t)} onInfantry={()=>selected&&startP(selected,"infantry")} onCreateArmy={()=>selected&&createArmy(selected.id)} onAttack={()=>void doAttack()}/></section>
 <section className="lower-panels"><EconomyPanel resources={resources} income={income}/><ConstructionPanel province={selected??provinces[0]??{id:"",name:"",ownerId:"",countryId:"",population:0,terrain:"plains",neighbors:[],industryLevel:0,barracksLevel:0,fortificationLevel:0,infrastructureLevel:0,buildings:{industrialComplex:0,barracks:0,fortification:0},coordinates:[0,0],weather:"clear"}} queue={construction} onUpgrade={t=>selected&&startC(selected,t)}/><ProductionPanel queue={production}/><ArmyPanel armies={armies} onMove={()=>{}}/><WarPanel wars={wars} battles={battles} onDeclare={d=>void declareWar(d)}/></section>
 <BattleResultPanel battle={battles.at(-1)??null}/><footer className="newsbar"><strong>WORLD NEWS</strong><span>Economy → Production → Armies → War → Combat → Frontline</span><span>Fortifications and morale integrated server-side.</span></footer></main>}
