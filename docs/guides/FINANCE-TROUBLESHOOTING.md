# Finance System Troubleshooting Guide

## সমস্যা সমাধান গাইড (Troubleshooting Guide)

### 1. Backend Server সমস্যা

#### লক্ষণ (Symptoms):

- "Network Error" দেখাচ্ছে
- "ব্যাকএন্ড সার্ভার চালু আছে কিনা চেক করুন" মেসেজ আসছে
- API calls fail হচ্ছে

#### সমাধান (Solution):

```bash
# Backend server start করুন
cd backend
python app.py
```

**অথবা start-all.bat ব্যবহার করুন:**

```bash
start-all.bat
```

### 2. MongoDB সমস্যা

#### লক্ষণ (Symptoms):

- Backend start হচ্ছে কিন্তু data save/load হচ্ছে না
- "Database connection error" দেখাচ্ছে

#### সমাধান (Solution):

```bash
# MongoDB চালু আছে কিনা চেক করুন
tasklist | findstr mongod

# যদি না চালু থাকে, MongoDB start করুন
net start MongoDB
```

### 3. Frontend Connection সমস্যা

#### লক্ষণ (Symptoms):

- Frontend load হচ্ছে কিন্তু API calls fail হচ্ছে
- CORS error দেখাচ্ছে

#### সমাধান (Solution):

1. Backend সঠিকভাবে চালু আছে কিনা verify করুন: http://127.0.0.1:5000
2. Frontend এর api/index.js file check করুন
3. Browser console দেখুন কোন specific error আছে কিনা

### 4. Income Update সমস্যা

#### Error: "আয় আপডেট করতে সমস্যা হয়েছে"

**Possible Causes:**

1. Backend server চালু নেই
2. MongoDB connection issue
3. Invalid income value

**Solution:**

1. Backend চালু করুন
2. Valid number দিন (positive number)
3. Browser console check করুন exact error দেখতে

### 5. Expense Adding সমস্যা

#### Error: "খরচ যোগ করতে সমস্যা হয়েছে"

**Possible Causes:**

1. Backend API endpoint না পাওয়া যাচ্ছে
2. Required fields missing
3. Database write error

**Solution:**

1. সব required fields fill করুন:
   - Category
   - Amount (positive number)
   - Date
   - Payment method
2. Backend logs check করুন
3. MongoDB connection verify করুন

### 6. Budget Recommendation সমস্যা

#### Error: "Failed to get recommendation"

**Possible Causes:**

1. Backend server চালু নেই
2. Invalid income amount
3. API endpoint error

**Solution:**

1. Valid income amount দিন (> 0)
2. Backend running verify করুন
3. Check backend/finance_manager.py properly loaded আছে কিনা

### 7. Investment Advice সমস্যা

#### Error: "Failed to get investment advice"

**Possible Causes:**

1. Backend API not responding
2. Invalid investment amount
3. Finance manager module error

**Solution:**

1. Valid investment amount দিন
2. Backend logs check করুন
3. finance_manager.py import error আছে কিনা check করুন

## Quick Start চেকলিস্ট

✅ 1. MongoDB চালু আছে?

```bash
tasklist | findstr mongod
```

✅ 2. Backend চালু আছে?

```bash
cd backend
python app.py
```

Backend এ দেখাবে: `Running on http://127.0.0.1:5000`

✅ 3. Frontend চালু আছে?

```bash
cd frontend
npm run dev
```

Frontend এ দেখাবে: `http://localhost:3000`

✅ 4. Browser console check করুন:

- Press F12
- Console tab দেখুন
- কোন red error আছে কিনা check করুন

## Error Messages এবং তাদের অর্থ

| Error Message                   | বাংলা অর্থ                          | Solution                                                  |
| ------------------------------- | ----------------------------------- | --------------------------------------------------------- |
| Network Error                   | Backend এর সাথে connection হচ্ছে না | Backend server চালু করুন                                  |
| Failed to get recommendation    | Budget recommendation API fail      | Income amount ঠিক আছে কিনা check করুন                     |
| Failed to get investment advice | Investment API fail                 | Investment amount ঠিক আছে কিনা check করুন                 |
| আয় আপডেট করতে সমস্যা হয়েছে    | Income update fail হয়েছে           | Backend running এবং valid amount দিয়েছেন কিনা check করুন |
| খরচ যোগ করতে সমস্যা হয়েছে      | Expense add fail হয়েছে             | সব fields সঠিকভাবে fill করা আছে কিনা check করুন           |

## Backend API Endpoints

যেসব endpoints ব্যবহার করা হচ্ছে:

1. `GET/POST /api/finance/profile` - User income profile
2. `POST /api/finance/expense` - Add expense
3. `GET /api/finance/expenses` - Get all expenses
4. `POST /api/finance/goal` - Add financial goal
5. `GET /api/finance/goals` - Get all goals
6. `POST /api/finance/ai-suggestions` - Get AI suggestions
7. `POST /api/finance/budget-recommendation` - Get budget plan
8. `POST /api/finance/investment-advice` - Get investment advice
9. `GET /api/finance/daily-expenses` - Get daily cost tracking data

## Testing Process

### 1. Test Backend Directly:

```bash
# PowerShell থেকে test করুন
$response = Invoke-RestMethod -Uri http://127.0.0.1:5000/api/finance/profile -Method GET
$response
```

### 2. Test with curl:

```bash
curl http://127.0.0.1:5000/api/finance/profile
```

### 3. Browser থেকে test:

Direct browser এ যান: http://127.0.0.1:5000/api/finance/profile

## সাধারণ সমস্যা এবং সমাধান

### Problem: সব কিছু ঠিক আছে তবুও error দেখাচ্ছে

**Solution:**

1. Browser cache clear করুন (Ctrl + Shift + Delete)
2. Hard reload করুন (Ctrl + Shift + R)
3. Both servers restart করুন
4. MongoDB restart করুন

### Problem: Data save হচ্ছে না

**Solution:**

1. MongoDB running verify করুন
2. Database connection string check করুন (database.py এ)
3. Backend logs check করুন console এ

### Problem: Slow response

**Solution:**

1. MongoDB indexes properly set করা আছে কিনা check করুন
2. Backend logs check করুন কোন warnings আছে কিনা
3. Network connection check করুন

## Support এবং Debugging

যদি আরও সমস্যা হয়:

1. **Backend Logs দেখুন:**
   Backend terminal window এ কি error দেখাচ্ছে

2. **Browser Console দেখুন:**
   F12 press করে Console tab এ যান

3. **MongoDB Logs দেখুন:**
   MongoDB log file check করুন

4. **File Permissions:**
   সব files এবং folders এ proper read/write permission আছে কিনা check করুন

## Useful Commands

```bash
# Check all running processes
tasklist | findstr "python mongod node"

# Kill backend server
taskkill /F /IM python.exe

# Kill frontend server
taskkill /F /IM node.exe

# Check ports
netstat -ano | findstr ":5000"
netstat -ano | findstr ":3000"
```

## Environment Variables

Backend `.env` file (optional):

```
MONGODB_URI=mongodb://localhost:27017/
DATABASE_NAME=lifepilot_ai
FLASK_DEBUG=False
```

## নোট (Notes)

- সব features এর জন্য Backend এবং MongoDB দুটোই চালু থাকতে হবে
- Frontend শুধু UI, সব logic Backend এ
- MongoDB তে data persistent store হয়
- Error messages এখন Bangla তে user-friendly
- Detailed error information console এ দেখা যাবে

---

**আরও সাহায্যের জন্য:** Backend terminal এবং Browser console এর screenshot পাঠান।
