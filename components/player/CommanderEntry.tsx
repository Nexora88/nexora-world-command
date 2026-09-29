"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Globe2, Settings, Users, WifiOff, Play, Radio, Shield, Database, ChevronRight } from "lucide-react";
import { CAMPAIGNS } from "@/data/campaigns";

export function CommanderEntry(){
 const [boot,setBoot]=useState(true);
 const [menu,setMenu]=useState<"main"|"rooms"|"settings">("main");
 useEffect(()=>{const t=setTimeout(()=>setBoot(false),700);return()=>clearTimeout(t)},[]);
 const launch=(campaign="guest-europe")=>{localStorage.setItem("nwc-session-mode","guest");localStorage.setItem("nwc-guest-session",JSON.stringify({startedAt:Date.now(),maxDay:9999}));localStorage.setItem("nwc-player-country","TR");localStorage.setItem("nwc-commander-callsign","NEXORA COMMAND");localStorage.setItem("nwc-campaign-id",campaign);window.location.href="/game"};
 if(boot)return <main className="nwc-home boot-screen"><div className="boot-mark"><Shield/><b>NEXORA</b><span>WORLD COMMAND</span></div><div className="boot-line"><i/></div><small>INITIALIZING WORLD COMMAND SYSTEM</small></main>;
 return <main className="nwc-home">
  <div className="home-grid"/><div className="home-scanline"/>
  <header className="home-top"><div className="home-brand"><Shield/><div><b>NEXORA</b><span>WORLD COMMAND</span></div></div><div className="home-status"><i/> SYSTEM ONLINE <span>BUILD 0.11 · LOCAL DEVELOPMENT</span></div></header>
  <section className="home-hero">
   <div className="hero-copy"><p className="home-kicker">GLOBAL STRATEGY COMMAND PLATFORM</p><h1>WORLD<br/><em>COMMAND</em></h1><p className="hero-text">Build your nation. Manage provinces. Shape diplomacy. Command armies. The world is waiting.</p>
    <div className="hero-actions"><button className="launch-button" onClick={()=>launch()}><Play/> ENTER WORLD <ArrowRight/></button><button className="secondary-button" onClick={()=>setMenu("rooms")}><Globe2/> WORLD ROOMS</button></div>
    <div className="dev-note"><WifiOff/> ONLINE SERVICES ARE DISABLED FOR NOW <span>·</span> FULL LOCAL WORLD AVAILABLE</div>
   </div>
   <div className="hero-world"><div className="world-orbit orbit-a"/><div className="world-orbit orbit-b"/><div className="world-core"><Globe2/><span>WORLD<br/>SNAPSHOT</span></div><div className="world-node n1">EUROPE</div><div className="world-node n2">ANATOLIA</div><div className="world-node n3">ASIA</div><div className="world-node n4">AMERICAS</div></div>
  </section>
  <nav className="home-menu"><button className={menu==="main"?"active":""} onClick={()=>setMenu("main")}><Play/> COMMAND</button><button className={menu==="rooms"?"active":""} onClick={()=>setMenu("rooms")}><Globe2/> ROOMS</button><button onClick={()=>setMenu("settings")}><Settings/> SETTINGS</button></nav>
  {menu==="rooms"&&<section className="home-panel"><div className="panel-title"><div><small>LOCAL COMMAND NETWORK</small><h2>WORLD ROOMS</h2></div><span><WifiOff/> OFFLINE</span></div><div className="home-room-grid"><button onClick={()=>launch("guest-europe")}><div><b>SOLO SANDBOX</b><small>Europe · Local world · Unlimited development time</small></div><strong>ENTER <ChevronRight/></strong></button><button onClick={()=>launch("world-live-01")}><div><b>WORLD COMMAND</b><small>Global world · Local simulation preview</small></div><strong>ENTER <ChevronRight/></strong></button></div></section>}
  {menu==="settings"&&<section className="home-panel"><div className="panel-title"><div><small>SYSTEM CONFIGURATION</small><h2>SETTINGS</h2></div></div><div className="settings-grid"><div><Radio/><b>NETWORK</b><span>Online account services are not connected.</span></div><div><Database/><b>WORLD DATA</b><span>{CAMPAIGNS.length} campaign definitions · local snapshot enabled.</span></div><div><Users/><b>MULTIPLAYER</b><span>Room infrastructure will be connected later.</span></div></div></section>}
  <footer className="home-footer"><span>NEXORA WORLD COMMAND</span><span>TACTICAL WORLD SIMULATION · LOCAL BUILD</span><span>AHMET EYMEN BAKRAÇ</span></footer>
 </main>
}
