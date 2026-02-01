import React, { useState, useEffect } from 'react';
import { Heart, Activity, TrendingUp, TrendingDown, AlertCircle, Plus, Edit2, Trash2, Calendar, Scale, Ruler, Droplet, Thermometer, Brain, Moon, Utensils } from 'lucide-react';
import api from '../api';

const HealthDashboard = () => {
  const [healthData, setHealthData] = useState({
    weight: '',
    height: '',
    bloodPressure: { systolic: '', diastolic: '' },
    heartRate: '',
    bloodSugar: '',
    temperature: '',
    sleep: ''
  });
  const [hasUserData, setHasUserData] = useState(false);
  const [healthHistory, setHealthHistory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [healthConditions, setHealthConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadHealthData();
    getAISuggestions();
  }, []);

  const loadHealthData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await api.get(`/api/health/profile?userId=${user.id}`);
      if (response.data.success && response.data.data) {
        setHealthData(response.data.data);
        setHasUserData(true);
        setHealthHistory(response.data.history || []);
        setHealthConditions(response.data.conditions || []);
        setMedications(response.data.medications || []);
        getAISuggestions(response.data.data);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  const getAISuggestions = async (data = healthData) => {
    // Only get AI suggestions if user has entered data
    if (!data || !data.weight || !data.height) {
      setAiSuggestions([
        '📝 আপনার স্বাস্থ্য তথ্য যোগ করুন ব্যক্তিগত পরামর্শের জন্য',
        '💧 প্রতিদিন কমপক্ষে ৮ গ্লাস পানি পান করুন',
        '🏃 দিনে ৩০ মিনিট হাঁটুন',
        '🥗 সুষম খাবার খান'
      ]);
      return;
    }
    
    try {
      const response = await api.post('/api/health/ai-suggestions', {
        healthData,
        conditions: healthConditions
      });
      
      if (response.data.success) {
        setAiSuggestions(response.data.suggestions || []);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      setAiSuggestions([
        '💧 প্রতিদিন কমপক্ষে ৮ গ্লাস পানি পান করুন',
        '🏃 দিনে ৩০ মিনিট হাঁটুন',
        '🥗 সুষম খাবার খান',
        '😴 প্রতিদিন ৭-৮ ঘন্টা ঘুমান'
      ]);
    }
  };

  const calculateBMI = () => {
    if (!healthData || !healthData.height || !healthData.weight) return 0;
    const heightInMeters = healthData.height / 100;
    const bmi = healthData.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { status: 'Underweight', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (bmi < 25) return { status: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
    if (bmi < 30) return { status: 'Overweight', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { status: 'Obese', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getBloodPressureStatus = () => {
    if (!healthData || !healthData.bloodPressure) return { status: 'N/A', color: 'text-gray-600' };
    const { systolic, diastolic } = healthData.bloodPressure;
    if (systolic < 120 && diastolic < 80) return { status: 'Normal', color: 'text-green-600' };
    if (systolic < 130 && diastolic < 80) return { status: 'Elevated', color: 'text-yellow-600' };
    if (systolic < 140 || diastolic < 90) return { status: 'High (Stage 1)', color: 'text-orange-600' };
    return { status: 'High (Stage 2)', color: 'text-red-600' };
  };

  const saveHealthData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await api.post('/api/health/update', {
        user_id: user.id,
        ...healthData,
        timestamp: new Date().toISOString()
      });
      
      if (response.data.success) {
        alert('✅ স্বাস্থ্য তথ্য সংরক্ষিত হয়েছে!');
        setHasUserData(true);
        setIsEditing(false);
        loadHealthData();
      }
    } catch (error) {
      console.error('Error saving health data:', error);
      alert('❌ সংরক্ষণে সমস্যা হয়েছে');
    }
  };

  const bmi = parseFloat(calculateBMI());
  const bmiStatus = getBMIStatus(bmi);
  const bpStatus = getBloodPressureStatus();

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <Heart className="w-12 h-12 md:w-16 md:h-16" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">স্বাস্থ্য ব্যবস্থাপনা</h2>
              <p className="text-sm md:text-base opacity-90">আপনার স্বাস্থ্য এবং পণ্য ট্র্যাক করুন</p>
            </div>
          </div>
          <button
            onClick={saveHealthData}
            className="w-full md:w-auto bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            তথ্য সংরক্ষণ করুন
          </button>
        </div>
      </div>

      {/* Editable Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* BMI Card - Calculated */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-red-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <Heart className="w-10 h-10 text-red-500" />
            {bmi && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${bmiStatus.bg} ${bmiStatus.color}`}>
                {bmiStatus.status}
              </span>
            )}
          </div>
          <h3 className="text-gray-700 text-sm font-semibold mb-2">BMI</h3>
          <p className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            {bmi || '--.-'}
          </p>
          <p className="text-xs text-gray-500">Body Mass Index</p>
          <div className="mt-3 pt-3 border-t border-red-200">
            <p className="text-xs text-gray-600">ওজন এবং উচ্চতা থেকে গণনা</p>
          </div>
        </div>

        {/* Blood Pressure - Editable */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-10 h-10 text-blue-500" />
            {healthData.bloodPressure.systolic && healthData.bloodPressure.diastolic && (
              <span className={`text-xs font-bold ${bpStatus.color}`}>
                {bpStatus.status}
              </span>
            )}
          </div>
          <h3 className="text-gray-700 text-sm font-semibold mb-3">রক্তচাপ</h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <input
              type="number"
              placeholder="120"
              value={healthData.bloodPressure.systolic}
              onChange={(e) => setHealthData({
                ...healthData,
                bloodPressure: { ...healthData.bloodPressure, systolic: e.target.value }
              })}
              className="w-20 md:w-24 px-3 py-2 border-2 border-gray-300 rounded-xl text-center text-2xl md:text-3xl font-bold focus:border-blue-500 focus:outline-none bg-white"
            />
            <span className="text-3xl font-bold text-gray-400">/</span>
            <input
              type="number"
              placeholder="80"
              value={healthData.bloodPressure.diastolic}
              onChange={(e) => setHealthData({
                ...healthData,
                bloodPressure: { ...healthData.bloodPressure, diastolic: e.target.value }
              })}
              className="w-20 md:w-24 px-3 py-2 border-2 border-gray-300 rounded-xl text-center text-2xl md:text-3xl font-bold focus:border-blue-500 focus:outline-none bg-white"
            />
          </div>
          <p className="text-xs text-gray-500 text-center">mmHg</p>
        </div>

        {/* Heart Rate - Editable */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-pink-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <Heart className="w-10 h-10 text-pink-500 animate-pulse" />
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-gray-700 text-sm font-semibold mb-3">হৃদস্পন্দন</h3>
          <input
            type="number"
            placeholder="72"
            value={healthData.heartRate}
            onChange={(e) => setHealthData({ ...healthData, heartRate: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-4xl md:text-5xl font-bold text-center focus:border-pink-500 focus:outline-none mb-2 bg-white"
          />
          <p className="text-xs text-gray-500 text-center">BPM</p>
        </div>

        {/* Weight & Height - Editable */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <Scale className="w-10 h-10 text-purple-500" />
            <Ruler className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-gray-700 text-sm font-semibold mb-3">ওজন ও উচ্চতা</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="70"
                value={healthData.weight}
                onChange={(e) => setHealthData({ ...healthData, weight: e.target.value })}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-3xl md:text-4xl font-bold text-center focus:border-purple-500 focus:outline-none bg-white"
              />
              <span className="text-base font-semibold text-gray-600">kg</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="170"
                value={healthData.height}
                onChange={(e) => setHealthData({ ...healthData, height: e.target.value })}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-2xl md:text-3xl font-bold text-center focus:border-purple-500 focus:outline-none bg-white"
              />
              <span className="text-base font-semibold text-gray-600">cm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Vitals */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-600" />
            জীবনীয় লক্ষণ
          </h2>

          <div className="space-y-4">
            {/* Blood Sugar */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-red-400" />
                  <span className="font-semibold text-gray-700">রক্তে শর্করা</span>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={healthData.bloodSugar}
                  onChange={(e) => setHealthData({...healthData, bloodSugar: parseFloat(e.target.value)})}
                  className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg"
                />
                <span className="text-sm text-gray-600">mg/dL</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  healthData.bloodSugar < 100 ? 'bg-green-100 text-green-700' :
                  healthData.bloodSugar < 126 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {healthData.bloodSugar < 100 ? 'Normal' : healthData.bloodSugar < 126 ? 'Prediabetes' : 'High'}
                </span>
              </div>
            </div>

            {/* Temperature */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-400" />
                  <span className="font-semibold text-gray-700">তাপমাত্রা</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  step="0.1"
                  value={healthData.temperature}
                  onChange={(e) => setHealthData({...healthData, temperature: parseFloat(e.target.value)})}
                  className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg"
                />
                <span className="text-sm text-gray-600">°F</span>
              </div>
            </div>

            {/* Sleep */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-400" />
                  <span className="font-semibold text-gray-700">ঘুম</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  step="0.5"
                  value={healthData.sleep}
                  onChange={(e) => setHealthData({...healthData, sleep: parseFloat(e.target.value)})}
                  className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg"
                />
                <span className="text-sm text-gray-600">hours</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  healthData.sleep >= 7 && healthData.sleep <= 9 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {healthData.sleep >= 7 && healthData.sleep <= 9 ? 'Good' : 'Insufficient'}
                </span>
              </div>
            </div>

            {/* Water Intake */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-gray-700">পানি পান</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  step="0.5"
                  value={healthData.waterIntake}
                  onChange={(e) => setHealthData({...healthData, waterIntake: parseFloat(e.target.value)})}
                  className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg"
                />
                <span className="text-sm text-gray-600">liters</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((healthData.waterIntake / 3) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={saveHealthData}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            সংরক্ষণ করুন
          </button>
        </div>

        {/* Right Column - AI Suggestions */}
        <div className="space-y-6">
          {/* AI Suggestions */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              AI পরামর্শ
            </h2>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Health Conditions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">স্বাস্থ্য অবস্থা</h3>
              <button
                onClick={() => {
                  const condition = prompt('স্বাস্থ্য অবস্থা যোগ করুন:');
                  if (condition) {
                    setHealthConditions([...healthConditions, { name: condition, since: new Date().toISOString().split('T')[0] }]);
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                যোগ করুন
              </button>
            </div>
            <div className="space-y-2">
              {healthConditions.length === 0 ? (
                <p className="text-gray-400 text-center py-4">কোন স্বাস্থ্য সমস্যা নেই</p>
              ) : (
                healthConditions.map((condition, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{condition.name}</p>
                      <p className="text-xs text-gray-500">Since: {condition.since}</p>
                    </div>
                    <button
                      onClick={() => setHealthConditions(healthConditions.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">ওষুধ</h3>
              <button
                onClick={() => {
                  const med = prompt('ওষুধের নাম:');
                  if (med) {
                    const dosage = prompt('ডোজ (e.g., 1 tablet, 2 times daily):');
                    setMedications([...medications, { name: med, dosage: dosage || 'Not specified' }]);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                যোগ করুন
              </button>
            </div>
            <div className="space-y-2">
              {medications.length === 0 ? (
                <p className="text-gray-400 text-center py-4">কোন ওষুধ নেই</p>
              ) : (
                medications.map((med, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{med.name}</p>
                      <p className="text-xs text-gray-500">{med.dosage}</p>
                    </div>
                    <button
                      onClick={() => setMedications(medications.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard;
