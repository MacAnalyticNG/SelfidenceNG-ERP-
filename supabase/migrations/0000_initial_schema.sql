-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create ENUMS
create type user_role as enum ('super_admin', 'admin', 'staff', 'driver');
create type order_status as enum ('pending', 'in_progress', 'ready', 'delivered', 'cancelled');
create type payment_status as enum ('unpaid', 'partially_paid', 'paid', 'refunded');

-- 1. Profiles (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  role user_role default 'staff',
  branch_id uuid, -- link to a branches table if you have multiple locations
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Customers
create table public.customers (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Services (Product Catalog)
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10, 2) not null,
  category text, -- e.g. 'Laundry', 'Dry Cleaning'
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Orders
create table public.orders (
  id text primary key, -- User-friendly ID like 'ORD-001'
  customer_id uuid references public.customers(id) on delete set null,
  status order_status default 'pending',
  total_amount decimal(10, 2) not null default 0,
  paid_amount decimal(10, 2) default 0,
  payment_status payment_status default 'unpaid',
  pickup_date date,
  delivery_date date,
  due_date date,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Order Items
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id text references public.orders(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete restrict,
  quantity integer default 1,
  unit_price decimal(10, 2) not null, -- snapshot of price at time of order
  subtotal decimal(10, 2) generated always as (quantity * unit_price) stored,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;
alter table customers enable row level security;
alter table services enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Basic Policies (Adjust as needed)
-- Profiles: Users can read all profiles (for staff lists), can only edit their own
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Customers: Staff can view all, insert, update
create policy "Enable access to all users" on customers for all using (auth.role() = 'authenticated');

-- Services: Staff view all, Admins edit
create policy "Enable read access for all" on services for select using (true);
create policy "Enable write for authenticated" on services for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated" on services for update using (auth.role() = 'authenticated');

-- Orders: View all
create policy "Enable all access for authenticated users" on orders for all using (auth.role() = 'authenticated');

-- Order Items: View all
create policy "Enable all access for authenticated users" on order_items for all using (auth.role() = 'authenticated');

-- Trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'staff');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
