import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState Component
 * 
 * Beautiful empty states with optional action button
 * Includes subtle entrance animation
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className = '',
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      style={{
        animation: 'fadeSlideUp 0.4s ease-out',
      }}
    >
      {/* Icon or Default Illustration */}
      <div className="mb-6 opacity-40">
        {icon || (
          <svg
            className="w-24 h-24 text-[#9CA3AF] dark:text-[#6B7280]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-[#6B7280] dark:text-[#9CA3AF] max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
          style={{
            boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

// Specific empty state variants
export const EmptyProjectsState: React.FC<{
  onCreateProject: () => void;
}> = ({ onCreateProject }) => {
  return (
    <EmptyState
      title="No projects yet"
      description="Get started by creating your first project to track your numbers"
      action={{
        label: "Create Project",
        onClick: onCreateProject,
      }}
      icon={
        <svg
          className="w-24 h-24 text-[#9CA3AF] dark:text-[#6B7280]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      }
    />
  );
};

export const EmptyTransactionsState: React.FC<{
  onAddEntry: () => void;
}> = ({ onAddEntry }) => {
  return (
    <EmptyState
      title="No entries yet"
      description="Start adding your numbers to see them here"
      action={{
        label: "Add Entry",
        onClick: onAddEntry,
      }}
      icon={
        <svg
          className="w-24 h-24 text-[#9CA3AF] dark:text-[#6B7280]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
          <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
        </svg>
      }
    />
  );
};

export const EmptyHistoryState: React.FC = () => {
  return (
    <EmptyState
      title="No history available"
      description="Your transaction history will appear here once you start adding entries"
      icon={
        <svg
          className="w-24 h-24 text-[#9CA3AF] dark:text-[#6B7280]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
    />
  );
};

export const EmptySearchState: React.FC = () => {
  return (
    <EmptyState
      title="No results found"
      description="Try adjusting your search or filters"
      icon={
        <svg
          className="w-24 h-24 text-[#9CA3AF] dark:text-[#6B7280]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
    />
  );
};

