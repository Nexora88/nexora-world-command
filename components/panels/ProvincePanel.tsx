import { MapPin, Factory, Users, CloudRain, Truck, Shield } from "lucide-react";
import type { Province } from "@/lib/types";

export function ProvincePanel({ province }: { province: Province | null }) {
  if (!province) return <aside className="right-panel empty-panel"><MapPin size={28}/><h3>Select a province</h3><p>Choose a province on the world map to inspect its economy, defense, weather and logistics.</p></aside>;
  const rows=[["POPULATION",province.population.toLocaleString()],["INDUSTRY",String(province.industryLevel)],["BARRACKS",String(province.barracksLevel)],["FORTIFICATION",String(province.fortificationLevel)],["INFRASTRUCTURE",String(province.infrastructureLevel)]];
  return <aside className="right-panel"><div className="panel-kicker">PROVINCE / {province.id}</div><h2>{province.name}</h2><div className="owner">CONTROLLED TERRITORY · {province.ownerId.toUpperCase()}</div>
    <div className="stats">{rows.map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b></div>)}</div>
    <div className="intel-grid"><div><Users/><small>Population</small><b>{(province.population/1000000).toFixed(1)}M</b></div><div><Factory/><small>Industry</small><b>LVL {province.industryLevel}</b></div><div><CloudRain/><small>Weather</small><b>{province.weather.toUpperCase()}</b></div><div><Truck/><small>Supply</small><b>STABLE</b></div></div>
    <button className="action"><Shield size={16}/> OPEN PROVINCE COMMAND</button></aside>;
}