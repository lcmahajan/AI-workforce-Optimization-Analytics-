# AI Workforce Optimization Platform

## Overview

The AI Workforce Optimization Platform is an enterprise application designed to optimize employee allocation, track performance, and provide AI-powered insights for workforce management. It supports HR operations such as employee fitment analysis, productivity tracking, job description matching, CV processing, and fatigue detection. The platform is a full-stack web application leveraging a React frontend, Express backend, and PostgreSQL database, aiming to facilitate data-driven decisions in workforce optimization.

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

**AI Assistant — Employee Insights Page** (November 2025):
- Comprehensive AI-powered employee analysis tool at `/ai-assistant` route under Optimization section
- **Full Employee Profile Display**: Avatar, name, userid, position, department, email, salary, experience, joining date, current/recommended roles
- **Key Metrics Dashboard**: 
  - Fitment Score with auto-classification (Fit/Unfit/Train to Fit/Overfit)
  - Productivity and Utilization percentages
  - Automation Potential with High/Medium/Low badges
  - Skill Score, Aptitude Score, FTE optimization, Consolidated/Non-Consolidated counts
  - Fatigue indicator for high-stress detection
- **5-Tab Interface**:
  - **Overview**: Productivity trend line chart (6 months), Work distribution pie chart
  - **Activities**: Process list with hours, output, repetitive scores, automation candidate badges
  - **Skills**: Skill scores bar chart, Hard/Soft skills badges, Identified skill gaps
  - **Performance**: Performance timeline bars, Average productivity, Trend indicators
  - **Documents**: Employee documents list with type, upload date, download buttons
- **Mock AI Assistant** (deterministic JavaScript with LLM integration hooks):
  - Auto-generates comprehensive employee analysis on load
  - Profile summary, fitment verdict, performance highlights
  - Automation potential assessment and process recommendations
  - Training recommendations and HR action suggestions
  - 4 quick query buttons for instant insights
  - Interactive chat with custom queries
  - Placeholder callAI() function for OpenAI/LLM integration
  - Prompt templates ready for production LLM deployment
- **Role-Based Access Control (RBAC)**:
  - Admin: Full access (salary, email, all recommendations, export button)
  - Manager: Performance, fitment, processes, email (no salary)
  - Editor: Limited view (no salary, email blurred/restricted)
  - Visual badges and blurred fields for restricted data
  - Audit log placeholder for export operations
- **Smart Search & Filters**:
  - Real-time search by name, userid, or email with dropdown results (max 5)
  - Department filter (Finance, IT, HR, Operations)
  - Role filter (Analyst, Manager, Specialist, Lead)
  - Case-insensitive matching
- **Auto-Calculations**:
  - Fitment classification: Overfit ≥9, Fit ≥8, Train to Fit ≥5, Unfit <5
  - FTE optimization: totalHours / 160 (standard monthly hours)
  - Automation savings: Processes with repetitive score ≥70, sorted by FTE savings potential
- **Visualization (Recharts)**:
  - Productivity trend line chart (6-month history)
  - Skill scores comparison bar chart (Hard/Soft/Overall)
  - Work distribution pie chart (Consolidated vs Non-Consolidated)
- **Recommended Actions**: Flag for automation, Add training plan, Schedule 1:1, Export report
- **Mock Data**: 5 comprehensive employee profiles (Ramesh Kumar, Priya Sharma, David Chen, Aisha Patel, Michael Johnson) with varied fitment levels, departments, and metrics
- **Production-Ready Architecture**:
  - Modular component structure
  - Clear separation: UI components, mock AI logic, LLM integration hooks
  - Documented callAI() function for OpenAI API integration
  - Vector DB placeholder for historical document search
  - RBAC enforced on backend recommendation
  - Audit trail system for sensitive operations
- **Security & Privacy**: Salary/PII blurring, restricted field badges, role-based visibility, audit log placeholders

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