A long history is only useful if you can narrow it down to what you're actually looking for.

You will learn:

- filtering commits by author
- combining filters with what you already know about ranges

## Filtering by author

```text
$ git log --author=Dana
commit 8c1d4e0
Author: Dana Lee <dana@dataout.dev>
...

commit 3b9f221
Author: Dana Lee <dana@dataout.dev>
...
```

`--author` matches against the author name (a substring match, not an exact one — `Dana` matches `Dana Lee`), and shows only commits where it matches. This is the fastest way to answer "what has this person actually worked on" without scrolling through everyone else's commits.

## Combining with ranges

Earlier in this tier you used `git log main..origin/main` to see what a specific branch had that another didn't. The same range syntax works alongside other filters — `git log --author=Dana main..origin/main` would show only Dana's commits within that specific range, for example.

## Other common filters, for context

Real git supports quite a few more: `--since`/`--until` for date ranges, `-S<string>` ("pickaxe," find commits whose diff introduces or removes a line containing that string), `--grep=<pattern>` for commit message search. `--author` and range filters are the two you'll reach for most often day to day, which is why they're the two covered hands-on in this path.

## Common mistakes

- Assuming `--author` needs an exact full name match — it's a substring search here, not an exact one.
- Forgetting filters can be combined — you don't have to choose between "by this person" and "in this range," you can ask for both at once.
- Scrolling through a long unfiltered log by hand when a one-line filter would answer the question directly.
