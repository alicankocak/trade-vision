import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Helper to safely access localStorage (SSR-safe)
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light' // Default for SSR
  }
  const savedTheme = localStorage.getItem('theme') as Theme
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return savedTheme || 'light'
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>('light') // Default for SSR
  const [mounted, setMounted] = useState(false)

  // Hydrate theme from localStorage after mount
  useEffect(() => {
    setTheme(getInitialTheme())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = window.document.documentElement
    // Clear previous classes
    root.classList.remove('light', 'dark')
    // Add current theme class
    root.classList.add(theme)
    // Persist to storage
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isDarkMode: theme === 'dark' }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
