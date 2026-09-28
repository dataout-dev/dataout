import { dat, py } from './common.js'

const num = (c) => dat({ ...c, hidden: 'import pandas as pd\nimport numpy as np\nimport io\nimport networkx as nx\n' + (c.hidden ?? '') })

export const sourcesLessonsB = [
  {
    id: 'py-etl-pipelines',
    title: 'Data pipelines: ETL patterns and idempotence',
    blurb: 'Extract-transform-load, idempotent and re-runnable steps, and testing pipelines.',
    kind: 'learn',
    check: [
      {
        q: 'What do the three letters in "ETL" stand for?',
        options: [
          'Encode, Transfer, Log',
          'Extract (get the data from a source), Transform (clean and reshape it), Load (write it to its destination)',
          'Every Table Loaded',
          'Extract, Test, Launch',
        ],
        answer: 1,
        why: 'ETL names the three standard stages of moving data from a source system into a place it can be analysed: pull it out, reshape it, then store the result.',
      },
      {
        q: 'What does it mean for a pipeline step to be "idempotent"?',
        options: [
          'It runs faster every time',
          "Running it again with the same input produces the same end result as running it once, without duplicating or corrupting data — safe to re-run after a failure",
          'It can only be run exactly once, ever',
          'It uses less memory than a normal step',
        ],
        answer: 1,
        why: 'A pipeline will eventually need to be re-run (after a crash, a bug fix, or reprocessing old data); an idempotent step handles that safely, rather than double-counting or duplicating rows.',
      },
      {
        q: 'Why is a non-idempotent "append new rows" load step risky?',
        options: [
          'It is never risky',
          "If the same batch is accidentally loaded twice (a retried job, a re-run after a partial failure), every row in it gets duplicated, silently corrupting downstream totals",
          'It only affects the first run, never later ones',
          'Appending is always safer than any other approach',
        ],
        answer: 1,
        why: 'A plain append has no memory of what was already loaded; re-running it after a failure (unless the failure is known to have loaded nothing at all) risks counting the same rows twice.',
      },
      {
        q: 'What is the difference between a batch pipeline and a streaming one?',
        options: [
          'They are the same thing',
          'A batch pipeline processes a chunk of accumulated data on a schedule (hourly, daily); a streaming pipeline processes each new event as it arrives, continuously',
          'Streaming pipelines cannot use SQL',
          'Batch pipelines are always faster',
        ],
        answer: 1,
        why: 'Batch and streaming trade off latency against complexity: batch is simpler and fine when "once an hour" or "once a day" is fast enough; streaming reacts immediately but is harder to build and reason about.',
      },
      {
        q: 'Why test a data pipeline, not just the final report it produces?',
        options: [
          'Pipelines never have bugs worth testing',
          "A bug in an early transform step can silently produce a plausible-looking but wrong result; testing each step (and using staging tables to inspect intermediate output) catches problems closer to where they actually happen",
          'Testing pipelines is only useful for pipelines with no transform step',
          'The final report is always correct if the source data is correct',
        ],
        answer: 1,
        why: "A wrong join, an unintended filter, or a type-conversion bug can all produce output that looks reasonable at a glance — testing intermediate steps (or comparing against a small, hand-checked expected result) catches these before they reach a final report.",
      },
    ],
  },
  {
    id: 'py-columnar-formats',
    title: 'Columnar formats: Parquet and Arrow',
    blurb: 'Row versus column storage, compression, predicate pushdown, and partitioning.',
    kind: 'learn',
    check: [
      {
        q: 'What is the core difference between row-oriented and column-oriented storage?',
        options: [
          'There is no real difference',
          "Row-oriented storage keeps each row's values together on disk; column-oriented storage keeps each column's values together, which suits analytical queries that scan one or a few columns across many rows",
          'Column-oriented storage cannot store text',
          'Row-oriented storage is always faster',
        ],
        answer: 1,
        why: "Analytical queries ('average of this one column, across a billion rows') only need to read that column; column-oriented formats let them skip every other column entirely, which row-oriented storage cannot do as efficiently.",
      },
      {
        q: 'Why does Parquet typically compress better than CSV for the same data?',
        options: [
          'Parquet does not actually compress data',
          "Storing each column's values together, all of the same type, lets compression algorithms exploit patterns within that column (repeated values, small ranges) far more effectively than mixed, row-by-row text",
          'CSV is always smaller than Parquet',
          'Compression only works on numeric columns',
        ],
        answer: 1,
        why: 'A column of repeated categories, or of similar numbers, compresses much better when stored contiguously than when interleaved with unrelated values from other columns, as CSV effectively does row by row.',
      },
      {
        q: 'What does "predicate pushdown" mean for a query over Parquet files?',
        options: [
          'It slows down every query',
          'A filter condition (a "predicate") can be applied while reading, using stored per-column statistics to skip whole chunks of data that could not possibly match, without reading them at all',
          'It only works for text columns',
          'It requires rewriting the file first',
        ],
        answer: 1,
        why: 'Parquet stores min/max statistics per chunk; a query engine can check a filter against those statistics and skip reading chunks that cannot contain a match, without touching most of the actual data.',
      },
      {
        q: 'Why is Arrow often described as a "bridge" between tools like pandas, Polars and Spark?',
        options: [
          'Arrow is a file format that replaces all others',
          "Arrow defines a shared, in-memory columnar layout that multiple tools can read and write directly, avoiding the cost of converting between each tool's own internal representation",
          'Arrow only works within a single programming language',
          'Arrow requires data to be written to disk first',
        ],
        answer: 1,
        why: 'When two tools both understand the Arrow in-memory format, data can move between them without a slow serialise/deserialise step — the "bridge" is skipping that conversion cost entirely.',
      },
      {
        q: 'Why can partitioning a dataset into many small Parquet files hurt performance?',
        options: [
          'It never hurts performance',
          'Each file has its own fixed overhead (metadata, open/close cost); with too many tiny files, that per-file overhead can dominate over the actual data being read',
          'Partitioning is only relevant for CSV',
          'Small files always compress better',
        ],
        answer: 1,
        why: 'Partitioning (by date, say) helps skip irrelevant data entirely, but taken too far it creates many small files whose per-file overhead outweighs the benefit — a real balance to strike, not an unlimited win.',
      },
    ],
  },
  {
    id: 'py-chunking-generators',
    title: 'Working beyond memory: chunking, generators and out-of-core ideas',
    blurb: 'Reading in chunks, streaming aggregation, and generators over files.',
    kind: 'code',
    practice: {
      prompt: 'Write `chunked_total(text, n)`: given CSV text with a `"value"` column, sum the column by reading it in chunks of `n` rows at a time (using `pd.read_csv(..., chunksize=n)`), without loading the whole thing into one DataFrame at once. Return the total as a plain float.',
      starter: 'import pandas as pd\nimport io\n\ndef chunked_total(text, n):\n    ...\n',
      solution: py`import pandas as pd
import io

def chunked_total(text, n):
    total = 0.0
    for chunk in pd.read_csv(io.StringIO(text), chunksize=n):
        total += chunk["value"].sum()
    return float(total)`,
      samples: ['chunked_total("value\\n1\\n2\\n3\\n4\\n5", 2)'],
      cases: [
        ['Several chunks', 'chunked_total("value\\n1\\n2\\n3\\n4\\n5", 2)'],
        ['One row per chunk', 'chunked_total("value\\n10\\n20\\n30", 1)'],
        ['A chunk size larger than the data', 'chunked_total("value\\n1\\n2", 100)'],
        ['Floats', 'chunked_total("value\\n1.5\\n2.5\\n3.0", 2)'],
      ],
      traps: [
        py`import pandas as pd
import io

def chunked_total(text, n):
    total = 0.0
    for chunk in pd.read_csv(io.StringIO(text), chunksize=n):
        total += chunk["value"].mean()
    return float(total)`,
        py`import pandas as pd
import io

def chunked_total(text, n):
    total = 0.0
    for chunk in pd.read_csv(io.StringIO(text), chunksize=n):
        total = chunk["value"].sum()
    return float(total)`,
      ],
    },
    real: [
      num({
        title: 'Summing real track prices in chunks',
        use: ['tracks'],
        starter: 'lines = ["price"] + [str(t["UnitPrice"]) for t in tracks[:97]]\ntext = "\\n".join(lines)\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. text already holds 97 real prices as CSV text.',
        brief: 'Sum the `price` column reading `text` in chunks of 10 rows at a time. Store the total, rounded to 2 decimals, in `answer`.',
        reference: py`lines = ["price"] + [str(t["UnitPrice"]) for t in tracks[:97]]
text = "\n".join(lines)
total = 0.0
for chunk in pd.read_csv(io.StringIO(text), chunksize=10):
    total += chunk["price"].sum()
answer = round(float(total), 2)`,
        walkthrough: 'The running total only ever needs the current chunk in memory at once — the same total results whether the file is read all at once or ten rows at a time.',
        traps: [py`lines = ["price"] + [str(t["UnitPrice"]) for t in tracks[:97]]
text = "\n".join(lines)
total = 0.0
for chunk in pd.read_csv(io.StringIO(text), chunksize=10):
    total = chunk["price"].sum()
answer = round(float(total), 2)`],
      }),
      num({
        title: 'Counting rows with a generator, not a list',
        use: ['tracks'],
        starter: 'lines = ["name"] + [t["Name"].replace(",", "") for t in tracks[:200]]\ntext = "\\n".join(lines)\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. text already holds 200 real track names as CSV text.',
        brief: 'Using a **generator expression** (not a list comprehension), count how many lines of `text` are data rows (excluding the header). Store the count, as an `int`, in `answer`.',
        reference: py`lines = ["name"] + [t["Name"].replace(",", "") for t in tracks[:200]]
text = "\n".join(lines)
row_lines = (line for line in text.splitlines()[1:])
answer = sum(1 for _ in row_lines)`,
        walkthrough: 'A generator expression (`(x for x in ...)`, round parentheses) produces items one at a time without ever building the whole list in memory — the same idea `chunksize` applies to reading a file.',
        traps: [py`lines = ["name"] + [t["Name"].replace(",", "") for t in tracks[:200]]
text = "\n".join(lines)
row_lines = (line for line in text.splitlines())
answer = sum(1 for _ in row_lines)`],
      }),
      num({
        title: 'Streaming aggregation by carrier',
        use: ['flights'],
        starter: 'lines = ["carrier,delay"] + [f\'{f["carrier"]},{f["dep_delay"]}\' for f in flights[:150] if f["dep_delay"] is not None]\ntext = "\\n".join(lines)\nanswer = ...\n',
        given: '# flights is a list of dictionaries. text already holds up to 150 real (carrier, delay) rows as CSV text.',
        brief: 'Reading `text` in chunks of 20 rows, maintain a running **sum and count per carrier** (a plain dict of `[sum, count]`), without ever loading the whole file into one DataFrame. Store the final average delay per carrier, rounded to 2 decimals, as a dict, in `answer`.',
        reference: py`lines = ["carrier,delay"] + [f'{f["carrier"]},{f["dep_delay"]}' for f in flights[:150] if f["dep_delay"] is not None]
text = "\n".join(lines)
totals = {}
for chunk in pd.read_csv(io.StringIO(text), chunksize=20):
    for carrier, group in chunk.groupby("carrier"):
        if carrier not in totals:
            totals[carrier] = [0.0, 0]
        totals[carrier][0] += group["delay"].sum()
        totals[carrier][1] += len(group)
answer = {c: round(s / n, 2) for c, (s, n) in totals.items()}`,
        walkthrough: 'Keeping a running `[sum, count]` per carrier, updated chunk by chunk, computes the same per-carrier averages as loading everything at once, while never holding more than one chunk in memory.',
        traps: [py`lines = ["carrier,delay"] + [f'{f["carrier"]},{f["dep_delay"]}' for f in flights[:150] if f["dep_delay"] is not None]
text = "\n".join(lines)
totals = {}
for chunk in pd.read_csv(io.StringIO(text), chunksize=20):
    for carrier, group in chunk.groupby("carrier"):
        totals[carrier] = [group["delay"].sum(), len(group)]
answer = {c: round(s / n, 2) for c, (s, n) in totals.items()}`],
      }),
    ],
  },
  {
    id: 'py-networkx',
    title: 'Graphs and networks with NetworkX',
    blurb: 'Nodes, edges, degree and centrality, shortest paths, and connected components.',
    kind: 'code',
    practice: {
      prompt: 'Write `route_length(routes, a, b)`: given `routes`, a list of `(origin, dest)` pairs, build an undirected graph and return the shortest-path **length** (number of edges) between airports `a` and `b`.',
      starter: 'import networkx as nx\n\ndef route_length(routes, a, b):\n    ...\n',
      solution: py`import networkx as nx

def route_length(routes, a, b):
    G = nx.Graph()
    G.add_edges_from(routes)
    return nx.shortest_path_length(G, a, b)`,
      samples: ["route_length([('JFK', 'LAX'), ('LAX', 'SFO')], 'JFK', 'SFO')"],
      cases: [
        ['A path through one intermediate stop', "route_length([('JFK', 'LAX'), ('LAX', 'SFO')], 'JFK', 'SFO')"],
        ['A direct route', "route_length([('JFK', 'LAX')], 'JFK', 'LAX')"],
        ['Order does not matter for an undirected graph', "route_length([('JFK', 'LAX')], 'LAX', 'JFK')"],
        ['A longer chain', "route_length([('A', 'B'), ('B', 'C'), ('C', 'D')], 'A', 'D')"],
      ],
      traps: [
        py`import networkx as nx

def route_length(routes, a, b):
    G = nx.DiGraph()
    G.add_edges_from(routes)
    return nx.shortest_path_length(G, a, b)`,
        py`import networkx as nx

def route_length(routes, a, b):
    G = nx.Graph()
    G.add_edges_from(routes)
    return len(nx.shortest_path(G, a, b))`,
      ],
    },
    real: [
      num({
        title: 'Airport hubs by degree',
        use: ['flights'],
        starter: 'routes = list({(f["origin"], f["dest"]) for f in flights[:500]})\nanswer = ...\n',
        given: '# flights is a list of dictionaries. routes already holds up to 500 real, distinct (origin, dest) pairs.',
        brief: 'Build a graph from `routes`, and store the airport with the **highest degree** (most distinct connections), as a plain string, in `answer`.',
        reference: py`routes = list({(f["origin"], f["dest"]) for f in flights[:500]})
G = nx.Graph()
G.add_edges_from(routes)
degrees = dict(G.degree())
answer = str(max(degrees, key=degrees.get))`,
        walkthrough: 'A node\'s degree is simply how many edges touch it — the airport with the most direct routes to distinct destinations in this sample.',
        traps: [py`routes = list({(f["origin"], f["dest"]) for f in flights[:500]})
G = nx.Graph()
G.add_edges_from(routes)
degrees = dict(G.degree())
answer = str(min(degrees, key=degrees.get))`],
      }),
      num({
        title: 'Shortest connections from JFK',
        use: ['flights'],
        starter: 'routes = list({(f["origin"], f["dest"]) for f in flights[:500]})\nanswer = ...\n',
        given: '# flights is a list of dictionaries. routes already holds up to 500 real, distinct (origin, dest) pairs.',
        brief: 'Using `nx.single_source_shortest_path_length(G, "JFK")`, find the airport (other than JFK itself) with the **largest** shortest-path distance from JFK. Store it, as a plain string, in `answer`.',
        reference: py`routes = list({(f["origin"], f["dest"]) for f in flights[:500]})
G = nx.Graph()
G.add_edges_from(routes)
distances = nx.single_source_shortest_path_length(G, "JFK")
distances.pop("JFK", None)
answer = str(max(distances, key=distances.get))`,
        walkthrough: '`single_source_shortest_path_length` computes the distance from one node to every other reachable node in one call, which is more efficient than calling `shortest_path_length` once per destination.',
        traps: [py`routes = list({(f["origin"], f["dest"]) for f in flights[:500]})
G = nx.Graph()
G.add_edges_from(routes)
distances = nx.single_source_shortest_path_length(G, "JFK")
distances.pop("JFK", None)
answer = str(min(distances, key=distances.get))`],
      }),
      num({
        title: 'Connected components of the route network',
        use: ['flights'],
        starter: 'routes = list({(f["origin"], f["dest"]) for f in flights[:500]})\nanswer = ...\n',
        given: '# flights is a list of dictionaries. routes already holds up to 500 real, distinct (origin, dest) pairs.',
        brief: 'Using `nx.number_connected_components`, store the number of connected components of the route graph, as an `int`, in `answer`.',
        reference: py`routes = list({(f["origin"], f["dest"]) for f in flights[:500]})
G = nx.Graph()
G.add_edges_from(routes)
answer = int(nx.number_connected_components(G))`,
        walkthrough: 'A connected component is a maximal group of airports all reachable from one another; most real route networks form a single big component, but a small sample can genuinely split into more than one.',
        traps: [py`routes = list({(f["origin"], f["dest"]) for f in flights[:500]})
G = nx.Graph()
G.add_edges_from(routes)
answer = int(G.number_of_nodes())`],
      }),
    ],
  },
  {
    id: 'py-images-geospatial-overview',
    title: 'Images and geospatial data: an overview',
    blurb: 'Images as arrays, simple filters, coordinates and distances, and mapping ideas.',
    kind: 'learn',
    check: [
      {
        q: 'How is a grayscale digital image typically represented as data?',
        options: [
          'As a single number for the whole image',
          'As a 2-D array of brightness values, one per pixel, which is exactly what the NumPy section\'s image-like exercises already used',
          'Images cannot be represented numerically',
          'As a list of file names',
        ],
        answer: 1,
        why: 'A grayscale image is a grid of intensity values — a 2-D NumPy array — and a colour image extends this to a 3-D array with an extra dimension for red, green and blue channels.',
      },
      {
        q: 'What is the haversine formula used for?',
        options: [
          'Compressing image files',
          'Computing the great-circle distance between two points given as latitude and longitude, accounting for the Earth\'s curvature',
          'Converting an image to grayscale',
          'Parsing GPS file formats',
        ],
        answer: 1,
        why: "Plain Euclidean distance on raw latitude/longitude numbers is not the real distance on a sphere; the haversine formula (or a full geodesic calculation) accounts for the Earth's curvature.",
      },
      {
        q: 'What do GeoPandas and Shapely add on top of plain pandas and NumPy?',
        options: [
          'Nothing beyond what pandas already offers',
          'Geometric objects (points, lines, polygons) and spatial operations (does this point fall inside this region? what is the distance between these shapes?) as first-class, queryable data',
          'They are unrelated to geographic data',
          'They only work with images, not coordinates',
        ],
        answer: 1,
        why: 'GeoPandas extends a DataFrame with a geometry column and spatial operations (contains, intersects, distance); Shapely provides the underlying geometric objects and operations it builds on.',
      },
      {
        q: 'Why does latitude/longitude order matter so much in mapping code?',
        options: [
          'It never matters; any order works',
          "Different tools and formats disagree on the convention (latitude-first versus longitude-first), and swapping them silently plots a point in a wildly different, often nonsensical location instead of raising an error",
          'Longitude is always listed first everywhere',
          'It only matters near the equator',
        ],
        answer: 1,
        why: 'Because a swapped (longitude, latitude) pair is still a "valid" pair of numbers, no error occurs — the point just quietly ends up somewhere else on the globe, which makes this a notoriously easy mistake to miss.',
      },
      {
        q: 'Why does this lesson describe GeoPandas/Shapely instead of using them directly here?',
        options: [
          'They do not exist',
          'They are not available in this browser-based playground, so the lesson stays a conceptual overview rather than a hands-on exercise',
          'They only work with grayscale images',
          'They require a paid licence',
        ],
        answer: 1,
        why: 'This playground runs entirely through Pyodide in the browser, and GeoPandas/Shapely are not part of that environment, so the ideas are introduced here without a runnable exercise.',
      },
    ],
  },
]
