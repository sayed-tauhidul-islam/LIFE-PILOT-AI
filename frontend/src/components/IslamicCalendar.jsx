import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const IslamicCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // বাংলা মাসের নাম
  const banglaMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  // ইংরেজি মাসের নাম
  const englishMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // বাংলা বারো মাসের নাম (বাংলা ক্যালেন্ডার)
  const banglaBarshoMonths = [
    'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
    'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
  ];

  // আরবি মাসের নাম
  const arabicMonths = [
    'মহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জমাদিউল আউয়াল', 'জমাদিউস সানি',
    'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ্জ'
  ];

  // বাংলা সংখ্যা
  const toBanglaNumber = (num) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => banglaDigits[parseInt(digit)]).join('');
  };

  // বাংলা দিনের নাম
  const banglaDays = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

  // ছুটির দিন এবং বিশেষ দিন (২০২৬ সালের সরকারি ছুটি)
  const holidays = {
    // ২০২৬ সালের ছুটির তালিকা
    '2026-01-11': 'His Majesty the Sultan\'s Accession Day',
    '2026-02-04': 'শাহ-ই-বারাত',
    '2026-02-21': 'শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস',
    '2026-03-17': 'শাহ-ই-কাদর',
    '2026-03-20': 'জুমাতুল বিদা',
    '2026-03-21': 'ঈদ-উল-ফিতর (১ম দিন)',
    '2026-03-22': 'ঈদ-উল-ফিতর (২য় দিন)',
    '2026-03-23': 'ঈদ-উল-ফিতর (৩য় দিন)',
    '2026-03-26': 'স্বাধীনতা ও জাতীয় দিবস',
    '2026-04-14': 'বাংলা নববর্ষ',
    '2026-05-01': 'মে দিবস',
    '2026-05-28': 'বুদ্ধ পূর্ণিমা',
    '2026-05-28': 'ঈদ-উল-আযহা (১ম দিন)',
    '2026-05-29': 'ঈদ-উল-আযহা (২য় দিন)',
    '2026-05-30': 'ঈদ-উল-আযহা (৩য় দিন)',
    '2026-06-16': 'হিজরি নববর্ষ',
    '2026-06-26': 'আশুরা',
    '2026-08-05': 'জুলাই গণঅভ্যুত্থান দিবস',
    '2026-08-15': 'জাতীয় শোক দিবস',
    '2026-08-26': 'ঈদ-ই-মিলাদুন্নবী',
    '2026-09-04': 'জন্মাষ্টমী',
    '2026-10-21': 'দুর্গা পূজা (নবমী)',
    '2026-10-22': 'দুর্গা পূজা (বিজয়া দশমী)',
    '2026-11-20': 'ওমানের জাতীয় দিবস',
    '2026-12-16': 'বিজয় দিবস',
    '2026-12-25': 'বড়দিন',
    // ২০২৭-২০৩০ সালের কিছু গুরুত্বপূর্ণ দিন
    '2027-02-21': 'শহীদ দিবস',
    '2027-03-26': 'স্বাধীনতা দিবস',
    '2027-04-14': 'পহেলা বৈশাখ',
    '2027-05-01': 'মে দিবস',
    '2027-08-15': 'জাতীয় শোক দিবস',
    '2027-12-16': 'বিজয় দিবস',
    '2027-12-25': 'বড়দিন',
    '2028-02-21': 'শহীদ দিবস',
    '2028-03-26': 'স্বাধীনতা দিবস',
    '2028-04-14': 'পহেলা বৈশাখ',
    '2028-05-01': 'মে দিবস',
    '2028-08-15': 'জাতীয় শোক দিবস',
    '2028-12-16': 'বিজয় দিবস',
    '2028-12-25': 'বড়দিন',
    '2029-02-21': 'শহীদ দিবস',
    '2029-03-26': 'স্বাধীনতা দিবস',
    '2029-04-14': 'পহেলা বৈশাখ',
    '2029-05-01': 'মে দিবস',
    '2029-08-15': 'জাতীয় শোক দিবস',
    '2029-12-16': 'বিজয় দিবস',
    '2029-12-25': 'বড়দিন',
    '2030-02-21': 'শহীদ দিবস',
    '2030-03-26': 'স্বাধীনতা দিবস',
    '2030-04-14': 'পহেলা বৈশাখ',
    '2030-05-01': 'মে দিবস',
    '2030-08-15': 'জাতীয় শোক দিবস',
    '2030-12-16': 'বিজয় দিবস',
    '2030-12-25': 'বড়দিন'
  };

  // শুক্রবার চেক করা
  const isFriday = (date) => {
    return date.getDay() === 5;
  };

  // ছুটির দিন চেক করা
  const getHoliday = (date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return holidays[dateStr];
  };

  // ক্যালেন্ডার ডেটা তৈরি করা
  const getDaysInMonth = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // খালি দিন যোগ করা
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // মাসের দিনগুলো যোগ করা
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);

  const previousMonth = () => {
    if (selectedMonth === 0) {
      if (selectedYear > 2025) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      }
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      if (selectedYear < 2030) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      }
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-purple-200">
      {/* হেডার */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          disabled={selectedYear === 2025 && selectedMonth === 0}
          className="p-2 rounded-lg hover:bg-purple-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-purple-600" />
        </button>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 justify-center">
            <CalendarIcon className="w-6 h-6 text-purple-600" />
            <span>{banglaMonths[selectedMonth]}</span>
          </h3>
          <div className="flex gap-4 mt-2 text-sm justify-center flex-wrap">
            <span className="text-gray-600">{englishMonths[selectedMonth]}</span>
            <span className="text-purple-600 font-semibold">{toBanglaNumber(selectedYear)}</span>
            <span className="text-green-600 font-semibold">{banglaBarshoMonths[selectedMonth]}</span>
            <span className="text-orange-600">{arabicMonths[selectedMonth % 12]}</span>
          </div>
        </div>

        <button
          onClick={nextMonth}
          disabled={selectedYear === 2030 && selectedMonth === 11}
          className="p-2 rounded-lg hover:bg-purple-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-6 h-6 text-purple-600" />
        </button>
      </div>

      {/* দিনের নাম */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {banglaDays.map((day, index) => (
          <div
            key={day}
            className={`text-center font-bold py-2 rounded-lg ${
              index === 5 ? 'text-green-600 bg-green-50' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* তারিখগুলো */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const holiday = getHoliday(date);
          const friday = isFriday(date);
          const isToday =
            date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear();

          return (
            <div
              key={index}
              className={`aspect-square p-2 rounded-lg border-2 transition-all cursor-pointer group relative ${
                isToday
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-700 shadow-lg scale-110'
                  : holiday
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white border-red-700 hover:scale-105 hover:shadow-lg'
                  : friday
                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-700 hover:scale-105 hover:shadow-lg'
                  : 'bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50 hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className={`text-lg font-bold ${isToday || holiday || friday ? 'text-white' : 'text-gray-800'}`}>
                  {toBanglaNumber(date.getDate())}
                </span>
                {holiday && (
                  <span className="text-xs mt-1 text-white font-semibold">🎉</span>
                )}
              </div>

              {/* হোভার টুলটিপ */}
              {(holiday || friday) && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                  <div className="font-bold">{holiday || 'জুমার দিন'}</div>
                  <div className="text-gray-300">{toBanglaNumber(date.getDate())} {banglaMonths[date.getMonth()]}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* লিজেন্ড */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded"></div>
            <span className="text-gray-700">আজ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded"></div>
            <span className="text-gray-700">ছুটির দিন</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded"></div>
            <span className="text-gray-700">জুমা</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslamicCalendar;
