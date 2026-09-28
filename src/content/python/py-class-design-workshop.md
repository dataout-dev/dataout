This lesson closes the "Classes and objects" section with a workshop: designing a class from a real-world description, deciding what state it needs, what operations should be allowed, and what should be forbidden. You will build a small `BankAccount`, but the method — understand, list responsibilities, protect invariants, test — applies to every class you will ever design.

You will learn:

- turning a description into attributes and methods
- an **invariant**: something that must always stay true
- guarding a class against invalid operations
- keeping a history alongside state
- a first taste of "god classes", and why to avoid them

## From description to design

"A bank account has a balance. You can deposit money and withdraw money, but never take it below zero. Every account remembers its history of transactions."

Reading this closely gives us:

- **State**: a `balance`, and a `history` of what happened.
- **Behaviour**: `deposit(amount)`, `withdraw(amount)`.
- **Invariant**: `balance` must never go negative.

## A first version

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount):
        self.balance += amount
        self.history.append(("deposit", amount))

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        self.history.append(("withdraw", amount))

acc = BankAccount("Ada", 100)
acc.deposit(50)
acc.withdraw(30)
print(acc.balance, acc.history)
```

## Protecting the invariant fully

A careful reader will notice more ways to break the "never negative" rule than just a too-large withdrawal: a negative deposit, or a negative withdrawal amount, both dodge the current check.

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        if balance < 0:
            raise ValueError("opening balance cannot be negative")
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self.balance += amount
        self.history.append(("deposit", amount))

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("withdrawal must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        self.history.append(("withdraw", amount))

acc = BankAccount("Ada", 100)
```

<!-- expect-error -->
```python
acc = BankAccount("Ada", 100)
acc.withdraw(-50)
```

An **invariant** is a promise the class makes about itself, that must hold **before and after every single method call**. Every place that could break the promise needs a guard, not just the obvious one.

## Reading the history back out

A class that keeps a history should let its history be inspected without exposing the raw list to be edited from outside:

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self._history = []

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self.balance += amount
        self._history.append(("deposit", amount))

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("withdrawal must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        self._history.append(("withdraw", amount))

    @property
    def history(self):
        return list(self._history)

acc = BankAccount("Ada", 0)
acc.deposit(200)
acc.withdraw(80)
h = acc.history
h.append(("hack", 999))
print(acc.history)
```

`history` returns a **copy** of the internal list, so appending to what the caller received does not corrupt the account's own record — the same aliasing idea from Foundations, now applied to protecting an object's internals.

## Writing tests as you design

Deciding the test cases up front — as in the testing lesson, back in Foundations — clarifies the design *before* you write it:

```python
acc = BankAccount("Grace", 0)
assert acc.balance == 0
acc.deposit(100)
assert acc.balance == 100
acc.withdraw(40)
assert acc.balance == 60
try:
    acc.withdraw(1000)
    assert False, "should have raised"
except ValueError:
    pass
print("all good")
```

## God classes: a warning

It is tempting to keep adding methods to a class that is already working: `send_statement_email`, `calculate_interest`, `export_to_csv`, `apply_fraud_rules`... Left unchecked, a class accumulates unrelated responsibilities and becomes a **god class**: hard to test, hard to change, and hard to understand, because it does not represent one clear idea any more. A `BankAccount` should manage *its own balance and history*. Sending an e-mail, calculating interest across a whole bank, and fraud detection are **separate responsibilities**, better placed in their own classes or functions that use a `BankAccount`, not inside it. The design principles section, later in this tier, gives this idea a name: the single responsibility principle.

## A design checklist

Before you call a class finished, ask:

1. What **state** does it truly need, and does every attribute belong here rather than somewhere else?
2. What **invariants** must always hold, and is every method that could break one guarded?
3. Does every **public method** name a clear action or question?
4. Could this class be **split** into two smaller, more focused ones?
5. Have you written a few tests that would catch an obvious mistake?

## Common mistakes

- Guarding only the "obvious" way to break an invariant, and missing the others.
- Exposing a mutable internal list directly, so callers can corrupt it from outside.
- Letting a class grow responsibilities that have nothing to do with its core idea.
- Skipping tests because "the class is simple", right up until it is not.

## Recap

- Turn a description into state, behaviour and invariants before writing code.
- Guard every path that could break an invariant, not just the first one you notice.
- Return copies of mutable internal state, or use a read-only property.
- Watch for god classes: a class should do one clear thing well.

## Your turn

In the **Practice** tab you implement `BankAccount` with `deposit`, `withdraw` (no overdraft) and a `history`. It is tested against hidden cases.
