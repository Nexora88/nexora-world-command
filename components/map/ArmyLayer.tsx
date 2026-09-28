"use client";

import type { Army } from "@/game/movement/server/types";
import { REAL_WORLD_PROVINCES } from "@/data/world/real-world-provinces";

type Props = {
  armies: Army[];
  selectedArmyId: string | null;
  onSelectArmy: (id: string) => void;
  zoom?: number;
};

type Point = { x: number; y: number };

function positionForArmy(army: Army): Point | null {
  const province = REAL_WORLD_PROVINCES[army.provinceId];
  if (!province) return null;
  return { x: province.coordinates.x, y: province.coordinates.y };
}

function shortNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return Math.round(value).toString();
}

export function ArmyLayer({ armies, selectedArmyId, onSelectArmy, zoom = 1 }: Props) {
  const active = armies.filter((army) => army.status !== "destroyed");
  if (zoom < 1.15) return <g className="army-layer" />;
  const stackCounts = new Map<string, number>();
  return (
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
            <path className="army-marker-chevron" d="M-.85-.35 L0 .45 L.85-.35" />
            {zoom >= 1.45 && <text className="army-marker-strength" x="3.35" y=".65">{shortNumber(army.strength)}</text>}
            {zoom >= 1.75 && <text className="army-marker-name" x="0" y="5.1">{army.name.toUpperCase().slice(0, 16)}</text>}
          </g>
        );
      })}
    </g>
  );
}
