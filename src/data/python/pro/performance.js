import { py, pro } from './common.js'

export const performanceAndConcurrency = {
  id: 'performance-and-concurrency',
  title: 'Performance and concurrency',
  intro: 'Measuring first, then making it fast.',
  lessons: [
    {
      id: 'py-measuring-timeit-cprofile',
      title: 'Measuring: timeit, cProfile and memory profiling',
      blurb: 'timeit correctly, cProfile and pstats, micro versus macro benchmarks.',
      kind: 'code',
      practice: {
        prompt: 'Write `faster(f, g)`: call `f()` and `g()`, each returning a number representing how long that approach took (as `timeit` would measure), and return `"f"` if `f` took no more time than `g`, otherwise `"g"`.',
        starter: 'def faster(f, g):\n    ...\n',
        solution: py`def faster(f, g):
    t1 = f()
    t2 = g()
    return "f" if t1 <= t2 else "g"`,
        samples: ['faster(lambda: 0.01, lambda: 0.05)'],
        cases: [
          ['f is clearly faster', 'faster(lambda: 0.01, lambda: 0.05)'],
          ['g is clearly faster', 'faster(lambda: 0.2, lambda: 0.05)'],
          ['A tie goes to f', 'faster(lambda: 1.0, lambda: 1.0)'],
          ['A very small difference still decides correctly', 'faster(lambda: 0.0001, lambda: 0.0002)'],
          ['g wins by a small margin', 'faster(lambda: 0.30001, lambda: 0.3)'],
        ],
        traps: [
          py`def faster(f, g):
    f()
    g()
    return "f"`,
          py`def faster(f, g):
    t1 = f()
    t2 = g()
    return "f" if t1 >= t2 else "g"`,
          py`def faster(f, g):
    t1 = g()
    t2 = g()
    return "f" if t1 <= t2 else "g"`,
        ],
      },
      real: [
        pro({
          title: 'Comparing a linear scan to a lookup, by cost estimate',
          use: ['tracks'],
          starter: 'def faster(f, g):\n    ...\n\nn = len(tracks)\nlinear_scan = lambda: n\nrepeated_scan = lambda: n * n\nanswer = faster(linear_scan, repeated_scan)\n',
          given: '# tracks is a list of dictionaries; n is the real number of tracks. linear_scan and repeated_scan model the relative cost of an O(n) pass versus an O(n^2) one over the same real data.',
          brief: 'Write `faster` as in the lesson. Store the result in `answer`.',
          reference: py`def faster(f, g):
    t1 = f()
    t2 = g()
    return "f" if t1 <= t2 else "g"

n = len(tracks)
linear_scan = lambda: n
repeated_scan = lambda: n * n
answer = faster(linear_scan, repeated_scan)`,
          walkthrough: 'With thousands of real tracks, `n * n` is dramatically larger than `n` — exactly the gap an O(n) versus O(n²) algorithm produces once the input is not tiny.',
          traps: [py`n = len(tracks)
linear_scan = lambda: n
repeated_scan = lambda: n * n

def faster(f, g):
    return "g"

answer = faster(linear_scan, repeated_scan)`],
        }),
        pro({
          title: 'A tie between two equally-sized real counts',
          use: ['customers', 'employees'],
          starter: 'def faster(f, g):\n    ...\n\ncustomer_count = lambda: len(customers)\nsimilar_count = lambda: len(customers)\nanswer = faster(customer_count, similar_count)\n',
          given: '# customers is a list of dictionaries. Both functions report the same real count, so this is a genuine tie.',
          brief: 'Write `faster` as in the lesson. Store the result in `answer` (a tie should resolve to `"f"`).',
          reference: py`def faster(f, g):
    t1 = f()
    t2 = g()
    return "f" if t1 <= t2 else "g"

customer_count = lambda: len(customers)
similar_count = lambda: len(customers)
answer = faster(customer_count, similar_count)`,
          walkthrough: 'A real benchmark can genuinely tie within measurement noise — deciding what a tie resolves to (here, `f` wins ties) has to be a deliberate, stated choice, not an accident of comparison order.',
          traps: [py`customer_count = lambda: len(customers)
similar_count = lambda: len(customers)

def faster(f, g):
    t1 = f()
    t2 = g()
    return "g" if t1 <= t2 else "f"

answer = faster(customer_count, similar_count)`],
        }),
        pro({
          title: 'Employees outnumbering a fixed cost',
          use: ['employees'],
          starter: 'def faster(f, g):\n    ...\n\nfixed_cost = lambda: 3\nper_employee = lambda: len(employees)\nanswer = faster(fixed_cost, per_employee)\n',
          given: '# employees is a list of dictionaries; Chinook has more than 3 employees, so per_employee should lose.',
          brief: 'Write `faster` as in the lesson. Store the result in `answer`.',
          reference: py`def faster(f, g):
    t1 = f()
    t2 = g()
    return "f" if t1 <= t2 else "g"

fixed_cost = lambda: 3
per_employee = lambda: len(employees)
answer = faster(fixed_cost, per_employee)`,
          walkthrough: 'A fixed, small cost beating a cost that scales with real data size is the whole reason algorithmic complexity matters more than a constant-factor speedup once the input is large enough.',
          traps: [py`fixed_cost = lambda: 3
per_employee = lambda: len(employees)

def faster(f, g):
    t1 = f()
    t2 = g()
    return "f" if t1 < t2 else "g"

answer = faster(per_employee, fixed_cost)`],
        }),
      ],
    },
    {
      id: 'py-algorithmic-optimisations',
      title: 'Algorithmic and data-structure optimisations in Python',
      blurb: 'Sets and dicts for lookups, avoiding quadratic patterns, generators for memory.',
      kind: 'code',
      practice: {
        prompt: 'Write `find_duplicates(items)`: return a list of the values that appear more than once in `items`, each listed exactly once, in the order they were *first seen to repeat*. Use a set for membership checks, not nested loops or `.count()`.',
        starter: 'def find_duplicates(items):\n    ...\n',
        solution: py`def find_duplicates(items):
    seen = set()
    dupe_set = set()
    dupes = []
    for x in items:
        if x in seen and x not in dupe_set:
            dupes.append(x)
            dupe_set.add(x)
        seen.add(x)
    return dupes`,
        samples: ['find_duplicates([1, 2, 3, 2, 1])'],
        cases: [
          ['Two values repeat, in reverse discovery order', 'find_duplicates([1, 2, 3, 2, 1])'],
          ['No repeats', 'find_duplicates([1, 2, 3])'],
          ['An empty list', 'find_duplicates([])'],
          ['A value repeated three times is listed once', "find_duplicates(['a', 'a', 'a'])"],
          ['Every value repeats exactly once', 'find_duplicates([1, 1, 2, 2, 3, 3])'],
          ['A single value, no repeats', 'find_duplicates([5])'],
        ],
        traps: [
          py`def find_duplicates(items):
    seen = set()
    dupes = []
    for x in items:
        if x in seen:
            dupes.append(x)
        seen.add(x)
    return dupes`,
          py`def find_duplicates(items):
    seen = set()
    dupe_set = set()
    dupes = []
    for x in items:
        if x in seen and x not in dupe_set:
            dupes.append(x)
            dupe_set.add(x)
        seen.add(x)
    return sorted(dupes)`,
          py`def find_duplicates(items):
    return list(set(x for x in items if items.count(x) > 1))`,
        ],
      },
      real: [
        pro({
          title: 'Repeated genres among real tracks',
          use: ['tracks'],
          starter: 'def find_duplicates(items):\n    ...\n\n# hand-picked real rows spanning three different genres, two of them repeated\ngenre_ids = [tracks[i]["GenreId"] for i in [0, 1, 62, 63, 1363]]\nanswer = len(find_duplicates(genre_ids))\n',
          given: '# tracks is a list of dictionaries; genre_ids pulls 5 specific real rows (Chinook is sorted in long runs of one genre, so these indices were chosen to actually span more than one).',
          brief: 'Write `find_duplicates` as in the lesson. Store the number of distinct genre ids that repeat in `answer` (2 of the 3 genres here repeat; one appears only once).',
          reference: py`def find_duplicates(items):
    seen = set()
    dupe_set = set()
    dupes = []
    for x in items:
        if x in seen and x not in dupe_set:
            dupes.append(x)
            dupe_set.add(x)
        seen.add(x)
    return dupes

genre_ids = [tracks[i]["GenreId"] for i in [0, 1, 62, 63, 1363]]
answer = len(find_duplicates(genre_ids))`,
          walkthrough: 'A set-based pass finds exactly the values that repeat and nothing else — unlike just taking every distinct value, which would also count the one genre that only shows up once here.',
          traps: [py`genre_ids = [tracks[i]["GenreId"] for i in [0, 1, 62, 63, 1363]]

def find_duplicates(items):
    return list(set(items))

answer = len(find_duplicates(genre_ids))`],
        }),
        pro({
          title: 'Do any two of the first 200 tracks share a name?',
          use: ['tracks'],
          starter: 'def find_duplicates(items):\n    ...\n\nnames = [t["Name"] for t in tracks[:200]]\nanswer = len(find_duplicates(names)) > 0\n',
          given: '# tracks is a list of dictionaries; names holds the first 200 track names.',
          brief: 'Write `find_duplicates` as in the lesson. Store whether any track name repeats among the first 200 in `answer`.',
          reference: py`def find_duplicates(items):
    seen = set()
    dupe_set = set()
    dupes = []
    for x in items:
        if x in seen and x not in dupe_set:
            dupes.append(x)
            dupe_set.add(x)
        seen.add(x)
    return dupes

names = [t["Name"] for t in tracks[:200]]
answer = len(find_duplicates(names)) > 0`,
          walkthrough: 'The same set-based scan works identically for strings as for ids — `find_duplicates` never depended on the values being numbers.',
          traps: [py`names = [t["Name"] for t in tracks[:200]]

def find_duplicates(items):
    return []

answer = len(find_duplicates(items=names)) > 0`],
        }),
        pro({
          title: 'Duplicate country entries among customers',
          use: ['customers'],
          starter: 'def find_duplicates(items):\n    ...\n\ncountries = [c["Country"] for c in customers]\nanswer = len(find_duplicates(countries))\n',
          given: '# customers is a list of dictionaries covering many countries, several repeated.',
          brief: 'Write `find_duplicates` as in the lesson. Store the number of distinct countries that appear more than once among all customers in `answer`.',
          reference: py`def find_duplicates(items):
    seen = set()
    dupe_set = set()
    dupes = []
    for x in items:
        if x in seen and x not in dupe_set:
            dupes.append(x)
            dupe_set.add(x)
        seen.add(x)
    return dupes

countries = [c["Country"] for c in customers]
answer = len(find_duplicates(countries))`,
          walkthrough: 'Scaling this same one-pass, set-based approach up to the full customer list costs no more code and stays linear — a version that appends a value on *every* repeat (not just the first) would over-count any country appearing three or more times.',
          traps: [py`countries = [c["Country"] for c in customers]

def find_duplicates(items):
    seen = set()
    dupes = []
    for x in items:
        if x in seen:
            dupes.append(x)
        seen.add(x)
    return dupes

answer = len(find_duplicates(countries))`],
        }),
      ],
    },
    {
      id: 'py-caching-memoisation',
      title: 'Caching and memoisation strategies',
      blurb: 'lru_cache, cache invalidation, hashing arguments, and time-based caches.',
      kind: 'code',
      practice: {
        prompt: 'Write `ttl_cache(seconds, clock)`: a decorator factory. The decorator it returns caches a function’s results per distinct set of arguments; a cached result is reused only while `clock()` is still less than the time it was stored plus `seconds` — once that time has passed, the next call recomputes and re-caches.',
        starter: 'def ttl_cache(seconds, clock):\n    ...\n',
        solution: py`def ttl_cache(seconds, clock):
    def decorator(fn):
        cache = {}
        def wrapper(*args):
            now = clock()
            if args in cache:
                value, expires = cache[args]
                if now < expires:
                    return value
            result = fn(*args)
            cache[args] = (result, now + seconds)
            return result
        return wrapper
    return decorator`,
        samples: [
          'calls = []\nclock_val = [0]\ndef clock():\n    return clock_val[0]\n@ttl_cache(10, clock)\ndef f(x):\n    calls.append(x)\n    return x * 2\nf(1)\nf(1)\nlen(calls)',
        ],
        cases: [
          ['A cached call within the window avoids recomputing', 'calls = []\nclock_val = [0]\ndef clock():\n    return clock_val[0]\n@ttl_cache(10, clock)\ndef f(x):\n    calls.append(x)\n    return x * 2\nf(1)\nf(1)\nlen(calls)'],
          ['After the TTL passes, the next call recomputes', 'calls = []\nclock_val = [0]\ndef clock():\n    return clock_val[0]\n@ttl_cache(10, clock)\ndef f(x):\n    calls.append(x)\n    return x * 2\nf(1)\nclock_val[0] = 20\nf(1)\nlen(calls)'],
          ['Different arguments are cached separately', 'calls = []\nclock_val = [0]\ndef clock():\n    return clock_val[0]\n@ttl_cache(10, clock)\ndef f(x):\n    calls.append(x)\n    return x\nf(1)\nf(2)\nf(1)\nlen(calls)'],
          ['A cache hit returns the originally computed value', 'clock_val = [0]\ndef clock():\n    return clock_val[0]\n@ttl_cache(10, clock)\ndef f(x):\n    return x * 3\nr1 = f(5)\nclock_val[0] = 1\nr2 = f(5)\n(r1, r2)'],
          ['Exactly at the expiry time, the entry is treated as expired', 'calls = []\nclock_val = [0]\ndef clock():\n    return clock_val[0]\n@ttl_cache(10, clock)\ndef f(x):\n    calls.append(x)\n    return x\nf(1)\nclock_val[0] = 10\nf(1)\nlen(calls)'],
        ],
        traps: [
          py`def ttl_cache(seconds, clock):
    def decorator(fn):
        cache = {}
        def wrapper(*args):
            if args in cache:
                return cache[args]
            result = fn(*args)
            cache[args] = result
            return result
        return wrapper
    return decorator`,
          py`def ttl_cache(seconds, clock):
    def decorator(fn):
        cache = {}
        def wrapper(*args):
            now = clock()
            if args in cache:
                value, expires = cache[args]
                if now <= expires:
                    return value
            result = fn(*args)
            cache[args] = (result, now + seconds)
            return result
        return wrapper
    return decorator`,
          py`def ttl_cache(seconds, clock):
    def decorator(fn):
        cache = {}
        def wrapper(*args):
            now = clock()
            if cache and now < cache.get("expires", -1):
                return cache["value"]
            result = fn(*args)
            cache["value"] = result
            cache["expires"] = now + seconds
            return result
        return wrapper
    return decorator`,
        ],
      },
      real: [
        pro({
          title: 'Caching a lookup over real customers',
          use: ['customers'],
          starter: 'def ttl_cache(seconds, clock):\n    ...\n\ncalls = []\nclock_val = [0]\ndef clock():\n    return clock_val[0]\n\n@ttl_cache(5, clock)\ndef country_of(customer_id):\n    calls.append(customer_id)\n    row = next(c for c in customers if c["CustomerId"] == customer_id)\n    return row["Country"]\n\nfirst_id = customers[0]["CustomerId"]\ncountry_of(first_id)\ncountry_of(first_id)\nanswer = (len(calls), country_of(first_id))\n',
          given: '# customers is a list of dictionaries; first_id is a real CustomerId.',
          brief: 'Write `ttl_cache` as in the lesson. Store `(number_of_real_lookups, cached_country)` in `answer` — the second and third calls should reuse the cache.',
          reference: py`def ttl_cache(seconds, clock):
    def decorator(fn):
        cache = {}
        def wrapper(*args):
            now = clock()
            if args in cache:
                value, expires = cache[args]
                if now < expires:
                    return value
            result = fn(*args)
            cache[args] = (result, now + seconds)
            return result
        return wrapper
    return decorator

calls = []
clock_val = [0]
def clock():
    return clock_val[0]

@ttl_cache(5, clock)
def country_of(customer_id):
    calls.append(customer_id)
    row = next(c for c in customers if c["CustomerId"] == customer_id)
    return row["Country"]

first_id = customers[0]["CustomerId"]
country_of(first_id)
country_of(first_id)
answer = (len(calls), country_of(first_id))`,
          walkthrough: 'Wrapping a real, more expensive lookup (a linear scan over customers) in `ttl_cache` is exactly the situation memoisation is for — recomputing the same answer for the same input repeatedly is pure waste.',
          traps: [py`calls = []
clock_val = [0]
def clock():
    return clock_val[0]

def ttl_cache(seconds, clock):
    def decorator(fn):
        def wrapper(*args):
            return fn(*args)
        return wrapper
    return decorator

@ttl_cache(5, clock)
def country_of(customer_id):
    calls.append(customer_id)
    row = next(c for c in customers if c["CustomerId"] == customer_id)
    return row["Country"]

first_id = customers[0]["CustomerId"]
country_of(first_id)
country_of(first_id)
answer = (len(calls), country_of(first_id))`],
        }),
        pro({
          title: 'A cache that must not mix up two tracks',
          use: ['tracks'],
          starter: 'def ttl_cache(seconds, clock):\n    ...\n\nclock_val = [0]\ndef clock():\n    return clock_val[0]\n\n@ttl_cache(5, clock)\ndef price_of(track_id):\n    row = next(t for t in tracks if t["TrackId"] == track_id)\n    return row["UnitPrice"]\n\n# two real tracks with genuinely different prices (Chinook prices tracks at either 0.99 or 1.99)\nid_a = tracks[0]["TrackId"]\nid_b = tracks[2818]["TrackId"]\nanswer = (price_of(id_a), price_of(id_b))\n',
          given: '# tracks is a list of dictionaries; id_a and id_b are two real TrackId values chosen to have different prices.',
          brief: 'Write `ttl_cache` as in the lesson. Store `(price_of(id_a), price_of(id_b))` in `answer`.',
          reference: py`def ttl_cache(seconds, clock):
    def decorator(fn):
        cache = {}
        def wrapper(*args):
            now = clock()
            if args in cache:
                value, expires = cache[args]
                if now < expires:
                    return value
            result = fn(*args)
            cache[args] = (result, now + seconds)
            return result
        return wrapper
    return decorator

clock_val = [0]
def clock():
    return clock_val[0]

@ttl_cache(5, clock)
def price_of(track_id):
    row = next(t for t in tracks if t["TrackId"] == track_id)
    return row["UnitPrice"]

id_a = tracks[0]["TrackId"]
id_b = tracks[2818]["TrackId"]
answer = (price_of(id_a), price_of(id_b))`,
          walkthrough: 'Keying the cache by the actual arguments (`args`) is what keeps two different track lookups from colliding into a single, shared, wrong cache slot.',
          traps: [py`clock_val = [0]
def clock():
    return clock_val[0]

def ttl_cache(seconds, clock):
    def decorator(fn):
        cache = {}
        def wrapper(*args):
            now = clock()
            if cache:
                value, expires = cache.get("only", (None, -1))
                if now < expires:
                    return value
            result = fn(*args)
            cache["only"] = (result, now + seconds)
            return result
        return wrapper
    return decorator

@ttl_cache(5, clock)
def price_of(track_id):
    row = next(t for t in tracks if t["TrackId"] == track_id)
    return row["UnitPrice"]

id_a = tracks[0]["TrackId"]
id_b = tracks[2818]["TrackId"]
answer = (price_of(id_a), price_of(id_b))`],
        }),
        pro({
          title: 'Confirming an expired entry is really recomputed',
          use: ['tracks'],
          starter: 'def ttl_cache(seconds, clock):\n    ...\n\ncalls = []\nclock_val = [0]\ndef clock():\n    return clock_val[0]\n\n@ttl_cache(3, clock)\ndef name_of(track_id):\n    calls.append(track_id)\n    row = next(t for t in tracks if t["TrackId"] == track_id)\n    return row["Name"]\n\ntrack_id = tracks[0]["TrackId"]\nname_of(track_id)\nclock_val[0] = 100\nname_of(track_id)\nanswer = len(calls)\n',
          given: '# tracks is a list of dictionaries; track_id is a real TrackId. The clock jumps far past the 3-second TTL between calls.',
          brief: 'Write `ttl_cache` as in the lesson. Store the number of real lookups performed in `answer` (the jump should force a second, real recomputation).',
          reference: py`def ttl_cache(seconds, clock):
    def decorator(fn):
        cache = {}
        def wrapper(*args):
            now = clock()
            if args in cache:
                value, expires = cache[args]
                if now < expires:
                    return value
            result = fn(*args)
            cache[args] = (result, now + seconds)
            return result
        return wrapper
    return decorator

calls = []
clock_val = [0]
def clock():
    return clock_val[0]

@ttl_cache(3, clock)
def name_of(track_id):
    calls.append(track_id)
    row = next(t for t in tracks if t["TrackId"] == track_id)
    return row["Name"]

track_id = tracks[0]["TrackId"]
name_of(track_id)
clock_val[0] = 100
name_of(track_id)
answer = len(calls)`,
          walkthrough: 'A cache with no expiry at all would report `1` here instead of `2` — the whole point of a *TTL* cache over a plain, permanent one is that stale entries eventually get refreshed.',
          traps: [py`calls = []
clock_val = [0]
def clock():
    return clock_val[0]

def ttl_cache(seconds, clock):
    def decorator(fn):
        cache = {}
        def wrapper(*args):
            if args in cache:
                return cache[args]
            result = fn(*args)
            cache[args] = result
            return result
        return wrapper
    return decorator

@ttl_cache(3, clock)
def name_of(track_id):
    calls.append(track_id)
    row = next(t for t in tracks if t["TrackId"] == track_id)
    return row["Name"]

track_id = tracks[0]["TrackId"]
name_of(track_id)
clock_val[0] = 100
name_of(track_id)
answer = len(calls)`],
        }),
      ],
    },
    {
      id: 'py-concurrency-map',
      title: 'Concurrency map: threads, processes and asyncio (reading)',
      blurb: 'Concurrency versus parallelism, I/O-bound versus CPU-bound, executors, queues, races and deadlocks.',
      kind: 'read',
      check: [
        {
          q: 'What is the difference between concurrency and parallelism?',
          options: [
            'They are exactly the same thing',
            'Concurrency is about structuring a program to *deal with* many things at once (which may still run one at a time, interleaved); parallelism is actually *executing* multiple things at the exact same instant, on multiple cores',
            'Parallelism only applies to Python, concurrency only to other languages',
            'Concurrency is always faster than parallelism',
          ],
          answer: 1,
          why: 'asyncio gives you concurrency on a single thread (interleaved, not simultaneous); multiprocessing gives genuine parallelism, since separate processes really do run at the same time on separate cores.',
        },
        {
          q: 'For an I/O-bound program making many network requests, which tool is typically the best fit?',
          options: [
            'multiprocessing, since more processes always means more speed',
            'asyncio or threads — the bottleneck is waiting on the network, not CPU, so overlapping those waits is what actually helps',
            'None of these tools help with I/O-bound work',
            'Rewriting the whole program in C',
          ],
          answer: 1,
          why: 'Processes are the heavyweight tool for CPU-bound parallelism; for I/O-bound waiting, the lighter-weight concurrency of asyncio or threads is both sufficient and far cheaper.',
        },
        {
          q: 'What does `concurrent.futures.ThreadPoolExecutor` (or `ProcessPoolExecutor`) give you over managing threads or processes by hand?',
          options: [
            'Nothing; it is purely cosmetic',
            'A simple, uniform `submit`/`map` interface for running callables on a pool of workers, handling the pool lifecycle and collecting results (or exceptions) for you',
            'It only works with asyncio code',
            'It automatically converts CPU-bound code into I/O-bound code',
          ],
          answer: 1,
          why: 'Both executors share the same interface, so switching between thread-based and process-based execution is often a one-line change once code is written against the `Executor` interface.',
        },
        {
          q: 'What is a race condition?',
          options: [
            'A program that runs too fast',
            'A bug where the correctness of a result depends on the unpredictable timing or ordering of concurrent operations — e.g. two threads both reading, then both writing, an unlocked shared counter',
            'An error that only happens in single-threaded code',
            'A type of syntax error',
          ],
          answer: 1,
          why: 'Two threads incrementing an unlocked shared counter can both read the same old value before either writes back, silently losing one of the increments — the outcome depends on timing, which is what makes race conditions so hard to reproduce reliably.',
        },
        {
          q: 'What is a deadlock?',
          options: [
            'A program that crashes immediately',
            'A situation where two or more threads/processes are each waiting on a resource the other holds, so neither can ever proceed',
            'A synonym for a race condition',
            'A performance optimisation technique',
          ],
          answer: 1,
          why: 'Classic example: thread A holds lock 1 and waits for lock 2; thread B holds lock 2 and waits for lock 1. Neither ever releases what the other needs, and both wait forever.',
        },
      ],
    },
    {
      id: 'py-asyncio-coroutines-tasks',
      title: 'asyncio: coroutines, tasks and event loops',
      blurb: 'async and await, gather, timeouts and cancellation, semaphores and queues.',
      kind: 'code',
      practice: {
        prompt: 'Write `async def gather_results(delays)`: for each value `d` in `delays`, run a coroutine that does `await asyncio.sleep(0)` and then returns `d`, all concurrently, using `asyncio.gather`. Return the results as a list, in the same order as `delays` (the order of the results, not necessarily the order in which they finished).',
        starter: 'import asyncio\n\nasync def gather_results(delays):\n    ...\n',
        solution: py`import asyncio

async def gather_results(delays):
    async def work(d):
        await asyncio.sleep(0)
        return d
    return list(await asyncio.gather(*(work(d) for d in delays)))`,
        samples: ['asyncio.run(gather_results([1, 2, 3]))'],
        cases: [
          ['Results come back in input order', 'asyncio.run(gather_results([1, 2, 3]))'],
          ['A single item', 'asyncio.run(gather_results([42]))'],
          ['An empty list', 'asyncio.run(gather_results([]))'],
          ['Order preserved even when values are not sorted', 'asyncio.run(gather_results([5, 1, 9, 3]))'],
          ['Repeated values', 'asyncio.run(gather_results([7, 7, 7]))'],
        ],
        traps: [
          py`import asyncio

async def gather_results(delays):
    async def work(d):
        await asyncio.sleep(0)
        return d
    results = await asyncio.gather(*(work(d) for d in delays))
    return list(reversed(results))`,
          py`import asyncio

async def gather_results(delays):
    async def work(d):
        await asyncio.sleep(0)
        return d
    results = await asyncio.gather(*(work(d) for d in delays))
    return sorted(results)`,
          py`import asyncio

async def gather_results(delays):
    async def work(d, i):
        await asyncio.sleep(0)
        return i
    return list(await asyncio.gather(*(work(d, i) for i, d in enumerate(delays))))`,
        ],
      },
      real: [
        pro({
          title: 'Gathering real track ids concurrently',
          use: ['tracks'],
          starter: 'import asyncio\n\nasync def gather_results(delays):\n    ...\n\nids = [t["TrackId"] for t in tracks[:5]]\nanswer = asyncio.run(gather_results(ids))\n',
          given: '# tracks is a list of dictionaries; ids holds the first 5 real TrackId values.',
          brief: 'Write `gather_results` as in the lesson. Store the concurrently-gathered ids, in original order, in `answer`.',
          reference: py`import asyncio

async def gather_results(delays):
    async def work(d):
        await asyncio.sleep(0)
        return d
    return list(await asyncio.gather(*(work(d) for d in delays)))

ids = [t["TrackId"] for t in tracks[:5]]
answer = asyncio.run(gather_results(ids))`,
          walkthrough: 'Real ids work exactly like the toy integers in the practice test — `asyncio.gather` does not care what the values are, only that each coroutine eventually resolves to one.',
          traps: [py`ids = [t["TrackId"] for t in tracks[:5]]

async def gather_results(delays):
    async def work(d):
        await asyncio.sleep(0)
        return d
    results = await asyncio.gather(*(work(d) for d in delays))
    return sorted(results, reverse=True)

answer = asyncio.run(gather_results(ids))`],
        }),
        pro({
          title: 'An empty gather over real (but filtered-out) data',
          use: ['tracks'],
          starter: 'import asyncio\n\nasync def gather_results(delays):\n    ...\n\nvery_long = [t["TrackId"] for t in tracks[:20] if t["Milliseconds"] > 10 ** 9]\nanswer = asyncio.run(gather_results(very_long))\n',
          given: '# tracks is a list of dictionaries; very_long filters for tracks over roughly 11 days long, which real Chinook tracks never are.',
          brief: 'Write `gather_results` as in the lesson. Store the result in `answer` (it should be an empty list, since no real track matches that filter).',
          reference: py`import asyncio

async def gather_results(delays):
    async def work(d):
        await asyncio.sleep(0)
        return d
    return list(await asyncio.gather(*(work(d) for d in delays)))

very_long = [t["TrackId"] for t in tracks[:20] if t["Milliseconds"] > 10 ** 9]
answer = asyncio.run(gather_results(very_long))`,
          walkthrough: '`asyncio.gather()` with no coroutines at all resolves immediately to an empty list — a genuinely empty concurrent batch is not a special case to handle separately.',
          traps: [py`very_long = [t["TrackId"] for t in tracks[:20] if t["Milliseconds"] > 10 ** 9]

async def gather_results(delays):
    if not delays:
        return [0]
    async def work(d):
        await asyncio.sleep(0)
        return d
    return list(await asyncio.gather(*(work(d) for d in delays)))

answer = asyncio.run(gather_results(very_long))`],
        }),
        pro({
          title: 'Combining a concurrent gather with a real total',
          use: ['invoices'],
          starter: 'import asyncio\n\nasync def gather_results(delays):\n    ...\n\ntotals = [i["Total"] for i in invoices[:6]]\ngathered = asyncio.run(gather_results(totals))\nanswer = (gathered, round(sum(gathered), 2))\n',
          given: '# invoices is a list of dictionaries; totals holds the first 6 real invoice Total values.',
          brief: 'Write `gather_results` as in the lesson. Store `(gathered_totals, rounded_sum)` in `answer`.',
          reference: py`import asyncio

async def gather_results(delays):
    async def work(d):
        await asyncio.sleep(0)
        return d
    return list(await asyncio.gather(*(work(d) for d in delays)))

totals = [i["Total"] for i in invoices[:6]]
gathered = asyncio.run(gather_results(totals))
answer = (gathered, round(sum(gathered), 2))`,
          walkthrough: 'Gathering does not transform the values at all here — it only concurrently *waits*, so the sum of the gathered results always matches the sum of the originals.',
          traps: [py`totals = [i["Total"] for i in invoices[:6]]

async def gather_results(delays):
    async def work(d):
        await asyncio.sleep(0)
        return d
    results = await asyncio.gather(*(work(d) for d in delays))
    return list(results)[:-1]

gathered = asyncio.run(gather_results(totals))
answer = (gathered, round(sum(gathered), 2))`],
        }),
      ],
    },
    {
      id: 'py-async-patterns-structured-concurrency',
      title: 'Async patterns: producers, consumers and structured concurrency',
      blurb: 'asyncio.Queue, TaskGroup, exception handling in groups, and testing async code.',
      kind: 'code',
      practice: {
        prompt: 'Write `async def pipeline(items)`: using an `asyncio.Queue(maxsize=2)`, run one producer coroutine that puts every item from `items` onto the queue (then a `None` sentinel), and one consumer coroutine that reads from the queue until it sees the sentinel, appending `item * 2` to a results list for each real item. Run both with `asyncio.TaskGroup`, and return the results list (which will be in the order items were produced).',
        starter: 'import asyncio\n\nasync def pipeline(items):\n    ...\n',
        solution: py`import asyncio

async def pipeline(items):
    queue = asyncio.Queue(maxsize=2)
    results = []

    async def producer():
        for item in items:
            await queue.put(item)
        await queue.put(None)

    async def consumer():
        while True:
            item = await queue.get()
            if item is None:
                break
            results.append(item * 2)

    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer())
        tg.create_task(consumer())

    return results`,
        samples: ['asyncio.run(pipeline([1, 2, 3]))'],
        cases: [
          ['Three items, each doubled, in order', 'asyncio.run(pipeline([1, 2, 3]))'],
          ['An empty list produces no results', 'asyncio.run(pipeline([]))'],
          ['A single item', 'asyncio.run(pipeline([5]))'],
          ['Repeated values', 'asyncio.run(pipeline([1, 1, 1]))'],
          ['More items than the queue’s maxsize of 2', 'asyncio.run(pipeline([10, 20, 30, 40]))'],
        ],
        traps: [
          py`import asyncio

async def pipeline(items):
    queue = asyncio.Queue(maxsize=2)
    results = []
    async def producer():
        for item in items:
            await queue.put(item)
        await queue.put(None)
    async def consumer():
        while True:
            item = await queue.get()
            if item is None:
                break
            results.append(item + 2)
    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer())
        tg.create_task(consumer())
    return results`,
          py`import asyncio

async def pipeline(items):
    queue = asyncio.Queue(maxsize=2)
    results = []
    async def producer():
        for item in reversed(items):
            await queue.put(item)
        await queue.put(None)
    async def consumer():
        while True:
            item = await queue.get()
            if item is None:
                break
            results.append(item * 2)
    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer())
        tg.create_task(consumer())
    return results`,
        ],
      },
      real: [
        pro({
          title: 'Doubling real track durations through the pipeline',
          use: ['tracks'],
          starter: 'import asyncio\n\nasync def pipeline(items):\n    ...\n\ndurations = [t["Milliseconds"] for t in tracks[:6]]\nanswer = asyncio.run(pipeline(durations))\n',
          given: '# tracks is a list of dictionaries; durations holds the first 6 real Milliseconds values.',
          brief: 'Write `pipeline` as in the lesson. Store the doubled durations (in order) in `answer`.',
          reference: py`import asyncio

async def pipeline(items):
    queue = asyncio.Queue(maxsize=2)
    results = []

    async def producer():
        for item in items:
            await queue.put(item)
        await queue.put(None)

    async def consumer():
        while True:
            item = await queue.get()
            if item is None:
                break
            results.append(item * 2)

    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer())
        tg.create_task(consumer())

    return results

durations = [t["Milliseconds"] for t in tracks[:6]]
answer = asyncio.run(pipeline(durations))`,
          walkthrough: 'A bounded queue (`maxsize=2`) forces the producer to pause once two items are waiting, which is exactly the back-pressure a real pipeline needs when a consumer cannot keep up — nothing here changes just because the values are real durations instead of small integers.',
          traps: [py`durations = [t["Milliseconds"] for t in tracks[:6]]

async def pipeline(items):
    queue = asyncio.Queue(maxsize=2)
    results = []
    async def producer():
        for item in items:
            await queue.put(item)
        await queue.put(None)
    async def consumer():
        while True:
            item = await queue.get()
            if item is None:
                break
            results.append(item)
    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer())
        tg.create_task(consumer())
    return results

answer = asyncio.run(pipeline(durations))`],
        }),
        pro({
          title: 'An empty pipeline over a filtered real list',
          use: ['customers'],
          starter: 'import asyncio\n\nasync def pipeline(items):\n    ...\n\nnobody = [c["CustomerId"] for c in customers if c["Country"] == "Nowhere"]\nanswer = asyncio.run(pipeline(nobody))\n',
          given: '# customers is a list of dictionaries; nobody filters for a country that does not exist in the real data.',
          brief: 'Write `pipeline` as in the lesson. Store the result in `answer` (it should be empty).',
          reference: py`import asyncio

async def pipeline(items):
    queue = asyncio.Queue(maxsize=2)
    results = []

    async def producer():
        for item in items:
            await queue.put(item)
        await queue.put(None)

    async def consumer():
        while True:
            item = await queue.get()
            if item is None:
                break
            results.append(item * 2)

    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer())
        tg.create_task(consumer())

    return results

nobody = [c["CustomerId"] for c in customers if c["Country"] == "Nowhere"]
answer = asyncio.run(pipeline(nobody))`,
          walkthrough: 'With no real items, the producer just sends the sentinel immediately and the consumer exits right away — the pipeline still terminates cleanly instead of hanging, which is exactly what a sentinel-based shutdown is for.',
          traps: [py`nobody = [c["CustomerId"] for c in customers if c["Country"] == "Nowhere"]

async def pipeline(items):
    queue = asyncio.Queue(maxsize=2)
    results = []
    async def producer():
        for item in items:
            await queue.put(item)
        await queue.put(None)
    async def consumer():
        while True:
            item = await queue.get()
            if item is None:
                break
            results.append(item * 2)
    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer())
        tg.create_task(consumer())
    return results or [0]

answer = asyncio.run(pipeline(nobody))`],
        }),
        pro({
          title: 'Checking the doubled total matches, on real invoice totals',
          use: ['invoices'],
          starter: 'import asyncio\n\nasync def pipeline(items):\n    ...\n\ntotals = [i["Total"] for i in invoices[:5]]\nresult = asyncio.run(pipeline(totals))\nanswer = round(sum(result), 2)\n',
          given: '# invoices is a list of dictionaries; totals holds the first 5 real invoice Total values.',
          brief: 'Write `pipeline` as in the lesson. Store the rounded (2 decimals) sum of the doubled totals in `answer`.',
          reference: py`import asyncio

async def pipeline(items):
    queue = asyncio.Queue(maxsize=2)
    results = []

    async def producer():
        for item in items:
            await queue.put(item)
        await queue.put(None)

    async def consumer():
        while True:
            item = await queue.get()
            if item is None:
                break
            results.append(item * 2)

    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer())
        tg.create_task(consumer())

    return results

totals = [i["Total"] for i in invoices[:5]]
result = asyncio.run(pipeline(totals))
answer = round(sum(result), 2)`,
          walkthrough: 'The sum of the doubled results should always be exactly double the sum of the originals — a quick, real-data sanity check that the pipeline is not silently dropping or duplicating an item along the way.',
          traps: [py`totals = [i["Total"] for i in invoices[:5]]

async def pipeline(items):
    queue = asyncio.Queue(maxsize=2)
    results = []
    async def producer():
        for item in items:
            await queue.put(item)
        await queue.put(None)
    async def consumer():
        count = 0
        while True:
            item = await queue.get()
            if item is None:
                break
            if count < 3:
                results.append(item * 2)
            count += 1
    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer())
        tg.create_task(consumer())
    return results

result = asyncio.run(pipeline(totals))
answer = round(sum(result), 2)`],
        }),
      ],
    },
    {
      id: 'py-parallel-processing-multiprocessing',
      title: 'Parallel processing with concurrent.futures and multiprocessing (reading)',
      blurb: 'ThreadPoolExecutor and ProcessPoolExecutor, map and submit, pickling, and chunking work.',
      kind: 'read',
      check: [
        {
          q: 'What is the essential difference between `ThreadPoolExecutor` and `ProcessPoolExecutor`?',
          options: [
            'They are interchangeable with no real difference',
            'Threads share the same memory space and are limited by the GIL for CPU-bound work; processes each get their own interpreter and GIL, enabling genuine CPU parallelism at the cost of needing to serialise data between them',
            'ProcessPoolExecutor only works on Linux',
            'ThreadPoolExecutor is always faster',
          ],
          answer: 1,
          why: 'The choice mirrors the threads-versus-processes trade-off from earlier: threads for I/O-bound work, processes for CPU-bound work that needs real parallelism.',
        },
        {
          q: 'What does `executor.map(fn, items)` do?',
          options: [
            'It runs `fn` once on the whole `items` list',
            'It applies `fn` to each item in `items`, distributing the calls across the pool’s workers, and returns an iterator of results in the same order as the inputs',
            'It only works with exactly one worker',
            'It modifies `items` in place',
          ],
          answer: 1,
          why: '`map` is the simplest way to parallelise "apply this function to every item in a list" — order-preserving, much like the built-in `map`, just spread across workers.',
        },
        {
          q: 'What does `executor.submit(fn, arg)` give you that `map` does not?',
          options: [
            'Nothing extra',
            'A `Future` object for that one specific call, which you can check, wait on, or attach a callback to individually — useful when tasks are not a uniform batch',
            'It runs synchronously, unlike map',
            'It can only be used with threads, never processes',
          ],
          answer: 1,
          why: '`submit` is for one-off or heterogeneous tasks where you need to track each result (or exception) individually; `map` is for applying the same function uniformly across a batch.',
        },
        {
          q: 'Why does data passed to a `ProcessPoolExecutor` need to be picklable?',
          options: [
            'It does not; any object works',
            'Separate processes do not share memory, so arguments, and the function itself, must be serialised (pickled) to cross the process boundary and be reconstructed on the other side',
            'Pickling is only required for very large objects',
            'Pickling is a performance optimisation with no functional requirement behind it',
          ],
          answer: 1,
          why: 'A raw in-memory object (like an open file handle, or certain kinds of closures) often cannot be pickled at all, which is a common, confusing failure point when first parallelising with processes.',
        },
        {
          q: 'Why chunk work before submitting it to a process pool, rather than submitting one tiny task per item?',
          options: [
            'Chunking has no effect on performance',
            'Each task submitted to a process pool carries real overhead (serialisation, inter-process communication); batching many small items into fewer, larger chunks amortises that overhead across more actual work',
            'Process pools only accept a single chunk of work total',
            'Chunking is required by Python syntax',
          ],
          answer: 1,
          why: 'If each individual task is cheap, the overhead of dispatching it to another process can dominate the actual work done — grouping items into chunks is how you keep that overhead from swamping the benefit of parallelising at all.',
        },
      ],
    },
  ],
  checkpoint: [],
}
