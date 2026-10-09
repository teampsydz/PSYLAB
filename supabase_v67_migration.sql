-- PsyLab V67 — corrective migration for La Blouse
-- Idempotent. Safe to run on a V65/V66 database.
-- Root cause fixed: V65/V66 code reads/writes challenge_attempts.breakdown,
-- but some deployments never received the older V54 ALTER TABLE.

begin;

alter table public.challenge_attempts
  add column if not exists breakdown jsonb;

update public.challenge_attempts
set breakdown='{}'::jsonb
where breakdown is null;

alter table public.challenge_attempts
  alter column breakdown set default '{}'::jsonb,
  alter column breakdown set not null;

-- Helpful index for the ranked-attempt lookup used by La Blouse.
create index if not exists challenge_attempts_user_key_idx
  on public.challenge_attempts(user_id, challenge_key);

-- Fail explicitly during deployment rather than exposing an opaque client error later.
do $do$
begin
  if to_regprocedure('public.submit_weekly_challenge(text,jsonb)') is null then
    raise exception 'PsyLab prerequisite missing: public.submit_weekly_challenge(text,jsonb). Run the V65 migration first, then rerun V67.';
  end if;
end
$do$;

commit;
