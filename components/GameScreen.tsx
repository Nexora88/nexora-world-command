"use client";

import { useEffect, useState } from "react";
import { BUILDINGS } from "@/data/economy/buildings";
import { CommandScreen, type CommandScreenId } from "@/components/command/CommandScreen";
import { getTerrainModifiers } from "@/game/world/terrain";
import { WorldNewspaper } from "@/components/player/WorldNewspaper";
import { CommandGazette } from "@/components/command/CommandGazette";
import { CommandSettings } from "@/components/command/CommandSettings";
import {
  Activity,
  Bell,
  Coins,
  Factory,
  Fuel,
  Menu,
  Shield,
  Users,
  Settings,
  Radio,
  BookOpen,
  Search,
  Landmark,
  Swords,
  Globe2,
  Newspaper,
  Route,
  MessageSquare,
  WifiOff,
} from "lucide-react";
import { WorldMap, type MapMode, type MapCommandMode } from "@/components/map/WorldMap";
import { SelectedProvincePanel } from "@/components/panels/SelectedProvincePanel";
import { EconomyPanel } from "@/components/panels/EconomyPanel";
import { ProductionPanel } from "@/components/panels/ProductionPanel";
import { ConstructionPanel } from "@/components/panels/ConstructionPanel";
import { ArmyPanel } from "@/components/panels/ArmyPanel";
import { WarPanel } from "@/components/panels/WarPanel";
import { LivingWorldPanel } from "@/components/panels/LivingWorldPanel";
import { useGameStore } from "@/lib/game-store";
import { nations } from "@/data/world/countries";
import { FlagImage } from "@/components/ui/FlagImage";
import { audioManager } from "@/lib/audio-manager";
import {
  getCommanderLevel,
  initialCommanderXp,
} from "@/data/progression/commander-levels";
import {
  getDistricts,
  getPopulation,
  getDevelopment,
  getResourcesMap,
} from "@/game/world/server/world-store";
import type { Province } from "@/lib/types";
import { realWorldProvincesAsGameData } from "@/data/world/real-world-provinces";

const blank: Province = {
  id: "",
  name: "",
  ownerId: "",
  countryId: "",
  population: 0,
  terrain: "plains",
  movementModifier: 1,
  defenseModifier: 1,
  visibilityModifier: 1,
  supplyModifier: 1,
  neighbors: [],
  industryLevel: 0,
  barracksLevel: 0,
  fortificationLevel: 0,
  infrastructureLevel: 0,
  buildings: { industrialComplex: 0, barracks: 0, fortification: 0 },
  coordinates: [0, 0],
  weather: "clear",
};

const fmt = (n: number) =>
  n >= 1e6
    ? `${(n / 1e6).toFixed(2)}M`
    : n >= 1e3
      ? `${Math.round(n / 1e3)}K`
      : Math.round(n).toString();

export function GameScreen() {
  const selectedId = useGameStore((s) => s.selectedProvinceId);
  const provinces = useGameStore((s) => s.provinces);
  const armies = useGameStore((s) => s.armies);
  const resources = useGameStore((s) => s.resources);
  const income = useGameStore((s) => s.income);
  const buildings = useGameStore((s) => s.provinceBuildings);
  const production = useGameStore((s) => s.productionQueue);
  const construction = useGameStore((s) => s.constructionQueue);
  const wars = useGameStore((s) => s.wars);

  const select = useGameStore((s) => s.selectProvince);
  const load = useGameStore((s) => s.loadServerState);
  const sync = useGameStore((s) => s.syncAll);
  const startC = useGameStore((s) => s.startConstruction);
  const startP = useGameStore((s) => s.startProduction);
  const moveArmy = useGameStore((s) => s.moveArmy);
  const declareWar = useGameStore((s) => s.declareWar);
  const createArmy = useGameStore((s) => s.createArmy);
  const mergeArmies = useGameStore((s) => s.mergeArmies);
  const splitArmy = useGameStore((s) => s.splitArmy);

  const [selectedArmyId, setSelectedArmyId] = useState<string | null>(null);
  const [clockNow, setClockNow] = useState(() => Date.now());
  const [gameClock, setGameClock] = useState({ day: 1, hour: 8, minute: 0, speed: 1, paused: false });
  const [mode, setMode] = useState<MapMode>("political");
  const [commandMode, setCommandMode] = useState<MapCommandMode>("select");
  const [tab, setTab] = useState("WORLD");
  const [filter, setFilter] = useState("");
  const [living, setLiving] = useState<any>({
    ai: [],
    events: [],
    alerts: [],
    climate: [],
  });
  const [commandScreen, setCommandScreen] = useState<CommandScreenId | null>(null);
  const [commander, setCommander] = useState("COMMANDER");
  const [commanderProfile, setCommanderProfile] = useState("default");
  const [playerCountryId, setPlayerCountryId] = useState("TR");
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("WORLD");
  const [showNewspaper, setShowNewspaper] = useState(false);
  const [mapLabels, setMapLabels] = useState(true);
  const [mapBorders, setMapBorders] = useState(true);
  const [uiEffects, setUiEffects] = useState(true);
  const [commandAudio, setCommandAudio] = useState(true);
  const [guestExpired, setGuestExpired] = useState(false);

  useEffect(() => {
    const sessionMode = localStorage.getItem("nwc-session-mode");
    if (sessionMode === "guest") {
      const raw = localStorage.getItem("nwc-guest-session");
      const guest = raw ? JSON.parse(raw) as {startedAt:number;maxDay:number} : {startedAt:Date.now(),maxDay:3};
      localStorage.setItem("nwc-guest-session", JSON.stringify(guest));
      setCommander("GUEST COMMANDER");
      setPlayerCountryId(localStorage.getItem("nwc-player-country") || "TR");
      useGameStore.setState({provinces:realWorldProvincesAsGameData,loading:false,error:null,resources:{money:5000,manpower:50000,oil:5000,steel:5000},income:{money:0,manpower:0,oil:0,steel:0}});
      const guestTick = () => {
        const elapsed = Date.now() - guest.startedAt;
        const day = Math.min(guest.maxDay + 1, 1 + Math.floor(elapsed / 60000));
        setGuestExpired(day > guest.maxDay);
        setClockNow(Date.now());
        setGameClock({day,hour:8,minute:Math.floor((elapsed / 1000) % 60),speed:1,paused:false});
      };
      guestTick();
      const g = setInterval(guestTick, 1000);
      return () => clearInterval(g);
    }
    void load();
    const saved = localStorage.getItem("nwc-commander-callsign");
    const nation = localStorage.getItem("nwc-player-country");
    const profile = localStorage.getItem("nwc-commander-profile");

    if (saved) setTimeout(() => setCommander(saved), 0);
    if (profile) setTimeout(() => setCommanderProfile(profile), 0);
    if (nation) setTimeout(() => setPlayerCountryId(nation), 0);

    audioManager.setEnabled(localStorage.getItem("nwc-command-audio") !== "0");

    if (nation && !localStorage.getItem("nwc-newspaper-seen")) {
      setTimeout(() => setShowNewspaper(true), 0);
    }

    const refreshWorldState = async () => {
      setClockNow(Date.now());
      await sync();
      try {
        const r = await fetch("/api/game/clock", { cache: "no-store" });
        if (r.ok) {
          const p = await r.json();
          if (p.clock) setGameClock(p.clock);
        }
      } catch {}
    };
    void refreshWorldState();
    const a = setInterval(() => { void refreshWorldState(); }, 2500);

    const b = setInterval(
      () =>
        fetch("/api/living-world", { cache: "no-store" })
          .then((r) => r.json())
          .then(setLiving)
          .catch(() => {}),
      3000
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCommandScreen(null);
        setCommandMode("select");
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearInterval(a);
      clearInterval(b);
      window.removeEventListener("keydown", onKey);
    };
  }, [load, sync]);

  const commanderLevel = getCommanderLevel(initialCommanderXp);
  const playerNation = nations.find((n) => n.id === playerCountryId) ?? nations[0];
  const selectedCountry = nations.find((n) => n.id === selectedCountryId) ?? null;
  const selectedCountryProvinces = selectedCountry
    ? provinces.filter((p) => p.ownerId === selectedCountry.id)
    : [];
  const base = provinces.find((p) => p.id === selectedId) ?? null;
  const selected = base
    ? { ...base, buildings: buildings[base.id] ?? base.buildings }
    : null;
  const terrainStats = selected
    ? getTerrainModifiers(selected.terrain)
    : getTerrainModifiers("plains");
  const selectedArmy = armies.find((a) => a.id === selectedArmyId);
  const unitStockpile = useGameStore((s) => s.unitStockpile);
  const provinceArmies = selected ? armies.filter((a) => a.provinceId === selected.id && a.status !== "destroyed") : [];
  const createSelectedArmy = async () => {
    if (!selected || selected.ownerId !== playerCountryId) return;
    const ok = await createArmy(selected.id, `${selected.name} Field Army`);
    if (ok) {
      const fresh = useGameStore.getState().armies.filter((a) => a.provinceId === selected.id);
      const newest = fresh[fresh.length - 1];
      if (newest) setSelectedArmyId(newest.id);
    }
  };
  const country = selected
    ? nations.find((n) => n.id === selected.ownerId)
    : nations[0];
  const pop = selected ? getPopulation(selected.id)[0] : undefined;
  const dev = selected ? getDevelopment(selected.id)[0] : undefined;
  const resMap = selected ? getResourcesMap(selected.id)[0] : undefined;
  const districts = selected ? getDistricts(selected.id) : [];
  const activeWar = wars.find((w) => w.status === "active");

  const visibleArmies = armies.filter((a) =>
    `${a.name} ${a.provinceId} ${a.status}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );
  const visibleProvinces = provinces.filter((p) =>
    `${p.name} ${p.ownerId} ${p.terrain}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const orderProvince = async (id: string) => {
    select(id);
    if (commandMode === "select" || !selectedArmyId || id === selectedArmy?.provinceId) return;
    const target = provinces.find((p) => p.id === id);
    if (!target) return;
    if (commandMode === "move" || commandMode === "defend") {
      if (target.ownerId !== playerCountryId) return;
      await moveArmy(selectedArmyId, id);
      setCommandMode("select");
      return;
    }
    if (commandMode === "attack") {
      if (target.ownerId === playerCountryId) return;
      const war = activeWar && activeWar.attacker === playerCountryId && activeWar.defender === target.ownerId
        ? activeWar
        : null;
      if (!war) return;
      await useGameStore.getState().attack(war.warId, selectedArmyId, id);
      setCommandMode("select");
    }
  };

  const alert = living.alerts?.[0];
  const selectedCountryPopulation = selectedCountryProvinces.reduce(
    (sum, p) => sum + p.population,
    0
  );
  const selectedCountryIncome = selectedCountryProvinces.reduce(
    (sum, p) => sum + Math.max(1, p.industryLevel) * 25,
    0
  );
  const selectedCountryCapital = selectedCountry
    ? provinces.find((p) => p.id === selectedCountry.capitalProvinceId)?.name ??
      selectedCountry.capitalProvinceId
    : "";

  const activeConstruction = construction.filter(
    (item) => item.kind === "construction"
  );
  const constructionLabel = (type: string) =>
    BUILDINGS[type as keyof typeof BUILDINGS]?.name ?? type.toUpperCase();

  const panel =
    tab === "ECONOMY" ? (
      <EconomyPanel resources={resources} income={income} />
    ) : tab === "MILITARY" ? (
      <ArmyPanel armies={visibleArmies} onMove={(id, p) => void moveArmy(id, p)} />
    ) : tab === "WAR" ? (
      <WarPanel
        wars={wars}
        battles={useGameStore.getState().battles}
        onDeclare={(d) => void declareWar(d)}
      />
    ) : tab === "AI WAR ROOM" ? (
      <LivingWorldPanel data={living} />
    ) : tab === "GAZETE" ? (
      <CommandGazette wars={wars} armies={armies} countryId={playerCountryId} />
    ) : tab === "SETTINGS" ? (
      <CommandSettings
        labels={mapLabels}
        borders={mapBorders}
        effects={uiEffects}
        sound={commandAudio}
        onLabels={setMapLabels}
        onBorders={setMapBorders}
        onEffects={setUiEffects}
        onSound={(v) => {
          setCommandAudio(v);
          audioManager.setEnabled(v);
          localStorage.setItem("nwc-command-audio", v ? "1" : "0");
        }}
        onReset={() => {
          setMapLabels(true);
          setMapBorders(true);
          setUiEffects(true);
          setCommandAudio(true);
        }}
      />
    ) : (
      <>
        <EconomyPanel resources={resources} income={income} />
        <ProductionPanel
          queue={production}
          provinceId={selected?.ownerId === playerCountryId ? selected.id : undefined}
          onProduce={(u) => selected?.ownerId === playerCountryId && startP(selected, u)}
        />
        <ConstructionPanel
          province={selected ?? provinces[0] ?? blank}
          queue={construction}
          onUpgrade={(t) => selected?.ownerId === playerCountryId && startC(selected, t)}
        />
      </>
    );

  return (
    <main className="aaa-command h-screen w-screen overflow-hidden relative">
      {guestExpired && (
        <div className="guest-expired-overlay">
          <div className="guest-expired-card">
            <WifiOff />
            <small>OFFLINE GUEST CAMPAIGN</small>
            <h1>3 OYUN GÜNÜ TAMAMLANDI</h1>
            <p>Misafir modu yalnızca sınırlı çevrimdışı deneme içindir. Dünyayı kaydetmek, çevrimiçi oynamak ve oyun tarihçeni korumak için ücretsiz bir hesapla devam edebilirsin.</p>
            <button type="button" onClick={() => { localStorage.removeItem("nwc-session-mode"); window.location.href="/"; }}>HESAP / GİRİŞE DÖN</button>
          </div>
        </div>
      )}
      {alert && (
        <div className={`aaa-alert ${alert.level}`}>
          <span>◆ {alert.title}</span>
          <b>{alert.message}</b>
          <button>DISMISS</button>
        </div>
      )}

      {/* TOP BAR */}
      <header className="aaa-top">
        <div className="aaa-logo">
          <strong>NEXORA</strong>
          <small>WORLD COMMAND</small>
        </div>

        <div className="commander-identity">
          <FlagImage
            countryId={playerCountryId}
            className="command-flag"
            alt={playerNation?.name ?? playerCountryId}
          />
          <div>
            <b>COMMANDER // {commander}</b>
            <span>
              {playerNation?.displayName ?? playerCountryId} ·{" "}
              {playerCountryId === "TR"
                ? "Ebedi Başkomutan"
                : commanderLevel.title}
            </span>
            <div className="level-strip">
              <i style={{ width: `${commanderLevel.progressToNext}%` }} />
              <b>LVL {commanderLevel.level}</b>
              <em>
                {commanderLevel.xp}/{commanderLevel.nextXp} XP
              </em>
            </div>
          </div>
        </div>

        <div className="top-resource">
          <span>
            <Coins /> MONEY
          </span>
          <b>{fmt(resources.money)}</b>
          <em>+{fmt(income.money)}/h</em>
        </div>
        <div className="top-resource">
          <span>
            <Users /> MANPOWER
          </span>
          <b>{fmt(resources.manpower)}</b>
          <em>+{fmt(income.manpower)}/h</em>
        </div>
        <div className="top-resource">
          <span>
            <Fuel /> OIL
          </span>
          <b>{fmt(resources.oil)}</b>
          <em>+{fmt(income.oil)}/h</em>
        </div>
        <div className="top-resource">
          <span>
            <Factory /> STEEL
          </span>
          <b>{fmt(resources.steel)}</b>
          <em>+{fmt(income.steel)}/h</em>
        </div>

        <div className="server-clock">
          <b>{String(gameClock.hour).padStart(2, "0")}:{String(gameClock.minute).padStart(2, "0")}</b>
          <span>DAY {gameClock.day}</span>
          <i>
            <Activity /> LIVE
          </i>
        </div>
        <button className="icon-button" type="button">
          <Bell />
        </button>
        <button className="icon-button" type="button">
          <Menu />
        </button>
      </header>

      {/* BODY */}
      <section className="aaa-body">
        {/* LEFT PANEL */}
        <aside className="command-left">
          <div className="portrait">
            <div className="portrait-art">
              {playerCountryId === "TR" || commanderProfile === "ataturk" ? (
                <img
                  src="/portraits/ataturk.png"
                  alt="Mustafa Kemal Atatürk"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span>NC</span>
              )}
            </div>
            <div>
              <small>COMMANDER PROFILE</small>
              <b>
                {playerCountryId === "TR" || commanderProfile === "ataturk"
                  ? "MUSTAFA KEMAL ATATÜRK"
                  : commander}
              </b>
              <span>
                {playerCountryId === "TR"
                  ? "EBEDİ BAŞKOMUTAN"
                  : commanderProfile === "ataturk"
                    ? "HISTORICAL COMMANDER PROFILE"
                    : "PLAYER COMMAND · LOCAL IDENTITY"}
              </span>
            </div>
          </div>

          <div className="doctrine">
            <small>DOCTRINE</small>
            <strong>FRONTLINE DEFENSE</strong>
            <span>+25% DEFENSE BONUS</span>
          </div>

          <div className="side-heading">ACTIVE ORDERS</div>
          {activeConstruction.length ? (
            activeConstruction.map((item, i) => {
              const remaining = Math.max(0, item.finishesAt - clockNow);
              const total = Math.max(1, item.finishesAt - item.startedAt);
              const progress = Math.min(
                100,
                Math.max(0, ((clockNow - item.startedAt) / total) * 100)
              );
              return (
                <div className="order construction-order" key={item.id}>
                  <span>{i + 1}</span>
                  <div>
                    <b>{constructionLabel(String(item.type))}</b>
                    <small>
                      {provinces.find((p) => p.id === item.provinceId)?.name ??
                        item.provinceId}{" "}
                      · LVL {item.level ?? "—"}
                    </small>
                    <i>
                      <em style={{ width: `${progress}%` }} />
                    </i>
                    <small>
                      {remaining > 0
                        ? `${Math.ceil(remaining / 60000)}m ${Math.ceil(
                            (remaining % 60000) / 1000
                          )}s REMAINING`
                        : "COMPLETING..."}
                    </small>
                  </div>
                  <em>BUILD</em>
                </div>
              );
            })
          ) : (
            <div className="orders-empty">NO ACTIVE CONSTRUCTION ORDERS</div>
          )}

          <div className="side-heading">QUICK ACCESS</div>
          {[
            "ARMY MANAGEMENT",
            "DIPLOMACY",
            "RESEARCH TREE",
            "CASUS NETWORK",
            "WAR ROOM",
            "TRADE CENTER",
          ].map((x) => (
            <button
              className="quick"
              key={x}
              type="button"
              onClick={() => {
                const map: Record<string, string> = {
                  "ARMY MANAGEMENT": "MILITARY",
                  DIPLOMACY: "DIPLOMACY",
                  "RESEARCH TREE": "RESEARCH",
                  "CASUS NETWORK": "INTELLIGENCE",
                  "WAR ROOM": "MILITARY",
                  "TRADE CENTER": "ECONOMY",
                };
                const target = map[x];
                setActiveTab(target);
                if (
                  ["MILITARY", "DIPLOMACY", "RESEARCH", "INTELLIGENCE"].includes(
                    target
                  )
                ) {
                  setCommandScreen(target as CommandScreenId);
                  setTab("WORLD");
                } else {
                  setCommandScreen(null);
                }
                audioManager.menuOpened();
              }}
            >
              <Radio />
              {x}
            </button>
          ))}

          <div className="left-status">
            <small>WORLD STATUS</small>
            <b>{activeWar ? "WAR ACTIVE" : "STABLE THEATRE"}</b>
            <span>
              {provinces.length} active provinces · {nations.length} playable nations · WORLD MAP
            </span>
          </div>
        </aside>

        {/* MAP */}
        <div className="map-stage">
          <WorldMap
            provinces={visibleProvinces}
            armies={armies}
            selectedId={selectedId}
            selectedArmyId={selectedArmyId}
            gameClock={gameClock}
            commandMode={commandMode}
            onCommandModeChange={setCommandMode}
            onSelect={orderProvince}
            onSelectArmy={(id) => {
              setSelectedArmyId(id);
              const a = armies.find((x) => x.id === id);
              if (a) select(a.provinceId);
            }}
            mapMode={mode}
            onMapModeChange={setMode}
            onCountrySelect={(iso) => {
              setSelectedCountryId(iso);
              select(null);
              audioManager.provinceSelected();
            }}
            playerCountryId={playerCountryId}
            selectedCountryId={selectedCountryId}
            showLabels={mapLabels}
            showBorders={mapBorders}
          />
        </div>

        {/* RIGHT PANEL – Yeni SelectedProvincePanel */}
        <aside className="command-right">
          <SelectedProvincePanel
            province={selected}
            country={
              selected
                ? nations.find((n) => n.id === selected.ownerId) ?? country
                : selectedCountry ?? undefined
            }
            army={selectedArmy}
            provinceArmies={provinceArmies}
            unitStockpile={unitStockpile[selected?.id ?? ""] ?? { infantry:0, tanks:0 }}
            canCreateArmy={!!selected && selected.ownerId === playerCountryId}
            onCreateArmy={() => void createSelectedArmy()}
            incomePerHour={
              selected
                ? Math.max(
                    1,
                    (selected.buildings?.industrialComplex ??
                      selected.industryLevel ??
                      0) * 320
                  )
                : selectedCountryIncome || 0
            }
            onUpgrade={(t) => selected && startC(selected, t)}
            gameClock={gameClock}
            onMergeArmies={(sourceId,targetId) => void mergeArmies(sourceId,targetId)}
            onSplitArmy={(armyId,infantry,tanks) => void splitArmy(armyId,infantry,tanks)}
            onSelectArmy={(id) => {
              setSelectedArmyId(id);
              const army = armies.find((item) => item.id === id);
              if (army) select(army.provinceId);
            }}
            onClose={() => {
              select(null);
              setSelectedCountryId(null);
              setSelectedArmyId(null);
            }}
          />
        </aside>
      </section>

      {/* BOTTOM NAV */}
      <nav className="aaa-bottom">
        {(
          [
            ["ANA SAYFA", Globe2, "WORLD"],
            ["DİPLOMASİ", Landmark, "DIPLOMACY"],
            ["ORDULAR", Swords, "MILITARY"],
            ["SEFERLER", Route, "EXPEDITIONS"],
            ["ARAŞTIRMA", BookOpen, "RESEARCH"],
            ["MESAJLAR", MessageSquare, "MESSAGES"],
            ["GAZETE", Newspaper, "GAZETE"],
            ["AYARLAR", Settings, "SETTINGS"],
          ] as const
        ).map(([label, Icon, target]) => (
          <button
            className={activeTab === target ? "active" : ""}
            key={target}
            type="button"
            onClick={() => {
              audioManager.menuOpened();
              setActiveTab(target);
              if (
                ["DIPLOMACY", "MILITARY", "RESEARCH", "EXPEDITIONS", "MESSAGES"].includes(
                  target
                )
              ) {
                setCommandScreen(target as CommandScreenId);
                setTab("WORLD");
              } else if (target === "WORLD") {
                setCommandScreen(null);
                setTab("WORLD");
              } else {
                setTab(target);
              }
            }}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="command-drawer">{panel}</div>

      {commandScreen && (
        <CommandScreen
          screen={commandScreen}
          onClose={() => {
            setCommandScreen(null);
            setActiveTab("WORLD");
          }}
          provinces={provinces}
          armies={armies}
          resources={resources}
          income={income}
        />
      )}

      {showNewspaper && (
        <WorldNewspaper
          countryId={playerCountryId}
          onEnter={() => {
            localStorage.setItem("nwc-newspaper-seen", "1");
            setShowNewspaper(false);
          }}
        />
      )}
    </main>
  );
                     }
