So far, every part of a pattern has matched exactly one character. **Quantifiers** say how many times a part may repeat. With them, one short pattern can match a number of any length, an optional sign, or exactly three letters.

You will learn:

- `*`, `+` and `?`
- exact and ranged repetition with `{m}`, `{m,n}` and friends
- quantifying a group
- the surprising empty match
- why `\d{3}` is not the same as `\d\d\d`, and when it is

## The three basic quantifiers

| Quantifier | Meaning |
| ---------- | ------- |
| `*` | zero or more |
| `+` | one or more |
| `?` | zero or one (optional) |

A quantifier applies to the **single item before it**, which may be a character, a class, or a group:

```python
import re

print(re.findall(r"ab*c", "ac abc abbbc adc"))
print(re.findall(r"ab+c", "ac abc abbbc adc"))
print(re.findall(r"ab?c", "ac abc abbbc adc"))
```

In each line, the `b` may repeat or not, and the `a` and `c` on both sides stay.

## Optional parts

`?` is perfect for an optional sign, an optional letter, or a spelling that differs between countries:

```python
print(re.findall(r"colou?r", "color colour colouur"))
print(re.findall(r"[+-]?\d+", "3 -4 +5 6-7"))
```

In the second pattern, `[+-]?` is an optional sign, followed by one or more digits. Notice that in `6-7` the pattern found `6` and `-7`, because `-7` looks like a signed number. Regex does exactly what the pattern says, even when that is not what you meant.

## Exact and ranged repetition

Curly braces let you say precisely how many:

| Quantifier | Meaning |
| ---------- | ------- |
| `{3}` | exactly 3 |
| `{2,4}` | between 2 and 4 |
| `{2,}` | 2 or more |
| `{,3}` | up to 3 (0 to 3) |

```python
print(re.findall(r"\d{3}", "12 123 1234"))
print(re.findall(r"\d{2,4}", "1 12 123 12345"))
print(re.findall(r"[A-Z]{3}\d{3}", "ABC123 AB12 XYZ9999"))
```

The first line surprises many people: `1234` yields `123`, because the pattern found three digits and stopped. To ask for "a number that is exactly 3 digits long", you need to say what surrounds it. You learn how in the lesson on anchors and boundaries.

## Quantifying a group

Parentheses make a **group**, and a quantifier can apply to the whole group:

```python
print(re.findall(r"(?:ab)+", "ab abab aab"))
print(re.fullmatch(r"(\d{1,3}\.){3}\d{1,3}", "192.168.0.1") is not None)
```

The first pattern uses `(?:...)`, a group that does not capture. You meet it properly later. The second shape, `(\d{1,3}\.){3}\d{1,3}`, is "one to three digits and a dot, three times, then one to three digits", the outline of an IP address.

## The empty match

A pattern that can match **nothing** does so everywhere:

```python
print(re.findall(r"a*", "baaac"))
print(re.sub(r"x*", "-", "abc"))
```

`a*` means "zero or more a", so it matches the empty string at the start, then `aaa`, then empty again at each remaining position. That is why the list has empty strings in it. To avoid it, use `+` when you need at least one.

## Fixed length versus repeated

`\d{3}` and `\d\d\d` are identical in what they match. The quantifier form is shorter, and it makes the intent clear. It also scales: `\d{7,15}` for a phone number is far easier to read than fifteen copies of `\d`.

```python
print(re.fullmatch(r"\d{7,15}", "5551234") is not None)
print(re.fullmatch(r"\d{7,15}", "555") is not None)
print(re.fullmatch(r"\d+\.\d+\.\d+", "1.2.3") is not None)
```

## Quantifiers and classes together

The real power comes from combining the parts:

```python
print(re.findall(r"[A-Za-z]+", "one, two; three!"))
print(re.findall(r"\w+@\w+\.com", "ann@site.com, bob@x.org, cy@web.com"))
print(re.findall(r"#[0-9a-fA-F]{6}\b", "colours #ff8800 and #12 and #00FF00"))
```

The last pattern finds six-digit colour codes like `#ff8800`. The `\b` at the end means "a word boundary". Ignore it for now, because the boundaries lesson explains it.

## Common mistakes

- Forgetting that a quantifier applies only to the **one item** before it. `ab+` repeats only `b`. Use `(?:ab)+` to repeat both.
- Using `*` when you need `+`, and getting empty matches.
- Expecting `\d{3}` to match only whole three-digit numbers.
- Writing a space after the comma in `{2, 4}`. That is not a quantifier, and it matches literal text.

## Recap

- `*` zero or more, `+` one or more, `?` optional.
- `{m}`, `{m,n}` and `{m,}` set exact and ranged counts.
- A quantifier applies to the item before it: a character, a class or a group.
- Patterns that allow zero repeats can match the empty string.

## Your turn

In the **Practice** tab you write `is_code(s)`, which recognises codes such as `ABC123`. Then three challenges use the Chinook store.
