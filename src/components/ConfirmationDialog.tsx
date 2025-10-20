import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '⚠️',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          borderColor: 'border-red-200 dark:border-red-800',
          iconBg: 'bg-red-100 dark:bg-red-900/20'
        };
      case 'warning':
        return {
          icon: '⚠️',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/20'
        };
      default:
        return {
          icon: 'ℹ️',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          borderColor: 'border-blue-200 dark:border-blue-800',
          iconBg: 'bg-blue-100 dark:bg-blue-900/20'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full mx-2 sm:mx-0 animate-scale-in">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl ${styles.iconBg}`}>
              {styles.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
                {title}
              </h3>
            </div>
          </div>

          {/* Message */}
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line break-words">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 ${styles.confirmBg} text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
