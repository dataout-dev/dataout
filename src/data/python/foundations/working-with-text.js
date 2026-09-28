import { pen } from './common.js'

const FIRST = `_first = penguins[0]
first_species = _first['species']
first_island = _first['island']
first_mass = _first['body_mass_g']
first_bill = _first['bill_length_mm']
first_year = _first['year']
`

export const workingWithText = {
  id: 'working-with-text',
  title: 'Working with text',
  intro: 'Strings from the first quote to Unicode.',
  lessons: [
    {
      id: 'py-strings-basics',
      title: 'Strings: quotes, escapes, raw and multi-line strings',
      blurb: 'Quotes, escape sequences, raw strings, joining, repeating and len().',
      kind: 'learn',
      check: [
        {
          q: 'Which of these is a valid way to write the text `It\'s fine`?',
          options: ['`\'It\'s fine\'`', '`"It\'s fine"`', '`It\'s fine`', '`\'It"s fine\'`'],
          answer: 1,
          why: 'Double quotes around the text let the apostrophe inside stay as it is.',
        },
        {
          q: 'What does `print("a\\nb")` show?',
          options: ['`a\\nb` on one line', '`a` and `b` on two lines', '`anb`', 'An error'],
          answer: 1,
          why: '`\\n` is an escape sequence for a new line, so the text is split over two lines.',
        },
        {
          q: 'What is `len("hi there")`?',
          options: ['`7`', '`8`', '`2`', '`9`'],
          answer: 1,
          why: 'Spaces count, so "hi there" has 8 characters: h, i, space, t, h, e, r, e.',
        },
        {
          q: 'What does `"ab" * 3` produce?',
          options: ['`"ab3"`', '`"ababab"`', '`"aaabbb"`', 'A `TypeError`'],
          answer: 1,
          why: 'Multiplying a string by a whole number repeats it.',
        },
        {
          q: 'What happens with `word = "cat"` followed by `word[0] = "b"`?',
          options: ['`word` becomes "bat"', '`word` becomes "b"', 'A `TypeError`, because strings are immutable', 'Nothing happens'],
          answer: 2,
          why: 'Strings cannot be changed in place. You have to build a new string.',
        },
      ],
      practice: {
        mode: 'variables',
        prompt:
          'You are given a text variable `name`.\n\nBuild the greeting `"Hello, "` followed by the name and an exclamation mark, and store it in `greeting`. Then store a line of `=` signs **exactly as long as the greeting** in `underline`.',
        starter: '# name already exists\ngreeting = \nunderline = ',
        solution: 'greeting = "Hello, " + name + "!"\nunderline = "=" * len(greeting)',
        samples: [{ setup: 'name = "Ada"', names: ['greeting', 'underline'] }],
        cases: [
          { label: 'A short name', setup: 'name = "Ada"', names: ['greeting', 'underline'] },
          { label: 'A longer name', setup: 'name = "Grace Hopper"', names: ['greeting', 'underline'] },
          { label: 'A one-letter name', setup: 'name = "X"', names: ['greeting', 'underline'] },
          { label: 'An empty name', setup: 'name = ""', names: ['greeting', 'underline'] },
        ],
        traps: [
          'greeting = "Hello, " + name\nunderline = "=" * len(greeting)',
          'greeting = "Hello, " + name + "!"\nunderline = "=" * 10',
          'greeting = "Hello," + name + "!"\nunderline = "=" * len(greeting)',
          'greeting = "Hello, " + name + "!"\nunderline = "=" * len(name)',
        ],
      },
    },
    {
      id: 'py-string-slicing',
      title: 'Indexing and slicing strings',
      blurb: 'Positions from the front and the back, and start:stop:step slices.',
      kind: 'learn',
      check: [
        {
          q: 'What is `"Python"[1]`?',
          options: ['`"P"`', '`"y"`', '`"t"`', 'An error'],
          answer: 1,
          why: 'Indexes start at 0, so index 1 is the second character, "y".',
        },
        {
          q: 'What is `"Python"[-2]`?',
          options: ['`"P"`', '`"n"`', '`"o"`', '`"y"`'],
          answer: 2,
          why: 'Negative indexes count from the end: `-1` is "n" and `-2` is "o".',
        },
        {
          q: 'What is `"Python"[1:4]`?',
          options: ['`"yth"`', '`"ytho"`', '`"Pyth"`', '`"tho"`'],
          answer: 0,
          why: 'A slice includes the start and excludes the stop: positions 1, 2 and 3, which are "y", "t" and "h".',
        },
        {
          q: 'Which slice reverses a string `s`?',
          options: ['`s[-1]`', '`s[::-1]`', '`s[1:-1]`', '`s[:-1]`'],
          answer: 1,
          why: 'A step of `-1` walks backwards through the whole string.',
        },
        {
          q: 'What does `"Python"[10:20]` give?',
          options: ['An `IndexError`', 'An empty string', '`None`', '`"Python"`'],
          answer: 1,
          why: 'Slices are forgiving. If the range is outside the string, the result is simply empty.',
        },
      ],
      practice: {
        mode: 'variables',
        prompt:
          'You are given a text variable `s` that has at least 4 characters.\n\nStore its **first three** characters in `first_three`, its **last two** characters in `last_two`, and a **reversed copy** in `backwards`.',
        starter: '# s already exists\nfirst_three = \nlast_two = \nbackwards = ',
        solution: 'first_three = s[:3]\nlast_two = s[-2:]\nbackwards = s[::-1]',
        samples: [{ setup: 's = "Python"', names: ['first_three', 'last_two', 'backwards'] }],
        cases: [
          { label: 'A common word', setup: 's = "Python"', names: ['first_three', 'last_two', 'backwards'] },
          { label: 'Exactly four characters', setup: 's = "abcd"', names: ['first_three', 'last_two', 'backwards'] },
          { label: 'A longer word', setup: 's = "penguin"', names: ['first_three', 'last_two', 'backwards'] },
          { label: 'With a space', setup: 's = "Hello world"', names: ['first_three', 'last_two', 'backwards'] },
        ],
        traps: [
          'first_three = s[0:2]\nlast_two = s[-2:]\nbackwards = s[::-1]',
          'first_three = s[:3]\nlast_two = s[-2]\nbackwards = s[::-1]',
          'first_three = s[:3]\nlast_two = s[-2:]\nbackwards = s[-1]',
          'first_three = s[:3]\nlast_two = s[:2]\nbackwards = s[::-1]',
        ],
      },
      real: [
        pen({
          title: 'A short code for the species',
          hidden: FIRST,
          given: '# first_species is the species name of the first penguin.',
          brief: 'Make a three-letter code for the species: its **first three letters in capitals**. Store it in `answer`.',
          reference: 'answer = first_species[:3].upper()',
          walkthrough: 'Slice the first three characters with `[:3]`, then call `.upper()` on the result. Slicing gives a new string, and methods can be chained on it.',
          traps: ['answer = first_species[:3]', 'answer = first_species[0:2].upper()'],
        }),
        pen({
          title: 'The island backwards',
          hidden: FIRST,
          given: '# first_island is the island of the first penguin.',
          brief: 'Store the island name **written backwards** in `answer`.',
          reference: 'answer = first_island[::-1]',
          walkthrough: 'A slice with a step of `-1` walks through the string from the end to the start, which reverses it.',
          traps: ['answer = first_island[-1]', 'answer = first_island[1:-1]'],
        }),
        pen({
          title: 'Trim the ends',
          hidden: FIRST,
          given: '# first_species is the species name of the first penguin.',
          brief: 'Remove the **first and the last letter** of the species name and store the rest in `answer`.',
          reference: 'answer = first_species[1:-1]',
          walkthrough: 'Start the slice at position 1 to skip the first letter, and stop at `-1` to leave out the last one: `[1:-1]`.',
          traps: ['answer = first_species[1:]', 'answer = first_species[:-1]'],
        }),
      ],
    },
    {
      id: 'py-string-methods',
      title: 'String methods you will use every day',
      blurb: 'upper, lower, strip, split, join, replace and the is... tests.',
      kind: 'code',
      practice: {
        mode: 'variables',
        prompt:
          'You are given a messy text variable `raw`, such as `"  ADA Lovelace, PhD  "`.\n\nStore a cleaned version in `cleaned`: **no spaces at the ends, all lower case, and every comma removed**. Then store the **number of words** in `n_words`, where words are separated by spaces.',
        starter: '# raw already exists\ncleaned = \nn_words = ',
        solution: 'cleaned = raw.strip().lower().replace(",", "")\nn_words = len(cleaned.split())',
        samples: [{ setup: 'raw = "  ADA Lovelace, PhD  "', names: ['cleaned', 'n_words'] }],
        cases: [
          { label: 'The example', setup: 'raw = "  ADA Lovelace, PhD  "', names: ['cleaned', 'n_words'] },
          { label: 'Already clean', setup: 'raw = "one two"', names: ['cleaned', 'n_words'] },
          { label: 'Several commas', setup: 'raw = "a,b, c,,"', names: ['cleaned', 'n_words'] },
          { label: 'A single word', setup: 'raw = "  Word "', names: ['cleaned', 'n_words'] },
          { label: 'Extra spaces between words', setup: 'raw = "x   y   z"', names: ['cleaned', 'n_words'] },
        ],
        traps: [
          'cleaned = raw.lower().replace(",", "")\nn_words = len(cleaned.split())',
          'cleaned = raw.strip().replace(",", "")\nn_words = len(cleaned.split())',
          'cleaned = raw.strip().lower()\nn_words = len(cleaned.split())',
          'cleaned = raw.strip().lower().replace(",", "")\nn_words = len(cleaned.split(" "))',
        ],
      },
      real: [
        pen({
          title: 'Tidy a messy species name',
          hidden: FIRST + 'messy_species = "  " + first_species.swapcase() + "   "\n',
          given: '# messy_species is a species name with odd capitals and spaces around it.',
          brief: 'Clean `messy_species` so it has **no spaces at the ends** and only the **first letter in capitals**, like `Adelie`. Store it in `answer`.',
          reference: 'answer = messy_species.strip().capitalize()',
          walkthrough: '`strip()` removes the spaces at the ends, and `capitalize()` makes the first letter a capital and the rest lower case. Chain them from left to right.',
          traps: ['answer = messy_species.capitalize()', 'answer = messy_species.strip().upper()', 'answer = messy_species.strip().lower()'],
        }),
        pen({
          title: 'Split a row of text',
          hidden: FIRST + 'csv_line = ",".join([first_species, first_island, str(first_year)])\n',
          given: '# csv_line is one row of a CSV file, with its values separated by commas.',
          brief: 'Split `csv_line` into its **separate values**. Store the resulting group in `answer`.',
          reference: 'answer = csv_line.split(",")',
          walkthrough: '`split(",")` breaks the text wherever there is a comma and returns the pieces as a list.',
          traps: ['answer = csv_line.split()', 'answer = csv_line.replace(",", " ")'],
        }),
        pen({
          title: 'Turn dashes into spaces',
          hidden: FIRST + 'label = first_species + "-" + first_island + "-" + str(first_year)\n',
          given: '# label looks like Adelie-Torgersen-2007.',
          brief: 'Store `label` with **every dash replaced by a space** in `answer`.',
          reference: 'answer = label.replace("-", " ")',
          walkthrough: '`replace(old, new)` swaps every occurrence of one piece of text for another.',
          traps: ['answer = label.replace("-", "")', 'answer = label.split("-")'],
        }),
      ],
    },
    {
      id: 'py-fstrings',
      title: 'f-strings and the format mini-language',
      blurb: 'Put values in text, and control decimals, width and alignment.',
      kind: 'code',
      practice: {
        mode: 'variables',
        prompt:
          'You are given a text `name` and a number `value`.\n\nBuild one report line in `line`: the **name padded on the right to a width of 10 characters**, followed by the **value with exactly 2 decimal places**. For example `"Adelie    3.50"`.',
        starter: '# name and value already exist\nline = ',
        solution: 'line = f"{name:<10}{value:.2f}"',
        samples: [{ setup: 'name = "Adelie"\nvalue = 3.5', names: ['line'] }],
        cases: [
          { label: 'The example', setup: 'name = "Adelie"\nvalue = 3.5', names: ['line'] },
          { label: 'A long value', setup: 'name = "Gentoo"\nvalue = 1234.5678', names: ['line'] },
          { label: 'A short name', setup: 'name = "X"\nvalue = 0', names: ['line'] },
          { label: 'A name of exactly ten letters', setup: 'name = "Chinstraps"\nvalue = 7.125', names: ['line'] },
          { label: 'A whole-number value', setup: 'name = "Item"\nvalue = 12', names: ['line'] },
        ],
        traps: [
          'line = f"{name:<10}{value}"',
          'line = f"{name:>10}{value:.2f}"',
          'line = f"{name:<10}{value:.1f}"',
          'line = f"{name} {value:.2f}"',
        ],
      },
      real: [
        pen({
          title: 'Describe the first penguin',
          hidden: FIRST,
          given: '# first_species and first_island describe the first penguin.',
          brief: 'Store the sentence `Adelie on Torgersen` (using the two variables) in `answer`, built with an **f-string**.',
          reference: 'answer = f"{first_species} on {first_island}"',
          walkthrough: 'Put an `f` before the quote and write each variable name inside curly brackets. Everything else is copied as it is.',
          traps: ['answer = "first_species on first_island"', 'answer = f"{first_species}{first_island}"'],
        }),
        pen({
          title: 'Mass with a thousands separator',
          hidden: FIRST,
          given: '# first_mass is the body mass of the first penguin in grams.',
          brief: 'Store the mass as text with a **thousands separator** and the unit, like `3,750 g`, in `answer`.',
          reference: 'answer = f"{first_mass:,} g"',
          walkthrough: 'The format specifier `,` adds thousands separators to a number. The unit is ordinary text after the closing bracket.',
          traps: ['answer = f"{first_mass} g"', 'answer = f"{first_mass:,}g"'],
        }),
        pen({
          title: 'The share of females',
          hidden: "n_penguins = len(penguins)\nn_female = sum(1 for p in penguins if p['sex'] == 'female')\n",
          given: '# n_penguins is the total number of penguins and n_female is how many are female.',
          brief: 'Store the **share of penguins that are female** as a percentage text with one decimal, like `48.0%`, in `answer`.',
          reference: 'answer = f"{n_female / n_penguins:.1%}"',
          walkthrough: 'Divide to get a fraction, then use the `.1%` format specifier: it multiplies by 100, keeps one decimal and adds the percent sign.',
          traps: ['answer = f"{n_female / n_penguins:.1f}%"', 'answer = f"{n_female / n_penguins:.0%}"', 'answer = f"{n_female}%"'],
        }),
      ],
    },
    {
      id: 'py-string-search',
      title: 'Searching, testing and comparing strings',
      blurb: 'in, startswith, endswith, find, count and case-insensitive comparison.',
      kind: 'code',
      practice: {
        mode: 'variables',
        prompt:
          'You are given a text variable `filename`.\n\nSet `is_csv` to `True` when the name **ends in `.csv`**, ignoring capital letters (so `DATA.CSV` counts), and to `False` otherwise.',
        starter: '# filename already exists\nis_csv = ',
        solution: 'is_csv = filename.lower().endswith(".csv")',
        samples: [{ setup: 'filename = "penguins.csv"', names: ['is_csv'] }],
        cases: [
          { label: 'A csv file', setup: 'filename = "penguins.csv"', names: ['is_csv'] },
          { label: 'Capital letters', setup: 'filename = "DATA.CSV"', names: ['is_csv'] },
          { label: 'Another extension', setup: 'filename = "notes.txt"', names: ['is_csv'] },
          { label: 'The text csv is in the middle', setup: 'filename = "old.csv.bak"', names: ['is_csv'] },
          { label: 'No dot at all', setup: 'filename = "csv"', names: ['is_csv'] },
        ],
        traps: [
          'is_csv = filename.endswith(".csv")',
          'is_csv = ".csv" in filename.lower()',
          'is_csv = filename.lower().startswith(".csv")',
          'is_csv = filename.lower().endswith("csv")',
        ],
      },
      real: [
        pen({
          title: 'How many Gentoo?',
          hidden: "text = ' '.join(p['species'] for p in penguins)\n",
          given: '# text is every penguin\'s species written one after the other, separated by spaces.',
          brief: 'Count how many times the word `Gentoo` appears in `text`.',
          reference: 'answer = text.count("Gentoo")',
          walkthrough: '`count` tells you how many non-overlapping times a piece of text appears.',
          traps: ['answer = text.count("gentoo")', 'answer = "Gentoo" in text'],
        }),
        pen({
          title: 'Where does the first Chinstrap appear?',
          hidden: "text = ' '.join(p['species'] for p in penguins)\n",
          given: '# text is every penguin\'s species written one after the other, separated by spaces.',
          brief: 'Find the **position** (index) in `text` where the word `Chinstrap` first appears.',
          reference: 'answer = text.find("Chinstrap")',
          walkthrough: '`find` returns the index of the first match. It would return `-1` if there were none.',
          traps: ['answer = text.count("Chinstrap")', 'answer = text.rfind("Chinstrap")'],
        }),
        pen({
          title: 'Two yes-or-no checks',
          hidden: "text = ' '.join(p['species'] for p in penguins)\n",
          given: '# text is every penguin\'s species written one after the other, separated by spaces.',
          brief: 'Answer two questions and store the answers as a pair in round brackets: Is the word `Adelie` in `text`? Is the word `Emperor` in `text`?',
          reference: 'answer = ("Adelie" in text, "Emperor" in text)',
          walkthrough: 'The `in` operator gives `True` or `False`. Write both checks inside round brackets, separated by a comma.',
          traps: ['answer = ("Adelie" in text, "Emperor" not in text)', 'answer = (True, True)'],
        }),
      ],
    },
    {
      id: 'py-unicode-basics',
      title: 'Characters and Unicode: from ord() to UTF-8',
      blurb: 'Character codes, Unicode, encodings and mojibake.',
      kind: 'learn',
      check: [
        {
          q: 'What does `ord("A")` return?',
          options: ['`"A"`', 'The number `65`', 'The number `1`', '`True`'],
          answer: 1,
          why: '`ord` gives the code of a character. For a capital "A" that is 65.',
        },
        {
          q: 'What is Unicode?',
          options: [
            'A list that gives every character in the world\'s writing systems its own number',
            'A kind of file format for images',
            'An encoding that only supports English',
            'A Python module for sorting text',
          ],
          answer: 0,
          why: 'Unicode assigns a code point to every character. Encodings such as UTF-8 turn those numbers into bytes.',
        },
        {
          q: 'Why can `len("café")` be 4 while `len("café".encode("utf-8"))` is 5?',
          options: [
            'Encoding adds a hidden character',
            'Python has a bug with accents',
            'In UTF-8, "é" takes two bytes, and `len` counts characters for a string but bytes for encoded data',
            'The string is stored twice',
          ],
          answer: 2,
          why: 'A string has 4 characters. UTF-8 stores plain letters in one byte but `é` in two, so the byte count is 5.',
        },
        {
          q: 'You see `Ã©` where you expected `é`. What most likely happened?',
          options: [
            'The data was written in UTF-8 and read with the wrong encoding',
            'The character does not exist in Unicode',
            'Python translated it on purpose',
            'The file was too long',
          ],
          answer: 0,
          why: 'This garbling is called mojibake. It comes from reading bytes with the wrong encoding.',
        },
        {
          q: 'Which is a safe habit when opening text files?',
          options: [
            'Never say which encoding you expect',
            'Say which encoding the file uses, and prefer UTF-8',
            'Always use ASCII',
            'Convert everything to numbers first',
          ],
          answer: 1,
          why: 'Be explicit about the encoding. UTF-8 is the modern standard and handles every language.',
        },
      ],
      practice: {
        mode: 'variables',
        prompt:
          'You are given a one-character text variable `letter`.\n\nStore its **character code** in `code`, and store the **next character** in the alphabet (the character whose code is one bigger) in `next_letter`.',
        starter: '# letter already exists\ncode = \nnext_letter = ',
        solution: 'code = ord(letter)\nnext_letter = chr(code + 1)',
        samples: [{ setup: 'letter = "a"', names: ['code', 'next_letter'] }],
        cases: [
          { label: 'A small letter', setup: 'letter = "a"', names: ['code', 'next_letter'] },
          { label: 'A capital letter', setup: 'letter = "Z"', names: ['code', 'next_letter'] },
          { label: 'A digit character', setup: 'letter = "5"', names: ['code', 'next_letter'] },
          { label: 'An accented letter', setup: 'letter = "é"', names: ['code', 'next_letter'] },
        ],
        traps: [
          'code = letter\nnext_letter = chr(ord(letter) + 1)',
          'code = ord(letter)\nnext_letter = letter + 1',
          'code = ord(letter) + 1\nnext_letter = chr(code)',
          'code = ord(letter)\nnext_letter = chr(code - 1)',
        ],
      },
    },
  ],
  checkpoint: [],
}
