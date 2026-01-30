import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { MapPin, Edit2, Save, Cloud } from 'lucide-react';
import api from '../api';

const WeatherPage = ({ theme }) => {
  const [location, setLocation] = useState({ city: 'ঢাকা', country: 'বাংলাদেশ' });
  const [editingLocation, setEditingLocation] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [weatherUrl, setWeatherUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserLocation();
  }, []);

  useEffect(() => {
    if (location.city) {
      updateWeatherUrl();
    }
  }, [location]);

  const loadUserLocation = async () => {
    try {
      const response = await api.get('/api/user/location');
      if (response.data && response.data.city) {
        setLocation(response.data);
      }
    } catch (error) {
      console.log('Using default location');
    }
  };

  const saveUserLocation = async (locationData) => {
    try {
      await api.post('/api/user/location', locationData);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const updateWeatherUrl = () => {
    // Using OpenWeatherMap or similar weather widget
    const cityName = encodeURIComponent(location.city);
    setWeatherUrl(`https://www.meteoblue.com/en/weather/widget/three/${cityName}`);
  };

  const handleLocationUpdate = async () => {
    if (!newCity.trim()) {
      alert('অনুগ্রহ করে শহরের নাম লিখুন');
      return;
    }

    setLoading(true);
    try {
      const newLocation = {
        ...location,
        city: newCity
      };

      setLocation(newLocation);
      await saveUserLocation(newLocation);
      setEditingLocation(false);
      setNewCity('');
      alert('✅ অবস্থান সফলভাবে আপডেট করা হয়েছে!');
    } catch (error) {
      console.error('Error updating location:', error);
      alert('❌ অবস্থান আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const getThemeColors = () => {
    const themes = {
      light: {
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
        text: 'text-black',
        cardBg: 'bg-white',
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
    };
    return themes[theme] || themes.light;
  };

  const colors = getThemeColors();

  return (
    <div className={`min-h-screen flex flex-col ${colors.bg}`}>
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className={`text-4xl font-bold ${colors.text} mb-2 text-center flex items-center justify-center gap-3`}>
            <Cloud className="w-10 h-10 text-blue-500" />
            আবহাওয়া <span className="text-red-600">পূর্বাভাস</span>
          </h1>

          {/* Location Editor */}
          <div className={`${colors.cardBg} p-4 rounded-lg border-2 ${colors.border} mb-6 max-w-2xl mx-auto`}>
            {editingLocation ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="text-red-600" size={20} />
                  <span className={`font-semibold ${colors.text}`}>অবস্থান পরিবর্তন করুন:</span>
                </div>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="শহরের নাম লিখুন (যেমন: ঢাকা, চট্টগ্রাম, Dhaka)"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-800"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleLocationUpdate}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} />
                    সংরক্ষণ করুন
                  </button>
                  <button
                    onClick={() => {
                      setEditingLocation(false);
                      setNewCity('');
                    }}
                    className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
                  >
                    বাতিল
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className={`flex items-center gap-2 ${colors.text}`}>
                  <MapPin className="text-red-600" size={20} />
                  <span className="font-semibold">বর্তমান অবস্থান:</span>
                  <span className="text-blue-600 font-bold">{location.city}, {location.country}</span>
                </p>
                <button
                  onClick={() => {
                    setEditingLocation(true);
                    setNewCity(location.city);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <Edit2 size={16} />
                  <span className="text-sm font-semibold">পরিবর্তন করুন</span>
                </button>
              </div>
            )}
          </div>

          {/* Weather Widget */}
          <div className={`${colors.cardBg} p-4 rounded-lg border-2 ${colors.border} shadow-2xl`}>
            <iframe
              src={`https://www.meteoblue.com/en/weather/widget/three/${encodeURIComponent(location.city)}?geoloc=fixed&nocurrent=0&noforecast=0&days=7&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=bright`}
              frameBorder="0"
              scrolling="no"
              allowTransparency="true"
              sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
              className="w-full h-[600px] rounded-lg"
              title="আবহাওয়া পূর্বাভাস"
            ></iframe>
            <div className="text-center mt-2">
              <a 
                href={`https://www.meteoblue.com/en/weather/week/${encodeURIComponent(location.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
              >
                বিস্তারিত পূর্বাভাস দেখুন →
              </a>
            </div>
          </div>

          {/* Alternative: Simple Weather Display */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${colors.text} opacity-70`}>
              💡 আবহাওয়া তথ্য meteoblue.com থেকে প্রদান করা হয়েছে
            </p>
          </div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
};

export default WeatherPage;
