# Design Guidelines: Apostolos SACCO Digital Banking Platform

## Design Approach

**Selected Framework:** Material Design 3 with Fintech Adaptations

**Rationale:** Financial applications demand clarity, trust, and efficiency. Material Design 3 provides robust patterns for data-heavy interfaces while allowing customization for financial contexts. We'll draw additional inspiration from modern fintech leaders (Stripe Dashboard, Wise, Revolut) for transaction flows and data visualization.

**Core Principles:**
- **Clarity Over Cleverness:** Every element serves a functional purpose
- **Trust Through Consistency:** Predictable patterns across all modules
- **Mobile-First Finance:** Optimized for small screens where most members will interact
- **Information Hierarchy:** Guide users through complex financial data effortlessly

## Typography System

**Font Stack:**
- **Primary:** Inter (via Google Fonts CDN) - exceptional readability for financial data, extensive weights
- **Monospace:** JetBrains Mono - for account numbers, transaction IDs, amounts

**Type Scale:**
- **Hero/Dashboard Headings:** text-4xl md:text-5xl font-bold (large numbers, KPIs)
- **Section Headings:** text-2xl md:text-3xl font-semibold
- **Card/Module Titles:** text-lg font-semibold
- **Body Text:** text-base font-normal
- **Secondary/Labels:** text-sm font-medium
- **Captions/Metadata:** text-xs font-normal
- **Financial Amounts:** text-xl md:text-2xl font-bold (tabular-nums for alignment)

**Number Formatting:** Always use tabular-nums class for consistent width alignment in tables and lists

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16, 24** for consistent rhythm
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Page margins: px-4 md:px-6 lg:px-8
- Card spacing: space-y-6

**Container Strategy:**
- **Full-width dashboards:** max-w-7xl mx-auto
- **Forms/Workflows:** max-w-2xl mx-auto
- **Data tables:** w-full with horizontal scroll on mobile
- **Split layouts:** grid grid-cols-1 lg:grid-cols-3 gap-6 (sidebar + main content)

**Responsive Breakpoints:**
- Mobile-first always
- Stack vertically on mobile, grid layouts on md:+
- Sticky headers for tables on desktop
- Collapsible sidebars on mobile

## Navigation Architecture

**Primary Navigation (Multi-Role):**
- **Desktop:** Persistent sidebar (w-64) with logo, role indicator, main menu, user profile at bottom
- **Mobile:** Bottom navigation bar with 4-5 primary actions, hamburger menu for full navigation
- **Sections organized by role:**
  - Members: Dashboard, Accounts, Loans, Transactions, Profile
  - Staff: Dashboard, Members, Transactions, Loans, Reports, Support
  - Admin: Dashboard, Analytics, Members, Loans, Compliance, Settings, Reports

**Secondary Navigation:**
- Breadcrumbs for deep workflows (loan application steps, member details)
- Tabs within modules (Account Types, Loan History, Transaction Filters)
- Contextual actions in page headers

## Component Library

### Dashboard Cards
- **Metric Cards:** Prominent number with label, trend indicator, icon, subtle background
- **Chart Cards:** Header with filter options, visualization, expandable to full view
- **Quick Actions:** Grid of icon + label buttons for common tasks
- **Activity Feed:** Timeline/list of recent transactions with icons and status badges

### Forms & Inputs
- **Input Fields:** Outlined style with floating labels, helper text below, validation states
- **Dropdowns:** Native select with custom styling, searchable for long lists
- **Date Pickers:** Calendar overlay for date selection
- **Amount Inputs:** Currency symbol prefix, thousand separators, large touch targets
- **File Upload:** Drag-and-drop zones with preview for documents
- **Multi-step Forms:** Progress indicator, previous/next navigation, save draft capability

### Data Display
- **Tables:** Sticky headers, alternating row backgrounds, sortable columns, row actions on hover
- **Transaction Lists:** Card-based on mobile, table on desktop, status badges, expandable details
- **Member Cards:** Avatar/initials, name, ID, key metrics, quick actions
- **Loan Cards:** Amount, status badge, progress bar, remaining balance, next payment date

### Notifications & Feedback
- **Toast Notifications:** Top-right position, auto-dismiss, icon + message + action
- **In-app Notification Center:** Bell icon with badge count, dropdown list, mark as read
- **Empty States:** Illustration + message + CTA for empty lists/tables
- **Loading States:** Skeleton screens for data-heavy views, spinners for actions
- **Confirmation Modals:** For critical actions (loan approval, disbursement), clear consequences

### Financial Components
- **Account Balance Display:** Large amount, account type, available vs. total, last updated
- **Transaction Item:** Icon, description, amount (red for debit, green for credit), date, status
- **Loan Summary:** Total borrowed, paid, remaining, interest, next payment with countdown
- **Payment Calculator:** Input loan amount, see instant calculation of repayment schedule
- **Guarantor Selector:** Member search, display selected guarantors, approval status badges

### M-PESA Simulation
- **Payment Modal:** Phone number input, amount, STK push animation, success confirmation
- **Transaction Receipt:** Printable format, transaction ID, timestamp, parties, amount

## Visual Treatment

**Elevation & Depth:**
- Cards: shadow-sm with hover:shadow-md transition
- Modals: shadow-xl with backdrop blur
- Dropdowns: shadow-lg
- Navigation: border-r for sidebar, shadow-sm for headers

**Borders & Dividers:**
- Subtle borders (border-gray-200 in light, border-gray-700 in dark)
- Dividers between list items and sections
- Outlined buttons for secondary actions

**Status Indicators:**
- **Success/Approved:** Emerald green background, white text
- **Warning/Pending:** Amber background, dark text
- **Error/Rejected:** Red background, white text
- **Info/Processing:** Blue background, white text
- **Neutral/Completed:** Gray background, dark text

## Light/Dark Mode Implementation

**Mode Toggle:** Header-positioned switch, persist preference in localStorage

**Light Mode:**
- Background: White and gray-50
- Cards: White with gray-100 borders
- Text: gray-900 primary, gray-600 secondary

**Dark Mode:**
- Background: gray-900 and gray-800
- Cards: gray-800 with gray-700 borders
- Text: gray-100 primary, gray-400 secondary

**Consistent Elements Across Modes:**
- Brand colors maintain accessibility ratios
- Status badges adapt but remain recognizable
- Charts use theme-appropriate color scales

## Mobile Optimization

**Touch Targets:** Minimum 44px height for all interactive elements
**Spacing:** Increased padding on mobile (p-4 vs p-6 on desktop)
**Forms:** Full-width inputs, stacked layouts, floating labels to save space
**Tables:** Transform to cards on mobile with key information prioritized
**Navigation:** Bottom bar for primary actions, swipe gestures for navigation
**Modals:** Full-screen on mobile for complex forms

## Data Visualization

**Chart Types:**
- **Line Charts:** Savings growth over time, loan portfolio trends
- **Bar Charts:** Monthly deposits, loan distribution by type
- **Pie/Donut Charts:** Member segmentation, loan status breakdown
- **Progress Bars:** Loan repayment progress, savings goals
- Use accessible color palettes that work in both light/dark modes

## Onboarding & Help

**First-Time Experience:**
- Welcome modal explaining system, role selection for demo
- Inline tooltips (? icons) with explanations
- Empty states with CTAs to guide next action
- Guided tour using spotlight/overlay highlights

**Persistent Help:**
- Help icon in header opens side panel with FAQs, search
- Contextual help text in forms
- Success messages that educate ("Your loan has been submitted. Typically approved within 24 hours.")

## Images

**Logo Placement:** Top of sidebar (desktop), center of mobile header
**Member Avatars:** Circle thumbnails throughout (uploaded or generated initials)
**Empty State Illustrations:** Simple, professional graphics for empty dashboards/lists
**No Hero Images:** This is an application, not a marketing site - focus on immediate utility