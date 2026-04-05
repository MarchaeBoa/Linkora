-- Linkora Database Schema

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  theme_color text default '#8B5CF6',
  social_links jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  price integer not null default 0,
  cover_url text,
  file_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Links table
create table public.links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  position integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Leads table
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  email text not null,
  name text,
  created_at timestamptz default now(),
  unique(user_id, email)
);

-- Orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete set null,
  buyer_email text not null,
  amount integer not null default 0,
  stripe_session_id text,
  status text default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz default now()
);

-- RLS Policies

-- Profiles: public read, owner write
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Products: public read active, owner full access
alter table public.products enable row level security;

create policy "Active products are viewable by everyone"
  on public.products for select using (is_active = true or auth.uid() = user_id);

create policy "Users can create their own products"
  on public.products for insert with check (auth.uid() = user_id);

create policy "Users can update their own products"
  on public.products for update using (auth.uid() = user_id);

create policy "Users can delete their own products"
  on public.products for delete using (auth.uid() = user_id);

-- Links: public read active, owner full access
alter table public.links enable row level security;

create policy "Active links are viewable by everyone"
  on public.links for select using (is_active = true or auth.uid() = user_id);

create policy "Users can create their own links"
  on public.links for insert with check (auth.uid() = user_id);

create policy "Users can update their own links"
  on public.links for update using (auth.uid() = user_id);

create policy "Users can delete their own links"
  on public.links for delete using (auth.uid() = user_id);

-- Leads: only owner access
alter table public.leads enable row level security;

create policy "Users can view their own leads"
  on public.leads for select using (auth.uid() = user_id);

create policy "Anyone can insert leads"
  on public.leads for insert with check (true);

-- Orders: owner of product can view
alter table public.orders enable row level security;

create policy "Product owners can view their orders"
  on public.orders for select using (
    exists (
      select 1 from public.products
      where products.id = orders.product_id
      and products.user_id = auth.uid()
    )
  );

create policy "Service role can insert orders"
  on public.orders for insert with check (true);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.update_updated_at();

-- Storage buckets
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('covers', 'covers', true);
insert into storage.buckets (id, name, public) values ('files', 'files', false);

-- Storage policies
create policy "Anyone can view avatars"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Users can update their own avatars"
  on storage.objects for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view covers"
  on storage.objects for select using (bucket_id = 'covers');

create policy "Authenticated users can upload covers"
  on storage.objects for insert with check (bucket_id = 'covers' and auth.role() = 'authenticated');

create policy "Authenticated users can upload files"
  on storage.objects for insert with check (bucket_id = 'files' and auth.role() = 'authenticated');

create policy "Authenticated users can read their files"
  on storage.objects for select using (bucket_id = 'files' and auth.uid()::text = (storage.foldername(name))[1]);
