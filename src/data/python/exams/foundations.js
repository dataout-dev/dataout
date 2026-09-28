const HIDDEN = "penguins = rows('palmer-penguins')\n"
const MASSES = HIDDEN + "masses = [p['body_mass_g'] for p in penguins if p['body_mass_g'] is not None]\n"

const code = (c) => ({ kind: 'code', points: 10, dataset: 'palmer-penguins', starter: 'answer = ', hidden: HIDDEN, ...c })

export const foundationsExam = [
  code({
    id: 'f-exam-1',
    task: 'How many penguins have a body mass **over 5000 g**? Store the count in `answer`. Some masses are missing (`None`); skip them.',
    reference: 'answer = 0\nfor p in penguins:\n    if p["body_mass_g"] is not None and p["body_mass_g"] > 5000:\n        answer += 1',
    walkthrough: 'Loop, check for `None` first (otherwise the comparison fails), then count.',
    traps: ['answer = len(penguins)', 'answer = sum(1 for p in penguins if p["body_mass_g"] is not None and p["body_mass_g"] >= 5000 and p["species"] == "Gentoo") + 1'],
  }),
  {
    id: 'f-exam-2',
    kind: 'mcq',
    points: 10,
    q: 'What does this print?\n\n```python\nx = 7\ny = x // 2\nz = x % 2\nprint(y, z)\n```',
    options: ['`3.5 1`', '`3 1`', '`4 1`', '`3 0`'],
    answer: 1,
    why: '`7 // 2` is floor division, which gives 3. `7 % 2` is the remainder, which is 1.',
  },
  code({
    id: 'f-exam-3',
    hidden: MASSES,
    task: 'The list `masses` holds every recorded body mass. Store in `answer` the **average mass in kilograms**, rounded to **2 decimal places**.',
    reference: 'answer = round(sum(masses) / len(masses) / 1000, 2)',
    walkthrough: 'Sum and divide by the count for the mean in grams, divide by 1000 for kilograms, and round the result.',
    traps: ['answer = round(sum(masses) / len(masses), 2)', 'answer = round(sum(masses) / 1000, 2)'],
  }),
  {
    id: 'f-exam-4',
    kind: 'mcq',
    points: 10,
    q: 'What is the value of `s[1:4]` when `s = "python"`?',
    options: ['`"pyth"`', '`"yth"`', '`"ytho"`', '`"pyt"`'],
    answer: 1,
    why: 'A slice starts at index 1 and stops **before** index 4, so it takes positions 1, 2 and 3: `yth`.',
  },
  code({
    id: 'f-exam-5',
    task: 'Store in `answer` a **list of the different islands**, sorted alphabetically, with no repeats.',
    reference: 'answer = sorted({p["island"] for p in penguins})',
    walkthrough: 'A set removes repeats, and `sorted` turns it into an alphabetical list.',
    traps: ['answer = [p["island"] for p in penguins]', 'answer = list({p["island"] for p in penguins})[::-1]'],
  }),
  code({
    id: 'f-exam-6',
    task: 'Store in `answer` a **dictionary** with the number of penguins of each **sex**. Ignore penguins whose sex is `None`. The keys are the sex values as they appear in the data.',
    reference: 'answer = {}\nfor p in penguins:\n    sex = p["sex"]\n    if sex is None:\n        continue\n    answer[sex] = answer.get(sex, 0) + 1',
    walkthrough: 'Count with `get(key, 0) + 1`, and skip the rows where the sex is missing.',
    traps: ['answer = {}\nfor p in penguins:\n    answer[p["sex"]] = answer.get(p["sex"], 0) + 1'],
  }),
  {
    id: 'f-exam-7',
    kind: 'mcq',
    points: 10,
    q: 'What does this print?\n\n```python\nitems = [1, 2, 3]\nother = items\nother.append(4)\nprint(len(items))\n```',
    options: ['`3`', '`4`', '`7`', 'An error'],
    answer: 1,
    why: '`other = items` does not copy the list. Both names point to the same list, so the appended 4 shows in `items` too.',
  },
  code({
    id: 'f-exam-8',
    task: 'Write a function `heaviest(rows)` that returns the **row (dictionary)** of the penguin with the highest body mass, ignoring rows with a missing mass. Store `heaviest(penguins)["species"]` and the mass in `answer` as a tuple `(species, mass)`.',
    starter: 'def heaviest(rows):\n    ...\n\nanswer = ',
    reference: 'def heaviest(rows):\n    best = None\n    for row in rows:\n        if row["body_mass_g"] is None:\n            continue\n        if best is None or row["body_mass_g"] > best["body_mass_g"]:\n            best = row\n    return best\n\nanswer = (heaviest(penguins)["species"], heaviest(penguins)["body_mass_g"])',
    walkthrough: 'Keep the best row seen so far. Start with `None`, and replace it whenever a heavier row appears.',
    traps: ['def heaviest(rows):\n    return rows[0]\n\nanswer = (heaviest(penguins)["species"], heaviest(penguins)["body_mass_g"])'],
  }),
  {
    id: 'f-exam-9',
    kind: 'mcq',
    points: 10,
    q: 'What happens when you run this?\n\n```python\ndef total(numbers):\n    result = 0\n    for n in numbers:\n        result += n\n\nprint(total([1, 2, 3]))\n```',
    options: ['It prints `6`', 'It prints `None`', 'It raises a `TypeError`', 'It prints `0`'],
    answer: 1,
    why: 'The function never uses `return`, so it gives back `None`, and that is what is printed. The sum was computed and thrown away.',
  },
  code({
    id: 'f-exam-10',
    task: 'Write `label(mass)` that returns `"light"` for a mass **under 3500**, `"heavy"` for a mass **of 4500 or more**, and `"medium"` otherwise. Store in `answer` a **dictionary with the count of each label** across all penguins with a known mass (keys `"light"`, `"medium"`, `"heavy"`).',
    starter: 'def label(mass):\n    ...\n\nanswer = ',
    reference: 'def label(mass):\n    if mass < 3500:\n        return "light"\n    if mass >= 4500:\n        return "heavy"\n    return "medium"\n\nanswer = {"light": 0, "medium": 0, "heavy": 0}\nfor p in penguins:\n    if p["body_mass_g"] is not None:\n        answer[label(p["body_mass_g"])] += 1',
    walkthrough: 'Write the decision as a function first, with the boundaries exactly as the task says, and then count with it.',
    traps: ['def label(mass):\n    if mass <= 3500:\n        return "light"\n    if mass > 4500:\n        return "heavy"\n    return "medium"\n\nanswer = {"light": 0, "medium": 0, "heavy": 0}\nfor p in penguins:\n    if p["body_mass_g"] is not None:\n        answer[label(p["body_mass_g"])] += 1'],
  }),
]
