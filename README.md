# AI Dietary Advisor

An intelligent web application that provides personalized AI-powered dietary recommendations with a robust social interaction system featuring advanced nested commenting capabilities.

## Features

### 🤖 AI-Powered Health Analysis
- Comprehensive health profile questionnaire
- Personalized dietary advice generation
- AI summarization of health data
- Professional health recommendations

### 💬 Social Media Platform
- Advanced nested commenting system
- Unlimited reply threading (replies to replies to replies...)
- Real-time community discussions
- Auto-expanding conversation threads
- Save/cancel functionality for all interactions

### 🗄️ Database & Persistence
- PostgreSQL database with full data persistence
- All comments and replies saved permanently
- Health profiles stored with timestamps
- Search functionality across all records
- Relational database design for optimal performance

### 🎨 Modern UI/UX
- Responsive design for mobile and desktop
- Professional interface built with Tailwind CSS
- Accessible components using shadcn/ui
- Smooth animations and transitions
- Intuitive user experience

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation

## Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Deployment

This application is configured for deployment on multiple free hosting platforms:

### Railway (Recommended)
- Free $5/month credit
- PostgreSQL included
- No sleep issues
- [Deploy to Railway](https://railway.app)

### Other Free Options
- **Render**: 750 free hours/month
- **Fly.io**: 3 free VMs with database
- **Vercel + PlanetScale**: Serverless + database

See `deploy-instructions.md` for detailed deployment guides.

## Environment Variables

```
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
```

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   └── lib/         # Utilities and configurations
├── server/              # Express backend
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # Database operations
│   └── db.ts           # Database connection
├── shared/              # Shared types and schemas
└── deployment files    # Various deployment configurations
```

## Key Features Implemented

✅ Complete health profile creation with validation  
✅ AI-powered dietary advice generation  
✅ PostgreSQL database with persistent storage  
✅ Advanced social media commenting system  
✅ Unlimited nested reply functionality  
✅ Real-time comment updates and auto-expansion  
✅ Search functionality across health records  
✅ Responsive design for all devices  
✅ Professional UI with accessibility features  

## Social Media System

The commenting system supports:
- **Top-level comments** on health profiles
- **Nested replies** with unlimited depth
- **Real-time updates** when new replies are added
- **Auto-expansion** of parent comments
- **Persistent storage** in PostgreSQL database
- **Visual hierarchy** with proper indentation
- **Timestamps** for all interactions

## Database Schema

### Comments Table
- Relational design using foreign keys
- Each comment/reply is a separate database row
- `parent_comment_id` creates the threading structure
- Supports unlimited nesting levels

## License

MIT License - Feel free to use this project for your own applications.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Live Demo**: Deploy to any free hosting platform in under 10 minutes!