import React, { useState } from 'react'
import Footer from '../components/Footer'
import { FaClock, FaDumbbell, FaBriefcase, FaUtensils, FaBed } from 'react-icons/fa'

const RoutinePage = ({ theme }) => {
  const [routineType, setRoutineType] = useState('')
  const [customRoutine, setCustomRoutine] = useState([])

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

  const routineTemplates = {
    student: [
      { time: '06:00 AM', activity: 'Wake up & Morning routine', icon: <FaClock /> },
      { time: '07:00 AM', activity: 'Breakfast & Study session', icon: <FaUtensils /> },
      { time: '09:00 AM', activity: 'Classes/Online learning', icon: <FaBriefcase /> },
      { time: '12:00 PM', activity: 'Lunch break', icon: <FaUtensils /> },
      { time: '01:00 PM', activity: 'Afternoon classes', icon: <FaBriefcase /> },
      { time: '04:00 PM', activity: 'Exercise/Sports', icon: <FaDumbbell /> },
      { time: '06:00 PM', activity: 'Homework/Study time', icon: <FaBriefcase /> },
      { time: '08:00 PM', activity: 'Dinner & Family time', icon: <FaUtensils /> },
      { time: '09:00 PM', activity: 'Reading/Relaxation', icon: <FaBed /> },
      { time: '10:30 PM', activity: 'Sleep', icon: <FaBed /> }
    ],
    professional: [
      { time: '05:30 AM', activity: 'Wake up & Morning workout', icon: <FaDumbbell /> },
      { time: '07:00 AM', activity: 'Breakfast & Commute', icon: <FaUtensils /> },
      { time: '09:00 AM', activity: 'Work - High priority tasks', icon: <FaBriefcase /> },
      { time: '12:00 PM', activity: 'Lunch break', icon: <FaUtensils /> },
      { time: '01:00 PM', activity: 'Meetings & Collaboration', icon: <FaBriefcase /> },
      { time: '05:00 PM', activity: 'Wrap up work', icon: <FaBriefcase /> },
      { time: '06:00 PM', activity: 'Commute & Relaxation', icon: <FaClock /> },
      { time: '07:00 PM', activity: 'Dinner & Family time', icon: <FaUtensils /> },
      { time: '09:00 PM', activity: 'Personal development', icon: <FaBed /> },
      { time: '11:00 PM', activity: 'Sleep', icon: <FaBed /> }
    ],
    entrepreneur: [
      { time: '05:00 AM', activity: 'Wake up & Meditation', icon: <FaClock /> },
      { time: '06:00 AM', activity: 'Exercise & Planning', icon: <FaDumbbell /> },
      { time: '08:00 AM', activity: 'Breakfast & Emails', icon: <FaUtensils /> },
      { time: '09:00 AM', activity: 'Deep work session', icon: <FaBriefcase /> },
      { time: '12:00 PM', activity: 'Lunch & Networking', icon: <FaUtensils /> },
      { time: '02:00 PM', activity: 'Meetings & Calls', icon: <FaBriefcase /> },
      { time: '05:00 PM', activity: 'Strategic planning', icon: <FaBriefcase /> },
      { time: '07:00 PM', activity: 'Dinner & Family', icon: <FaUtensils /> },
      { time: '09:00 PM', activity: 'Learning & Reading', icon: <FaBed /> },
      { time: '11:00 PM', activity: 'Sleep', icon: <FaBed /> }
    ]
  }

  const displayedRoutine = routineType ? routineTemplates[routineType] : customRoutine

  return (
    <div className={`min-h-screen flex flex-col ${colors.bg}`}>
      <div className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className={`text-4xl font-bold ${colors.text} mb-8 text-center`}>
            Daily <span className="text-red-600">Routine</span> Planner
          </h1>

          {/* Routine Type Selection */}
          <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border} mb-8`}>
            <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>Choose Your Routine Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setRoutineType('student')}
                className={`p-4 rounded-lg border-2 ${routineType === 'student' ? 'border-red-600 bg-red-50' : colors.border} hover:border-red-600 transition-colors`}
              >
                <h3 className={`font-bold text-lg ${colors.text}`}>Student</h3>
                <p className={`text-sm ${colors.text} opacity-70`}>Balanced study schedule</p>
              </button>

              <button
                onClick={() => setRoutineType('professional')}
                className={`p-4 rounded-lg border-2 ${routineType === 'professional' ? 'border-red-600 bg-red-50' : colors.border} hover:border-red-600 transition-colors`}
              >
                <h3 className={`font-bold text-lg ${colors.text}`}>Professional</h3>
                <p className={`text-sm ${colors.text} opacity-70`}>9-5 work schedule</p>
              </button>

              <button
                onClick={() => setRoutineType('entrepreneur')}
                className={`p-4 rounded-lg border-2 ${routineType === 'entrepreneur' ? 'border-red-600 bg-red-50' : colors.border} hover:border-red-600 transition-colors`}
              >
                <h3 className={`font-bold text-lg ${colors.text}`}>Entrepreneur</h3>
                <p className={`text-sm ${colors.text} opacity-70`}>Flexible schedule</p>
              </button>
            </div>
          </div>

          {/* Routine Display */}
          {displayedRoutine.length > 0 && (
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border}`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-6`}>
                Your Daily Schedule
              </h2>
              <div className="space-y-3">
                {displayedRoutine.map((item, index) => (
                  <div key={index} className={`flex items-center gap-4 p-4 border ${colors.border} rounded-lg hover:shadow-md transition-shadow`}>
                    <div className="text-3xl text-red-600">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-lg ${colors.text}`}>{item.time}</p>
                      <p className={`${colors.text} opacity-80`}>{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border} mt-8`}>
            <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>
              ⚡ Productivity Tips
            </h2>
            <ul className={`space-y-2 ${colors.text}`}>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Wake up at the same time every day to regulate your body clock</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Exercise regularly to boost energy and mental clarity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Schedule your most important tasks during peak focus hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Take regular breaks to maintain productivity throughout the day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Get 7-8 hours of quality sleep for optimal performance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}

export default RoutinePage
