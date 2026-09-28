Not every relationship between classes should be inheritance. This closing lesson of the section makes the case for **composition** — building a class out of other objects it **holds**, rather than classes it **extends** — and shows **delegation**, the technique that makes composition just as convenient to use.

You will learn:

- has-a versus is-a, revisited with a concrete refactor
- delegating to a contained object
- `__getattr__` for automatic delegation
- the strategy idea, achieved through composition
- why "inheriting just to reuse code" causes trouble later

## The problem: inheriting for reuse alone

Suppose a `Report` needs to format its output in different ways. A tempting first design makes each format a **subclass**:

```python
class Report:
    def __init__(self, rows):
        self.rows = rows

    def render(self):
        return "\n".join(",".join(row) for row in self.rows)

class JsonReport(Report):
    def render(self):
        import json
        return json.dumps(self.rows)

r1 = Report([["a", "1"]])
r2 = JsonReport([["a", "1"]])
print(r1.render())
print(r2.render())
```

This works for two formats. But what happens when you also need reports that are sometimes CSV **and** sometimes JSON, chosen at **runtime**, or a third format, or a report that can switch formats after being created? Subclassing bakes the choice in at class-definition time, and multiplies classes for every combination you might need later.

## Composition: has-a instead of is-a

A `Report` **has a** formatter — it is not itself "a kind of" any particular format:

```python
class CsvFormatter:
    def format(self, rows):
        return "\n".join(",".join(row) for row in rows)

class JsonFormatter:
    def format(self, rows):
        import json
        return json.dumps(rows)

class Report:
    def __init__(self, rows, formatter):
        self.rows = rows
        self.formatter = formatter

    def render(self):
        return self.formatter.format(self.rows)

report = Report([["a", "1"], ["b", "2"]], CsvFormatter())
print(report.render())
report.formatter = JsonFormatter()
print(report.render())
```

The **same** `Report` instance switched formats by swapping out one attribute. No new `Report` subclass was needed for each format, and none ever will be — this is the **strategy** idea: behaviour that varies is pulled out into its own small object, and the main class simply holds a reference to whichever one it currently needs.

## Delegation

**Delegation** means a method on your class simply forwards the call to a contained object. You already did this above (`self.formatter.format(...)`), but you can make it read even more like the composed object's own interface:

```python
class Wallet:
    def __init__(self):
        self._items = []

    def add(self, item):
        self._items.append(item)

    def __len__(self):
        return len(self._items)

class Person:
    def __init__(self, name):
        self.name = name
        self.wallet = Wallet()

    def add_item(self, item):
        self.wallet.add(item)

    def item_count(self):
        return len(self.wallet)

ada = Person("Ada")
ada.add_item("keys")
ada.add_item("phone")
print(ada.item_count())
```

`Person.add_item` and `item_count` **delegate** to `self.wallet`. Callers of `Person` never need to know a `Wallet` exists inside it at all.

## Automatic delegation with __getattr__

When a class should forward **most** or **all** unknown attribute access to a contained object, writing one wrapper method per method gets repetitive. `__getattr__` is called automatically whenever normal lookup fails to find a name, and can forward it on your behalf:

```python
class LoggingList:
    def __init__(self):
        self._data = []

    def __getattr__(self, name):
        print(f"delegating {name!r}")
        return getattr(self._data, name)

    def __len__(self):
        return len(self._data)

ll = LoggingList()
ll.append(1)
ll.append(2)
print(len(ll), ll)
```

`append` is not defined on `LoggingList` at all. `__getattr__` catches the failed lookup, logs it, and hands the real work to the wrapped list's own `append`. Note that `__getattr__` only fires for names that are **not** found normally — that is why `__len__`, defined directly on `LoggingList`, works without ever reaching `__getattr__`.

## Refactoring a deep hierarchy into parts

If you inherited a class hierarchy like `PremiumJsonExportingLoggingReport(Report)`, chances are several unrelated concerns were bundled by inheritance where composition would separate them cleanly: a `formatter`, a `logger`, a `pricing` policy — each its own small object, held and delegated to, combined however a particular `Report` instance needs, without a combinatorial explosion of subclasses.

## When to still use inheritance

None of this means inheritance is wrong — the earlier lessons in this section showed it doing real work for genuine is-a relationships (`Dog` is an `Animal`) and for enforced interfaces (`ABC`). The rule of thumb: **inherit to be substitutable for the parent; compose to reuse behaviour that is not, itself, a kind of your class.**

## Common mistakes

- Subclassing purely to reuse a method, when the subclass is not truly a kind of the parent.
- Multiplying subclasses for every combination of independent behaviours, instead of composing small, focused objects.
- Overusing `__getattr__` to hide a design that has grown too tangled to describe simply.
- Forgetting that `__getattr__` only fires when normal lookup fails, which can make debugging confusing if used carelessly.

## Recap

- Composition ("has-a") holds another object and delegates to it, rather than inheriting from it.
- The strategy idea swaps out a held object at runtime, avoiding a subclass per combination.
- `__getattr__` can forward unknown attribute access to a contained object automatically.
- Inherit for genuine is-a, substitutable relationships; compose for everything else.

## Your turn

In the **Practice** tab you refactor a `Report` to hold a `Formatter` instead of subclassing per format. Then three challenges use real data.
