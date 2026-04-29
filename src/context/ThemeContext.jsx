import React, { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

const MOODS = {
  1: 'system',
  2: 'dark',
  3: 'light',
  4: 'midnight',
  5: 'emerald',
  6: 'sunset',
}

export function ThemeProvider({ children }) {
  const [mood, setMood] = useState(() => {
    try {
      return localStorage.getItem('theme_mood') || 'system'
    } catch {
      return 'system'
    }
  })

  const [contrast, setContrast] = useState(() => {
    try {
      return Number(localStorage.getItem('contrast_level')) || 100
    } catch {
      return 100
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-mood', mood)
    try { localStorage.setItem('theme_mood', mood) } catch {}
  }, [mood])

  useEffect(() => {
    try { localStorage.setItem('contrast_level', String(contrast)) } catch {}
  }, [contrast])

  useEffect(() => {
    document.body.style.transition = 'all 0.3s ease'
  }, [])

  return (
    <ThemeContext.Provider value={{ mood, setMood, contrast, setContrast, MOODS }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
