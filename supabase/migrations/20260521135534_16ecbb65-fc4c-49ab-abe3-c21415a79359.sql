
drop policy if exists "Authenticated insert cms pages" on public.cms_pages;
drop policy if exists "Authenticated update cms pages" on public.cms_pages;

create or replace function public.cms_pages_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
