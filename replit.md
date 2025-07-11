# replit.md

## Overview

This is a full-stack web application built with React/TypeScript frontend and Express.js backend, designed as a food delivery platform similar to Zomato. The application features a modern UI built with shadcn/ui components, PostgreSQL database with Drizzle ORM, and a comprehensive component-based architecture.

**Latest Update:** Successfully migrated from Lovable to Replit with complete database integration and admin management system. The application is now fully dynamic with real data stored in PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system inspired by Zomato's branding
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Development**: Hot reloading with Vite integration in development mode

### Key Design Decisions
1. **Monorepo Structure**: Frontend (`client/`), backend (`server/`), and shared code (`shared/`) in a single repository
2. **Type Safety**: Full TypeScript implementation across frontend, backend, and shared schemas
3. **Modern React**: Uses React 18 features with functional components and hooks
4. **Component-First**: Modular component architecture with reusable UI components

## Key Components

### Frontend Components
- **Layout Components**: Header, Footer, Hero sections
- **Feature Components**: Restaurant grid, popular cities, app download sections
- **UI Components**: Complete shadcn/ui component library implementation
- **Page Components**: Index page and 404 error handling

### Backend Components
- **Storage Interface**: Abstract storage interface with in-memory implementation
- **Route Registration**: Centralized route management system
- **Development Integration**: Vite middleware for seamless development experience

### Database Schema
- **Admins Table**: Admin user management with encrypted passwords for dashboard access
- **Cities Table**: City information with restaurant counts and popularity flags
- **Restaurants Table**: Restaurant details with ratings, delivery times, and city associations
- **Features Table**: Dynamic app features with ordering and status management
- **Stats Table**: Real-time application statistics for dashboard display
- **Drizzle Integration**: Type-safe database operations with Zod validation schemas

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Server Processing**: Express.js routes handle requests and interact with storage layer
3. **Database Operations**: Storage interface abstracts database operations using Drizzle ORM
4. **Response Handling**: JSON responses with proper error handling and logging

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, React DOM, React Router
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Components**: Extensive Radix UI component collection
- **Utilities**: date-fns, lucide-react icons

### Backend Dependencies
- **Web Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL support
- **Session Management**: connect-pg-simple for PostgreSQL sessions
- **Development**: tsx for TypeScript execution

### Development Dependencies
- **Build Tools**: Vite with React plugin
- **TypeScript**: Full TypeScript configuration
- **Code Quality**: ESLint, Prettier (implied by structure)
- **Database Tools**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Requires DATABASE_URL environment variable for PostgreSQL connection
- **Build Process**: Vite builds frontend, esbuild bundles backend

### Production
- **Frontend**: Static files served from `dist/public`
- **Backend**: Bundled Express server with static file serving
- **Database**: PostgreSQL with Drizzle migrations
- **Environment**: NODE_ENV-based configuration

### Build Commands
- `npm run dev`: Development server with hot reloading
- `npm run build`: Production build (frontend + backend)
- `npm run start`: Production server
- `npm run db:push`: Push database schema changes

The application follows modern web development practices with a focus on type safety, developer experience, and maintainable architecture. The food delivery theme is implemented throughout the UI with Zomato-inspired design elements and comprehensive component coverage.

## Recent Changes (January 2025)

- **Database Migration**: Converted from in-memory storage to PostgreSQL with complete schema
- **Admin System**: Built secure admin authentication with session management
- **Admin Dashboard**: Full CRUD operations for cities, restaurants, features, and stats
- **Dynamic Frontend**: All sections now pull real data from the database
- **Security**: Implemented password hashing with bcrypt and session-based authentication
- **Routing**: Converted from React Router to Wouter for Replit compatibility
- **API Layer**: Complete REST API with protected admin routes and public data endpoints

## Latest Updates (July 2025)

- **Fixed Database Connection**: Resolved DATABASE_URL environment variable issues and properly provisioned PostgreSQL database
- **Database Seeding**: Added comprehensive seed data including admin user, cities, restaurants, and features
- **Dynamic Page System**: Implemented fully functional dynamic footer pages with admin-created content
- **Enhanced Footer**: Footer now displays dynamic links to admin-created pages organized by category
- **Dynamic Hero Section**: Hero section now pulls content from admin panel including title, subtitle, and CTA text  
- **API Endpoints**: All API endpoints verified working with real data from database
- **Page Navigation**: Dynamic page routing working with /page/:slug URLs for admin-created content

## Admin Access
- **URL**: `/admin/login`
- **Credentials**: username=admin, password=admin123
- **Features**: Complete content management system for all dynamic sections