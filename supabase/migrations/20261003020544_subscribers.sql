-- Email sign-ups from the "Unlock 5% off" popup.
-- Visitors may only INSERT; nobody can read the list through the Data API.
create table public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique check (char_length(email) <= 320 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source      text not null default 'discount-popup' check (char_length(source) <= 50)
);

alter table public.subscribers enable row level security;
revoke all on table public.subscribers from anon, authenticated;
grant insert on table public.subscribers to anon;

create policy "Visitors can sign up"
  on public.subscribers for insert to anon
  with check (created_at between now() - interval '1 minute' and now() + interval '1 minute');
