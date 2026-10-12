export const gitTiers = [
  {
    id: 'foundations',
    number: 1,
    name: 'Git Foundations',
    tagline: 'The core loop — init, add, commit, log — and how to undo mistakes.',
    audience: 'No git needed. Every command runs on a real, seeded repo right in your browser.',
    color: '#f6dccb',
    entry: true,
    examPassPercent: 70,
  },
  {
    id: 'branching',
    number: 2,
    name: 'Branching & Merging',
    tagline: 'Branches, merges, rebases, and recovering when it goes wrong.',
    audience: 'Finish Git Foundations and pass its exam to unlock this tier.',
    color: '#f4e2d0',
    examPassPercent: 70,
  },
  {
    id: 'remotes',
    number: 3,
    name: 'Remotes & Collaboration',
    tagline: 'Working with other people’s commits — clone, fetch, pull, and push.',
    audience: 'Finish Branching & Merging and pass its exam to unlock this tier.',
    color: '#e6dcf3',
    examPassPercent: 70,
  },
  {
    id: 'advanced',
    number: 4,
    name: 'Advanced Git & Real Workflows',
    tagline: 'Stash, rewrite history safely, bisect bugs, and recover from mistakes.',
    audience: 'Finish Remotes & Collaboration and pass its exam to unlock this tier.',
    color: '#cfe3f5',
    examPassPercent: 70,
  },
]

export const gitTierById = Object.fromEntries(gitTiers.map((t) => [t.id, t]))
