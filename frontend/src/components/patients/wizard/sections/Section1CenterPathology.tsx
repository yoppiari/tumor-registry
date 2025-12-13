'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from '../FormContext';

/**
 * Section 1: Center & Pathology Type Selection
 *
 * First section of the 10-section Musculoskeletal Tumor Registry patient entry form.
 * Captures:
 * - Treatment center (pre-filled from user's center, can be changed for referrals)
 * - Pathology type (BONE, SOFT_TISSUE, or METASTATIC)
 *
 * This section determines which subsequent WHO classification tree will be shown:
 * - BONE → 57 WHO bone tumor classifications
 * - SOFT_TISSUE → 68 WHO soft tissue tumor classifications
 * - METASTATIC → Different workflow
 */

interface Center {
  id: string;
  name: string;
  code: string;
  province: string;
  regency?: string;
}

interface PathologyType {
  id: string;
  name: string;
  code: string;
  description?: string;
}

interface Section1Data {
  centerId: string;
  pathologyTypeId: string;
  pathologyTypeName?: string; // For convenience
}

export function Section1CenterPathology() {
  const { getSection, updateSection } = useFormContext();
  const [centers, setCenters] = useState<Center[]>([]);
  const [pathologyTypes, setPathologyTypes] = useState<PathologyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current form data for this section
  const sectionData: Partial<Section1Data> = (getSection('section1') as Section1Data) || {};

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const token = localStorage.getItem('token');

      // Fetch centers and pathology types in parallel
      const [centersRes, pathologyRes] = await Promise.all([
        fetch(`${apiUrl}/centers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${apiUrl}/pathology-types`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      ]);

      if (!centersRes.ok || !pathologyRes.ok) {
        const centersError = !centersRes.ok ? await centersRes.text() : null;
        const pathologyError = !pathologyRes.ok ? await pathologyRes.text() : null;
        console.error('Centers response:', centersError);
        console.error('Pathology response:', pathologyError);
        throw new Error('Failed to load data');
      }

      const centersData = await centersRes.json();
      const pathologyData = await pathologyRes.json();

      setCenters(centersData.data || centersData);
      setPathologyTypes(pathologyData.data || pathologyData);

      // Pre-fill user's center if not already set
      if (!sectionData.centerId && centersData.data?.[0]?.id) {
        const userCenter = centersData.data[0]; // First center is typically user's center
        updateSection('section1', {
          ...sectionData,
          centerId: userCenter.id,
        });
      }
    } catch (err) {
      console.error('Error loading section 1 data:', err);
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSection('section1', {
      ...sectionData,
      centerId: e.target.value,
    });
  };

  const handlePathologyTypeChange = (pathologyTypeId: string) => {
    const pathologyType = pathologyTypes.find((pt) => pt.id === pathologyTypeId);
    updateSection('section1', {
      ...sectionData,
      pathologyTypeId,
      pathologyTypeName: pathologyType?.name,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Memuat data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <svg
            className="h-6 w-6 text-red-600 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pusat Pengobatan & Jenis Patologi
        </h2>
        <p className="text-gray-600">
          Pilih pusat pengobatan dan jenis patologi tumor muskuloskeletal
        </p>
      </div>

      {/* Center Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pusat Pengobatan <span className="text-red-500">*</span>
        </label>
        <select
          value={sectionData.centerId || ''}
          onChange={handleCenterChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Pilih Pusat Pengobatan</option>
          {centers.map((center) => (
            <option key={center.id} value={center.id}>
              {center.name} ({center.code}) - {center.province}
              {center.regency ? `, ${center.regency}` : ''}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-500">
          Pilih pusat pengobatan tempat pasien dirawat. Untuk pasien rujukan, pilih pusat yang sesuai.
        </p>
      </div>

      {/* Pathology Type Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Jenis Patologi <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pathologyTypes.map((pathologyType) => {
            const isSelected = sectionData.pathologyTypeId === pathologyType.id;

            return (
              <button
                key={pathologyType.id}
                type="button"
                onClick={() => handlePathologyTypeChange(pathologyType.id)}
                className={`
                  relative p-6 rounded-lg border-2 text-left transition-all
                  ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }
                `}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Pathology type name */}
                <div className={`text-lg font-semibold mb-2 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                  {pathologyType.name}
                </div>

                {/* Pathology type code */}
                <div className={`text-sm font-mono mb-2 ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                  {pathologyType.code}
                </div>

                {/* Description */}
                {pathologyType.description && (
                  <div className={`text-sm ${isSelected ? 'text-blue-800' : 'text-gray-600'}`}>
                    {pathologyType.description}
                  </div>
                )}

                {/* WHO Classification info */}
                <div className={`mt-4 text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                  {pathologyType.code === 'BONE' && '57 klasifikasi tumor tulang WHO'}
                  {pathologyType.code === 'SOFT_TISSUE' && '68 klasifikasi tumor jaringan lunak WHO'}
                  {pathologyType.code === 'METASTATIC' && 'Tumor metastatik'}
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Pilih jenis patologi tumor. Pilihan ini menentukan klasifikasi WHO yang akan ditampilkan di bagian diagnosis.
        </p>
      </div>

      {/* Summary */}
      {sectionData.centerId && sectionData.pathologyTypeId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="h-6 w-6 text-green-600 mr-3 flex-shrink-0"
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
            <div className="text-sm text-green-800">
              <span className="font-medium">Informasi dasar lengkap.</span> Anda dapat melanjutkan ke bagian selanjutnya.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
