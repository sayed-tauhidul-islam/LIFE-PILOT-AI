import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Book, Briefcase, Coffee, Home, Save, X, AlertCircle, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import api from '../api';

const RoutineSetup = ({ onSave, onClose }) => {
  const [userType, setUserType] = useState(''); // 'student', 'professional', 'business', 'other'
  const [routine, setRoutine] = useState({
    name: '',
    type: '',
    schedule: []
  });

  const [newActivity, setNewActivity] = useState({
    title: '',
    startTime: '',
    endTime: '',
    days: [],
    category: 'study',
    priority: 'medium'
  });

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [analyzingRoutine, setAnalyzingRoutine] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Load user profile, health data, and finance data
      const profileResponse = await api.get(`/api/user/profile?user_id=${user.id}`);
      const healthResponse = await api.get(`/api/health/profile?userId=${user.id}`);
      const financeResponse = await api.get(`/api/finance/summary?user_id=${user.id}`);

      if (profileResponse.data && healthResponse.data && financeResponse.data) {
        // Generate AI-powered routine based on user data
        generateAIRoutine(profileResponse.data.data, healthResponse.data.data, financeResponse.data);
      }
    } catch (error) {
      console.log('No user data found, will create new routine');
    }
  };

  const generateAIRoutine = (profile, health, finance) => {
    const autoRoutine = [];
    const currentDate = new Date();
    
    // Determine user type
    let detectedUserType = 'other';
    if (profile.occupation && profile.occupation.toLowerCase().includes('student')) {
      detectedUserType = 'student';
    } else if (profile.workHours && profile.workDays) {
      detectedUserType = 'professional';
    }
    setUserType(detectedUserType);

    // Add morning routine based on health
    if (health && health.sleep < 7) {
      autoRoutine.push({
        id: Date.now() + 1,
        title: 'ফজরের নামাজ এবং সকালের ব্যায়াম',
        startTime: '05:30',
        endTime: '06:30',
        days: ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'],
        category: 'exercise',
        priority: 'high'
      });
    }

    // Add work/study time based on occupation
    if (profile.workHours && profile.workDays) {
      const workHours = parseInt(profile.workHours) || 8;
      const startHour = detectedUserType === 'student' ? '09:00' : '10:00';
      const endTime = new Date();
      endTime.setHours(parseInt(startHour.split(':')[0]) + workHours);
      
      autoRoutine.push({
        id: Date.now() + 2,
        title: detectedUserType === 'student' ? 'পড়াশোনা/ক্লাস' : 'অফিসের কাজ',
        startTime: startHour,
        endTime: `${String(endTime.getHours()).padStart(2, '0')}:00`,
        days: ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার'],
        category: detectedUserType === 'student' ? 'study' : 'work',
        priority: 'high'
      });
    }

    // Add financial planning time if expenses are high
    if (finance && finance.monthlyExpenses > finance.monthlyIncome * 0.8) {
      autoRoutine.push({
        id: Date.now() + 3,
        title: 'আর্থিক পরিকল্পনা ও বাজেট রিভিউ',
        startTime: '20:00',
        endTime: '20:30',
        days: ['শুক্রবার', 'রবিবার'],
        category: 'other',
        priority: 'high'
      });
      
      // Add AI suggestion about finance
      setAiSuggestions(prev => [...prev, {
        type: 'warning',
        icon: '💰',
        title: 'আর্থিক সতর্কতা',
        message: `আপনার মাসিক খরচ ৳${finance.monthlyExpenses} যা আয়ের ${((finance.monthlyExpenses / finance.monthlyIncome) * 100).toFixed(0)}%। খরচ কমানোর জন্য সাপ্তাহিক বাজেট রিভিউ করুন।`,
        action: 'বাজেট পরিকল্পনা'
      }]);
    }

    // Add health checkup time if BMI is concerning
    if (health && health.weight && health.height) {
      const bmi = health.weight / ((health.height / 100) ** 2);
      if (bmi < 18.5 || bmi > 25) {
        autoRoutine.push({
          id: Date.now() + 4,
          title: 'স্বাস্থ্য পর্যবেক্ষণ ও ব্যায়াম',
          startTime: '18:00',
          endTime: '19:00',
          days: ['রবিবার', 'মঙ্গলবার', 'বৃহস্পতিবার'],
          category: 'exercise',
          priority: 'high'
        });

        setAiSuggestions(prev => [...prev, {
          type: 'warning',
          icon: '⚖️',
          title: 'স্বাস্থ্য সতর্কতা',
          message: `আপনার BMI ${bmi.toFixed(1)} যা ${bmi < 18.5 ? 'কম' : 'বেশি'}। নিয়মিত ব্যায়াম এবং সুষম খাবার খান।`,
          action: 'স্বাস্থ্য পরিকল্পনা'
        }]);
      }
    }

    // Add prayer times (5 times)
    const prayerTimes = [
      { name: 'ফজর', time: '05:30', end: '05:50' },
      { name: 'যোহর', time: '13:00', end: '13:20' },
      { name: 'আসর', time: '16:30', end: '16:50' },
      { name: 'মাগরিব', time: '18:15', end: '18:30' },
      { name: 'এশা', time: '19:45', end: '20:05' }
    ];

    prayerTimes.forEach((prayer, index) => {
      autoRoutine.push({
        id: Date.now() + 5 + index,
        title: `${prayer.name} নামাজ`,
        startTime: prayer.time,
        endTime: prayer.end,
        days: ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'],
        category: 'prayer',
        priority: 'high'
      });
    });

    // Add family time based on family size
    if (profile.familySize && parseInt(profile.familySize) > 1) {
      autoRoutine.push({
        id: Date.now() + 10,
        title: 'পরিবারের সাথে সময়',
        startTime: '21:00',
        endTime: '22:00',
        days: ['শুক্রবার', 'শনিবার'],
        category: 'break',
        priority: 'medium'
      });
    }

    // Add sleep routine
    autoRoutine.push({
      id: Date.now() + 11,
      title: 'ঘুমের প্রস্তুতি',
      startTime: '22:30',
      endTime: '23:00',
      days: ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার'],
      category: 'break',
      priority: 'high'
    });

    // Set the generated routine
    setRoutine({
      name: `${profile.name || 'আপনার'} দৈনন্দিন রুটিন`,
      type: detectedUserType,
      schedule: autoRoutine
    });

    // Add success AI suggestion
    setAiSuggestions(prev => [...prev, {
      type: 'info',
      icon: '✅',
      title: 'AI রুটিন তৈরি সম্পন্ন',
      message: `আপনার স্বাস্থ্য এবং আর্থিক তথ্যের উপর ভিত্তি করে ${autoRoutine.length}টি কার্যক্রম সহ একটি সম্পূর্ণ রুটিন তৈরি করা হয়েছে।`,
      action: 'রুটিন দেখুন'
    }]);

    setShowSuggestions(true);
  };

  const weekDays = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];
  
  const priorities = {
    high: { name: 'উচ্চ', color: 'bg-red-500', icon: '🔴', description: 'অত্যন্ত গুরুত্বপূর্ণ' },
    medium: { name: 'মাঝারি', color: 'bg-yellow-500', icon: '🟡', description: 'গুরুত্বপূর্ণ' },
    low: { name: 'নিম্ন', color: 'bg-green-500', icon: '🟢', description: 'কম গুরুত্বপূর্ণ' }
  };
  
  const categories = {
    study: { name: 'পড়াশোনা', icon: '📚', color: 'bg-blue-500' },
    work: { name: 'কাজ', icon: '💼', color: 'bg-purple-500' },
    class: { name: 'ক্লাস', icon: '🏫', color: 'bg-green-500' },
    meeting: { name: 'মিটিং', icon: '👥', color: 'bg-orange-500' },
    tuition: { name: 'টিউশন', icon: '📖', color: 'bg-pink-500' },
    break: { name: 'বিরতি', icon: '☕', color: 'bg-yellow-500' },
    prayer: { name: 'নামাজ', icon: '🕌', color: 'bg-teal-500' },
    exercise: { name: 'ব্যায়াম', icon: '🏃', color: 'bg-red-500' },
    other: { name: 'অন্যান্য', icon: '📌', color: 'bg-gray-500' }
  };

  const userTypes = [
    {
      id: 'student',
      name: 'ছাত্র/ছাত্রী',
      icon: '🎓',
      description: 'স্কুল/কলেজ/বিশ্ববিদ্যালয়ের শিক্ষার্থী',
      color: 'from-blue-500 to-cyan-500',
      activities: ['ক্লাস', 'পড়াশোনা', 'টিউশন', 'পরীক্ষা']
    },
    {
      id: 'professional',
      name: 'চাকরিজীবী',
      icon: '💼',
      description: 'অফিস/প্রতিষ্ঠানে চাকরি করেন',
      color: 'from-purple-500 to-pink-500',
      activities: ['অফিস', 'মিটিং', 'প্রজেক্ট', 'ব্রেক']
    },
    {
      id: 'business',
      name: 'ব্যবসায়ী',
      icon: '🏪',
      description: 'নিজের ব্যবসা পরিচালনা করেন',
      color: 'from-orange-500 to-red-500',
      activities: ['দোকান', 'মিটিং', 'হিসাব', 'সরবরাহ']
    },
    {
      id: 'freelancer',
      name: 'ফ্রিল্যান্সার',
      icon: '💻',
      description: 'স্বাধীনভাবে কাজ করেন',
      color: 'from-green-500 to-teal-500',
      activities: ['কাজ', 'ক্লায়েন্ট মিটিং', 'প্রজেক্ট', 'ব্রেক']
    },
    {
      id: 'homemaker',
      name: 'গৃহিণী',
      icon: '🏠',
      description: 'ঘরের কাজ পরিচালনা করেন',
      color: 'from-pink-500 to-rose-500',
      activities: ['রান্না', 'পরিষ্কার', 'বাজার', 'সন্তানের যত্ন']
    },
    {
      id: 'other',
      name: 'অন্যান্য',
      icon: '👤',
      description: 'কাস্টম রুটিন তৈরি করুন',
      color: 'from-gray-500 to-slate-500',
      activities: []
    }
  ];

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.startTime || !newActivity.endTime) {
      alert('সব তথ্য পূরণ করুন');
      return;
    }

    const updatedSchedule = [...routine.schedule, { ...newActivity, id: Date.now() }];
    setRoutine({
      ...routine,
      schedule: updatedSchedule
    });

    // Analyze routine with AI
    analyzeRoutineWithAI(updatedSchedule);

    setNewActivity({
      title: '',
      startTime: '',
      endTime: '',
      days: [],
      category: 'study',
      priority: 'medium'
    });
  };

  const analyzeRoutineWithAI = async (schedule) => {
    setAnalyzingRoutine(true);
    try {
      // Generate AI suggestions based on the routine
      const suggestions = generateSmartSuggestions(schedule);
      setAiSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error analyzing routine:', error);
    } finally {
      setAnalyzingRoutine(false);
    }
  };

  const generateSmartSuggestions = (schedule) => {
    const suggestions = [];
    
    // Sort by priority
    const highPriority = schedule.filter(a => a.priority === 'high');
    const mediumPriority = schedule.filter(a => a.priority === 'medium');
    const lowPriority = schedule.filter(a => a.priority === 'low');

    // Check for time conflicts
    for (let i = 0; i < schedule.length; i++) {
      for (let j = i + 1; j < schedule.length; j++) {
        const activity1 = schedule[i];
        const activity2 = schedule[j];
        
        // Check if days overlap
        const daysOverlap = activity1.days.some(day => activity2.days.includes(day));
        
        if (daysOverlap) {
          const start1 = activity1.startTime;
          const end1 = activity1.endTime;
          const start2 = activity2.startTime;
          const end2 = activity2.endTime;
          
          // Check time overlap
          if ((start1 < end2 && end1 > start2)) {
            suggestions.push({
              type: 'warning',
              icon: '⚠️',
              title: 'সময় সংঘর্ষ পাওয়া গেছে',
              message: `"${activity1.title}" এবং "${activity2.title}" এর সময় একই - এটি সমস্যা সৃষ্টি করতে পারে।`,
              action: 'সময় পরিবর্তন করুন'
            });
          }
        }
      }
    }

    // Suggest breaks between activities
    const sortedSchedule = [...schedule].sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 0; i < sortedSchedule.length - 1; i++) {
      const current = sortedSchedule[i];
      const next = sortedSchedule[i + 1];
      
      const currentEnd = current.endTime;
      const nextStart = next.startTime;
      
      if (currentEnd === nextStart && current.priority === 'high' && next.priority === 'high') {
        suggestions.push({
          type: 'suggestion',
          icon: '💡',
          title: 'বিরতি নেওয়ার পরামর্শ',
          message: `"${current.title}" এবং "${next.title}" এর মধ্যে ১৫-৩০ মিনিট বিরতি নিন।`,
          action: 'বিরতি যোগ করুন'
        });
      }
    }

    // Priority-based suggestions
    if (highPriority.length > 5) {
      suggestions.push({
        type: 'warning',
        icon: '🔴',
        title: 'অনেক বেশি উচ্চ অগ্রাধিকার কাজ',
        message: `আপনার ${highPriority.length}টি উচ্চ অগ্রাধিকার কাজ আছে। কিছু কাজের অগ্রাধিকার কমান।`,
        action: 'অগ্রাধিকার সামঞ্জস্য করুন'
      });
    }

    if (lowPriority.length > highPriority.length * 2) {
      suggestions.push({
        type: 'suggestion',
        icon: '💡',
        title: 'নিম্ন অগ্রাধিকার কাজ বেশি',
        message: 'কিছু নিম্ন অগ্রাধিকার কাজ সরিয়ে ফেলুন বা একত্রিত করুন।',
        action: 'কাজ কমান'
      });
    }

    // Check for prayer time integration
    const prayerActivities = schedule.filter(a => a.category === 'prayer');
    if (prayerActivities.length < 5) {
      suggestions.push({
        type: 'info',
        icon: '🕌',
        title: 'নামাজের সময় যোগ করুন',
        message: 'আপনার রুটিনে ৫ ওয়াক্ত নামাজের সময় যোগ করার পরামর্শ দেওয়া হচ্ছে।',
        action: 'নামাজ যোগ করুন'
      });
    }

    // Work-life balance
    const workActivities = schedule.filter(a => ['work', 'study', 'class'].includes(a.category));
    const breakActivities = schedule.filter(a => a.category === 'break');
    
    if (workActivities.length > 6 && breakActivities.length < 2) {
      suggestions.push({
        type: 'warning',
        icon: '⚡',
        title: 'পর্যাপ্ত বিরতি নেই',
        message: 'দীর্ঘ কাজের জন্য নিয়মিত বিরতি প্রয়োজন। উৎপাদনশীলতা বাড়াতে বিরতি যোগ করুন।',
        action: 'বিরতি যোগ করুন'
      });
    }

    // Early morning suggestion
    const earlyMorning = schedule.find(a => a.startTime < '06:00');
    if (!earlyMorning && userType === 'student') {
      suggestions.push({
        type: 'suggestion',
        icon: '🌅',
        title: 'সকাল তাড়াতাড়ি শুরু করুন',
        message: 'ফজর নামাজের পর পড়াশোনা করলে মনোযোগ বেশি থাকে।',
        action: 'সকাল তাড়াতাড়ি শুরু'
      });
    }

    // If no suggestions, add positive feedback
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'success',
        icon: '✅',
        title: 'দুর্দান্ত রুটিন!',
        message: 'আপনার রুটিন ভালভাবে সংগঠিত এবং ভারসাম্যপূর্ণ।',
        action: null
      });
    }

    return suggestions;
  };

  const handleRemoveActivity = (id) => {
    setRoutine({
      ...routine,
      schedule: routine.schedule.filter(item => item.id !== id)
    });
  };

  const handleSaveRoutine = () => {
    if (!routine.name || routine.schedule.length === 0) {
      alert('রুটিনের নাম এবং কমপক্ষে একটি কার্যক্রম যোগ করুন');
      return;
    }

    onSave({
      ...routine,
      type: userType,
      createdAt: new Date().toISOString()
    });
  };

  const toggleDay = (day) => {
    setNewActivity({
      ...newActivity,
      days: newActivity.days.includes(day)
        ? newActivity.days.filter(d => d !== day)
        : [...newActivity.days, day]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">আপনার রুটিন তৈরি করুন</h1>
              <p className="text-gray-600 mt-2">দৈনন্দিন কাজের সময়সূচী সংরক্ষণ করুন</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>

        {/* User Type Selection */}
        {!userType && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">আপনি কোন ধরনের ব্যক্তি?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    setUserType(type.id);
                    setRoutine({ ...routine, type: type.id, name: `${type.name} রুটিন` });
                  }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center text-4xl mb-4 mx-auto`}>
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{type.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                  {type.activities.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {type.activities.slice(0, 3).map((activity, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {activity}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Routine Setup Form */}
        {userType && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setUserType('')}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← ফিরে যান
            </button>

            {/* Routine Name */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="block text-gray-700 font-bold mb-2">রুটিনের নাম</label>
              <input
                type="text"
                value={routine.name}
                onChange={(e) => setRoutine({ ...routine, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="যেমন: আমার দৈনন্দিন রুটিন"
              />
            </div>

            {/* Add Activity Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">নতুন কার্যক্রম যোগ করুন</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Activity Title */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">কার্যক্রমের নাম *</label>
                  <input
                    type="text"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="যেমন: গণিত ক্লাস, অফিস"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ক্যাটেগরি</label>
                  <select
                    value={newActivity.category}
                    onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    {Object.keys(categories).map(key => (
                      <option key={key} value={key}>
                        {categories[key].icon} {categories[key].name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">শুরুর সময় *</label>
                  <input
                    type="time"
                    value={newActivity.startTime}
                    onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">শেষের সময় *</label>
                  <input
                    type="time"
                    value={newActivity.endTime}
                    onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Priority */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">অগ্রাধিকার (Priority)</label>
                  <div className="flex gap-3">
                    {Object.keys(priorities).map(key => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setNewActivity({ ...newActivity, priority: key })}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                          newActivity.priority === key
                            ? `${priorities[key].color} text-white border-transparent`
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-2xl mb-1">{priorities[key].icon}</div>
                        <div className="text-sm">{priorities[key].name}</div>
                        <div className="text-xs opacity-75">{priorities[key].description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Days Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">কোন দিন? (একাধিক নির্বাচন করুন)</label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        newActivity.days.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddActivity}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                + কার্যক্রম যোগ করুন
              </button>
            </div>

            {/* AI Suggestions */}
            {showSuggestions && aiSuggestions.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">AI পরামর্শ</h3>
                    <p className="text-sm text-gray-600">আপনার রুটিন উন্নত করার জন্য স্মার্ট সুপারিশ</p>
                  </div>
                  {analyzingRoutine && (
                    <div className="ml-auto">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-lg p-4 border-l-4 ${
                        suggestion.type === 'warning' ? 'border-red-500' :
                        suggestion.type === 'suggestion' ? 'border-yellow-500' :
                        suggestion.type === 'info' ? 'border-blue-500' :
                        'border-green-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{suggestion.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 mb-1">{suggestion.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{suggestion.message}</p>
                          {suggestion.action && (
                            <button className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full hover:shadow-lg transition-all">
                              {suggestion.action}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule List */}
            {routine.schedule.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">আপনার রুটিন ({routine.schedule.length} টি কার্যক্রম)</h3>
                
                {/* Priority Summary */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🔴</div>
                    <div className="text-sm font-semibold text-gray-700">উচ্চ অগ্রাধিকার</div>
                    <div className="text-xl font-bold text-red-600">
                      {routine.schedule.filter(a => a.priority === 'high').length}
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🟡</div>
                    <div className="text-sm font-semibold text-gray-700">মাঝারি অগ্রাধিকার</div>
                    <div className="text-xl font-bold text-yellow-600">
                      {routine.schedule.filter(a => a.priority === 'medium').length}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🟢</div>
                    <div className="text-sm font-semibold text-gray-700">নিম্ন অগ্রাধিকার</div>
                    <div className="text-xl font-bold text-green-600">
                      {routine.schedule.filter(a => a.priority === 'low').length}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {routine.schedule
                    .sort((a, b) => {
                      // Sort by priority first, then by time
                      const priorityOrder = { high: 0, medium: 1, low: 2 };
                      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                      }
                      return a.startTime.localeCompare(b.startTime);
                    })
                    .map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 ${categories[item.category].color} rounded-full flex items-center justify-center text-2xl relative`}>
                          {categories[item.category].icon}
                          <span className="absolute -top-1 -right-1 text-lg">
                            {priorities[item.priority].icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-800">{item.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${priorities[item.priority].color} text-white`}>
                              {priorities[item.priority].name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>🕐 {item.startTime} - {item.endTime}</span>
                            <span>📅 {item.days.length > 0 ? item.days.join(', ') : 'সব দিন'}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveActivity(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            {routine.schedule.length > 0 && (
              <div className="flex gap-4">
                <button
                  onClick={handleSaveRoutine}
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-6 h-6" />
                  রুটিন সংরক্ষণ করুন
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineSetup;
