const PENGUINS = `penguins = rows('palmer-penguins')
_masses = [p['body_mass_g'] for p in penguins if p['body_mass_g'] is not None]
n_penguins = len(penguins)
n_with_mass = len(_masses)
total_mass_g = sum(_masses)
heaviest_mass_g = max(_masses)
lightest_mass_g = min(_masses)
_a, _b = penguins[0], penguins[1]
a_bill_length, a_bill_depth = _a['bill_length_mm'], _a['bill_depth_mm']
b_bill_length, b_bill_depth = _b['bill_length_mm'], _b['bill_depth_mm']
mass_a, mass_b, mass_c = _masses[0], _masses[1], _masses[2]
n_adelie = sum(1 for p in penguins if p['species'] == 'Adelie')
n_gentoo = sum(1 for p in penguins if p['species'] == 'Gentoo')
n_chinstrap = sum(1 for p in penguins if p['species'] == 'Chinstrap')
_first = penguins[0]
year_text = str(_first['year'])
mass_text = f"{_first['body_mass_g']:,} g"
bill_text = str(_first['bill_length_mm'])
`

const DATASET = 'palmer-penguins'

export const numbersOperators = {
  id: 'numbers-operators',
  title: 'Numbers and operators',
  intro: 'Arithmetic, its surprises, and the tools that come with it.',
  lessons: [
    {
      id: 'py-arithmetic',
      title: 'Arithmetic operators and precedence',
      blurb: 'Plus, minus, times, divide, floor division, remainder and powers.',
      kind: 'code',
      practice: {
        mode: 'variables',
        prompt:
          'You are given two whole numbers, `a` and `b` (and `b` is not zero).\n\nStore the result of **floor division** in `quotient` and the **remainder** in `remainder`.',
        starter: '# a and b already exist\nquotient = \nremainder = ',
        solution: 'quotient = a // b\nremainder = a % b',
        samples: [{ setup: 'a = 17\nb = 5', names: ['quotient', 'remainder'] }],
        cases: [
          { label: 'A normal division', setup: 'a = 17\nb = 5', names: ['quotient', 'remainder'] },
          { label: 'Divides exactly', setup: 'a = 20\nb = 4', names: ['quotient', 'remainder'] },
          { label: 'Smaller number divided by a bigger one', setup: 'a = 3\nb = 10', names: ['quotient', 'remainder'] },
          { label: 'Zero on top', setup: 'a = 0\nb = 5', names: ['quotient', 'remainder'] },
          { label: 'A negative number', setup: 'a = -7\nb = 2', names: ['quotient', 'remainder'] },
          { label: 'Do not round up', setup: 'a = 19\nb = 5', names: ['quotient', 'remainder'] },
        ],
        traps: [
          'quotient = a / b\nremainder = a % b',
          'quotient = int(a / b)\nremainder = a - quotient * b',
          'quotient = a // b\nremainder = b % a',
          'quotient = round(a / b)\nremainder = a % b',
        ],
      },
      real: [
        {
          title: 'The average penguin',
          dataset: DATASET,
          hidden: PENGUINS,
          given: '# Already calculated from the penguin data:\n#   n_penguins     how many penguins there are\n#   n_with_mass    how many of them have a body mass recorded\n#   total_mass_g   the sum of all the recorded body masses, in grams',
          starter: 'answer = ',
          brief:
            'Find the **average body mass** of a penguin, in grams.\n\nOnly penguins with a recorded mass count, and the numbers you need are already prepared for you. Store the result in `answer`.',
          reference: 'answer = total_mass_g / n_with_mass',
          walkthrough:
            'An average is the total divided by the count. The catch is *which* count: a few penguins have no recorded mass, so they add nothing to the total. Dividing by all the penguins would give too small an answer. `n_with_mass` counts only the penguins that were weighed.\n\nNotice that `/` gives a float. That is what you want for an average.',
          traps: ['answer = total_mass_g / n_penguins', 'answer = total_mass_g // n_with_mass'],
        },
        {
          title: 'Groups of twenty',
          dataset: DATASET,
          hidden: PENGUINS,
          given: '# n_penguins is the number of penguins in the data.',
          starter: 'answer = ',
          brief:
            'A researcher wants to split the penguins into groups of exactly 20.\n\nHow many **full groups** can she make, and how many penguins are **left over**? Store both numbers as a pair in round brackets, for example `(3, 4)`, with the groups first.',
          reference: 'answer = (n_penguins // 20, n_penguins % 20)',
          walkthrough:
            'This is what `//` and `%` are for. Floor division gives the number of complete groups, and the remainder gives what is left over. The two go together in a pair written with round brackets: `(groups, left_over)`.',
          traps: ['answer = (n_penguins / 20, n_penguins % 20)', 'answer = (n_penguins % 20, n_penguins // 20)'],
        },
        {
          title: 'Heaviest against lightest',
          dataset: DATASET,
          hidden: PENGUINS,
          given: '# heaviest_mass_g and lightest_mass_g are the biggest and smallest recorded masses, in grams.',
          starter: 'answer = ',
          brief:
            'How many times heavier is the **heaviest** penguin than the **lightest**?\n\nRound the answer to **2 decimal places** with `round(number, 2)`. Store it in `answer`.',
          reference: 'answer = round(heaviest_mass_g / lightest_mass_g, 2)',
          walkthrough:
            'Divide the heaviest by the lightest. Use `/`, so that you get a decimal answer, and wrap the result in `round(..., 2)` to keep two decimal places.',
          traps: ['answer = heaviest_mass_g / lightest_mass_g', 'answer = heaviest_mass_g // lightest_mass_g'],
        },
      ],
    },
    {
      id: 'py-floats',
      title: 'Integers, floats and floating-point surprises',
      blurb: 'Why 0.1 + 0.2 is not 0.3, rounding, and comparing decimals safely.',
      kind: 'learn',
      check: [
        {
          q: 'Why does `0.1 + 0.2` give `0.30000000000000004`?',
          options: [
            'Python has a bug in addition',
            'Floats are stored in binary, and 0.1 and 0.2 cannot be stored exactly',
            'Python always adds a tiny random number',
            'The `+` operator only works on whole numbers',
          ],
          answer: 1,
          why: 'Floats are stored in binary. Some decimals, like 0.1, have no exact binary form, so tiny errors appear.',
        },
        {
          q: 'What is the safest way to check whether two computed floats are equal?',
          options: ['`a == b`', '`a is b`', 'Check that `abs(a - b)` is very small', 'Convert both to strings'],
          answer: 2,
          why: 'Compare with a tolerance, for example `abs(a - b) < 1e-9` or `math.isclose(a, b)`.',
        },
        {
          q: 'What does `round(2.5)` give in Python?',
          options: ['`3`', '`2`', '`2.5`', '`2.0`'],
          answer: 1,
          why: 'Python rounds exact halves to the nearest even number (banker\'s rounding), so 2.5 becomes 2.',
        },
        {
          q: 'Which is a good way to *display* a float with two decimals without changing it?',
          options: ['`round(x)`', '`int(x)`', '`f"{x:.2f}"`', '`str(x)[:4]`'],
          answer: 2,
          why: 'A format specifier such as `.2f` only affects how the number is shown. The value itself is unchanged.',
        },
        {
          q: 'How large can a Python `int` get?',
          options: ['About 2 billion', 'About 9 quintillion', 'As large as your memory allows', '255'],
          answer: 2,
          why: 'Python integers have no fixed limit. They are exact and grow as needed.',
        },
      ],
      practice: {
        mode: 'variables',
        prompt:
          'You are given two numbers, `x` and `y`.\n\nSet a variable called `close` to `True` when they are within `1e-9` of each other, and to `False` otherwise.',
        starter: '# x and y already exist\nclose = ',
        solution: 'close = abs(x - y) < 1e-9',
        samples: [{ setup: 'x = 0.1 + 0.2\ny = 0.3', names: ['close'] }],
        cases: [
          { label: 'The classic 0.1 + 0.2', setup: 'x = 0.1 + 0.2\ny = 0.3', names: ['close'] },
          { label: 'Identical numbers', setup: 'x = 5\ny = 5', names: ['close'] },
          { label: 'A tiny difference is still close', setup: 'x = 1.0\ny = 1.0000000001', names: ['close'] },
          { label: 'A small but real difference', setup: 'x = 1.0\ny = 1.001', names: ['close'] },
          { label: 'Very different', setup: 'x = 5\ny = 6', names: ['close'] },
          { label: 'Order does not matter', setup: 'x = 10\ny = 3', names: ['close'] },
        ],
        traps: ['close = x == y', 'close = abs(x - y) < 1', 'close = x - y < 1e-9', 'close = True'],
      },
    },
    {
      id: 'py-number-tools',
      title: 'Number tools: abs, min, max, sum, math and random',
      blurb: 'Built-in helpers, the math module and seeded random numbers.',
      kind: 'code',
      practice: {
        mode: 'variables',
        prompt:
          'You are given the two short sides of a right-angled triangle, `a` and `b`.\n\nStore the length of the long side (the hypotenuse), **rounded to 2 decimal places**, in `hypotenuse`. The `math` module will help.',
        starter: 'import math\n\n# a and b already exist\nhypotenuse = ',
        solution: 'import math\nhypotenuse = round(math.sqrt(a ** 2 + b ** 2), 2)',
        samples: [{ setup: 'a = 3\nb = 4', names: ['hypotenuse'] }],
        cases: [
          { label: 'A 3-4-5 triangle', setup: 'a = 3\nb = 4', names: ['hypotenuse'] },
          { label: 'Two equal sides', setup: 'a = 1\nb = 1', names: ['hypotenuse'] },
          { label: 'A 5-12-13 triangle', setup: 'a = 5\nb = 12', names: ['hypotenuse'] },
          { label: 'Decimal sides', setup: 'a = 2.5\nb = 6', names: ['hypotenuse'] },
          { label: 'Needs rounding', setup: 'a = 7\nb = 2', names: ['hypotenuse'] },
        ],
        traps: [
          'import math\nhypotenuse = math.sqrt(a ** 2 + b ** 2)',
          'hypotenuse = round(a + b, 2)',
          'import math\nhypotenuse = round(math.sqrt(a + b), 2)',
        ],
      },
      real: [
        {
          title: 'How far apart are two beaks?',
          dataset: DATASET,
          hidden: PENGUINS,
          given:
            '# The first two penguins. Each beak is a point on a plane:\n# (bill length, bill depth), both in millimetres.\n#   a_bill_length, a_bill_depth    the first penguin\n#   b_bill_length, b_bill_depth    the second penguin\nimport math',
          starter: 'answer = ',
          brief:
            'Treat each beak as a point `(length, depth)`. Find the **straight-line distance** between the two points, rounded to **2 decimal places**.\n\nThe distance is the hypotenuse of a triangle whose short sides are the differences in length and in depth.',
          reference: 'answer = round(math.hypot(a_bill_length - b_bill_length, a_bill_depth - b_bill_depth), 2)',
          walkthrough:
            'Subtract to get the two differences, then use `math.hypot`, which returns the length of the long side of a right-angled triangle. Finally round the result to 2 decimal places. The differences may be negative, but squaring inside `hypot` takes care of the sign.',
          traps: [
            'answer = abs(a_bill_length - b_bill_length) + abs(a_bill_depth - b_bill_depth)',
            'answer = math.hypot(a_bill_length - b_bill_length, a_bill_depth - b_bill_depth)',
          ],
        },
        {
          title: 'Boxes for a very heavy shipment',
          dataset: DATASET,
          hidden: PENGUINS,
          given: '# total_mass_g is the combined recorded mass of all the penguins, in grams.\nimport math',
          starter: 'answer = ',
          brief:
            'Pretend the whole flock has to be shipped in boxes that each hold exactly **2 kilograms**.\n\nHow many boxes do you need for the total mass? A box that is only partly full still counts as a whole box.',
          reference: 'answer = math.ceil(total_mass_g / 2000)',
          walkthrough:
            'Divide the total grams by the 2000 grams that fit in one box. Because a partly filled box still counts, always round **up**. That is what `math.ceil` does. `round` could round down and leave the last penguins without a box.',
          traps: ['answer = round(total_mass_g / 2000)', 'answer = total_mass_g // 2000', 'answer = total_mass_g / 2000'],
        },
        {
          title: 'The spread of three masses',
          dataset: DATASET,
          hidden: PENGUINS,
          given: '# The body masses of the first three penguins, in grams:\n#   mass_a, mass_b, mass_c',
          starter: 'answer = ',
          brief: 'What is the **spread** of the three masses: the difference between the biggest and the smallest? Store it in `answer`.',
          reference: 'answer = max(mass_a, mass_b, mass_c) - min(mass_a, mass_b, mass_c)',
          walkthrough:
            '`max` and `min` both accept several values at once. Subtract the smallest from the biggest and you have the spread.',
          traps: ['answer = max(mass_a, mass_b, mass_c) + min(mass_a, mass_b, mass_c)', 'answer = abs(mass_a - mass_b)'],
        },
      ],
    },
    {
      id: 'py-comparisons-logic',
      title: 'Comparison operators, logic and truthiness',
      blurb: 'Ask yes-or-no questions and combine them with and, or, not.',
      kind: 'code',
      practice: {
        mode: 'variables',
        prompt:
          'You are given a number `x` and a range from `low` to `high`.\n\nSet `in_range` to `True` if `x` lies in the range **including both ends**, and to `False` otherwise. Use a chained comparison.',
        starter: '# x, low and high already exist\nin_range = ',
        solution: 'in_range = low <= x <= high',
        samples: [{ setup: 'x = 5\nlow = 1\nhigh = 10', names: ['in_range'] }],
        cases: [
          { label: 'Inside the range', setup: 'x = 5\nlow = 1\nhigh = 10', names: ['in_range'] },
          { label: 'On the lower end', setup: 'x = 1\nlow = 1\nhigh = 10', names: ['in_range'] },
          { label: 'On the upper end', setup: 'x = 10\nlow = 1\nhigh = 10', names: ['in_range'] },
          { label: 'Below the range', setup: 'x = 0\nlow = 1\nhigh = 10', names: ['in_range'] },
          { label: 'Above the range', setup: 'x = 11\nlow = 1\nhigh = 10', names: ['in_range'] },
          { label: 'A range of one number', setup: 'x = 4\nlow = 4\nhigh = 4', names: ['in_range'] },
        ],
        traps: ['in_range = low < x < high', 'in_range = x >= low or x <= high', 'in_range = x >= low', 'in_range = low <= x <= high == True and x > low'],
      },
      real: [
        {
          title: 'Which species has more penguins?',
          dataset: DATASET,
          hidden: PENGUINS,
          given: '# The number of penguins of each species:\n#   n_adelie, n_gentoo, n_chinstrap',
          starter: 'answer = ',
          brief:
            'Answer three yes-or-no questions, in this order:\n\n1. Are there **more Adelie than Gentoo** penguins?\n2. Are there **more Gentoo than Chinstrap** penguins?\n3. Are there **more Chinstrap than Adelie** penguins?\n\nStore the three answers as a group in round brackets, like `(True, False, True)`.',
          reference: 'answer = (n_adelie > n_gentoo, n_gentoo > n_chinstrap, n_chinstrap > n_adelie)',
          walkthrough:
            'Each question is one comparison with `>`. Write the three comparisons inside round brackets, separated by commas, and Python builds the group for you.',
          traps: [
            'answer = (n_adelie < n_gentoo, n_gentoo < n_chinstrap, n_chinstrap < n_adelie)',
            'answer = (n_adelie == n_gentoo, n_gentoo == n_chinstrap, n_chinstrap == n_adelie)',
          ],
        },
        {
          title: 'Is the study balanced?',
          dataset: DATASET,
          hidden: PENGUINS,
          given: '# n_adelie, n_gentoo and n_chinstrap are the penguin counts of the three species.',
          starter: 'answer = ',
          brief:
            'Call the data **balanced** when the Adelie and Gentoo counts differ by **less than 30**, **and** the Gentoo and Chinstrap counts also differ by less than 30.\n\nStore `True` or `False` in `answer`, worked out with a comparison and `and`. The gap is the same whichever way round you subtract, so `abs()` is useful.',
          reference: 'answer = abs(n_adelie - n_gentoo) < 30 and abs(n_gentoo - n_chinstrap) < 30',
          walkthrough:
            'Make each half its own comparison: the gap between two counts is `abs(a - b)`, and you want it below 30. Join the two with `and`, so both must be true. If either gap is 30 or more, the result is `False`.',
          traps: [
            'answer = abs(n_adelie - n_gentoo) < 30 or abs(n_gentoo - n_chinstrap) < 30',
            'answer = abs(n_adelie - n_gentoo) < 30',
          ],
        },
        {
          title: 'In the middle',
          dataset: DATASET,
          hidden: PENGUINS,
          given: '# n_adelie, n_gentoo and n_chinstrap are the penguin counts of the three species.',
          starter: 'answer = ',
          brief:
            'Answer three questions with **chained comparisons**:\n\n1. Is `n_gentoo` **between** `n_chinstrap` and `n_adelie` (strictly)?\n2. Is `n_gentoo` between `n_adelie` and `n_chinstrap`, the other way round?\n3. Is `n_gentoo` at least 100 and at most 130?\n\nStore the three answers as a group in round brackets.',
          reference: 'answer = (n_chinstrap < n_gentoo < n_adelie, n_adelie < n_gentoo < n_chinstrap, 100 <= n_gentoo <= 130)',
          walkthrough:
            'A chained comparison such as `a < b < c` is true only when both parts are true. Notice how the order matters: the second question puts the biggest count on the left, so it cannot be true when the first one is.',
          traps: [
            'answer = (n_chinstrap < n_gentoo > n_adelie, n_adelie < n_gentoo > n_chinstrap, 100 < n_gentoo < 130)',
            'answer = (True, True, True)',
          ],
        },
      ],
    },
    {
      id: 'py-conversion',
      title: 'Converting between types and parsing text into numbers',
      blurb: 'int(), float(), str() and bool(), and what happens when they fail.',
      kind: 'code',
      practice: {
        mode: 'variables',
        prompt:
          'You are given the price of one item as text, `text` (such as `"19.99"`), and a whole number `quantity`.\n\nStore the **total cost, rounded to 2 decimal places**, in `total`. You will need to convert the text first.',
        starter: '# text and quantity already exist\ntotal = ',
        solution: 'total = round(float(text) * quantity, 2)',
        samples: [{ setup: 'text = "19.99"\nquantity = 3', names: ['total'] }],
        cases: [
          { label: 'A normal price', setup: 'text = "19.99"\nquantity = 3', names: ['total'] },
          { label: 'A whole-number price', setup: 'text = "5"\nquantity = 2', names: ['total'] },
          { label: 'Needs rounding', setup: 'text = "1.239"\nquantity = 2', names: ['total'] },
          { label: 'One item', setup: 'text = "1234.5"\nquantity = 1', names: ['total'] },
          { label: 'Zero items', setup: 'text = "3.75"\nquantity = 0', names: ['total'] },
        ],
        traps: [
          'total = float(text) * quantity',
          'total = text * quantity',
          'total = int(text) * quantity',
          'total = round(float(text) + quantity, 2)',
        ],
      },
      real: [
        {
          title: 'Years since the millennium',
          dataset: DATASET,
          hidden: PENGUINS,
          given: '# year_text is the year the first penguin was measured, as text.',
          starter: 'answer = ',
          brief: 'Convert `year_text` into a whole number and store how many years **after 2000** it is.',
          reference: 'answer = int(year_text) - 2000',
          walkthrough: 'The year arrives as text, and you cannot subtract from text. `int(year_text)` turns it into a number first, and then the subtraction works.',
          traps: ['answer = year_text - 2000', 'answer = year_text'],
        },
        {
          title: 'A messy mass',
          dataset: DATASET,
          hidden: PENGUINS,
          given: '# mass_text is the first penguin\'s mass written for people, for example "3,750 g".',
          starter: 'answer = ',
          brief:
            'Turn `mass_text` into the **whole number** of grams.\n\nThe text has a comma and the letters ` g` at the end. Remove them with `replace(old, new)`, which swaps one piece of text for another, and then convert what is left.',
          reference: 'answer = int(mass_text.replace(",", "").replace(" g", ""))',
          walkthrough:
            'First clean the text: `replace(",", "")` deletes the comma and `replace(" g", "")` deletes the unit. What remains looks like a plain whole number, so `int()` can convert it.',
          traps: ['answer = int(mass_text)', 'answer = mass_text.replace(",", "")'],
        },
        {
          title: 'A bill in whole millimetres',
          dataset: DATASET,
          hidden: PENGUINS,
          given: '# bill_text is the first penguin\'s bill length in millimetres, as text.',
          starter: 'answer = ',
          brief: 'Convert `bill_text` to a number and **round it to a whole millimetre**.',
          reference: 'answer = round(float(bill_text))',
          walkthrough:
            'The text has a decimal point, so `int(bill_text)` would fail. Convert with `float()` first, then `round()` to a whole number.',
          traps: ['answer = float(bill_text)', 'answer = int(bill_text)', 'answer = round(float(bill_text) + 1)'],
        },
      ],
    },
    {
      id: 'py-other-numbers',
      title: 'Other number types: Decimal, Fraction, complex and bitwise operators',
      blurb: 'Exact decimals for money, exact fractions, complex numbers and bits.',
      kind: 'learn',
      check: [
        {
          q: 'Which type is best for adding up prices where exact cents matter?',
          options: ['`float`', '`Decimal`', '`complex`', '`bool`'],
          answer: 1,
          why: '`Decimal` stores decimal digits exactly, so 0.10 + 0.20 is exactly 0.30.',
        },
        {
          q: 'Why should you write `Decimal("0.1")` rather than `Decimal(0.1)`?',
          options: [
            'The string version is faster',
            'The float `0.1` is already slightly inexact, and `Decimal(0.1)` copies that error',
            'Decimal does not accept floats at all',
            'There is no difference',
          ],
          answer: 1,
          why: 'A float carries its binary rounding error. Creating a Decimal from text keeps the exact digits.',
        },
        {
          q: 'What is `Fraction(1, 3) + Fraction(1, 6)`?',
          options: ['`0.5`', '`Fraction(1, 2)`', '`Fraction(2, 9)`', '`0.4999999`'],
          answer: 1,
          why: 'Fractions are exact, so one third plus one sixth is exactly one half.',
        },
        {
          q: 'What does `6 & 3` compute?',
          options: ['`9`', '`2`', '`3`', '`18`'],
          answer: 1,
          why: '`&` keeps the bits that are 1 in both numbers. 6 is `110` and 3 is `011`, so the result is `010`, which is 2.',
        },
        {
          q: 'What happens when you add a `Decimal` and a `float`?',
          options: ['The float is converted silently', 'A `TypeError`', 'The result is always 0', 'You get a `Fraction`'],
          answer: 1,
          why: 'Python will not mix them, because it cannot know which precision you want. Convert one of them first.',
        },
      ],
      practice: {
        mode: 'variables',
        prompt:
          'You are given two prices as text, `a` and `b`, for example `"0.10"` and `"0.20"`.\n\nStore their **exact sum** in `total`, as a `Decimal`. Remember to import it: `from decimal import Decimal`.',
        starter: 'from decimal import Decimal\n\n# a and b already exist\ntotal = ',
        solution: 'from decimal import Decimal\ntotal = Decimal(a) + Decimal(b)',
        samples: [{ setup: 'a = "0.10"\nb = "0.20"', names: ['total'] }],
        cases: [
          { label: 'The classic tenth plus a fifth', setup: 'a = "0.10"\nb = "0.20"', names: ['total'] },
          { label: 'Prices with cents', setup: 'a = "19.99"\nb = "0.01"', names: ['total'] },
          { label: 'Another pair', setup: 'a = "1.15"\nb = "2.20"', names: ['total'] },
          { label: 'A whole-number price', setup: 'a = "5"\nb = "0.05"', names: ['total'] },
          { label: 'Both zero', setup: 'a = "0.00"\nb = "0"', names: ['total'] },
        ],
        traps: [
          'total = float(a) + float(b)',
          'from decimal import Decimal\ntotal = Decimal(float(a)) + Decimal(float(b))',
          'from decimal import Decimal\ntotal = Decimal(a)',
        ],
      },
    },
  ],
  checkpoint: [],
}
