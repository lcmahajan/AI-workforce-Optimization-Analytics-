# WorkForce AI Platform

## Overview

The WorkForce AI Platform is an enterprise application designed to optimize employee allocation, track performance, and provide AI-powered insights for workforce management. It supports HR operations such as employee fitment analysis, productivity tracking, job description matching, CV processing, and fatigue detection. The platform is a full-stack web application leveraging a React frontend, Express backend, and PostgreSQL database, aiming to facilitate data-driven decisions in workforce optimization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript (Vite).
**UI Component System**: shadcn/ui on Radix UI primitives with Tailwind CSS.
**Design System**: Hybrid approach combining Linear's productivity aesthetics with Material Design's data visualization for clarity and professionalism.
**Styling**: Tailwind CSS (light/dark modes), CSS variables, Inter and JetBrains Mono fonts, responsive design (mobile-first).
**State Management**: TanStack Query for server state, React Context for auth, React hooks for local state.
**Routing**: Wouter for client-side routing with protected routes.
**Key Pages**: Dashboard, Analytics, Employees, Fitment Analysis, Upload Data, Optimization, Reports, Softskills, Fatigue Analysis, Settings, Documentation.

### Backend Architecture

**Framework**: Express.js with TypeScript (Node.js).
**API Design**: RESTful API (JSON).
**Authentication**: JWT-based with bcrypt hashing; role-based access control (employee/admin); token stored in localStorage (note: XSS vulnerability in current implementation, HTTP-only cookies for production).
**Request Flow**: Logging, JSON body parsing, authentication middleware, error handling.
**File Upload Handling**: Multer for multipart form data (CVs, JDs, activity CSVs).
**Data Processing**: Papa Parse for CSV parsing.

### Database Architecture

**Database**: PostgreSQL via Neon serverless driver.
**ORM**: Drizzle ORM with TypeScript schema definitions.
**Schema Design**:
- **Users**: Consolidated authentication and employee profile (id, username, email, password, role, department, tower, roleTitle, fitmentScore, productivity, utilization, softskills, resumeFileId).
- **Job Descriptions**: JD storage (id, title, description, requirements, department, uploadedBy, fileUrl).
- **CVs**: Candidate resume metadata (id, candidateName, email, skills, experience, education, uploadedBy, fileUrl).
- **Uploads**: File metadata for all uploaded files (id, originalName, storedName, type, uploader, parsed, meta).
- **Activities**: Employee activity and task tracking (id, user, activityType, date, durationMinutes, tower, category, source, taskName, hoursSpent, status, projectId).
- **Fitment Scores**: AI-generated employee-to-role fit scores.
**Database Management**: Drizzle Kit for migrations; Zod schemas for validation.

### AI Services

**NLP Service**: For CV/JD parsing, skill extraction, text categorization (currently regex/keyword fallback).
**Embedding Service**: Generates vector embeddings for text/skills (currently random normalized vectors).
**Fitment Engine**: Scores employee-to-role fitment and provides recommendations (currently heuristic-based).
**Supported AI Backends**: Pluggable architecture for OpenAI, Anthropic, custom microservices, local models.

### Enterprise Connectors

**ERP/HRMS Connectors**: Stubbed interfaces for SAP, Workday, Oracle HCM.
**Collaboration Tool Connectors**: Stubbed interfaces for Slack, Microsoft Teams.
**Key Interfaces**: Standardized interfaces (`IERPConnector`, `ICollaborationConnector`) and a `ConnectorManager` for extensibility.

## Recent Updates

**Automated Employees Dashboard** (November 2025):
- Enhanced `/employees` page with comprehensive automation logic for HR analytics
- **Auto-Classification**: Automatically categorizes employee fitment levels based on score thresholds (Fit ≥8, Train to Fit 5-7, Overfit 3-5, Unfit <3)
- **Auto-Generated Summary Statistics**: 4 KPI cards that automatically calculate from employee data:
  - Total Employees (auto-counted)
  - Average Fitment Score (auto-calculated)
  - High Performers (auto-detected: productivity >90%)
  - Low Utilization (auto-flagged: utilization <50%)
- **Auto-Insights Engine**: Generates real-time insights when data changes:
  - High performer detection and recognition
  - Low utilization warnings with employee names
  - Unfit employee alerts with recommendations
  - Training needs identification
  - All insights logged to browser console for debugging
- **Auto-Highlighting**: Visual indicators for performance levels:
  - Green row background + star badge for high performers (productivity >90%)
  - Green text for high productivity values
  - Red text for low utilization values (<50%)
- **Smart Filtering**: Search by name, filter by Tower/Role/Fitment with case-insensitive matching
- **State-Driven Architecture**: TypeScript interfaces (Employee, AutoInsight), React hooks (useState, useMemo, useEffect)
- **Sample Data Mode**: LOAD_SAMPLE_DATA flag for testing automation features with 8 diverse employee profiles
- **Ready for Integration**: setEmployees() function ready for CSV/JSON uploads or API integration

**Employee Fitment Analysis Page** (November 2025):
- Added comprehensive fitment analysis page at `/fitment` route
- Features 4 KPI summary cards: Total Employees, Average Fitment Score, High Performers, Departments
- Includes searchable and filterable data table with 6 columns: Employee Name, Department, Current Role, Recommended Role, Fitment Score, Status
- State-driven architecture with TypeScript interfaces (FitmentMetrics, EmployeeFitment)
- Case-insensitive filtering for department selection
- Sample data loading mechanism (LOAD_SAMPLE_DATA flag) for demonstration
- Integrated into sidebar navigation under "Insights" section
- Production-ready with proper React hooks (useState, useMemo, useEffect)
- Ready for API/CSV integration via setMetrics() and setEmployees() functions

## External Dependencies

**Core Libraries**: React, Express.js, Drizzle ORM, @neondatabase/serverless, Vite.
**UI Component Libraries**: Radix UI, Recharts, Lucide React, class-variance-authority, clsx.
**Authentication & Security**: bcryptjs, jsonwebtoken.
**File Processing**: Multer, Papa Parse (papaparse).
**Development Tools**: TypeScript, ESBuild, tsx.
**Environment Variables**: DATABASE_URL, SESSION_SECRET, NODE_ENV.