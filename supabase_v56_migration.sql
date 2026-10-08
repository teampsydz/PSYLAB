-- PsyLab V56 — profils enrichis + avatars
-- À exécuter UNE FOIS après les migrations V50/V51/V54.
-- Ne contient aucune clé secrète.

alter table public.profiles
  add column if not exists avatar_path text null,
  add column if not exists show_avatar_public boolean not null default false,
  add column if not exists residency_year text null,
  add column if not exists preferred_language text not null default 'fr';

alter table public.profiles drop constraint if exists profiles_residency_year_check;
alter table public.profiles add constraint profiles_residency_year_check
  check (residency_year is null or residency_year in ('R1','R2','R3','R4','R5'));
alter table public.profiles drop constraint if exists profiles_preferred_language_check;
alter table public.profiles add constraint profiles_preferred_language_check
  check (preferred_language in ('fr','en'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,display_name,cohort_code,residency_year,preferred_language)
 values(
   new.id,
   left(coalesce(nullif(new.raw_user_meta_data->>'display_name',''),'Resident_'||left(new.id::text,6)),32),
   nullif(upper(left(coalesce(new.raw_user_meta_data->>'cohort_code',''),24)),''),
   case when new.raw_user_meta_data->>'residency_year' in ('R1','R2','R3','R4','R5') then new.raw_user_meta_data->>'residency_year' else null end,
   case when new.raw_user_meta_data->>'preferred_language'='en' then 'en' else 'fr' end
 )
 on conflict(id) do nothing;
 return new;
end;$$;

-- Avatars privés. Chaque utilisateur écrit uniquement dans son dossier UUID.
-- La lecture par un autre utilisateur authentifié n'est permise que si show_avatar_public=true.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('avatars','avatars',false,2097152,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=2097152,allowed_mime_types=array['image/jpeg','image/png','image/webp'];


drop policy if exists "avatars_select_visible" on storage.objects;
create policy "avatars_select_visible" on storage.objects for select to authenticated
using (
  bucket_id='avatars' and (
    (storage.foldername(name))[1]=auth.uid()::text
    or exists (
      select 1 from public.profiles p
      where p.id::text=(storage.foldername(name))[1]
        and p.show_avatar_public=true
    )
  )
);

drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects for insert to authenticated
with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects for update to authenticated
using (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text)
with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own" on storage.objects for delete to authenticated
using (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

-- Lecture publique minimale pour afficher les avatars uniquement quand l'utilisateur l'autorise.
create or replace function public.get_public_profiles(p_user_ids uuid[])
returns table(id uuid,display_name text,cohort_code text,residency_year text,avatar_path text)
language sql security definer set search_path=public as $$
  select p.id,p.display_name,p.cohort_code,p.residency_year,
         case when p.show_avatar_public then p.avatar_path else null end as avatar_path
  from public.profiles p
  where p.id=any(coalesce(p_user_ids,array[]::uuid[]));
$$;
revoke all on function public.get_public_profiles(uuid[]) from public;
grant execute on function public.get_public_profiles(uuid[]) to authenticated;
