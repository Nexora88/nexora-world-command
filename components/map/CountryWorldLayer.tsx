"use client";

import {useEffect,useMemo,useState} from "react";
import {REAL_WORLD_COUNTRIES} from "@/data/world/real-world-provinces";

type Ring=number[][];
type Geometry={type:"Polygon"|"MultiPolygon";coordinates:Ring[]|Ring[][]};
type Feature={type:"Feature";properties:{name?:string;"ISO3166-1-Alpha-2"?:string;"ISO3166-1-Alpha-3"?:string};geometry:Geometry};
type Collection={type:"FeatureCollection";features:Feature[]};

type Props={zoom:number;playerCountryId?:string;showLabels?:boolean;showBorders?:boolean;onCountrySelect?:(iso2:string)=>void};

const iso2ToGame:Record<string,string>={TR:"TR",DE:"DE",GB:"GB",RU:"RU",FR:"FR",ES:"ES",PT:"PT",IT:"IT",CH:"CH",AT:"AT",BE:"BE",NL:"NL",LU:"LU",PL:"PL",CZ:"CZ",SK:"SK",HU:"HU",RO:"RO",BG:"BG",GR:"GR",RS:"RS",HR:"HR",SI:"SI",BA:"BA",ME:"ME",MK:"MK",AL:"AL",DK:"DK",NO:"NO",SE:"SE",FI:"FI",EE:"EE",LV:"LV",LT:"LT",BY:"BY",UA:"UA",MD:"MD",IE:"IE",IS:"IS",MC:"MC",SM:"SM",VA:"VA"};

function project([lon,lat]:number[]){
  const x=((lon+180)/360)*100;
  const y=((90-lat)/180)*100;
  return [Math.max(-2,Math.min(102,x)),Math.max(-2,Math.min(102,y))] as const;
}
function ringPath(ring:Ring){
  if(!ring.length)return "";
  return ring.map((p,i)=>{const [x,y]=project(p);return `${i?"L":"M"}${x.toFixed(3)},${y.toFixed(3)}`}).join(" ")+" Z";
}
function geometryPath(g:Geometry){
  if(g.type==="Polygon")return (g.coordinates as Ring[]).map(ringPath).join(" ");
  return (g.coordinates as Ring[][]).flat().map(ringPath).join(" ");
}
function labelPoint(g:Geometry){
  const points=(g.type==="Polygon"?(g.coordinates as Ring[]).flat():(g.coordinates as Ring[][]).flat(2));
  if(!points.length)return [50,50] as const;
  let minX=180,maxX=-180,minY=90,maxY=-90;
  for(const [lon,lat] of points){minX=Math.min(minX,lon);maxX=Math.max(maxX,lon);minY=Math.min(minY,lat);maxY=Math.max(maxY,lat)}
  return project([(minX+maxX)/2,(minY+maxY)/2]);
}
function colorFor(feature:Feature,index:number,playerCountryId?:string){
  const iso=feature.properties["ISO3166-1-Alpha-2"]??"";
  const gameId=iso2ToGame[iso];
  if(gameId===playerCountryId)return "#b69a52";
  const game=REAL_WORLD_COUNTRIES.find(c=>c.id===gameId);
  if(game)return game.color;
  const palette=["#536b59","#586b79","#716a5b","#65785f","#6f6574","#596f72","#776b56","#60736a"];
  return palette[index%palette.length];
}

export function CountryWorldLayer({zoom,playerCountryId,showLabels=true,showBorders=true,onCountrySelect}:Props){
  const [data,setData]=useState<Collection|null>(null);
  useEffect(()=>{let alive=true;fetch("/map/countries.geojson",{cache:"force-cache"}).then(r=>r.json()).then(v=>{if(alive)setData(v)}).catch(()=>{if(alive)setData(null)});return()=>{alive=false}},[]);
  const features=useMemo(()=>data?.features??[],[data]);
  if(!features.length)return <g className="country-world-loading"/>;
  return <g className="country-world-layer" aria-label="WORLD COUNTRIES">
    {features.map((f,i)=>{
      const iso=f.properties["ISO3166-1-Alpha-2"]??`${i}`;
      const name=f.properties.name??"UNKNOWN";
      const [x,y]=labelPoint(f.geometry);
      const gameId=iso2ToGame[iso];
      return <g key={`${iso}-${i}`} className={`world-country ${gameId===playerCountryId?"player":""}`}>
        <path d={geometryPath(f.geometry)} fill={colorFor(f,i,playerCountryId)} className={`world-country-shape ${showBorders?"":"no-borders"}`} onClick={()=>onCountrySelect?.(iso)}>
          <title>{name}</title>
        </path>
        {showLabels&&<text x={x} y={y} className="world-country-label" style={{fontSize:`${Math.max(1.05,Math.min(2.15,1.28/Math.sqrt(Math.max(1,zoom))))}px`}}>{name.toUpperCase()}</text>}
      </g>;
    })}
  </g>;
}
