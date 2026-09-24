## More than one condition

Real questions rarely have a single condition. "Customers in Mumbai who are over 25" has two. Join conditions with `AND`, `OR` and `NOT`.

| name   | city   | age |
| ------ | ------ | --- |
| Asha   | Mumbai | 30  |
| Ben    | Mumbai | 20  |
| Chitra | Delhi  | 40  |
| Dev    | Pune   | 35  |

## AND, OR, NOT

- `A AND B`: both must be true.
- `A OR B`: at least one must be true.
- `NOT A`: flips a condition.

```sql
SELECT name
FROM customers
WHERE city = 'Mumbai' AND age > 25;   -- Asha
```

```sql
SELECT name
FROM customers
WHERE city = 'Pune' OR age > 35;      -- Chitra, Dev
```

## The classic bug: AND beats OR

`AND` is evaluated **before** `OR`, just like multiplication before addition. So this query:

```sql
WHERE city = 'Mumbai' OR city = 'Delhi' AND age > 25
```

is read as `city = 'Mumbai'` **or** (`city = 'Delhi'` and `age > 25`). Ben, aged 20, sneaks in because he lives in Mumbai.

## Fix it with parentheses

Say what you mean:

```sql
WHERE (city = 'Mumbai' OR city = 'Delhi') AND age > 25
```

Now the `OR` is settled first, and only people over 25 remain: Asha and Chitra.

## Keep in mind

- When you mix `AND` and `OR`, **always** add parentheses. It costs nothing and removes doubt.
- `NOT city = 'Pune'` works, but `city <> 'Pune'` is easier to read.
