import React from 'react'
import { Link } from 'react-router-dom'
import { FaRobot, FaChartLine, FaBrain, FaTasks, FaLightbulb } from 'react-icons/fa'
import Footer from '../components/Footer'

const HomePage = ({ theme }) => {
  const getThemeColors = () => {
    const themes = {
      light: {
        bg: 'bg-white',
        text: 'text-black',
        cardBg: 'bg-gray-50',
        border: 'border-gray-300'
      },
      dark: {
        bg: 'bg-gray-900',
        text: 'text-white',
        cardBg: 'bg-gray-800',
        border: 'border-gray-700'
      },
      blue: {
        bg: 'bg-blue-900',
        text: 'text-blue-50',
        cardBg: 'bg-blue-800',
        border: 'border-blue-700'
      }
    }
    return themes[theme] || themes.light
  }

  const colors = getThemeColors()

  return (
    <div className={`min-h-screen flex flex-col ${colors.bg}`}>
      {/* Hero Section */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero Header */}
          <div className="text-center mb-16">
            <h1 className={`text-6xl font-bold ${colors.text} mb-4`}>
              Life Pilot <span className="text-red-600">AI</span>
            </h1>
            <p className={`text-2xl ${colors.text} opacity-80 mb-8`}>
              Your Personal AI-Powered Life Guide
            </p>
            <p className={`text-xl ${colors.text} max-w-3xl mx-auto`}>
              Navigate your daily life with intelligent insights on weather, finances, 
              routines, prayer times, and personalized recommendations powered by 
              advanced AI technology.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border} hover:shadow-xl transition-shadow`}>
              <FaRobot className="text-5xl text-red-600 mb-4" />
              <h3 className={`text-2xl font-bold ${colors.text} mb-3`}>
                AI-Powered Advice
              </h3>
              <p className={`${colors.text} opacity-80`}>
                Get personalized daily recommendations based on your profile, schedule, 
                and goals. Our AI analyzes your patterns to provide actionable insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border} hover:shadow-xl transition-shadow`}>
              <FaChartLine className="text-5xl text-red-600 mb-4" />
              <h3 className={`text-2xl font-bold ${colors.text} mb-3`}>
                Financial Tracking
              </h3>
              <p className={`${colors.text} opacity-80`}>
                Monitor your expenses, analyze spending patterns, and receive smart 
                saving recommendations to achieve your financial goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border} hover:shadow-xl transition-shadow`}>
              <FaBrain className="text-5xl text-red-600 mb-4" />
              <h3 className={`text-2xl font-bold ${colors.text} mb-3`}>
                Smart Routines
              </h3>
              <p className={`${colors.text} opacity-80`}>
                Create optimized daily routines tailored to your age, lifestyle, and 
                responsibilities for maximum productivity.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border} hover:shadow-xl transition-shadow`}>
              <FaTasks className="text-5xl text-red-600 mb-4" />
              <h3 className={`text-2xl font-bold ${colors.text} mb-3`}>
                Task Management
              </h3>
              <p className={`${colors.text} opacity-80`}>
                Organize your tasks, set priorities, and never miss important deadlines 
                with intelligent reminders.
              </p>
            </div>

            {/* Feature 5 */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border} hover:shadow-xl transition-shadow`}>
              <FaLightbulb className="text-5xl text-red-600 mb-4" />
              <h3 className={`text-2xl font-bold ${colors.text} mb-3`}>
                Weather Insights
              </h3>
              <p className={`${colors.text} opacity-80`}>
                Get real-time weather updates and AI-generated activity suggestions 
                based on current conditions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border} hover:shadow-xl transition-shadow`}>
              <FaRobot className="text-5xl text-red-600 mb-4" />
              <h3 className={`text-2xl font-bold ${colors.text} mb-3`}>
                File Management
              </h3>
              <p className={`${colors.text} opacity-80`}>
                Upload, organize, and search your documents with powerful file 
                management supporting 20+ file types.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${colors.text} mb-6`}>
              Ready to Optimize Your Life?
            </h2>
            <p className={`text-xl ${colors.text} opacity-80 mb-8`}>
              Start by getting personalized AI advice tailored to your lifestyle
            </p>
            <Link
              to="/advice"
              className="bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-red-700 transition-colors inline-block"
            >
              Get AI Guidance Now →
            </Link>
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}

export default HomePage
