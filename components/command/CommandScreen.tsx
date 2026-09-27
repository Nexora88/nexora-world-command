"use client";

import { X, Coins, Swords, FlaskConical, Eye, Handshake, Factory } from "lucide-react";
import type { Army } from "@/game/movement/server/types";
import type { Province } from "@/lib/types";
import type { Resources } from "@/data/economy/resources";
import { nations } from "@/data/world/countries";

export type CommandScreenId="DIPLOMACY"|"ECONOMY"|"MILITARY"|"RESEARCH"|"INTELLIGENCE";
type Props={screen:CommandScreenId;onClose:()=>void;provinces:Province[];armies:Army[];resources:Resources;income:Resources};
const techs=[["INFANTRY","Improved Rifles","Mechanized Infantry","Advanced Infantry"],["ARMOR","Light Tanks","Medium Tanks","Main Battle Tanks"],["AIR","Fighters","Bombers","Recon Aircraft"]];

export function CommandScreen({screen,onClose,provinces,armies,resources,income}:Props){
 const title=screen==="DIPLOMACY"?"DIPLOMATIC COMMAND":screen+" COMMAND";
 return <div className="command-overlay"><section className="command-screen"><header><div><small>WORLD COMMAND // SYSTEMS</small><h1>{title}</h1></div><button onClick={onClose}><X/></button></header>
 {screen==="DIPLOMACY"&&<Diplomacy provinces={provinces}/>}
 {screen==="ECONOMY"&&<Economy resources={resources} income={income} provinces={provinces}/>}
 {screen==="MILITARY"&&<Military armies={armies}/>}
 {screen==="RESEARCH"&&<Research/>}{screen==="INTELLIGENCE"&&<Intelligence provinces={provinces} armies={armies}/>}
 </section></div>;
}
function Diplomacy({provinces}:{provinces:Province[]}){return <div className="command-grid"><div className="command-card command-wide"><h2><Handshake/> DIPLOMATIC RELATIONS</h2><div className="country-table">{nations.map(n=><div key={n.id}><b>{n.name}</b><span>STATUS · {provinces.some(p=>p.ownerId===n.id)?"ACTIVE":"NO PRESENCE"}</span><em>RELATION DATA</em></div>)}</div></div><div className="command-card"><h2>TRADE & ALLIANCE</h2><p>Only current nation data is shown; unsupported treaty actions are not simulated.</p><button disabled>TRADE ACTION · DATA REQUIRED</button></div></div>;}
function Economy({resources,income,provinces}:{resources:Resources;income:Resources;provinces:Province[]}){return <div className="command-grid"><div className="command-card command-wide"><h2><Coins/> NATIONAL ECONOMY</h2><div className="metric-grid">{Object.entries(resources).map(([k,v])=><div key={k}><small>{k.toUpperCase()}</small><b>{Math.round(v).toLocaleString()}</b><span>+{Math.round(income[k as keyof Resources]).toLocaleString()}/h</span></div>)}</div></div><div className="command-card"><h2><Factory/> INDUSTRIAL OUTPUT</h2><p>{provinces.reduce((s,p)=>s+p.industryLevel,0)} total industry levels across {provinces.length} provinces.</p><p>Existing economy actions remain server-authoritative.</p></div></div>;}
function Military({armies}:{armies:Army[]}){const infantry=armies.reduce((s,a)=>s+a.infantry,0),tanks=armies.reduce((s,a)=>s+a.tanks,0);return <div className="command-grid"><div className="command-card command-wide"><h2><Swords/> FORCE REGISTER</h2><div className="metric-grid"><div><small>ARMIES</small><b>{armies.length}</b></div><div><small>INFANTRY</small><b>{infantry.toLocaleString()}</b></div><div><small>ARMOR</small><b>{tanks.toLocaleString()}</b></div><div><small>STRENGTH</small><b>{armies.reduce((s,a)=>s+a.strength,0).toLocaleString()}</b></div></div></div><div className="command-card"><h2>READINESS</h2>{armies.map(a=><div className="readiness-row" key={a.id}><span>{a.name}</span><b>{a.morale}%</b></div>)}</div></div>;}
function Research(){return <div className="command-grid research-grid">{techs.map(([branch,...items])=><div className="command-card" key={branch}><h2><FlaskConical/> {branch}</h2>{items.map((x,i)=><div className="tech-node" key={x}><span>0{i+1}</span><div><b>{x}</b><small>{i===0?"FOUNDATION":"REQUIRES PREVIOUS NODE"}</small></div></div>)}</div>)}</div>;}
function Intelligence({provinces,armies}:{provinces:Province[];armies:Army[]}){return <div className="command-grid"><div className="command-card command-wide"><h2><Eye/> INTELLIGENCE PICTURE</h2><div className="metric-grid"><div><small>PROVINCES OBSERVED</small><b>{provinces.length}</b></div><div><small>KNOWN ARMIES</small><b>{armies.length}</b></div><div><small>SPY NETWORK</small><b>LOCAL DATA ONLY</b></div></div></div><div className="command-card"><h2>COUNTER INTELLIGENCE</h2><p>No spy deployment backend exists yet. The panel intentionally exposes no fake action.</p></div></div>;}
