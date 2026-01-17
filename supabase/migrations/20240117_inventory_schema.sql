-- 1. Inventory Items Table
create table if not exists inventory_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  quantity numeric not null default 0,
  unit text not null, -- e.g., 'ml', 'pcs', 'kg'
  min_level numeric default 10, -- Low stock alert threshold
  price_per_unit numeric, -- Cost tracking
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Service Materials Link Table (Recipe)
create table if not exists service_materials (
  id uuid default gen_random_uuid() primary key,
  service_id uuid references services(id) on delete cascade not null,
  inventory_item_id uuid references inventory_items(id) on delete cascade not null,
  quantity_required numeric not null,
  unique(service_id, inventory_item_id)
);

-- 3. Enable RLS (Row Level Security)
alter table inventory_items enable row level security;
alter table service_materials enable row level security;

-- 4. Create Policies (Simple public access for now, similar to other tables in this dev phase)
create policy "Enable all access for all users" on inventory_items
for all using (true) with check (true);

create policy "Enable all access for all users" on service_materials
for all using (true) with check (true);
