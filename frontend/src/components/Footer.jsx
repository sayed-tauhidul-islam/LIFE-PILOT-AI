import React from 'react'
import { FaHeart, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

const Footer = ({ theme }) => {
  const getThemeColors = () => {
    const themes = {
      light: {
        bg: 'bg-gray-100',
        text: 'text-gray-900',
        border: 'border-gray-300',
        link: 'text-blue-600 hover:text-blue-800'
      },
      dark: {
        bg: 'bg-gray-900',
        text: 'text-white',
        border: 'border-gray-700',
        link: 'text-blue-400 hover:text-blue-300'
      },
      blue: {
        bg: 'bg-blue-900',
        text: 'text-blue-50',
        border: 'border-blue-700',
        link: 'text-blue-300 hover:text-blue-100'
      }
    }
    return themes[theme] || themes.light
  }

  const colors = getThemeColors()

  return (
    <footer className={`${colors.bg} ${colors.text} border-t-2 ${colors.border} mt-auto`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-3">
              Life Pilot <span className="text-red-600">AI</span>
            </h3>
            <p className="opacity-80 text-sm">
              আপনার AI-চালিত ব্যক্তিগত জীবন গাইড
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3 text-sm">লিঙ্ক</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/" className={colors.link}>হোম</a>
              </li>
              <li>
                <a href="/prayer" className={colors.link}>নামাজ</a>
              </li>
              <li>
                <a href="/financial" className={colors.link}>অর্থনৈতিক</a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-bold mb-3 text-sm">যোগাযোগ</h4>
            <div className="flex space-x-3 mb-3">
              <a href="#" className={`${colors.link} text-xl`}>
                <FaGithub />
              </a>
              <a href="#" className={`${colors.link} text-xl`}>
                <FaLinkedin />
              </a>
              <a href="#" className={`${colors.link} text-xl`}>
                <FaEnvelope />
              </a>
            </div>
            <p className="opacity-80 text-xs">
              © ২০২৬ Life Pilot AI
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-600 text-center opacity-70 text-xs">
          <p>
            তৈরি করা হয়েছে <FaHeart className="inline text-red-600" /> দিয়ে
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
