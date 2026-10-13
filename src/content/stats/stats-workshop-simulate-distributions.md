This tier covered a lot of distributions — normal, binomial, Poisson, uniform — mostly one at a time, each in its own lesson. This workshop pulls them together the way you'd actually use them in practice: generating samples from more than one distribution and comparing what comes out, directly, side by side.

You will learn:

- how this workshop ties together everything this tier covered
- why simulation is often the most practical way to build intuition when the math gets hard
- how to reason through drawing samples from two different distributions and comparing them
- what to watch for when summary statistics from different distributions are compared

## Why simulate at all

Plenty of questions about distributions have exact mathematical answers you could, in principle, work out by hand — but plenty of others don't have a clean closed-form answer, or would take real effort to derive even if they did. Simulation sidesteps that entirely: generate a large number of random draws from the distribution you care about, using a computer's random number generator, and then just look directly at what the generated sample shows you. If you want to know how two distributions' sample means tend to compare, you don't have to derive it — you can draw a batch of samples from each and compare the actual numbers that come out.

This isn't a lesser substitute for "doing the math properly." For a huge number of real working statisticians, data scientists, and engineers, simulation *is* the normal way of answering exactly this kind of question, especially once a problem gets even slightly more complex than the clean examples in a textbook.

## Walking through the idea: two distributions, compared

Imagine you wanted to compare a normal distribution with some mean and standard deviation against a uniform distribution with some lower and upper bound. You could set the uniform distribution's bounds so its own mean, (a+b)/2, lands on the same value as the normal distribution's mean — matching their centers on purpose so any difference you see isn't just "one was shifted higher than the other."

Then you'd draw a batch of random samples from each: say, 200 values from the normal distribution and 200 values from the uniform distribution. Even with centers matched, the two resulting batches of numbers would look visibly different if you examined them. The normal batch would cluster tightly near the shared mean, with a handful of values trailing off further away on both sides. The uniform batch would spread its 200 values roughly evenly across its entire range, with no clustering near the center at all — exactly as you'd expect from a flat density.

Now compute the mean of each batch of 200 drawn values. Both batch means should land reasonably close to the shared true mean you set up — that's the Law of Large Numbers at work, from earlier in this tier, with 200 draws being a reasonably large sample. But "reasonably close" isn't "identical" — each batch mean is itself a single draw from its own sampling distribution, and the two sampling distributions won't necessarily have the same spread, because the normal and uniform populations themselves don't have the same standard deviation just because you matched their means.

## What to watch for when comparing summary statistics

A few things are easy to get wrong when comparing numbers drawn from two different distributions:

- Matching means doesn't mean matching everything else. Two distributions can share a mean and still differ enormously in spread, shape, and tail behavior — comparing only the means and declaring the distributions "basically the same" misses most of the picture.
- A single comparison of two sample means (one random batch from each distribution) is itself subject to the same sampling noise discussed throughout this tier. Rerun the simulation with a different seed, and the two batch means will shift slightly, even though nothing about the two underlying distributions changed.
- Sample size affects how much you should trust a single comparison. Comparing means from two batches of 10 draws each is a far noisier comparison than comparing means from two batches of 10,000 draws each, for exactly the reasons the Law of Large Numbers and the CLT laid out earlier in this tier.

## What the practice exercise asks of you

In the practice exercise for this workshop, you'll draw samples from a normal distribution and a uniform distribution and compare their sample means directly, using a seeded random number generator so your results are reproducible. The reasoning above — matching centers deliberately, expecting both batch means to land near the shared true mean without being identical, and understanding why sample size changes how much noise to expect in that comparison — is exactly the reasoning you'll need to work through the exercise, even though the specific numbers you'll use there are left for you to work out.

## Common mistakes

- Concluding two distributions are "the same" because their sample means came out close, without checking spread or shape at all.
- Forgetting to set a seed, making it impossible to reproduce or double-check a specific simulation run.
- Drawing too few samples and over-interpreting noisy results as if they were a precise, stable comparison.
- Assuming any difference observed between two batches must reflect a real, meaningful difference between the underlying distributions, rather than ordinary sampling variation.
