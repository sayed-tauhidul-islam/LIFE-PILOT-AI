import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaUser, FaCog, FaSignOutAlt, FaBrain, FaCloudSunRain, FaPrayingHands, FaDollarSign, FaHeartbeat, FaCalendarAlt, FaTasks, FaImage, FaCalendarCheck, FaChartBar, FaRobot } from 'react-icons/fa'

const Navbar = ({ theme, setTheme, user, onLogout, onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const toggleProfile = () => setProfileOpen(!profileOpen)

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
      setMenuOpen(false)
      setProfileOpen(false)
      navigate('/')
    }
  }

  const navItems = [
    { path: '/advice', label: 'AI Advice', icon: FaBrain },
    { path: 'https://weather-forcast-git-main-sayed-tauhidul-islams-projects.vercel.app', label: 'Weather', icon: FaCloudSunRain, external: true },
    { path: '/prayer', label: 'Prayer', icon: FaPrayingHands },
    { path: '/financial', label: 'Financial', icon: FaDollarSign },
    { path: '/health', label: 'Health', icon: FaHeartbeat },
    { path: '/routine', label: 'Routine', icon: FaCalendarAlt },
    { path: '/tasks', label: 'Tasks', icon: FaTasks },
    { path: '/gallery', label: 'Gallery', icon: FaImage },
    { path: '/events', label: 'Events', icon: FaCalendarCheck },
    { path: '/reports', label: 'Reports', icon: FaChartBar },
    { path: '/ai', label: 'AI', icon: FaRobot }
  ]

  return (
    <nav className="bg-gradient-to-r from-black via-red-900 to-black shadow-2xl sticky top-0 z-50 border-b-2 border-red-600">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg bg-red-600 bg-opacity-30 hover:bg-opacity-50 transition-all"
              aria-label="Menu"
            >
              {menuOpen ? <FaTimes size={24} className="text-white" /> : <FaBars size={24} className="text-white" />}
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg border-2 border-red-500 animate-pulse">
                <FaBrain className="text-white text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-white hidden sm:block">
                Life Pilot <span className="text-red-400">AI</span>
              </h1>
            </Link>
          </div>

          {/* Center - Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center mx-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              if (item.external) {
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 whitespace-nowrap text-white hover:bg-red-600 hover:scale-105 border border-transparent hover:border-red-400"
                  >
                    <Icon className="text-sm" />
                    {item.label}
                  </a>
                )
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg scale-105 border border-red-400'
                      : 'text-white hover:bg-red-600 hover:scale-105 border border-transparent hover:border-red-400'
                  }`}
                >
                  <Icon className="text-sm" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Right - User Profile */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 bg-red-600 bg-opacity-30 hover:bg-opacity-50 rounded-lg px-4 py-2 transition-all border border-red-500/50 hover:border-red-400"
              aria-label="User profile"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center border border-red-400">
                <FaUser className="text-white" />
              </div>
              <span className="hidden md:block font-semibold text-white">
                {user?.name || 'User'}
              </span>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute top-14 right-0 bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl w-64 py-2 z-50 border-2 border-red-600">
                {!user ? (
                  <button 
                    onClick={() => {
                      setProfileOpen(false)
                      onLoginClick && onLoginClick()
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-red-600/30 font-semibold text-red-500 flex items-center gap-2 transition-all"
                  >
                    <FaUser />
                    Login / Sign Up
                  </button>
                ) : (
                  <>
                    <div className="px-4 py-3 border-b border-red-900">
                      <p className="font-bold text-white">{user?.name || 'Guest User'}</p>
                      <p className="text-sm text-gray-400">{user?.email || 'No email'}</p>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="w-full px-4 py-2 text-left hover:bg-red-600/30 flex items-center gap-2 text-gray-300 hover:text-white transition-all"
                    >
                      <FaCog />
                      <span>Settings</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-red-600/50 flex items-center gap-2 border-t border-red-900 mt-2 text-red-500 font-semibold transition-all"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="lg:hidden pb-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                if (item.external) {
                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 bg-red-600 bg-opacity-30 text-white hover:bg-opacity-50 border border-red-500/50"
                    >
                      <Icon />
                      {item.label}
                    </a>
                  )
                }
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-red-600 text-white shadow-lg border border-red-400'
                        : 'bg-red-600 bg-opacity-30 text-white hover:bg-opacity-50 border border-red-500/50'
                    }`}
                  >
                    <Icon />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
