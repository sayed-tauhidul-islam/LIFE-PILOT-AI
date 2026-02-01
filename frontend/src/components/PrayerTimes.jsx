import React, { useState, useEffect } from 'react';
import { FaMosque, FaClock, FaMapMarkerAlt, FaEdit, FaSave, FaSun, FaMoon, FaUtensils } from 'react-icons/fa';

const PrayerTimes = () => {
  // State for prayer times
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: '05:25 AM',
    Sunrise: '06:45 AM',
    Dhuhr: '12:20 PM',
    Asr: '04:13 PM',
    Maghrib: '05:51 PM',
    Isha: '07:06 PM'
  });

  // State for special times
  const [seheriTime, setSeheriTime] = useState('05:15 AM');
  const [iftarTime, setIftarTime] = useState('05:51 PM');

  // State for location
  const [location, setLocation] = useState({
    city: 'ঢাকা',
    country: 'বাংলাদেশ',
    lat: 23.8103,
    lon: 90.4125
  });

  // State for editing location
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState('ঢাকা');

  // State for current time and next prayer
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState({
    name: 'ফজর',
    time: '05:25 AM',
    remaining: '0h 0m 0s'
  });
  const [currentWaqt, setCurrentWaqt] = useState({
    name: 'ফজর',
    endTime: '06:45 AM',
    remaining: '0h 0m 0s'
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate next prayer and current waqt
  useEffect(() => {
    calculateNextPrayer();
    calculateCurrentWaqt();
  }, [currentTime, prayerTimes]);

  // Fetch prayer times from API
  useEffect(() => {
    fetchPrayerTimes();
  }, [location]);

  const fetchPrayerTimes = async () => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${location.lat}&longitude=${location.lon}&method=2`
      );
      const data = await response.json();
      
      if (data.code === 200 && data.data && data.data.timings) {
        const timings = data.data.timings;
        
        setPrayerTimes({
          Fajr: convertTo12Hour(timings.Fajr),
          Sunrise: convertTo12Hour(timings.Sunrise),
          Dhuhr: convertTo12Hour(timings.Dhuhr),
          Asr: convertTo12Hour(timings.Asr),
          Maghrib: convertTo12Hour(timings.Maghrib),
          Isha: convertTo12Hour(timings.Isha)
        });

        // Set seheri and iftar times
        setSeheriTime(subtractMinutes(convertTo12Hour(timings.Fajr), 10));
        setIftarTime(convertTo12Hour(timings.Maghrib));
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  const convertTo12Hour = (time24) => {
    if (!time24) return '00:00 AM';
    
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const convertTo24Hour = (time12) => {
    if (!time12) return '00:00';
    
    const [time, period] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  const subtractMinutes = (time12, mins) => {
    const time24 = convertTo24Hour(time12);
    const [hours, minutes] = time24.split(':');
    let totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    totalMinutes -= mins;
    
    if (totalMinutes < 0) totalMinutes += 1440; // Add 24 hours
    
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    const ampm = newHours >= 12 ? 'PM' : 'AM';
    const hour12 = newHours % 12 || 12;
    
    return `${hour12.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const calculateNextPrayer = () => {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    const prayersList = [
      { name: 'ফজর', nameEn: 'Fajr', time: prayerTimes.Fajr },
      { name: 'যোহর', nameEn: 'Dhuhr', time: prayerTimes.Dhuhr },
      { name: 'আসর', nameEn: 'Asr', time: prayerTimes.Asr },
      { name: 'মাগরিব', nameEn: 'Maghrib', time: prayerTimes.Maghrib },
      { name: 'এশা', nameEn: 'Isha', time: prayerTimes.Isha }
    ];

    let nextPrayerInfo = null;

    for (const prayer of prayersList) {
      const prayerTime24 = convertTo24Hour(prayer.time);
      const [hours, minutes] = prayerTime24.split(':');
      const prayerTimeInMinutes = parseInt(hours) * 60 + parseInt(minutes);

      if (prayerTimeInMinutes > currentTimeInMinutes) {
        nextPrayerInfo = prayer;
        break;
      }
    }

    // If no prayer found today, next is Fajr tomorrow
    if (!nextPrayerInfo) {
      nextPrayerInfo = prayersList[0];
    }

    // Calculate remaining time
    const prayerTime24 = convertTo24Hour(nextPrayerInfo.time);
    const [pHours, pMinutes] = prayerTime24.split(':');
    let prayerTimeInMinutes = parseInt(pHours) * 60 + parseInt(pMinutes);

    let diffMinutes = prayerTimeInMinutes - currentTimeInMinutes;
    if (diffMinutes < 0) {
      diffMinutes += 1440; // Add 24 hours
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const seconds = 60 - now.getSeconds();

    setNextPrayer({
      name: nextPrayerInfo.name,
      time: nextPrayerInfo.time,
      remaining: `${hours}h ${minutes}m ${seconds}s`
    });
  };

  const calculateCurrentWaqt = () => {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    // Define waqt periods with start and end times
    const waqtPeriods = [
      { name: 'ফজর', start: prayerTimes.Fajr, end: prayerTimes.Sunrise },
      { name: 'চাশত', start: prayerTimes.Sunrise, end: prayerTimes.Dhuhr },
      { name: 'যোহর', start: prayerTimes.Dhuhr, end: prayerTimes.Asr },
      { name: 'আসর', start: prayerTimes.Asr, end: prayerTimes.Maghrib },
      { name: 'মাগরিব', start: prayerTimes.Maghrib, end: prayerTimes.Isha },
      { name: 'এশা', start: prayerTimes.Isha, end: prayerTimes.Fajr } // Goes to next Fajr
    ];

    let currentWaqtInfo = null;

    for (const waqt of waqtPeriods) {
      const startTime24 = convertTo24Hour(waqt.start);
      const endTime24 = convertTo24Hour(waqt.end);
      
      const [startHours, startMinutes] = startTime24.split(':');
      const [endHours, endMinutes] = endTime24.split(':');
      
      const startTimeInMinutes = parseInt(startHours) * 60 + parseInt(startMinutes);
      let endTimeInMinutes = parseInt(endHours) * 60 + parseInt(endMinutes);
      
      // Handle midnight crossing for Isha to Fajr
      if (endTimeInMinutes < startTimeInMinutes) {
        if (currentTimeInMinutes >= startTimeInMinutes || currentTimeInMinutes < endTimeInMinutes) {
          currentWaqtInfo = waqt;
          break;
        }
      } else {
        if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
          currentWaqtInfo = waqt;
          break;
        }
      }
    }

    if (currentWaqtInfo) {
      // Calculate remaining time until waqt ends
      const endTime24 = convertTo24Hour(currentWaqtInfo.end);
      const [endHours, endMinutes] = endTime24.split(':');
      let endTimeInMinutes = parseInt(endHours) * 60 + parseInt(endMinutes);

      let diffMinutes = endTimeInMinutes - currentTimeInMinutes;
      if (diffMinutes < 0) {
        diffMinutes += 1440; // Add 24 hours
      }

      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      const seconds = 60 - now.getSeconds();

      setCurrentWaqt({
        name: currentWaqtInfo.name,
        endTime: currentWaqtInfo.end,
        remaining: `${hours}h ${minutes}m ${seconds}s`
      });
    }
  };

  const handleLocationSave = async () => {
    try {
      // Use geocoding API to get coordinates for any Bangladesh city
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationInput)},Bangladesh&format=json&limit=1`
      );
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData && geocodeData.length > 0) {
        const newLocation = {
          city: locationInput,
          country: 'বাংলাদেশ',
          lat: parseFloat(geocodeData[0].lat),
          lon: parseFloat(geocodeData[0].lon)
        };
        setLocation(newLocation);
        setIsEditingLocation(false);
      } else {
        alert('শহর খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক নাম লিখুন।');
      }
    } catch (error) {
      console.error('Error finding location:', error);
      alert('শহর খুঁজতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  // Prayer names in Bangla
  const prayerNames = {
    Fajr: 'ফজর',
    Sunrise: 'সূর্যোদয়',
    Dhuhr: 'যোহর',
    Asr: 'আসর',
    Maghrib: 'মাগরিব',
    Isha: 'এশা'
  };

  // Prayer icons
  const prayerIcons = {
    Fajr: '🌅',
    Sunrise: '☀️',
    Dhuhr: '🌞',
    Asr: '🌤️',
    Maghrib: '🌆',
    Isha: '🌙'
  };

  // Current Bangla date
  const formatBanglaDate = () => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return currentTime.toLocaleDateString('bn-BD', options);
  };

  // Current time in 12-hour format
  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card with Current Time */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaMosque className="text-4xl" />
              <div>
                <h2 className="text-2xl font-bold">১০ শাবান</h2>
                <p className="text-sm opacity-90">১৬ মাঘ ১৪৩২</p>
              </div>
            </div>
            <div className="text-right">
              <FaSun className="text-5xl animate-pulse mb-2" />
              <div className="text-sm font-semibold">
                <div>🌅 সূর্যোদয়: {prayerTimes.Sunrise}</div>
                <div>🌆 সূর্যাস্ত: {prayerTimes.Maghrib}</div>
              </div>
            </div>
          </div>

          <div className="text-center bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90 mb-1">{formatBanglaDate()}</p>
            <div className="text-5xl font-bold tracking-wider">{formatCurrentTime()}</div>
          </div>
        </div>
      </div>

      {/* Current Waqt and Next Prayer - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Waqt Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <h3 className="text-gray-600 text-lg mb-2">বর্তমান ওয়াক্ত</h3>
            <div className="flex items-center justify-center gap-4 mb-4">
              <FaClock className="text-4xl text-blue-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{currentWaqt.name}</h2>
                <p className="text-blue-600 font-semibold">শেষ {currentWaqt.endTime}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">ওয়াক্ত শেষ হওয়ার বাকি</p>
              <div className="flex items-center justify-center gap-2">
                <FaClock className="text-blue-600" />
                <span className="text-2xl font-bold text-blue-700">{currentWaqt.remaining}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Prayer Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <h3 className="text-gray-600 text-lg mb-2">পরবর্তী নামাজ</h3>
            <div className="flex items-center justify-center gap-4 mb-4">
              <FaMosque className="text-4xl text-green-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{nextPrayer.name}</h2>
                <p className="text-green-600 font-semibold">{nextPrayer.time}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">ওয়াক্ত শুরু হওয়ার বাকি</p>
              <div className="flex items-center justify-center gap-2">
                <FaClock className="text-green-600" />
                <span className="text-2xl font-bold text-green-700">{nextPrayer.remaining}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <FaMapMarkerAlt className="text-red-500 text-xl" />
            {isEditingLocation ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="শহরের নাম লিখুন (যেমন: ঢাকা, চট্টগ্রাম, সিলেট)"
                  className="border-2 border-green-500 rounded-lg px-4 py-2 text-base focus:border-green-600 focus:outline-none flex-1 font-semibold"
                />
                <button
                  onClick={handleLocationSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaSave /> সংরক্ষণ
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-gray-800">{location.city}</h3>
                <p className="text-sm text-gray-600">{location.country}</p>
              </div>
            )}
          </div>
          {!isEditingLocation && (
            <button
              onClick={() => {
                setIsEditingLocation(true);
                setLocationInput(location.city);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <FaEdit className="text-lg" /> পরিবর্তন করুন
            </button>
          )}
        </div>
      </div>

      {/* Prayer Times List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4">
          <h3 className="text-white text-xl font-bold text-center">
            আজকের নামাজের সময়সূচী
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {Object.keys(prayerTimes).map((prayer, index) => (
            <div
              key={prayer}
              className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                nextPrayer.time === prayerTimes[prayer] ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{prayerIcons[prayer]}</span>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">
                    {prayerNames[prayer]}
                  </h4>
                  {prayer === 'Sunrise' && (
                    <p className="text-xs text-gray-500">(নামাজ নেই, শুধু সময়)</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-700">
                  {prayerTimes[prayer]}
                </p>
                {nextPrayer.time === prayerTimes[prayer] && (
                  <span className="text-xs text-green-600 font-semibold">
                    • পরবর্তী
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Times (Seheri & Iftar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <FaMoon className="text-3xl" />
            <h4 className="text-xl font-bold">সেহরির শেষ সময়</h4>
          </div>
          <p className="text-3xl font-bold">{seheriTime}</p>
          <p className="text-sm opacity-90 mt-1">ফজরের ১০ মিনিট আগে</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <FaUtensils className="text-3xl" />
            <h4 className="text-xl font-bold">ইফতারের সময়</h4>
          </div>
          <p className="text-3xl font-bold">{iftarTime}</p>
          <p className="text-sm opacity-90 mt-1">মাগরিবের শুরুতে</p>
        </div>
      </div>

      {/* Forbidden Times */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-red-700">
            যে সময় নামাজ পড়া নিষেধ
          </h3>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <p className="font-semibold text-gray-800">১. সূর্যোদয়ের সময়</p>
            <p className="text-sm text-gray-600">সূর্য উদিত হওয়া থেকে ২০ মিনিট পর্যন্ত</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <p className="font-semibold text-gray-800">২. দুপুরে সূর্য মাথার উপরে</p>
            <p className="text-sm text-gray-600">যোহরের ওয়াক্ত শুরুর ঠিক আগে</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <p className="font-semibold text-gray-800">৩. সূর্যাস্তের সময়</p>
            <p className="text-sm text-gray-600">সূর্য ডুবতে শুরু করা থেকে সম্পূর্ণ ডুবা পর্যন্ত</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
