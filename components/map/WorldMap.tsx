"use client";

import {useMemo,useState} from "react";
import type {Province} from "@/lib/types";
import type {Army} from "@/game/movement/server/types";
import {REAL_WORLD_COUNTRIES,REAL_WORLD_PROVINCES} from "@/data/world/real-world-provinces";
import {audioManager} from "@/lib/audio-manager";
import {safeCountryCode} from "@/lib/safe-country";
import {ProvinceLayer} from "@/components/map/ProvinceLayer";

export type MapMode="political"|"population"|"economy"|"resources"|"military"|"weather"|"terrain"|"frontline";
const modeLabel:Record<MapMode,string>={political:"POLITICAL",population:"POPULATION",economy:"ECONOMY",resources:"RESOURCES",military:"MILITARY",weather:"WEATHER",terrain:"TERRAIN",frontline:"FRONTLINE"};

function hull(points:{x:number;y:number}[]){
  const pts=[...points].sort((a,b)=>a.x-b.x||a.y-b.y); if(pts.length<3)return pts;
  const cross=(o:any,a:any,b:any)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
  const lower:any[]=[]; for(const p of pts){while(lower.length>=2&&cross(lower[lower.length-2],lower[lower.length-1],p)<=0)lower.pop();lower.push(p);}
  const upper:any[]=[]; for(let i=pts.length-1;i>=0;i--){const p=pts[i];while(upper.length>=2&&cross(upper[upper.length-2],upper[upper.length-1],p)<=0)upper.pop();upper.push(p);}
  return lower.slice(0,-1).concat(upper.slice(0,-1));
}

function UnitGlyph({army,large=false}:{army:Army;large?:boolean}){
  const armored=army.tanks>0;
  return <g className={`real-unit ${large?"large":""}`}><circle r={large?3.2:2.3} className={armored?"unit-armored":"unit-infantry"}/><text y=".8" textAnchor="middle">{armored?"▰":"✚"}</text><text y={large?6:5} textAnchor="middle" className="unit-count">{army.strength>999?`${Math.round(army.strength/1000)}K`:army.strength}</text></g>;
}

type Props={provinces:Province[];armies:Army[];selectedId:string|null;selectedArmyId:string|null;onSelect:(id:string)=>void;onSelectArmy:(id:string)=>void;mapMode:MapMode;onMapModeChange:(mode:MapMode)=>void;playerCountryId?:string};

export function WorldMap({provinces,armies,selectedId,selectedArmyId,onSelect,onSelectArmy,mapMode,onMapModeChange,playerCountryId}:Props){
  const [zoom,setZoom]=useState(1);
  const [hovered,setHovered]=useState<string|null>(null);
  const active=useMemo(()=>provinces.map(p=>REAL_WORLD_PROVINCES[p.id]).filter(Boolean),[provinces]);
  const maxPop=Math.max(...provinces.map(p=>p.population),1);
  const maxInd=Math.max(...provinces.map(p=>p.industryLevel),1);
  const countryShapes=useMemo(()=>REAL_WORLD_COUNTRIES.map(c=>({country:c,points:hull(active.filter(p=>safeCountryCode(p.countryCode)===safeCountryCode(c.id)).map(p=>({x:p.coordinates.x,y:p.coordinates.y})))})).filter(x=>x.points.length>=3),[active]);
  const fillFor=useMemo(()=> (p:Province)=>{
    if(mapMode==="population")return `hsl(34 55% ${25+(p.population/maxPop)*30}%)`;
    if(mapMode==="economy")return `hsl(143 38% ${20+(p.industryLevel/maxInd)*30}%)`;
    if(mapMode==="resources")return `hsl(47 45% ${22+Math.min(28,(p.industryLevel+p.infrastructureLevel)*2)}%)`;
    if(mapMode==="weather")return ["snow","blizzard"].includes(p.weather)?"#8497a0":p.weather==="storm"?"#515a70":p.weather==="rain"?"#496b73":p.weather==="fog"?"#687677":"#526a58";
    if(mapMode==="military")return armies.some(a=>a.provinceId===p.id)?"#8b713d":"#34453e";
    const c=REAL_WORLD_COUNTRIES.find(x=>safeCountryCode(x.id)===safeCountryCode(p.countryId));
    return c?.color??"#566268";
  },[armies,mapMode,maxInd,maxPop]);

  const selected=provinces.find(p=>p.id===selectedId);
  const hoveredProvince=hovered?provinces.find(p=>p.id===hovered):undefined;
  const hoveredWorld=hovered?REAL_WORLD_PROVINCES[hovered]:undefined;

  return <div className="world-map real-world-map">
    <div className="map-vignette"/>
    <div className={`weather-layer weather-${selected?.weather??"clear"}`}/>
    <div className="map-header"><b>EUROPEAN THEATRE</b><span>{modeLabel[mapMode]} {"//"} {zoom.toFixed(1)}×</span><span>{REAL_WORLD_COUNTRIES.length} NATIONS · {active.length} PROVINCES</span></div>
    <div className="map-compass">N<br/><i>＋</i></div>
    <svg viewBox="0 0 100 100" className="province-map real-world-svg" style={{transform:`scale(${zoom})`}}>
      <defs><filter id="provinceGlow"><feGaussianBlur stdDeviation=".8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g className="country-territory-underlay">{countryShapes.map(({country,points})=><polygon key={country.id} points={points.map(p=>`${p.x},${p.y}`).join(" ")} fill={country.color} className="country-territory-fill"/>)}</g>
      <g className="world-grid-lines" aria-hidden="true">{Array.from({length:10},(_,i)=><line key={`v${i}`} x1={i*10} y1="0" x2={i*10} y2="100"/>)}{Array.from({length:10},(_,i)=><line key={`h${i}`} x1="0" y1={i*10} x2="100" y2={i*10}/>)}</g>
      <g className="continent-silhouette" aria-hidden="true"><path d="M10 10 Q20 3 32 9 L38 17 34 28 28 34 29 44 24 51 31 59 38 66 47 61 55 54 66 48 74 43 82 35 94 31 98 44 90 54 81 59 77 70 68 82 55 88 45 83 34 88 22 82 16 70 8 60 4 46 8 32Z"/></g>
      <ProvinceLayer provinces={provinces} selectedId={selectedId} hoveredId={hovered} playerCountryId={playerCountryId} mapMode={mapMode} maxPopulation={maxPop} maxIndustry={maxInd} onSelect={id=>{audioManager.provinceSelected();onSelect(id)}} onHover={setHovered} fillFor={fillFor}/>
      <g className="country-borders">{countryShapes.map(({country,points})=><polygon key={`border-${country.id}`} points={points.map(p=>`${p.x},${p.y}`).join(" ")} fill="none" stroke={country.color} className="country-border"/>)}</g>

      <g className="city-markers">
        {provinces.map(p=>{
          const rw=REAL_WORLD_PROVINCES[p.id]; if(!rw)return null;
          const c=REAL_WORLD_COUNTRIES.find(x=>safeCountryCode(x.id)===safeCountryCode(rw.countryCode));
          const selected=p.id===selectedId,hover=p.id===hovered,capital=c?.capitalProvinceId===p.id;
          return <g key={p.id} transform={`translate(${rw.coordinates.x},${rw.coordinates.y})`} className={`city-marker ${selected?"selected":""} ${hover?"hovered":""}`} pointerEvents="none">
            <circle r={capital?1.45:1.05} className={capital?"capital-dot":"city-dot"}/>
            {capital&&<circle r="2.5" className="capital-ring"/>}
            {(selected||hover)&&<text x="2.3" y=".8" className="city-label">{rw.name.toUpperCase()}</text>}
          </g>;
        })}
      </g>
      <g className="army-markers">
        {armies.map(a=>{
          const p=REAL_WORLD_PROVINCES[a.provinceId]; if(!p)return null;
          return <g key={a.id} transform={`translate(${p.coordinates.x+2.5},${p.coordinates.y-2.5})`} className={a.id===selectedArmyId?"army-marker selected":"army-marker"} onClick={e=>{e.stopPropagation();audioManager.provinceSelected();onSelectArmy(a.id)}}>
            <UnitGlyph army={a} large={a.id===selectedArmyId}/>
          </g>;
        })}
      </g>
    </svg>
    {hoveredProvince&&hoveredWorld&&<div className="province-tooltip"><strong>{hoveredWorld.name.toUpperCase()}</strong><span>{hoveredWorld.country.toUpperCase()}</span><i>POPULATION <b>{hoveredProvince.population.toLocaleString()}</b></i><i>TERRAIN <b>{hoveredProvince.terrain.toUpperCase()}</b></i><i>OWNER <b>{safeCountryCode(hoveredProvince.ownerId)||"UNKNOWN"}</b></i></div>}
    <div className="map-modebar">{(Object.keys(modeLabel) as MapMode[]).map(m=><button key={m} className={mapMode===m?"active":""} onClick={()=>onMapModeChange(m)}>{modeLabel[m]}</button>)}</div>
    <div className="map-controls"><button onClick={()=>setZoom(z=>Math.min(1.7,z+.15))}>＋</button><button onClick={()=>setZoom(z=>Math.max(1,z-.15))}>−</button><button onClick={()=>setZoom(1)}>⌖</button></div>
    <div className="map-legend"><span><i className="legend-infantry"/>INF</span><span><i className="legend-armored"/>ARM</span><span><i className="legend-capital">★</i>CAPITAL</span><span>154 PROVINCE TERRITORIES</span></div>
    <div className="map-weather">WEATHER // {(selected?.weather??"clear").toUpperCase()}</div>
  </div>;
}
