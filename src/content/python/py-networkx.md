Some data is naturally a network — routes between airports, links between web pages, connections between people — and a graph library gives you the vocabulary and algorithms to reason about it directly, rather than fighting a table structure that was never quite the right shape.

You will learn:

- nodes, edges and attributes
- degree and centrality
- shortest paths
- connected components

## Building a graph

```python
import networkx as nx

G = nx.Graph()
G.add_edge("JFK", "LAX")
G.add_edge("LAX", "SFO")
G.add_edge("JFK", "ORD")
print(G.nodes())
print(G.edges())
```

`nx.Graph()` creates an **undirected** graph — an edge between `A` and `B` means a connection in both directions. `nx.DiGraph()` creates a directed one, for relationships that only go one way (a one-way route, a "follows" relationship).

## Attributes

```python
import networkx as nx

G = nx.Graph()
G.add_edge("JFK", "LAX", distance=2475)
G.add_node("JFK", city="New York")
print(G["JFK"]["LAX"]["distance"])
print(G.nodes["JFK"]["city"])
```

Both nodes and edges can carry arbitrary extra data — a distance, a weight, a label — stored as key-value attributes.

## Degree

```python
import networkx as nx

G = nx.Graph()
G.add_edges_from([("JFK", "LAX"), ("JFK", "ORD"), ("JFK", "SFO"), ("LAX", "ORD")])
print(dict(G.degree()))
```

A node's **degree** is simply how many edges touch it — in this small route network, `JFK` connects to three other airports directly.

## Centrality

```python
import networkx as nx

G = nx.Graph()
G.add_edges_from([("A", "B"), ("B", "C"), ("C", "D"), ("B", "D")])
print(nx.degree_centrality(G))
print(nx.betweenness_centrality(G))
```

Degree centrality just normalises degree into a 0-to-1 scale; betweenness centrality measures how often a node sits **on the shortest path** between two other nodes — a different, often more revealing notion of "importance" for something like a transport hub or a key connector in a social network.

## Shortest paths

```python
import networkx as nx

G = nx.Graph()
G.add_edges_from([("JFK", "LAX"), ("LAX", "SFO"), ("JFK", "ORD"), ("ORD", "SFO")])
print(nx.shortest_path(G, "JFK", "SFO"))
print(nx.shortest_path_length(G, "JFK", "SFO"))
```

`shortest_path` returns the actual route; `shortest_path_length` returns just its length (number of edges, or total weight if a `weight=` attribute is given). `single_source_shortest_path_length` computes the distance from one node to every reachable node in a single call, more efficient than calling the pairwise version repeatedly.

## Connected components

```python
import networkx as nx

G = nx.Graph()
G.add_edges_from([("A", "B"), ("B", "C"), ("D", "E")])
print(list(nx.connected_components(G)))
print(nx.number_connected_components(G))
```

A **connected component** is a maximal set of nodes all reachable from one another; a graph can easily have more than one, if some part of it is disconnected from the rest — `{"A", "B", "C"}` and `{"D", "E"}` here never touch.

## Drawing small graphs

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import networkx as nx

G = nx.Graph()
G.add_edges_from([("A", "B"), ("B", "C")])
fig, ax = plt.subplots()
nx.draw(G, ax=ax, with_labels=True)
print(len(ax.patches) + len(ax.collections))
```

`nx.draw` handles a reasonable default layout automatically — genuinely useful for a quick look at a small graph, though larger or denser graphs usually need a more deliberate layout choice to stay readable at all.

## Watch out: huge graphs

Some algorithms (betweenness centrality in particular) scale poorly with graph size — fine for hundreds of nodes, potentially very slow for millions. Checking a method's documented complexity, or sampling a subset of nodes for an approximate answer, matters once a graph gets genuinely large.

## Common mistakes

- Using `Graph` (undirected) for a relationship that is really one-directional, or the reverse.
- Reaching for betweenness centrality on a very large graph without checking how it scales first.
- Forgetting that `shortest_path_length` counts edges by default, not any real-world distance, unless a `weight=` attribute is given.
- Assuming a graph is fully connected without checking `number_connected_components` first.

## Recap

- `Graph`/`DiGraph` model undirected/directed relationships; both nodes and edges can carry attributes.
- Degree counts direct connections; betweenness centrality measures how often a node lies on shortest paths between others.
- `shortest_path`/`shortest_path_length` find routes; `single_source_shortest_path_length` is efficient for many destinations at once.
- `connected_components` reveals whether a graph is really one connected whole, or several separate pieces.

## Your turn

In the **Practice** tab you write `route_length(routes, a, b)`. Then three challenges use real flight route data.
