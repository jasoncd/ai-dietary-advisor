# Fix Render Database & API Issues

Two issues need fixing in your deployed Render app:

## Issue 1: Database Connection Timeout

The current code uses Neon serverless connection, but you're using Render's PostgreSQL. The connection format is different.

### Fix: Update Environment Variables in Render

1. Go to your Render web service → **Environment** tab
2. Make sure your **DATABASE_URL** follows this format:
   ```
   postgresql://username:password@hostname:port/database
   ```
3. If using Render's PostgreSQL, the URL should look like:
   ```
   postgresql://ai_dietary_advisor:xxxxx@dpg-xxxxx-a.oregon-postgres.render.com:5432/ai_dietary_advisor_xxxx
   ```

## Issue 2: Hugging Face API 401 Error

The AI advice feature needs a Hugging Face API key.

### Fix: Add API Key to Render

1. In Render web service → **Environment** tab
2. Add new environment variable:
   - **Key**: `HUGGING_FACE_TOKEN`
   - **Value**: [Your Hugging Face API token]

### Get Hugging Face Token:
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up/login (free)
3. Go to Settings → Access Tokens
4. Create new token with "Read" permission
5. Copy the token

## Alternative: Use Mock Data for Testing

If you want to test without Hugging Face API, the app already has fallback responses built-in.

## After Making Changes:
1. Save environment variables in Render
2. Manually trigger a new deployment
3. Check logs for successful database connection

Your AI Dietary Advisor should work perfectly after these fixes!