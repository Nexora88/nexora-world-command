"use client";

import {Newspaper,ShieldAlert,Globe2,Trophy} from "lucide-react";
import type {Army} from "@/game/movement/server/types";
import type {War} from "@/game/war/server/types";
import {REAL_WORLD_COUNTRIES} from "@/data/world/real-world-provinces";

type Props={wars:War[];armies:Army[];countryId:string};
export function CommandGazette({wars,armies,countryId}:Props){
  const nation=REAL_WORLD_COUNTRIES.find(c=>c.id===countryId)?.displayName??countryId;
  const active=wars.filter(w=>w.status==="active");
  const stories=[
    {icon:Globe2,kicker:"WORLD",title:"GLOBAL THEATRE ONLINE",body:"The strategic world map is now operating as a country-level overview. Province intelligence will be layered in the next command phase."},
    {icon:ShieldAlert,kicker:"FRONTS",title:active.length?`${active.length} ACTIVE WAR THEATRE${active.length>1?"S":""}`:"NO ACTIVE WAR THEATRES",body:active.length?"Command reports are tracking current hostile relations and army orders.":"Diplomatic relations remain the primary strategic focus."},
    {icon:Trophy,kicker:"YOUR NATION",title:nation,body:`${armies.length} field formation${armies.length!==1?"s":""} currently registered in the command system.`}
  ];
  return <section className="gazette-panel"><header className="gazette-head"><div><small>WORLD COMMAND DAILY</small><h1><Newspaper/> FIELD GAZETTE</h1></div><span>DAY 45 · GLOBAL EDITION</span></header><div className="gazette-rule"/>
    <div className="gazette-lead"><small>STRATEGIC BRIEF</small><h2>THE WORLD AT A GLANCE</h2><p>Country borders, national identities and strategic theatres are visible on the main map. Detailed province intelligence remains inside the command layer.</p></div>
    <div className="gazette-stories">{stories.map(({icon:Icon,kicker,title,body})=><article key={title}><Icon/><small>{kicker}</small><h3>{title}</h3><p>{body}</p></article>)}</div>
    <div className="gazette-footer"><span>FRONT REPORTS · {active.length}</span><span>FIELD ARMIES · {armies.length}</span><span>EDITORIAL DESK · NEXORA WORLD COMMAND</span></div>
  </section>;
}
