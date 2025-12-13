/**
 * Basic Example: Simple tumor classification selector
 *
 * This example demonstrates the most basic usage of the BoneTumorTree component.
 */

import React, { useState } from 'react';
import { BoneTumorTree, WhoClassification } from '../index';

export function BasicExample() {
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedClassification, setSelectedClassification] = useState<WhoClassification | null>(
    null
  );

  const handleSelect = (classification: WhoClassification) => {
    setSelectedId(classification.id);
    setSelectedClassification(classification);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Bone Tumor Classification Selector
      </h1>

      <BoneTumorTree selectedId={selectedId} onSelect={handleSelect} />

      {/* Display selected classification details */}
      {selectedClassification && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Classification</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="text-sm text-gray-900">{selectedClassification.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">{selectedClassification.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="text-sm text-gray-900">{selectedClassification.category}</dd>
            </div>
            {selectedClassification.subcategory && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Subcategory</dt>
                <dd className="text-sm text-gray-900">{selectedClassification.subcategory}</dd>
              </div>
            )}
            {selectedClassification.icdO3Code && (
              <div>
                <dt className="text-sm font-medium text-gray-500">ICD-O-3 Code</dt>
                <dd className="text-sm font-mono text-gray-900">
                  {selectedClassification.icdO3Code}
                </dd>
              </div>
            )}
            {selectedClassification.isMalignant !== undefined && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Malignancy</dt>
                <dd className="text-sm text-gray-900">
                  {selectedClassification.isMalignant ? 'Malignant' : 'Benign'}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
