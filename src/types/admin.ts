// Admin-related types

export interface UserRole {
  id: string;
  userId: string;
  role: 'admin' | 'user';
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export type Permission = 
  | 'view_dashboard'
  | 'view_akra'
  | 'view_ring'
  | 'view_filter_calculate'
  | 'view_advanced_filter'
  | 'manage_entries'
  | 'manage_projects'
  | 'export_data'
  | 'admin_panel'
  | 'manage_users'
  | 'view_reports'
  | 'manage_balance';

export interface UserAccount {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  balance: number;
  isActive: boolean;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
}

export interface AccountBalance {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  lastTopUp?: string;
  lastTransaction?: string;
}

export interface BalanceTransaction {
  id: string;
  userId: string;
  type: 'topup' | 'deduction' | 'refund';
  amount: number;
  balance: number;
  description: string;
  performedBy: string; // Admin user ID
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface UserReport {
  userId: string;
  email: string;
  displayName: string;
  projectCount: number;
  totalEntries: number;
  firstTotal: number;
  secondTotal: number;
  grandTotal: number;
  balance: number;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  totalProjects: number;
  totalEntries: number;
  totalBalance: number;
  totalRevenue: number;
}

