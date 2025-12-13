// WHO Classification Types
export interface WhoClassification {
  id: string;
  code?: string;
  name: string;
  category: string;
  subcategory?: string;
  diagnosis?: string;
  icdO3Code?: string;
  isMalignant?: boolean;
  sortOrder?: number;
  parentId?: string;
  children?: WhoClassification[];
}

// Hierarchical Category Node
export interface CategoryNode {
  id: string;
  name: string;
  isCategory: true;
  children: WhoClassification[];
  expanded?: boolean;
}

// Tree Node (can be category or classification)
export type TreeNode = CategoryNode | (WhoClassification & { isCategory?: false });

// Recent Selection
export interface RecentSelection {
  id: string;
  name: string;
  category: string;
  timestamp: number;
}

// Favorite Classification
export interface FavoriteClassification {
  id: string;
  name: string;
  category: string;
  tumorType: 'BONE' | 'SOFT_TISSUE';
}

// Search result with highlight
export interface SearchResult {
  classification: WhoClassification;
  matchType: 'name' | 'code' | 'category' | 'icdO3';
  highlightText?: string;
}

// Classification Tree Props
export interface WhoClassificationTreeProps {
  tumorType: 'BONE' | 'SOFT_TISSUE';
  selectedId?: string;
  onSelect: (classification: WhoClassification) => void;
  searchable?: boolean;
  showCodes?: boolean;
  showRecent?: boolean;
  showFavorites?: boolean;
  enableKeyboardNav?: boolean;
  className?: string;
}

// Storage keys
export const STORAGE_KEYS = {
  RECENT_BONE: 'who_recent_bone_classifications',
  RECENT_SOFT_TISSUE: 'who_recent_soft_tissue_classifications',
  FAVORITES_BONE: 'who_favorites_bone_classifications',
  FAVORITES_SOFT_TISSUE: 'who_favorites_soft_tissue_classifications',
} as const;
