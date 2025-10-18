import { useState, useCallback } from 'react';
import type { ActionHistory, ActionType } from '../types';
import { generateId } from '../utils/helpers';

export const useHistory = (projectId: string) => {
  const [history, setHistory] = useState<ActionHistory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Add action to history
  const addAction = useCallback((
    type: ActionType,
    description: string,
    affectedNumbers: string[],
    data?: any
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

  // Undo action
  const undo = useCallback(() => {
    if (currentIndex >= 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex];
    }
    return null;
  }, [currentIndex, history]);

  // Redo action
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

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
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  };
};

