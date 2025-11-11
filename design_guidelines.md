# Workforce Platform Design Guidelines

## Design Approach

**Selected System**: Hybrid approach combining **Linear's** clean productivity aesthetics with **Material Design's** robust data visualization patterns.

**Rationale**: This is an enterprise productivity tool requiring clarity, efficiency, and professional polish. The interface must handle complex data (analytics, employee records, reports) while maintaining usability for both admin and employee roles.

**Core Principles**:
- Clarity over decoration
- Scannable information hierarchy
- Efficient task completion
- Professional trustworthiness

---

## Typography

**Font Family**: 
- Primary: Inter or Work Sans (Google Fonts)
- Monospace: JetBrains Mono (for data/metrics)

**Scale**:
- Page Titles: text-3xl font-semibold
- Section Headers: text-xl font-semibold
- Card Titles: text-lg font-medium
- Body: text-base font-normal
- Supporting Text: text-sm
- Metrics/Data: text-2xl font-bold (monospace)
- Labels: text-xs font-medium uppercase tracking-wide

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16, 20**
- Component padding: p-6 or p-8
- Section gaps: gap-6 or gap-8
- Card spacing: p-6
- Form fields: space-y-4
- Page margins: px-8 py-6

**Grid Structure**:
- Dashboard: 12-column responsive grid
- Metrics cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Data tables: Full-width with horizontal scroll
- Forms: max-w-2xl single column

---

## Component Library

### Navigation
**Top Bar** (fixed, spans full width):
- Logo + platform name (left)
- Search bar (center, max-w-md)
- User profile dropdown + notifications (right)
- Height: h-16, backdrop-blur with subtle border

**Sidebar** (fixed left, collapsible):
- Width: w-64 (expanded), w-16 (collapsed)
- Navigation items with icons (Heroicons)
- Active state: subtle left border accent
- Role indicator badge at bottom
- Organized sections: Dashboard, Data Management, Analytics, Settings

### Dashboard Cards
- Rounded corners: rounded-xl
- Elevation: subtle shadow
- Padding: p-6
- Metric cards: Large number top, label below, sparkline optional
- Action cards: Icon + title + description + CTA button

### Data Tables
- Sticky header row
- Alternating row treatment for scannability
- Row actions on hover (right-aligned icons)
- Sortable columns with indicators
- Pagination: bottom-center with page info
- Search + filters: top toolbar

### Forms & Uploads
**Upload Interface**:
- Drag-and-drop zone: min-h-48, dashed border, centered icon + text
- File list with progress bars and remove icons
- Accepted formats clearly labeled
- Upload button: primary, full-width for mobile

**Form Fields**:
- Labels: above input, font-medium text-sm
- Inputs: h-11, rounded-lg, focus ring
- Helper text: text-xs below field
- Error states: red accent with icon
- Multi-step forms: Progress stepper at top

### Analytics Components
**Charts** (use Chart.js or Recharts):
- Line charts: Work distribution over time
- Bar charts: Employee productivity comparison
- Donut charts: Fitment score breakdown
- Card container: p-6 with title and time range selector

**KPI Metrics**:
- Large number display with trend indicator (↑/↓)
- Comparison to previous period
- Contextual icon (left of number)

### Employee Cards
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card content: Avatar (left), Name + Role, Quick stats, View details link
- Hover: subtle elevation increase

### Reports Page
- Filter sidebar (left): Date range, departments, employees
- Report grid (right): Card-based with preview + download
- Generate report CTA: prominent, top-right

---

## Page-Specific Layouts

### Dashboard (Landing for authenticated users)
- KPI metrics row: 4 cards (employees, tasks, productivity avg, alerts)
- Charts section: 2-column grid (work distribution + fitment scores)
- Recent activity feed: right sidebar or bottom section
- Quick actions: Upload data, Add employee, View reports

### Analytics
- Filters bar at top
- Large visualization area: Multiple chart types stacked
- Export options: top-right

### Employees (Admin)
- Search + filter toolbar
- Employee grid/table toggle view
- Bulk actions for selection
- Add employee: floating action button or top-right CTA

### Upload Data
- Three upload sections: JDs, CVs, Activity Data
- Drag-and-drop zones with format instructions
- Processing status and error handling
- Recently uploaded files list below

### Settings
- Sidebar navigation for sections (Profile, Security, Notifications, Integrations)
- Form-based content area with save actions

---

## Images

**No hero image** - This is a productivity tool, not a marketing site. Start directly with functional interface.

**Employee/Profile Images**:
- Circular avatars: w-10 h-10 (lists), w-20 h-20 (cards), w-32 h-32 (profiles)
- Placeholder: Initials on gradient background

**Illustration Placeholders**:
- Empty states: Simple line illustrations with helpful messaging
- Error states: Friendly graphics with recovery actions

---

## Accessibility & Polish

- Focus states: Prominent ring on all interactive elements
- Icon-only buttons: Include aria-labels
- Loading states: Skeleton screens for data tables, spinners for actions
- Toast notifications: Top-right for success/error feedback
- Confirmation modals: For destructive actions (delete employee, etc.)
- Responsive breakpoints: Mobile-first, stack cards/columns appropriately

**Critical**: No distracting animations. Use subtle transitions (150-200ms) for hovers and state changes only.