"use client";

import type { Army } from "@/game/movement/server/types";
import { REAL_WORLD_PROVINCES } from "@/data/world/real-world-provinces";

type Props = {
  armies: Army[];
  selectedArmyId: string | null;
  onSelectArmy: (id: string) => void;
  zoom?: number;
  gameClock?: { day:number; hour:number; minute:number };
};

type Point = { x: number; y: number };

function positionForArmy(army: Army): Point | null {
  const province = REAL_WORLD_PROVINCES[army.provinceId];
  if (!province) return null;
  return { x: province.coordinates.x, y: province.coordinates.y };
}

function gameStamp(c:{day:number;hour:number;minute:number}) { return (c.day-1)*1440+c.hour*60+c.minute; }
function etaText(eta:number|undefined, clock:Props["gameClock"]) { if(eta===undefined||!clock)return "ETA --"; const delta=Math.max(0,eta-gameStamp(clock)); return delta<60?`ETA ${delta}m`:`ETA ${Math.floor(delta/60)}h ${delta%60}m`; }

function shortNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return Math.round(value).toString();
}

export function ArmyLayer({ armies, selectedArmyId, onSelectArmy, zoom = 1, gameClock }: Props) {
  const active = armies.filter((army) => army.status !== "destroyed");
  if (zoom < 1.15) return <g className="army-layer" />;
  const stackCounts = new Map<string, number>();
  const moving = active.filter(a=>a.status==="moving"&&a.order?.route && a.order.route.length>=2);
  const roads = Object.values(REAL_WORLD_PROVINCES).flatMap((p)=>p.neighbors.map(n=>({a:p.id,b:n}))).filter((r,i,all)=>i===all.findIndex(x=>(x.a===r.b&&x.b===r.a)|| (x.a===r.a&&x.b===r.b)));
  const bases = Object.values(REAL_WORLD_PROVINCES).filter((p,i)=>p.id.endsWith("_ANKARA")||p.id.endsWith("_BERLIN")||p.id.endsWith("_PARIS")||p.id.endsWith("_LONDON")||p.id.endsWith("_MOSCOW")||i%11===0);
  return (<>\n    <g className="strategic-road-network" pointerEvents="none">
      {roads.map(r=>{const a=REAL_WORLD_PROVINCES[r.a],b=REAL_WORLD_PROVINCES[r.b];if(!a||!b)return null;return <line key={r.a+"-"+r.b} x1={a.coordinates.x} y1={a.coordinates.y} x2={b.coordinates.x} y2={b.coordinates.y} className="strategic-road"/>})}
    </g>
    <g className="army-infrastructure" pointerEvents="none">
      {bases.map(p=><g key={"base-"+p.id} transform={"translate("+p.coordinates.x+" "+p.coordinates.y+")"}><circle r="1.45" className="army-base-halo"/><path d="M-1-.4 L0-1.25 1-.4V1H-1Z" className="army-base-icon"/><text y="2.35" className="army-base-label">{p.id.endsWith("_ANKARA")||p.id.endsWith("_BERLIN")||p.id.endsWith("_PARIS")||p.id.endsWith("_LONDON")||p.id.endsWith("_MOSCOW")?"FIELD HQ":"LOGISTICS"}</text></g>)}
    </g>
    <g className="army-routes" pointerEvents="none">
      {moving.map(a=>{
        const points=a.order!.route.map(id=>REAL_WORLD_PROVINCES[id]?.coordinates).filter(Boolean) as Point[];
        if(points.length<2)return null;
        const selected=a.id===selectedArmyId;
        const pointString=points.map(p=>`${p.x},${p.y}`).join(" ");
        const mid=points[Math.floor(points.length/2)];
        const target=points[points.length-1];
        return <g key={`route-${a.id}`} className={`army-route ${selected?"selected":""}`}>
          <polyline points={pointString} className="army-route-line"/>
          {selected&&<circle cx={target.x} cy={target.y} r="1.15" className="army-route-target"/>
          }
          {zoom>=1.45&&<text x={mid.x} y={mid.y-1} className="army-route-eta">{etaText(a.order!.eta,gameClock)}</text>}
        </g>;
      })}
    </g>
    <g className="army-layer" aria-label="Field armies">
      {active.map((army) => {
        const point = positionForArmy(army);
        if (!point) return null;
        const stackIndex = stackCounts.get(army.provinceId) ?? 0;
        stackCounts.set(army.provinceId, stackIndex + 1);
        const angle = stackIndex * 2.35;
        const radius = stackIndex === 0 ? 0 : 3.2;
        const offset = { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
        const selected = army.id === selectedArmyId;
        const moving = army.status === "moving";
        return (
          <g
            key={army.id}
            className={`army-marker ${selected ? "selected" : ""} ${moving ? "moving" : ""}`}
            transform={`translate(${point.x + offset.x} ${point.y + offset.y})`}
            onClick={(event) => {
              event.stopPropagation();
              onSelectArmy(army.id);
            }}
            role="button"
            tabIndex={0}
            aria-label={`${army.name}, ${shortNumber(army.strength)} strength`}
          >
            <circle className="army-marker-shadow" cx="0" cy="0" r="2.9" />
            <circle className="army-marker-ring" cx="0" cy="0" r="2.65" />
            <path className="army-marker-shield" d="M0-2.05 L1.75-1.15 L1.35 1.25 L0 2.05 L-1.35 1.25 L-1.75-1.15 Z" />
            {army.tanks > 0 && army.infantry > 0 ? <><path className="army-unit-icon tank" d="M-1.35-.7 H.35 V.15 H-1.35 Z M.35-.25 H1.25 V.15 H.35 Z" /><path className="army-unit-icon infantry" d="M.75-.9 L1.35-.25 .85-.25 1.15.55 .45.55 .7-.25 .15-.25 Z" /></> : army.tanks > 0 ? <path className="army-unit-icon tank" d="M-1.35-.7 H.35 V.15 H-1.35 Z M.35-.25 H1.25 V.15 H.35 Z" /> : <path className="army-unit-icon infantry" d="M-.35-1.05 L.35-.35 .05-.35 .45.65 H-.45 L-.05-.35 H-.35 Z" />}
            <circle className="army-unit-badge" cx="1.75" cy="-1.55" r=".75" />
            <text className="army-unit-letter" x="1.75" y="-1.55">{army.tanks>0&&army.infantry>0?"M":army.tanks>0?"T":"P"}</text>
            {zoom >= 1.45 && <text className="army-marker-strength" x="3.35" y=".65">{shortNumber(army.strength)}</text>}
            {zoom >= 1.75 && <text className="army-marker-name" x="0" y="5.1">{army.name.toUpperCase().slice(0, 16)}</text>}
          </g>
        );
      })}
    </g>
  </>);
}
