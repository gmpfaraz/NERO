// Core data types for GULL Accounting Management System

export type EntryType = 'akra' | 'ring';
export type AmountType = 'first' | 'second';
export type FilterOperator = '>=' | '>' | '<=' | '<' | '==';
export type ActionType = 'add' | 'edit' | 'delete' | 'filter' | 'import' | 'batch';
export type Theme = 'light' | 'dark';

// Project definition
export interface Project {
  id: string;
  name: string;
  date: string;
  entryTypes: EntryType[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

// Transaction entry
export interface Transaction {
  id: string;
  projectId: string;
  number: string; // '00'-'99' for Akra, '000'-'999' for Ring
  entryType: EntryType;
  first: number;
  second: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isFilterDeduction?: boolean;
}

// Number summary for grid display
export interface NumberSummary {
  number: string;
  firstTotal: number;
  secondTotal: number;
  entryCount: number;
  transactions: Transaction[];
}

// Filter criteria
export interface FilterCriteria {
  id: string;
  name?: string;
  entryType: EntryType;
  firstOperator?: FilterOperator;
  firstValue?: number;
  secondOperator?: FilterOperator;
  secondValue?: number;
  firstLimit?: number;
  secondLimit?: number;
}

// Filter result
export interface FilterResult {
  number: string;
  firstAmount: number;
  secondAmount: number;
  meetsFirstCriteria: boolean;
  meetsSecondCriteria: boolean;
}

// Action history for undo/redo
export interface ActionHistory {
  id: string;
  type: ActionType;
  timestamp: string;
  description: string;
  data: any; // Store the data needed to undo/redo
  affectedNumbers: string[];
  projectId: string;
}

// User preferences
export interface UserPreferences {
  theme: Theme;
  soundEnabled: boolean;
  volume: number;
  lastProjectId?: string;
}

// Filter preset
export interface FilterPreset {
  id: string;
  name: string;
  entryType: EntryType;
  firstQuery?: string;
  secondQuery?: string;
  createdAt: string;
}

// Project statistics
export interface ProjectStatistics {
  totalEntries: number;
  akraEntries: number;
  ringEntries: number;
  firstTotal: number;
  secondTotal: number;
  uniqueNumbers: number;
}

// Advanced search pattern
export interface SearchPattern {
  pattern: string;
  type: 'wildcard' | 'command' | 'regex';
  entryType: EntryType;
  amountType: AmountType;
}

// Import/Export data structure
export interface ExportData {
  projectInfo: Project;
  transactions: Transaction[];
  exportDate: string;
  version: string;
}

// Component props types
export interface TabItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Chart data for visualization
export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

