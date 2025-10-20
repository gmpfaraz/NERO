import { useState, useCallback } from 'react';
import type { ActionHistory, ActionType } from '../types';
import { generateId } from '../utils/helpers';

interface HistoryCallbacks {
  onRevert?: (action: ActionHistory) => void;
  onApply?: (action: ActionHistory) => void;
}

export const useHistory = (projectId: string, callbacks?: HistoryCallbacks) => {
  const [history, setHistory] = useState<ActionHistory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Add action to history
  const addAction = useCallback((
    type: ActionType,
    description: string,
    affectedNumbers: string[],
    data?: Record<string, unknown>
  ) => {
    const action: ActionHistory = {
      id: generateId(),
      type,
      timestamp: new Date().toISOString(),
      description,
      data,
      affectedNumbers,
      projectId,
    };

    setHistory(prev => {
      // Remove any actions after current index (redo stack)
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, action];
    });
    
    setCurrentIndex(prev => prev + 1);

    return action;
  }, [projectId, currentIndex]);

  // Helper function to create consistent action descriptions
  const createActionDescription = useCallback((
    type: ActionType,
    details: {
      numbers?: string[];
      count?: number;
      amount?: number;
      entryType?: string;
    }
  ): string => {
    const { numbers = [], count = 0, entryType = '' } = details;
    
    switch (type) {
      case 'add':
        if (numbers.length > 0) {
          return `➕ Added ${entryType} entry for ${numbers.length > 1 ? `${numbers.length} numbers` : `number ${numbers[0]}`}`;
        }
        return `➕ Added new ${entryType} entry`;
      
      case 'edit':
        if (numbers.length > 0) {
          return `✏️ Edited ${entryType} entry for ${numbers.length > 1 ? `${numbers.length} numbers` : `number ${numbers[0]}`}`;
        }
        return `✏️ Edited ${entryType} entry`;
      
      case 'delete':
        if (count > 1) {
          return `🗑️ Deleted ${count} ${entryType} entries`;
        }
        return `🗑️ Deleted ${entryType} entry`;
      
      case 'filter':
        return `🔍 Applied filter calculations to ${count} numbers`;
      
      case 'import':
        return `📥 Imported ${count} entries from external source`;
      
      case 'batch':
        return `⚡ Batch operation on ${count} entries`;
      
      default:
        return `📝 ${type} action performed`;
    }
  }, []);

  // Undo action
  const undo = useCallback(() => {
    if (currentIndex >= 0) {
      const action = history[currentIndex];
      if (callbacks?.onRevert) {
        callbacks.onRevert(action);
      }
      setCurrentIndex(prev => prev - 1);
      return action;
    }
    return null;
  }, [currentIndex, history, callbacks]);

  // Redo action
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const action = history[currentIndex + 1];
      if (callbacks?.onApply) {
        callbacks.onApply(action);
      }
      setCurrentIndex(prev => prev + 1);
      return action;
    }
    return null;
  }, [currentIndex, history, callbacks]);

  // Check if can undo/redo
  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  // Get visible history (up to current index)
  const visibleHistory = history.slice(0, currentIndex + 1);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    history: visibleHistory,
    allHistory: history,
    currentIndex,
    addAction,
    createActionDescription,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  };
};

