# 🚀 GitHub & Vercel Deployment Guide - Life Pilot AI

## 📋 সম্পূর্ণ Deployment Process

### ধাপ ১: GitHub এ Code Upload করুন

#### 1.1 Git Initialize করুন (যদি আগে না করে থাকেন)

```bash
cd "f:\My projects\Life-Pilot-AI\LP-AI-Agent"
git init
git add .
git commit -m "Initial commit - Life Pilot AI Complete"
```

#### 1.2 GitHub Repository তৈরি করুন

1. GitHub এ যান: https://github.com
2. উপরে ডানদিকে "+" ক্লিক করে "New repository" select করুন
3. Repository name দিন: `Life-Pilot-AI`
4. Description দিন: "AI-powered life management system"
5. Public রাখুন (অথবা Private - আপনার ইচ্ছা)
6. **Create repository** button এ ক্লিক করুন

#### 1.3 Local Code GitHub এ Push করুন

```bash
# Repository যোগ করুন
git remote add origin https://github.com/YOUR-USERNAME/Life-Pilot-AI.git

# Main branch এ rename করুন
git branch -M main

# Code push করুন
git push -u origin main
```

**Note**: `YOUR-USERNAME` এর জায়গায় আপনার GitHub username দিন

### ধাপ ২: Vercel এ Frontend Deploy করুন

#### 2.1 Vercel Account তৈরি করুন

1. Vercel এ যান: https://vercel.com
2. "Sign Up" ক্লিক করুন
3. GitHub দিয়ে login করুন (Recommended)

#### 2.2 New Project তৈরি করুন

1. Vercel dashboard এ যান
2. "Add New" > "Project" ক্লিক করুন
3. GitHub repository `Life-Pilot-AI` select করুন
4. "Import" ক্লিক করুন

#### 2.3 Frontend Configuration

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 2.4 Environment Variables যোগ করুন

Vercel dashboard এ Environment Variables section এ:

```
VITE_API_URL = https://your-backend-url.com
```

**Note**: Backend URL এখনো পাননি? নিচে দেখুন backend deployment

#### 2.5 Deploy করুন

1. "Deploy" button এ ক্লিক করুন
2. Wait 2-3 minutes for build
3. Deploy complete হলে URL পাবেন: `https://your-app.vercel.app`

### ধাপ ৩: Backend Deploy করুন

#### Option A: Render.com (Recommended - Free)

##### 3.1 Render Account তৈরি করুন

1. Render এ যান: https://render.com
2. "Get Started" ক্লিক করুন
3. GitHub দিয়ে sign up করুন

##### 3.2 New Web Service তৈরি করুন

1. Dashboard এ "New" > "Web Service" ক্লিক করুন
2. GitHub repository `Life-Pilot-AI` select করুন
3. Configure করুন:

```
Name: life-pilot-backend
Environment: Python 3
Region: Singapore (or closest to Bangladesh)
Branch: main
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: python app.py
```

##### 3.3 Environment Variables যোগ করুন

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/lifepilot?retryWrites=true&w=majority
PORT = 5000
FLASK_ENV = production
```

##### 3.4 Deploy করুন

1. "Create Web Service" ক্লিক করুন
2. 5-10 minutes wait করুন
3. URL পাবেন: `https://life-pilot-backend.onrender.com`

#### Option B: Railway.app (Alternative)

##### 3.1 Railway Account

1. Railway এ যান: https://railway.app
2. GitHub দিয়ে login করুন

##### 3.2 New Project

1. "New Project" > "Deploy from GitHub repo"
2. `Life-Pilot-AI` select করুন
3. Environment variables set করুন
4. Deploy automatically হবে

### ধাপ ৪: MongoDB Atlas Setup (Database)

#### 4.1 MongoDB Atlas Account

1. MongoDB Atlas এ যান: https://www.mongodb.com/cloud/atlas
2. "Try Free" ক্লিক করে sign up করুন

#### 4.2 Cluster তৈরি করুন

1. "Build a Database" ক্লিক করুন
2. "Free Shared" plan select করুন
3. Cloud Provider: AWS
4. Region: Singapore (closest to Bangladesh)
5. Cluster Name: `LifePilotCluster`
6. "Create" ক্লিক করুন

#### 4.3 Database User তৈরি করুন

1. Security > Database Access এ যান
2. "Add New Database User" ক্লিক করুন
3. Username ও Password set করুন
4. User Privileges: "Atlas admin"
5. "Add User" ক্লিক করুন

#### 4.4 Network Access Setup

1. Security > Network Access এ যান
2. "Add IP Address" ক্লিক করুন
3. "Allow Access from Anywhere" select করুন (0.0.0.0/0)
4. "Confirm" ক্লিক করুন

#### 4.5 Connection String পান

1. Dashboard > "Connect" button ক্লিক করুন
2. "Connect your application" select করুন
3. Connection string copy করুন:

```
mongodb+srv://username:password@lifepilotcluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### ধাপ ৫: Final Configuration

#### 5.1 Backend এ MongoDB Connection

Render/Railway environment variables এ:

```
MONGODB_URI = [আপনার MongoDB connection string]
```

#### 5.2 Frontend এ Backend URL

Vercel environment variables update করুন:

```
VITE_API_URL = https://life-pilot-backend.onrender.com
```

#### 5.3 Redeploy

1. Vercel dashboard থেকে "Deployments" tab এ যান
2. Latest deployment এর পাশে "..." ক্লিক করে "Redeploy" করুন

### ধাপ ৬: Testing করুন

#### 6.1 Website Visit করুন

- Frontend URL: `https://your-app.vercel.app`
- Backend Health Check: `https://your-backend.onrender.com/api/health`

#### 6.2 Features Test করুন

- ✅ User Registration/Login
- ✅ Health Dashboard
- ✅ Prayer Times
- ✅ Medicine Tracker
- ✅ Routine Planner
- ✅ Financial Tracker

### 📱 Mobile Testing

#### Android/iOS Testing

1. আপনার mobile browser এ website open করুন
2. সব features test করুন
3. Touch targets check করুন
4. Responsive layout verify করুন

### 🔄 Future Updates করার জন্য

#### Code Update Process

```bash
# Local changes করার পর
git add .
git commit -m "Update: [বর্ণনা]"
git push origin main
```

**Vercel Automatic Deployment**: GitHub এ push করার সাথে সাথে Vercel automatically redeploy করবে!

**Render Manual Deployment**: Render dashboard থেকে "Manual Deploy" > "Deploy latest commit" করুন

### 🎯 Domain Name Setup (Optional)

#### Custom Domain যোগ করুন (যেমন: lifepilot.com)

##### Vercel এ:

1. Project Settings > Domains
2. Domain name enter করুন
3. DNS records configure করুন provider এর dashboard এ

##### Domain Provider (Namecheap/GoDaddy):

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### 🔧 Troubleshooting

#### Problem 1: Backend 502 Error

**Solution**:

- Render logs check করুন
- Environment variables verify করুন
- MongoDB connection string ঠিক আছে কিনা check করুন

#### Problem 2: Frontend API Call Failed

**Solution**:

- VITE_API_URL সঠিক আছে কিনা check করুন
- Backend health endpoint test করুন: `/api/health`
- CORS settings check করুন backend এ

#### Problem 3: Mobile এ Slow Loading

**Solution**:

- Images optimize করুন
- Code splitting implement করুন
- CDN enable করুন Vercel settings এ

### 📊 Monitoring

#### Vercel Analytics

1. Project Settings > Analytics
2. Enable করুন

#### Render Logs

1. Dashboard > Logs tab
2. Real-time logs দেখুন

### 💰 Cost Estimation

#### Free Tier Limits:

- **Vercel**: Unlimited deployments, 100 GB bandwidth/month
- **Render**: 750 hours/month free (যথেষ্ট একটা app এর জন্য)
- **MongoDB Atlas**: 512 MB storage free forever

#### Paid Upgrade (যদি প্রয়োজন হয়):

- Vercel Pro: $20/month
- Render: $7/month per service
- MongoDB: $9/month (10 GB)

### ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed on Render/Railway
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] Database connection successful
- [ ] API endpoints working
- [ ] Mobile responsive checked
- [ ] All features tested
- [ ] Custom domain configured (optional)

---

## 🎉 Congratulations!

আপনার Life Pilot AI app এখন live! 🚀

**Frontend URL**: https://your-app.vercel.app
**Backend URL**: https://your-backend.onrender.com

**Important URLs to Save**:

1. GitHub Repo: https://github.com/YOUR-USERNAME/Life-Pilot-AI
2. Vercel Dashboard: https://vercel.com/dashboard
3. Render Dashboard: https://dashboard.render.com
4. MongoDB Atlas: https://cloud.mongodb.com

### Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Docs: https://www.mongodb.com/docs/atlas/

---

**Made with ❤️ by GitHub Copilot**
