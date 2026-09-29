import { py, chi } from './common.js'

export const dataStructuresLessonsB = [
  {
    id: 'py-heaps-priority-queues',
    title: 'Heaps and priority queues',
    blurb: 'A binary heap in an array, heapq, and keeping only the top k without sorting everything.',
    kind: 'code',
    practice: {
      prompt:
        'Write `top_k_songs(stream, k)`. `stream` is a list of numbers (streaming counts) arriving one at a time. Using a **min-heap of size k** (not full sorting), return the `k` **largest** values, ordered **largest first**.\n\nIf `k <= 0`, return `[]`. If `k` is at least the length of `stream`, return every value, largest first.',
      starter: 'import heapq\n\ndef top_k_songs(stream, k):\n    ...\n',
      solution: py`import heapq

def top_k_songs(stream, k):
    if k <= 0:
        return []
    heap = []
    for v in stream:
        heapq.heappush(heap, v)
        if len(heap) > k:
            heapq.heappop(heap)
    return sorted(heap, reverse=True)`,
      samples: ['top_k_songs([5, 1, 9, 3, 7, 2], 3)'],
      cases: [
        ['The three largest, largest first', 'top_k_songs([5, 1, 9, 3, 7, 2], 3)'],
        ['k of zero', 'top_k_songs([5, 1, 9], 0)'],
        ['k larger than the stream', 'top_k_songs([4, 2], 10)'],
        ['An empty stream', 'top_k_songs([], 3)'],
        ['Repeated values', 'top_k_songs([5, 5, 5, 1], 2)'],
        ['k of one', 'top_k_songs([3, 9, 1, 7], 1)'],
      ],
      traps: [
        py`import heapq

def top_k_songs(stream, k):
    if k <= 0:
        return []
    heap = []
    for v in stream:
        heapq.heappush(heap, v)
        if len(heap) > k:
            heapq.heappop(heap)
    return sorted(heap)`,
        py`import heapq

def top_k_songs(stream, k):
    if k <= 0:
        return []
    heap = []
    for v in stream:
        heapq.heappush(heap, v)
        if len(heap) >= k:
            heapq.heappop(heap)
    return sorted(heap, reverse=True)`,
        py`def top_k_songs(stream, k):
    if k <= 0:
        return []
    return sorted(stream)[:k]`,
      ],
    },
    real: [
      chi({
        title: 'Top k tracks by length, without sorting everything',
        use: ['tracks'],
        hidden: 'import heapq\npool = tracks[:200]\n',
        starter: 'k = 5\nheap = []\n\nanswer = None\n',
        given: '# pool is the first 200 tracks. heapq is already imported. k is 5.',
        brief:
          'Using a **heap of size k** (never holding more than 5 items at once), find the 5 **longest** tracks by `Milliseconds`. Store in `answer` the list of `(Name, Milliseconds)` tuples, **longest first**.',
        reference: py`k = 5
heap = []
for t in pool:
    heapq.heappush(heap, (t["Milliseconds"], t["Name"]))
    if len(heap) > k:
        heapq.heappop(heap)

top = sorted(heap, reverse=True)
answer = [(name, ms) for ms, name in top]`,
        walkthrough: 'Pushing a `(Milliseconds, Name)` tuple sorts by length first. Popping whenever the heap exceeds size 5 keeps only the 5 longest seen so far, in O(n log k) instead of sorting all 200.',
        traps: [
          py`k = 5
heap = []
for t in pool:
    heapq.heappush(heap, (t["Milliseconds"], t["Name"]))
    if len(heap) >= k:
        heapq.heappop(heap)

top = sorted(heap, reverse=True)
answer = [(name, ms) for ms, name in top]`,
          py`k = 5
heap = []
for t in pool:
    heapq.heappush(heap, (t["Milliseconds"], t["Name"]))
    if len(heap) > k:
        heapq.heappop(heap)

top = sorted(heap)
answer = [(name, ms) for ms, name in top]`,
        ],
      }),
      chi({
        title: 'Merge two sorted invoice lists',
        use: ['invoices'],
        hidden: 'import heapq\na = sorted(inv["Total"] for inv in invoices[:20])\nb = sorted(inv["Total"] for inv in invoices[20:35])\n',
        starter: 'answer = None\n',
        given: '# a and b are each already sorted lists of invoice totals. heapq is already imported.',
        brief: 'Merge `a` and `b` into one sorted list using `heapq.merge` (not by concatenating and re-sorting). Store the merged list in `answer`.',
        reference: 'answer = list(heapq.merge(a, b))',
        walkthrough: '`heapq.merge` walks both already-sorted inputs together in O(n + m), never needing to look at the whole combined list twice the way concatenate-then-sort does.',
        traps: ['answer = sorted(a + b, reverse=True)', 'answer = a + b'],
      }),
      chi({
        title: 'Running median of streaming totals',
        use: ['invoices'],
        hidden: 'import heapq\nstream = [inv["Total"] for inv in invoices[:11]]\n',
        starter: 'lo = []\nhi = []\nmedians = []\n\nanswer = None\n',
        given: '# stream is 11 invoice totals, arriving one at a time. lo is a max-heap (store negated values), hi is a min-heap.',
        brief:
          'Track the **running median** as each value in `stream` arrives, using two heaps: `lo` (the smaller half, as a max-heap of negated values) and `hi` (the larger half, a plain min-heap). Keep them balanced so their sizes never differ by more than 1. Store in `answer` the list of 11 running medians (one after each value arrives), each **rounded to 1 decimal**.',
        reference: py`lo = []
hi = []
medians = []

for v in stream:
    if not lo or v <= -lo[0]:
        heapq.heappush(lo, -v)
    else:
        heapq.heappush(hi, v)

    if len(lo) > len(hi) + 1:
        heapq.heappush(hi, -heapq.heappop(lo))
    elif len(hi) > len(lo):
        heapq.heappush(lo, -heapq.heappop(hi))

    if len(lo) > len(hi):
        medians.append(round(-lo[0], 1))
    else:
        medians.append(round((-lo[0] + hi[0]) / 2, 1))

answer = medians`,
        walkthrough: '`lo` holds the smaller half (as negatives, so its largest is on top), `hi` holds the larger half. Rebalancing after every insert keeps the median always at the top of one or both heaps — an O(log n) update instead of re-sorting the whole stream each time.',
        traps: [
          py`lo = []
hi = []
medians = []

for v in stream:
    heapq.heappush(lo, -v)
    if len(lo) > len(hi) + 1:
        heapq.heappush(hi, -heapq.heappop(lo))

    if len(lo) > len(hi):
        medians.append(round(-lo[0], 1))
    else:
        medians.append(round((-lo[0] + hi[0]) / 2, 1))

answer = medians`,
          py`lo = []
hi = []
medians = []

for v in stream:
    if not lo or v <= -lo[0]:
        heapq.heappush(lo, -v)
    else:
        heapq.heappush(hi, v)

    if len(lo) > len(hi) + 1:
        heapq.heappush(hi, -heapq.heappop(lo))
    elif len(hi) > len(lo):
        heapq.heappush(lo, -heapq.heappop(hi))

    medians.append(round(-lo[0], 1))

answer = medians`,
        ],
      }),
    ],
  },
  {
    id: 'py-trees-bst',
    title: 'Trees and binary search trees',
    blurb: 'Nodes, recursive traversals, and why in-order traversal of a BST is always sorted.',
    kind: 'code',
    practice: {
      prompt:
        'Write `inorder(values)`. Build a binary search tree by **inserting `values` in order** (equal values go to the right), then return its **in-order traversal** as a list.',
      starter:
        'class BSTNode:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\ndef insert(root, val):\n    ...\n\ndef inorder(values):\n    ...\n',
      solution: py`class BSTNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return BSTNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def inorder(values):
    root = None
    for v in values:
        root = insert(root, v)

    result = []

    def walk(node):
        if node is None:
            return
        walk(node.left)
        result.append(node.val)
        walk(node.right)

    walk(root)
    return result`,
      samples: ['inorder([5, 3, 8, 1, 4, 7, 9])'],
      cases: [
        ['A mixed insert order', 'inorder([5, 3, 8, 1, 4, 7, 9])'],
        ['Already sorted input', 'inorder([1, 2, 3, 4])'],
        ['Reverse sorted input', 'inorder([4, 3, 2, 1])'],
        ['An empty list', 'inorder([])'],
        ['A single value', 'inorder([9])'],
        ['Duplicate values stay grouped and sorted', 'inorder([5, 3, 5, 3, 5])'],
      ],
      traps: [
        py`class BSTNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return BSTNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def inorder(values):
    root = None
    for v in values:
        root = insert(root, v)

    result = []

    def walk(node):
        if node is None:
            return
        result.append(node.val)
        walk(node.left)
        walk(node.right)

    walk(root)
    return result`,
        py`class BSTNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return BSTNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def inorder(values):
    root = None
    for v in values:
        root = insert(root, v)

    result = []

    def walk(node):
        if node is None:
            return
        walk(node.left)
        walk(node.right)
        result.append(node.val)

    walk(root)
    return result`,
        py`def inorder(values):
    return list(values)`,
      ],
    },
  },
  {
    id: 'py-tries-and-specialised-structures',
    title: 'Tries, segment trees and other specialised structures',
    blurb: 'A trie for prefixes, and a quick look at segment trees, Fenwick trees and union-find.',
    kind: 'code',
    practice: {
      prompt:
        'Build a trie from `words`, then write `with_prefix(words, prefix)`: return the **sorted** list of every word that starts with `prefix`. An empty `prefix` matches every word.',
      starter:
        'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_word = False\n\ndef with_prefix(words, prefix):\n    ...\n',
      solution: py`class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

def with_prefix(words, prefix):
    root = TrieNode()
    for w in words:
        node = root
        for ch in w:
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True

    node = root
    for ch in prefix:
        if ch not in node.children:
            return []
        node = node.children[ch]

    result = []

    def collect(node, path):
        if node.is_word:
            result.append(prefix + path)
        for ch, child in node.children.items():
            collect(child, path + ch)

    collect(node, "")
    return sorted(result)`,
      samples: ['with_prefix(["cat", "car", "dog", "care"], "ca")'],
      cases: [
        ['A shared prefix', 'with_prefix(["cat", "car", "dog", "care"], "ca")'],
        ['A prefix matching one word', 'with_prefix(["cat", "car", "dog"], "do")'],
        ['A prefix that matches nothing', 'with_prefix(["cat", "car"], "z")'],
        ['An empty prefix matches everything, sorted', 'with_prefix(["dog", "cat", "ant"], "")'],
        ['A word that is itself a prefix of another', 'with_prefix(["ab", "abc"], "ab")'],
        ['No words at all', 'with_prefix([], "a")'],
        ['A word containing the text is not the same as starting with it', 'with_prefix(["banana", "ananas", "anagram"], "ana")'],
      ],
      traps: [
        py`class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

def with_prefix(words, prefix):
    root = TrieNode()
    for w in words:
        node = root
        for ch in w:
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True

    node = root
    for ch in prefix:
        if ch not in node.children:
            return []
        node = node.children[ch]

    result = []

    def collect(node, path):
        if node.is_word:
            result.append(prefix + path)
        for ch, child in node.children.items():
            collect(child, path + ch)

    collect(node, "")
    return result`,
        py`class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

def with_prefix(words, prefix):
    root = TrieNode()
    for w in words:
        node = root
        for ch in w:
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True

    node = root
    for ch in prefix:
        if ch not in node.children:
            return []
        node = node.children[ch]

    result = []

    def collect(node, path):
        if path and node.is_word:
            result.append(prefix + path)
        for ch, child in node.children.items():
            collect(child, path + ch)

    collect(node, "")
    return sorted(result)`,
        py`def with_prefix(words, prefix):
    return sorted(w for w in words if prefix in w)`,
      ],
    },
  },
  {
    id: 'py-graphs-representation',
    title: 'Graphs: representation and basic operations',
    blurb: 'Adjacency lists, directed versus undirected, and building a graph from edge data.',
    kind: 'code',
    practice: {
      prompt:
        'Write `build_graph(edges)`. `edges` is a list of `(a, b)` pairs. Return an **adjacency dict** mapping each node to the sorted list of its neighbours, treating every edge as **undirected** (it connects both ways).',
      starter: 'def build_graph(edges):\n    ...\n',
      solution: py`def build_graph(edges):
    graph = {}
    for a, b in edges:
        graph.setdefault(a, []).append(b)
        graph.setdefault(b, []).append(a)
    return {node: sorted(neighbours) for node, neighbours in graph.items()}`,
      samples: ['build_graph([(1, 2), (2, 3)])'],
      cases: [
        ["A node's neighbours from both sides", 'build_graph([(1, 2), (2, 3)])[2]'],
        ['Every node appears, even leaves', 'sorted(build_graph([(1, 2), (2, 3)]).keys())'],
        ['A node with several neighbours', 'build_graph([("a", "b"), ("a", "c"), ("a", "d")])["a"]'],
        ['A single edge is symmetric', 'build_graph([(1, 2)])[1] == [2] and build_graph([(1, 2)])[2] == [1]'],
        ['No edges at all', 'build_graph([])'],
        ['Neighbours come back sorted, not in edge order', 'build_graph([(5, 1), (5, 9), (5, 3)])[5]'],
      ],
      traps: [
        py`def build_graph(edges):
    graph = {}
    for a, b in edges:
        graph.setdefault(a, []).append(b)
    return {node: sorted(neighbours) for node, neighbours in graph.items()}`,
        py`def build_graph(edges):
    graph = {}
    for a, b in edges:
        graph[a] = [b]
        graph[b] = [a]
    return {node: sorted(neighbours) for node, neighbours in graph.items()}`,
        py`def build_graph(edges):
    graph = {}
    for a, b in edges:
        graph.setdefault(a, []).append(b)
        graph.setdefault(b, []).append(a)
    return graph`,
      ],
    },
    real: [
      chi({
        title: 'The airport route graph',
        use: [],
        hidden: 'routes = [("JFK", "LAX"), ("JFK", "ORD"), ("LAX", "SFO"), ("ORD", "DFW"), ("DFW", "LAX")]\n',
        starter: 'graph = {}\nfor a, b in routes:\n    ...\n\nanswer = None\n',
        given: '# routes is a list of (origin, destination) pairs, each a direct flight both ways.',
        brief: 'Build the adjacency dict for `routes` (undirected). Store in `answer` the **sorted list of airports directly reachable from "LAX"**.',
        reference: py`graph = {}
for a, b in routes:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)

answer = sorted(graph["LAX"])`,
        walkthrough: 'Each route is added in both directions, since a flight route can be flown either way. "LAX" then shows up as a neighbour of everything it connects to.',
        traps: [
          py`graph = {}
for a, b in routes:
    graph.setdefault(a, []).append(b)

answer = sorted(graph.get("LAX", []))`,
          py`graph = {}
for a, b in routes:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)

answer = sorted(set(graph["LAX"]))[:1]`,
        ],
      }),
      chi({
        title: 'A shared-genre graph of tracks',
        use: ['tracks'],
        hidden:
          'pool = tracks[:40]\nedges = []\nfor i in range(len(pool)):\n    for j in range(i + 1, len(pool)):\n        if pool[i]["GenreId"] == pool[j]["GenreId"]:\n            edges.append((pool[i]["TrackId"], pool[j]["TrackId"]))\n',
        starter: 'answer = None\n',
        given: '# edges connects two tracks whenever they share the same GenreId.',
        brief: 'Build the undirected adjacency dict from `edges`. Store in `answer` the **number of tracks that have at least one shared-genre neighbour** (nodes with a non-empty neighbour list).',
        reference: py`graph = {}
for a, b in edges:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)

answer = len(graph)`,
        walkthrough: 'Every track that appears as either side of an edge gets an entry in the adjacency dict, so the number of keys is exactly the number of tracks with at least one shared-genre connection.',
        traps: [
          'graph = {}\nfor a, b in edges:\n    graph.setdefault(a, []).append(b)\n\nanswer = len(graph)',
          'answer = len(edges)',
        ],
      }),
      chi({
        title: 'Hubs by degree',
        use: [],
        hidden:
          'routes = [("CVG", "X1"), ("CVG", "X2"), ("CVG", "X3"), ("ATL", "X1"), ("ATL", "X2"), ("ATL", "X3"), ("X1", "X2")]\n',
        starter: 'graph = {}\nfor a, b in routes:\n    ...\n\nanswer = None\n',
        given: '# routes is a list of (origin, destination) pairs, each a direct flight both ways.',
        brief:
          'Build the adjacency dict. The **degree** of an airport is the number of neighbours it has. Store in `answer` the airport with the **highest degree** (break ties by picking the alphabetically first).',
        reference: py`graph = {}
for a, b in routes:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)

answer = min(graph, key=lambda node: (-len(graph[node]), node))`,
        walkthrough: 'A tuple sort key with a negated count sorts by degree descending first, then alphabetically to break ties — `min` on that key is the same as "highest degree, then earliest alphabetically".',
        traps: [
          py`graph = {}
for a, b in routes:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)

answer = max(graph, key=lambda node: len(graph[node]))`,
          py`graph = {}
for a, b in routes:
    graph.setdefault(a, []).append(b)
    graph.setdefault(b, []).append(a)

answer = min(graph, key=lambda node: len(graph[node]))`,
        ],
      }),
    ],
  },
  {
    id: 'py-union-find',
    title: 'Union-find (disjoint sets)',
    blurb: 'Find with path compression, union, and counting connected components.',
    kind: 'code',
    practice: {
      prompt:
        'Write `count_groups(n, pairs)`. There are `n` items, labelled `0` to `n - 1`. Each `(a, b)` in `pairs` unions the groups containing `a` and `b`. Using union-find, return the **number of distinct groups** after every union.',
      starter: 'def count_groups(n, pairs):\n    ...\n',
      solution: py`def count_groups(n, pairs):
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    for a, b in pairs:
        union(a, b)

    return len({find(i) for i in range(n)})`,
      samples: ['count_groups(5, [(0, 1), (1, 2)])'],
      cases: [
        ['A chain of unions merges three into one group', 'count_groups(5, [(0, 1), (1, 2)])'],
        ['No unions at all', 'count_groups(4, [])'],
        ['Two separate pairs', 'count_groups(4, [(0, 1), (2, 3)])'],
        ['A single item', 'count_groups(1, [])'],
        ['Unioning the same pair twice changes nothing further', 'count_groups(3, [(0, 1), (0, 1)])'],
        ['Everything ends up in one group', 'count_groups(6, [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5)])'],
        ['A later union must reach the current root, not the raw index', 'count_groups(4, [(0, 1), (1, 2), (0, 3)])'],
      ],
      traps: [
        py`def count_groups(n, pairs):
    parent = list(range(n))

    def union(a, b):
        parent[a] = b

    for a, b in pairs:
        union(a, b)

    return len(set(parent))`,
        py`def count_groups(n, pairs):
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        parent[a] = a

    for a, b in pairs:
        union(a, b)

    return len({find(i) for i in range(n)})`,
        py`def count_groups(n, pairs):
    return n - len(pairs)`,
      ],
    },
  },
]
