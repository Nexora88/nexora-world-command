"use client";

import { useMemo, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Basitleştirilmiş Avrupa + Türkiye + Orta Doğu siyasi haritası
   Görsel 2 (EU tarzı renkli eyalet/ülke blokları) görünümüne yakın
   ───────────────────────────────────────────────────────────── */

export type CountryId =
  | "TR" | "GR" | "BG" | "RO" | "RS" | "AL" | "MK" | "BA" | "HR" | "SI"
  | "HU" | "SK" | "CZ" | "PL" | "DE" | "AT" | "CH" | "IT" | "FR" | "ES"
  | "PT" | "GB" | "IE" | "NL" | "BE" | "LU" | "DK" | "NO" | "SE" | "FI"
  | "EE" | "LV" | "LT" | "BY" | "UA" | "MD" | "RU" | "GE" | "AM" | "AZ"
  | "IR" | "IQ" | "SY" | "LB" | "JO" | "IL" | "SA" | "EG" | "LY" | "TN"
  | "DZ" | "MA" | "CY";

interface CountryShape {
  id: CountryId;
  name: string;          // harita üzerindeki etiket
  displayName: string;   // Türkçe / oyun içi isim
  color: string;
  path: string;          // SVG path (viewBox 0 0 1000 600)
  labelX: number;
  labelY: number;
  labelSize?: number;
}

const COUNTRIES: CountryShape[] = [
  // ── Türkiye (kırmızı, merkez) ──
  {
    id: "TR",
    name: "OSMANLI İMPARATORLUĞU",
    displayName: "TÜRKİYE",
    color: "#c43c3c",
    path: "M620,310 L680,300 L720,320 L740,350 L730,380 L700,400 L660,410 L630,400 L600,380 L590,350 L600,320 Z",
    labelX: 660, labelY: 360, labelSize: 11,
  },
  // ── Yunanistan ──
  {
    id: "GR",
    name: "YUNANİSTAN",
    displayName: "YUNANİSTAN",
    color: "#4a7c9b",
    path: "M580,360 L610,350 L620,380 L610,410 L580,420 L560,400 L570,370 Z",
    labelX: 590, labelY: 390, labelSize: 8,
  },
  // ── Bulgaristan ──
  {
    id: "BG",
    name: "BULGARİSTAN",
    displayName: "BULGARİSTAN",
    color: "#6b8f5e",
    path: "M590,300 L630,295 L640,320 L620,340 L590,335 Z",
    labelX: 610, labelY: 318, labelSize: 7,
  },
  // ── Romanya ──
  {
    id: "RO",
    name: "EFLAK",
    displayName: "ROMANYA",
    color: "#b85c4a",
    path: "M600,260 L650,250 L670,280 L650,310 L600,300 Z",
    labelX: 630, labelY: 280, labelSize: 9,
  },
  // ── Sırbistan ──
  {
    id: "RS",
    name: "SIRBİSTAN",
    displayName: "SIRBİSTAN",
    color: "#8a6b4a",
    path: "M560,300 L590,295 L595,330 L570,340 L550,320 Z",
    labelX: 570, labelY: 318, labelSize: 7,
  },
  // ── Macaristan ──
  {
    id: "HU",
    name: "MACARİSTAN",
    displayName: "MACARİSTAN",
    color: "#c99a4a",
    path: "M540,250 L590,245 L600,280 L560,290 L530,270 Z",
    labelX: 560, labelY: 268, labelSize: 8,
  },
  // ── Polonya ──
  {
    id: "PL",
    name: "POLONYA",
    displayName: "POLONYA",
    color: "#d4a84b",
    path: "M520,180 L600,170 L620,220 L580,250 L510,240 Z",
    labelX: 560, labelY: 210, labelSize: 14,
  },
  // ── Almanya ──
  {
    id: "DE",
    name: "ALMANYA",
    displayName: "ALMANYA",
    color: "#c5a04a",
    path: "M460,180 L530,170 L540,230 L500,250 L450,230 Z",
    labelX: 490, labelY: 210, labelSize: 11,
  },
  // ── Avusturya ──
  {
    id: "AT",
    name: "AVUSTURYA",
    displayName: "AVUSTURYA",
    color: "#b85b68",
    path: "M510,250 L550,245 L555,270 L520,280 L505,265 Z",
    labelX: 525, labelY: 262, labelSize: 7,
  },
  // ── İtalya ──
  {
    id: "IT",
    name: "İTALYA",
    displayName: "İTALYA",
    color: "#4f9a79",
    path: "M480,300 L520,290 L540,340 L530,400 L500,420 L480,380 L470,340 Z",
    labelX: 505, labelY: 350, labelSize: 10,
  },
  // ── Fransa ──
  {
    id: "FR",
    name: "FRANSA",
    displayName: "FRANSA",
    color: "#557fc5",
    path: "M380,220 L460,210 L470,280 L440,320 L380,300 L360,250 Z",
    labelX: 415, labelY: 260, labelSize: 12,
  },
  // ── İspanya ──
  {
    id: "ES",
    name: "İSPANYA",
    displayName: "İSPANYA",
    color: "#c99a4a",
    path: "M300,300 L380,290 L390,360 L350,400 L290,380 L280,330 Z",
    labelX: 335, labelY: 345, labelSize: 11,
  },
  // ── Portekiz ──
  {
    id: "PT",
    name: "PORTEKİZ",
    displayName: "PORTEKİZ",
    color: "#6b8f5e",
    path: "M280,320 L310,315 L315,370 L290,380 L275,350 Z",
    labelX: 290, labelY: 348, labelSize: 7,
  },
  // ── İngiltere ──
  {
    id: "GB",
    name: "İNGİLTERE",
    displayName: "İNGİLTERE",
    color: "#8e5a4a",
    path: "M360,160 L410,150 L420,200 L390,220 L350,200 Z",
    labelX: 380, labelY: 185, labelSize: 9,
  },
  // ── İrlanda ──
  {
    id: "IE",
    name: "İRLANDA",
    displayName: "İRLANDA",
    color: "#5a8a5e",
    path: "M330,170 L355,165 L360,195 L340,200 L325,185 Z",
    labelX: 340, labelY: 182, labelSize: 7,
  },
  // ── Hollanda / Belçika ──
  {
    id: "NL",
    name: "HOLLANDA",
    displayName: "HOLLANDA",
    color: "#d27b4b",
    path: "M440,195 L470,190 L475,215 L450,220 Z",
    labelX: 455, labelY: 205, labelSize: 6,
  },
  {
    id: "BE",
    name: "BELÇİKA",
    displayName: "BELÇİKA",
    color: "#8e73b8",
    path: "M430,215 L460,210 L465,230 L435,235 Z",
    labelX: 445, labelY: 222, labelSize: 6,
  },
  // ── İskandinavya ──
  {
    id: "NO",
    name: "NORVEÇ",
    displayName: "NORVEÇ",
    color: "#5a7a8a",
    path: "M480,40 L540,30 L550,120 L500,140 L470,100 Z",
    labelX: 505, labelY: 80, labelSize: 9,
  },
  {
    id: "SE",
    name: "İSVEÇ",
    displayName: "İSVEÇ",
    color: "#6a8a9a",
    path: "M540,50 L590,40 L600,150 L560,160 L540,100 Z",
    labelX: 565, labelY: 100, labelSize: 9,
  },
  {
    id: "FI",
    name: "FİNLANDİYA",
    displayName: "FİNLANDİYA",
    color: "#7a9aaa",
    path: "M600,60 L650,50 L660,130 L620,140 L600,100 Z",
    labelX: 625, labelY: 95, labelSize: 8,
  },
  {
    id: "DK",
    name: "DANİMARKA",
    displayName: "DANİMARKA",
    color: "#c05a4a",
    path: "M480,160 L510,155 L515,180 L490,185 Z",
    labelX: 495, labelY: 170, labelSize: 6,
  },
  // ── Baltık ──
  {
    id: "EE",
    name: "ESTONYA",
    displayName: "ESTONYA",
    color: "#6a8a7a",
    path: "M600,140 L640,135 L645,160 L605,165 Z",
    labelX: 620, labelY: 150, labelSize: 6,
  },
  {
    id: "LV",
    name: "LETONYA",
    displayName: "LETONYA",
    color: "#7a7a9a",
    path: "M600,165 L645,160 L650,190 L605,195 Z",
    labelX: 620, labelY: 178, labelSize: 6,
  },
  {
    id: "LT",
    name: "LİTVANYA",
    displayName: "LİTVANYA",
    color: "#8a8a6a",
    path: "M590,195 L640,190 L645,220 L595,225 Z",
    labelX: 615, labelY: 208, labelSize: 6,
  },
  // ── Doğu ──
  {
    id: "BY",
    name: "BELARUS",
    displayName: "BELARUS",
    color: "#8a7a6a",
    path: "M620,180 L680,170 L700,220 L650,240 L610,220 Z",
    labelX: 650, labelY: 205, labelSize: 8,
  },
  {
    id: "UA",
    name: "UKRAYNA",
    displayName: "UKRAYNA",
    color: "#9a8a5a",
    path: "M650,230 L740,220 L760,280 L700,310 L640,290 Z",
    labelX: 700, labelY: 265, labelSize: 10,
  },
  {
    id: "RU",
    name: "MOSKOVA KNEZLİĞİ",
    displayName: "RUSYA",
    color: "#6a7a8a",
    path: "M700,80 L900,60 L920,250 L800,280 L700,200 Z",
    labelX: 800, labelY: 150, labelSize: 11,
  },
  // ── Kafkas & Orta Doğu ──
  {
    id: "GE",
    name: "GÜRCİSTAN",
    displayName: "GÜRCİSTAN",
    color: "#8a6a5a",
    path: "M740,300 L780,295 L785,320 L750,325 Z",
    labelX: 760, labelY: 312, labelSize: 6,
  },
  {
    id: "IR",
    name: "İRAN",
    displayName: "İRAN",
    color: "#9a7a4a",
    path: "M780,340 L880,330 L900,400 L820,420 L780,380 Z",
    labelX: 830, labelY: 370, labelSize: 10,
  },
  {
    id: "IQ",
    name: "IRAK",
    displayName: "IRAK",
    color: "#8a6a4a",
    path: "M720,360 L780,350 L790,400 L740,410 L710,390 Z",
    labelX: 745, labelY: 380, labelSize: 8,
  },
  {
    id: "SY",
    name: "SURİYE",
    displayName: "SURİYE",
    color: "#7a6a5a",
    path: "M680,360 L720,355 L730,390 L690,395 Z",
    labelX: 700, labelY: 375, labelSize: 7,
  },
  {
    id: "EG",
    name: "MISIR",
    displayName: "MISIR",
    color: "#c9a04a",
    path: "M620,420 L680,410 L700,480 L640,500 L600,460 Z",
    labelX: 645, labelY: 455, labelSize: 9,
  },
  // ── Kuzey Afrika ──
  {
    id: "LY",
    name: "LİBYA",
    displayName: "LİBYA",
    color: "#a08a5a",
    path: "M500,430 L600,420 L620,500 L520,510 Z",
    labelX: 555, labelY: 470, labelSize: 9,
  },
  {
    id: "TN",
    name: "TUNUS",
    displayName: "TUNUS",
    color: "#8a7a5a",
    path: "M470,380 L510,375 L520,420 L480,430 Z",
    labelX: 490, labelY: 402, labelSize: 7,
  },
  {
    id: "DZ",
    name: "CEZAYİR",
    displayName: "CEZAYİR",
    color: "#7a8a5a",
    path: "M380,380 L470,370 L490,450 L400,470 L360,420 Z",
    labelX: 420, labelY: 420, labelSize: 9,
  },
  {
    id: "MA",
    name: "FAS",
    displayName: "FAS",
    color: "#6a7a5a",
    path: "M300,380 L370,370 L380,440 L320,460 L290,420 Z",
    labelX: 335, labelY: 415, labelSize: 8,
  },
];

type Props = {
  playerCountryId?: string;
  selectedId?: string | null;
  onSelect?: (id: CountryId) => void;
  className?: string;
};

export function PoliticalMap({
  playerCountryId = "TR",
  selectedId = null,
  onSelect,
  className = "",
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const countries = useMemo(() => COUNTRIES, []);

  return (
    <div
      className={`political-map ${className}`}
      style={{
        width: "100%",
        height: "100%",
        background: "#0a1210",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {/* Okyanus / arka plan */}
        <rect width="1000" height="600" fill="#0a1210" />

        {/* Hafif grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#142018" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="1000" height="600" fill="url(#grid)" opacity="0.4" />

        {/* Ülkeler */}
        {countries.map((c) => {
          const isPlayer = c.id === playerCountryId;
          const isSelected = c.id === selectedId;
          const isHovered = c.id === hovered;

          let fill = c.color;
          if (isPlayer) fill = "#c9a84c";
          if (isSelected) fill = "#e8c96a";
          if (isHovered && !isPlayer && !isSelected) fill = lighten(c.color, 25);

          return (
            <g key={c.id}>
              <path
                d={c.path}
                fill={fill}
                stroke={isPlayer || isSelected ? "#f0e0a0" : "#1a2820"}
                strokeWidth={isPlayer || isSelected ? 2.2 : 0.8}
                style={{ cursor: "pointer", transition: "fill 0.15s" }}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect?.(c.id)}
              >
                <title>{c.displayName}</title>
              </path>

              {/* Etiket */}
              <text
                x={c.labelX}
                y={c.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isPlayer || isSelected ? "#1a1408" : "#e8f0ea"}
                fontSize={c.labelSize ?? 9}
                fontWeight="700"
                letterSpacing="0.6"
                style={{
                  pointerEvents: "none",
                  textShadow: isPlayer || isSelected
                    ? "none"
                    : "0 1px 2px #000, 0 0 4px #000",
                  fontFamily: "system-ui, Arial, sans-serif",
                }}
              >
                {c.name}
              </text>
            </g>
          );
        })}

        {/* Deniz isimleri (opsiyonel) */}
        <text x="450" y="340" textAnchor="middle" fill="#2a3a32" fontSize="10" letterSpacing="2">
          AKDENİZ
        </text>
        <text x="550" y="480" textAnchor="middle" fill="#2a3a32" fontSize="9" letterSpacing="1.5">
          AFRİKA
        </text>
      </svg>

      {/* Alt bilgi çubuğu */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 12,
          fontSize: 10,
          color: "#5a6e66",
          letterSpacing: 1.2,
        }}
      >
        SİYASİ HARİTA · AVRUPA & ORTADOĞU
      </div>
    </div>
  );
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  if (isNaN(num)) return hex;
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
    }
