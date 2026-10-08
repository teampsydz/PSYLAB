-- PsyLab V54 — scoring clinique + trajectoire d'hypothèses + saison / Blouse d'Or
-- À exécuter APRÈS supabase_v51_migration.sql puis supabase_v52_migration.sql.
-- Ne stocke aucune donnée patient identifiable.

alter table public.challenge_attempts
  add column if not exists breakdown jsonb not null default '{}'::jsonb;

-- Hypothèses visibles dans le cockpit du défi.
update public.challenge_templates
set content = jsonb_set(
  jsonb_set(content,'{fr,hypotheses}','["Trouble induit par un médicament","Épisode maniaque primaire","Anxiété réactionnelle","TDAH ancien"]'::jsonb,true),
  '{en,hypotheses}','["Medication-induced mood syndrome","Primary manic episode","Reactive anxiety","Longstanding ADHD"]'::jsonb,true)
where course_key='bipolar' and template_id=1;

update public.challenge_templates
set content = jsonb_set(
  jsonb_set(content,'{fr,hypotheses}','["Dépression unipolaire","Trouble bipolaire II","Trouble bipolaire I","Autre cadre diagnostique"]'::jsonb,true),
  '{en,hypotheses}','["Unipolar depression","Bipolar II disorder","Bipolar I disorder","Another diagnostic framework"]'::jsonb,true)
where course_key='bipolar' and template_id=2;

update public.challenge_templates
set content = jsonb_set(
  jsonb_set(content,'{fr,hypotheses}','["Bipolarité avec épisodes thymiques","Labilité émotionnelle réactive","Épisode maniaque","Cause secondaire"]'::jsonb,true),
  '{en,hypotheses}','["Bipolarity with mood episodes","Reactive emotional lability","Manic episode","Secondary cause"]'::jsonb,true)
where course_key='bipolar' and template_id=3;

update public.challenge_templates
set content = jsonb_set(
  jsonb_set(content,'{fr,hypotheses}','["Épisode maniaque primaire","Cause secondaire médicale ou médicamenteuse","Trouble bipolaire I déjà établi","Réaction de personnalité"]'::jsonb,true),
  '{en,hypotheses}','["Primary manic episode","Secondary medical or medication cause","Already established bipolar I disorder","Personality reaction"]'::jsonb,true)
where course_key='bipolar' and template_id=4;

-- Les cibles de confiance et de hiérarchie sont privées, côté serveur.
update public.challenge_templates set answer_key='{"steps":[
 {"kind":"multi","correct":[0,2],"certainty_target":60,"leader_correct":[0,1]},
 {"kind":"single","correct":1,"certainty_target":85,"leader_correct":[0]},
 {"kind":"single","correct":1,"certainty_target":85,"leader_correct":[0]},
 {"kind":"single","correct":0,"certainty_target":70,"leader_correct":[0]},
 {"kind":"final","diagnosis":2,"argument":1,"certainty_target":70,"leader_correct":[0]}
]}'::jsonb where course_key='bipolar' and template_id=1;

update public.challenge_templates set answer_key='{"steps":[
 {"kind":"multi","correct":[0,1],"certainty_target":60,"leader_correct":[0,1]},
 {"kind":"single","correct":0,"certainty_target":90,"leader_correct":[1]},
 {"kind":"single","correct":0,"certainty_target":85,"leader_correct":[1]},
 {"kind":"single","correct":0,"certainty_target":90,"leader_correct":[1]},
 {"kind":"final","diagnosis":1,"argument":1,"certainty_target":90,"leader_correct":[1]}
]}'::jsonb where course_key='bipolar' and template_id=2;

update public.challenge_templates set answer_key='{"steps":[
 {"kind":"multi","correct":[0,1],"certainty_target":55,"leader_correct":[0,1]},
 {"kind":"single","correct":0,"certainty_target":85,"leader_correct":[1]},
 {"kind":"single","correct":0,"certainty_target":85,"leader_correct":[1]},
 {"kind":"single","correct":0,"certainty_target":85,"leader_correct":[1]},
 {"kind":"final","diagnosis":2,"argument":1,"certainty_target":85,"leader_correct":[1]}
]}'::jsonb where course_key='bipolar' and template_id=3;

update public.challenge_templates set answer_key='{"steps":[
 {"kind":"multi","correct":[0,1],"certainty_target":55,"leader_correct":[0,1]},
 {"kind":"single","correct":0,"certainty_target":90,"leader_correct":[1]},
 {"kind":"single","correct":0,"certainty_target":90,"leader_correct":[1]},
 {"kind":"single","correct":0,"certainty_target":80,"leader_correct":[1]},
 {"kind":"final","diagnosis":1,"argument":0,"certainty_target":90,"leader_correct":[1]}
]}'::jsonb where course_key='bipolar' and template_id=4;

-- Score hebdomadaire = 100 points :
-- Décisions 40 · Discrimination 20 · Révision des hypothèses 15 · Différentiel 15 · Calibration 10.
drop function if exists public.submit_weekly_challenge(text,jsonb);
create function public.submit_weekly_challenge(p_challenge_key text,p_answers jsonb)
returns table(score integer,accepted boolean,breakdown jsonb)
language plpgsql security definer set search_path=public as $$
declare
  v_uid uuid:=auth.uid();
  v_start timestamptz:=date_trunc('week',now());
  v_expected_key text; v_count int; v_id int; v_offset int; v_key jsonb; v_i int;
  v_existing int; v_existing_breakdown jsonb;
  v_expected jsonb; v_answer jsonb; v_kind text;
  v_choice int; v_conf int; v_diag int; v_arg int; v_leader int;
  v_selected jsonb; v_correct_arr jsonb; v_leader_correct jsonb; v_overlap int;
  v_core_ok boolean; v_cal_target int; v_cal_diff int; v_cal_points int; v_rev_points int;
  v_decisions int:=0; v_discrimination int:=0; v_revision int:=0; v_differential int:=0; v_calibration int:=0;
  v_stage_points int; v_score int:=0;
  v_stages jsonb:='[]'::jsonb;
  v_stage_max jsonb:='[17,26,21,16,20]'::jsonb;
  v_result jsonb;
begin
  if v_uid is null then raise exception 'Authentication required'; end if;
  select count(*) into v_count from public.challenge_templates where course_key='bipolar';
  if v_count=0 then raise exception 'No challenge template'; end if;
  v_offset:=(extract(week from v_start)::int % v_count);
  select ct.template_id into v_id
    from public.challenge_templates ct
    where ct.course_key='bipolar'
    order by ct.template_id
    offset v_offset limit 1;
  v_expected_key:='bipolar-'||to_char(v_start,'IYYY-IW');
  if p_challenge_key<>v_expected_key then raise exception 'Challenge is not current'; end if;
  select answer_key into v_key from public.challenge_templates where course_key='bipolar' and template_id=v_id;
  if jsonb_typeof(p_answers)<>'array' or jsonb_array_length(p_answers)<>jsonb_array_length(v_key->'steps') then raise exception 'Incomplete challenge'; end if;

  select ca.score,ca.breakdown into v_existing,v_existing_breakdown
    from public.challenge_attempts ca
    where ca.user_id=v_uid and ca.challenge_key=p_challenge_key;
  if v_existing is not null and coalesce(v_existing_breakdown,'{}'::jsonb) ? 'dimensions' then
    score:=v_existing; accepted:=false; breakdown:=coalesce(v_existing_breakdown,'{}'::jsonb); return next; return;
  end if;

  for v_i in 0..jsonb_array_length(p_answers)-1 loop
    v_expected:=v_key->'steps'->v_i;
    v_answer:=p_answers->v_i;
    v_kind:=v_expected->>'kind';
    v_conf:=greatest(50,least(coalesce((v_answer->>'confidence')::int,70),100));
    v_leader:=coalesce((v_answer->>'leader')::int,-1);
    v_leader_correct:=coalesce(v_expected->'leader_correct','[]'::jsonb);
    v_stage_points:=0;
    v_core_ok:=false;

    if v_i=0 and v_kind='multi' then
      v_selected:=coalesce(v_answer->'selected','[]'::jsonb);
      v_correct_arr:=coalesce(v_expected->'correct','[]'::jsonb);
      if jsonb_typeof(v_selected)<>'array' then raise exception 'Invalid multi answer'; end if;
      if v_selected @> v_correct_arr and v_correct_arr @> v_selected then
        v_differential:=15; v_stage_points:=v_stage_points+15; v_core_ok:=true;
      else
        select count(*) into v_overlap
          from jsonb_array_elements_text(v_selected) s
          where exists(select 1 from jsonb_array_elements_text(v_correct_arr) c where c.value=s.value);
        if v_overlap>0 then v_differential:=8; v_stage_points:=v_stage_points+8; end if;
      end if;
    elsif v_i=1 and v_kind='single' then
      v_choice:=coalesce((v_answer->>'choice')::int,-1);
      v_core_ok:=v_choice=(v_expected->>'correct')::int;
      if v_core_ok then v_discrimination:=20; v_stage_points:=v_stage_points+20; end if;
    elsif v_i=2 and v_kind='single' then
      v_choice:=coalesce((v_answer->>'choice')::int,-1);
      v_core_ok:=v_choice=(v_expected->>'correct')::int;
      if v_core_ok then v_decisions:=v_decisions+15; v_stage_points:=v_stage_points+15; end if;
    elsif v_i=3 and v_kind='single' then
      v_choice:=coalesce((v_answer->>'choice')::int,-1);
      v_core_ok:=v_choice=(v_expected->>'correct')::int;
      if v_core_ok then v_decisions:=v_decisions+10; v_stage_points:=v_stage_points+10; end if;
    elsif v_i=4 and v_kind='final' then
      v_diag:=coalesce((v_answer->>'diagnosis')::int,-1);
      v_arg:=coalesce((v_answer->>'argument')::int,-1);
      if v_diag=(v_expected->>'diagnosis')::int then v_decisions:=v_decisions+10; v_stage_points:=v_stage_points+10; end if;
      if v_arg=(v_expected->>'argument')::int then v_decisions:=v_decisions+5; v_stage_points:=v_stage_points+5; end if;
      v_core_ok:=v_diag=(v_expected->>'diagnosis')::int and v_arg=(v_expected->>'argument')::int;
    else
      raise exception 'Unsupported challenge step';
    end if;

    -- Révision de la hiérarchie : étapes 2 à 5 = 4 + 4 + 4 + 3 points.
    if v_i between 1 and 4 then
      v_rev_points:=case v_i when 1 then 4 when 2 then 4 when 3 then 4 else 3 end;
      if v_leader>=0 and exists(
        select 1 from jsonb_array_elements_text(v_leader_correct) x where x.value::int=v_leader
      ) then
        v_revision:=v_revision+v_rev_points;
        v_stage_points:=v_stage_points+v_rev_points;
      end if;
    end if;

    -- Calibration : une bonne décision vise la certitude attendue du dossier ; une mauvaise décision ne doit pas être surconfiante.
    v_cal_target:=case when v_core_ok then coalesce((v_expected->>'certainty_target')::int,80) else 50 end;
    v_cal_diff:=abs(v_conf-v_cal_target);
    v_cal_points:=case when v_cal_diff<=5 then 2 when v_cal_diff<=20 then 1 else 0 end;
    v_calibration:=v_calibration+v_cal_points;
    v_stage_points:=v_stage_points+v_cal_points;
    v_stages:=v_stages||jsonb_build_array(v_stage_points);
  end loop;

  v_score:=greatest(0,least(100,v_decisions+v_discrimination+v_revision+v_differential+v_calibration));
  v_result:=jsonb_build_object(
    'dimensions',jsonb_build_object(
      'decisions',v_decisions,
      'discrimination',v_discrimination,
      'revision',v_revision,
      'differential',v_differential,
      'calibration',v_calibration
    ),
    'max',jsonb_build_object('decisions',40,'discrimination',20,'revision',15,'differential',15,'calibration',10),
    'stages',v_stages,
    'stage_max',v_stage_max
  );

  if v_existing is null then
    insert into public.challenge_attempts(user_id,challenge_key,course_key,score,answers,breakdown)
    values(v_uid,p_challenge_key,'bipolar',v_score,p_answers,v_result);
  else
    -- Transition V53 -> V54 : une ancienne tentative sans détail V54 peut être rejouée une fois.
    update public.challenge_attempts
      set score=v_score,answers=p_answers,breakdown=v_result,submitted_at=now()
      where user_id=v_uid and challenge_key=p_challenge_key;
  end if;

  score:=v_score; accepted:=true; breakdown:=v_result; return next;
end;$$;
revoke all on function public.submit_weekly_challenge(text,jsonb) from public;
grant execute on function public.submit_weekly_challenge(text,jsonb) to authenticated;

-- Saison de 6 semaines. Le score n'est pas un compteur de clics :
-- maîtrise 300 · régularité 200 · rétention espacée 200 · défis 200 · correction de faiblesses 100.
create or replace function public.get_season_leaderboard(p_course_key text default 'bipolar',p_limit integer default 100)
returns table(rank bigint,user_id uuid,display_name text,cohort_code text,season_score integer,components jsonb,coat_wins integer)
language plpgsql security definer set search_path=public as $$
declare
  v_week date:=date_trunc('week',current_date)::date;
  v_anchor date:=date '2026-01-05';
  v_start date;
  v_end date;
begin
  v_start:=v_anchor+(((v_week-v_anchor)/42)*42);
  v_end:=v_start+42;
  return query
  with active_users as (
    select p.id user_id,p.display_name,p.cohort_code
    from public.profiles p
    where exists(select 1 from public.learning_events e where e.user_id=p.id and e.course_key=p_course_key and e.created_at>=v_start and e.created_at<v_end)
       or exists(select 1 from public.challenge_attempts a where a.user_id=p.id and a.course_key=p_course_key and a.submitted_at>=v_start and a.submitted_at<v_end)
  ),
  mastery as (
    select s.user_id,avg(s.mastery_score)::numeric m
    from public.skill_mastery s where s.course_key=p_course_key group by s.user_id
  ),
  activity_days as (
    select e.user_id,count(distinct e.created_at::date)::int d
    from public.learning_events e where e.course_key=p_course_key and e.created_at>=v_start and e.created_at<v_end group by e.user_id
  ),
  seen as (
    select e.user_id,e.competency_key,count(distinct e.created_at::date)::int d
    from public.learning_events e where e.course_key=p_course_key and e.created_at>=v_start and e.created_at<v_end
    group by e.user_id,e.competency_key
  ),
  spaced as (
    select s.user_id,case when count(*)=0 then 0::numeric else (count(*) filter(where s.d>=2))::numeric/count(*)::numeric end ratio
    from seen s group by s.user_id
  ),
  maint as (
    select m.user_id,avg(m.score)::numeric/100.0 ratio
    from public.maintenance_reviews m where m.course_key=p_course_key and m.completed_at>=v_start and m.completed_at<v_end group by m.user_id
  ),
  challenge_avg as (
    select a.user_id,avg(a.score)::numeric av
    from public.challenge_attempts a where a.course_key=p_course_key and a.submitted_at>=v_start and a.submitted_at<v_end group by a.user_id
  ),
  challenge_ranked as (
    select a.user_id,a.challenge_key,rank() over(partition by a.challenge_key order by a.score desc,a.submitted_at asc) rnk
    from public.challenge_attempts a where a.course_key=p_course_key and a.submitted_at>=v_start and a.submitted_at<v_end
  ),
  wins as (
    select c.user_id,count(*)::int w from challenge_ranked c where c.rnk=1 group by c.user_id
  ),
  corrected as (
    select distinct e1.user_id,e1.competency_key
    from public.learning_events e1
    where e1.course_key=p_course_key and e1.created_at>=v_start and e1.created_at<v_end and e1.is_correct=false
      and exists(
        select 1 from public.learning_events e2
        where e2.user_id=e1.user_id and e2.course_key=e1.course_key and e2.competency_key=e1.competency_key
          and e2.is_correct=true and e2.created_at>e1.created_at and e2.created_at<v_end
      )
  ),
  corrected_count as (
    select c.user_id,count(*)::int n from corrected c group by c.user_id
  ),
  parts as (
    select u.user_id,u.display_name,u.cohort_code,
      round(least(300::numeric,coalesce(m.m,0)*3))::int mastery_pts,
      round(least(200::numeric,coalesce(ad.d,0)::numeric/18.0*200))::int regularity_pts,
      round(least(200::numeric,greatest(coalesce(sp.ratio,0),coalesce(mt.ratio,0))*200))::int retention_pts,
      round(least(200::numeric,coalesce(ca.av,0)/100.0*200))::int challenge_pts,
      round(least(100::numeric,coalesce(cc.n,0)::numeric/8.0*100))::int correction_pts,
      coalesce(w.w,0)::int coat_wins
    from active_users u
    left join mastery m on m.user_id=u.user_id
    left join activity_days ad on ad.user_id=u.user_id
    left join spaced sp on sp.user_id=u.user_id
    left join maint mt on mt.user_id=u.user_id
    left join challenge_avg ca on ca.user_id=u.user_id
    left join corrected_count cc on cc.user_id=u.user_id
    left join wins w on w.user_id=u.user_id
  ),
  scored as (
    select p.*,(p.mastery_pts+p.regularity_pts+p.retention_pts+p.challenge_pts+p.correction_pts)::int total,
      jsonb_build_object(
        'mastery',p.mastery_pts,
        'regularity',p.regularity_pts,
        'retention',p.retention_pts,
        'challenges',p.challenge_pts,
        'correction',p.correction_pts,
        'season_start',v_start,
        'season_end',v_end
      ) comp
    from parts p
  ),
  ranked as (
    select rank() over(order by s.total desc,s.mastery_pts desc,s.challenge_pts desc,s.display_name) rnk,s.* from scored s
  )
  select r.rnk,r.user_id,r.display_name,r.cohort_code,r.total,r.comp,r.coat_wins
  from ranked r
  order by r.rnk,r.display_name
  limit greatest(1,least(coalesce(p_limit,100),500));
end;$$;
revoke all on function public.get_season_leaderboard(text,integer) from public;
grant execute on function public.get_season_leaderboard(text,integer) to authenticated;
