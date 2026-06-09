import { useEffect, useState } from 'react'

type Mode = 'light' | 'dark'

function getInitialMode(): Mode {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('theme') as Mode | null
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyMode(mode: Mode) {
  const root = document.documentElement
  if (mode === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

// Apply ASAP at module load so we don't get a flash of the wrong theme
// while the React tree mounts.
if (typeof document !== 'undefined') {
  applyMode(getInitialMode())
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(getInitialMode)

  useEffect(() => {
    applyMode(mode)
    localStorage.setItem('theme', mode)
  }, [mode])

  function toggle() {
    setMode(m => (m === 'dark' ? 'light' : 'dark'))
  }

  const isDark = mode === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition"
    >
      {isDark ? (
        // Sun
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
