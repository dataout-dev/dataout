## Trees of unknown depth

In lesson 20 you joined a table to itself to find an employee's manager. But "everyone who reports to Rohan, directly **or indirectly**" could go two levels deep, or ten. You can't write a fixed number of self joins. A **recursive CTE** repeats until it runs out of rows.

| id | name   | manager_id |
| -- | ------ | ---------- |
| 1  | Meera  | *NULL*     |
| 2  | Rohan  | 1          |
| 3  | Sneha  | 2          |
| 4  | Aditya | 2          |
| 5  | Tanvi  | 3          |

## The two parts

```sql
WITH RECURSIVE team(id, name, level) AS (
  -- 1. anchor: where the walk starts
  SELECT id, name, 0
  FROM employees
  WHERE id = 2

  UNION ALL

  -- 2. recursive step: take one step down
  SELECT e.id, e.name, team.level + 1
  FROM employees e
  JOIN team ON e.manager_id = team.id
)
SELECT name, level
FROM team
WHERE level > 0
ORDER BY level, name;
```

| name   | level |
| ------ | ----- |
| Aditya | 1     |
| Sneha  | 1     |
| Tanvi  | 2     |

## How it runs

1. The **anchor** runs once and puts Rohan (level 0) into `team`.
2. The **recursive step** joins the newest rows of `team` to the table: employees whose manager is in `team`. That finds Sneha and Aditya (level 1) and adds them.
3. It runs again on those new rows and finds Tanvi (level 2).
4. When a step finds **no new rows**, the recursion stops.

The `level` column counts the steps taken, which is a handy way to see the depth.

## Where else it is used

- Product category trees ("all subcategories of Electronics").
- Comment threads and their replies.
- Generating a series of numbers or dates: `SELECT 1 UNION ALL SELECT n + 1 FROM seq WHERE n < 10`.

## Keep in mind

- Always include a way to stop. If the data contains a cycle (A manages B, B manages A), the recursion never ends. Some databases limit the depth for you.
- Use `UNION ALL`, which is faster and is the normal form. `UNION` removes duplicates on every step.
- Start with the anchor alone, check it, then add the recursive part.
