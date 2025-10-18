import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../components/ProjectHeader';
import TabNavigation from '../components/TabNavigation';
import EntryPanel from '../components/EntryPanel';
import FloatingActionButton from '../components/FloatingActionButton';
import { useTransactions } from '../hooks/useTransactions';
import { groupTransactionsByNumber } from '../utils/transactionHelpers';
import { getProject } from '../utils/storage';
import type { TabItem, EntryType } from '../types';

type SignType = 'greater' | 'less' | 'equal' | 'greater_equal' | 'less_equal';

const AdvancedFilter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedType, setSelectedType] = useState<EntryType>('akra');
  const [entryPanelOpen, setEntryPanelOpen] = useState(false);
  
  // Filter states
  const [firstSign, setFirstSign] = useState<SignType>('greater');
  const [firstNumbers, setFirstNumbers] = useState('');
  const [firstLimit, setFirstLimit] = useState('2000');
  
  const [secondSign, setSecondSign] = useState<SignType>('greater');
  const [secondNumbers, setSecondNumbers] = useState('');
  const [secondLimit, setSecondLimit] = useState('2000');
  
  const project = getProject(id || '');
  const { transactions, refresh } = useTransactions(id || '');

  // Group transactions
  const summaries = useMemo(
    () => groupTransactionsByNumber(transactions, selectedType),
    [transactions, selectedType]
  );

  // Parse numbers from input (comma or space separated)
  const parseNumbers = (input: string): string[] => {
    return input
      .split(/[\s,]+/)
      .map(n => n.trim())
      .filter(n => n !== '');
  };

  // Apply filter logic
  const applySignFilter = (amount: number, sign: SignType, numbers: string[]): boolean => {
    if (numbers.length === 0) return false;

    switch (sign) {
      case 'greater':
        return numbers.some(n => amount > parseFloat(n));
      case 'less':
        return numbers.some(n => amount < parseFloat(n));
      case 'equal':
        return numbers.some(n => amount === parseFloat(n));
      case 'greater_equal':
        return numbers.some(n => amount >= parseFloat(n));
      case 'less_equal':
        return numbers.some(n => amount <= parseFloat(n));
      default:
        return false;
    }
  };

  // Filter results for First
  const firstFilteredResults = useMemo(() => {
    const numbers = parseNumbers(firstNumbers);
    if (numbers.length === 0) return [];

    const limit = parseFloat(firstLimit) || 2000;
    const results: Array<{ number: string; amount: number }> = [];

    summaries.forEach((summary, number) => {
      if (summary.firstTotal > 0 && summary.firstTotal <= limit) {
        if (applySignFilter(summary.firstTotal, firstSign, numbers)) {
          results.push({
            number,
            amount: summary.firstTotal,
          });
        }
      }
    });

    return results.sort((a, b) => a.number.localeCompare(b.number));
  }, [summaries, firstSign, firstNumbers, firstLimit]);

  // Filter results for Second
  const secondFilteredResults = useMemo(() => {
    const numbers = parseNumbers(secondNumbers);
    if (numbers.length === 0) return [];

    const limit = parseFloat(secondLimit) || 2000;
    const results: Array<{ number: string; amount: number }> = [];

    summaries.forEach((summary, number) => {
      if (summary.secondTotal > 0 && summary.secondTotal <= limit) {
        if (applySignFilter(summary.secondTotal, secondSign, numbers)) {
          results.push({
            number,
            amount: summary.secondTotal,
          });
        }
      }
    });

    return results.sort((a, b) => a.number.localeCompare(b.number));
  }, [summaries, secondSign, secondNumbers, secondLimit]);

  // Copy function with special formatting
  const copyFirstResults = () => {
    if (firstFilteredResults.length === 0) {
      alert('No results to copy!');
      return;
    }

    const header = selectedType === 'akra' ? 'Ak\tFirst' : 'Ring\tFirst';
    const rows = firstFilteredResults.map(r => `${r.number}\tF ${r.amount}`);
    const data = [header, ...rows].join('\n');

    navigator.clipboard.writeText(data).then(() => {
      alert(`✓ Copied ${firstFilteredResults.length} First entries to clipboard!`);
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const copySecondResults = () => {
    if (secondFilteredResults.length === 0) {
      alert('No results to copy!');
      return;
    }

    const header = selectedType === 'akra' ? 'Ak\tSecond' : 'Ring\tSecond';
    const rows = secondFilteredResults.map(r => `${r.number}\tS ${r.amount}`);
    const data = [header, ...rows].join('\n');

    navigator.clipboard.writeText(data).then(() => {
      alert(`✓ Copied ${secondFilteredResults.length} Second entries to clipboard!`);
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  // Copy just numbers
  const copyFirstNumbers = () => {
    if (firstFilteredResults.length === 0) {
      alert('No results to copy!');
      return;
    }

    const numbers = firstFilteredResults.map(r => r.number).join(', ');
    navigator.clipboard.writeText(numbers).then(() => {
      alert(`✓ Copied ${firstFilteredResults.length} numbers to clipboard!`);
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const copySecondNumbers = () => {
    if (secondFilteredResults.length === 0) {
      alert('No results to copy!');
      return;
    }

    const numbers = secondFilteredResults.map(r => r.number).join(', ');
    navigator.clipboard.writeText(numbers).then(() => {
      alert(`✓ Copied ${secondFilteredResults.length} numbers to clipboard!`);
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: `/project/${id}` },
    { id: 'akra', label: 'Akra (00)', path: `/project/${id}/akra` },
    { id: 'ring', label: 'Ring (000)', path: `/project/${id}/ring` },
    { id: 'advanced', label: 'Advanced Filter', path: `/project/${id}/advanced-filter` },
    { id: 'history', label: 'History', path: `/project/${id}/history` },
  ];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ProjectHeader projectName={project.name} projectDate={project.date} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation tabs={tabs} baseClass="mb-6" />

        {/* Type Selection */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🔍 Advanced Filter & Calculator
          </h2>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setSelectedType('akra')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedType === 'akra'
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Akra (00-99)
            </button>
            <button
              onClick={() => setSelectedType('ring')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedType === 'ring'
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Ring (000-999)
            </button>
          </div>
        </div>

        {/* First Filter Section */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              💰 First Amount Filter
            </h3>
            {firstFilteredResults.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={copyFirstNumbers}
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Copy Numbers
                </button>
                <button
                  onClick={copyFirstResults}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Data ({firstFilteredResults.length})
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sign Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Sign
              </label>
              <select
                value={firstSign}
                onChange={(e) => setFirstSign(e.target.value as SignType)}
                className="input-field"
              >
                <option value="greater">{'>'} Greater than</option>
                <option value="less">{'<'} Less than</option>
                <option value="equal">= Equal to</option>
                <option value="greater_equal">≥ Greater or equal</option>
                <option value="less_equal">≤ Less or equal</option>
              </select>
            </div>

            {/* Numbers Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Enter Numbers (comma or space separated)
              </label>
              <input
                type="text"
                value={firstNumbers}
                onChange={(e) => setFirstNumbers(e.target.value)}
                placeholder="e.g. 100, 500, 1000"
                className="input-field"
              />
            </div>

            {/* Limit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Maximum Limit
              </label>
              <input
                type="number"
                value={firstLimit}
                onChange={(e) => setFirstLimit(e.target.value)}
                placeholder="2000"
                className="input-field"
              />
            </div>
          </div>

          {/* First Results */}
          {firstFilteredResults.length > 0 && (
            <div className="mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {firstFilteredResults.map((result) => (
                    <div
                      key={result.number}
                      className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {result.number}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                        F {result.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Found {firstFilteredResults.length} numbers matching your filter
              </p>
            </div>
          )}
        </div>

        {/* Second Filter Section */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              💎 Second Amount Filter
            </h3>
            {secondFilteredResults.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={copySecondNumbers}
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Copy Numbers
                </button>
                <button
                  onClick={copySecondResults}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Data ({secondFilteredResults.length})
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sign Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Sign
              </label>
              <select
                value={secondSign}
                onChange={(e) => setSecondSign(e.target.value as SignType)}
                className="input-field"
              >
                <option value="greater">{'>'} Greater than</option>
                <option value="less">{'<'} Less than</option>
                <option value="equal">= Equal to</option>
                <option value="greater_equal">≥ Greater or equal</option>
                <option value="less_equal">≤ Less or equal</option>
              </select>
            </div>

            {/* Numbers Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Enter Numbers (comma or space separated)
              </label>
              <input
                type="text"
                value={secondNumbers}
                onChange={(e) => setSecondNumbers(e.target.value)}
                placeholder="e.g. 100, 500, 1000"
                className="input-field"
              />
            </div>

            {/* Limit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Maximum Limit
              </label>
              <input
                type="number"
                value={secondLimit}
                onChange={(e) => setSecondLimit(e.target.value)}
                placeholder="2000"
                className="input-field"
              />
            </div>
          </div>

          {/* Second Results */}
          {secondFilteredResults.length > 0 && (
            <div className="mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {secondFilteredResults.map((result) => (
                    <div
                      key={result.number}
                      className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {result.number}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                        S {result.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Found {secondFilteredResults.length} numbers matching your filter
              </p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Use
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>1. <strong>Select Type:</strong> Choose Akra (00-99) or Ring (000-999)</p>
            <p>2. <strong>Select Sign:</strong> Choose comparison operator {'(>, <, =, ≥, ≤)'}</p>
            <p>3. <strong>Enter Numbers:</strong> Type numbers separated by commas or spaces</p>
            <p>4. <strong>Set Limit:</strong> Maximum amount to include (default 2000)</p>
            <p>5. <strong>Copy Results:</strong> Click Copy button to copy formatted data</p>
            <p className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/40 rounded">
              <strong>Copy Format:</strong> Data will be copied with tab separation and &quot;F&quot; prefix for First, &quot;S&quot; prefix for Second amounts
            </p>
          </div>
        </div>
      </div>

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
        entryType={selectedType}
        onEntryAdded={() => {
          refresh();
          setEntryPanelOpen(false);
        }}
      />
    </div>
  );
};

export default AdvancedFilter;
