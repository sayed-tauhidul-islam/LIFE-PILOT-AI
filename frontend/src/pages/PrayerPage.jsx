import React from 'react';
import PrayerTimes from '../components/PrayerTimes';
import IslamicCalendar from '../components/IslamicCalendar';
import Footer from '../components/Footer';

const PrayerPage = ({ theme }) => {
  const getThemeColors = () => {
    const themes = {
      light: {
        bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
        text: 'text-black'
      },
      dark: {
        bg: 'bg-gray-900',
        text: 'text-white'
      },
      blue: {
        bg: 'bg-blue-900',
        text: 'text-blue-50'
      }
    };
    return themes[theme] || themes.light;
  };

  const colors = getThemeColors();

  return (
    <div className={`min-h-screen flex flex-col ${colors.bg}`}>
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className={`text-4xl font-bold ${colors.text} mb-8 text-center`}>
            নামাজের <span className="text-red-600">সময়সূচী</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prayer Times - Takes 2 columns */}
            <div className="lg:col-span-2">
              <PrayerTimes theme={theme} />
            </div>

            {/* Islamic Calendar - Takes 1 column */}
            <div className="lg:col-span-1">
              <IslamicCalendar />
            </div>
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
};

export default PrayerPage;
