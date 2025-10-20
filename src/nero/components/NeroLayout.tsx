import React, { useState } from 'react';
import NeroSidebar, { type SidebarItem } from './NeroSidebar';
import NeroTopbar from './NeroTopbar';

interface NeroLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
}

const NeroLayout: React.FC<NeroLayoutProps> = ({ children, sidebarItems }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <NeroSidebar
        items={sidebarItems}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <NeroTopbar sidebarCollapsed={sidebarCollapsed} />
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default NeroLayout;

