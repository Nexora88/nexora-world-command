"use client";

import {useMemo} from "react";
import type {Province} from "@/lib/types";
import type {Army} from "@/game/movement/server/types";
import {REAL_WORLD_COUNTRIES,REAL_WORLD_PROVINCES} from "@/data/world/real-world-provinces";
import {safeCountryCode} from "@/lib/safe-country";

type Point={x:number;y:number};
type Props={
  provinces:Province[];
  selectedId:string|null;
  hoveredId:string|null;
  playerCountryId?:string;
  selectedCountryId?:string|null;
  selectedArmyId?:string|null;
  armies?:Army[];
  zoom?:number;
  mapMode:string;
  maxPopulation:number;
  maxIndustry:number;
  onSelect:(id:string)=>void;
  onHover:(id:string|null)=>void;
  fillFor:(province:Province)=>string;
};

const terrainFill:Record<string,string>={plains:"#536b59",forest:"#385947",mountain:"#706d61",hills:"#62655c",urban:"#56656a",coast:"#426d68",desert:"#7c6b48",tundra:"#64757c"};

function fallbackGeometry(x:number,y:number,scale=6):Point[]{
  const s=Math.max(2.8,Math.min(7.5,scale));
  return [{x:x-s,y:y-s*.65},{x:x+s*.55,y:y-s},{x:x+s,y:y-s*.05},{x:x+s*.7,y:y+s},{x:x-s*.35,y:y+s*.9},{x:x-s,y:y+s*.2}];
}

function polygonPoints(id:string){
  const p=REAL_WORLD_PROVINCES[id];
  if(!p)return "";
  const geometry=p.geometry?.points;
  const points=geometry&&geometry.length>=3?geometry:fallbackGeometry(p.coordinates.x,p.coordinates.y);
  return points.map(point=>`${point.x},${point.y}`).join(" ");
}

export function ProvinceLayer({provinces,selectedId,hoveredId,playerCountryId,selectedCountryId,selectedArmyId,armies=[],zoom=1,mapMode,onSelect,onHover,fillFor}:Props){
  const shapes=useMemo(()=>provinces.map(p=>({p,world:REAL_WORLD_PROVINCES[p.id]})).filter(x=>x.world),[provinces]);
  const focusCountry=selectedCountryId??playerCountryId;
  const focusedShapes=useMemo(()=>focusCountry?shapes.filter(({p,world})=>safeCountryCode(world?.countryCode??p.countryId)===safeCountryCode(focusCountry)):shapes,[focusCountry,shapes]);
  const selectedArmy=selectedArmyId?armies.find(a=>a.id===selectedArmyId):undefined;
  const route=selectedArmy?.order?.route??[];
  const targetId=route.length?route[route.length-1]:undefined;
  const commandProvinceId=selectedArmy?.provinceId??selectedId??undefined;
  const commandProvince=commandProvinceId?REAL_WORLD_PROVINCES[commandProvinceId]:undefined;
  const commandNeighbors=(commandProvince?.neighbors??[]).filter(id=>REAL_WORLD_PROVINCES[id]);
  // Province territories are the command layer: a selected country is revealed immediately, otherwise the layer appears after zoom.
  if(zoom<1.65 && !selectedCountryId)return <g className="province-territories"/>;
  return <g className="province-territories">
    {selectedArmy && zoom>=1.35 && commandProvince && commandNeighbors.map(id=>{
      const neighbor=REAL_WORLD_PROVINCES[id];
      return <line key={`adj-${selectedArmy.id}-${id}`} x1={commandProvince.coordinates.x} y1={commandProvince.coordinates.y} x2={neighbor.coordinates.x} y2={neighbor.coordinates.y} className="province-command-link" pointerEvents="none"/>;
    })}
    {(selectedCountryId ? focusedShapes : (zoom>=1.65 ? shapes : focusedShapes)).map(({p,world})=>{
      const code=safeCountryCode(world?.countryCode??p.countryId);
      const country=REAL_WORLD_COUNTRIES.find(c=>safeCountryCode(c.id)===code);
      const selected=p.id===selectedId;
      const target=p.id===targetId;
      const commandNeighbor=commandNeighbors.includes(p.id);
      const hovered=p.id===hoveredId;
      const owned=!!playerCountryId&&code===safeCountryCode(playerCountryId);
      const terrain=world?.terrain??p.terrain;
      const fill=mapMode==="terrain"?(terrainFill[terrain]??"#536b59"):fillFor(p);
      const geometry=world.geometry?.points;
      const hasGeometry=Array.isArray(geometry)&&geometry.length>=3;
      return <g key={p.id} className="province-hit-region">
        {hasGeometry ? <polygon
          points={polygonPoints(p.id)}
          className={`province-territory ${selected?"selected":""} ${target?"target":""} ${commandNeighbor?"command-neighbor":""} ${hovered?"hovered":""} ${owned?"owned":""}`}
          fill={fill}
          fillOpacity={owned?(selected?.42:hovered?.31:.22):0}
          stroke={country?.color??"#52615d"}
          onMouseEnter={()=>onHover(p.id)}
          onMouseLeave={()=>onHover(null)}
          onClick={()=>onSelect(p.id)}
          aria-label={`${p.name}, ${world?.country??"Unknown"}`}
        /> : <>
          <circle
            cx={world.coordinates.x} cy={world.coordinates.y} r="6.5"
            className={`province-territory-fallback ${selected?"selected":""} ${hovered?"hovered":""}`}
            stroke={country?.color??"#52615d"}
            onMouseEnter={()=>onHover(p.id)} onMouseLeave={()=>onHover(null)} onClick={()=>onSelect(p.id)}
            aria-label={`${p.name}, ${world?.country??"Unknown"}`}
          />
          <circle cx={world.coordinates.x} cy={world.coordinates.y} r="1.15" className="province-center-fallback"/>
        </>}
        {target&&<circle cx={world.coordinates.x} cy={world.coordinates.y} r="2.2" className="province-target-ring" pointerEvents="none"/>}
        {target&&zoom>=1.65&&<text x={world.coordinates.x} y={world.coordinates.y+3.8} className="province-target-label" pointerEvents="none">DESTINATION</text>}
        {((owned&&zoom>=1.05)||(selectedCountryId&&zoom>=1.65)||(zoom>=2.15&&selected))&&<text x={world.coordinates.x} y={world.coordinates.y-1.9} className={`province-label ${owned?"owned":""}`}>{p.name.toUpperCase()}</text>}
      </g>;
    })}
  </g>;
}
export function ProvinceFallbackLegend(){
  return <div className="province-layer-note">PROVINCE TERRITORIES // {Object.keys(REAL_WORLD_PROVINCES).length}</div>;
}
