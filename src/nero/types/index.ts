export * from './user';
export * from './project';
export * from './transaction';

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalRevenue: number;
  onlineUsers: number;
}

export interface DashboardMetrics {
  users: {
    total: number;
    active: number;
    inactive: number;
    online: number;
  };
  projects: {
    total: number;
    akra: number;
    ring: number;
    activeToday: number;
  };
  financial: {
    totalRevenue: number;
    todayRevenue: number;
    averagePerUser: number;
  };
  activity: {
    transactionsToday: number;
    newUsersToday: number;
    topUpsToday: number;
  };
}

export interface ReportFilter {
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  projectType?: 'akra' | 'ring';
  status?: string;
}

