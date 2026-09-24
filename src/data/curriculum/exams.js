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
  ],
  intermediate: [
    {
      id: 'i-big-genres',
      points: 15,
      dataset: 'chinook',
      task: `**Return:** \`genre\` (the genre \`Name\`) and \`tracks\` (how many tracks it has) for genres with **at least 100 tracks**. Most tracks first; break ties by \`genre\`, A to Z.`,
      reference: `SELECT g.Name AS genre, COUNT(*) AS tracks FROM Track t JOIN Genre g ON g.GenreId = t.GenreId GROUP BY g.GenreId, g.Name HAVING COUNT(*) >= 100 ORDER BY tracks DESC, genre;`,
      orderMatters: true,
    },
    {
      id: 'i-top-spenders',
      points: 15,
      dataset: 'chinook',
      task: `**Return:** \`customer\` (\`FirstName\`, a space, then \`LastName\`) and \`total_spent\` (the sum of their invoice \`Total\`s, rounded to 2 decimals) for customers who spent **at least 45** in total. Sort by \`total_spent\` (as rounded), highest first; break ties by \`customer\`.`,
      reference: `SELECT c.FirstName || ' ' || c.LastName AS customer, ROUND(SUM(i.Total), 2) AS total_spent FROM Customer c JOIN Invoice i ON i.CustomerId = c.CustomerId GROUP BY c.CustomerId, c.FirstName, c.LastName HAVING SUM(i.Total) >= 45 ORDER BY total_spent DESC, customer;`,
      orderMatters: true,
    },
    {
      id: 'i-prolific-artists',
      points: 15,
      dataset: 'chinook',
      task: `**Return:** \`artist\` (the artist \`Name\`) and \`albums\` (how many albums they have) for artists with **at least 5 albums**. Most albums first; break ties by \`artist\`.`,
      reference: `SELECT ar.Name AS artist, COUNT(*) AS albums FROM Artist ar JOIN Album al ON al.ArtistId = ar.ArtistId GROUP BY ar.ArtistId, ar.Name HAVING COUNT(*) >= 5 ORDER BY albums DESC, artist;`,
      orderMatters: true,
    },
    {
      id: 'i-support-load',
      points: 15,
      dataset: 'chinook',
      task: `Each customer has a support representative (\`SupportRepId\` in \`Customer\`, an \`EmployeeId\` in \`Employee\`).

**Return:** \`employee\` (\`FirstName\`, a space, then \`LastName\`) and \`customers\` (how many customers they support), for every employee who supports at least one customer. Most customers first; break ties by \`employee\`.`,
      reference: `SELECT e.FirstName || ' ' || e.LastName AS employee, COUNT(*) AS customers FROM Employee e JOIN Customer c ON c.SupportRepId = e.EmployeeId GROUP BY e.EmployeeId, e.FirstName, e.LastName ORDER BY customers DESC, employee;`,
      orderMatters: true,
    },
  ],
  advanced: [
    {
      id: 'a-carrier-share',
      points: 15,
      dataset: 'nycflights13',
      task: `**Return:** \`carrier\`, \`flights\` (its number of flights) and \`share_pct\` (its share of **all** flights, as a percentage rounded to **1 decimal place**) for every carrier. Most flights first.`,
      reference: `SELECT carrier, COUNT(*) AS flights, ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS share_pct FROM flights GROUP BY carrier ORDER BY flights DESC;`,
      orderMatters: true,
    },
    {
      id: 'a-busy-destinations',
      points: 15,
      dataset: 'nycflights13',
      task: `Count the flights to each destination. **Return:** \`dest\` and \`flights\` for destinations that received **more flights than the average destination**. Most flights first; break ties by \`dest\`.`,
      reference: `WITH per_dest AS (SELECT dest, COUNT(*) AS flights FROM flights GROUP BY dest) SELECT dest, flights FROM per_dest WHERE flights > (SELECT AVG(flights) FROM per_dest) ORDER BY flights DESC, dest;`,
      orderMatters: true,
    },
    {
      id: 'a-alaska-airports',
      points: 15,
      dataset: 'nycflights13',
      task: `**Return:** \`faa\` and \`name\` of the airports in \`airports\` that are the destination of **at least one flight operated by carrier \`AS\`** (Alaska Airlines). Use \`EXISTS\`.`,
      reference: `SELECT faa, name FROM airports a WHERE EXISTS (SELECT 1 FROM flights f WHERE f.dest = a.faa AND f.carrier = 'AS');`,
      orderMatters: false,
    },
    {
      id: 'a-jfk-route-ranks',
      points: 15,
      dataset: 'nycflights13',
      task: `Look only at flights that left from **JFK**. Rank the destinations by number of flights with \`RANK()\` (most flights first, so rank 1 is the busiest).

**Return:** \`dest\`, \`flights\` and \`route_rank\` for the destinations ranked **1 to 5**. Sort by \`route_rank\`, then \`dest\`.`,
      reference: `SELECT dest, flights, route_rank FROM (SELECT dest, COUNT(*) AS flights, RANK() OVER (ORDER BY COUNT(*) DESC) AS route_rank FROM flights WHERE origin = 'JFK' GROUP BY dest) WHERE route_rank <= 5 ORDER BY route_rank, dest;`,
      orderMatters: true,
    },
  ],
  expert: [
    {
      id: 'x-longest-rain',
      points: 20,
      dataset: 'nycflights13',
      task: `A day is **rainy** at an airport if at least one hour that day had \`precip > 0\` in \`weather\` (use \`weather_date\` as the day).

**Return:** \`origin\` and \`longest_rain_streak\` (the largest number of **consecutive rainy days**) for each origin airport. Sort by \`origin\`.`,
      reference: `WITH rainy AS (SELECT DISTINCT origin, weather_date AS day FROM weather WHERE precip > 0), numbered AS (SELECT origin, day, date(day, '-' || ROW_NUMBER() OVER (PARTITION BY origin ORDER BY day) || ' days') AS grp FROM rainy), streaks AS (SELECT origin, COUNT(*) AS days FROM numbered GROUP BY origin, grp) SELECT origin, MAX(days) AS longest_rain_streak FROM streaks GROUP BY origin ORDER BY origin;`,
      orderMatters: true,
    },
    {
      id: 'x-cancelled-pivot',
      points: 20,
      dataset: 'nycflights13',
      task: `A flight with no departure time (\`dep_time IS NULL\`) was cancelled.

**Return:** \`month\`, \`EWR\`, \`JFK\` and \`LGA\`: for each month, how many **cancelled** flights left from each airport. Name the columns exactly as shown. Sort by \`month\`.`,
      reference: `SELECT month, SUM(origin = 'EWR') AS EWR, SUM(origin = 'JFK') AS JFK, SUM(origin = 'LGA') AS LGA FROM flights WHERE dep_time IS NULL GROUP BY month ORDER BY month;`,
      orderMatters: true,
    },
    {
      id: 'x-carrier-favourite',
      points: 20,
      dataset: 'nycflights13',
      task: `**Return:** \`carrier\`, \`dest\` and \`flights\`: for each carrier, the **single destination** it flew to most often, with that number of flights. Break ties by \`dest\`, A to Z. Sort by \`carrier\`.`,
      reference: `WITH routes AS (SELECT carrier, dest, COUNT(*) AS flights, ROW_NUMBER() OVER (PARTITION BY carrier ORDER BY COUNT(*) DESC, dest) AS rn FROM flights GROUP BY carrier, dest) SELECT carrier, dest, flights FROM routes WHERE rn = 1 ORDER BY carrier;`,
      orderMatters: true,
    },
    {
      id: 'x-pareto',
      points: 20,
      dataset: 'nycflights13',
      task: `**Return:** \`name\` (the airline name), \`flights\` and \`cumulative_pct\`: with the airlines sorted by \`flights\` (most first, ties by \`name\`), the **running share of all flights** in percent, rounded to **1 decimal place**. The last airline should reach 100.`,
      reference: `WITH c AS (SELECT a.name, COUNT(*) AS flights FROM flights f JOIN airlines a ON a.carrier = f.carrier GROUP BY a.carrier, a.name) SELECT name, flights, ROUND(100.0 * SUM(flights) OVER (ORDER BY flights DESC, name) / SUM(flights) OVER (), 1) AS cumulative_pct FROM c ORDER BY flights DESC, name;`,
      orderMatters: true,
    },
  ],
}
