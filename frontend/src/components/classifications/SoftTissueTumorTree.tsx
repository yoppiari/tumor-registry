import React from 'react';
import { WhoClassificationTree } from './WhoClassificationTree';
import { WhoClassification } from './types';

interface SoftTissueTumorTreeProps {
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
 * Specialized wrapper for WHO Soft Tissue Tumor Classifications
 * Pre-configured for soft tissue tumor type with sensible defaults
 */
export const SoftTissueTumorTree: React.FC<SoftTissueTumorTreeProps> = (props) => {
  return (
    <div>
      <div className="mb-4 border-l-4 border-purple-600 bg-purple-50 p-4">
        <h3 className="text-sm font-semibold text-purple-900">
          WHO Classification of Soft Tissue Tumours (5th Edition)
        </h3>
        <p className="mt-1 text-xs text-purple-700">
          Select from {68} standardized soft tissue tumor classifications organized by
          histological category
        </p>
      </div>
      <WhoClassificationTree {...props} tumorType="SOFT_TISSUE" />
    </div>
  );
};
