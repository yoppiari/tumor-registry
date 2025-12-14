'use client';

import React, { useState, useCallback } from 'react';
import { useFormContext } from '../FormContext';

/**
 * RadiologyModalities Sub-Component
 *
 * Comprehensive radiology investigation tracker separated by modality:
 * 1. Conventional X-ray (REQUIRED - highlighted in blue)
 * 2. MRI
 * 3. CT Scan
 * 4. Bone Scan
 * 5. PET Scan
 *
 * Features:
 * - Multi-file upload with drag-and-drop
 * - DICOM and standard image format support
 * - Separate findings textarea for each modality
 * - Study date tracking
 * - Collapsible sections for non-required modalities
 * - File preview and removal
 */

interface RadiologyImage {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  url?: string; // For preview/download
}

interface ModalityData {
  modality: 'X_RAY' | 'MRI' | 'CT_SCAN' | 'BONE_SCAN' | 'PET_SCAN';
  studyDate?: string;
  findings?: string;
  images: RadiologyImage[];
}

interface RadiologyModalitiesData {
  radiologyModalities: ModalityData[];
}

const MODALITY_CONFIG = {
  X_RAY: {
    label: 'Conventional X-ray (Rontgen)',
    required: true,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    headerColor: 'bg-blue-100',
    icon: '📷',
    placeholder: 'Contoh: Lesi litik di distal femur kanan dengan destruksi korteks anterior, soft tissue mass (+), periosteal reaction sunburst appearance, ukuran lesi 8x6 cm...',
  },
  MRI: {
    label: 'MRI (Magnetic Resonance Imaging)',
    required: false,
    bgColor: 'bg-white',
    borderColor: 'border-gray-300',
    headerColor: 'bg-gray-50',
    icon: '🧲',
    placeholder: 'Contoh: Massa intramedular di distal femur dengan ekstensi ekstraosseous, T1 hypointense, T2 hyperintense dengan enhancing septa, invasi ke neurovascular bundle (-), skip lesion (-), joint invasion (-)...',
  },
  CT_SCAN: {
    label: 'CT Scan (Computed Tomography)',
    required: false,
    bgColor: 'bg-white',
    borderColor: 'border-gray-300',
    headerColor: 'bg-gray-50',
    icon: '🔬',
    placeholder: 'Contoh: Massa jaringan lunak dengan komponen kalsifikasi mineralisasi matriks, ukuran 8x6x5 cm, melibatkan kompartemen anterior thigh, tidak tampak metastasis paru...',
  },
  BONE_SCAN: {
    label: 'Bone Scan (Skintigrafi Tulang)',
    required: false,
    bgColor: 'bg-white',
    borderColor: 'border-gray-300',
    headerColor: 'bg-gray-50',
    icon: '☢️',
    placeholder: 'Contoh: Peningkatan uptake Tc-99m MDP di distal femur kanan, tidak tampak hot spot di tulang lain, tidak ada tanda metastasis tulang...',
  },
  PET_SCAN: {
    label: 'PET Scan (Positron Emission Tomography)',
    required: false,
    bgColor: 'bg-white',
    borderColor: 'border-gray-300',
    headerColor: 'bg-gray-50',
    icon: '⚡',
    placeholder: 'Contoh: Peningkatan uptake FDG dengan SUVmax 8.5 di lesi primer distal femur kanan, tidak tampak lymph node involvement, tidak ada distant metastasis...',
  },
};

export function RadiologyModalities() {
  const { getSection, updateSection } = useFormContext();
  const savedData = (getSection('section4') as RadiologyModalitiesData) || {};

  // Initialize with all modalities if not present
  const initialModalities: ModalityData[] = savedData.radiologyModalities || [
    { modality: 'X_RAY', images: [] },
    { modality: 'MRI', images: [] },
    { modality: 'CT_SCAN', images: [] },
    { modality: 'BONE_SCAN', images: [] },
    { modality: 'PET_SCAN', images: [] },
  ];

  const [modalitiesData, setModalitiesData] = useState<ModalityData[]>(initialModalities);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['X_RAY']) // X-ray is expanded by default
  );
  const [dragOverModality, setDragOverModality] = useState<string | null>(null);

  // Update form context whenever data changes
  const updateFormData = useCallback((newData: ModalityData[]) => {
    setModalitiesData(newData);
    updateSection('section4', {
      ...savedData,
      radiologyModalities: newData,
    });
  }, [savedData, updateSection]);

  // Update specific modality field
  const updateModalityField = (
    modality: string,
    field: keyof ModalityData,
    value: any
  ) => {
    const updated = modalitiesData.map((m) =>
      m.modality === modality ? { ...m, [field]: value } : m
    );
    updateFormData(updated);
  };

  // Handle file upload
  const handleFileUpload = (modality: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newImages: RadiologyImage[] = Array.from(files).map((file) => ({
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadDate: new Date().toISOString(),
    }));

    const modalityData = modalitiesData.find((m) => m.modality === modality);
    if (modalityData) {
      const updatedImages = [...modalityData.images, ...newImages];
      updateModalityField(modality, 'images', updatedImages);
    }
  };

  // Remove uploaded file
  const removeFile = (modality: string, fileIndex: number) => {
    const modalityData = modalitiesData.find((m) => m.modality === modality);
    if (modalityData) {
      const updatedImages = modalityData.images.filter((_, i) => i !== fileIndex);
      updateModalityField(modality, 'images', updatedImages);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, modality: string) => {
    e.preventDefault();
    setDragOverModality(modality);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverModality(null);
  };

  const handleDrop = (e: React.DragEvent, modality: string) => {
    e.preventDefault();
    setDragOverModality(null);
    const files = e.dataTransfer.files;
    handleFileUpload(modality, files);
  };

  // Toggle section expansion
  const toggleSection = (modality: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(modality)) {
        newSet.delete(modality);
      } else {
        newSet.add(modality);
      }
      return newSet;
    });
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Render individual modality section
  const renderModalitySection = (modalityType: keyof typeof MODALITY_CONFIG) => {
    const config = MODALITY_CONFIG[modalityType];
    const modalityData = modalitiesData.find((m) => m.modality === modalityType);
    const isExpanded = expandedSections.has(modalityType);
    const isDragOver = dragOverModality === modalityType;

    if (!modalityData) return null;

    return (
      <div
        key={modalityType}
        className={`rounded-lg border-2 ${config.borderColor} ${config.bgColor} overflow-hidden transition-all`}
      >
        {/* Header */}
        <div
          className={`${config.headerColor} px-6 py-4 flex items-center justify-between cursor-pointer`}
          onClick={() => !config.required && toggleSection(modalityType)}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {config.label}
                {config.required && (
                  <span className="ml-2 text-red-500 text-sm">*WAJIB</span>
                )}
              </h3>
              {modalityData.images.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  {modalityData.images.length} file(s) uploaded
                  {modalityData.studyDate && ` • Study: ${new Date(modalityData.studyDate).toLocaleDateString('id-ID')}`}
                </p>
              )}
            </div>
          </div>

          {!config.required && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSection(modalityType);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content - Always expanded for required, collapsible for others */}
        {(config.required || isExpanded) && (
          <div className="px-6 py-5 space-y-4">
            {/* Study Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Pemeriksaan {config.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                value={modalityData.studyDate || ''}
                onChange={(e) => updateModalityField(modalityType, 'studyDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={config.required}
              />
            </div>

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Gambar {config.required && <span className="text-red-500">*</span>}
              </label>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => handleDragOver(e, modalityType)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, modalityType)}
                className={`
                  border-2 border-dashed rounded-lg p-6 text-center
                  transition-all cursor-pointer
                  ${isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,.dcm"
                  onChange={(e) => handleFileUpload(modalityType, e.target.files)}
                  className="hidden"
                  id={`file-upload-${modalityType}`}
                />
                <label
                  htmlFor={`file-upload-${modalityType}`}
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">
                    Klik untuk upload atau drag & drop file
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG, DICOM (.dcm) - Max 10MB per file
                  </span>
                </label>
              </div>

              {/* Uploaded Files List */}
              {modalityData.images.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    File yang diupload ({modalityData.images.length}):
                  </p>
                  {modalityData.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <svg
                          className="w-5 h-5 text-blue-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {image.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(image.fileSize)} • {new Date(image.uploadDate).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(modalityType, index)}
                        className="ml-3 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Hapus file"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Findings Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temuan dan Interpretasi {config.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={modalityData.findings || ''}
                onChange={(e) => updateModalityField(modalityType, 'findings', e.target.value)}
                rows={4}
                placeholder={config.placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                required={config.required}
              />
              <p className="mt-2 text-xs text-gray-500">
                Jelaskan lokasi lesi, karakteristik (litik/blastik/mixed), ukuran, ekstensi jaringan lunak, invasi struktur sekitar, dan tanda metastasis
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Petunjuk Pemeriksaan Radiologi
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• <strong>X-ray (Rontgen)</strong> adalah pemeriksaan WAJIB dan harus diisi</li>
              <li>• Upload gambar dalam format JPG, PNG, atau DICOM (.dcm)</li>
              <li>• Anda dapat mengupload beberapa gambar untuk setiap modalitas</li>
              <li>• Pemeriksaan lain (MRI, CT, Bone Scan, PET) bersifat opsional</li>
              <li>• Klik header section untuk membuka/tutup pemeriksaan opsional</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Render all modality sections */}
      {renderModalitySection('X_RAY')}
      {renderModalitySection('MRI')}
      {renderModalitySection('CT_SCAN')}
      {renderModalitySection('BONE_SCAN')}
      {renderModalitySection('PET_SCAN')}

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Ringkasan Pemeriksaan</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {Object.entries(MODALITY_CONFIG).map(([key, config]) => {
            const data = modalitiesData.find((m) => m.modality === key);
            const hasData = data && (data.findings || data.images.length > 0);
            return (
              <div
                key={key}
                className={`px-3 py-2 rounded-lg border ${
                  hasData
                    ? 'bg-green-50 border-green-300 text-green-800'
                    : config.required
                    ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
              >
                <div className="font-medium">{config.icon} {config.label.split(' ')[0]}</div>
                <div className="text-xs mt-1">
                  {hasData ? '✓ Lengkap' : config.required ? '⚠ Wajib' : '○ Kosong'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
