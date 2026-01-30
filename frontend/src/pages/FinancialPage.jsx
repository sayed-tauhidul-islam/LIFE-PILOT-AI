import React, { useState } from 'react';
import Footer from '../components/Footer';
import FinanceDashboard from '../components/FinanceDashboard';
import ExpenseTracker from '../components/ExpenseTracker';
import BudgetPlanner from '../components/BudgetPlanner';
import InvestmentAdvisor from '../components/InvestmentAdvisor';
import DailyCostTracker from '../components/DailyCostTracker';
import { DollarSign, TrendingUp, PieChart, Target, Calendar } from 'lucide-react';

const FinancialPage = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'daily', name: 'Daily Cost Tracker', icon: <Calendar className="w-5 h-5" /> },
    { id: 'expenses', name: 'Expense Tracker', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'budget', name: 'Budget Planner', icon: <PieChart className="w-5 h-5" /> },
    { id: 'investment', name: 'Investment Advisor', icon: <Target className="w-5 h-5" /> }
  ];

  const getThemeColors = () => {
    const themes = {
      light: {
        bg: 'bg-white',
        text: 'text-black',
        tabActive: 'bg-red-600 text-white',
        tabInactive: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      },
      dark: {
        bg: 'bg-gray-900',
        text: 'text-white',
        tabActive: 'bg-red-600 text-white',
        tabInactive: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      },
      blue: {
        bg: 'bg-blue-900',
        text: 'text-blue-50',
        tabActive: 'bg-red-600 text-white',
        tabInactive: 'bg-blue-700 text-blue-200 hover:bg-blue-600'
      }
    };
    return themes[theme] || themes.light;
  };

  const colors = getThemeColors();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <FinanceDashboard />;
      case 'daily':
        return <DailyCostTracker />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'budget':
        return <BudgetPlanner />;
      case 'investment':
        return <InvestmentAdvisor />;
      default:
        return <FinanceDashboard />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${colors.bg}`}>
      <div className="flex-grow">
        {/* Header with Tabs */}
        <div className={`${colors.bg} sticky top-0 z-10 shadow-md`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className={`text-4xl font-bold ${colors.text} mb-4 text-center`}>
              Financial <span className="text-red-600">Management System</span>
            </h1>
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id ? colors.tabActive : colors.tabInactive
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="pb-8">
          {renderContent()}
        </div>
      </div>
      
      <Footer theme={theme} />
    </div>
  );
};

export default FinancialPage;
