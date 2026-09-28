"use client";

import { useEffect, useRef, useState } from "react";
import type { Province } from "@/lib/types";
import type { Army } from "@/game/movement/server/types";

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
  // GameScreen'in gönderdiği props (uyumluluk için hepsi var)
  provinces?: Province[];
  armies?: Army[];
  selectedId?: string | null;
  selectedArmyId?: string | null;
  onSelect?: (id: string) => void;
  onSelectArmy?: (id: string) => void;
  onCountrySelect?: (iso2: string) => void;
  mapMode?: MapMode;
  onMapModeChange?: (mode: MapMode) => void;
  playerCountryId?: string;
  selectedCountryId?: string | null;
  showLabels?: boolean;
  showBorders?: boolean;
  className?: string;
};

// ────────────────────────────────────────────────
// Modern ülke isimleri (ISO 3166-1 alpha-2)
// ────────────────────────────────────────────────
const COUNTRY_NAMES: Record<string, string> = {
  AF: "AFGANİSTAN", AL: "ARNAVUTLUK", DZ: "CEZAYİR", AD: "ANDORRA", AO: "ANGOLA",
  AG: "ANTİGUA VE BARBUDA", AR: "ARJANTİN", AM: "ERMENİSTAN", AU: "AVUSTRALYA",
  AT: "AVUSTURYA", AZ: "AZERBAYCAN", BS: "BAHAMALAR", BH: "BAHREYN", BD: "BANGLADEŞ",
  BB: "BARBADOS", BY: "BELARUS", BE: "BELÇİKA", BZ: "BELİZE", BJ: "BENİN",
  BT: "BUTAN", BO: "BOLİVYA", BA: "BOSNA HERSEK", BW: "BOTSVANA", BR: "BREZİLYA",
  BN: "BRUNEİ", BG: "BULGARİSTAN", BF: "BURKİNA FASO", BI: "BURUNDİ", CV: "CAPE VERDE",
  KH: "KAMBOÇYA", CM: "KAMERUN", CA: "KANADA", CF: "ORTA AFRİKA CUMHURİYETİ",
  TD: "ÇAD", CL: "ŞİLİ", CN: "ÇİN", CO: "KOLOMBİYA", KM: "KOMORLAR",
  CG: "KONGO", CD: "KONGO DC", CR: "KOSTA RİKA", CI: "FİLDİŞİ SAHİLİ", HR: "HIRVATİSTAN",
  CU: "KUBA", CY: "KIBRIS", CZ: "ÇEKYA", DK: "DANİMARKA", DJ: "CİBUTİ",
  DM: "DOMİNİKA", DO: "DOMİNİK CUMHURİYETİ", EC: "EKVADOR", EG: "MISIR", SV: "EL SALVADOR",
  GQ: "EKVATOR GİNESİ", ER: "ERİTRE", EE: "ESTONYA", SZ: "ESVATİNİ", ET: "ETİYOPYA",
  FJ: "FİJİ", FI: "FİNLANDİYA", FR: "FRANSA", GA: "GABON", GM: "GAMBİYA",
  GE: "GÜRCİSTAN", DE: "ALMANYA", GH: "GANA", GR: "YUNANİSTAN", GD: "GRENADA",
  GT: "GUATEMALA", GN: "GİNE", GW: "GİNE-BİSSAU", GY: "GUYANA", HT: "HAİTİ",
  HN: "HONDURAS", HU: "MACARİSTAN", IS: "İZLANDA", IN: "HİNDİSTAN", ID: "ENDONEZYA",
  IR: "İRAN", IQ: "IRAK", IE: "İRLANDA", IL: "İSRAİL", IT: "İTALYA",
  JM: "JAMAİKA", JP: "JAPONYA", JO: "ÜRDÜN", KZ: "KAZAKİSTAN", KE: "KENYA",
  KI: "KİRİBATİ", KP: "KUZEY KORE", KR: "GÜNEY KORE", KW: "KUVEYT", KG: "KIRGIZİSTAN",
  LA: "LAOS", LV: "LETONYA", LB: "LÜBNAN", LS: "LESOTHO", LR: "LİBERYA",
  LY: "LİBYA", LI: "LİHTENŞTAYN", LT: "LİTVANYA", LU: "LÜKSEMBURG", MG: "MADAGASKAR",
  MW: "MALAVİ", MY: "MALEZYA", MV: "MALDİVLER", ML: "MALİ", MT: "MALTA",
  MH: "MARSHALL ADALARI", MR: "MORİTANYA", MU: "MAURİTİUS", MX: "MEKSİKA",
  FM: "MİKRONEZYA", MD: "MOLDOVA", MC: "MONAKO", MN: "MOĞOLİSTAN", ME: "KARADAĞ",
  MA: "FAS", MZ: "MOZAMBİK", MM: "MYANMAR", NA: "NAMİBYA", NR: "NAURU",
  NP: "NEPAL", NL: "HOLLANDA", NZ: "YENİ ZELANDA", NI: "NİKARAGUA", NE: "NİJER",
  NG: "NİJERYA", MK: "KUZEY MAKEDONYA", NO: "NORVEÇ", OM: "UMMAN", PK: "PAKİSTAN",
  PW: "PALAU", PA: "PANAMA", PG: "PAPUA YENİ GİNE", PY: "PARAGUAY", PE: "PERU",
  PH: "FİLİPİNLER", PL: "POLONYA", PT: "PORTEKİZ", QA: "KATAR", RO: "ROMANYA",
  RU: "RUSYA", RW: "RUANDA", KN: "SAINT KITTS VE NEVİS", LC: "SAINT LUCIA",
  VC: "SAINT VINCENT", WS: "SAMOA", SM: "SAN MARİNO", ST: "SAO TOME VE PRİNCİPE",
  SA: "SUUDİ ARABİSTAN", SN: "SENEGAL", RS: "SIRBİSTAN", SC: "SEYŞELLER",
  SL: "SİERRA LEONE", SG: "SİNGAPUR", SK: "SLOVAKYA", SI: "SLOVENYA", SB: "SOLOMON ADALARI",
  SO: "SOMALİ", ZA: "GÜNEY AFRİKA", SS: "GÜNEY SUDAN", ES: "İSPANYA", LK: "SRİ LANKA",
  SD: "SUDAN", SR: "SURİNAM", SE: "İSVEÇ", CH: "İSVİÇRE", SY: "SURİYE",
  TW: "TAYVAN", TJ: "TACİKİSTAN", TZ: "TANZANYA", TH: "TAYLAND", TL: "DOĞU TİMOR",
  TG: "TOGO", TO: "TONGA", TT: "TRİNİDAD VE TOBAGO", TN: "TUNUS", TR: "TÜRKİYE",
  TM: "TÜRKMENİSTAN", TV: "TUVALU", UG: "UGANDA", UA: "UKRAYNA", AE: "BİRLEŞİK ARAP EMİRLİKLERİ",
  GB: "BİRLEŞİK KRALLIK", US: "ABD", UY: "URUGUAY", UZ: "ÖZBEKİSTAN", VU: "VANUATU",
  VA: "VATİKAN", VE: "VENEZUELA", VN: "VİETNAM", YE: "YEMEN", ZM: "ZAMBİYA",
  ZW: "ZİMBABVE", XK: "KOSOVA", PS: "FİLİSTİN",
};

// Oyun odaklı renkler
const GAME_COLORS: Record<string, string> = {
  TR: "#c43c3c", DE: "#d5a84b", FR: "#557fc5", GB: "#8e5a4a", RU: "#6a7a8a",
  US: "#4a6a9a", CN: "#c05a4a", JP: "#e05a6a", IN: "#d4a04a", BR: "#5a9a5a",
  IT: "#4f9a79", ES: "#c99a4a", PL: "#d4a84b", UA: "#9a8a5a", SA: "#8a9a4a",
  IR: "#9a7a4a", EG: "#c9a04a", GR: "#4a7c9b", RO: "#b85c4a", HU: "#c99a4a",
  AT: "#b85b68", NL: "#d27b4b", BE: "#8e73b8", SE: "#6a8a9a", NO: "#5a7a8a",
  FI: "#7a9aaa", DK: "#c05a4a", PT: "#6b8f5e", IE: "#5a8a5e", CZ: "#8a7a6a",
  SK: "#7a8a6a", RS: "#8a6b4a", HR: "#6a8a7a", BA: "#7a7a6a", AL: "#6a7a8a",
  MK: "#7a6a8a", GE: "#8a6a5a", AM: "#9a6a5a", AZ: "#8a7a4a", KZ: "#8a8a5a",
  IQ: "#8a6a4a", SY: "#7a6a5a", LB: "#6a7a5a", JO: "#7a7a5a", IL: "#6a8a9a",
  SA: "#8a9a4a", AE: "#5a8a7a", KW: "#7a9a6a", QA: "#6a8a8a", BH: "#8a7a6a",
  OM: "#7a8a6a", YE: "#8a6a5a", PK: "#6a8a5a", AF: "#8a7a5a", BD: "#5a8a6a",
  TH: "#6a9a7a", VN: "#5a8a6a", ID: "#6a8a5a", MY: "#5a9a6a", PH: "#6a8a7a",
  KR: "#5a7a9a", KP: "#8a5a5a", AU: "#6a8a5a", NZ: "#5a8a7a", ZA: "#7a8a5a",
  NG: "#6a9a5a", ET: "#8a7a5a", KE: "#6a8a5a", MA: "#6a7a5a", DZ: "#7a8a5a",
  TN: "#8a7a5a", LY: "#a08a5a", SD: "#8a7a5a", MX: "#6a8a5a", AR: "#6a8a9a",
  CL: "#7a8a9a", CO: "#8a7a5a", PE: "#8a7a6a", VE: "#8a6a5a", CA: "#6a7a8a",
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

        const paths = svg.querySelectorAll("path[id]");
        paths.forEach((path) => {
          const rawId = (path.getAttribute("id") || "").toLowerCase();
          const iso = rawId.toUpperCase();
          const isPlayer = iso === (playerCountryId || "").toUpperCase();
          const isSelected = selectedCountryId && iso === selectedCountryId.toUpperCase();

          let fill = GAME_COLORS[iso] || DEFAULT_FILL;
          if (isPlayer) fill = "#c9a84c";
          if (isSelected) fill = "#e8c96a";

          path.setAttribute("fill", fill);
          path.setAttribute("stroke", isPlayer || isSelected ? "#f0e0a0" : "#1a2822");
          path.setAttribute("stroke-width", isPlayer || isSelected ? "1.4" : "0.35");
          path.style.cursor = "pointer";
          path.style.transition = "fill 0.12s ease, stroke 0.12s ease";

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

          path.addEventListener("click", (e) => {
            e.stopPropagation();
            onCountrySelect?.(iso);
          });

          const name = COUNTRY_NAMES[iso] || iso;
          // title ekle
          const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
          title.textContent = name;
          path.appendChild(title);
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
      className={`world-map real-world-map ${className || ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: OCEAN,
        overflow: "hidden",
      }}
    >
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

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
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          display: "flex",
          gap: 4,
          zIndex: 20,
          flexWrap: "wrap",
          maxWidth: "70%",
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
        DÜNYA TİYATROSU · {Object.keys(COUNTRY_NAMES).length}+ ÜLKE
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
