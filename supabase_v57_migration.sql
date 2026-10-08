-- PsyLab V57 — nettoyage profil / quatre années de résidence uniquement
-- À exécuter après les migrations précédentes. Aucune clé secrète.

-- Les anciennes valeurs R5 ne correspondent plus au cursus configuré.
update public.profiles set residency_year = null where residency_year = 'R5';

alter table public.profiles drop constraint if exists profiles_residency_year_check;
alter table public.profiles add constraint profiles_residency_year_check
  check (residency_year is null or residency_year in ('R1','R2','R3','R4'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,display_name,cohort_code,residency_year,preferred_language)
 values(
   new.id,
   left(coalesce(nullif(new.raw_user_meta_data->>'display_name',''),'Resident_'||left(new.id::text,6)),32),
   nullif(upper(left(coalesce(new.raw_user_meta_data->>'cohort_code',''),24)),''),
   case when new.raw_user_meta_data->>'residency_year' in ('R1','R2','R3','R4') then new.raw_user_meta_data->>'residency_year' else null end,
   case when new.raw_user_meta_data->>'preferred_language'='en' then 'en' else 'fr' end
 )
 on conflict(id) do nothing;
 return new;
end;$$;
