import React from 'react';
import { WhoClassificationTree } from './WhoClassificationTree';
import { WhoClassification } from './types';

interface BoneTumorTreeProps {
  selectedId?: string;
  onSelect: (classification: WhoClassification) => void;
  searchable?: boolean;
  showCodes?: boolean;
  showRecent?: boolean;
  showFavorites?: boolean;
  enableKeyboardNav?: boolean;
  className?: string;
}

/**
 * Specialized wrapper for WHO Bone Tumor Classifications
 * Pre-configured for bone tumor type with sensible defaults
 */
export const BoneTumorTree: React.FC<BoneTumorTreeProps> = (props) => {
  return (
    <div>
      <div className="mb-4 border-l-4 border-blue-600 bg-blue-50 p-4">
        <h3 className="text-sm font-semibold text-blue-900">
          WHO Classification of Bone Tumours (5th Edition)
        </h3>
        <p className="mt-1 text-xs text-blue-700">
          Select from {57} standardized bone tumor classifications organized by histological
          category
        </p>
      </div>
      <WhoClassificationTree {...props} tumorType="BONE" />
    </div>
  );
};
