## A new kind of calculation

`GROUP BY` collapses rows: you get one row per group and lose the details. Sometimes you want to keep every row **and** add a calculation that looks at related rows, such as "this employee's rank within their department". That is a **window function**.

| name   | department | salary |
| ------ | ---------- | ------ |
| Asha   | Eng        | 100    |
| Ben    | Eng        | 100    |
| Chitra | Eng        | 80     |
| Dev    | Sales      | 90     |
| Esha   | Sales      | 70     |

## Anatomy

```sql
SELECT name, department, salary,
       RANK() OVER (
         PARTITION BY department
         ORDER BY salary DESC
       ) AS dept_rank
FROM employees;
```

- `RANK()` is the function.
- `OVER (...)` says it is a window function and defines the window.
- `PARTITION BY department` restarts the calculation for each department.
- `ORDER BY salary DESC` decides the ranking order.

| name   | department | salary | dept_rank |
| ------ | ---------- | ------ | --------- |
| Asha   | Eng        | 100    | 1         |
| Ben    | Eng        | 100    | 1         |
| Chitra | Eng        | 80     | 3         |
| Dev    | Sales      | 90     | 1         |
| Esha   | Sales      | 70     | 2         |

All five rows are still there.

## Three ranking functions

They differ only when there are **ties** (Asha and Ben):

| Function | Ranks for 100, 100, 80 |
| -------- | ---------------------- |
| `ROW_NUMBER()` | 1, 2, 3 (ties get different numbers, arbitrarily) |
| `RANK()` | 1, 1, 3 (ties share a rank; the next rank is skipped) |
| `DENSE_RANK()` | 1, 1, 2 (ties share a rank; no gap) |

Use `ROW_NUMBER` when you need exactly one row per position, `RANK` for competition-style ranking, and `DENSE_RANK` for "the nth highest distinct value".

## Keep in mind

- Leave out `PARTITION BY` and the whole result is one window.
- Window functions run **after** `WHERE` and `GROUP BY`, so you can't filter on one directly. Wrap the query in a CTE, then filter (lesson 33).
- They can rank aggregated results: `RANK() OVER (ORDER BY COUNT(*) DESC)` in a `GROUP BY` query.
