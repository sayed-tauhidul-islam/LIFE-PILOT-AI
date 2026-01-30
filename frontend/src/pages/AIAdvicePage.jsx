import React, { useState } from 'react'
import { userAPI, adviceAPI } from '../api'
import Footer from '../components/Footer'
import { FaUser, FaBriefcase, FaDollarSign, FaUsers, FaMapMarkerAlt, FaClock, FaHeart, FaBook, FaLock } from 'react-icons/fa'

const AIAdvicePage = ({ theme, user, onLoginRequired }) => {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    savings: '',
    familySize: '',
    occupation: '',
    workHours: '',
    workDays: '',
    education: '',
    healthCondition: '',
    hobbies: '',
    goals: '',
    location: {
      city: '',
      country: ''
    }
  })

  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)

  const getThemeColors = () => {
    const themes = {
      light: {
        bg: 'bg-white',
        text: 'text-black',
        cardBg: 'bg-gray-50',
        border: 'border-gray-300',
        input: 'bg-white border-gray-300 text-black'
      },
      dark: {
        bg: 'bg-gray-900',
        text: 'text-white',
        cardBg: 'bg-gray-800',
        border: 'border-gray-700',
        input: 'bg-gray-700 border-gray-600 text-white'
      },
      blue: {
        bg: 'bg-blue-900',
        text: 'text-blue-50',
        cardBg: 'bg-blue-800',
        border: 'border-blue-700',
        input: 'bg-blue-800 border-blue-600 text-blue-50'
      }
    }
    return themes[theme] || themes.light
  }

  const colors = getThemeColors()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'city' || name === 'country') {
      setUserData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value
        }
      }))
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Add user_id to profile data
      const profileData = {
        ...userData,
        user_id: user.user_id
      }
      
      const response = await userAPI.createProfile(profileData)
      console.log('User data saved:', response.data)
      
      if (response.data.user_id) {
        const adviceResponse = await adviceAPI.getDailyAdvice(response.data.user_id)
        setRecommendations(adviceResponse.data)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to get recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${colors.bg}`}>
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold ${colors.text} mb-2`}>
              Get Personalized <span className="text-red-600">AI Advice</span>
            </h1>
            <p className={`text-lg ${colors.text} opacity-80`}>
              Fill out your profile to receive tailored recommendations
            </p>
          </div>

          {/* Login Required Message */}
          {!user ? (
            <div className={`${colors.cardBg} p-12 rounded-lg border-2 ${colors.border} text-center`}>
              <FaLock className="text-6xl text-red-600 mx-auto mb-6" />
              <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>
                Login Required
              </h2>
              <p className={`${colors.text} opacity-80 mb-6`}>
                You need to login or sign up to access AI advice and submit your data.
              </p>
              <button
                onClick={onLoginRequired}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
              >
                Login / Sign Up
              </button>
            </div>
          ) : (
            <>
              {/* Form */}
              <div className={`${colors.cardBg} p-8 rounded-lg border-2 ${colors.border} mb-8`}>
                <form onSubmit={handleSubmit} className="space-y-6">{/* Personal Information */}
              {/* Personal Information */}
              <div>
                <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                  <FaUser className="text-red-600" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={userData.age}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="Enter your age"
                    />
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div>
                <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                  <FaBriefcase className="text-red-600" /> Work Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Occupation *</label>
                    <input
                      type="text"
                      name="occupation"
                      value={userData.occupation}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="Your job title"
                    />
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Education Level</label>
                    <select
                      name="education"
                      value={userData.education}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                    >
                      <option value="">Select education level</option>
                      <option value="high_school">High School</option>
                      <option value="bachelor">Bachelor's Degree</option>
                      <option value="master">Master's Degree</option>
                      <option value="phd">PhD</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Work Hours/Day</label>
                    <input
                      type="number"
                      name="workHours"
                      value={userData.workHours}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="8"
                    />
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Work Days/Week</label>
                    <input
                      type="number"
                      name="workDays"
                      value={userData.workDays}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                  <FaDollarSign className="text-red-600" /> Financial Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Monthly Income ($) *</label>
                    <input
                      type="number"
                      name="monthlyIncome"
                      value={userData.monthlyIncome}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Monthly Expenses ($)</label>
                    <input
                      type="number"
                      name="monthlyExpenses"
                      value={userData.monthlyExpenses}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="3000"
                    />
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Current Savings ($)</label>
                    <input
                      type="number"
                      name="savings"
                      value={userData.savings}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Family Size *</label>
                    <input
                      type="number"
                      name="familySize"
                      value={userData.familySize}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="4"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Lifestyle */}
              <div>
                <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                  <FaMapMarkerAlt className="text-red-600" /> Location & Lifestyle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={userData.location.city}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={userData.location.country}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="USA"
                    />
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Health Condition</label>
                    <input
                      type="text"
                      name="healthCondition"
                      value={userData.healthCondition}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="Good / Any conditions"
                    />
                  </div>
                  <div>
                    <label className={`block ${colors.text} font-semibold mb-2`}>Hobbies</label>
                    <input
                      type="text"
                      name="hobbies"
                      value={userData.hobbies}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                      placeholder="Reading, Sports, Music"
                    />
                  </div>
                </div>
              </div>

              {/* Goals */}
              <div>
                <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                  <FaBook className="text-red-600" /> Your Goals
                </h3>
                <textarea
                  name="goals"
                  value={userData.goals}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                  placeholder="What are your short-term and long-term goals? (e.g., save for house, improve health, learn new skills)"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Getting AI Recommendations...' : 'Get AI Guidance & Recommendations'}
              </button>
            </form>
          </div>

          {/* Recommendations Display */}
          {recommendations && (
            <div className={`${colors.cardBg} p-8 rounded-lg border-2 ${colors.border}`}>
              <h2 className={`text-3xl font-bold ${colors.text} mb-6 text-center`}>
                Your Personalized <span className="text-red-600">AI Recommendations</span>
              </h2>
              
              <div className="space-y-6">
                {/* Daily Tasks */}
                {recommendations.todayTasks && recommendations.todayTasks.length > 0 && (
                  <div>
                    <h3 className={`text-xl font-bold ${colors.text} mb-3`}>Today's Tasks</h3>
                    <ul className="space-y-2">
                      {recommendations.todayTasks.map((task, index) => (
                        <li key={index} className={`${colors.text} flex items-start gap-2`}>
                          <span className="text-red-600 font-bold">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Financial Tip */}
                {recommendations.financialTip && (
                  <div>
                    <h3 className={`text-xl font-bold ${colors.text} mb-3`}>Financial Advice</h3>
                    <p className={`${colors.text} opacity-90`}>{recommendations.financialTip}</p>
                  </div>
                )}

                {/* Weather Info */}
                {recommendations.weather && (
                  <div>
                    <h3 className={`text-xl font-bold ${colors.text} mb-3`}>Weather Insights</h3>
                    <p className={`${colors.text} opacity-90`}>{recommendations.weather}</p>
                  </div>
                )}

                {/* Meetings */}
                {recommendations.meetings && recommendations.meetings.length > 0 && (
                  <div>
                    <h3 className={`text-xl font-bold ${colors.text} mb-3`}>Upcoming Meetings</h3>
                    <ul className="space-y-2">
                      {recommendations.meetings.map((meeting, index) => (
                        <li key={index} className={`${colors.text}`}>
                          {meeting}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}

export default AIAdvicePage
