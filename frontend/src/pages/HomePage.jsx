import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBrain, FaCloudSunRain, FaPrayingHands, FaDollarSign, FaHeartbeat, FaCalendarAlt, FaTasks, FaImage, FaCalendarCheck, FaChartBar, FaRobot, FaArrowRight, FaStar, FaUsers, FaShieldAlt, FaRocket, FaFire } from 'react-icons/fa'

const HomePage = ({ user, onLoginRequired }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: FaBrain,
      title: 'AI Advice',
      description: 'Get personalized AI-powered suggestions and insights for your daily life',
      path: '/advice',
      color: 'from-red-600 to-red-800'
    },
    {
      icon: FaCloudSunRain,
      title: 'Weather Forecast',
      description: 'Real-time weather updates and forecasts for your location',
      path: 'https://weather-forcast-git-main-sayed-tauhidul-islams-projects.vercel.app',
      color: 'from-red-500 to-red-700',
      external: true
    },
    {
      icon: FaPrayingHands,
      title: 'Prayer Times',
      description: 'Accurate Islamic prayer times based on your location',
      path: '/prayer',
      color: 'from-red-600 to-red-900'
    },
    {
      icon: FaDollarSign,
      title: 'Financial Manager',
      description: 'Track expenses, manage budget, and get AI-powered financial insights',
      path: '/financial',
      color: 'from-red-700 to-red-900'
    },
    {
      icon: FaHeartbeat,
      title: 'Health Tracker',
      description: 'Monitor your health metrics, BMI, and get personalized health advice',
      path: '/health',
      color: 'from-red-500 to-red-800'
    },
    {
      icon: FaCalendarAlt,
      title: 'Daily Routine',
      description: 'Plan and manage your daily routines and habits effectively',
      path: '/routine',
      color: 'from-red-600 to-red-800'
    },
    {
      icon: FaTasks,
      title: 'Task Manager',
      description: 'Organize tasks, set priorities, and boost your productivity',
      path: '/tasks',
      color: 'from-red-500 to-red-700'
    },
    {
      icon: FaImage,
      title: 'Photo Gallery',
      description: 'Store and organize your photos and documents in one place',
      path: '/gallery',
      color: 'from-red-600 to-red-900'
    },
    {
      icon: FaCalendarCheck,
      title: 'Events & Reminders',
      description: 'Never miss important events with smart reminders and notifications',
      path: '/events',
      color: 'from-red-700 to-red-900'
    },
    {
      icon: FaChartBar,
      title: 'Reports & Analytics',
      description: 'Generate detailed reports and analyze your data with AI',
      path: '/reports',
      color: 'from-red-500 to-red-800'
    },
    {
      icon: FaRobot,
      title: 'AI Assistant',
      description: 'Voice-powered AI assistant for hands-free control and insights',
      path: '/ai',
      color: 'from-red-600 to-red-900'
    }
  ]

  const stats = [
    { icon: FaUsers, value: '10K+', label: 'Active Users', color: 'text-red-500' },
    { icon: FaStar, value: '4.9/5', label: 'User Rating', color: 'text-red-600' },
    { icon: FaRocket, value: 'AI', label: 'Powered', color: 'text-red-700' },
    { icon: FaShieldAlt, value: '100%', label: 'Secure', color: 'text-red-800' }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-red-600 rounded-full opacity-20 blur-3xl transition-all duration-300"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
          }}
        ></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-red-800 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-red-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            {/* Animated Logo */}
            <div className="inline-block mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-red-600 via-red-700 to-black rounded-full flex items-center justify-center shadow-2xl border-4 border-red-500 transform hover:scale-110 transition-all duration-300">
                <FaBrain className="text-6xl text-white animate-pulse" />
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-7xl md:text-8xl font-black mb-6 relative">
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-800 text-transparent bg-clip-text">
                Life Pilot
              </span>
              <span className="text-white ml-4">AI</span>
              <FaFire className="inline-block text-red-600 ml-3 animate-bounce" />
            </h1>
            
            {/* Subtitle */}
            <p className="text-3xl md:text-4xl text-red-400 mb-4 font-bold">
              আপনার Personal AI-Powered Life Assistant
            </p>
            
            {/* Description */}
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Navigate your daily life with intelligent insights on weather, finances, health, 
              routines, prayer times, and personalized recommendations powered by advanced AI technology.
            </p>

            {/* Live Clock */}
            <div className="mb-10">
              <div className="inline-block bg-gradient-to-r from-red-900/50 to-black/50 backdrop-blur-lg px-8 py-4 rounded-2xl border-2 border-red-600/50">
                <p className="text-red-400 text-sm mb-1">Current Time</p>
                <p className="text-3xl font-bold text-white">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <p className="text-red-500 text-sm mt-1">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/ai"
                className="group relative bg-gradient-to-r from-red-600 to-red-800 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-red-600/50 transition-all hover:scale-110 flex items-center gap-3 border-2 border-red-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <FaRobot className="text-3xl relative z-10" />
                <span className="relative z-10">Start AI Assistant</span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform relative z-10" />
              </Link>
              
              <Link
                to="/advice"
                className="group bg-black text-red-500 px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-red-600/50 transition-all hover:scale-110 border-2 border-red-600 hover:bg-red-600 hover:text-white"
              >
                Get AI Advice
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 shadow-xl border-2 border-red-900/30 hover:border-red-600 transition-all hover:scale-110 hover:shadow-2xl hover:shadow-red-600/30 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Icon className={`text-5xl ${stat.color} mx-auto mb-4 group-hover:scale-125 transition-transform relative z-10`} />
                <div className="text-4xl font-black text-white mb-2 relative z-10">{stat.value}</div>
                <div className="text-gray-400 font-semibold text-lg relative z-10">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            <FaRocket className="inline-block text-red-600 mr-4 animate-bounce" />
            Powerful Features
          </h2>
          <p className="text-2xl text-gray-300">
            Everything you need to manage your life efficiently
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-800 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              feature.external ? (
                <a
                  key={index}
                  href={feature.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl hover:shadow-red-600/50 transition-all hover:scale-105 border-2 border-red-900/30 hover:border-red-600 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className={`relative z-10 w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                    <Icon className="text-4xl text-white" />
                  </div>
                  
                  <h3 className="relative z-10 text-2xl font-bold text-white mb-3 flex items-center gap-2 group-hover:text-red-400 transition-colors">
                    {feature.title}
                    <FaArrowRight className="text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-red-500" />
                  </h3>
                  
                  <p className="relative z-10 text-gray-400 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </a>
              ) : (
                user ? (
                  <Link
                    key={index}
                    to={feature.path}
                    className="group relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl hover:shadow-red-600/50 transition-all hover:scale-105 border-2 border-red-900/30 hover:border-red-600 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className={`relative z-10 w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                      <Icon className="text-4xl text-white" />
                    </div>
                    
                    <h3 className="relative z-10 text-2xl font-bold text-white mb-3 flex items-center gap-2 group-hover:text-red-400 transition-colors">
                      {feature.title}
                      <FaArrowRight className="text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-red-500" />
                    </h3>
                    
                    <p className="relative z-10 text-gray-400 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </Link>
                ) : (
                  <div
                    key={index}
                    onClick={onLoginRequired}
                    className="group relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl hover:shadow-red-600/50 transition-all hover:scale-105 border-2 border-red-900/30 hover:border-red-600 overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="absolute top-4 right-4 z-20 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🔒 Login Required
                    </div>
                    
                    <div className={`relative z-10 w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                      <Icon className="text-4xl text-white" />
                    </div>
                    
                    <h3 className="relative z-10 text-2xl font-bold text-white mb-3 flex items-center gap-2 group-hover:text-red-400 transition-colors">
                      {feature.title}
                      <FaArrowRight className="text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-red-500" />
                    </h3>
                    
                    <p className="relative z-10 text-gray-400 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                )
              )
            )
          })}
        </div>

        {!user && (
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-red-900/50 to-black/50 backdrop-blur-lg px-8 py-6 rounded-2xl border-2 border-red-600/50">
              <p className="text-2xl text-white mb-2">🔓 Unlock All Features</p>
              <p className="text-gray-300 mb-4">Login or Sign up to access AI advice, health tracking, finance management, and more!</p>
              <button
                onClick={onLoginRequired}
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-all"
              >
                Login / Sign Up
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-3xl p-16 text-center shadow-2xl overflow-hidden border-2 border-red-500">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-800 rounded-full opacity-20 blur-3xl"></div>
          
          <div className="relative z-10">
            <FaFire className="text-6xl text-white mx-auto mb-6 animate-bounce" />
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who are already using Life Pilot AI to manage their daily life efficiently
            </p>
            <Link
              to="/ai"
              className="inline-flex items-center gap-3 bg-black text-red-500 px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:shadow-black/50 transition-all hover:scale-110 border-4 border-white hover:bg-white hover:text-black"
            >
              <FaRobot className="text-3xl" />
              Get Started Now
              <FaArrowRight className="text-2xl" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black border-t-2 border-red-900/50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaBrain className="text-3xl text-red-600 animate-pulse" />
            <span className="text-2xl font-bold text-white">Life Pilot AI</span>
          </div>
          <p className="text-gray-400 mb-2 text-lg">
            © {new Date().getFullYear()} Life Pilot AI. All rights reserved.
          </p>
          <p className="text-red-500 text-sm font-semibold">
            Made with <span className="text-red-600 text-xl">❤️</span> for better life management
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
