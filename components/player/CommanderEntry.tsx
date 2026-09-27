"use client";
import {FormEvent,useEffect,useState} from "react";
import {Radio,Shield,Check,ArrowRight} from "lucide-react";
import {useRouter} from "next/navigation";
import {REAL_WORLD_COUNTRIES,REAL_WORLD_PROVINCES} from "@/data/world/real-world-provinces";
const KEY="nwc-commander-callsign",COUNTRY_KEY="nwc-player-country";const FLAGS:Record<string,string>={TR:"🇹🇷",DE:"🇩🇪",GB:"🇬🇧",RU:"🇷🇺"};
export function CommanderEntry(){
 const router=useRouter();const [callsign,setCallsign]=useState("");const [country,setCountry]=useState<string|null>(null);const [step,setStep]=useState<"identity"|"nation">("identity");
 useEffect(()=>{const saved=localStorage.getItem(KEY),savedCountry=localStorage.getItem(COUNTRY_KEY);if(saved&&savedCountry)router.replace("/game");else if(saved){setTimeout(()=>setCallsign(saved),0);setTimeout(()=>setStep("nation"),0)}},[router]);
 function submitIdentity(e:FormEvent){e.preventDefault();const v=callsign.trim();if(v.length<3||v.length>20)return;localStorage.setItem(KEY,v);setStep("nation")}
 function enter(){if(!country)return;localStorage.setItem(COUNTRY_KEY,country);localStorage.removeItem("nwc-newspaper-seen");router.replace("/game")}
 const nation=REAL_WORLD_COUNTRIES.find(c=>c.id===country);
 return <main className="commander-entry"><div className="entry-grid"/><section className="entry-card wide-entry">
 <div className="entry-brand"><strong>NEXORA</strong><span>WORLD COMMAND</span></div><div className="entry-mark"><Shield/></div>
 {step==="identity"?<><p className="entry-kicker">SECURE COMMAND NETWORK · ONLINE</p><h1>ENTER COMMAND</h1><p className="entry-copy">Establish your commander identity before entering the world theatre.</p><form onSubmit={submitIdentity}><label htmlFor="callsign">CALLSIGN</label><input id="callsign" value={callsign} onChange={e=>setCallsign(e.target.value)} minLength={3} maxLength={20} required autoFocus placeholder="ENTER COMMANDER NAME"/><small>3–20 characters · stored locally on this device</small><button type="submit" disabled={callsign.trim().length<3||callsign.trim().length>20}><Radio/> CONTINUE TO NATION SELECTION <ArrowRight/></button></form></>:<><p className="entry-kicker">COMMANDER // {callsign.toUpperCase()}</p><h1>SELECT YOUR NATION</h1><p className="entry-copy">Choose the nation you will command. Only four nations are active in this foundation phase.</p><div className="nation-grid">{REAL_WORLD_COUNTRIES.map(c=><button type="button" key={c.id} className={country===c.id?"nation-card active":"nation-card"} onClick={()=>setCountry(c.id)}><span className="nation-code">{FLAGS[c.id]}</span><div><strong>{c.displayName}</strong><small>{c.name}</small></div>{country===c.id&&<Check/>}</button>)}</div>{nation&&<div className="nation-confirm"><div><small>NATION SELECTED</small><b>{nation.displayName}</b><span>CAPITAL · {nation.id==="TR"?"ANKARA":nation.id==="DE"?"BERLIN":nation.id==="GB"?"LONDON":"MOSCOW"} · {Object.values(REAL_WORLD_PROVINCES).filter(p=>p.countryCode===nation.id).length} PROVINCES</span></div><button type="button" onClick={enter}><Radio/> ENTER COMMAND</button></div>}</>}
 </section></main>;
}