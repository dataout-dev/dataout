import { dat, py } from './common.js'

const num = (c) => dat({ ...c, hidden: 'import numpy as np\n' + (c.hidden ?? '') })
const sm = (c) => dat({ ...c, hidden: 'import numpy as np\nimport statsmodels.api as smapi\n' + (c.hidden ?? '') })
const sci = (c) => dat({ ...c, hidden: 'import numpy as np\nfrom scipy import stats\n' + (c.hidden ?? '') })
const spy = (c) => dat({ ...c, hidden: 'import sympy as sp\n' + (c.hidden ?? '') })

export const statsLessonsB = [
  {
    id: 'py-correlation-regression-statsmodels',
    title: 'Correlation and regression with statsmodels',
    blurb: 'Simple linear regression, reading coefficients and R-squared, and why correlation is not causation.',
    kind: 'code',
    practice: {
      prompt: 'Write `ols_fit(x, y)`: fit a simple linear regression (`y = slope * x + intercept`) with `statsmodels`, and return `(slope, intercept)`, each rounded to 4 decimals.',
      starter: 'import statsmodels.api as sm\n\ndef ols_fit(x, y):\n    ...\n',
      solution: py`import statsmodels.api as sm

def ols_fit(x, y):
    X = sm.add_constant(x)
    model = sm.OLS(y, X).fit()
    intercept, slope = model.params
    return (round(float(slope), 4), round(float(intercept), 4))`,
      samples: ['ols_fit([1.0, 2.0, 3.0, 4.0], [3.0, 5.0, 7.0, 9.0])'],
      cases: [
        ['A perfect line', 'ols_fit([1.0, 2.0, 3.0, 4.0], [3.0, 5.0, 7.0, 9.0])'],
        ['A negative slope', 'ols_fit([1.0, 2.0, 3.0], [10.0, 8.0, 6.0])'],
        ['A flat line', 'ols_fit([1.0, 2.0, 3.0], [5.0, 5.0, 5.0])'],
        ['A non-zero intercept', 'ols_fit([0.0, 1.0, 2.0], [4.0, 6.0, 8.0])'],
      ],
      traps: [
        py`import statsmodels.api as sm

def ols_fit(x, y):
    model = sm.OLS(y, x).fit()
    slope = model.params[0]
    return (round(float(slope), 4), round(0.0, 4))`,
        py`import statsmodels.api as sm

def ols_fit(x, y):
    X = sm.add_constant(x)
    model = sm.OLS(y, X).fit()
    intercept, slope = model.params
    return (round(float(intercept), 4), round(float(slope), 4))`,
      ],
    },
    real: [
      sm({
        title: 'Bill length versus body mass',
        use: ['penguins'],
        starter: 'sub = [(p["bill_length_mm"], p["body_mass_g"]) for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None]\nx = [v[0] for v in sub]\ny = [v[1] for v in sub]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. x and y already hold every real, non-missing (bill length, mass) pair.',
        brief: 'Fit `y = slope * x + intercept` with `statsmodels`. Store `(slope, intercept)`, each rounded to 2 decimals, in `answer`.',
        reference: py`sub = [(p["bill_length_mm"], p["body_mass_g"]) for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
x = [v[0] for v in sub]
y = [v[1] for v in sub]
X = smapi.add_constant(x)
model = smapi.OLS(y, X).fit()
intercept, slope = model.params
answer = (round(float(slope), 2), round(float(intercept), 2))`,
        walkthrough: 'A longer bill is associated with a heavier bird overall in this data, which shows up as a clearly positive slope.',
        traps: [py`sub = [(p["bill_length_mm"], p["body_mass_g"]) for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
x = [v[0] for v in sub]
y = [v[1] for v in sub]
model = smapi.OLS(y, x).fit()
answer = (round(float(model.params[0]), 2), round(0.0, 2))`],
      }),
      sm({
        title: 'Distance versus air time',
        use: ['flights'],
        starter: 'sub = [(f["distance"], f["air_time"]) for f in flights[:500] if f["air_time"] is not None]\nx = [v[0] for v in sub]\ny = [v[1] for v in sub]\nanswer = ...\n',
        given: '# flights is a list of dictionaries. x and y already hold up to 500 real (distance, air_time) pairs.',
        brief: 'Fit `air_time = slope * distance + intercept`. Store the R-squared of the fit, rounded to 6 decimals, in `answer`.',
        reference: py`sub = [(f["distance"], f["air_time"]) for f in flights[:500] if f["air_time"] is not None]
x = [v[0] for v in sub]
y = [v[1] for v in sub]
X = smapi.add_constant(x)
model = smapi.OLS(y, X).fit()
answer = round(float(model.rsquared), 6)`,
        walkthrough: 'Distance and air time are so tightly linked physically that a simple linear fit should explain most of the variation, showing up as a high R-squared.',
        traps: [py`sub = [(f["distance"], f["air_time"]) for f in flights[:500] if f["air_time"] is not None]
x = [v[0] for v in sub]
y = [v[1] for v in sub]
X = smapi.add_constant(x)
model = smapi.OLS(y, X).fit()
answer = round(float(model.rsquared_adj), 6)`],
      }),
      sm({
        title: 'Popularity versus streams: correlation is not causation',
        use: ['songs'],
        starter: 'sub = [(s["spotify_popularity"], s["spotify_streams"]) for s in songs if s["spotify_popularity"] is not None and s["spotify_streams"] is not None][:300]\nx = [v[0] for v in sub]\ny = [v[1] for v in sub]\nanswer = ...\n',
        given: '# songs is a list of dictionaries. x and y already hold up to 300 real (popularity, streams) pairs.',
        brief: 'Compute the Pearson correlation between `x` and `y` with `np.corrcoef`, rounded to 3 decimals, in `answer`.',
        reference: py`sub = [(s["spotify_popularity"], s["spotify_streams"]) for s in songs if s["spotify_popularity"] is not None and s["spotify_streams"] is not None][:300]
x = [v[0] for v in sub]
y = [v[1] for v in sub]
answer = round(float(np.corrcoef(x, y)[0, 1]), 3)`,
        walkthrough: "A strong correlation between popularity and streams is expected, but it does not by itself prove either one *causes* the other — both could be driven by a third factor, like overall song quality or marketing spend.",
        traps: [py`sub = [(s["spotify_popularity"], s["spotify_streams"]) for s in songs if s["spotify_popularity"] is not None and s["spotify_streams"] is not None][:300]
x = [v[0] for v in sub]
y = [v[1] for v in sub]
answer = round(float(np.corrcoef(x, y)[0, 0]), 3)`],
      }),
    ],
  },
  {
    id: 'py-scipy-tour',
    title: 'SciPy tour: optimisation, integration, interpolation and sparse data',
    blurb: 'minimize and curve_fit, numerical integration, interpolation, and sparse matrices.',
    kind: 'code',
    practice: {
      prompt: 'Write `fit_line(x, y)`: fit `y = a * x + b` with `scipy.optimize.curve_fit`, and return `(a, b)`, each rounded to 3 decimals.',
      starter: 'from scipy.optimize import curve_fit\n\ndef fit_line(x, y):\n    ...\n',
      solution: py`from scipy.optimize import curve_fit

def fit_line(x, y):
    def model(x, a, b):
        return a * x + b

    popt, _ = curve_fit(model, x, y)
    return (round(float(popt[0]), 3), round(float(popt[1]), 3))`,
      samples: ['fit_line([1.0, 2.0, 3.0, 4.0], [3.0, 5.0, 7.0, 9.0])'],
      cases: [
        ['A perfect line', 'fit_line([1.0, 2.0, 3.0, 4.0], [3.0, 5.0, 7.0, 9.0])'],
        ['A negative slope', 'fit_line([1.0, 2.0, 3.0], [9.0, 6.0, 3.0])'],
        ['A flat line', 'fit_line([1.0, 2.0, 3.0], [4.0, 4.0, 4.0])'],
      ],
      traps: [
        py`from scipy.optimize import curve_fit

def fit_line(x, y):
    def model(x, a, b):
        return a * x - b

    popt, _ = curve_fit(model, x, y)
    return (round(float(popt[0]), 3), round(float(popt[1]), 3))`,
        py`from scipy.optimize import curve_fit

def fit_line(x, y):
    def model(x, a, b):
        return a * x + b

    popt, _ = curve_fit(model, x, y)
    return (round(float(popt[1]), 3), round(float(popt[0]), 3))`,
      ],
    },
    real: [
      num({
        title: 'Integrating a smoothed delay density',
        use: ['flights'],
        starter: 'from scipy import integrate\nanswer = ...\n',
        given: '# flights is a list of dictionaries. This challenge uses a fixed, simple function rather than raw rows, to keep the integral exact.',
        brief: 'Using `scipy.integrate.quad`, integrate `f(x) = 2 * x` from `0` to `10` (a stand-in for a simple density). Store the result, rounded to 2 decimals, in `answer`.',
        reference: py`from scipy import integrate
value, _ = integrate.quad(lambda x: 2 * x, 0, 10)
answer = round(float(value), 2)`,
        walkthrough: '`quad` numerically integrates a function over a range, here recovering the exact answer (100) for this simple polynomial.',
        traps: [py`from scipy import integrate
value, _ = integrate.quad(lambda x: 2 * x, 0, 5)
answer = round(float(value), 2)`],
      }),
      num({
        title: 'Interpolating a delay trend',
        use: ['flights'],
        starter: 'by_month = sorted(set(f["month"] for f in flights))\ncounts = [sum(1 for f in flights if f["month"] == m) for m in by_month]\nfrom scipy.interpolate import interp1d\nanswer = ...\n',
        given: '# flights is a list of dictionaries. by_month and counts already hold the real monthly flight counts.',
        brief: 'Build `interp1d(by_month, counts)` and evaluate it at `6.5` (halfway between June and July). Store the result, rounded to 1 decimal, in `answer`.',
        reference: py`by_month = sorted(set(f["month"] for f in flights))
counts = [sum(1 for f in flights if f["month"] == m) for m in by_month]
from scipy.interpolate import interp1d
f = interp1d(by_month, counts)
answer = round(float(f(6.5)), 1)`,
        walkthrough: 'Linear interpolation (the default) estimates a value between two known points as a straight line connecting them.',
        traps: [py`by_month = sorted(set(f["month"] for f in flights))
counts = [sum(1 for f in flights if f["month"] == m) for m in by_month]
from scipy.interpolate import interp1d
f = interp1d(by_month, counts)
answer = round(float(f(7.5)), 1)`],
      }),
      num({
        title: 'Minimising a cost function over ticket prices',
        use: ['tracks'],
        starter: 'from scipy.optimize import minimize_scalar\nbase_price = float(np.mean([t["UnitPrice"] for t in tracks[:50]]))\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. base_price already holds a real average track price.',
        brief: 'A toy revenue-loss model is `cost(p) = (p - base_price) ** 2 + 1`. Using `scipy.optimize.minimize_scalar`, find the `p` that minimises it. Store it, rounded to 2 decimals, in `answer`.',
        reference: py`from scipy.optimize import minimize_scalar
base_price = float(np.mean([t["UnitPrice"] for t in tracks[:50]]))
result = minimize_scalar(lambda p: (p - base_price) ** 2 + 1)
answer = round(float(result.x), 2)`,
        walkthrough: 'This particular cost function is minimised exactly at `base_price`, by construction — a simple, checkable case for what `minimize_scalar` is doing.',
        traps: [py`from scipy.optimize import minimize_scalar
base_price = float(np.mean([t["UnitPrice"] for t in tracks[:50]]))
result = minimize_scalar(lambda p: (p - base_price) ** 2 + 1)
answer = round(float(result.fun), 2)`],
      }),
    ],
  },
  {
    id: 'py-sympy',
    title: 'SymPy: symbolic mathematics',
    blurb: 'Symbols, expressions, solving equations, and derivatives and integrals.',
    kind: 'code',
    practice: {
      prompt: 'Write `derivative(expr)`: given a polynomial expression as text (using `x`, e.g. `"x**2 + 3*x"`), return its derivative with respect to `x`, as text.',
      starter: 'import sympy as sp\n\ndef derivative(expr):\n    ...\n',
      solution: py`import sympy as sp

def derivative(expr):
    x = sp.symbols("x")
    e = sp.sympify(expr)
    d = sp.diff(e, x)
    return str(d)`,
      samples: ['derivative("x**2")'],
      cases: [
        ['A simple square', 'derivative("x**2")'],
        ['A polynomial with a linear term', 'derivative("x**3 + 2*x")'],
        ['A constant has derivative zero', 'derivative("5")'],
        ['A linear term alone', 'derivative("3*x")'],
      ],
      traps: [
        py`import sympy as sp

def derivative(expr):
    x = sp.symbols("x")
    e = sp.sympify(expr)
    return str(e)`,
        py`import sympy as sp

def derivative(expr):
    x = sp.symbols("x")
    e = sp.sympify(expr)
    d = sp.diff(e, x, 2)
    return str(d)`,
        py`import sympy as sp

def derivative(expr):
    y = sp.symbols("y")
    e = sp.sympify(expr)
    d = sp.diff(e, y)
    return str(d)`,
      ],
    },
    real: [
      num({
        title: 'A revenue curve from real track prices',
        use: ['tracks'],
        starter: 'import sympy as sp\navg_price = round(float(np.mean([t["UnitPrice"] for t in tracks[:20]])), 2)\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. avg_price already holds a real average price, rounded.',
        brief: 'Build the expression string `f"{avg_price}*x - x**2"` (revenue for `x` sales at a fixed unit price, minus a quadratic cost term), and find its derivative with respect to `x` as text. Store it in `answer`.',
        reference: py`import sympy as sp
avg_price = round(float(np.mean([t["UnitPrice"] for t in tracks[:20]])), 2)
x = sp.symbols("x")
expr = sp.sympify(f"{avg_price}*x - x**2")
answer = str(sp.diff(expr, x))`,
        walkthrough: 'The derivative of a revenue-like expression tells you the marginal effect of one more sale — here, a constant term minus a term proportional to `x`.',
        traps: [py`import sympy as sp
avg_price = round(float(np.mean([t["UnitPrice"] for t in tracks[:20]])), 2)
x = sp.symbols("x")
expr = sp.sympify(f"{avg_price}*x - x**2")
answer = str(expr)`],
      }),
      num({
        title: 'Solving for a break-even point',
        use: ['tracks'],
        starter: 'import sympy as sp\nprice = round(float(tracks[0]["UnitPrice"]), 2)\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. price already holds one real track price, rounded.',
        brief: 'Solve `price*x - 10 = 0` for `x` with `sp.solve`, and store the solution as a rounded float (2 decimals) in `answer`.',
        reference: py`import sympy as sp
price = round(float(tracks[0]["UnitPrice"]), 2)
x = sp.symbols("x")
solutions = sp.solve(sp.Eq(price * x, 10), x)
answer = round(float(solutions[0]), 2)`,
        walkthrough: '`sp.solve` finds the exact value(s) of `x` that satisfy an equation, here the number of sales needed to cover a fixed cost of 10.',
        traps: [py`import sympy as sp
price = round(float(tracks[0]["UnitPrice"]), 2)
x = sp.symbols("x")
solutions = sp.solve(sp.Eq(price * x, -10), x)
answer = round(float(solutions[0]), 2)`],
      }),
      num({
        title: 'Simplifying an expanded price difference',
        use: ['tracks'],
        starter: 'import sympy as sp\nn = len(tracks[:5])\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. n already holds a real count (5).',
        brief: 'Build the expression `(x + n)**2 - (x**2 + 2*n*x + n**2)` (which is mathematically zero, but does not look it before simplifying), simplify it with `sp.simplify`, and store the result as text in `answer`.',
        reference: py`import sympy as sp
n = len(tracks[:5])
x = sp.symbols("x")
expr = (x + n) ** 2 - (x ** 2 + 2 * n * x + n ** 2)
answer = str(sp.simplify(expr))`,
        walkthrough: '`sp.simplify` recognises that the expanded and unexpanded forms are algebraically identical, collapsing the whole thing to `0` — something SymPy does not do automatically just from writing the expression down.',
        traps: [py`import sympy as sp
n = len(tracks[:5])
x = sp.symbols("x")
expr = (x + n) ** 2 - (x ** 2 + 2 * n * x + n ** 2)
answer = str(expr)`],
      }),
    ],
  },
  {
    id: 'py-statistics-pitfalls',
    title: "Statistics pitfalls: Simpson's paradox, bias and p-hacking",
    blurb: "Simpson's paradox, selection and survivorship bias, base-rate neglect, and multiple testing.",
    kind: 'learn',
    check: [
      {
        q: "What is Simpson's paradox?",
        options: [
          'A statistical error that never occurs in real data',
          "A trend that appears in each of several groups separately can reverse (or disappear) when the groups are combined, usually because group sizes differ",
          'A rule that says correlation always implies causation',
          'A method for choosing histogram bins',
        ],
        answer: 1,
        why: "Simpson's paradox happens when a lurking, unequally-sized grouping variable flips the direction of a trend once the groups are pooled together — a real risk any time data is aggregated without checking within-group patterns first.",
      },
      {
        q: 'What is survivorship bias?',
        options: [
          'A bias that only affects medical studies',
          "Drawing conclusions from only the cases that 'survived' some filtering process, while the cases that did not survive (and might tell a very different story) are invisible in the data",
          'A bias caused by using too large a sample size',
          'A synonym for sampling with replacement',
        ],
        answer: 1,
        why: "The classic example: studying only currently-successful companies (or planes that returned from a mission) to learn what 'works' ignores every failure that never made it into the visible dataset at all.",
      },
      {
        q: 'What is base-rate neglect?',
        options: [
          'Forgetting to normalise a histogram',
          'Focusing on how well a test detects a condition while ignoring how rare that condition actually is in the first place, which can make a positive result far less meaningful than it first appears',
          'A term for missing values in the base rate column',
          'Using too high a significance threshold',
        ],
        answer: 1,
        why: 'Even an accurate test can produce mostly false positives if the condition it detects is rare enough — a fact easy to miss without explicitly accounting for the base rate.',
      },
      {
        q: 'Why is testing many hypotheses at once (multiple testing) a statistical risk?',
        options: [
          'It is not a risk; more tests always mean more evidence',
          'Each individual test has some chance of a false positive purely by chance, so testing enough different things makes finding at least one "significant" result by pure luck increasingly likely',
          'It only matters when using a computer',
          'It always makes every p-value too conservative',
        ],
        answer: 1,
        why: 'If 20 unrelated tests are each run at a 5% false-positive threshold, finding at least one "significant" result by chance alone becomes fairly likely — multiple-testing corrections exist specifically to account for this.',
      },
      {
        q: 'What does "overfitting a story to data" mean, in the context of an exploratory analysis?',
        options: [
          'Building a machine learning model that is too accurate',
          'Constructing a compelling-sounding explanation that fits the specific quirks of one dataset, without checking whether it would hold up on new data or under a more careful test',
          'Writing a report that is too long',
          'Using too many charts in a presentation',
        ],
        answer: 1,
        why: "A dataset always contains some amount of pure noise; a sufficiently motivated search can always find a pattern that fits it, whether or not that pattern reflects anything real or repeatable.",
      },
    ],
  },
  {
    id: 'py-ab-testing-workshop',
    title: 'A/B testing workshop',
    blurb: 'Designing the test, sample size and power, running the analysis, and the peeking problem.',
    kind: 'code',
    practice: {
      prompt: 'Write `ab_test(a_conv, a_n, b_conv, b_n)`: given conversion counts and sample sizes for two groups, return the `(z_statistic, p_value)` for a two-proportion z-test (pooled standard error, two-sided), each rounded to 4 decimals.',
      starter: 'import numpy as np\nfrom scipy import stats\n\ndef ab_test(a_conv, a_n, b_conv, b_n):\n    ...\n',
      solution: py`import numpy as np
from scipy import stats

def ab_test(a_conv, a_n, b_conv, b_n):
    p1, p2 = a_conv / a_n, b_conv / b_n
    p_pool = (a_conv + b_conv) / (a_n + b_n)
    se = np.sqrt(p_pool * (1 - p_pool) * (1 / a_n + 1 / b_n))
    z = (p1 - p2) / se
    p_value = 2 * (1 - stats.norm.cdf(abs(z)))
    return (round(float(z), 4), round(float(p_value), 4))`,
      samples: ['ab_test(50, 500, 65, 500)'],
      cases: [
        ['A moderate difference', 'ab_test(50, 500, 65, 500)'],
        ['No difference at all', 'ab_test(50, 500, 50, 500)'],
        ['Swapping groups flips the sign of z, not the p-value', 'z1, p1 = ab_test(50, 500, 65, 500)\nz2, p2 = ab_test(65, 500, 50, 500)\n(round(z1, 2) == round(-z2, 2), round(p1, 4) == round(p2, 4))'],
        ['A large, clear difference', 'ab_test(10, 1000, 200, 1000)'],
      ],
      traps: [
        py`import numpy as np
from scipy import stats

def ab_test(a_conv, a_n, b_conv, b_n):
    p1, p2 = a_conv / a_n, b_conv / b_n
    se = np.sqrt(p1 * (1 - p1) / a_n + p2 * (1 - p2) / b_n)
    z = (p1 - p2) / se
    p_value = 2 * (1 - stats.norm.cdf(abs(z)))
    return (round(float(z), 4), round(float(p_value), 4))`,
        py`import numpy as np
from scipy import stats

def ab_test(a_conv, a_n, b_conv, b_n):
    p1, p2 = a_conv / a_n, b_conv / b_n
    p_pool = (a_conv + b_conv) / (a_n + b_n)
    se = np.sqrt(p_pool * (1 - p_pool) * (1 / a_n + 1 / b_n))
    z = (p1 - p2) / se
    p_value = 1 - stats.norm.cdf(abs(z))
    return (round(float(z), 4), round(float(p_value), 4))`,
      ],
    },
    real: [
      num({
        title: 'Comparing on-time rates between two carriers',
        use: ['flights'],
        starter: 'from scipy import stats\naa = [f for f in flights if f["carrier"] == "AA" and f["dep_delay"] is not None][:400]\nua = [f for f in flights if f["carrier"] == "UA" and f["dep_delay"] is not None][:400]\naa_conv = sum(1 for f in aa if f["dep_delay"] <= 0)\nua_conv = sum(1 for f in ua if f["dep_delay"] <= 0)\nanswer = ...\n',
        given: '# flights is a list of dictionaries. aa_conv/ua_conv already count real on-time-or-early departures for two carriers, out of up to 400 each.',
        brief: 'Run the same two-proportion z-test as the practice, treating "on time or early" as the conversion. Store `(z, p_value)`, each rounded to 4 decimals, in `answer`.',
        reference: py`from scipy import stats
aa = [f for f in flights if f["carrier"] == "AA" and f["dep_delay"] is not None][:400]
ua = [f for f in flights if f["carrier"] == "UA" and f["dep_delay"] is not None][:400]
aa_conv = sum(1 for f in aa if f["dep_delay"] <= 0)
ua_conv = sum(1 for f in ua if f["dep_delay"] <= 0)
p1, p2 = aa_conv / len(aa), ua_conv / len(ua)
p_pool = (aa_conv + ua_conv) / (len(aa) + len(ua))
se = np.sqrt(p_pool * (1 - p_pool) * (1 / len(aa) + 1 / len(ua)))
z = (p1 - p2) / se
p_value = 2 * (1 - stats.norm.cdf(abs(z)))
answer = (round(float(z), 4), round(float(p_value), 4))`,
        walkthrough: 'The same formula applies whether the "conversion" is a marketing click or, as here, an on-time departure — the two-proportion z-test only cares about counts and sample sizes.',
        traps: [py`from scipy import stats
aa = [f for f in flights if f["carrier"] == "AA" and f["dep_delay"] is not None][:400]
ua = [f for f in flights if f["carrier"] == "UA" and f["dep_delay"] is not None][:400]
aa_conv = sum(1 for f in aa if f["dep_delay"] <= 0)
ua_conv = sum(1 for f in ua if f["dep_delay"] <= 0)
p1, p2 = aa_conv / len(aa), ua_conv / len(ua)
se = np.sqrt(p1 * (1 - p1) / len(aa) + p2 * (1 - p2) / len(ua))
z = (p1 - p2) / se
p_value = 2 * (1 - stats.norm.cdf(abs(z)))
answer = (round(float(z), 4), round(float(p_value), 4))`],
      }),
      num({
        title: 'Explicit-content rate: two eras of Spotify releases',
        use: ['songs'],
        starter: 'from scipy import stats\nolder = [s for s in songs if s["release_date"] is not None and s["release_date"] < "2020-01-01"][:300]\nnewer = [s for s in songs if s["release_date"] is not None and s["release_date"] >= "2020-01-01"][:300]\nolder_conv = sum(1 for s in older if s["explicit_track"] == 1)\nnewer_conv = sum(1 for s in newer if s["explicit_track"] == 1)\nanswer = ...\n',
        given: '# songs is a list of dictionaries. older_conv/newer_conv already count real explicit tracks in two release-date eras, out of up to 300 each.',
        brief: 'Run the two-proportion z-test comparing explicit-track rates between `older` and `newer`. Store `(z, p_value)`, each rounded to 4 decimals, in `answer`.',
        reference: py`from scipy import stats
older = [s for s in songs if s["release_date"] is not None and s["release_date"] < "2020-01-01"][:300]
newer = [s for s in songs if s["release_date"] is not None and s["release_date"] >= "2020-01-01"][:300]
older_conv = sum(1 for s in older if s["explicit_track"] == 1)
newer_conv = sum(1 for s in newer if s["explicit_track"] == 1)
p1, p2 = older_conv / len(older), newer_conv / len(newer)
p_pool = (older_conv + newer_conv) / (len(older) + len(newer))
se = np.sqrt(p_pool * (1 - p_pool) * (1 / len(older) + 1 / len(newer)))
z = (p1 - p2) / se
p_value = 2 * (1 - stats.norm.cdf(abs(z)))
answer = (round(float(z), 4), round(float(p_value), 4))`,
        walkthrough: 'Comparing two time periods this way treats "era" exactly like an A/B test\'s two groups — the statistics do not know or care that the grouping came from a date rather than a random assignment.',
        traps: [py`from scipy import stats
older = [s for s in songs if s["release_date"] is not None and s["release_date"] < "2020-01-01"][:300]
newer = [s for s in songs if s["release_date"] is not None and s["release_date"] >= "2020-01-01"][:300]
older_conv = sum(1 for s in older if s["explicit_track"] == 1)
newer_conv = sum(1 for s in newer if s["explicit_track"] == 1)
p1, p2 = older_conv / len(older), newer_conv / len(newer)
p_pool = (older_conv + newer_conv) / (len(older) + len(newer))
se = np.sqrt(p_pool * (1 - p_pool) * (1 / len(older) + 1 / len(newer)))
z = (p1 - p2) / se
p_value = 1 - stats.norm.cdf(abs(z))
answer = (round(float(z), 4), round(float(p_value), 4))`],
      }),
      num({
        title: 'The peeking problem, illustrated',
        use: ['flights'],
        starter: 'from scipy import stats\nsample = [f for f in flights if f["dep_delay"] is not None][:1000]\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample already holds 1000 real, non-missing delays.',
        brief: 'Split `sample` into two arbitrary halves by position (first 500, last 500) and run a two-sample t-test on their `dep_delay`. Store the p-value, rounded to 4 decimals, in `answer` — a reminder that testing an arbitrary split can still produce a "significant"-looking result by chance.',
        reference: py`from scipy import stats
sample = [f for f in flights if f["dep_delay"] is not None][:1000]
first_half = [f["dep_delay"] for f in sample[:500]]
second_half = [f["dep_delay"] for f in sample[500:]]
result = stats.ttest_ind(first_half, second_half)
answer = round(float(result.pvalue), 4)`,
        walkthrough: "This split has no real reason to differ (it is just the data's original order), which is exactly the point: running a test on an arbitrary split, or repeatedly \"peeking\" at a test as data trickles in, inflates the chance of a spurious \"significant\" result.",
        traps: [py`from scipy import stats
sample = [f for f in flights if f["dep_delay"] is not None][:1000]
first_half = [f["dep_delay"] for f in sample[:500]]
second_half = [f["dep_delay"] for f in sample[500:]]
result = stats.ttest_ind(first_half, second_half)
answer = round(float(result.statistic), 4)`],
      }),
    ],
  },
]
