# World Cup 2026 Bracket

A multi-user FIFA World Cup 2026 bracket pool. React + Vite frontend hosted on GitHub Pages, Supabase for auth + storage.

- Email magic-link sign in
- 12 groups × 6 matches, full 48-team draw seeded
- Knockout bracket auto-populates from your group predictions
- Per-match picks lock at kickoff (enforced by row-level security)
- Public leaderboard, click any player to view their bracket read-only

## Local dev

```sh
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project

npm install
npm run dev
```

## Architecture

- `src/data/` — static seed data (48 teams, 104 matches with UTC kickoff times)
- `src/lib/` — Supabase client, auth, scoring, bracket resolver
- `src/components/` — UI building blocks
- `src/pages/` — route components

The database schema lives in your Supabase project. See [Supabase setup](#supabase-setup).

## Supabase setup

The migration is already applied to the linked project. To bootstrap a new one:

1. Create a Supabase project
2. Apply `supabase/migrations/0001_init.sql` (the schema is in this repo for reference)
3. Run the seed script: `node scripts/print-seed-sql.mjs > seed.sql`, then paste `seed.sql` into the Supabase SQL editor
4. Add admin emails: `insert into public.admin_emails(email) values ('you@example.com');`

## Scoring

| Round         | Points per correct pick      |
|---------------|------------------------------|
| Group winner  | 1 pt                         |
| Exact score   | +1 pt bonus                  |
| Round of 32   | 2 pts                        |
| Round of 16   | 4 pts                        |
| Quarterfinal  | 8 pts                        |
| Semifinal     | 16 pts                       |
| Third place   | 4 pts                        |
| Final         | 32 pts (correct champion)    |

Knockouts use "round-of-survival" scoring: if you picked the actual winning team to win their knockout match, you get the round points — even if your earlier predictions had them on a different path.

## Deploying

GitHub Pages deploy is wired up in `.github/workflows/deploy.yml`. On push to `main`:

1. Vite builds with `VITE_BASE_PATH=/<repo-name>/`
2. `index.html` is duplicated as `404.html` so React Router survives reloads
3. Artifact is uploaded to GitHub Pages

Set the following repo **Variables** (Settings → Secrets and variables → Actions → Variables) so the workflow knows where Supabase is:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_BASE_PATH` (optional — override for custom domain or user/org pages)

Enable Pages: Settings → Pages → Build and deployment → Source = "GitHub Actions".

## Admin

Sign in with an email present in `public.admin_emails`. Visit `/admin` to enter match results. Picks rescore automatically the next time anyone loads the leaderboard.

## Schedule data

Group matchups and knockout structure follow the published 2026 schedule. Kickoff times are stored as UTC. Verify against [fifa.com](https://www.fifa.com/) before sharing the link — times can shift, and any change after a pick locks won't unlock the pick.
