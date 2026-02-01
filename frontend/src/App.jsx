import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import AIAdvicePage from './pages/AIAdvicePage'
import WeatherPage from './pages/WeatherPage'
import PrayerPage from './pages/PrayerPage'
import FinancialPage from './pages/FinancialPage'
import HealthPage from './pages/HealthPage'
import RoutinePage from './pages/RoutinePage'
import TasksPage from './pages/TasksPage'
import SettingsPage from './pages/SettingsPage'
import GalleryPage from './pages/GalleryPage'
import EventsPage from './pages/EventsPage'
import ReportsPage from './pages/ReportsPage'
import AIPage from './pages/AIPage'

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
          <Route path="/" element={<HomePage theme={theme} user={user} onLoginRequired={() => setShowAuthModal(true)} />} />
          
          {/* Protected Routes - Require Authentication */}
          <Route path="/advice" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <AIAdvicePage 
                theme={theme} 
                user={user} 
                onLoginRequired={() => setShowAuthModal(true)} 
              />
            </ProtectedRoute>
          } />
          
          <Route path="/prayer" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <PrayerPage theme={theme} />
            </ProtectedRoute>
          } />
          
          <Route path="/financial" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <FinancialPage theme={theme} user={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/health" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <HealthPage theme={theme} />
            </ProtectedRoute>
          } />
          
          <Route path="/routine" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <RoutinePage theme={theme} />
            </ProtectedRoute>
          } />
          
          <Route path="/tasks" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <TasksPage theme={theme} />
            </ProtectedRoute>
          } />
          
          <Route path="/gallery" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <GalleryPage theme={theme} />
            </ProtectedRoute>
          } />
          
          <Route path="/events" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <EventsPage theme={theme} />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <ReportsPage theme={theme} />
            </ProtectedRoute>
          } />
          
          <Route path="/ai" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <AIPage theme={theme} user={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/weather" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <WeatherPage theme={theme} />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute user={user} onLoginRequired={() => setShowAuthModal(true)}>
              <SettingsPage theme={theme} setTheme={setTheme} user={user} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
