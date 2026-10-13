Flip a coin, get heads — does that tell you anything about your next flip? Draw a card from a deck and don't put it back — does that tell you anything about your next draw? The answers are different, and the difference between them is one of the most practically important ideas in all of statistics.

You will learn:

- what it means for two events to be independent
- a card-drawing example that demonstrates dependence
- the multiplication rule for independent events
- why that rule breaks down for dependent events
- why A/B testing leans so heavily on independence

## Independence, defined

Two events are **independent** if knowing one happened tells you nothing new about the probability of the other. Formally, A and B are independent if P(A | B) = P(A) — the probability of A, given that B happened, is just the plain probability of A, unchanged.

A fair coin is the cleanest example. Flip it, get heads, flip it again — the second flip doesn't "remember" the first. The probability of heads on flip two is still 1/2, exactly as it would have been if you'd never flipped before. The coin has no memory, and nothing physically links one flip's outcome to the next one's.

## Dependence: drawing cards without replacement

Now take a standard 52-card deck and draw one card without putting it back, then draw a second. Is the second draw's outcome independent of the first?

No — and you can see why directly. Before any draw, the probability of drawing a King is 4/52 (there are four Kings in the deck). Suppose your first draw *is* a King, and you set it aside. Now there are only 51 cards left, and only 3 of them are Kings. The probability of drawing a King on the second draw is now 3/51, not 4/52. The first draw changed the composition of what's left to draw from, which changed the second draw's probabilities. That's dependence: P(second draw is a King | first draw was a King) ≠ P(second draw is a King).

If you'd put the first card back before drawing again ("with replacement"), the deck would be restored to its original 52 cards every time, and the draws would be independent — identical to the no-memory coin situation.

## The multiplication rule

When two events are independent, the probability that both happen is simply the product of their individual probabilities:

```text
P(A and B) = P(A) × P(B)      [only valid when A and B are independent]
```

Two fair coin flips landing heads both times: P(heads) × P(heads) = 1/2 × 1/2 = 1/4. That matches direct counting — out of the four equally likely outcomes {HH, HT, TH, TT}, exactly one is HH, so 1/4.

For dependent events, this shortcut gives the wrong answer, because P(B) itself changes depending on whether A happened. The correct general rule is P(A and B) = P(A) × P(B | A) — using the probability of B *given* A, not B on its own. For the card example: P(first King) × P(second King | first was King) = (4/52) × (3/51), which is smaller than if you'd (incorrectly) multiplied (4/52) × (4/52) — because the deck changed between draws.

## Why A/B testing depends on independence

When a company runs an A/B test — showing version A of a page to one group and version B to another — the entire comparison only means something if being assigned to group A versus group B is independent of anything that would affect the outcome. That's why random assignment matters: if users are randomly split into groups, nothing about who they are (country, device, time of day, how engaged they already were) is allowed to systematically correlate with which group they land in. Group assignment is independent of all of that.

If assignment is not random and not independent of outcome-relevant factors — say, group A happened to get more weekend traffic than group B — the comparison is contaminated. Any difference you observe might be explained by that lurking difference between the groups rather than by A or B itself. The entire logic of "the only systematic difference between groups is the thing we're testing" rests on the assignment step being genuinely independent of everything else.

## Common mistakes

- Using P(A) × P(B) for events that are not actually independent — this is probably the single most common probability error in practice.
- Assuming "feels random" means independent — non-random-feeling processes (shuffled but not reshuffled decks, biased assignment procedures) can still be dependent in ways that are easy to miss.
- Forgetting that "with replacement" restores independence that "without replacement" breaks.
- Treating independence as symmetric evidence of "no relationship" in general — independence is a precise statistical statement about probabilities, not a loose claim that two things are unrelated in every sense.
