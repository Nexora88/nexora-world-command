"use client";
import type { War,BattleResult } from "@/game/war/server/types";
export function WarPanel({wars,battles,onDeclare}:{wars:War[];battles:BattleResult[];onDeclare:(country:string)=>void}){
 return <section className="war-panel"><div className="section-title">WAR / FRONTLINE</div>
 {wars.length===0?<div className="queue-empty">No active wars.</div>:wars.map(w=><div className="queue-item" key={w.warId}>
 <div className="queue-head"><span>{w.attacker.toUpperCase()} → {w.defender.toUpperCase()}</span><b>{w.attackerScore} - {w.defenderScore}</b></div>
 <small>GOAL {w.warGoal.toUpperCase()} · OCCUPIED {w.occupiedProvinces.length}</small></div>)}
 <div className="war-actions"><button className="action" onClick={()=>onDeclare("solaris")}>DECLARE WAR: SOLARIS</button><button className="action" onClick={()=>onDeclare("verdant")}>DECLARE WAR: VERDANT</button></div>
 {battles.slice(-3).reverse().map(b=><div className="battle-row" key={b.battleId}><b>{b.winner.toUpperCase()}</b><span>{b.provinceId} · casualties {b.attackerCasualties}/{b.defenderCasualties}</span></div>)}</section>
}