import React, { useState, useEffect } from 'react';
import { FaMosque, FaClock, FaMapMarkerAlt, FaEdit, FaSave, FaSun, FaMoon, FaUtensils } from 'react-icons/fa';
import api from '../api';

const PrayerTimes = ({ theme }) => {
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: { start: '05:25', end: '06:45' },
    sunrise: '06:45',
    dhuhr: { start: '12:20', end: '16:13' },
    asr: { start: '16:13', end: '17:51' },
    maghrib: { start: '17:51', end: '19:06' },
    isha: { start: '19:06', end: '05:25' },
    sunset: '17:51'
  });
  const [specialTimes, setSpecialTimes] = useState({
    seheri: '05:15',
    iftar: '17:51'
  });
  const [forbiddenTimes, setForbiddenTimes] = useState([
    { name: 'সূর্যোদয়ের সময়', start: '06:35', end: '06:55' },
    { name: 'দুপুরের সূর্য মাথার উপরে', start: '12:10', end: '12:30' },
    { name: 'সূর্যাস্তের সময়', start: '17:41', end: '18:01' }
  ]);
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '', remaining: '', hours: 0, minutes: 0, seconds: 0 });
  const [location, setLocation] = useState({ 
    city: 'ঢাকা', 
    district: 'ঢাকা',
    upazila: '',
    country: 'বাংলাদেশ', 
    lat: 23.8103, 
    lon: 90.4125 
  });
  const [editingLocation, setEditingLocation] = useState(false);
  const [locationForm, setLocationForm] = useState({
    city: 'ঢাকা',
    district: 'ঢাকা',
    upazila: '',
    country: 'বাংলাদেশ'
  });
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadUserLocation();
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchPrayerTimes();
      // Refresh prayer times daily at midnight
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const timeUntilMidnight = tomorrow - now;
      
      const midnightTimer = setTimeout(() => {
        fetchPrayerTimes();
        // Set up daily refresh
        const dailyRefresh = setInterval(fetchPrayerTimes, 24 * 60 * 60 * 1000);
        return () => clearInterval(dailyRefresh);
      }, timeUntilMidnight);

      return () => clearTimeout(midnightTimer);
    }
  }, [location]);

  useEffect(() => {
    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 1000); // Update every second
    return () => clearInterval(interval);
  }, [prayerTimes, currentTime]);

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
        const timings = response.data.timings;
        
        // Set prayer times with adjusted start (+5 min) and end times (-15 min)
        // Isha ends at midnight (12:00 AM)
        setPrayerTimes({
          fajr: { 
            start: addMinutes(timings.Fajr, 5), 
            end: subtractMinutes(timings.Sunrise, 15) 
          },
          sunrise: timings.Sunrise,
          dhuhr: { 
            start: addMinutes(timings.Dhuhr, 5), 
            end: subtractMinutes(timings.Asr, 15) 
          },
          asr: { 
            start: addMinutes(timings.Asr, 5), 
            end: subtractMinutes(timings.Maghrib, 15) 
          },
          maghrib: { 
            start: addMinutes(timings.Maghrib, 5), 
            end: subtractMinutes(timings.Isha, 15) 
          },
          isha: { 
            start: addMinutes(timings.Isha, 5), 
            end: '12:00 AM' 
          },
          sunset: timings.Sunset
        });

        // Calculate Seheri (10 minutes before Fajr) and Iftar (at Maghrib)
        const seheriTime = subtractMinutes(timings.Fajr, 10);
        setSpecialTimes({
          seheri: seheriTime,
          iftar: timings.Maghrib
        });

        // Calculate forbidden times
        const sunriseTime = timings.Sunrise;
        const sunsetTime = timings.Sunset;
        const dhuhrTime = timings.Dhuhr;
        
        setForbiddenTimes([
          { 
            name: 'সূর্যোদয়ের সময়', 
            start: subtractMinutes(sunriseTime, 10), 
            end: addMinutes(sunriseTime, 20) 
          },
          { 
            name: 'দুপুরের সূর্য মাথার উপরে', 
            start: subtractMinutes(dhuhrTime, 10), 
            end: dhuhrTime 
          },
          { 
            name: 'সূর্যাস্তের সময়', 
            start: subtractMinutes(sunsetTime, 10), 
            end: addMinutes(sunsetTime, 10) 
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  const subtractMinutes = (timeStr, minutes) => {
    const [hours, mins] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins - minutes, 0, 0);
    return date.toTimeString().slice(0, 5);
  };

  const addMinutes = (timeStr, minutes) => {
    const [hours, mins] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes, 0, 0);
    return date.toTimeString().slice(0, 5);
  };

  const handleLocationUpdate = async () => {
    if (!locationForm.city.trim()) {
      alert('অনুগ্রহ করে শহরের নাম লিখুন');
      return;
    }

    setLoading(true);
    try {
      // Build search query with available location data
      const searchParts = [
        locationForm.upazila,
        locationForm.district || locationForm.city,
        locationForm.country
      ].filter(Boolean);
      const searchQuery = searchParts.join(', ');

      // Geocoding API call to get coordinates
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
      );
      const geoData = await geoResponse.json();

      if (geoData.length > 0) {
        const newLocation = {
          ...locationForm,
          lat: parseFloat(geoData[0].lat),
          lon: parseFloat(geoData[0].lon)
        };

        setLocation(newLocation);
        await saveUserLocation(newLocation);
        setEditingLocation(false);
        alert('✅ অবস্থান সফলভাবে আপডেট করা হয়েছে!');
      } else {
        alert('❌ অবস্থান খুঁজে পাওয়া যায়নি। অন্য নাম চেষ্টা করুন।');
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
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();

    const prayers = [
      { name: 'ফজর', time: prayerTimes.fajr.start },
      { name: 'জোহর', time: prayerTimes.dhuhr.start },
      { name: 'আসর', time: prayerTimes.asr.start },
      { name: 'মাগরিব', time: prayerTimes.maghrib.start },
      { name: 'এশা', time: prayerTimes.isha.start }
    ];

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      const prayerTotalSeconds = prayerMinutes * 60;
      const currentTotalSeconds = currentMinutes * 60 + currentSeconds;

      if (prayerTotalSeconds > currentTotalSeconds) {
        const remainingSeconds = prayerTotalSeconds - currentTotalSeconds;
        const hoursLeft = Math.floor(remainingSeconds / 3600);
        const minutesLeft = Math.floor((remainingSeconds % 3600) / 60);
        const secondsLeft = remainingSeconds % 60;

        setNextPrayer({
          name: prayer.name,
          time: prayer.time,
          remaining: `${toBanglaNumber(hoursLeft)}ঘ ${toBanglaNumber(minutesLeft)}মি`,
          hours: hoursLeft,
          minutes: minutesLeft,
          seconds: secondsLeft
        });
        return;
      }
    }

    // If no prayer found today, next is Fajr tomorrow
    const fajrTime = prayerTimes.fajr.start;
    const [fajrHours, fajrMinutes] = fajrTime.split(':').map(Number);
    const fajrTotalSeconds = (fajrHours * 60 + fajrMinutes) * 60;
    const currentTotalSeconds = currentMinutes * 60 + currentSeconds;
    const remainingSeconds = (24 * 3600) - currentTotalSeconds + fajrTotalSeconds;
    
    const hoursLeft = Math.floor(remainingSeconds / 3600);
    const minutesLeft = Math.floor((remainingSeconds % 3600) / 60);
    const secondsLeft = remainingSeconds % 60;

    setNextPrayer({
      name: 'ফজর',
      time: fajrTime,
      remaining: `${toBanglaNumber(hoursLeft)}ঘ ${toBanglaNumber(minutesLeft)}মি`,
      hours: hoursLeft,
      minutes: minutesLeft,
      seconds: secondsLeft
    });
  };

  const toBanglaNumber = (num) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => banglaDigits[parseInt(digit)] || digit).join('');
  };

  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${toBanglaNumber(hours12)}:${toBanglaNumber(minutes.toString().padStart(2, '0'))} ${period}`;
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
            <FaSun className="text-yellow-300 text-5xl mb-2 inline-block" />
            <p className="text-4xl font-bold">{toBanglaNumber(currentTime.getHours())}:{toBanglaNumber(currentTime.getMinutes().toString().padStart(2, '0'))}:{toBanglaNumber(currentTime.getSeconds().toString().padStart(2, '0'))}</p>
            <p className="text-sm mt-1 text-green-200">সূর্যোদয় {convertTo12Hour(prayerTimes.sunrise)} | সূর্যাস্ত {convertTo12Hour(prayerTimes.sunset)}</p>
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
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">
                {toBanglaNumber(nextPrayer.hours)}:{toBanglaNumber(nextPrayer.minutes.toString().padStart(2, '0'))}:{toBanglaNumber(nextPrayer.seconds.toString().padStart(2, '0'))}
              </span>
              <span className="text-xs text-gray-600 mt-1">ঘ:মি:সে</span>
            </div>
          </div>
        </div>

        {/* Prayer Times List */}
        <div className="flex-1 space-y-2">
          {/* Fajr */}
          <div className={`flex justify-between items-center p-4 rounded-xl transition-all border-2 ${
            nextPrayer.name === 'ফজর'
              ? 'bg-red-50 border-red-500 shadow-md'
              : 'bg-white border-gray-200 hover:border-green-300'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-800">ফজর</span>
              {nextPrayer.name === 'ফজর' && (
                <button 
                  className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full cursor-pointer hover:bg-red-600 transition"
                  title="পরবর্তী নামাজ"
                >
                  <span className="text-white text-xs">ⓘ</span>
                </button>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-800">{convertTo12Hour(prayerTimes.fajr.start)}</span>
              <p className="text-xs text-gray-500 mt-1">(শেষ {convertTo12Hour(prayerTimes.fajr.end)})</p>
            </div>
          </div>

          {/* Dhuhr/Johor */}
          <div className={`flex justify-between items-center p-4 rounded-xl transition-all border-2 ${
            nextPrayer.name === 'জোহর'
              ? 'bg-red-50 border-red-500 shadow-md'
              : 'bg-white border-gray-200 hover:border-green-300'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-800">জোহর</span>
              {nextPrayer.name === 'জোহর' && (
                <button 
                  className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full cursor-pointer hover:bg-red-600 transition"
                  title="পরবর্তী নামাজ"
                >
                  <span className="text-white text-xs">ⓘ</span>
                </button>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-800">{convertTo12Hour(prayerTimes.dhuhr.start)}</span>
              <p className="text-xs text-gray-500 mt-1">(শেষ {convertTo12Hour(prayerTimes.dhuhr.end)})</p>
            </div>
          </div>

          {/* Asr */}
          <div className={`flex justify-between items-center p-4 rounded-xl transition-all border-2 relative group ${
            nextPrayer.name === 'আসর'
              ? 'bg-red-50 border-red-500 shadow-md'
              : 'bg-white border-gray-200 hover:border-green-300'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-800">আসর</span>
              <div className="relative">
                <button 
                  className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition"
                >
                  <span className="text-white text-xs">ⓘ</span>
                </button>
                <div className="absolute left-8 top-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  মাকরূহ ওয়াক্ত: সূর্যাস্তের আগে
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-800">{convertTo12Hour(prayerTimes.asr.start)}</span>
              <p className="text-xs text-gray-500 mt-1">(শেষ {convertTo12Hour(prayerTimes.asr.end)})</p>
            </div>
          </div>

          {/* Maghrib */}
          <div className={`flex justify-between items-center p-4 rounded-xl transition-all border-2 relative group ${
            nextPrayer.name === 'মাগরিব'
              ? 'bg-green-50 border-green-500 shadow-md'
              : 'bg-white border-gray-200 hover:border-green-300'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-800">মাগরিব</span>
              <div className="relative">
                <button 
                  className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition"
                >
                  <span className="text-white text-xs">ⓘ</span>
                </button>
                <div className="absolute left-8 top-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  দ্রুত পড়ুন: ওয়াক্ত অল্প সময়ের
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-800">{convertTo12Hour(prayerTimes.maghrib.start)}</span>
              <p className="text-xs text-gray-500 mt-1">(শেষ {convertTo12Hour(prayerTimes.maghrib.end)})</p>
            </div>
          </div>

          {/* Isha */}
          <div className={`flex justify-between items-center p-4 rounded-xl transition-all border-2 ${
            nextPrayer.name === 'এশা'
              ? 'bg-red-50 border-red-500 shadow-md'
              : 'bg-white border-gray-200 hover:border-green-300'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-800">এশা</span>
              {nextPrayer.name === 'এশা' && (
                <button 
                  className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full cursor-pointer hover:bg-red-600 transition"
                  title="পরবর্তী নামাজ"
                >
                  <span className="text-white text-xs">ⓘ</span>
                </button>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-800">{convertTo12Hour(prayerTimes.isha.start)}</span>
              <p className="text-xs text-gray-500 mt-1">মধ্যরাত {convertTo12Hour(prayerTimes.isha.end)}</p>
            </div>
          </div>
          
          {/* Seheri & Iftar Times */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-purple-50 border-2 border-purple-300 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <FaMoon className="text-purple-600" />
                <span className="font-bold text-purple-900">সেহরি</span>
              </div>
              <span className="text-xl font-bold text-purple-800">{convertTo12Hour(specialTimes.seheri)}</span>
            </div>
            <div className="bg-orange-50 border-2 border-orange-300 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <FaUtensils className="text-orange-600" />
                <span className="font-bold text-orange-900">ইফতার</span>
              </div>
              <span className="text-xl font-bold text-orange-800">{convertTo12Hour(specialTimes.iftar)}</span>
            </div>
          </div>

          {/* Forbidden Times */}
          <div className="mt-4 bg-yellow-50 border-2 border-yellow-400 p-4 rounded-xl">
            <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              নামাজের নিষিদ্ধ সময়
            </h4>
            <div className="space-y-1">
              {forbiddenTimes.map((time, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-yellow-800">{time.name}</span>
                  <span className="font-semibold text-yellow-900">{convertTo12Hour(time.start)} - {convertTo12Hour(time.end)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="p-6 pt-0">
        <div className="bg-white border-2 border-gray-300 p-4 rounded-xl">
          {editingLocation ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-600" />
                <span className="font-semibold text-gray-800">অবস্থান পরিবর্তন করুন:</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={locationForm.city}
                  onChange={(e) => setLocationForm({...locationForm, city: e.target.value})}
                  placeholder="শহর (যেমন: ঢাকা)"
                  className="p-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none text-gray-800"
                />
                <input
                  type="text"
                  value={locationForm.district}
                  onChange={(e) => setLocationForm({...locationForm, district: e.target.value})}
                  placeholder="জেলা (যেমন: ঢাকা)"
                  className="p-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none text-gray-800"
                />
                <input
                  type="text"
                  value={locationForm.upazila}
                  onChange={(e) => setLocationForm({...locationForm, upazila: e.target.value})}
                  placeholder="উপজেলা (ঐচ্ছিক)"
                  className="p-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none text-gray-800"
                />
                <input
                  type="text"
                  value={locationForm.country}
                  onChange={(e) => setLocationForm({...locationForm, country: e.target.value})}
                  placeholder="দেশ (যেমন: বাংলাদেশ)"
                  className="p-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none text-gray-800"
                />
              </div>
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
              <p className="text-sm flex items-center gap-2 flex-wrap">
                <FaMapMarkerAlt className="text-red-600" />
                <span className="font-semibold text-gray-800">অবস্থান:</span>
                <span className="text-gray-700">
                  {[location.upazila, location.district || location.city, location.country].filter(Boolean).join(', ')}
                </span>
              </p>
              <button
                onClick={() => {
                  setEditingLocation(true);
                  setLocationForm({
                    city: location.city,
                    district: location.district || location.city,
                    upazila: location.upazila || '',
                    country: location.country
                  });
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
    </div>
  );
};

export default PrayerTimes;
