export const expert = [
  {
    id: 'sql-top-n-per-group',
    title: 'Top N',
    titleAccent: 'per group.',
    topic: 'ROW_NUMBER and filtering',
    blurb: 'Pick the best few rows inside each group.',
    minutes: 40,
    skills: ['ROW_NUMBER', 'PARTITION BY', 'filtering on window results'],
    concept: '`LIMIT` cuts the whole result. To keep the top few per group, number the rows with `ROW_NUMBER() OVER (PARTITION BY ...)` and filter on that number.',
    prompt: 'Return region, rep and amount for the top 2 reps in each region by amount. Break ties by rep name. Sort by region, then amount (highest first), then rep.',
    successNote: 'You picked the top rows within each group by numbering them and filtering on the number.',
    orderMatters: true,
    schema: 'CREATE TABLE sales (region TEXT, rep TEXT, amount INT);',
    cases: [
      ['Sample', `INSERT INTO sales VALUES ('North','Chitra',300),('North','Ben',500),('North','Asha',300),('South','Dev',200),('South','Esha',150),('South','Farah',50);`],
      ['Normal case', `INSERT INTO sales VALUES ('East','Gopal',10),('East','Hina',90),('East','Ivan',70),('East','Jay',90),('West','Kabir',400);`],
      ['Edge case', `INSERT INTO sales VALUES ('Central','Leela',5);`],
    ],
    solution: 'WITH ranked AS (SELECT region, rep, amount, ROW_NUMBER() OVER (PARTITION BY region ORDER BY amount DESC, rep) AS rn FROM sales) SELECT region, rep, amount FROM ranked WHERE rn <= 2 ORDER BY region, amount DESC, rep',
    traps: [
      'SELECT region, rep, amount FROM sales ORDER BY amount DESC, rep LIMIT 2',
      'WITH ranked AS (SELECT region, rep, amount, ROW_NUMBER() OVER (PARTITION BY region ORDER BY amount DESC) AS rn FROM sales) SELECT region, rep, amount FROM ranked WHERE rn <= 2 ORDER BY region, amount DESC, rep',
    ],
    real: {
      dataset: 'nycflights13',
      title: 'Favourite destinations',
      brief: `What are the three most popular destinations from each New York airport?

**Return:** \`origin\`, \`dest\` and \`flights\` (the number of flights on that route) for the **top 3 destinations of each origin**. Break ties by \`dest\`, A to Z. Sort by \`origin\`, then \`flights\` (most first), then \`dest\`.`,
      reference: 'WITH routes AS (SELECT origin, dest, COUNT(*) AS flights, ROW_NUMBER() OVER (PARTITION BY origin ORDER BY COUNT(*) DESC, dest) AS rn FROM flights GROUP BY origin, dest) SELECT origin, dest, flights FROM routes WHERE rn <= 3 ORDER BY origin, flights DESC, dest;',
      orderMatters: true,
      walkthrough: `"Best three of each" is a classic interview question. \`LIMIT 3\` would keep three rows in total, not per origin.

Number the rows within each origin with \`ROW_NUMBER() OVER (PARTITION BY origin ORDER BY COUNT(*) DESC, dest)\`, then keep the rows numbered 1 to 3 in an outer query. The second sort key, \`dest\`, is the tie-breaker: without it, "the top 3" isn't well defined when two routes tie.`,
    },
  },

  {
    id: 'sql-pivot',
    title: 'Pivoting with',
    titleAccent: 'conditional aggregation.',
    topic: 'Rows into columns',
    blurb: 'Turn categories into columns with SUM and CASE.',
    minutes: 35,
    skills: ['SUM(CASE ...)', 'pivot', 'cross-tab'],
    concept: 'SQLite has no `PIVOT`, but a condition inside an aggregate does the same job: `SUM(status = \'delivered\')` counts only delivered rows.',
    prompt: 'Return customer, delivered and cancelled: how many of each customer\'s orders have that status.',
    successNote: 'You turned rows into columns with conditional aggregation.',
    schema: 'CREATE TABLE orders (customer TEXT, status TEXT);',
    cases: [
      ['Sample', `INSERT INTO orders VALUES ('Asha','delivered'),('Asha','delivered'),('Asha','cancelled'),('Ben','cancelled'),('Chitra','delivered');`],
      ['Normal case', `INSERT INTO orders VALUES ('Dev','delivered'),('Dev','shipped'),('Esha','shipped'),('Esha','cancelled'),('Esha','cancelled');`],
      ['Edge case', `INSERT INTO orders VALUES ('Farah','shipped');`],
    ],
    solution: "SELECT customer, SUM(status = 'delivered') AS delivered, SUM(status = 'cancelled') AS cancelled FROM orders GROUP BY customer",
    traps: ["SELECT customer, COUNT(*) AS delivered, COUNT(*) AS cancelled FROM orders GROUP BY customer"],
    real: {
      dataset: 'nycflights13',
      title: 'Airlines by airport',
      brief: `How does each airline split its flights between the three New York airports?

**Return:** \`carrier\`, \`EWR\`, \`JFK\` and \`LGA\`: for each carrier, the number of its flights that left from that airport. Name the columns exactly as shown.`,
      reference: "SELECT carrier, SUM(origin = 'EWR') AS EWR, SUM(origin = 'JFK') AS JFK, SUM(origin = 'LGA') AS LGA FROM flights GROUP BY carrier;",
      orderMatters: false,
      walkthrough: `In SQLite a comparison such as \`origin = 'EWR'\` is \`1\` when true and \`0\` when false, so \`SUM(origin = 'EWR')\` counts the matching rows. One such column per airport turns the three origins into three columns.

Other databases need \`SUM(CASE WHEN origin = 'EWR' THEN 1 ELSE 0 END)\`, the same idea written out.`,
    },
  },

  {
    id: 'sql-gaps-islands',
    title: 'Gaps and islands:',
    titleAccent: 'streaks.',
    topic: 'Consecutive runs',
    blurb: 'Find runs of consecutive days, such as login or rain streaks.',
    minutes: 45,
    skills: ['ROW_NUMBER trick', 'consecutive days', 'grouping by difference'],
    concept: 'Number the days with `ROW_NUMBER()`, then subtract that many days from each date. Consecutive days all land on the same result, so grouping by it gives one row per streak.',
    prompt: 'Return user, start_day, end_day and days (the length) for every streak of consecutive login days. Sort by user, then start_day.',
    successNote: 'You found streaks with the gaps-and-islands trick.',
    orderMatters: true,
    schema: 'CREATE TABLE logins (user TEXT, day TEXT);',
    cases: [
      ['Sample', `INSERT INTO logins VALUES ('asha','2024-03-01'),('asha','2024-03-02'),('asha','2024-03-03'),('asha','2024-03-05'),('asha','2024-03-06'),('ben','2024-03-01'),('ben','2024-03-04');`],
      ['Normal case', `INSERT INTO logins VALUES ('chitra','2024-02-27'),('chitra','2024-02-28'),('chitra','2024-02-29'),('chitra','2024-03-01'),('dev','2024-03-10'),('dev','2024-03-12'),('dev','2024-03-13');`],
      ['Edge case', `INSERT INTO logins VALUES ('esha','2024-12-31'),('esha','2025-01-01');`],
    ],
    solution: "WITH numbered AS (SELECT user, day, date(day, '-' || ROW_NUMBER() OVER (PARTITION BY user ORDER BY day) || ' days') AS grp FROM logins) SELECT user, MIN(day) AS start_day, MAX(day) AS end_day, COUNT(*) AS days FROM numbered GROUP BY user, grp ORDER BY user, start_day",
    traps: ['SELECT user, MIN(day) AS start_day, MAX(day) AS end_day, COUNT(*) AS days FROM logins GROUP BY user ORDER BY user, start_day'],
    real: {
      dataset: 'nycflights13',
      title: 'Rainy streaks at Newark',
      brief: `The \`weather\` table has one row per hour for each origin airport. \`precip\` is the rainfall in inches during that hour. A day is **rainy** if at least one hour at \`EWR\` had \`precip > 0\`.

**Return:** \`start_day\`, \`end_day\` and \`days\` for every streak of **3 or more consecutive rainy days** at EWR. Use \`weather_date\` as the day. Sort by \`start_day\`.`,
      reference: "WITH rainy AS (SELECT DISTINCT weather_date AS day FROM weather WHERE origin = 'EWR' AND precip > 0), numbered AS (SELECT day, date(day, '-' || ROW_NUMBER() OVER (ORDER BY day) || ' days') AS grp FROM rainy) SELECT MIN(day) AS start_day, MAX(day) AS end_day, COUNT(*) AS days FROM numbered GROUP BY grp HAVING COUNT(*) >= 3 ORDER BY start_day;",
      orderMatters: true,
      walkthrough: `Take the distinct rainy days and number them 1, 2, 3, and so on. Subtract that number of days from each date. While the days are consecutive, both the date and the counter go up by one each step, so the difference stays **the same**. A gap in the dates makes it jump. Grouping by that difference gives one group per streak.

\`HAVING COUNT(*) >= 3\` then keeps the long ones. Look at the intermediate \`grp\` column on a few rows to see it happen.`,
    },
  },

  {
    id: 'sql-dedupe',
    title: 'Cleaning and',
    titleAccent: 'de-duplicating data.',
    topic: 'Finding duplicates',
    blurb: 'Normalise text, find repeated rows and choose which to keep.',
    minutes: 35,
    skills: ['TRIM', 'LOWER', 'GROUP BY duplicates', 'MIN(id)'],
    concept: 'Normalise first (`LOWER(TRIM(x))`), then group. `COUNT(*) > 1` finds duplicates, and `MIN(id)` picks one row to keep.',
    prompt: 'Return email (lower-case), keep_id (the lowest id with that email) and copies (how many rows share it), for emails that appear more than once. Ignore rows with no email. Sort by keep_id.',
    successNote: 'You found duplicates that differed only in case, and chose which row to keep.',
    orderMatters: true,
    schema: 'CREATE TABLE contacts (id INT, name TEXT, email TEXT);',
    cases: [
      ['Sample', `INSERT INTO contacts VALUES (1,'Asha','ASHA@EXAMPLE.COM'),(2,'Asha R','asha@example.com'),(3,'Bilal','bilal@example.com'),(4,'Chitra',NULL),(5,'Chitra R',NULL);`],
      ['Normal case', `INSERT INTO contacts VALUES (10,'Dev','dev@x.io'),(11,'Esha','Esha@X.io'),(12,'Dev D','Dev@x.io'),(13,'Esha E','esha@x.io'),(14,'Esha F','ESHA@X.IO');`],
      ['Edge case', `INSERT INTO contacts VALUES (1,'Farah','farah@x.io'),(2,'Gopal','gopal@x.io');`],
    ],
    solution: 'SELECT LOWER(email) AS email, MIN(id) AS keep_id, COUNT(*) AS copies FROM contacts WHERE email IS NOT NULL GROUP BY LOWER(email) HAVING COUNT(*) > 1 ORDER BY keep_id',
    traps: [
      'SELECT email, MIN(id) AS keep_id, COUNT(*) AS copies FROM contacts WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1 ORDER BY keep_id',
      'SELECT LOWER(email) AS email, MIN(id) AS keep_id, COUNT(*) AS copies FROM contacts GROUP BY LOWER(email) HAVING COUNT(*) > 1 ORDER BY keep_id',
    ],
    real: {
      dataset: 'chinook',
      title: 'Songs that appear many times',
      brief: `The same song name can appear on many albums (live versions, compilations, reissues).

**Return:** \`Name\` (the track name), \`copies\` (how many tracks have that name) and \`keep_id\` (the lowest \`TrackId\` among them), for track names that appear **more than 3 times**. Most copies first; break ties by \`Name\`.`,
      reference: 'SELECT Name, COUNT(*) AS copies, MIN(TrackId) AS keep_id FROM Track GROUP BY Name HAVING COUNT(*) > 3 ORDER BY copies DESC, Name;',
      orderMatters: true,
      walkthrough: `Group by the thing that should be unique, then \`HAVING COUNT(*) > 1\` (here \`> 3\`) shows the groups that repeat. \`MIN(TrackId)\` gives one stable row to keep per group.

Always look before you delete. These "duplicates" may be genuinely different recordings, so a name match is a lead, not proof.`,
    },
  },

  {
    id: 'sql-data-quality',
    title: 'Data',
    titleAccent: 'quality checks.',
    topic: 'Can I trust this data?',
    blurb: 'Write queries that expose missing links and bad values.',
    minutes: 35,
    skills: ['reconciliation', 'anti-join', 'sanity queries'],
    concept: 'Write checks as queries that should return no rows: orders with no customer, prices that don\'t match, missing links between tables.',
    prompt: 'Return order_id, product and discount_pct: the percentage below list price (rounded to 1 decimal place) for every order line sold for less than its list price. Sort by order_id, then product.',
    successNote: 'You wrote a query that surfaces suspicious rows instead of hiding them.',
    orderMatters: true,
    schema: 'CREATE TABLE order_lines (order_id INT, product TEXT, list_price INT, sold_price INT);',
    cases: [
      ['Sample', `INSERT INTO order_lines VALUES (1,'Notebook',100,100),(1,'Pen',20,15),(2,'Backpack',200,150),(3,'Desk Lamp',90,90);`],
      ['Normal case', `INSERT INTO order_lines VALUES (5,'Tape',30,27),(4,'Glue',40,40),(4,'Ruler',7,5),(6,'Mug',120,130);`],
      ['Edge case', `INSERT INTO order_lines VALUES (1,'Pen',10,10);`],
    ],
    solution: 'SELECT order_id, product, ROUND(100.0 * (list_price - sold_price) / list_price, 1) AS discount_pct FROM order_lines WHERE sold_price < list_price ORDER BY order_id, product',
    traps: [
      'SELECT order_id, product, ROUND(100 * (list_price - sold_price) / list_price, 1) AS discount_pct FROM order_lines WHERE sold_price < list_price ORDER BY order_id, product',
      'SELECT order_id, product, ROUND(100.0 * (list_price - sold_price) / list_price, 1) AS discount_pct FROM order_lines WHERE sold_price <> list_price ORDER BY order_id, product',
    ],
    real: {
      dataset: 'nycflights13',
      title: 'Flights with no plane record',
      brief: `Every flight has a \`tailnum\` (the aircraft's registration). It should match a row in \`planes\`. Some don't: the tail number is missing, or the plane was never recorded.

**Return:** \`carrier\` and \`flights_without_plane\`: for each carrier, how many of its flights have **no matching row in \`planes\`** (including flights with no \`tailnum\`). Most first; break ties by \`carrier\`.`,
      reference: 'SELECT f.carrier, COUNT(*) AS flights_without_plane FROM flights f LEFT JOIN planes p ON p.tailnum = f.tailnum WHERE p.tailnum IS NULL GROUP BY f.carrier ORDER BY flights_without_plane DESC, f.carrier;',
      orderMatters: true,
      walkthrough: `This is the anti-join pattern again, used as a **data-quality check**: a \`LEFT JOIN\` to \`planes\`, keeping the flights where no plane was found. A flight with a \`NULL\` \`tailnum\` never matches anything, so it is counted too.

Checks like this belong in any pipeline. If the count jumps tomorrow, something upstream broke.`,
    },
  },

  {
    id: 'sql-views',
    title: 'Views:',
    titleAccent: 'saving a query.',
    topic: 'CREATE VIEW',
    blurb: 'Give a complicated query a name and reuse it.',
    minutes: 25,
    skills: ['CREATE VIEW', 'reusable logic'],
    concept: 'A view is a saved `SELECT` that behaves like a table. It stores no data: it re-runs the query each time. This test runs your whole script: create the view, then query it.',
    prompt: 'First create a view called delivered_totals with columns customer and total (the sum of amount for that customer\'s delivered orders). Then query it and return customer and total for totals above 100, highest first (ties by customer).',
    successNote: 'You saved a query as a view and used it like a table.',
    orderMatters: true,
    schema: 'CREATE TABLE orders (id INT, customer TEXT, status TEXT, amount INT);',
    cases: [
      ['Sample', `INSERT INTO orders VALUES (1,'Asha','delivered',80),(2,'Asha','delivered',60),(3,'Ben','cancelled',500),(4,'Ben','delivered',90),(5,'Chitra','delivered',300);`],
      ['Normal case', `INSERT INTO orders VALUES (1,'Dev','delivered',60),(2,'Dev','delivered',40),(3,'Esha','delivered',101),(4,'Farah','shipped',900),(5,'Gopal','delivered',101);`],
      ['Edge case', `INSERT INTO orders VALUES (1,'Hina','delivered',50);`],
    ],
    solution: "CREATE VIEW delivered_totals AS SELECT customer, SUM(amount) AS total FROM orders WHERE status = 'delivered' GROUP BY customer; SELECT customer, total FROM delivered_totals WHERE total > 100 ORDER BY total DESC, customer;",
    traps: [
      "CREATE VIEW delivered_totals AS SELECT customer, SUM(amount) AS total FROM orders GROUP BY customer; SELECT customer, total FROM delivered_totals WHERE total > 100 ORDER BY total DESC, customer;",
      "CREATE VIEW delivered_totals AS SELECT customer, SUM(amount) AS total FROM orders WHERE status = 'delivered' GROUP BY customer; SELECT customer, total FROM delivered_totals WHERE total >= 100 ORDER BY total DESC, customer;",
    ],
    real: {
      dataset: 'nycflights13',
      title: 'A carrier summary view',
      brief: `**Step 1:** create a view named \`carrier_summary\` with the columns \`carrier\`, \`flights\` (its number of flights) and \`avg_dep_delay\` (the average \`dep_delay\`, rounded to 1 decimal).

**Step 2:** query it, joined to \`airlines\`, to **return** \`name\` (the airline name), \`flights\` and \`avg_dep_delay\` for airlines with **at least 3000 flights**. Most flights first.

Write both statements in the editor, separated by a semicolon. The result of the last query is what gets checked.`,
      reference: 'CREATE VIEW carrier_summary AS SELECT carrier, COUNT(*) AS flights, ROUND(AVG(dep_delay), 1) AS avg_dep_delay FROM flights GROUP BY carrier; SELECT a.name, s.flights, s.avg_dep_delay FROM carrier_summary s JOIN airlines a ON a.carrier = s.carrier WHERE s.flights >= 3000 ORDER BY s.flights DESC;',
      orderMatters: true,
      walkthrough: `A view is a named query. \`carrier_summary\` holds no rows of its own: every time you \`SELECT\` from it, the database runs the stored query. That makes it a good place to put a calculation that many reports share, so everyone agrees on what "average delay" means.

Your changes only affect your own copy of the database. It is thrown away after each run.`,
    },
  },

  {
    id: 'sql-dml',
    title: 'Changing data:',
    titleAccent: 'INSERT, UPDATE, DELETE.',
    topic: 'Data modification',
    blurb: 'Add, change and remove rows safely.',
    minutes: 35,
    skills: ['INSERT', 'UPDATE', 'DELETE', 'WHERE safety'],
    concept: '`INSERT` adds rows, `UPDATE ... SET ... WHERE` changes them, and `DELETE FROM ... WHERE` removes them. Forget the `WHERE` and you change every row.',
    prompt: 'Give every Sales employee hired before 2022-01-01 a 10% raise (the new salary rounded to a whole number). Then return name, department and salary of all employees, sorted by name.',
    successNote: 'You changed rows with UPDATE, limited by a careful WHERE.',
    orderMatters: true,
    schema: 'CREATE TABLE employees (name TEXT, department TEXT, salary INT, hire_date TEXT);',
    cases: [
      ['Sample', `INSERT INTO employees VALUES ('Pooja','Sales',90000,'2021-02-14'),('Karan','Sales',85000,'2022-05-30'),('Nikhil','Sales',150000,'2016-11-05'),('Rohan','Engineering',180000,'2017-06-15');`],
      ['Normal case', `INSERT INTO employees VALUES ('Aditya','Sales',100000,'2021-12-31'),('Sneha','Sales',100000,'2022-01-01'),('Tanvi','HR',70000,'2015-01-01'),('Divya','Sales',33333,'2010-05-05');`],
      ['Edge case', `INSERT INTO employees VALUES ('Rahul','HR',70000,'2019-01-16');`],
    ],
    solution: "UPDATE employees SET salary = ROUND(salary * 1.10) WHERE department = 'Sales' AND hire_date < '2022-01-01'; SELECT name, department, salary FROM employees ORDER BY name;",
    traps: [
      "UPDATE employees SET salary = ROUND(salary * 1.10) WHERE hire_date < '2022-01-01'; SELECT name, department, salary FROM employees ORDER BY name;",
      "UPDATE employees SET salary = ROUND(salary * 1.10) WHERE department = 'Sales' AND hire_date <= '2022-01-01'; SELECT name, department, salary FROM employees ORDER BY name;",
    ],
    real: {
      dataset: 'nycflights13',
      title: 'Treat early departures as on time',
      brief: `A flight that left early has a **negative** \`dep_delay\`. For a report, the airline wants early departures counted as on time.

**Step 1:** \`UPDATE\` the \`flights\` table to set \`dep_delay\` to **0** wherever it is negative.

**Step 2:** **return** \`carrier\` and \`avg_dep_delay\` (the average \`dep_delay\`, rounded to 2 decimals) for the **5 carriers with the highest average**. Break ties by \`carrier\`.

Your changes affect only your own copy of the database.`,
      reference: 'UPDATE flights SET dep_delay = 0 WHERE dep_delay < 0; SELECT carrier, ROUND(AVG(dep_delay), 2) AS avg_dep_delay FROM flights GROUP BY carrier ORDER BY avg_dep_delay DESC, carrier LIMIT 5;',
      orderMatters: true,
      walkthrough: `\`UPDATE flights SET dep_delay = 0 WHERE dep_delay < 0\` changes only the rows the \`WHERE\` selects. Without the \`WHERE\`, every flight would get a delay of 0.

A good habit: write the condition as a \`SELECT\` first (\`SELECT COUNT(*) FROM flights WHERE dep_delay < 0\`) to see how many rows you're about to change. Rows with a \`NULL\` delay (cancelled flights) are not touched, since \`NULL < 0\` isn't true.`,
    },
  },

  {
    id: 'sql-indexes-plans',
    title: 'Indexes and',
    titleAccent: 'query plans.',
    topic: 'Why a query is slow',
    blurb: 'Understand what the database does, and when an index helps.',
    minutes: 30,
    skills: ['CREATE INDEX', 'EXPLAIN QUERY PLAN', 'scan vs search'],
    concept: 'Without an index the database reads every row (a scan). An index lets it jump straight to matching rows (a search).',
    successNote: 'You read a query plan and chose the right fix for a slow filter.',
    kind: 'mcq',
    question: 'You run `SELECT * FROM orders WHERE customer_id = 7` on a table with millions of rows, and it is slow. `EXPLAIN QUERY PLAN` says `SCAN orders`. What is the best fix?',
    options: [
      'Rewrite the query using `SELECT DISTINCT`.',
      'Add `ORDER BY customer_id` to the query.',
      'Create an index on `orders(customer_id)`.',
      'Replace `=` with `LIKE`.',
    ],
    correct: 'C',
    why: '`SCAN` means every row is read. An index on the filtered column lets SQLite `SEARCH` directly, and the plan changes to `SEARCH orders USING INDEX ...`. `DISTINCT` and `ORDER BY` add work, and `LIKE` is usually slower than `=`.',
  },

  {
    id: 'sql-transactions',
    title: 'Transactions and',
    titleAccent: 'constraints.',
    topic: 'Keeping data correct',
    blurb: 'Make changes all-or-nothing, and stop bad data getting in.',
    minutes: 25,
    skills: ['BEGIN / COMMIT / ROLLBACK', 'PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE / NOT NULL / CHECK'],
    concept: 'A transaction makes several statements succeed or fail together. Constraints are rules the database enforces so bad data can\'t get in.',
    successNote: 'You know how a transaction keeps a multi-step change safe.',
    kind: 'mcq',
    question: 'Moving 500 from account A to account B takes two `UPDATE` statements. The server crashes after the first one. Which design guarantees the money is never lost or duplicated?',
    options: [
      'Run the two updates twice to be safe.',
      'Wrap both updates in one transaction, so they either both commit or both roll back.',
      'Add an index on the balance column.',
      'Use `UNION ALL` to combine the two accounts.',
    ],
    correct: 'B',
    why: 'That is what a transaction is for: atomicity. Either both changes are applied, or neither is. Running the updates twice would move the money twice.',
  },
]
