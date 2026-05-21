
create table public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in ('what-is-arancini', 'about', 'next-popup')),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create index cms_pages_slug_idx on public.cms_pages (slug);

alter table public.cms_pages enable row level security;

create policy "Public read cms pages"
  on public.cms_pages for select
  to anon, authenticated
  using (true);

create policy "Authenticated insert cms pages"
  on public.cms_pages for insert
  to authenticated
  with check (true);

create policy "Authenticated update cms pages"
  on public.cms_pages for update
  to authenticated
  using (true)
  with check (true);

create or replace function public.cms_pages_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cms_pages_updated_at
  before update on public.cms_pages
  for each row execute function public.cms_pages_set_updated_at();
