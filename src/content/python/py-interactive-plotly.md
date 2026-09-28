Everything so far in this section has been static: a finished image, the same every time it is viewed. Plotly builds **interactive** charts instead — hover for exact values, zoom into a region, toggle a series on and off — at the cost of needing a live, JavaScript-capable viewer rather than a plain image.

This is a reading lesson: Plotly is not available in this browser-based playground, so the examples below describe recorded outputs rather than code you can run here. The ideas transfer directly once you use Plotly in a normal Python environment (a Jupyter notebook, or a script that opens a browser tab).

You will learn:

- figure objects and traces
- `plotly.express` versus `plotly.graph_objects`
- hovering, zooming and toggling a legend
- exporting to a static image or a standalone HTML file
- when interactive genuinely beats static, and when it does not

## Figure objects and traces

A Plotly `Figure` holds a list of **traces** — one `go.Scatter`, `go.Bar`, `go.Histogram` (and so on) per series of data — plus a `layout` describing titles, axes, and overall appearance. Building a figure by hand with `plotly.graph_objects` (usually imported as `go`) means constructing each trace explicitly:

```text
import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Scatter(x=[1, 2, 3], y=[10, 15, 13], mode="lines+markers", name="Series A"))
fig.update_layout(title="A simple interactive line chart")
```

Every trace remembers its own data, styling and name (used in the legend), the same way a matplotlib `Line2D` artist does.

## express versus graph_objects

`plotly.express` (usually imported as `px`) builds a whole figure from a tidy DataFrame in one call, inferring sensible traces and layout automatically:

```text
import plotly.express as px

fig = px.line(df, x="date", y="delay", color="carrier", title="Delay by carrier over time")
```

This is the quicker path for an exploratory chart from data that is already close to tidy; dropping down to `graph_objects` gives full, explicit control when a chart needs something `express` does not offer directly.

## Hover, zoom and legend toggling

In a live Plotly chart:

- **Hovering** over a point shows a tooltip with its exact values, without needing to guess from the axis.
- **Zooming** (dragging a rectangle, or the toolbar's zoom tool) rescales both axes to the selected region, with a button to reset to the full view.
- **Clicking a legend entry** hides or shows that one trace, letting a reader isolate a single series among many without a separate chart.

None of this requires extra code beyond building the figure — it comes from Plotly's JavaScript renderer, which is exactly the part not available in this playground.

## Exporting

A Plotly figure can be exported as a **static** image (`fig.write_image("chart.png")`, which needs the `kaleido` package) for a report or a printed page, or as a **standalone HTML file** (`fig.write_html("chart.html")`) that keeps the full interactivity, viewable in any browser without a live Python process running.

## When interactive beats static — and when it does not

Interactive charts shine for **exploration**: letting a reader drill into exactly the part of the data they personally care about, especially with many series or a lot of detail packed into one chart. They add little (and cost some complexity) for a chart with one clear, already-obvious message meant for a printed page or a single screenshot in a chat message — a plain static chart communicates that just as well, renders identically everywhere, and needs no JavaScript runtime at all.

## Watch out: shipping heavy charts

An interactive chart with a very large number of points (hundreds of thousands of markers, say) can become slow to render or scroll past in a browser, in a way a static PNG of the same data never would. Downsampling, aggregating, or switching to a static export for genuinely large datasets is often the more honest trade.

## Common mistakes

- Reaching for a fully interactive chart when a simple, static one for a single clear message would communicate just as well with far less overhead.
- Forgetting that exported static images lose all hover/zoom/legend-toggle behaviour — check what the final destination (a report, a slide, a live dashboard) actually needs.
- Building a chart with far more points than a reader could meaningfully interact with, slowing the page down for no real benefit.
- Assuming `px` (express) can always express a customisation that actually needs the lower-level `go` (graph_objects) API.
