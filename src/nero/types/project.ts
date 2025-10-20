export type ProjectType = 'akra' | 'ring';
export type ProjectStatus = 'active' | 'archived' | 'completed';

export interface NeroProject {
  id: string;
  userId: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  date: string;
  totalFirst: number;
  totalSecond: number;
  entryCount: number;
  uniqueNumbers: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary {
  projectId: string;
  projectName: string;
  totalAmount: number;
  entryCount: number;
  lastUpdated: string;
}

