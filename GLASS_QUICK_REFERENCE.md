# Glassmorphic Design System - Quick Reference

## 🎨 Color Classes (Quick Copy)

```tsx
// Pastel Blue
bg-pastel-blue-50    bg-pastel-blue-100    bg-pastel-blue-200
bg-pastel-blue-300   bg-pastel-blue-400    bg-pastel-blue-500
bg-pastel-blue-600

// Pastel Pink  
bg-pastel-pink-50    bg-pastel-pink-100    bg-pastel-pink-200
bg-pastel-pink-300   bg-pastel-pink-400    bg-pastel-pink-500
bg-pastel-pink-600

// Pastel Purple
bg-pastel-purple-50  bg-pastel-purple-100  bg-pastel-purple-200
bg-pastel-purple-300 bg-pastel-purple-400  bg-pastel-purple-500
bg-pastel-purple-600

// Pastel Mint
bg-pastel-mint-50    bg-pastel-mint-100    bg-pastel-mint-200
bg-pastel-mint-300   bg-pastel-mint-400    bg-pastel-mint-500

// Pastel Gray
bg-pastel-gray-50    bg-pastel-gray-100    bg-pastel-gray-200
bg-pastel-gray-300   bg-pastel-gray-400    bg-pastel-gray-500
bg-pastel-gray-600   bg-pastel-gray-700    bg-pastel-gray-800
```

## ✨ Glass Effects

```tsx
glass-card          /* Standard frosted glass */
glass-card-strong   /* More opaque glass */
glass-card-subtle   /* Very subtle glass */
```

## 📊 Chart Bars

```tsx
chart-bar-blue      /* Blue gradient bar */
chart-bar-pink      /* Pink gradient bar */
chart-bar-purple    /* Purple gradient bar */
chart-bar-mint      /* Mint gradient bar */
chart-bar-gray      /* Gray gradient bar */
```

## 🎭 Patterns

```tsx
pattern-dots        /* Dot pattern (actual data) */
pattern-stripes     /* Stripe pattern (projected data) */
chart-bar-with-dots    /* Bar + dots overlay */
chart-bar-with-stripes /* Bar + stripes overlay */
```

## 💬 Text Colors

```tsx
text-glass-primary     /* #1F2937 */
text-glass-secondary   /* #4B5563 */
text-glass-tertiary    /* #6B7280 */
text-glass-quaternary  /* #9CA3AF */
```

## 🏷️ Badges

```tsx
trend-badge-positive   /* Green (positive trend) */
trend-badge-negative   /* Amber (negative trend) */
trend-badge-neutral    /* Gray (neutral trend) */
```

## 🎯 Shadows

```tsx
shadow-glass-xs    shadow-glass-sm    shadow-glass-md
shadow-glass-lg    shadow-glass-xl
shadow-glass-blue  shadow-glass-pink  shadow-glass-purple
```

## 🔄 Transitions

```tsx
glass-transition       /* 250ms */
glass-transition-fast  /* 150ms */
glass-transition-slow  /* 350ms */
```

## 🎨 Backgrounds

```tsx
bg-gradient-glass   /* Page background gradient */
bg-gradient-card    /* Card gradient overlay */
```

## 📦 Components (Copy-Paste)

### Stat Card
```tsx
<GlassStatCard
  label="Total applicants"
  value="+120"
  trend={{ value: "24%", direction: "up" }}
  subtitle="vs last week"
  colorScheme="blue"
/>
```

### Chart Bar
```tsx
<GlassChartBar
  value={75}
  maxValue={100}
  label="Screening"
  colorScheme="blue"
  pattern="dots"
/>
```

### Glass Card
```tsx
<GlassmorphicCard variant="default" hoverable>
  {/* Content */}
</GlassmorphicCard>
```

## 🎯 Common Patterns

### Stat Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <GlassStatCard {...props} />
  <GlassStatCard {...props} />
  <GlassStatCard {...props} />
</div>
```

### Chart Container
```tsx
<GlassmorphicCard className="p-6 rounded-2xl">
  <h2 className="text-xl font-semibold text-glass-primary mb-6">
    Chart Title
  </h2>
  <div className="flex items-end justify-around gap-4 h-64">
    <GlassChartBar {...props} />
    <GlassChartBar {...props} />
  </div>
</GlassmorphicCard>
```

### Heatmap Cell
```tsx
<div className="bg-pastel-blue-200 rounded-xl py-4 px-6 text-center">
  <span className="text-base font-semibold text-glass-primary">27</span>
</div>
```

### Page Container
```tsx
<div className="min-h-screen bg-gradient-glass p-4 md:p-8">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</div>
```

## 📏 Spacing Reference

```tsx
gap-6     /* 1.5rem - Card grids */
p-6       /* 1.5rem - Card padding */
mb-6      /* 1.5rem - Section spacing */
mb-8      /* 2rem - Large section gaps */
```

## 🎨 Border Radius

```tsx
rounded-xl   /* 1.25rem - Stat cards */
rounded-2xl  /* 1.5rem - Large cards */
rounded-lg   /* 1rem - Standard cards */
rounded-md   /* 0.75rem - Buttons */
rounded-full /* 9999px - Badges */
```

## 📝 Typography

```tsx
text-5xl font-bold           /* Display Large - Stats */
text-4xl font-bold           /* Display Medium - Titles */
text-3xl font-bold           /* H1 - Section Headers */
text-2xl font-semibold       /* H2 - Card Titles */
text-xl font-semibold        /* H3 - Component Titles */
text-sm                      /* Body - Standard Text */
text-xs                      /* Caption - Metadata */
```

## 🔗 Quick Links

- Example: `/glass-example`
- Docs: `GLASSMORPHIC_DESIGN_SYSTEM.md`
- Summary: `GLASSMORPHIC_IMPLEMENTATION_SUMMARY.md`
- Specs: `design-system-dashboard-style.json`

## 💡 Pro Tips

1. **Always use pastel colors** - Never vibrant/saturated
2. **Apply glass effect to cards** - Use `glass-card` class
3. **Dots for actual data** - `pattern="dots"`
4. **Stripes for projected data** - `pattern="stripes"`
5. **Generous spacing** - Use `gap-6` or larger
6. **Large stat numbers** - `text-5xl font-bold`
7. **Soft shadows** - Use `shadow-glass-*` classes
8. **Rounded corners** - `rounded-xl` or `rounded-2xl`
9. **Clear hierarchy** - Use proper text colors
10. **Gradient bars** - Always use `chart-bar-*` classes

---

**Version:** 1.0.0 | **Status:** ✅ Ready to Use


