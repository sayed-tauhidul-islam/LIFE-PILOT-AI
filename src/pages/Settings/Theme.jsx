import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext'

const MOOD_META = [
  { id: 1, name: 'Default', key: 'system', swatches: ['var(--accent)', 'var(--bg-surface)', 'var(--bg-card)'] },
  { id: 2, name: 'Dark', key: 'dark', swatches: ['#818CF8', '#0B0F23', '#0F1629'] },
  { id: 3, name: 'Light', key: 'light', swatches: ['#4F46E5', '#FFFFFF', '#F1F5F9'] },
  { id: 4, name: 'Midnight Blue', key: 'midnight', swatches: ['#0EA5E9', '#041628', '#072035'] },
  { id: 5, name: 'Emerald', key: 'emerald', swatches: ['#10B981', '#041F0E', '#062B14'] },
  { id: 6, name: 'Sunset', key: 'sunset', swatches: ['#F59E0B', '#1F1000', '#2D1800'] },
]

export default function ThemeSettings() {
  const { mood, setMood } = useContext(ThemeContext)

  return (
    <div className="settings-page">
      <h2>Theme</h2>
      <div className="mood-grid">
        {MOOD_META.map(m => (
          <button
            key={m.id}
            className={`mood-card ${mood === m.key ? 'active' : ''}`}
            onClick={() => setMood(m.key)}
            aria-pressed={mood === m.key}
          >
            <div className="mood-name">{m.name}</div>
            <div className="swatches">
              {m.swatches.map((s, i) => (
                <span key={i} className="dot" style={{ background: s }} />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
