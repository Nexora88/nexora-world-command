"use client";
import { ArrowRight, Building2, MapPinned, Shield, Users } from "lucide-react";
import { REAL_WORLD_COUNTRIES, REAL_WORLD_PROVINCES, getCountryFlag } from "@/data/world/real-world-provinces";

export function CountryBriefing({countryId,onEnter,onBack}:{countryId:string;onEnter:()=>void;onBack:()=>void}){
 const country=REAL_WORLD_COUNTRIES.find(c=>c.id===countryId)??REAL_WORLD_COUNTRIES[0];
 const provinces=Object.values(REAL_WORLD_PROVINCES).filter(p=>p.countryCode===country.id);
 const capital=provinces.find(p=>p.id===country.capitalProvinceId);
 const population=provinces.reduce((s,p)=>s+(p.population??0),0);
 return <main className="country-briefing"><section className="country-shell">
  <header><button className="brief-back" onClick={onBack}>← CAMPAIGN BROWSER</button><div><small>NATION DOSSIER · PRE-GAME COMMAND</small><h1>{getCountryFlag(country.id)} {country.displayName}</h1><p>Ülkeye girmeden önce bölgesel dağılımı, başkentini ve eyalet ağını incele.</p></div><button className="brief-enter" onClick={onEnter}>ENTER COMMAND <ArrowRight/></button></header>
  <div className="country-layout"><div className="country-map-card"><div className="map-head"><span><MapPinned/> PROVINCE THEATRE</span><b>{provinces.length} PROVINCES</b></div><svg className="country-province-map" viewBox="0 0 100 56.25" role="img" aria-label={`${country.displayName} province map`}>
   <rect width="100" height="56.25" className="brief-ocean"/>{provinces.map(p=><g key={p.id}><circle cx={p.coordinates.x} cy={p.coordinates.y} r={p.id===country.capitalProvinceId?1.25:.72} className={p.id===country.capitalProvinceId?"brief-province capital":"brief-province"}/>{p.id===country.capitalProvinceId&&<text x={p.coordinates.x} y={p.coordinates.y-2} className="brief-capital">CAPITAL</text>}</g>)}{provinces.map(p=>p.neighbors.filter(n=>provinces.some(x=>x.id===n)&&n>p.id).map(n=>{const q=provinces.find(x=>x.id===n)!;return <line key={`${p.id}-${n}`} x1={p.coordinates.x} y1={p.coordinates.y} x2={q.coordinates.x} y2={q.coordinates.y} className="brief-road"/>}))}
  </svg><div className="map-legend"><span><i/> PROVINCE</span><span><i className="capital-dot"/> CAPITAL</span><span><i className="road-dot"/> CONNECTION</span></div></div>
  <aside className="country-dossier"><div className="dossier-hero"><span>{country.flag}</span><div><small>NATION PROFILE</small><b>{country.name}</b><em>{country.displayName}</em></div></div><div className="dossier-metrics"><Metric icon={<MapPinned/>} label="PROVINCES" value={String(provinces.length)}/><Metric icon={<Users/>} label="POPULATION" value={`${(population/1e6).toFixed(1)}M`}/><Metric icon={<Shield/>} label="CAPITAL" value={capital?.name??country.capitalProvinceId}/><Metric icon={<Building2/>} label="THEATRE" value="EUROPE"/></div><div className="province-list"><h2>PROVINCE REGISTER</h2>{provinces.map(p=><div key={p.id}><span>{p.id===country.capitalProvinceId?"★":"•"}</span><b>{p.name}</b><small>{Math.round((p.population??0)/1000).toLocaleString()}K · {(p.terrain??"plains").toUpperCase()}</small></div>)}</div></aside></div>
  <div className="brief-note"><b>COMMAND BRIEF</b><span>Harita yalnızca seçtiğin ülkenin eyaletlerini gösterir. Oyun başladıktan sonra dünya haritasında diğer ülkeler, ordular, yollar ve diplomatik görünürlük kuralları devreye girer.</span></div>
 </section></main>;
}
function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div><span>{icon}</span><small>{label}</small><b>{value}</b></div>}
