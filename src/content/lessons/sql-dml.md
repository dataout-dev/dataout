## Until now, you only read

Every query so far has been a `SELECT`, which reads and never changes anything. Three more statements **modify** data.

| name   | department | salary | hire_date  |
| ------ | ---------- | ------ | ---------- |
| Pooja  | Sales      | 90000  | 2021-02-14 |
| Karan  | Sales      | 85000  | 2022-05-30 |
| Rohan  | Engineering | 180000 | 2017-06-15 |

## INSERT: add rows

```sql
INSERT INTO employees (name, department, salary, hire_date)
VALUES ('Tanvi', 'HR', 70000, '2024-01-08');
```

List the columns, then the values in the same order. You can insert several rows at once by adding more `(...)` groups.

## UPDATE: change rows

```sql
UPDATE employees
SET salary = ROUND(salary * 1.10)
WHERE department = 'Sales'
  AND hire_date < '2022-01-01';
```

`SET` says what to change, and `WHERE` says **which rows**. Only Pooja (Sales, hired 2021) gets the raise: Karan was hired later, and Rohan isn't in Sales.

## DELETE: remove rows

```sql
DELETE FROM employees
WHERE department = 'HR';
```

## The most dangerous mistake in SQL

```sql
UPDATE employees SET salary = 0;       -- every row!
DELETE FROM employees;                 -- every row!
```

Leave out the `WHERE` and the statement changes **every row**. Habits that protect you:

1. **Write it as a `SELECT` first.** Turn `UPDATE ... WHERE x` into `SELECT * FROM ... WHERE x` and check that it returns exactly the rows you mean.
2. **Check the count.** Does the number of rows match what you expected?
3. **Use a transaction** (next lessons) so you can undo it: `BEGIN;` ... check ... `ROLLBACK;` or `COMMIT;`.
4. **Work on a copy** when you're unsure.

## How the tests work here

You write the change **and** a query that shows the result, as one script. The test runs it on a fresh copy of the data, then compares the rows your last `SELECT` returns. Nothing you do here touches real data.

## Keep in mind

- `UPDATE` can change several columns: `SET salary = 0, department = 'HR'`.
- Comparisons matter: `hire_date < '2022-01-01'` and `<=` treat someone hired on that day differently.
- Rows whose value is `NULL` are skipped by a condition like `salary < 0`, since `NULL < 0` isn't true.
