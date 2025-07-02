# Free Deployment Guide for AI Dietary Advisor

## Option 1: Railway (Recommended - Free with Database)

Railway offers a generous free tier with PostgreSQL database support.

### Steps:
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Connect your GitHub account and select this repository
5. Railway will automatically detect the configuration from `railway.json`
6. Add environment variables:
   - `DATABASE_URL` - Railway will provide this for the PostgreSQL service
   - Add PostgreSQL service: Click "New" → "Database" → "PostgreSQL"
7. Deploy automatically starts

### Free Tier Limits:
- $5 credit per month (typically enough for small apps)
- Automatic scaling
- Custom domains available

## Option 2: Render (Free with Database)

Render offers free tier with PostgreSQL database.

### Steps:
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create "New Web Service"
4. Connect your repository
5. Use these settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`
6. Add PostgreSQL database:
   - Go to Dashboard → "New" → "PostgreSQL"
   - Copy the database URL to your web service environment variables

### Free Tier Limits:
- Service spins down after 15 minutes of inactivity
- 750 hours per month
- Custom domains on paid plans only

## Option 3: Fly.io (Free with Database)

Fly.io offers free tier suitable for full-stack applications.

### Steps:
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Sign up: `fly auth signup`
3. In your project folder: `fly launch`
4. Add PostgreSQL: `fly postgres create`
5. Connect database: `fly postgres attach <postgres-app-name>`
6. Deploy: `fly deploy`

### Free Tier Limits:
- 3 shared-cpu-1x 256MB VMs
- 3GB persistent volume storage

## Option 4: Vercel + PlanetScale (Frontend + Database)

Combine Vercel (frontend) with PlanetScale (database) for a powerful free setup.

### Steps:
1. **Database Setup (PlanetScale):**
   - Go to [planetscale.com](https://planetscale.com)
   - Create free account and database
   - Get connection string

2. **Frontend Deployment (Vercel):**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables including `DATABASE_URL`
   - Deploy automatically

## Environment Variables Needed:

For all platforms, you'll need:
```
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=5000
```

## Recommended: Railway

Railway is the best option because:
- ✅ True free tier with database
- ✅ Automatic deployments from GitHub
- ✅ Easy environment variable management
- ✅ No sleep/spin-down issues
- ✅ Simple setup process

## After Deployment:

1. Your app will be available at the provided URL
2. The database will be automatically provisioned
3. All your social media commenting features will work
4. Health profiles and comments persist permanently

## Troubleshooting:

If you encounter issues:
1. Check environment variables are set correctly
2. Ensure `DATABASE_URL` is properly configured
3. Verify the build process completes successfully
4. Check deployment logs for errors

Your AI Dietary Advisor will be fully functional with:
- Health profile creation and AI advice
- PostgreSQL database with all comments/replies
- Social media commenting system
- Search functionality
- All features working on a free hosting platform!