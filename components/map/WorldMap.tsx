"use client";

import {useMemo,useState} from "react";
import type {Province} from "@/lib/types";
import type {Army} from "@/game/movement/server/types";
import {REAL_WORLD_COUNTRIES,REAL_WORLD_PROVINCES} from "@/data/world/real-world-provinces";
import {audioManager} from "@/lib/audio-manager";
import {safeCountryCode,safeCountryName} from "@/lib/safe-country";
import {ProvinceLayer} from "@/components/map/ProvinceLayer";

export type MapMode="political"|"population"|"economy"|"resources"|"military"|"weather"|"terrain"|"frontline";
const modeLabel:Record<MapMode,string>={political:"SİYASİ",population:"NÜFUS",economy:"EKONOMİ",resources:"KAYNAKLAR",military:"ASKERİ",weather:"HAVA",terrain:"ARAZİ",frontline:"CEPHE"};
const weatherLabel:Record<string,string>={clear:"AÇIK",rain:"YAĞMUR",snow:"KAR",blizzard:"TIPI",storm:"FIRTINA",fog:"SİS",heatwave:"SICAK HAVA"};
const terrainLabel:Record<string,string>={plains:"OVA",forest:"ORMAN",mountain:"DAĞ",hills:"TEPE",urban:"ŞEHİR",coast:"KIYI",desert:"ÇÖL",tundra:"TUNDRA"};

function UnitGlyph({army,large=false}:{army:Army;large?:boolean}){
  const armored=army.tanks>0;
  return <g className={`real-unit ${large?"large":""}`}><circle r={large?3.2:2.3} className={armored?"unit-armored":"unit-infantry"}/><text y=".8" textAnchor="middle">{armored?"▰":"✚"}</text><text y={large?6:5} textAnchor="middle" className="unit-count">{army.strength>999?`${Math.round(army.strength/1000)}K`:army.strength}</text></g>;
}

type Props={provinces:Province[];armies:Army[];selectedId:string|null;selectedArmyId:string|null;onSelect:(id:string)=>void;onSelectArmy:(id:string)=>void;mapMode:MapMode;onMapModeChange:(mode:MapMode)=>void;playerCountryId?:string};

export function WorldMap({provinces,armies,selectedId,selectedArmyId,onSelect,onSelectArmy,mapMode,onMapModeChange,playerCountryId}:Props){
  const [zoom,setZoom]=useState(1);
  const [hovered,setHovered]=useState<string|null>(null);
  const maxPop=Math.max(...provinces.map(p=>p.population),1);
  const maxInd=Math.max(...provinces.map(p=>p.industryLevel),1);
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
    <div className="map-header"><b>AVRUPA CEPHESİ</b><span>{modeLabel[mapMode]} {"//"} {zoom.toFixed(1)}×</span><span>{REAL_WORLD_COUNTRIES.length} ÜLKE · {provinces.length} BÖLGE</span></div>
    <div className="map-compass">N<br/><i>＋</i></div>
    <svg viewBox="0 0 100 100" className="province-map real-world-svg" style={{transform:`scale(${zoom})`}}>
      <defs><filter id="provinceGlow"><feGaussianBlur stdDeviation=".8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <ProvinceLayer provinces={provinces} selectedId={selectedId} hoveredId={hovered} playerCountryId={playerCountryId} mapMode={mapMode} maxPopulation={maxPop} maxIndustry={maxInd} onSelect={id=>{audioManager.provinceSelected();onSelect(id)}} onHover={setHovered} fillFor={fillFor}/>

      <g className="city-markers">
        {provinces.map(p=>{
          const rw=REAL_WORLD_PROVINCES[p.id]; if(!rw)return null;
          const c=REAL_WORLD_COUNTRIES.find(x=>safeCountryCode(x.id)===safeCountryCode(rw.countryCode));
          const selected=p.id===selectedId,hover=p.id===hovered,capital=c?.capitalProvinceId===p.id;
          return <g key={p.id} transform={`translate(${rw.coordinates.x},${rw.coordinates.y})`} className={`city-marker ${selected?"selected":""} ${hover?"hovered":""}`} pointerEvents="none">
            <circle r={capital?1.45:1.05} className={capital?"capital-dot":"city-dot"}/>
            {capital&&<circle r="2.5" className="capital-ring"/>}
            {(selected||hover)&&<text x="2.3" y=".8" className="city-label">{safeCountryName(rw.name)}</text>}
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
    {hoveredProvince&&hoveredWorld&&<div className="province-tooltip"><strong>{safeCountryName(hoveredWorld.name)}</strong><span>{safeCountryName(hoveredWorld.country)}</span><i>NÜFUS <b>{hoveredProvince.population.toLocaleString()}</b></i><i>ARAZİ <b>{terrainLabel[hoveredProvince.terrain]??safeCountryName(hoveredProvince.terrain)}</b></i><i>SAHİP <b>{safeCountryCode(hoveredProvince.ownerId)||"BİLİNMİYOR"}</b></i></div>}
    <div className="map-modebar">{(Object.keys(modeLabel) as MapMode[]).map(m=><button key={m} className={mapMode===m?"active":""} onClick={()=>onMapModeChange(m)}>{modeLabel[m]}</button>)}</div>
    <div className="map-controls"><button onClick={()=>setZoom(z=>Math.min(1.7,z+.15))}>＋</button><button onClick={()=>setZoom(z=>Math.max(1,z-.15))}>−</button><button onClick={()=>setZoom(1)}>⌖</button></div>
    <div className="map-legend"><span><i className="legend-infantry"/>PİY</span><span><i className="legend-armored"/>ZIRH</span><span><i className="legend-capital">★</i>BAŞKENT</span><span>{provinces.length} BÖLGE</span></div>
    <div className="map-weather">HAVA // {weatherLabel[selected?.weather??"clear"]??"AÇIK"}</div>
  </div>;
}
