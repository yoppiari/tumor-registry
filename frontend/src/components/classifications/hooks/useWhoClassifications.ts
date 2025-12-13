import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { referenceService, WhoBoneTumor, WhoSoftTissueTumor } from '../../../services';
import { WhoClassification, CategoryNode } from '../types';

interface UseWhoClassificationsOptions {
  tumorType: 'BONE' | 'SOFT_TISSUE';
  category?: string;
  isMalignant?: boolean;
}

interface ClassificationData {
  raw: WhoClassification[];
  grouped: CategoryNode[];
  flatMap: Map<string, WhoClassification>;
}

/**
 * Custom hook to fetch and manage WHO tumor classifications
 * Uses React Query for caching and automatic refetching
 */
export function useWhoClassifications({
  tumorType,
  category,
  isMalignant,
}: UseWhoClassificationsOptions): UseQueryResult<ClassificationData> & {
  classifications: WhoClassification[];
  categories: CategoryNode[];
  getById: (id: string) => WhoClassification | undefined;
} {
  const queryKey = ['who-classifications', tumorType, category, isMalignant];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      let rawData: (WhoBoneTumor | WhoSoftTissueTumor)[];

      if (tumorType === 'BONE') {
        rawData = await referenceService.getWhoBoneTumors({ category, isMalignant });
      } else {
        rawData = await referenceService.getWhoSoftTissueTumors({ category, isMalignant });
      }

      // Transform to unified WhoClassification format
      const classifications: WhoClassification[] = rawData.map((item) => ({
        id: item.id,
        name: item.diagnosis,
        category: item.category,
        subcategory: item.subcategory,
        diagnosis: item.diagnosis,
        icdO3Code: item.icdO3Code,
        isMalignant: item.isMalignant,
        sortOrder: item.sortOrder,
      }));

      // Sort by sortOrder
      classifications.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

      // Group by category
      const categoryMap = new Map<string, CategoryNode>();

      classifications.forEach((classification) => {
        const categoryKey = classification.category;

        if (!categoryMap.has(categoryKey)) {
          categoryMap.set(categoryKey, {
            id: `category-${categoryKey}`,
            name: categoryKey,
            isCategory: true,
            children: [],
          });
        }

        const categoryNode = categoryMap.get(categoryKey)!;
        categoryNode.children.push(classification);
      });

      const grouped = Array.from(categoryMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      // Create flat map for quick lookup
      const flatMap = new Map<string, WhoClassification>();
      classifications.forEach((c) => flatMap.set(c.id, c));

      return {
        raw: classifications,
        grouped,
        flatMap,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
  });

  return {
    ...query,
    classifications: query.data?.raw || [],
    categories: query.data?.grouped || [],
    getById: (id: string) => query.data?.flatMap.get(id),
  };
}
