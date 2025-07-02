# Quick Deployment Steps

## Ready-to-Deploy Package Created ✅
I've created a `deployment-package/` folder with all files needed for Render.com

## Next Steps:

### 1. Download Your Files
- Download the entire `deployment-package/` folder from your Repl
- This contains everything needed for deployment

### 2. Create GitHub Repository
- Go to github.com → New repository
- Name: "ai-dietary-advisor" (or your preferred name)
- Make it **Public** (required for free Render tier)
- Upload all files from deployment-package/

### 3. Deploy to Render
1. Go to render.com → Sign up (free)
2. New → Web Service
3. Connect GitHub → Select your repository
4. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Environment**: Node.js

### 4. Get Your Permanent URL
- Deployment takes 5-10 minutes
- You'll get a URL like: `https://ai-dietary-advisor.onrender.com`
- This URL works 24/7, even when you're not using Replit

## Alternative: Skip GitHub
You can also deploy directly by:
1. Creating a zip file of deployment-package/
2. Using Render's direct file upload option

Your app will have the same features:
- Health profile form
- AI recommendations
- Sharing functionality
- Always accessible to friends