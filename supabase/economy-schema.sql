create table if not exists player_resources (
  player_id uuid primary key,
  money bigint not null default 0 check (money >= 0),
  manpower bigint not null default 0 check (manpower >= 0),
  oil bigint not null default 0 check (oil >= 0),
  steel bigint not null default 0 check (steel >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists province_economy (
  province_id text primary key,
  money_production bigint not null default 0,
  manpower_production bigint not null default 0,
  oil_production bigint not null default 0,
  steel_production bigint not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists buildings (
  province_id text not null,
  building_type text not null,
  level smallint not null default 0 check (level between 0 and 3),
  updated_at timestamptz not null default now(),
  primary key (province_id, building_type)
);

create table if not exists construction_queue (
  id uuid primary key,
  player_id uuid not null,
  province_id text not null,
  building_type text not null,
  target_level smallint not null check (target_level between 1 and 3),
  started_at timestamptz not null,
  finishes_at timestamptz not null,
  status text not null default 'active'
    check (status in ('active', 'completed', 'cancelled'))
);

create index if not exists construction_queue_active_idx
  on construction_queue (player_id, status, finishes_at);
create table if not exists production_queue (
  id uuid primary key,
  player_id uuid not null,
  province_id text not null,
  unit_type text not null,
  quantity integer not null default 1 check (quantity > 0),
  started_at timestamptz not null,
  finishes_at timestamptz not null,
  status text not null default 'active'
    check (status in ('active', 'completed', 'cancelled'))
);

create index if not exists production_queue_active_idx
  on production_queue (player_id, status, finishes_at);

create table if not exists resource_transactions (
  id uuid primary key,
  player_id uuid not null,
  resource text not null,
  amount bigint not null,
  reason text not null,
  province_id text,
  reference_id uuid,
  created_at timestamptz not null default now()
);
create or replace function deduct_player_resources(
  p_player_id uuid,
  p_money bigint,
  p_manpower bigint,
  p_oil bigint,
  p_steel bigint,
  p_reason text,
  p_reference_id uuid default null
)
returns player_resources
language plpgsql
security definer
as $$
declare
  current_row player_resources;
begin
  select * into current_row
  from player_resources
  where player_id = p_player_id
  for update;

  if not found then
    raise exception 'PLAYER_RESOURCES_NOT_FOUND';
  end if;

  if current_row.money < p_money
     or current_row.manpower < p_manpower
     or current_row.oil < p_oil
     or current_row.steel < p_steel then
    raise exception 'INSUFFICIENT_RESOURCES';
  end if;

  update player_resources
  set money = money - p_money,
      manpower = manpower - p_manpower,
      oil = oil - p_oil,
      steel = steel - p_steel,
      updated_at = now()
  where player_id = p_player_id
  returning * into current_row;

  if p_money <> 0 then
    insert into resource_transactions(id, player_id, resource, amount, reason, reference_id)
    values (gen_random_uuid(), p_player_id, 'money', -p_money, p_reason, p_reference_id);
  end if;
  if p_manpower <> 0 then
    insert into resource_transactions(id, player_id, resource, amount, reason, reference_id)
    values (gen_random_uuid(), p_player_id, 'manpower', -p_manpower, p_reason, p_reference_id);
  end if;
  if p_oil <> 0 then
    insert into resource_transactions(id, player_id, resource, amount, reason, reference_id)
    values (gen_random_uuid(), p_player_id, 'oil', -p_oil, p_reason, p_reference_id);
  end if;
  if p_steel <> 0 then
    insert into resource_transactions(id, player_id, resource, amount, reason, reference_id)
    values (gen_random_uuid(), p_player_id, 'steel', -p_steel, p_reason, p_reference_id);
  end if;

  return current_row;
end;
$$;
