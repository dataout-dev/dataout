import { dat, py } from './common.js'

const num = (c) => dat({ ...c, hidden: 'import pandas as pd\nimport numpy as np\n' + (c.hidden ?? '') })

export const sourcesLessonsA = [
  {
    id: 'py-sql-from-python',
    title: 'SQL from Python: sqlite3, read_sql and SQLAlchemy',
    blurb: 'Querying with sqlite3, pandas read_sql/to_sql, and SQLAlchemy Core.',
    kind: 'code',
    practice: {
      prompt: 'Write `query_df(conn, min_total)`: run a **parameterised** query against an `orders(id, total)` table on the open sqlite3 connection `conn`, returning rows with `total >= min_total` as a DataFrame.',
      starter: 'import pandas as pd\n\ndef query_df(conn, min_total):\n    ...\n',
      solution: py`import pandas as pd

def query_df(conn, min_total):
    return pd.read_sql("SELECT * FROM orders WHERE total >= ?", conn, params=(min_total,))`,
      samples: ['import sqlite3\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE orders (id INTEGER, total REAL)")\nconn.executemany("INSERT INTO orders VALUES (?, ?)", [(1, 50.0), (2, 150.0), (3, 200.0)])\nquery_df(conn, 100).to_dict("records")'],
      cases: [
        ['Rows above the minimum', 'import sqlite3\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE orders (id INTEGER, total REAL)")\nconn.executemany("INSERT INTO orders VALUES (?, ?)", [(1, 50.0), (2, 150.0), (3, 200.0)])\nquery_df(conn, 100).to_dict("records")'],
        ['A minimum that matches everything', 'import sqlite3\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE orders (id INTEGER, total REAL)")\nconn.executemany("INSERT INTO orders VALUES (?, ?)", [(1, 50.0), (2, 60.0)])\nlen(query_df(conn, 0))'],
        ['A minimum that matches nothing', 'import sqlite3\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE orders (id INTEGER, total REAL)")\nconn.executemany("INSERT INTO orders VALUES (?, ?)", [(1, 50.0)])\nlen(query_df(conn, 1000))'],
        ['The boundary is inclusive', 'import sqlite3\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE orders (id INTEGER, total REAL)")\nconn.executemany("INSERT INTO orders VALUES (?, ?)", [(1, 100.0)])\nlen(query_df(conn, 100))'],
      ],
      traps: [
        py`import pandas as pd

def query_df(conn, min_total):
    return pd.read_sql("SELECT * FROM orders WHERE total > ?", conn, params=(min_total,))`,
        py`import pandas as pd

def query_df(conn, min_total):
    return pd.read_sql("SELECT * FROM orders", conn)`,
      ],
    },
    real: [
      num({
        title: 'A real Chinook slice through sqlite3',
        use: ['tracks'],
        starter: 'import sqlite3\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE t (name TEXT, price REAL)")\nconn.executemany("INSERT INTO t VALUES (?, ?)", [(t["Name"], t["UnitPrice"]) for t in tracks[:100]])\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. conn already holds 100 real tracks, loaded into an in-memory SQL table.',
        brief: 'Run a parameterised query for rows with `price >= 0.99`, and store the count (an `int`) in `answer`.',
        reference: py`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (name TEXT, price REAL)")
conn.executemany("INSERT INTO t VALUES (?, ?)", [(t["Name"], t["UnitPrice"]) for t in tracks[:100]])
result = pd.read_sql("SELECT * FROM t WHERE price >= ?", conn, params=(0.99,))
answer = int(len(result))`,
        walkthrough: 'A parameterised query (`?` plus `params=`) safely inserts a Python value into the SQL without ever building the query text by hand — the same idea whether the data came from a real dataset or a toy example.',
        traps: [py`import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (name TEXT, price REAL)")
conn.executemany("INSERT INTO t VALUES (?, ?)", [(t["Name"], t["UnitPrice"]) for t in tracks[:100]])
result = pd.read_sql("SELECT * FROM t WHERE price > ?", conn, params=(0.99,))
answer = int(len(result))`],
      }),
      num({
        title: 'Writing a DataFrame back to SQL',
        use: ['genres'],
        starter: 'import sqlite3\nconn = sqlite3.connect(":memory:")\ndf = pd.DataFrame(genres[:10])\nanswer = ...\n',
        given: '# genres is a list of dictionaries. df already holds 10 real genre rows.',
        brief: 'Use `df.to_sql("g", conn, index=False)` to write the table, then read back `SELECT COUNT(*) AS n FROM g` with `pd.read_sql`. Store the count, as an `int`, in `answer`.',
        reference: py`import sqlite3
conn = sqlite3.connect(":memory:")
df = pd.DataFrame(genres[:10])
df.to_sql("g", conn, index=False)
result = pd.read_sql("SELECT COUNT(*) AS n FROM g", conn)
answer = int(result["n"].iloc[0])`,
        walkthrough: '`to_sql` creates the table from the DataFrame\'s own columns and dtypes, the mirror image of `read_sql` reading one back.',
        traps: [py`import sqlite3
conn = sqlite3.connect(":memory:")
df = pd.DataFrame(genres[:10])
df.head(5).to_sql("g", conn, index=False)
result = pd.read_sql("SELECT COUNT(*) AS n FROM g", conn)
answer = int(result["n"].iloc[0])`],
      }),
      num({
        title: 'SQLAlchemy Core: a parameterised text() query',
        use: ['tracks'],
        starter: 'from sqlalchemy import create_engine, text\nengine = create_engine("sqlite://")\nwith engine.begin() as conn:\n    conn.execute(text("CREATE TABLE t (name TEXT, price REAL)"))\n    conn.execute(text("INSERT INTO t VALUES (:name, :price)"), [{"name": t["Name"], "price": t["UnitPrice"]} for t in tracks[:50]])\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. engine already holds 50 real tracks in an in-memory SQLite table.',
        brief: 'Using `pd.read_sql(text("SELECT * FROM t WHERE price >= :p"), engine, params={"p": 1.0})` (SQLAlchemy\'s named-parameter style), store the row count, as an `int`, in `answer`.',
        reference: py`from sqlalchemy import create_engine, text
engine = create_engine("sqlite://")
with engine.begin() as conn:
    conn.execute(text("CREATE TABLE t (name TEXT, price REAL)"))
    conn.execute(text("INSERT INTO t VALUES (:name, :price)"), [{"name": t["Name"], "price": t["UnitPrice"]} for t in tracks[:50]])
result = pd.read_sql(text("SELECT * FROM t WHERE price >= :p"), engine, params={"p": 1.0})
answer = int(len(result))`,
        walkthrough: 'SQLAlchemy\'s `text()` with named parameters (`:p`, matched to a dict) is an alternative, often clearer, style to the plain `?`-placeholder parameters sqlite3 uses directly; it needs a real SQLAlchemy `Engine`, not a raw sqlite3 connection.',
        traps: [py`from sqlalchemy import create_engine, text
engine = create_engine("sqlite://")
with engine.begin() as conn:
    conn.execute(text("CREATE TABLE t (name TEXT, price REAL)"))
    conn.execute(text("INSERT INTO t VALUES (:name, :price)"), [{"name": t["Name"], "price": t["UnitPrice"]} for t in tracks[:50]])
result = pd.read_sql(text("SELECT * FROM t WHERE price < :p"), engine, params={"p": 1.0})
answer = int(len(result))`],
      }),
    ],
  },
  {
    id: 'py-duckdb',
    title: 'DuckDB: SQL over DataFrames and Parquet',
    blurb: 'Querying a DataFrame with SQL, reading Parquet/CSV directly, and window functions.',
    kind: 'code',
    practice: {
      prompt: 'Write `duck_top5(df)`: using `duckdb.sql`, return the 5 carriers with the most rows in `df` (columns `carrier`), as a list of `(carrier, count)` tuples, most first.',
      starter: 'import duckdb\n\ndef duck_top5(df):\n    ...\n',
      solution: py`import duckdb

def duck_top5(df):
    result = duckdb.sql("SELECT carrier, COUNT(*) AS n FROM df GROUP BY carrier ORDER BY n DESC LIMIT 5")
    return result.fetchall()`,
      samples: ['import pandas as pd\nduck_top5(pd.DataFrame({"carrier": ["A", "A", "B", "B", "B", "C"]}))'],
      cases: [
        ['A small mix of carriers', 'import pandas as pd\nduck_top5(pd.DataFrame({"carrier": ["A", "A", "B", "B", "B", "C"]}))'],
        ['Fewer than 5 distinct carriers', 'import pandas as pd\nlen(duck_top5(pd.DataFrame({"carrier": ["A", "A", "B"]})))'],
        ['Result type is a list of tuples', 'import pandas as pd\ntype(duck_top5(pd.DataFrame({"carrier": ["A", "B"]}))[0]) is tuple'],
        ['More than 5 distinct carriers, keeps exactly 5', 'import pandas as pd\nlen(duck_top5(pd.DataFrame({"carrier": ["A"] * 6 + ["B"] * 5 + ["C"] * 4 + ["D"] * 3 + ["E"] * 2 + ["F"] * 1})))'],
      ],
      traps: [
        py`import duckdb

def duck_top5(df):
    result = duckdb.sql("SELECT carrier, COUNT(*) AS n FROM df GROUP BY carrier ORDER BY n ASC LIMIT 5")
    return result.fetchall()`,
        py`import duckdb

def duck_top5(df):
    result = duckdb.sql("SELECT carrier, COUNT(*) AS n FROM df GROUP BY carrier ORDER BY n DESC LIMIT 3")
    return result.fetchall()`,
      ],
    },
    real: [
      dat({
        title: 'Top 5 real carriers by flight count',
        use: ['flights'],
        starter: 'import duckdb\nimport pandas as pd\ndf = pd.DataFrame(flights)\nanswer = ...\n',
        given: '# flights is already loaded as df, a real DataFrame.',
        brief: 'Store the top 5 `(carrier, count)` pairs by flight count, most first, in `answer`.',
        reference: py`import duckdb
import pandas as pd
df = pd.DataFrame(flights)
result = duckdb.sql("SELECT carrier, COUNT(*) AS n FROM df GROUP BY carrier ORDER BY n DESC LIMIT 5")
answer = result.fetchall()`,
        walkthrough: 'DuckDB can query a pandas DataFrame directly by name, with no separate loading step — genuinely useful once a query gets more complex than pandas\' own syntax reads comfortably.',
        traps: [py`import duckdb
import pandas as pd
df = pd.DataFrame(flights)
result = duckdb.sql("SELECT carrier, COUNT(*) AS n FROM df GROUP BY carrier ORDER BY n ASC LIMIT 5")
answer = result.fetchall()`],
      }),
      dat({
        title: 'A DuckDB window function on real delays',
        use: ['flights'],
        starter: 'import duckdb\nimport pandas as pd\nsample = pd.DataFrame(flights[:100])\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample already holds the first 100 real rows as a DataFrame.',
        brief: 'Using a DuckDB window function, rank rows by `dep_delay` descending (`RANK() OVER (ORDER BY dep_delay DESC)`), and store the `carrier` of the rank-1 row, as a plain string, in `answer`.',
        reference: py`import duckdb
import pandas as pd
sample = pd.DataFrame(flights[:100])
result = duckdb.sql("SELECT carrier, RANK() OVER (ORDER BY dep_delay DESC) AS r FROM sample").df()
answer = str(result[result["r"] == 1]["carrier"].iloc[0])`,
        walkthrough: 'DuckDB supports full SQL window functions like `RANK()`, useful for per-row rankings that would otherwise need a separate `sort_values` and position lookup in pandas.',
        traps: [py`import duckdb
import pandas as pd
sample = pd.DataFrame(flights[:100])
result = duckdb.sql("SELECT carrier, RANK() OVER (ORDER BY dep_delay ASC) AS r FROM sample").df()
answer = str(result[result["r"] == 1]["carrier"].iloc[0])`],
      }),
      dat({
        title: 'Joining two DataFrames with DuckDB SQL',
        use: ['flights', 'airlines'],
        starter: 'import duckdb\nimport pandas as pd\nf = pd.DataFrame(flights[:50])\na = pd.DataFrame(airlines)\nanswer = ...\n',
        given: '# flights and airlines are lists of dictionaries. f and a already hold real DataFrames.',
        brief: 'Join `f` and `a` on `carrier` with a DuckDB SQL query, and store the number of joined rows, as an `int`, in `answer`.',
        reference: py`import duckdb
import pandas as pd
f = pd.DataFrame(flights[:50])
a = pd.DataFrame(airlines)
result = duckdb.sql("SELECT * FROM f JOIN a ON f.carrier = a.carrier").df()
answer = int(len(result))`,
        walkthrough: 'DuckDB reads both DataFrames by name in the same query, joining them with ordinary SQL — no need to convert either one first.',
        traps: [py`import duckdb
import pandas as pd
f = pd.DataFrame(flights[:50])
a = pd.DataFrame(airlines)
result = duckdb.sql("SELECT * FROM f LEFT JOIN a ON f.carrier = a.carrier WHERE a.carrier IS NULL").df()
answer = int(len(result))`],
      }),
    ],
  },
  {
    id: 'py-polars',
    title: 'Polars: expressions and lazy queries',
    blurb: 'The expression API, select/filter/group_by, and lazy frames.',
    kind: 'code',
    practice: {
      prompt: 'Write `polars_avg(rows)`: given a list of dicts with `carrier` and `delay` keys, build a Polars DataFrame, group by `carrier`, and return the average `delay` per carrier as a **sorted** list of `(carrier, avg_delay)` tuples.',
      starter: 'import polars as pl\n\ndef polars_avg(rows):\n    ...\n',
      solution: py`import polars as pl

def polars_avg(rows):
    df = pl.DataFrame(rows)
    result = df.group_by("carrier").agg(pl.col("delay").mean()).sort("carrier")
    return list(result.iter_rows())`,
      samples: ['polars_avg([{"carrier": "A", "delay": 10.0}, {"carrier": "A", "delay": 20.0}, {"carrier": "B", "delay": 5.0}])'],
      cases: [
        ['Two carriers', 'polars_avg([{"carrier": "A", "delay": 10.0}, {"carrier": "A", "delay": 20.0}, {"carrier": "B", "delay": 5.0}])'],
        ['A single carrier', 'polars_avg([{"carrier": "X", "delay": 7.0}, {"carrier": "X", "delay": 3.0}])'],
        ['Sorted by carrier name', '[row[0] for row in polars_avg([{"carrier": "H", "delay": 1.0}, {"carrier": "C", "delay": 2.0}, {"carrier": "F", "delay": 3.0}, {"carrier": "A", "delay": 4.0}, {"carrier": "E", "delay": 5.0}, {"carrier": "B", "delay": 6.0}, {"carrier": "G", "delay": 7.0}, {"carrier": "D", "delay": 8.0}])]'],
      ],
      traps: [
        py`import polars as pl

def polars_avg(rows):
    df = pl.DataFrame(rows)
    result = df.group_by("carrier").agg(pl.col("delay").sum()).sort("carrier")
    return list(result.iter_rows())`,
        py`import polars as pl

def polars_avg(rows):
    df = pl.DataFrame(rows)
    result = df.group_by("carrier").agg(pl.col("delay").mean())
    return list(result.iter_rows())`,
      ],
    },
    real: [
      dat({
        title: 'Average real delay per carrier with Polars',
        use: ['flights'],
        starter: 'import polars as pl\nsample = [{"carrier": f["carrier"], "delay": f["dep_delay"]} for f in flights[:300] if f["dep_delay"] is not None]\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample already holds 300 real, non-missing (carrier, delay) records.',
        brief: 'Using the same approach as the practice, store the sorted list of `(carrier, avg_delay)` tuples, each average rounded to 2 decimals, in `answer`.',
        reference: py`import polars as pl
sample = [{"carrier": f["carrier"], "delay": f["dep_delay"]} for f in flights[:300] if f["dep_delay"] is not None]
df = pl.DataFrame(sample)
result = df.group_by("carrier").agg(pl.col("delay").mean().round(2)).sort("carrier")
answer = list(result.iter_rows())`,
        walkthrough: 'Polars\' expression API (`pl.col("delay").mean()`) builds up a computation to run inside `agg`, similar in spirit to pandas but with its own, chainable expression objects.',
        traps: [py`import polars as pl
sample = [{"carrier": f["carrier"], "delay": f["dep_delay"]} for f in flights[:300] if f["dep_delay"] is not None]
df = pl.DataFrame(sample)
result = df.group_by("carrier").agg(pl.col("delay").median().round(2)).sort("carrier")
answer = list(result.iter_rows())`],
      }),
      dat({
        title: 'Filtering with Polars expressions',
        use: ['tracks'],
        starter: 'import polars as pl\nrows = [{"name": t["Name"], "price": t["UnitPrice"]} for t in tracks[:100]]\ndf = pl.DataFrame(rows)\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. df already holds 100 real (name, price) rows.',
        brief: 'Using `df.filter(pl.col("price") > 0.99)`, count how many rows remain. Store the count, as an `int`, in `answer`.',
        reference: py`import polars as pl
rows = [{"name": t["Name"], "price": t["UnitPrice"]} for t in tracks[:100]]
df = pl.DataFrame(rows)
answer = int(len(df.filter(pl.col("price") > 0.99)))`,
        walkthrough: '`.filter` with a `pl.col(...)` expression is Polars\' equivalent of a boolean mask in pandas or NumPy.',
        traps: [py`import polars as pl
rows = [{"name": t["Name"], "price": t["UnitPrice"]} for t in tracks[:100]]
df = pl.DataFrame(rows)
answer = int(len(df.filter(pl.col("price") >= 0.99)))`],
      }),
      dat({
        title: 'A lazy query over real data',
        use: ['flights'],
        starter: 'import polars as pl\nsample = [{"origin": f["origin"], "distance": f["distance"]} for f in flights[:200]]\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample already holds 200 real (origin, distance) records.',
        brief: 'Build a `pl.LazyFrame` from `sample`, filter to `distance > 1000`, group by `origin`, count rows, and `.collect()` the result. Store it as a sorted list of `(origin, count)` tuples in `answer`.',
        reference: py`import polars as pl
sample = [{"origin": f["origin"], "distance": f["distance"]} for f in flights[:200]]
lazy = pl.LazyFrame(sample)
result = (
    lazy.filter(pl.col("distance") > 1000)
    .group_by("origin")
    .agg(pl.len().alias("n"))
    .sort("origin")
    .collect()
)
answer = list(result.iter_rows())`,
        walkthrough: 'A `LazyFrame` builds up the whole query plan first and only actually runs it at `.collect()`, letting Polars optimise the full pipeline (like pushing the filter before the group-by) rather than executing each step immediately.',
        traps: [py`import polars as pl
sample = [{"origin": f["origin"], "distance": f["distance"]} for f in flights[:200]]
lazy = pl.LazyFrame(sample)
result = (
    lazy.filter(pl.col("distance") < 1000)
    .group_by("origin")
    .agg(pl.len().alias("n"))
    .sort("origin")
    .collect()
)
answer = list(result.iter_rows())`],
      }),
    ],
  },
  {
    id: 'py-web-data-http',
    title: 'Web data: HTTP concepts and JSON APIs',
    blurb: 'Requests, responses, status codes, pagination and JSON handling.',
    kind: 'learn',
    check: [
      {
        q: 'What does an HTTP status code in the 200 range generally mean?',
        options: ['The request failed completely', 'Success — the request was received, understood and accepted', 'The server is redirecting the client', 'Authentication is required'],
        answer: 1,
        why: '2xx codes (200 OK, 201 Created, ...) indicate success; 3xx are redirects, 4xx are client errors (like 404 Not Found), and 5xx are server errors.',
      },
      {
        q: 'What is the difference between a query string parameter and a request header?',
        options: [
          'There is no difference',
          'A query string parameter is visible in the URL itself (e.g. `?page=2`); a header carries metadata about the request (like authentication tokens or content type) separately from the URL',
          'Headers are only used for images',
          'Query strings are always encrypted, headers are not',
        ],
        answer: 1,
        why: 'Query parameters are part of the URL and commonly used for filtering or pagination; headers carry things like auth tokens, content negotiation, or caching info, and are not part of the visible URL.',
      },
      {
        q: 'Why do most real APIs paginate large result sets instead of returning everything in one response?',
        options: [
          'To make the API harder to use',
          'Returning millions of rows in a single response would be slow, memory-heavy for both sides, and easy to time out — pagination breaks it into manageable pieces',
          'Pagination is required by HTTP itself',
          'It has no practical benefit',
        ],
        answer: 1,
        why: 'Fetching a large result set in pages keeps each individual request fast and bounded in size, at the cost of needing a loop (following a "next page" link or offset) to gather everything.',
      },
      {
        q: 'What do rate limits protect against?',
        options: [
          'Nothing; they are arbitrary restrictions',
          'A client (accidentally or deliberately) sending requests fast enough to overload the server or degrade service for other users',
          'They only apply to paid APIs',
          'They prevent using JSON responses',
        ],
        answer: 1,
        why: 'Rate limits cap how many requests a client can make in a given time window, protecting the service (and other users of it) from being overwhelmed.',
      },
      {
        q: 'Why does this lesson describe HTTP requests instead of making live ones from the browser playground?',
        options: [
          'HTTP does not exist',
          'Live cross-origin requests from this browser-based playground are restricted by CORS and general browser sandboxing, so this lesson works from recorded, representative responses instead',
          'JSON cannot be parsed in a browser',
          'It is exactly as runnable as every other lesson here',
        ],
        answer: 1,
        why: 'Browsers restrict which cross-origin requests a page can make (CORS); rather than depend on which external APIs happen to allow that from this playground, the lesson uses realistic, recorded response text.',
      },
    ],
  },
  {
    id: 'py-html-bs4',
    title: 'Parsing HTML with BeautifulSoup and lxml',
    blurb: 'The DOM tree, find_all and CSS selectors, and tables into DataFrames.',
    kind: 'code',
    practice: {
      prompt: 'Write `links(html)`: given an HTML string, return a list of `(text, href)` tuples for every `<a>` tag, in document order.',
      starter: 'from bs4 import BeautifulSoup\n\ndef links(html):\n    ...\n',
      solution: py`from bs4 import BeautifulSoup

def links(html):
    soup = BeautifulSoup(html, "html.parser")
    return [(a.get_text(), a.get("href")) for a in soup.find_all("a")]`,
      samples: [`links("<a href='http://x.com'>X</a><a href='http://y.com'>Y</a>")`],
      cases: [
        ['Two links', `links("<a href='http://x.com'>X</a><a href='http://y.com'>Y</a>")`],
        ['No links at all', 'links("<p>no links here</p>")'],
        ['A link with no href', 'links("<a>no href</a>")'],
        ['Links nested inside other tags', `links("<div><p><a href='http://z.com'>Z</a></p></div>")`],
      ],
      traps: [
        py`from bs4 import BeautifulSoup

def links(html):
    soup = BeautifulSoup(html, "html.parser")
    return [(a.get("href"), a.get_text()) for a in soup.find_all("a")]`,
        py`from bs4 import BeautifulSoup

def links(html):
    soup = BeautifulSoup(html, "html.parser")
    return [a.get_text() for a in soup.find_all("a")]`,
      ],
    },
    real: [
      dat({
        title: 'Extracting a track listing from HTML',
        use: ['tracks'],
        starter: 'html = "<ul>" + "".join(f\'<li><a href="/track/{i}">{t["Name"]}</a></li>\' for i, t in enumerate(tracks[:5])) + "</ul>"\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. html already holds a real, generated list of 5 track links.',
        brief: 'Extract every `(text, href)` pair from `html` using BeautifulSoup, and store the list in `answer`.',
        reference: py`from bs4 import BeautifulSoup
html = "<ul>" + "".join(f'<li><a href="/track/{i}">{t["Name"]}</a></li>' for i, t in enumerate(tracks[:5])) + "</ul>"
soup = BeautifulSoup(html, "html.parser")
answer = [(a.get_text(), a.get("href")) for a in soup.find_all("a")]`,
        walkthrough: 'BeautifulSoup treats the generated HTML no differently than HTML from a real website — `find_all("a")` walks the whole tree regardless of nesting.',
        traps: [py`from bs4 import BeautifulSoup
html = "<ul>" + "".join(f'<li><a href="/track/{i}">{t["Name"]}</a></li>' for i, t in enumerate(tracks[:5])) + "</ul>"
soup = BeautifulSoup(html, "html.parser")
answer = [(a.get("href"), a.get_text()) for a in soup.find_all("a")]`],
      }),
      dat({
        title: 'Reading an HTML table into a DataFrame',
        use: ['genres'],
        starter: 'import pandas as pd\nrows_html = "".join(f"<tr><td>{g[\'GenreId\']}</td><td>{g[\'Name\']}</td></tr>" for g in genres[:5])\nhtml = f"<table><tr><th>id</th><th>name</th></tr>{rows_html}</table>"\nanswer = ...\n',
        given: '# genres is a list of dictionaries. html already holds a real, generated HTML table of 5 genres.',
        brief: 'Use `pd.read_html(io.StringIO(html))` to parse the table, and store the number of rows (an `int`) in `answer`.',
        reference: py`import pandas as pd
import io
rows_html = "".join(f"<tr><td>{g['GenreId']}</td><td>{g['Name']}</td></tr>" for g in genres[:5])
html = f"<table><tr><th>id</th><th>name</th></tr>{rows_html}</table>"
tables = pd.read_html(io.StringIO(html))
answer = int(len(tables[0]))`,
        walkthrough: '`pd.read_html` finds every `<table>` in the page and parses each into its own DataFrame, returned as a list — convenient for grabbing tabular data straight out of a web page.',
        traps: [py`import pandas as pd
import io
rows_html = "".join(f"<tr><td>{g['GenreId']}</td><td>{g['Name']}</td></tr>" for g in genres[:5])
html = f"<table><tr><th>id</th><th>name</th></tr>{rows_html}</table>"
tables = pd.read_html(io.StringIO(html))
answer = int(len(tables[0].columns))`],
      }),
      dat({
        title: 'Selecting by CSS class',
        use: ['artists'],
        starter: 'html = "<div>" + "".join(f\'<span class="artist">{a["Name"]}</span>\' for a in artists[:5]) + \'<span class="other">ignore me</span></div>\'\nanswer = ...\n',
        given: '# artists is a list of dictionaries. html already holds 5 real artist names plus one unrelated span.',
        brief: 'Using `soup.select(".artist")` (a CSS selector), extract the text of every matching element. Store the list in `answer`.',
        reference: py`from bs4 import BeautifulSoup
html = "<div>" + "".join(f'<span class="artist">{a["Name"]}</span>' for a in artists[:5]) + '<span class="other">ignore me</span></div>'
soup = BeautifulSoup(html, "html.parser")
answer = [el.get_text() for el in soup.select(".artist")]`,
        walkthrough: 'CSS selectors (`.select`) let you target elements by class, tag, or structure, exactly like in a stylesheet — often more concise than `find_all` with matching keyword arguments.',
        traps: [py`from bs4 import BeautifulSoup
html = "<div>" + "".join(f'<span class="artist">{a["Name"]}</span>' for a in artists[:5]) + '<span class="other">ignore me</span></div>'
soup = BeautifulSoup(html, "html.parser")
answer = [el.get_text() for el in soup.select("span")]`],
      }),
    ],
  },
  {
    id: 'py-spreadsheets-xml-yaml',
    title: 'Spreadsheets, XML and YAML in data work',
    blurb: 'Excel workflows, XML to tables with ElementTree, and YAML for configuration.',
    kind: 'learn',
    check: [
      {
        q: 'Why might a "spreadsheet export" from a real system be messier to parse than a plain CSV?',
        options: [
          'Spreadsheets are always cleaner than CSV',
          'Spreadsheets can contain merged cells, multiple sheets, formatting-only rows, and formulas — structure that a plain row/column CSV reader was never designed to represent',
          'Excel files cannot contain text',
          'There is no real difference',
        ],
        answer: 1,
        why: "A human-maintained spreadsheet often has header rows, notes, merged title cells and multiple tabs mixed with the actual data table, none of which a simple CSV structure can represent — cleaning that shape is real work before analysis can begin.",
      },
      {
        q: 'What is XML fundamentally, compared to JSON?',
        options: [
          'They are unrelated formats with nothing in common',
          "Both are hierarchical, human-readable text formats for structured data; XML uses nested tags and attributes, JSON uses nested objects and arrays",
          'XML can only represent numbers',
          'JSON is a subset of XML',
        ],
        answer: 1,
        why: 'XML and JSON solve a similar problem (structured, nested, human-readable data interchange) with different syntax; XML predates JSON and remains common in many enterprise and legacy systems.',
      },
      {
        q: 'What does Python\'s `xml.etree.ElementTree` let you do?',
        options: [
          'Only write XML, never read it',
          'Parse an XML document into a tree of elements you can search and iterate, and build or modify XML programmatically',
          'Convert XML directly to a machine learning model',
          'It only works with HTML, not XML',
        ],
        answer: 1,
        why: '`ElementTree` is the standard-library way to parse XML into a navigable tree structure, find elements by tag, and read their text or attributes.',
      },
      {
        q: 'Why is YAML commonly chosen for configuration files over JSON?',
        options: [
          'YAML cannot represent nested data',
          'YAML supports comments and a less punctuation-heavy syntax (indentation instead of braces and quotes everywhere), which many people find more pleasant to hand-edit',
          'YAML is faster to parse than JSON in every case',
          'JSON cannot represent lists',
        ],
        answer: 1,
        why: 'YAML and JSON can represent the same nested data; YAML\'s indentation-based syntax and support for comments make it more comfortable for humans to write and edit by hand, which is why configuration files often prefer it.',
      },
      {
        q: 'What is a common pitfall when the data source is a hand-edited spreadsheet or config file?',
        options: [
          'There are no real pitfalls',
          'Inconsistent formatting introduced by manual editing — a stray merged cell, an extra note row, inconsistent indentation in YAML — can silently break an otherwise-correct parser',
          'Hand-edited files parse more reliably than generated ones',
          'This only matters for very large files',
        ],
        answer: 1,
        why: "A file generated by code is consistent by construction; a file a person edits by hand can accumulate small inconsistencies (merged cells, extra notes, indentation slips) that a parser built for the 'clean' case will trip over.",
      },
    ],
  },
]
