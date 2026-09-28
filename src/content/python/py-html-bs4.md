Web pages are trees of nested tags. BeautifulSoup parses that tree and gives you a comfortable way to search it — by tag name, by attribute, or with a CSS selector — without hand-writing regular expressions over raw markup.

You will learn:

- the DOM tree, informally
- `find_all` and CSS selectors with `.select`
- extracting text and attributes
- tables straight into a DataFrame with `read_html`

## Parsing HTML

```python
from bs4 import BeautifulSoup

html = "<div><h1>Title</h1><p>Some text</p></div>"
soup = BeautifulSoup(html, "html.parser")
print(soup.h1.get_text())
print(soup.find("p").get_text())
```

`BeautifulSoup(html, "html.parser")` parses the string into a navigable tree; individual tags can be reached directly (`soup.h1`) or searched for (`soup.find(...)`).

## find_all

```python
from bs4 import BeautifulSoup

html = "<ul><li>Apples</li><li>Pears</li><li>Plums</li></ul>"
soup = BeautifulSoup(html, "html.parser")
items = soup.find_all("li")
print([item.get_text() for item in items])
```

`find_all` returns every matching tag, in document order; `find` returns just the first one.

## Extracting attributes

```python
from bs4 import BeautifulSoup

html = '<a href="https://example.com" class="link">Example</a>'
soup = BeautifulSoup(html, "html.parser")
a = soup.find("a")
print(a.get_text())
print(a.get("href"))
print(a.get("class"))
```

`.get("attribute")` reads an attribute's value, returning `None` if it is missing — safer than assuming every tag has every attribute.

## CSS selectors with .select

```python
from bs4 import BeautifulSoup

html = '<div><span class="price">£10</span><span class="note">on sale</span></div>'
soup = BeautifulSoup(html, "html.parser")
print(soup.select(".price"))
print(soup.select("div span"))
```

`.select(css_selector)` works exactly like a stylesheet selector — `.price` for class, `#id` for id, `div span` for nesting — often more concise than an equivalent `find_all` call with matching keyword arguments.

## Tables into DataFrames

```python
import pandas as pd
import io

html = "<table><tr><th>name</th><th>score</th></tr><tr><td>Ada</td><td>95</td></tr></table>"
tables = pd.read_html(io.StringIO(html))
print(tables[0])
```

`pd.read_html` finds every `<table>` on a page and parses each into its own DataFrame — a fast path straight from a web page's table to tabular data, skipping BeautifulSoup entirely for this one specific job.

## robots.txt and scraping etiquette

A site's `robots.txt` file states which parts, if any, it asks automated tools not to access; respecting it (and a site's terms of use more generally) is the baseline expectation for scraping anything you do not already have explicit permission to collect. Rate-limiting requests (never hammering a site as fast as possible) and identifying your scraper honestly are the other basics of not being a nuisance.

## Watch out: brittle selectors

```python
from bs4 import BeautifulSoup

html = '<div class="content-v2"><span>Price</span></div>'
soup = BeautifulSoup(html, "html.parser")
print(soup.select(".content-v2 span"))
```

A selector tied to a specific, auto-generated-looking class name (`content-v2`) will silently stop matching the moment a site's markup changes even slightly — scraping code tends to need occasional maintenance for exactly this reason, and a selector based on more stable structure (a tag, a role, a data attribute meant to be stable) tends to survive redesigns better.

## Common mistakes

- Assuming every tag has every attribute, and calling `[...]` instead of `.get(...)` where a missing attribute should be handled gracefully.
- Writing a selector tied to markup details likely to change on the next redesign.
- Scraping a site without checking `robots.txt` or its terms of use first.
- Reaching for BeautifulSoup to extract a table when `pd.read_html` already does exactly that in one call.

## Recap

- `BeautifulSoup(html, "html.parser")` parses HTML into a searchable tree.
- `find`/`find_all` search by tag and attributes; `.select` uses CSS selector syntax.
- `.get("attr")` reads an attribute safely, returning `None` if it is missing.
- `pd.read_html` extracts every table on a page directly into DataFrames.

## Your turn

In the **Practice** tab you write `links(html)`. Then three challenges use real data.
