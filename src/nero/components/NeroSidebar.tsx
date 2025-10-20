import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string | number;
}

interface NeroSidebarProps {
  items: SidebarItem[];
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const NeroSidebar: React.FC<NeroSidebarProps> = ({ items, isCollapsed = false, onToggle }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-slate-700">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold nero-text-gradient">NERO</h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2 nero-scrollbar overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className={`flex-shrink-0 ${active ? 'text-white' : ''}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default NeroSidebar;

