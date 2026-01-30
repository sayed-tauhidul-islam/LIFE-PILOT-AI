# 🚀 HOW TO RUN THE PROJECT & FIX BUTTON ISSUES

## ✅ All Issues Fixed!

**Problems Solved:**

- ✅ Backend imports successfully
- ✅ All Python packages installed
- ✅ All npm packages installed (recharts, lucide-react)
- ✅ Duplicate function names fixed
- ✅ Data directory created with synthetic data
- ✅ Finance API endpoints ready
- ✅ Buttons will work when backend is running

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start Backend Server

```bash
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend"
python app.py
```

**You should see:**

```
* Running on http://127.0.0.1:5000
* Press CTRL+C to quit
```

### Step 2: Start Frontend (New Terminal)

```bash
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\frontend"
npm run dev
```

**You should see:**

```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:3000/
➜  press h + enter to show help
```

### Step 3: Open Browser

```
http://localhost:3000
```

**Navigate to:** Financial → Click any button!

---

## 🔘 Button Guide - What Each Button Does

### 1. Dashboard Tab - "Get AI Advice" Button

**Location:** Financial Management System → Dashboard

**What it does:**

- Analyzes your income and expenses
- Calculates financial health score (0-100)
- Provides personalized suggestions in Bengali
- Recommends budget allocation

**API Call:**

```javascript
POST /api/finance/ai-suggestions
{
  "income": 50000,
  "expenses": 30000,
  "age": 25,
  "risk_tolerance": "moderate"
}
```

**Returns:**

- Financial health score
- AI suggestions in Bengali
- Budget recommendations

---

### 2. Budget Planner Tab - "Get AI Advice" Button

**Location:** Financial Management System → Budget Planner

**What it does:**

- Takes your income, age, city, family size
- Uses AI to recommend optimal budget
- Shows category-wise allocation
- Provides savings suggestions

**API Call:**

```javascript
POST /api/finance/budget-recommendation
{
  "income": 50000,
  "age": 25,
  "city": "Dhaka",
  "family_size": 2
}
```

**Returns:**

- Budget profile (Conservative/Balanced/Aggressive)
- Category allocations (Food, Rent, Transport, etc.)
- Savings targets
- Budget tips

---

### 3. Investment Advisor Tab - "Get Advice" Button

**Location:** Financial Management System → Investment Advisor

**What it does:**

- Analyzes your age, income, investment horizon
- Determines risk profile
- Recommends investment portfolio
- Shows expected returns

**API Call:**

```javascript
POST /api/finance/investment-advice
{
  "user_data": {
    "age": 25,
    "income": 50000,
    "investment_horizon": 10,
    "dependents": 0,
    "has_emergency_fund": false
  },
  "investment_amount": 100000
}
```

**Returns:**

- Risk profile
- Asset allocation (Stocks, Bonds, FDs, etc.)
- Expected returns (1-year, 5-year)
- Investment recommendations

---

### 4. Expense Tracker Tab - "Add Expense" Button

**Location:** Financial Management System → Expense Tracker → + Add Expense

**What it does:**

- Opens expense form
- Lets you add new expense
- Saves to database
- Updates statistics instantly

**API Call:**

```javascript
POST /api/finance/expense
{
  "category": "Food",
  "amount": 1500,
  "description": "Grocery shopping",
  "date": "2026-01-29",
  "payment_method": "Cash"
}
```

**Returns:**

- Success message
- Updated expense list

---

## 🛠️ Troubleshooting Button Issues

### Issue 1: Button Does Nothing

**Problem:** Backend not running

**Solution:**

```bash
# Terminal 1: Start backend
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend"
python app.py
```

---

### Issue 2: "Network Error" or "Failed to fetch"

**Problem:** Frontend can't connect to backend

**Check:**

1. Backend is running on port 5000
2. No firewall blocking
3. CORS is enabled (already done in app.py)

**Solution:**

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Or open in browser
http://localhost:5000/api/health
```

---

### Issue 3: "Module not found" in Backend

**Problem:** Missing Python packages

**Solution:**

```bash
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend"
pip install -r requirements.txt
pip install faker beautifulsoup4 yfinance
```

---

### Issue 4: Button Shows Error Message

**Problem:** Invalid data input

**Solution:**

- Fill all required fields
- Enter valid numbers for income/amount
- Select valid options from dropdowns

---

### Issue 5: No Data Shows After Button Click

**Problem:** Database not initialized or no data

**Solution:**

```bash
# Generate sample data
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend"
python synthetic_data_generator.py
```

---

## 📋 Complete Startup Checklist

### ✅ Before Starting:

- [ ] Python installed (3.9+)
- [ ] Node.js installed (16+)
- [ ] MongoDB installed (optional for now)
- [ ] Git Bash or PowerShell available

### ✅ Backend Setup:

```bash
cd backend
pip install -r requirements.txt
pip install faker beautifulsoup4 yfinance
python synthetic_data_generator.py
```

### ✅ Frontend Setup:

```bash
cd frontend
npm install
npm install recharts lucide-react
```

### ✅ Run:

```bash
# Terminal 1: Backend
cd backend
python app.py

# Terminal 2: Frontend
cd frontend
npm run dev

# Browser
http://localhost:3000
```

---

## 🎨 What You Should See

### Dashboard Tab:

- Summary cards (Income, Expenses, Savings)
- Expense distribution pie chart
- Financial goals with progress bars
- "Get AI Advice" button (blue)
- AI suggestions section
- Financial health score

### Expense Tracker Tab:

- "+ Add Expense" button (purple)
- Category breakdown cards
- Total expenses summary
- Recent expenses list
- Delete buttons for each expense

### Budget Planner Tab:

- User profile form
- "Get AI Advice" button (blue)
- Budget allocation display
- 50-30-20 rule tips
- Budget planning tips

### Investment Advisor Tab:

- User profile form
- "Get Advice" button (green)
- Risk profile display
- Portfolio allocation cards
- Expected returns
- Action steps

---

## 🔍 Test Button Functionality

### Test 1: Dashboard AI Advice

1. Go to Financial → Dashboard
2. Click "Get AI Advice" (blue button)
3. See AI suggestions appear in Bengali
4. Check financial health score (0-100)

### Test 2: Budget Recommendation

1. Go to Financial → Budget Planner
2. Enter income: 50000
3. Enter age: 25
4. Select family size: 2
5. Click "Get AI Advice"
6. See budget allocations

### Test 3: Investment Advice

1. Go to Financial → Investment Advisor
2. Fill all profile fields
3. Enter investment amount: 100000
4. Click "Get Advice"
5. See portfolio recommendations

### Test 4: Add Expense

1. Go to Financial → Expense Tracker
2. Click "+ Add Expense"
3. Fill form:
   - Category: Food
   - Amount: 1500
   - Description: Grocery
   - Date: Today
4. Click "Add Expense"
5. See new expense in list

---

## 📊 Data Files Location

**CSV Files are in:**

```
F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend\data\
```

**Contains:**

- personal_finance_data.csv (12,000 records)
- transaction_data.csv (50,000 records)
- financial_goals_data.csv (1,256 records)
- investment_data.csv (1,240 records)

**To add your own data:**
Simply replace these CSV files with your own!

---

## 🚨 Common Errors & Solutions

### Error: "Address already in use"

```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Error: "CORS policy"

Already fixed in app.py with flask-cors

### Error: "Cannot find module 'recharts'"

```bash
cd frontend
npm install recharts lucide-react
```

### Error: "No module named 'flask'"

```bash
cd backend
pip install -r requirements.txt
```

---

## 💡 Pro Tips

1. **Keep both terminals open** (backend + frontend)
2. **Check console** (F12 in browser) for errors
3. **Backend logs** show API calls in terminal
4. **Data persists** in backend/data/ folder
5. **Refresh browser** if buttons don't respond

---

## 🎯 Success Indicators

**Backend Running:**

```
* Running on http://127.0.0.1:5000
```

**Frontend Running:**

```
➜  Local:   http://localhost:3000/
```

**Buttons Working:**

- Click → Shows loading state
- API call happens
- Data appears
- No console errors

---

## 📞 Need More Help?

1. Check `DATA-LOCATION-GUIDE.md` for data file info
2. Check `FINANCE-SYSTEM-DOCS.md` for complete docs
3. Check browser console (F12) for frontend errors
4. Check terminal for backend errors

---

## ✨ Quick Commands Reference

```bash
# Backend
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend"
python app.py

# Frontend
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\frontend"
npm run dev

# Generate Data
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend"
python synthetic_data_generator.py

# Check Data
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend\data"
dir *.csv

# Test API
curl http://localhost:5000/api/health
```

---

**🎉 All buttons should work now! Just start both servers and click away!**
