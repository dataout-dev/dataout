# DataOut

Learn SQL by doing, on real data. DataOut is a browser-based learning site: short lessons, a query editor
that runs entirely in your browser, tier exams, a daily exercise and a notebook-style playground. Python and data
engineering tracks are planned.

There is no query server. SQL runs in the browser with [sql.js](https://github.com/sql-js/sql.js) (SQLite compiled
to WebAssembly), and the datasets are static files served with the app. The only backend is
[Supabase](https://supabase.com), used for sign-in and for saving lesson progress.

## What is in it

| Area | What it does |
| ---- | ------------ |
| **Learn** (`/learn/sql`) | 41 SQL lessons in four tiers: Beginner (10), Intermediate (12), Advanced (10) and Expert (9). Each lesson has a written **Learn** tab, a **Practice** test on small made-up tables with hidden cases, and an **On real data** challenge. Lessons unlock one after another. |
| **Tier exams** (`/learn/sql/exam/:tier`) | A separate page per tier with 4 or 5 questions on real data and no hints. Pass at 70% to unlock the next tier. |
| **Daily exercise** (`/exercise/sql`) | One real-world question a day on real data, picked from the date (UTC), with a walkthrough that unlocks after solving or after three attempts. |
| **Playground** (`/playground/sql`) | A notebook for SQL: SQL and Markdown cells sharing one in-memory database, built-in datasets, CSV upload, and export/import of notebooks. |
| **Accounts** | Email/password, Google and GitHub sign-in through Supabase. The lesson, exercise and playground pages and the profile need a login; the overview pages and Settings are public. |
| **Themes** | Seven themes in Settings, including a special edition. The choice is saved per browser. |

## Tech stack

- [React 19](https://react.dev), [React Router 7](https://reactrouter.com) and [Vite 8](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com) (tokens defined in `src/index.css`)
- [sql.js](https://github.com/sql-js/sql.js) for SQLite in the browser
- [Supabase](https://supabase.com) (`@supabase/supabase-js`) for auth and progress
- [react-markdown](https://github.com/remarkjs/react-markdown) with `remark-gfm` for lesson documents
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting

## Getting started

You need **Node.js 20.19 or newer** (or 22.12+) and a Supabase project.

```bash
git clone https://github.com/dataout-dev/dataout.git
cd dataout
npm install
```

Create a `.env` file in the project root (it is git-ignored):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Then start the dev server:

```bash
npm run dev
```

### Scripts

| Command | What it does |
| ------- | ------------ |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |
| `npm run check:curriculum` | Run every lesson, exam question and reference query against the real datasets (see below) |
| `npm run check:exercises` | Run every daily exercise against its dataset |

## Supabase setup

Sign-in works out of the box once the environment variables are set. To turn on Google and GitHub, enable those
providers in **Authentication > Providers** and add your site URL, plus `http://localhost:5173`, to the allowed redirect
URLs. The app sends people to `/learn` after signing in, so that URL must be allowed.

Progress is stored in one table. This is the shape the app expects, so check it against your project:

```sql
create table public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.progress enable row level security;

create policy "read own progress"   on public.progress for select using (auth.uid() = user_id);
create policy "insert own progress" on public.progress for insert with check (auth.uid() = user_id);
create policy "update own progress" on public.progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

A completed lesson is a row with the lesson's id, such as `sql-where-basics`. A passed tier exam is a row with
`exam-<tier>`, such as `exam-beginner`. The display name lives in the user's `display_name` metadata.

Not everything is in Supabase yet. Results of the real-data challenges, exam answers, daily-exercise progress,
playground notebooks and uploaded CSV files are kept in the browser (localStorage and IndexedDB).

## Project structure

```
public/
  datasets/           SQLite files and manifest.json (see "Datasets")
  sql-wasm.wasm       the SQLite engine
scripts/
  build-real-datasets.mjs   builds the penguins, Chinook and flights databases
  build-spotify-2024.mjs    builds the Spotify database
  check-curriculum.mjs      verifies all lessons and exams
  check-exercises.mjs       verifies the daily exercises
src/
  components/         layout, route guard, icons, Markdown, notebook cells
    challenge/        the editor, schema card, feedback and walkthrough shared by exercises, lessons and exams
  content/lessons/    one Markdown document per lesson, named after the lesson id
  context/            auth and theme providers
  data/
    curriculum/       tiers, lessons and exams (the SQL path)
    exercises/        the daily exercise bank
  lib/                SQL engine, grading, CSV import, progress helpers
  pages/              one component per route
vercel.json           rewrites every route to index.html (single-page app)
```

## Adding content

Nothing needs a build step or a server. After any change to lessons, exams or exercises, run the matching check and
make sure it ends with `All OK`.

### A lesson

Add an object to the tier's file in `src/data/curriculum/` (`beginner.js`, `intermediate.js`, `advanced.js` or
`expert.js`), and a Markdown document at `src/content/lessons/<id>.md`. Order in the array is the order in the path.

| Field | Meaning |
| ----- | ------- |
| `id` | Unique and stable. It is the progress key and the document's file name. |
| `title`, `titleAccent`, `topic`, `blurb`, `minutes`, `skills` | Text shown on the path page and the lesson header |
| `concept`, `prompt`, `successNote` | Short text on the Practice tab (`backticks` become inline code) |
| `schema` | The `CREATE TABLE` statements for the practice test |
| `cases` | A list of `[label, INSERT statements]`. The first is the visible sample, the rest are hidden. |
| `solution` | The reference answer. Expected rows are whatever it returns on each case, so nothing goes stale. |
| `orderMatters` | Set to `true` when the task asks for a specific row order |
| `traps` | Plausible wrong answers. `check:curriculum` fails if the hidden cases don't catch them. |
| `real` | The real-data challenge: `dataset`, `title`, `brief`, `reference`, `orderMatters`, `walkthrough` |

A lesson can instead be multiple choice: give it `kind: 'mcq'` with `question`, `options` (four), `correct` (`'A'` to
`'D'`) and `why`, and leave out `schema`, `cases` and `real`. Lessons whose test is a script (creating a view,
updating rows) work the same way: the whole script runs on a fresh database, and the result of its last query is compared.

Write briefs that name every column to return, in order. Answers are compared by position, not by column name.
Give every ordering a tie-breaker; the checker flags orderings that depend on how rows happen to be stored.

### A tier exam question

Add an entry under the tier in `src/data/curriculum/exams.js`: `id`, `points`, `dataset`, `task`, `reference` and
`orderMatters`. A tier is passed at 70% of its total points.

### A daily exercise

Append (never reorder) an object to `src/data/exercises/sql.js`. The exercise for a day is chosen by counting
days since `EXERCISE_START` in `src/lib/exercises.js`, so reordering changes past days. The bank repeats when it runs out.

## Datasets

The datasets are SQLite files in `public/datasets/`, listed in `public/datasets/manifest.json`. The manifest drives the
playground's dataset picker and the attribution shown next to every challenge. It records where each dataset came from,
its license and what was changed.

| Dataset | Used for | Source | License |
| ------- | -------- | ------ | ------- |
| Palmer Penguins | Beginner lessons and exam | [palmerpenguins](https://allisonhorst.github.io/palmerpenguins/) | CC0 1.0 |
| Chinook | Intermediate lessons and exam | [chinook-database](https://github.com/lerocha/chinook-database) | MIT |
| NYC flights 2013 | Advanced and Expert lessons and exams | [nycflights13](https://github.com/tidyverse/nycflights13) | CC0 1.0 |
| Most Streamed Spotify Songs 2024 | Playground and the daily exercises | [Kaggle](https://www.kaggle.com/datasets/nelgiriyewithana/most-streamed-spotify-songs-2024) | CC BY-SA 4.0 |

The Spotify data is share-alike, so the modified database in this repository carries the same license.

The raw downloads are not kept in the repository. To rebuild the databases, download the sources listed at the top of
each script and run `node scripts/build-real-datasets.mjs "<folder with the files>"` or
`node scripts/build-spotify-2024.mjs "<path to the CSV>"`.

To add a dataset, build a small `.sqlite` file (aim for about 5 MB or less, since the browser downloads the whole file),
put it in `public/datasets/`, and add an entry to `manifest.json` with its author, source, license and the changes you
made. File names must be lower case letters, digits and hyphens, ending in `.sqlite`.

## Deployment

The site is a static single-page app and deploys to [Vercel](https://vercel.com). Add the two `VITE_SUPABASE_*`
variables to the project's environment variables. `vercel.json` sends every route to `index.html`, while files in
`public/` (including the datasets and the WebAssembly engine) are still served directly.

## Known limits

- SQL runs on the main thread, so a query that never finishes (such as an accidental triple cross join) freezes the tab.
  Moving it to a Web Worker would fix that.
- Daily-exercise answers and lesson reference queries are part of the JavaScript bundle. That is fine for a learning
  site, but they are not secret.
- Python and Data engineering are shown as "coming soon".

## Working with the repository

Work happens on `dev` and is merged into `main`. If you use Windows with the project inside OneDrive, git may stop
while switching branches with "Deletion of directory ... failed", because OneDrive marks folders read-only. Clear the flag
with `attrib -R <folder>` and try again.

## License

The code does not have a license file yet, so all rights are reserved by default. The datasets keep their own
licenses, listed above and in `public/datasets/manifest.json`.
