# Simple Alternative - Render (Fixed Setup)

Since Vercel is having serverless issues with your Express app, let's use Render with the correct configuration.

## Step 1: Go Back to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (free account)

## Step 2: Create PostgreSQL Database FIRST
1. Click "New +" → "PostgreSQL"
2. Name: `ai-dietary-advisor-db`
3. Plan: **Free**
4. Click "Create Database"
5. Wait for it to be ready
6. Copy the "External Database URL" from the database dashboard

## Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub → Select `jasoncd/ai-dietary-advisor`
3. Configure:
   - **Name**: `ai-dietary-advisor`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `18`

## Step 4: Add Environment Variables
1. In the web service settings, add:
   - **DATABASE_URL**: [paste the PostgreSQL URL from step 2]
   - **NODE_ENV**: `production`

## Step 5: Deploy
Click "Create Web Service" and wait for deployment.

This approach avoids serverless complications and works with your existing Express server architecture.

## Alternative: Try Railway Again
Railway might work better now - they may have updated their free tier requirements.