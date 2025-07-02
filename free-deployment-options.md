# Free Deployment Options (No Credit Card Required)

## Option 1: Render (Recommended - Truly Free)

**No credit card required, generous free tier**

### Steps:
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (no payment info needed)
3. Click "New +" → "Web Service"
4. Connect GitHub and select `jasoncd/ai-dietary-advisor`
5. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
6. Add PostgreSQL database:
   - Dashboard → "New +" → "PostgreSQL"
   - Copy the database URL to your web service environment variables

**Free Tier**: 750 hours/month, sleeps after 15min inactivity

---

## Option 2: Fly.io (Free Tier)

**Free allowance, no credit card for basic usage**

### Steps:
1. Go to [fly.io](https://fly.io)
2. Sign up (no credit card required for free tier)
3. Install CLI: `curl -L https://fly.io/install.sh | sh`
4. Deploy from your local machine:
   ```bash
   flyctl auth login
   flyctl launch
   flyctl postgres create
   flyctl deploy
   ```

**Free Tier**: 3 shared-cpu VMs, 3GB storage

---

## Option 3: Vercel + Supabase (Generous Free Tiers)

**Frontend + Database combination**

### Frontend (Vercel):
1. Go to [vercel.com](https://vercel.com)
2. Import from GitHub: `jasoncd/ai-dietary-advisor`
3. Deploy with one click

### Database (Supabase):
1. Go to [supabase.com](https://supabase.com)
2. Create free PostgreSQL database
3. Get connection string
4. Add to Vercel environment variables

---

## Option 4: Netlify + PlanetScale

**Another frontend + database combination**

### Steps:
1. **Netlify**: Deploy frontend from GitHub
2. **PlanetScale**: Free MySQL database
3. Connect with environment variables

---

## Option 5: Heroku (Basic Free Usage)

**Classic platform with free tier**

### Steps:
1. Go to [heroku.com](https://heroku.com)
2. Create app from GitHub
3. Add Heroku Postgres add-on (free tier)
4. Deploy automatically

---

## Recommended: Render

**Best balance of features and simplicity**

- ✅ No credit card required
- ✅ 750 free hours per month
- ✅ PostgreSQL database included
- ✅ Automatic deployments from GitHub
- ✅ SSL certificates included
- ✅ Easy environment variable management

Your AI Dietary Advisor will work perfectly on any of these platforms with all features:
- Health profile creation with AI advice
- Social media commenting with unlimited nesting
- PostgreSQL database persistence
- Search functionality
- Professional responsive design