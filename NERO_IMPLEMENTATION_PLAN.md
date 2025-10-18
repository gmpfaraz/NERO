# NERO Account Management System - Implementation Plan

## 🎯 Scope: UI/UX Components & Features ONLY

**What Will Be Implemented:**
- ✅ Complete UI components and layouts
- ✅ Navigation systems (Admin & User)
- ✅ Dashboard interfaces
- ✅ Forms and data entry components
- ✅ Design system and theming
- ✅ Responsive layouts
- ✅ Mock data and interactions

**What Will NOT Be Implemented:**
- ❌ Supabase authentication
- ❌ Database integration
- ❌ Real API calls
- ❌ Backend services
- ❌ File processing (actual)
- ❌ Real-time subscriptions

---

## 📋 Implementation Phases

### Phase 1: Base Architecture
- [x] GULL project already has Vite + React + Tailwind
- [ ] Update color scheme to NERO design system
- [ ] Create NERO-specific routing structure
- [ ] Build base layout components for NERO
- [ ] Implement theme system (Dark/Light)

**NERO Color Palette:**
```css
Primary: Deep Blue (#1e293b)
Secondary: Sky Blue (#38bdf8)
Accent Green: #22c55e
Accent Red: #ef4444
```

### Phase 2: Navigation Components
- [ ] Login page UI (mock authentication)
- [ ] Admin header with user dropdown
- [ ] Admin sidebar with navigation menu
- [ ] User header with balance display (mock)
- [ ] Role-based navigation (UI only)
- [ ] Breadcrumb component
- [ ] Mobile navigation drawer

### Phase 3: Admin Interface
- [ ] Admin Dashboard with KPI cards
- [ ] User Management table with filters
- [ ] Add/Edit User modals
- [ ] Individual User Dashboard
- [ ] User Project Management view
- [ ] System Reports interface
- [ ] Admin Settings panel

**Admin Features:**
- User list with search/filter
- Status toggles (UI only)
- Top-up modal
- Impersonation indicator
- Activity feed
- Financial summary widgets

### Phase 4: User Interface
- [ ] User Dashboard (limited)
- [ ] Project Selection cards
- [ ] Create Project modal
- [ ] Project Interface (Akra/Ring)
- [ ] Data entry forms
- [ ] Transaction history
- [ ] Import/Export UI (mock)

**User Features:**
- Account balance display
- Project cards
- Basic calculations
- Limited navigation
- Spending limit UI

### Phase 5: Shared Components
- [ ] Data table with sorting
- [ ] Form components library
- [ ] Modal/Dialog system
- [ ] Toast notifications
- [ ] Loading states
- [ ] Error messages
- [ ] File upload UI
- [ ] Charts/graphs

---

## 🎨 Design System

### Typography
- Font: Inter (already configured)
- Sizes: xs(12px), sm(14px), base(16px), lg(18px), xl(20px), 2xl(24px)

### Colors
```javascript
{
  primary: {
    main: '#1e293b',    // Deep Blue
    light: '#334155',
    dark: '#0f172a'
  },
  secondary: {
    main: '#38bdf8',    // Sky Blue
    light: '#7dd3fc',
    dark: '#0284c7'
  },
  success: '#22c55e',   // Green
  error: '#ef4444',     // Red
  warning: '#f59e0b',
  info: '#3b82f6'
}
```

### Components
- Cards: Rounded (12px), shadow, hover effects
- Buttons: Primary (Sky Blue), Secondary (outline), Danger (Red)
- Inputs: Border focus (Sky Blue), rounded (8px)
- Tables: Striped rows, hover highlight
- Badges: Pill-shaped status indicators

---

## 🗂️ Folder Structure

```
src/
├── nero/                    # NERO-specific code
│   ├── components/
│   │   ├── admin/          # Admin components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   ├── UserDashboard.tsx
│   │   │   ├── SystemReports.tsx
│   │   │   └── Settings.tsx
│   │   ├── user/           # User components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProjectSelection.tsx
│   │   │   └── ProjectInterface.tsx
│   │   ├── shared/         # Shared components
│   │   │   ├── DataTable.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Forms/
│   │   ├── navigation/     # Navigation components
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── UserHeader.tsx
│   │   │   └── Breadcrumb.tsx
│   │   └── layouts/        # Layout components
│   │       ├── AdminLayout.tsx
│   │       ├── UserLayout.tsx
│   │       └── AuthLayout.tsx
│   ├── pages/              # Page components
│   │   ├── LoginPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── UserDashboard.tsx
│   │   └── Unauthorized.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.ts      # Mock auth
│   │   ├── useRole.ts
│   │   └── useTheme.ts
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx  # Mock
│   │   └── ThemeContext.tsx
│   ├── types/              # TypeScript types
│   │   ├── user.ts
│   │   ├── project.ts
│   │   └── transaction.ts
│   ├── utils/              # Utilities
│   │   ├── mockData.ts     # Mock data for UI
│   │   └── formatters.ts
│   └── styles/             # Styles
│       └── nero.css
```

---

## 🔄 Mock Data Structure

```typescript
// Mock User
interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  balance: number;
  spendingLimit: number;
  isOnline: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Mock Project
interface Project {
  id: string;
  userId: string;
  name: string;
  type: 'akra' | 'ring';
  date: string;
  totalFirst: number;
  totalSecond: number;
  entryCount: number;
}

// Mock Transaction
interface Transaction {
  id: string;
  projectId: string;
  number: string;
  first: number;
  second: number;
  notes: string;
  createdAt: string;
}
```

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Features
- Hamburger menu
- Collapsible sidebar
- Touch-friendly buttons
- Swipeable cards
- Bottom navigation (optional)

---

## 🎯 Key Features (UI Only)

### Admin Features
1. **User Management**
   - List all users with search
   - Add/Edit/Delete users (UI)
   - Toggle user status
   - View user details
   - Top-up balance modal

2. **Dashboard**
   - KPI cards (users, projects, revenue)
   - Activity feed
   - Online users list
   - Quick actions

3. **Reports**
   - Date range picker
   - Filter options
   - Export buttons (UI)
   - Chart visualizations

4. **User Access**
   - View user's projects
   - Access user dashboard
   - Impersonation mode (UI indicator)

### User Features
1. **Dashboard**
   - Account balance
   - Project summary
   - Recent activity
   - Quick create project

2. **Project Management**
   - Create Akra/Ring projects
   - View project list
   - Data entry forms
   - Transaction history

3. **Limitations**
   - Spending limit indicator
   - Restricted navigation
   - Limited export options

---

## 🚀 Implementation Timeline

**Phase 1-2:** 2-3 hours
- Base setup, routing, navigation

**Phase 3:** 3-4 hours  
- Admin interface complete

**Phase 4:** 2-3 hours
- User interface complete

**Phase 5:** 1-2 hours
- Shared components, polish

**Total:** ~10-12 hours of development

---

## ✅ Success Criteria

- [ ] Complete UI for all admin features
- [ ] Complete UI for all user features
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark/Light theme working
- [ ] Navigation working (mock roles)
- [ ] All forms functional (UI)
- [ ] Mock data flowing through components
- [ ] NERO design system applied
- [ ] Clean, maintainable code
- [ ] Ready for backend integration later

---

**Next Steps:**
Ready to start implementing Phase 1?

