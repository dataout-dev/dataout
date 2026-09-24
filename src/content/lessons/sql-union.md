## Stacking, not joining

A join puts tables **side by side**. `UNION` puts the results of two queries **on top of each other**, giving you one longer list.

**students**

| name  | city   |
| ----- | ------ |
| Asha  | Pune   |
| Ravi  | Pune   |
| Meera | Delhi  |

**teachers**

| name   | city |
| ------ | ---- |
| Ravi   | Pune |
| Sunita | Pune |

## UNION

```sql
SELECT name FROM students WHERE city = 'Pune'
UNION
SELECT name FROM teachers WHERE city = 'Pune'
ORDER BY name;
```

| name   |
| ------ |
| Asha   |
| Ravi   |
| Sunita |

Ravi is in both tables but appears **once**. `UNION` removes duplicate rows.

## UNION ALL

`UNION ALL` keeps every row, duplicates included:

```sql
... UNION ALL ...   -- Asha, Ravi, Ravi, Sunita
```

It is faster because the database doesn't have to look for duplicates. **Use `UNION ALL` unless you specifically need de-duplication.**

## The rules

1. Both queries must return the **same number of columns**.
2. Columns are matched **by position**, not by name, and should hold compatible types.
3. The **column names come from the first query**.
4. A single `ORDER BY` goes at the very end and sorts the whole result.

## Adding a label

To remember where each row came from, add a constant column:

```sql
SELECT name, 'student' AS role FROM students
UNION ALL
SELECT name, 'teacher' FROM teachers;
```

## Keep in mind

- If two rows differ in **any** column (even a label), `UNION` treats them as different and keeps both.
- `INTERSECT` (rows in both) and `EXCEPT` (rows in the first only) work the same way. You'll meet them in the Advanced tier.
