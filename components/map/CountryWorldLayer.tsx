"use client";
import {useEffect,useMemo,useState} from "react";
import {REAL_WORLD_COUNTRIES,REAL_WORLD_PROVINCES,getCountryFlag} from "@/data/world/real-world-provinces";
type Ring=number[][]; type Geometry={type:"Polygon"|"MultiPolygon";coordinates:Ring[]|Ring[][]};
type Feature={type:"Feature";properties:{name?:string;"ISO3166-1-Alpha-2"?:string;"ISO3166-1-Alpha-3"?:string};geometry:Geometry}; type Collection={type:"FeatureCollection";features:Feature[]};
type Props={zoom:number;playerCountryId?:string;showLabels?:boolean;showBorders?:boolean;onCountrySelect?:(iso2:string)=>void};
const iso2ToGame:Record<string,string>={TR:"TR",DE:"DE",GB:"GB",RU:"RU",FR:"FR",ES:"ES",PT:"PT",IT:"IT",CH:"CH",AT:"AT",BE:"BE",NL:"NL",LU:"LU",PL:"PL",CZ:"CZ",SK:"SK",HU:"HU",RO:"RO",BG:"BG",GR:"GR",RS:"RS",HR:"HR",SI:"SI",BA:"BA",ME:"ME",MK:"MK",AL:"AL",DK:"DK",NO:"NO",SE:"SE",FI:"FI",EE:"EE",LV:"LV",LT:"LT",BY:"BY",UA:"UA",MD:"MD",IE:"IE",IS:"IS",MC:"MC",SM:"SM",VA:"VA"};
const MAJOR=new Set(["US","CA","MX","BR","AR","GB","FR","DE","ES","IT","RU","TR","EG","ZA","NG","SA","IR","IN","CN","JP","KR","ID","AU","UA","PL"]);
function project([lon,lat]:number[]){return [Math.max(-2,Math.min(102,((lon+180)/360)*100)),Math.max(-2,Math.min(58.25,((90-lat)/180)*56.25))] as const}
function ringPath(ring:Ring){return ring.length?ring.map((p,i)=>{const[x,y]=project(p);return `${i?"L":"M"}${x.toFixed(3)},${y.toFixed(3)}`}).join(" ")+" Z":""}
function geometryPath(g:Geometry){return g.type==="Polygon"?(g.coordinates as Ring[]).map(ringPath).join(" "):(g.coordinates as Ring[][]).flat().map(ringPath).join(" ")}
function labelPoint(g:Geometry){const pts=(g.type==="Polygon"?(g.coordinates as Ring[]).flat():(g.coordinates as Ring[][]).flat(2));if(!pts.length)return[50,50]as const;let a=180,b=-180,c=90,d=-90;for(const[p,q]of pts){a=Math.min(a,p);b=Math.max(b,p);c=Math.min(c,q);d=Math.max(d,q)}return project([(a+b)/2,(c+d)/2])}
function colorFor(f:Feature,i:number,player?:string){const iso=f.properties["ISO3166-1-Alpha-2"]??"";const id=iso2ToGame[iso];if(id===player)return"#b69a52";const game=REAL_WORLD_COUNTRIES.find(c=>c.id===id);if(game)return game.color;const p=["#536b59","#586b79","#716a5b","#65785f","#6f6574","#596f72","#776b56","#60736a"];return p[i%p.length]}
function labelTier(iso:string,zoom:number,player:boolean){if(player)return true;if(zoom<1.25)return MAJOR.has(iso);if(zoom<1.8)return MAJOR.has(iso)||["NL","BE","CH","AT","GR","RO","CZ","HU","SE","NO","FI","PT"].includes(iso);return true}

export function CountryWorldLayer({zoom,playerCountryId,showLabels=true,showBorders=true,onCountrySelect}:Props){
 const[data,setData]=useState<Collection|null>(null); const[error,setError]=useState(false);
 useEffect(()=>{let alive=true;setError(false);fetch("/map/countries.geojson",{cache:"force-cache"}).then(r=>{if(!r.ok)throw new Error("MAP_FETCH");return r.json()}).then(v=>{if(alive)setData(v)}).catch(()=>{if(alive)setError(true)});return()=>{alive=false}},[]);
 const features=useMemo(()=>data?.features??[],[data]);
 if(error)return <g className="country-world-loading"><text x="50" y="28" className="map-data-error">WORLD MAP DATA UNAVAILABLE</text></g>;
 if(!features.length)return <g className="country-world-loading"><text x="50" y="28" className="map-data-loading">LOADING WORLD DATA…</text></g>;
 return <g className="country-world-layer" aria-label="WORLD COUNTRIES">
  {features.map((f,i)=>{const iso=f.properties["ISO3166-1-Alpha-2"]??`${i}`;const name=f.properties.name??"UNKNOWN";const[x,y]=labelPoint(f.geometry);const gameId=iso2ToGame[iso];const visible=showLabels&&labelTier(iso,zoom,gameId===playerCountryId);const capital=gameId?REAL_WORLD_COUNTRIES.find(c=>c.id===gameId):undefined;const capitalProvince=capital?REAL_WORLD_PROVINCES[capital.capitalProvinceId]:undefined;
   return <g key={`${iso}-${i}`} className={`world-country ${gameId===playerCountryId?"player":""}`}><path d={geometryPath(f.geometry)} fill={colorFor(f,i,playerCountryId)} className={`world-country-shape ${showBorders?"":"no-borders"}`} onClick={()=>onCountrySelect?.(iso)}><title>{name}</title></path>
    {visible&&<text x={x} y={y-.55} className={`world-country-label ${MAJOR.has(iso)?"major-label":""}`} pointerEvents="none" style={{fontSize:`${gameId===playerCountryId?1.35:Math.max(.72,1.12/Math.sqrt(Math.max(1,zoom)))}px`}}>{getCountryFlag(gameId??"")} {name.toUpperCase()}</text>}
    {gameId&&capitalProvince&&zoom>=1.7&&<g className="capital-marker" pointerEvents="none"><circle cx={capitalProvince.coordinates.x} cy={capitalProvince.coordinates.y} r=".72" className="capital-ring"/><circle cx={capitalProvince.coordinates.x} cy={capitalProvince.coordinates.y} r=".25" className="capital-core"/><text x={capitalProvince.coordinates.x+1.05} y={capitalProvince.coordinates.y-.7} className="capital-label">★ {capitalProvince.name.toUpperCase()}</text></g>}
   </g>})}
 </g>;
}
