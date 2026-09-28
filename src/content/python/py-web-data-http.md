Most real-world data eventually comes from an API somewhere: a request goes out over HTTP, a response comes back, usually as JSON. This lesson covers the concepts; the next lesson works with the responses directly.

You will learn:

- requests, responses and status codes
- query strings, headers and authentication
- pagination and rate limits
- JSON responses versus scraping a page

## Requests and responses

An HTTP request names a method (`GET` to fetch, `POST` to create or submit, and others), a URL, and optionally headers and a body. The response carries a status code, headers, and a body — often JSON for an API, HTML for a normal web page.

## Status codes

- **2xx** (success): `200 OK`, `201 Created`.
- **3xx** (redirect): the resource has moved; follow the new location.
- **4xx** (client error): `400 Bad Request`, `401 Unauthorized`, `404 Not Found` — something about *this* request was wrong.
- **5xx** (server error): the server failed to handle an apparently-valid request.

Checking the status code (rather than assuming success) is the first thing any real client code should do with a response.

## Query strings versus headers

A query string (`?page=2&per_page=50`) is part of the URL itself, commonly used for filtering, sorting, or pagination — visible in logs and browser history. A header carries metadata about the request separately from the URL: an API key or auth token (`Authorization: Bearer ...`), the expected response format (`Accept: application/json`), or caching hints — generally the right place for anything that should not end up visible in a URL, including anything even mildly sensitive.

## Pagination

A real API rarely returns everything in one response. A common pattern: each response includes the current page of results plus a link (or a token) for the next page; the client loops, following that link until there is no "next" left. `page`/`per_page` query parameters, or an opaque `cursor` token, are the two most common styles.

## Rate limits

Most APIs cap how many requests a client can make in a given window (say, 100 per minute), usually reported in response headers (`X-RateLimit-Remaining`, or similar). Exceeding the limit typically returns a `429 Too Many Requests` status; well-behaved client code checks for this and waits before retrying, rather than hammering the API immediately again.

## JSON responses

A typical JSON API response might look like:

```json
{
  "results": [
    {"id": 1, "name": "Ada"},
    {"id": 2, "name": "Grace"}
  ],
  "next_page": 2
}
```

Python's standard library `json` module (`json.loads(text)`) parses this straight into nested dicts and lists — the same shape this playground's own built-in datasets arrive in, just from a different source.

## Recorded responses in this playground

Because this playground runs entirely in the browser, live cross-origin HTTP requests are restricted by the browser's own security model (CORS) — a page cannot simply fetch data from an arbitrary third-party server on your behalf. Rather than depend on which specific APIs happen to allow that from here, later exercises that touch "web data" work from realistic, already-recorded response text, so the actual parsing and handling code is exactly what you would write against a live API.

## Watch out: no timeouts, no error handling

A request with no timeout can hang indefinitely if a server never responds; code that assumes every request succeeds will crash (or silently misbehave) the first time a real network hiccups, a server briefly returns a 500, or a bad status code arrives. Real client code checks the status code explicitly, sets a timeout, and decides deliberately what to do when a request fails — none of which "just happens" automatically.

## Common mistakes

- Assuming a request always succeeds and skipping status-code checks entirely.
- Putting a sensitive value (an API key) in a query string instead of a header.
- Not handling pagination, and silently processing only the first page of results.
- Retrying immediately after a rate-limit response instead of waiting.

## Recap

- Status codes group into success (2xx), redirect (3xx), client error (4xx) and server error (5xx).
- Query strings are part of the URL; headers carry metadata (including anything sensitive) separately.
- Real APIs paginate large results and rate-limit how fast a client can ask for them.
- This playground works from recorded JSON responses, since live cross-origin requests are restricted by the browser itself.
