# Supabase economy schema plan

The browser prototype keeps UI state local, but authoritative economy state should move server-side when Supabase is connected.

- player_resources: player_id, money, manpower, oil, steel, updated_at
- province_economy: province_id, money_production, manpower_production, oil_production, steel_production, updated_at
- buildings: province_id, building_type, level, updated_at
- construction_queue: id, province_id, building_type, target_level, started_at, finishes_at, status
- production_queue: id, province_id, unit_type, quantity, started_at, finishes_at, status
- resource_transactions: id, player_id, resource_type, amount, reason, created_at

No credentials are committed.