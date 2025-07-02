# Quick Deploy Guide - AI Dietary Advisor

## ⚡ Fastest Option: Railway (Recommended)

**Railway offers the best free tier for full-stack apps with database.**

### 1-Click Deploy Steps:
1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select this repository
5. Add PostgreSQL database:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically connects it
6. Your app deploys automatically!

**Free Tier:** $5 monthly credit (enough for most small apps)

---

## 🚀 Alternative: Render

### Steps:
1. Go to [render.com](https://render.com)
2. Create "New Web Service" from GitHub
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Add PostgreSQL database from dashboard
6. Copy database URL to environment variables

**Free Tier:** 750 hours/month, sleeps after 15min inactivity

---

## 📦 Alternative: Fly.io

### Steps:
1. Install CLI: `curl -L https://fly.io/install.sh | sh`
2. Sign up: `fly auth signup`
3. Launch: `fly launch` (in project folder)
4. Add database: `fly postgres create`
5. Deploy: `fly deploy`

**Free Tier:** 3 VMs, 3GB storage

---

## 🎯 Your App Features After Deployment:

✅ **Complete Health Profile System**
- AI-powered dietary advice generation
- Comprehensive health questionnaires

✅ **Social Media Platform**
- Unlimited nested commenting system
- Real-time community discussions
- Persistent conversation threads

✅ **Database Storage**
- All comments and replies saved permanently
- Health profiles stored with timestamps
- Search functionality across records

✅ **Professional UI**
- Responsive design for mobile/desktop
- Modern interface with Tailwind CSS
- Accessible components

---

## 🔧 Environment Variables:

All platforms need:
```
DATABASE_URL=postgresql://... (provided by hosting platform)
NODE_ENV=production
```

---

## ✨ After Deployment:

Your AI Dietary Advisor will be live with:
- Public URL for sharing
- Fully functional database
- All social features working
- No usage limits on core features

**Deploy time: 5-10 minutes**
**Cost: FREE** 🎉