# DataOut

Learn SQL by doing, on real data. DataOut is a browser-based learning site: short lessons, a query editor
that runs entirely in your browser, tier exams, a daily exercise and a notebook-style playground. Python and data
engineering tracks are planned.

There is no query server. SQL runs in the browser with [sql.js](https://github.com/sql-js/sql.js) (SQLite compiled
to WebAssembly) inside a Web Worker, so a runaway query can be stopped (or times out after 15 seconds) without freezing the page, and the datasets are static files served with the app. The only backend is
[Supabase](https://supabase.com), used for sign-in and for saving lesson progress.

## What is in it

| Area | What it does |
| ---- | ------------ |
| **Learn** (`/learn/sql`) | 41 SQL lessons in four tiers: Beginner (10), Intermediate (12), Advanced (10) and Expert (9). Each lesson has a written **Learn** tab, a **Practice** test on small made-up tables with hidden cases, and three **On real data** challenges. Lessons unlock one after another. |
| **Tier exams** (`/learn/sql/exam/:tier`) | A separate page per tier with 10 questions on real data and no hints. Pass at 70 points out of 100 to unlock the next tier. |
| **Daily exercise** (`/exercise/sql`) | One real-world question a day on real data, picked from the date (UTC), with a walkthrough that unlocks after solving or after three attempts. |
| **Playground** (`/playground/sql`) | A notebook for SQL: SQL and Markdown cells sharing one in-memory database, built-in datasets, CSV upload, and export/import of notebooks. |
| **Profile** (`/profile`) | Your name, overall progress and badges for finished tiers, passed exams and milestones. |
| **Accounts** | Email/password, Google and GitHub sign-in through Supabase. The lesson, exercise and playground pages and the profile need a login; the overview pages and Settings are public. |
| **Themes** | Nine themes in Settings, including three special editions (Endgame, Iron Man and Captain America). The choice is saved per browser. |

## Tech stack

- [React 19](https://react.dev), [React Router 7](https://reactrouter.com) and [Vite 8](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com) (tokens defined in `src/index.css`)
- [sql.js](https://github.com/sql-js/sql.js) for SQLite in the browser, run in a Web Worker (`src/workers/sqlWorker.js`, client in `src/lib/sqlWorkerClient.js`)
- [CodeMirror 6](https://codemirror.net) for the SQL editor (syntax highlighting and table/column autocomplete), loaded on demand
- [Supabase](https://supabase.com) (`@supabase/supabase-js`) for auth and progress
- [react-markdown](https://github.com/remarkjs/react-markdown) with `remark-gfm` for lesson documents
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting
