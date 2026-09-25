export const beginnerExtras = {
  'sql-select-basics': [
    {
      dataset: 'palmer-penguins',
      title: 'The measuring tape',
      brief: `The researchers care about body proportions.

**Return:** \`id\`, \`bill_length_mm\`, \`bill_depth_mm\`, \`flipper_length_mm\` for every penguin, in that order.`,
      reference: 'SELECT id, bill_length_mm, bill_depth_mm, flipper_length_mm FROM penguins;',
      orderMatters: false,
      walkthrough: `Same shape as the first challenge, with different columns. List exactly the four columns after \`SELECT\`, in the order the task gives them.`,
    },
    {
      dataset: 'chinook',
      title: 'A different table',
      brief: `Everything you just did works on any table. The Chinook music store has a \`Genre\` table.

**Return:** \`GenreId\` and \`Name\` for every genre.`,
      reference: 'SELECT GenreId, Name FROM Genre;',
      orderMatters: false,
      walkthrough: `Only the table and column names change. Table and column names in Chinook start with capital letters, but SQL doesn't mind whether you type \`Genre\` or \`genre\`.`,
    },
  ],

  'sql-aliases-expressions': [
    {
      dataset: 'palmer-penguins',
      title: 'Flippers in centimetres',
      brief: `Flipper length is stored in millimetres, but a poster needs centimetres.

**Return:** \`id\`, \`species\`, \`flipper_length_cm\` (\`flipper_length_mm\` divided by 10, rounded to **1 decimal place**) for every penguin.`,
      reference: 'SELECT id, species, ROUND(flipper_length_mm / 10.0, 1) AS flipper_length_cm FROM penguins;',
      orderMatters: false,
      walkthrough: `Divide by \`10.0\`, not \`10\`, so SQLite does decimal arithmetic instead of throwing away the remainder. \`ROUND(..., 1)\` then keeps one decimal place. A penguin with no flipper measurement stays \`NULL\`.`,
    },
    {
      dataset: 'palmer-penguins',
      title: 'Bill shape',
      brief: `A bird expert compares bill shapes: how long is the bill compared with how deep it is?

**Return:** \`id\`, \`species\`, \`bill_ratio\` (\`bill_length_mm\` divided by \`bill_depth_mm\`, rounded to **2 decimal places**) for every penguin.`,
      reference: 'SELECT id, species, ROUND(bill_length_mm / bill_depth_mm, 2) AS bill_ratio FROM penguins;',
      orderMatters: false,
      walkthrough: `Both columns already hold decimals, so a plain \`/\` is enough here. Rounding to 2 places keeps the ratio readable. If either measurement is missing, the ratio is \`NULL\`.`,
    },
  ],

  'sql-where-basics': [
    {
      dataset: 'palmer-penguins',
      title: 'Short flippers',
      brief: `Which penguins have short flippers?

**Return:** \`id\`, \`species\`, \`flipper_length_mm\` for penguins with a flipper length **under 185** mm.`,
      reference: 'SELECT id, species, flipper_length_mm FROM penguins WHERE flipper_length_mm < 185;',
      orderMatters: false,
      walkthrough: `\`WHERE flipper_length_mm < 185\` keeps the rows where the condition is true. Penguins with no flipper measurement are left out, because \`NULL < 185\` is unknown, not true.`,
    },
    {
      dataset: 'palmer-penguins',
      title: 'The 2009 season',
      brief: `The team wants only the final year of measurements.

**Return:** \`id\`, \`species\`, \`island\` for penguins measured in **2009**.`,
      reference: 'SELECT id, species, island FROM penguins WHERE year = 2009;',
      orderMatters: false,
      walkthrough: `Numbers go without quotes: \`WHERE year = 2009\`. Text needs single quotes, like \`species = 'Adelie'\`.`,
    },
  ],

  'sql-and-or-not': [
    {
      dataset: 'palmer-penguins',
      title: 'Heavy females',
      brief: `A study looks at large female Gentoo penguins.

**Return:** \`id\`, \`sex\`, \`body_mass_g\` for **Gentoo** penguins whose \`sex\` is **female** and whose body mass is **above 5000** g.`,
      reference: `SELECT id, sex, body_mass_g FROM penguins WHERE species = 'Gentoo' AND sex = 'female' AND body_mass_g > 5000;`,
      orderMatters: false,
      walkthrough: `Three conditions joined with \`AND\`: a row must satisfy all of them. Any penguin with a missing \`sex\` or \`body_mass_g\` fails its condition and is left out.`,
    },
    {
      dataset: 'palmer-penguins',
      title: 'Anywhere but Biscoe',
      brief: `Ignore Biscoe island. Focus on the later years.

**Return:** \`id\`, \`island\`, \`year\` for penguins that are **not** on **Biscoe** and were measured in **2008 or 2009**.`,
      reference: `SELECT id, island, year FROM penguins WHERE NOT island = 'Biscoe' AND (year = 2008 OR year = 2009);`,
      orderMatters: false,
      walkthrough: `\`NOT island = 'Biscoe'\` (or \`island <> 'Biscoe'\`) removes one island, and the parentheses make the \`OR\` happen first. Without them, \`AND\` would bind tighter and change the meaning.`,
    },
  ],

  'sql-in-between': [
    {
      dataset: 'palmer-penguins',
      title: 'Big flippers, two species',
      brief: `Compare flipper sizes of two species.

**Return:** \`id\`, \`species\`, \`flipper_length_mm\` for **Adelie or Gentoo** penguins whose flipper length is **between 200 and 210 mm, inclusive**.`,
      reference: `SELECT id, species, flipper_length_mm FROM penguins WHERE species IN ('Adelie', 'Gentoo') AND flipper_length_mm BETWEEN 200 AND 210;`,
      orderMatters: false,
      walkthrough: `\`IN (...)\` matches any species in the list, and \`BETWEEN 200 AND 210\` includes both ends. Chinstrap penguins are left out because their species isn't in the list.`,
    },
    {
      dataset: 'palmer-penguins',
      title: 'The extremes',
      brief: `Look for unusually light or heavy penguins in two of the years.

**Return:** \`id\`, \`year\`, \`body_mass_g\` for penguins measured in **2007 or 2009** whose body mass is **not between 3000 and 5000** grams.`,
      reference: 'SELECT id, year, body_mass_g FROM penguins WHERE year IN (2007, 2009) AND body_mass_g NOT BETWEEN 3000 AND 5000;',
      orderMatters: false,
      walkthrough: `\`NOT BETWEEN 3000 AND 5000\` keeps values below 3000 or above 5000; exactly 3000 and 5000 are excluded, since \`BETWEEN\` includes both ends. Penguins with no recorded mass drop out.`,
    },
  ],

  'sql-like-patterns': [
    {
      dataset: 'chinook',
      title: 'Love songs',
      brief: `A playlist editor wants every track with the word "love" in its name.

**Return:** \`TrackId\` and \`Name\` of tracks whose name **contains** \`love\` (any capital letters).`,
      reference: `SELECT TrackId, Name FROM Track WHERE Name LIKE '%love%';`,
      orderMatters: false,
      walkthrough: `A \`%\` on both sides means "with anything before and after". In SQLite, \`LIKE\` ignores upper and lower case for ordinary letters, so this also matches \`Love\` and \`LOVE\`. It will also match words like "glove", so real searches often need more care.`,
    },
    {
      dataset: 'chinook',
      title: 'Four-letter first names',
      brief: `Find customers whose first name is exactly **four letters** long and whose email address ends in \`.com\`.

**Return:** \`CustomerId\`, \`FirstName\`, \`Email\`.`,
      reference: `SELECT CustomerId, FirstName, Email FROM Customer WHERE FirstName LIKE '____' AND Email LIKE '%.com';`,
      orderMatters: false,
      walkthrough: `Each \`_\` stands for exactly one character, so four underscores match names of exactly four letters. \`'%.com'\` matches anything that ends with \`.com\`.`,
    },
  ],

  'sql-null-values': [
    {
      dataset: 'palmer-penguins',
      title: 'Missing bill measurements',
      brief: `A few penguins have no bill measurements at all.

**Return:** \`id\`, \`species\`, \`island\` for penguins whose \`bill_length_mm\` is missing.`,
      reference: 'SELECT id, species, island FROM penguins WHERE bill_length_mm IS NULL;',
      orderMatters: false,
      walkthrough: `\`IS NULL\` is the only way to test for a missing value. It is a small result, and exactly the kind of check worth running before you calculate averages.`,
    },
    {
      dataset: 'chinook',
      title: 'Customers with a company',
      brief: `Most Chinook customers are individuals. Some bought on behalf of a company.

**Return:** \`CustomerId\`, \`LastName\`, \`Company\` for customers who **do** have a company recorded.`,
      reference: 'SELECT CustomerId, LastName, Company FROM Customer WHERE Company IS NOT NULL;',
      orderMatters: false,
      walkthrough: `\`IS NOT NULL\` is the opposite test. It keeps only the rows that have a value.`,
    },
  ],

  'sql-order-by': [
    {
      dataset: 'palmer-penguins',
      title: 'Torgersen by year and weight',
      brief: `List the penguins of one island in a sensible order.

**Return:** \`id\`, \`year\`, \`body_mass_g\` for penguins on **Torgersen**. Sort by \`year\` (oldest first), then \`body_mass_g\` (lightest first), then \`id\`.`,
      reference: `SELECT id, year, body_mass_g FROM penguins WHERE island = 'Torgersen' ORDER BY year ASC, body_mass_g ASC, id ASC;`,
      orderMatters: true,
      walkthrough: `Three sort keys, each deciding only when the earlier ones tie. In SQLite, missing values sort **first** in an ascending sort, so penguins with no body mass appear at the top of their year.`,
    },
    {
      dataset: 'chinook',
      title: 'Genres A to Z',
      brief: `**Return:** \`GenreId\` and \`Name\` for every genre, sorted by \`Name\` from A to Z.`,
      reference: 'SELECT GenreId, Name FROM Genre ORDER BY Name;',
      orderMatters: true,
      walkthrough: `\`ORDER BY Name\` sorts alphabetically, because ascending is the default. The genre names are all different, so no tie-breaker is needed here.`,
    },
  ],

  'sql-limit-basics': [
    {
      dataset: 'palmer-penguins',
      title: 'The three heaviest',
      brief: `**Return:** \`id\`, \`species\`, \`body_mass_g\` for the **3 heaviest** penguins. Break ties by \`id\`, smallest first.`,
      reference: 'SELECT id, species, body_mass_g FROM penguins ORDER BY body_mass_g DESC, id ASC LIMIT 3;',
      orderMatters: true,
      walkthrough: `Sort from heaviest to lightest with \`DESC\`, then keep three rows. Unlike an ascending sort, a descending sort puts missing values **last**, so you don't need to filter them out here.`,
    },
    {
      dataset: 'chinook',
      title: 'Page two of the longest tracks',
      brief: `A website shows the longest tracks five at a time. Page 1 shows ranks 1 to 5. You need **page 2**.

**Return:** \`TrackId\`, \`Name\`, \`Milliseconds\` for the tracks ranked **6th to 10th longest**. Sort by \`Milliseconds\`, longest first, and break ties by \`TrackId\`.`,
      reference: 'SELECT TrackId, Name, Milliseconds FROM Track ORDER BY Milliseconds DESC, TrackId ASC LIMIT 5 OFFSET 5;',
      orderMatters: true,
      walkthrough: `\`LIMIT 5 OFFSET 5\` skips the first five rows and then keeps the next five. That is how pagination works: page 3 would be \`OFFSET 10\`. The sort has to stay the same on every page, or rows would move between pages.`,
    },
  ],

  'sql-distinct': [
    {
      dataset: 'palmer-penguins',
      title: 'Years and islands',
      brief: `**Return:** the distinct \`year\` and \`island\` combinations in the data, sorted by \`year\`, then \`island\`.`,
      reference: 'SELECT DISTINCT year, island FROM penguins ORDER BY year, island;',
      orderMatters: true,
      walkthrough: `\`DISTINCT\` removes rows that are identical in **both** columns, so each year and island pair appears once. It shows you at a glance which islands were visited in which years.`,
    },
    {
      dataset: 'chinook',
      title: 'Where our customers live',
      brief: `**Return:** every \`Country\` that has at least one customer, each country once, sorted A to Z.`,
      reference: 'SELECT DISTINCT Country FROM Customer ORDER BY Country;',
      orderMatters: true,
      walkthrough: `Many customers share a country, so without \`DISTINCT\` the country would repeat once per customer. \`DISTINCT\` answers "which different values exist?".`,
    },
  ],
}
