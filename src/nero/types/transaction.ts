export type EntryType = 'akra' | 'ring';

export interface NeroTransaction {
  id: string;
  projectId: string;
  userId: string;
  number: string;
  entryType: EntryType;
  first: number;
  second: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionSummary {
  number: string;
  firstTotal: number;
  secondTotal: number;
  entryCount: number;
  lastEntry: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
}

