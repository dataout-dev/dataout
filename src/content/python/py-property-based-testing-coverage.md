Every test you have written so far picks specific example inputs by hand. Property-based testing flips that: you describe a **property** that should hold for *any* valid input, and a tool generates hundreds of inputs trying to break it. Coverage tools measure something different but related — not whether your tests are good, but which lines they actually touched.

This is a reading lesson: Hypothesis, coverage.py and mutation-testing tools need a real filesystem and process environment this browser-based playground does not have. The examples below describe what running them looks like; the ideas apply directly once you use these tools in a normal Python environment.

You will learn:

- the idea of a property, and generated inputs
- Hypothesis at a glance
- shrinking: turning a scary failure into a minimal one
- what `coverage.py` measures, and what it does not
- mutation testing, briefly

## Properties instead of examples

Instead of `assert sorted([3, 1, 2]) == [1, 2, 3]` (one example), a property-based test states an invariant that should hold for *every* list:

```text
from hypothesis import given
from hypothesis import strategies as st

@given(st.lists(st.integers()))
def test_sorting_is_idempotent(xs):
    assert sorted(sorted(xs)) == sorted(xs)

@given(st.lists(st.integers()))
def test_sorting_preserves_length(xs):
    assert len(sorted(xs)) == len(xs)
```

Hypothesis generates hundreds of random lists — empty, huge, full of duplicates, negative numbers — searching for one that breaks the property. A hand-written example test would need to think of each of those cases explicitly; a property test states the rule once and lets the search do the rest.

## Shrinking

When Hypothesis finds a failing input, it does not just report the first one it found — often a large, messy list. It **shrinks** it: repeatedly trying smaller variations that still fail, until it reaches something like `[0, -1]` instead of a 200-element list of random integers. A minimal failing example is far easier to read and debug than the sprawling one that was first discovered.

## What coverage.py measures

```text
coverage run -m pytest
coverage report
```

This runs your test suite while recording which lines actually executed, then reports a percentage per file. A line coverage.py never sees executed is a line **no test touches at all** — a real gap. But a line that *did* execute is not the same as a line that was *checked*: a test that calls a function and asserts nothing about its result still counts as "covering" every line inside it.

## What coverage does not tell you

100% coverage is a floor, not a ceiling. It says nothing about untested **combinations** of branches (an `if`/`elif` chain can each individually execute across different tests, while the specific combination that triggers a real bug is never tried together), and nothing about whether the assertions that did run were actually meaningful.

## Mutation testing, briefly

```text
mutmut run
```

A mutation-testing tool automatically introduces small, deliberate bugs into your code — a mutant — such as flipping `>` to `>=`, or `and` to `or`, then reruns your test suite against each mutant. If the suite still passes with the bug in place, that mutant **survived**, revealing a real gap coverage alone would have missed: the line ran, but nothing actually depended on it being correct.

## Watch out: these tools are not free

Property-based tests can be slower than example-based ones (hundreds of generated inputs per test), and mutation testing reruns your whole suite once per mutant, which can take a long time on a large codebase. Both are usually reserved for the code that most needs the extra scrutiny — a core algorithm, a security-sensitive function — rather than applied uniformly everywhere.

## Common mistakes

- Treating coverage percentage as a proxy for code quality rather than what it actually measures: which lines executed.
- Writing a property so loose it is trivially true for almost any output, defeating the point of generating varied inputs.
- Never running a coverage or mutation tool in CI, so gaps are only discovered by accident, long after the code shipped.
- Assuming property-based tests replace example-based ones — they complement each other; a concrete example is often still the clearest documentation of intended behaviour.
