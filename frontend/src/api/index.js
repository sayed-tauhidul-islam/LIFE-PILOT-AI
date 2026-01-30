import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// User API
export const userAPI = {
  createProfile: (data) => api.post('/api/user/profile', data),
  getProfile: (userId) => api.get(`/api/user/profile/${userId}`),
}

// Advice API
export const adviceAPI = {
  getDailyAdvice: (userId) => api.get('/api/advice/daily', { params: { user_id: userId } }),
  getTodayTasks: (userId) => api.get('/api/tasks/today', { params: { user_id: userId } }),
}

// Routine API
export const routineAPI = {
  createRoutine: (data) => api.post('/api/routine/create', data),
}

// Financial API
export const financialAPI = {
  getAnalysis: (userId) => api.get('/api/financial/analysis', { params: { user_id: userId } }),
  // Finance endpoints
  getProfile: () => api.get('/api/finance/profile'),
  getExpenses: () => api.get('/api/finance/expenses'),
  getGoals: () => api.get('/api/finance/goals'),
  addExpense: (data) => api.post('/api/finance/expense', data),
  deleteExpense: (expenseId) => api.delete(`/api/finance/expense/${expenseId}`),
  getAISuggestions: (data) => api.post('/api/finance/ai-suggestions', data),
  getBudgetRecommendation: (data) => api.post('/api/finance/budget-recommendation', data),
  getInvestmentAdvice: (data) => api.post('/api/finance/investment-advice', data),
  addGoal: (data) => api.post('/api/finance/goal', data),
  getGoalProgress: (goalId) => api.get(`/api/finance/goal-progress/${goalId}`),
  getExpensePrediction: (data) => api.post('/api/finance/expense-prediction', data),
}

// Meeting API
export const meetingAPI = {
  addMeeting: (data) => api.post('/api/meeting/add', data),
}

// Health check
export const healthCheck = () => api.get('/api/health')

export default api
