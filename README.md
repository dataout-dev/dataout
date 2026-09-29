# DataOut

Learn SQL by doing, on real data. DataOut is a browser-based learning site: short lessons, a query editor
that runs entirely in your browser, tier exams, a daily exercise and a notebook-style playground. A Python path with
Foundations, Core Python, Object-Oriented Python, Python for Data and Professional Python is included, Algorithms and
Problem Solving is planned, and a Git path teaches real git commands against real, seeded repositories, also entirely
in the browser.

There is no query server. SQL runs in the browser with [sql.js](https://github.com/sql-js/sql.js) (SQLite compiled
to WebAssembly) inside a Web Worker, so a runaway query can be stopped (or times out after 15 seconds) without freezing the page, and the datasets are static files served with the app. The only backend is
[Supabase](https://supabase.com), used for sign-in and for saving lesson progress.

## What is in it

| Area | What it does |
| ---- | ------------ |
| **Learn** (`/learn/sql`) | 41 SQL lessons in four tiers: Beginner (10), Intermediate (12), Advanced (10) and Expert (9). Each lesson has a written **Learn** tab, a **Practice** test on small made-up tables with hidden cases, and three **On real data** challenges. Lessons unlock one after another. |
| **Learn Python** (`/learn/python`) | 269 lessons across five live tiers: Foundations (50 lessons) and Core Python (58 lessons, including a 17-lesson regular expressions course) are open from the start; Object-Oriented Python (41 lessons), Python for Data (78 lessons: NumPy, pandas, visualisation, statistics, machine learning and data sources) and Professional Python (42 lessons: testing, typing, internals, performance, concurrency, packaging and building applications) unlock progressively, one tier's exam at a time. Python runs in your browser with Pyodide, including NumPy, pandas, matplotlib, SciPy, statsmodels, scikit-learn, SymPy, DuckDB, Polars, BeautifulSoup, SQLAlchemy, NetworkX, pytest and pydantic. Each lesson has a written **Learn** tab with runnable examples, a **Practice** test with hidden cases (or a five-question check for reading and learn-heavy lessons), and three **On real data** challenges on the NYC Flights 2013, Palmer Penguins, Spotify 2024 and Chinook datasets. Every tier ends with an exam of 10 questions. Algorithms and Problem Solving is planned. |
| **Learn Git** (`/learn/git`) | 14 lessons in the first of four planned tiers, Git Foundations, open from the start: the core loop (init, add, commit, log), status and diff, staging, .gitignore, and undoing mistakes (restore, reset, revert), ending in a cleanup workshop. Git runs in your browser with [isomorphic-git](https://isomorphic-git.org) against a real, seeded repository per lesson — a terminal for typing real git commands, and a small file editor for the handful of lessons that need it. Each hands-on lesson has a written **Learn** tab and a **Practice** exercise graded on the resulting repository state (commit history, file contents, branch, tags), not on the literal commands typed. The tier ends with a 10-question exam. Branching & Merging, Remotes & Collaboration, and Advanced Git & Real Workflows are planned. |
| **Tier exams** (`/learn/sql/exam/:tier`) | A separate page per tier with 10 questions on real data and no hints. Pass at 70 points out of 100 to unlock the next tier. |
| **Daily exercise** (`/exercise/sql`) | One real-world question a day on real data, picked from the date (UTC), with a walkthrough that unlocks after solving or after three attempts. |
| **Playground** (`/playground/sql`) | A notebook for SQL: SQL and Markdown cells sharing one in-memory database, built-in datasets, CSV upload, and export/import of notebooks. |
| **Profile** (`/profile`) | Your name, overall progress and badges for finished tiers, passed exams and milestones. |
| **Python playground** (`/playground/python`) | A notebook for Python: Python and Markdown cells sharing one session, the built-in datasets as `rows('palmer-penguins')`, pandas and numpy loaded on first import, a Stop button, and export/import of notebooks. |
| **Accounts** | Email/password, Google and GitHub sign-in through Supabase. The lesson, exercise and playground pages and the profile need a login; the overview pages and Settings are public. |
| **Themes** | Nine themes in Settings, including three special editions (Endgame, Iron Man and Captain America). The choice is saved per browser. |

## Tech stack

- [React 19](https://react.dev), [React Router 7](https://reactrouter.com) and [Vite 8](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com) (tokens defined in `src/index.css`)
- [sql.js](https://github.com/sql-js/sql.js) for SQLite in the browser, run in a Web Worker (`src/workers/sqlWorker.js`, client in `src/lib/sqlWorkerClient.js`)
- [Pyodide](https://pyodide.org) (Python compiled to WebAssembly) in a Web Worker for the Python playground (`src/workers/pythonWorker.js`), loaded from a CDN on first use
- [isomorphic-git](https://isomorphic-git.org) and [LightningFS](https://github.com/isomorphic-git/lightning-fs) in a Web Worker for the Git path (`src/workers/gitWorker.js`) — a real git implementation against a real, in-browser virtual filesystem
- [CodeMirror 6](https://codemirror.net) for the SQL editor (syntax highlighting and table/column autocomplete), loaded on demand
- [Supabase](https://supabase.com) (`@supabase/supabase-js`) for auth and progress
- [react-markdown](https://github.com/remarkjs/react-markdown) with `remark-gfm` for lesson documents
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting

## Data and credits

Every dataset lives in `public/datasets/` and is described, with its author, source, licence and the changes made to it, in `public/datasets/manifest.json`. The same details are shown next to the data in the playground. If you reuse a dataset, keep its attribution and licence.

| Dataset | Author | Source | Licence | Changes |
| ------- | ------ | ------ | ------- | ------- |
| Most Streamed Spotify Songs 2024 | Nidula Elgiriyewithana | [Kaggle](https://www.kaggle.com/datasets/nelgiriyewithana/most-streamed-spotify-songs-2024) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Modified: converted to SQLite, text decoding fixed, numbers and dates cleaned, one empty column and 2 duplicate rows removed. |
| Palmer Penguins | Dr. Kristen Gorman and the Palmer Station LTER; packaged by Allison Horst, Alison Hill and Kristen Gorman | [palmerpenguins](https://allisonhorst.github.io/palmerpenguins/) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Converted to SQLite, an `id` column added, missing values stored as NULL. |
| Chinook music store | Luis Rocha | [chinook-database](https://github.com/lerocha/chinook-database) | [MIT](https://opensource.org/license/mit) | Used unchanged (release v1.4.5). |
| NYC flights 2013 | Hadley Wickham; original data from the US Bureau of Transportation Statistics and other US government sources | [nycflights13](https://github.com/tidyverse/nycflights13) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Converted to SQLite, some columns dropped and two date columns added, every 10th flight kept. |

The Spotify data is licensed under CC BY-SA 4.0, so the modified database in this repository is shared under the same licence. The Chinook customers, employees and sales are made up; only the music catalogue comes from real libraries.

Third-party software keeps its own licences, including [sql.js](https://github.com/sql-js/sql.js) (MIT), [CodeMirror](https://codemirror.net) (MIT), [React](https://react.dev) (MIT) and the other packages listed in `package.json`.

## Licence

The code and lesson text in this repository are released under the [MIT License](LICENSE). The MIT licence covers the code and lessons only. The datasets are covered by the licences in the table above, not by the MIT licence.
