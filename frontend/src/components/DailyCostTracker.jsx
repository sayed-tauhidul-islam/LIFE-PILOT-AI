import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Calendar, DollarSign, Lightbulb, CheckCircle, AlertCircle, BarChart3, ArrowRight } from 'lucide-react';
import api from '../api';

const DailyCostTracker = () => {
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [costType, setCostType] = useState('daily'); // daily, weekly, monthly, yearly
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [prediction, setPrediction] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newExpense, setNewExpense] = useState({
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'Cash',
    frequency: 'daily' // daily, weekly, monthly, yearly
  });

  const categories = [
    { name: 'Food', icon: '🍔', color: 'bg-green-500' },
    { name: 'Transport', icon: '🚗', color: 'bg-blue-500' },
    { name: 'Shopping', icon: '🛍️', color: 'bg-purple-500' },
    { name: 'Rent', icon: '🏠', color: 'bg-red-500' },
    { name: 'Utilities', icon: '💡', color: 'bg-yellow-500' },
    { name: 'Entertainment', icon: '🎮', color: 'bg-pink-500' },
    { name: 'Health', icon: '⚕️', color: 'bg-teal-500' },
    { name: 'Education', icon: '📚', color: 'bg-indigo-500' },
    { name: 'Bills', icon: '📄', color: 'bg-orange-500' },
    { name: 'Other', icon: '💰', color: 'bg-gray-500' }
  ];

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    // Bangla numbers
    const banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const toBangla = (num) => num.toString().split('').map(d => banglaNumbers[parseInt(d)]).join('');
    
    if (diffMins < 1) return 'এইমাত্র';
    if (diffMins < 60) return `${toBangla(diffMins)} মিনিট আগে`;
    if (diffHours < 24) return `${toBangla(diffHours)} ঘন্টা আগে`;
    if (diffDays < 7) return `${toBangla(diffDays)} দিন আগে`;
    
    // Format as date with Bangla
    const day = toBangla(date.getDate());
    const month = toBangla(date.getMonth() + 1);
    const year = toBangla(date.getFullYear());
    const hours = toBangla(date.getHours().toString().padStart(2, '0'));
    const mins = toBangla(date.getMinutes().toString().padStart(2, '0'));
    
    return `${day}/${month}/${year} ${hours}:${mins}`;
  };

  const getCategoryLastUpdate = (category, frequency) => {
    const categoryExpenses = dailyExpenses.filter(
      exp => exp.category === category && exp.frequency === frequency
    );
    if (categoryExpenses.length === 0) return null;
    
    // Find the most recent expense
    const latest = categoryExpenses.reduce((latest, exp) => {
      const expDate = new Date(exp.created_at || exp.date);
      const latestDate = new Date(latest.created_at || latest.date);
      return expDate > latestDate ? exp : latest;
    });
    
    return latest.created_at || latest.date;
  };

  useEffect(() => {
    loadDailyExpenses();
  }, [currentMonth, currentYear]);

  const loadDailyExpenses = async () => {
    try {
      const response = await api.get(`/api/finance/daily-expenses?month=${currentMonth}&year=${currentYear}`);
      if (response.data.success) {
        setDailyExpenses(response.data.expenses || []);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      alert('অনুগ্রহ করে সঠিক পরিমাণ লিখুন');
      return;
    }

    try {
      const response = await api.post('/api/finance/daily-expense', {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        created_at: new Date().toISOString()
      });

      if (response.data.success) {
        setDailyExpenses([...dailyExpenses, response.data.expense]);
        setNewExpense({
          category: 'Food',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          payment_method: 'Cash',
          frequency: 'daily'
        });
        setShowAddForm(false);
        alert('✅ খরচ সফলভাবে যোগ করা হয়েছে!');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('❌ খরচ যোগ করতে সমস্যা হয়েছে');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!confirm('এই খরচ ডিলিট করতে চান?')) return;

    try {
      await api.delete(`/api/finance/daily-expense/${expenseId}`);
      setDailyExpenses(dailyExpenses.filter(exp => exp.id !== expenseId));
      alert('✅ খরচ ডিলিট করা হয়েছে');
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('❌ ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  const getMonthlyPrediction = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/finance/predict-monthly-cost', {
        month: currentMonth,
        year: currentYear,
        expenses: dailyExpenses
      });

      if (response.data.success) {
        setPrediction(response.data.prediction);
        setSuggestions(response.data.suggestions || []);
      }
    } catch (error) {
      console.error('Error getting prediction:', error);
      alert('❌ প্রেডিকশন পেতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = dailyExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const byCategory = {};
    dailyExpenses.forEach(exp => {
      byCategory[exp.category] = (byCategory[exp.category] || 0) + parseFloat(exp.amount || 0);
    });

    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const daysPassed = dailyExpenses.length > 0 
      ? Math.max(...dailyExpenses.map(e => new Date(e.date).getDate()))
      : new Date().getDate();
    const avgDaily = total / daysPassed;

    return { total, byCategory, avgDaily, daysPassed, daysInMonth };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                📅 Daily Cost Tracker
              </h1>
              <p className="text-gray-600">দৈনিক খরচ ট্র্যাক করুন এবং AI পরামর্শ পান</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCostType('daily');
                  setShowAddForm(true);
                  setNewExpense({...newExpense, frequency: 'daily'});
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Daily Cost
              </button>
              <button
                onClick={() => {
                  setCostType('weekly');
                  setShowAddForm(true);
                  setNewExpense({...newExpense, frequency: 'weekly'});
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Weekly Cost
              </button>
              <button
                onClick={() => {
                  setCostType('monthly');
                  setShowAddForm(true);
                  setNewExpense({...newExpense, frequency: 'monthly'});
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Monthly Cost
              </button>
              <button
                onClick={() => {
                  setCostType('yearly');
                  setShowAddForm(true);
                  setNewExpense({...newExpense, frequency: 'yearly'});
                }}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Yearly Cost
              </button>
            </div>
          </div>
        </div>

        {/* Month Selector */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-6 h-6 text-purple-600" />
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>
                  {new Date(2024, m-1).toLocaleString('bn-BD', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(parseInt(e.target.value))}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {costType === 'daily' && '📅 দৈনিক খরচ যোগ করুন'}
                {costType === 'weekly' && '📆 সাপ্তাহিক খরচ যোগ করুন'}
                {costType === 'monthly' && '📊 মাসিক খরচ যোগ করুন'}
                {costType === 'yearly' && '🗓️ বার্ষিক খরচ যোগ করুন'}
              </h2>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                costType === 'daily' ? 'bg-purple-100 text-purple-700' :
                costType === 'weekly' ? 'bg-blue-100 text-blue-700' :
                costType === 'monthly' ? 'bg-green-100 text-green-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {costType.toUpperCase()}
              </span>
            </div>
            
            {/* Daily Cost Form */}
            {costType === 'daily' && (
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Amount (৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Grocery shopping"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
                  <select
                    value={newExpense.payment_method}
                    onChange={(e) => setNewExpense({...newExpense, payment_method: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Cash">💵 Cash</option>
                    <option value="Card">💳 Card</option>
                    <option value="Mobile Banking">📱 Mobile Banking</option>
                    <option value="Bank Transfer">🏦 Bank Transfer</option>
                  </select>
                </div>

                <div className="flex items-end gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    ✅ Add Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Weekly Cost Form */}
            {costType === 'weekly' && (
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Weekly Amount (৳)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Enter weekly cost"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Week Start Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    required
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description (Recurring weekly expense)</label>
                  <textarea
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., Weekly grocery shopping, Transportation for work week"
                    rows="3"
                  />
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-semibold mb-2">💡 Weekly Cost Tips:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Track expenses that repeat every week</li>
                    <li>• Weekly groceries, commute costs, etc.</li>
                    <li>• This will be multiplied by ~4.3 for monthly calculations</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    ✅ Add Weekly Cost
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Monthly Cost Form */}
            {costType === 'monthly' && (
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Monthly Amount (৳)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                      placeholder="Enter monthly cost"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Month/Year</label>
                    <input
                      type="month"
                      value={newExpense.date ? newExpense.date.slice(0, 7) : ''}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value + '-01'})}
                      required
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description (Fixed monthly expense)</label>
                  <textarea
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="e.g., House rent, Electricity bill, Internet subscription"
                    rows="2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
                    <select
                      value={newExpense.payment_method}
                      onChange={(e) => setNewExpense({...newExpense, payment_method: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                    >
                      <option value="Cash">💵 Cash</option>
                      <option value="Card">💳 Card</option>
                      <option value="Mobile Banking">📱 Mobile Banking</option>
                      <option value="Bank Transfer">🏦 Bank Transfer</option>
                      <option value="Auto-Debit">🔄 Auto-Debit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      placeholder="Day of month (1-31)"
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-semibold mb-2">💡 Monthly Cost Examples:</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Rent, mortgage payments</li>
                    <li>• Utility bills (electricity, water, gas)</li>
                    <li>• Subscriptions (Netflix, Spotify, gym)</li>
                    <li>• Insurance premiums</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    ✅ Add Monthly Cost
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Yearly Cost Form */}
            {costType === 'yearly' && (
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Yearly Amount (৳)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      placeholder="Enter yearly cost"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Year</label>
                  <select
                    value={currentYear}
                    onChange={(e) => {
                      const year = e.target.value;
                      setCurrentYear(parseInt(year));
                      setNewExpense({...newExpense, date: `${year}-01-01`});
                    }}
                    className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  >
                    {[2024, 2025, 2026, 2027, 2028].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description (Annual expense)</label>
                  <textarea
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    placeholder="e.g., Annual insurance premium, Car registration, Property tax"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
                    <select
                      value={newExpense.payment_method}
                      onChange={(e) => setNewExpense({...newExpense, payment_method: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Cash">💵 Cash</option>
                      <option value="Card">💳 Card</option>
                      <option value="Mobile Banking">📱 Mobile Banking</option>
                      <option value="Bank Transfer">🏦 Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Payment Status</label>
                    <select
                      className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Paid">✅ Paid</option>
                      <option value="Pending">⏳ Pending</option>
                      <option value="Scheduled">📅 Scheduled</option>
                    </select>
                  </div>
                </div>

                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800 font-semibold mb-2">💡 Yearly Cost Examples:</p>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Car/vehicle insurance</li>
                    <li>• Health insurance annual premium</li>
                    <li>• Property/house tax</li>
                    <li>• Vehicle registration & maintenance</li>
                    <li>• Annual subscription renewals</li>
                  </ul>
                  <p className="text-xs text-orange-600 mt-2 font-semibold">
                    📊 Monthly equivalent: ৳{newExpense.amount ? (parseFloat(newExpense.amount) / 12).toFixed(2) : '0.00'}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    ✅ Add Yearly Cost
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-10 h-10" />
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium opacity-90">Total Spent</h3>
            <p className="text-3xl font-bold">৳{stats.total.toFixed(2)}</p>
            <p className="text-xs opacity-75 mt-1">মোট খরচ</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-10 h-10" />
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium opacity-90">Days Tracked</h3>
            <p className="text-3xl font-bold">{stats.daysPassed}/{stats.daysInMonth}</p>
            <p className="text-xs opacity-75 mt-1">ট্র্যাক করা দিন</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-10 h-10" />
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium opacity-90">Average Daily</h3>
            <p className="text-3xl font-bold">৳{stats.avgDaily.toFixed(2)}</p>
            <p className="text-xs opacity-75 mt-1">গড় দৈনিক খরচ</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-10 h-10" />
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium opacity-90">Transactions</h3>
            <p className="text-3xl font-bold">{dailyExpenses.length}</p>
            <p className="text-xs opacity-75 mt-1">মোট লেনদেন</p>
          </div>
        </div>

        {/* Frequency-wise Category Breakdown */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 খরচের ব্রেকডাউন (Frequency-wise)</h2>
          
          {/* Daily Expenses */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
              📅 দৈনিক খরচ (Daily)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map(category => {
                const categoryExpenses = dailyExpenses.filter(
                  exp => exp.category === category.name && exp.frequency === 'daily'
                );
                const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                const lastUpdate = getCategoryLastUpdate(category.name, 'daily');
                
                if (total === 0) return null;
                
                return (
                  <div key={category.name} className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
                    <div className="text-xl mb-1">{category.icon}</div>
                    <p className="text-xs font-semibold text-gray-700">{category.name}</p>
                    <p className="text-lg font-bold text-purple-700">৳{total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{categoryExpenses.length} items</p>
                    {lastUpdate && (
                      <p className="text-xs text-purple-600 mt-1 truncate" title={formatTimestamp(lastUpdate)}>
                        🕐 {formatTimestamp(lastUpdate)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {dailyExpenses.filter(exp => exp.frequency === 'daily').length === 0 && (
              <p className="text-gray-400 text-center py-4">কোন দৈনিক খরচ নেই</p>
            )}
          </div>

          {/* Weekly Expenses */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
              📆 সাপ্তাহিক খরচ (Weekly)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map(category => {
                const categoryExpenses = dailyExpenses.filter(
                  exp => exp.category === category.name && exp.frequency === 'weekly'
                );
                const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                const lastUpdate = getCategoryLastUpdate(category.name, 'weekly');
                
                if (total === 0) return null;
                
                return (
                  <div key={category.name} className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                    <div className="text-xl mb-1">{category.icon}</div>
                    <p className="text-xs font-semibold text-gray-700">{category.name}</p>
                    <p className="text-lg font-bold text-blue-700">৳{total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{categoryExpenses.length} items</p>
                    {lastUpdate && (
                      <p className="text-xs text-blue-600 mt-1 truncate" title={formatTimestamp(lastUpdate)}>
                        🕐 {formatTimestamp(lastUpdate)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {dailyExpenses.filter(exp => exp.frequency === 'weekly').length === 0 && (
              <p className="text-gray-400 text-center py-4">কোন সাপ্তাহিক খরচ নেই</p>
            )}
          </div>

          {/* Monthly Expenses */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
              📊 মাসিক খরচ (Monthly)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map(category => {
                const categoryExpenses = dailyExpenses.filter(
                  exp => exp.category === category.name && exp.frequency === 'monthly'
                );
                const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                const lastUpdate = getCategoryLastUpdate(category.name, 'monthly');
                
                if (total === 0) return null;
                
                return (
                  <div key={category.name} className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                    <div className="text-xl mb-1">{category.icon}</div>
                    <p className="text-xs font-semibold text-gray-700">{category.name}</p>
                    <p className="text-lg font-bold text-green-700">৳{total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{categoryExpenses.length} items</p>
                    {lastUpdate && (
                      <p className="text-xs text-green-600 mt-1 truncate" title={formatTimestamp(lastUpdate)}>
                        🕐 {formatTimestamp(lastUpdate)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {dailyExpenses.filter(exp => exp.frequency === 'monthly').length === 0 && (
              <p className="text-gray-400 text-center py-4">কোন মাসিক খরচ নেই</p>
            )}
          </div>

          {/* Yearly Expenses */}
          <div>
            <h3 className="text-lg font-semibold text-orange-700 mb-3 flex items-center gap-2">
              🗓️ বার্ষিক খরচ (Yearly)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map(category => {
                const categoryExpenses = dailyExpenses.filter(
                  exp => exp.category === category.name && exp.frequency === 'yearly'
                );
                const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                const lastUpdate = getCategoryLastUpdate(category.name, 'yearly');
                
                if (total === 0) return null;
                
                return (
                  <div key={category.name} className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3">
                    <div className="text-xl mb-1">{category.icon}</div>
                    <p className="text-xs font-semibold text-gray-700">{category.name}</p>
                    <p className="text-lg font-bold text-orange-700">৳{total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{categoryExpenses.length} items</p>
                    {lastUpdate && (
                      <p className="text-xs text-orange-600 mt-1 truncate" title={formatTimestamp(lastUpdate)}>
                        🕐 {formatTimestamp(lastUpdate)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {dailyExpenses.filter(exp => exp.frequency === 'yearly').length === 0 && (
              <p className="text-gray-400 text-center py-4">কোন বার্ষিক খরচ নেই</p>
            )}
          </div>
        </div>

        {/* Get AI Prediction Button */}
        {dailyExpenses.length >= 5 && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                  AI Monthly Prediction Ready!
                </h3>
                <p className="text-gray-600">আপনার {dailyExpenses.length} টি খরচের ডেটা থেকে AI মাসিক প্রেডিকশন এবং সেভিং টিপস পাবেন</p>
              </div>
              <button
                onClick={getMonthlyPrediction}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <>⏳ Processing...</>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Get AI Prediction
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* AI Prediction Results */}
        {prediction && (
          <div className="bg-white rounded-xl shadow-2xl p-6 mb-6 border-2 border-green-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              🤖 AI Monthly Cost Prediction
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Current Spending</h3>
                <p className="text-4xl font-bold text-blue-600">৳{prediction.current_total?.toFixed(2)}</p>
                <p className="text-xs text-blue-700 mt-2">এখন পর্যন্ত খরচ</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300">
                <h3 className="text-sm font-semibold text-purple-800 mb-2">Predicted Monthly</h3>
                <p className="text-4xl font-bold text-purple-600">৳{prediction.predicted_total?.toFixed(2)}</p>
                <p className="text-xs text-purple-700 mt-2">প্রেডিক্টেড মাসিক খরচ</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-300">
                <h3 className="text-sm font-semibold text-green-800 mb-2">Potential Savings</h3>
                <p className="text-4xl font-bold text-green-600">৳{prediction.potential_savings?.toFixed(2)}</p>
                <p className="text-xs text-green-700 mt-2">সম্ভাব্য সেভিংস</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Category-wise Prediction</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(prediction.category_predictions || {}).map(([category, amount]) => {
                  const cat = categories.find(c => c.name === category);
                  return (
                    <div key={category} className="bg-white rounded-lg p-4 shadow">
                      <div className="text-2xl mb-2">{cat?.icon || '💰'}</div>
                      <p className="text-xs text-gray-600 font-semibold">{category}</p>
                      <p className="text-lg font-bold text-gray-800">৳{amount.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-2xl p-6 mb-6 border-2 border-green-300">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              💡 AI Money Saving Suggestions
            </h2>

            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${
                    suggestion.priority === 'high' ? 'border-red-500' :
                    suggestion.priority === 'medium' ? 'border-yellow-500' :
                    'border-green-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      suggestion.priority === 'high' ? 'bg-red-100' :
                      suggestion.priority === 'medium' ? 'bg-yellow-100' :
                      'bg-green-100'
                    }`}>
                      {suggestion.priority === 'high' ? (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      ) : suggestion.priority === 'medium' ? (
                        <Lightbulb className="w-6 h-6 text-yellow-600" />
                      ) : (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{suggestion.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          suggestion.priority === 'high' ? 'bg-red-200 text-red-800' :
                          suggestion.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {suggestion.priority === 'high' ? '🔥 High Priority' :
                           suggestion.priority === 'medium' ? '⚠️ Medium' :
                           '✅ Best Practice'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{suggestion.message}</p>
                      {suggestion.potential_saving && (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <p className="text-sm font-semibold text-green-800">
                            💰 Potential Savings: ৳{suggestion.potential_saving.toFixed(2)} per month
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Expenses List */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Daily Expenses</h2>
          
          {dailyExpenses.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No expenses recorded yet</p>
              <p className="text-gray-400">Start tracking your daily costs!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dailyExpenses.slice().reverse().map((expense, idx) => {
                const cat = categories.find(c => c.name === expense.category);
                return (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 ${cat?.color} rounded-full flex items-center justify-center text-2xl`}>
                        {cat?.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{expense.category}</h4>
                        <p className="text-sm text-gray-600">{expense.description}</p>
                        <p className="text-xs text-gray-400">
                          {expense.date} • {expense.payment_method}
                          {expense.created_at && (
                            <span className="ml-2 text-purple-500">
                              📅 {formatTimestamp(expense.created_at)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-2xl font-bold text-purple-600">৳{parseFloat(expense.amount).toFixed(2)}</p>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tips Section */}
        {dailyExpenses.length < 5 && (
          <div className="bg-blue-50 rounded-xl p-6 mt-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" />
              Get Started Tips
            </h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Add at least 5 daily expenses to get AI predictions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Track expenses throughout the month for better accuracy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>AI will analyze patterns and suggest money-saving tips</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCostTracker;
