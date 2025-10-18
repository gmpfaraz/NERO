import { useState, useEffect, useCallback } from 'react';
import type { Transaction, ProjectStatistics } from '../types';

export const useTransactions = (projectId: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load transactions from localStorage
  const loadTransactions = useCallback(() => {
    try {
      const storageKey = `gull-transactions-${projectId}`;
      const data = localStorage.getItem(storageKey);
      const parsed = data ? JSON.parse(data) : [];
      setTransactions(parsed);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Initial load
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Refresh transactions
  const refresh = useCallback(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Calculate statistics
  const getStatistics = useCallback((): ProjectStatistics => {
    const akraTransactions = transactions.filter(t => t.entryType === 'akra');
    const ringTransactions = transactions.filter(t => t.entryType === 'ring');
    
    const firstTotal = transactions.reduce((sum, t) => sum + t.first, 0);
    const secondTotal = transactions.reduce((sum, t) => sum + t.second, 0);
    
    const uniqueNumbers = new Set(transactions.map(t => t.number)).size;

    return {
      totalEntries: transactions.length,
      akraEntries: akraTransactions.length,
      ringEntries: ringTransactions.length,
      firstTotal,
      secondTotal,
      uniqueNumbers,
    };
  }, [transactions]);

  // Get transactions by entry type
  const getByEntryType = useCallback((entryType: 'akra' | 'ring') => {
    return transactions.filter(t => t.entryType === entryType);
  }, [transactions]);

  // Get transactions by number
  const getByNumber = useCallback((number: string) => {
    return transactions.filter(t => t.number === number);
  }, [transactions]);

  // Delete transaction
  const deleteTransaction = useCallback((transactionId: string) => {
    try {
      const updated = transactions.filter(t => t.id !== transactionId);
      const storageKey = `gull-transactions-${projectId}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setTransactions(updated);
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }, [transactions, projectId]);

  // Add transaction
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      const updated = [...transactions, newTransaction];
      const storageKey = `gull-transactions-${projectId}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setTransactions(updated);
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return false;
    }
  }, [transactions, projectId]);

  // Update transaction
  const updateTransaction = useCallback((transactionId: string, updates: Partial<Transaction>) => {
    try {
      const updated = transactions.map(t =>
        t.id === transactionId
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      );
      const storageKey = `gull-transactions-${projectId}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setTransactions(updated);
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      return false;
    }
  }, [transactions, projectId]);

  return {
    transactions,
    loading,
    refresh,
    getStatistics,
    getByEntryType,
    getByNumber,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
};

