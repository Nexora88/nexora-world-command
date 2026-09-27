"use client";

import {useState} from "react";
import type {Province} from "@/lib/types";
import type {Army} from "@/game/movement/server/types";
import {CountryWorldLayer} from "@/components/map/CountryWorldLayer";
import {WorldWeatherLayer} from "@/components/map/WorldWeatherLayer";

type Props={provinces:Province[];armies:Army[];selectedId:string|null;selectedArmyId:string|null;onSelect:(id:string)=>void;onSelectArmy:(id:string)=>void;onCountrySelect?:(iso2:string)=>void;mapMode:MapMode;onMapModeChange:(mode:MapMode)=>void;playerCountryId?:string;showLabels?:boolean;showBorders?:boolean};
export type MapMode="political"|"population"|"economy"|"resources"|"military"|"weather"|"terrain"|"frontline";

export function WorldMap({playerCountryId,showLabels=true,showBorders=true,onCountrySelect,mapMode="political",onMapModeChange}:Props){
  const [zoom,setZoom]=useState(1);
  const modes:Array<[MapMode,string]>= [["political","POLITICAL"],["terrain","TERRAIN"],["economy","ECONOMY"],["resources","RESOURCES"],["military","MILITARY"],["weather","WEATHER"]];
  return <div className={`world-map real-world-map world-map-clean mode-${mapMode}`} onWheel={e=>setZoom(z=>Math.max(.72,Math.min(2.4,z+(e.deltaY>0?-.08:.08))))}>
    <svg viewBox="0 0 100 100" className="world-map-svg" preserveAspectRatio="xMidYMid meet" aria-label="World strategic map">
      <rect width="100" height="100" className="world-ocean"/>
      <g className="world-map-zoom" style={{transform:`translate(${50-(50*zoom)}% ${50-(50*zoom)}%) scale(${zoom})`}}>
        <CountryWorldLayer zoom={zoom} playerCountryId={playerCountryId} showLabels={showLabels} showBorders={showBorders} onCountrySelect={onCountrySelect}/>
        <WorldWeatherLayer mode={mapMode}/>
      </g>
    </svg>
    <div className="strategic-map-toolbar"><span>STRATEGIC MAP</span>{modes.map(([id,label])=><button key={id} className={mapMode===id?"active":""} onClick={()=>onMapModeChange?.(id)}>{label}</button>)}<button className="zoom-button" onClick={()=>setZoom(z=>Math.min(2.4,z+.15))}>+</button><button className="zoom-button" onClick={()=>setZoom(z=>Math.max(.72,z-.15))}>−</button></div>
    <div className="map-scale">WORLD THEATRE · {Math.round(zoom*100)}%</div>
  </div>;
}
