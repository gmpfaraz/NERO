import React, { useEffect } from 'react';
import type { ActionHistory } from '../types';
import { formatTimestamp } from '../utils/helpers';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: ActionHistory[];
  onRevert?: (actionId: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onRevert,
}) => {
  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'add':
        return (
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'edit':
        return (
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case 'delete':
        return (
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        );
      case 'filter':
        return (
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
        );
      case 'import':
        return (
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
            <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        );
      case 'batch':
        return (
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-[420px] bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              History
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {history.length} {history.length === 1 ? 'action' : 'actions'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* History List */}
        <div className="overflow-y-auto h-[calc(100vh-180px)] p-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No history yet
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Actions will appear here as you work
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((action) => (
                <div
                  key={action.id}
                  className="card p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    {getActionIcon(action.type)}
                    
                    <div className="flex-1 min-w-0">
                      {/* Action Description */}
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {action.description}
                      </p>
                      
                      {/* Affected Numbers */}
                      {action.affectedNumbers.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {action.affectedNumbers.slice(0, 5).map((num, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                            >
                              {num}
                            </span>
                          ))}
                          {action.affectedNumbers.length > 5 && (
                            <span className="px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                              +{action.affectedNumbers.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatTimestamp(action.timestamp)}
                      </p>
                    </div>

                    {/* Revert Button */}
                    {onRevert && (
                      <button
                        onClick={() => onRevert(action.id)}
                        className="text-xs text-secondary hover:text-secondary-dark font-medium"
                        title="Revert this action"
                      >
                        Revert
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> to close
          </p>
        </div>
      </div>
    </>
  );
};

export default HistoryPanel;

