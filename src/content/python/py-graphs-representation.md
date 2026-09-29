A graph is just nodes and the connections between them — but *how* you store those connections changes what is cheap and what is expensive to ask.

You will learn:

- adjacency lists versus adjacency matrices, and when to use each
- directed versus undirected edges
- weighted edges
- building a graph from raw edge data
- degree, neighbours, and the classic "forgot the reverse edge" bug

## Adjacency list

```python
def build_graph(edges, directed=False):
    graph = {}
    for a, b in edges:
        graph.setdefault(a, []).append(b)
        if not directed:
            graph.setdefault(b, []).append(a)
    return graph

routes = [("JFK", "LAX"), ("JFK", "ORD"), ("LAX", "SFO")]
graph = build_graph(routes)
print(graph["JFK"])
```

An adjacency list maps each node to the list of its neighbours. Space is O(V + E) — proportional to the number of nodes plus edges — which is efficient for **sparse** graphs (most real-world graphs, including route networks and social graphs, are sparse).

## Adjacency matrix

```python
nodes = ["A", "B", "C"]
index = {n: i for i, n in enumerate(nodes)}
matrix = [[0] * len(nodes) for _ in range(len(nodes))]

for a, b in [("A", "B"), ("B", "C")]:
    matrix[index[a]][index[b]] = 1
    matrix[index[b]][index[a]] = 1

print(matrix)
```

A matrix uses O(V squared) space regardless of how many edges actually exist, but checking "are A and B connected" is O(1) — just one lookup, versus scanning a neighbour list. Matrices win for **dense** graphs or when that O(1) edge check matters more than memory.

## Directed versus undirected

An undirected edge (a friendship, a two-way flight route) is added in **both** directions. A directed edge (a one-way street, a "follows" relationship) is added in only one. Forgetting to add the reverse direction for an undirected graph is one of the most common graph bugs there is — the symptom is usually "my BFS/DFS can't find a path that should obviously exist," and the cause is a missing edge going the other way.

## Weighted edges

```python
def build_weighted_graph(edges):
    graph = {}
    for a, b, weight in edges:
        graph.setdefault(a, []).append((b, weight))
        graph.setdefault(b, []).append((a, weight))
    return graph

flights = [("JFK", "LAX", 4818), ("JFK", "ORD", 1188)]
weighted = build_weighted_graph(flights)
print(weighted["JFK"])
```

Storing `(neighbour, weight)` pairs instead of bare neighbours is all that changes for a weighted graph — algorithms like Dijkstra (covered later in this tier) read the weight to decide which path is actually cheapest, not just which path exists.

## Degree and neighbours

```python
graph = build_graph([("A", "B"), ("A", "C"), ("B", "C")])
degree = {node: len(neighbours) for node, neighbours in graph.items()}
print(degree)
busiest = max(degree, key=degree.get)
print(busiest)
```

The **degree** of a node is just the length of its neighbour list. In a route network, the highest-degree airports are the hubs; in a social graph, the highest-degree accounts are the most connected.

## Common mistakes

- Adding an edge only one way for a graph that should be undirected.
- Choosing an adjacency matrix for a large, sparse graph and paying O(V squared) memory for almost entirely empty cells.
- Building a fresh adjacency list, or a fresh degree count, inside a loop that runs many times, instead of building it once and reusing it.
