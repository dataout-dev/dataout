You now know enough Python to write real programs. But knowing the syntax is not the same as knowing how to *solve a problem*. Beginners often stare at an empty file, unsure where to start. This lesson gives you a method, the one professionals use, for turning a vague task into working code.

You will learn:

- how to restate a problem so you understand it completely
- how to work out inputs, outputs and examples before you write code
- how to plan with pseudocode
- how to break a big problem into small functions
- how to solve a simpler version first

## Step 1: understand the problem

Before you type any code, write down, in plain words:

- **What goes in?** (the inputs)
- **What must come out?** (the output)
- **What are the rules?**

Suppose the task is: "Tell me the longest word in a sentence." Ask questions. What if two words tie? What about punctuation? What if the sentence is empty? Every question you answer now is a bug you will not have to find later.

## Step 2: work through examples by hand

Write two or three examples, including awkward ones, with the answer you expect:

| Input | Expected output |
| ----- | --------------- |
| `"the quick brown fox"` | `"quick"` (first of the longest) |
| `"a"` | `"a"` |
| `""` | `""` (or `None`, your choice) |

Working an example by hand shows you the *steps* you naturally follow. Those steps are your algorithm.

## Step 3: write pseudocode

**Pseudocode** is a plan in plain language that is halfway between English and Python. It is not run, and it has no strict syntax:

```text
split the sentence into words
longest = empty text
for each word:
    if the word is longer than longest:
        longest = word
return longest
```

Notice how easy it is to spot mistakes, like the tie rule, at this stage. Changing a line of pseudocode is quicker than changing code.

## Step 4: translate to Python

Now the code almost writes itself:

```python
def longest_word(sentence):
    longest = ""
    for word in sentence.split():
        if len(word) > len(longest):
            longest = word
    return longest

print(longest_word("the quick brown fox"))
print(longest_word(""))
```

## Step 5: test it, and refine

Run your examples. Then try awkward inputs: an empty sentence, one word, extra spaces, ties. Fix what breaks. This step, more than any other, is what separates working programs from almost-working ones.

## Break big problems into small ones

A large task becomes manageable when you split it into pieces. Each piece is a small function that does one thing and can be tested alone.

Take "print a report of average mass per species". You could break it into:

1. `load_penguins()` gets the rows.
2. `group_by_species(rows)` collects masses for each species.
3. `average(numbers)` computes a mean.
4. `format_report(averages)` builds the text.

The main program then reads almost like the plan:

```text
rows = load_penguins()
groups = group_by_species(rows)
averages = {species: average(masses) for species, masses in groups.items()}
print(format_report(averages))
```

This is called **stepwise refinement**: start with the big picture, then fill in the detail, one piece at a time.

## Solve a simpler version first

If you are stuck, solve an easier problem. To find the longest word for a whole book, first do a sentence. To handle every kind of input, first handle one. Once the simple case works, extend it.

You can also solve it *by hand* for a tiny input and notice what you did.

## Reading other people's code

The same skills apply in reverse. To understand a function, work out its inputs and outputs, run it on an example by hand, and read the smallest pieces first.

## Common mistakes

- Starting to code before understanding the problem.
- Ignoring awkward inputs until the end.
- Writing one huge function that does everything.
- Giving up on the whole problem instead of solving a smaller one first.

## Recap

- Understand the problem: inputs, outputs and rules.
- Work examples by hand, including awkward ones.
- Plan with pseudocode, then translate it to Python.
- Break big problems into small functions, and solve simpler versions first.
- Test with the awkward cases.
