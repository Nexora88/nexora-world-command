"use client";

import { FormEvent, useEffect, useState } from "react";
import { Radio, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const KEY = "nwc-commander-callsign";
export function CommanderEntry() {
 const router=useRouter(); const [callsign,setCallsign]=useState("");
 useEffect(()=>{if(localStorage.getItem(KEY)) router.replace("/game");},[router]);
 function submit(event:FormEvent){event.preventDefault();const value=callsign.trim();if(value.length<3||value.length>20)return;localStorage.setItem(KEY,value);router.replace("/game");}
 return <main className="commander-entry"><div className="entry-grid"/><section className="entry-card">
  <div className="entry-brand"><strong>NEXORA</strong><span>WORLD COMMAND</span></div><div className="entry-mark"><Shield/></div>
  <p className="entry-kicker">SECURE COMMAND NETWORK · ONLINE</p><h1>ENTER COMMAND</h1><p className="entry-copy">Establish your commander identity before entering the world theatre.</p>
  <form onSubmit={submit}><label htmlFor="callsign">CALLSIGN</label>
   <input id="callsign" value={callsign} onChange={e=>setCallsign(e.target.value)} minLength={3} maxLength={20} required autoFocus placeholder="ENTER COMMANDER NAME"/>
   <small>3–20 characters · stored locally on this device</small>
   <button type="submit" disabled={callsign.trim().length<3||callsign.trim().length>20}><Radio/> CREATE COMMANDER</button>
  </form>
 </section></main>;
}
