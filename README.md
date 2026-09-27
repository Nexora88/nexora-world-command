# Nexora: World Command

A modular real-time grand strategy prototype built with Next.js, React and TypeScript.

## Current milestone

Phase 1 + Phase 2 foundation is implemented:

- Command-center UI with dark military visual language
- Province-based interactive world map
- 8 demo provinces and 3 fictional countries
- Province ownership and neighbor graph
- Province inspection panel
- Population, industry, barracks, fortification and infrastructure data
- Weather and supply status surfaces
- Responsive fallback for smaller screens
- Lightweight Zustand game state

## Architecture

Game rules are kept outside React components so the simulation can grow into a server-authoritative multiplayer engine. The current map uses local seed data; Supabase/Auth/Realtime and server tick processing are intentionally subsequent phases.

## Roadmap

1. Foundation + map
2. Economy and production
3. Armies and movement
4. Server-authoritative combat
5. Logistics
6. Diplomacy and alliances
7. Intelligence and fog of war
8. Weather engine
9. World news and events
10. Performance, testing and polish

## Development

```bash
npm install
npm run dev
```

If the local environment has an incomplete npm dependency cache, remove `node_modules` and `package-lock.json`, then reinstall with network access.

## Design principle

Build a real playable game engine, not a static dashboard. Critical game state will remain server-authoritative as multiplayer systems are added.
