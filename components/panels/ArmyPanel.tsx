"use client";
import type { Army } from "@/game/movement/server/types";
export function ArmyPanel({armies,onMove}:{armies:Army[];onMove:(armyId:string,provinceId:string)=>void}){
 return <section className="army-panel"><div className="section-title">ARMIES / FIELD COMMAND</div>
 {armies.length===0?<div className="queue-empty">No field armies. Complete infantry production, then form an army.</div>:armies.map(a=>
 <div className="queue-item" key={a.id}><div className="queue-head"><span>{a.name}</span><b>{a.strength.toLocaleString()} STR</b></div>
 <small>{a.provinceId} · INF {a.infantry.toLocaleString()} · TANK {a.tanks} · MORALE {a.morale} · ORG {a.organization}</small></div>)}</section>
}