import { py, chi } from './common.js'

export const dataStructuresLessonsA = [
  {
    id: 'py-dynamic-arrays',
    title: 'Arrays and dynamic lists: how Python lists work',
    blurb: 'Contiguous storage, over-allocation, and building a minimal dynamic array.',
    kind: 'code',
    practice: {
      prompt:
        'Implement `DynArray`, a minimal dynamic array, with `append(value)`, `get(index)` and `__len__`.\n\nStart with capacity 1. Whenever `append` would overflow the current capacity, **double** the capacity and copy the old values across. `get` raises `IndexError` for an index outside `0 <= index < len(array)`.',
      starter: 'class DynArray:\n    def __init__(self):\n        ...\n\n    def append(self, value):\n        ...\n\n    def get(self, index):\n        ...\n\n    def __len__(self):\n        ...\n',
      solution: py`class DynArray:
    def __init__(self):
        self._capacity = 1
        self._size = 0
        self._data = [None] * self._capacity

    def append(self, value):
        if self._size == self._capacity:
            self._capacity *= 2
            new_data = [None] * self._capacity
            for i in range(self._size):
                new_data[i] = self._data[i]
            self._data = new_data
        self._data[self._size] = value
        self._size += 1

    def get(self, index):
        if index < 0 or index >= self._size:
            raise IndexError("index out of range")
        return self._data[index]

    def __len__(self):
        return self._size`,
      samples: ['(lambda a: [a.append(x) for x in [10, 20, 30]] and [a.get(i) for i in range(3)])(DynArray())'],
      cases: [
        ['Append then get, in order', '(lambda a: [a.append(x) for x in [10, 20, 30]] and [a.get(i) for i in range(3)])(DynArray())'],
        ['Length after several appends', '(lambda a: [a.append(i) for i in range(50)] and len(a))(DynArray())'],
        ['Every value survives many appends (growth must copy)', '(lambda a: [a.append(i) for i in range(20)] and [a.get(i) for i in range(20)])(DynArray())'],
        [
          'Two instances do not share state',
          '(lambda a, b: [a.append(1), b.append(2), b.append(3), a.get(0), b.get(0), b.get(1)])(DynArray(), DynArray())[3:]',
        ],
        ['Raises IndexError past the end', '(lambda a: (a.append(1), a.get(5))[1])(DynArray())'],
        ['An empty array has length 0', 'len(DynArray())'],
      ],
      traps: [
        py`class DynArray:
    def __init__(self):
        self._capacity = 1
        self._size = 0
        self._data = [None] * self._capacity

    def append(self, value):
        if self._size == self._capacity:
            self._capacity *= 2
            self._data = [None] * self._capacity
        self._data[self._size] = value
        self._size += 1

    def get(self, index):
        if index < 0 or index >= self._size:
            raise IndexError("index out of range")
        return self._data[index]

    def __len__(self):
        return self._size`,
        py`class DynArray:
    _data = []

    def __init__(self):
        self._size = 0

    def append(self, value):
        self._data.append(value)
        self._size += 1

    def get(self, index):
        if index < 0 or index >= self._size:
            raise IndexError("index out of range")
        return self._data[index]

    def __len__(self):
        return self._size`,
        py`class DynArray:
    def __init__(self):
        self._capacity = 1
        self._size = 0
        self._data = [None] * self._capacity

    def append(self, value):
        if self._size == self._capacity:
            self._capacity *= 2
            new_data = [None] * self._capacity
            for i in range(self._size):
                new_data[i] = self._data[i]
            self._data = new_data
        self._data[self._size] = value
        self._size += 1

    def get(self, index):
        return self._data[index] if 0 <= index < self._size else None

    def __len__(self):
        return self._size`,
      ],
    },
  },
  {
    id: 'py-linked-lists',
    title: 'Linked lists',
    blurb: 'Nodes and pointers, and reversing a list in place without extra storage.',
    kind: 'code',
    practice: {
      prompt:
        'A singly linked list is built from `Node(val, next)` objects. Write `reverse_list(head)`, which reverses the list **in place** (by relinking `.next` pointers, not by building a new list from the values) and returns the new head.\n\nAn empty list (`head` is `None`) reverses to itself.',
      starter:
        'class Node:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    ...\n\ndef build(values):\n    head = None\n    for v in reversed(values):\n        head = Node(v, head)\n    return head\n\ndef to_list(head):\n    out = []\n    while head:\n        out.append(head.val)\n        head = head.next\n    return out\n',
      solution: py`class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    while head:
        nxt = head.next
        head.next = prev
        prev = head
        head = nxt
    return prev

def build(values):
    head = None
    for v in reversed(values):
        head = Node(v, head)
    return head

def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out`,
      samples: ['to_list(reverse_list(build([1, 2, 3, 4])))'],
      cases: [
        ['An empty list', 'to_list(reverse_list(build([])))'],
        ['A single node', 'to_list(reverse_list(build([5])))'],
        ['Two nodes', 'to_list(reverse_list(build([7, 9])))'],
        ['Several nodes', 'to_list(reverse_list(build([1, 2, 3, 4])))'],
        ['Reversing twice gives the original order', 'to_list(reverse_list(reverse_list(build([1, 2, 3]))))'],
      ],
      traps: [
        py`class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    return head

def build(values):
    head = None
    for v in reversed(values):
        head = Node(v, head)
    return head

def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out`,
        py`class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    current = head
    while current:
        current.next = prev
        prev = current
        current = current.next
    return prev

def build(values):
    head = None
    for v in reversed(values):
        head = Node(v, head)
    return head

def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out`,
        py`class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    while head and head.next:
        nxt = head.next
        head.next = prev
        prev = head
        head = nxt
    return prev

def build(values):
    head = None
    for v in reversed(values):
        head = Node(v, head)
    return head

def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out`,
      ],
    },
  },
  {
    id: 'py-stacks-queues-deques',
    title: 'Stacks, queues and deques',
    blurb: 'LIFO versus FIFO, and why list.pop(0) is a trap for a queue.',
    kind: 'code',
    practice: {
      prompt:
        'Write `balanced(s)`. `s` is text that may contain the brackets `()`, `[]` and `{}` among other characters (ignore anything else). Return `True` if every bracket is closed, in the right order, by the matching type of bracket.',
      starter: 'def balanced(s):\n    ...\n',
      solution: py`def balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack`,
      samples: ['balanced("([{}])")', 'balanced("([)]")'],
      cases: [
        ['Simple pair', 'balanced("()")'],
        ['Nested and matched', 'balanced("([{}])")'],
        ['Interleaved, wrong order', 'balanced("([)]")'],
        ['An empty string', 'balanced("")'],
        ['One unclosed open', 'balanced("(")'],
        ['One unmatched close', 'balanced(")")'],
        ['Mismatched types', 'balanced("(]")'],
        ['Other characters are ignored', 'balanced("a(b)c[d]{e}")'],
        ['Many nested pairs', 'balanced("((()))")'],
      ],
      traps: [
        py`def balanced(s):
    opens = sum(1 for ch in s if ch in "([{")
    closes = sum(1 for ch in s if ch in ")]}")
    return opens == closes`,
        py`def balanced(s):
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack:
                return False
            stack.pop()
    return not stack`,
        py`def balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack or stack.pop() != pairs[ch]:
                return False
    return True`,
      ],
    },
    real: [
      chi({
        title: 'Undo history of playlist edits',
        use: ['tracks'],
        hidden: 'edits = [t["Name"] for t in tracks[:6]]\n',
        starter: 'stack = []\nfor e in edits:\n    stack.append(e)\n\nanswer = None\n',
        given: '# edits is a list of 6 track names, applied in order as edits to a playlist name.',
        brief:
          'Push each of the 6 edits onto a stack, in order. Then **undo the last 2 edits** (pop them off). Store in `answer` the list of edits still active, from oldest (bottom) to newest (top).',
        reference: py`stack = []
for e in edits:
    stack.append(e)

for _ in range(2):
    stack.pop()

answer = stack`,
        walkthrough: 'A stack is exactly an undo history: the most recent action is on top, so undoing means popping from the end, never from the front.',
        traps: [
          py`stack = []
for e in edits:
    stack.append(e)

for _ in range(2):
    stack.pop(0)

answer = stack`,
          py`stack = []
for e in edits:
    stack.append(e)

for _ in range(3):
    stack.pop()

answer = stack`,
        ],
      }),
      chi({
        title: 'Queue of pending invoices',
        use: ['invoices'],
        hidden: 'from collections import deque\n',
        starter: 'ids = [inv["InvoiceId"] for inv in invoices[:8]]\nqueue = deque(ids)\n\nanswer = None\n',
        given: '# ids holds the first 8 InvoiceIds, in arrival order. deque is already imported.',
        brief: 'Process the queue in **FIFO** order: remove the first 3 pending invoices (they have been handled). Store in `answer` the `InvoiceId`s still waiting, in their original order.',
        reference: py`ids = [inv["InvoiceId"] for inv in invoices[:8]]
queue = deque(ids)

for _ in range(3):
    queue.popleft()

answer = list(queue)`,
        walkthrough: 'A FIFO queue serves the oldest item first, so processing means `popleft()`. Using `pop()` (from the right) would serve the newest arrivals first, which is a stack, not a queue.',
        traps: [
          py`ids = [inv["InvoiceId"] for inv in invoices[:8]]
queue = deque(ids)

for _ in range(3):
    queue.pop()

answer = list(queue)`,
          py`ids = [inv["InvoiceId"] for inv in invoices[:8]]
queue = deque(ids)

for _ in range(2):
    queue.popleft()

answer = list(queue)`,
        ],
      }),
      chi({
        title: 'Next greater popularity',
        use: ['tracks'],
        hidden: '',
        starter: 'pool = tracks[:15]\ndurations = [t["Milliseconds"] for t in pool]\nnames = [t["Name"] for t in pool]\n\nanswer = None\n',
        given: '# pool is the first 15 tracks. durations and names line up by position.',
        brief:
          'For each track, using a **monotonic stack** (not nested loops), find the name of the next later track with a **strictly longer** duration (`Milliseconds`), or `None` if there is none. Store in `answer` the list of 15 results, in the original order.',
        reference: py`pool = tracks[:15]
durations = [t["Milliseconds"] for t in pool]
names = [t["Name"] for t in pool]

result = [None] * len(durations)
stack = []
for i, d in enumerate(durations):
    while stack and durations[stack[-1]] < d:
        j = stack.pop()
        result[j] = names[i]
    stack.append(i)

answer = result`,
        walkthrough: 'The stack holds indices whose "next greater" is not yet known, from largest duration to smallest going down the stack. A new, longer track resolves every shorter one still waiting on top of the stack — that is why it is a `while`, not an `if`.',
        traps: [
          py`pool = tracks[:15]
durations = [t["Milliseconds"] for t in pool]
names = [t["Name"] for t in pool]

result = [None] * len(durations)
stack = []
for i in range(len(durations) - 1, -1, -1):
    d = durations[i]
    while stack and durations[stack[-1]] < d:
        j = stack.pop()
        result[j] = names[i]
    stack.append(i)

answer = result`,
          py`pool = tracks[:15]
durations = [t["Milliseconds"] for t in pool]
names = [t["Name"] for t in pool]

result = [None] * len(durations)
stack = []
for i, d in enumerate(durations):
    if stack and durations[stack[-1]] < d:
        j = stack.pop()
        result[j] = names[i]
    stack.append(i)

answer = result`,
        ],
      }),
    ],
  },
  {
    id: 'py-hash-tables-under-the-hood',
    title: 'Hash tables: dicts and sets under the hood',
    blurb: 'Hashing, buckets, collisions, load factor, and why keys must be hashable.',
    kind: 'learn',
    check: [
      {
        q: 'What makes dict/set lookups fast (O(1) on average) instead of O(n)?',
        options: [
          'Python secretly keeps them sorted',
          "A key's hash tells Python roughly which bucket to look in directly, instead of scanning every entry",
          'They are actually linked lists internally',
          'Python caches every lookup result forever',
        ],
        answer: 1,
        why: "Hashing converts a key into a number that picks a bucket. Most of the time that bucket has zero or one entries, so there is nothing to scan.",
      },
      {
        q: 'What is a hash collision?',
        options: [
          'When two dicts have the same keys',
          'When two different keys hash to the same bucket, and the table must handle both',
          'A runtime error',
          'When a set is converted to a list',
        ],
        answer: 1,
        why: 'Collisions are expected and handled (CPython uses open addressing: it probes for another free slot). Too many collisions is what makes a hash table slow.',
      },
      {
        q: 'Why must dictionary keys (and set elements) be hashable?',
        options: [
          'They do not have to be',
          "The hash decides which bucket to search, so a key's hash — and its equality — must never change while it is stored",
          'Hashable just means "a string or a number"',
          'To save memory',
        ],
        answer: 1,
        why: "If a key's hash could change after insertion (as a mutable list's would), the table would be looking in the wrong bucket the next time. That is why lists are unhashable but tuples are.",
      },
      {
        q: 'What is the "load factor" of a hash table, roughly?',
        options: [
          'The number of keys divided by the number of available slots',
          'The time it takes to hash one key',
          'The number of collisions per second',
          'The size of the largest value stored',
        ],
        answer: 0,
        why: 'A high load factor means the table is getting full, which means more collisions and slower operations — so implementations resize (grow) once the load factor crosses a threshold.',
      },
      {
        q: 'Since Python 3.7, iterating over a plain dict yields its keys in which order?',
        options: [
          'Random order, reshuffled every run',
          'Alphabetical order of the keys',
          'Insertion order — the order the keys were first added',
          'Order of the keys\' hash values',
        ],
        answer: 2,
        why: 'Dicts remember insertion order as a language guarantee. Plain sets make no such promise — do not rely on the order you get when iterating a set.',
      },
    ],
  },
  {
    id: 'py-hash-problem-patterns',
    title: 'Hash-based problem patterns',
    blurb: 'Two-sum, frequency maps and the "have I seen this before" pattern.',
    kind: 'code',
    practice: {
      prompt:
        'Write `two_sum(nums, target)`. Return a list `[i, j]` with `i < j` such that `nums[i] + nums[j] == target`, using **one pass with a dict** (not nested loops). Return `None` if no pair works. If several pairs work, return the one found with the **smallest `j`**.',
      starter: 'def two_sum(nums, target):\n    ...\n',
      solution: py`def two_sum(nums, target):
    seen = {}
    for j, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], j]
        seen[n] = j
    return None`,
      samples: ['two_sum([2, 7, 11, 15], 9)'],
      cases: [
        ['A simple pair', 'two_sum([2, 7, 11, 15], 9)'],
        ['No pair works', 'two_sum([1, 2, 3], 100)'],
        ['The smallest j wins when several pairs work', 'two_sum([3, 3, 4, 5], 6)'],
        ['A pair uses the same value twice, at different positions', 'two_sum([5, 5], 10)'],
        ['Negative numbers', 'two_sum([-3, 4, 1, 2], -1)'],
        ['An empty list', 'two_sum([], 5)'],
      ],
      traps: [
        py`def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [j, i]
    return None`,
        py`def two_sum(nums, target):
    seen = {}
    for j, n in enumerate(nums):
        if n in seen:
            return [seen[n], j]
        seen[n] = j
    return None`,
        py`def two_sum(nums, target):
    seen = {}
    for j, n in enumerate(nums):
        need = target - n
        seen[n] = j
        if need in seen:
            return [seen[need], j]
    return None`,
      ],
    },
  },
]
