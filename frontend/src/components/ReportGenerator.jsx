import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, PieChart, BarChart3, Calendar, DollarSign, Activity, Heart, Clock, Target, Filter, X } from 'lucide-react';
import api from '../api';

const ReportGenerator = () => {
  const [reportType, setReportType] = useState('finance'); // 'finance', 'health', 'tasks', 'overall'
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year', 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'finance', label: '💰 Finance Report', color: 'bg-green-500', icon: DollarSign },
    { value: 'health', label: '❤️ Health Report', color: 'bg-red-500', icon: Heart },
    { value: 'tasks', label: '✅ Task Report', color: 'bg-blue-500', icon: Target },
    { value: 'overall', label: '📊 Overall Report', color: 'bg-purple-500', icon: BarChart3 }
  ];

  useEffect(() => {
    if (reportType) {
      generateReport();
    }
  }, [reportType, dateRange]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/reports/generate', {
        type: reportType,
        dateRange,
        startDate,
        endDate
      });

      if (response.data.success) {
        setReportData(response.data.report);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      // Generate from localStorage
      generateLocalReport();
    }
    setLoading(false);
  };

  const generateLocalReport = () => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const healthData = JSON.parse(localStorage.getItem('healthProfile') || '{}');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    const now = new Date();
    let filterDate = new Date();

    switch (dateRange) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    let report = {};

    if (reportType === 'finance' || reportType === 'overall') {
      const filteredExpenses = expenses.filter(e => 
        new Date(e.created_at || e.date) >= filterDate
      );

      const totalExpenses = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
      const categoryBreakdown = {};
      
      filteredExpenses.forEach(e => {
        categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + parseFloat(e.amount || 0);
      });

      report.finance = {
        totalExpenses,
        expenseCount: filteredExpenses.length,
        categoryBreakdown,
        avgPerDay: totalExpenses / getDaysDiff(filterDate, now),
        topCategory: Object.keys(categoryBreakdown).reduce((a, b) => 
          categoryBreakdown[a] > categoryBreakdown[b] ? a : b, ''
        )
      };
    }

    if (reportType === 'health' || reportType === 'overall') {
      report.health = {
        bmi: healthData.bmi || 0,
        weight: healthData.weight || 0,
        bloodPressure: healthData.bloodPressure || 'N/A',
        heartRate: healthData.heartRate || 0,
        bloodSugar: healthData.bloodSugar || 0,
        temperature: healthData.temperature || 0,
        sleepHours: healthData.sleepHours || 0,
        waterIntake: healthData.waterIntake || 0
      };
    }

    if (reportType === 'tasks' || reportType === 'overall') {
      const completedTasks = tasks.filter(t => t.completed);
      const pendingTasks = tasks.filter(t => !t.completed);

      report.tasks = {
        total: tasks.length,
        completed: completedTasks.length,
        pending: pendingTasks.length,
        completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length * 100).toFixed(1) : 0
      };
    }

    setReportData(report);
  };

  const getDaysDiff = (date1, date2) => {
    const diff = Math.abs(date2 - date1);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const downloadPDF = () => {
    if (!reportData) return;

    // Create a printable version
    const printWindow = window.open('', '_blank');
    const content = generatePrintableReport();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Life Pilot AI - Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #6366f1;
              border-bottom: 3px solid #6366f1;
              padding-bottom: 10px;
            }
            h2 {
              color: #4f46e5;
              margin-top: 30px;
            }
            .stat-card {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin: 10px 0;
            }
            .stat-label {
              font-weight: bold;
              color: #6b7280;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 12px;
              text-align: left;
            }
            th {
              background: #f9fafb;
              font-weight: bold;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #9ca3af;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const generatePrintableReport = () => {
    const date = new Date().toLocaleDateString('bn-BD');
    let html = `
      <h1>📊 Life Pilot AI Report</h1>
      <p><strong>Report Type:</strong> ${reportTypes.find(r => r.value === reportType)?.label}</p>
      <p><strong>Date Range:</strong> ${dateRange === 'custom' ? `${startDate} to ${endDate}` : dateRange}</p>
      <p><strong>Generated:</strong> ${date}</p>
    `;

    if (reportData?.finance) {
      html += `
        <h2>💰 Finance Summary</h2>
        <div class="stat-card">
          <div class="stat-label">Total Expenses</div>
          <div class="stat-value">৳${reportData.finance.totalExpenses.toFixed(2)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Number of Transactions</div>
          <div class="stat-value">${reportData.finance.expenseCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Average per Day</div>
          <div class="stat-value">৳${reportData.finance.avgPerDay.toFixed(2)}</div>
        </div>
        
        <h3>Category Breakdown</h3>
        <table>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Percentage</th>
          </tr>
          ${Object.keys(reportData.finance.categoryBreakdown).map(cat => `
            <tr>
              <td>${cat}</td>
              <td>৳${reportData.finance.categoryBreakdown[cat].toFixed(2)}</td>
              <td>${((reportData.finance.categoryBreakdown[cat] / reportData.finance.totalExpenses) * 100).toFixed(1)}%</td>
            </tr>
          `).join('')}
        </table>
      `;
    }

    if (reportData?.health) {
      html += `
        <h2>❤️ Health Summary</h2>
        <table>
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>BMI</td><td>${reportData.health.bmi}</td></tr>
          <tr><td>Weight</td><td>${reportData.health.weight} kg</td></tr>
          <tr><td>Blood Pressure</td><td>${reportData.health.bloodPressure}</td></tr>
          <tr><td>Heart Rate</td><td>${reportData.health.heartRate} BPM</td></tr>
          <tr><td>Blood Sugar</td><td>${reportData.health.bloodSugar} mg/dL</td></tr>
          <tr><td>Temperature</td><td>${reportData.health.temperature} °F</td></tr>
          <tr><td>Sleep Hours</td><td>${reportData.health.sleepHours} hours</td></tr>
          <tr><td>Water Intake</td><td>${reportData.health.waterIntake} liters</td></tr>
        </table>
      `;
    }

    if (reportData?.tasks) {
      html += `
        <h2>✅ Task Summary</h2>
        <div class="stat-card">
          <div class="stat-label">Total Tasks</div>
          <div class="stat-value">${reportData.tasks.total}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Completed Tasks</div>
          <div class="stat-value">${reportData.tasks.completed}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Completion Rate</div>
          <div class="stat-value">${reportData.tasks.completionRate}%</div>
        </div>
      `;
    }

    html += `
      <div class="footer">
        <p>Generated by Life Pilot AI</p>
        <p>© ${new Date().getFullYear()} All Rights Reserved</p>
      </div>
    `;

    return html;
  };

  const downloadCSV = () => {
    if (!reportData) return;

    let csv = 'Life Pilot AI Report\n';
    csv += `Report Type,${reportType}\n`;
    csv += `Date Range,${dateRange}\n`;
    csv += `Generated,${new Date().toISOString()}\n\n`;

    if (reportData?.finance) {
      csv += 'Finance Summary\n';
      csv += `Total Expenses,${reportData.finance.totalExpenses}\n`;
      csv += `Expense Count,${reportData.finance.expenseCount}\n`;
      csv += `Average per Day,${reportData.finance.avgPerDay}\n\n`;
      csv += 'Category,Amount\n';
      Object.keys(reportData.finance.categoryBreakdown).forEach(cat => {
        csv += `${cat},${reportData.finance.categoryBreakdown[cat]}\n`;
      });
      csv += '\n';
    }

    if (reportData?.health) {
      csv += 'Health Summary\n';
      csv += `BMI,${reportData.health.bmi}\n`;
      csv += `Weight,${reportData.health.weight}\n`;
      csv += `Blood Pressure,${reportData.health.bloodPressure}\n`;
      csv += `Heart Rate,${reportData.health.heartRate}\n`;
      csv += '\n';
    }

    if (reportData?.tasks) {
      csv += 'Task Summary\n';
      csv += `Total Tasks,${reportData.tasks.total}\n`;
      csv += `Completed,${reportData.tasks.completed}\n`;
      csv += `Pending,${reportData.tasks.pending}\n`;
      csv += `Completion Rate,${reportData.tasks.completionRate}%\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-pilot-report-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">রিপোর্ট জেনারেটর</h1>
                <p className="text-gray-600">বিস্তারিত রিপোর্ট তৈরি করুন এবং ডাউনলোড করুন</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">রিপোর্ট টাইপ নির্বাচন করুন</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {reportTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setReportType(type.value)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    reportType === type.value
                      ? `${type.color} text-white border-transparent shadow-lg`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold text-center">{type.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">সময়কাল নির্বাচন করুন</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {[
              { value: 'week', label: '📅 Last Week' },
              { value: 'month', label: '📅 Last Month' },
              { value: 'year', label: '📅 Last Year' },
              { value: 'custom', label: '🔧 Custom Range' }
            ].map(range => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  dateRange === range.value
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={generateReport}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700"
              >
                Generate
              </button>
            </div>
          )}
        </div>

        {/* Report Display */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">রিপোর্ট তৈরি হচ্ছে...</p>
          </div>
        ) : reportData ? (
          <>
            {/* Download Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={downloadPDF}
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={downloadCSV}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download CSV
                </button>
              </div>
            </div>

            {/* Finance Report */}
            {reportData.finance && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  Finance Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-80">Total Expenses</p>
                    <p className="text-4xl font-bold">৳{reportData.finance.totalExpenses.toFixed(2)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-80">Transactions</p>
                    <p className="text-4xl font-bold">{reportData.finance.expenseCount}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-80">Avg per Day</p>
                    <p className="text-4xl font-bold">৳{reportData.finance.avgPerDay.toFixed(2)}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-4">Category Breakdown</h3>
                <div className="space-y-3">
                  {Object.keys(reportData.finance.categoryBreakdown).map(category => {
                    const amount = reportData.finance.categoryBreakdown[category];
                    const percentage = ((amount / reportData.finance.totalExpenses) * 100).toFixed(1);
                    return (
                      <div key={category} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-800">{category}</span>
                          <span className="text-gray-600">৳{amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Health Report */}
            {reportData.health && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-600" />
                  Health Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'BMI', value: reportData.health.bmi, unit: '', color: 'blue' },
                    { label: 'Weight', value: reportData.health.weight, unit: 'kg', color: 'green' },
                    { label: 'Blood Pressure', value: reportData.health.bloodPressure, unit: '', color: 'red' },
                    { label: 'Heart Rate', value: reportData.health.heartRate, unit: 'BPM', color: 'pink' },
                    { label: 'Blood Sugar', value: reportData.health.bloodSugar, unit: 'mg/dL', color: 'purple' },
                    { label: 'Temperature', value: reportData.health.temperature, unit: '°F', color: 'orange' },
                    { label: 'Sleep', value: reportData.health.sleepHours, unit: 'hours', color: 'indigo' },
                    { label: 'Water', value: reportData.health.waterIntake, unit: 'liters', color: 'cyan' }
                  ].map(metric => (
                    <div key={metric.label} className={`bg-gradient-to-br from-${metric.color}-400 to-${metric.color}-600 rounded-xl p-4 text-white`}>
                      <p className="text-sm opacity-80">{metric.label}</p>
                      <p className="text-3xl font-bold">{metric.value} {metric.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks Report */}
            {reportData.tasks && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  Task Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-80">Total Tasks</p>
                    <p className="text-4xl font-bold">{reportData.tasks.total}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-80">Completed</p>
                    <p className="text-4xl font-bold">{reportData.tasks.completed}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-80">Completion Rate</p>
                    <p className="text-4xl font-bold">{reportData.tasks.completionRate}%</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">রিপোর্ট তৈরি করতে উপরের অপশন নির্বাচন করুন</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;
