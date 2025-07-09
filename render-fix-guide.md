# Fix Render Deployment Issues

## Common Render Deployment Problems & Solutions

### Issue 1: Build Command Not Found

**Problem**: Render can't find the build command
**Solution**: Use the exact build command from package.json

**Correct Settings for Render:**
- **Build Command**: `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`
- **Start Command**: `node dist/index.js`
- **Node Version**: 18 (in Environment Variables)

### Issue 2: PostgreSQL Database Setup

**Step-by-Step Database Creation:**

1. **In Render Dashboard**:
   - Click "New +" (blue button top right)
   - Select "PostgreSQL" from the dropdown
   - **NOT Web Service first - create database separately**

2. **Database Configuration**:
   - **Name**: `ai-dietary-advisor-db`
   - **Database**: `ai_dietary_advisor`
   - **User**: `ai_dietary_advisor`
   - **Region**: Same as your web service
   - **Plan**: Free

3. **Get Database URL**:
   - After database is created, go to database dashboard
   - Find "Connections" section
   - Copy "External Database URL"

4. **Connect to Web Service**:
   - Go to your web service dashboard
   - Click "Environment" in left sidebar
   - Add environment variable:
     - **Key**: `DATABASE_URL`
     - **Value**: [paste the database URL]

### Issue 3: Alternative Simple Deployment

If Render continues to fail, try **Vercel + Supabase** (easier setup):

**Vercel (Frontend/Backend)**:
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Deploy automatically

**Supabase (Database)**:
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get PostgreSQL connection string
4. Add to Vercel environment variables

### Issue 4: Render Web Service Settings

**Correct Configuration**:
- **Environment**: Node
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Auto-Deploy**: Yes
- **Node Version**: 18 (add as environment variable)

**Environment Variables to Add**:
- `NODE_ENV` = `production`
- `DATABASE_URL` = [your PostgreSQL URL from step 2]

## Quick Alternative: Cyclic.sh

**Even simpler option**:
1. Go to [cyclic.sh](https://cyclic.sh)
2. Connect GitHub
3. Deploy with one click
4. Built-in database included

Your AI Dietary Advisor should work on any of these platforms with the social media commenting system intact.