import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../components/ProjectHeader';
import EntryPanel from '../components/EntryPanel';
import FloatingActionButton from '../components/FloatingActionButton';
import { useTransactions } from '../hooks/useTransactions';
import { useHistory } from '../hooks/useHistory';
import { getProject } from '../utils/storage';
import { formatDate, formatCurrency, formatTime } from '../utils/helpers';
import type { Transaction } from '../types';

interface EditModalProps {
  transaction: Transaction;
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ transaction, onSave, onCancel }) => {
  const [editedTransaction, setEditedTransaction] = useState(transaction);

  // Parse bulk entries if they exist (comma or space separated)
  const isBulkEntry = transaction.number.includes(',') || transaction.number.includes(' ');
  const numbers = isBulkEntry 
    ? transaction.number.split(/[,\s]+/).filter(n => n.trim()) 
    : [transaction.number];

  const [bulkAmounts, setBulkAmounts] = useState<{ [key: string]: { first: number; second: number } }>(
    numbers.reduce((acc, num) => {
      acc[num] = { 
        first: transaction.first || 0, 
        second: transaction.second || 0 
      };
      return acc;
    }, {} as { [key: string]: { first: number; second: number } })
  );

  const handleSave = () => {
    if (isBulkEntry) {
      // For bulk entries, we'll save the first number's amounts to the transaction
      // In a real scenario, you might want to create separate transactions
      const firstNum = numbers[0];
      onSave({
        ...editedTransaction,
        first: bulkAmounts[firstNum].first,
        second: bulkAmounts[firstNum].second,
      });
    } else {
      onSave(editedTransaction);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Edit Transaction</h2>
          <p className="text-blue-100 text-sm mt-1">
            {isBulkEntry ? `Bulk Entry: ${numbers.length} numbers` : `Single Entry: ${transaction.number}`}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {isBulkEntry ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Edit amounts for each number in the bulk entry:
              </p>
              {numbers.map((num) => (
                <div key={num} className="card p-4 space-y-3">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    Number: {num}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Amount
                      </label>
                      <input
                        type="number"
                        value={bulkAmounts[num].first}
                        onChange={(e) =>
                          setBulkAmounts({
                            ...bulkAmounts,
                            [num]: { ...bulkAmounts[num], first: Number(e.target.value) },
                          })
                        }
                        className="input w-full"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Second Amount
                      </label>
                      <input
                        type="number"
                        value={bulkAmounts[num].second}
                        onChange={(e) =>
                          setBulkAmounts({
                            ...bulkAmounts,
                            [num]: { ...bulkAmounts[num], second: Number(e.target.value) },
                          })
                        }
                        className="input w-full"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number
                </label>
                <input
                  type="text"
                  value={editedTransaction.number}
                  disabled
                  className="input w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Amount
                  </label>
                  <input
                    type="number"
                    value={editedTransaction.first || 0}
                    onChange={(e) =>
                      setEditedTransaction({
                        ...editedTransaction,
                        first: Number(e.target.value),
                      })
                    }
                    className="input w-full"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Second Amount
                  </label>
                  <input
                    type="number"
                    value={editedTransaction.second || 0}
                    onChange={(e) =>
                      setEditedTransaction({
                        ...editedTransaction,
                        second: Number(e.target.value),
                      })
                    }
                    className="input w-full"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entry Type
                </label>
                <input
                  type="text"
                  value={editedTransaction.entryType}
                  disabled
                  className="input w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed capitalize"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const HistoryPage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const project = projectId ? getProject(projectId) : null;
  const { transactions, updateTransaction, deleteTransaction, refresh } = useTransactions(projectId || '');
  const { undo, redo, canUndo, canRedo } = useHistory(projectId || '');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'akra' | 'ring'>('all');
  const [filterEntry, setFilterEntry] = useState<'all' | 'first' | 'second' | 'both'>('all');
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [entryPanelOpen, setEntryPanelOpen] = useState(false);

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Filter by entry type
        if (filterType !== 'all' && t.entryType !== filterType) return false;

        // Filter by first/second/both
        if (filterEntry === 'first' && !t.first) return false;
        if (filterEntry === 'second' && !t.second) return false;
        if (filterEntry === 'both' && (!t.first || !t.second)) return false;

        // Search by number
        if (searchTerm && !t.number.includes(searchTerm)) return false;

        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [transactions, filterType, filterEntry, searchTerm]);

  const handleSelectTransaction = (transactionId: string) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(transactionId)) {
      newSelected.delete(transactionId);
    } else {
      newSelected.add(transactionId);
    }
    setSelectedTransactions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTransactions.size === filteredTransactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(filteredTransactions.map((t) => t.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedTransactions.size === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedTransactions.size} transaction(s)?`
    );

    if (confirmDelete) {
      selectedTransactions.forEach((id) => {
        deleteTransaction(id);
      });
      setSelectedTransactions(new Set());
    }
  };

  const handleDeleteSingle = (transactionId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this transaction?');
    if (confirmDelete) {
      deleteTransaction(transactionId);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSaveEdit = (updatedTransaction: Transaction) => {
    updateTransaction(updatedTransaction.id, updatedTransaction);
    setEditingTransaction(null);
  };

  const getEntryTypeLabel = (transaction: Transaction): string => {
    const hasFirst = transaction.first && transaction.first > 0;
    const hasSecond = transaction.second && transaction.second > 0;

    if (hasFirst && hasSecond) return 'Both';
    if (hasFirst) return 'First';
    if (hasSecond) return 'Second';
    return 'None';
  };

  const getEntryTypeColor = (transaction: Transaction): string => {
    const hasFirst = transaction.first && transaction.first > 0;
    const hasSecond = transaction.second && transaction.second > 0;

    if (hasFirst && hasSecond) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (hasFirst) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (hasSecond) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  if (!project || !projectId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ProjectHeader
        projectName={project.name}
        projectDate={formatDate(project.date)}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Transaction History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete history of all entries with full details
          </p>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Number
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., 00, 123"
                className="input w-full"
              />
            </div>

            {/* Entry Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'akra' | 'ring')}
                className="input w-full"
              >
                <option value="all">All Types</option>
                <option value="akra">Akra (2-digit)</option>
                <option value="ring">Ring (3-digit)</option>
              </select>
            </div>

            {/* Amount Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount Type
              </label>
              <select
                value={filterEntry}
                onChange={(e) => setFilterEntry(e.target.value as 'all' | 'first' | 'second' | 'both')}
                className="input w-full"
              >
                <option value="all">All</option>
                <option value="first">First Only</option>
                <option value="second">Second Only</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-end">
              <button
                onClick={handleBulkDelete}
                disabled={selectedTransactions.size === 0}
                className="btn-danger w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete {selectedTransactions.size > 0 ? `(${selectedTransactions.size})` : ''}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Entries</p>
                <p className="text-3xl font-bold mt-1">{filteredTransactions.length}</p>
              </div>
              <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">First PKR</p>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(
                    filteredTransactions.reduce((sum, t) => sum + (t.first || 0), 0)
                  )}
                </p>
              </div>
              <svg className="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Second PKR</p>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(
                    filteredTransactions.reduce((sum, t) => sum + (t.second || 0), 0)
                  )}
                </p>
              </div>
              <svg className="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total PKR</p>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(
                    filteredTransactions.reduce(
                      (sum, t) => sum + (t.first || 0) + (t.second || 0),
                      0
                    )
                  )}
                </p>
              </div>
              <svg className="w-12 h-12 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Select All Button */}
        {filteredTransactions.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {selectedTransactions.size === filteredTransactions.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedTransactions.size > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedTransactions.size} selected
              </p>
            )}
          </div>
        )}

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="card text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`card hover:shadow-lg transition-all ${
                  selectedTransactions.has(transaction.id)
                    ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                    : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedTransactions.has(transaction.id)}
                    onChange={() => handleSelectTransaction(transaction.id)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {transaction.number}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatTime(transaction.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.entryType === 'akra'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          }`}
                        >
                          {transaction.entryType === 'akra' ? 'Akra' : 'Ring'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEntryTypeColor(transaction)}`}>
                          {getEntryTypeLabel(transaction)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {transaction.first && transaction.first > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                            First Entry
                          </p>
                          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {formatCurrency(transaction.first)}
                          </p>
                        </div>
                      )}

                      {transaction.second && transaction.second > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                            Second Entry
                          </p>
                          <p className="text-lg font-bold text-green-900 dark:text-green-100">
                            {formatCurrency(transaction.second)}
                          </p>
                        </div>
                      )}

                      {transaction.first && transaction.second && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
                            Total
                          </p>
                          <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                            {formatCurrency(transaction.first + transaction.second)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="btn-secondary text-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSingle(transaction.id)}
                        className="btn-danger text-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <EditModal
          transaction={editingTransaction}
          onSave={handleSaveEdit}
          onCancel={() => setEditingTransaction(null)}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setEntryPanelOpen(true)}
        position="bottom-right"
        color="purple"
        label="Add Entry (Ctrl+E)"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
      />

      {/* Entry Panel */}
      <EntryPanel
        isOpen={entryPanelOpen}
        onClose={() => setEntryPanelOpen(false)}
        projectId={projectId || ''}
        entryType="akra"
        onEntryAdded={() => {
          refresh();
          setEntryPanelOpen(false);
        }}
      />
    </div>
  );
};

export default HistoryPage;

