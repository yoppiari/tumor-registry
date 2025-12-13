import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ClockIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { WhoClassificationTreeProps, WhoClassification } from './types';
import { ClassificationNode, CategoryNode as CategoryNodeComponent } from './ClassificationNode';
import { ClassificationSearch } from './ClassificationSearch';
import { SelectedClassificationDisplay } from './SelectedClassificationDisplay';
import {
  useWhoClassifications,
  useClassificationSearch,
  useRecentSelections,
  useFavorites,
} from './hooks';

/**
 * Main WHO Classification Tree Selector Component
 *
 * Features:
 * - Hierarchical tree display with expandable categories
 * - Full-text search across name, category, and ICD-O-3 codes
 * - Recent selections (last 5)
 * - Favorites/bookmarks
 * - Keyboard navigation
 * - Loading states and error handling
 * - Mobile-friendly touch interactions
 */
export const WhoClassificationTree: React.FC<WhoClassificationTreeProps> = ({
  tumorType,
  selectedId,
  onSelect,
  searchable = true,
  showCodes = true,
  showRecent = true,
  showFavorites = true,
  enableKeyboardNav = true,
  className = '',
}) => {
  // Data fetching
  const { data, isLoading, isError, error, categories, getById } = useWhoClassifications({
    tumorType,
  });

  // Search
  const {
    searchQuery,
    setSearchQuery,
    filteredCategories,
    resultCount,
  } = useClassificationSearch({
    classifications: data?.raw || [],
    categories: categories || [],
  });

  // Recent selections
  const { recents, addRecent, hasRecents } = useRecentSelections(tumorType);

  // Favorites
  const { favorites, isFavorite, toggleFavorite, hasFavorites } = useFavorites(tumorType);

  // Expanded categories state
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Active tab (tree, recents, favorites)
  const [activeTab, setActiveTab] = useState<'tree' | 'recents' | 'favorites'>('tree');

  // Keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get selected classification
  const selectedClassification = selectedId ? getById(selectedId) : undefined;

  // Auto-expand categories when searching
  useEffect(() => {
    if (searchQuery) {
      const allCategoryIds = filteredCategories.map((cat) => cat.id);
      setExpandedCategories(new Set(allCategoryIds));
    }
  }, [searchQuery, filteredCategories]);

  // Toggle category expansion
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  // Expand all categories
  const expandAll = useCallback(() => {
    const allIds = (searchQuery ? filteredCategories : categories).map((cat) => cat.id);
    setExpandedCategories(new Set(allIds));
  }, [categories, filteredCategories, searchQuery]);

  // Collapse all categories
  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  // Handle classification selection
  const handleSelect = useCallback(
    (classification: WhoClassification) => {
      onSelect(classification);
      // Add to recent selections
      addRecent(classification.id, classification.name, classification.category);
    },
    [onSelect, addRecent]
  );

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(
    (classification: WhoClassification) => {
      toggleFavorite(classification.id, classification.name, classification.category);
    },
    [toggleFavorite]
  );

  // Keyboard navigation handler
  useEffect(() => {
    if (!enableKeyboardNav) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if tree is focused
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, resultCount - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          // Handle selection of focused item
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNav, resultCount]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-sm font-medium text-gray-600">
          Loading {tumorType === 'BONE' ? 'bone' : 'soft tissue'} tumor classifications...
        </p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={`rounded-lg bg-red-50 border border-red-200 p-6 ${className}`}>
        <h3 className="text-sm font-semibold text-red-800">Failed to load classifications</h3>
        <p className="mt-1 text-sm text-red-700">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const displayedCategories = searchQuery ? filteredCategories : categories;

  return (
    <div className={`space-y-4 ${className}`} ref={containerRef}>
      {/* Selected Classification Display */}
      {selectedClassification && (
        <SelectedClassificationDisplay
          classification={selectedClassification}
          onClear={() => onSelect({ id: '', name: '', category: '' })}
          showCodes={showCodes}
        />
      )}

      {/* Search */}
      {searchable && (
        <ClassificationSearch
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={searchQuery ? resultCount : undefined}
        />
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('tree')}
            className={`whitespace-nowrap border-b-2 pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'tree'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
            }`}
          >
            All Classifications
          </button>
          {showRecent && hasRecents && (
            <button
              onClick={() => setActiveTab('recents')}
              className={`whitespace-nowrap border-b-2 pb-3 px-1 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'recents'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              <ClockIcon className="h-4 w-4" />
              Recent ({recents.length})
            </button>
          )}
          {showFavorites && hasFavorites && (
            <button
              onClick={() => setActiveTab('favorites')}
              className={`whitespace-nowrap border-b-2 pb-3 px-1 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'favorites'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              <StarIcon className="h-4 w-4" />
              Favorites ({favorites.length})
            </button>
          )}
        </nav>
      </div>

      {/* Controls */}
      {activeTab === 'tree' && !searchQuery && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {categories.length} categories, {data?.raw.length || 0} classifications
          </p>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <ChevronDoubleDownIcon className="h-3.5 w-3.5" />
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <ChevronDoubleUpIcon className="h-3.5 w-3.5" />
              Collapse All
            </button>
          </div>
        </div>
      )}

      {/* Classification Tree */}
      <div className="rounded-lg border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          {activeTab === 'tree' && (
            <>
              {displayedCategories.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-600">
                    {searchQuery
                      ? 'No classifications found matching your search.'
                      : 'No classifications available.'}
                  </p>
                </div>
              ) : (
                displayedCategories.map((category) => (
                  <div key={category.id}>
                    <CategoryNodeComponent
                      name={category.name}
                      count={category.children.length}
                      isExpanded={expandedCategories.has(category.id)}
                      onToggle={() => toggleCategory(category.id)}
                    />
                    {expandedCategories.has(category.id) && (
                      <div className="bg-white divide-y divide-gray-100">
                        {category.children.map((classification) => (
                          <ClassificationNode
                            key={classification.id}
                            classification={classification}
                            isSelected={selectedId === classification.id}
                            isFavorite={isFavorite(classification.id)}
                            onSelect={() => handleSelect(classification)}
                            onToggleFavorite={() => handleToggleFavorite(classification)}
                            showCodes={showCodes}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'recents' && (
            <div className="divide-y divide-gray-100">
              {recents.map((recent) => {
                const classification = getById(recent.id);
                if (!classification) return null;

                return (
                  <ClassificationNode
                    key={recent.id}
                    classification={classification}
                    isSelected={selectedId === recent.id}
                    isFavorite={isFavorite(recent.id)}
                    onSelect={() => handleSelect(classification)}
                    onToggleFavorite={() => handleToggleFavorite(classification)}
                    showCodes={showCodes}
                  />
                );
              })}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="divide-y divide-gray-100">
              {favorites.map((favorite) => {
                const classification = getById(favorite.id);
                if (!classification) return null;

                return (
                  <ClassificationNode
                    key={favorite.id}
                    classification={classification}
                    isSelected={selectedId === favorite.id}
                    isFavorite={true}
                    onSelect={() => handleSelect(classification)}
                    onToggleFavorite={() => handleToggleFavorite(classification)}
                    showCodes={showCodes}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
