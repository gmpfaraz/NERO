import { useState, useEffect, useCallback } from 'react';
import type { Transaction, ProjectStatistics } from '../types';
import { useUserBalance } from './useUserBalance';
import { useAuth } from '../contexts/AuthContext';
import { isAdminEmail } from '../config/admin';

export const useTransactions = (projectId: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { deductBalance, addBalance } = useUserBalance();
  const isAdmin = user ? isAdminEmail(user.email) : false;

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
    setLoading(true);
    // Small delay to ensure UI updates
    setTimeout(() => {
      try {
        const storageKey = `gull-transactions-${projectId}`;
        const data = localStorage.getItem(storageKey);
        const parsed = data ? JSON.parse(data) : [];
        // Force a new array reference to trigger re-render
        setTransactions([...parsed]);
      } catch (error) {
        console.error('Error refreshing transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }, 100);
  }, [projectId]);

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

  // Get transaction by ID
  const getTransaction = useCallback((transactionId: string) => {
    return transactions.find(t => t.id === transactionId);
  }, [transactions]);

  // Delete transaction with balance refund
  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      const transactionToDelete = transactions.find(t => t.id === transactionId);
      if (!transactionToDelete) return false;

      // Calculate refund amount
      const refundAmount = (transactionToDelete.first || 0) + (transactionToDelete.second || 0);
      
      // Refund balance for non-admin users (only for positive amounts)
      if (!isAdmin && refundAmount > 0) {
        const success = await addBalance(refundAmount);
        if (!success) {
          throw new Error('Failed to refund balance');
        }
      }

      // Deduct balance for negative amounts (reverse deductions)
      if (!isAdmin && refundAmount < 0) {
        const success = await deductBalance(Math.abs(refundAmount));
        if (!success) {
          throw new Error('Failed to reverse deduction');
        }
      }

      const updated = transactions.filter(t => t.id !== transactionId);
      const storageKey = `gull-transactions-${projectId}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setTransactions(updated);
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }, [transactions, projectId, isAdmin, deductBalance, addBalance]);

  // Bulk delete transactions with balance refunds
  const bulkDeleteTransactions = useCallback(async (transactionIds: string[]) => {
    try {
      const transactionsToDelete = transactions.filter(t => transactionIds.includes(t.id));
      
      // Calculate total refund amount
      const totalRefund = transactionsToDelete.reduce((sum, t) => {
        return sum + (t.first || 0) + (t.second || 0);
      }, 0);

      // Refund balance for non-admin users (only for positive amounts)
      if (!isAdmin && totalRefund > 0) {
        const success = await addBalance(totalRefund);
        if (!success) {
          throw new Error('Failed to refund balance');
        }
      }

      // Deduct balance for negative amounts (reverse deductions)
      if (!isAdmin && totalRefund < 0) {
        const success = await deductBalance(Math.abs(totalRefund));
        if (!success) {
          throw new Error('Failed to reverse deduction');
        }
      }

      const updated = transactions.filter(t => !transactionIds.includes(t.id));
      const storageKey = `gull-transactions-${projectId}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setTransactions(updated);
      return true;
    } catch (error) {
      console.error('Error bulk deleting transactions:', error);
      return false;
    }
  }, [transactions, projectId, isAdmin, deductBalance, addBalance]);

  // Add transaction with balance integration
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      // Calculate total cost for balance deduction
      const totalCost = (newTransaction.first || 0) + (newTransaction.second || 0);
      
      // Deduct balance for non-admin users (only for positive amounts)
      if (!isAdmin && totalCost > 0) {
        const success = await deductBalance(totalCost);
        if (!success) {
          throw new Error('Failed to deduct balance');
        }
      }

      // Add balance for negative amounts (refunds/deductions)
      if (!isAdmin && totalCost < 0) {
        const success = await addBalance(Math.abs(totalCost));
        if (!success) {
          throw new Error('Failed to add balance');
        }
      }

      const updated = [...transactions, newTransaction];
      const storageKey = `gull-transactions-${projectId}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setTransactions(updated);
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return false;
    }
  }, [transactions, projectId, isAdmin, deductBalance, addBalance]);

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
    getTransaction,
    addTransaction,
    deleteTransaction,
    bulkDeleteTransactions,
    updateTransaction,
  };
};

