import React, { useContext, useState, useEffect } from 'react'
import { ThemeContext } from '../../context/ThemeContext'

export default function ContrastSettings() {
  const { contrast, setContrast } = useContext(ThemeContext)
  const [value, setValue] = useState(contrast)

  useEffect(() => setValue(contrast), [contrast])

  useEffect(() => {
    const wrapper = document.getElementById('app-root') || document.body
    wrapper.style.filter = `brightness(${value}%)`
  }, [value])

  const applyAndSave = v => {
    setValue(v)
    setContrast(Number(v))
  }

  return (
    <div className="settings-page">
      <h2>উজ্জ্বলতা নিয়ন্ত্রণ</h2>
      <div className="contrast-control">
        <input type="range" min="70" max="130" value={value} onChange={e=>setValue(e.target.value)} />
        <div className="contrast-label">{value}%</div>
        <div className="preset-buttons">
          <button onClick={() => applyAndSave(70)}>🌑 কম</button>
          <button onClick={() => applyAndSave(100)}>☀️ স্বাভাবিক</button>
          <button onClick={() => applyAndSave(130)}>🔆 বেশি</button>
        </div>
        <div className="contrast-actions">
          <button onClick={() => setContrast(Number(value))}>Preview Saved</button>
        </div>
      </div>
    </div>
  )
}
