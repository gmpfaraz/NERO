import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, header, footer }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-lightSecondary dark:bg-gray-900">
      {header && (
        <header className="bg-white dark:bg-secondary shadow-sm border-b border-gray-200 dark:border-gray-700 rounded-b-3xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {footer && (
        <footer className="bg-white dark:bg-secondary border-t border-gray-200 dark:border-gray-700 rounded-t-3xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;

