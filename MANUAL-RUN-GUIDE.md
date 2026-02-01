# Life Pilot AI - MANUAL RUN GUIDE

## 🚀 How to Run the Project Manually

This is the **CORRECT and TESTED** way to run the project.

---

## Prerequisites

Make sure these are installed:

- **Python 3.8+** → https://www.python.org/
- **Node.js 16+** → https://nodejs.org/
- **MongoDB** → https://www.mongodb.com/try/download/community

---

## Step 1: Start MongoDB

Open a new terminal and run:

```bash
mongod --dbpath C:\data\db
```

If you don't have the data folder, create it first:

```bash
mkdir C:\data\db
mongod --dbpath C:\data\db
```

**Keep this terminal open** - MongoDB needs to run continuously.

---

## Step 2: Start Backend (Flask/Python)

Open a **NEW terminal** and run:

```bash
# Navigate to backend folder
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend"

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies (first time only)
pip install -r requirements.txt

# Run the backend server
python app.py
```

You should see:

```
* Running on http://127.0.0.1:5000
```

**Keep this terminal open** - Backend needs to run continuously.

---

## Step 3: Start Frontend (React/Vite)

Open a **NEW terminal** and run:

```bash
# Navigate to frontend folder
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\frontend"

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

You should see:

```
VITE v5.4.21  ready in 306 ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.0.102:3000/
```

**Keep this terminal open** - Frontend needs to run continuously.

---

## Step 4: Open Browser

Open your browser and go to:

```
http://localhost:3000
```

---

## ✅ What You Should See

### In Browser:

1. **Homepage** with red/black theme
2. **Navigation bar** at the top with all menu items
3. **Feature cards** (AI Advice, Weather, Prayer, Finance, etc.)
4. **Working links** - click on any feature to navigate

### All Pages:

- 🏠 **Home** → Dashboard with all features
- 🤖 **AI Advice** → AI-powered suggestions
- 🌤️ **Weather** → Weather forecast (external link)
- 🕌 **Prayer** → Islamic prayer times
- 💰 **Financial** → Budget, Expenses, Investment advisor
- 🏃 **Health** → Health tracking dashboard
- 📅 **Routine** → Daily routine planner
- ✅ **Tasks** → Task manager
- 📸 **Gallery** → Photo gallery
- 📊 **Reports** → Generate reports
- 🎯 **Events** → Event reminders
- ⚙️ **Settings** → App settings

---

## 🛑 How to Stop

### To stop all services:

1. **MongoDB**: Press `Ctrl+C` in MongoDB terminal
2. **Backend**: Press `Ctrl+C` in Backend terminal
3. **Frontend**: Press `Ctrl+C` in Frontend terminal

OR

Kill all processes:

```powershell
# Stop all Node processes (Frontend)
Get-Process -Name "node" | Stop-Process -Force

# Stop all Python processes (Backend)
Get-Process -Name "python" | Stop-Process -Force

# Stop MongoDB
Get-Process -Name "mongod" | Stop-Process -Force
```

---

## 🔧 Troubleshooting

### Problem: "Port already in use"

```bash
# For Frontend (Port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# For Backend (Port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Problem: "Module not found" (Backend)

```bash
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Problem: "Cannot find module" (Frontend)

```bash
cd frontend
npm install
```

### Problem: "MongoDB connection failed"

Make sure MongoDB is running:

```bash
mongod --dbpath C:\data\db
```

### Problem: "Blank page in browser"

1. Wait 10-15 seconds for servers to fully start
2. Check if Backend is running → http://127.0.0.1:5000/api/health
3. Check if Frontend is running → http://localhost:3000
4. Open browser console (F12) and check for errors
5. Clear browser cache and refresh (Ctrl+Shift+R)

---

## 📂 Project URLs

- **Frontend (React)**: http://localhost:3000
- **Backend (Flask)**: http://127.0.0.1:5000
- **Backend Health Check**: http://127.0.0.1:5000/api/health
- **MongoDB**: mongodb://localhost:27017
- **Database Name**: lifepilot_ai

---

## 💡 Pro Tips

1. **First time setup**: Run `npm install` and `pip install -r requirements.txt` first
2. **Keep terminals open**: All 3 services need to run simultaneously
3. **Check logs**: If something doesn't work, check terminal outputs for errors
4. **Refresh page**: Sometimes you need to refresh the browser after starting
5. **Clear cache**: If page doesn't load, try Ctrl+Shift+R

---

## ✅ Quick Command Reference

### Backend:

```bash
cd backend
.\venv\Scripts\Activate.ps1
python app.py
```

### Frontend:

```bash
cd frontend
npm run dev
```

### MongoDB:

```bash
mongod --dbpath C:\data\db
```

---

## 🎯 Expected Terminal Outputs

### MongoDB:

```
{"t":{"$date":"2026-02-01T..."},"s":"I", "c":"NETWORK",  "id":23016,   "ctx":"listener","msg":"Waiting for connections","attr":{"port":27017,...}}
```

### Backend:

```
 * Serving Flask app 'app'
 * Debug mode: off
WARNING: This is a development server.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.0.102:5000
Press CTRL+C to quit
```

### Frontend:

```
VITE v5.4.21  ready in 306 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.0.102:3000/
  ➜  press h + enter to show help
```

---

## 🎉 Success Checklist

- [ ] MongoDB terminal shows "Waiting for connections"
- [ ] Backend terminal shows "Running on http://127.0.0.1:5000"
- [ ] Frontend terminal shows "Local: http://localhost:3000"
- [ ] Browser opens to http://localhost:3000
- [ ] Homepage loads with red/black theme
- [ ] Navigation bar is visible
- [ ] Can click on different pages (Prayer, Finance, etc.)
- [ ] All pages load without errors

---

## ⚠️ IMPORTANT NOTES

1. **Don't close terminals** - Keep all 3 terminals running
2. **Wait for startup** - Give each service 5-10 seconds to start
3. **Check console** - Open browser DevTools (F12) to see errors
4. **Ports must be free** - Make sure 3000, 5000, and 27017 are available
5. **Run in order** - Start MongoDB first, then Backend, then Frontend

---

## 🆘 Still Having Issues?

If browser shows blank page after following all steps:

1. Open browser console (F12)
2. Check "Console" tab for JavaScript errors
3. Check "Network" tab to see if API calls are failing
4. Verify backend health: http://127.0.0.1:5000/api/health
5. Make sure all 3 terminals show services are running
6. Try a different browser (Chrome, Firefox, Edge)

---

**This project is 100% functional when all 3 services are running properly!**
