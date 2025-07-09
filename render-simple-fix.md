# Fix Render Build - Simple Solution

The issue is that `vite` and `esbuild` are not available during the build process. Here's the simplest fix:

## Option 1: Change Build Command in Render

In your Render web service settings, change the **Build Command** to:

```
npm install --include=dev && npm run build
```

This forces Render to install ALL dependencies (including dev dependencies) before building.

## Option 2: Alternative Build Command

If that doesn't work, try this build command:

```
npm install && npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

This runs the build steps directly without relying on the npm script.

## Settings Summary:
- **Environment**: Node
- **Build Command**: `npm install --include=dev && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `DATABASE_URL`: [your PostgreSQL URL]
  - `NODE_ENV`: `production`

## Why This Works:
- Forces installation of dev dependencies needed for build
- Your existing code and GitHub repo are perfect
- No code changes needed

Try updating the build command in your Render dashboard and redeploy.