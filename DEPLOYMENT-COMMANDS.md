# 🚀 Quick Deployment Commands - Life Pilot AI

## Initial Setup (একবার মাত্র)

### 1. Git Initialize

```powershell
cd "f:\My projects\Life-Pilot-AI\LP-AI-Agent"
git init
git add .
git commit -m "Initial commit - Life Pilot AI Complete v1.0"
```

### 2. GitHub এ Push করুন

```powershell
# আপনার GitHub username দিয়ে replace করুন
git remote add origin https://github.com/YOUR-USERNAME/Life-Pilot-AI.git
git branch -M main
git push -u origin main
```

---

## Regular Updates (যখন code পরিবর্তন করবেন)

### Step 1: Changes Save করুন

```powershell
cd "f:\My projects\Life-Pilot-AI\LP-AI-Agent"
git add .
git commit -m "Update: [আপনার পরিবর্তনের বর্ণনা]"
git push origin main
```

### Step 2: Vercel Automatic Deploy করবে ✅

কিছু করতে হবে না! GitHub এ push করার সাথে সাথে Vercel automatically deploy করবে।

---

## প্রথমবার Vercel Setup

### Frontend Deploy

1. https://vercel.com এ যান
2. GitHub দিয়ে login করুন
3. "New Project" ক্লিক করুন
4. `Life-Pilot-AI` repository select করুন
5. Configuration:
   - Framework: **Vite**
   - Root Directory: **frontend**
   - Build Command: **npm run build**
   - Output Directory: **dist**

6. Environment Variables যোগ করুন:

   ```
   VITE_API_URL = https://your-backend-url.onrender.com
   ```

7. "Deploy" ক্লিক করুন

---

## Backend Deploy (Render.com)

### Step 1: Render Account

1. https://render.com এ যান
2. GitHub দিয়ে sign up করুন

### Step 2: New Web Service

1. "New" > "Web Service" ক্লিক করুন
2. `Life-Pilot-AI` repository select করুন
3. Configuration:

   ```
   Name: life-pilot-backend
   Environment: Python 3
   Region: Singapore
   Branch: main
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   ```

4. Environment Variables:

   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/lifepilot
   PORT = 5000
   FLASK_ENV = production
   ```

5. "Create Web Service" ক্লিক করুন

---

## MongoDB Atlas Setup

### Step 1: Cluster তৈরি করুন

1. https://www.mongodb.com/cloud/atlas এ যান
2. "Try Free" ক্লিক করুন
3. Free Shared Cluster তৈরি করুন
4. Region: **Singapore**

### Step 2: User তৈরি করুন

1. Security > Database Access
2. "Add New Database User"
3. Username ও Password set করুন

### Step 3: Network Access

1. Security > Network Access
2. "Add IP Address"
3. **Allow Access from Anywhere** (0.0.0.0/0)

### Step 4: Connection String Copy করুন

```
mongodb+srv://username:password@cluster.mongodb.net/lifepilot?retryWrites=true&w=majority
```

---

## Testing Commands

### Frontend Local Test

```powershell
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

### Backend Local Test

```powershell
cd backend
pip install -r requirements.txt
python app.py
```

Visit: http://localhost:5000/api/health

---

## Useful Git Commands

### Check Status

```powershell
git status
```

### See Changes

```powershell
git diff
```

### Undo Last Commit (local only)

```powershell
git reset --soft HEAD~1
```

### Force Push (সাবধানে ব্যবহার করুন!)

```powershell
git push -f origin main
```

### Create New Branch

```powershell
git checkout -b feature/new-feature
```

### Switch Branch

```powershell
git checkout main
```

---

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=https://life-pilot-backend.onrender.com
```

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lifepilot
PORT=5000
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
```

---

## Vercel CLI Commands (Optional)

### Install Vercel CLI

```powershell
npm i -g vercel
```

### Login

```powershell
vercel login
```

### Deploy

```powershell
cd frontend
vercel
```

### Deploy to Production

```powershell
vercel --prod
```

---

## MongoDB Commands

### Connect via MongoDB Compass

```
mongodb+srv://username:password@cluster.mongodb.net/lifepilot
```

### Backup Database

```powershell
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/lifepilot" --out=./backup
```

### Restore Database

```powershell
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/lifepilot" ./backup
```

---

## Package Management

### Install New Package (Frontend)

```powershell
cd frontend
npm install package-name
```

### Install New Package (Backend)

```powershell
cd backend
pip install package-name
pip freeze > requirements.txt
```

---

## Build Commands

### Frontend Production Build

```powershell
cd frontend
npm run build
```

### Frontend Preview

```powershell
npm run preview
```

---

## Logs এবং Debugging

### Vercel Logs

```powershell
vercel logs
```

### Render Logs

Dashboard > Logs tab থেকে দেখুন

---

## Quick Links

- **GitHub**: https://github.com/YOUR-USERNAME/Life-Pilot-AI
- **Vercel**: https://vercel.com/dashboard
- **Render**: https://dashboard.render.com
- **MongoDB**: https://cloud.mongodb.com

---

## Support এবং Help

### Vercel Support

- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

### Render Support

- Docs: https://render.com/docs
- Community: https://community.render.com

### MongoDB Support

- Docs: https://www.mongodb.com/docs
- Forum: https://www.mongodb.com/community/forums

---

**Last Updated**: February 1, 2026
**Version**: 1.0
