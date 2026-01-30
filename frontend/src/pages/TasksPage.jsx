import React, { useState } from 'react'
import Footer from '../components/Footer'
import { FaPlus, FaCheck, FaTrash, FaClock } from 'react-icons/fa'

const TasksPage = ({ theme }) => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium',
    dueDate: '',
    category: 'personal'
  })

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

  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTask.title) {
      setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }])
      setNewTask({ title: '', priority: 'medium', dueDate: '', category: 'personal' })
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 border-red-600',
      medium: 'text-yellow-600 border-yellow-600',
      low: 'text-green-600 border-green-600'
    }
    return colors[priority] || colors.medium
  }

  const activeTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <div className={`min-h-screen flex flex-col ${colors.bg}`}>
      <div className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className={`text-4xl font-bold ${colors.text} mb-8 text-center`}>
            Task <span className="text-red-600">Management</span>
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border} text-center`}>
              <p className={`text-4xl font-bold ${colors.text}`}>{tasks.length}</p>
              <p className={`${colors.text} opacity-70`}>Total Tasks</p>
            </div>
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border} text-center`}>
              <p className={`text-4xl font-bold text-yellow-600`}>{activeTasks.length}</p>
              <p className={`${colors.text} opacity-70`}>Active</p>
            </div>
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border} text-center`}>
              <p className={`text-4xl font-bold text-green-600`}>{completedTasks.length}</p>
              <p className={`${colors.text} opacity-70`}>Completed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Task Form */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border}`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                <FaPlus className="text-red-600" /> Add New Task
              </h2>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className={`block ${colors.text} font-semibold mb-2`}>Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    required
                    className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                    placeholder="What needs to be done?"
                  />
                </div>

                <div>
                  <label className={`block ${colors.text} font-semibold mb-2`}>Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className={`block ${colors.text} font-semibold mb-2`}>Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                    className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="urgent">Urgent</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={`block ${colors.text} font-semibold mb-2`}>Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Add Task
                </button>
              </form>
            </div>

            {/* Tasks List */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border}`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>Your Tasks</h2>
              
              {/* Active Tasks */}
              {activeTasks.length > 0 && (
                <div className="mb-6">
                  <h3 className={`font-bold ${colors.text} mb-3`}>Active Tasks</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {activeTasks.map((task) => (
                      <div key={task.id} className={`p-4 border-2 ${getPriorityColor(task.priority)} rounded-lg`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`font-bold ${colors.text}`}>{task.title}</h4>
                            <div className="flex gap-4 mt-2 text-sm opacity-70">
                              <span className={`${colors.text} capitalize`}>📁 {task.category}</span>
                              {task.dueDate && (
                                <span className={`${colors.text} flex items-center gap-1`}>
                                  <FaClock /> {task.dueDate}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div>
                  <h3 className={`font-bold ${colors.text} mb-3`}>Completed Tasks</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {completedTasks.map((task) => (
                      <div key={task.id} className={`p-4 border ${colors.border} rounded-lg opacity-60`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`font-bold ${colors.text} line-through`}>{task.title}</h4>
                            <span className={`text-sm ${colors.text} capitalize`}>📁 {task.category}</span>
                          </div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tasks.length === 0 && (
                <p className={`${colors.text} opacity-70 text-center py-8`}>
                  No tasks yet. Add your first task to get started!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}

export default TasksPage
