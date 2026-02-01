import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle, CheckCircle, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../api';

const FinanceDashboard = () => {
  const [financeData, setFinanceData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingsRate: 0
  });
  
  const [expenses, setExpenses] = useState([]);
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  
  // Form states
  const [incomeInput, setIncomeInput] = useState('');
  const [newGoal, setNewGoal] = useState({
    goal_name: '',
    target_amount: '',
    current_amount: '',
    deadline: ''
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    setLoading(true);
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      // Load all finance data including daily expenses
      const [expensesRes, dailyExpensesRes, goalsRes, profileRes] = await Promise.all([
        api.get('/api/finance/expenses').catch(() => ({ data: { expenses: [] } })),
        api.get(`/api/finance/daily-expenses?month=${currentMonth}&year=${currentYear}`).catch(() => ({ data: { expenses: [] } })),
        api.get('/api/finance/goals').catch(() => ({ data: { goals: [] } })),
        api.get('/api/finance/profile').catch(() => ({ data: null }))
      ]);

      const regularExpenses = expensesRes.data.expenses || [];
      const dailyCosts = dailyExpensesRes.data.expenses || [];
      
      setExpenses(regularExpenses);
      setDailyExpenses(dailyCosts);
      setGoals(goalsRes.data.goals || []);
      
      // Calculate total monthly expenses from daily costs
      const monthlyExpensesFromDailyCosts = calculateMonthlyExpenses(dailyCosts);
      const regularExpensesTotal = regularExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
      const totalMonthlyExpenses = monthlyExpensesFromDailyCosts + regularExpensesTotal;
      
      if (profileRes.data && profileRes.data.total_income) {
        const income = profileRes.data.total_income || 0;
        const savings = income - totalMonthlyExpenses;
        const savingsRate = income > 0 ? (savings / income * 100) : 0;
        
        setFinanceData({
          totalIncome: income,
          totalExpenses: totalMonthlyExpenses,
          netSavings: savings,
          savingsRate: savingsRate
        });
      } else {
        // If no profile data, just show expenses
        setFinanceData({
          totalIncome: 0,
          totalExpenses: totalMonthlyExpenses,
          netSavings: -totalMonthlyExpenses,
          savingsRate: 0
        });
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
      // Set empty data on error
      setFinanceData({
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        savingsRate: 0
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Convert different frequency expenses to monthly equivalent
  const calculateMonthlyExpenses = (expenses) => {
    let total = 0;
    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount || 0);
      const frequency = expense.frequency || 'daily';
      
      switch(frequency) {
        case 'daily':
          total += amount * 30; // Assume 30 days per month
          break;
        case 'weekly':
          total += amount * 4.3; // ~4.3 weeks per month
          break;
        case 'monthly':
          total += amount;
          break;
        case 'yearly':
          total += amount / 12; // Divide by 12 months
          break;
        default:
          total += amount * 30; // Default to daily
      }
    });
    return total;
  };

  const getAISuggestions = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/finance/ai-suggestions', {
        income: financeData.totalIncome,
        expenses: financeData.totalExpenses,
        age: 25,
        risk_tolerance: 'moderate'
      });
      
      if (response.data) {
        setAiSuggestions(response.data.suggestions || []);
        setHealthScore(response.data.health_score || null);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      alert('AI সুপারিশ পেতে সমস্যা হয়েছে। ব্যাকএন্ড সার্ভার চালু আছে কিনা চেক করুন।');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle income update
  const handleUpdateIncome = async () => {
    const income = parseFloat(incomeInput);
    if (!income || income <= 0) {
      alert('অনুগ্রহ করে সঠিক পরিমাণ লিখুন');
      return;
    }
    
    try {
      const response = await api.post('/api/finance/profile', {
        total_income: income
      });
      
      if (response.data.success) {
        setFinanceData({
          ...financeData,
          totalIncome: income,
          netSavings: income - financeData.totalExpenses,
          savingsRate: income > 0 ? ((income - financeData.totalExpenses) / income * 100) : 0
        });
        
        setShowIncomeModal(false);
        setIncomeInput('');
        alert('✅ আয় সফলভাবে আপডেট করা হয়েছে!');
      }
    } catch (error) {
      console.error('Error updating income:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Network Error';
      alert(`❌ আয় আপডেট করতে সমস্যা হয়েছে!\nError: ${errorMsg}\nব্যাকএন্ড সার্ভার চালু আছে কিনা চেক করুন।`);
    }
  };
  
  // Handle goal creation/update
  const handleSaveGoal = async () => {
    if (!newGoal.goal_name || !newGoal.target_amount) {
      alert('অনুগ্রহ করে সব তথ্য পূরণ করুন');
      return;
    }
    
    try {
      const goalData = {
        goal_name: newGoal.goal_name,
        target_amount: parseFloat(newGoal.target_amount),
        current_amount: parseFloat(newGoal.current_amount) || 0,
        deadline: newGoal.deadline
      };
      
      if (editingGoal) {
        await api.put(`/api/finance/goal/${editingGoal._id}`, goalData);
        setGoals(goals.map(g => g._id === editingGoal._id ? {...g, ...goalData} : g));
        alert('✅ লক্ষ্য আপডেট করা হয়েছে!');
      } else {
        const response = await api.post('/api/finance/goal', goalData);
        if (response.data && response.data.goal) {
          setGoals([...goals, response.data.goal]);
          alert('✅ লক্ষ্য যোগ করা হয়েছে!');
        }
      }
      
      setShowGoalModal(false);
      setEditingGoal(null);
      setNewGoal({
        goal_name: '',
        target_amount: '',
        current_amount: '',
        deadline: ''
      });
    } catch (error) {
      console.error('Error saving goal:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(`❌ লক্ষ্য যোগ করতে সমস্যা হয়েছে!\nError: ${errorMsg}\nআবার চেষ্টা করুন।`);
    }
  };
  
  // Handle goal deletion
  const handleDeleteGoal = async (goalId) => {
    if (!confirm('এই লক্ষ্য ডিলিট করতে চান?')) return;
    
    try {
      await api.delete(`/api/finance/goal/${goalId}`);
      setGoals(goals.filter(g => g._id !== goalId));
      alert('✅ লক্ষ্য ডিলিট করা হয়েছে');
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('❌ ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  const calculateExpenseBreakdown = () => {
    const breakdown = {};
    
    // Add regular expenses
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      breakdown[category] = (breakdown[category] || 0) + expense.amount;
    });
    
    // Add daily/weekly/monthly/yearly expenses (converted to monthly)
    dailyExpenses.forEach(expense => {
      const category = expense.category || 'Other';
      const amount = parseFloat(expense.amount || 0);
      const frequency = expense.frequency || 'daily';
      
      let monthlyAmount = 0;
      switch(frequency) {
        case 'daily':
          monthlyAmount = amount * 30;
          break;
        case 'weekly':
          monthlyAmount = amount * 4.3;
          break;
        case 'monthly':
          monthlyAmount = amount;
          break;
        case 'yearly':
          monthlyAmount = amount / 12;
          break;
        default:
          monthlyAmount = amount * 30;
      }
      
      breakdown[category] = (breakdown[category] || 0) + monthlyAmount;
    });
    
    return Object.keys(breakdown).map(key => ({
      name: key,
      value: breakdown[key]
    }));
  };

  const expenseData = calculateExpenseBreakdown();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💰 Personal Finance Manager
          </h1>
          <p className="text-gray-600">আপনার আর্থিক স্বাস্থ্য ট্র্যাক করুন এবং উন্নতি করুন</p>
        </div>



        {/* No Data Message */}
        {financeData.totalExpenses === 0 && dailyExpenses.length === 0 && expenses.length === 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Target className="w-10 h-10 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">🚀 শুরু করুন আপনার আর্থিক যাত্রা!</h3>
                <p className="text-gray-700 mb-4">আপনার কোনো ডেটা এখনো নেই। নিচের অপশনগুলো থেকে শুরু করুন:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-gray-800 mb-2">📅 Daily Cost Tracker</h4>
                    <p className="text-sm text-gray-600">দৈনন্দিন খরচ ট্র্যাক করুন - Daily, Weekly, Monthly, Yearly</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-gray-800 mb-2">📈 Expense Tracker</h4>
                    <p className="text-sm text-gray-600">নিয়মিত খরচ যোগ করুন এবং বিশ্লেষণ করুন</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-gray-800 mb-2">🎯 Budget Planner</h4>
                    <p className="text-sm text-gray-600">AI-চালিত বাজেট পরিকল্পনা পান</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-gray-800 mb-2">📊 Investment Advisor</h4>
                    <p className="text-sm text-gray-600">বিনিয়োগের পরামর্শ নিন</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div 
            onClick={() => setShowIncomeModal(true)}
            className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Monthly Income</h3>
              <TrendingUp className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold">৳ {financeData.totalIncome.toLocaleString()}</p>
            <p className="text-sm mt-2 opacity-90">মাসিক আয় (ক্লিক করে আপডেট করুন)</p>
          </div>

          <div 
            onClick={() => setShowExpenseModal(true)}
            className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Monthly Expenses</h3>
              <TrendingDown className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold">৳ {financeData.totalExpenses.toLocaleString()}</p>
            <p className="text-sm mt-2 opacity-90">মাসিক খরচ (বিস্তারিত দেখুন)</p>
          </div>

          <div 
            onClick={() => setShowSavingsModal(true)}
            className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Net Savings</h3>
              <DollarSign className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold">৳ {financeData.netSavings.toLocaleString()}</p>
            <p className="text-sm mt-2 opacity-90">মোট সঞ্চয় (বিস্তারিত দেখুন)</p>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Savings Rate</h3>
              <Target className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold">{financeData.savingsRate.toFixed(1)}%</p>
            <p className="text-sm mt-2 opacity-90">সেভিংস রেট</p>
          </div>
        </div>

        {/* Expense Summary by Frequency */}
        {dailyExpenses.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">💳 Expense Breakdown by Frequency</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['daily', 'weekly', 'monthly', 'yearly'].map(freq => {
                const freqExpenses = dailyExpenses.filter(exp => exp.frequency === freq);
                const totalAmount = freqExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
                let monthlyEquiv = 0;
                let icon = '📅';
                let colorClass = 'from-purple-400 to-purple-600';
                
                switch(freq) {
                  case 'daily':
                    monthlyEquiv = totalAmount * 30;
                    icon = '📅';
                    colorClass = 'from-purple-400 to-purple-600';
                    break;
                  case 'weekly':
                    monthlyEquiv = totalAmount * 4.3;
                    icon = '📆';
                    colorClass = 'from-blue-400 to-blue-600';
                    break;
                  case 'monthly':
                    monthlyEquiv = totalAmount;
                    icon = '📊';
                    colorClass = 'from-green-400 to-green-600';
                    break;
                  case 'yearly':
                    monthlyEquiv = totalAmount / 12;
                    icon = '🗓️';
                    colorClass = 'from-orange-400 to-orange-600';
                    break;
                }
                
                return (
                  <div key={freq} className={`bg-gradient-to-br ${colorClass} rounded-xl p-4 text-white shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{icon}</span>
                      <span className="text-sm font-semibold opacity-90">{freqExpenses.length} items</span>
                    </div>
                    <h4 className="text-lg font-bold capitalize mb-1">{freq} Costs</h4>
                    <p className="text-2xl font-bold">৳{totalAmount.toFixed(2)}</p>
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <p className="text-xs opacity-75">Monthly Equivalent:</p>
                      <p className="text-lg font-semibold">৳{monthlyEquiv.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Expense Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Expense Distribution</h3>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
              >
                View Details →
              </button>
            </div>
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                <p>কোনো খরচের ডেটা নেই</p>
              </div>
            )}
          </div>

          {/* Financial Goals */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Financial Goals</h3>
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setNewGoal({
                    goal_name: '',
                    target_amount: '',
                    current_amount: '',
                    deadline: ''
                  });
                  setShowGoalModal(true);
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Goal
              </button>
            </div>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.slice(0, 5).map((goal, index) => {
                  const progress = (goal.current_amount / goal.target_amount * 100).toFixed(0);
                  return (
                    <div key={index} className="border-b pb-3">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-700">{goal.goal_name}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingGoal(goal);
                              setNewGoal({
                                goal_name: goal.goal_name,
                                target_amount: goal.target_amount,
                                current_amount: goal.current_amount,
                                deadline: goal.deadline
                              });
                              setShowGoalModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>৳{goal.current_amount.toLocaleString()}</span>
                        <span>৳{goal.target_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                <Target className="w-16 h-16 mb-4 text-gray-400" />
                <p>কোনো লক্ষ্য সেট করা হয়নি</p>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  প্রথম লক্ষ্য যোগ করুন
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Suggestions Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">🤖 AI Financial Suggestions</h3>
            <button
              onClick={getAISuggestions}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get AI Advice'}
            </button>
          </div>

          {healthScore && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Financial Health Score</h4>
                  <p className="text-sm text-gray-600">আপনার আর্থিক স্বাস্থ্য স্কোর</p>
                </div>
                <div className="text-4xl font-bold text-blue-600">
                  {healthScore.overall_score}/100
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Grade: {healthScore.grade}
                </span>
              </div>
            </div>
          )}

          {aiSuggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-orange-400"
                >
                  <AlertCircle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>AI পরামর্শ পেতে "Get AI Advice" বাটনে ক্লিক করুন</p>
            </div>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Expenses</h3>
          {(expenses.length > 0 || dailyExpenses.length > 0) ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Monthly Equiv.</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Regular expenses */}
                  {expenses.slice(0, 5).map((expense, index) => (
                    <tr key={`reg-${index}`} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">{expense.date}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          Regular
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{expense.description || '-'}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-800">
                        ৳{expense.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-600">
                        ৳{expense.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {/* Daily/Weekly/Monthly/Yearly expenses */}
                  {dailyExpenses.slice(0, 10).map((expense, index) => {
                    const amount = parseFloat(expense.amount || 0);
                    const frequency = expense.frequency || 'daily';
                    let monthlyEquiv = 0;
                    let badge = { text: 'Daily', bgColor: 'bg-purple-100', textColor: 'text-purple-700' };
                    
                    switch(frequency) {
                      case 'daily':
                        monthlyEquiv = amount * 30;
                        badge = { text: '📅 Daily', bgColor: 'bg-purple-100', textColor: 'text-purple-700' };
                        break;
                      case 'weekly':
                        monthlyEquiv = amount * 4.3;
                        badge = { text: '📆 Weekly', bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
                        break;
                      case 'monthly':
                        monthlyEquiv = amount;
                        badge = { text: '📊 Monthly', bgColor: 'bg-green-100', textColor: 'text-green-700' };
                        break;
                      case 'yearly':
                        monthlyEquiv = amount / 12;
                        badge = { text: '🗓️ Yearly', bgColor: 'bg-orange-100', textColor: 'text-orange-700' };
                        break;
                      default:
                        monthlyEquiv = amount * 30;
                    }
                    
                    return (
                      <tr key={`daily-${index}`} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-600">{expense.date}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {expense.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block ${badge.bgColor} ${badge.textColor} px-2 py-1 rounded text-xs font-semibold`}>
                            {badge.text}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{expense.description || '-'}</td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-800">
                          ৳{amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          ৳{monthlyEquiv.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>কোনো খরচের রেকর্ড নেই</p>
            </div>
          )}
        </div>
        
        {/* Income Modal */}
        {showIncomeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">💵 Update Monthly Income</h3>
                <button
                  onClick={() => setShowIncomeModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">মাসিক আয় (৳)</label>
                <input
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                  placeholder="আপনার মাসিক আয় লিখুন"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowIncomeModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateIncome}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-semibold"
                >
                  ✅ Update
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Expense Details Modal */}
        {showExpenseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">📊 Expense Details</h3>
                <button
                  onClick={() => setShowExpenseModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-blue-600">৳{financeData.totalExpenses.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-purple-600">{expenses.length + dailyExpenses.length}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-700 mb-2">Category Breakdown:</h4>
                  {expenseData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">{item.name}</span>
                      <span className="text-lg font-bold text-gray-800">৳{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
        
        {/* Savings Modal */}
        {showSavingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">💰 Savings Analysis</h3>
                <button
                  onClick={() => setShowSavingsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Monthly Income</p>
                  <p className="text-2xl font-bold text-green-600">৳{financeData.totalIncome.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-red-600">৳{financeData.totalExpenses.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Net Savings</p>
                  <p className="text-2xl font-bold text-blue-600">৳{financeData.netSavings.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Savings Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{financeData.savingsRate.toFixed(1)}%</p>
                </div>
                {financeData.savingsRate < 20 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-sm text-gray-700">⚠️ Your savings rate is below the recommended 20%. Consider reducing expenses or increasing income.</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowSavingsModal(false)}
                className="w-full mt-4 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
        
        {/* Goal Modal */}
        {showGoalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingGoal ? '✏️ Edit Goal' : '➕ Add New Goal'}
                </h3>
                <button
                  onClick={() => {
                    setShowGoalModal(false);
                    setEditingGoal(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Goal Name</label>
                  <input
                    type="text"
                    value={newGoal.goal_name}
                    onChange={(e) => setNewGoal({...newGoal, goal_name: e.target.value})}
                    placeholder="e.g., Emergency Fund, New Car"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Target Amount (৳)</label>
                  <input
                    type="number"
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({...newGoal, target_amount: e.target.value})}
                    placeholder="100000"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Current Amount (৳)</label>
                  <input
                    type="number"
                    value={newGoal.current_amount}
                    onChange={(e) => setNewGoal({...newGoal, current_amount: e.target.value})}
                    placeholder="0"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Deadline (Optional)</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowGoalModal(false);
                    setEditingGoal(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoal}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold"
                >
                  {editingGoal ? '✅ Update' : '✅ Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;
