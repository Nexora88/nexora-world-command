"use client";

import type { Province } from "@/lib/types";
import { countries } from "@/data/provinces";

export function WorldMap({ provinces, onSelect }: { provinces: Province[]; onSelect: (id: string) => void }) {
  return <div className="world-map"><div className="map-grid"/>
    <svg viewBox="0 0 100 100" className="province-map">
      {provinces.map((p)=>{ const [x,y]=p.coordinates; const country=countries.find((c)=>c.id===p.ownerId); return <g key={p.id} onClick={()=>onSelect(p.id)} className="province-node">
        {p.neighbors.map((id)=>{const n=provinces.find((q)=>q.id===id); return n ? <line key={id} x1={x} y1={y} x2={n.coordinates[0]} y2={n.coordinates[1]} className="border-line"/> : null;})}
        <circle cx={x} cy={y} r="9" fill={country?.color ?? "#64748b"} opacity=".14"/><circle cx={x} cy={y} r="6.5" fill={country?.color ?? "#64748b"} opacity=".7" stroke="rgba(255,255,255,.55)" strokeWidth=".35"/>
        <text x={x} y={y+1} textAnchor="middle" className="province-label">{p.name.slice(0,3).toUpperCase()}</text></g>;})}
    </svg>
    <div className="map-controls"><button>+</button><button>−</button></div>
    <div className="legend">{countries.map(c=><span key={c.id}><i style={{background:c.color}}/>{c.name}</span>)}</div>
  </div>;
}