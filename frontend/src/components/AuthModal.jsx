import React, { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaLock, FaTimes, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle, FaIdCard } from 'react-icons/fa'

const AuthModal = ({ isOpen, onClose, onLogin, theme }) => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ valid: false, message: '', strength: 0 })
  const [emailValid, setEmailValid] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Load remembered credentials if exists
    const rememberedEmail = localStorage.getItem('remembered_email')
    const rememberedPassword = localStorage.getItem('remembered_password')
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }))
      setRememberMe(true)
      if (rememberedPassword) {
        setFormData(prev => ({ ...prev, password: atob(rememberedPassword) }))
      }
    }
  }, [])

  if (!isOpen) return null

  const getThemeColors = () => {
    const themes = {
      light: {
        bg: 'bg-white',
        text: 'text-black',
        input: 'bg-gray-50 border-gray-300 text-black',
        overlay: 'bg-black bg-opacity-50'
      },
      dark: {
        bg: 'bg-gray-800',
        text: 'text-white',
        input: 'bg-gray-700 border-gray-600 text-white',
        overlay: 'bg-black bg-opacity-70'
      },
      blue: {
        bg: 'bg-blue-800',
        text: 'text-blue-50',
        input: 'bg-blue-900 border-blue-600 text-blue-50',
        overlay: 'bg-black bg-opacity-70'
      }
    }
    return themes[theme] || themes.light
  }

  const colors = getThemeColors()

  const validateEmail = async (email) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      setEmailValid(data.valid)
      return data.valid
    } catch (error) {
      console.error('Email validation error:', error)
      return true // Fail gracefully
    }
  }

  const validatePassword = async (password) => {
    if (!password) {
      setPasswordStrength({ valid: false, message: '', strength: 0 })
      return
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/validate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await response.json()
      setPasswordStrength({
        valid: data.valid,
        message: data.message,
        strength: data.strength
      })
    } catch (error) {
      console.error('Password validation error:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')

    // Real-time email validation
    if (name === 'email' && value) {
      validateEmail(value)
    }

    // Real-time password strength check
    if (name === 'password' && !isLoginMode) {
      validatePassword(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLoginMode) {
        // Login
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            remember_me: rememberMe
          })
        })

        const data = await response.json()

        if (data.success) {
          // Remember credentials if checked
          if (rememberMe) {
            localStorage.setItem('remembered_email', formData.email)
            localStorage.setItem('remembered_password', btoa(formData.password))
          } else {
            localStorage.removeItem('remembered_email')
            localStorage.removeItem('remembered_password')
          }

          // Store user data
          localStorage.setItem('user', JSON.stringify(data.user))
          onLogin(data.user)
          onClose()
        } else {
          setError(data.message)
        }
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match!')
          setLoading(false)
          return
        }

        if (!emailValid) {
          setError('Please enter a valid email address')
          setLoading(false)
          return
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long')
          setLoading(false)
          return
        }

        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password
          })
        })

        const data = await response.json()

        if (data.success) {
          // Automatically login after successful signup
          localStorage.setItem('user', JSON.stringify(data.user))
          onLogin(data.user)
          onClose()
        } else {
          setError(data.message)
        }
      }
    } catch (error) {
      setError('Connection error. Please try again.')
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        onLogin(data.user)
        onClose()
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Failed to create guest account')
      console.error('Guest creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setFormData({ fullName: '', username: '', email: '', password: '', confirmPassword: '' })
    setError('')
    setPasswordStrength({ valid: false, message: '', strength: 0 })
    setEmailValid(true)
  }

  const getStrengthColor = (strength) => {
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthWidth = (strength) => {
    return `${(strength / 6) * 100}%`
  }

  return (
    <div className={`fixed inset-0 ${colors.overlay} flex items-center justify-center z-50 p-4`}>
      <div className={`${colors.bg} ${colors.text} rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden max-h-[90vh] overflow-y-auto`}>
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-red-600 opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600 opacity-10 rounded-full -ml-16 -mb-16"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors z-10"
        >
          <FaTimes size={24} />
        </button>

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">
              {isLoginMode ? 'Welcome Back!' : 'Join Us'}
            </h2>
            <p className="text-sm opacity-70">
              {isLoginMode 
                ? 'Login to access your AI-powered life guide' 
                : 'Create an account to get started'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <FaExclamationCircle />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field (Signup Only) */}
            {!isLoginMode && (
              <div>
                <label className="block font-semibold mb-2 text-sm">Full Name *</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3.5 text-red-600" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 ${colors.input} focus:border-red-600 focus:outline-none transition-colors`}
                    required
                  />
                </div>
              </div>
            )}

            {/* Username Field (Signup Only) */}
            {!isLoginMode && (
              <div>
                <label className="block font-semibold mb-2 text-sm">Username *</label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-3.5 text-red-600" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a unique username"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 ${colors.input} focus:border-red-600 focus:outline-none transition-colors`}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block font-semibold mb-2 text-sm">Email Address *</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3.5 text-red-600" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border-2 ${colors.input} ${!emailValid ? 'border-red-500' : ''} focus:border-red-600 focus:outline-none transition-colors`}
                  required
                />
                {formData.email && (
                  <div className="absolute right-3 top-3.5">
                    {emailValid ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaExclamationCircle className="text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {!emailValid && formData.email && (
                <p className="text-red-500 text-xs mt-1">Invalid email format</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-semibold mb-2 text-sm">Password *</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3.5 text-red-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border-2 ${colors.input} focus:border-red-600 focus:outline-none transition-colors`}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-red-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Signup Only) */}
            {!isLoginMode && (
              <div>
                <label className="block font-semibold mb-2 text-sm">Confirm Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3.5 text-red-600" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`w-full pl-10 pr-10 py-3 rounded-lg border-2 ${colors.input} ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''} focus:border-red-600 focus:outline-none transition-colors`}
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
            )}

            {/* Remember Me (Login Only) */}
            {isLoginMode && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm">
                  Remember my password
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLoginMode ? 'Login' : 'Sign Up')}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center mt-4">
            <p className="text-sm opacity-70">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-red-600 font-bold hover:underline"
              >
                {isLoginMode ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300 opacity-30"></div>
            <span className="px-4 text-sm opacity-50">or</span>
            <div className="flex-1 border-t border-gray-300 opacity-30"></div>
          </div>

          {/* Guest Login */}
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className={`w-full border-2 border-red-600 text-red-600 py-3 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Continue as Guest
          </button>

          {/* Guest Info */}
          <p className="text-xs text-center mt-3 opacity-60">
            Guest users get a unique ID and username automatically
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
