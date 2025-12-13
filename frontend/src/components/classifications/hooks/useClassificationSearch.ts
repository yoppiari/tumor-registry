import { useMemo, useState } from 'react';
import { WhoClassification, CategoryNode, SearchResult } from '../types';

interface UseClassificationSearchOptions {
  classifications: WhoClassification[];
  categories: CategoryNode[];
  searchableFields?: ('name' | 'code' | 'category' | 'icdO3Code')[];
}

/**
 * Custom hook for searching and filtering WHO classifications
 * Supports multi-field search with highlighting
 */
export function useClassificationSearch({
  classifications,
  categories,
  searchableFields = ['name', 'category', 'icdO3Code'],
}: UseClassificationSearchOptions) {
  const [searchQuery, setSearchQuery] = useState('');

  // Perform search across multiple fields
  const searchResults = useMemo((): SearchResult[] => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    classifications.forEach((classification) => {
      let matchType: SearchResult['matchType'] | null = null;
      let highlightText: string | undefined;

      // Search in name/diagnosis
      if (searchableFields.includes('name') && classification.name.toLowerCase().includes(query)) {
        matchType = 'name';
        highlightText = classification.name;
      }
      // Search in ICD-O-3 code
      else if (
        searchableFields.includes('icdO3Code') &&
        classification.icdO3Code?.toLowerCase().includes(query)
      ) {
        matchType = 'icdO3';
        highlightText = classification.icdO3Code;
      }
      // Search in category
      else if (
        searchableFields.includes('category') &&
        classification.category.toLowerCase().includes(query)
      ) {
        matchType = 'category';
        highlightText = classification.category;
      }

      if (matchType) {
        results.push({
          classification,
          matchType,
          highlightText,
        });
      }
    });

    return results;
  }, [classifications, searchQuery, searchableFields]);

  // Filter categories based on search
  const filteredCategories = useMemo((): CategoryNode[] => {
    if (!searchQuery.trim()) {
      return categories;
    }

    const query = searchQuery.toLowerCase();

    return categories
      .map((category) => {
        // Filter children that match search
        const matchingChildren = category.children.filter(
          (child) =>
            child.name.toLowerCase().includes(query) ||
            child.category.toLowerCase().includes(query) ||
            child.icdO3Code?.toLowerCase().includes(query)
        );

        if (matchingChildren.length > 0) {
          return {
            ...category,
            children: matchingChildren,
            expanded: true, // Auto-expand categories with matches
          };
        }

        // Also check if category name matches
        if (category.name.toLowerCase().includes(query)) {
          return {
            ...category,
            expanded: true,
          };
        }

        return null;
      })
      .filter((c): c is Exclude<typeof c, null> => c !== null);
  }, [categories, searchQuery]);

  // Highlight matching text in a string
  const highlightMatch = (text: string, query: string): string => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 font-semibold">$1</mark>');
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    filteredCategories,
    hasResults: searchResults.length > 0,
    resultCount: searchResults.length,
    highlightMatch,
  };
}
