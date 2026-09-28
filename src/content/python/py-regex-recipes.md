Now that you know the tools, this lesson gives you a set of **recipes** for text that many programs must handle: e-mail addresses, phone numbers, dates, URLs, IP addresses and log lines. For each one you will see a pragmatic pattern, and, just as importantly, the limits of that pattern.

You will learn:

- why a "perfect" e-mail regex does not exist
- practical patterns for phone numbers, dates, URLs and IPv4 addresses
- how to parse a web-server log line
- when a library does the job better

## E-mail addresses

The official rules for e-mail addresses are very complicated, and no pattern can check them all. What you can do is check the **rough shape**: something, an `@`, a domain with at least one dot.

```python
import re

email = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")
tests = ["ada@example.org", "first.last+tag@mail.example.co.uk", "no-at-sign.com", "a@b", "@x.com"]
for text in tests:
    print(f"{text:36}", bool(email.fullmatch(text)))
```

This accepts almost every real address and rejects obvious garbage. It will also accept a few invalid ones. The only real test of an address is to **send it an e-mail**.

## Phone numbers

Phone formats vary by country, so decide first what you accept. This pattern accepts an optional country code, and groups separated by spaces, dots or dashes:

```python
phone = re.compile(r"(?:\+\d{1,3}[ .-]?)?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}")
for text in ["+1 555 123 4567", "(555) 123-4567", "555.123.4567", "12345"]:
    print(f"{text:18}", bool(phone.fullmatch(text)))
```

To **normalise** a number, remove everything that is not a digit:

```python
print(re.sub(r"\D", "", "+1 (555) 123-4567"))
```

## Dates

For dates with a fixed layout, a pattern can extract the parts, but it **does not know the calendar**. It accepts `2024-13-45`:

```python
date = re.compile(r"(?P<y>\d{4})-(?P<m>0[1-9]|1[0-2])-(?P<d>0[1-9]|[12]\d|3[01])")
for text in ["2024-03-15", "2024-13-15", "2024-02-31"]:
    print(text, bool(date.fullmatch(text)))
```

The pattern rejects month 13, but it still accepts February 31. To check a real date, let `datetime` do it after the pattern has extracted the parts:

```python
from datetime import date as Date

def valid(text):
    m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", text)
    if not m:
        return False
    try:
        Date(*map(int, m.groups()))
    except ValueError:
        return False
    return True

print(valid("2024-02-29"), valid("2023-02-29"), valid("hello"))
```

This is the general rule: **use a pattern to find and split, and a library to validate.**

## URLs

A simple URL pattern captures the scheme, host, optional port and path:

```python
url = re.compile(r"(?P<scheme>https?)://(?P<host>[\w.-]+)(?::(?P<port>\d+))?(?P<path>/[^\s?#]*)?(?:\?(?P<query>[^\s#]*))?")
m = url.fullmatch("https://example.com:8080/a/b?x=1&y=2")
print(m.groupdict())
```

For real work, the standard library's `urllib.parse.urlparse` handles all the edge cases, and is the better choice.

## IPv4 addresses

Four numbers from 0 to 255, separated by dots. A pattern that only checks digits accepts `999.1.1.1`. To restrict each part to 0-255, spell out the allowed values:

```python
octet = r"(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)"
ipv4 = re.compile(rf"{octet}(?:\.{octet}){{3}}")
for text in ["192.168.0.1", "255.255.255.255", "256.1.1.1", "1.2.3", "01.2.3.4"]:
    print(f"{text:16}", bool(ipv4.fullmatch(text)))
```

We build the pattern from a named piece, `octet`, so it stays readable. Note the doubled braces `{{3}}` inside the f-string. The standard `ipaddress` module is again the more robust choice.

## Log lines

Server logs have a fixed layout. Here is a line in the common "Apache" style, and a pattern that names each field:

```python
log = re.compile(
    r'(?P<ip>\S+) \S+ \S+ \[(?P<time>[^\]]+)\] "(?P<method>[A-Z]+) (?P<path>\S+) [^"]*" (?P<status>\d{3}) (?P<size>\d+|-)'
)
line = '203.0.113.9 - - [10/Oct/2024:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 2326'
m = log.match(line)
print(m.groupdict())
```

Every field uses a **specific** class such as `\S+` (not white space) or `[^\]]+` (not a closing bracket), instead of a greedy `.*`. This is faster, and it is exact. Counting the status codes of a whole file then takes a few lines:

```python
from collections import Counter

lines = [
    '1.1.1.1 - - [10/Oct/2024:13:55:36 +0000] "GET / HTTP/1.1" 200 10',
    '1.1.1.2 - - [10/Oct/2024:13:55:37 +0000] "GET /x HTTP/1.1" 404 5',
    '1.1.1.1 - - [10/Oct/2024:13:55:38 +0000] "POST /y HTTP/1.1" 200 7',
]
print(Counter(log.match(l)["status"] for l in lines))
```

## When not to use a pattern

- **E-mail, URL, IP, date validity**: a library knows the rules. Use the pattern to *find* candidates, and the library to *validate*.
- **Nested formats** (HTML, JSON, XML): use a parser.
- **Names and addresses**: too varied. Be very careful about rejecting real people's names.

## Common mistakes

- Trying to write the one true e-mail regex.
- Checking dates with a pattern alone, and accepting February 31.
- Using `.*` in a log pattern, which is slow and picks up the wrong fields.
- Rejecting valid input because the pattern is too strict.

## Recap

- Patterns check the **shape**. Libraries check **validity**.
- Build large patterns from small named pieces, and test them on good and bad examples.
- Use specific classes like `\S+` and `[^"]*` rather than `.*`.
- The regexes here are a starting point. Adapt them to the data you actually have.

## Your turn

In the **Practice** tab you write `parse_log(line)`, which parses a log line into a dictionary. Then three challenges use the Chinook store.
