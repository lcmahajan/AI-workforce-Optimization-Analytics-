# WorkForce AI Platform

## Overview

WorkForce AI Platform is an enterprise productivity and workforce management application designed to optimize employee allocation, track performance metrics, and provide AI-powered insights. The platform handles complex HR operations including employee fitment analysis, productivity tracking, job description matching, CV processing, and fatigue detection.

The application is built as a full-stack web application with a React frontend, Express backend, and PostgreSQL database, designed to help organizations make data-driven decisions about workforce optimization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling

**Design System**: Hybrid approach combining Linear's clean productivity aesthetics with Material Design's robust data visualization patterns. The design emphasizes clarity, scannable information hierarchy, and professional trustworthiness suitable for enterprise productivity tools.

**Styling Approach**:
- Tailwind CSS with custom theming supporting light/dark modes
- CSS variables for consistent color theming
- Typography using Inter for primary text and JetBrains Mono for data/metrics
- Responsive design with mobile-first breakpoints

**State Management**: 
- TanStack Query (React Query) for server state management
- React Context for authentication state
- Local component state with React hooks

**Routing**: Wouter for client-side routing with protected routes requiring authentication

**Key Pages**:
- Dashboard: Overview with KPI cards and charts
- Analytics: Comprehensive workforce analytics and insights
- Employees: Employee management with card and table views
- Upload Data: File upload zones for JDs, CVs, and activity data
- Optimization: AI-powered recommendations for workforce allocation
- Reports: Document generation and export capabilities
- Softskills: Employee soft skills visualization
- Fatigue Analysis: Workload and burnout detection
- Settings: User preferences and configuration
- Documentation: Platform usage guides

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful API with JSON request/response format

**Authentication**: JWT-based authentication with bcrypt password hashing
- Token stored in localStorage on client (NOTE: XSS vulnerable - use HTTP-only cookies for production)
- Bearer token authentication on protected routes
- Role-based access control (employee/admin roles)
- Auth context provides login, register, logout methods
- Protected routes redirect to /login when unauthenticated
- SESSION_SECRET environment variable required (no fallback for security)

**Request Flow**:
- Request logging middleware capturing method, path, status, duration, and response
- JSON body parsing with raw body preservation for webhooks
- Authentication middleware injecting user context
- Route handlers with error handling

**File Upload Handling**: Multer middleware for processing multipart form data (CVs, JDs, activity CSVs)

**Data Processing**: Papa Parse for CSV parsing of activity data

**Development Features**:
- Vite middleware integration for HMR in development
- Runtime error overlay for debugging
- Development banners and cartographer plugin (Replit-specific)

### Database Architecture

**Database**: PostgreSQL accessed via Neon serverless driver

**ORM**: Drizzle ORM with TypeScript schema definitions

**Schema Design**:

**Users Table**: Authentication and role management
- Fields: id, username, email, password (hashed), role, createdAt
- Roles: employee, admin

**Employees Table**: Employee profile and metrics
- Fields: id, name, position, department, email, phone, status, userId (FK), fitmentScore, createdAt, updatedAt
- Links to users table for authentication

**Job Descriptions Table**: JD storage and requirements
- Fields: id, title, description, requirements (JSONB for structured data)

**CVs Table**: Candidate resume storage
- Stores uploaded CV metadata and parsed content

**Activities Table**: Employee activity and task tracking
- Tracks work logs, tasks, and productivity metrics

**Fitment Scores Table**: AI-generated employee-to-role fit scores
- Calculated scores linking employees to job descriptions

**Database Management**:
- Drizzle Kit for migrations (stored in /migrations directory)
- Schema-first approach with TypeScript types generated from schema
- Zod schemas for runtime validation derived from Drizzle schemas

### External Dependencies

**Core Libraries**:
- React 18+ with TypeScript for type safety
- Express.js for backend API server
- Drizzle ORM with @neondatabase/serverless for database operations
- Vite for frontend build tooling and development server

**UI Component Libraries**:
- Radix UI primitives (dialogs, dropdowns, tooltips, etc.)
- Recharts for data visualization (charts and graphs)
- Lucide React for icons
- class-variance-authority and clsx for conditional styling

**Authentication & Security**:
- bcryptjs for password hashing
- jsonwebtoken for JWT generation and verification
- SESSION_SECRET environment variable required for JWT signing

**File Processing**:
- Multer for file upload handling
- Papa Parse (papaparse) for CSV parsing

**Development Tools**:
- TypeScript compiler for type checking
- ESBuild for production server bundling
- tsx for TypeScript execution in development
- Replit-specific plugins for development environment integration

**Environment Variables Required**:
- DATABASE_URL: PostgreSQL connection string
- SESSION_SECRET: Secret key for JWT signing
- NODE_ENV: Environment designation (development/production)

**Implemented API Endpoints**:
- Authentication: POST /api/auth/register, POST /api/auth/login
- Employees: GET/POST/PUT/DELETE /api/employees
- Job Descriptions: GET/POST /api/job-descriptions
- CVs: GET/POST /api/cvs
- Activities: GET/POST /api/activities, POST /api/activities/upload (CSV)
- Analytics: GET /api/analytics/work-distribution, GET /api/analytics/productivity
- Fitment: POST /api/fitment/calculate
- Fatigue: GET /api/fatigue/analysis
- Optimization: GET /api/optimization/recommendations

**Frontend Integration Status**:
- ✅ Authentication fully connected (login, register, logout, protected routes)
- ✅ Backend APIs implemented and tested
- ⚠️ Individual pages still use mock data (need to connect to backend APIs)
- Next steps: Update Dashboard, Employees, Analytics, Fatigue, and Optimization pages to fetch real data

**Known Limitations**:
- JWT tokens stored in localStorage (vulnerable to XSS) - acceptable for MVP/demo, should use HTTP-only cookies for production
- Fitment scoring uses placeholder algorithm - needs real AI/ML implementation
- Some pages still display mock data instead of real backend data