# Server-authoritative economy schema

The Phase 3 economy now has a server-owned action boundary. The current development adapter is in-memory so local tests and development do not require Supabase credentials.

## Application mapping

- `player_resources` -> `EconomyState.resources`
- `province_economy` -> calculated province income from `resource-engine.ts`
- `buildings` -> `EconomyState.provinceBuildings`
- `construction_queue` -> `EconomyState.constructionQueue`
- `production_queue` -> `EconomyState.productionQueue`
- `resource_transactions` -> server-side resource mutation audit trail

The SQL source of truth is `supabase/economy-schema.sql`.

## Server boundary

Browser code can request actions but cannot submit resource balances, queue timestamps, completion timestamps, or building levels for mutation. The server derives costs and times from the existing Phase 3 configuration.

Construction and production completion are resolved against server time. Client countdowns are display-only.

## Supabase status

No credentials are committed and no Supabase dependency is required for local development. The schema and an atomic resource-deduction SQL function are prepared for the database-backed adapter.

When Supabase is connected, resource deductions should use the row-locking transaction function rather than client-side arithmetic.

## Environment

`.env.example` contains placeholders for the Supabase URL, anon key and server-only service role key.
