import { useState, useEffect, useCallback } from 'react';
import { RecentSelection, STORAGE_KEYS } from '../types';

const MAX_RECENT = 5;

/**
 * Custom hook to manage recent classification selections
 * Persists to localStorage for cross-session persistence
 */
export function useRecentSelections(tumorType: 'BONE' | 'SOFT_TISSUE') {
  const storageKey =
    tumorType === 'BONE' ? STORAGE_KEYS.RECENT_BONE : STORAGE_KEYS.RECENT_SOFT_TISSUE;

  const [recents, setRecents] = useState<RecentSelection[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecents(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading recent selections:', error);
      setRecents([]);
    }
  }, [storageKey]);

  // Save to localStorage
  const saveToStorage = useCallback(
    (items: RecentSelection[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving recent selections:', error);
      }
    },
    [storageKey]
  );

  // Add a new recent selection
  const addRecent = useCallback(
    (id: string, name: string, category: string) => {
      setRecents((prev) => {
        // Remove if already exists
        const filtered = prev.filter((item) => item.id !== id);

        // Add to front
        const updated = [
          {
            id,
            name,
            category,
            timestamp: Date.now(),
          },
          ...filtered,
        ].slice(0, MAX_RECENT); // Keep only last N items

        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  // Clear all recent selections
  const clearRecents = useCallback(() => {
    setRecents([]);
    saveToStorage([]);
  }, [saveToStorage]);

  // Remove a specific recent selection
  const removeRecent = useCallback(
    (id: string) => {
      setRecents((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  return {
    recents,
    addRecent,
    clearRecents,
    removeRecent,
    hasRecents: recents.length > 0,
  };
}
