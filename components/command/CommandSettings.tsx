"use client";

import {Monitor,Map,Volume2,Radio,RotateCcw} from "lucide-react";

type Props={labels:boolean;borders:boolean;effects:boolean;sound:boolean;onLabels:(v:boolean)=>void;onBorders:(v:boolean)=>void;onEffects:(v:boolean)=>void;onSound:(v:boolean)=>void;onReset:()=>void};
function Toggle({value,onChange}:{value:boolean;onChange:(v:boolean)=>void}){return <button className={`settings-toggle ${value?"on":""}`} onClick={()=>onChange(!value)} aria-pressed={value}><i/></button>}
export function CommandSettings({labels,borders,effects,sound,onLabels,onBorders,onEffects,onSound,onReset}:Props){
 const rows=[
  [Map,"COUNTRY LABELS","Show country names on the strategic world map.",labels,onLabels],
  [Map,"BORDER EMPHASIS","Increase country boundary contrast.",borders,onBorders],
  [Monitor,"COMMAND EFFECTS","Use subtle interface transitions and map effects.",effects,onEffects],
  [Volume2,"COMMAND AUDIO","Enable selection and command feedback sounds.",sound,onSound],
  [Radio,"SERVER STATUS","Live server synchronization is active.",true,()=>{}]
 ] as const;
 return <section className="settings-panel"><header className="settings-head"><div><small>NEXORA WORLD COMMAND // CLIENT</small><h1>COMMAND SETTINGS</h1></div><span>LOCAL DISPLAY PROFILE</span></header><div className="settings-grid">{rows.map(([Icon,title,desc,value,change])=><article key={title}><div className="settings-icon"><Icon/></div><div className="settings-copy"><b>{title}</b><span>{desc}</span></div><Toggle value={value} onChange={change}/></article>)}</div><div className="settings-footer"><button onClick={onReset}><RotateCcw/> RESET DISPLAY</button><span>Gameplay state remains server-authoritative.</span></div></section>;
}
