# GULL Testing Guide

## Overview

This document provides comprehensive testing guidelines for the GULL Accounting Management System.

---

## Manual Testing Checklist

### Phase 1: Core Structure & Navigation ✅

- [ ] App loads without errors
- [ ] Theme toggle works (light/dark)
- [ ] Navigation between pages works
- [ ] 404 page shows for invalid routes
- [ ] PWA manifest is generated
- [ ] Service worker registers

### Phase 2: Dashboard & Entry Management ✅

- [ ] Create new project
- [ ] View project list
- [ ] Delete project
- [ ] Dashboard displays correctly
- [ ] Add transaction (standard entry)
- [ ] Add transaction (intelligent entry)
- [ ] Entry panel slides in/out
- [ ] History panel slides in/out
- [ ] Undo/redo functionality works
- [ ] Statistics update correctly

### Phase 3: Akra & Ring Pages ✅

**Akra Page (2-digit):**
- [ ] All numbers 00-99 display correctly
- [ ] Click number shows transaction modal
- [ ] Modal displays bar chart
- [ ] Modal shows transaction list
- [ ] Color coding works (green/yellow/red)
- [ ] Search/filter functionality
- [ ] Selection mode works
- [ ] Select all/deselect all
- [ ] Export to CSV
- [ ] Filter tab works with operators

**Ring Page (3-digit):**
- [ ] All numbers 000-999 display correctly
- [ ] Grid performance is acceptable
- [ ] Same functionality as Akra page

### Phase 4: Advanced Filtering ✅

- [ ] Command-based search works
  - [ ] `starts:1` - Numbers starting with 1
  - [ ] `ends:5` - Numbers ending with 5
  - [ ] `middle:3` - Numbers with 3 in middle
  - [ ] `even:` - Even numbers
  - [ ] `odd:` - Odd numbers
  - [ ] `sum:10` - Digit sum equals 10
  - [ ] `between:20-30` - Range
  - [ ] `greater:50` - Greater than
  - [ ] `less:50` - Less than
  - [ ] `contains:3` - Contains digit
  - [ ] `equals:42` - Exact match
- [ ] Pattern validation shows errors
- [ ] Save filter preset
- [ ] Load filter preset
- [ ] Delete filter preset
- [ ] Transaction editing works
- [ ] Bulk delete selected numbers
- [ ] Chart image export (PNG)
- [ ] Copy to clipboard
- [ ] CSV download

### Phase 5: Authentication ✅

**Offline Mode:**
- [ ] Guest mode works without registration
- [ ] Email/password "registration" (local)
- [ ] Email/password sign in (local)
- [ ] Session persists across browser restart
- [ ] Sign out clears session
- [ ] Profile page displays correctly
- [ ] Edit display name works
- [ ] "Offline Mode" badge shows

**Online Mode (with Supabase):**
- [ ] Sign up with email/password
- [ ] Email validation (if enabled)
- [ ] Sign in with credentials
- [ ] Session auto-restores
- [ ] Token auto-refresh
- [ ] Profile management
- [ ] Sign out works
- [ ] Protected routes redirect when not authenticated
- [ ] Welcome page shows when logged out

### Phase 6: Database Integration ✅

**Supabase Setup:**
- [ ] Migration runs successfully
- [ ] All tables created
- [ ] RLS policies active
- [ ] Indexes created

**Database Operations:**
- [ ] Create project in Supabase
- [ ] Read projects from Supabase
- [ ] Update project in Supabase
- [ ] Delete project in Supabase
- [ ] Create transaction in Supabase
- [ ] Read transactions from Supabase
- [ ] Update transaction in Supabase
- [ ] Delete transaction in Supabase
- [ ] Filter presets sync
- [ ] User preferences sync
- [ ] Action history tracked
- [ ] Real-time updates work
- [ ] RLS prevents unauthorized access
- [ ] Cross-user data isolation

### Phase 7: File Handling & Integrations ✅

**Excel Export:**
- [ ] Export transactions to Excel
- [ ] Export summaries to Excel
- [ ] Multiple sheets created correctly
- [ ] Column widths appropriate
- [ ] Data formats correctly
- [ ] File downloads successfully

**Excel Import:**
- [ ] Import template downloads
- [ ] Import validates data
- [ ] Import shows errors
- [ ] Import shows warnings
- [ ] Import adds transactions
- [ ] Duplicate handling works

**Audio Feedback:**
- [ ] Success sound plays
- [ ] Error sound plays
- [ ] Delete sound plays
- [ ] Click sound plays
- [ ] Undo/redo sounds play
- [ ] Completion sound plays
- [ ] Can enable/disable audio

**Clipboard:**
- [ ] Copy text to clipboard
- [ ] Copy table data (TSV)
- [ ] Copy numbers list
- [ ] Copy summary stats
- [ ] Copy feedback shows
- [ ] Clipboard API available check

**Chart Export:**
- [ ] Chart exports as PNG
- [ ] High quality (2x scale)
- [ ] White background
- [ ] File downloads
- [ ] Fallback works if html2canvas fails

### Phase 8: Performance & Polish ✅

**Performance:**
- [ ] Initial load time < 3s
- [ ] Navigation is instant
- [ ] Large grids (Ring 000-999) perform well
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Bundle size reasonable

**Error Handling:**
- [ ] Network errors show user-friendly messages
- [ ] Validation errors clear
- [ ] Database errors handled gracefully
- [ ] Auth errors redirect properly
- [ ] 404 page works
- [ ] Error boundary catches crashes

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Focus visible
- [ ] Screen reader friendly (basic)
- [ ] Color contrast sufficient
- [ ] Touch targets >= 44px

**Mobile:**
- [ ] Responsive on phone (320px+)
- [ ] Responsive on tablet
- [ ] Touch interactions work
- [ ] Panels slide correctly
- [ ] Modals full-screen on mobile

**PWA:**
- [ ] Install prompt shows
- [ ] App installs correctly
- [ ] Works offline (cached)
- [ ] Icons display correctly
- [ ] Splash screen shows

---

## Browser Testing

Test in the following browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Device Testing

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile (360x640)

---

## Performance Metrics

Use Chrome DevTools > Lighthouse:

- [ ] Performance score >= 90
- [ ] Accessibility score >= 90
- [ ] Best Practices score >= 90
- [ ] SEO score >= 80
- [ ] PWA score >= 90

---

## Security Testing

- [ ] XSS prevention (input sanitization)
- [ ] CSRF protection (Supabase handles)
- [ ] SQL injection prevention (Supabase handles)
- [ ] RLS policies enforce data isolation
- [ ] Passwords not stored in localStorage
- [ ] API keys in .env not committed
- [ ] HTTPS in production

---

## Load Testing

**Scenarios:**

1. **Large Projects:**
   - [ ] 10,000 transactions
   - [ ] Still performs well
   - [ ] No crashes

2. **Many Projects:**
   - [ ] 100+ projects
   - [ ] Project list loads
   - [ ] No slowdown

3. **Concurrent Users (Supabase):**
   - [ ] Multiple users simultaneous
   - [ ] Real-time updates work
   - [ ] No conflicts

---

## Edge Cases

**Data:**
- [ ] Empty project (no transactions)
- [ ] Very large amounts (999999.99)
- [ ] Zero amounts
- [ ] Special characters in notes
- [ ] Very long notes (1000+ chars)
- [ ] Duplicate numbers
- [ ] All numbers in range have entries

**User Actions:**
- [ ] Rapid clicking
- [ ] Multiple quick undo/redo
- [ ] Open multiple modals
- [ ] Navigate while loading
- [ ] Delete while editing
- [ ] Network disconnect during operation

**Network:**
- [ ] Slow 3G simulation
- [ ] Offline mode
- [ ] Intermittent connection
- [ ] Timeout handling

---

## Automated Testing (Future)

### Unit Tests (Jest + React Testing Library)

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
```

**Test Files Structure:**
```
src/
  __tests__/
    utils/
      helpers.test.ts
      transactionHelpers.test.ts
      patternMatching.test.ts
    components/
      LoadingSpinner.test.tsx
      ProjectCard.test.tsx
    hooks/
      useTransactions.test.ts
      useHistory.test.ts
```

**Example Test:**
```typescript
// src/__tests__/utils/helpers.test.ts
import { generateId, formatDate, calculatePercentage } from '../../utils/helpers';

describe('helpers', () => {
  test('generateId creates unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(id1).toHaveLength(16);
  });

  test('formatDate formats correctly', () => {
    const date = '2025-01-15T10:30:00';
    const formatted = formatDate(date);
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
    expect(formatted).toContain('2025');
  });

  test('calculatePercentage works', () => {
    expect(calculatePercentage(25, 100)).toBe(25);
    expect(calculatePercentage(0, 100)).toBe(0);
    expect(calculatePercentage(50, 0)).toBe(0);
  });
});
```

### Integration Tests

Test complete user flows:
- Sign up → Create project → Add transactions → View dashboard
- Import Excel → Verify transactions → Export
- Filter numbers → Bulk delete → Undo

### E2E Tests (Playwright)

```bash
npm install -D @playwright/test
```

**Example E2E:**
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up and create project', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Click Continue as Guest
  await page.click('text=Continue as Guest');
  
  // Should redirect to project selection
  await expect(page).toHaveURL(/\//);
  
  // Create project
  await page.fill('input[name="name"]', 'Test Project');
  await page.fill('textarea[name="description"]', 'Test Description');
  await page.click('button:has-text("Create Project")');
  
  // Verify project appears
  await expect(page.locator('text=Test Project')).toBeVisible();
});
```

---

## Regression Testing

After each phase, re-test previous phases to ensure no regressions.

---

## Bug Report Template

```markdown
**Title:** [Short description]

**Priority:** [High/Medium/Low]

**Environment:**
- Browser: [Chrome 120]
- OS: [Windows 11]
- Mode: [Online/Offline]

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[If applicable]

**Console Errors:**
```
[Paste errors]
```

**Additional Context:**
[Any other information]
```

---

## Test Coverage Goals

- [ ] Unit tests: 80%+ coverage
- [ ] Integration tests: Major flows
- [ ] E2E tests: Critical paths
- [ ] Manual tests: All features

---

## Continuous Testing

1. **Before Each Commit:**
   - Run linter: `npm run lint`
   - Check TypeScript: `npm run type-check`
   - Build: `npm run build`

2. **Before Each Release:**
   - Full manual test checklist
   - Cross-browser testing
   - Performance audit
   - Security review

3. **After Deployment:**
   - Smoke tests on production
   - Monitor errors
   - Check analytics

---

## Tools

- **Chrome DevTools**: Performance, Network, Console
- **React DevTools**: Component inspection
- **Lighthouse**: Performance audits
- **BrowserStack**: Cross-browser testing (optional)
- **Jest**: Unit testing
- **Playwright**: E2E testing
- **Postman**: API testing (Supabase)

---

## Notes

- Test both offline and online modes thoroughly
- Pay special attention to real-time sync edge cases
- Verify RLS policies with multiple test users
- Test on actual mobile devices, not just responsive mode
- Use throttling to simulate slow networks

---

**Happy Testing!** 🧪✅

