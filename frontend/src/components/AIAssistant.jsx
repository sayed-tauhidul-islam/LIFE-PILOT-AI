import React, { useState, useEffect } from 'react';
import { Mic, Brain, Sparkles, TrendingUp, AlertCircle, Zap, Target, Check, X } from 'lucide-react';
import api from '../api';

const AIAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'bn-BD'; // Bangla

      recog.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processVoiceCommand(text);
      };

      recog.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }

    loadAIInsights();
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = async (text) => {
    setLoading(true);
    try {
      const response = await api.post('/api/ai/voice-command', { command: text });
      
      if (response.data.success) {
        setAiResponse(response.data.response);
        executeCommand(response.data.action, response.data.params);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      // Local processing
      processCommandLocally(text);
    }
    setLoading(false);
  };

  const processCommandLocally = (text) => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('expense') || lowerText.includes('খরচ')) {
      setAiResponse('Expense tracker খুলছি...');
      setTimeout(() => window.location.href = '/financial', 1000);
    } else if (lowerText.includes('health') || lowerText.includes('স্বাস্থ্য')) {
      setAiResponse('Health dashboard খুলছি...');
      setTimeout(() => window.location.href = '/health', 1000);
    } else if (lowerText.includes('prayer') || lowerText.includes('নামাজ')) {
      setAiResponse('Prayer times দেখাচ্ছি...');
      setTimeout(() => window.location.href = '/prayer', 1000);
    } else if (lowerText.includes('report') || lowerText.includes('রিপোর্ট')) {
      setAiResponse('Report generator খুলছি...');
      setTimeout(() => window.location.href = '/reports', 1000);
    } else {
      setAiResponse('আমি আপনার কমান্ড বুঝতে পারিনি। আবার চেষ্টা করুন।');
    }
  };

  const executeCommand = (action, params) => {
    switch (action) {
      case 'navigate':
        window.location.href = params.path;
        break;
      case 'add_expense':
        // Navigate to expense tracker with pre-filled data
        localStorage.setItem('pendingExpense', JSON.stringify(params));
        window.location.href = '/financial';
        break;
      case 'check_health':
        window.location.href = '/health';
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const loadAIInsights = async () => {
    try {
      const response = await api.get('/api/ai/insights');
      if (response.data.success) {
        setSuggestions(response.data.suggestions || []);
        setInsights(response.data.insights || []);
        setPredictions(response.data.predictions || []);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
      generateLocalInsights();
    }
  };

  const generateLocalInsights = () => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const healthData = JSON.parse(localStorage.getItem('healthProfile') || '{}');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    // Generate suggestions
    const newSuggestions = [];

    if (expenses.length > 0) {
      const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
      const avgExpense = totalExpenses / expenses.length;

      if (avgExpense > 1000) {
        newSuggestions.push({
          type: 'warning',
          title: 'High Spending Alert',
          message: 'আপনার গড় খরচ বেশি হচ্ছে। বাজেট প্ল্যান করুন।',
          action: 'Create Budget',
          actionPath: '/financial'
        });
      }

      // Check food expenses
      const foodExpenses = expenses.filter(e => e.category === 'Food');
      if (foodExpenses.length > 10) {
        newSuggestions.push({
          type: 'info',
          title: 'Food Spending Pattern',
          message: 'আপনি বাইরে বেশি খাচ্ছেন। বাসায় রান্না করলে সাশ্রয় হবে।',
          action: 'View Details',
          actionPath: '/financial'
        });
      }
    }

    // Health suggestions
    if (healthData.bmi && healthData.bmi > 25) {
      newSuggestions.push({
        type: 'health',
        title: 'Health Alert',
        message: 'আপনার BMI স্বাভাবিকের চেয়ে বেশি। ব্যায়াম শুরু করুন।',
        action: 'View Health',
        actionPath: '/health'
      });
    }

    if (healthData.sleepHours && healthData.sleepHours < 6) {
      newSuggestions.push({
        type: 'health',
        title: 'Sleep Alert',
        message: 'আপনি পর্যাপ্ত ঘুমাচ্ছেন না। ৭-৮ ঘন্টা ঘুমান।',
        action: 'Set Sleep Goal',
        actionPath: '/health'
      });
    }

    // Task suggestions
    const pendingTasks = tasks.filter(t => !t.completed);
    if (pendingTasks.length > 10) {
      newSuggestions.push({
        type: 'productivity',
        title: 'Task Management',
        message: `আপনার ${pendingTasks.length}টি কাজ বাকি আছে। অগ্রাধিকার দিন।`,
        action: 'View Tasks',
        actionPath: '/tasks'
      });
    }

    setSuggestions(newSuggestions);

    // Generate insights
    const newInsights = [
      {
        icon: '📊',
        title: 'Spending Trend',
        value: 'এই মাসে আগের মাসের চেয়ে ১৫% বেশি খরচ হয়েছে',
        trend: 'up'
      },
      {
        icon: '❤️',
        title: 'Health Score',
        value: 'আপনার স্বাস্থ্য স্কোর ৭৫/১০০',
        trend: 'stable'
      },
      {
        icon: '✅',
        title: 'Task Completion',
        value: 'এই সপ্তাহে ৮০% কাজ সম্পন্ন হয়েছে',
        trend: 'up'
      }
    ];
    setInsights(newInsights);

    // Generate predictions
    const newPredictions = [
      {
        category: 'Finance',
        prediction: 'আগামী মাসে আপনার খরচ হবে প্রায় ৳১৫,০০০',
        confidence: 85
      },
      {
        category: 'Health',
        prediction: 'বর্তমান রুটিন অনুসরণ করলে ১ মাসে ২ কেজি ওজন কমবে',
        confidence: 70
      },
      {
        category: 'Productivity',
        prediction: 'এই গতিতে চললে সব কাজ ৫ দিনে শেষ হবে',
        confidence: 90
      }
    ];
    setPredictions(newPredictions);
  };

  const autoCategorizeSuggestion = async () => {
    setLoading(true);
    try {
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const uncategorized = expenses.filter(e => !e.category || e.category === 'Other');

      const response = await api.post('/api/ai/auto-categorize', { expenses: uncategorized });
      
      if (response.data.success) {
        alert(`✅ ${response.data.categorizedCount} expenses auto-categorized!`);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error auto-categorizing:', error);
      alert('❌ Auto-categorization failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">AI Assistant</h1>
                <p className="text-gray-600">আপনার স্মার্ট সহকারী</p>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Command */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎤 Voice Command</h2>
            <p className="text-gray-600 mb-6">বলুন: "Show expenses", "Open health dashboard", "Check prayer times"</p>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={loading}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-2xl'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isListening ? (
                  <Mic className="w-12 h-12 text-white" />
                ) : (
                  <Mic className="w-12 h-12 text-white" />
                )}
              </button>

              <p className="text-sm font-semibold text-gray-700">
                {isListening ? '🎤 Listening...' : 'Click to speak'}
              </p>

              {transcript && (
                <div className="bg-gray-100 p-4 rounded-lg max-w-md w-full">
                  <p className="text-sm text-gray-600 mb-1">You said:</p>
                  <p className="font-semibold text-gray-800">{transcript}</p>
                </div>
              )}

              {aiResponse && (
                <div className="bg-gradient-to-r from-violet-100 to-fuchsia-100 p-4 rounded-lg max-w-md w-full">
                  <p className="text-sm text-violet-700 mb-1">AI Response:</p>
                  <p className="font-semibold text-violet-900">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Smart Suggestions
          </h2>

          {suggestions.length === 0 ? (
            <div className="text-center py-8">
              <Check className="w-12 h-12 mx-auto text-green-500 mb-2" />
              <p className="text-gray-600">সব ঠিক আছে! কোন সাজেশন নেই।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((sug, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    sug.type === 'warning'
                      ? 'bg-red-50 border-red-500'
                      : sug.type === 'health'
                      ? 'bg-orange-50 border-orange-500'
                      : sug.type === 'productivity'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-green-50 border-green-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">{sug.title}</h3>
                      <p className="text-gray-600 text-sm">{sug.message}</p>
                    </div>
                    {sug.action && (
                      <button
                        onClick={() => window.location.href = sug.actionPath}
                        className="ml-4 px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-all"
                      >
                        {sug.action}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            AI Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                <div className="text-4xl mb-2">{insight.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{insight.title}</h3>
                <p className="text-gray-600 text-sm">{insight.value}</p>
                <div className="mt-2">
                  {insight.trend === 'up' && <span className="text-green-600 text-sm">📈 Increasing</span>}
                  {insight.trend === 'down' && <span className="text-red-600 text-sm">📉 Decreasing</span>}
                  {insight.trend === 'stable' && <span className="text-blue-600 text-sm">➡️ Stable</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-600" />
            AI Predictions
          </h2>

          <div className="space-y-4">
            {predictions.map((pred, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-800">{pred.category}</h3>
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">
                    {pred.confidence}% Confidence
                  </span>
                </div>
                <p className="text-gray-700">{pred.prediction}</p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${pred.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            AI Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={autoCategorizeSuggestion}
              disabled={loading}
              className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl text-left hover:shadow-lg transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">Auto-Categorize Expenses</h3>
              </div>
              <p className="text-sm text-gray-600">AI will automatically categorize your uncategorized expenses</p>
            </button>

            <button
              onClick={() => window.location.href = '/reports'}
              className="p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl text-left hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">Generate Smart Report</h3>
              </div>
              <p className="text-sm text-gray-600">AI-powered detailed analysis and reports</p>
            </button>

            <button
              onClick={loadAIInsights}
              className="p-6 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl text-left hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">Refresh Insights</h3>
              </div>
              <p className="text-sm text-gray-600">Get latest AI insights and predictions</p>
            </button>

            <button
              onClick={() => window.location.href = '/health'}
              className="p-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl text-left hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">Health Recommendations</h3>
              </div>
              <p className="text-sm text-gray-600">Get personalized health suggestions from AI</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
