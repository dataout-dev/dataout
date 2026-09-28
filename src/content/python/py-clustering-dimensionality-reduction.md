Clustering and dimensionality reduction are the two workhorses of unsupervised learning: finding groups with no target to guide you, and compressing many features into fewer while keeping the real structure.

You will learn:

- k-means, and choosing k
- an overview of hierarchical clustering and DBSCAN
- PCA for compression and visualisation
- the silhouette score

## k-means

```python
from sklearn.cluster import KMeans

X = [[0, 0], [0.1, 0], [10, 10], [10.1, 10], [10, 9.9]]
model = KMeans(n_clusters=2, random_state=0, n_init=10)
labels = model.fit_predict(X)
print(labels)
print(model.cluster_centers_)
```

k-means assigns each point to the nearest of `k` centres, then moves each centre to the mean of its assigned points, repeating until stable. `random_state` and `n_init` (how many different random starting points to try, keeping the best) matter because k-means can land in a different, sometimes worse, local arrangement depending on where it started.

## Choosing k

```python
from sklearn.cluster import KMeans

X = [[0, 0], [0.1, 0], [5, 5], [5.1, 5], [10, 0], [10.1, 0]]
for k in [2, 3, 4]:
    model = KMeans(n_clusters=k, random_state=0, n_init=10)
    model.fit(X)
    print(k, round(model.inertia_, 2))
```

`inertia_` is the total squared distance from each point to its cluster centre — it always decreases as `k` grows (more clusters can only fit the data at least as well), so the "elbow" where it stops dropping sharply is the usual heuristic for picking `k`, rather than the smallest inertia outright.

## Hierarchical clustering and DBSCAN, briefly

Hierarchical clustering builds a tree of nested clusters (a dendrogram), merging the closest pair repeatedly — useful when the *right* number of clusters is unclear, since you can cut the tree at any level. DBSCAN groups points by density, discovering the number of clusters automatically and naturally labelling sparse points as noise, rather than forcing every point into some cluster the way k-means does.

## PCA for compression

```python
from sklearn.decomposition import PCA
import numpy as np

rng = np.random.default_rng(0)
correlated = rng.normal(size=(50, 1))
X = np.hstack([correlated, correlated * 2 + rng.normal(scale=0.1, size=(50, 1)), rng.normal(size=(50, 1))])
pca = PCA(n_components=2)
pca.fit(X)
print(pca.explained_variance_ratio_)
```

The first two strongly correlated columns barely add independent information beyond each other; PCA finds new axes (**principal components**) that capture as much of the data's spread as possible in as few dimensions as possible — here, a small number of components should already explain most of the variance.

## PCA for visualisation

Reducing many features down to 2 (or 3) components, purely to plot them, is one of PCA's most common uses — it lets you eyeball whether groups separate at all in the reduced view, even though the axes themselves ("component 1", "component 2") no longer correspond to any single original feature.

## The silhouette score

```python
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

X = [[0, 0], [0.1, 0], [10, 10], [10.1, 10]]
labels = KMeans(n_clusters=2, random_state=0, n_init=10).fit_predict(X)
print(silhouette_score(X, labels))
```

The silhouette score (from -1 to 1) measures how much closer each point is to its own cluster than to the next-nearest one — higher is better, and comparing it across a few candidate values of `k` is a more principled way to choose `k` than eyeballing an inertia plot alone.

## Watch out: clustering unscaled data

Exactly like regularisation and distance-based methods generally, k-means measures plain Euclidean distance — a feature with a naturally larger numeric range will dominate the distance calculation unless every feature is scaled first, regardless of how relevant each one actually is to the real grouping.

## Common mistakes

- Running k-means (or PCA) on unscaled features with very different ranges.
- Picking `k` purely by the lowest inertia, which always favours more clusters.
- Interpreting PCA's components as if they still meant something in terms of the original features.
- Forcing DBSCAN-appropriate data (with real noise points) into k-means, which has no concept of "not part of any cluster".

## Recap

- k-means needs `k` chosen in advance; `random_state`/`n_init` control its sensitivity to starting position.
- Inertia always decreases with more clusters; the silhouette score gives a more principled comparison across values of `k`.
- PCA compresses correlated features into fewer components, useful for both efficiency and visualisation.
- Scale features before clustering or applying PCA, for the same reason regularisation needs scaled inputs.

## Your turn

In the **Practice** tab you write `cluster(X, k)`. Then three challenges use real data.
