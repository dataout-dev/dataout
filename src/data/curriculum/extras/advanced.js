export const advancedExtras = {
  'sql-subqueries': [
    {
      dataset: 'nycflights13',
      title: 'High airports in the Midwest',
      brief: `**Return:** \`faa\`, \`name\`, \`alt\` (altitude in feet) of the airports in the **America/Chicago** time zone whose altitude is **higher than the average altitude of all airports** in the \`airports\` table. Use a subquery for the average.`,
      reference: "SELECT faa, name, alt FROM airports WHERE tzone = 'America/Chicago' AND alt > (SELECT AVG(alt) FROM airports);",
      orderMatters: false,
      walkthrough: `The inner query, \`SELECT AVG(alt) FROM airports\`, produces one number. Note that it averages **all** airports, not just the Chicago ones: the filter on time zone belongs only to the outer query.`,
    },
    {
      dataset: 'nycflights13',
      title: 'Who flies to Los Angeles?',
      brief: `**Return:** \`name\` of every airline that operated **at least one flight from \`JFK\` to \`LAX\`**. Use a subquery with \`IN\`.`,
      reference: "SELECT name FROM airlines WHERE carrier IN (SELECT carrier FROM flights WHERE origin = 'JFK' AND dest = 'LAX');",
      orderMatters: false,
      walkthrough: `The inner query lists the airline codes that flew that route, and the outer query turns the codes into names. Run the inner query on its own first to see the list it produces.`,
    },
  ],

  'sql-correlated-subqueries': [
    {
      dataset: 'nycflights13',
      title: 'Bigger than the rest of the fleet',
      brief: `Airbus planes come in very different sizes.

**Return:** \`tailnum\` and \`seats\` of planes whose \`manufacturer\` is **AIRBUS** and that have **more seats than the average of their own manufacturer**. Use a correlated subquery.`,
      reference: "SELECT tailnum, seats FROM planes p WHERE manufacturer = 'AIRBUS' AND seats > (SELECT AVG(seats) FROM planes WHERE manufacturer = p.manufacturer);",
      orderMatters: false,
      walkthrough: `The inner query mentions \`p.manufacturer\`, a column of the outer row, so it is recomputed for every plane. The exact text \`'AIRBUS'\` matters here: the data also has a separate manufacturer called \`AIRBUS INDUSTRIE\`.`,
    },
    {
      dataset: 'nycflights13',
      title: 'Later than their own airline',
      brief: `Look at a single day, **2013-06-15** (\`flight_date\`).

**Return:** \`carrier\`, \`flight\`, \`dep_delay\` for flights on that day whose departure delay was **greater than the average departure delay of the same carrier on that same day**.`,
      reference: "SELECT carrier, flight, dep_delay FROM flights f WHERE flight_date = '2013-06-15' AND dep_delay > (SELECT AVG(dep_delay) FROM flights WHERE flight_date = f.flight_date AND carrier = f.carrier);",
      orderMatters: false,
      walkthrough: `The subquery is correlated on **two** columns: the date and the carrier. Each flight is compared with the average for its own airline on its own day. Cancelled flights have a \`NULL\` delay and never qualify.`,
    },
  ],

  'sql-exists': [
    {
      dataset: 'nycflights13',
      title: 'Airlines at LaGuardia',
      brief: `**Return:** \`carrier\` and \`name\` of the airlines that have **at least one flight** leaving from \`LGA\`. Use \`EXISTS\`.`,
      reference: "SELECT carrier, name FROM airlines a WHERE EXISTS (SELECT 1 FROM flights f WHERE f.carrier = a.carrier AND f.origin = 'LGA');",
      orderMatters: false,
      walkthrough: `For each airline, the inner query asks whether any matching flight exists. It can stop at the first one, and it never produces duplicates the way a join would.`,
    },
    {
      dataset: 'nycflights13',
      title: 'Airlines that stopped flying in December',
      brief: `**Return:** \`carrier\` and \`name\` of airlines in \`airlines\` that have **no flights in month 12**. Use \`NOT EXISTS\`.`,
      reference: 'SELECT carrier, name FROM airlines a WHERE NOT EXISTS (SELECT 1 FROM flights f WHERE f.carrier = a.carrier AND f.month = 12);',
      orderMatters: false,
      walkthrough: `\`NOT EXISTS\` keeps the airlines for which the inner query finds nothing. A small regional airline whose flights appear only in some months is the kind of row this catches.`,
    },
  ],

  'sql-ctes': [
    {
      dataset: 'nycflights13',
      title: 'Busier than the average day',
      brief: `**Return:** \`flight_date\` and \`flights\` (the number of flights that day) for days with **more flights than the average day**. Most flights first; break ties by \`flight_date\`.`,
      reference: 'WITH daily AS (SELECT flight_date, COUNT(*) AS flights FROM flights GROUP BY flight_date) SELECT flight_date, flights FROM daily WHERE flights > (SELECT AVG(flights) FROM daily) ORDER BY flights DESC, flight_date;',
      orderMatters: true,
      walkthrough: `The CTE gives you one row per day. The main query then uses it twice: for the rows and for the average of those daily counts. The average is of **days**, not of individual flights.`,
    },
    {
      dataset: 'nycflights13',
      title: 'Above-average cancellations',
      brief: `A flight with no departure time (\`dep_time IS NULL\`) was cancelled.

**Return:** \`carrier\` and \`cancelled\` (its number of cancelled flights) for carriers whose cancellations are **above the average across carriers that had any**. Most cancellations first; break ties by \`carrier\`.`,
      reference: 'WITH cancelled_by_carrier AS (SELECT carrier, COUNT(*) AS cancelled FROM flights WHERE dep_time IS NULL GROUP BY carrier) SELECT carrier, cancelled FROM cancelled_by_carrier WHERE cancelled > (SELECT AVG(cancelled) FROM cancelled_by_carrier) ORDER BY cancelled DESC, carrier;',
      orderMatters: true,
      walkthrough: `A carrier with no cancellations has no row in the CTE, so it isn't part of the average. That is what "carriers that had any" means, and it is the sort of detail a CTE makes visible.`,
    },
  ],

  'sql-window-rank': [
    {
      dataset: 'nycflights13',
      title: 'Each airport\'s busiest months',
      brief: `**Return:** \`origin\`, \`month\`, \`flights\` (the number of flights that left that origin that month) and \`month_rank\` (\`RANK()\` of the month by \`flights\`, most first, restarting for each origin). Include every origin and month.`,
      reference: 'SELECT origin, month, COUNT(*) AS flights, RANK() OVER (PARTITION BY origin ORDER BY COUNT(*) DESC) AS month_rank FROM flights GROUP BY origin, month;',
      orderMatters: false,
      walkthrough: `\`GROUP BY\` builds one row per origin and month, and the window function then ranks those rows. \`PARTITION BY origin\` restarts the ranking for each airport, so each one has its own rank 1.`,
    },
    {
      dataset: 'nycflights13',
      title: 'Aircraft makers ranked',
      brief: `**Return:** \`manufacturer\`, \`planes\` (how many planes in \`planes\` it built) and \`planes_rank\` (\`RANK()\` by \`planes\`, most planes first). Include every manufacturer.`,
      reference: 'SELECT manufacturer, COUNT(*) AS planes, RANK() OVER (ORDER BY COUNT(*) DESC) AS planes_rank FROM planes GROUP BY manufacturer;',
      orderMatters: false,
      walkthrough: `Several small manufacturers each have only one plane, so they **tie** for the last rank. \`RANK()\` gives tied rows the same number and skips the numbers after them, so you'll see a jump at the bottom.`,
    },
  ],

  'sql-running-total': [
    {
      dataset: 'nycflights13',
      title: 'Cancellations piling up',
      brief: `**Return:** \`month\`, \`cancelled\` (the number of flights with no departure time that month) and \`running_cancelled\` (the total from January up to and including that month). Sort by \`month\`.`,
      reference: 'WITH monthly AS (SELECT month, COUNT(*) AS cancelled FROM flights WHERE dep_time IS NULL GROUP BY month) SELECT month, cancelled, SUM(cancelled) OVER (ORDER BY month) AS running_cancelled FROM monthly ORDER BY month;',
      orderMatters: true,
      walkthrough: `Aggregate first in a CTE, then run the window over the monthly rows. The last row's running total is the year's total number of cancelled flights.`,
    },
    {
      dataset: 'nycflights13',
      title: 'January, day by day',
      brief: `**Return:** \`flight_date\`, \`flights\` (the number of flights that day) and \`running_flights\` (the total from 1 January up to and including that day) for **January only** (\`month = 1\`). Sort by \`flight_date\`.`,
      reference: 'WITH daily AS (SELECT flight_date, COUNT(*) AS flights FROM flights WHERE month = 1 GROUP BY flight_date) SELECT flight_date, flights, SUM(flights) OVER (ORDER BY flight_date) AS running_flights FROM daily ORDER BY flight_date;',
      orderMatters: true,
      walkthrough: `The filter on the month goes inside the CTE, so the window only ever sees January's 31 days. \`flight_date\` is an ISO date, which sorts in time order as plain text.`,
    },
  ],

  'sql-lag-lead': [
    {
      dataset: 'nycflights13',
      title: 'Traffic month by month',
      brief: `**Return:** \`month\`, \`flights\` (the number of flights that month) and \`change\` (this month's flights minus the previous month's; \`NULL\` for January). Sort by \`month\`.`,
      reference: 'WITH monthly AS (SELECT month, COUNT(*) AS flights FROM flights GROUP BY month) SELECT month, flights, flights - LAG(flights) OVER (ORDER BY month) AS change FROM monthly ORDER BY month;',
      orderMatters: true,
      walkthrough: `\`LAG(flights)\` fetches the previous row's value in the window order, so subtracting it gives the change. The very first row has no previous row, so it comes out as \`NULL\`.`,
    },
    {
      dataset: 'nycflights13',
      title: 'January day to day',
      brief: `**Return:** \`flight_date\`, \`flights\` and \`change\` (the number of flights that day minus the previous day's; \`NULL\` for 1 January) for **January only** (\`month = 1\`). Sort by \`flight_date\`.`,
      reference: 'WITH daily AS (SELECT flight_date, COUNT(*) AS flights FROM flights WHERE month = 1 GROUP BY flight_date) SELECT flight_date, flights, flights - LAG(flights) OVER (ORDER BY flight_date) AS change FROM daily ORDER BY flight_date;',
      orderMatters: true,
      walkthrough: `Because the January filter is inside the CTE, 1 January has no previous row and its change is \`NULL\`. If you filtered after the window instead, 1 January would compare itself with 31 December.`,
    },
  ],

  'sql-ntile': [
    {
      dataset: 'nycflights13',
      title: 'Busy, average and quiet months',
      brief: `**Return:** \`month\`, \`flights\` and \`busy_group\`: split the 12 months into **3 groups** of four with \`NTILE(3)\` by \`flights\`, most flights first (group 1 is the busiest four). Break ties by \`month\`. Sort by \`flights\`, most first, then \`month\`.`,
      reference: 'WITH monthly AS (SELECT month, COUNT(*) AS flights FROM flights GROUP BY month) SELECT month, flights, NTILE(3) OVER (ORDER BY flights DESC, month) AS busy_group FROM monthly ORDER BY flights DESC, month;',
      orderMatters: true,
      walkthrough: `Twelve rows into three groups makes four each. The second sort key, \`month\`, only matters if two months had exactly the same number of flights, but it makes the result repeatable.`,
    },
    {
      dataset: 'nycflights13',
      title: 'The top tenth of destinations',
      brief: `**Return:** \`dest\` and \`flights\` for the destinations in the **top decile**: split the destinations into **10 groups** with \`NTILE(10)\` by number of flights (most first, ties by \`dest\`) and keep group 1. Sort by \`flights\`, most first, then \`dest\`.`,
      reference: 'WITH per_dest AS (SELECT dest, COUNT(*) AS flights, NTILE(10) OVER (ORDER BY COUNT(*) DESC, dest) AS decile FROM flights GROUP BY dest) SELECT dest, flights FROM per_dest WHERE decile = 1 ORDER BY flights DESC, dest;',
      orderMatters: true,
      walkthrough: `102 destinations don't divide evenly into ten, so the first groups get an extra row: group 1 holds 11 destinations. You can't filter on a window result in \`WHERE\` directly, which is why it's computed in the CTE first.`,
    },
  ],

  'sql-recursive-cte': [
    {
      dataset: 'chinook',
      title: 'Up the chain of command',
      brief: `So far you walked **down** an org chart. Now walk **up**: start at **Robert King** (\`EmployeeId\` 7) and follow \`ReportsTo\` until you reach the top.

**Return:** \`name\` (\`FirstName\`, a space, then \`LastName\`) and \`level\` (0 for Robert, 1 for his manager, and so on). Sort by \`level\`.`,
      reference: "WITH RECURSIVE chain(id, name, level) AS (SELECT EmployeeId, FirstName || ' ' || LastName, 0 FROM Employee WHERE EmployeeId = 7 UNION ALL SELECT m.EmployeeId, m.FirstName || ' ' || m.LastName, chain.level + 1 FROM chain JOIN Employee e ON e.EmployeeId = chain.id JOIN Employee m ON m.EmployeeId = e.ReportsTo) SELECT name, level FROM chain ORDER BY level;",
      orderMatters: true,
      walkthrough: `The direction of the join decides which way you walk. Going down, you look for rows whose manager is in the result. Going up, you look up the manager of the row you have. It stops when it reaches the General Manager, who reports to nobody.`,
    },
    {
      dataset: 'chinook',
      title: 'Nancy\'s whole team',
      brief: `**Return:** \`name\` (\`FirstName\`, a space, then \`LastName\`) and \`level\` for everyone who reports to **Nancy Edwards** (\`EmployeeId\` 2), directly (level 1) or indirectly (level 2 and beyond). Exclude Nancy. Sort by \`level\`, then \`name\`.`,
      reference: "WITH RECURSIVE team(id, name, level) AS (SELECT EmployeeId, FirstName || ' ' || LastName, 0 FROM Employee WHERE EmployeeId = 2 UNION ALL SELECT e.EmployeeId, e.FirstName || ' ' || e.LastName, team.level + 1 FROM Employee e JOIN team ON e.ReportsTo = team.id) SELECT name, level FROM team WHERE level > 0 ORDER BY level, name;",
      orderMatters: true,
      walkthrough: `The anchor picks Nancy. The recursive step finds anyone whose \`ReportsTo\` is already in the team. Here Nancy's reports have no reports of their own, so the walk stops after one level, but the same query works for any depth.`,
    },
  ],

  'sql-intersect-except': [
    {
      dataset: 'nycflights13',
      title: 'Reachable from both',
      brief: `**Return:** \`dest\`, each destination once, that has at least one flight from \`EWR\` **and** at least one flight from \`LGA\`. Use \`INTERSECT\`.`,
      reference: "SELECT DISTINCT dest FROM flights WHERE origin = 'EWR' INTERSECT SELECT DISTINCT dest FROM flights WHERE origin = 'LGA';",
      orderMatters: false,
      walkthrough: `\`INTERSECT\` keeps only the rows that appear in **both** result sets. Selecting just the \`dest\` column means whole rows are compared on the destination alone.`,
    },
    {
      dataset: 'nycflights13',
      title: 'An airline only at JFK',
      brief: `**Return:** \`carrier\`, each carrier once, that flew from \`JFK\` but **never** from \`EWR\`. Use \`EXCEPT\`.`,
      reference: "SELECT DISTINCT carrier FROM flights WHERE origin = 'JFK' EXCEPT SELECT DISTINCT carrier FROM flights WHERE origin = 'EWR';",
      orderMatters: false,
      walkthrough: `\`EXCEPT\` starts with the first list and removes everything that also appears in the second. Order matters: swapping the two queries would ask about carriers that flew from EWR but never from JFK.`,
    },
  ],
}
