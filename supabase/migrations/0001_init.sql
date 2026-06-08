-- =====================================================================
-- World Cup 2026 Bracket — initial schema
-- =====================================================================

create table public.teams (
  code        text primary key,
  name        text not null,
  group_letter char(1) not null check (group_letter in ('A','B','C','D','E','F','G','H','I','J','K','L')),
  flag        text not null
);

create table public.matches (
  match_number     int primary key check (match_number between 1 and 104),
  round            text not null check (round in ('group','r32','r16','qf','sf','third','final')),
  group_letter     char(1),
  kickoff_at       timestamptz not null,
  team_a_code      text references public.teams(code),
  team_b_code      text references public.teams(code),
  slot_a_label     text,
  slot_b_label     text,
  feeds_from_a     int,
  feeds_from_b     int,
  actual_team_a_code text references public.teams(code),
  actual_team_b_code text references public.teams(code),
  actual_winner_code text references public.teams(code),
  actual_score_a   int,
  actual_score_b   int,
  updated_at       timestamptz not null default now()
);

create index matches_kickoff_idx on public.matches (kickoff_at);
create index matches_round_idx   on public.matches (round);

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null,
  created_at    timestamptz not null default now()
);

create table public.admin_emails (
  email text primary key
);

create table public.picks (
  user_id               uuid not null references auth.users(id) on delete cascade,
  match_number          int  not null references public.matches(match_number),
  predicted_winner_code text references public.teams(code),
  predicted_score_a     int,
  predicted_score_b     int,
  updated_at            timestamptz not null default now(),
  primary key (user_id, match_number)
);

create index picks_user_idx on public.picks (user_id);

alter table public.teams         enable row level security;
alter table public.matches       enable row level security;
alter table public.profiles      enable row level security;
alter table public.admin_emails  enable row level security;
alter table public.picks         enable row level security;

create policy "teams: public read"
  on public.teams for select to anon, authenticated using (true);
create policy "matches: public read"
  on public.matches for select to anon, authenticated using (true);
create policy "profiles: public read"
  on public.profiles for select to anon, authenticated using (true);
create policy "picks: public read"
  on public.picks for select to anon, authenticated using (true);

create policy "admin_emails: self read"
  on public.admin_emails for select to authenticated
  using (email = auth.email());

create policy "profiles: self insert"
  on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy "profiles: self update"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "picks: self insert before kickoff"
  on public.picks for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.matches m
      where m.match_number = picks.match_number and m.kickoff_at > now()
    )
  );
create policy "picks: self update before kickoff"
  on public.picks for update to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.matches m
      where m.match_number = picks.match_number and m.kickoff_at > now()
    )
  );
create policy "picks: self delete before kickoff"
  on public.picks for delete to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1 from public.matches m
      where m.match_number = picks.match_number and m.kickoff_at > now()
    )
  );

create policy "matches: admin update"
  on public.matches for update to authenticated
  using (auth.email() in (select email from public.admin_emails))
  with check (auth.email() in (select email from public.admin_emails));

create or replace function public.touch_updated_at()
returns trigger
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger picks_touch_updated_at
  before update on public.picks
  for each row execute function public.touch_updated_at();
create trigger matches_touch_updated_at
  before update on public.matches
  for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(split_part(new.email, '@', 1), 'Player'))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql;

revoke execute on function public.handle_new_user() from anon, authenticated, public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Seed admin allowlist; replace with your email.
insert into public.admin_emails(email) values ('your-email@example.com')
on conflict do nothing;
