import React, { useState, useEffect } from 'react';
import type { Transaction } from '../types';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSave: (transaction: Transaction) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onSave,
}) => {
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ first?: string; second?: string }>({});

  useEffect(() => {
    if (transaction) {
      setFirst(transaction.first.toString());
      setSecond(transaction.second.toString());
      setNotes(transaction.notes || '');
    }
  }, [transaction]);

  const validate = (): boolean => {
    const newErrors: { first?: string; second?: string } = {};

    if (!first.trim() && !second.trim()) {
      newErrors.first = 'Enter at least one amount';
    }

    if (first.trim() && isNaN(Number(first))) {
      newErrors.first = 'FIRST must be a valid number';
    }

    if (second.trim() && isNaN(Number(second))) {
      newErrors.second = 'SECOND must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction || !validate()) {
      return;
    }

    const updated: Transaction = {
      ...transaction,
      first: first.trim() ? Number(first) : 0,
      second: second.trim() ? Number(second) : 0,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    onClose();
  };

  if (!isOpen || !transaction) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Edit Transaction
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Number (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number
                </label>
                <input
                  type="text"
                  value={transaction.number}
                  disabled
                  className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>

              {/* FIRST Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  FIRST Amount
                </label>
                <input
                  type="number"
                  value={first}
                  onChange={(e) => {
                    setFirst(e.target.value);
                    if (errors.first) setErrors(prev => ({ ...prev, first: undefined }));
                  }}
                  placeholder="Enter FIRST amount"
                  className={`input-field ${errors.first ? 'border-danger' : ''}`}
                  step="0.01"
                />
                {errors.first && (
                  <p className="mt-1 text-sm text-danger">{errors.first}</p>
                )}
              </div>

              {/* SECOND Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SECOND Amount
                </label>
                <input
                  type="number"
                  value={second}
                  onChange={(e) => {
                    setSecond(e.target.value);
                    if (errors.second) setErrors(prev => ({ ...prev, second: undefined }));
                  }}
                  placeholder="Enter SECOND amount"
                  className={`input-field ${errors.second ? 'border-danger' : ''}`}
                  step="0.01"
                />
                {errors.second && (
                  <p className="mt-1 text-sm text-danger">{errors.second}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or comments..."
                  className="input-field h-24 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTransactionModal;

