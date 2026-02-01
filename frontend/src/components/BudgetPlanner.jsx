import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import api from '../api';

const BudgetPlanner = () => {
  const [budget, setBudget] = useState(null);
  const [income, setIncome] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { key: 'rent', label: 'Rent', icon: '🏠', color: 'blue' },
    { key: 'food', label: 'Food', icon: '🍽️', color: 'green' },
    { key: 'transport', label: 'Transport', icon: '🚗', color: 'yellow' },
    { key: 'utilities', label: 'Utilities', icon: '⚡', color: 'orange' },
    { key: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'purple' },
    { key: 'shopping', label: 'Shopping', icon: '🛍️', color: 'pink' },
    { key: 'health', label: 'Health', icon: '🏥', color: 'red' },
    { key: 'education', label: 'Education', icon: '📚', color: 'indigo' },
    { key: 'savings', label: 'Savings', icon: '💰', color: 'teal' },
    { key: 'other', label: 'Other', icon: '📦', color: 'gray' }
  ];

  const getAIBudgetRecommendation = async () => {
    if (!income || parseFloat(income) <= 0) {
      alert('সঠিক আয়ের পরিমাণ লিখুন');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/finance/budget-recommendation', {
        income: parseFloat(income),
        age: 25,
        family_size: 1
      });
      
      setAiRecommendation(response.data);
    } catch (error) {
      console.error('Error getting budget recommendation:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Network Error';
      alert(`বাজেট সুপারিশ পেতে সমস্যা হয়েছে!\nError: ${errorMsg}\nব্যাকএন্ড সার্ভার চালু আছে কিনা চেক করুন।`);
    } finally {
      setLoading(false);
    }
  };

  const applyRecommendation = () => {
    if (!aiRecommendation) return;

    const allocation = aiRecommendation.allocation;
    const newBudget = {};

    categories.forEach(cat => {
      if (allocation[cat.key]) {
        newBudget[cat.key] = allocation[cat.key].amount || 0;
      } else if (allocation.necessities?.categories[cat.key]) {
        newBudget[cat.key] = allocation.necessities.categories[cat.key];
      } else {
        newBudget[cat.key] = 0;
      }
    });

    setBudget(newBudget);
  };

  const handleBudgetChange = (category, value) => {
    setBudget({
      ...budget,
      [category]: parseFloat(value) || 0
    });
  };

  const getTotalBudget = () => {
    if (!budget) return 0;
    return Object.values(budget).reduce((sum, val) => sum + val, 0);
  };

  const getColorClass = (color) => {
    const colors = {
      blue: 'from-blue-400 to-blue-600',
      green: 'from-green-400 to-green-600',
      yellow: 'from-yellow-400 to-yellow-600',
      orange: 'from-orange-400 to-orange-600',
      purple: 'from-purple-400 to-purple-600',
      pink: 'from-pink-400 to-pink-600',
      red: 'from-red-400 to-red-600',
      indigo: 'from-indigo-400 to-indigo-600',
      teal: 'from-teal-400 to-teal-600',
      gray: 'from-gray-400 to-gray-600'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Budget Planner
          </h1>
          <p className="text-gray-600">AI-চালিত বাজেট প্ল্যানিং সিস্টেম</p>
        </div>

        {/* Income Input & AI Recommendation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Get AI Budget Recommendation</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">Monthly Income (৳)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your monthly income"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={getAIBudgetRecommendation}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Loading...' : (
                  <>
                    <Target className="w-5 h-5" />
                    Get AI Advice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Recommendation Display */}
        {aiRecommendation && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg p-6 mb-6 border-2 border-green-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">🤖 AI Recommendation</h3>
                <p className="text-gray-600">Profile: <span className="font-semibold capitalize">{aiRecommendation.profile}</span></p>
              </div>
              <button
                onClick={applyRecommendation}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Apply Recommendation
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Necessities</p>
                <p className="text-2xl font-bold text-blue-600">
                  {aiRecommendation.allocation.necessities.percentage}%
                </p>
                <p className="text-lg text-gray-700">
                  ৳{aiRecommendation.allocation.necessities.amount.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  {aiRecommendation.allocation.savings.percentage}%
                </p>
                <p className="text-lg text-gray-700">
                  ৳{aiRecommendation.allocation.savings.amount.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Lifestyle</p>
                <p className="text-2xl font-bold text-purple-600">
                  {aiRecommendation.allocation.lifestyle.percentage}%
                </p>
                <p className="text-lg text-gray-700">
                  ৳{aiRecommendation.allocation.lifestyle.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Budget Allocation */}
        {budget && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Your Budget Allocation</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-3xl font-bold text-blue-600">৳{getTotalBudget().toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(cat => (
                  <div key={cat.key} className={`bg-gradient-to-r ${getColorClass(cat.color)} rounded-lg p-4 text-white`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="font-semibold">{cat.label}</span>
                    </div>
                    <input
                      type="number"
                      value={budget[cat.key] || 0}
                      onChange={(e) => handleBudgetChange(cat.key, e.target.value)}
                      className="w-full p-2 rounded-lg text-gray-800 font-bold text-xl"
                      min="0"
                      step="100"
                    />
                    <p className="text-sm mt-2 opacity-90">
                      {income && parseFloat(income) > 0 
                        ? `${((budget[cat.key] / parseFloat(income)) * 100).toFixed(1)}% of income`
                        : '0% of income'
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Budget Summary</h3>
              <div className="space-y-3">
                {categories.map(cat => {
                  const amount = budget[cat.key] || 0;
                  const percentage = income && parseFloat(income) > 0 
                    ? (amount / parseFloat(income)) * 100 
                    : 0;
                  
                  return (
                    <div key={cat.key} className="border-b pb-3">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                          <span>{cat.icon}</span>
                          {cat.label}
                        </span>
                        <span className="text-gray-600">
                          ৳{amount.toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${getColorClass(cat.color)} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Comprehensive Budget Planning Guide */}
        {!budget && (
          <div className="space-y-6">
            {/* 50-30-20 Rule Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
              <h3 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                💡 Budget Planning Tips
                <span className="text-lg font-normal text-gray-600">(50-30-20 Rule)</span>
              </h3>
              <p className="text-gray-700 mb-6">বিশ্বব্যাপী স্বীকৃত ৫০-৩০-২০ নিয়ম অনুসরণ করে আপনার বাজেট পরিকল্পনা করুন</p>

              {/* 50% - Necessities */}
              <div className="bg-white rounded-xl p-6 mb-4 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-blue-600">50% - Necessities</h4>
                    <p className="text-gray-600">প্রয়োজনীয় খরচ - মাসিক আয়ের ৫০%</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-bold text-blue-800 mb-2">🏘️ বাসস্থান (Housing)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• ভাড়া বা বন্ধকী পেমেন্ট</li>
                      <li>• সম্পত্তি কর</li>
                      <li>• বাড়ি রক্ষণাবেক্ষণ</li>
                      <li>• বাড়ি বীমা</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-bold text-blue-800 mb-2">🍽️ খাদ্য (Food & Groceries)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• দৈনন্দিন মুদি সামগ্রী</li>
                      <li>• তাজা খাবার ও শাকসবজি</li>
                      <li>• মাংস, মাছ, ডিম, দুধ</li>
                      <li>• প্রয়োজনীয় খাদ্য সামগ্রী</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-bold text-blue-800 mb-2">🚗 যাতায়াত (Transportation)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• গাড়ির পেমেন্ট/EMI</li>
                      <li>• জ্বালানি খরচ</li>
                      <li>• পাবলিক ট্রান্সপোর্ট</li>
                      <li>• গাড়ি রক্ষণাবেক্ষণ</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-bold text-blue-800 mb-2">⚡ ইউটিলিটি (Utilities)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• বিদ্যুৎ বিল</li>
                      <li>• পানি ও গ্যাস বিল</li>
                      <li>• ইন্টারনেট ও ফোন</li>
                      <li>• কেবল/স্ট্রিমিং সার্ভিস</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-bold text-blue-800 mb-2">⚕️ স্বাস্থ্য (Healthcare)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• স্বাস্থ্য বীমা প্রিমিয়াম</li>
                      <li>• নিয়মিত ওষুধপত্র</li>
                      <li>• ডাক্তার চেকআপ</li>
                      <li>• জরুরি চিকিৎসা খরচ</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-bold text-blue-800 mb-2">📄 অন্যান্য বিল (Other Bills)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• ঋণ পরিশোধ (লোন EMI)</li>
                      <li>• ক্রেডিট কার্ড পেমেন্ট</li>
                      <li>• শিশুদের দেখাশোনা খরচ</li>
                      <li>• বাধ্যতামূলক বিল</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 20% - Savings */}
              <div className="bg-white rounded-xl p-6 mb-4 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-green-600">20% - Savings & Investments</h4>
                    <p className="text-gray-600">সঞ্চয় ও বিনিয়োগ - মাসিক আয়ের ২০%</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-bold text-green-800 mb-2">🏦 জরুরি তহবিল (Emergency Fund)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• ৩-৬ মাসের খরচ সমান</li>
                      <li>• সহজে তুলতে পারার মতো</li>
                      <li>• ব্যাংক সেভিংস একাউন্ট</li>
                      <li>• জরুরি পরিস্থিতির জন্য</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-bold text-green-800 mb-2">🎯 রিটায়ারমেন্ট (Retirement Savings)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• পেনশন ফান্ড/PF</li>
                      <li>• NPS (National Pension)</li>
                      <li>• দীর্ঘমেয়াদী সঞ্চয় পরিকল্পনা</li>
                      <li>• নিয়মিত মাসিক জমা</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-bold text-green-800 mb-2">📈 বিনিয়োগ (Investments)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• মিউচুয়াল ফান্ড/SIP</li>
                      <li>• স্টক মার্কেট</li>
                      <li>• রিয়েল এস্টেট</li>
                      <li>• গোল্ড/বন্ড</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-bold text-green-800 mb-2">🎓 ভবিষ্যৎ লক্ষ্য (Future Goals)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• সন্তানের শিক্ষা তহবিল</li>
                      <li>• বিয়ে/বড় অনুষ্ঠান</li>
                      <li>• বাড়ি/গাড়ি কেনার জন্য</li>
                      <li>• ব্যবসা শুরুর জন্য</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 30% - Lifestyle */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <span className="text-2xl">🎬</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-purple-600">30% - Lifestyle & Wants</h4>
                    <p className="text-gray-600">জীবনযাত্রা ও ইচ্ছা - মাসিক আয়ের ৩০%</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-bold text-purple-800 mb-2">🎭 বিনোদন (Entertainment)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• সিনেমা, কনসার্ট, ইভেন্ট</li>
                      <li>• গেমিং, সাবস্ক্রিপশন</li>
                      <li>• বই, ম্যাগাজিন</li>
                      <li>• শখের কাজ</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-bold text-purple-800 mb-2">🍽️ খাবার (Dining Out)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• রেস্টুরেন্ট ও ক্যাফে</li>
                      <li>• ফাস্ট ফুড</li>
                      <li>• পার্টি ও অনুষ্ঠান</li>
                      <li>• অর্ডার খাবার</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-bold text-purple-800 mb-2">🛍️ শপিং (Shopping)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• পোশাক ও ফ্যাশন</li>
                      <li>• জুতা ও আনুষাঙ্গিক</li>
                      <li>• ইলেকট্রনিক্স ও গ্যাজেট</li>
                      <li>• উপহার ও সজ্জা</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-bold text-purple-800 mb-2">✈️ ভ্রমণ (Travel & Vacation)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• ছুটির দিনে ভ্রমণ</li>
                      <li>• হোটেল ও থাকার ব্যবস্থা</li>
                      <li>• ট্যুর প্যাকেজ</li>
                      <li>• ভ্রমণ বীমা</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-bold text-purple-800 mb-2">💪 ফিটনেস (Fitness & Wellness)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• জিম মেম্বারশিপ</li>
                      <li>• যোগব্যায়াম, স্পোর্টস</li>
                      <li>• স্পা ও সেলুন</li>
                      <li>• পার্সোনাল ট্রেনার</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-bold text-purple-800 mb-2">🎨 শখ (Hobbies & Skills)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• শখের ক্লাস/কোর্স</li>
                      <li>• শিল্প ও কারুশিল্প</li>
                      <li>• সঙ্গীত, নাচ</li>
                      <li>• ব্যক্তিগত উন্নয়ন</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>✨</span> বাজেট পরিকল্পনার অতিরিক্ত টিপস
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-bold text-gray-800 mb-2">📊 ট্র্যাকিং করুন</h4>
                  <p className="text-sm text-gray-700">প্রতিদিন আপনার খরচ লিখে রাখুন এবং মাস শেষে পর্যালোচনা করুন</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-bold text-gray-800 mb-2">🎯 লক্ষ্য নির্ধারণ</h4>
                  <p className="text-sm text-gray-700">স্বল্প ও দীর্ঘমেয়াদী আর্থিক লক্ষ্য নির্ধারণ করুন এবং তা অর্জনে কাজ করুন</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-bold text-gray-800 mb-2">💳 ঋণ কমান</h4>
                  <p className="text-sm text-gray-700">উচ্চ সুদের ঋণ দ্রুত পরিশোধ করুন এবং নতুন ঋণ এড়িয়ে চলুন</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-bold text-gray-800 mb-2">🔄 নিয়মিত পর্যালোচনা</h4>
                  <p className="text-sm text-gray-700">প্রতি মাসে আপনার বাজেট পর্যালোচনা করুন এবং প্রয়োজন অনুযায়ী সমন্বয় করুন</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanner;
