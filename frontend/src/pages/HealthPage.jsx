import React, { useState } from 'react';
import { Heart, Activity, Apple, Pill, FileText, TrendingUp, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import HealthDashboard from '../components/HealthDashboard';
import ProductTracker from '../components/ProductTracker';
import MedicineTracker from '../components/MedicineTracker';

const HealthPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'স্বাস্থ্য ড্যাশবোর্ড', icon: Activity },
    { id: 'medicines', label: 'ওষুধ', icon: Pill },
    { id: 'products', label: 'পণ্য ট্র্যাকার', icon: Apple }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                স্বাস্থ্য ব্যবস্থাপনা
              </h1>
              <p className="text-gray-600">আপনার স্বাস্থ্য এবং পণ্য ট্র্যাক করুন AI এর সাহায্যে</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b-2 border-gray-200">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-semibold flex items-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-b-4 border-green-600 text-green-600'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && <HealthDashboard />}
        {activeTab === 'medicines' && <MedicineTracker />}
        {activeTab === 'products' && <ProductTracker />}
      </div>
    </div>
  );
};

export default HealthPage;
