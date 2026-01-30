import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, TrendingUp, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import api from '../api';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'Cash'
  });
  
  const getCategoryInfo = (categoryName) => {
    return categories.find(cat => cat.name === categoryName) || categories[0];
  };

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

  const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'Mobile Banking', 'Other'];

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/finance/expenses');
      if (response.data.success) {
        setExpenses(response.data.expenses || []);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      // If API fails, keep empty array
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      alert('অনুগ্রহ করে সঠিক পরিমাণ লিখুন');
      return;
    }
    
    try {
      console.log('Sending expense data:', {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      
      const response = await api.post('/api/finance/expense', {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      
      console.log('Response:', response.data);
      
      if (response.data.success) {
        const newExp = {
          ...response.data.expense,
          _id: response.data.expense._id || Date.now().toString()
        };
        setExpenses([newExp, ...expenses]);
        setNewExpense({
          category: 'Food',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          payment_method: 'Cash'
        });
        setShowAddForm(false);
        alert('✅ খরচ সফলভাবে যোগ করা হয়েছে!');
        // Reload expenses to ensure sync
        loadExpenses();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert(`❌ খরচ যোগ করতে সমস্যা হয়েছে। 
Error: ${error.response?.data?.message || error.message}
আবার চেষ্টা করুন।`);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await api.delete(`/api/finance/expense/${expenseId}`);
      setExpenses(expenses.filter(exp => exp._id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getCategoryTotal = (category) => {
    return expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };
  const getFilteredExpenses = () => {
    if (filterCategory === 'All') {
      return expenses;
    }
    return expenses.filter(exp => exp.category === filterCategory);
  };
  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'bg-green-100 text-green-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Rent': 'bg-red-100 text-red-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Health': 'bg-teal-100 text-teal-800',
      'Education': 'bg-indigo-100 text-indigo-800',
      'Bills': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                📊 Expense Tracker
              </h1>
              <p className="text-gray-600">আপনার খরচ ট্র্যাক করুন এবং নিয়ন্ত্রণ করুন</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadExpenses}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
            <p className="text-4xl font-bold">৳ {getTotalExpenses().toLocaleString()}</p>
            <p className="text-sm mt-2 opacity-90">মোট খরচ</p>
          </div>

          <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
            <p className="text-4xl font-bold">{expenses.length}</p>
            <p className="text-sm mt-2 opacity-90">লেনদেন সংখ্যা</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Average per Transaction</h3>
            <p className="text-4xl font-bold">
              ৳ {expenses.length > 0 ? (getTotalExpenses() / expenses.length).toFixed(0) : 0}
            </p>
            <p className="text-sm mt-2 opacity-90">গড় খরচ</p>
          </div>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Add New Expense</h3>
            <form onSubmit={handleAddExpense}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Amount (৳)</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter amount"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
                  <select
                    value={newExpense.payment_method}
                    onChange={(e) => setNewExpense({...newExpense, payment_method: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Optional description"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  Save Expense
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">Category Breakdown</h3>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map(category => {
              const total = getCategoryTotal(category.name);
              const count = expenses.filter(e => e.category === category.name).length;
              const totalExpenses = getTotalExpenses();
              return (
                <div 
                  key={category.name} 
                  className={`border-2 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                    filterCategory === category.name ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                  }`}
                  onClick={() => setFilterCategory(filterCategory === category.name ? 'All' : category.name)}
                >
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-2 ${category.color} text-white`}>
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">৳{total.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {count} items
                  </p>
                  {total > 0 && totalExpenses > 0 && (
                    <p className="text-xs text-purple-600 mt-1 font-semibold">
                      {((total / totalExpenses) * 100).toFixed(1)}% of total
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              {filterCategory === 'All' ? 'All Expenses' : `${filterCategory} Expenses`}
            </h3>
            {filterCategory !== 'All' && (
              <button
                onClick={() => setFilterCategory('All')}
                className="text-sm text-purple-600 hover:text-purple-800 font-semibold"
              >
                Clear Filter
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 mx-auto text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading expenses...</p>
            </div>
          ) : getFilteredExpenses().length > 0 ? (
            <div className="space-y-3">
              {getFilteredExpenses().map((expense, idx) => {
                const catInfo = getCategoryInfo(expense.category);
                return (
                  <div
                    key={expense._id || idx}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${catInfo.color} text-white`}>
                        <span className="text-lg">{catInfo.icon}</span>
                        <span>{expense.category}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{expense.description || 'No description'}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {expense.date} • {expense.payment_method}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-2xl font-bold text-purple-600">৳{parseFloat(expense.amount).toLocaleString()}</p>
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              {filterCategory === 'All' ? (
                <>
                  <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-xl text-gray-500">কোনো খরচ এখনো যোগ করা হয়নি</p>
                  <p className="mt-2 text-gray-400">উপরে "Add Expense" বাটনে ক্লিক করে শুরু করুন</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-all"
                  >
                    Add Your First Expense
                  </button>
                </>
              ) : (
                <>
                  <Filter className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-xl text-gray-500">No {filterCategory} expenses found</p>
                  <button
                    onClick={() => setFilterCategory('All')}
                    className="mt-4 text-purple-600 hover:text-purple-800 font-semibold"
                  >
                    View All Expenses
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
