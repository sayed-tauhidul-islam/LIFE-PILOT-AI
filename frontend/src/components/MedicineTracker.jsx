import React, { useState, useEffect } from 'react';
import { Pill, Clock, Plus, Trash2, Bell, Check, AlertCircle } from 'lucide-react';
import api from '../api';

const MedicineTracker = () => {
  const [medicines, setMedicines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    times: {
      morning: false,
      afternoon: false,
      evening: false,
      night: false
    },
    startDate: '',
    endDate: '',
    notes: ''
  });

  const timeSlots = [
    { id: 'morning', label: 'সকাল', icon: '🌅', time: '08:00' },
    { id: 'afternoon', label: 'দুপুর', icon: '☀️', time: '14:00' },
    { id: 'evening', label: 'বিকাল', icon: '🌆', time: '18:00' },
    { id: 'night', label: 'রাত', icon: '🌙', time: '22:00' }
  ];

  useEffect(() => {
    loadMedicines();
    checkReminders();
  }, []);

  const loadMedicines = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await api.get(`/api/medicines?userId=${user.id}`);
      setMedicines(response.data || []);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  const checkReminders = () => {
    // Check current time and show reminders
    const now = new Date();
    const currentHour = now.getHours();
    
    medicines.forEach(medicine => {
      if (medicine.times.morning && currentHour === 8) {
        showNotification(medicine, 'সকাল');
      } else if (medicine.times.afternoon && currentHour === 14) {
        showNotification(medicine, 'দুপুর');
      } else if (medicine.times.evening && currentHour === 18) {
        showNotification(medicine, 'বিকাল');
      } else if (medicine.times.night && currentHour === 22) {
        showNotification(medicine, 'রাত');
      }
    });
  };

  const showNotification = (medicine, timeSlot) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ওষুধ খাওয়ার সময়', {
        body: `${medicine.name} (${medicine.dosage}) - ${timeSlot}`,
        icon: '/medicine-icon.png'
      });
    }
  };

  const handleAddMedicine = async () => {
    try {
      if (!newMedicine.name || !newMedicine.dosage) {
        alert('ওষুধের নাম এবং ডোজ প্রদান করুন');
        return;
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await api.post('/api/medicines', {
        ...newMedicine,
        userId: user.id,
        createdAt: new Date().toISOString()
      });

      setMedicines([...medicines, response.data]);
      setShowAddModal(false);
      setNewMedicine({
        name: '',
        dosage: '',
        times: { morning: false, afternoon: false, evening: false, night: false },
        startDate: '',
        endDate: '',
        notes: ''
      });
      alert('✅ ওষুধ যোগ করা হয়েছে!');
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('❌ ওষুধ যোগ করতে সমস্যা হয়েছে');
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (window.confirm('ওষুধটি মুছে ফেলতে চান?')) {
      try {
        await api.delete(`/api/medicines/${id}`);
        setMedicines(medicines.filter(m => m._id !== id));
        alert('✅ ওষুধ মুছে ফেলা হয়েছে');
      } catch (error) {
        console.error('Error deleting medicine:', error);
        alert('❌ মুছে ফেলতে সমস্যা হয়েছে');
      }
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-xl p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Pill className="w-12 h-12" />
          <div>
            <h2 className="text-3xl font-bold">ওষুধ ট্র্যাকার</h2>
            <p className="text-sm opacity-90">সময়মতো ওষুধ খাওয়ার অনুস্মারক</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          ওষুধ যোগ করুন
        </button>
      </div>

      {/* Notification Permission */}
      {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default' && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-semibold text-yellow-800 mb-2">অনুস্মারক সক্রিয় করুন</p>
            <p className="text-sm text-yellow-700 mb-3">
              সময়মতো ওষুধ খাওয়ার জন্য ব্রাউজার নোটিফিকেশন সক্রিয় করুন
            </p>
            <button
              onClick={requestNotificationPermission}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-700 transition-all"
            >
              অনুমতি দিন
            </button>
          </div>
        </div>
      )}

      {/* Medicine List */}
      {medicines.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Pill className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">কোনো ওষুধ যোগ করা হয়নি</h3>
          <p className="text-gray-600 mb-6">আপনার ওষুধের তালিকা যোগ করে শুরু করুন</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            প্রথম ওষুধ যোগ করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {medicines.map((medicine) => (
            <div key={medicine._id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-purple-500 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{medicine.name}</h3>
                  <p className="text-sm text-gray-600">ডোজ: {medicine.dosage}</p>
                </div>
                <button
                  onClick={() => handleDeleteMedicine(medicine._id)}
                  className="text-red-600 hover:text-red-800 transition-colors p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {timeSlots.map((slot) => (
                  medicine.times[slot.id] && (
                    <div key={slot.id} className="bg-purple-50 rounded-lg p-3 flex items-center gap-2">
                      <span className="text-2xl">{slot.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{slot.label}</p>
                        <p className="text-xs text-gray-600">{slot.time}</p>
                      </div>
                      <Check className="w-4 h-4 text-green-600 ml-auto" />
                    </div>
                  )
                ))}
              </div>

              {/* Course Duration */}
              {medicine.startDate && medicine.endDate && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">কোর্স:</span> {new Date(medicine.startDate).toLocaleDateString('bn-BD')} - {new Date(medicine.endDate).toLocaleDateString('bn-BD')}
                  </p>
                </div>
              )}

              {medicine.notes && (
                <p className="text-sm text-gray-600 mt-3">
                  <span className="font-semibold">নোট:</span> {medicine.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">নতুন ওষুধ যোগ করুন</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Medicine Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ওষুধের নাম *
                </label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  placeholder="যেমন: Napa 500mg"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Dosage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ডোজ *
                </label>
                <input
                  type="text"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                  placeholder="যেমন: ১টি ট্যাবলেট"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  সময় নির্বাচন করুন *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setNewMedicine({
                        ...newMedicine,
                        times: { ...newMedicine.times, [slot.id]: !newMedicine.times[slot.id] }
                      })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        newMedicine.times[slot.id]
                          ? 'bg-purple-100 border-purple-500'
                          : 'bg-gray-50 border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{slot.icon}</span>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">{slot.label}</p>
                          <p className="text-sm text-gray-600">{slot.time}</p>
                        </div>
                        {newMedicine.times[slot.id] && (
                          <Check className="w-5 h-5 text-purple-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    শুরুর তারিখ
                  </label>
                  <input
                    type="date"
                    value={newMedicine.startDate}
                    onChange={(e) => setNewMedicine({ ...newMedicine, startDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    শেষ তারিখ
                  </label>
                  <input
                    type="date"
                    value={newMedicine.endDate}
                    onChange={(e) => setNewMedicine({ ...newMedicine, endDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  নোট (ঐচ্ছিক)
                </label>
                <textarea
                  value={newMedicine.notes}
                  onChange={(e) => setNewMedicine({ ...newMedicine, notes: e.target.value })}
                  placeholder="যেমন: খাবারের পরে খেতে হবে"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleAddMedicine}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all"
              >
                ওষুধ যোগ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineTracker;
