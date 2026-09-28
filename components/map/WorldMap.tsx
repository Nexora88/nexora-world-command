"use client";

import {useCallback,useRef,useState} from "react";
import type {Province} from "@/lib/types";
import type {Army} from "@/game/movement/server/types";
import {CountryWorldLayer} from "@/components/map/CountryWorldLayer";
import {ProvinceLayer} from "@/components/map/ProvinceLayer";
import {WorldWeatherLayer} from "@/components/map/WorldWeatherLayer";
import {ArmyLayer} from "@/components/map/ArmyLayer";

type Props={provinces:Province[];armies:Army[];selectedId:string|null;selectedArmyId:string|null;onSelect:(id:string)=>void;onSelectArmy:(id:string)=>void;onCountrySelect?:(iso2:string)=>void;selectedCountryId?:string|null;mapMode:MapMode;onMapModeChange:(mode:MapMode)=>void;playerCountryId?:string;showLabels?:boolean;showBorders?:boolean};
export type MapMode="political"|"population"|"economy"|"resources"|"military"|"weather"|"terrain"|"frontline";
const MIN_ZOOM=.82,MAX_ZOOM=3.25,DEFAULT_ZOOM=1;

export function WorldMap({provinces,armies,selectedId,selectedArmyId,playerCountryId,showLabels=true,showBorders=true,onSelect,onSelectArmy,onCountrySelect,mapMode="political",onMapModeChange}:Props){
  const [zoom,setZoom]=useState(DEFAULT_ZOOM);
  const [pan,setPan]=useState({x:0,y:0});
  const drag=useRef<{x:number;y:number;panX:number;panY:number;distance:number;pinch:boolean}|null>(null);
  const [dragging,setDragging]=useState(false);
  const clampPan=useCallback((x:number,y:number,z=zoom)=>{
    const limit=Math.max(0,(z-1)*38+8);
    return {x:Math.max(-limit,Math.min(limit,x)),y:Math.max(-limit*.62,Math.min(limit*.62,y))};
  },[zoom]);
  const setZoomAt=useCallback((next:number)=>{setZoom(z=>{const value=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,next));setPan(p=>clampPan(p.x,p.y,value));return value})},[clampPan]);
  const reset=()=>{setZoom(DEFAULT_ZOOM);setPan({x:0,y:0})};
  const onWheel=(e:React.WheelEvent<HTMLDivElement>)=>{e.preventDefault();setZoomAt(zoom+(e.deltaY<0?.12:-.12))};
  const pointDistance=(a:React.Touch,b:React.Touch)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
  const touchStart=(e:React.TouchEvent<HTMLDivElement>)=>{
    if(e.touches.length===2){drag.current={x:0,y:0,panX:pan.x,panY:pan.y,distance:pointDistance(e.touches[0],e.touches[1]),pinch:true};return}
    const t=e.touches[0];drag.current={x:t.clientX,y:t.clientY,panX:pan.x,panY:pan.y,distance:0,pinch:false};setDragging(false);
  };
  const touchMove=(e:React.TouchEvent<HTMLDivElement>)=>{
    const d=drag.current;if(!d)return;
    if(e.touches.length===2){e.preventDefault();const distance=pointDistance(e.touches[0],e.touches[1]);setZoomAt(zoom+(distance-d.distance)/360);d.distance=distance;d.pinch=true;return}
    if(d.pinch)return;e.preventDefault();const t=e.touches[0];const dx=t.clientX-d.x,dy=t.clientY-d.y;if(Math.hypot(dx,dy)>5)setDragging(true);setPan(clampPan(d.panX+dx/5,d.panY+dy/5));
  };
  const pointerDown=(e:React.PointerEvent<HTMLDivElement>)=>{if(e.pointerType==="touch")return;if(e.button!==0&&e.button!==1)return;drag.current={x:e.clientX,y:e.clientY,panX:pan.x,panY:pan.y,distance:0,pinch:false};e.currentTarget.setPointerCapture?.(e.pointerId);setDragging(false)};
  const pointerMove=(e:React.PointerEvent<HTMLDivElement>)=>{const d=drag.current;if(!d||e.pointerType==="touch")return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.hypot(dx,dy)>5)setDragging(true);if(e.buttons)setPan(clampPan(d.panX+dx/5,d.panY+dy/5))};
  const pointerUp=()=>{drag.current=null;setDragging(false)};
  const modes:Array<[MapMode,string]>= [["political","POLITICAL"],["terrain","TERRAIN"],["economy","ECONOMY"],["resources","RESOURCES"],["military","MILITARY"],["weather","WEATHER"]];
  const handleProvince=(id:string)=>{if(!dragging)onSelect(id)};
  return <div className={`world-map real-world-map world-map-clean mode-${mapMode} ${dragging?"is-dragging":""}`} onWheel={onWheel} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onPointerLeave={pointerUp} onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={pointerUp}>
    <svg viewBox="0 0 100 100" className="world-map-svg" preserveAspectRatio="xMidYMid meet" aria-label="World strategic map">
      <rect width="100" height="100" className="world-ocean"/>
      <g className="world-map-zoom" transform={`translate(${pan.x} ${pan.y}) translate(50 50) scale(${zoom}) translate(-50 -50)`}>
        <CountryWorldLayer zoom={zoom} playerCountryId={playerCountryId} showLabels={showLabels} showBorders={showBorders} onCountrySelect={onCountrySelect}/>
        <ProvinceLayer provinces={provinces} selectedId={selectedId} hoveredId={null} playerCountryId={playerCountryId} zoom={zoom} mapMode={mapMode} maxPopulation={0} maxIndustry={0} onSelect={handleProvince} onHover={()=>{}} fillFor={p=>p.ownerId===playerCountryId?"#45c878":"#65756d"}/>
        <ArmyLayer armies={armies} selectedArmyId={selectedArmyId} onSelectArmy={onSelectArmy}/>
        <WorldWeatherLayer mode={mapMode}/>
      </g>
    </svg>
    <div className="strategic-map-toolbar"><span>STRATEGIC MAP</span>{modes.map(([id,label])=><button key={id} className={mapMode===id?"active":""} onClick={()=>onMapModeChange(id)}>{label}</button>)}<button className="zoom-button" onClick={()=>setZoomAt(zoom+.18)} aria-label="Zoom in">+</button><button className="zoom-button" onClick={()=>setZoomAt(zoom-.18)} aria-label="Zoom out">−</button><button className="zoom-button reset" onClick={reset}>RESET</button></div>
    <div className="map-scale">EUROPE THEATRE · {Math.round(zoom*100)}%</div>
  </div>;
}
