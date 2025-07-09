# Simple Vercel + Supabase Deployment Guide

## Step 1: Create Supabase Database (5 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub
4. Click "New project"
5. Fill in:
   - **Organization**: Your GitHub username
   - **Project name**: `ai-dietary-advisor`
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait 2-3 minutes for setup

## Step 2: Get Database Connection String

1. In your Supabase project dashboard
2. Click "Settings" (gear icon in left sidebar)
3. Click "Database"
4. Scroll down to "Connection string"
5. Click "URI" tab
6. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`)
7. **Save this string** - you'll need it for Vercel

## Step 3: Deploy to Vercel (3 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click "Start Deploying"
3. Click "Continue with GitHub"
4. Click "Import" next to your `ai-dietary-advisor` repository
5. Leave all settings as default
6. Click "Deploy"

## Step 4: Add Database to Vercel (2 minutes)

1. After deployment completes, you'll be on your project dashboard
2. Click "Settings" tab (top of page)
3. Click "Environment Variables" in left sidebar
4. Click "Add New" button
5. Fill in:
   - **Name**: `DATABASE_URL`
   - **Value**: [paste your Supabase connection string from Step 2]
   - **Environment**: Leave "Production, Preview, and Development" checked
6. Click "Save"

## Step 5: Redeploy with Database

1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. Your app rebuilds with database connection

## You're Done!

Your AI Dietary Advisor will be live at: `https://ai-dietary-advisor-[random].vercel.app`

## What Works:

✅ Health profile creation with AI advice  
✅ Social media commenting with unlimited nesting  
✅ PostgreSQL database (all data saved permanently)  
✅ Search functionality across records  
✅ Professional responsive design  
✅ Public URL accessible worldwide  

## Total Time: 10 minutes
## Total Cost: $0.00

Both Vercel and Supabase have generous free tiers that easily handle your application's needs.