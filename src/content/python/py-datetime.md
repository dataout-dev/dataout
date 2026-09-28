Dates and times look easy, and turn out to be full of surprises: months of different lengths, leap years, time zones, daylight saving time. The standard library gives you good tools, and this lesson shows how to use them correctly.

You will learn:

- `date`, `time`, `datetime` and `timedelta`
- parsing and formatting dates
- arithmetic with dates
- naive versus aware datetimes
- time zones with `timezone` and `zoneinfo`
- the `calendar` module
- traps: daylight saving and naive datetimes in logs

## date, time and datetime

```python
from datetime import date, time, datetime

d = date(2024, 3, 15)
t = time(14, 30, 5)
dt = datetime(2024, 3, 15, 14, 30, 5)
print(d, t, dt)
print(d.year, d.month, d.day, d.weekday(), d.isoweekday())
print(dt.date(), dt.time(), dt.hour)
print(d.strftime("%A, %d %B %Y"))
```

`weekday()` gives Monday as 0 and Sunday as 6, and `isoweekday()` gives Monday as 1 and Sunday as 7.

## Today and now

```python
today = date.today()
now = datetime.now()
print(type(today).__name__, type(now).__name__)
print(today.year >= 2024)
```

## timedelta: differences and shifts

Subtracting two dates gives a `timedelta`, and you can add one to a date:

```python
from datetime import timedelta

a = date(2024, 1, 1)
b = date(2024, 3, 1)
gap = b - a
print(gap, gap.days)
print(a + timedelta(days=45))
print(a - timedelta(weeks=2))
print(timedelta(hours=36).total_seconds())
print(timedelta(minutes=90) + timedelta(seconds=30))
```

A `timedelta` counts **days, seconds and microseconds**, not months or years, because months have different lengths. To add one month, use the `calendar` module or a small helper.

## Parsing and formatting

`fromisoformat` reads the standard ISO 8601 layout (`2024-03-15`, `2024-03-15T14:30:05`). It is the format to prefer when you store dates:

```python
print(date.fromisoformat("2024-03-15"))
print(datetime.fromisoformat("2024-03-15T14:30:05"))
print(datetime(2024, 3, 15, 14, 30).isoformat())
```

For any other layout, `strptime` (parse) and `strftime` (format) use **format codes**:

```python
parsed = datetime.strptime("15/03/2024 08:05", "%d/%m/%Y %H:%M")
print(parsed)
print(parsed.strftime("%Y-%m-%d %H:%M:%S"))
print(parsed.strftime("%b %d, %y | %I:%M %p"))
```

Common codes: `%Y` four-digit year, `%m` month, `%d` day, `%H` hour (24 h), `%M` minute, `%S` second, `%B` month name, `%A` weekday name.

Bad text raises a `ValueError`:

<!-- expect-error -->
```python
datetime.strptime("2024-02-30", "%Y-%m-%d")
```

## Days between two dates

The classic question: how many days from one date to another?

```python
def days_between(first, second):
    return abs((date.fromisoformat(second) - date.fromisoformat(first)).days)

print(days_between("2024-01-01", "2024-03-01"))
print(days_between("2024-03-01", "2024-01-01"))
print(days_between("2023-03-01", "2024-03-01"))
```

2024 is a leap year, so the first answer counts February 29.

## Leap years and the calendar module

```python
import calendar

print(calendar.isleap(2024), calendar.isleap(1900), calendar.isleap(2000))
print(calendar.monthrange(2024, 2))
print(calendar.month_name[3], calendar.day_name[0])
print(calendar.weekday(2024, 3, 15))
```

`monthrange(year, month)` gives the weekday of the first day and the number of days in the month.

Adding one month needs care at the end of the month:

```python
def add_months(d, months):
    index = d.month - 1 + months
    year = d.year + index // 12
    month = index % 12 + 1
    day = min(d.day, calendar.monthrange(year, month)[1])
    return date(year, month, day)

print(add_months(date(2024, 1, 31), 1))
print(add_months(date(2024, 11, 15), 3))
```

## Naive and aware datetimes

A **naive** datetime has no time zone. It does not say *where* the time is. An **aware** datetime knows its offset from UTC. Mixing them is an error, and comparing a naive time from a log with an aware one is a classic bug:

```python
from datetime import timezone

naive = datetime(2024, 3, 15, 12, 0)
aware = datetime(2024, 3, 15, 12, 0, tzinfo=timezone.utc)
print(naive.tzinfo, aware.tzinfo)
print(aware.isoformat())
```

<!-- expect-error -->
```python
naive < aware
```

The rule: **store and calculate in UTC**, and convert to the local time zone only when you show the time to a person.

## Time zones

`timezone(timedelta(hours=...))` makes a fixed offset. For real zones with **daylight saving rules**, use `zoneinfo`:

```python
tokyo = timezone(timedelta(hours=9))
noon_utc = datetime(2024, 3, 15, 12, 0, tzinfo=timezone.utc)
print(noon_utc.astimezone(tokyo))
print(noon_utc.timestamp())
print(datetime.fromtimestamp(0, tz=timezone.utc))
```

```text
from zoneinfo import ZoneInfo

paris = datetime(2024, 7, 1, 12, 0, tzinfo=ZoneInfo("Europe/Paris"))
print(paris.utcoffset())          # 2 hours in summer
print(paris.astimezone(ZoneInfo("America/New_York")))
```

The `zoneinfo` example is shown as text, because it needs the time zone database, which is not installed everywhere (on Windows, you install the `tzdata` package; the playground here does not include it). On a normal computer it just works.

## Daylight saving surprises

Clocks jump forward and back, so some local times **do not exist**, and some happen **twice**. Adding `timedelta(hours=24)` to a local time may not give "the same time tomorrow". Do date arithmetic in UTC, or with plain dates.

## Common mistakes

- Comparing naive and aware datetimes.
- Storing local times in logs and databases, instead of UTC.
- Adding a `timedelta(days=30)` when you mean "one month".
- Parsing dates with a hand-written pattern instead of `fromisoformat` or `strptime`.
- Forgetting that `weekday()` starts at Monday = 0.

## Recap

- `date`, `time`, `datetime` and `timedelta` are the four building blocks. Subtracting dates gives a `timedelta`.
- `fromisoformat` and `isoformat` for ISO text, `strptime` and `strftime` for other layouts.
- Naive datetimes have no time zone. Work in UTC, and convert at the edges.
- `calendar` has `isleap` and `monthrange`.

## Your turn

In the **Practice** tab you write `days_between(a, b)`. Then three challenges use the Chinook store.
