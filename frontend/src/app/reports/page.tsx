'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  status: 'completed' | 'processing' | 'failed';
  size: string;
}

export default function ReportsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState({
    totalReports: 0,
    thisMonth: 0,
    pending: 0,
    templates: 0,
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [recentReports, setRecentReports] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(true);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'cancer-incidence',
      name: 'Laporan Insidensi Kanker',
      description: 'Statistik insidensi kanker per jenis, usia, dan wilayah',
      category: 'Epidemiologi',
      icon: 'chart',
    },
    {
      id: 'treatment-outcomes',
      name: 'Laporan Hasil Pengobatan',
      description: 'Analisis outcome pengobatan dan survival rate',
      category: 'Klinis',
      icon: 'medical',
    },
    {
      id: 'center-performance',
      name: 'Laporan Performa Pusat',
      description: 'Evaluasi kinerja pusat kanker dan registrar',
      category: 'Administrasi',
      icon: 'building',
    },
    {
      id: 'data-quality',
      name: 'Laporan Kualitas Data',
      description: 'Kelengkapan, akurasi, dan konsistensi data',
      category: 'Kualitas',
      icon: 'check',
    },
    {
      id: 'demographics',
      name: 'Laporan Demografis',
      description: 'Distribusi pasien berdasarkan demografi',
      category: 'Epidemiologi',
      icon: 'users',
    },
    {
      id: 'custom',
      name: 'Laporan Custom',
      description: 'Buat laporan sesuai kebutuhan spesifik',
      category: 'Custom',
      icon: 'settings',
    },
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchReportsData();
    }
  }, [isAuthenticated, isLoading]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setStats({
        totalReports: 148,
        thisMonth: 23,
        pending: 2,
        templates: reportTemplates.length,
      });

      setRecentReports([
        {
          id: '1',
          name: 'Insidensi Kanker Q4 2025',
          type: 'Epidemiologi',
          generatedAt: '2025-11-22 14:30',
          status: 'completed',
          size: '2.4 MB',
        },
        {
          id: '2',
          name: 'Kualitas Data November',
          type: 'Kualitas',
          generatedAt: '2025-11-21 09:15',
          status: 'completed',
          size: '1.8 MB',
        },
        {
          id: '3',
          name: 'Performa Pusat - Bulanan',
          type: 'Administrasi',
          generatedAt: '2025-11-20 16:45',
          status: 'processing',
          size: '-',
        },
        {
          id: '4',
          name: 'Hasil Pengobatan 2025',
          type: 'Klinis',
          generatedAt: '2025-11-19 11:20',
          status: 'completed',
          size: '3.1 MB',
        },
        {
          id: '5',
          name: 'Demografis Pasien',
          type: 'Epidemiologi',
          generatedAt: '2025-11-18 08:00',
          status: 'completed',
          size: '1.2 MB',
        },
      ]);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!selectedTemplate) {
      alert('Silakan pilih template laporan terlebih dahulu');
      return;
    }
    alert(`Generating report: ${selectedTemplate}\nFitur ini akan segera diimplementasikan.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'processing': return 'Proses';
      case 'failed': return 'Gagal';
      default: return status;
    }
  };

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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
        <p className="text-gray-600">Buat, kelola, dan ekspor laporan statistik kanker</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Laporan</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.thisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dalam Proses</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Template</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.templates}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generator */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generator Laporan</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reportTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedTemplate === template.id ? 'bg-green-200' : 'bg-gray-100'
                }`}>
                  <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                    {template.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedTemplate ? (
              <span>Template dipilih: <strong>{reportTemplates.find(t => t.id === selectedTemplate)?.name}</strong></span>
            ) : (
              <span>Pilih template laporan untuk memulai</span>
            )}
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={!selectedTemplate}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedTemplate
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Generate Laporan
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Laporan Terbaru</h2>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            Lihat Semua
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Laporan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ukuran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{report.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{report.generatedAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                      {getStatusText(report.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{report.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {report.status === 'completed' && (
                      <button className="text-green-600 hover:text-green-900 font-medium">
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
