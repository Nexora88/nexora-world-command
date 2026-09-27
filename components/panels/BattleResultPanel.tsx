"use client";
import type { BattleResult } from "@/game/war/server/types";
export function BattleResultPanel({battle}:{battle:BattleResult|null}){if(!battle)return null;return <section className="battle-result"><div className="section-title">LAST BATTLE RESULT</div><strong>{battle.winner.toUpperCase()} VICTORY {battle.captured?"· PROVINCE CAPTURED":""}</strong><p>{battle.provinceId} · ATK {battle.attackerStrength} / DEF {battle.defenderStrength}</p><p>Casualties: {battle.attackerCasualties} / {battle.defenderCasualties} · Random {battle.randomFactor.toFixed(2)}</p></section>}
