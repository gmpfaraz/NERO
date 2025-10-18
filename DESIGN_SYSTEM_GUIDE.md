# Dashboard Design System v3.0 - Implementation Guide

## Overview

This project implements a comprehensive Dashboard Reading & Activity Tracker Design System with complete light and dark mode support, colorful widgets, and modern UI patterns.

## 🎨 Color System

### Brand Colors
- **Primary (Indigo)**: `#6366F1` / `bg-primary` / `text-primary`
- **Secondary (Violet)**: `#8B5CF6` / `bg-secondary` / `text-secondary`

### Light Mode Backgrounds
```css
bg-light-primary     /* #FFFFFF - Pure white */
bg-light-secondary   /* #F9FAFB - Subtle gray */
bg-light-tertiary    /* #F3F4F6 - Light gray */
bg-light-card        /* #FFFFFF - Card background */
```

### Dark Mode Backgrounds
```css
bg-dark-primary      /* #1A1D29 - Deep navy */
bg-dark-secondary    /* #20232F - Navy gray */
bg-dark-tertiary     /* #282B36 - Lighter navy */
bg-dark-card         /* #252837 - Card background */
```

### Status Colors
- **Success**: `bg-success` / `text-success` (`#10B981`)
- **Warning**: `bg-warning` / `text-warning` (`#F59E0B`)
- **Error**: `bg-error` / `text-error` (`#EF4444`)
- **Info**: `bg-info` / `text-info` (`#3B82F6`)

### Widget Colors

Each widget color has light and dark variants with matching text colors:

```jsx
// Yellow Widget
<div className="widget-yellow">
  <span className="text-widget-yellow-text dark:text-widget-yellow-text-dark">
    Content
  </span>
</div>

// Available colors:
// widget-yellow, widget-orange, widget-green, 
// widget-blue, widget-purple, widget-pink
```

## 📝 Typography

### Font Families
```css
font-primary    /* System UI fonts */
font-secondary  /* Inter fallback */
font-mono       /* Code/monospace */
font-reading    /* Serif for reading */
```

### Font Sizes
```css
text-xs    /* 0.625rem - Tiny labels */
text-sm    /* 0.75rem - Small text */
text-base  /* 0.875rem - Body text (default) */
text-md    /* 1rem - Larger body */
text-lg    /* 1.125rem - Subheadings */
text-xl    /* 1.25rem - Card titles */
text-2xl   /* 1.5rem - Section headers */
text-3xl   /* 1.875rem - Page titles */
text-4xl   /* 2.25rem - Hero titles */
text-5xl   /* 3rem - Display text */
```

## 🔘 Components

### Buttons

```jsx
// Primary Button
<button className="btn-primary">
  Click Me
</button>

// Secondary Button
<button className="btn-secondary">
  Click Me
</button>

// Ghost Button
<button className="btn-ghost">
  Click Me
</button>

// With Tailwind classes
<button className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-fast">
  Custom Button
</button>
```

### Cards

```jsx
// Basic Card
<div className="card">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-text-light-secondary dark:text-text-dark-secondary">
    Card content
  </p>
</div>

// Premium Card with Gradient
<div className="card-premium">
  Content
</div>

// Glass Card
<div className="card-glass">
  Content
</div>

// Hero/Featured Card
<div className="hero-card">
  <h2 className="hero-card-title">Title</h2>
  <p className="hero-card-subtitle">Subtitle</p>
</div>
```

### Widget Cards

```jsx
// Stat Widget
<div className="widget-card widget-yellow">
  <div className="widget-icon">📊</div>
  <div className="widget-value">1,234</div>
  <div className="widget-label">Total Views</div>
</div>

// Available widget colors:
// widget-yellow, widget-orange, widget-green, 
// widget-blue, widget-purple, widget-pink
```

### Inputs

```jsx
// Standard Input
<input 
  type="text" 
  className="input-field" 
  placeholder="Enter text..."
/>

// Textarea
<textarea 
  className="input-field" 
  placeholder="Enter longer text..."
/>

// Search Input
<input 
  type="search" 
  className="input-field input-search" 
  placeholder="Search..."
/>
```

### Badges

```jsx
// Solid Badge
<span className="badge badge-primary">New</span>

// Subtle Badge (using Tailwind)
<span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
  Badge
</span>

// Status Badges
<span className="badge-success">Active</span>
<span className="badge-warning">Pending</span>
<span className="badge-danger">Error</span>
```

### Avatars

```jsx
// Avatar with size variants
<div className="avatar avatar-md">
  <img src="..." alt="User" />
</div>

// Avatar sizes: avatar-xs, avatar-sm, avatar-md, avatar-lg, avatar-xl, avatar-2xl

// Colored Avatar with Initials
<div className="avatar avatar-lg avatar-purple">
  JD
</div>
```

### Progress Bars

```jsx
// Standard Progress Bar
<div className="progress-bar">
  <div className="progress-fill" style={{ width: '60%' }}></div>
</div>

// Using Tailwind
<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
  <div 
    className="bg-gradient-to-r from-primary to-secondary rounded-full h-2 transition-all" 
    style={{ width: '60%' }}
  />
</div>
```

### Tabs

```jsx
// Underline Tabs
<div className="tabs-underline">
  <button className="tab-item active">Tab 1</button>
  <button className="tab-item">Tab 2</button>
  <button className="tab-item">Tab 3</button>
</div>

// Pills Tabs
<div className="tabs-pills">
  <button className="tab-item active">Tab 1</button>
  <button className="tab-item">Tab 2</button>
  <button className="tab-item">Tab 3</button>
</div>
```

### Dropdowns

```jsx
// Dropdown Menu
<div className="dropdown-menu">
  <button className="dropdown-item">
    <span>Option 1</span>
  </button>
  <button className="dropdown-item">
    <span>Option 2</span>
  </button>
  <div className="divider" />
  <button className="dropdown-item">
    <span>Option 3</span>
  </button>
</div>
```

### Activity Feed

```jsx
// Activity Item
<div className="activity-item">
  <img src="..." alt="User" className="activity-avatar" />
  <div className="activity-content">
    <div className="activity-username">John Doe</div>
    <div className="activity-action">completed a task</div>
    <div className="activity-timestamp">2 hours ago</div>
  </div>
</div>
```

## 🎭 Animations

### Animation Classes

```jsx
// Fade animations
<div className="animate-fade-in">Content</div>

// Slide animations
<div className="animate-slide-in">Content</div>
<div className="animate-slide-in-right">Content</div>
<div className="animate-slide-in-bottom">Content</div>

// Scale animation
<div className="animate-scale-in">Content</div>

// Float animation
<div className="animate-float">Content</div>

// Pulse animation
<div className="animate-pulse-scale">Content</div>
```

### Hover Effects

```jsx
// Lift on hover
<div className="hover-lift">Content</div>

// Scale on hover
<div className="hover-scale">Content</div>

// Combine with cards
<div className="card hover-lift">Content</div>
```

### Loading States

```jsx
// Skeleton Loading
<div className="skeleton h-4 w-full mb-2"></div>
<div className="skeleton h-4 w-3/4 mb-2"></div>

// Spinner
<div className="spinner-premium"></div>

// Dots Loader
<div className="dots-loader">
  <span></span>
  <span></span>
  <span></span>
</div>
```

## 🎨 Utility Classes

### Spacing
Use Tailwind's spacing scale (based on 4px):
```css
p-4    /* padding: 1rem (16px) */
m-6    /* margin: 1.5rem (24px) */
gap-4  /* gap: 1rem */
space-x-2  /* horizontal spacing between children */
```

### Border Radius
```css
rounded-sm   /* 0.375rem */
rounded-md   /* 0.75rem */
rounded-lg   /* 1rem */
rounded-xl   /* 1.25rem */
rounded-2xl  /* 1.5rem */
rounded-3xl  /* 2rem */
rounded-full /* 9999px - perfect circles */
```

### Shadows
```css
/* Light mode */
shadow-sm-light
shadow-md-light
shadow-lg-light
shadow-xl-light

/* Dark mode */
shadow-sm-dark
shadow-md-dark
shadow-lg-dark
shadow-xl-dark

/* Auto-adapting */
shadow-premium
shadow-premium-lg
```

### Text Gradients

```jsx
// Gradient text
<h1 className="text-gradient-primary">
  Gradient Text
</h1>

// Animated gradient
<h1 className="text-gradient-animated">
  Animated Gradient
</h1>
```

## 🌓 Dark Mode

The design system uses class-based dark mode. Add `dark:` prefix to any utility:

```jsx
<div className="bg-white dark:bg-dark-primary text-gray-900 dark:text-gray-100">
  This adapts to dark mode
</div>

// Use design system tokens for consistency
<div className="bg-bg-light-primary dark:bg-bg-dark-primary">
  Using design tokens
</div>
```

## 📐 Layout Patterns

### Dashboard Layout

```jsx
<div className="min-h-screen bg-bg-light-secondary dark:bg-bg-dark-primary">
  {/* Sidebar */}
  <aside className="w-64 bg-bg-light-primary dark:bg-bg-dark-primary">
    {/* Navigation */}
  </aside>
  
  {/* Main Content */}
  <main className="flex-1 p-6">
    {/* Widgets Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Widget cards */}
    </div>
  </main>
  
  {/* Right Panel (Activity Feed) */}
  <aside className="w-80 bg-bg-light-primary dark:bg-bg-dark-primary">
    {/* Activity items */}
  </aside>
</div>
```

### Responsive Grid

```jsx
// Auto-responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Cards */}
</div>

// Masonry-style grid (requires Tailwind plugin or custom CSS)
<div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
  {/* Cards */}
</div>
```

## ♿ Accessibility

### Focus States
All interactive elements have proper focus states:
```jsx
<button className="focus-ring">
  Accessible Button
</button>
```

### Touch Targets
Minimum 44x44px touch targets on mobile:
```jsx
<button className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0">
  Touch-friendly
</button>
```

### Reduced Motion
Respects `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  /* Animations are disabled automatically */
}
```

## 📱 Responsive Design

### Breakpoints
```
xs:  320px  (Mobile)
sm:  640px  (Large mobile)
md:  768px  (Tablet)
lg:  1024px (Desktop)
xl:  1280px (Large desktop)
2xl: 1536px (Extra large)
```

### Mobile-First Example
```jsx
<div className="
  w-full           /* Mobile: full width */
  sm:w-auto        /* Tablet+: auto width */
  lg:w-1/2         /* Desktop: half width */
  p-4              /* Mobile: 1rem padding */
  lg:p-8           /* Desktop: 2rem padding */
">
  Responsive content
</div>
```

## 🎯 Best Practices

1. **Use Design Tokens**: Prefer design system classes over arbitrary values
   ```jsx
   ✅ <div className="bg-bg-light-primary dark:bg-bg-dark-primary">
   ❌ <div className="bg-white dark:bg-gray-900">
   ```

2. **Consistent Spacing**: Use the 4px-based spacing scale
   ```jsx
   ✅ <div className="p-4 gap-6 mb-8">
   ❌ <div className="p-[17px] gap-[25px] mb-[33px]">
   ```

3. **Semantic Colors**: Use semantic color names
   ```jsx
   ✅ <div className="bg-success text-white">
   ❌ <div className="bg-green-500 text-white">
   ```

4. **Animation Duration**: Use predefined durations
   ```jsx
   ✅ <div className="transition-fast">
   ❌ <div className="transition-[183ms]">
   ```

5. **Dark Mode**: Always provide dark mode variants
   ```jsx
   ✅ <div className="bg-white dark:bg-gray-900">
   ❌ <div className="bg-white">
   ```

## 🔧 Customization

To customize the design system, edit:
- `tailwind.config.js` - Tailwind tokens
- `src/index.css` - CSS variables and component styles

## 📚 Examples

### Complete Card Example
```jsx
<div className="card hover-lift">
  <div className="flex items-center gap-4 mb-4">
    <div className="avatar avatar-lg avatar-purple">
      JD
    </div>
    <div>
      <h3 className="text-xl font-semibold">John Doe</h3>
      <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
        Software Engineer
      </p>
    </div>
  </div>
  
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div className="widget-card widget-blue">
      <div className="widget-value">142</div>
      <div className="widget-label">Projects</div>
    </div>
    <div className="widget-card widget-green">
      <div className="widget-value">98%</div>
      <div className="widget-label">Success</div>
    </div>
  </div>
  
  <button className="btn-primary w-full">
    View Profile
  </button>
</div>
```

### Complete Form Example
```jsx
<form className="card max-w-md mx-auto">
  <h2 className="text-2xl font-bold mb-6">Sign In</h2>
  
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-2">Email</label>
      <input 
        type="email" 
        className="input-field w-full" 
        placeholder="your@email.com"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium mb-2">Password</label>
      <input 
        type="password" 
        className="input-field w-full" 
        placeholder="••••••••"
      />
    </div>
    
    <button type="submit" className="btn-primary w-full">
      Sign In
    </button>
  </div>
</form>
```

## 🚀 Getting Started

1. All design system styles are automatically loaded via `src/index.css`
2. Use the provided class names in your components
3. Combine with Tailwind utilities for custom layouts
4. Reference this guide for component patterns

## 📖 Additional Resources

- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Design Tokens: See `tailwind.config.js`
- Component Styles: See `src/index.css`

---

**Version**: 3.0  
**Last Updated**: 2024  
**Design System**: Dashboard Reading & Activity Tracker

