import React, { useState } from 'react';
import { TrendingUp, PieChart as PieIcon, Target, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import api from '../api';

const InvestmentAdvisor = () => {
  const [userProfile, setUserProfile] = useState({
    age: 25,
    income: 50000,
    income_stable: true,
    investment_horizon: 10,
    dependents: 0,
    emergency_fund: false
  });

  const [investmentAmount, setInvestmentAmount] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRecommendation = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/finance/investment-advice', {
        user_data: userProfile,
        investment_amount: parseFloat(investmentAmount)
      });
      
      setRecommendation(response.data);
    } catch (error) {
      console.error('Error getting investment advice:', error);
      alert('Failed to get investment advice');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (profile) => {
    const colors = {
      conservative: 'text-green-600 bg-green-100',
      moderate: 'text-yellow-600 bg-yellow-100',
      aggressive: 'text-red-600 bg-red-100'
    };
    return colors[profile] || colors.moderate;
  };

  const getAssetColor = (asset) => {
    const colors = {
      stocks: 'from-blue-400 to-blue-600',
      bonds: 'from-green-400 to-green-600',
      mutual_funds: 'from-purple-400 to-purple-600',
      fixed_deposits: 'from-yellow-400 to-yellow-600',
      gold: 'from-orange-400 to-orange-600',
      real_estate: 'from-red-400 to-red-600'
    };
    return colors[asset] || 'from-gray-400 to-gray-600';
  };

  const getAssetIcon = (asset) => {
    const icons = {
      stocks: '📈',
      bonds: '📊',
      mutual_funds: '💼',
      fixed_deposits: '🏦',
      gold: '🪙',
      real_estate: '🏠'
    };
    return icons[asset] || '💰';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📈 Investment Advisor
          </h1>
          <p className="text-gray-600">AI-চালিত বিনিয়োগ পরামর্শ সেবা</p>
        </div>

        {/* User Profile Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Age</label>
              <input
                type="number"
                value={userProfile.age}
                onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="18"
                max="100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Monthly Income (৳)</label>
              <input
                type="number"
                value={userProfile.income}
                onChange={(e) => setUserProfile({...userProfile, income: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Investment Horizon (years)</label>
              <input
                type="number"
                value={userProfile.investment_horizon}
                onChange={(e) => setUserProfile({...userProfile, investment_horizon: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Number of Dependents</label>
              <input
                type="number"
                value={userProfile.dependents}
                onChange={(e) => setUserProfile({...userProfile, dependents: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Income Stable?</label>
              <select
                value={userProfile.income_stable.toString()}
                onChange={(e) => setUserProfile({...userProfile, income_stable: e.target.value === 'true'})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Emergency Fund?</label>
              <select
                value={userProfile.emergency_fund.toString()}
                onChange={(e) => setUserProfile({...userProfile, emergency_fund: e.target.value === 'true'})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Investment Amount */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Investment Amount</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-2xl font-bold"
                placeholder="Enter amount to invest (৳)"
                min="0"
              />
            </div>
            <button
              onClick={getRecommendation}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Analyzing...' : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Get Advice
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recommendation Display */}
        {recommendation && (
          <>
            {/* Risk Profile */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Risk Profile</h3>
              <div className="flex items-center gap-4">
                <div className={`px-6 py-3 rounded-full text-2xl font-bold ${getRiskColor(recommendation.risk_profile)}`}>
                  {recommendation.risk_profile.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-gray-600">Expected Annual Return</p>
                  <p className="text-3xl font-bold text-green-600">{recommendation.expected_return}%</p>
                </div>
              </div>
            </div>

            {/* Portfolio Allocation */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Recommended Portfolio Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendation.portfolio.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${getAssetColor(item.asset)} rounded-xl p-6 text-white shadow-lg`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-4xl">{getAssetIcon(item.asset)}</span>
                      <span className="text-3xl font-bold">{item.percentage}%</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2 capitalize">
                      {item.asset.replace('_', ' ')}
                    </h4>
                    <p className="text-2xl font-bold mb-2">৳{item.amount.toLocaleString()}</p>
                    <p className="text-sm opacity-90">{item.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projections */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Investment Projections</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-2">Initial Investment</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ৳{recommendation.investment_amount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-2">Value After 1 Year</p>
                  <p className="text-3xl font-bold text-green-600">
                    ৳{recommendation.projections['1_year'].toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    +৳{(recommendation.projections['1_year'] - recommendation.investment_amount).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-2">Value After 5 Years</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ৳{recommendation.projections['5_year'].toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    +৳{(recommendation.projections['5_year'] - recommendation.investment_amount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Next Steps</h3>
              <div className="space-y-3">
                {recommendation.next_steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Investment Tips */}
        {!recommendation && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">💡 Investment Tips</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <Info className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Diversify Your Portfolio</h4>
                  <p className="text-gray-600">বিভিন্ন ধরনের এসেটে বিনিয়োগ করে রিস্ক কমান</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <Info className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Start Early</h4>
                  <p className="text-gray-600">যত আগে শুরু করবেন, তত বেশি কম্পাউন্ডিং বেনিফিট পাবেন</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Emergency Fund First</h4>
                  <p className="text-gray-600">বিনিয়োগের আগে ইমার্জেন্সি ফান্ড তৈরি করুন (৬ মাসের খরচ)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <Info className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Long-term Focus</h4>
                  <p className="text-gray-600">দীর্ঘমেয়াদী বিনিয়োগ সবসময় ভালো রিটার্ন দেয়</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentAdvisor;
