import { useState, useEffect, useCallback } from 'react';
import { FavoriteClassification, STORAGE_KEYS } from '../types';

/**
 * Custom hook to manage favorite classifications
 * Persists to localStorage for cross-session persistence
 */
export function useFavorites(tumorType: 'BONE' | 'SOFT_TISSUE') {
  const storageKey =
    tumorType === 'BONE' ? STORAGE_KEYS.FAVORITES_BONE : STORAGE_KEYS.FAVORITES_SOFT_TISSUE;

  const [favorites, setFavorites] = useState<FavoriteClassification[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    }
  }, [storageKey]);

  // Save to localStorage
  const saveToStorage = useCallback(
    (items: FavoriteClassification[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    },
    [storageKey]
  );

  // Check if a classification is favorited
  const isFavorite = useCallback(
    (id: string): boolean => {
      return favorites.some((fav) => fav.id === id);
    },
    [favorites]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (id: string, name: string, category: string) => {
      setFavorites((prev) => {
        const exists = prev.some((fav) => fav.id === id);

        let updated: FavoriteClassification[];
        if (exists) {
          // Remove from favorites
          updated = prev.filter((fav) => fav.id !== id);
        } else {
          // Add to favorites
          updated = [
            ...prev,
            {
              id,
              name,
              category,
              tumorType,
            },
          ];
        }

        saveToStorage(updated);
        return updated;
      });
    },
    [tumorType, saveToStorage]
  );

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    saveToStorage([]);
  }, [saveToStorage]);

  // Remove a specific favorite
  const removeFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const updated = prev.filter((fav) => fav.id !== id);
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    removeFavorite,
    hasFavorites: favorites.length > 0,
  };
}
