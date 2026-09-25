export const expertExtras = {
  'sql-top-n-per-group': [
    {
      dataset: 'nycflights13',
      title: 'The two biggest airlines at each airport',
      brief: `**Return:** \`origin\`, \`carrier\` and \`flights\` (the number of flights that carrier operated from that origin) for the **top 2 carriers at each origin**. Break ties by \`carrier\`, A to Z. Sort by \`origin\`, then \`flights\` (most first), then \`carrier\`.`,
      reference: 'WITH ranked AS (SELECT origin, carrier, COUNT(*) AS flights, ROW_NUMBER() OVER (PARTITION BY origin ORDER BY COUNT(*) DESC, carrier) AS rn FROM flights GROUP BY origin, carrier) SELECT origin, carrier, flights FROM ranked WHERE rn <= 2 ORDER BY origin, flights DESC, carrier;',
      orderMatters: true,
      walkthrough: `The same recipe as before with a different grouping: number the carriers within each origin, then keep the first two. The carrier name in the window's \`ORDER BY\` is the tie-breaker.`,
    },
    {
      dataset: 'nycflights13',
      title: 'The favourite destination each month',
      brief: `**Return:** \`month\`, \`dest\` and \`flights\`: for each month, the **single most-flown destination** and its number of flights. Break ties by \`dest\`, A to Z. Sort by \`month\`.`,
      reference: 'WITH ranked AS (SELECT month, dest, COUNT(*) AS flights, ROW_NUMBER() OVER (PARTITION BY month ORDER BY COUNT(*) DESC, dest) AS rn FROM flights GROUP BY month, dest) SELECT month, dest, flights FROM ranked WHERE rn = 1 ORDER BY month;',
      orderMatters: true,
      walkthrough: `Keeping \`rn = 1\` gives exactly one row per month. If you used \`RANK()\` instead, two destinations tied for first would both appear.`,
    },
  ],

  'sql-pivot': [
    {
      dataset: 'nycflights13',
      title: 'Quarter by quarter',
      brief: `**Return:** \`origin\`, \`Q1\`, \`Q2\`, \`Q3\` and \`Q4\`: for each origin airport, the number of flights in each quarter of the year (Q1 is months 1 to 3, Q2 is 4 to 6, and so on). Name the columns exactly as shown.`,
      reference: 'SELECT origin, SUM(month BETWEEN 1 AND 3) AS Q1, SUM(month BETWEEN 4 AND 6) AS Q2, SUM(month BETWEEN 7 AND 9) AS Q3, SUM(month BETWEEN 10 AND 12) AS Q4 FROM flights GROUP BY origin;',
      orderMatters: false,
      walkthrough: `Any condition works inside the \`SUM\`, including a range. Each column counts only the flights whose month falls in its range, and the four columns add up to the origin's total.`,
    },
    {
      dataset: 'nycflights13',
      title: 'On time, late or cancelled',
      brief: `**Return:** \`origin\`, \`on_time\` (flights with \`dep_delay\` of 0 or less), \`late\` (flights with \`dep_delay\` above 0) and \`cancelled\` (flights with no departure time), for each origin airport.`,
      reference: 'SELECT origin, SUM(dep_delay <= 0) AS on_time, SUM(dep_delay > 0) AS late, SUM(dep_time IS NULL) AS cancelled FROM flights GROUP BY origin;',
      orderMatters: false,
      walkthrough: `A cancelled flight has a \`NULL\` \`dep_delay\`, so both \`dep_delay <= 0\` and \`dep_delay > 0\` are unknown for it and add nothing. That is why it needs its own column. The three columns together cover every flight exactly once.`,
    },
  ],

  'sql-gaps-islands': [
    {
      dataset: 'nycflights13',
      title: 'Foggy spells at JFK',
      brief: `A day is **foggy** at \`JFK\` if the lowest \`visib\` (visibility in miles) recorded that day, in \`weather\`, was **below 3**. Use \`weather_date\` as the day.

**Return:** \`start_day\`, \`end_day\` and \`days\` for every streak of **2 or more consecutive foggy days**. Sort by \`start_day\`.`,
      reference: "WITH foggy AS (SELECT weather_date AS day FROM weather WHERE origin = 'JFK' GROUP BY weather_date HAVING MIN(visib) < 3), numbered AS (SELECT day, date(day, '-' || ROW_NUMBER() OVER (ORDER BY day) || ' days') AS grp FROM foggy) SELECT MIN(day) AS start_day, MAX(day) AS end_day, COUNT(*) AS days FROM numbered GROUP BY grp HAVING COUNT(*) >= 2 ORDER BY start_day;",
      orderMatters: true,
      walkthrough: `First reduce the hourly rows to one row per foggy day, then apply the trick: number the days and subtract that many days from each date. Consecutive days share the same result, so grouping by it gives one row per spell.`,
    },
    {
      dataset: 'nycflights13',
      title: 'Heat waves at LaGuardia',
      brief: `A day is **hot** at \`LGA\` if the highest \`temp\` recorded that day, in \`weather\`, was **90 or more**. Use \`weather_date\` as the day.

**Return:** \`start_day\`, \`end_day\` and \`days\` for every streak of **2 or more consecutive hot days**. Sort by \`start_day\`.`,
      reference: "WITH hot AS (SELECT weather_date AS day FROM weather WHERE origin = 'LGA' GROUP BY weather_date HAVING MAX(temp) >= 90), numbered AS (SELECT day, date(day, '-' || ROW_NUMBER() OVER (ORDER BY day) || ' days') AS grp FROM hot) SELECT MIN(day) AS start_day, MAX(day) AS end_day, COUNT(*) AS days FROM numbered GROUP BY grp HAVING COUNT(*) >= 2 ORDER BY start_day;",
      orderMatters: true,
      walkthrough: `Same pattern, with \`MAX\` and a different threshold. The only thing that changes between streak problems is the first step, the definition of a qualifying day.`,
    },
  ],

  'sql-dedupe': [
    {
      dataset: 'nycflights13',
      title: 'Identical aircraft',
      brief: `Many planes in \`planes\` share the same \`manufacturer\`, \`model\` and \`year\`.

**Return:** \`manufacturer\`, \`model\`, \`year\` and \`planes\` (how many planes share that combination) for combinations that appear **more than 30 times**. Most planes first; break ties by \`manufacturer\`, then \`model\`, then \`year\`.`,
      reference: 'SELECT manufacturer, model, year, COUNT(*) AS planes FROM planes GROUP BY manufacturer, model, year HAVING COUNT(*) > 30 ORDER BY planes DESC, manufacturer, model, year;',
      orderMatters: true,
      walkthrough: `Grouping by several columns means "identical on all of them". \`HAVING COUNT(*) > 30\` keeps only the repeated combinations. Here the repeats are real, since many planes are the same type, so nothing should be deleted. Finding the repeats and deciding whether they are errors are two separate steps.`,
    },
    {
      dataset: 'chinook',
      title: 'Playlists with the same name',
      brief: `Some playlists have been created twice under the same name.

**Return:** \`Name\`, \`copies\` (how many playlists share it) and \`keep_id\` (the lowest \`PlaylistId\` among them), for names that appear **more than once**. Sort by \`keep_id\`.`,
      reference: 'SELECT Name, COUNT(*) AS copies, MIN(PlaylistId) AS keep_id FROM Playlist GROUP BY Name HAVING COUNT(*) > 1 ORDER BY keep_id;',
      orderMatters: true,
      walkthrough: `\`MIN(PlaylistId)\` picks one stable row per name to keep. Before deleting the extras, look at what is in them: the second \`Movies\` playlist may hold different tracks than the first.`,
    },
  ],

  'sql-data-quality': [
    {
      dataset: 'nycflights13',
      title: 'Departed but never arrived?',
      brief: `A flight that took off should have an arrival delay. Some don't (they were diverted or the data is incomplete).

**Return:** \`carrier\` and \`missing_arrival\` (the number of flights that **have a departure time** but **no \`arr_delay\`**), for each carrier that has any. Most first; break ties by \`carrier\`.`,
      reference: 'SELECT carrier, COUNT(*) AS missing_arrival FROM flights WHERE dep_time IS NOT NULL AND arr_delay IS NULL GROUP BY carrier ORDER BY missing_arrival DESC, carrier;',
      orderMatters: true,
      walkthrough: `Compare two columns that should agree. A cancelled flight legitimately has neither, so filtering on \`dep_time IS NOT NULL\` first excludes those and leaves only the suspicious rows.`,
    },
    {
      dataset: 'nycflights13',
      title: 'Planes with no build year',
      brief: `**Return:** \`manufacturer\` and \`planes_without_year\` (how many planes have **no \`year\`**) for every manufacturer that has any. Most first; break ties by \`manufacturer\`.`,
      reference: 'SELECT manufacturer, COUNT(*) AS planes_without_year FROM planes WHERE year IS NULL GROUP BY manufacturer ORDER BY planes_without_year DESC, manufacturer;',
      orderMatters: true,
      walkthrough: `Count the gaps and split them by group: that tells you whether the missing values are spread evenly or come from one source. Here a few manufacturers account for most of them.`,
    },
  ],

  'sql-views': [
    {
      dataset: 'nycflights13',
      title: 'A view of each airport',
      brief: `**Step 1:** create a view named \`origin_summary\` with the columns \`origin\`, \`flights\` (its number of flights) and \`avg_distance\` (the average \`distance\`, rounded to a **whole number**).

**Step 2:** query it to **return** \`origin\`, \`flights\` and \`avg_distance\`, sorted by \`origin\`.

Write both statements in the editor, separated by a semicolon.`,
      reference: 'CREATE VIEW origin_summary AS SELECT origin, COUNT(*) AS flights, ROUND(AVG(distance)) AS avg_distance FROM flights GROUP BY origin; SELECT origin, flights, avg_distance FROM origin_summary ORDER BY origin;',
      orderMatters: true,
      walkthrough: `The view stores the query, not the rows. Once it exists, \`SELECT ... FROM origin_summary\` runs the stored query. Your changes only affect your own temporary copy of the database.`,
    },
    {
      dataset: 'nycflights13',
      title: 'A view of long delays',
      brief: `**Step 1:** create a view named \`long_delays\` with the columns \`carrier\`, \`flight\` and \`arr_delay\`, holding the flights with an arrival delay **above 60** minutes.

**Step 2:** query it to **return** \`carrier\` and \`delays\` (how many rows it holds per carrier) for the **top 5 carriers**. Most first; break ties by \`carrier\`.`,
      reference: 'CREATE VIEW long_delays AS SELECT carrier, flight, arr_delay FROM flights WHERE arr_delay > 60; SELECT carrier, COUNT(*) AS delays FROM long_delays GROUP BY carrier ORDER BY delays DESC, carrier LIMIT 5;',
      orderMatters: true,
      walkthrough: `A view can hold a filter, so every report agrees on what "long delay" means. Change the threshold in one place and everything that uses the view follows.`,
    },
  ],

  'sql-dml': [
    {
      dataset: 'nycflights13',
      title: 'Remove the cancelled flights',
      brief: `**Step 1:** \`DELETE\` every cancelled flight (\`dep_time IS NULL\`) from \`flights\`.

**Step 2:** **return** \`origin\` and \`flights\` (how many flights remain from each origin), sorted by \`origin\`.

Your changes affect only your own copy of the database.`,
      reference: 'DELETE FROM flights WHERE dep_time IS NULL; SELECT origin, COUNT(*) AS flights FROM flights GROUP BY origin ORDER BY origin;',
      orderMatters: true,
      walkthrough: `Run the condition as a \`SELECT COUNT(*)\` first, to see how many rows the \`DELETE\` will remove. A \`DELETE\` without a \`WHERE\` empties the whole table.`,
    },
    {
      dataset: 'nycflights13',
      title: 'Add an airline',
      brief: `**Step 1:** \`INSERT\` a new airline into \`airlines\` with \`carrier\` **ZZ** and \`name\` **Zebra Air**.

**Step 2:** **return** \`carrier\` and \`name\` of every airline whose name **starts with the letter Z**.`,
      reference: "INSERT INTO airlines (carrier, name) VALUES ('ZZ', 'Zebra Air'); SELECT carrier, name FROM airlines WHERE name LIKE 'Z%';",
      orderMatters: false,
      walkthrough: `List the columns you are filling, then the values in the same order. Before your insert there was no airline starting with Z, so the final query shows just the row you added.`,
    },
  ],
}
