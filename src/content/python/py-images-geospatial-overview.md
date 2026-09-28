Two more data shapes worth recognising, even without going deep on either here: images (already familiar as arrays, from the NumPy workshop) and geospatial data, which adds real-world coordinates and distances into the mix.

You will learn:

- images as arrays with Pillow and NumPy
- simple filters, as array operations
- coordinates and the haversine distance
- GeoPandas and Shapely, as an overview

## Images as arrays

A grayscale image is a 2-D NumPy array of intensity values, exactly as used throughout the NumPy section; a colour image adds a third dimension for red, green and blue channels, giving a `(height, width, 3)` array. Pillow (`PIL.Image`) is the standard library for opening, saving and converting real image files into and out of that array form — `np.array(Image.open("photo.jpg"))` is the usual bridge from a file to an array you can process with everything already covered in this tier.

## Simple filters as array operations

A blur, a brightness adjustment, or a threshold are all just array operations, precisely like the small "blur" filter built by hand in the NumPy workshop: average a neighbourhood of pixels, add a constant, or compare against a cutoff. Dedicated image libraries (Pillow, scikit-image) offer many more filters ready-made, but the underlying idea — an image is an array, and a filter is a function of that array — is exactly what this tier already covered.

## Coordinates and distances

Latitude and longitude describe a position on a sphere, not a flat plane — plain Euclidean distance on the raw numbers is not the real distance between two points on Earth. The **haversine formula** computes the great-circle distance correctly, accounting for the Earth's curvature:

```python
import numpy as np

def haversine(lat1, lon1, lat2, lon2):
    r = 6371
    p1, p2 = np.radians(lat1), np.radians(lat2)
    dlat = np.radians(lat2 - lat1)
    dlon = np.radians(lon2 - lon1)
    a = np.sin(dlat / 2) ** 2 + np.cos(p1) * np.cos(p2) * np.sin(dlon / 2) ** 2
    return 2 * r * np.arcsin(np.sqrt(a))

jfk = (40.6413, -73.7781)
lax = (33.9416, -118.4085)
print(round(haversine(*jfk, *lax), 1))
```

The result is in kilometres (`r = 6371` is Earth's approximate radius); the same formula with `r` in miles gives the distance in miles instead.

## GeoPandas and Shapely, as an overview

**Shapely** represents geometric shapes (points, lines, polygons) as Python objects, with operations like "does this point fall inside this polygon?" or "what is the distance between these two shapes?". **GeoPandas** extends a pandas DataFrame with a geometry column built on Shapely, adding spatial joins, plotting on a map, and coordinate-reference-system handling — the natural next step once coordinate data needs real geometric reasoning, beyond what a haversine distance calculation alone covers. Neither package is available in this browser-based playground, so they are introduced here conceptually rather than run directly — the ideas transfer immediately to a normal Python environment.

## Mapping ideas

A geographic visualisation is, underneath, still a scatter plot or a choropleth (colouring regions by a value) — the same charting principles from the visualisation section apply, just with real-world coordinates (or shapes) as the geometry instead of arbitrary x/y axes. Choosing an honest colour scale and projection matters here exactly as much as choosing honest axes mattered for an ordinary chart.

## Watch out: latitude and longitude order

Different tools and formats disagree on whether a coordinate pair is `(latitude, longitude)` or `(longitude, latitude)` — and because both are just numbers, a swapped pair does not raise an error, it just quietly plots (or calculates) as if the point were somewhere else on the globe entirely. Checking a library's documented convention explicitly, every time, is the only real defence.

## Common mistakes

- Using plain Euclidean distance on latitude/longitude instead of a proper great-circle (haversine, or full geodesic) calculation.
- Swapping latitude and longitude order, which produces a plausible-looking but wrong location with no error.
- Reaching for full GeoPandas/Shapely machinery when a simple haversine distance would already answer the question.
- Choosing a misleading colour scale on a choropleth map, the geographic equivalent of a truncated chart axis.

## Recap

- Images are arrays; filters are array operations — nothing new beyond what the NumPy section already covered.
- The haversine formula computes real-world distance between latitude/longitude points correctly, accounting for Earth's curvature.
- GeoPandas and Shapely add geometric objects and spatial operations on top of a DataFrame, for when coordinates alone are not enough.
- Always confirm a library's latitude/longitude order explicitly; a swapped pair fails silently, not loudly.
