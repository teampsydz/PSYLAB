-- PsyLab V60 — statut professionnel réel des utilisateurs + OAuth-ready profile metadata
-- À exécuter après les migrations V56/V57. Aucune clé secrète.

alter table public.profiles add column if not exists professional_status text null;

-- Les anciens R1–R4 sont convertis en statut professionnel, sans créer de progression PsyLab.
update public.profiles
set professional_status = residency_year
where professional_status is null and residency_year in ('R1','R2','R3','R4');

alter table public.profiles drop constraint if exists profiles_professional_status_check;
alter table public.profiles add constraint profiles_professional_status_check
check (professional_status is null or professional_status in (
  'EXTERNE','INTERNE','R1','R2','R3','R4','ASSISTANT','PROFESSEUR'
));

-- Compatibilité : residency_year ne reste renseigné que pour R1–R4.
update public.profiles
set residency_year = case when professional_status in ('R1','R2','R3','R4') then professional_status else null end
where professional_status is not null;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
declare
  v_status text;
  v_name text;
begin
  v_status := case
    when new.raw_user_meta_data->>'professional_status' in ('EXTERNE','INTERNE','R1','R2','R3','R4','ASSISTANT','PROFESSEUR')
      then new.raw_user_meta_data->>'professional_status'
    when new.raw_user_meta_data->>'residency_year' in ('R1','R2','R3','R4')
      then new.raw_user_meta_data->>'residency_year'
    else null
  end;
  v_name := left(coalesce(
    nullif(new.raw_user_meta_data->>'display_name',''),
    nullif(new.raw_user_meta_data->>'full_name',''),
    nullif(new.raw_user_meta_data->>'name',''),
    nullif(split_part(coalesce(new.email,''),'@',1),''),
    'User_'||left(new.id::text,6)
  ),32);
  insert into public.profiles(id,display_name,cohort_code,residency_year,professional_status,preferred_language)
  values(
    new.id,
    v_name,
    nullif(upper(left(coalesce(new.raw_user_meta_data->>'cohort_code',''),24)),''),
    case when v_status in ('R1','R2','R3','R4') then v_status else null end,
    v_status,
    case when new.raw_user_meta_data->>'preferred_language'='en' then 'en' else 'fr' end
  )
  on conflict(id) do nothing;
  return new;
end;$$;

-- Profil public minimal : le statut est affichable dans les classements, l'e-mail ne l'est jamais.
drop function if exists public.get_public_profiles(uuid[]);
create function public.get_public_profiles(p_user_ids uuid[])
returns table(id uuid,display_name text,cohort_code text,residency_year text,professional_status text,avatar_path text)
language sql security definer set search_path=public as $$
  select p.id,p.display_name,p.cohort_code,p.residency_year,p.professional_status,
         case when p.show_avatar_public then p.avatar_path else null end as avatar_path
  from public.profiles p
  where p.id=any(coalesce(p_user_ids,array[]::uuid[]));
$$;
revoke all on function public.get_public_profiles(uuid[]) from public;
grant execute on function public.get_public_profiles(uuid[]) to authenticated;
