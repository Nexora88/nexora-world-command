"use client";

import {useState} from "react";
import type {Province} from "@/lib/types";
import type {Army} from "@/game/movement/server/types";
import {CountryWorldLayer} from "@/components/map/CountryWorldLayer";

type Props={provinces:Province[];armies:Army[];selectedId:string|null;selectedArmyId:string|null;onSelect:(id:string)=>void;onSelectArmy:(id:string)=>void;onCountrySelect?:(iso2:string)=>void;mapMode:MapMode;onMapModeChange:(mode:MapMode)=>void;playerCountryId?:string;showLabels?:boolean;showBorders?:boolean};
export type MapMode="political"|"population"|"economy"|"resources"|"military"|"weather"|"terrain"|"frontline";

export function WorldMap({playerCountryId,showLabels=true,showBorders=true,onCountrySelect}:Props){
  const [zoom]=useState(1);
  return <div className="world-map real-world-map world-map-clean">
    <svg viewBox="0 0 100 100" className="world-map-svg" preserveAspectRatio="xMidYMid meet" aria-label="World political map">
      <rect width="100" height="100" className="world-ocean"/>
      <CountryWorldLayer zoom={zoom} playerCountryId={playerCountryId} showLabels={showLabels} showBorders={showBorders} onCountrySelect={onCountrySelect}/>
    </svg>
  </div>;
}
