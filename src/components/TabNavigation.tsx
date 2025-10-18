import React from 'react';
import { NavLink } from 'react-router-dom';
import type { TabItem } from '../types';

interface TabNavigationProps {
  tabs: TabItem[];
  baseClass?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, baseClass = '' }) => {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 ${baseClass}`}>
      <nav className="flex space-x-1" aria-label="Tabs">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) =>
              `px-6 py-3 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-white dark:bg-gray-800 text-secondary border-b-2 border-secondary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <span className="flex items-center">
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;

