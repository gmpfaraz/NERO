import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectHeader from '../components/ProjectHeader';
import TabNavigation from '../components/TabNavigation';
import NumberGrid from '../components/NumberGrid';
import FilterTab from '../components/FilterTab';
import TransactionModal from '../components/TransactionModal';
import LoadingSpinner from '../components/LoadingSpinner';
import PremiumStats from '../components/PremiumStats';
import EntryPanel from '../components/EntryPanel';
import FloatingActionButton from '../components/FloatingActionButton';
import { useTransactions } from '../hooks/useTransactions';
import { useHistory } from '../hooks/useHistory';
import { groupTransactionsByNumber } from '../utils/transactionHelpers';
import { getProject } from '../utils/storage';
import { formatDate } from '../utils/helpers';
import type { TabItem, Transaction } from '../types';

const AkraPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'entries' | 'filter'>('entries');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState<Set<string>>(new Set());
  const [modalNumber, setModalNumber] = useState<string | null>(null);
  const [entryPanelOpen, setEntryPanelOpen] = useState(false);
  
  const project = getProject(id || '');
  const { transactions, loading, refresh, deleteTransaction, updateTransaction, addTransaction } = useTransactions(id || '');
  const { canUndo, canRedo, undo, redo, addAction } = useHistory(id || '');

  // Group transactions by number
  const summaries = useMemo(
    () => groupTransactionsByNumber(transactions, 'akra'),
    [transactions]
  );

  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: `/project/${id}` },
    { id: 'akra', label: 'Akra (00)', path: `/project/${id}/akra` },
    { id: 'ring', label: 'Ring (000)', path: `/project/${id}/ring` },
    { id: 'advanced', label: 'Advanced Filter', path: `/project/${id}/advanced-filter` },
  ];

  const handleNumberClick = (number: string) => {
    setModalNumber(number);
  };

  const handleDelete = (transactionId: string) => {
    if (deleteTransaction(transactionId)) {
      addAction('delete', `Deleted transaction`, []);
      refresh();
    }
  };

  const handleSaveFilterResults = async (deductions: Array<{ number: string; firstAmount: number; secondAmount: number }>) => {
    // Create negative transactions for each deduction
    for (const deduction of deductions) {
      addTransaction({
        projectId: id || '',
        number: deduction.number,
        entryType: 'akra',
        first: -deduction.firstAmount, // Negative to deduct
        second: -deduction.secondAmount, // Negative to deduct
        notes: 'Filter deduction',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFilterDeduction: true,
      });
    }
    
    addAction('edit', `Applied filter deductions to ${deductions.length} number(s)`, []);
    refresh();
  };

  const handleEdit = (transaction: Transaction) => {
    if (updateTransaction(transaction.id, transaction)) {
      addAction('edit', `Edited transaction for ${transaction.number}`, [transaction.number]);
      refresh();
      // Refresh the modal by closing and reopening
      setModalNumber(null);
      setTimeout(() => setModalNumber(transaction.number), 100);
    }
  };

  const handleBulkDelete = () => {
    if (selectedNumbers.size === 0) return;
    
    if (!confirm(`Delete all transactions for ${selectedNumbers.size} selected numbers?`)) {
      return;
    }

    let deletedCount = 0;
    selectedNumbers.forEach(number => {
      const summary = summaries.get(number);
      if (summary) {
        summary.transactions.forEach(t => {
          if (deleteTransaction(t.id)) {
            deletedCount++;
          }
        });
      }
    });

    addAction('batch', `Bulk deleted ${deletedCount} transactions`, Array.from(selectedNumbers));
    setSelectedNumbers(new Set());
    setSelectionMode(false);
    refresh();
    alert(`Deleted ${deletedCount} transactions!`);
  };

  const handleExport = () => {
    const data = Array.from(summaries.values());
    const csv = [
      'Number,FIRST,SECOND,Total,Entries',
      ...data.map(
        (s) =>
          `${s.number},${s.firstTotal},${s.secondTotal},${
            s.firstTotal + s.secondTotal
          },${s.entryCount}`
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `akra-export-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSelectAll = () => {
    if (selectedNumbers.size === summaries.size) {
      setSelectedNumbers(new Set());
    } else {
      setSelectedNumbers(new Set(Array.from(summaries.keys())));
    }
  };

  const handleClearSelection = () => {
    setSelectedNumbers(new Set());
    setSelectionMode(false);
  };

  const modalSummary = modalNumber ? summaries.get(modalNumber) : null;

  if (loading) {
    return (
      <div>
        <ProjectHeader
          projectName={project?.name || 'Loading...'}
          projectDate={project ? formatDate(project.date) : ''}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner text="Loading Akra data..." />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Project not found
            </h2>
          </div>
        </div>
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
        <TabNavigation tabs={tabs} baseClass="mb-6" />

        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Akra (2-digit Numbers)
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage entries for numbers 00-99
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('entries')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'entries'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Entries & Totals
          </button>
          <button
            onClick={() => setActiveTab('filter')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'filter'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Filter & Calculate
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'entries' ? (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search numbers (e.g., 01, 1*, *5)"
                  className="input-field"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectionMode(!selectionMode)}
                  className={`btn-secondary ${
                    selectionMode ? 'ring-2 ring-secondary' : ''
                  }`}
                >
                  {selectionMode ? 'Exit Selection' : 'Selection Mode'}
                </button>

                {selectionMode && (
                  <>
                    <button onClick={handleSelectAll} className="btn-secondary">
                      {selectedNumbers.size === summaries.size
                        ? 'Deselect All'
                        : 'Select All'}
                    </button>
                    <button
                      onClick={handleClearSelection}
                      className="btn-secondary"
                      disabled={selectedNumbers.size === 0}
                    >
                      Clear ({selectedNumbers.size})
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="btn-danger"
                      disabled={selectedNumbers.size === 0}
                    >
                      Delete Selected ({selectedNumbers.size})
                    </button>
                  </>
                )}

                <button onClick={handleExport} className="btn-secondary">
                  <svg
                    className="w-4 h-4 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export CSV
                </button>

                <button
                  onClick={() => navigate(`/project/${id}`)}
                  className="btn-secondary"
                >
                  <svg
                    className="w-4 h-4 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Entry
                </button>
              </div>
            </div>

            {/* Premium Statistics */}
            <PremiumStats 
              summaries={summaries}
              selectedNumbers={selectedNumbers}
              showSelected={selectionMode && selectedNumbers.size > 0}
            />

            {/* Number Grid */}
            <NumberGrid
              summaries={summaries}
              entryType="akra"
              onNumberClick={handleNumberClick}
              searchQuery={searchQuery}
              selectedNumbers={selectedNumbers}
              onSelectionChange={setSelectedNumbers}
              selectionMode={selectionMode}
            />
          </div>
        ) : (
          <FilterTab 
            summaries={summaries} 
            entryType="akra" 
            projectId={id || ''}
            onSaveResults={handleSaveFilterResults}
          />
        )}
      </div>

      {/* Transaction Modal */}
      {modalSummary && (
        <TransactionModal
          isOpen={!!modalNumber}
          onClose={() => setModalNumber(null)}
          summary={modalSummary}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setEntryPanelOpen(true)}
        position="bottom-right"
        color="primary"
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
        projectId={id || ''}
        entryType="akra"
        onEntryAdded={() => {
          refresh();
          setEntryPanelOpen(false);
        }}
      />
    </div>
  );
};

export default AkraPage;
