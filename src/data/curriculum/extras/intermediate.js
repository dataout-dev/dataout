export const intermediateExtras = {
  'sql-aggregates': [
    {
      dataset: 'chinook',
      title: 'The catalogue in numbers',
      brief: `**Return one row** from \`Track\`: \`tracks\` (how many), \`avg_ms\` (the average \`Milliseconds\`, rounded to a **whole number**), \`longest_ms\` (the largest \`Milliseconds\`) and \`shortest_ms\` (the smallest).`,
      reference: 'SELECT COUNT(*) AS tracks, ROUND(AVG(Milliseconds)) AS avg_ms, MAX(Milliseconds) AS longest_ms, MIN(Milliseconds) AS shortest_ms FROM Track;',
      orderMatters: false,
      walkthrough: `Four aggregates in one \`SELECT\` collapse every track into a single row. \`ROUND(x)\` with no second argument rounds to a whole number.`,
    },
    {
      dataset: 'chinook',
      title: 'How complete are the customer records?',
      brief: `**Return one row** from \`Customer\`: \`total_customers\`, \`with_company\` (customers that have a \`Company\`) and \`with_state\` (customers that have a \`State\`).`,
      reference: 'SELECT COUNT(*) AS total_customers, COUNT(Company) AS with_company, COUNT(State) AS with_state FROM Customer;',
      orderMatters: false,
      walkthrough: `\`COUNT(*)\` counts rows, while \`COUNT(column)\` counts only the rows where that column is not \`NULL\`. Comparing the two tells you how much data is missing.`,
    },
  ],

  'sql-group-by': [
    {
      dataset: 'chinook',
      title: 'Tracks per media type',
      brief: `**Return:** \`MediaTypeId\` and \`tracks\` (how many tracks have that media type) for each media type. Most tracks first; break ties by \`MediaTypeId\`.`,
      reference: 'SELECT MediaTypeId, COUNT(*) AS tracks FROM Track GROUP BY MediaTypeId ORDER BY tracks DESC, MediaTypeId;',
      orderMatters: true,
      walkthrough: `One bucket per \`MediaTypeId\`, and \`COUNT(*)\` counts the rows in each bucket. Sorting by the count with an id tie-breaker keeps the order the same every time.`,
    },
    {
      dataset: 'chinook',
      title: 'Spend per customer',
      brief: `**Return:** \`CustomerId\`, \`invoices\` (how many invoices) and \`total_spent\` (the sum of \`Total\`, rounded to **2 decimals**) for each customer. Sort by \`total_spent\` (as rounded), highest first, then \`CustomerId\`.`,
      reference: 'SELECT CustomerId, COUNT(*) AS invoices, ROUND(SUM(Total), 2) AS total_spent FROM Invoice GROUP BY CustomerId ORDER BY total_spent DESC, CustomerId;',
      orderMatters: true,
      walkthrough: `Two aggregates in each customer's bucket. Many customers spend nearly the same, so the tie-breaker on \`CustomerId\` matters.`,
    },
  ],

  'sql-having': [
    {
      dataset: 'chinook',
      title: 'Big albums',
      brief: `Some albums are much longer than others.

**Return:** \`AlbumId\` and \`tracks\` (how many tracks it has) for albums with **more than 15 tracks**. Most tracks first; break ties by \`AlbumId\`.`,
      reference: 'SELECT AlbumId, COUNT(*) AS tracks FROM Track GROUP BY AlbumId HAVING COUNT(*) > 15 ORDER BY tracks DESC, AlbumId;',
      orderMatters: true,
      walkthrough: `You can't know an album's track count until the tracks are grouped, so the filter goes in \`HAVING\`. Note \`> 15\`, not \`>= 15\`: an album with exactly 15 tracks is out.`,
    },
    {
      dataset: 'chinook',
      title: 'Cities with several customers',
      brief: `**Return:** \`City\` and \`customers\` (how many customers live there) for cities with **at least 2 customers**. Most customers first; break ties by \`City\`.`,
      reference: 'SELECT City, COUNT(*) AS customers FROM Customer GROUP BY City HAVING COUNT(*) >= 2 ORDER BY customers DESC, City;',
      orderMatters: true,
      walkthrough: `Group by city, count the customers, keep the groups of two or more with \`HAVING\`. Cities with a single customer disappear.`,
    },
  ],

  'sql-case-when': [
    {
      dataset: 'chinook',
      title: 'Small, medium and large invoices',
      brief: `Label each invoice by its \`Total\`: **Small** (under 2), **Medium** (2 up to but not including 10) or **Large** (10 or more).

**Return:** \`invoice_size\` and \`invoices\` (how many invoices fall in each size). Most invoices first.`,
      reference: "SELECT CASE WHEN Total < 2 THEN 'Small' WHEN Total < 10 THEN 'Medium' ELSE 'Large' END AS invoice_size, COUNT(*) AS invoices FROM Invoice GROUP BY invoice_size ORDER BY invoices DESC;",
      orderMatters: true,
      walkthrough: `\`CASE\` labels each row, then \`GROUP BY\` on the label counts the rows in each. Because \`CASE\` stops at the first match, the \`< 10\` test only sees totals that already failed \`< 2\`.`,
    },
    {
      dataset: 'chinook',
      title: 'Home markets',
      brief: `Group the customers into three regions: \`USA\`, \`Canada\` and \`Rest of world\` (everyone else).

**Return:** \`region\` and \`customers\` (how many customers are in it). Most customers first.`,
      reference: "SELECT CASE WHEN Country = 'USA' THEN 'USA' WHEN Country = 'Canada' THEN 'Canada' ELSE 'Rest of world' END AS region, COUNT(*) AS customers FROM Customer GROUP BY region ORDER BY customers DESC;",
      orderMatters: true,
      walkthrough: `The \`ELSE\` branch catches every country you didn't list. Without it, the other countries would get \`NULL\` as their label.`,
    },
  ],

  'sql-text-functions': [
    {
      dataset: 'chinook',
      title: 'Name badges',
      brief: `**Return:** \`CustomerId\`, \`full_name\` (\`FirstName\`, a space, then \`LastName\`, all in **upper case**) and \`name_length\` (the number of characters in that full name) for customers with \`CustomerId\` **10 or lower**. Sort by \`CustomerId\`.`,
      reference: "SELECT CustomerId, UPPER(FirstName || ' ' || LastName) AS full_name, LENGTH(FirstName || ' ' || LastName) AS name_length FROM Customer WHERE CustomerId <= 10 ORDER BY CustomerId;",
      orderMatters: true,
      walkthrough: `\`||\` joins text together. \`UPPER\` and \`LENGTH\` then work on the joined result. Build the full name once in your head, then use it twice.`,
    },
    {
      dataset: 'chinook',
      title: 'Composers by initial',
      brief: `Which letters do composers' names most often start with?

**Return:** \`initial\` (the first letter of \`Composer\`, in upper case) and \`tracks\` (how many tracks have a composer starting with that letter), for tracks where \`Composer\` is **not missing**. Show the **top 5** initials, most tracks first, then \`initial\`.`,
      reference: 'SELECT UPPER(SUBSTR(Composer, 1, 1)) AS initial, COUNT(*) AS tracks FROM Track WHERE Composer IS NOT NULL GROUP BY initial ORDER BY tracks DESC, initial LIMIT 5;',
      orderMatters: true,
      walkthrough: `\`SUBSTR(Composer, 1, 1)\` takes one character starting at position 1. Filtering out the missing composers first keeps a giant \`NULL\` group out of the top of the list.`,
    },
  ],

  'sql-dates': [
    {
      dataset: 'chinook',
      title: 'A year of sales',
      brief: `**Return:** \`month\` (as \`YYYY-MM\`), \`invoices\` (how many) and \`revenue\` (the sum of \`Total\`, rounded to **2 decimals**) for each month of **2011**. Sort by \`month\`.`,
      reference: "SELECT strftime('%Y-%m', InvoiceDate) AS month, COUNT(*) AS invoices, ROUND(SUM(Total), 2) AS revenue FROM Invoice WHERE strftime('%Y', InvoiceDate) = '2011' GROUP BY month ORDER BY month;",
      orderMatters: true,
      walkthrough: `\`strftime\` returns text, so the year is compared with \`'2011'\` in quotes. The same function is used twice: once to filter the year, once to build the month label.`,
    },
    {
      dataset: 'chinook',
      title: 'When were they hired?',
      brief: `**Return:** \`hire_year\` (the year of \`HireDate\`, as text) and \`employees\` (how many employees were hired that year). Sort by \`hire_year\`.`,
      reference: "SELECT strftime('%Y', HireDate) AS hire_year, COUNT(*) AS employees FROM Employee GROUP BY hire_year ORDER BY hire_year;",
      orderMatters: true,
      walkthrough: `\`HireDate\` looks like \`2002-08-14 00:00:00\`, and \`strftime('%Y', ...)\` cuts the year out of it.`,
    },
  ],

  'sql-inner-join': [
    {
      dataset: 'chinook',
      title: 'Jazz tracks',
      brief: `A \`Track\` only stores a \`GenreId\`. The genre's name is in \`Genre\`.

**Return:** \`track\` (the track \`Name\`) and \`genre\` (the genre \`Name\`) for every track in the **Jazz** genre.`,
      reference: "SELECT t.Name AS track, g.Name AS genre FROM Track t JOIN Genre g ON g.GenreId = t.GenreId WHERE g.Name = 'Jazz';",
      orderMatters: false,
      walkthrough: `Join the two tables on the id they share, then filter on the joined column. Both tables have a \`Name\` column, so each one has to be qualified (\`t.Name\`, \`g.Name\`) and given an alias.`,
    },
    {
      dataset: 'chinook',
      title: 'German invoices',
      brief: `**Return:** \`InvoiceId\`, \`customer\` (\`FirstName\`, a space, then \`LastName\`) and \`Total\` for every invoice belonging to a customer whose \`Country\` is **Germany**.`,
      reference: "SELECT i.InvoiceId, c.FirstName || ' ' || c.LastName AS customer, i.Total FROM Invoice i JOIN Customer c ON c.CustomerId = i.CustomerId WHERE c.Country = 'Germany';",
      orderMatters: false,
      walkthrough: `The filter is on \`Customer.Country\`, but the rows you return come from both tables. That is what a join is for: it lets a condition on one table decide which rows of another to keep.`,
    },
  ],

  'sql-left-join': [
    {
      dataset: 'chinook',
      title: 'Employees with no customers',
      brief: `Only some employees look after customers.

**Return:** \`employee\` (\`FirstName\`, a space, then \`LastName\`) for every employee who is **not** the support representative (\`SupportRepId\`) of any customer.`,
      reference: "SELECT e.FirstName || ' ' || e.LastName AS employee FROM Employee e LEFT JOIN Customer c ON c.SupportRepId = e.EmployeeId WHERE c.CustomerId IS NULL;",
      orderMatters: false,
      walkthrough: `The same anti-join as before: keep every employee, then keep only those where the customer side came back \`NULL\`. Test a column that can never be \`NULL\` in a real match, such as the customer's primary key.`,
    },
    {
      dataset: 'chinook',
      title: 'Empty playlists',
      brief: `A playlist is linked to its tracks through \`PlaylistTrack\`. Some playlists were created and never filled.

**Return:** \`PlaylistId\` and \`Name\` of playlists in \`Playlist\` that have **no rows** in \`PlaylistTrack\`.`,
      reference: 'SELECT p.PlaylistId, p.Name FROM Playlist p LEFT JOIN PlaylistTrack pt ON pt.PlaylistId = p.PlaylistId WHERE pt.PlaylistId IS NULL;',
      walkthrough: `An empty playlist has nothing to match in \`PlaylistTrack\`, so its right-hand columns are \`NULL\`. Filtering on \`pt.PlaylistId IS NULL\` keeps exactly those playlists. Some playlist names appear twice in this data; the \`PlaylistId\` tells the copies apart.`,
      orderMatters: false,
    },
  ],

  'sql-multi-table-join': [
    {
      dataset: 'chinook',
      title: 'The top artists by revenue',
      brief: `An artist's revenue is the sum of \`UnitPrice * Quantity\` of every invoice line for their tracks. The path is: **invoice line, track, album, artist**.

**Return:** \`artist\` (the artist \`Name\`) and \`revenue\` (rounded to 2 decimals) for the **top 5 artists** by revenue (compare the rounded values). Break ties by \`artist\`.`,
      reference: 'SELECT ar.Name AS artist, ROUND(SUM(il.UnitPrice * il.Quantity), 2) AS revenue FROM InvoiceLine il JOIN Track t ON t.TrackId = il.TrackId JOIN Album al ON al.AlbumId = t.AlbumId JOIN Artist ar ON ar.ArtistId = al.ArtistId GROUP BY ar.ArtistId, ar.Name ORDER BY revenue DESC, artist LIMIT 5;',
      orderMatters: true,
      walkthrough: `Four tables, three joins, each one linking the next table to one already in the query. Run the joins without the aggregate first and look at a few rows: if the numbers look doubled, a join is duplicating rows.`,
    },
    {
      dataset: 'chinook',
      title: 'Revenue per support representative',
      brief: `Employee, customer and invoice are linked: an employee supports customers (\`SupportRepId\`), and customers have invoices.

**Return:** \`employee\` (\`FirstName\`, a space, then \`LastName\`) and \`revenue\` (the sum of the invoice \`Total\`s of their customers, rounded to 2 decimals). Highest revenue first.`,
      reference: "SELECT e.FirstName || ' ' || e.LastName AS employee, ROUND(SUM(i.Total), 2) AS revenue FROM Employee e JOIN Customer c ON c.SupportRepId = e.EmployeeId JOIN Invoice i ON i.CustomerId = c.CustomerId GROUP BY e.EmployeeId, e.FirstName, e.LastName ORDER BY revenue DESC;",
      orderMatters: true,
      walkthrough: `Follow the keys from the employee, to their customers, to those customers' invoices, then sum the totals per employee. Employees who support nobody have no rows to sum and don't appear.`,
    },
  ],

  'sql-self-join': [
    {
      dataset: 'chinook',
      title: 'Job titles up the chain',
      brief: `**Return:** \`employee\` (\`FirstName\`, a space, then \`LastName\`) and \`manager_title\` (the \`Title\` of that employee's manager) for every employee who has a manager.`,
      reference: "SELECT e.FirstName || ' ' || e.LastName AS employee, m.Title AS manager_title FROM Employee e JOIN Employee m ON m.EmployeeId = e.ReportsTo;",
      orderMatters: false,
      walkthrough: `Same self join as before, but you read a different column from the manager's copy of the table.`,
    },
    {
      dataset: 'chinook',
      title: 'Neighbours',
      brief: `Find pairs of customers who live in the **same city**.

**Return:** \`city\`, \`first_id\` and \`second_id\` (the \`CustomerId\`s of the two customers) for every pair. List each pair only **once**, with the lower id in \`first_id\`. Sort by \`city\`, then \`first_id\`, then \`second_id\`.`,
      reference: 'SELECT a.City AS city, a.CustomerId AS first_id, b.CustomerId AS second_id FROM Customer a JOIN Customer b ON a.City = b.City AND a.CustomerId < b.CustomerId ORDER BY city, first_id, second_id;',
      orderMatters: true,
      walkthrough: `Joining a table to itself on city pairs every customer with every other customer in the same city, including with themselves and in both orders. The condition \`a.CustomerId < b.CustomerId\` removes both problems at once.`,
    },
  ],

  'sql-union': [
    {
      dataset: 'chinook',
      title: 'One mailing list',
      brief: `**Return:** \`Email\`, every email address that belongs to a customer **or** an employee, each address once, sorted A to Z.`,
      reference: 'SELECT Email FROM Customer UNION SELECT Email FROM Employee ORDER BY Email;',
      orderMatters: true,
      walkthrough: `\`UNION\` stacks the two lists and removes duplicates. The single \`ORDER BY\` at the very end sorts the combined result.`,
    },
    {
      dataset: 'chinook',
      title: 'A catalogue of labels',
      brief: `**Return:** \`Name\` and \`kind\`: every genre with \`kind\` set to \`genre\`, and every media type with \`kind\` set to \`media type\`, all in one list. Keep every row. Sort by \`kind\`, then \`Name\`.`,
      reference: "SELECT Name, 'genre' AS kind FROM Genre UNION ALL SELECT Name, 'media type' FROM MediaType ORDER BY kind, Name;",
      orderMatters: true,
      walkthrough: `A constant such as \`'genre'\` becomes a column, which tells you which table each row came from. \`UNION ALL\` keeps everything without checking for duplicates, which is what you want when nothing should be removed.`,
    },
  ],

  'sql-coalesce': [
    {
      dataset: 'chinook',
      title: 'A region for every customer',
      brief: `Some customers have a \`State\`, some don't. Use the \`Country\` when there is no state.

**Return:** \`CustomerId\` and \`region\` (the \`State\`, or the \`Country\` when \`State\` is missing) for customers with \`CustomerId\` **12 or lower**. Sort by \`CustomerId\`.`,
      reference: 'SELECT CustomerId, COALESCE(State, Country) AS region FROM Customer WHERE CustomerId <= 12 ORDER BY CustomerId;',
      orderMatters: true,
      walkthrough: `\`COALESCE(State, Country)\` returns the state when there is one, and otherwise falls through to the country.`,
    },
    {
      dataset: 'chinook',
      title: 'Who wrote all these tracks?',
      brief: `A lot of tracks have no composer recorded.

**Return:** \`composer_name\` (the \`Composer\`, or the text \`Unknown\` when it is missing) and \`tracks\` (how many tracks have that composer). Show the **top 5**, most tracks first, then \`composer_name\`.`,
      reference: "SELECT COALESCE(Composer, 'Unknown') AS composer_name, COUNT(*) AS tracks FROM Track GROUP BY composer_name ORDER BY tracks DESC, composer_name LIMIT 5;",
      orderMatters: true,
      walkthrough: `Replacing the missing values with a label puts them in a group of their own that you can see and count, instead of a blank row.`,
    },
  ],
}
