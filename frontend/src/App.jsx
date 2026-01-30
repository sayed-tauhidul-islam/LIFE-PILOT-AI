import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import AIAdvicePage from './pages/AIAdvicePage'
import WeatherPage from './pages/WeatherPage'
import PrayerPage from './pages/PrayerPage'
import FinancialPage from './pages/FinancialPage'
import RoutinePage from './pages/RoutinePage'
import TasksPage from './pages/TasksPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar 
          theme={theme} 
          setTheme={setTheme} 
          user={user} 
          onLogout={handleLogout}
          onLoginClick={() => setShowAuthModal(true)}
        />
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          theme={theme}
        />
        <Routes>
          <Route path="/" element={<HomePage theme={theme} />} />
          <Route path="/advice" element={
            <AIAdvicePage 
              theme={theme} 
              user={user} 
              onLoginRequired={() => setShowAuthModal(true)} 
            />} 
          />
          <Route path="/weather" element={<WeatherPage theme={theme} />} />
          <Route path="/prayer" element={<PrayerPage theme={theme} />} />
          <Route path="/financial" element={<FinancialPage theme={theme} />} />
          <Route path="/routine" element={<RoutinePage theme={theme} />} />
          <Route path="/tasks" element={<TasksPage theme={theme} />} />
          <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme} user={user} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
