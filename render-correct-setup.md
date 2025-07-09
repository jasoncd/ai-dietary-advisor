# Render Deployment - Correct Setup

## Step 1: Create PostgreSQL Database First

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click "New +" (blue button) → Select "PostgreSQL"
3. Configure database:
   - **Name**: `ai-dietary-advisor-db`
   - **Database**: `ai_dietary_advisor`
   - **User**: `ai_dietary_advisor`
   - **Plan**: Free
4. Click "Create Database"
5. Wait for "Available" status
6. Copy the "External Database URL" (starts with postgresql://)

## Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `jasoncd/ai-dietary-advisor`
3. Configure service:
   - **Name**: `ai-dietary-advisor`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

## Step 3: Add Environment Variables

1. In web service dashboard, click "Environment" tab
2. Add these variables:
   - **DATABASE_URL**: [paste the PostgreSQL URL from step 1]
   - **NODE_ENV**: `production`

## Step 4: Deploy

1. Click "Create Web Service"
2. Watch the build logs
3. Wait for "Live" status
4. Your app will be at: `https://ai-dietary-advisor.onrender.com`

## Expected Results

Your AI Dietary Advisor will be live with:
- Health profile creation with AI advice
- Social media commenting with unlimited nesting
- PostgreSQL database storing all data permanently
- Search functionality across records
- Professional responsive design

## Troubleshooting

If build fails, check:
- Database is "Available" before creating web service
- Environment variables are set correctly
- Build command is exactly: `npm install`
- Start command is exactly: `npm start`