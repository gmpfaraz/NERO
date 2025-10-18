import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isOfflineMode } from '../lib/supabase';

export interface UserBalance {
  balance: number;
  loading: boolean;
  error: string | null;
}

export const useUserBalance = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user balance
  const fetchBalance = useCallback(async () => {
    if (!user) {
      setBalance(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    if (isOfflineMode() || !supabase) {
      // Offline mode: use local storage
      const localBalances = JSON.parse(localStorage.getItem('gull_user_balances') || '{}');
      setBalance(localBalances[user.id] || 1000); // Default to 1000 for offline
      setLoading(false);
    } else {
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        if (fetchError) throw fetchError;

        setBalance(data?.balance || 0);
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError('Failed to fetch balance');
        // Fallback to local storage
        const localBalances = JSON.parse(localStorage.getItem('gull_user_balances') || '{}');
        setBalance(localBalances[user.id] || 0);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Check if user has sufficient balance
  const hasSufficientBalance = useCallback(
    (amount: number): boolean => {
      return balance >= amount;
    },
    [balance]
  );

  // Deduct balance
  const deductBalance = useCallback(
    async (amount: number): Promise<boolean> => {
      if (!user) return false;

      if (!hasSufficientBalance(amount)) {
        setError('Insufficient balance');
        return false;
      }

      if (isOfflineMode() || !supabase) {
        // Offline mode: update local storage
        const localBalances = JSON.parse(localStorage.getItem('gull_user_balances') || '{}');
        localBalances[user.id] = (localBalances[user.id] || 0) - amount;
        localStorage.setItem('gull_user_balances', JSON.stringify(localBalances));
        setBalance(localBalances[user.id]);
        return true;
      } else {
        try {
          const newBalance = balance - amount;
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('user_id', user.id);

          if (updateError) throw updateError;

          setBalance(newBalance);
          return true;
        } catch (err) {
          console.error('Error deducting balance:', err);
          setError('Failed to deduct balance');
          return false;
        }
      }
    },
    [user, balance, hasSufficientBalance]
  );

  // Add balance (for admin top-ups)
  const addBalance = useCallback(
    async (amount: number): Promise<boolean> => {
      if (!user) return false;

      if (isOfflineMode() || !supabase) {
        // Offline mode: update local storage
        const localBalances = JSON.parse(localStorage.getItem('gull_user_balances') || '{}');
        localBalances[user.id] = (localBalances[user.id] || 0) + amount;
        localStorage.setItem('gull_user_balances', JSON.stringify(localBalances));
        setBalance(localBalances[user.id]);
        return true;
      } else {
        try {
          const newBalance = balance + amount;
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('user_id', user.id);

          if (updateError) throw updateError;

          setBalance(newBalance);
          return true;
        } catch (err) {
          console.error('Error adding balance:', err);
          setError('Failed to add balance');
          return false;
        }
      }
    },
    [user, balance]
  );

  return {
    balance,
    loading,
    error,
    hasSufficientBalance,
    deductBalance,
    addBalance,
    refresh: fetchBalance,
  };
};





