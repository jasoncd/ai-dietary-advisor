# Deploy AI Dietary Advisor to Render.com

## Step 1: Prepare Your Files
Your app is already configured for deployment with:
- ✅ `server.js` - Production server file
- ✅ `package-production.json` - Production dependencies
- ✅ Build scripts configured

## Step 2: Create GitHub Repository
1. Go to https://github.com and create a new repository
2. Name it something like "ai-dietary-advisor"
3. Make it public (required for free Render tier)

## Step 3: Upload Your Code to GitHub
You can either:
- **Option A**: Download all files from Replit and upload to GitHub
- **Option B**: Use Git commands (if available in your Repl)

### Files to Upload:
```
📁 Your Repository
├── server.js (production server)
├── package.json (rename from package-production.json)
├── client/ (entire folder)
├── shared/ (entire folder)
├── drizzle.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
├── components.json
└── .gitignore
```

## Step 4: Deploy to Render.com
1. Go to https://render.com and sign up (free)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure deployment:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Environment**: Node.js
   - **Instance Type**: Free

## Step 5: Set Environment Variables (Optional)
In Render dashboard, add:
- `HUGGINGFACE_API_KEY` (if you have one)
- `DATABASE_URL` (if using external database)

## Step 6: Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- Your app will be available at: `https://your-app-name.onrender.com`

## Important Notes:
- Free tier apps sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Apps get a permanent URL that works 24/7
- HTTPS is included automatically

## Your App Features:
- Complete health profile form
- AI dietary recommendations with fallback
- Multiple sharing options
- Mobile-friendly design