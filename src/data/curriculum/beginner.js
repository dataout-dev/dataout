export const beginner = [
  {
    id: 'sql-select-basics',
    title: 'Reading data',
    titleAccent: 'with SELECT.',
    topic: 'Choosing columns',
    blurb: 'Pick exactly the columns you want from a table.',
    minutes: 15,
    skills: ['SELECT', 'FROM', '*'],
    concept: '`SELECT` lists the columns you want and `FROM` names the table. Columns come back in the order you type them.',
    prompt: 'Return the name and price of every product, in that column order.',
    successNote: 'You chose columns with SELECT and named the table with FROM.',
    schema: 'CREATE TABLE products (id INT, name TEXT, price INT, stock INT);',
    cases: [
      ['Sample', `INSERT INTO products VALUES (1,'Notebook',40,120),(2,'Pen',10,500),(3,'Backpack',150,35),(4,'Desk Lamp',90,0);`],
      ['Normal case', `INSERT INTO products VALUES (1,'Stapler',25,80),(2,'Mug',180,12),(3,'Folder',15,300),(4,'Marker',35,64),(5,'Ruler',5,410);`],
      ['Edge case', ''],
    ],
    solution: 'SELECT name, price FROM products',
    traps: ['SELECT * FROM products', 'SELECT price, name FROM products'],
    real: {
      dataset: 'palmer-penguins',
      title: 'Meet the penguins',
      brief: `Researchers at Palmer Station want a quick overview of what was measured.

**Return:** \`species\`, \`island\`, \`body_mass_g\` for every penguin, in that order.`,
      reference: 'SELECT species, island, body_mass_g FROM penguins;',
      orderMatters: false,
      walkthrough: `Name the three columns after \`SELECT\`, then the table after \`FROM\`.

Notice the blanks: some penguins have no recorded \`body_mass_g\`. In a database that is not zero or an empty string, it is \`NULL\`, "we don't know". You'll meet it properly in lesson 7.`,
    },
  },

  {
    id: 'sql-aliases-expressions',
    title: 'Aliases and',
    titleAccent: 'calculations.',
    topic: 'Expressions and AS',
    blurb: 'Calculate new values and give them readable names.',
    minutes: 20,
    skills: ['AS', 'arithmetic', 'ROUND'],
    concept: 'A column can be a calculation. Name it with `AS`, and use `ROUND(x, 2)` to keep two decimals.',
    prompt: 'Add 18% GST to every price. Return name and price_with_gst (price times 1.18, rounded to 2 decimal places).',
    successNote: 'You calculated a new column, named it with AS and rounded it.',
    schema: 'CREATE TABLE products (name TEXT, price REAL);',
    cases: [
      ['Sample', `INSERT INTO products VALUES ('Notebook',40),('Pen',10.5),('Desk Lamp',99.99);`],
      ['Normal case', `INSERT INTO products VALUES ('Stapler',25),('Mug',180),('Folder',15.25),('Marker',35);`],
      ['Edge case', `INSERT INTO products VALUES ('Free sample',0),('Gift card',2500);`],
    ],
    solution: 'SELECT name, ROUND(price * 1.18, 2) AS price_with_gst FROM products',
    traps: ['SELECT name, price * 1.18 AS price_with_gst FROM products', 'SELECT name, ROUND(price * 1.18) AS price_with_gst FROM products'],
    real: {
      dataset: 'palmer-penguins',
      title: 'Penguins in kilograms',
      brief: `A magazine wants body mass in kilograms, not grams.

**Return:** \`id\`, \`species\`, \`body_mass_kg\` (\`body_mass_g\` divided by 1000, rounded to 2 decimal places) for every penguin.`,
      reference: 'SELECT id, species, ROUND(body_mass_g / 1000.0, 2) AS body_mass_kg FROM penguins;',
      orderMatters: false,
      walkthrough: `Divide by \`1000.0\`, not \`1000\`. When both numbers are whole, SQLite throws away the remainder: \`3750 / 1000\` would give \`3\`, not \`3.75\`. Writing \`1000.0\` makes it decimal arithmetic.

\`ROUND(x, 2)\` then keeps two decimals. A penguin with no recorded mass stays \`NULL\`: any calculation with \`NULL\` gives \`NULL\`.`,
    },
  },

  {
    id: 'sql-where-basics',
    title: 'Filtering rows',
    titleAccent: 'with WHERE.',
    topic: 'Core filtering patterns',
    blurb: 'Use conditions to return exactly the rows you need.',
    minutes: 20,
    skills: ['WHERE', 'comparison operators'],
    concept: 'A `WHERE` clause filters the rows a query returns, based on a condition.',
    prompt: 'Return all employees earning more than 5000.',
    successNote: 'You used WHERE to filter employees by salary.',
    schema: 'CREATE TABLE employees (name TEXT, salary INT);',
    cases: [
      ['Sample', `INSERT INTO employees VALUES ('Priya',60000),('Sam',4000),('Aditi',15000),('Rahul',3000);`],
      ['Normal case', `INSERT INTO employees VALUES ('Meera',5000),('Karan',5001),('Divya',120000),('Arjun',4999),('Sam',25000);`],
      ['Edge case', `INSERT INTO employees VALUES ('Priya',5000),('Sam',4000),('Aditi',NULL),('Rahul',3000);`],
    ],
    solution: 'SELECT * FROM employees WHERE salary > 5000',
    traps: ['SELECT * FROM employees WHERE salary >= 5000', 'SELECT * FROM employees'],
    real: {
      dataset: 'palmer-penguins',
      title: 'The heavyweights',
      brief: `Which penguins are truly heavy?

**Return:** \`id\`, \`species\`, \`island\`, \`body_mass_g\` for penguins heavier than **5500** grams.`,
      reference: 'SELECT id, species, island, body_mass_g FROM penguins WHERE body_mass_g > 5500;',
      orderMatters: false,
      walkthrough: `\`WHERE body_mass_g > 5500\` keeps only the rows where the condition is true. Penguins with a \`NULL\` mass are dropped automatically: \`NULL > 5500\` is not true, it is unknown.

Note \`>\` versus \`>=\`. A penguin weighing exactly 5500 g is not "heavier than 5500".`,
    },
  },

  {
    id: 'sql-and-or-not',
    title: 'Combining conditions:',
    titleAccent: 'AND, OR, NOT.',
    topic: 'Logic in WHERE',
    blurb: 'Combine several conditions, and use parentheses to say what you mean.',
    minutes: 20,
    skills: ['AND', 'OR', 'NOT', 'parentheses'],
    concept: '`AND` needs both conditions true, `OR` needs one. `AND` binds tighter than `OR`, so add parentheses.',
    prompt: 'Return name and city of customers who live in Mumbai or Delhi and are older than 25.',
    successNote: 'You mixed AND with OR and used parentheses to control the logic.',
    schema: 'CREATE TABLE customers (name TEXT, city TEXT, age INT);',
    cases: [
      ['Sample', `INSERT INTO customers VALUES ('Asha','Mumbai',30),('Ben','Mumbai',20),('Chitra','Delhi',40),('Dev','Pune',35),('Esha','Delhi',22);`],
      ['Normal case', `INSERT INTO customers VALUES ('Farah','Delhi',26),('Gopal','Mumbai',24),('Hina','Mumbai',51),('Ivan','Chennai',60);`],
      ['Edge case', `INSERT INTO customers VALUES ('Jay','Delhi',25),('Kabir','Pune',44);`],
    ],
    solution: `SELECT name, city FROM customers WHERE (city = 'Mumbai' OR city = 'Delhi') AND age > 25`,
    traps: [`SELECT name, city FROM customers WHERE city = 'Mumbai' OR city = 'Delhi' AND age > 25`],
    real: {
      dataset: 'palmer-penguins',
      title: 'Long-flippered swimmers',
      brief: `Long flippers help penguins swim fast. Find the fast swimmers among two species.

**Return:** \`id\`, \`species\`, \`flipper_length_mm\` for **Adelie or Chinstrap** penguins with a flipper length of **195 mm or more**.`,
      reference: `SELECT id, species, flipper_length_mm FROM penguins WHERE (species = 'Adelie' OR species = 'Chinstrap') AND flipper_length_mm >= 195;`,
      orderMatters: false,
      walkthrough: `\`AND\` binds tighter than \`OR\`. Without parentheses, \`species = 'Adelie' OR species = 'Chinstrap' AND flipper_length_mm >= 195\` means "any Adelie at all, or a long-flippered Chinstrap". The parentheses make the \`OR\` happen first.`,
    },
  },

  {
    id: 'sql-in-between',
    title: 'IN and',
    titleAccent: 'BETWEEN.',
    topic: 'Lists and ranges',
    blurb: 'Match a list of values or a range without long chains of OR.',
    minutes: 15,
    skills: ['IN', 'BETWEEN', 'NOT IN'],
    concept: '`IN (a, b)` matches any value in a list. `BETWEEN x AND y` includes both ends.',
    prompt: 'Return name and price of products in the Books or Toys category whose price is between 100 and 500 (inclusive).',
    successNote: 'You used IN for a list and BETWEEN for an inclusive range.',
    schema: 'CREATE TABLE products (name TEXT, category TEXT, price INT);',
    cases: [
      ['Sample', `INSERT INTO products VALUES ('Atlas','Books',100),('Novel','Books',250),('Puzzle','Toys',500),('Robot','Toys',650),('Lamp','Home',300),('Comic','Books',99);`],
      ['Normal case', `INSERT INTO products VALUES ('Blocks','Toys',120),('Guide','Books',501),('Kite','Toys',99),('Sofa','Home',400),('Diary','Books',350);`],
      ['Edge case', `INSERT INTO products VALUES ('Pen','Stationery',150),('Puzzle','Toys',50);`],
    ],
    solution: `SELECT name, price FROM products WHERE category IN ('Books', 'Toys') AND price BETWEEN 100 AND 500`,
    traps: [`SELECT name, price FROM products WHERE category IN ('Books', 'Toys') AND price > 100 AND price < 500`],
    real: {
      dataset: 'palmer-penguins',
      title: 'Mid-weight penguins on two islands',
      brief: `Compare mid-weight penguins on two of the islands.

**Return:** \`id\`, \`species\`, \`island\`, \`body_mass_g\` for penguins on **Biscoe or Dream** whose body mass is **between 3000 and 3500 grams, inclusive**.`,
      reference: `SELECT id, species, island, body_mass_g FROM penguins WHERE island IN ('Biscoe', 'Dream') AND body_mass_g BETWEEN 3000 AND 3500;`,
      orderMatters: false,
      walkthrough: `\`IN ('Biscoe', 'Dream')\` is shorthand for two \`OR\` conditions. \`BETWEEN 3000 AND 3500\` includes both 3000 and 3500, which is the same as \`>= 3000 AND <= 3500\`. A penguin weighing exactly 3500 g is in.`,
    },
  },

  {
    id: 'sql-like-patterns',
    title: 'Pattern matching',
    titleAccent: 'with LIKE.',
    topic: 'Searching text',
    blurb: 'Find text that starts with, ends with or contains something.',
    minutes: 15,
    skills: ['LIKE', '%', '_'],
    concept: '`LIKE` matches text against a pattern. `%` is any run of characters, `_` is exactly one.',
    prompt: "Return the name of every student whose name starts with the letter A.",
    successNote: 'You searched text with LIKE and the % wildcard.',
    schema: 'CREATE TABLE students (name TEXT, city TEXT);',
    cases: [
      ['Sample', `INSERT INTO students VALUES ('Aarav','Pune'),('Bhavna','Delhi'),('Anjali','Mumbai'),('Kabir','Pune'),('Meera','Goa');`],
      ['Normal case', `INSERT INTO students VALUES ('Divya','Chennai'),('Ashok','Pune'),('Nikhil','Delhi'),('Arjun','Mumbai'),('Ira','Goa'),('Zoya','Pune');`],
      ['Edge case', `INSERT INTO students VALUES ('Bala','Pune'),('Charu','Delhi'),('Ravi','Goa');`],
    ],
    solution: `SELECT name FROM students WHERE name LIKE 'A%'`,
    traps: [`SELECT name FROM students WHERE name LIKE '%A%'`, `SELECT name FROM students WHERE name LIKE 'A'`],
    real: {
      dataset: 'chinook',
      title: 'Bands called "The ..."',
      brief: `The Chinook music store wants a list of "The ..." bands, such as *The Cult* or *The Who*, to feature in a promotion.

**Return:** \`Name\` for every artist whose name **starts with** \`The \` (the word The and a space).`,
      reference: `SELECT Name FROM Artist WHERE Name LIKE 'The %';`,
      orderMatters: false,
      walkthrough: `\`LIKE 'The %'\` means "starts with The and a space, then anything". The space matters: without it, \`'The%'\` would also match names like *Theater Company* or *Therapy?*.

Real names are messy. Some artists start with lower-case letters or extra spaces, so text searches often need care.`,
    },
  },

  {
    id: 'sql-null-values',
    title: 'Missing values:',
    titleAccent: 'NULL.',
    topic: 'Unknown data',
    blurb: 'Find rows with missing data, and learn why = NULL never works.',
    minutes: 20,
    skills: ['NULL', 'IS NULL', 'IS NOT NULL'],
    concept: '`NULL` means unknown. Comparing to it with `=` is never true, so use `IS NULL` and `IS NOT NULL`.',
    prompt: 'Return the id and name of customers who have no email on file.',
    successNote: 'You found missing values with IS NULL.',
    schema: 'CREATE TABLE customers (id INT, name TEXT, email TEXT);',
    cases: [
      ['Sample', `INSERT INTO customers VALUES (1,'Asha','asha@example.com'),(2,'Ben',NULL),(3,'Chitra','chitra@example.com'),(4,'Dev',NULL);`],
      ['Normal case', `INSERT INTO customers VALUES (1,'Esha',NULL),(2,'Farah','farah@example.com'),(3,'Gopal','gopal@example.com'),(4,'Hina',NULL),(5,'Ivan',NULL);`],
      ['Edge case', `INSERT INTO customers VALUES (1,'Jay','jay@example.com'),(2,'Kabir','kabir@example.com');`],
    ],
    solution: 'SELECT id, name FROM customers WHERE email IS NULL',
    traps: ['SELECT id, name FROM customers WHERE email = NULL', 'SELECT id, name FROM customers WHERE email IS NOT NULL'],
    real: {
      dataset: 'palmer-penguins',
      title: 'Penguins that were never sexed',
      brief: `For some penguins the researchers could not tell the sex, so \`sex\` is missing.

**Return:** \`id\`, \`species\`, \`island\` for every penguin whose \`sex\` is missing.`,
      reference: 'SELECT id, species, island FROM penguins WHERE sex IS NULL;',
      orderMatters: false,
      walkthrough: `\`WHERE sex = NULL\` returns nothing, ever: comparing anything to \`NULL\` gives "unknown", which is not true. Use \`IS NULL\`.

Missing values are normal in real data. Knowing how many there are, and where, is usually the first thing an analyst checks.`,
    },
  },

  {
    id: 'sql-order-by',
    title: 'Sorting',
    titleAccent: 'with ORDER BY.',
    topic: 'Ordering results',
    blurb: 'Sort rows by one or more columns, and break ties.',
    minutes: 15,
    skills: ['ORDER BY', 'ASC / DESC', 'tie-breakers'],
    concept: '`ORDER BY` sorts the result. `DESC` reverses it, and extra columns break ties.',
    prompt: 'Return title, year and rating of every movie, highest rating first. Break ties by title A to Z.',
    successNote: 'You sorted by several columns, breaking ties in the order you asked for.',
    orderMatters: true,
    schema: 'CREATE TABLE movies (title TEXT, year INT, rating REAL);',
    cases: [
      ['Sample', `INSERT INTO movies VALUES ('Dune',2021,8.0),('Arrival',2016,8.0),('Cars',2006,7.1),('Up',2009,8.3);`],
      ['Normal case', `INSERT INTO movies VALUES ('Zodiac',2007,7.7),('Coco',2017,8.4),('Babel',2006,7.7),('Her',2013,8.0),('Jaws',1975,8.1);`],
      ['Edge case', `INSERT INTO movies VALUES ('Solaris',1972,7.9),('Alien',1979,7.9),('Memento',2000,7.9);`],
    ],
    solution: 'SELECT title, year, rating FROM movies ORDER BY rating DESC, title ASC',
    traps: ['SELECT title, year, rating FROM movies ORDER BY rating DESC', 'SELECT title, year, rating FROM movies ORDER BY rating ASC, title ASC'],
    real: {
      dataset: 'palmer-penguins',
      title: 'Heaviest Chinstraps',
      brief: `Rank the Chinstrap penguins by weight.

**Return:** \`id\`, \`species\`, \`body_mass_g\` for **Chinstrap** penguins, heaviest first. Break ties by \`id\`, smallest first.`,
      reference: `SELECT id, species, body_mass_g FROM penguins WHERE species = 'Chinstrap' ORDER BY body_mass_g DESC, id ASC;`,
      orderMatters: true,
      walkthrough: `\`ORDER BY body_mass_g DESC\` puts the heaviest first. Many penguins share the same weight, so a second sort key, \`id\`, decides between them. Without a tie-breaker, the order of tied rows is not guaranteed, and could change from one run to the next.`,
    },
  },

  {
    id: 'sql-limit-basics',
    title: 'Limiting results',
    titleAccent: 'with LIMIT.',
    topic: 'Controlling result size',
    blurb: 'Cap how many rows come back with LIMIT.',
    minutes: 15,
    skills: ['LIMIT', 'OFFSET', 'top-N'],
    concept: 'A `LIMIT` clause caps how many rows a query returns. Pair it with `ORDER BY` so you know exactly which rows you get back.',
    prompt: 'Return the 3 cheapest products (sort by price with ORDER BY, then keep only 3 rows).',
    successNote: 'You used ORDER BY with LIMIT to pick exactly the rows you wanted.',
    schema: 'CREATE TABLE products (name TEXT, price INT);',
    cases: [
      ['Sample', `INSERT INTO products VALUES ('Notebook',40),('Pen',10),('Backpack',150),('Water Bottle',60),('Desk Lamp',90);`],
      ['Normal case', `INSERT INTO products VALUES ('Stapler',25),('Mug',180),('Folder',15),('Marker',35),('Ruler',5),('Tape',20);`],
      ['Edge case', `INSERT INTO products VALUES ('Eraser',12),('Glue',8);`],
    ],
    solution: 'SELECT name, price FROM products ORDER BY price LIMIT 3',
    traps: ['SELECT name, price FROM products LIMIT 3', 'SELECT name, price FROM products ORDER BY price DESC LIMIT 3'],
    real: {
      dataset: 'palmer-penguins',
      title: 'The five lightest penguins',
      brief: `Which five penguins weigh the least?

**Return:** \`id\`, \`species\`, \`body_mass_g\` for the **5 lightest** penguins. Ignore penguins with no recorded mass. Break ties by \`id\`.`,
      reference: 'SELECT id, species, body_mass_g FROM penguins WHERE body_mass_g IS NOT NULL ORDER BY body_mass_g ASC, id ASC LIMIT 5;',
      orderMatters: true,
      walkthrough: `Filter out the missing masses first, sort from lightest to heaviest, then keep five rows.

The \`IS NOT NULL\` filter matters. In SQLite, \`NULL\` sorts **before** every number in an ascending sort, so without it the "lightest" penguins would be the ones with no weight at all.`,
    },
  },

  {
    id: 'sql-distinct',
    title: 'Removing duplicates:',
    titleAccent: 'DISTINCT.',
    topic: 'Unique values',
    blurb: 'List each different value once.',
    minutes: 15,
    skills: ['DISTINCT'],
    concept: '`DISTINCT` removes duplicate rows from the result, so you can ask "which different values exist?".',
    prompt: 'Return each city that appears in orders, once, ignoring orders with no city. Sort A to Z.',
    successNote: 'You listed unique values with DISTINCT.',
    orderMatters: true,
    schema: 'CREATE TABLE orders (customer TEXT, city TEXT);',
    cases: [
      ['Sample', `INSERT INTO orders VALUES ('Asha','Pune'),('Ben','Delhi'),('Chitra','Pune'),('Dev',NULL),('Esha','Mumbai'),('Farah','Delhi');`],
      ['Normal case', `INSERT INTO orders VALUES ('Gopal','Goa'),('Hina','Goa'),('Ivan','Chennai'),('Jay','Goa'),('Kabir','Chennai');`],
      ['Edge case', `INSERT INTO orders VALUES ('Leela',NULL),('Manu',NULL);`],
    ],
    solution: 'SELECT DISTINCT city FROM orders WHERE city IS NOT NULL ORDER BY city',
    traps: ['SELECT city FROM orders WHERE city IS NOT NULL ORDER BY city', 'SELECT DISTINCT city FROM orders ORDER BY city'],
    real: {
      dataset: 'palmer-penguins',
      title: 'Where each species lives',
      brief: `Which species were found on which islands?

**Return:** the distinct \`species\` and \`island\` combinations, sorted by \`species\`, then \`island\`.`,
      reference: 'SELECT DISTINCT species, island FROM penguins ORDER BY species, island;',
      orderMatters: true,
      walkthrough: `\`DISTINCT\` applies to the whole row, so it removes rows where **both** columns repeat. Adelie penguins live on three islands, so Adelie appears three times, once per island. There are five combinations in total.`,
    },
  },
]
