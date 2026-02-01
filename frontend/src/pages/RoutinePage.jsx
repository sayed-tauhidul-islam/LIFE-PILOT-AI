import React, { useState, useEffect } from 'react'
import Footer from '../components/Footer'
import RoutineSetup from '../components/RoutineSetup'
import { Calendar, Clock, Edit, Trash2, Plus } from 'lucide-react'
import api from '../api'

const RoutinePage = ({ theme }) => {
  const [routines, setRoutines] = useState([])
  const [showSetup, setShowSetup] = useState(false)
  const [selectedRoutine, setSelectedRoutine] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoutines()
  }, [])

  const fetchRoutines = async () => {
    try {
      setLoading(true)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.id) {
        const response = await api.get(`/routines?userId=${user.id}`)
        setRoutines(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching routines:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRoutine = async (routineData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await api.post('/routines', {
        ...routineData,
        userId: user.id
      })
      
      setRoutines([...routines, response.data])
      setShowSetup(false)
      alert('রুটিন সফলভাবে সংরক্ষিত হয়েছে!')
    } catch (error) {
      console.error('Error saving routine:', error)
      alert('রুটিন সংরক্ষণে সমস্যা হয়েছে')
    }
  }

  const handleDeleteRoutine = async (id) => {
    if (window.confirm('রুটিন মুছে ফেলতে চান?')) {
      try {
        await api.delete(`/routines/${id}`)
        setRoutines(routines.filter(r => r._id !== id))
        alert('রুটিন মুছে ফেলা হয়েছে')
      } catch (error) {
        console.error('Error deleting routine:', error)
        alert('রুটিন মুছে ফেলতে সমস্যা হয়েছে')
      }
    }
  }

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

  if (showSetup) {
    return (
      <div className="min-h-screen">
        <RoutineSetup 
          onSave={handleSaveRoutine}
          onClose={() => setShowSetup(false)}
        />
        <Footer />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${colors.bg}`}>
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-4xl font-bold ${colors.text}`}>
                Daily <span className="text-red-600">Routine</span> Planner
              </h1>
              <p className={`${colors.text} opacity-70 mt-2`}>
                আপনার দৈনন্দিন রুটিন পরিচালনা করুন
              </p>
            </div>
            <button
              onClick={() => setShowSetup(true)}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              নতুন রুটিন তৈরি করুন
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
              <p className={`${colors.text} mt-4`}>লোড হচ্ছে...</p>
            </div>
          ) : routines.length === 0 ? (
            <div className={`${colors.cardBg} rounded-xl p-12 text-center border-2 ${colors.border}`}>
              <Calendar className={`w-24 h-24 ${colors.text} opacity-30 mx-auto mb-4`} />
              <h3 className={`text-2xl font-bold ${colors.text} mb-2`}>
                কোনো রুটিন নেই
              </h3>
              <p className={`${colors.text} opacity-70 mb-6`}>
                আপনার প্রথম রুটিন তৈরি করতে উপরের বাটনে ক্লিক করুন
              </p>
              <button
                onClick={() => setShowSetup(true)}
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                শুরু করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routines.map((routine) => (
                <div
                  key={routine._id}
                  className={`${colors.cardBg} rounded-xl shadow-lg border-2 ${colors.border} p-6 hover:shadow-2xl transition-all`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${colors.text}`}>
                      {routine.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteRoutine(routine._id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${colors.text}`} />
                      <span className={`text-sm ${colors.text}`}>
                        {routine.schedule?.length || 0} টি কার্যক্রম
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${colors.text}`} />
                      <span className={`text-sm ${colors.text}`}>
                        {new Date(routine.createdAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                  </div>

                  {routine.schedule && routine.schedule.slice(0, 3).map((activity, idx) => (
                    <div key={idx} className={`text-sm ${colors.text} opacity-70 mb-1`}>
                      • {activity.startTime} - {activity.title}
                    </div>
                  ))}
                  
                  {routine.schedule && routine.schedule.length > 3 && (
                    <p className={`text-xs ${colors.text} opacity-50 mt-2`}>
                      আরো {routine.schedule.length - 3} টি...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default RoutinePage
