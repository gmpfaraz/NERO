import type { Project, UserPreferences } from '../types';

// Local Storage Keys
const STORAGE_KEYS = {
  PROJECTS: 'gull-projects',
  PREFERENCES: 'gull-preferences',
  TRANSACTIONS: 'gull-transactions',
} as const;

// ====================================
// USER-SPECIFIC DATA STORAGE
// ====================================

/**
 * Get all projects for a specific user
 */
export const getProjects = (userId?: string): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const allProjects: Project[] = data ? JSON.parse(data) : [];
    
    // If userId is provided, filter by userId
    if (userId) {
      return allProjects.filter(p => p.userId === userId);
    }
    
    // If no userId (backward compatibility), return all
    return allProjects;
  } catch (error) {
    console.error('Error reading projects from localStorage:', error);
    return [];
  }
};

/**
 * Save project (automatically associates with user)
 */
export const saveProject = (project: Project): void => {
  try {
    const allProjects = getAllProjects(); // Get all projects from all users
    const existingIndex = allProjects.findIndex((p) => p.id === project.id);
    
    if (existingIndex >= 0) {
      allProjects[existingIndex] = project;
    } else {
      allProjects.push(project);
    }
    
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(allProjects));
  } catch (error) {
    console.error('Error saving project to localStorage:', error);
  }
};

/**
 * Delete project
 */
export const deleteProject = (projectId: string): void => {
  try {
    const allProjects = getAllProjects();
    const filteredProjects = allProjects.filter((p) => p.id !== projectId);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filteredProjects));
    
    // Also delete associated transactions
    const transactionsKey = `${STORAGE_KEYS.TRANSACTIONS}-${projectId}`;
    localStorage.removeItem(transactionsKey);
  } catch (error) {
    console.error('Error deleting project from localStorage:', error);
  }
};

/**
 * Get single project by ID
 */
export const getProject = (projectId: string): Project | null => {
  const allProjects = getAllProjects();
  return allProjects.find((p) => p.id === projectId) || null;
};

/**
 * Get all projects (admin only)
 */
export const getAllProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading all projects from localStorage:', error);
    return [];
  }
};

/**
 * Get projects for a specific user (admin feature)
 */
export const getUserProjects = (userId: string): Project[] => {
  return getProjects(userId);
};

// ====================================
// USER PREFERENCES
// ====================================

/**
 * Get user preferences (user-specific)
 */
export const getPreferences = (userId?: string): UserPreferences => {
  try {
    const key = userId ? `${STORAGE_KEYS.PREFERENCES}-${userId}` : STORAGE_KEYS.PREFERENCES;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {
      theme: 'light',
      soundEnabled: true,
      volume: 0.5,
    };
  } catch (error) {
    console.error('Error reading preferences from localStorage:', error);
    return {
      theme: 'light',
      soundEnabled: true,
      volume: 0.5,
    };
  }
};

/**
 * Save user preferences (user-specific)
 */
export const savePreferences = (preferences: UserPreferences, userId?: string): void => {
  try {
    const key = userId ? `${STORAGE_KEYS.PREFERENCES}-${userId}` : STORAGE_KEYS.PREFERENCES;
    localStorage.setItem(key, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
  }
};
