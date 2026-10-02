-- Form submissions from the public site (no user accounts).
-- Visitors may only INSERT. Nobody can read, change or delete rows through the Data API;
-- the studio reads submissions in the Supabase dashboard (or later with a server-side secret key).

-- Contact form ("Tell us your idea")
create table public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 200),
  email       text not null check (char_length(email) <= 320 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone       text check (char_length(phone) <= 50),
  piece_type  text check (char_length(piece_type) <= 100),
  metal       text check (char_length(metal) <= 100),
  message     text not null check (char_length(message) between 1 and 5000)
);

-- Order wizard ("Start an order")
create table public.orders (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  piece          text not null check (char_length(piece) between 1 and 100),
  deliver        text not null check (char_length(deliver) between 1 and 100),
  start_from     text not null check (char_length(start_from) between 1 and 100),
  name_text      text check (char_length(name_text) <= 100),
  description    text check (char_length(description) <= 5000),
  photos_link    text check (char_length(photos_link) <= 2000 and photos_link ~* '^https?://'),
  metal          text check (char_length(metal) <= 100),
  karat          text check (char_length(karat) <= 100),
  stones         text check (char_length(stones) <= 100),
  size_label     text check (char_length(size_label) <= 100),
  size           text check (char_length(size) <= 100),
  piece_size     text check (char_length(piece_size) <= 200),
  finish         text check (char_length(finish) <= 100),
  engraving      text check (char_length(engraving) <= 100),
  budget         text not null check (char_length(budget) between 1 and 100),
  need_by        date,
  customer_name  text not null check (char_length(customer_name) between 1 and 200),
  email          text not null check (char_length(email) <= 320 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone          text check (char_length(phone) <= 50),
  instagram      text check (char_length(instagram) <= 100),
  contact_by     text not null check (char_length(contact_by) between 1 and 50),
  delivery       text check (char_length(delivery) <= 100),
  location       text check (char_length(location) <= 200),
  constraint orders_has_description check (description is not null or name_text is not null)
);

create index inquiries_created_at_idx on public.inquiries (created_at desc);
create index orders_created_at_idx on public.orders (created_at desc);

-- Access: RLS on, and only INSERT is granted to the public (anon) role.
alter table public.inquiries enable row level security;
alter table public.orders enable row level security;

revoke all on table public.inquiries, public.orders from anon, authenticated;
grant insert on table public.inquiries, public.orders to anon;

-- Submissions must carry the server's timestamp (blocks back-dated or future-dated rows).
create policy "Visitors can submit an inquiry"
  on public.inquiries for insert to anon
  with check (created_at between now() - interval '1 minute' and now() + interval '1 minute');

create policy "Visitors can submit an order"
  on public.orders for insert to anon
  with check (created_at between now() - interval '1 minute' and now() + interval '1 minute');
