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

7. # "Deploy" ক্লিক করুন

## প্রথমবার Vercel Setup (Full-Stack Deployment)

### Step 1: GitHub Repository তৈরি করুন

```bash
# Repository initialize করুন
git init
git add .
git commit -m "Initial commit - Life Pilot AI Agent v1.0"

# GitHub এ push করুন (আপনার username দিয়ে replace করুন)
git remote add origin https://github.com/YOUR-USERNAME/Life-Pilot-AI.git
git branch -M main
git push -u origin main
```

### Step 2: Vercel Account তৈরি করুন

1. https://vercel.com এ যান
2. GitHub/Google দিয়ে sign up/login করুন

### Step 3: Full-Stack Project Deploy করুন

1. **"New Project" ক্লিক করুন**
2. **GitHub repository connect করুন**
3. **আপনার `Life-Pilot-AI` repository select করুন**

4. **Configure Project:**
   - **Framework Preset:** `Other`
   - **Root Directory:** `./` (root directory)
   - **Build Command:** `npm run build --prefix frontend`
   - **Output Directory:** `frontend/dist`

5. **Environment Variables যোগ করুন (Vercel Dashboard):**

   **Backend Environment Variables:**

   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/lifepilot_ai
   DATABASE_NAME = lifepilot_ai
   FLASK_ENV = production
   SECRET_KEY = your-secret-key-here
   OPENAI_API_KEY = your-openai-api-key (optional)
   ```

   **Frontend Environment Variables:**

   ```
   VITE_API_URL = https://your-project-name.vercel.app/api
   ```

6. **"Deploy" ক্লিক করুন**

### Step 4: MongoDB Atlas Setup

1. **https://cloud.mongodb.com এ যান**
2. **"Try Free" ক্লিক করুন**
3. **Free cluster তৈরি করুন**
4. **Database User তৈরি করুন:**
   - Username: `lifepilot_user`
   - Password: `your-secure-password`
5. **Network Access:** `0.0.0.0/0` (Allow from anywhere)
6. **Connection String copy করুন:**
   ```
   mongodb+srv://lifepilot_user:password@cluster0.xxxxx.mongodb.net/lifepilot_ai
   ```

### Step 5: Environment Variables Update করুন

Vercel Dashboard এ যান:

1. **Project Settings** > **Environment Variables**
2. **MONGODB_URI** update করুন real connection string দিয়ে
3. **Redeploy** করুন

### Step 6: Domain এবং Final Setup

- **Free Domain:** `your-project-name.vercel.app`
- **Custom Domain:** Settings > Domains এ যোগ করুন (optional)
- **SSL Certificate:** Automatic
