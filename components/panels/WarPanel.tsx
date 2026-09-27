"use client";
import type {War,BattleResult} from "@/game/war/server/types";
import {nations} from "@/data/world/countries";
export function WarPanel({wars,battles,onDeclare}:{wars:War[];battles:BattleResult[];onDeclare:(country:string)=>void}){
 const targets=nations.filter(n=>n.id!=="TR").slice(0,6);
 return <section className="war-panel"><div className="section-title">WAR / FRONTLINE</div>
 {wars.length===0?<div className="queue-empty">No active wars.</div>:wars.map(w=><div className="queue-item" key={w.warId}>
 <div className="queue-head"><span>{w.attacker.toUpperCase()} → {w.defender.toUpperCase()}</span><b>{w.attackerScore} - {w.defenderScore}</b></div>
 <small>GOAL {w.warGoal.toUpperCase()} · OCCUPIED {w.occupiedProvinces.length}</small></div>)}
 <div className="war-actions">{targets.map(n=><button className="action" key={n.id} onClick={()=>onDeclare(n.id)}>DECLARE WAR: {n.displayName}</button>)}</div>
 {battles.slice(-5).reverse().map(b=><div className="battle-row" key={b.battleId}><b>{b.winner.toUpperCase()}</b><span>{b.provinceId} · casualties {b.attackerCasualties}/{b.defenderCasualties} · {b.captured?"CAPTURED":"HELD"}</span></div>)}</section>
}
