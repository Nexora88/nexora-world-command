"use client";
import {ArrowRight,Newspaper} from "lucide-react";
import {REAL_WORLD_COUNTRIES,REAL_WORLD_PROVINCES} from "@/data/world/real-world-provinces";
export function WorldNewspaper({countryId,onEnter}:{countryId:string;onEnter:()=>void}){
 const c=REAL_WORLD_COUNTRIES.find(x=>x.id===countryId)??REAL_WORLD_COUNTRIES[0];const capital=c.capitalProvinceId.replace(c.id+"_","").replaceAll("_"," ");const count=Object.values(REAL_WORLD_PROVINCES).filter(p=>p.countryCode===countryId).length;
 const headlines:{title:string;body:string}[]=[
  {title:"THE WORLD ENTERS A NEW ERA",body:"International tensions are being monitored across Europe and Eurasia as four command theatres begin a new strategic cycle."},
  {title:"A NEW COMMAND TAKES THE FIELD",body:`${c.displayName} enters the world theatre with ${count} city provinces under its strategic command. National infrastructure and military readiness will shape the opening phase.`}
 ];
 return <div className="newspaper-overlay"><section className="newspaper"><header><span>WORLD COMMAND DAILY</span><b>DAY 1 · GLOBAL EDITION</b></header><div className="paper-rule"/><div className="paper-kicker"><Newspaper/> WORLD REPORT</div><h1>{headlines[0].title}</h1><p>{headlines[0].body}</p><div className="paper-columns"><article><small>YOUR NATION</small><strong>{c.displayName}</strong><span>CAPITAL · {capital.toUpperCase()}</span></article><article><small>OPENING THEATRE</small><strong>{count} PROVINCES</strong><span>REAL-WORLD CITY GRAPH</span></article><article><small>COMMAND STATUS</small><strong>DAY 1</strong><span>THEATRE ONLINE</span></article></div><div className="paper-story"><small>NATIONAL BRIEF</small><h2>{headlines[1].title}</h2><p>{headlines[1].body}</p></div><button onClick={onEnter}>ENTER COMMAND CENTER <ArrowRight/></button></section></div>;
}