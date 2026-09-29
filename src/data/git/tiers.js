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
    soon: true,
  },
  {
    id: 'remotes',
    number: 3,
    name: 'Remotes & Collaboration',
    tagline: 'Working with other people’s commits, forks and pull requests.',
    audience: 'Finish Branching & Merging and pass its exam to unlock this tier.',
    color: '#e6dcf3',
    soon: true,
  },
  {
    id: 'advanced',
    number: 4,
    name: 'Advanced Git & Real Workflows',
    tagline: 'Debugging history, git internals, and the parts that need real infrastructure.',
    audience: 'Finish Remotes & Collaboration and pass its exam to unlock this tier.',
    color: '#cfe3f5',
    soon: true,
  },
]

export const gitTierById = Object.fromEntries(gitTiers.map((t) => [t.id, t]))
