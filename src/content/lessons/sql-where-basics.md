## Start here: tables and SELECT

A database keeps information in **tables**. A table is a grid: each **column** is one kind of information (a name, a grade) and each **row** is one item (one student).

Here is a small table called `students`:

| name   | grade | city   |
| ------ | ----- | ------ |
| Asha   | 82    | Pune   |
| Ben    | 65    | Delhi  |
| Chitra | 91    | Pune   |
| Dev    | 70    | Mumbai |
| Esha   | 58    | Delhi  |

To read data from a table you write a **query**. The simplest query asks for everything:

```sql
SELECT * FROM students;
```

Read it like a sentence: "**select** everything (`*`) **from** the table `students`". The `*` means "all columns", and the `;` marks the end of the statement. This returns all five rows.

## The problem: you rarely want every row

Real tables hold thousands or millions of rows. Usually you only care about some of them: the students who passed, the orders from last week, the customers in one city.

That is what `WHERE` is for. It adds a **condition**, and the database keeps only the rows that meet it.

## Filtering with WHERE

```sql
SELECT * FROM students WHERE grade > 70;
```

Read it out loud: "select everything from `students` **where** the grade is greater than 70."

The database checks each row against the condition and keeps only the ones where it is true:

| name   | grade | city  |
| ------ | ----- | ----- |
| Asha   | 82    | Pune  |
| Chitra | 91    | Pune  |

Ben (65) and Esha (58) fail the condition, so they are left out. Dev (70) is left out too. Keep reading to see why.

> **Where does WHERE go?** Always after the table name: `SELECT ... FROM ... WHERE ...;`

## Comparison operators

The condition is built from a column, a **comparison operator**, and a value:

| Operator     | Meaning                  | Example                  |
| ------------ | ------------------------ | ------------------------ |
| `=`          | equal to                 | `WHERE city = 'Pune'`    |
| `!=` or `<>` | not equal to             | `WHERE city != 'Pune'`   |
| `>`          | greater than             | `WHERE grade > 70`       |
| `<`          | less than                | `WHERE grade < 70`       |
| `>=`         | greater than or equal to | `WHERE grade >= 70`      |
| `<=`         | less than or equal to    | `WHERE grade <= 70`      |

> **Watch out:** SQL uses a single `=` to mean "is equal to". There is no `==`.

## The boundary trap: > versus >=

Dev's grade is exactly 70. Compare these two queries:

```sql
SELECT * FROM students WHERE grade > 70;
SELECT * FROM students WHERE grade >= 70;
```

- `grade > 70` means *strictly more than* 70, so Dev is **not** included.
- `grade >= 70` means *70 or more*, so Dev **is** included, and you get Asha, Chitra and Dev.

Whenever a value sits right on the line, ask yourself whether the line itself should count. Reading the task carefully ("more than" versus "at least") tells you which operator to use.

## Text versus numbers

Numbers are written as they are: `70`. Text goes inside **single quotes**: `'Pune'`.

```sql
SELECT * FROM students WHERE city = 'Delhi';
```

| name | grade | city  |
| ---- | ----- | ----- |
| Ben  | 65    | Delhi |
| Esha | 58    | Delhi |

In the SQLite database used here, keywords like `SELECT` and `WHERE` can be written in any case, but text values are compared **exactly**. `'delhi'` does not match `'Delhi'`.

## When nothing matches

What if no row meets the condition?

```sql
SELECT * FROM students WHERE grade > 100;
```

You get an **empty result**: zero rows. That is not an error, it is a correct answer. It simply means nothing matched. A good query gives the right answer on every table, including one where the answer is "no rows".

## Missing values (NULL)

Sometimes a value is unknown or was never filled in. SQL stores this as `NULL`. Imagine a new student, Farah, whose grade has not been recorded yet.

Farah will **not** appear in `WHERE grade > 70`, and she will not appear in `WHERE grade <= 70` either. A missing value is neither bigger nor smaller than anything, so a comparison with it never counts as true. (There is a special test for missing values, `IS NULL`, which you will meet later.)

## Putting it to use

Switch to the **Practice** tab when you are ready. A few tips:

1. Read the task closely. Words like *more than*, *at least* and *exactly* decide which operator you need.
2. Check the **Schema** panel for the exact table and column names.
3. Use **Run** to test your query on the sample data as often as you like.
4. Then press **Submit**. It checks your query against several hidden tables, so a query that only works for the sample (for example one that names specific people) will not pass. Write a condition that describes the rule, not the answer.

## Recap

- `SELECT * FROM table;` returns every row.
- `WHERE` keeps only the rows that meet a condition, and it comes after `FROM`.
- Conditions use operators such as `=`, `>`, `<`, `>=`, `<=` and `!=`.
- Text goes in single quotes, and it must match exactly.
- Watch the boundary: `>` excludes the value itself, `>=` includes it.
- An empty result is a valid answer.
