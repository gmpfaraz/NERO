import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isAdminEmail } from '../config/admin';
import type { UserAccount, UserReport, AdminStats, BalanceTransaction } from '../types/admin';
import { supabase, isOfflineMode } from '../lib/supabase';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsAdmin(isAdminEmail(user.email));
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, [user]);

  return { isAdmin, loading };
};

// Mock data for now - will be replaced with real API calls
export const useAdminData = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from Supabase if available; fallback to local
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);

    try {
      if (!isOfflineMode() && supabase) {
        // Try to read from profiles; fallback to auth.users via admin RPC in future
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('user_id, email, display_name, role, balance, is_online, last_login_at, created_at, updated_at')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped: UserAccount[] = (profiles || []).map((p) => ({
          id: p.user_id,
          userId: p.user_id,
          email: p.email || '',
          displayName: p.display_name || p.email || 'User',
          role: (p.role as 'admin' | 'user') || 'user',
          balance: p.balance || 0,
          isActive: true,
          isOnline: p.is_online || false,
          lastSeen: p.last_login_at || p.updated_at,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          permissions: [],
        }));

        setUsers(mapped);
        setReports(mapped.map((u) => ({
          userId: u.userId,
          email: u.email,
          displayName: u.displayName,
          projectCount: 0,
          totalEntries: 0,
          firstTotal: 0,
          secondTotal: 0,
          grandTotal: 0,
          balance: u.balance,
          isOnline: u.isOnline,
          lastSeen: u.lastSeen,
          createdAt: u.createdAt,
        })));
        setStats({
          totalUsers: mapped.length,
          activeUsers: mapped.filter((u) => u.isActive).length,
          onlineUsers: mapped.filter((u) => u.isOnline).length,
          totalProjects: 0,
          totalEntries: 0,
          totalBalance: mapped.reduce((s, u) => s + u.balance, 0),
          totalRevenue: 0,
        });
      } else {
        // Offline fallback: read from localStorage mock
        const allUsers: UserAccount[] = [];
        setUsers(allUsers);
        setReports([]);
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          onlineUsers: 0,
          totalProjects: 0,
          totalEntries: 0,
          totalBalance: 0,
          totalRevenue: 0,
        });
      }
    } catch (e) {
      console.warn('Failed to load admin data:', e);
      setUsers([]);
      setReports([]);
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        onlineUsers: 0,
        totalProjects: 0,
        totalEntries: 0,
        totalBalance: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const topUpBalance = async (userId: string, amount: number): Promise<boolean> => {
    try {
      if (!isOfflineMode() && supabase) {
        // Get current balance from Supabase
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('user_id', userId)
          .single();

        if (fetchError) throw fetchError;

        const currentBalance = profile?.balance || 0;
        const newBalance = currentBalance + amount;

        // Update balance in Supabase
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ balance: newBalance })
          .eq('user_id', userId);

        if (updateError) throw updateError;
      } else {
        // Fallback to localStorage
        const balances = JSON.parse(localStorage.getItem('gull_user_balances') || '{}');
        const currentBalance = balances[userId] || 0;
        balances[userId] = currentBalance + amount;
        localStorage.setItem('gull_user_balances', JSON.stringify(balances));
      }

      // Log transaction to localStorage (can be moved to Supabase later)
      const transactions: BalanceTransaction[] = JSON.parse(
        localStorage.getItem('gull_balance_transactions') || '[]'
      );
      transactions.push({
        id: Date.now().toString(),
        userId,
        type: 'topup',
        amount,
        balance: 0, // Will be recalculated
        description: `Admin top-up of ${amount} PKR`,
        performedBy: 'admin',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('gull_balance_transactions', JSON.stringify(transactions));

      await loadAdminData();
      return true;
    } catch (error) {
      console.error('Failed to top up balance:', error);
      return false;
    }
  };

  const deductBalance = (userId: string, amount: number, description: string): boolean => {
    try {
      const balances = JSON.parse(localStorage.getItem('gull_user_balances') || '{}');
      const currentBalance = balances[userId] || 0;
      
      if (currentBalance < amount) {
        return false; // Insufficient balance
      }

      balances[userId] = currentBalance - amount;
      localStorage.setItem('gull_user_balances', JSON.stringify(balances));

      // Log transaction
      const transactions: BalanceTransaction[] = JSON.parse(
        localStorage.getItem('gull_balance_transactions') || '[]'
      );
      transactions.push({
        id: Date.now().toString(),
        userId,
        type: 'deduction',
        amount,
        balance: balances[userId],
        description,
        performedBy: userId,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('gull_balance_transactions', JSON.stringify(transactions));

      return true;
    } catch (error) {
      console.error('Failed to deduct balance:', error);
      return false;
    }
  };

  const getUserBalance = (userId: string): number => {
    const balances = JSON.parse(localStorage.getItem('gull_user_balances') || '{}');
    return balances[userId] || 0;
  };

  const deleteUser = (_userId: string): boolean => {
    try {
      // This would delete from database in real implementation
      loadAdminData();
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false;
    }
  };

  const toggleUserStatus = (_userId: string): boolean => {
    try {
      // This would update database in real implementation
      loadAdminData();
      return true;
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      return false;
    }
  };

  return {
    users,
    reports,
    stats,
    loading,
    topUpBalance,
    deductBalance,
    getUserBalance,
    deleteUser,
    toggleUserStatus,
    refresh: loadAdminData,
  };
};

