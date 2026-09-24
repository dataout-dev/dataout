## A table that points at itself

Sometimes a table's foreign key refers to **another row of the same table**. In an `employees` table, `manager_id` holds the `id` of the employee's manager, who is also an employee.

| id | name   | manager_id |
| -- | ------ | ---------- |
| 1  | Meera  | *NULL*     |
| 2  | Rohan  | 1          |
| 3  | Sneha  | 2          |
| 4  | Aditya | 2          |

To show each employee **next to** their manager's name, you need two rows of the table at the same time: the employee's and the manager's.

## Join it to itself

Use the same table twice, under two different aliases:

```sql
SELECT e.name AS employee,
       m.name AS manager
FROM employees e
JOIN employees m ON m.id = e.manager_id;
```

| employee | manager |
| -------- | ------- |
| Rohan    | Meera   |
| Sneha    | Rohan   |
| Aditya   | Rohan   |

Think of it as two copies of the table:

- `e` is the **employee** copy.
- `m` is the **manager** copy.
- The join links them: the manager's `id` equals the employee's `manager_id`.

## Who gets left out?

Meera has no manager (`manager_id` is `NULL`), so an inner join drops her. If you want everyone in the result, use `LEFT JOIN`, and Meera appears with a `NULL` manager.

## Other self-join uses

- Categories with parent categories.
- Customers who were referred by other customers.
- Comparing rows: "pairs of products with the same price".

## Keep in mind

- Aliases aren't optional here. Without them SQL can't tell which copy you mean.
- Get the direction right: `m.id = e.manager_id` finds an employee's manager. Swapping the sides finds their reports instead.
- For hierarchies of unknown depth (a manager's manager's manager), you'll need a recursive CTE in the Advanced tier.
