// Step 1: Research Info
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import researchRequestsService from '@/services/research-requests.service';

export function Step1ResearchInfo({ formData, updateFormData }: any) {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informasi Penelitian</h2>
        <p className="text-gray-600">Detail penelitian dan identitas peneliti</p>
      </div>

      {/* Auto-filled Researcher Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Informasi Peneliti (Auto-fill)</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-600">Nama:</span> <span className="font-medium">{user?.name}</span></div>
          <div><span className="text-gray-600">Email:</span> <span className="font-medium">{user?.email}</span></div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">No. HP (Opsional)</label>
        <input
          type="tel"
          value={formData.researcherPhone || ''}
          onChange={(e) => updateFormData('researcherPhone', e.target.value)}
          placeholder="+62"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Judul Penelitian <span className="text-red-600">*</span></label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => updateFormData('title', e.target.value)}
          placeholder="Judul lengkap penelitian Anda"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Penelitian <span className="text-red-600">*</span></label>
        <select
          value={formData.researchType || ''}
          onChange={(e) => updateFormData('researchType', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="">Pilih tipe penelitian</option>
          <option value="ACADEMIC">Akademik (Skripsi/Tesis/Disertasi)</option>
          <option value="CLINICAL_TRIAL">Clinical Trial</option>
          <option value="OBSERVATIONAL">Observational Study</option>
          <option value="SYSTEMATIC_REVIEW">Systematic Review</option>
          <option value="META_ANALYSIS">Meta-analysis</option>
          <option value="OTHER">Lainnya</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Abstrak Singkat <span className="text-red-600">*</span></label>
        <textarea
          value={formData.researchAbstract || ''}
          onChange={(e) => updateFormData('researchAbstract', e.target.value)}
          placeholder="Ringkasan singkat penelitian Anda (max 500 karakter)"
          rows={4}
          maxLength={500}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
        <div className="text-sm text-gray-500 mt-1">{(formData.researchAbstract || '').length}/500 karakter</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tujuan Penelitian <span className="text-red-600">*</span></label>
        <textarea
          value={formData.objectives || ''}
          onChange={(e) => updateFormData('objectives', e.target.value)}
          placeholder="Tujuan utama penelitian (max 300 karakter)"
          rows={3}
          maxLength={300}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
        <div className="text-sm text-gray-500 mt-1">{(formData.objectives || '').length}/300 karakter</div>
      </div>
    </div>
  );
}

// Step 2: Data Criteria
export function Step2DataCriteria({ formData, updateFormData }: any) {
  const [estimatedCount, setEstimatedCount] = useState<number | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  const filters = formData.dataFilters || {};

  const updateFilter = (field: string, value: any) => {
    const newFilters = { ...filters, [field]: value };
    updateFormData('dataFilters', newFilters);
  };

  const handleEstimate = async () => {
    if (!filters.periodStart || !filters.periodEnd) {
      alert('Silakan pilih periode data terlebih dahulu');
      return;
    }

    setIsEstimating(true);
    try {
      const result = await researchRequestsService.estimatePatients(filters);
      setEstimatedCount(result.estimatedCount);
      updateFormData('estimatedPatientCount', result.estimatedCount);
    } catch (error) {
      console.error('Error estimating:', error);
      alert('Gagal menghitung estimasi. Silakan coba lagi.');
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kriteria Data</h2>
        <p className="text-gray-600">Filter pasien dan estimasi jumlah data</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Periode Data - Dari <span className="text-red-600">*</span></label>
          <input
            type="date"
            value={filters.periodStart || ''}
            onChange={(e) => updateFilter('periodStart', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sampai <span className="text-red-600">*</span></label>
          <input
            type="date"
            value={filters.periodEnd || ''}
            onChange={(e) => updateFilter('periodEnd', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Tumor</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" value="bone_tumor" className="rounded" />
            <span>Bone Tumor</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" value="soft_tissue_tumor" className="rounded" />
            <span>Soft Tissue Tumor</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" value="metastatic_bone_disease" className="rounded" />
            <span>Metastatic Bone Disease</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Usia Min (tahun)</label>
          <input
            type="number"
            value={filters.ageMin || ''}
            onChange={(e) => updateFilter('ageMin', parseInt(e.target.value))}
            min="0"
            max="120"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Usia Max (tahun)</label>
          <input
            type="number"
            value={filters.ageMax || ''}
            onChange={(e) => updateFilter('ageMax', parseInt(e.target.value))}
            min="0"
            max="120"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <button
          onClick={handleEstimate}
          disabled={isEstimating}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isEstimating ? 'Menghitung...' : '🔍 Hitung Estimasi Pasien'}
        </button>
      </div>

      {estimatedCount !== null && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-sm text-green-600 mb-1">Estimasi Jumlah Pasien</div>
            <div className="text-4xl font-bold text-green-900">~{estimatedCount}</div>
            <div className="text-sm text-green-700 mt-1">pasien sesuai kriteria Anda</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Step 4: Timeline & Agreement
export function Step4EthicsTimeline({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Timeline & Submit</h2>
        <p className="text-gray-600">Tentukan timeline penelitian dan submit request Anda</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai Penelitian <span className="text-red-600">*</span></label>
          <input
            type="date"
            value={formData.researchStart || ''}
            onChange={(e) => updateFormData('researchStart', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai <span className="text-red-600">*</span></label>
          <input
            type="date"
            value={formData.researchEnd || ''}
            onChange={(e) => updateFormData('researchEnd', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Akses Data <span className="text-red-600">*</span></label>
        <select
          value={formData.accessDurationMonths || ''}
          onChange={(e) => updateFormData('accessDurationMonths', parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="">Pilih durasi</option>
          <option value="3">3 bulan</option>
          <option value="6">6 bulan (recommended)</option>
          <option value="12">12 bulan</option>
          <option value="24">24 bulan</option>
        </select>
      </div>

      <div className="border-t pt-4">
        <label className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <input
            type="checkbox"
            checked={formData.agreementSigned || false}
            onChange={(e) => {
              updateFormData('agreementSigned', e.target.checked);
              if (e.target.checked) {
                updateFormData('agreementDate', new Date().toISOString());
              }
            }}
            className="mt-1 h-5 w-5 text-blue-600 rounded"
            required
          />
          <div className="text-sm">
            <div className="font-semibold text-gray-900 mb-2">Data Protection Agreement <span className="text-red-600">*</span></div>
            <div className="text-gray-700 space-y-1">
              <p>✓ Data hanya akan digunakan untuk tujuan penelitian yang disebutkan</p>
              <p>✓ Data tidak akan dibagikan kepada pihak ketiga tanpa izin INAMSOS</p>
              <p>✓ Publikasi akan mencantumkan acknowledgment ke INAMSOS</p>
              <p>✓ Data akan dihapus setelah penelitian selesai</p>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

export default { Step1ResearchInfo, Step2DataCriteria, Step4EthicsTimeline };
