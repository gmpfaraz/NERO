# 🎯 Premium Features - Implementation Examples

## Quick Copy-Paste Examples for Common Use Cases

---

## 1. 📊 Animated Stats Card

```jsx
import AnimatedNumber from '../components/AnimatedNumber';

<div className="card-premium hover-lift animate-slide-in-bottom">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Total Users
      </p>
      <p className="text-3xl font-bold text-gradient-primary mt-2">
        <AnimatedNumber value={totalUsers} />
      </p>
    </div>
    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center animate-float shadow-glow">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </div>
  </div>
</div>
```

---

## 2. 🔔 Toast Notifications

```jsx
import { useToast, ToastContainer } from '../components/Toast';

function MyComponent() {
  const { toasts, removeToast, showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Data saved successfully!');
    } catch (error) {
      showError('Failed to save data. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      await deleteData();
      showWarning('Item deleted', 5000); // Custom 5s duration
    }
  };

  return (
    <>
      <button onClick={handleSave} className="btn-primary">Save</button>
      <button onClick={handleDelete} className="btn-danger">Delete</button>
      
      {/* Place at end of component or in App.tsx */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
```

---

## 3. 📋 Premium Table with Hover Effects

```jsx
<div className="card-premium">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
    Data Table
  </h2>
  
  <div className="table-container">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Name
          </th>
          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Email
          </th>
          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
            <td className="py-4 px-4 text-gray-900 dark:text-gray-100">
              {item.name}
            </td>
            <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
              {item.email}
            </td>
            <td className="py-4 px-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                {item.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

---

## 4. 🎭 Premium Modal with Animations

```jsx
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(true)} className="btn-primary">
      Open Modal
    </button>

    {isOpen && (
      <div 
        className="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setIsOpen(false)}
      >
        <div 
          className="modal-content bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Modal Title
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Modal content goes here
            </p>
            
            <div className="flex gap-3 justify-end">
              <button onClick={() => setIsOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleAction} className="btn-primary">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);
```

---

## 5. ⏳ Loading States

### Spinner (Full Screen)
```jsx
{loading && (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="spinner-premium"></div>
  </div>
)}
```

### Inline Spinner
```jsx
<button className="btn-primary" disabled={loading}>
  {loading ? (
    <div className="spinner-premium spinner-small inline-block"></div>
  ) : (
    'Submit'
  )}
</button>
```

### Dots Loader
```jsx
{loading && (
  <div className="flex items-center justify-center py-8">
    <div className="dots-loader">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
)}
```

### Skeleton Loading
```jsx
{loading ? (
  <div className="space-y-3">
    <div className="skeleton h-8 w-64"></div>
    <div className="skeleton h-4 w-full"></div>
    <div className="skeleton h-4 w-full"></div>
    <div className="skeleton h-4 w-3/4"></div>
  </div>
) : (
  <div>{actualContent}</div>
)}
```

---

## 6. 🎨 Glassmorphism Card

```jsx
<div className="card-glass p-6">
  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
    Frosted Glass Effect
  </h3>
  <p className="text-gray-700 dark:text-gray-300">
    This card has a semi-transparent background with backdrop blur for a modern glassmorphism effect.
  </p>
</div>
```

---

## 7. 🌈 Gradient Border Card

```jsx
<div className="card-gradient-border">
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
      Gradient Border
    </h3>
    <p className="text-gray-700 dark:text-gray-300">
      Multi-color gradient border with clean inner content area.
    </p>
  </div>
</div>
```

---

## 8. 💡 Tooltip

```jsx
<button 
  className="tooltip btn-primary" 
  data-tooltip="This action will save your changes"
>
  Save
</button>

<span 
  className="tooltip text-gray-500 cursor-help"
  data-tooltip="More information about this field"
>
  ℹ️
</span>
```

---

## 9. 📊 Progress Bar

```jsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-gray-600 dark:text-gray-400">Progress</span>
    <span className="font-bold text-gradient-primary">60%</span>
  </div>
  <div className="progress-bar">
    <div className="progress-fill" style={{ width: '60%' }}></div>
  </div>
</div>
```

---

## 10. 🎯 Staggered List Animation

```jsx
<div className="space-y-4">
  {items.map((item, index) => (
    <div
      key={item.id}
      className="card-premium hover-lift animate-slide-in-bottom"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
        {item.title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mt-2">
        {item.description}
      </p>
    </div>
  ))}
</div>
```

---

## 11. 🎨 Gradient Text

```jsx
<h1 className="text-4xl font-bold text-gradient-primary">
  Primary Gradient
</h1>

<h2 className="text-3xl font-bold text-gradient-secondary">
  Secondary Gradient
</h2>

<p className="text-2xl font-bold text-gradient-animated">
  Animated Multi-Color Gradient
</p>
```

---

## 12. 🌟 Icon Badge with Animation

```jsx
<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-float shadow-glow hover-lift">
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
</div>
```

---

## 13. 🔘 Enhanced Buttons

```jsx
{/* Primary with ripple */}
<button className="btn-primary">
  Click Me
</button>

{/* Secondary with icon */}
<button className="btn-secondary flex items-center gap-2">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
  Add New
</button>

{/* Danger */}
<button className="btn-danger flex items-center gap-2">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
  Delete
</button>

{/* Success */}
<button className="btn-success flex items-center gap-2">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
  Approve
</button>
```

---

## 14. 📱 Responsive Grid with Animations

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item, index) => (
    <div
      key={item.id}
      className="card-premium hover-lift animate-scale-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            {item.icon}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {item.subtitle}
          </p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300">
        {item.description}
      </p>
    </div>
  ))}
</div>
```

---

## 15. 🎨 Mesh Gradient Background

```jsx
<div className="mesh-gradient min-h-screen p-8">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
      Beautiful Mesh Gradient Background
    </h1>
    {/* Your content */}
  </div>
</div>
```

---

## 16. 💳 Profile Card with All Effects

```jsx
<div className="card-premium hover-lift hover-glow animate-scale-in">
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-glow">
      JD
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        John Doe
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        john.doe@example.com
      </p>
    </div>
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
      🟢 Online
    </span>
  </div>
  
  <div className="mt-6 grid grid-cols-3 gap-4">
    <div className="text-center">
      <p className="text-2xl font-bold text-gradient-primary">
        <AnimatedNumber value={1234} />
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Posts</p>
    </div>
    <div className="text-center">
      <p className="text-2xl font-bold text-gradient-secondary">
        <AnimatedNumber value={5678} />
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Followers</p>
    </div>
    <div className="text-center">
      <p className="text-2xl font-bold text-gradient-success">
        <AnimatedNumber value={234} />
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Following</p>
    </div>
  </div>
</div>
```

---

## 🎯 Pro Tips

1. **Combine animations:** Mix `hover-lift` + `hover-glow` for premium feel
2. **Stagger delays:** Use `0.1s` increments for list items
3. **Use AnimatedNumber:** For all stats and numeric displays
4. **Add tooltips:** On icons and abbreviated text
5. **Wrap tables:** Always use `.table-container` wrapper
6. **Toast feedback:** Show success/error for all actions
7. **Loading states:** Always show feedback during async operations
8. **Responsive design:** Use Tailwind's responsive classes (`md:`, `lg:`)

---

## 🚀 Performance Tips

- Only animate elements when visible (using Intersection Observer)
- Use `will-change` sparingly (only on actively animating elements)
- Prefer `transform` and `opacity` for smooth 60fps animations
- Limit number of simultaneous animations
- Use skeletons instead of spinners for better perceived performance

---

Happy coding with premium UI! ✨

