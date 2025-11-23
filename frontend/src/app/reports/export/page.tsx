'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface ExportHistory {
  id: string;
  fileName: string;
  format: string;
  exportedAt: string;
  exportedBy: string;
  fileSize: string;
  recordCount: number;
}

interface DataField {
  id: string;
  name: string;
  category: string;
}

export default function ReportsExportPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState('excel');
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-11-22');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [patientFilter, setPatientFilter] = useState({
    cancerType: 'all',
    ageRange: 'all',
    gender: 'all',
    province: 'all',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);

  const exportFormats = [
    { id: 'csv', name: 'CSV', icon: '📄', description: 'Comma-separated values' },
    { id: 'excel', name: 'Excel', icon: '📊', description: 'Microsoft Excel (.xlsx)' },
    { id: 'pdf', name: 'PDF', icon: '📕', description: 'Portable Document Format' },
    { id: 'json', name: 'JSON', icon: '📋', description: 'JavaScript Object Notation' },
    { id: 'spss', name: 'SPSS', icon: '📈', description: 'SPSS Statistics (.sav)' },
    { id: 'stata', name: 'Stata', icon: '📉', description: 'Stata Data (.dta)' },
  ];

  const dataFields: DataField[] = [
    { id: 'patient_id', name: 'ID Pasien', category: 'Identitas' },
    { id: 'patient_name', name: 'Nama Pasien', category: 'Identitas' },
    { id: 'birth_date', name: 'Tanggal Lahir', category: 'Identitas' },
    { id: 'gender', name: 'Jenis Kelamin', category: 'Identitas' },
    { id: 'address', name: 'Alamat', category: 'Identitas' },
    { id: 'province', name: 'Provinsi', category: 'Identitas' },
    { id: 'diagnosis_date', name: 'Tanggal Diagnosis', category: 'Diagnosis' },
    { id: 'cancer_type', name: 'Jenis Kanker', category: 'Diagnosis' },
    { id: 'cancer_stage', name: 'Stadium Kanker', category: 'Diagnosis' },
    { id: 'histology', name: 'Histologi', category: 'Diagnosis' },
    { id: 'topography', name: 'Topografi', category: 'Diagnosis' },
    { id: 'treatment_type', name: 'Jenis Pengobatan', category: 'Pengobatan' },
    { id: 'treatment_date', name: 'Tanggal Pengobatan', category: 'Pengobatan' },
    { id: 'chemotherapy', name: 'Kemoterapi', category: 'Pengobatan' },
    { id: 'radiotherapy', name: 'Radioterapi', category: 'Pengobatan' },
    { id: 'surgery', name: 'Pembedahan', category: 'Pengobatan' },
    { id: 'outcome', name: 'Outcome', category: 'Follow-up' },
    { id: 'survival_status', name: 'Status Hidup', category: 'Follow-up' },
    { id: 'last_contact', name: 'Kontak Terakhir', category: 'Follow-up' },
    { id: 'center_name', name: 'Nama Pusat', category: 'Administrasi' },
    { id: 'registrar', name: 'Registrar', category: 'Administrasi' },
  ];

  const previewData = [
    {
      patient_id: 'PT-2025-001',
      patient_name: 'Siti Aminah',
      gender: 'Perempuan',
      cancer_type: 'Kanker Payudara',
      diagnosis_date: '2025-03-15',
      cancer_stage: 'Stadium II',
      province: 'Jawa Barat',
    },
    {
      patient_id: 'PT-2025-002',
      patient_name: 'Budi Santoso',
      gender: 'Laki-laki',
      cancer_type: 'Kanker Paru',
      diagnosis_date: '2025-04-20',
      cancer_stage: 'Stadium III',
      province: 'DKI Jakarta',
    },
    {
      patient_id: 'PT-2025-003',
      patient_name: 'Rina Kartika',
      gender: 'Perempuan',
      cancer_type: 'Kanker Serviks',
      diagnosis_date: '2025-05-10',
      cancer_stage: 'Stadium I',
      province: 'Jawa Tengah',
    },
    {
      patient_id: 'PT-2025-004',
      patient_name: 'Ahmad Wijaya',
      gender: 'Laki-laki',
      cancer_type: 'Kanker Kolorektal',
      diagnosis_date: '2025-06-05',
      cancer_stage: 'Stadium II',
      province: 'Jawa Timur',
    },
    {
      patient_id: 'PT-2025-005',
      patient_name: 'Dewi Lestari',
      gender: 'Perempuan',
      cancer_type: 'Kanker Ovarium',
      diagnosis_date: '2025-07-12',
      cancer_stage: 'Stadium III',
      province: 'Bali',
    },
    {
      patient_id: 'PT-2025-006',
      patient_name: 'Hendra Gunawan',
      gender: 'Laki-laki',
      cancer_type: 'Kanker Hati',
      diagnosis_date: '2025-08-08',
      cancer_stage: 'Stadium IV',
      province: 'Sumatera Utara',
    },
    {
      patient_id: 'PT-2025-007',
      patient_name: 'Lina Marlina',
      gender: 'Perempuan',
      cancer_type: 'Kanker Payudara',
      diagnosis_date: '2025-09-14',
      cancer_stage: 'Stadium I',
      province: 'Sulawesi Selatan',
    },
    {
      patient_id: 'PT-2025-008',
      patient_name: 'Eko Prasetyo',
      gender: 'Laki-laki',
      cancer_type: 'Kanker Prostat',
      diagnosis_date: '2025-10-03',
      cancer_stage: 'Stadium II',
      province: 'Kalimantan Timur',
    },
    {
      patient_id: 'PT-2025-009',
      patient_name: 'Maya Sari',
      gender: 'Perempuan',
      cancer_type: 'Kanker Tiroid',
      diagnosis_date: '2025-10-18',
      cancer_stage: 'Stadium I',
      province: 'Jawa Barat',
    },
    {
      patient_id: 'PT-2025-010',
      patient_name: 'Tono Sucipto',
      gender: 'Laki-laki',
      cancer_type: 'Kanker Lambung',
      diagnosis_date: '2025-11-02',
      cancer_stage: 'Stadium III',
      province: 'DKI Jakarta',
    },
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchExportHistory();
      // Select all fields by default
      setSelectedFields(dataFields.map(f => f.id));
    }
  }, [isAuthenticated, isLoading]);

  const fetchExportHistory = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockHistory: ExportHistory[] = [
        {
          id: 'EXP-001',
          fileName: 'cancer_data_2025_full.xlsx',
          format: 'Excel',
          exportedAt: '2025-11-22 14:30',
          exportedBy: 'Dr. Siti Nurhaliza',
          fileSize: '8.4 MB',
          recordCount: 1247,
        },
        {
          id: 'EXP-002',
          fileName: 'breast_cancer_patients.csv',
          format: 'CSV',
          exportedAt: '2025-11-21 10:15',
          exportedBy: 'Dr. Budi Santoso',
          fileSize: '2.1 MB',
          recordCount: 342,
        },
        {
          id: 'EXP-003',
          fileName: 'quarterly_report_Q4.pdf',
          format: 'PDF',
          exportedAt: '2025-11-20 16:45',
          exportedBy: 'Admin RSCM',
          fileSize: '1.8 MB',
          recordCount: 856,
        },
        {
          id: 'EXP-004',
          fileName: 'research_dataset.sav',
          format: 'SPSS',
          exportedAt: '2025-11-19 09:00',
          exportedBy: 'Dr. Ahmad Wijaya',
          fileSize: '12.3 MB',
          recordCount: 2105,
        },
        {
          id: 'EXP-005',
          fileName: 'survival_analysis.dta',
          format: 'Stata',
          exportedAt: '2025-11-18 13:20',
          exportedBy: 'Dr. Rina Kartika',
          fileSize: '5.7 MB',
          recordCount: 987,
        },
      ];

      setExportHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching export history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSelectAllFields = () => {
    setSelectedFields(dataFields.map(f => f.id));
  };

  const handleDeselectAllFields = () => {
    setSelectedFields([]);
  };

  const handleSelectCategory = (category: string) => {
    const categoryFields = dataFields.filter(f => f.category === category).map(f => f.id);
    const allSelected = categoryFields.every(id => selectedFields.includes(id));

    if (allSelected) {
      setSelectedFields(prev => prev.filter(id => !categoryFields.includes(id)));
    } else {
      setSelectedFields(prev => [...new Set([...prev, ...categoryFields])]);
    }
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert('Silakan pilih minimal 1 field untuk diekspor');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          alert(`Data berhasil diekspor!\nFormat: ${exportFormats.find(f => f.id === exportFormat)?.name}\nJumlah records: ${previewData.length}\nFields: ${selectedFields.length}`);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const categories = [...new Set(dataFields.map(f => f.category))];

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
        <p className="text-gray-600">Export data kanker ke berbagai format untuk analisis dan pelaporan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Export Format */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Pilih Format Export</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setExportFormat(format.id)}
                  className={`p-4 border-2 rounded-lg transition-all text-left ${
                    exportFormat === format.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{format.icon}</div>
                  <div className="font-semibold text-gray-900">{format.name}</div>
                  <div className="text-xs text-gray-500">{format.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Pilih Rentang Waktu</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Patient Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Filter Pasien</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kanker
                </label>
                <select
                  value={patientFilter.cancerType}
                  onChange={(e) => setPatientFilter({ ...patientFilter, cancerType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Semua Jenis</option>
                  <option value="breast">Kanker Payudara</option>
                  <option value="cervical">Kanker Serviks</option>
                  <option value="lung">Kanker Paru</option>
                  <option value="colorectal">Kanker Kolorektal</option>
                  <option value="liver">Kanker Hati</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rentang Usia
                </label>
                <select
                  value={patientFilter.ageRange}
                  onChange={(e) => setPatientFilter({ ...patientFilter, ageRange: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Semua Usia</option>
                  <option value="0-17">0-17 tahun</option>
                  <option value="18-39">18-39 tahun</option>
                  <option value="40-59">40-59 tahun</option>
                  <option value="60+">60+ tahun</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  value={patientFilter.gender}
                  onChange={(e) => setPatientFilter({ ...patientFilter, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Semua</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provinsi
                </label>
                <select
                  value={patientFilter.province}
                  onChange={(e) => setPatientFilter({ ...patientFilter, province: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Semua Provinsi</option>
                  <option value="dki">DKI Jakarta</option>
                  <option value="jabar">Jawa Barat</option>
                  <option value="jateng">Jawa Tengah</option>
                  <option value="jatim">Jawa Timur</option>
                  <option value="bali">Bali</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Fields Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">4. Pilih Field Data</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleSelectAllFields}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Pilih Semua
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleDeselectAllFields}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Hapus Semua
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {categories.map((category) => {
                const categoryFields = dataFields.filter(f => f.category === category);
                const allSelected = categoryFields.every(f => selectedFields.includes(f.id));

                return (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <button
                        onClick={() => handleSelectCategory(category)}
                        className="flex items-center space-x-2 font-medium text-gray-900 hover:text-green-600"
                      >
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={() => {}}
                          className="h-4 w-4 text-green-600 rounded"
                        />
                        <span>{category}</span>
                      </button>
                      <span className="ml-2 text-xs text-gray-500">
                        ({categoryFields.filter(f => selectedFields.includes(f.id)).length}/{categoryFields.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-6">
                      {categoryFields.map((field) => (
                        <label key={field.id} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedFields.includes(field.id)}
                            onChange={() => handleFieldToggle(field.id)}
                            className="h-4 w-4 text-green-600 rounded"
                          />
                          <span className="text-gray-700">{field.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>{selectedFields.length}</strong> field dipilih dari <strong>{dataFields.length}</strong> field tersedia
              </p>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pratinjau Data (10 baris pertama)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {selectedFields.slice(0, 7).map((fieldId) => {
                        const field = dataFields.find(f => f.id === fieldId);
                        return (
                          <th key={fieldId} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            {field?.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {selectedFields.slice(0, 7).map((fieldId) => (
                          <td key={fieldId} className="px-3 py-2 whitespace-nowrap text-gray-900">
                            {row[fieldId as keyof typeof row] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedFields.length > 7 && (
                <p className="text-xs text-gray-500 mt-2">
                  Menampilkan 7 dari {selectedFields.length} field. Export penuh akan berisi semua field.
                </p>
              )}
            </div>
          )}

          {/* Export Button */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {showPreview ? 'Sembunyikan' : 'Tampilkan'} Pratinjau
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || selectedFields.length === 0}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  isExporting || selectedFields.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isExporting ? 'Mengekspor...' : 'Export Data'}
              </button>
            </div>

            {/* Progress Bar */}
            {isExporting && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {exportProgress}% - Sedang mengekspor data...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Export Summary & History */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Export</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium text-gray-900">
                  {exportFormats.find(f => f.id === exportFormat)?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rentang Tanggal:</span>
                <span className="font-medium text-gray-900 text-right">
                  {dateFrom} s/d {dateTo}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Field Dipilih:</span>
                <span className="font-medium text-gray-900">
                  {selectedFields.length} / {dataFields.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Est. Records:</span>
                <span className="font-medium text-gray-900">~1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Est. File Size:</span>
                <span className="font-medium text-gray-900">~8.4 MB</span>
              </div>
            </div>
          </div>

          {/* Export History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Export</h2>
            <div className="space-y-3">
              {exportHistory.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.fileName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.format} - {item.recordCount.toLocaleString()} records
                      </p>
                      <p className="text-xs text-gray-500">{item.exportedAt}</p>
                    </div>
                    <button
                      onClick={() => alert(`Download: ${item.fileName}\nSize: ${item.fileSize}`)}
                      className="text-green-600 hover:text-green-700"
                      title="Download"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
