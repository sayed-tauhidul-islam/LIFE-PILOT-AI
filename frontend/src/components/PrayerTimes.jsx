import React, { useState, useEffect } from 'react';
import { FaMosque, FaClock, FaMapMarkerAlt, FaEdit, FaSave, FaSun } from 'react-icons/fa';
import api from '../api';

const PrayerTimes = ({ theme }) => {
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: '05:25',
    dhuhr: '12:20',
    asr: '03:13',
    maghrib: '05:51',
    isha: '07:06'
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
    <div id="prayer" className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-2xl overflow-hidden border-2 border-green-300">
      {/* Header with Date and Time */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-2">১০ শাবান</h2>
            <p className="text-green-100">শুক্রবার - ৩০ জানুয়ারি</p>
            <p className="text-green-200 text-sm mt-1">১৬ মাঘ</p>
          </div>
          <div className="text-right">
            <FaSun className="text-yellow-300 text-5xl mb-2" />
            <p className="text-4xl font-bold">{new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            <p className="text-sm mt-1 text-green-200">সূর্যোদয় | সূর্যাস্ত</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-sm text-gray-700 mt-2">লোড হচ্ছে...</p>
        </div>
      )}

      <div className="flex gap-6 p-6">
        {/* Circular Timer */}
        <div className="flex-shrink-0">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-blue-900 mb-1">সালাতুদ দূহা</h3>
            <p className="text-sm text-gray-600">ওয়াক্ত শেষ হতে বাকি</p>
          </div>
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#10b981"
                strokeWidth="12"
                fill="none"
                strokeDasharray="553"
                strokeDashoffset="138"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">{nextPrayer.remaining || '০২:০৮:৪৯'}</span>
            </div>
          </div>
        </div>

        {/* Prayer Times List */}
        <div className="flex-1 space-y-2">
          {Object.entries(prayerTimes).map(([prayer, time]) => {
            const isNext = nextPrayer.name === prayerNames[prayer];
            return (
              <div
                key={prayer}
                className={`flex justify-between items-center p-4 rounded-xl transition-all border-2 ${
                  isNext
                    ? 'bg-red-50 border-red-500 shadow-md'
                    : 'bg-white border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-800">{prayerNames[prayer]}</span>
                  {isNext && (
                    <span className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                      <span className="text-white text-xs">ⓘ</span>
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-800">{time}</span>
                  {isNext && <p className="text-xs text-gray-500 mt-1">মধ্যরাত ১১:৩৭</p>}
                </div>
              </div>
            );
          })}
        </div>
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
