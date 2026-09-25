export const exams = {
  beginner: [
    {
      id: 'b-gentoo-heavy',
      points: 10,
      dataset: 'palmer-penguins',
      task: `**Return:** \`id\`, \`body_mass_g\` of **Gentoo** penguins that weigh **at least 6000 g**. Heaviest first; break ties by \`id\`, smallest first.`,
      reference: `SELECT id, body_mass_g FROM penguins WHERE species = 'Gentoo' AND body_mass_g >= 6000 ORDER BY body_mass_g DESC, id ASC;`,
      orderMatters: true,
    },
    {
      id: 'b-unsexed-islands',
      points: 10,
      dataset: 'palmer-penguins',
      task: `**Return:** \`id\`, \`species\`, \`island\` of penguins on **Dream or Torgersen** whose \`sex\` is missing.`,
      reference: `SELECT id, species, island FROM penguins WHERE island IN ('Dream', 'Torgersen') AND sex IS NULL;`,
      orderMatters: false,
    },
    {
      id: 'b-torgersen-kg',
      points: 10,
      dataset: 'palmer-penguins',
      task: `**Return:** \`id\`, \`body_mass_kg\` (\`body_mass_g\` divided by 1000, rounded to **1 decimal place**) for penguins on **Torgersen** that weigh **more than 4000 g**.`,
      reference: `SELECT id, ROUND(body_mass_g / 1000.0, 1) AS body_mass_kg FROM penguins WHERE island = 'Torgersen' AND body_mass_g > 4000;`,
      orderMatters: false,
    },
    {
      id: 'b-dream-years',
      points: 10,
      dataset: 'palmer-penguins',
      task: `**Return:** the distinct \`year\` and \`species\` combinations found on **Dream** island, sorted by \`year\`, then \`species\`.`,
      reference: `SELECT DISTINCT year, species FROM penguins WHERE island = 'Dream' ORDER BY year, species;`,
      orderMatters: true,
    },
    {
      id: 'b-c-species-midweight',
      points: 10,
      dataset: 'palmer-penguins',
      task: `**Return:** \`id\`, \`species\`, \`body_mass_g\` of penguins whose species name **starts with the letter C** and whose body mass is **between 3500 and 4000 grams, inclusive**.`,
      reference: `SELECT id, species, body_mass_g FROM penguins WHERE species LIKE 'C%' AND body_mass_g BETWEEN 3500 AND 4000;`,
      orderMatters: false,
    },
    {
      id: 'b-live-albums',
      points: 10,
      dataset: 'chinook',
      task: `**Return:** \`AlbumId\` and \`Title\` of albums whose title **contains** the word \`Live\` (any capital letters).`,
      reference: `SELECT AlbumId, Title FROM Album WHERE Title LIKE '%Live%';`,
      orderMatters: false,
    },
    {
      id: 'b-male-chinstraps',
      points: 10,
      dataset: 'palmer-penguins',
      task: `**Return:** \`id\`, \`sex\`, \`body_mass_g\` of **male Chinstrap** penguins that weigh **more than 4000 g**. Heaviest first; break ties by \`id\`, smallest first.`,
      reference: `SELECT id, sex, body_mass_g FROM penguins WHERE species = 'Chinstrap' AND sex = 'male' AND body_mass_g > 4000 ORDER BY body_mass_g DESC, id ASC;`,
      orderMatters: true,
    },
    {
      id: 'b-longest-flippers',
      points: 10,
      dataset: 'palmer-penguins',
      task: `**Return:** \`id\`, \`species\`, \`flipper_length_mm\` of the **5 penguins with the longest flippers**. Break ties by \`id\`, smallest first.`,
      reference: `SELECT id, species, flipper_length_mm FROM penguins ORDER BY flipper_length_mm DESC, id ASC LIMIT 5;`,
      orderMatters: true,
    },
    {
      id: 'b-2007-pairs',
      points: 10,
      dataset: 'palmer-penguins',
      task: `**Return:** the distinct \`species\` and \`island\` combinations found in **2007**, sorted by \`species\`, then \`island\`.`,
      reference: `SELECT DISTINCT species, island FROM penguins WHERE year = 2007 ORDER BY species, island;`,
      orderMatters: true,
    },
    {
      id: 'b-mass-per-mm',
      points: 10,
      dataset: 'palmer-penguins',
      task: `**Return:** \`id\` and \`mass_per_mm\` (\`body_mass_g\` divided by \`flipper_length_mm\`, rounded to **1 decimal place**) for penguins with a flipper length of **215 mm or more**. Sort by \`mass_per_mm\` (as rounded), highest first, then \`id\`.`,
      reference: `SELECT id, ROUND(body_mass_g * 1.0 / flipper_length_mm, 1) AS mass_per_mm FROM penguins WHERE flipper_length_mm >= 215 ORDER BY mass_per_mm DESC, id ASC;`,
      orderMatters: true,
    },
  ],
  intermediate: [
    {
      id: 'i-big-genres',
      points: 10,
      dataset: 'chinook',
      task: `**Return:** \`genre\` (the genre \`Name\`) and \`tracks\` (how many tracks it has) for genres with **at least 100 tracks**. Most tracks first; break ties by \`genre\`, A to Z.`,
      reference: `SELECT g.Name AS genre, COUNT(*) AS tracks FROM Track t JOIN Genre g ON g.GenreId = t.GenreId GROUP BY g.GenreId, g.Name HAVING COUNT(*) >= 100 ORDER BY tracks DESC, genre;`,
      orderMatters: true,
    },
    {
      id: 'i-top-spenders',
      points: 10,
      dataset: 'chinook',
      task: `**Return:** \`customer\` (\`FirstName\`, a space, then \`LastName\`) and \`total_spent\` (the sum of their invoice \`Total\`s, rounded to 2 decimals) for customers who spent **at least 45** in total. Sort by \`total_spent\` (as rounded), highest first; break ties by \`customer\`.`,
      reference: `SELECT c.FirstName || ' ' || c.LastName AS customer, ROUND(SUM(i.Total), 2) AS total_spent FROM Customer c JOIN Invoice i ON i.CustomerId = c.CustomerId GROUP BY c.CustomerId, c.FirstName, c.LastName HAVING SUM(i.Total) >= 45 ORDER BY total_spent DESC, customer;`,
      orderMatters: true,
    },
    {
      id: 'i-prolific-artists',
      points: 10,
      dataset: 'chinook',
      task: `**Return:** \`artist\` (the artist \`Name\`) and \`albums\` (how many albums they have) for artists with **at least 5 albums**. Most albums first; break ties by \`artist\`.`,
      reference: `SELECT ar.Name AS artist, COUNT(*) AS albums FROM Artist ar JOIN Album al ON al.ArtistId = ar.ArtistId GROUP BY ar.ArtistId, ar.Name HAVING COUNT(*) >= 5 ORDER BY albums DESC, artist;`,
      orderMatters: true,
    },
    {
      id: 'i-support-load',
      points: 10,
      dataset: 'chinook',
      task: `Each customer has a support representative (\`SupportRepId\` in \`Customer\`, an \`EmployeeId\` in \`Employee\`).

**Return:** \`employee\` (\`FirstName\`, a space, then \`LastName\`) and \`customers\` (how many customers they support), for every employee who supports at least one customer. Most customers first; break ties by \`employee\`.`,
      reference: `SELECT e.FirstName || ' ' || e.LastName AS employee, COUNT(*) AS customers FROM Employee e JOIN Customer c ON c.SupportRepId = e.EmployeeId GROUP BY e.EmployeeId, e.FirstName, e.LastName ORDER BY customers DESC, employee;`,
      orderMatters: true,
    },
    {
      id: 'i-rich-countries',
      points: 10,
      dataset: 'chinook',
      task: `**Return:** \`BillingCountry\` and \`revenue\` (the sum of invoice \`Total\`s, rounded to **2 decimals**) for countries with total revenue of **at least 80**. Sort by \`revenue\` (as rounded), highest first, then \`BillingCountry\`.`,
      reference: `SELECT BillingCountry, ROUND(SUM(Total), 2) AS revenue FROM Invoice GROUP BY BillingCountry HAVING SUM(Total) >= 80 ORDER BY revenue DESC, BillingCountry;`,
      orderMatters: true,
    },
    {
      id: 'i-media-minutes',
      points: 10,
      dataset: 'chinook',
      task: `**Return:** \`media_type\` (the media type \`Name\`) and \`avg_minutes\` (the average track length in minutes, \`Milliseconds\` divided by 60000, rounded to **1 decimal place**) for each media type that has tracks. Sort by \`avg_minutes\` (as rounded), highest first, then \`media_type\`.`,
      reference: `SELECT mt.Name AS media_type, ROUND(AVG(t.Milliseconds) / 60000.0, 1) AS avg_minutes FROM MediaType mt JOIN Track t ON t.MediaTypeId = mt.MediaTypeId GROUP BY mt.MediaTypeId, mt.Name ORDER BY avg_minutes DESC, media_type;`,
      orderMatters: true,
    },
    {
      id: 'i-albumless-a',
      points: 10,
      dataset: 'chinook',
      task: `**Return:** \`Name\` of artists whose name **starts with the letter A** and who have **no albums** in \`Album\`.`,
      reference: `SELECT ar.Name FROM Artist ar LEFT JOIN Album al ON al.ArtistId = ar.ArtistId WHERE al.AlbumId IS NULL AND ar.Name LIKE 'A%';`,
      orderMatters: false,
    },
    {
      id: 'i-strong-months-2012',
      points: 10,
      dataset: 'chinook',
      task: `**Return:** \`month\` (as \`YYYY-MM\`) and \`revenue\` (the sum of invoice \`Total\`s, rounded to **2 decimals**) for the months of **2012** whose revenue was **above 40**. Sort by \`month\`.`,
      reference: `SELECT strftime('%Y-%m', InvoiceDate) AS month, ROUND(SUM(Total), 2) AS revenue FROM Invoice WHERE strftime('%Y', InvoiceDate) = '2012' GROUP BY month HAVING SUM(Total) > 40 ORDER BY month;`,
      orderMatters: true,
    },
    {
      id: 'i-email-domains',
      points: 10,
      dataset: 'chinook',
      task: `**Return:** \`domain\` (the part of \`Email\` after the \`@\`, in lower case) and \`customers\` for email domains used by **at least 3 customers**. Most customers first; break ties by \`domain\`.`,
      reference: `SELECT LOWER(SUBSTR(Email, INSTR(Email, '@') + 1)) AS domain, COUNT(*) AS customers FROM Customer GROUP BY domain HAVING COUNT(*) >= 3 ORDER BY customers DESC, domain;`,
      orderMatters: true,
    },
    {
      id: 'i-all-cities',
      points: 10,
      dataset: 'chinook',
      task: `**Return:** \`place\`, every \`City\` where a **customer lives or an employee works**, each city once, sorted A to Z. Use \`UNION\` on the \`Customer\` and \`Employee\` tables.`,
      reference: `SELECT City AS place FROM Customer UNION SELECT City FROM Employee ORDER BY place;`,
      orderMatters: true,
    },
  ],
  advanced: [
    {
      id: 'a-carrier-share',
      points: 10,
      dataset: 'nycflights13',
      task: `**Return:** \`carrier\`, \`flights\` (its number of flights) and \`share_pct\` (its share of **all** flights, as a percentage rounded to **1 decimal place**) for every carrier. Most flights first.`,
      reference: `SELECT carrier, COUNT(*) AS flights, ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS share_pct FROM flights GROUP BY carrier ORDER BY flights DESC;`,
      orderMatters: true,
    },
    {
      id: 'a-busy-destinations',
      points: 10,
      dataset: 'nycflights13',
      task: `Count the flights to each destination. **Return:** \`dest\` and \`flights\` for destinations that received **more flights than the average destination**. Most flights first; break ties by \`dest\`.`,
      reference: `WITH per_dest AS (SELECT dest, COUNT(*) AS flights FROM flights GROUP BY dest) SELECT dest, flights FROM per_dest WHERE flights > (SELECT AVG(flights) FROM per_dest) ORDER BY flights DESC, dest;`,
      orderMatters: true,
    },
    {
      id: 'a-alaska-airports',
      points: 10,
      dataset: 'nycflights13',
      task: `**Return:** \`faa\` and \`name\` of the airports in \`airports\` that are the destination of **at least one flight operated by carrier \`AS\`** (Alaska Airlines). Use \`EXISTS\`.`,
      reference: `SELECT faa, name FROM airports a WHERE EXISTS (SELECT 1 FROM flights f WHERE f.dest = a.faa AND f.carrier = 'AS');`,
      orderMatters: false,
    },
    {
      id: 'a-jfk-route-ranks',
      points: 10,
      dataset: 'nycflights13',
      task: `Look only at flights that left from **JFK**. Rank the destinations by number of flights with \`RANK()\` (most flights first, so rank 1 is the busiest).

**Return:** \`dest\`, \`flights\` and \`route_rank\` for the destinations ranked **1 to 5**. Sort by \`route_rank\`, then \`dest\`.`,
      reference: `SELECT dest, flights, route_rank FROM (SELECT dest, COUNT(*) AS flights, RANK() OVER (ORDER BY COUNT(*) DESC) AS route_rank FROM flights WHERE origin = 'JFK' GROUP BY dest) WHERE route_rank <= 5 ORDER BY route_rank, dest;`,
      orderMatters: true,
    },
    {
      id: 'a-march-delays',
      points: 10,
      dataset: 'nycflights13',
      task: `Look at one day, **2013-03-08** (\`flight_date\`).

**Return:** \`carrier\`, \`flight\`, \`dep_delay\` for flights that day whose departure delay was **greater than the average departure delay of the same carrier that day**.`,
      reference: `SELECT carrier, flight, dep_delay FROM flights f WHERE flight_date = '2013-03-08' AND dep_delay > (SELECT AVG(dep_delay) FROM flights WHERE flight_date = f.flight_date AND carrier = f.carrier);`,
      orderMatters: false,
    },
    {
      id: 'a-michael-team',
      points: 10,
      dataset: 'chinook',
      task: `**Return:** \`name\` (\`FirstName\`, a space, then \`LastName\`) and \`level\` for everyone who reports to **Michael Mitchell** (\`EmployeeId\` 6), directly (level 1) or indirectly. Exclude Michael. Sort by \`level\`, then \`name\`.`,
      reference: `WITH RECURSIVE team(id, name, level) AS (SELECT EmployeeId, FirstName || ' ' || LastName, 0 FROM Employee WHERE EmployeeId = 6 UNION ALL SELECT e.EmployeeId, e.FirstName || ' ' || e.LastName, team.level + 1 FROM Employee e JOIN team ON e.ReportsTo = team.id) SELECT name, level FROM team WHERE level > 0 ORDER BY level, name;`,
      orderMatters: true,
    },
    {
      id: 'a-ewr-monthly-change',
      points: 10,
      dataset: 'nycflights13',
      task: `Look only at flights that left from **EWR**.

**Return:** \`month\`, \`flights\` (the number of flights that month) and \`change\` (this month's flights minus the previous month's; \`NULL\` for January). Sort by \`month\`.`,
      reference: `WITH monthly AS (SELECT month, COUNT(*) AS flights FROM flights WHERE origin = 'EWR' GROUP BY month) SELECT month, flights, flights - LAG(flights) OVER (ORDER BY month) AS change FROM monthly ORDER BY month;`,
      orderMatters: true,
    },
    {
      id: 'a-lga-dense-ranks',
      points: 10,
      dataset: 'nycflights13',
      task: `Look only at flights that left from **LGA**. Rank the destinations by number of flights with \`DENSE_RANK()\` (most flights first).

**Return:** \`dest\`, \`flights\` and \`dest_rank\` for the destinations ranked **1 to 3**. Sort by \`dest_rank\`, then \`dest\`.`,
      reference: `SELECT dest, flights, dest_rank FROM (SELECT dest, COUNT(*) AS flights, DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS dest_rank FROM flights WHERE origin = 'LGA' GROUP BY dest) WHERE dest_rank <= 3 ORDER BY dest_rank, dest;`,
      orderMatters: true,
    },
    {
      id: 'a-not-from-jfk',
      points: 10,
      dataset: 'nycflights13',
      task: `**Return:** \`dest\`, each destination once, that is served from **both \`EWR\` and \`LGA\`** but has **no flights from \`JFK\`**. Use \`INTERSECT\` and \`EXCEPT\`.`,
      reference: `SELECT DISTINCT dest FROM flights WHERE origin = 'EWR' INTERSECT SELECT DISTINCT dest FROM flights WHERE origin = 'LGA' EXCEPT SELECT DISTINCT dest FROM flights WHERE origin = 'JFK';`,
      orderMatters: false,
    },
    {
      id: 'a-lga-running',
      points: 10,
      dataset: 'nycflights13',
      task: `Look only at flights that left from **LGA**.

**Return:** \`month\`, \`flights\` (the number of flights that month) and \`running_flights\` (the total from January up to and including that month). Sort by \`month\`.`,
      reference: `WITH monthly AS (SELECT month, COUNT(*) AS flights FROM flights WHERE origin = 'LGA' GROUP BY month) SELECT month, flights, SUM(flights) OVER (ORDER BY month) AS running_flights FROM monthly ORDER BY month;`,
      orderMatters: true,
    },
  ],
  expert: [
    {
      id: 'x-longest-rain',
      points: 10,
      dataset: 'nycflights13',
      task: `A day is **rainy** at an airport if at least one hour that day had \`precip > 0\` in \`weather\` (use \`weather_date\` as the day).

**Return:** \`origin\` and \`longest_rain_streak\` (the largest number of **consecutive rainy days**) for each origin airport. Sort by \`origin\`.`,
      reference: `WITH rainy AS (SELECT DISTINCT origin, weather_date AS day FROM weather WHERE precip > 0), numbered AS (SELECT origin, day, date(day, '-' || ROW_NUMBER() OVER (PARTITION BY origin ORDER BY day) || ' days') AS grp FROM rainy), streaks AS (SELECT origin, COUNT(*) AS days FROM numbered GROUP BY origin, grp) SELECT origin, MAX(days) AS longest_rain_streak FROM streaks GROUP BY origin ORDER BY origin;`,
      orderMatters: true,
    },
    {
      id: 'x-cancelled-pivot',
      points: 10,
      dataset: 'nycflights13',
      task: `A flight with no departure time (\`dep_time IS NULL\`) was cancelled.

**Return:** \`month\`, \`EWR\`, \`JFK\` and \`LGA\`: for each month, how many **cancelled** flights left from each airport. Name the columns exactly as shown. Sort by \`month\`.`,
      reference: `SELECT month, SUM(origin = 'EWR') AS EWR, SUM(origin = 'JFK') AS JFK, SUM(origin = 'LGA') AS LGA FROM flights WHERE dep_time IS NULL GROUP BY month ORDER BY month;`,
      orderMatters: true,
    },
    {
      id: 'x-carrier-favourite',
      points: 10,
      dataset: 'nycflights13',
      task: `**Return:** \`carrier\`, \`dest\` and \`flights\`: for each carrier, the **single destination** it flew to most often, with that number of flights. Break ties by \`dest\`, A to Z. Sort by \`carrier\`.`,
      reference: `WITH routes AS (SELECT carrier, dest, COUNT(*) AS flights, ROW_NUMBER() OVER (PARTITION BY carrier ORDER BY COUNT(*) DESC, dest) AS rn FROM flights GROUP BY carrier, dest) SELECT carrier, dest, flights FROM routes WHERE rn = 1 ORDER BY carrier;`,
      orderMatters: true,
    },
    {
      id: 'x-pareto',
      points: 10,
      dataset: 'nycflights13',
      task: `**Return:** \`name\` (the airline name), \`flights\` and \`cumulative_pct\`: with the airlines sorted by \`flights\` (most first, ties by \`name\`), the **running share of all flights** in percent, rounded to **1 decimal place**. The last airline should reach 100.`,
      reference: `WITH c AS (SELECT a.name, COUNT(*) AS flights FROM flights f JOIN airlines a ON a.carrier = f.carrier GROUP BY a.carrier, a.name) SELECT name, flights, ROUND(100.0 * SUM(flights) OVER (ORDER BY flights DESC, name) / SUM(flights) OVER (), 1) AS cumulative_pct FROM c ORDER BY flights DESC, name;`,
      orderMatters: true,
    },
    {
      id: 'x-big-fleets',
      points: 10,
      dataset: 'nycflights13',
      task: `**Return:** \`manufacturer\`, \`model\` and \`planes\` (how many planes in \`planes\` have that manufacturer and model) for combinations with **at least 100 planes**. Most planes first; break ties by \`manufacturer\`, then \`model\`.`,
      reference: `SELECT manufacturer, model, COUNT(*) AS planes FROM planes GROUP BY manufacturer, model HAVING COUNT(*) >= 100 ORDER BY planes DESC, manufacturer, model;`,
      orderMatters: true,
    },
    {
      id: 'x-unknown-destinations',
      points: 10,
      dataset: 'nycflights13',
      task: `Some \`dest\` codes in \`flights\` have **no matching row** in \`airports\`.

**Return:** \`dest\` and \`flights\` (how many flights go there) for those destinations. Most flights first; break ties by \`dest\`.`,
      reference: `SELECT f.dest, COUNT(*) AS flights FROM flights f LEFT JOIN airports a ON a.faa = f.dest WHERE a.faa IS NULL GROUP BY f.dest ORDER BY flights DESC, f.dest;`,
      orderMatters: true,
    },
    {
      id: 'x-carrier-peak-month',
      points: 10,
      dataset: 'nycflights13',
      task: `**Return:** \`carrier\`, \`month\` and \`flights\`: for each carrier, the **month in which it flew the most flights**, with that number. Break ties by the earlier \`month\`. Sort by \`carrier\`.`,
      reference: `WITH ranked AS (SELECT carrier, month, COUNT(*) AS flights, ROW_NUMBER() OVER (PARTITION BY carrier ORDER BY COUNT(*) DESC, month) AS rn FROM flights GROUP BY carrier, month) SELECT carrier, month, flights FROM ranked WHERE rn = 1 ORDER BY carrier;`,
      orderMatters: true,
    },
    {
      id: 'x-longest-fog',
      points: 10,
      dataset: 'nycflights13',
      task: `A day is **foggy** at an airport if at least one hour that day had \`visib\` **below 3** in \`weather\` (use \`weather_date\` as the day).

**Return:** \`origin\` and \`longest_foggy_streak\` (the largest number of **consecutive foggy days**) for each origin airport. Sort by \`origin\`.`,
      reference: `WITH foggy AS (SELECT DISTINCT origin, weather_date AS day FROM weather WHERE visib < 3), numbered AS (SELECT origin, day, date(day, '-' || ROW_NUMBER() OVER (PARTITION BY origin ORDER BY day) || ' days') AS grp FROM foggy), streaks AS (SELECT origin, COUNT(*) AS days FROM numbered GROUP BY origin, grp) SELECT origin, MAX(days) AS longest_foggy_streak FROM streaks GROUP BY origin ORDER BY origin;`,
      orderMatters: true,
    },
    {
      id: 'x-cancellation-view',
      points: 10,
      dataset: 'nycflights13',
      task: `**Step 1:** create a view named \`monthly_cancellations\` with the columns \`month\` and \`cancelled\` (the number of flights with no departure time that month).

**Step 2:** query it to **return** \`month\` and \`cancelled\` for months with **at least 100** cancelled flights. Most cancellations first; break ties by \`month\`.

Write both statements in the editor, separated by a semicolon.`,
      reference: `CREATE VIEW monthly_cancellations AS SELECT month, COUNT(*) AS cancelled FROM flights WHERE dep_time IS NULL GROUP BY month; SELECT month, cancelled FROM monthly_cancellations WHERE cancelled >= 100 ORDER BY cancelled DESC, month;`,
      orderMatters: true,
    },
    {
      id: 'x-drop-short-hops',
      points: 10,
      dataset: 'nycflights13',
      task: `**Step 1:** \`DELETE\` every flight with a \`distance\` **below 200** miles from \`flights\`.

**Step 2:** **return** \`origin\` and \`flights\` (how many flights remain from each origin), sorted by \`origin\`.

Your changes affect only your own copy of the database.`,
      reference: `DELETE FROM flights WHERE distance < 200; SELECT origin, COUNT(*) AS flights FROM flights GROUP BY origin ORDER BY origin;`,
      orderMatters: true,
    },
  ],
}
