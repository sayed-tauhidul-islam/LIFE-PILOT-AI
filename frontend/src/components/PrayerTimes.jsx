import React, { useState, useEffect } from 'react';
import { FaMosque, FaClock, FaMapMarkerAlt, FaEdit, FaSave } from 'react-icons/fa';
import api from '../api';

const PrayerTimes = ({ theme }) => {
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: '05:45',
    dhuhr: '12:30',
    asr: '15:45',
    maghrib: '18:15',
    isha: '19:45'
  });
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '', remaining: '' });
  const [location, setLocation] = useState({ city: 'ঢাকা', country: 'বাংলাদেশ', lat: 23.8103, lon: 90.4125 });
  const [editingLocation, setEditingLocation] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserLocation();
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchPrayerTimes();
    }
  }, [location]);

  useEffect(() => {
    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

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

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/prayer-times?lat=${location.lat}&lon=${location.lon}&city=${location.city}`);
      if (response.data && response.data.success) {
        setPrayerTimes(response.data.timings);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = async () => {
    if (!newCity.trim()) {
      alert('অনুগ্রহ করে শহরের নাম লিখুন');
      return;
    }

    setLoading(true);
    try {
      // Geocoding API call to get coordinates
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(newCity)}&format=json&limit=1`
      );
      const geoData = await geoResponse.json();

      if (geoData.length > 0) {
        const newLocation = {
          city: newCity,
          country: geoData[0].display_name.split(',').pop().trim(),
          lat: parseFloat(geoData[0].lat),
          lon: parseFloat(geoData[0].lon)
        };

        setLocation(newLocation);
        await saveUserLocation(newLocation);
        setEditingLocation(false);
        setNewCity('');
        alert('✅ অবস্থান সফলভাবে আপডেট করা হয়েছে!');
      } else {
        alert('❌ শহর খুঁজে পাওয়া যায়নি। অন্য নাম চেষ্টা করুন।');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      alert('❌ অবস্থান আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'ফজর', time: prayerTimes.fajr, english: 'Fajr' },
      { name: 'জোহর', time: prayerTimes.dhuhr, english: 'Dhuhr' },
      { name: 'আসর', time: prayerTimes.asr, english: 'Asr' },
      { name: 'মাগরিব', time: prayerTimes.maghrib, english: 'Maghrib' },
      { name: 'এশা', time: prayerTimes.isha, english: 'Isha' }
    ];

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;

      if (prayerMinutes > currentTime) {
        const remaining = prayerMinutes - currentTime;
        const hoursLeft = Math.floor(remaining / 60);
        const minutesLeft = remaining % 60;

        setNextPrayer({
          name: prayer.name,
          time: prayer.time,
          remaining: `${hoursLeft}ঘ ${minutesLeft}মি`
        });
        return;
      }
    }

    setNextPrayer({
      name: 'ফজর',
      time: prayerTimes.fajr,
      remaining: 'আগামীকাল'
    });
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return { bg: 'bg-gray-800', text: 'text-white', border: 'border-gray-700' };
      case 'blue':
        return { bg: 'bg-blue-800', text: 'text-white', border: 'border-blue-700' };
      default:
        return { bg: 'bg-white', text: 'text-black', border: 'border-black' };
    }
  };

  const colors = getThemeColors();

  const prayerNames = {
    fajr: 'ফজর',
    dhuhr: 'জোহর',
    asr: 'আসর',
    maghrib: 'মাগরিব',
    isha: 'এশা'
  };

  return (
    <div id="prayer" className={`${colors.bg} border-2 ${colors.border} p-6 rounded-lg shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold ${colors.text} flex items-center`}>
          <FaMosque className="mr-2 text-red-600" size={24} />
          নামাজের সময়সূচী
        </h3>
        <div className="text-right">
          <p className="text-sm text-red-600 font-semibold">পরবর্তী: {nextPrayer.name}</p>
          <p className={`text-xs ${colors.text}`}>{nextPrayer.remaining}</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className={`text-sm ${colors.text} mt-2`}>লোড হচ্ছে...</p>
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(prayerTimes).map(([prayer, time]) => {
          const isNext = nextPrayer.name === prayerNames[prayer];
          return (
            <div
              key={prayer}
              className={`flex justify-between items-center p-3 rounded transition-all ${
                isNext
                  ? 'bg-red-600 text-white font-bold shadow-lg scale-105'
                  : `${colors.bg} ${colors.text} hover:bg-opacity-80`
              }`}
            >
              <div className="flex items-center">
                <FaClock className="mr-2" size={16} />
                <span className="font-semibold">{prayerNames[prayer]}</span>
              </div>
              <span className="font-mono text-lg">{time}</span>
            </div>
          );
        })}
      </div>

      {/* Location Section */}
      <div className={`mt-4 p-3 ${colors.bg} ${colors.text} rounded border ${colors.border}`}>
        {editingLocation ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-600" />
              <span className="font-semibold">অবস্থান পরিবর্তন করুন:</span>
            </div>
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="শহরের নাম লিখুন (যেমন: ঢাকা, চট্টগ্রাম)"
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none text-gray-800"
            />
            <div className="flex gap-2">
              <button
                onClick={handleLocationUpdate}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaSave size={14} />
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
            <p className="text-sm flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-600" />
              <span className="font-semibold">অবস্থান:</span>
              <span>{location.city}, {location.country}</span>
            </p>
            <button
              onClick={() => {
                setEditingLocation(true);
                setNewCity(location.city);
              }}
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <FaEdit size={14} />
              <span className="text-sm">পরিবর্তন</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerTimes;
