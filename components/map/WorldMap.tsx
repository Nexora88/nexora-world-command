"use client";

import { useEffect, useRef, useState } from "react";

export type MapMode =
  | "political"
  | "population"
  | "economy"
  | "resources"
  | "military"
  | "weather"
  | "terrain"
  | "frontline";

type Props = {
  playerCountryId?: string;
  selectedCountryId?: string | null;
  onCountrySelect?: (iso2: string) => void;
  mapMode?: MapMode;
  onMapModeChange?: (mode: MapMode) => void;
  showLabels?: boolean;
  showBorders?: boolean;
  className?: string;
};

// Modern ülke isimleri (ISO2 → Türkçe / oyun ismi)
const COUNTRY_NAMES: Record<string, string> = {
  TR: "TÜRKİYE",
  DE: "ALMANYA",
  FR: "FRANSA",
  GB: "BİRLEŞİK KRALLIK",
  RU: "RUSYA",
  US: "ABD",
  CN: "ÇİN",
  JP: "JAPONYA",
  IN: "HİNDİSTAN",
  BR: "BREZİLYA",
  IT: "İTALYA",
  ES: "İSPANYA",
  PL: "POLONYA",
  UA: "UKRAYNA",
  SA: "SUUDİ ARABİSTAN",
  IR: "İRAN",
  IQ: "IRAK",
  SY: "SURİYE",
  EG: "MISIR",
  GR: "YUNANİSTAN",
  BG: "BULGARİSTAN",
  RO: "ROMANYA",
  HU: "MACARİSTAN",
  AT: "AVUSTURYA",
  CH: "İSVİÇRE",
  NL: "HOLLANDA",
  BE: "BELÇİKA",
  SE: "İSVEÇ",
  NO: "NORVEÇ",
  FI: "FİNLANDİYA",
  DK: "DANİMARKA",
  PT: "PORTEKİZ",
  IE: "İRLANDA",
  CZ: "ÇEKYA",
  SK: "SLOVAKYA",
  RS: "SIRBİSTAN",
  HR: "HIRVATİSTAN",
  BA: "BOSNA",
  AL: "ARNAVUTLUK",
  MK: "KUZEY MAKEDONYA",
  GE: "GÜRCİSTAN",
  AM: "ERMENİSTAN",
  AZ: "AZERBAYCAN",
  KZ: "KAZAKİSTAN",
  UZ: "ÖZBEKİSTAN",
  AF: "AFGANİSTAN",
  PK: "PAKİSTAN",
  BD: "BANGLADEŞ",
  TH: "TAYLAND",
  VN: "VIETNAM",
  ID: "ENDONEZYA",
  MY: "MALEZYA",
  PH: "FİLİPİNLER",
  KR: "GÜNEY KORE",
  KP: "KUZEY KORE",
  AU: "AVUSTRALYA",
  NZ: "YENİ ZELANDA",
  ZA: "GÜNEY AFRİKA",
  NG: "NİJERYA",
  ET: "ETİYOPYA",
  KE: "KENYA",
  MA: "FAS",
  DZ: "CEZAYİR",
  TN: "TUNUS",
  LY: "LİBYA",
  SD: "SUDAN",
  MX: "MEKSİKA",
  AR: "ARJANTİN",
  CL: "ŞİLİ",
  CO: "KOLOMBİYA",
  PE: "PERU",
  VE: "VENEZUELA",
  CA: "KANADA",
};

// Oyun ülkeleri için özel renkler
const GAME_COLORS: Record<string, string> = {
  TR: "#c43c3c",
  DE: "#d5a84b",
  FR: "#557fc5",
  GB: "#8e5a4a",
  RU: "#6a7a8a",
  US: "#4a6a9a",
  CN: "#c05a4a",
  JP: "#e05a6a",
  IN: "#d4a04a",
  BR: "#5a9a5a",
  IT: "#4f9a79",
  ES: "#c99a4a",
  PL: "#d4a84b",
  UA: "#9a8a5a",
  SA: "#8a9a4a",
  IR: "#9a7a4a",
  EG: "#c9a04a",
};

const DEFAULT_FILL = "#3a4a42";
const OCEAN = "#08100f";

export function WorldMap({
  playerCountryId = "TR",
  selectedCountryId = null,
  onCountrySelect,
  mapMode = "political",
  onMapModeChange,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;

    fetch("/map/world-simple.svg")
      .then((r) => {
        if (!r.ok) throw new Error("SVG yüklenemedi");
        return r.text();
      })
      .then((svgText) => {
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = svgText;
        const svg = containerRef.current.querySelector("svg");
        if (!svg) return;

        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.style.display = "block";
        svg.style.background = OCEAN;

        // Tüm path'leri stilize et
        const paths = svg.querySelectorAll("path[id]");
        paths.forEach((path) => {
          const rawId = (path.getAttribute("id") || "").toLowerCase();
          const iso = rawId.toUpperCase();
          const isPlayer = iso === playerCountryId.toUpperCase();
          const isSelected = selectedCountryId && iso === selectedCountryId.toUpperCase();

          let fill = GAME_COLORS[iso] || DEFAULT_FILL;
          if (isPlayer) fill = "#c9a84c";
          if (isSelected) fill = "#e8c96a";

          path.setAttribute("fill", fill);
          path.setAttribute("stroke", isPlayer || isSelected ? "#f0e0a0" : "#1a2822");
          path.setAttribute("stroke-width", isPlayer || isSelected ? "1.4" : "0.35");
          path.style.cursor = "pointer";
          path.style.transition = "fill 0.12s ease, stroke 0.12s ease";

          // Hover
          path.addEventListener("mouseenter", () => {
            setHovered(iso);
            if (!isPlayer && !isSelected) {
              path.setAttribute("fill", lighten(fill, 28));
            }
          });
          path.addEventListener("mouseleave", () => {
            setHovered(null);
            path.setAttribute("fill", fill);
          });

          // Tıklama
          path.addEventListener("click", (e) => {
            e.stopPropagation();
            onCountrySelect?.(iso);
          });

          // Tooltip için title
          const name = COUNTRY_NAMES[iso] || iso;
          path.innerHTML = `<title>${name}</title>`;
        });

        setReady(true);
      })
      .catch((err) => {
        console.error("Harita yüklenemedi:", err);
        setReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, [playerCountryId, selectedCountryId, onCountrySelect]);

  const modes: Array<[MapMode, string]> = [
    ["political", "SİYASİ"],
    ["terrain", "ARAZİ"],
    ["economy", "EKONOMİ"],
    ["resources", "KAYNAK"],
    ["military", "ASKERİ"],
    ["weather", "HAVA"],
  ];

  return (
    <div
      className={`world-map real-world-map ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: OCEAN,
        overflow: "hidden",
      }}
    >
      {/* SVG konteyner */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Yükleniyor */}
      {!ready && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "#5a6e66",
            fontSize: 12,
            letterSpacing: 1.5,
          }}
        >
          DÜNYA HARİTASI YÜKLENİYOR...
        </div>
      )}

      {/* Mod çubuğu */}
      <div
        className="strategic-map-toolbar"
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          display: "flex",
          gap: 4,
          zIndex: 20,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 9,
            color: "#6a8a78",
            letterSpacing: 1.2,
            alignSelf: "center",
            marginRight: 6,
          }}
        >
          STRATEJİK HARİTA
        </span>
        {modes.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onMapModeChange?.(id)}
            style={{
              height: 28,
              padding: "0 10px",
              fontSize: 9,
              letterSpacing: 0.8,
              border: "1px solid",
              borderColor: mapMode === id ? "#6bc984" : "#2a3d34",
              background: mapMode === id ? "#1a3a28" : "#0f1814",
              color: mapMode === id ? "#b4e6c4" : "#7a9486",
              cursor: "pointer",
              borderRadius: 3,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Hover bilgi */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            background: "#0f1814ee",
            border: "1px solid #2a3d34",
            padding: "6px 12px",
            borderRadius: 4,
            fontSize: 12,
            color: "#e8f0ea",
            letterSpacing: 0.8,
            zIndex: 20,
          }}
        >
          {COUNTRY_NAMES[hovered] || hovered}
        </div>
      )}

      {/* Ölçek */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          fontSize: 9,
          color: "#5a6e66",
          letterSpacing: 1.2,
          zIndex: 20,
        }}
      >
        DÜNYA TİYATROSU · MODERN
      </div>
    </div>
  );
}

function lighten(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  if (isNaN(num)) return hex;
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
