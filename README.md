# Nexora: World Command

A modular grand-strategy prototype built with Next.js, React and TypeScript.

## Current milestone

Phase 1 + Phase 2 foundation and Phase 3 Economy + Production are implemented.

### World / command foundation
- Premium dark military command-center UI
- Province-based interactive world map
- 8 demo provinces and 3 fictional countries
- Province ownership and neighbor graph
- Province inspection panel
- Population, industry, barracks, fortification and infrastructure data

### Economy / production
- Money, manpower, oil and steel resources
- Province-level hourly resource production
- Centralized economy, building and unit configuration
- Industrial Complex, Barracks and Fortification levels
- Building upgrade costs and construction timers
- Infantry production queue and production timers
- Economy dashboard with current resources and hourly income
- Province resource-production breakdown
- Pure economy functions separated from Zustand UI state
- Vitest unit tests
- Supabase-ready schema plan and environment template

The browser prototype keeps resources and queues in Zustand. Authoritative values are intentionally isolated from the UI so the future server/Supabase tick can replace the client demo state without moving calculation rules into React components.

## Architecture

```text
data/economy/
  resources.ts
  buildings.ts
  units.ts

game/economy/
  economy-config.ts
  resource-engine.ts
  construction.ts
  production.ts
  maintenance.ts

components/panels/
  EconomyPanel.tsx
  ConstructionPanel.tsx
  ProductionPanel.tsx
  ProvincePanel.tsx
```

## Development

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
npm run dev
```

## Roadmap

1. Foundation + map — complete
2. Province systems — complete
3. Economy + production — complete
4. Armies and movement
5. Server-authoritative combat
6. Logistics
7. Diplomacy and alliances
8. Intelligence and fog of war
9. Weather engine
10. World news and events
11. Multiplayer persistence, performance and polish

Combat, diplomacy, espionage, weather simulation and multiplayer war systems are intentionally not part of Phase 3.
