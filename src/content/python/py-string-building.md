Programs often *produce* text: reports, messages, files, web pages. There are several ways to build a string, and they differ in speed, safety and readability. This lesson shows the options, and how to choose between them.

You will learn:

- why `join` beats `+=` for long results
- how to build text in memory like a file with `io.StringIO`
- `string.Template` and `format_map` for templates
- how to leave unknown placeholders untouched
- why text must be escaped before it goes into HTML

## Strings are immutable

Every time you write `text += "x"`, Python creates a **new** string and copies the old one into it. For a few pieces that is fine. For thousands of pieces, the copying adds up.

```python
pieces = []
for i in range(5):
    pieces.append(f"line {i}")
report = "\n".join(pieces)
print(report)
```

The pattern is: collect the pieces in a **list**, then `join` **once** at the end. It is also easier to test and to change.

## A quick timing

You can measure the difference yourself with `time.perf_counter`. Keep the numbers small in the playground:

```python
import time

def with_plus(n):
    text = ""
    for i in range(n):
        text += str(i)
    return text

def with_join(n):
    return "".join(str(i) for i in range(n))

start = time.perf_counter()
with_plus(20000)
first = time.perf_counter() - start
start = time.perf_counter()
with_join(20000)
second = time.perf_counter() - start
print("same result:", with_plus(50) == with_join(50))
print("timed both:", first >= 0 and second >= 0)
```

CPython sometimes optimises `+=` in simple cases, so do not rely on it. `join` is the reliable, readable choice.

## io.StringIO: text that behaves like a file

`StringIO` is a text buffer in memory. You can `write` to it, and `getvalue()` returns everything written. Because it has the same methods as a file, it is very useful for testing code that writes to files:

```python
import io

buffer = io.StringIO()
buffer.write("Report\n")
print("-" * 6, file=buffer)
print("done", file=buffer)
print(buffer.getvalue())
```

A function that accepts any file-like object works with real files, with `sys.stdout`, and with a `StringIO` in a test.

## string.Template

`string.Template` uses `$name` placeholders. It is simple and, unlike f-strings, the template can come from a file or from a user, because it cannot run code:

```python
from string import Template

greeting = Template("Hello, $name! You have $count messages.")
print(greeting.substitute(name="Ada", count=3))
```

`substitute` raises a `KeyError` if a value is missing. `safe_substitute` leaves the unknown placeholder alone:

```python
partial = greeting.safe_substitute(name="Ada")
print(partial)
```

Use `$$` for a literal dollar sign and `${name}` when letters follow the name:

```python
price = Template("Cost: $$${amount}USD")
print(price.substitute(amount=15))
```

## str.format_map

`format_map` fills `{name}` placeholders from a dictionary. Combined with a small helper class, it can leave the unknown ones untouched:

```python
class Keep(dict):
    def __missing__(self, key):
        return "{" + key + "}"

text = "Dear {name}, your code is {code}."
print(text.format_map(Keep(name="Ada")))
```

The `__missing__` method is called when a key is not found. Returning the placeholder itself gives us "fill what you can".

## Escaping for output

Text that will be shown in another language (HTML, SQL, a shell) must be **escaped**, or special characters change its meaning. For HTML, the standard library has `html.escape`:

```python
import html

user_text = '<script>alert("hi")</script> & more'
print(html.escape(user_text))
print(html.unescape("&lt;b&gt;bold&lt;/b&gt;"))
```

The rule: never build HTML, SQL or shell commands by pasting untrusted text into a string. Use the escaping function, or better, a parameterised API. You will see this for SQL in the `sqlite3` lesson.

## Building tables of data

Combining these ideas gives a tidy pattern for reports: a function returns a list of lines, and the caller decides where to send them.

```python
def build_report(items):
    lines = ["Item report", "=" * 11]
    for name, qty in items:
        lines.append(f"{name:<8}{qty:>4}")
    lines.append(f"{'total':<8}{sum(q for _, q in items):>4}")
    return "\n".join(lines)

print(build_report([("pens", 12), ("paper", 5)]))
```

## Common mistakes

- Using `+=` inside a big loop instead of collecting and joining.
- Forgetting that `join` needs strings, so numbers must be converted first.
- Using `substitute` with a user-supplied dictionary that may be missing keys.
- Inserting untrusted text into HTML without escaping it.

## Recap

- Collect pieces in a list and `join` once.
- `StringIO` is an in-memory file, and it is great for tests.
- `Template.safe_substitute` and `format_map` with `__missing__` leave unknown placeholders in place.
- Escape text before you place it inside another language.

## Your turn

In the **Practice** tab you write `fill(template, values)`, which fills a template and leaves unknown placeholders untouched. Then three challenges use the Chinook store.
