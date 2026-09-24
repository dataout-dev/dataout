export const intermediate = [
  {
    id: 'sql-aggregates',
    title: 'Summarising with',
    titleAccent: 'aggregate functions.',
    topic: 'COUNT, SUM, AVG, MIN, MAX',
    blurb: 'Collapse many rows into one number.',
    minutes: 25,
    skills: ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'],
    concept: 'Aggregate functions turn many rows into one value. `COUNT(*)` counts rows, `COUNT(column)` skips `NULL`s.',
    prompt: 'Return one row: total_orders, orders_with_coupon (orders that have a coupon) and avg_total (the average total, rounded to 1 decimal place).',
    successNote: 'You summarised a table with COUNT and AVG, and saw that COUNT(column) skips NULLs.',
    schema: 'CREATE TABLE orders (id INT, customer TEXT, total INT, coupon TEXT);',
    cases: [
      ['Sample', `INSERT INTO orders VALUES (1,'Asha',100,'SAVE10'),(2,'Ben',250,NULL),(3,'Chitra',60,NULL),(4,'Dev',90,'SAVE10');`],
      ['Normal case', `INSERT INTO orders VALUES (1,'Esha',45,'WELCOME'),(2,'Farah',80,'SAVE10'),(3,'Gopal',120,NULL),(4,'Hina',34,'WELCOME');`],
      ['Edge case', ''],
    ],
    solution: 'SELECT COUNT(*) AS total_orders, COUNT(coupon) AS orders_with_coupon, ROUND(AVG(total), 1) AS avg_total FROM orders',
    traps: [
      'SELECT COUNT(*) AS total_orders, COUNT(*) AS orders_with_coupon, ROUND(AVG(total), 1) AS avg_total FROM orders',
      'SELECT COUNT(*) AS total_orders, COUNT(coupon) AS orders_with_coupon, AVG(total) AS avg_total FROM orders',
    ],
    real: {
      dataset: 'chinook',
      title: 'The store at a glance',
      brief: `The owner of the Chinook music store asks for three headline numbers.

**Return one row:** \`invoices\` (how many invoices there are), \`revenue\` (the sum of \`Total\`, rounded to 2 decimals) and \`avg_invoice\` (the average \`Total\`, rounded to 2 decimals), from the \`Invoice\` table.`,
      reference: 'SELECT COUNT(*) AS invoices, ROUND(SUM(Total), 2) AS revenue, ROUND(AVG(Total), 2) AS avg_invoice FROM Invoice;',
      orderMatters: false,
      walkthrough: `Three aggregates in one \`SELECT\` collapse all 412 invoices into a single row.

\`ROUND(..., 2)\` matters because money is stored as decimals, and sums of decimals can carry tiny floating-point noise. Rounding gives a clean figure.`,
    },
  },

  {
    id: 'sql-group-by',
    title: 'Grouping',
    titleAccent: 'with GROUP BY.',
    topic: 'Aggregates per group',
    blurb: 'Compute a summary for each category.',
    minutes: 25,
    skills: ['GROUP BY', 'aggregates per group'],
    concept: '`GROUP BY` splits rows into buckets, one per distinct value, and runs the aggregates inside each. Think: for each ___, compute ___.',
    prompt: 'For each region return region, orders (how many rows) and revenue (the sum of amount). Sort by region.',
    successNote: 'You computed a summary per group.',
    orderMatters: true,
    schema: 'CREATE TABLE sales (region TEXT, amount INT);',
    cases: [
      ['Sample', `INSERT INTO sales VALUES ('South',100),('North',250),('South',150),('East',80),('North',50);`],
      ['Normal case', `INSERT INTO sales VALUES ('West',40),(NULL,15),('West',60),(NULL,20),('East',300);`],
      ['Edge case', `INSERT INTO sales VALUES ('North',500);`],
    ],
    solution: 'SELECT region, COUNT(*) AS orders, SUM(amount) AS revenue FROM sales GROUP BY region ORDER BY region',
    traps: ['SELECT region, COUNT(*) AS orders, SUM(amount) AS revenue FROM sales ORDER BY region'],
    real: {
      dataset: 'chinook',
      title: 'Revenue by country',
      brief: `Where does the money come from?

**Return** one row per billing country: \`BillingCountry\`, \`invoices\` (number of invoices) and \`revenue\` (sum of \`Total\`, rounded to 2 decimals), from \`Invoice\`. Sort by \`BillingCountry\`, A to Z.`,
      reference: 'SELECT BillingCountry, COUNT(*) AS invoices, ROUND(SUM(Total), 2) AS revenue FROM Invoice GROUP BY BillingCountry ORDER BY BillingCountry;',
      orderMatters: true,
      walkthrough: `\`GROUP BY BillingCountry\` makes one bucket per country, and \`COUNT\` and \`SUM\` run inside each bucket.

Every column in \`SELECT\` must be either in \`GROUP BY\` or inside an aggregate. SQLite forgives a bare column and returns an arbitrary value, which hides bugs, so treat it as an error.`,
    },
  },

  {
    id: 'sql-having',
    title: 'Filtering groups',
    titleAccent: 'with HAVING.',
    topic: 'WHERE vs HAVING',
    blurb: 'Keep only the groups that meet a condition.',
    minutes: 20,
    skills: ['HAVING', 'WHERE vs HAVING'],
    concept: '`WHERE` filters rows before grouping. `HAVING` filters groups after aggregation, so it can use `COUNT(*)`.',
    prompt: 'Return city and customers (how many) for cities with at least 2 customers. Sort by customers (most first), then city.',
    successNote: 'You filtered groups with HAVING.',
    orderMatters: true,
    schema: 'CREATE TABLE customers (name TEXT, city TEXT);',
    cases: [
      ['Sample', `INSERT INTO customers VALUES ('Asha','Pune'),('Ben','Pune'),('Chitra','Delhi'),('Dev','Delhi'),('Esha','Delhi'),('Farah','Goa');`],
      ['Normal case', `INSERT INTO customers VALUES ('Gopal','Mumbai'),('Hina','Chennai'),('Ivan','Mumbai'),('Jay','Chennai'),('Kabir','Goa');`],
      ['Edge case', `INSERT INTO customers VALUES ('Leela','Pune'),('Manu','Delhi'),('Nina','Goa');`],
    ],
    solution: 'SELECT city, COUNT(*) AS customers FROM customers GROUP BY city HAVING COUNT(*) >= 2 ORDER BY customers DESC, city',
    traps: [
      'SELECT city, COUNT(*) AS customers FROM customers GROUP BY city HAVING COUNT(*) > 2 ORDER BY customers DESC, city',
      'SELECT city, COUNT(*) AS customers FROM customers GROUP BY city ORDER BY customers DESC, city',
    ],
    real: {
      dataset: 'chinook',
      title: 'Countries with a real customer base',
      brief: `Marketing wants to focus on countries with a solid customer base.

**Return:** \`Country\`, \`customers\` (how many customers) for countries with **at least 5 customers**, from \`Customer\`. Sort by \`customers\` (most first), then \`Country\`.`,
      reference: 'SELECT Country, COUNT(*) AS customers FROM Customer GROUP BY Country HAVING COUNT(*) >= 5 ORDER BY customers DESC, Country;',
      orderMatters: true,
      walkthrough: `The count doesn't exist until rows are grouped, so \`WHERE COUNT(*) >= 5\` is an error. \`HAVING\` runs **after** grouping and can use it.

Order of evaluation: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.`,
    },
  },

  {
    id: 'sql-case-when',
    title: 'If-then logic',
    titleAccent: 'with CASE.',
    topic: 'Labelling and bucketing',
    blurb: 'Turn numbers and codes into readable labels.',
    minutes: 25,
    skills: ['CASE WHEN', 'labelling', 'bucketing'],
    concept: '`CASE` is SQL\'s if/else. It returns the value of the first `WHEN` that is true, or the `ELSE` value.',
    prompt: "Return name and grade for each student: 'A' for 90 and above, 'B' for 75 to 89, 'C' for 60 to 74, 'F' below 60, and 'Absent' when the score is missing.",
    successNote: 'You turned numbers into labels with CASE, including a branch for missing values.',
    schema: 'CREATE TABLE students (name TEXT, score INT);',
    cases: [
      ['Sample', `INSERT INTO students VALUES ('Asha',95),('Ben',75),('Chitra',59),('Dev',60),('Esha',NULL),('Farah',90);`],
      ['Normal case', `INSERT INTO students VALUES ('Gopal',89),('Hina',74),('Ivan',100),('Jay',0),('Kabir',NULL);`],
      ['Edge case', `INSERT INTO students VALUES ('Leela',NULL),('Manu',NULL);`],
    ],
    solution: "SELECT name, CASE WHEN score IS NULL THEN 'Absent' WHEN score >= 90 THEN 'A' WHEN score >= 75 THEN 'B' WHEN score >= 60 THEN 'C' ELSE 'F' END AS grade FROM students",
    traps: [
      "SELECT name, CASE WHEN score >= 90 THEN 'A' WHEN score >= 75 THEN 'B' WHEN score >= 60 THEN 'C' ELSE 'F' END AS grade FROM students",
      "SELECT name, CASE WHEN score IS NULL THEN 'Absent' WHEN score > 90 THEN 'A' WHEN score >= 75 THEN 'B' WHEN score >= 60 THEN 'C' ELSE 'F' END AS grade FROM students",
    ],
    real: {
      dataset: 'chinook',
      title: 'Short, medium and long tracks',
      brief: `The store wants to know how long its tracks are. \`Milliseconds\` is the length of a track.

Label each track: **Short** (under 180000), **Medium** (180000 up to but not including 360000) or **Long** (360000 or more).

**Return:** \`length_band\` and \`tracks\` (how many tracks are in that band), from \`Track\`. Most tracks first.`,
      reference: "SELECT CASE WHEN Milliseconds < 180000 THEN 'Short' WHEN Milliseconds < 360000 THEN 'Medium' ELSE 'Long' END AS length_band, COUNT(*) AS tracks FROM Track GROUP BY length_band ORDER BY tracks DESC;",
      orderMatters: true,
      walkthrough: `\`CASE\` checks its conditions from top to bottom and stops at the first match, so the order matters: a track of 200000 ms fails the first test and passes the second.

You can group by the alias \`length_band\`. SQLite lets you use a \`SELECT\` alias in \`GROUP BY\`.`,
    },
  },

  {
    id: 'sql-text-functions',
    title: 'Working',
    titleAccent: 'with text.',
    topic: 'String functions',
    blurb: 'Clean up and pull apart text values.',
    minutes: 25,
    skills: ['LOWER', 'SUBSTR', 'INSTR', 'TRIM'],
    concept: '`LOWER`, `SUBSTR(text, start, length)` and `INSTR(text, find)` let you clean and slice text. `INSTR` returns 0 if not found.',
    prompt: 'Return id and domain: the part of each email after the @ sign, in lower case.',
    successNote: 'You sliced text with SUBSTR and INSTR and cleaned it with LOWER.',
    schema: 'CREATE TABLE users (id INT, email TEXT);',
    cases: [
      ['Sample', `INSERT INTO users VALUES (1,'Asha@Gmail.com'),(2,'ben@yahoo.co.in'),(3,'CHITRA@GMAIL.COM');`],
      ['Normal case', `INSERT INTO users VALUES (1,'dev@Outlook.com'),(2,'esha@company.org'),(3,'farah@Company.ORG'),(4,'gopal@x.io');`],
      ['Edge case', `INSERT INTO users VALUES (1,'a@b.co');`],
    ],
    solution: "SELECT id, LOWER(SUBSTR(email, INSTR(email, '@') + 1)) AS domain FROM users",
    traps: [
      "SELECT id, SUBSTR(email, INSTR(email, '@') + 1) AS domain FROM users",
      "SELECT id, LOWER(SUBSTR(email, INSTR(email, '@'))) AS domain FROM users",
    ],
    real: {
      dataset: 'chinook',
      title: 'Where do customers get their email?',
      brief: `Which email providers do the store's customers use?

The domain is the part of \`Email\` after the \`@\`. **Return:** \`domain\` (lower case) and \`customers\` (how many customers use it), from \`Customer\`. Most customers first; break ties by \`domain\` A to Z.`,
      reference: "SELECT LOWER(SUBSTR(Email, INSTR(Email, '@') + 1)) AS domain, COUNT(*) AS customers FROM Customer GROUP BY domain ORDER BY customers DESC, domain;",
      orderMatters: true,
      walkthrough: `\`INSTR(Email, '@')\` finds the position of the @. The domain starts one character later, so \`SUBSTR(Email, INSTR(Email, '@') + 1)\` takes everything from there to the end.

\`LOWER\` matters when you group: \`Gmail.com\` and \`gmail.com\` would otherwise be counted as different providers.`,
    },
  },

  {
    id: 'sql-dates',
    title: 'Working',
    titleAccent: 'with dates.',
    topic: 'strftime and date maths',
    blurb: 'Group and filter by year, month or day.',
    minutes: 25,
    skills: ['strftime', 'date()', 'date arithmetic'],
    concept: "SQLite stores dates as text like `2024-03-15`. `strftime('%Y-%m', date)` pulls out the year and month.",
    prompt: 'Return month (as YYYY-MM) and revenue (the sum of amount) for each month. Sort by month.',
    successNote: 'You grouped by month with strftime.',
    orderMatters: true,
    schema: 'CREATE TABLE orders (id INT, order_date TEXT, amount INT);',
    cases: [
      ['Sample', `INSERT INTO orders VALUES (1,'2024-01-05',100),(2,'2024-01-20',50),(3,'2024-02-11',70);`],
      ['Normal case', `INSERT INTO orders VALUES (1,'2023-03-05',40),(2,'2024-03-09',60),(3,'2024-03-22',25),(4,'2023-12-31',10);`],
      ['Edge case', `INSERT INTO orders VALUES (1,'2024-07-04',90);`],
    ],
    solution: "SELECT strftime('%Y-%m', order_date) AS month, SUM(amount) AS revenue FROM orders GROUP BY month ORDER BY month",
    traps: ["SELECT strftime('%m', order_date) AS month, SUM(amount) AS revenue FROM orders GROUP BY month ORDER BY month"],
    real: {
      dataset: 'chinook',
      title: 'Revenue by year',
      brief: `How has the store grown?

**Return:** \`year\` (the year of \`InvoiceDate\`, as text such as \`2011\`) and \`revenue\` (the sum of \`Total\`, rounded to 2 decimals), from \`Invoice\`. Sort by \`year\`.`,
      reference: "SELECT strftime('%Y', InvoiceDate) AS year, ROUND(SUM(Total), 2) AS revenue FROM Invoice GROUP BY year ORDER BY year;",
      orderMatters: true,
      walkthrough: `SQLite has no real date type. \`InvoiceDate\` is text like \`2011-03-15 00:00:00\`, and \`strftime\` cuts pieces out of it: \`%Y\` year, \`%m\` month, \`%d\` day.

The result of \`strftime\` is text, so \`year\` comes back as \`'2011'\`, not a number.`,
    },
  },

  {
    id: 'sql-inner-join',
    title: 'Combining tables:',
    titleAccent: 'INNER JOIN.',
    topic: 'JOIN ... ON',
    blurb: 'Bring related rows from two tables together.',
    minutes: 30,
    skills: ['JOIN ... ON', 'table aliases', 'keys'],
    concept: '`JOIN ... ON` glues matching rows together. `INNER JOIN` keeps only rows that have a match on both sides.',
    prompt: 'Return the title of each book and its author (the author\'s name), for every book that has a known author.',
    successNote: 'You joined two tables on a key.',
    schema: 'CREATE TABLE authors (id INT, name TEXT); CREATE TABLE books (id INT, title TEXT, author_id INT);',
    cases: [
      ['Sample', `INSERT INTO authors VALUES (1,'Tagore'),(2,'Narayan'),(3,'Kalam'); INSERT INTO books VALUES (1,'Gitanjali',1),(2,'Malgudi Days',2),(3,'Wings of Fire',3),(4,'Orphan Book',NULL);`],
      ['Normal case', `INSERT INTO authors VALUES (1,'Rushdie'),(2,'Roy'); INSERT INTO books VALUES (1,'Midnights Children',1),(2,'The God of Small Things',2),(3,'Shame',1),(4,'Ghost Title',99);`],
      ['Edge case', `INSERT INTO authors VALUES (1,'Nobody Yet'); INSERT INTO books VALUES (1,'Anonymous',NULL);`],
    ],
    solution: 'SELECT b.title, a.name AS author FROM books b JOIN authors a ON a.id = b.author_id',
    traps: [
      'SELECT b.title, a.name AS author FROM books b LEFT JOIN authors a ON a.id = b.author_id',
      'SELECT b.title, a.name AS author FROM books b, authors a',
    ],
    real: {
      dataset: 'chinook',
      title: 'The Iron Maiden albums',
      brief: `In Chinook, an \`Album\` row only holds an \`ArtistId\`. The artist's name lives in the \`Artist\` table.

**Return:** \`album\` (the album \`Title\`) and \`artist\` (the artist \`Name\`) for every album by **Iron Maiden**.`,
      reference: "SELECT al.Title AS album, ar.Name AS artist FROM Album al JOIN Artist ar ON ar.ArtistId = al.ArtistId WHERE ar.Name = 'Iron Maiden';",
      orderMatters: false,
      walkthrough: `\`JOIN Artist ar ON ar.ArtistId = al.ArtistId\` says "for each album, find the artist row with the matching id".

Table aliases (\`al\`, \`ar\`) keep the query short, and qualifying columns (\`al.Title\`) removes any doubt about which table a column comes from. Both tables have an \`ArtistId\` column, so an unqualified \`ArtistId\` would be an error.`,
    },
  },

  {
    id: 'sql-left-join',
    title: 'Keeping unmatched rows:',
    titleAccent: 'LEFT JOIN.',
    topic: 'Finding what is missing',
    blurb: 'Find rows that have no match in another table.',
    minutes: 30,
    skills: ['LEFT JOIN', 'anti-join', 'IS NULL on the joined side'],
    concept: '`LEFT JOIN` keeps every left row, filling the right side with `NULL` when nothing matches. Then `IS NULL` finds the rows with no match.',
    prompt: 'Return the name of every student who is not enrolled in any course. Sort A to Z.',
    successNote: 'You found rows with no match using LEFT JOIN and IS NULL.',
    orderMatters: true,
    schema: 'CREATE TABLE students (id INT, name TEXT); CREATE TABLE enrollments (student_id INT, course TEXT);',
    cases: [
      ['Sample', `INSERT INTO students VALUES (1,'Asha'),(2,'Ben'),(3,'Chitra'),(4,'Dev'); INSERT INTO enrollments VALUES (1,'Maths'),(1,'Physics'),(3,'Art');`],
      ['Normal case', `INSERT INTO students VALUES (1,'Esha'),(2,'Farah'),(3,'Gopal'); INSERT INTO enrollments VALUES (2,'Maths'),(2,'Art'),(2,'Music');`],
      ['Edge case', `INSERT INTO students VALUES (1,'Hina'),(2,'Ivan'); INSERT INTO enrollments VALUES (1,'Maths'),(2,'Art');`],
    ],
    solution: 'SELECT s.name FROM students s LEFT JOIN enrollments e ON e.student_id = s.id WHERE e.student_id IS NULL ORDER BY s.name',
    traps: [
      'SELECT s.name FROM students s JOIN enrollments e ON e.student_id = s.id ORDER BY s.name',
      'SELECT s.name FROM students s LEFT JOIN enrollments e ON e.student_id = s.id WHERE e.course IS NOT NULL ORDER BY s.name',
    ],
    real: {
      dataset: 'chinook',
      title: 'Artists with no albums',
      brief: `Some artists are in the catalogue but have no albums for sale.

**Return:** \`Name\` of every artist in \`Artist\` that has **no** rows in \`Album\`.`,
      reference: 'SELECT ar.Name FROM Artist ar LEFT JOIN Album al ON al.ArtistId = ar.ArtistId WHERE al.AlbumId IS NULL;',
      orderMatters: false,
      walkthrough: `\`LEFT JOIN\` keeps every artist. For an artist with no albums, all the \`Album\` columns come back as \`NULL\`. Filtering on \`al.AlbumId IS NULL\` then keeps exactly the artists with no match.

This pattern is called an **anti-join**. A plain \`JOIN\` can never find these rows, because it drops unmatched rows.`,
    },
  },

  {
    id: 'sql-multi-table-join',
    title: 'Joining three tables',
    titleAccent: 'and aggregating.',
    topic: 'Real analytics queries',
    blurb: 'Chain joins together and summarise the result.',
    minutes: 35,
    skills: ['multi-table JOIN', 'SUM of a product', 'GROUP BY'],
    concept: 'Chain joins one at a time, like a path: customer, to orders, to items. Revenue is `quantity * price` summed per group.',
    prompt: "Return name and revenue (the sum of qty * price) for each customer, counting only orders with status 'delivered'. Show the top 3 by revenue; break ties by name.",
    successNote: 'You joined three tables and summed a calculated value per group.',
    orderMatters: true,
    schema: 'CREATE TABLE customers (id INT, name TEXT); CREATE TABLE orders (id INT, customer_id INT, status TEXT); CREATE TABLE order_items (order_id INT, qty INT, price INT);',
    cases: [
      ['Sample', `INSERT INTO customers VALUES (1,'Asha'),(2,'Ben'),(3,'Chitra'),(4,'Dev');
        INSERT INTO orders VALUES (1,1,'delivered'),(2,1,'cancelled'),(3,2,'delivered'),(4,3,'delivered'),(5,4,'cancelled');
        INSERT INTO order_items VALUES (1,2,100),(1,1,50),(2,5,100),(3,1,300),(4,3,40),(5,1,999);`],
      ['Normal case', `INSERT INTO customers VALUES (1,'Hina'),(2,'Gopal'),(3,'Farah'),(4,'Esha');
        INSERT INTO orders VALUES (1,1,'delivered'),(2,2,'delivered'),(3,3,'delivered'),(4,4,'delivered');
        INSERT INTO order_items VALUES (1,2,100),(2,4,50),(3,1,500),(4,1,60);`],
      ['Edge case', `INSERT INTO customers VALUES (1,'Ivan'),(2,'Jay'),(3,'Kabir');
        INSERT INTO orders VALUES (1,1,'delivered'),(2,2,'cancelled');
        INSERT INTO order_items VALUES (1,3,20),(2,9,90);`],
    ],
    solution: "SELECT c.name, SUM(oi.qty * oi.price) AS revenue FROM customers c JOIN orders o ON o.customer_id = c.id JOIN order_items oi ON oi.order_id = o.id WHERE o.status = 'delivered' GROUP BY c.id, c.name ORDER BY revenue DESC, c.name LIMIT 3",
    traps: [
      'SELECT c.name, SUM(oi.qty * oi.price) AS revenue FROM customers c JOIN orders o ON o.customer_id = c.id JOIN order_items oi ON oi.order_id = o.id GROUP BY c.id, c.name ORDER BY revenue DESC, c.name LIMIT 3',
      "SELECT c.name, SUM(oi.qty * oi.price) AS revenue FROM customers c JOIN orders o ON o.customer_id = c.id JOIN order_items oi ON oi.order_id = o.id WHERE o.status = 'delivered' GROUP BY c.id, c.name ORDER BY revenue DESC LIMIT 3",
    ],
    real: {
      dataset: 'chinook',
      title: 'The best-selling genres',
      brief: `Which genres earn the store the most?

Each row of \`InvoiceLine\` is one track sold. Its revenue is \`UnitPrice * Quantity\`. The genre of a track is in \`Track\`, and the genre's name is in \`Genre\`.

**Return:** \`genre\` (the genre \`Name\`) and \`revenue\` (rounded to 2 decimals) for the **top 5 genres** by revenue (compare the rounded values). Break ties by \`genre\`.`,
      reference: 'SELECT g.Name AS genre, ROUND(SUM(il.UnitPrice * il.Quantity), 2) AS revenue FROM InvoiceLine il JOIN Track t ON t.TrackId = il.TrackId JOIN Genre g ON g.GenreId = t.GenreId GROUP BY g.GenreId, g.Name ORDER BY revenue DESC, genre LIMIT 5;',
      orderMatters: true,
      walkthrough: `Read the joins as a path: **invoice line, to track, to genre**. Each join adds the columns you need next.

Revenue is a per-row calculation (\`UnitPrice * Quantity\`) summed per group. Grouping by \`g.GenreId, g.Name\` is safer than grouping by the name alone, since two genres could in principle share a name.`,
    },
  },

  {
    id: 'sql-self-join',
    title: 'Joining a table',
    titleAccent: 'to itself.',
    topic: 'Self joins',
    blurb: 'Compare rows of one table with other rows of the same table.',
    minutes: 30,
    skills: ['self join', 'aliases', 'hierarchies'],
    concept: 'A table can point at itself, like `manager_id`. Join it to itself under two different aliases to read both sides.',
    prompt: 'Return employee and manager (the manager\'s name) for every employee who has a manager.',
    successNote: 'You joined a table to itself using two aliases.',
    schema: 'CREATE TABLE employees (id INT, name TEXT, manager_id INT);',
    cases: [
      ['Sample', `INSERT INTO employees VALUES (1,'Meera',NULL),(2,'Rohan',1),(3,'Sneha',2),(4,'Aditya',2);`],
      ['Normal case', `INSERT INTO employees VALUES (1,'Tanvi',NULL),(2,'Nikhil',1),(3,'Pooja',1),(4,'Karan',3),(5,'Divya',4),(6,'Rahul',3);`],
      ['Edge case', `INSERT INTO employees VALUES (1,'Solo',NULL);`],
    ],
    solution: 'SELECT e.name AS employee, m.name AS manager FROM employees e JOIN employees m ON m.id = e.manager_id',
    traps: [
      'SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON m.id = e.manager_id',
      'SELECT e.name AS employee, m.name AS manager FROM employees e JOIN employees m ON e.id = m.manager_id',
    ],
    real: {
      dataset: 'chinook',
      title: 'Who reports to whom?',
      brief: `The \`Employee\` table has a \`ReportsTo\` column holding the \`EmployeeId\` of an employee's manager.

**Return:** \`employee\` and \`manager\`, each as the person's \`FirstName\`, a space, then \`LastName\`, for every employee who has a manager.`,
      reference: "SELECT e.FirstName || ' ' || e.LastName AS employee, m.FirstName || ' ' || m.LastName AS manager FROM Employee e JOIN Employee m ON m.EmployeeId = e.ReportsTo;",
      orderMatters: false,
      walkthrough: `The same table appears twice, once as \`e\` (the employee) and once as \`m\` (their manager). The join condition connects them: the manager's id equals the employee's \`ReportsTo\`.

\`||\` joins text together. The General Manager has no manager (\`ReportsTo\` is \`NULL\`), so an inner join leaves him out. Use \`LEFT JOIN\` if you want every employee to appear.`,
    },
  },

  {
    id: 'sql-union',
    title: 'Stacking results:',
    titleAccent: 'UNION.',
    topic: 'UNION and UNION ALL',
    blurb: 'Combine the results of two queries into one list.',
    minutes: 20,
    skills: ['UNION', 'UNION ALL', 'matching columns'],
    concept: '`UNION` stacks two queries and removes duplicates. `UNION ALL` keeps every row. Both queries need the same number of columns.',
    prompt: 'Return one column, name: everyone (students and teachers) who lives in Pune, each name listed once. Sort A to Z.',
    successNote: 'You combined two queries with UNION, which also removed the duplicates.',
    orderMatters: true,
    schema: 'CREATE TABLE students (name TEXT, city TEXT); CREATE TABLE teachers (name TEXT, city TEXT);',
    cases: [
      ['Sample', `INSERT INTO students VALUES ('Asha','Pune'),('Ravi','Pune'),('Meera','Delhi'); INSERT INTO teachers VALUES ('Ravi','Pune'),('Sunita','Pune'),('Karan','Goa');`],
      ['Normal case', `INSERT INTO students VALUES ('Diya','Pune'),('Esha','Pune'); INSERT INTO teachers VALUES ('Diya','Pune'),('Esha','Pune'),('Farah','Pune');`],
      ['Edge case', `INSERT INTO students VALUES ('Gopal','Goa'); INSERT INTO teachers VALUES ('Hina','Delhi');`],
    ],
    solution: "SELECT name FROM students WHERE city = 'Pune' UNION SELECT name FROM teachers WHERE city = 'Pune' ORDER BY name",
    traps: ["SELECT name FROM students WHERE city = 'Pune' UNION ALL SELECT name FROM teachers WHERE city = 'Pune' ORDER BY name"],
    real: {
      dataset: 'chinook',
      title: 'Every country we touch',
      brief: `The store wants a list of every country where it has either a customer or an employee.

**Return:** \`Country\`, each country once, sorted A to Z, taken from both the \`Customer\` and \`Employee\` tables.`,
      reference: 'SELECT Country FROM Customer UNION SELECT Country FROM Employee ORDER BY Country;',
      orderMatters: true,
      walkthrough: `\`UNION\` stacks the two lists and removes duplicates, so Canada, which appears in both tables, shows up once. \`UNION ALL\` would keep both copies and be slightly faster, because it skips the de-duplication.

One \`ORDER BY\` at the very end sorts the combined result.`,
    },
  },

  {
    id: 'sql-coalesce',
    title: 'Handling NULLs:',
    titleAccent: 'COALESCE.',
    topic: 'Defaults for missing values',
    blurb: 'Replace missing values with a sensible default.',
    minutes: 20,
    skills: ['COALESCE', 'NULLIF', 'defaults'],
    concept: '`COALESCE(a, b, c)` returns the first value that is not `NULL`. It is how you give a report a default.',
    prompt: "Return name and contact: the phone number if there is one, otherwise the email, otherwise the text 'none'.",
    successNote: 'You used COALESCE to fall back through several columns.',
    schema: 'CREATE TABLE contacts (name TEXT, phone TEXT, email TEXT);',
    cases: [
      ['Sample', `INSERT INTO contacts VALUES ('Asha','98200',NULL),('Ben',NULL,'ben@example.com'),('Chitra','98111','chitra@example.com'),('Dev',NULL,NULL);`],
      ['Normal case', `INSERT INTO contacts VALUES ('Esha',NULL,NULL),('Farah','99000','farah@example.com'),('Gopal',NULL,'gopal@example.com');`],
      ['Edge case', `INSERT INTO contacts VALUES ('Hina',NULL,NULL);`],
    ],
    solution: "SELECT name, COALESCE(phone, email, 'none') AS contact FROM contacts",
    traps: [
      "SELECT name, COALESCE(email, phone, 'none') AS contact FROM contacts",
      'SELECT name, COALESCE(phone, email) AS contact FROM contacts',
    ],
    real: {
      dataset: 'chinook',
      title: 'Companies and individuals',
      brief: `Some customers buy on behalf of a company. Others buy for themselves, and \`Company\` is empty for them.

**Return:** \`CustomerId\`, \`LastName\` and \`company\` (the \`Company\`, or the text \`Individual\` when it is missing) for every customer in the **USA**.`,
      reference: "SELECT CustomerId, LastName, COALESCE(Company, 'Individual') AS company FROM Customer WHERE Country = 'USA';",
      orderMatters: false,
      walkthrough: `\`COALESCE\` looks through its arguments in order and returns the first one that is not \`NULL\`. With \`Company\` first and \`'Individual'\` last, the text is used only when there is no company.

Order matters: \`COALESCE('Individual', Company)\` would always return \`'Individual'\`.`,
    },
  },
]
