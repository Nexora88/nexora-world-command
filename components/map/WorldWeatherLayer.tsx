"use client";

import {useMemo} from "react";
import type {MapMode} from "@/components/map/WorldMap";

type Props={mode:MapMode};

export function WorldWeatherLayer({mode}:Props){
  const flakes=useMemo(()=>Array.from({length:90},(_,i)=>({x:(i*37)%100,y:(i*61)%100,r:0.12+(i%4)*0.06,d:(i%7)*0.7})),[]);
  const rain=useMemo(()=>Array.from({length:55},(_,i)=>({x:(i*47)%100,y:(i*29)%100,d:(i%6)*0.35})),[]);
  if(mode!=="weather")return null;
  return <g className="world-weather-layer" pointerEvents="none">
    <rect width="100" height="100" className="weather-atmosphere"/>
    <g className="snowfall">{flakes.map((f,i)=><circle key={`s${i}`} cx={f.x} cy={f.y} r={f.r} style={{animationDelay:`${f.d}s`}}/>)}</g>
    <g className="rainfall">{rain.map((r,i)=><path key={`r${i}`} d={`M${r.x},${r.y} l-.35,1.15`} style={{animationDelay:`${r.d}s`}}/>)}</g>
    <path className="cold-front" d="M0 27 C18 20 29 34 45 26 S72 19 100 29"/>
    <path className="storm-front" d="M0 66 C20 57 35 74 52 64 S79 56 100 68"/>
  </g>;
}
