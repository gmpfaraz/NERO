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
              `px-6 py-3 text-sm font-medium rounded-t-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white dark:bg-secondary text-primary border-b-2 border-primary'
                  : 'text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-gray-100 hover:bg-background-lightSecondary dark:hover:bg-secondary-light'
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

