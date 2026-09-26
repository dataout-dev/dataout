import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'dataout-theme'

export const themes = [
  {
    id: 'sunrise-cream',
    name: 'Sunrise Cream',
    description: 'The warm, original DataOut look.',
    swatches: ['#faf6ef', '#1c1c1a', '#e8622c'],
  },
  {
    id: 'electric-sky',
    name: 'Electric Sky',
    description: 'Crisp blues with a spark of lime.',
    swatches: ['#eaf4fd', '#152641', '#136cfc'],
  },
  {
    id: 'midnight-forest',
    name: 'Midnight Forest',
    description: 'A dark theme with a fresh green glow.',
    swatches: ['#0f1410', '#eef2ea', '#52c97a'],
  },
  {
    id: 'rosewater',
    name: 'Rosewater',
    description: 'Soft blush tones with a rose accent.',
    swatches: ['#fdf1f3', '#3a1f24', '#d6336c'],
  },
  {
    id: 'slate-mono',
    name: 'Slate Mono',
    description: 'Minimal grayscale with a cool slate accent.',
    swatches: ['#f4f4f5', '#18181b', '#334155'],
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm amber tones for a cozy feel.',
    swatches: ['#fdf6e9', '#3d2b12', '#d99a2b'],
  },
  {
    id: 'endgame',
    name: 'Endgame',
    description: 'Deep cosmic indigo with a rosy-pink glow.',
    swatches: ['#0f0826', '#604ac7', '#c88da5'],
    special: true,
  },
  {
    id: 'iron-man',
    name: 'Iron Man',
    description: 'Armor red and arc-reactor gold, with reactor-ring art in the margins.',
    swatches: ['#150b0d', '#e23636', '#f5b83d'],
    special: true,
  },
  {
    id: 'captain-america',
    name: 'Captain America',
    description: 'Shield navy, red and star white, with shield and stripe art in the margins.',
    swatches: ['#0b1b3a', '#e63946', '#f4f7ff'],
    special: true,
  },
]

const themeIds = new Set(themes.map((t) => t.id))

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return themeIds.has(stored) ? stored : 'sunrise-cream'
    } catch {
      return 'sunrise-cream'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
