import { useState, useCallback } from 'react';
import ConfirmationDialog from '../components/ConfirmationDialog';

interface ConfirmationOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const confirm = useCallback((
    message: string,
    options: ConfirmationOptions = {}
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmation({
        isOpen: true,
        title: options.title || 'Confirm Action',
        message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'info',
        onConfirm: () => {
          setConfirmation(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmation(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  }, []);

  const ConfirmationComponent = useCallback(() => {
    return (
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        onConfirm={confirmation.onConfirm}
        onCancel={confirmation.onCancel}
        type={confirmation.type}
      />
    );
  }, [confirmation]);

  return {
    confirm,
    ConfirmationComponent
  };
};
