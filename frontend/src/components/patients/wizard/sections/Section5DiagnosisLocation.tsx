'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useFormContext } from '../FormContext';
import dynamic from 'next/dynamic';
import type { WhoClassification } from '@/components/classifications/types';

// Dynamically import WHO Classification trees with no SSR
const WhoClassificationTree = dynamic(
  () => import('../../../classifications/WhoClassificationTree').then((mod) => ({ default: mod.WhoClassificationTree })),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div> }
);

const BoneTumorTree = dynamic(
  () => import('../../../classifications/BoneTumorTree').then((mod) => ({ default: mod.BoneTumorTree })),
  { ssr: false }
);

const SoftTissueTumorTree = dynamic(
  () => import('../../../classifications/SoftTissueTumorTree').then((mod) => ({ default: mod.SoftTissueTumorTree })),
  { ssr: false }
);

/**
 * Section 5: Diagnosis & Tumor Location
 *
 * Integrates WHO Classification trees based on pathology type selected in Section 1:
 * - BONE → 57 WHO bone tumor classifications (WHO 5th Edition)
 * - SOFT_TISSUE → 68 WHO soft tissue tumor classifications (WHO 5th Edition)
 * - METASTATIC → Simplified selection
 *
 * Also captures anatomical location using hierarchical bone/soft tissue location pickers.
 */

interface BoneLocation {
  id: string;
  name: string;
  level: number;
  parentId?: string;
}

interface SoftTissueLocation {
  id: string;
  name: string;
  anatomicalRegion?: string;
}

interface Section5Data {
  whoClassificationId: string;
  whoClassificationCode?: string;
  whoClassificationName?: string;
  boneLocationId?: string;
  boneLocationName?: string;
  softTissueLocationId?: string;
  softTissueLocationName?: string;
  tumorSide?: 'LEFT' | 'RIGHT' | 'BILATERAL' | 'MIDLINE' | '';
  specificAnatomicalSite?: string;
}

export function Section5DiagnosisLocation() {
  const { getSection, updateSection } = useFormContext();

  // Get section 1 data to determine pathology type
  const section1Data = getSection('section1') as { pathologyType: string; pathologyTypeName?: string; pathologyTypeId?: string } | undefined;
  const savedData = (getSection('section5') as Section5Data) || {};
  const section5Data: Section5Data = {
    whoClassificationId: savedData.whoClassificationId || '',
    whoClassificationCode: savedData.whoClassificationCode || '',
    whoClassificationName: savedData.whoClassificationName || '',
    boneLocationId: savedData.boneLocationId || '',
    boneLocationName: savedData.boneLocationName || '',
    softTissueLocationId: savedData.softTissueLocationId || '',
    softTissueLocationName: savedData.softTissueLocationName || '',
    tumorSide: savedData.tumorSide || '',
    specificAnatomicalSite: savedData.specificAnatomicalSite || '',
  };

  const [boneLocations, setBoneLocations] = useState<BoneLocation[]>([]);
  const [softTissueLocations, setSoftTissueLocations] = useState<SoftTissueLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pathologyTypeName = section1Data?.pathologyTypeName || '';
  const pathologyTypeCode = section1Data?.pathologyType || '';
  const isBoneTumor = pathologyTypeCode.includes('bone') || pathologyTypeName.includes('Tulang');
  const isSoftTissueTumor = pathologyTypeCode.includes('soft') || pathologyTypeName.includes('Jaringan Lunak');

  // Load location data based on pathology type
  useEffect(() => {
    if (isBoneTumor) {
      loadBoneLocations();
    } else if (isSoftTissueTumor) {
      loadSoftTissueLocations();
    }
  }, [isBoneTumor, isSoftTissueTumor]);

  const loadBoneLocations = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/locations/bone`);

      if (!response.ok) {
        throw new Error('Failed to load bone locations');
      }

      const data = await response.json();
      setBoneLocations(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Error loading bone locations:', error);
      setBoneLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSoftTissueLocations = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/locations/soft-tissue`);

      if (!response.ok) {
        throw new Error('Failed to load soft tissue locations');
      }

      const data = await response.json();
      setSoftTissueLocations(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Error loading soft tissue locations:', error);
      setSoftTissueLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhoClassificationSelect = (classification: WhoClassification) => {
    updateSection('section5', {
      ...section5Data,
      whoClassificationId: classification.id,
      whoClassificationCode: classification.code,
      whoClassificationName: classification.name,
    });
  };

  const updateField = <K extends keyof Section5Data>(field: K, value: Section5Data[K]) => {
    updateSection('section5', {
      ...section5Data,
      [field]: value,
    });
  };

  const handleBoneLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = e.target.value;
    const location = boneLocations.find((loc) => loc.id === locationId);
    updateSection('section5', {
      ...section5Data,
      boneLocationId: locationId,
      boneLocationName: location?.name,
    });
  };

  const handleSoftTissueLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = e.target.value;
    const location = softTissueLocations.find((loc) => loc.id === locationId);
    updateSection('section5', {
      ...section5Data,
      softTissueLocationId: locationId,
      softTissueLocationName: location?.name,
    });
  };

  if (!section1Data?.pathologyType) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <svg
            className="h-6 w-6 text-yellow-600 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="text-yellow-800 font-medium">Jenis Patologi Belum Dipilih</h3>
            <p className="text-yellow-700 mt-1">
              Silakan kembali ke Bagian 1 untuk memilih jenis patologi terlebih dahulu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Diagnosis & Lokasi Tumor
        </h2>
        <p className="text-gray-600">
          Pilih klasifikasi WHO dan lokasi anatomis tumor muskuloskeletal
        </p>
        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          Jenis Patologi: {pathologyTypeName}
        </div>
      </div>

      {/* WHO Classification Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Klasifikasi Tumor WHO (5th Edition)
          <span className="text-red-500 ml-1">*</span>
        </h3>

        <Suspense fallback={<div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>}>
          {isBoneTumor && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Pilih dari 57 klasifikasi tumor tulang WHO (5th Edition, 2020)
              </p>
              <BoneTumorTree
                selectedId={section5Data.whoClassificationId}
                onSelect={handleWhoClassificationSelect}
                searchable={true}
                showCodes={true}
              />
            </div>
          )}

          {isSoftTissueTumor && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Pilih dari 68 klasifikasi tumor jaringan lunak WHO (5th Edition, 2020)
              </p>
              <SoftTissueTumorTree
                selectedId={section5Data.whoClassificationId}
                onSelect={handleWhoClassificationSelect}
                searchable={true}
                showCodes={true}
              />
            </div>
          )}

          {!isBoneTumor && !isSoftTissueTumor && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                Klasifikasi untuk jenis patologi {pathologyTypeName} akan ditampilkan di sini.
              </p>
            </div>
          )}
        </Suspense>

        {/* Selected classification display */}
        {section5Data.whoClassificationId && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">Klasifikasi Dipilih:</p>
                <p className="text-sm text-green-900 font-semibold mt-1">
                  {section5Data.whoClassificationCode} - {section5Data.whoClassificationName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Anatomical Location */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lokasi Anatomis
          <span className="text-red-500 ml-1">*</span>
        </h3>

        {/* Bone Location Selector */}
        {isBoneTumor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi Tulang <span className="text-red-500">*</span>
            </label>
            <select
              value={section5Data.boneLocationId || ''}
              onChange={handleBoneLocationChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Lokasi Tulang</option>
              {boneLocations
                .filter((loc) => loc.level === 1) // Top-level only for now
                .map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Pilih lokasi tulang utama. Anda dapat menambahkan detail spesifik di bawah.
            </p>
          </div>
        )}

        {/* Soft Tissue Location Selector */}
        {isSoftTissueTumor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi Jaringan Lunak <span className="text-red-500">*</span>
            </label>
            <select
              value={section5Data.softTissueLocationId || ''}
              onChange={handleSoftTissueLocationChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Lokasi Jaringan Lunak</option>
              {softTissueLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                  {location.anatomicalRegion && ` (${location.anatomicalRegion})`}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Pilih lokasi jaringan lunak berdasarkan region anatomis.
            </p>
          </div>
        )}

        {/* Tumor Side/Laterality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sisi/Lateralitas Tumor <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'LEFT', label: 'Kiri', icon: '←' },
              { value: 'RIGHT', label: 'Kanan', icon: '→' },
              { value: 'BILATERAL', label: 'Bilateral', icon: '↔' },
              { value: 'MIDLINE', label: 'Midline', icon: '↕' },
            ].map((side) => (
              <button
                key={side.value}
                type="button"
                onClick={() => updateField('tumorSide', side.value as any)}
                className={`
                  px-4 py-3 rounded-lg border-2 text-center transition-all
                  ${
                    section5Data.tumorSide === side.value
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                  }
                `}
              >
                <div className="text-2xl mb-1">{side.icon}</div>
                <div className="text-sm font-medium">{side.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Specific Anatomical Site Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detail Spesifik Lokasi Anatomis
          </label>
          <textarea
            value={section5Data.specificAnatomicalSite || ''}
            onChange={(e) => updateField('specificAnatomicalSite', e.target.value)}
            rows={3}
            placeholder="Contoh: Distal femur, 5 cm dari sendi lutut, melibatkan korteks anterior"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Berikan deskripsi detail lokasi tumor untuk dokumentasi klinis yang lengkap.
          </p>
        </div>
      </div>

      {/* Summary */}
      {section5Data.whoClassificationId &&
        (section5Data.boneLocationId || section5Data.softTissueLocationId) &&
        section5Data.tumorSide && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-blue-900">Diagnosis & Lokasi Lengkap</p>
                <div className="mt-2 text-blue-800 space-y-1">
                  <p>
                    <span className="font-semibold">WHO:</span> {section5Data.whoClassificationCode} -{' '}
                    {section5Data.whoClassificationName}
                  </p>
                  <p>
                    <span className="font-semibold">Lokasi:</span>{' '}
                    {section5Data.boneLocationName || section5Data.softTissueLocationName} (
                    {section5Data.tumorSide})
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
