import { py } from './common.js'

export const complexityAndMeasurement = {
  id: 'complexity-and-measurement',
  title: 'Complexity and measurement',
  intro: 'Reasoning about cost before writing code.',
  lessons: [
    {
      id: 'py-big-o-practice',
      title: 'Big-O in practice: time and space',
      blurb: 'Counting operations, the common growth classes, and reading code for complexity.',
      kind: 'code',
      practice: {
        prompt:
          'Write `growth_class(counts)`. `counts` is a list of **3 operation counts**, measured for an input of size `n`, then `2n`, then `4n` (each one double the last).\n\nReturn `"constant"` if the count barely changes, `"linear"` if it roughly **doubles** each time, or `"quadratic"` if it roughly **quadruples** each time. Judge each of the two steps (n→2n and 2n→4n) the same way — both must agree.',
        starter: 'def growth_class(counts):\n    ...\n',
        solution: py`def growth_class(counts):
    n, n2, n4 = counts
    r1 = n2 / n
    r2 = n4 / n2

    def close(ratio, target):
        return abs(ratio - target) <= 0.5

    if close(r1, 1) and close(r2, 1):
        return "constant"
    if close(r1, 2) and close(r2, 2):
        return "linear"
    return "quadratic"`,
        samples: ['growth_class([10, 10, 11])', 'growth_class([5, 10, 20])', 'growth_class([4, 16, 64])'],
        cases: [
          ['Constant', 'growth_class([10, 10, 11])'],
          ['Linear', 'growth_class([5, 10, 20])'],
          ['Quadratic', 'growth_class([4, 16, 64])'],
          ['Linear with a large base', 'growth_class([1000, 2000, 4000])'],
          ['Quadratic with a small base', 'growth_class([1, 4, 16])'],
          ['Both steps must agree (slows down, is not linear)', 'growth_class([10, 15, 60])'],
          ['Both steps must agree (speeds up, is not quadratic)', 'growth_class([10, 40, 80])'],
          ['One big jump does not average out to linear', 'growth_class([10, 10, 40])'],
        ],
        traps: [
          py`def growth_class(counts):
    n, n2, n4 = counts
    r1 = n2 / n
    if abs(r1 - 1) <= 0.5:
        return "constant"
    if abs(r1 - 2) <= 0.5:
        return "linear"
    return "quadratic"`,
          py`def growth_class(counts):
    n, n2, n4 = counts
    r2 = n4 / n2
    if abs(r2 - 1) <= 0.5:
        return "constant"
    if abs(r2 - 2) <= 0.5:
        return "linear"
    return "quadratic"`,
          py`def growth_class(counts):
    n, n2, n4 = counts
    total_growth = n4 / n
    if total_growth <= 1.5:
        return "constant"
    if total_growth <= 4:
        return "linear"
    return "quadratic"`,
        ],
      },
    },
    {
      id: 'py-measuring-algorithms',
      title: 'Measuring algorithms and reading growth from data',
      blurb: 'Timing with growing inputs, and why the smallest measurements are the least trustworthy.',
      kind: 'code',
      practice: {
        prompt:
          'Write `label_growth(times)`. `times` is a list of **3 timings** (in seconds) for an input of size `n`, `2n` and `4n`.\n\nTiny inputs make unreliable timings (fixed overhead dominates), so base your answer **only on the last doubling** (`times[2] / times[1]`), ignoring `times[0]`. Return `"O(1)"` if that ratio is under 1.5, `"O(n)"` if it is under 3, otherwise `"O(n^2)"`.',
        starter: 'def label_growth(times):\n    ...\n',
        solution: py`def label_growth(times):
    ratio = times[2] / times[1]
    if ratio < 1.5:
        return "O(1)"
    if ratio < 3:
        return "O(n)"
    return "O(n^2)"`,
        samples: ['label_growth([0.001, 0.01, 0.011])', 'label_growth([0.001, 0.01, 0.02])'],
        cases: [
          ['Flat at large n', 'label_growth([0.001, 0.01, 0.011])'],
          ['Doubling at large n', 'label_growth([0.001, 0.01, 0.02])'],
          ['Quadrupling at large n', 'label_growth([0.001, 0.01, 0.04])'],
          ['A noisy first measurement must be ignored (looks quadratic early, is really linear)', 'label_growth([0.001, 0.005, 0.01])'],
          ['A noisy first measurement must be ignored (looks linear early, is really constant)', 'label_growth([0.001, 0.002, 0.0021])'],
          ['Right at the O(n)/O(n^2) boundary', 'label_growth([0.5, 1.0, 2.9])'],
          ['Between the O(1) and O(n) thresholds', 'label_growth([1.0, 1.0, 1.7])'],
        ],
        traps: [
          py`def label_growth(times):
    ratio = times[1] / times[0]
    if ratio < 1.5:
        return "O(1)"
    if ratio < 3:
        return "O(n)"
    return "O(n^2)"`,
          py`def label_growth(times):
    ratio = (times[1] / times[0] + times[2] / times[1]) / 2
    if ratio < 1.5:
        return "O(1)"
    if ratio < 3:
        return "O(n)"
    return "O(n^2)"`,
          py`def label_growth(times):
    ratio = times[2] / times[1]
    if ratio < 2:
        return "O(1)"
    if ratio < 4:
        return "O(n)"
    return "O(n^2)"`,
        ],
      },
    },
    {
      id: 'py-cost-model-builtins',
      title: "Python's cost model: what the built-ins cost",
      blurb: 'The real cost of list, dict, set and deque operations, and the tools that hide a fast algorithm inside a built-in.',
      kind: 'learn',
      check: [
        {
          q: 'You need to check membership (`x in collection`) many times in a loop. Which is fastest for a large collection?',
          options: ['A `list`', 'A `set` or `dict`', 'They are the same', 'A `tuple`'],
          answer: 1,
          why: '`x in list` is O(n) — it may scan every item. `x in set`/`x in dict` is O(1) on average, because they use hashing.',
        },
        {
          q: 'Why is `list.append` described as "amortised O(1)" rather than plain O(1)?',
          options: [
            'It is actually O(n) and the name is misleading',
            'Most calls are O(1), but occasionally the list must grow into a larger block of memory and copy everything, which is O(n) — averaged over many calls, the cost per call is still constant',
            'It depends on what is being appended',
            'It is O(log n) because of binary search',
          ],
          answer: 1,
          why: 'Python lists over-allocate space. Growth (a copy) happens rarely enough that its cost, spread over all the cheap appends in between, averages out to O(1) per append.',
        },
        {
          q: 'Which built-in gives you a min-heap (repeatedly popping the smallest item) in O(log n) per operation?',
          options: ['`sorted()`', '`heapq`', '`bisect`', '`collections.Counter`'],
          answer: 1,
          why: '`heapq` maintains a list as a binary heap. `heappush`/`heappop` are O(log n), far cheaper than re-sorting the whole list each time.',
        },
        {
          q: 'What is the cost of `my_list.pop(0)` (removing the first element) for a list of length n?',
          options: ['O(1)', 'O(log n)', 'O(n), because every remaining item shifts left one position', 'O(n^2)'],
          answer: 2,
          why: 'A list is contiguous storage. Removing the first item means every other item moves down by one slot. Use `collections.deque` if you need to pop from both ends cheaply.',
        },
        {
          q: 'You need to insert into a large sorted list while keeping it sorted, many times. Which module helps you find the insertion point in O(log n) instead of O(n)?',
          options: ['`heapq`', '`bisect`', '`itertools`', '`functools`'],
          answer: 1,
          why: '`bisect.insort`/`bisect_left` use binary search to find where a value belongs in a sorted list in O(log n) — the insertion itself is still O(n) (shifting elements), but finding *where* is fast.',
        },
      ],
    },
  ],
  checkpoint: [],
}
