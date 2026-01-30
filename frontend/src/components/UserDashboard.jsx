import React, { useState, useEffect } from 'react'
import { userAPI, adviceAPI } from '../api'
import Navbar from './Navbar'
import PrayerTimes from './PrayerTimes'
import FileManager from './FileManager'

const UserDashboard = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  const [fileManagerOpen, setFileManagerOpen] = useState(false)

  const [userData, setUserData] = useState({
    name: '',
    age: '',
    monthlyIncome: '',
    familySize: '',
    location: {
      city: '',
      country: ''
    }
  })
  
  const [aiAdvice, setAiAdvice] = useState({
    todayTasks: [],
    weather: '',
    meetings: [],
    financialTip: ''
  })

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await userAPI.createProfile(userData)
      console.log('User data saved:', response.data)
      // Fetch AI recommendations
      if (response.data.user_id) {
        fetchAIAdvice(response.data.user_id)
      }
    } catch (error) {
      console.error('Error saving user data:', error)
    }
  }

  const fetchAIAdvice = async (userId) => {
    try {
      const response = await adviceAPI.getDailyAdvice(userId)
      setAiAdvice(response.data.data)
    } catch (error) {
      console.error('Error fetching AI advice:', error)
    }
  }

  const getThemeColors = () => {
    switch(theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          cardBg: 'bg-gray-800',
          text: 'text-white',
          border: 'border-gray-700',
          input: 'bg-gray-700 text-white border-gray-600'
        }
      case 'blue':
        return {
          bg: 'bg-blue-900',
          cardBg: 'bg-blue-800',
          text: 'text-white',
          border: 'border-blue-700',
          input: 'bg-blue-700 text-white border-blue-600'
        }
      default: // light
        return {
          bg: 'bg-white',
          cardBg: 'bg-white',
          text: 'text-black',
          border: 'border-black',
          input: 'bg-white text-black border-black'
        }
    }
  }

  const colors = getThemeColors()

  return (
    <div className={`min-h-screen ${colors.bg}`}>
      {/* Navbar */}
      <Navbar 
        theme={theme} 
        setTheme={setTheme} 
        user={userData} 
        onFileManagerOpen={() => setFileManagerOpen(true)}
      />

      {/* File Manager Modal */}
      {fileManagerOpen && (
        <FileManager 
          userId={userData.email || 'test-user'}
          theme={theme}
          onClose={() => setFileManagerOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className={`text-4xl font-bold ${colors.text} mb-2`}>
            Life Pilot AI Agent
          </h1>
          <p className={`text-xl ${colors.text}`}>
            <span className="text-red-600 font-semibold">Your Personal Life Guide</span> - 
            Navigate Your Daily Life with AI-Powered Insights
          </p>
        </header>

        {/* User Information Form */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className={`${colors.cardBg} border-2 ${colors.border} p-6 rounded-lg shadow-lg`}>
            <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>
            User Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block ${colors.text} font-semibold mb-2`}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border-2 ${colors.input} rounded focus:outline-none focus:border-red-600`}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className={`block ${colors.text} font-semibold mb-2`}>
                Age
              </label>
              <input
                type="number"
                name="age"
                value={userData.age}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border-2 ${colors.input} rounded focus:outline-none focus:border-red-600`}
                placeholder="Enter your age"
                required
              />
            </div>

            <div>
              <label className={`block ${colors.text} font-semibold mb-2`}>
                Monthly Income ($)
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={userData.monthlyIncome}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border-2 ${colors.input} rounded focus:outline-none focus:border-red-600`}
                placeholder="Enter your monthly income"
                required
              />
            </div>

            <div>
              <label className={`block ${colors.text} font-semibold mb-2`}>
                Family Size
              </label>
              <input
                type="number"
                name="familySize"
                value={userData.familySize}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border-2 ${colors.input} rounded focus:outline-none focus:border-red-600`}
                placeholder="Number of family members"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded hover:bg-red-700 transition duration-200"
            >
              Save Profile & Get AI Guidance
            </button>
          </form>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="max-w-4xl mx-auto" id="advice">
        <h2 className={`text-3xl font-bold ${colors.text} mb-6`}>
          <span className="text-red-600">Today's AI Recommendations</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Tasks */}
          <div id="tasks" className={`${colors.cardBg} border-2 ${colors.border} p-6 rounded-lg shadow-lg`}>
            <h3 className={`text-xl font-bold ${colors.text} mb-4`}>
              📋 Today's Tasks
            </h3>
            <ul className="space-y-2">
              <li className={colors.text}>
                • <span className="text-red-600 font-semibold">Morning:</span> Review meeting agenda
              </li>
              <li className={colors.text}>
                • <span className="text-red-600 font-semibold">Afternoon:</span> Complete project reports
              </li>
              <li className={colors.text}>
                • <span className="text-red-600 font-semibold">Evening:</span> Plan tomorrow's schedule
              </li>
            </ul>
          </div>

          {/* Weather & Activities */}
          <div id="weather" className={`${colors.cardBg} border-2 ${colors.border} p-6 rounded-lg shadow-lg`}>
            <h3 className={`text-xl font-bold ${colors.text} mb-4`}>
              ☀️ Weather & Activities
            </h3>
            <p className={`${colors.text} mb-3`}>
              <span className="text-red-600 font-semibold">Weather:</span> Sunny, 72°F
            </p>
            <p className={colors.text}>
              <span className="text-red-600 font-semibold">Suggestion:</span> Perfect day for outdoor exercise or walking meetings
            </p>
          </div>

          {/* Prayer Times */}
          <PrayerTimes theme={theme} location={userData.location} />

          {/* Financial Advice */}
          <div id="financial" className={`${colors.cardBg} border-2 ${colors.border} p-6 rounded-lg shadow-lg`}>
            <h3 className={`text-xl font-bold ${colors.text} mb-4`}>
              💰 Financial Tips
            </h3>
            <p className={`${colors.text} mb-3`}>
              <span className="text-red-600 font-semibold">Budget Alert:</span> You're spending 15% more on dining out this month
            </p>
            <p className={colors.text}>
              <span className="text-red-600 font-semibold">Tip:</span> Consider meal prepping to save $200/month
            </p>
          </div>

          {/* Routine Optimization */}
          <div id="routine" className={`${colors.cardBg} border-2 ${colors.border} p-6 rounded-lg shadow-lg`}>
            <h3 className={`text-xl font-bold ${colors.text} mb-4`}>
              ⚡ Routine Optimization
            </h3>
            <p className={`${colors.text} mb-3`}>
              <span className="text-red-600 font-semibold">Sleep Pattern:</span> You averaged 6.5 hours last week
            </p>
            <p className={colors.text}>
              <span className="text-red-600 font-semibold">Recommendation:</span> Aim for 7-8 hours for better productivity
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className={`text-3xl font-bold ${colors.text} mb-6 text-center`}>
          What <span className="text-red-600">Life Pilot AI</span> Can Do For You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${colors.cardBg} border-2 ${colors.border} p-6 rounded-lg text-center`}>
            <h3 className="text-lg font-bold text-red-600 mb-2">📅 Daily Planning</h3>
            <p className={colors.text}>Intelligent scheduling based on your priorities and weather</p>
          </div>
          <div className={`${colors.cardBg} border-2 ${colors.border} p-6 rounded-lg text-center`}>
            <h3 className="text-lg font-bold text-red-600 mb-2">💵 Money Management</h3>
            <p className={colors.text}>Track expenses and get personalized saving strategies</p>
          </div>
          <div className={`${colors.cardBg} border-2 ${colors.border} p-6 rounded-lg text-center`}>
            <h3 className="text-lg font-bold text-red-600 mb-2">🎯 Life Optimization</h3>
            <p className={colors.text}>Custom routines for students, professionals, and families</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default UserDashboard
