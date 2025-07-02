# AI Dietary Advisor - Deployment Guide

## Files for Your Server

I've created two key files for deploying your AI Dietary Advisor on your own server:

### 1. `server.js` - Production Server
A standalone Node.js server that includes:
- Express.js web server
- API endpoints for dietary advice
- Static file serving for the frontend
- Hugging Face AI integration
- Error handling and CORS support
- Health check endpoint

### 2. `package-production.json` - Production Dependencies
Minimal dependencies needed for production:
- `express` - Web server framework
- `zod` - Input validation

## Deployment Steps

### Step 1: Build the Frontend
Run this command in your current project to build the frontend:
```bash
npm run build
```
This creates a `dist/public` folder with all the frontend files.

### Step 2: Prepare Your Server
1. Copy these files to your server:
   - `server.js`
   - `package-production.json` (rename to `package.json`)
   - The entire `dist/public` folder from step 1

2. Install dependencies on your server:
```bash
npm install
```

### Step 3: Set Environment Variables
Set these environment variables on your server:
```bash
export HUGGINGFACE_API_KEY=your_hugging_face_api_key_here
export PORT=5000
export NODE_ENV=production
```

### Step 4: Start the Server
```bash
npm start
```

Your app will be available at `http://your-server-ip:5000`

## Server Requirements
- Node.js 18+ 
- At least 512MB RAM
- Basic internet connection for AI API calls

## Optional: Process Management
For production, consider using PM2 to keep your server running:
```bash
npm install -g pm2
pm2 start server.js --name "dietary-advisor"
pm2 startup
pm2 save
```

## Security Notes
- The server binds to `0.0.0.0` to accept external connections
- CORS is configured for API endpoints
- Input validation prevents malicious requests
- Error handling prevents server crashes

Your AI Dietary Advisor is now ready for deployment on any server!