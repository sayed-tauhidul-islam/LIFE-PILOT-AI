import React, { useState, useEffect } from 'react'
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

  // Auto-fill form from user profile on mount
  useEffect(() => {
    if (user && user.user_id) {
      loadUserProfile()
    }
  }, [user])

  const loadUserProfile = async () => {
    try {
      const response = await userAPI.getProfile(user.user_id)
      if (response.data && response.data.data) {
        const profile = response.data.data
        setUserData({
          name: profile.name || user.full_name || user.name || '',
          age: profile.age || '',
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          monthlyIncome: profile.monthlyIncome || '',
          monthlyExpenses: profile.monthlyExpenses || '',
          savings: profile.savings || '',
          familySize: profile.familySize || '',
          occupation: profile.occupation || '',
          workHours: profile.workHours || '',
          workDays: profile.workDays || '',
          education: profile.education || '',
          healthCondition: profile.healthCondition || '',
          hobbies: profile.hobbies || '',
          goals: profile.goals || '',
          location: {
            city: profile.location?.city || '',
            country: profile.location?.country || ''
          }
        })
      }
    } catch (error) {
      console.log('No existing profile found, user will fill form')
    }
  }

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
      
      // Get AI recommendations
      const adviceResponse = await adviceAPI.getDailyAdvice(user.user_id)
      console.log('AI Advice Response:', adviceResponse.data)
      
      // Check if we have data object or direct recommendations
      const recommendations = adviceResponse.data?.data || adviceResponse.data
      
      // If no recommendations from API, generate basic ones
      if (!recommendations || Object.keys(recommendations).length === 0) {
        const basicRecommendations = {
          todayTasks: [
            `${userData.name}, আজকের দিনটি শুরু করুন ইতিবাচক মনোভাব নিয়ে`,
            `আপনার ${userData.occupation} কাজে মনোযোগী হন`,
            `মাসিক আয় ৳${userData.monthlyIncome} থেকে অন্তত 20% সঞ্চয় করুন`,
            `প্রতিদিন ${userData.workHours} ঘণ্টা কাজের মধ্যে বিরতি নিন`,
            `${userData.healthCondition} অবস্থা মাথায় রেখে স্বাস্থ্যকর খাবার খান`
          ],
          financialTip: `আপনার মাসিক আয় ৳${userData.monthlyIncome} এবং খরচ ৳${userData.monthlyExpenses}। সঞ্চয় হচ্ছে ৳${userData.savings}। আরও সঞ্চয় বাড়ানোর জন্য অপ্রয়োজনীয় খরচ কমান এবং বিনিয়োগ পরিকল্পনা করুন। 50-30-20 বাজেট নিয়ম অনুসরণ করুন: 50% প্রয়োজনীয়, 30% ইচ্ছা, 20% সঞ্চয়।`,
          weather: `${userData.location.city}, ${userData.location.country} এর জন্য আজকের আবহাওয়া প্রস্তুতি নিন। সাথে ছাতা রাখুন এবং পানি পান করুন।`,
          meetings: [
            `${userData.workDays} দিনের কাজের সময়সূচি অনুযায়ী পরিকল্পনা করুন`,
            `পরিবারের ${userData.familySize} সদস্যদের সাথে সময় কাটান`
          ],
          personalizedAdvice: [
            `বয়স ${userData.age} বছরে আপনার লক্ষ্য: ${userData.goals}`,
            `${userData.hobbies} শখ গুলোতে সময় দিন মানসিক প্রশান্তির জন্য`,
            `${userData.education} শিক্ষা ব্যবহার করে নিজের দক্ষতা আরও বাড়ান`
          ]
        }
        setRecommendations(basicRecommendations)
      } else {
        setRecommendations(recommendations)
      }
      
      // Show success message
      alert('✅ আপনার AI সুপারিশ তৈরি হয়েছে!')
    } catch (error) {
      console.error('Error:', error)
      // Still generate basic recommendations even if API fails
      const basicRecommendations = {
        todayTasks: [
          `${userData.name}, আজকের দিনটি পরিকল্পনা করে শুরু করুন`,
          `আপনার লক্ষ্য: ${userData.goals} মনে রাখুন`,
          `আয় ৳${userData.monthlyIncome} থেকে সঞ্চয় করুন`
        ],
        financialTip: `মাসিক আয় ৳${userData.monthlyIncome} এবং খরচ ৳${userData.monthlyExpenses}। বুদ্ধিমানের সাথে খরচ করুন এবং ভবিষ্যতের জন্য সঞ্চয় করুন।`,
        weather: `আজকের দিনটির জন্য প্রস্তুত থাকুন`,
        personalizedAdvice: [
          `${userData.occupation} কাজে সফল হতে প্রতিদিন লক্ষ্যের দিকে এগিয়ে যান`,
          `স্বাস্থ্য: ${userData.healthCondition} অবস্থায় সুস্থ থাকতে নিয়মিত চেকআপ করুন`
        ]
      }
      setRecommendations(basicRecommendations)
      alert('✅ আপনার মৌলিক সুপারিশ তৈরি হয়েছে! (API সংযোগ ব্যর্থ হলেও)')  
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

                {/* Personalized Advice */}
                {recommendations.personalizedAdvice && recommendations.personalizedAdvice.length > 0 && (
                  <div>
                    <h3 className={`text-xl font-bold ${colors.text} mb-3`}>Personalized Advice</h3>
                    <ul className="space-y-2">
                      {recommendations.personalizedAdvice.map((advice, index) => (
                        <li key={index} className={`${colors.text} flex items-start gap-2`}>
                          <span className="text-red-600 font-bold">✓</span>
                          <span>{advice}</span>
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
