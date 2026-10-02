const flightsReport = {
  id: 'project-flights-report',
  kind: 'guided',
  tier: 'expert',
  title: 'A flights operations report',
  tagline: 'Six parts, one report — the rhythm a real operations analyst follows.',
  blurb: 'Build a short analytics report on NYC flights, part by part.',
  intro:
    "You're the analyst on call for a small airline ops team. Over six parts, you'll put together a short report " +
    "on the NYC Flights 2013 data — the same one your Advanced-tier exam used, now with hourly weather and plane " +
    'records joined in. Each part is graded on its own, so you can come back to this whenever you like.',
  parts: [
    {
      id: 'scope',
      title: 'Part 1 · Scoping the data',
      dataset: 'nycflights13',
      brief:
        "Before analysing anything, get your bearings. In **one row**, return: the number of **distinct carriers** " +
        '(`carriers`), the **earliest** and **latest** `flight_date` (`first_date`, `last_date`), and the **total number of flights** ' +
        '(`total_flights`). Return exactly these 4 columns, in this order.',
      reference:
        'SELECT COUNT(DISTINCT carrier) AS carriers,\n' +
        '       MIN(flight_date) AS first_date,\n' +
        '       MAX(flight_date) AS last_date,\n' +
        '       COUNT(*) AS total_flights\n' +
        'FROM flights;',
      orderMatters: false,
      walkthrough:
        'A handful of aggregates in one `SELECT` gives you the shape of the dataset before you trust any deeper ' +
        'analysis on it: how many carriers you are dealing with, the exact date range (a full calendar year here), ' +
        "and the total row count. This is the step it's tempting to skip — don't.",
    },
    {
      id: 'on-time-by-carrier',
      title: 'Part 2 · On-time performance by carrier',
      dataset: 'nycflights13',
      brief:
        'For **every carrier**, return the **average departure delay** (`avg_dep_delay`, rounded to 1 decimal) and the ' +
        '**percentage of flights delayed more than 15 minutes** (`pct_delayed_15`, rounded to 1 decimal, out of flights ' +
        'with a known delay). **Ignore flights with no recorded `dep_delay`** (cancelled flights). Return `carrier`, ' +
        '`avg_dep_delay`, `pct_delayed_15`, one row per carrier.',
      reference:
        'SELECT carrier,\n' +
        '       ROUND(AVG(dep_delay), 1) AS avg_dep_delay,\n' +
        '       ROUND(100.0 * SUM(CASE WHEN dep_delay > 15 THEN 1 ELSE 0 END) / COUNT(dep_delay), 1) AS pct_delayed_15\n' +
        'FROM flights\n' +
        'WHERE dep_delay IS NOT NULL\n' +
        'GROUP BY carrier\n' +
        'ORDER BY carrier;',
      orderMatters: false,
      walkthrough:
        'A `CASE` inside `SUM` counts how many rows satisfy a condition — dividing that by `COUNT(dep_delay)` (not ' +
        '`COUNT(*)`) keeps cancelled flights, which have no delay to be "late" with, out of the percentage entirely. ' +
        'Filtering `WHERE dep_delay IS NOT NULL` first keeps them out of the average too.',
    },
    {
      id: 'weather-delays',
      title: "Part 3 · Weather's effect on delays",
      dataset: 'nycflights13',
      brief:
        'Focus on **EWR** departures. Join to the hourly `weather` table on matching `origin`, date and `hour`. Label each ' +
        'flight `\'rainy\'` if `precip > 0` at that hour, otherwise `\'clear\'`. Return `conditions`, the **flight count** ' +
        '(`flights`) and the **average departure delay** (`avg_dep_delay`, rounded to 1 decimal) per label, ignoring ' +
        'flights with no recorded delay.',
      reference:
        "SELECT CASE WHEN w.precip > 0 THEN 'rainy' ELSE 'clear' END AS conditions,\n" +
        '       COUNT(*) AS flights,\n' +
        '       ROUND(AVG(f.dep_delay), 1) AS avg_dep_delay\n' +
        'FROM flights f\n' +
        'JOIN weather w ON w.origin = f.origin AND w.weather_date = f.flight_date AND w.hour = f.hour\n' +
        "WHERE f.origin = 'EWR' AND f.dep_delay IS NOT NULL\n" +
        'GROUP BY conditions\n' +
        'ORDER BY conditions;',
      orderMatters: false,
      walkthrough:
        '`flight_date`/`weather_date` and `hour` are the shared keys between the two tables — join on all three ' +
        '(plus `origin`) to line up each flight with the weather at its own departure hour, not just its own day. ' +
        'The `CASE` expression turns a continuous measurement into the two labels the task asks for, and `GROUP BY` ' +
        'on that same expression buckets by it directly.',
    },
    {
      id: 'summary-view',
      title: 'Part 4 · A reusable summary view',
      dataset: 'nycflights13',
      brief:
        'Create a view `carrier_month_summary` with one row per `carrier`/`month`: the **average departure delay** ' +
        '(`avg_dep_delay`, rounded to 1 decimal) and the **number of flights** (`flights`), for carrier-months with ' +
        'a recorded delay. To avoid tiny samples skewing an average, **keep only carrier-months with at least 50 flights**. ' +
        'Then query the view for the **5 worst carrier-months** by average delay. Return `carrier`, `month`, `avg_dep_delay`, ' +
        '`flights`, worst first (break ties by carrier, then month).',
      reference:
        'CREATE VIEW carrier_month_summary AS\n' +
        'SELECT carrier, month,\n' +
        '       ROUND(AVG(dep_delay), 1) AS avg_dep_delay,\n' +
        '       COUNT(*) AS flights\n' +
        'FROM flights\n' +
        'WHERE dep_delay IS NOT NULL\n' +
        'GROUP BY carrier, month\n' +
        'HAVING COUNT(*) >= 50;\n\n' +
        'SELECT carrier, month, avg_dep_delay, flights\n' +
        'FROM carrier_month_summary\n' +
        'ORDER BY avg_dep_delay DESC, carrier ASC, month ASC\n' +
        'LIMIT 5;',
      orderMatters: true,
      walkthrough:
        'The `HAVING COUNT(*) >= 50` filter matters more than it looks: without it, a carrier with one or two flights ' +
        'in a quiet month can post an extreme average purely from noise, and those tiny samples would dominate the ' +
        '"worst" ranking. Once real volume is required, the actual worst month (9E in July, with over a hundred flights ' +
        'averaging nearly 40 minutes late) surfaces on its own. The view is queried exactly like a table in the second statement.',
    },
    {
      id: 'data-quality',
      title: 'Part 5 · A data-quality appendix',
      dataset: 'nycflights13',
      brief:
        "Every report needs a caveats section. In **one row**, return: the number of flights whose `tailnum` has **no " +
        'matching row** in `planes` (`flights_missing_plane`), the number whose `dest` has **no matching row** in ' +
        '`airports` (`flights_missing_dest_airport`), and the **total number of flights** (`total_flights`), so the ' +
        'reader can judge how much of the data is affected.',
      reference:
        'SELECT\n' +
        '  (SELECT COUNT(*) FROM flights f LEFT JOIN planes p ON f.tailnum = p.tailnum WHERE p.tailnum IS NULL)\n' +
        '    AS flights_missing_plane,\n' +
        '  (SELECT COUNT(*) FROM flights f LEFT JOIN airports a ON f.dest = a.faa WHERE a.faa IS NULL)\n' +
        '    AS flights_missing_dest_airport,\n' +
        '  (SELECT COUNT(*) FROM flights) AS total_flights;',
      orderMatters: false,
      walkthrough:
        'A `LEFT JOIN` followed by `WHERE <right side> IS NULL` is the standard way to find rows on the left with ' +
        'no match on the right — here, roughly one in six flights has no matching plane record, which is exactly the ' +
        'kind of number a real report has to disclose rather than quietly drop.',
    },
    {
      id: 'exec-ranking',
      title: 'Part 6 · Executive summary ranking',
      dataset: 'nycflights13',
      brief:
        'Close the report with one headline chart. Rank destinations by flight volume and return the **top 10**: ' +
        '`dest`, the flight count (`flights`), and the **cumulative percentage of all flights** those top destinations ' +
        'represent so far (`cumulative_pct`, rounded to 1 decimal) — i.e. the running share as you go down the ranking, ' +
        'busiest first.',
      reference:
        'WITH by_dest AS (\n' +
        '  SELECT dest, COUNT(*) AS flights\n' +
        '  FROM flights\n' +
        '  GROUP BY dest\n' +
        '),\n' +
        'ranked AS (\n' +
        '  SELECT dest, flights,\n' +
        '         SUM(flights) OVER (ORDER BY flights DESC, dest ASC) AS running_total,\n' +
        '         SUM(flights) OVER () AS grand_total,\n' +
        '         ROW_NUMBER() OVER (ORDER BY flights DESC, dest ASC) AS rn\n' +
        '  FROM by_dest\n' +
        ')\n' +
        'SELECT dest, flights, ROUND(100.0 * running_total / grand_total, 1) AS cumulative_pct\n' +
        'FROM ranked\n' +
        'WHERE rn <= 10\n' +
        'ORDER BY rn;',
      orderMatters: true,
      walkthrough:
        'A window `SUM(...) OVER (ORDER BY ...)` running against the same order as the ranking gives you a running ' +
        'total for free — divide by the grand total (a second window function with no `ORDER BY`, so it sums ' +
        'everything) and you have a cumulative share at every rank, exactly the number an executive summary wants: ' +
        '"the top 10 destinations account for X% of all traffic."',
    },
  ],
}

const customerDashboard = {
  id: 'project-customer-dashboard',
  kind: 'guided',
  tier: 'expert',
  title: 'A customer health dashboard',
  tagline: 'Six parts that build toward one dashboard view of the business.',
  blurb: 'Build a customer-health dashboard on the Chinook store, part by part.',
  intro:
    "You're building a dashboard for the store's management: who buys, how much, and what they like. Chinook is " +
    'messier and smaller than the flights data, which is exactly the point — real customer data rarely has a huge, ' +
    'clean sample, and part of the job is noticing that (part 6 has a genuine surprise in it).',
  parts: [
    {
      id: 'revenue-baseline',
      title: 'Part 1 · Revenue baseline',
      dataset: 'chinook',
      brief:
        'Return **total revenue by year and quarter**: `year` (as text, e.g. `\'2010\'`), `quarter` (1-4), and `revenue` ' +
        '(sum of `Invoice.Total`, rounded to 2 decimals). One row per year/quarter that has at least one invoice, ' +
        'earliest first.',
      reference:
        "SELECT strftime('%Y', InvoiceDate) AS year,\n" +
        "       CAST((strftime('%m', InvoiceDate) - 1) / 3 + 1 AS INTEGER) AS quarter,\n" +
        '       ROUND(SUM(Total), 2) AS revenue\n' +
        'FROM Invoice\n' +
        'GROUP BY year, quarter\n' +
        'ORDER BY year, quarter;',
      orderMatters: true,
      walkthrough:
        "`strftime('%Y', ...)`/`strftime('%m', ...)` pull the year and month out of a text date column, and a small " +
        'piece of integer arithmetic on the month (`(month - 1) / 3 + 1`) turns it into a quarter number 1-4. ' +
        'Grouping by both gives you the baseline trend line every later part gets compared against.',
    },
    {
      id: 'top-customers-markets',
      title: 'Part 2 · Top customers and markets',
      dataset: 'chinook',
      brief:
        'Return the **10 highest-spending customers**: their full name (`customer`), their `Country` (`country`), and ' +
        'their total spend (`spend`, sum of `Invoice.Total`, rounded to 2 decimals). Highest spend first.',
      reference:
        "SELECT c.FirstName || ' ' || c.LastName AS customer, c.Country AS country, ROUND(SUM(i.Total), 2) AS spend\n" +
        'FROM Invoice i\n' +
        'JOIN Customer c ON c.CustomerId = i.CustomerId\n' +
        'GROUP BY c.CustomerId\n' +
        'ORDER BY spend DESC, customer ASC\n' +
        'LIMIT 10;',
      orderMatters: true,
      walkthrough:
        'Joining `Invoice` to `Customer` before grouping lets you pull the name and country straight into the same ' +
        "row as the spend total. Worth noticing once you see the result: the top 10 spenders aren't clustered in one " +
        "market — they're spread across a dozen different countries.",
    },
    {
      id: 'behaviour-segments',
      title: 'Part 3 · Purchase behaviour segments',
      dataset: 'chinook',
      brief:
        "Every customer's order **count** turns out to be almost identical here (6 or 7 for everyone), so it can't " +
        'separate anyone into groups — genre variety can. For each customer, count the **distinct genres** they have ' +
        "bought a track from. Classify them as `'eclectic'` (10 or more genres), `'varied'` (7-9), or `'focused'` " +
        '(6 or fewer). Return `segment` and the number of `customers` in each, one row per segment.',
      reference:
        'WITH diversity AS (\n' +
        '  SELECT i.CustomerId, COUNT(DISTINCT t.GenreId) AS genres\n' +
        '  FROM Invoice i\n' +
        '  JOIN InvoiceLine il ON il.InvoiceId = i.InvoiceId\n' +
        '  JOIN Track t ON t.TrackId = il.TrackId\n' +
        '  GROUP BY i.CustomerId\n' +
        ')\n' +
        "SELECT CASE WHEN genres >= 10 THEN 'eclectic' WHEN genres >= 7 THEN 'varied' ELSE 'focused' END AS segment,\n" +
        '       COUNT(*) AS customers\n' +
        'FROM diversity\n' +
        'GROUP BY segment\n' +
        'ORDER BY segment;',
      orderMatters: false,
      walkthrough:
        'This is a real lesson in choosing the right column to segment on: order count looked like an obvious choice ' +
        'and turned out to be useless (barely any variation), while genre diversity — three joins away from ' +
        '`Customer` — actually splits the customer base into meaningfully different groups. Always check that a ' +
        'segmenting column actually varies before building a dashboard around it.',
    },
    {
      id: 'genre-affinity',
      title: 'Part 4 · Genre affinity per customer',
      dataset: 'chinook',
      brief:
        "For **every customer**, find their single most-purchased genre by track count (break ties alphabetically " +
        'by genre name). Return `CustomerId`, `top_genre`, and `tracks_bought` (the track count for that genre), one ' +
        'row per customer, ordered by `CustomerId`.',
      reference:
        'WITH counts AS (\n' +
        '  SELECT i.CustomerId, g.Name AS genre, COUNT(*) AS n\n' +
        '  FROM Invoice i\n' +
        '  JOIN InvoiceLine il ON il.InvoiceId = i.InvoiceId\n' +
        '  JOIN Track t ON t.TrackId = il.TrackId\n' +
        '  JOIN Genre g ON g.GenreId = t.GenreId\n' +
        '  GROUP BY i.CustomerId, g.Name\n' +
        '),\n' +
        'ranked AS (\n' +
        '  SELECT CustomerId, genre, n,\n' +
        '         ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY n DESC, genre ASC) AS rn\n' +
        '  FROM counts\n' +
        ')\n' +
        'SELECT CustomerId, genre AS top_genre, n AS tracks_bought\n' +
        'FROM ranked\n' +
        'WHERE rn = 1\n' +
        'ORDER BY CustomerId;',
      orderMatters: false,
      walkthrough:
        '`ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY n DESC, ...)` restarts the ranking for every customer, ' +
        'so `rn = 1` picks out exactly one "favourite genre" row per person — the same pattern as ranking within a ' +
        'group anywhere else, just with a customer instead of, say, a department.',
    },
    {
      id: 'customer-summary-view',
      title: 'Part 5 · A reusable customer-summary view',
      dataset: 'chinook',
      brief:
        'Create a view `customer_summary` with one row per customer who has bought something: their name (`customer`), ' +
        '`total_spend`, `orders` (invoice count), `distinct_genres`, and `top_genre` (their most-purchased genre, as in ' +
        'Part 4). Then query it for the **eclectic** customers (`distinct_genres >= 10`). Return `customer`, ' +
        '`total_spend`, `orders`, `distinct_genres`, `top_genre`, highest spend first.',
      reference:
        'CREATE VIEW customer_summary AS\n' +
        'WITH spend AS (\n' +
        '  SELECT CustomerId, SUM(Total) AS total_spend, COUNT(*) AS orders\n' +
        '  FROM Invoice GROUP BY CustomerId\n' +
        '),\n' +
        'genres AS (\n' +
        '  SELECT i.CustomerId, COUNT(DISTINCT t.GenreId) AS distinct_genres\n' +
        '  FROM Invoice i JOIN InvoiceLine il ON il.InvoiceId = i.InvoiceId JOIN Track t ON t.TrackId = il.TrackId\n' +
        '  GROUP BY i.CustomerId\n' +
        '),\n' +
        'top_genre AS (\n' +
        '  SELECT CustomerId, genre FROM (\n' +
        '    SELECT i.CustomerId, g.Name AS genre,\n' +
        '           ROW_NUMBER() OVER (PARTITION BY i.CustomerId ORDER BY COUNT(*) DESC, g.Name ASC) AS rn\n' +
        '    FROM Invoice i JOIN InvoiceLine il ON il.InvoiceId = i.InvoiceId JOIN Track t ON t.TrackId = il.TrackId\n' +
        '    JOIN Genre g ON g.GenreId = t.GenreId\n' +
        '    GROUP BY i.CustomerId, g.Name\n' +
        '  ) WHERE rn = 1\n' +
        ')\n' +
        "SELECT c.CustomerId, c.FirstName || ' ' || c.LastName AS customer,\n" +
        '       s.total_spend, s.orders, g.distinct_genres, tg.genre AS top_genre\n' +
        'FROM Customer c\n' +
        'JOIN spend s ON s.CustomerId = c.CustomerId\n' +
        'JOIN genres g ON g.CustomerId = c.CustomerId\n' +
        'JOIN top_genre tg ON tg.CustomerId = c.CustomerId;\n\n' +
        'SELECT customer, total_spend, orders, distinct_genres, top_genre\n' +
        'FROM customer_summary\n' +
        'WHERE distinct_genres >= 10\n' +
        'ORDER BY total_spend DESC, customer ASC;',
      orderMatters: true,
      walkthrough:
        'The view combines three CTEs — one per metric — into a single per-customer row with three joins, exactly ' +
        'the way Part 4 (favourite genre) and the earlier spend totals get reused rather than recomputed. Once the ' +
        'view exists, filtering it for one segment is a completely ordinary `WHERE` clause, just like querying a ' +
        'table.',
    },
    {
      id: 'revenue-concentration',
      title: 'Part 6 · The revenue-concentration check',
      dataset: 'chinook',
      brief:
        "Executives often ask: 'how much of our revenue comes from our best customers?' Rank customers by total " +
        'spend and find what **percentage of total revenue** comes from the **top 10% of customers** (round the ' +
        'customer count down). Return that one number as `top10pct_share` (rounded to 1 decimal), alongside ' +
        '`customers_counted` (how many customers that 10% actually is).',
      reference:
        'WITH spend AS (SELECT CustomerId, SUM(Total) AS t FROM Invoice GROUP BY CustomerId),\n' +
        'ranked AS (SELECT t, ROW_NUMBER() OVER (ORDER BY t DESC) AS rn, COUNT(*) OVER () AS n FROM spend)\n' +
        'SELECT\n' +
        '  ROUND(100.0 * SUM(CASE WHEN rn <= CAST(0.1 * n AS INTEGER) THEN t ELSE 0 END) / SUM(t), 1) AS top10pct_share,\n' +
        '  CAST(0.1 * (SELECT COUNT(*) FROM spend) AS INTEGER) AS customers_counted\n' +
        'FROM ranked;',
      orderMatters: false,
      walkthrough:
        "This is the twist worth putting in the executive summary: the top 10% of customers here account for only " +
        "a little over 10% of revenue — almost exactly their proportional share. There is no small group of " +
        "\"whale\" customers propping up the business; revenue is broad-based. That is a genuinely useful finding, " +
        'and the opposite of what a Pareto-style 80/20 assumption would have predicted — which is exactly why you ' +
        'compute the real number instead of assuming it.',
    },
  ],
}

const airlineStrategy = {
  id: 'project-airline-strategy',
  kind: 'unguided',
  tier: 'expert',
  title: 'Airline network strategy',
  tagline: 'No steps this time — pick a strategic question yourself and back it with data.',
  blurb: 'An open-ended notebook investigation on NYC flights.',
  dataset: 'nycflights13',
  brief:
    "You're advising an airline on where to add or cut routes, using the same NYC Flights 2013 data from the " +
    "guided project. There's no reference answer here and no step-by-step parts — pick **one** question below (or " +
    'bring your own), and investigate it in the notebook until you have an answer you could defend in a meeting.\n\n' +
    '**Some starting points:**\n' +
    '- Which routes have the worst on-time performance, and might need a schedule change?\n' +
    '- Is there a seasonal pattern that suggests adding capacity in certain months?\n' +
    '- Which airports are most weather-vulnerable, and does that change which carrier is the safer bet there?\n\n' +
    "Use as many notebook cells as you need — build up your query gradually, check intermediate results, and use a " +
    'Markdown cell for your final write-up.',
  checklist: [
    'Chose and clearly stated one specific question',
    'Used at least one JOIN across tables',
    'Used a window function or a CTE somewhere',
    'Wrote 2-3 sentences summarising the recommendation, in a Markdown cell',
  ],
}

const chinookInvestigation = {
  id: 'project-chinook-investigation',
  kind: 'unguided',
  tier: 'expert',
  title: 'Open business investigation',
  tagline: 'A real business question, your own approach, one notebook.',
  blurb: 'An open-ended notebook investigation on the Chinook store.',
  dataset: 'chinook',
  brief:
    "You're presenting a recommendation to the store's management, using the same Chinook data from the guided " +
    'project. Pick **one** question below (or bring your own), and investigate it in the notebook.\n\n' +
    '**Some starting points:**\n' +
    '- Which genre or artist should we put more marketing budget behind?\n' +
    '- Which country or market looks ready for expansion?\n' +
    '- Are there signs of customers we are at risk of losing?\n\n' +
    'Build your analysis up cell by cell, and finish with a short written recommendation in a Markdown cell.',
  checklist: [
    'Found the highest-value customers or markets by revenue',
    'Compared at least two dimensions (e.g. genre by country)',
    'Used at least one window function or a CTE',
    'Wrote a short written recommendation, in a Markdown cell',
  ],
}

export const expertProjects = [flightsReport, customerDashboard, airlineStrategy, chinookInvestigation]
