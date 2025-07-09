# AI Dietary Advisor

## Overview

This is a full-stack web application that provides AI-powered dietary advice to users. The application features a React frontend with a Node.js/Express backend, utilizing Hugging Face's AI models for generating personalized nutritional guidance. The system is built with modern web technologies including TypeScript, Tailwind CSS, and shadcn/ui components.

## System Architecture

The application follows a traditional client-server architecture with clear separation of concerns:

- **Frontend**: React SPA with TypeScript, served statically in production
- **Backend**: Node.js Express server handling API requests and AI integration
- **Database**: PostgreSQL with Drizzle ORM (configured but not actively used)
- **AI Integration**: Hugging Face Inference API for natural language processing
- **Development**: Vite for fast development builds and hot module replacement

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool for fast development and optimized production builds
- **Tailwind CSS** for utility-first styling with custom CSS variables for theming
- **shadcn/ui** component library providing accessible, customizable UI components
- **TanStack Query** for server state management and API caching
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript
- **Middleware**: JSON parsing, URL encoding, CORS handling, and request logging
- **API Routes**: RESTful endpoints for dietary advice requests
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development Integration**: Vite middleware integration for seamless development

### Data Layer
- **Drizzle ORM** configured for PostgreSQL with type-safe database operations
- **Schema Definition**: Shared TypeScript schemas using Zod for validation
- **In-Memory Storage**: Currently uses memory-based storage for user data
- **Migration System**: Drizzle migrations configured for database schema changes

### AI Integration
- **Hugging Face API**: Integration with microsoft/DialoGPT-medium model
- **Fallback System**: Graceful degradation with static advice when API is unavailable
- **Input Validation**: Strict validation of user inputs (10-2000 characters)
- **Response Processing**: Structured response format with processing time tracking

## Data Flow

1. **User Input**: User submits dietary question through React form
2. **Validation**: Frontend validates input using Zod schemas
3. **API Request**: TanStack Query sends validated data to Express backend
4. **AI Processing**: Backend calls Hugging Face API with formatted prompt
5. **Response Handling**: API response is processed and formatted
6. **UI Update**: Frontend receives response and updates UI with advice
7. **Error Handling**: Any errors are caught and displayed to user with toast notifications

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **@radix-ui/***: Accessible UI primitives for shadcn/ui components
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **react**: UI library
- **tailwindcss**: Utility-first CSS framework
- **zod**: TypeScript-first schema validation

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **@types/***: TypeScript definitions
- **tsx**: TypeScript execution for development

### External Services
- **Hugging Face Inference API**: AI model hosting and inference
- **PostgreSQL**: Database (configured via DATABASE_URL environment variable)

## Deployment Strategy

The application is configured for deployment on multiple free hosting platforms:

### Primary Deployment Options:
- **Railway**: Free tier with $5/month credit, PostgreSQL included, no sleep
- **Render**: Free tier with 750 hours/month, automatic PostgreSQL
- **Fly.io**: Free tier with 3 VMs and 3GB storage
- **Replit**: Development environment with deployment capabilities

### Build Configuration:
- **Build Process**: `npm run build` compiles both frontend and backend
- **Production Server**: Node.js server serves static files and API endpoints
- **Environment**: Requires `DATABASE_URL` (provided by hosting platform)
- **Port Configuration**: Listens on port 5000, configurable via PORT env var
- **Database**: PostgreSQL with automatic schema migration on startup

### Deployment Files Created:
- `railway.json` - Railway deployment configuration
- `render.yaml` - Render deployment configuration  
- `Dockerfile` - Container deployment support
- `vercel.json` - Vercel serverless deployment
- `deploy-instructions.md` - Step-by-step deployment guide

### Build Pipeline:
1. **Frontend Build**: Vite compiles React app to static files in `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Migration**: Drizzle automatically creates/updates database schema
4. **Static Serving**: Express serves frontend assets in production
5. **API Endpoints**: Backend handles `/api/*` routes

## Changelog

- June 24, 2025: Initial setup with full AI dietary advisor functionality
- June 24, 2025: Created standalone server.js and deployment files for custom server deployment
- June 24, 2025: Enhanced comprehensive health profile form with detailed validation and AI summarization
- June 24, 2025: Extended share functionality with multiple sharing options (email, WhatsApp, Messenger, clipboard)
- June 25, 2025: Configured sharing capabilities - app accessible at Replit dev domain for public access
- June 26, 2025: Added automatic date and time stamps to all shared content for better tracking and context
- June 26, 2025: Implemented PostgreSQL database with health profiles storage, search functionality, and records viewing page
- June 26, 2025: Fixed API request method errors - corrected parameter order in apiRequest calls for proper functionality
- June 26, 2025: Enhanced timestamp tracking - database now properly saves and displays when AI dietary advice was generated
- June 27, 2025: Fixed text input focus issue in nested reply forms - users can now type continuously without losing focus
- June 27, 2025: Resolved reply persistence bug - replies now display immediately after saving and persist correctly in database
- June 27, 2025: Implemented auto-expansion of parent comments when new replies are added for better user experience
- June 27, 2025: Added deep nested reply functionality - users can now reply to replies at unlimited levels creating true threaded conversations
- June 28, 2025: Created comprehensive deployment setup for free hosting platforms (Railway, Render, Fly.io) with database support
- June 28, 2025: Successfully uploaded complete project to GitHub repository (https://github.com/jasoncd/ai-dietary-advisor) ready for deployment
- January 2, 2025: Successfully deployed AI Dietary Advisor to Render.com with PostgreSQL database - app is now live and accessible publicly
- January 2, 2025: Fixed database connection issues and implemented automatic schema initialization - all database operations now working perfectly in production

## User Preferences

Preferred communication style: Simple, everyday language.