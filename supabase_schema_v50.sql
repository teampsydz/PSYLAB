-- PsyLab V50 — schéma Supabase multi-cours
-- À exécuter dans un projet Supabase neuf.
-- Si vous migrez depuis BipolarLab V49, ce script est conçu pour conserver la compatibilité.
-- Aucune donnée patient identifiable ne doit être stockée dans cette base.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 3 and 32),
  cohort_code text null check (cohort_code is null or char_length(cohort_code) between 2 and 24),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Compatibilité BipolarLab V49/V50.
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  n1_score integer not null default 0 check (n1_score between 0 and 1000),
  n2_score integer not null default 0 check (n2_score between 0 and 1000),
  global_score integer not null default 0 check (global_score between 0 and 1000),
  trophy_count integer not null default 0 check (trophy_count between 0 and 500),
  updated_at timestamptz not null default now()
);

-- Table générique : une ligne par utilisateur et par cours.
create table if not exists public.course_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_key text not null check (course_key ~ '^[a-z0-9_-]{2,40}$'),
  payload jsonb not null default '{}'::jsonb,
  course_score integer not null default 0 check (course_score between 0 and 1000),
  level_scores jsonb not null default '{}'::jsonb,
  trophy_count integer not null default 0 check (trophy_count between 0 and 500),
  updated_at timestamptz not null default now(),
  primary key (user_id, course_key)
);
create index if not exists course_progress_course_score_idx on public.course_progress(course_key, course_score desc);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.course_progress enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid()=id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid()=id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid()=id) with check (auth.uid()=id);

drop policy if exists "progress_select_own" on public.user_progress;
create policy "progress_select_own" on public.user_progress for select to authenticated using (auth.uid()=user_id);
drop policy if exists "course_progress_select_own" on public.course_progress;
create policy "course_progress_select_own" on public.course_progress for select to authenticated using (auth.uid()=user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,display_name,cohort_code)
 values(new.id,left(coalesce(nullif(new.raw_user_meta_data->>'display_name',''),'Resident_'||left(new.id::text,6)),32),nullif(upper(left(coalesce(new.raw_user_meta_data->>'cohort_code',''),24)),''))
 on conflict(id) do nothing;
 return new;
end;$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public._jsonb_count_num_ge(obj jsonb, threshold integer)
returns integer language sql immutable as $$select count(*)::integer from jsonb_each_text(coalesce(obj,'{}'::jsonb)) where value ~ '^[0-9]+$' and value::integer>=threshold;$$;
create or replace function public._jsonb_count_text(obj jsonb,target text)
returns integer language sql immutable as $$select count(*)::integer from jsonb_each(coalesce(obj,'{}'::jsonb)) where trim(both '"' from value::text)=target;$$;
create or replace function public._jsonb_count_true(obj jsonb)
returns integer language sql immutable as $$select count(*)::integer from jsonb_each(coalesce(obj,'{}'::jsonb)) where value='true'::jsonb;$$;
create or replace function public._jsonb_nested_count_true(obj jsonb)
returns integer language sql immutable as $$select count(*)::integer from jsonb_each(coalesce(obj,'{}'::jsonb)) o cross join lateral jsonb_each(case when jsonb_typeof(o.value)='object' then o.value else '{}'::jsonb end) i where i.value='true'::jsonb;$$;

-- Scoring BipolarLab calculé côté serveur.
create or replace function public.save_my_progress(p_payload jsonb)
returns table(user_id uuid,n1_score integer,n2_score integer,global_score integer,trophy_count integer,updated_at timestamptz)
language plpgsql security definer set search_path=public as $$
declare
 v_uid uuid:=auth.uid(); v_state jsonb:=coalesce(p_payload->'state','{}'::jsonb); v_n2 jsonb:=coalesce(p_payload->'n2state','{}'::jsonb);
 v_dis integer:=0;v_mem integer:=0;v_duels integer:=0;v_writing integer:=0;v_boss numeric:=0;v_stations integer:=0;v_comp integer:=0;v_cockpit integer:=0;v_staff integer:=0;v_n2boss integer:=0;v_trophies integer:=0;v_n1 integer:=0;v_n2score integer:=0;v_global integer:=0;
begin
 if v_uid is null then raise exception 'Authentication required'; end if;
 if pg_column_size(p_payload)>1500000 then raise exception 'Progress payload too large'; end if;
 v_dis:=public._jsonb_count_num_ge(v_state->'levels',2);v_mem:=public._jsonb_count_text(v_state->'memory','solid');v_duels:=public._jsonb_count_true(v_state->'duels');
 v_writing:=public._jsonb_count_text(v_state->'v43'->'reverse','solid')+public._jsonb_count_text(v_state->'v43'->'repair','solid');
 begin v_boss:=greatest(0,least(10,coalesce((v_state->'v43'->>'boss')::numeric,0))); exception when others then v_boss:=0; end;
 v_stations:=public._jsonb_count_text(v_n2->'stations','acquis');v_comp:=public._jsonb_count_text(v_n2->'comp','acquis');v_cockpit:=public._jsonb_nested_count_true(v_n2->'cockpit');v_staff:=public._jsonb_count_text(v_n2->'staffEval','acquis');v_n2boss:=case when coalesce(v_n2->>'boss','')='acquis' then 1 else 0 end;v_trophies:=public._jsonb_count_true(v_state->'v48'->'trophies');
 v_n1:=least(1000,round((least(v_dis,50)::numeric/50)*350+(least(v_mem,50)::numeric/50)*300+(least(v_duels,30)::numeric/30)*150+(least(v_writing,16)::numeric/16)*100+(v_boss/10)*100))::integer;
 v_n2score:=least(1000,round((least(v_stations,30)::numeric/30)*350+(least(v_comp,11)::numeric/11)*250+(least(v_cockpit,24)::numeric/24)*200+v_n2boss*100+(least(v_staff,8)::numeric/8)*100))::integer;
 v_global:=round(v_n1*.45+v_n2score*.55)::integer;
 insert into public.user_progress(user_id,payload,n1_score,n2_score,global_score,trophy_count,updated_at) values(v_uid,p_payload,v_n1,v_n2score,v_global,least(v_trophies,500),now())
 on conflict(user_id) do update set payload=excluded.payload,n1_score=excluded.n1_score,n2_score=excluded.n2_score,global_score=excluded.global_score,trophy_count=excluded.trophy_count,updated_at=now();
 insert into public.course_progress(user_id,course_key,payload,course_score,level_scores,trophy_count,updated_at) values(v_uid,'bipolar',p_payload,v_global,jsonb_build_object('n1',v_n1,'n2',v_n2score),least(v_trophies,500),now())
 on conflict(user_id,course_key) do update set payload=excluded.payload,course_score=excluded.course_score,level_scores=excluded.level_scores,trophy_count=excluded.trophy_count,updated_at=now();
 return query select up.user_id,up.n1_score,up.n2_score,up.global_score,up.trophy_count,up.updated_at from public.user_progress up where up.user_id=v_uid;
end;$$;
revoke all on function public.save_my_progress(jsonb) from public;grant execute on function public.save_my_progress(jsonb) to authenticated;

-- Ancien classement BipolarLab, conservé pour le cours existant.
create or replace function public.get_leaderboard(p_metric text default 'global',p_cohort text default null,p_limit integer default 100)
returns table(rank bigint,user_id uuid,display_name text,cohort_code text,n1_score integer,n2_score integer,global_score integer,trophy_count integer,updated_at timestamptz)
language sql security definer set search_path=public as $$
with base as(select p.id user_id,p.display_name,p.cohort_code,u.n1_score,u.n2_score,u.global_score,u.trophy_count,u.updated_at,case when p_metric='n1' then u.n1_score when p_metric='n2' then u.n2_score else u.global_score end metric_score from public.profiles p join public.user_progress u on u.user_id=p.id where p_cohort is null or upper(coalesce(p.cohort_code,''))=upper(p_cohort)),ranked as(select row_number() over(order by metric_score desc,global_score desc,updated_at asc) rank,* from base) select r.rank,r.user_id,r.display_name,r.cohort_code,r.n1_score,r.n2_score,r.global_score,r.trophy_count,r.updated_at from ranked r order by r.rank limit greatest(1,least(coalesce(p_limit,100),200));$$;
revoke all on function public.get_leaderboard(text,text,integer) from public;grant execute on function public.get_leaderboard(text,text,integer) to authenticated;

-- Classement d'un cours. p_level_key peut être 'n1', 'n2', etc.
create or replace function public.get_course_leaderboard(p_course_key text,p_level_key text default null,p_cohort text default null,p_limit integer default 100)
returns table(rank bigint,user_id uuid,display_name text,cohort_code text,course_score integer,trophy_count integer,updated_at timestamptz)
language sql security definer set search_path=public as $$
with base as(
 select p.id user_id,p.display_name,p.cohort_code,cp.course_score,cp.trophy_count,cp.updated_at,
 case when p_level_key is null then cp.course_score else coalesce((cp.level_scores->>p_level_key)::integer,0) end metric_score
 from public.profiles p join public.course_progress cp on cp.user_id=p.id
 where cp.course_key=p_course_key and (p_cohort is null or upper(coalesce(p.cohort_code,''))=upper(p_cohort))
),ranked as(select row_number() over(order by metric_score desc,course_score desc,updated_at asc) rank,* from base)
select r.rank,r.user_id,r.display_name,r.cohort_code,r.metric_score::integer as course_score,r.trophy_count,r.updated_at from ranked r order by r.rank limit greatest(1,least(coalesce(p_limit,100),200));$$;
revoke all on function public.get_course_leaderboard(text,text,text,integer) from public;grant execute on function public.get_course_leaderboard(text,text,text,integer) to authenticated;

-- Classement global PsyLab : somme des scores de cours (1000 max par cours).
create or replace function public.get_platform_leaderboard(p_cohort text default null,p_limit integer default 100)
returns table(rank bigint,user_id uuid,display_name text,cohort_code text,total_score bigint,course_count bigint,total_trophies bigint,updated_at timestamptz)
language sql security definer set search_path=public as $$
with base as(
 select p.id user_id,p.display_name,p.cohort_code,coalesce(sum(cp.course_score),0)::bigint total_score,count(cp.course_key)::bigint course_count,coalesce(sum(cp.trophy_count),0)::bigint total_trophies,max(cp.updated_at) updated_at
 from public.profiles p join public.course_progress cp on cp.user_id=p.id
 where p_cohort is null or upper(coalesce(p.cohort_code,''))=upper(p_cohort)
 group by p.id,p.display_name,p.cohort_code
),ranked as(select row_number() over(order by total_score desc,course_count desc,total_trophies desc,updated_at asc) rank,* from base)
select r.rank,r.user_id,r.display_name,r.cohort_code,r.total_score,r.course_count,r.total_trophies,r.updated_at from ranked r order by r.rank limit greatest(1,least(coalesce(p_limit,100),200));$$;
revoke all on function public.get_platform_leaderboard(text,integer) from public;grant execute on function public.get_platform_leaderboard(text,integer) to authenticated;

grant select,insert,update on public.profiles to authenticated;
grant select on public.user_progress to authenticated;
grant select on public.course_progress to authenticated;
