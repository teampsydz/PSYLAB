# PsyLab V51 — Adaptive Clinical Learning

V51 adds a shared learning engine that can later be reused by every Lab.

## What is new

- mobile bottom-navigation fix on PsyLab and BipolarLab;
- first-visit “Why BipolarLab?” guide + permanent access button;
- adaptive error tracking by competency rather than only by question;
- targeted correction after wrong answers;
- personal learning analytics: active days, active minutes, attempts, accuracy, weak points;
- administrator analytics page (`admin.html`);
- Maintenance Mode / Cold Cases for delayed retention testing;
- Psychometrics Bench integrated between N1 and N2 without reproducing protected full scales;
- “Fauteuil du Staff / Staff Chair” weekly resident challenge with one ranked attempt and confidence calibration;
- Netlify-ready configuration so the same private GitHub repository can be deployed as a second public mirror if `pages.dev` is unreachable on Wi-Fi;
- confirmation links use `window.location.origin`, allowing both Cloudflare Pages and the future Netlify mirror once both URLs are whitelisted in Supabase.

## Important: keep your existing `psylab-config.js`

This package deliberately does **not** contain `psylab-config.js`. Keep the configured file already present in GitHub; it contains the Supabase project URL and the public Publishable key.

## Supabase migration

Run `supabase_v51_migration.sql` once in Supabase SQL Editor after the V50 schema. It creates learning analytics, adaptive mastery, study sessions, maintenance reviews, weekly challenge templates and leaderboards.

For administrator analytics, find your own user UUID in **Supabase → Authentication → Users**, then run:

```sql
insert into public.platform_admins(user_id)
values ('YOUR-USER-UUID')
on conflict do nothing;
```

Then open `/admin.html` while signed in with that account.

## Netlify mirror

After GitHub contains V51, create a Netlify site from the same private `PSYLAB` repository. Use the repository root as the publish directory; no build command is required. `netlify.toml` is already included.

When Netlify gives you an address such as `https://something.netlify.app`, add both:

- `https://something.netlify.app`
- `https://something.netlify.app/**`

under **Supabase → Authentication → URL Configuration → Redirect URLs**.

The Cloudflare Pages deployment can remain active as a backup.


## V51.1 hotfix
- Staff Chair dashboard deep-link now opens the weekly challenge modal directly instead of only landing on BipolarLab.
- The first-visit BipolarLab guide no longer masks a Staff Chair deep-link.
