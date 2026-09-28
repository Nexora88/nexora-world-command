"use client";

import {useCallback,useEffect,useRef,useState} from "react";
import type {Province} from "@/lib/types";
import type {Army} from "@/game/movement/server/types";
import {CountryWorldLayer} from "@/components/map/CountryWorldLayer";
import {ProvinceLayer} from "@/components/map/ProvinceLayer";
import {WorldWeatherLayer} from "@/components/map/WorldWeatherLayer";
import {ArmyLayer} from "@/components/map/ArmyLayer";

type Props={provinces:Province[];armies:Army[];selectedId:string|null;selectedArmyId:string|null;gameClock?:{day:number;hour:number;minute:number};onSelect:(id:string)=>void;onSelectArmy:(id:string)=>void;onCountrySelect?:(iso2:string)=>void;selectedCountryId?:string|null;mapMode:MapMode;onMapModeChange:(mode:MapMode)=>void;playerCountryId?:string;showLabels?:boolean;showBorders?:boolean};
export type MapMode="political"|"population"|"economy"|"resources"|"military"|"weather"|"terrain"|"frontline";
const MIN_ZOOM=0.72,MAX_ZOOM=4.5,DEFAULT_ZOOM=1;
const MAP_CENTER_Y=28.125;

export function WorldMap({provinces,armies,selectedId,selectedArmyId,gameClock,playerCountryId,selectedCountryId,showLabels=true,showBorders=true,onSelect,onSelectArmy,onCountrySelect,mapMode="political",onMapModeChange}:Props){
  const [zoom,setZoom]=useState(DEFAULT_ZOOM);
  const [pan,setPan]=useState({x:0,y:0});
  const lastFocus=useRef<string|null>(null);
  const drag=useRef<{x:number;y:number;panX:number;panY:number;distance:number;pinch:boolean}|null>(null);
  const [dragging,setDragging]=useState(false);
  const clampPan=useCallback((x:number,y:number,z=zoom)=>{
    const horizontal=Math.max(0,(z-1)*50+5);
    const vertical=Math.max(0,(z-1)*28+4);
    return {x:Math.max(-horizontal,Math.min(horizontal,x)),y:Math.max(-vertical,Math.min(vertical,y))};
  },[zoom]);
  const setZoomAt=useCallback((next:number)=>{setZoom(z=>{const value=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,next));setPan(p=>clampPan(p.x,p.y,value));return value})},[clampPan]);
  const zoomIn=()=>setZoomAt(zoom+.25);
  const zoomOut=()=>setZoomAt(zoom-.25);
  const reset=()=>{setZoom(DEFAULT_ZOOM);setPan({x:0,y:0});lastFocus.current=null};
  const onWheel=(e:React.WheelEvent<HTMLDivElement>)=>{e.preventDefault();setZoomAt(zoom+(e.deltaY<0?.18:-.18))};
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
  const focusCountry=useCallback((countryId:string|null|undefined)=>{
    if(!countryId||countryId===lastFocus.current)return;
    const points=provinces.filter(p=>p.ownerId===countryId).map(p=>p.coordinates);
    if(!points.length)return;
    const cx=points.reduce((sum,p)=>sum+p[0],0)/points.length;
    const cy=points.reduce((sum,p)=>sum+p[1],0)/points.length;
    setZoom(2.05);
    setPan(clampPan((50-cx)*2.05,(MAP_CENTER_Y-cy)*2.05,2.05));
    lastFocus.current=countryId;
  },[clampPan,provinces]);
  useEffect(()=>{
    if(selectedCountryId) focusCountry(selectedCountryId);
    else lastFocus.current=null;
  },[selectedCountryId,focusCountry]);
  const handleProvince=(id:string)=>{if(!dragging)onSelect(id)};
  return <div className={`world-map real-world-map world-map-clean mode-${mapMode} ${dragging?"is-dragging":""}`} onWheel={onWheel} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onPointerLeave={pointerUp} onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={pointerUp}>
    <svg viewBox="0 0 100 56.25" className="world-map-svg" preserveAspectRatio="xMidYMid meet" aria-label="World strategic map">
      <rect width="100" height="56.25" className="world-ocean"/>
      <g className="world-map-zoom" transform={`translate(${pan.x} ${pan.y}) translate(50 ${MAP_CENTER_Y}) scale(${zoom}) translate(-50 -${MAP_CENTER_Y})`}>
        <CountryWorldLayer zoom={zoom} playerCountryId={playerCountryId} showLabels={showLabels} showBorders={showBorders} onCountrySelect={onCountrySelect}/>
        <ProvinceLayer provinces={provinces} selectedId={selectedId} hoveredId={null} playerCountryId={playerCountryId} selectedCountryId={selectedCountryId} selectedArmyId={selectedArmyId} armies={armies} zoom={zoom} mapMode={mapMode} maxPopulation={0} maxIndustry={0} onSelect={handleProvince} onHover={()=>{}} fillFor={p=>p.ownerId===playerCountryId?"#45c878":"#65756d"}/>
        <ArmyLayer armies={armies} selectedArmyId={selectedArmyId} onSelectArmy={onSelectArmy} zoom={zoom} gameClock={gameClock}/>
        <WorldWeatherLayer mode={mapMode}/>
      </g>
    </svg>
    <div className="strategic-map-toolbar"><span>STRATEGIC MAP</span>{modes.map(([id,label])=><button key={id} className={mapMode===id?"active":""} onClick={()=>onMapModeChange(id)}>{label}</button>)}<button className="zoom-button" onClick={zoomIn} aria-label="Zoom in">+</button><button className="zoom-button" onClick={zoomOut} aria-label="Zoom out">−</button><button className="zoom-button reset" onClick={reset}>RESET</button></div>
    <div className="map-scale">WORLD THEATRE · {Math.round(zoom*100)}% · WHEEL / PINCH TO ZOOM</div>
  </div>;
}
