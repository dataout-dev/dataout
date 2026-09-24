## When one average isn't enough

"Employees who earn more than the average" uses one fixed number, and a plain subquery handles it. But "employees who earn more than **their own department's** average" needs a **different** average for each row.

| name   | department | salary |
| ------ | ---------- | ------ |
| Asha   | Eng        | 100    |
| Ben    | Eng        | 80     |
| Chitra | Eng        | 60     |
| Dev    | Sales      | 50     |
| Esha   | Sales      | 90     |

## A correlated subquery

```sql
SELECT name, department, salary
FROM employees e
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
  WHERE department = e.department
);
```

The inner query mentions `e.department`, a column of the **outer** query. That link is what makes it *correlated*: the database re-runs the inner query for every outer row, each time with that row's department.

| name | department | salary |
| ---- | ---------- | ------ |
| Asha | Eng        | 100    |
| Esha | Sales      | 90     |

Engineering averages 80, so only Asha beats it. Sales averages 70, so only Esha does.

## The mistake it prevents

With one overall average (76 here), Ben (80) would slip in, even though he only ties his own department's average. A correlated subquery compares like with like.

## Performance

Re-running a query per row can be slow on large tables. Two alternatives:

- Compute the averages once in a CTE and join to them.
- Use a window function: `AVG(salary) OVER (PARTITION BY department)` (lesson 27).

Correlated subqueries are still worth knowing: they are the most direct way to write the idea, and `EXISTS` (next lesson) always uses them.

## Keep in mind

- Give the outer table an alias (`e`) so the inner query can refer to it unambiguously.
- To check your logic, run the inner query by hand with one department substituted in.
