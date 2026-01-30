import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaSun, FaMoon, FaCog, FaSignOutAlt, FaUser, FaFolder, FaEdit } from 'react-icons/fa'

const Navbar = ({ theme, setTheme, user, onLogout, onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const toggleProfile = () => setProfileOpen(!profileOpen)

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    setMenuOpen(false)
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
      setMenuOpen(false)
      setProfileOpen(false)
      navigate('/')
    }
  }

  const getThemeColors = () => {
    switch(theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          text: 'text-white',
          border: 'border-gray-700',
          hover: 'hover:bg-gray-800'
        }
      case 'blue':
        return {
          bg: 'bg-blue-900',
          text: 'text-white',
          border: 'border-blue-700',
          hover: 'hover:bg-blue-800'
        }
      default: // light
        return {
          bg: 'bg-white',
          text: 'text-black',
          border: 'border-gray-300',
          hover: 'hover:bg-gray-100'
        }
    }
  }

  const colors = getThemeColors()

  return (
    <nav className={`${colors.bg} ${colors.text} border-b-2 ${colors.border} shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu Icon & Logo */}
          <div className="flex items-center space-x-4">
            {/* Menu Icon */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className={`p-2 rounded-lg ${colors.hover} transition-colors`}
                aria-label="Menu"
              >
                {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className={`absolute top-12 left-0 ${colors.bg} ${colors.border} border-2 rounded-lg shadow-xl w-64 py-2 z-50`}>
                  {/* Settings */}
                  <Link 
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className={`w-full px-4 py-3 text-left ${colors.hover} flex items-center space-x-3`}
                  >
                    <FaCog size={18} />
                    <span className="font-semibold">Settings</span>
                  </Link>

                  {/* Theme Options */}
                  <div className={`px-4 py-2 border-t ${colors.border} mt-2`}>
                    <p className="text-sm font-semibold mb-2 text-red-600">Theme</p>
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`w-full px-3 py-2 mb-1 text-left rounded ${theme === 'light' ? 'bg-red-600 text-white' : colors.hover} flex items-center space-x-2`}
                    >
                      <FaSun size={16} />
                      <span>Light Theme</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`w-full px-3 py-2 mb-1 text-left rounded ${theme === 'dark' ? 'bg-red-600 text-white' : colors.hover} flex items-center space-x-2`}
                    >
                      <FaMoon size={16} />
                      <span>Dark Theme</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange('blue')}
                      className={`w-full px-3 py-2 text-left rounded ${theme === 'blue' ? 'bg-red-600 text-white' : colors.hover} flex items-center space-x-2`}
                    >
                      <FaSun size={16} className="text-blue-400" />
                      <span>Blue Theme</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className={`w-full px-4 py-3 text-left ${colors.hover} flex items-center space-x-3 border-t ${colors.border} mt-2 text-red-600 font-semibold`}
                  >
                    <FaSignOutAlt size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link to="/">
                <h1 className="text-xl font-bold cursor-pointer hover:text-red-600 transition-colors">
                  Life Pilot <span className="text-red-600">AI</span>
                </h1>
              </Link>
            </div>
          </div>

          {/* Center - Navigation Options */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/advice" location={location}>AI Advice</NavLink>
            <NavLink to="/weather" location={location}>Weather</NavLink>
            <NavLink to="/prayer" location={location}>Prayer Times</NavLink>
            <NavLink to="/financial" location={location}>Financial</NavLink>
            <NavLink to="/routine" location={location}>Routine</NavLink>
            <NavLink to="/tasks" location={location}>Tasks</NavLink>
          </div>

          {/* Right side - User Profile */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className={`flex items-center space-x-2 p-2 rounded-lg ${colors.hover} transition-colors`}
              aria-label="User profile"
            >
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <FaUser size={20} className="text-white" />
              </div>
              <span className="hidden md:block font-semibold">
                {user?.name || 'User'}
              </span>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className={`absolute top-12 right-0 ${colors.bg} ${colors.border} border-2 rounded-lg shadow-xl w-64 py-2 z-50`}>
                {!user ? (
                  <button 
                    onClick={() => {
                      setProfileOpen(false)
                      onLoginClick && onLoginClick()
                    }}
                    className={`w-full px-4 py-3 text-left ${colors.hover} font-semibold text-red-600`}
                  >
                    Login / Sign Up
                  </button>
                ) : (
                  <>
                    <div className="px-4 py-3 border-b ${colors.border}">
                      <p className="font-bold">{user?.name || 'Guest User'}</p>
                      <p className="text-sm opacity-70">{user?.email || 'No email'}</p>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className={`w-full px-4 py-2 text-left ${colors.hover} flex items-center space-x-2`}
                    >
                      <FaUser size={16} />
                      <span>View Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className={`w-full px-4 py-2 text-left ${colors.hover} flex items-center space-x-2`}
                    >
                      <FaEdit size={16} />
                      <span>Edit Profile</span>
                    </Link>
                    <button 
                      onClick={() => {
                        setProfileOpen(false)
                        navigate('/advice')
                      }}
                      className={`w-full px-4 py-2 text-left ${colors.hover} flex items-center space-x-2`}
                    >
                      <FaFolder size={16} />
                      <span>My Files</span>
                    </button>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className={`w-full px-4 py-2 text-left ${colors.hover} flex items-center space-x-2`}
                    >
                      <FaCog size={16} />
                      <span>Account Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full px-4 py-3 text-left ${colors.hover} flex items-center space-x-3 border-t ${colors.border} mt-2 text-red-600 font-semibold`}
                    >
                      <FaSignOutAlt size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            <MobileNavLink to="/advice" location={location}>AI Advice</MobileNavLink>
            <MobileNavLink to="/weather" location={location}>Weather</MobileNavLink>
            <MobileNavLink to="/prayer" location={location}>Prayer</MobileNavLink>
            <MobileNavLink to="/financial" location={location}>Financial</MobileNavLink>
            <MobileNavLink to="/routine" location={location}>Routine</MobileNavLink>
            <MobileNavLink to="/tasks" location={location}>Tasks</MobileNavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

// NavLink Component for desktop
const NavLink = ({ to, children, location }) => {
  const isActive = location.pathname === to
  return (
    <Link
      to={to}
      className={`${
        isActive 
          ? 'bg-red-600 text-white' 
          : 'bg-white text-black hover:bg-gray-100'
      } px-4 py-2 rounded-lg font-semibold transition-all shadow-sm`}
    >
      {children}
    </Link>
  )
}

// Mobile NavLink Component
const MobileNavLink = ({ to, children, location }) => {
  const isActive = location.pathname === to
  return (
    <Link
      to={to}
      className={`${
        isActive 
          ? 'bg-red-600 text-white' 
          : 'bg-white text-black hover:bg-red-600 hover:text-white'
      } px-3 py-1 rounded-lg text-sm font-semibold transition-all border-2 border-red-600`}
    >
      {children}
    </Link>
  )
}

export default Navbar
