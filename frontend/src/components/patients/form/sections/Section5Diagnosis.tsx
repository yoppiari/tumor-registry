import React from 'react';
import { PatientFormData } from '../usePatientForm';

interface Section5Props {
  formData: PatientFormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: any) => void;
  updateMultipleFields: (updates: Partial<PatientFormData>) => void;
}

const HISTOPATHOLOGY_GRADES = [
  { value: 'G1', label: 'G1 - Well Differentiated (Low Grade)' },
  { value: 'G2', label: 'G2 - Moderately Differentiated' },
  { value: 'G3', label: 'G3 - Poorly Differentiated (High Grade)' },
  { value: 'GX', label: 'GX - Grade Cannot Be Assessed' },
];

// Sample WHO Bone Tumor Classifications (simplified - full tree structure needed)
const WHO_BONE_TUMORS = [
  { id: '1', code: 'BT-001', name: 'Osteosarcoma, conventional' },
  { id: '2', code: 'BT-002', name: 'Osteosarcoma, telangiectatic' },
  { id: '3', code: 'BT-003', name: 'Osteosarcoma, small cell' },
  { id: '4', code: 'BT-004', name: 'Chondrosarcoma, conventional' },
  { id: '5', code: 'BT-005', name: 'Chondrosarcoma, dedifferentiated' },
  { id: '6', code: 'BT-006', name: 'Ewing sarcoma' },
  { id: '7', code: 'BT-007', name: 'Giant cell tumor of bone' },
  { id: '8', code: 'BT-008', name: 'Chordoma' },
  { id: '9', code: 'BT-009', name: 'Osteochondroma' },
  { id: '10', code: 'BT-010', name: 'Enchondroma' },
];

// Sample WHO Soft Tissue Tumor Classifications (simplified)
const WHO_SOFT_TISSUE_TUMORS = [
  { id: '1', code: 'ST-001', name: 'Undifferentiated pleomorphic sarcoma' },
  { id: '2', code: 'ST-002', name: 'Liposarcoma, well-differentiated' },
  { id: '3', code: 'ST-003', name: 'Liposarcoma, dedifferentiated' },
  { id: '4', code: 'ST-004', name: 'Liposarcoma, myxoid' },
  { id: '5', code: 'ST-005', name: 'Leiomyosarcoma' },
  { id: '6', code: 'ST-006', name: 'Rhabdomyosarcoma, embryonal' },
  { id: '7', code: 'ST-007', name: 'Rhabdomyosarcoma, alveolar' },
  { id: '8', code: 'ST-008', name: 'Synovial sarcoma' },
  { id: '9', code: 'ST-009', name: 'Fibrosarcoma' },
  { id: '10', code: 'ST-010', name: 'Dermatofibrosarcoma protuberans' },
];

// Sample Bone Locations (simplified - full hierarchical structure needed)
const BONE_LOCATIONS = [
  { id: '1', name: 'Proximal humerus' },
  { id: '2', name: 'Distal humerus' },
  { id: '3', name: 'Proximal radius' },
  { id: '4', name: 'Distal radius' },
  { id: '5', name: 'Proximal ulna' },
  { id: '6', name: 'Distal ulna' },
  { id: '7', name: 'Proximal femur' },
  { id: '8', name: 'Distal femur' },
  { id: '9', name: 'Proximal tibia' },
  { id: '10', name: 'Distal tibia' },
  { id: '11', name: 'Proximal fibula' },
  { id: '12', name: 'Distal fibula' },
  { id: '13', name: 'Pelvis - ilium' },
  { id: '14', name: 'Pelvis - acetabulum' },
  { id: '15', name: 'Spine - cervical' },
  { id: '16', name: 'Spine - thoracic' },
  { id: '17', name: 'Spine - lumbar' },
  { id: '18', name: 'Spine - sacrum' },
  { id: '19', name: 'Ribs' },
  { id: '20', name: 'Scapula' },
];

// Sample Soft Tissue Locations (simplified)
const SOFT_TISSUE_LOCATIONS = [
  { id: '1', name: 'Upper extremity - shoulder' },
  { id: '2', name: 'Upper extremity - arm' },
  { id: '3', name: 'Upper extremity - forearm' },
  { id: '4', name: 'Upper extremity - hand' },
  { id: '5', name: 'Lower extremity - thigh' },
  { id: '6', name: 'Lower extremity - leg' },
  { id: '7', name: 'Lower extremity - foot' },
  { id: '8', name: 'Trunk - chest wall' },
  { id: '9', name: 'Trunk - abdominal wall' },
  { id: '10', name: 'Trunk - back' },
  { id: '11', name: 'Trunk - buttock' },
  { id: '12', name: 'Head and neck' },
  { id: '13', name: 'Retroperitoneum' },
  { id: '14', name: 'Mediastinum' },
];

export const Section5Diagnosis: React.FC<Section5Props> = ({
  formData,
  errors,
  updateFormData,
  updateMultipleFields,
}) => {
  const isBoneTumor = formData.pathologyType === 'bone_tumor';
  const isSoftTissueTumor = formData.pathologyType === 'soft_tissue_tumor';
  const isMetastatic = formData.pathologyType === 'metastatic_bone_disease';

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">Section 5: Diagnosis & Location</h2>
      <p className="text-gray-600 mb-6">
        WHO classification and anatomical location based on pathology type
      </p>

      <div className="space-y-6">
        {/* Show pathology type reminder */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-sm font-medium text-blue-800">
            Pathology Type: <span className="font-bold">{formData.pathologyType?.replace(/_/g, ' ').toUpperCase()}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Classification and location options are based on the pathology type selected in Section 1
          </p>
        </div>

        {/* WHO Classification - Bone Tumor */}
        {isBoneTumor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WHO Bone Tumor Classification <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.whoBoneTumorId || ''}
              onChange={(e) => updateFormData('whoBoneTumorId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.whoBoneTumorId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select WHO bone tumor classification...</option>
              {WHO_BONE_TUMORS.map((tumor) => (
                <option key={tumor.id} value={tumor.id}>
                  {tumor.code} - {tumor.name}
                </option>
              ))}
            </select>
            {errors.whoBoneTumorId && (
              <p className="mt-1 text-sm text-red-500">{errors.whoBoneTumorId}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Note: This is a simplified list. Full WHO Classification 5th Edition tree will be available.
            </p>
          </div>
        )}

        {/* WHO Classification - Soft Tissue Tumor */}
        {isSoftTissueTumor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WHO Soft Tissue Tumor Classification <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.whoSoftTissueTumorId || ''}
              onChange={(e) => updateFormData('whoSoftTissueTumorId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.whoSoftTissueTumorId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select WHO soft tissue tumor classification...</option>
              {WHO_SOFT_TISSUE_TUMORS.map((tumor) => (
                <option key={tumor.id} value={tumor.id}>
                  {tumor.code} - {tumor.name}
                </option>
              ))}
            </select>
            {errors.whoSoftTissueTumorId && (
              <p className="mt-1 text-sm text-red-500">{errors.whoSoftTissueTumorId}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Note: This is a simplified list. Full WHO Classification 5th Edition tree will be available.
            </p>
          </div>
        )}

        {/* Metastatic Disease Note */}
        {isMetastatic && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Metastatic Bone Disease:</strong> Primary tumor information should be documented
              in the clinical notes. Location refers to the metastatic site in the skeletal system.
            </p>
          </div>
        )}

        {/* Bone Location */}
        {(isBoneTumor || isMetastatic) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bone Location
            </label>
            <select
              value={formData.boneLocationId || ''}
              onChange={(e) => updateFormData('boneLocationId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select bone location...</option>
              {BONE_LOCATIONS.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Note: This is a simplified list. Full hierarchical location selector will be available.
            </p>
          </div>
        )}

        {/* Soft Tissue Location */}
        {isSoftTissueTumor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soft Tissue Location
            </label>
            <select
              value={formData.softTissueLocationId || ''}
              onChange={(e) => updateFormData('softTissueLocationId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select soft tissue location...</option>
              {SOFT_TISSUE_LOCATIONS.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Note: This is a simplified list. Full hierarchical location selector will be available.
            </p>
          </div>
        )}

        {/* Histopathology Grade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Histopathology Grade
          </label>
          <div className="grid grid-cols-2 gap-3">
            {HISTOPATHOLOGY_GRADES.map((grade) => (
              <label
                key={grade.value}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.histopathologyGrade === grade.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="histopathologyGrade"
                  value={grade.value}
                  checked={formData.histopathologyGrade === grade.value}
                  onChange={(e) => updateFormData('histopathologyGrade', e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="ml-3 font-medium text-sm">{grade.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Histopathology Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Histopathology Details
          </label>
          <textarea
            value={formData.histopathologyDetails || ''}
            onChange={(e) => updateFormData('histopathologyDetails', e.target.value)}
            placeholder="Include microscopic features, immunohistochemistry results, molecular markers, and any other relevant histopathological findings..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Document detailed histopathological findings including mitotic rate, necrosis, cellularity, IHC markers, etc.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Coming Soon:</strong> Interactive WHO Classification tree picker and
                hierarchical anatomical location selector for more precise tumor classification
                and location documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
