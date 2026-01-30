import React, { useState } from 'react'
import Footer from '../components/Footer'
import { FaPalette, FaBell, FaLock, FaUser, FaDatabase, FaGlobe } from 'react-icons/fa'

const SettingsPage = ({ theme, setTheme, user }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    darkMode: theme === 'dark',
    language: 'en',
    dataBackup: true,
    autoSave: true
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

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    localStorage.setItem('app_settings', JSON.stringify(settings))
    alert('Settings saved successfully!')
  }

  return (
    <div className={`min-h-screen flex flex-col ${colors.bg}`}>
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className={`text-4xl font-bold ${colors.text} mb-8 text-center`}>
            App <span className="text-red-600">Settings</span>
          </h1>

          <div className="space-y-6">
            {/* User Profile Info */}
            {user && (
              <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border}`}>
                <h2 className={`text-2xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                  <FaUser className="text-red-600" /> Profile Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className={`text-sm ${colors.text} opacity-70`}>User ID</p>
                    <p className={`font-mono text-sm ${colors.text} bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded`}>
                      {user.user_id || 'Not available'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${colors.text} opacity-70`}>Name</p>
                    <p className={`font-semibold ${colors.text}`}>{user.full_name || user.name}</p>
                  </div>
                  {user.username && (
                    <div>
                      <p className={`text-sm ${colors.text} opacity-70`}>Username</p>
                      <p className={`font-semibold ${colors.text}`}>@{user.username}</p>
                    </div>
                  )}
                  <div>
                    <p className={`text-sm ${colors.text} opacity-70`}>Email</p>
                    <p className={`font-semibold ${colors.text}`}>{user.email}</p>
                  </div>
                  {user.is_guest && (
                    <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mt-3">
                      <p className="text-yellow-800 text-sm font-semibold">
                        ⚠️ You are using a guest account. Sign up for a full account to save your data permanently.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Theme Settings */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border}`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                <FaPalette className="text-red-600" /> Theme Preferences
              </h2>
              <div className="space-y-4">
                <p className={`${colors.text} opacity-80 mb-4`}>Choose your preferred color theme</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`p-4 rounded-lg border-2 ${theme === 'light' ? 'border-red-600 bg-gray-100' : 'border-gray-300 bg-white'} hover:border-red-600 transition-colors`}
                  >
                    <div className="w-full h-20 bg-white border-2 border-gray-300 rounded mb-2"></div>
                    <p className="font-bold text-black">Light Theme</p>
                  </button>

                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`p-4 rounded-lg border-2 ${theme === 'dark' ? 'border-red-600 bg-gray-800' : 'border-gray-300 bg-white'} hover:border-red-600 transition-colors`}
                  >
                    <div className="w-full h-20 bg-gray-900 border-2 border-gray-700 rounded mb-2"></div>
                    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Dark Theme</p>
                  </button>

                  <button
                    onClick={() => handleThemeChange('blue')}
                    className={`p-4 rounded-lg border-2 ${theme === 'blue' ? 'border-red-600 bg-blue-800' : 'border-gray-300 bg-white'} hover:border-red-600 transition-colors`}
                  >
                    <div className="w-full h-20 bg-blue-900 border-2 border-blue-700 rounded mb-2"></div>
                    <p className={`font-bold ${theme === 'blue' ? 'text-white' : 'text-black'}`}>Blue Theme</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border}`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                <FaBell className="text-red-600" /> Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${colors.text}`}>Push Notifications</p>
                    <p className={`text-sm ${colors.text} opacity-70`}>Receive in-app notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${colors.text}`}>Email Notifications</p>
                    <p className={`text-sm ${colors.text} opacity-70`}>Get updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border}`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                <FaDatabase className="text-red-600" /> Data & Privacy
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${colors.text}`}>Auto Save</p>
                    <p className={`text-sm ${colors.text} opacity-70`}>Automatically save your data</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${colors.text}`}>Data Backup</p>
                    <p className={`text-sm ${colors.text} opacity-70`}>Regular backup of your data</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.dataBackup}
                      onChange={(e) => handleSettingChange('dataBackup', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Language & Region */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border}`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                <FaGlobe className="text-red-600" /> Language & Region
              </h2>
              <div>
                <label className={`block ${colors.text} font-semibold mb-2`}>Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg ${colors.input}`}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
            </div>

            {/* Account Actions */}
            <div className={`${colors.cardBg} p-6 rounded-lg border-2 ${colors.border}`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                <FaLock className="text-red-600" /> Account & Security
              </h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                  Change Password
                </button>
                <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors">
                  Export Data
                </button>
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveSettings}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
            >
              Save All Settings
            </button>
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  )
}

export default SettingsPage
