This closing lesson of the tier is a workshop that draws on everything the object-oriented tier has covered: understanding a set of requirements, designing classes with clear responsibilities, protecting invariants, choosing composition over inheritance where it fits, handling errors with a proper hierarchy, and testing behaviour rather than internals. You will build the borrowing rules of a small library system.

You will learn:

- turning a set of requirements into a small class design
- protecting an invariant across several related classes
- choosing an error hierarchy that fits the domain
- reviewing a design against SOLID and the smells from the previous lessons
- presenting a design in plain language

## The requirements

"A library lends books to members. Each book has some number of copies. A member may borrow a copy of a book if one is available, and must return it before borrowing the same book again. A member may not have more than three books out at once."

Reading this closely:

- **Entities**: `Book` (with a stock of copies), `Member`, `Library` (which coordinates borrowing).
- **Invariants**: a book's available copies never goes negative; a member never has more than three books out; a member never borrows the same book twice without returning it first.
- **Operations**: `borrow(member, book)`, `return_book(member, book)`.

## A first design

```python
class Book:
    def __init__(self, title, copies):
        self.title = title
        self.copies = copies

class Member:
    def __init__(self, name):
        self.name = name
        self.borrowed = []

class LibraryError(Exception):
    pass

class NoCopiesAvailable(LibraryError):
    pass

class TooManyBooks(LibraryError):
    pass

class AlreadyBorrowed(LibraryError):
    pass

class NotBorrowed(LibraryError):
    pass

class Library:
    MAX_BOOKS = 3

    def borrow(self, member, book):
        if book in member.borrowed:
            raise AlreadyBorrowed(f"{member.name} already has {book.title}")
        if len(member.borrowed) >= self.MAX_BOOKS:
            raise TooManyBooks(f"{member.name} already has {self.MAX_BOOKS} books")
        if book.copies <= 0:
            raise NoCopiesAvailable(f"no copies of {book.title} left")
        book.copies -= 1
        member.borrowed.append(book)

    def return_book(self, member, book):
        if book not in member.borrowed:
            raise NotBorrowed(f"{member.name} has not borrowed {book.title}")
        member.borrowed.remove(book)
        book.copies += 1

library = Library()
alice = Member("Alice")
novel = Book("Dune", 1)

library.borrow(alice, novel)
print(novel.copies, alice.borrowed)
```

## Every invariant, guarded

Notice each check exists **before** the state changes, exactly as the class-design workshop from the first section of this tier taught: reject first, mutate second, so an invalid request never leaves the objects in a half-changed state.

```python
out_of_stock = Book("Rare First Edition", 0)
try:
    library.borrow(alice, out_of_stock)
except NoCopiesAvailable as error:
    print(error)
```

## An error hierarchy that fits

A single `LibraryError` base means calling code can catch **everything** the library might raise with one clause, while specific subclasses let more careful callers react precisely — exactly the pattern from the exception-hierarchies lesson, applied to a genuinely new domain:

```python
def try_borrow(library, member, book):
    try:
        library.borrow(member, book)
        return "borrowed"
    except LibraryError as error:
        return f"failed: {error}"

print(try_borrow(library, alice, novel))
```

## Reviewing against SOLID and the smells

- **Single responsibility**: `Book` tracks its own copies, `Member` tracks their own borrowed list, `Library` coordinates the rules **between** them. Nobody does everything.
- **Open/closed**: adding a new rule (say, a maximum loan period) means adding to `Library`'s checks, not rewriting `Book` or `Member`.
- **Feature envy check**: does `Library.borrow` reach too deeply into `Book` and `Member`? It touches `book.copies` and `member.borrowed` directly. A stricter design might add `book.take_copy()` and `member.add_loan(book)` methods, letting each class enforce its **own** piece of the invariant (this is a legitimate next refactoring step, using the "tell, don't ask" habit from earlier in this section).
- **Primitive obsession check**: `book.copies` is a plain integer with no protection of its own against going negative from somewhere else in a larger program — a real system might wrap it in a small class that refuses to go below zero.

## Presenting a design

When you describe a design to someone else (a teammate, a reviewer, or in a design document), a short, structured summary works far better than diving straight into code:

1. **What it does**, in one sentence: "Coordinates borrowing and returning library books, enforcing the loan rules."
2. **The classes and their one-line responsibilities.**
3. **The invariants** it protects, explicitly listed.
4. **What was deliberately left out**, and why (for example: "no support for reservations yet — out of scope for this iteration").

This is a habit worth carrying far beyond this course: a design that can be summarised in four short sections is usually one that has been thought through, not just typed out.

## Common mistakes

- Checking an invariant after changing state instead of before.
- Reaching directly into another class's data instead of asking it to do the work (a Law of Demeter and "tell, don't ask" violation, both from earlier in this section).
- One exception type for every possible problem, forcing callers to parse messages to know what went wrong — or, at the other extreme, no hierarchy at all, forcing callers to catch the generic `Exception`.
- Presenting a design as a wall of code with no summary of its responsibilities and invariants.

## Your turn

In the **Practice** tab you implement the borrowing rules of a `Library` class, tested against hidden behavioural cases.
