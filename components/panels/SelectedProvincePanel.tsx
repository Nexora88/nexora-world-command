"use client";

import { Factory, Shield, Home, Building2, Crosshair } from "lucide-react";
import type { Province } from "@/lib/types";
import type { Nation } from "@/data/world/countries";
import type { Army } from "@/game/movement/server/types";
import { FlagImage } from "@/components/ui/FlagImage";
import type { BuildingType } from "@/data/economy/buildings";

const fmt = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : Math.round(n).toString();

type Props = {
  province: Province | null;
  country?: Nation | null;
  army?: Army | null;
  provinceArmies?: Army[];
  canCreateArmy?: boolean;
  onCreateArmy?: () => void;
  incomePerHour?: number;
  onUpgrade?: (type: BuildingType) => void;
  onClose?: () => void;
};

export function SelectedProvincePanel({
  province,
  country,
  army,
  provinceArmies = [],
  canCreateArmy = false,
  onCreateArmy,
  incomePerHour = 0,
  onUpgrade,
  onClose,
}: Props) {
  if (!province) {
    return (
      <aside className="selected-eyalet">
        <div className="eyalet-header">
          <span className="eyalet-title">SEÇİLİ EYALET</span>
        </div>
        <div className="empty-selection">Haritadan bir ülke veya eyalet seçin</div>
      </aside>
    );
  }

  const buildings = province.buildings ?? {
    industrialComplex: province.industryLevel ?? 0,
    barracks: province.barracksLevel ?? 0,
    fortification: province.fortificationLevel ?? 0,
  };

  const industryLvl = buildings.industrialComplex ?? 0;
  const barracksLvl = buildings.barracks ?? 0;
  const fortLvl = buildings.fortification ?? 0;
  const morale = 70 + Math.min(25, Math.floor((province.population || 0) / 500000));
  const ownerName = country?.displayName ?? country?.name ?? province.ownerId ?? "—";
  const isCapital = country?.capitalProvinceId === province.id;

  return (
    <aside className="selected-eyalet">
      <div className="eyalet-header">
        <span className="eyalet-title">SEÇİLİ EYALET</span>
        {onClose && (
          <button type="button" className="eyalet-close" onClick={onClose}>
            ×
          </button>
        )}
      </div>

      <div className="eyalet-identity">
        <FlagImage
          countryId={country?.id ?? province.ownerId}
          className="eyalet-flag"
          alt={ownerName}
        />
        <div>
          <h2>{(province.name || province.id).toUpperCase()}</h2>
          <small>
            {ownerName}
            {isCapital ? " · BAŞKENT" : ""}
          </small>
        </div>
      </div>

      <div className="eyalet-stats">
        <div>
          <small>NÜFUS</small>
          <b>{fmt(province.population)}</b>
        </div>
        <div>
          <small>MORAL</small>
          <b>%{morale}</b>
        </div>
        <div>
          <small>GELİR</small>
          <b className="positive">
            +{fmt(incomePerHour || Math.max(1, industryLvl) * 320)} /h
          </b>
        </div>
      </div>

      <div className="eyalet-section">
        <div className="section-label">ALTYAPI</div>

        <div className="infra-row">
          <div className="infra-icon"><Factory size={14} /></div>
          <div className="infra-info">
            <span>Sanayi Kompleksi</span>
            <b>Seviye {industryLvl}</b>
          </div>
          {onUpgrade && industryLvl < 5 && (
            <button type="button" className="infra-upgrade" onClick={() => onUpgrade("industrialComplex")}>+</button>
          )}
        </div>

        <div className="infra-row">
          <div className="infra-icon"><Home size={14} /></div>
          <div className="infra-info">
            <span>Kışla</span>
            <b>Seviye {barracksLvl}</b>
          </div>
          {onUpgrade && barracksLvl < 5 && (
            <button type="button" className="infra-upgrade" onClick={() => onUpgrade("barracks")}>+</button>
          )}
        </div>

        <div className="infra-row">
          <div className="infra-icon"><Shield size={14} /></div>
          <div className="infra-info">
            <span>Tahkimat</span>
            <b>Seviye {fortLvl}</b>
          </div>
          {onUpgrade && fortLvl < 5 && (
            <button type="button" className="infra-upgrade" onClick={() => onUpgrade("fortification")}>+</button>
          )}
        </div>
      </div>

      <div className="eyalet-actions">
        <button
          type="button"
          className="eyalet-btn primary"
          disabled={!onUpgrade || industryLvl >= 5}
          onClick={() => onUpgrade?.("industrialComplex")}
        >
          <Building2 size={14} />
          YENİ SANAYİ KOMPLEKSİ
        </button>
        <button
          type="button"
          className="eyalet-btn"
          disabled={!onUpgrade || barracksLvl >= 5}
          onClick={() => onUpgrade?.("barracks")}
        >
          <Shield size={14} />
          YENİ KIŞLA
        </button>
      </div>

      <div className="eyalet-section army-section">
        <div className="section-label">SAHA KOMUTANLIĞI</div>
        {canCreateArmy && onCreateArmy && (
          <button type="button" className="eyalet-btn primary army-create-btn" onClick={onCreateArmy}>
            <Crosshair size={14} />
            SEÇİLİ EYALETTE ORDU KUR
          </button>
        )}
        {provinceArmies.length > 0 && (
          <div className="province-army-list">
            {provinceArmies.map((item) => (
              <button type="button" className={`province-army-row ${army?.id === item.id ? "selected" : ""}`} key={item.id}>
                <span className="army-mini-badge">▣</span>
                <span><b>{item.name}</b><small>{item.infantry.toLocaleString()} INF · {item.tanks} ARM</small></span>
                <strong>{item.strength.toLocaleString()}</strong>
              </button>
            ))}
          </div>
        )}
        {army ? (
          <div className="selected-army-card">
            <div className="army-name-row">
              <Crosshair size={14} />
              <b>{army.name}</b>
            </div>
            <div className="army-bars">
              <div>
                <span>GÜÇ</span>
                <b>{fmt(army.strength)}</b>
              </div>
              <div>
                <span>MORAL</span>
                <b>%{army.morale}</b>
              </div>
              <div>
                <span>YAKIT</span>
                <b>%{army.organization ?? 60}</b>
              </div>
            </div>
            <div className="army-meta">
              <span>KONUM · {army.provinceId}</span>
              <span>{army.status === "moving" ? "HAREKET HALİNDE" : "HAZIR"}</span>
            </div>
          </div>
        ) : (
          <div className="empty-selection small">{canCreateArmy ? "Üretimi tamamlanan birlikleri burada saha ordusuna dönüştürün." : "Bu eyalette seçili bir ordu yok."}</div>
        )}
      </div>
    </aside>
  );
                                                    }
