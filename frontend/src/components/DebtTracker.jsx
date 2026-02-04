import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingDown, DollarSign, Calendar, AlertCircle, Plus, X, Edit2, Trash2, Check } from 'lucide-react';
import api from '../api';

const DebtTracker = () => {
  const [debts, setDebts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [newDebt, setNewDebt] = useState({
    debt_name: '',
    debt_type: 'loan',
    total_amount: '',
    remaining_amount: '',
    interest_rate: '',
    monthly_payment: '',
    due_date: '',
    creditor: '',
    status: 'active'
  });

  const debtTypes = [
    { value: 'loan', label: 'Personal Loan', icon: '💰', color: 'blue' },
    { value: 'credit_card', label: 'Credit Card', icon: '💳', color: 'red' },
    { value: 'mortgage', label: 'Mortgage', icon: '🏠', color: 'green' },
    { value: 'car_loan', label: 'Car Loan', icon: '🚗', color: 'yellow' },
    { value: 'student_loan', label: 'Student Loan', icon: '🎓', color: 'purple' },
    { value: 'medical', label: 'Medical Debt', icon: '🏥', color: 'pink' },
    { value: 'other', label: 'Other', icon: '📄', color: 'gray' }
  ];

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/finance/debts');
      if (response.data.success) {
        setDebts(response.data.debts || []);
      }
    } catch (error) {
      console.error('Error loading debts:', error);
      // Load from localStorage as fallback
      const localDebts = JSON.parse(localStorage.getItem('debts') || '[]');
      setDebts(localDebts);
    }
    setLoading(false);
  };

  const handleSaveDebt = async () => {
    if (!newDebt.debt_name || !newDebt.total_amount || !newDebt.monthly_payment) {
      alert('অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন');
      return;
    }

    try {
      const debtData = {
        ...newDebt,
        total_amount: parseFloat(newDebt.total_amount),
        remaining_amount: parseFloat(newDebt.remaining_amount) || parseFloat(newDebt.total_amount),
        interest_rate: parseFloat(newDebt.interest_rate) || 0,
        monthly_payment: parseFloat(newDebt.monthly_payment)
      };

      if (editingDebt) {
        await api.put(`/api/finance/debt/${editingDebt._id}`, debtData);
        setDebts(debts.map(d => d._id === editingDebt._id ? { ...d, ...debtData } : d));
        alert('✅ ঋণ আপডেট করা হয়েছে!');
      } else {
        const response = await api.post('/api/finance/debt', debtData);
        if (response.data.success) {
          setDebts([...debts, response.data.debt]);
          alert('✅ ঋণ যোগ করা হয়েছে!');
        }
      }

      setShowAddModal(false);
      setEditingDebt(null);
      setNewDebt({
        debt_name: '',
        debt_type: 'loan',
        total_amount: '',
        remaining_amount: '',
        interest_rate: '',
        monthly_payment: '',
        due_date: '',
        creditor: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Error saving debt:', error);
      // Save to localStorage as fallback
      const updatedDebts = editingDebt 
        ? debts.map(d => d._id === editingDebt._id ? { ...d, ...newDebt } : d)
        : [...debts, { ...newDebt, _id: Date.now().toString(), created_at: new Date().toISOString() }];
      setDebts(updatedDebts);
      localStorage.setItem('debts', JSON.stringify(updatedDebts));
      alert('✅ ঋণ সংরক্ষণ করা হয়েছে (Local)!');
      setShowAddModal(false);
      setEditingDebt(null);
    }
  };

  const handleDeleteDebt = async (debtId) => {
    if (!confirm('এই ঋণ ডিলিট করতে চান?')) return;

    try {
      await api.delete(`/api/finance/debt/${debtId}`);
      setDebts(debts.filter(d => d._id !== debtId));
      alert('✅ ঋণ ডিলিট করা হয়েছে');
    } catch (error) {
      console.error('Error deleting debt:', error);
      const updatedDebts = debts.filter(d => d._id !== debtId);
      setDebts(updatedDebts);
      localStorage.setItem('debts', JSON.stringify(updatedDebts));
      alert('✅ ঋণ ডিলিট করা হয়েছে (Local)');
    }
  };

  const calculateTotalDebt = () => {
    return debts.reduce((sum, debt) => sum + (parseFloat(debt.remaining_amount) || 0), 0);
  };

  const calculateMonthlyPayments = () => {
    return debts.reduce((sum, debt) => sum + (parseFloat(debt.monthly_payment) || 0), 0);
  };

  const calculatePayoffTime = (remaining, monthlyPayment, interestRate) => {
    if (monthlyPayment <= 0) return 'N/A';
    const monthlyRate = (interestRate / 100) / 12;
    if (monthlyRate === 0) {
      return Math.ceil(remaining / monthlyPayment);
    }
    const months = Math.log(monthlyPayment / (monthlyPayment - remaining * monthlyRate)) / Math.log(1 + monthlyRate);
    return Math.ceil(months);
  };

  const getColorClass = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-700',
      red: 'from-red-500 to-red-700',
      green: 'from-green-500 to-green-700',
      yellow: 'from-yellow-500 to-yellow-700',
      purple: 'from-purple-500 to-purple-700',
      pink: 'from-pink-500 to-pink-700',
      gray: 'from-gray-500 to-gray-700'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <CreditCard className="text-red-600" />
                Debt Tracker
              </h1>
              <p className="text-gray-600">ঋণ ট্র্যাকিং এবং পরিশোধ পরিকল্পনা</p>
            </div>
            <button
              onClick={() => {
                setEditingDebt(null);
                setNewDebt({
                  debt_name: '',
                  debt_type: 'loan',
                  total_amount: '',
                  remaining_amount: '',
                  interest_rate: '',
                  monthly_payment: '',
                  due_date: '',
                  creditor: '',
                  status: 'active'
                });
                setShowAddModal(true);
              }}
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Debt
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" />
              <AlertCircle className="w-6 h-6 opacity-70" />
            </div>
            <p className="text-sm opacity-90">Total Debt</p>
            <p className="text-3xl font-bold">৳{calculateTotalDebt().toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8" />
              <TrendingDown className="w-6 h-6 opacity-70" />
            </div>
            <p className="text-sm opacity-90">Monthly Payments</p>
            <p className="text-3xl font-bold">৳{calculateMonthlyPayments().toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-8 h-8" />
              <Check className="w-6 h-6 opacity-70" />
            </div>
            <p className="text-sm opacity-90">Active Debts</p>
            <p className="text-3xl font-bold">{debts.filter(d => d.status === 'active').length}</p>
          </div>
        </div>

        {/* Debts List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Debts</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading debts...</p>
            </div>
          ) : debts.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No debts tracked yet</p>
              <p className="text-gray-400 text-sm">Add your first debt to start tracking</p>
            </div>
          ) : (
            <div className="space-y-4">
              {debts.map((debt) => {
                const debtType = debtTypes.find(t => t.value === debt.debt_type) || debtTypes[0];
                const progress = ((debt.total_amount - debt.remaining_amount) / debt.total_amount * 100).toFixed(1);
                const payoffMonths = calculatePayoffTime(debt.remaining_amount, debt.monthly_payment, debt.interest_rate);

                return (
                  <div key={debt._id} className={`bg-gradient-to-r ${getColorClass(debtType.color)} rounded-xl p-6 text-white shadow-lg`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{debtType.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold">{debt.debt_name}</h3>
                          <p className="text-sm opacity-90">{debtType.label}</p>
                          {debt.creditor && <p className="text-xs opacity-75">Creditor: {debt.creditor}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingDebt(debt);
                            setNewDebt(debt);
                            setShowAddModal(true);
                          }}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDebt(debt._id)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs opacity-75">Total Debt</p>
                        <p className="text-lg font-bold">৳{debt.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75">Remaining</p>
                        <p className="text-lg font-bold">৳{debt.remaining_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75">Monthly Payment</p>
                        <p className="text-lg font-bold">৳{debt.monthly_payment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75">Interest Rate</p>
                        <p className="text-lg font-bold">{debt.interest_rate}%</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Payment Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-3">
                        <div
                          className="bg-white rounded-full h-3 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Payoff Time: {typeof payoffMonths === 'number' ? `${payoffMonths} months` : payoffMonths}</span>
                      {debt.due_date && <span>Due: {new Date(debt.due_date).toLocaleDateString()}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add/Edit Debt Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingDebt ? '✏️ Edit Debt' : '➕ Add New Debt'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDebt(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Debt Name *</label>
                    <input
                      type="text"
                      value={newDebt.debt_name}
                      onChange={(e) => setNewDebt({ ...newDebt, debt_name: e.target.value })}
                      placeholder="e.g., Home Loan, Credit Card"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Debt Type *</label>
                    <select
                      value={newDebt.debt_type}
                      onChange={(e) => setNewDebt({ ...newDebt, debt_type: e.target.value })}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    >
                      {debtTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Total Amount (৳) *</label>
                    <input
                      type="number"
                      value={newDebt.total_amount}
                      onChange={(e) => setNewDebt({ ...newDebt, total_amount: e.target.value })}
                      placeholder="100000"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Remaining Amount (৳)</label>
                    <input
                      type="number"
                      value={newDebt.remaining_amount}
                      onChange={(e) => setNewDebt({ ...newDebt, remaining_amount: e.target.value })}
                      placeholder="50000"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Monthly Payment (৳) *</label>
                    <input
                      type="number"
                      value={newDebt.monthly_payment}
                      onChange={(e) => setNewDebt({ ...newDebt, monthly_payment: e.target.value })}
                      placeholder="5000"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newDebt.interest_rate}
                      onChange={(e) => setNewDebt({ ...newDebt, interest_rate: e.target.value })}
                      placeholder="10.5"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newDebt.due_date}
                      onChange={(e) => setNewDebt({ ...newDebt, due_date: e.target.value })}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Creditor</label>
                    <input
                      type="text"
                      value={newDebt.creditor}
                      onChange={(e) => setNewDebt({ ...newDebt, creditor: e.target.value })}
                      placeholder="Bank name or creditor"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDebt(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDebt}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:shadow-lg font-semibold"
                >
                  {editingDebt ? '✅ Update' : '✅ Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtTracker;
