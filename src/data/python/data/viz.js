import { dat, pdf, py } from './common.js'

const plot = (c) => pdf({ ...c, hidden: 'import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\n' + (c.hidden ?? '') })
const plotDat = (c) => dat({ ...c, hidden: 'import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\nimport numpy as np\n' + (c.hidden ?? '') })

export const vizSection = {
  id: 'data-visualisation',
  title: 'Data visualisation',
  intro: 'Charts that are honest, clear and useful.',
  lessons: [
    {
      id: 'py-viz-principles',
      title: 'Principles: choosing charts and encoding data honestly',
      blurb: 'Chart choice by question, position versus angle, axes and baselines, and colour for meaning.',
      kind: 'learn',
      check: [
        {
          q: 'Which encoding do people judge most accurately: position (a point\'s place along an axis), length (a bar), or angle (a pie slice)?',
          options: [
            'Angle, by a wide margin',
            'Position along a common scale is judged most accurately, then length, with angle and area the least accurate',
            'They are all judged with equal accuracy',
            'Colour is always the most accurate',
          ],
          answer: 1,
          why: 'Well-established perception research ranks position highest, length next, and angle/area lowest — which is exactly why bar and line charts (position/length) tend to beat pie charts (angle) for comparison tasks.',
        },
        {
          q: 'Why does truncating a bar chart\'s y-axis (not starting at zero) risk misleading a reader?',
          options: [
            'It never misleads; axes are just a stylistic choice',
            "Bar length is judged relative to the baseline; a truncated axis makes a small real difference look dramatically larger than it is",
            'It only matters for line charts, never bar charts',
            'It makes the chart technically incorrect in every case',
          ],
          answer: 1,
          why: 'A bar\'s visual length is compared to a zero baseline by habit; cutting that baseline off exaggerates small differences, even if the axis labels are technically accurate.',
        },
        {
          q: 'For "how has this value changed over time?", which chart type is the natural first choice?',
          options: ['A pie chart', 'A line chart', 'A pure scatter plot with no connecting line', 'A single stacked bar'],
          answer: 1,
          why: 'A line chart\'s connected points directly encode a trend across an ordered axis (usually time), which is exactly the question being asked.',
        },
        {
          q: 'What is one real risk of using two different y-axes (a "dual axis" chart) on the same plot?',
          options: [
            'It is always clearer than one axis',
            'The two scales can be chosen (even unintentionally) so that unrelated series appear to move together, implying a relationship that is really just an artifact of the axis choice',
            'It uses less ink than one axis',
            'It has no real downside',
          ],
          answer: 1,
          why: 'Because the two axes can be scaled independently, two series with no real relationship can be made to visually "line up" just by choosing where each axis starts and ends.',
        },
        {
          q: 'Why is colour a poor primary encoding for a value that many readers need to compare precisely?',
          options: [
            'Colour should never be used in any chart',
            "Colour differences are judged much less precisely than position, and a meaningful share of readers have some form of colour vision difference",
            'Colour is only a problem in black-and-white printouts',
            'Colour always looks unprofessional',
          ],
          answer: 1,
          why: 'Colour is good for categorical grouping or drawing attention, but weak for precise quantitative comparison — and needs to be chosen with colour vision differences in mind either way.',
        },
      ],
    },
    {
      id: 'py-matplotlib-basics',
      title: 'matplotlib basics: figures, axes, lines, bars and scatter',
      blurb: 'The object-oriented interface, plot/bar/scatter, and why to avoid the pyplot state machine.',
      kind: 'code',
      practice: {
        prompt: "Write `line_chart(x, ys)`: given `x` and a list `ys` of one or more same-length y-series, plot every series on one figure with `ax.plot(x, y)`, and return a list of `(x_values, y_values)` pairs, one per line, read back from the axes (not from `x`/`ys` directly).",
        starter: 'import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\n\ndef line_chart(x, ys):\n    ...\n',
        solution: py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def line_chart(x, ys):
    fig, ax = plt.subplots()
    for y in ys:
        ax.plot(x, y)
    return [(list(line.get_xdata()), list(line.get_ydata())) for line in ax.get_lines()]`,
        samples: ['line_chart([1, 2, 3], [[1, 2, 3]])'],
        cases: [
          ['One line', 'line_chart([1, 2, 3], [[1, 2, 3]])'],
          ['Two lines', '[len(pair[1]) for pair in line_chart([1, 2, 3], [[1, 2, 3], [3, 2, 1]])]'],
          ['The x values are read back correctly', 'line_chart([1, 2, 3], [[9, 8, 7]])[0][0]'],
          ['Number of lines matches ys', 'len(line_chart([1, 2], [[1, 2], [3, 4], [5, 6]]))'],
        ],
        traps: [
          py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def line_chart(x, ys):
    fig, ax = plt.subplots()
    ax.plot(x, ys[0])
    return [(list(line.get_xdata()), list(line.get_ydata())) for line in ax.get_lines()]`,
          py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def line_chart(x, ys):
    fig, ax = plt.subplots()
    for y in ys:
        ax.scatter(x, y)
    return [(list(line.get_xdata()), list(line.get_ydata())) for line in ax.get_lines()]`,
          py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def line_chart(x, ys):
    fig, ax = plt.subplots()
    for y in ys:
        ax.plot(y, x)
    return [(list(line.get_xdata()), list(line.get_ydata())) for line in ax.get_lines()]`,
        ],
      },
      real: [
        plot({
          title: 'Monthly flight counts as a line',
          use: ['flights'],
          starter: 'answer = ...\n',
          given: '# flights is already a DataFrame.',
          brief: 'Plot the number of flights per month (`groupby("month").size()`, in month order) as one line. Store `(x_values, y_values)` read back from the axes, in `answer`.',
          reference: py`by_month = flights.groupby("month").size().sort_index()
fig, ax = plt.subplots()
ax.plot(by_month.index, by_month.values)
line = ax.get_lines()[0]
answer = (list(line.get_xdata()), [int(v) for v in line.get_ydata()])`,
          walkthrough: 'Reading the data back from `ax.get_lines()` (instead of just returning `by_month` directly) confirms the chart actually drew what was intended.',
          traps: [py`by_month = flights.groupby("month").size().sort_index(ascending=False)
fig, ax = plt.subplots()
ax.plot(by_month.index, by_month.values)
line = ax.get_lines()[0]
answer = (list(line.get_xdata()), [int(v) for v in line.get_ydata()])`],
        }),
        plotDat({
          title: 'Bar chart of flights per carrier',
          use: ['flights'],
          starter: 'from collections import Counter\ncounts = Counter(f["carrier"] for f in flights[:200])\nlabels = sorted(counts)\nanswer = ...\n',
          given: '# flights is a list of dictionaries. labels already holds the sorted, distinct carrier codes among the first 200 rows.',
          brief: 'Draw a bar chart with `ax.bar(labels, [counts[l] for l in labels])`. Store the list of bar heights, read back from `ax.patches`, in `answer`.',
          reference: py`from collections import Counter
counts = Counter(f["carrier"] for f in flights[:200])
labels = sorted(counts)
fig, ax = plt.subplots()
ax.bar(labels, [counts[l] for l in labels])
answer = [p.get_height() for p in ax.patches]`,
          walkthrough: 'Every bar matplotlib draws becomes a `Rectangle` patch on the axes; `get_height()` reads its value straight back off the chart.',
          traps: [py`from collections import Counter
counts = Counter(f["carrier"] for f in flights[:200])
labels = sorted(counts)
fig, ax = plt.subplots()
ax.bar(labels, [counts[l] for l in labels])
answer = [p.get_width() for p in ax.patches]`],
        }),
        plotDat({
          title: 'Scatter of penguin bill length versus depth',
          use: ['penguins'],
          starter: 'pts = [(p["bill_length_mm"], p["bill_depth_mm"]) for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None][:10]\nanswer = ...\n',
          given: '# penguins is a list of dictionaries. pts already holds 10 real (length, depth) pairs.',
          brief: 'Draw a scatter plot of `pts` with `ax.scatter(...)`. Store the points, read back from the axes with `.get_offsets()`, as a list of `[x, y]` pairs, in `answer`.',
          reference: py`pts = [(p["bill_length_mm"], p["bill_depth_mm"]) for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None][:10]
xs = [p[0] for p in pts]
ys = [p[1] for p in pts]
fig, ax = plt.subplots()
ax.scatter(xs, ys)
answer = ax.collections[0].get_offsets().tolist()`,
          walkthrough: 'A scatter plot is stored as a `PathCollection`; `.get_offsets()` reads its actual plotted `(x, y)` points back.',
          traps: [py`pts = [(p["bill_length_mm"], p["bill_depth_mm"]) for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None][:10]
xs = [p[0] for p in pts]
ys = [p[1] for p in pts]
fig, ax = plt.subplots()
ax.scatter(ys, xs)
answer = ax.collections[0].get_offsets().tolist()`],
        }),
      ],
    },
    {
      id: 'py-matplotlib-customisation',
      title: 'matplotlib customisation: styles, annotation and subplots',
      blurb: 'Figure size and dpi, subplots and gridspec, annotate, and style sheets.',
      kind: 'code',
      practice: {
        prompt: 'Write `grid_fig()`: create a figure with a **2×2 grid** of subplots using `plt.subplots(2, 2)`, and return the shape of the resulting axes array.',
        starter: 'import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\n\ndef grid_fig():\n    ...\n',
        solution: py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def grid_fig():
    fig, axes = plt.subplots(2, 2)
    return axes.shape`,
        samples: ['grid_fig()'],
        cases: [
          ['The shape is (2, 2)', 'grid_fig()'],
        ],
        traps: [
          py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def grid_fig():
    fig, axes = plt.subplots(1, 4)
    return axes.shape`,
          py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def grid_fig():
    fig, axes = plt.subplots(4, 1)
    return axes.shape`,
        ],
      },
      real: [
        plot({
          title: 'One subplot per origin airport',
          use: ['flights'],
          starter: 'origins = sorted(flights["origin"].unique())\nanswer = ...\n',
          given: '# flights is already a DataFrame. origins already holds the 3 real distinct origins.',
          brief: 'Create a `1` row by `len(origins)` column grid of subplots, and plot each origin\'s flight count by month on its own subplot. Store the number of axes created (an `int`) in `answer`.',
          reference: py`origins = sorted(flights["origin"].unique())
fig, axes = plt.subplots(1, len(origins))
for ax, origin in zip(axes, origins):
    counts = flights[flights["origin"] == origin].groupby("month").size().sort_index()
    ax.plot(counts.index, counts.values)
answer = len(fig.axes)`,
          walkthrough: '`fig.axes` lists every axes object belonging to the figure, regardless of how the grid was laid out.',
          traps: [py`origins = sorted(flights["origin"].unique())
fig, axes = plt.subplots(1, len(origins) + 1)
for ax, origin in zip(axes, origins):
    counts = flights[flights["origin"] == origin].groupby("month").size().sort_index()
    ax.plot(counts.index, counts.values)
answer = len(fig.axes)`],
        }),
        plot({
          title: 'Annotating the busiest month',
          use: ['flights'],
          starter: 'by_month = flights.groupby("month").size().sort_index()\nanswer = ...\n',
          given: '# flights is already a DataFrame. by_month already holds real monthly counts.',
          brief: 'Plot `by_month`, then use `ax.annotate` to mark the busiest month with the text `"busiest"` at that point. Store the number of annotations on the axes (`len(ax.texts)`) in `answer`.',
          reference: py`by_month = flights.groupby("month").size().sort_index()
fig, ax = plt.subplots()
ax.plot(by_month.index, by_month.values)
busiest_month = int(by_month.idxmax())
busiest_count = int(by_month.max())
ax.annotate("busiest", (busiest_month, busiest_count))
answer = len(ax.texts)`,
          walkthrough: 'Every `annotate` call adds one text artist to the axes; `ax.texts` lists them, which is a simple way to confirm the annotation actually landed.',
          traps: [py`by_month = flights.groupby("month").size().sort_index()
fig, ax = plt.subplots()
ax.plot(by_month.index, by_month.values)
answer = len(ax.texts)`],
        }),
        plot({
          title: 'A figure sized for two charts',
          use: ['flights'],
          starter: 'answer = ...\n',
          given: '# flights is already a DataFrame.',
          brief: 'Create a figure with `figsize=(10, 4)` and a `1x2` grid of subplots. Store the figure\'s size in inches, as a tuple of two floats, in `answer`.',
          reference: py`fig, axes = plt.subplots(1, 2, figsize=(10, 4))
answer = tuple(float(v) for v in fig.get_size_inches())`,
          walkthrough: '`get_size_inches()` reads the figure\'s actual size back, confirming `figsize=` was applied.',
          traps: [py`fig, axes = plt.subplots(1, 2, figsize=(4, 10))
answer = tuple(float(v) for v in fig.get_size_inches())`],
        }),
      ],
    },
    {
      id: 'py-distributions-hist-box',
      title: 'Distributions: histograms, box plots and violins',
      blurb: 'Bins and their effect, box plot anatomy, and comparing groups.',
      kind: 'code',
      practice: {
        prompt: 'Write `hist_counts(values, edges)`: return the histogram counts of `values` using the given bin `edges` (a list of `len(edges) - 1` bin boundaries), as a list of ints.',
        starter: 'import numpy as np\n\ndef hist_counts(values, edges):\n    ...\n',
        solution: py`import numpy as np

def hist_counts(values, edges):
    counts, _ = np.histogram(values, bins=edges)
    return counts.tolist()`,
        samples: ['hist_counts([1, 2, 3, 8, 9], [0, 5, 10])'],
        cases: [
          ['Two bins', 'hist_counts([1, 2, 3, 8, 9], [0, 5, 10])'],
          ['Three bins', 'hist_counts([1, 4, 5, 6, 9], [0, 3, 6, 10])'],
          ['A value on a boundary counts in the upper bin', 'hist_counts([5], [0, 5, 10])'],
          ['Nothing in a bin is zero, not missing', 'hist_counts([1, 1, 1], [0, 5, 10])'],
        ],
        traps: [
          py`import numpy as np

def hist_counts(values, edges):
    counts, _ = np.histogram(values, bins=len(edges) - 1)
    return counts.tolist()`,
          py`import numpy as np

def hist_counts(values, edges):
    return [len(values)] * (len(edges) - 1)`,
        ],
      },
      real: [
        plotDat({
          title: 'Distribution of arrival delays',
          use: ['flights'],
          starter: 'sample = [f["arr_delay"] for f in flights if f["arr_delay"] is not None][:200]\nedges = [-60, -15, 0, 15, 30, 60, 300]\nanswer = ...\n',
          given: '# flights is a list of dictionaries. sample already holds 200 real, non-missing delays.',
          brief: 'Compute the histogram counts of `sample` using `edges`. Store the list of counts (as plain ints) in `answer`.',
          reference: py`sample = [f["arr_delay"] for f in flights if f["arr_delay"] is not None][:200]
edges = [-60, -15, 0, 15, 30, 60, 300]
counts, _ = np.histogram(sample, bins=edges)
answer = counts.tolist()`,
          walkthrough: 'Custom edges let the bins line up with meaningful thresholds (like "on time" versus "late") instead of equal-width bins chosen automatically.',
          traps: [py`sample = [f["arr_delay"] for f in flights if f["arr_delay"] is not None][:200]
edges = [-60, -15, 0, 15, 30, 60, 300]
counts, _ = np.histogram(sample, bins=6)
answer = counts.tolist()`],
        }),
        plotDat({
          title: 'Penguin mass by species, box plot statistics',
          use: ['penguins'],
          starter: 'species = "Adelie"\nmasses = [p["body_mass_g"] for p in penguins if p["species"] == species and p["body_mass_g"] is not None]\nanswer = ...\n',
          given: '# penguins is a list of dictionaries. masses already holds every real, non-missing mass for one species.',
          brief: 'Draw a box plot of `masses` with `ax.boxplot(masses)`, then read the **median** line back from the returned dict\'s `"medians"` entry. Store it, rounded to 1 decimal, in `answer`.',
          reference: py`species = "Adelie"
masses = [p["body_mass_g"] for p in penguins if p["species"] == species and p["body_mass_g"] is not None]
fig, ax = plt.subplots()
result = ax.boxplot(masses)
median_line = result["medians"][0]
answer = round(float(median_line.get_ydata()[0]), 1)`,
          walkthrough: '`ax.boxplot` returns a dict of the artists it drew; the `"medians"` line\'s y-data is exactly the median value the box plot is displaying.',
          traps: [py`species = "Adelie"
masses = [p["body_mass_g"] for p in penguins if p["species"] == species and p["body_mass_g"] is not None]
fig, ax = plt.subplots()
result = ax.boxplot(masses)
box_line = result["boxes"][0]
answer = round(float(box_line.get_ydata()[0]), 1)`],
        }),
        plotDat({
          title: 'Track length distribution on a log scale',
          use: ['tracks'],
          starter: 'ms = [t["Milliseconds"] for t in tracks[:300]]\nanswer = ...\n',
          given: '# tracks is a list of dictionaries. ms already holds 300 real durations.',
          brief: 'Plot a histogram of `ms` with 5 bins on a **log-scaled** y-axis (`ax.set_yscale("log")`), then store the axis scale, read back with `ax.get_yscale()`, in `answer`.',
          reference: py`ms = [t["Milliseconds"] for t in tracks[:300]]
fig, ax = plt.subplots()
ax.hist(ms, bins=5)
ax.set_yscale("log")
answer = ax.get_yscale()`,
          walkthrough: 'A log-scaled axis compresses large differences, useful when a distribution has a long tail (a few very long tracks among many short ones) that would otherwise crowd everything else near the bottom.',
          traps: [py`ms = [t["Milliseconds"] for t in tracks[:300]]
fig, ax = plt.subplots()
ax.hist(ms, bins=5)
answer = ax.get_yscale()`],
        }),
      ],
    },
    {
      id: 'py-plotting-pandas-timeseries',
      title: 'Plotting straight from pandas and time-series plots',
      blurb: 'DataFrame.plot and kinds, plotting groups, and date axes.',
      kind: 'code',
      practice: {
        prompt: 'Write `series_plot(s)`: given a Series `s` with a `DatetimeIndex`, resample to daily means and plot it. Return the number of points actually drawn.',
        starter: 'import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\n\ndef series_plot(s):\n    ...\n',
        solution: py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def series_plot(s):
    plt.close("all")
    resampled = s.resample("D").mean()
    ax = resampled.plot()
    return len(ax.get_lines()[0].get_xdata())`,
        samples: ["import pandas as pd\nseries_plot(pd.Series([1.0, 2.0, 3.0], index=pd.date_range('2024-01-01', periods=3)))"],
        cases: [
          ['Three daily points', "import pandas as pd\nseries_plot(pd.Series([1.0, 2.0, 3.0], index=pd.date_range('2024-01-01', periods=3)))"],
          ['Several points on the same day are combined', "import pandas as pd\nseries_plot(pd.Series([1.0, 2.0, 3.0], index=pd.to_datetime(['2024-01-01 01:00', '2024-01-01 02:00', '2024-01-02 01:00'])))"],
        ],
        traps: [
          py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def series_plot(s):
    plt.close("all")
    ax = s.plot()
    return len(ax.get_lines()[0].get_xdata())`,
          py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def series_plot(s):
    plt.close("all")
    resampled = s.resample("D").mean()
    ax = resampled.plot()
    return len(s)`,
        ],
      },
      real: [
        plot({
          title: 'Plotting daily flight counts from pandas directly',
          use: ['flights'],
          starter: 'answer = ...\n',
          given: '# flights is already a DataFrame.',
          brief: "Build a Series of flight counts indexed by `flight_date` (parsed with `pd.to_datetime`), resample to daily, and plot it with `.plot()`. Store the number of points drawn, as an `int`, in `answer`.",
          reference: py`plt.close("all")
dates = pd.to_datetime(flights["flight_date"])
daily = dates.value_counts().sort_index()
ax = daily.plot()
answer = int(len(ax.get_lines()[0].get_xdata()))`,
          walkthrough: 'Because `flight_date` is already one entry per day, resampling is not even needed here — `value_counts()` already gives one point per real day in the data.',
          traps: [py`plt.close("all")
dates = pd.to_datetime(flights["flight_date"])
daily = dates.value_counts().sort_index()
ax = daily.plot()
answer = int(len(ax.get_lines()[0].get_xdata())) + 1`],
        }),
        plot({
          title: 'Plotting a rolling average overlay',
          use: ['flights'],
          starter: 'answer = ...\n',
          given: '# flights is already a DataFrame.',
          brief: 'Build a daily delay Series (mean `dep_delay` per `flight_date`, ignoring missing values), plot it, then overlay a 7-day rolling average on the **same axes** with `ax.plot(...)`. Store the number of lines on the axes (should be 2) in `answer`.',
          reference: py`plt.close("all")
daily = flights.dropna(subset=["dep_delay"]).groupby("flight_date")["dep_delay"].mean().sort_index()
ax = daily.plot()
rolling = daily.rolling(7, min_periods=1).mean()
ax.plot(rolling.index, rolling.values)
answer = len(ax.get_lines())`,
          walkthrough: 'Passing the same `ax` to a second plot call overlays it on the existing chart, instead of creating a brand-new figure.',
          traps: [py`plt.close("all")
daily = flights.dropna(subset=["dep_delay"]).groupby("flight_date")["dep_delay"].mean().sort_index()
ax = daily.plot()
rolling = daily.rolling(7, min_periods=1).mean()
fig2, ax2 = plt.subplots()
ax2.plot(rolling.index, rolling.values)
answer = len(ax.get_lines())`],
        }),
        plot({
          title: 'Plotting two carriers on one axes',
          use: ['flights'],
          starter: 'answer = ...\n',
          given: '# flights is already a DataFrame.',
          brief: "Plot `flights` grouped by `carrier` for two carriers, `\"AA\"` and `\"UA\"`, each as its own line of average `dep_delay` by month (missing values ignored), on **one shared axes**. Store the number of lines drawn in `answer`.",
          reference: py`fig, ax = plt.subplots()
for carrier in ["AA", "UA"]:
    subset = flights[(flights["carrier"] == carrier)].dropna(subset=["dep_delay"])
    by_month = subset.groupby("month")["dep_delay"].mean().sort_index()
    ax.plot(by_month.index, by_month.values, label=carrier)
answer = len(ax.get_lines())`,
          walkthrough: 'Looping over the carriers and calling `ax.plot` inside the loop, on the same `ax`, draws every carrier\'s line on one shared chart.',
          traps: [py`fig, ax = plt.subplots()
for carrier in ["AA"]:
    subset = flights[(flights["carrier"] == carrier)].dropna(subset=["dep_delay"])
    by_month = subset.groupby("month")["dep_delay"].mean().sort_index()
    ax.plot(by_month.index, by_month.values, label=carrier)
answer = len(ax.get_lines())`],
        }),
      ],
    },
    {
      id: 'py-statistical-plots-numpy-mpl',
      title: 'Statistical plots with NumPy and matplotlib',
      blurb: 'Regression lines and correlation heat maps built by hand from subplots.',
      kind: 'code',
      practice: {
        prompt: 'Write `corr_heatmap(df)`: compute the correlation matrix of `df`\'s numeric columns, draw it with `ax.imshow`, and return the correlation matrix as a dict of dicts, rounded to 3 decimals.',
        starter: 'import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\n\ndef corr_heatmap(df):\n    ...\n',
        solution: py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def corr_heatmap(df):
    corr = df.corr().round(3)
    fig, ax = plt.subplots()
    ax.imshow(corr.values)
    return corr.to_dict()`,
        samples: ['import pandas as pd\ncorr_heatmap(pd.DataFrame({"a": [2.0, 4.0, 6.0], "b": [6.0, 4.0, 2.0]}))'],
        cases: [
          ['Perfectly anti-correlated columns, not unit variance', 'import pandas as pd\ncorr_heatmap(pd.DataFrame({"a": [2.0, 4.0, 6.0], "b": [6.0, 4.0, 2.0]}))'],
          ['A column perfectly correlated with itself is exactly 1', 'import pandas as pd\ncorr_heatmap(pd.DataFrame({"a": [2.0, 4.0, 6.0]}))["a"]["a"]'],
          ['Three columns', 'import pandas as pd\nsorted(corr_heatmap(pd.DataFrame({"a": [1.0, 2.0], "b": [2.0, 4.0], "c": [5.0, 1.0]})).keys())'],
        ],
        traps: [
          py`import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def corr_heatmap(df):
    cov = df.cov().round(3)
    fig, ax = plt.subplots()
    ax.imshow(cov.values)
    return cov.to_dict()`,
        ],
      },
      real: [
        plot({
          title: 'Correlation between flight numbers',
          use: ['flights'],
          starter: 'answer = ...\n',
          given: '# flights is already a DataFrame.',
          brief: 'Compute the correlation matrix of `distance`, `air_time` and `dep_delay` (rounded to 3 decimals). Store the correlation between `distance` and `air_time` in `answer`.',
          reference: py`corr = flights[["distance", "air_time", "dep_delay"]].corr().round(3)
fig, ax = plt.subplots()
ax.imshow(corr.values)
answer = float(corr.loc["distance", "air_time"])`,
          walkthrough: 'Distance and air time are naturally strongly correlated (longer routes take longer to fly), which is exactly the kind of relationship a correlation heatmap makes visible at a glance.',
          traps: [py`corr = flights[["distance", "air_time", "dep_delay"]].corr().round(3)
fig, ax = plt.subplots()
ax.imshow(corr.values)
answer = float(corr.loc["distance", "dep_delay"])`],
        }),
        plot({
          title: 'A hand-built regression line',
          use: ['penguins'],
          starter: 'sub = penguins.dropna(subset=["flipper_length_mm", "body_mass_g"])\nanswer = ...\n',
          given: '# penguins is already a DataFrame. sub drops any row missing either measurement.',
          brief: 'Fit a straight line `body_mass_g = a * flipper_length_mm + b` with `np.polyfit(x, y, 1)`, draw it on a scatter plot, and store `(a, b)`, rounded to 2 decimals, in `answer`.',
          reference: py`sub = penguins.dropna(subset=["flipper_length_mm", "body_mass_g"])
x = sub["flipper_length_mm"].values
y = sub["body_mass_g"].values
a, b = np.polyfit(x, y, 1)
fig, ax = plt.subplots()
ax.scatter(x, y)
ax.plot(x, a * x + b)
answer = (round(float(a), 2), round(float(b), 2))`,
          walkthrough: '`np.polyfit(x, y, 1)` fits a degree-1 polynomial (a straight line) by least squares, returning its slope and intercept directly.',
          traps: [py`sub = penguins.dropna(subset=["flipper_length_mm", "body_mass_g"])
x = sub["flipper_length_mm"].values
y = sub["body_mass_g"].values
b, a = np.polyfit(x, y, 1)
fig, ax = plt.subplots()
ax.scatter(x, y)
ax.plot(x, a * x + b)
answer = (round(float(a), 2), round(float(b), 2))`],
        }),
        plot({
          title: 'An ECDF of real streams',
          use: ['songs'],
          starter: 'streams = songs["spotify_streams"].dropna().head(50).sort_values().values\nanswer = ...\n',
          given: '# songs is already a DataFrame. streams already holds 50 real, sorted stream counts.',
          brief: 'Plot the empirical cumulative distribution: x is `streams` (already sorted), y is `(rank) / len(streams)` for rank `1..len(streams)`. Store the **last** y value (should be `1.0`) in `answer`.',
          reference: py`streams = songs["spotify_streams"].dropna().head(50).sort_values().values
y = np.arange(1, len(streams) + 1) / len(streams)
fig, ax = plt.subplots()
ax.plot(streams, y)
answer = float(ax.get_lines()[0].get_ydata()[-1])`,
          walkthrough: 'An ECDF always ends at exactly `1.0`, since by the last (largest) point, 100% of the data is at or below it.',
          traps: [py`streams = songs["spotify_streams"].dropna().head(50).sort_values().values
y = np.arange(0, len(streams)) / len(streams)
fig, ax = plt.subplots()
ax.plot(streams, y)
answer = float(ax.get_lines()[0].get_ydata()[-1])`],
        }),
      ],
    },
    {
      id: 'py-interactive-plotly',
      title: 'Interactive charts with Plotly (reading lesson)',
      blurb: 'Figure objects and traces, hover and zoom, and when interactive beats static.',
      kind: 'read',
      check: [
        {
          q: 'What is the basic unit Plotly draws onto a figure, analogous to a matplotlib "line" or "bar" artist?',
          options: ['A pixel', 'A trace (e.g. a scatter trace, a bar trace), added to a Figure', 'A widget', 'A theme'],
          answer: 1,
          why: 'A Plotly `Figure` holds one or more traces (`go.Scatter`, `go.Bar`, ...), each describing one series of data and how to draw it.',
        },
        {
          q: 'What does the `px` module offer that the lower-level `go` module does not, for a typical chart?',
          options: [
            'px is a completely different charting library',
            'px (plotly.express) builds a whole figure from a DataFrame in one call, inferring sensible traces and layout; go builds the same figure piece by piece',
            'go can only make static images',
            'px cannot make interactive charts',
          ],
          answer: 1,
          why: '`plotly.express` trades some control for convenience — one call from tidy data to a finished figure — while `plotly.graph_objects` gives full control by building each trace and layout setting explicitly.',
        },
        {
          q: 'What can a reader do with an interactive Plotly chart that they cannot do with a static matplotlib PNG?',
          options: [
            'Nothing; they render identically',
            'Hover over a point to see its exact value, zoom into a region, and toggle a legend entry to show or hide a series',
            'Only change its colour',
            'Print it at a higher resolution',
          ],
          answer: 1,
          why: 'Hover tooltips, zoom/pan, and clickable legends are runtime, in-browser behaviours that a static image simply cannot offer.',
        },
        {
          q: 'Why might a static chart still be preferred over an interactive one for a printed report or a PDF?',
          options: [
            'Static charts are always better in every situation',
            'A static image renders identically everywhere and needs no JavaScript runtime; an interactive chart\'s hover/zoom behaviour is lost once it is exported to a still image or printed page',
            'PDFs cannot contain any image at all',
            'There is no real difference between the two for this use case',
          ],
          answer: 1,
          why: 'Interactivity depends on a live, JavaScript-capable viewer. A PDF or printout freezes the chart to one still moment, so the extra interactivity buys nothing there.',
        },
        {
          q: 'Why does this lesson describe Plotly figures instead of letting you run Plotly code directly here?',
          options: [
            'Plotly does not exist',
            'Plotly is not available in this browser-based playground, so the lesson uses recorded, described outputs instead of a live editor',
            'Plotly is banned for licensing reasons',
            'It is exactly as runnable as every other lesson here',
          ],
          answer: 1,
          why: 'This playground runs entirely in the browser via Pyodide, and Plotly\'s full interactive rendering is not part of that environment, so this lesson stays a reading lesson rather than a hands-on one.',
        },
      ],
    },
    {
      id: 'py-data-to-story',
      title: 'From data to story: presenting an insight',
      blurb: 'Picking the one message, structuring an analysis, and reviewing for misleading choices.',
      kind: 'learn',
      check: [
        {
          q: 'Why pick "the one message" before building a chart, rather than showing everything you found?',
          options: [
            'It is faster to make, nothing more',
            "A chart (or report) trying to say five things at once usually communicates none of them clearly; picking the single most important finding focuses every design choice around it",
            'Readers always prefer the most detailed possible chart',
            'It removes the need for any labels',
          ],
          answer: 1,
          why: 'A focused chart with one clear takeaway is far more effective than a comprehensive one trying to answer every possible question at once.',
        },
        {
          q: 'What makes a chart title like "Average delay by carrier, 2013" weaker than one like "Airline X had the worst average delay in 2013"?',
          options: [
            'There is no real difference',
            'The first only describes what the chart shows; the second states the actual takeaway, so a reader gets the point even at a glance',
            'Titles should never mention a specific finding',
            'The first is always more professional',
          ],
          answer: 1,
          why: 'A descriptive title says what the chart is; a takeaway title says what it means — the second saves every reader the work of re-deriving the point themselves.',
        },
        {
          q: 'Why annotate the specific evidence for a claim directly on the chart, rather than leaving a reader to spot it themselves?',
          options: [
            'It clutters the chart with no benefit',
            "It points the reader straight at the exact data that supports the claim, instead of hoping they notice it in among everything else on the chart",
            'Annotations are purely decorative',
            'It is only useful for a live presentation, never a written report',
          ],
          answer: 1,
          why: 'An annotation (an arrow, a highlighted point, a callout) directly connects a specific visual feature to the claim being made about it, removing any ambiguity about what the reader should be looking at.',
        },
        {
          q: 'What should a caption under a chart typically add, beyond what the chart already shows visually?',
          options: [
            'Nothing; a caption is redundant with the chart',
            "Context the visual alone cannot carry: the data source, the time period, a caveat about what was excluded, or the specific number behind the trend",
            'A caption should just repeat the chart title',
            'A joke, to keep the reader engaged',
          ],
          answer: 1,
          why: 'A caption is where a chart\'s "fine print" belongs — sourcing, caveats, and exact figures — supporting the visual instead of duplicating it.',
        },
        {
          q: 'Why review a finished chart specifically for misleading choices (truncated axes, cherry-picked ranges, a suggestive but coincidental correlation) before sharing it?',
          options: [
            'This step is unnecessary if the underlying data is correct',
            "A choice can distort the honest message even when every individual number is accurate; a dedicated review step catches those distortions before a reader is misled by them",
            'Only charts made by other people need this review',
            'It only matters for charts shown to the public, never internal ones',
          ],
          answer: 1,
          why: "Correct numbers do not guarantee an honest impression — axis choices, framing, and cherry-picked ranges can all mislead using entirely accurate data, which is exactly why a deliberate review step matters.",
        },
      ],
    },
  ],
  checkpoint: [],
}
