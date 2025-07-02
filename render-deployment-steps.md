# Deploy to Render (100% Free - No Credit Card)

## Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub (no payment info required)

## Step 2: Deploy Your Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub account if not already connected
3. Select repository: `jasoncd/ai-dietary-advisor`
4. Configure deployment:
   - **Name**: `ai-dietary-advisor`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (selected by default)

## Step 3: Add PostgreSQL Database
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Database name: `ai-dietary-advisor-db`
4. Database User: `ai_dietary_advisor`
5. Region: Choose closest to you
6. Instance Type: `Free` (selected by default)
7. Click "Create Database"

## Step 4: Connect Database to App
1. Go to your PostgreSQL database dashboard
2. Copy the "External Database URL"
3. Go to your web service dashboard
4. Click "Environment" tab
5. Add environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: [paste the database URL you copied]
6. Click "Save Changes"

## Step 5: Deploy
1. Your app will automatically deploy
2. You'll get a live URL like: `https://ai-dietary-advisor.onrender.com`
3. Initial deployment takes 5-10 minutes

## Your Live App Features:
- ✅ Health profile creation with AI advice
- ✅ Social media commenting with unlimited nesting
- ✅ PostgreSQL database (all data persists)
- ✅ Search functionality
- ✅ Mobile responsive design
- ✅ Public URL accessible worldwide

## Free Tier Limits:
- 750 hours per month (31 days = 744 hours)
- Service sleeps after 15 minutes of inactivity
- Wakes up automatically when accessed
- PostgreSQL database with 1GB storage
- 100GB bandwidth per month

## Total Cost: $0.00
## Total Time: 10 minutes

Your AI Dietary Advisor will be fully functional and accessible to anyone worldwide!