import React, { useState, useEffect } from 'react';
import { referenceService, WhoBoneTumor, WhoSoftTissueTumor } from '../../../../services';

export interface WHOClassification {
  id: string;
  code?: string;
  name: string;
  description?: string;
  category?: string;
  subcategory?: string;
  diagnosis?: string;
  isMalignant?: boolean;
  children?: WHOClassification[];
}

interface WHOClassificationPickerProps {
  type: 'bone' | 'soft_tissue';
  selectedId?: string;
  onSelect: (id: string, classification: WHOClassification) => void;
  error?: string;
}

export const WHOClassificationPicker: React.FC<WHOClassificationPickerProps> = ({
  type,
  selectedId,
  onSelect,
  error,
}) => {
  const [classifications, setClassifications] = useState<WHOClassification[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Fetch classifications from API
  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        if (type === 'bone') {
          const boneTumors = await referenceService.getWhoBoneTumors();
          // Group by category for hierarchical display
          const grouped = groupByCategory(boneTumors);
          setClassifications(grouped);
        } else {
          const softTissueTumors = await referenceService.getWhoSoftTissueTumors();
          // Group by category for hierarchical display
          const grouped = groupByCategory(softTissueTumors);
          setClassifications(grouped);
        }
      } catch (error: any) {
        console.error('Error fetching WHO classifications:', error);
        setFetchError(error.message || 'Failed to load classifications');
      } finally {
        setLoading(false);
      }
    };

    fetchClassifications();
  }, [type]);

  // Group classifications by category
  const groupByCategory = (items: (WhoBoneTumor | WhoSoftTissueTumor)[]): WHOClassification[] => {
    const categoryMap = new Map<string, WHOClassification>();

    items.forEach((item) => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, {
          id: `cat-${item.category}`,
          name: item.category,
          category: 'category',
          children: [],
        });
      }

      const category = categoryMap.get(item.category)!;
      category.children!.push({
        id: item.id,
        name: item.diagnosis,
        diagnosis: item.diagnosis,
        category: item.category,
        subcategory: item.subcategory,
        isMalignant: item.isMalignant,
      });
    });

    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  // Filter classifications based on search query
  const filteredClassifications = classifications.map((category) => {
    if (!searchQuery) return category;

    const filteredChildren = category.children?.filter((child) =>
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredChildren && filteredChildren.length > 0) {
      return { ...category, children: filteredChildren };
    }

    return null;
  }).filter(Boolean) as WHOClassification[];

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Expand all categories
  const expandAll = () => {
    const allCategories = new Set(classifications.map((c) => c.id));
    setExpandedCategories(allCategories);
  };

  // Collapse all categories
  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading WHO classifications...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">
          <strong>Error:</strong> {fetchError}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search classifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Classification list */}
      <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
        {filteredClassifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No classifications found matching your search.
          </div>
        ) : (
          filteredClassifications.map((category) => (
            <div key={category.id} className="border-b last:border-b-0">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-800">{category.name}</span>
                <span className="text-sm text-gray-500">
                  {expandedCategories.has(category.id) ? '▼' : '▶'}
                  {' '}({category.children?.length || 0})
                </span>
              </button>

              {/* Category children */}
              {expandedCategories.has(category.id) && category.children && (
                <div className="bg-white">
                  {category.children.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelect(item.id, item)}
                      className={`w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors border-b last:border-b-0 flex items-center justify-between ${
                        selectedId === item.id ? 'bg-blue-100 border-l-4 border-l-blue-600' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        {item.subcategory && (
                          <div className="text-sm text-gray-500">{item.subcategory}</div>
                        )}
                      </div>
                      {item.isMalignant && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Malignant
                        </span>
                      )}
                      {selectedId === item.id && (
                        <span className="ml-2 text-blue-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}

      {/* Selected info */}
      {selectedId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Selected:</strong>{' '}
            {
              classifications
                .flatMap((c) => c.children || [])
                .find((item) => item.id === selectedId)?.name
            }
          </p>
        </div>
      )}
    </div>
  );
};
