export const advanced = [
  {
    id: 'sql-subqueries',
    title: 'Subqueries',
    titleAccent: 'in WHERE.',
    topic: 'A query inside a query',
    blurb: 'Use the result of one query as a value or list in another.',
    minutes: 30,
    skills: ['scalar subquery', 'IN (subquery)'],
    concept: 'A subquery is a query in parentheses. A scalar subquery returns one value to compare against; `IN (subquery)` returns a list.',
    prompt: 'Return name and price of every product that costs more than the average price of all products.',
    successNote: 'You used a subquery to compare each row with an overall figure.',
    schema: 'CREATE TABLE products (name TEXT, price INT);',
    cases: [
      ['Sample', `INSERT INTO products VALUES ('Notebook',40),('Pen',10),('Backpack',150),('Water Bottle',60),('Desk Lamp',90);`],
      ['Normal case', `INSERT INTO products VALUES ('Tape',20),('Glue',40),('Stapler',60);`],
      ['Edge case', `INSERT INTO products VALUES ('Solo',75);`],
    ],
    solution: 'SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products)',
    traps: ['SELECT name, price FROM products WHERE price >= (SELECT AVG(price) FROM products)', 'SELECT name, price FROM products WHERE price > 0'],
    real: {
      dataset: 'nycflights13',
      title: 'Airlines that fly to Seattle',
      brief: `Which airlines fly from New York to Seattle (\`SEA\`)?

\`flights.dest\` holds the destination airport code, and \`flights.carrier\` the airline code. The airline names are in \`airlines\`.

**Return:** \`name\` of every airline in \`airlines\` that operated **at least one flight to SEA**. Use a subquery with \`IN\`.`,
      reference: "SELECT name FROM airlines WHERE carrier IN (SELECT DISTINCT carrier FROM flights WHERE dest = 'SEA');",
      orderMatters: false,
      walkthrough: `The inner query, \`SELECT DISTINCT carrier FROM flights WHERE dest = 'SEA'\`, produces a list of airline codes. The outer query keeps the airlines whose code is in that list.

Read a subquery from the **inside out**. Run the inner query on its own first: it should make sense by itself.`,
    },
  },

  {
    id: 'sql-correlated-subqueries',
    title: 'Correlated',
    titleAccent: 'subqueries.',
    topic: 'Comparing a row with its own group',
    blurb: 'Compare each row against a figure computed for its own group.',
    minutes: 35,
    skills: ['correlated subquery', 'row-by-row comparison'],
    concept: 'A correlated subquery uses a column of the outer query, so it is re-evaluated for each outer row.',
    prompt: "Return name, department and salary of employees who earn more than the average salary of their own department.",
    successNote: 'You compared each row with an average computed for its own department.',
    schema: 'CREATE TABLE employees (name TEXT, department TEXT, salary INT);',
    cases: [
      ['Sample', `INSERT INTO employees VALUES ('Asha','Eng',100),('Ben','Eng',80),('Chitra','Eng',60),('Dev','Sales',50),('Esha','Sales',90);`],
      ['Normal case', `INSERT INTO employees VALUES ('Farah','HR',40),('Gopal','HR',60),('Hina','Ops',500),('Ivan','Ops',100),('Jay','Ops',100);`],
      ['Edge case', `INSERT INTO employees VALUES ('Kabir','Eng',70),('Leela','Eng',70),('Manu','Solo',999);`],
    ],
    solution: 'SELECT name, department, salary FROM employees e WHERE salary > (SELECT AVG(salary) FROM employees WHERE department = e.department)',
    traps: ['SELECT name, department, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)'],
    real: {
      dataset: 'nycflights13',
      title: 'High-altitude airports',
      brief: `The \`airports\` table lists airports across the United States, with their altitude \`alt\` in feet and their time zone \`tzone\`.

**Return:** \`faa\`, \`name\`, \`alt\` of the airports in the **America/Denver** time zone whose altitude is **higher than the average altitude of the airports in the same time zone**. Use a correlated subquery.`,
      reference: "SELECT faa, name, alt FROM airports a WHERE tzone = 'America/Denver' AND alt > (SELECT AVG(alt) FROM airports WHERE tzone = a.tzone);",
      orderMatters: false,
      walkthrough: `The inner query refers to \`a.tzone\`, a column of the **outer** row. That is what makes it correlated: for every airport it recomputes the average of that airport's time zone.

Here every airport is already in Denver, so a plain subquery gives the same answer. The correlated form is what you'd need without that filter, comparing each airport with its **own** time zone's average.`,
    },
  },

  {
    id: 'sql-exists',
    title: 'EXISTS and',
    titleAccent: 'NOT EXISTS.',
    topic: 'Testing for related rows',
    blurb: 'Ask whether related rows exist, safely.',
    minutes: 30,
    skills: ['EXISTS', 'NOT EXISTS', 'NOT IN and NULL'],
    concept: '`EXISTS (subquery)` is true when the subquery returns any row. `NOT EXISTS` finds rows with no match, and copes with `NULL`s.',
    prompt: 'Return the name of every product that has never been ordered (it never appears in order_items). Sort A to Z. Use NOT EXISTS.',
    successNote: 'You found unmatched rows with NOT EXISTS, which stays correct even when the other table has NULLs.',
    orderMatters: true,
    schema: 'CREATE TABLE products (id INT, name TEXT); CREATE TABLE order_items (order_id INT, product_id INT);',
    cases: [
      ['Sample', `INSERT INTO products VALUES (1,'Notebook'),(2,'Pen'),(3,'Backpack'),(4,'Desk Lamp'); INSERT INTO order_items VALUES (1,2),(1,1),(2,2),(3,NULL);`],
      ['Normal case', `INSERT INTO products VALUES (1,'Tape'),(2,'Glue'),(3,'Stapler'); INSERT INTO order_items VALUES (1,3),(2,NULL),(3,3);`],
      ['Edge case', `INSERT INTO products VALUES (1,'Mug'),(2,'Cup'); INSERT INTO order_items VALUES (1,1),(2,2);`],
    ],
    solution: 'SELECT name FROM products p WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id) ORDER BY name',
    traps: [
      'SELECT name FROM products WHERE id NOT IN (SELECT product_id FROM order_items) ORDER BY name',
      'SELECT p.name FROM products p JOIN order_items oi ON oi.product_id = p.id ORDER BY p.name',
    ],
    real: {
      dataset: 'nycflights13',
      title: 'Planes that never flew',
      brief: `The \`planes\` table lists aircraft. Some of them never appear in our \`flights\` sample.

**Return one row:** \`planes_never_flown\`, the number of planes in \`planes\` that have **no** flight in \`flights\` (match on \`tailnum\`). Use \`NOT EXISTS\`.`,
      reference: 'SELECT COUNT(*) AS planes_never_flown FROM planes p WHERE NOT EXISTS (SELECT 1 FROM flights f WHERE f.tailnum = p.tailnum);',
      orderMatters: false,
      walkthrough: `\`NOT EXISTS\` is true for a plane when the inner query finds no flight for it. The inner query only has to find **one** row to say "exists", which is why it selects the constant \`1\`.

Careful with \`NOT IN\`: if the list contains even one \`NULL\` (some flights have no \`tailnum\`), \`x NOT IN (...)\` is never true, and the query returns nothing. \`NOT EXISTS\` doesn't have that problem.`,
    },
  },

  {
    id: 'sql-ctes',
    title: 'Readable queries',
    titleAccent: 'with CTEs.',
    topic: 'WITH ... AS',
    blurb: 'Break a complex query into named, readable steps.',
    minutes: 30,
    skills: ['WITH', 'common table expressions', 'step-by-step queries'],
    concept: 'A CTE, `WITH name AS (query)`, gives a subquery a name so you can use it like a table. It turns a tangled query into steps.',
    prompt: 'Return rep and total (the sum of amount) for reps whose total is above the average of all the reps\' totals.',
    successNote: 'You built the query in named steps with a CTE.',
    schema: 'CREATE TABLE sales (rep TEXT, amount INT);',
    cases: [
      ['Sample', `INSERT INTO sales VALUES ('Asha',100),('Asha',50),('Ben',200),('Chitra',40),('Chitra',30),('Chitra',20);`],
      ['Normal case', `INSERT INTO sales VALUES ('Dev',10),('Esha',300),('Dev',15),('Farah',60),('Farah',60),('Farah',60);`],
      ['Edge case', `INSERT INTO sales VALUES ('Gopal',500),('Gopal',20);`],
    ],
    solution: 'WITH totals AS (SELECT rep, SUM(amount) AS total FROM sales GROUP BY rep) SELECT rep, total FROM totals WHERE total > (SELECT AVG(total) FROM totals)',
    traps: ['SELECT rep, SUM(amount) AS total FROM sales GROUP BY rep HAVING SUM(amount) > (SELECT AVG(amount) FROM sales)'],
    real: {
      dataset: 'nycflights13',
      title: 'The slowest airlines',
      brief: `Which airlines are late more than most?

Work out each airline's **average departure delay** (\`AVG(dep_delay)\`), then compare it with the **average of those averages**.

**Return:** \`name\` (the airline name) and \`avg_dep_delay\` (rounded to 1 decimal) for airlines whose average is **above** the average across airlines. Sort by \`avg_dep_delay\` (as rounded), highest first, then \`name\`.`,
      reference: 'WITH carrier_delay AS (SELECT carrier, AVG(dep_delay) AS avg_delay FROM flights GROUP BY carrier) SELECT a.name, ROUND(cd.avg_delay, 1) AS avg_dep_delay FROM carrier_delay cd JOIN airlines a ON a.carrier = cd.carrier WHERE cd.avg_delay > (SELECT AVG(avg_delay) FROM carrier_delay) ORDER BY avg_dep_delay DESC, a.name;',
      orderMatters: true,
      walkthrough: `Step one, the CTE, computes one row per airline. Step two uses it twice: once in the join, and once in the subquery that computes the average of averages.

A CTE can be used several times in the same query. Writing it out twice as a plain subquery would work too, but a name makes it readable.`,
    },
  },

  {
    id: 'sql-window-rank',
    title: 'Ranking with',
    titleAccent: 'window functions.',
    topic: 'OVER, PARTITION BY, RANK',
    blurb: 'Rank rows without collapsing them.',
    minutes: 35,
    skills: ['OVER', 'PARTITION BY', 'ROW_NUMBER', 'RANK', 'DENSE_RANK'],
    concept: 'A window function calculates across related rows without collapsing them. `RANK()` gives ties the same number and skips ahead.',
    prompt: 'Return name, department, salary and dept_rank: the RANK of each employee by salary (highest first) within their department.',
    successNote: 'You ranked rows inside each department, and saw how RANK treats ties.',
    schema: 'CREATE TABLE employees (name TEXT, department TEXT, salary INT);',
    cases: [
      ['Sample', `INSERT INTO employees VALUES ('Asha','Eng',100),('Ben','Eng',100),('Chitra','Eng',80),('Dev','Sales',90),('Esha','Sales',70);`],
      ['Normal case', `INSERT INTO employees VALUES ('Farah','Ops',50),('Gopal','Ops',60),('Hina','Ops',60),('Ivan','Ops',60),('Jay','Ops',40);`],
      ['Edge case', `INSERT INTO employees VALUES ('Kabir','HR',10);`],
    ],
    solution: 'SELECT name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees',
    traps: [
      'SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees',
      'SELECT name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees',
    ],
    real: {
      dataset: 'nycflights13',
      title: 'Airlines by traffic',
      brief: `Rank the airlines by how many flights they operated.

**Return:** \`name\` (the airline name), \`flights\` (its number of flights) and \`flights_rank\` (\`RANK()\` by \`flights\`, most flights first, so rank 1 is the busiest airline). Include every airline that has flights.`,
      reference: 'SELECT a.name, COUNT(*) AS flights, RANK() OVER (ORDER BY COUNT(*) DESC) AS flights_rank FROM flights f JOIN airlines a ON a.carrier = f.carrier GROUP BY a.carrier, a.name;',
      orderMatters: false,
      walkthrough: `A window function runs **after** grouping, so it can rank the grouped results: \`RANK() OVER (ORDER BY COUNT(*) DESC)\` ranks the airlines by their counts.

\`OVER (...)\` defines the window. With no \`PARTITION BY\` the window is the whole result. Add \`PARTITION BY origin\` to restart the ranking for each origin airport.`,
    },
  },

  {
    id: 'sql-running-total',
    title: 'Running totals',
    titleAccent: 'with windows.',
    topic: 'SUM() OVER (ORDER BY ...)',
    blurb: 'Add up everything so far, row by row.',
    minutes: 35,
    skills: ['SUM() OVER', 'running total', 'CTE + window'],
    concept: '`SUM(x) OVER (ORDER BY y)` adds up everything up to the current row: a running total.',
    prompt: 'Return id, amount and running_total: the sum of amount for all payments up to and including this one, in id order.',
    successNote: 'You calculated a running total with a window aggregate.',
    schema: 'CREATE TABLE payments (id INT, amount INT);',
    cases: [
      ['Sample', `INSERT INTO payments VALUES (3,20),(1,50),(4,100),(2,30);`],
      ['Normal case', `INSERT INTO payments VALUES (2,5),(1,5),(3,-3),(5,10),(4,0);`],
      ['Edge case', `INSERT INTO payments VALUES (1,999);`],
    ],
    solution: 'SELECT id, amount, SUM(amount) OVER (ORDER BY id) AS running_total FROM payments',
    traps: ['SELECT id, amount, SUM(amount) OVER () AS running_total FROM payments', 'SELECT id, amount, SUM(amount) OVER (ORDER BY amount) AS running_total FROM payments'],
    real: {
      dataset: 'nycflights13',
      title: 'Flights so far this year',
      brief: `How does traffic build up over the year?

**Return:** \`month\`, \`flights\` (the number of flights that month) and \`running_flights\` (the total number of flights from January up to and including that month). Sort by \`month\`.`,
      reference: 'WITH monthly AS (SELECT month, COUNT(*) AS flights FROM flights GROUP BY month) SELECT month, flights, SUM(flights) OVER (ORDER BY month) AS running_flights FROM monthly ORDER BY month;',
      orderMatters: true,
      walkthrough: `Window functions can't be used in \`GROUP BY\` or \`WHERE\`, so compute the per-month numbers in a CTE first, then run the window over that.

\`SUM(flights) OVER (ORDER BY month)\` means: for each row, sum \`flights\` over all rows up to this month. The last row's running total equals the total number of flights.`,
    },
  },

  {
    id: 'sql-lag-lead',
    title: 'Comparing with the',
    titleAccent: 'previous row.',
    topic: 'LAG and LEAD',
    blurb: 'Look at the row before or after, for changes over time.',
    minutes: 30,
    skills: ['LAG', 'LEAD', 'period-over-period change'],
    concept: '`LAG(x)` returns x from the previous row and `LEAD(x)` from the next. The first row has no previous row, so it gets `NULL`.',
    prompt: 'Return month, revenue and change: this month\'s revenue minus the previous month\'s (NULL for the first month).',
    successNote: 'You compared each month with the one before it using LAG.',
    schema: 'CREATE TABLE monthly_sales (month TEXT, revenue INT);',
    cases: [
      ['Sample', `INSERT INTO monthly_sales VALUES ('2024-03',300),('2024-01',100),('2024-02',250);`],
      ['Normal case', `INSERT INTO monthly_sales VALUES ('2024-05',80),('2024-04',120),('2024-06',80),('2024-07',10);`],
      ['Edge case', `INSERT INTO monthly_sales VALUES ('2024-01',500);`],
    ],
    solution: 'SELECT month, revenue, revenue - LAG(revenue) OVER (ORDER BY month) AS change FROM monthly_sales',
    traps: [
      'SELECT month, revenue, revenue - LAG(revenue) OVER () AS change FROM monthly_sales',
      'SELECT month, revenue, LEAD(revenue) OVER (ORDER BY month) - revenue AS change FROM monthly_sales',
    ],
    real: {
      dataset: 'nycflights13',
      title: 'Are cancellations rising?',
      brief: `A flight with no departure time (\`dep_time IS NULL\`) was cancelled.

**Return:** \`month\`, \`cancelled\` (how many flights were cancelled that month) and \`change\` (this month's \`cancelled\` minus the previous month's; \`NULL\` for January). Sort by \`month\`.`,
      reference: 'WITH monthly AS (SELECT month, COUNT(*) AS cancelled FROM flights WHERE dep_time IS NULL GROUP BY month) SELECT month, cancelled, cancelled - LAG(cancelled) OVER (ORDER BY month) AS change FROM monthly ORDER BY month;',
      orderMatters: true,
      walkthrough: `\`LAG(cancelled) OVER (ORDER BY month)\` fetches the previous month's value, so subtracting it gives the change. For January there is no previous row, so \`LAG\` returns \`NULL\`, and so does the subtraction.

You must give the window an \`ORDER BY\`. Without it, "previous" means whichever row the database happens to read first.`,
    },
  },

  {
    id: 'sql-ntile',
    title: 'Buckets and',
    titleAccent: 'percentiles with NTILE.',
    topic: 'NTILE',
    blurb: 'Split rows into equal-sized groups, like quartiles.',
    minutes: 25,
    skills: ['NTILE', 'quartiles', 'banding'],
    concept: '`NTILE(n)` splits the ordered rows into n roughly equal groups, and returns the group number of each row.',
    prompt: 'Return name, price and price_band: split the products into 3 bands by price, where band 1 holds the most expensive third.',
    successNote: 'You split the products into equal bands with NTILE.',
    schema: 'CREATE TABLE products (name TEXT, price INT);',
    cases: [
      ['Sample', `INSERT INTO products VALUES ('Notebook',40),('Pen',10),('Backpack',150),('Water Bottle',60),('Desk Lamp',90),('Mug',180);`],
      ['Normal case', `INSERT INTO products VALUES ('Tape',20),('Glue',35),('Stapler',65),('Ruler',5),('Marker',45),('Folder',15),('Eraser',8);`],
      ['Edge case', `INSERT INTO products VALUES ('Solo',10),('Duo',20);`],
    ],
    solution: 'SELECT name, price, NTILE(3) OVER (ORDER BY price DESC) AS price_band FROM products',
    traps: [
      'SELECT name, price, NTILE(3) OVER (ORDER BY price ASC) AS price_band FROM products',
      'SELECT name, price, NTILE(4) OVER (ORDER BY price DESC) AS price_band FROM products',
    ],
    real: {
      dataset: 'nycflights13',
      title: 'Airline size quartiles',
      brief: `Group the airlines into four size classes by number of flights.

**Return:** \`name\` (the airline name), \`flights\` (its number of flights) and \`quartile\` (\`NTILE(4)\` by \`flights\`, most flights first, so quartile 1 holds the busiest airlines). Sort by \`flights\`, most first.`,
      reference: 'SELECT a.name, COUNT(*) AS flights, NTILE(4) OVER (ORDER BY COUNT(*) DESC) AS quartile FROM flights f JOIN airlines a ON a.carrier = f.carrier GROUP BY a.carrier, a.name ORDER BY flights DESC;',
      orderMatters: true,
      walkthrough: `\`NTILE(4)\` deals the ordered rows into four groups of (nearly) equal size. With 16 airlines, that is four per group.

When the row count doesn't divide evenly, the first groups get one extra row. Note it splits by **row count**, not by value: quartile 1 is the first quarter of the airlines, however different their sizes.`,
    },
  },

  {
    id: 'sql-recursive-cte',
    title: 'Recursive CTEs:',
    titleAccent: 'hierarchies.',
    topic: 'WITH RECURSIVE',
    blurb: 'Walk down a tree of any depth, such as an org chart.',
    minutes: 40,
    skills: ['WITH RECURSIVE', 'org charts', 'tree walking'],
    concept: 'A recursive CTE has an anchor query that starts the walk, and a recursive query that takes the next step, joined by `UNION ALL`.',
    prompt: 'Return name and level of everyone who reports to the employee with id 2, directly (level 1) or indirectly (level 2 and more). Exclude that employee. Sort by level, then name.',
    successNote: 'You walked down an org chart of any depth with a recursive CTE.',
    orderMatters: true,
    schema: 'CREATE TABLE employees (id INT, name TEXT, manager_id INT);',
    cases: [
      ['Sample', `INSERT INTO employees VALUES (1,'Meera',NULL),(2,'Rohan',1),(3,'Sneha',2),(4,'Aditya',2),(5,'Tanvi',3),(6,'Nikhil',1),(7,'Pooja',6);`],
      ['Normal case', `INSERT INTO employees VALUES (1,'Boss',NULL),(2,'Kabir',1),(3,'Leela',2),(4,'Manu',3),(5,'Nina',4),(6,'Omar',2),(7,'Pia',1);`],
      ['Edge case', `INSERT INTO employees VALUES (1,'Top',NULL),(2,'Lone',1),(3,'Other',1);`],
    ],
    solution: 'WITH RECURSIVE team(id, name, level) AS (SELECT id, name, 0 FROM employees WHERE id = 2 UNION ALL SELECT e.id, e.name, team.level + 1 FROM employees e JOIN team ON e.manager_id = team.id) SELECT name, level FROM team WHERE level > 0 ORDER BY level, name',
    traps: ['SELECT name, 1 AS level FROM employees WHERE manager_id = 2 ORDER BY name'],
    real: {
      dataset: 'chinook',
      title: 'The whole Chinook org chart',
      brief: `In the \`Employee\` table, \`ReportsTo\` holds the \`EmployeeId\` of an employee's manager. The General Manager, **Andrew Adams** (\`EmployeeId\` 1), reports to nobody.

**Return:** \`name\` (\`FirstName\`, a space, then \`LastName\`) and \`level\` for everyone who reports to Andrew, directly (level 1) or indirectly (level 2). Exclude Andrew. Sort by \`level\`, then \`name\`.`,
      reference: "WITH RECURSIVE team(id, name, level) AS (SELECT EmployeeId, FirstName || ' ' || LastName, 0 FROM Employee WHERE EmployeeId = 1 UNION ALL SELECT e.EmployeeId, e.FirstName || ' ' || e.LastName, team.level + 1 FROM Employee e JOIN team ON e.ReportsTo = team.id) SELECT name, level FROM team WHERE level > 0 ORDER BY level, name;",
      orderMatters: true,
      walkthrough: `The **anchor** picks the starting row (Andrew, level 0). The **recursive part** finds the rows whose \`ReportsTo\` is a row already in \`team\`, one level deeper each time. SQLite repeats it until no new rows appear.

It works for any depth: a chain of 2 levels here, or 10 in a big company. A plain self join could only ever handle a fixed number of levels.`,
    },
  },

  {
    id: 'sql-intersect-except',
    title: 'Set operations:',
    titleAccent: 'INTERSECT and EXCEPT.',
    topic: 'Comparing two lists',
    blurb: 'Find what two results share, or what one has that the other lacks.',
    minutes: 25,
    skills: ['INTERSECT', 'EXCEPT', 'set logic'],
    concept: '`INTERSECT` returns rows in both queries. `EXCEPT` returns rows in the first query that are missing from the second.',
    prompt: 'Return customer: the customers who ordered in month 1 but did not order in month 2. Each customer once, sorted A to Z. Use EXCEPT.',
    successNote: 'You compared two result sets with EXCEPT.',
    orderMatters: true,
    schema: 'CREATE TABLE orders (customer TEXT, month INT);',
    cases: [
      ['Sample', `INSERT INTO orders VALUES ('Asha',1),('Ben',1),('Ben',2),('Chitra',2),('Dev',1),('Dev',1);`],
      ['Normal case', `INSERT INTO orders VALUES ('Esha',1),('Farah',2),('Gopal',1),('Gopal',2),('Hina',1),('Ivan',3);`],
      ['Edge case', `INSERT INTO orders VALUES ('Jay',1),('Jay',2);`],
    ],
    solution: 'SELECT customer FROM orders WHERE month = 1 EXCEPT SELECT customer FROM orders WHERE month = 2 ORDER BY customer',
    traps: [
      'SELECT DISTINCT customer FROM orders WHERE month = 1 ORDER BY customer',
      'SELECT customer FROM orders WHERE month = 1 INTERSECT SELECT customer FROM orders WHERE month = 2 ORDER BY customer',
    ],
    real: {
      dataset: 'nycflights13',
      title: 'Only from JFK',
      brief: `Which destinations can you reach from JFK, but **not** from LaGuardia (\`LGA\`)?

**Return:** \`dest\`, each destination once, for airports that have at least one flight from \`JFK\` and **none** from \`LGA\`. Use \`EXCEPT\`.`,
      reference: "SELECT DISTINCT dest FROM flights WHERE origin = 'JFK' EXCEPT SELECT DISTINCT dest FROM flights WHERE origin = 'LGA';",
      orderMatters: false,
      walkthrough: `\`EXCEPT\` takes the first list and removes everything that also appears in the second. It compares **whole rows** and removes duplicates, so it works well when you select a single key column.

Swap it for \`INTERSECT\` to get the destinations served from **both** airports (41 of them here).`,
    },
  },
]
