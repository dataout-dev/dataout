Some of the most convincing-looking patterns in data aren't wrong because the math is wrong — they're wrong because of *which* data got collected in the first place, or because of how ordinary randomness behaves over time. Survivorship bias and regression to the mean are two separate traps that both produce the same symptom: a pattern that looks like a real effect but is actually just a structural artifact of how you looked.

You will learn:

- what survivorship bias is, through the WWII bomber story
- what regression to the mean is, through the "sophomore slump"
- how both fallacies can masquerade as genuine findings
- how survivorship bias and regression to the mean differ from each other
- practical defenses against each one

## Survivorship bias: the planes that didn't come back

During World War II, researchers studying how to better armor bomber planes examined the planes that returned from combat missions, mapping out exactly where on each plane the bullet holes clustered. The data showed heavy damage concentrated on the wings and tail, with the engines and cockpit relatively untouched. The obvious conclusion seemed to be: reinforce the wings and tail, since that's clearly where planes get hit hardest.

The statistician Abraham Wald pointed out the flaw: every plane in that dataset had *survived* its mission and made it back to be examined. A plane that took heavy damage to the engine or cockpit most likely never made it home at all — it's missing from the data entirely, not because it wasn't hit there, but because being hit there was fatal. The areas that looked "safe" on returning planes (few holes recorded) were probably the most critical areas to reinforce, precisely because planes hit there didn't survive to be counted. The data wasn't lying about what it contained; it was silently missing the cases that mattered most.

**Survivorship bias** is this general pattern: drawing conclusions only from the cases that "survived" some selection process, while the cases that didn't survive are invisible to your dataset altogether. It shows up constantly outside of wartime too — studying only successful startups to find the "traits of success" misses every failed startup that had those exact same traits; studying only mutual funds that still exist today overstates how well the average fund actually performs, because badly-performing funds tend to get shut down and quietly disappear from the record.

## Regression to the mean: the sophomore slump

A rookie athlete has a sensational debut season, performing well above the league average. The next season, their performance drops back down toward a more typical level — the "sophomore slump." A tempting explanation is that something went wrong: complacency, opposing teams adjusting, an injury nobody mentioned. But there's a purely statistical explanation that applies even if none of that is true.

Any single measurement is a mix of a person's true underlying ability and a dose of luck or random variation around it. An exceptional first season is, almost by definition, one where that random component ran unusually favorably — exactly the kind of result that's unlikely to repeat, simply because it required a run of good luck on top of real skill. **Regression to the mean** is the tendency for an extreme measurement to be followed by a measurement closer to the average, often for this reason alone, with no real underlying change required to explain it.

This doesn't mean skill, fatigue, or adjustment by opponents play no role — only that part of any extreme result tends to be noise, and noise doesn't reliably repeat in the same direction twice. A follow-up measurement drifting back toward "typical" is exactly what you'd expect from pure statistics, independent of any real story about what changed.

## How both can look like real findings

The trap with both fallacies is that they produce a pattern that *feels* like it needs a causal explanation, and people reliably invent one. A company gives extra coaching to its worst-performing salespeople of the month, and the next month they "improve" — tempting to credit the coaching. But an unusually bad month, like an unusually good one, contains some bad luck that's unlikely to repeat; some of that improvement may be regression to the mean rather than evidence the coaching worked. Without a comparison group of similarly bad performers who got no coaching, it's hard to separate the two explanations.

## Defenses against each

Against survivorship bias: actively ask "what cases might be *missing* from this dataset, and why would they be missing?" — then look for a way to include them, or at least acknowledge the gap. Against regression to the mean: be suspicious of conclusions drawn from any one group selected *because* it was extreme (the best, the worst, the most improved) on a single measurement, and look for a proper control or comparison group before crediting an intervention for a change that random variation could explain on its own.

## Common mistakes

- Studying only the "winners" or "survivors" of some process and generalizing their traits to everyone, without asking who's missing from the dataset and why.
- Crediting an intervention (coaching, a new policy, a diet) for an improvement that followed an extreme result, without checking whether regression to the mean alone could explain it.
- Treating these two fallacies as the same thing — survivorship bias is about what data never entered your sample; regression to the mean is about what naturally happens to extreme measurements over repeated trials.
- Assuming awareness of these fallacies lets you dismiss any surprising result as "just bias" — they're reasons for extra scrutiny, not an excuse to ignore every unusual finding.
