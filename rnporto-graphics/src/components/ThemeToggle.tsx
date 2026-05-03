import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type ThemeMode = 'light' | 'dark'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(mode)
  root.setAttribute('data-theme', mode)
  root.style.colorScheme = mode
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initial = getInitialMode()
    setMode(initial)
    applyThemeMode(initial)
    setMounted(true)
  }, [])

  function toggleMode() {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light'
    setMode(next)
    applyThemeMode(next)
    window.localStorage.setItem('theme', next)
  }

  // Avoid SSR/CSR mismatch — render the same icon on the server, then swap on
  // hydration once we know the user's stored preference.
  const Icon = mounted && mode === 'dark' ? Sun : Moon
  const label = `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--rnp-chip-line)] bg-[var(--rnp-chip-bg)] text-[var(--rnp-fg)] transition hover:-translate-y-0.5 hover:border-[var(--rnp-line-strong)]"
    >
      <Icon size={16} strokeWidth={2} aria-hidden="true" />
    </button>
  )
}
