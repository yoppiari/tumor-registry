'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface ReportHistory {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  generatedBy: string;
  fileSize: string;
  status: 'completed' | 'processing' | 'failed' | 'expired';
  downloadUrl?: string;
}

export default function ReportsHistoryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [reports, setReports] = useState<ReportHistory[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, filterType, filterStatus, dateFrom, dateTo]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockReports: ReportHistory[] = [
        {
          id: 'RPT-2025-001',
          name: 'Laporan Insidensi Kanker Q4 2025',
          type: 'Epidemiologi',
          generatedAt: '2025-11-22 14:30',
          generatedBy: 'Dr. Siti Nurhaliza',
          fileSize: '2.4 MB',
          status: 'completed',
          downloadUrl: '#',
        },
        {
          id: 'RPT-2025-002',
          name: 'Kualitas Data November 2025',
          type: 'Kualitas',
          generatedAt: '2025-11-21 09:15',
          generatedBy: 'Dr. Budi Santoso',
          fileSize: '1.8 MB',
          status: 'completed',
          downloadUrl: '#',
        },
        {
          id: 'RPT-2025-003',
          name: 'Performa Pusat - Bulanan',
          type: 'Administrasi',
          generatedAt: '2025-11-20 16:45',
          generatedBy: 'Admin RSCM',
          fileSize: '-',
          status: 'processing',
        },
        {
          id: 'RPT-2025-004',
          name: 'Hasil Pengobatan 2025',
          type: 'Klinis',
          generatedAt: '2025-11-19 11:20',
          generatedBy: 'Dr. Ahmad Wijaya',
          fileSize: '3.1 MB',
          status: 'completed',
          downloadUrl: '#',
        },
        {
          id: 'RPT-2025-005',
          name: 'Demografis Pasien Jawa Barat',
          type: 'Epidemiologi',
          generatedAt: '2025-11-18 08:00',
          generatedBy: 'Dr. Rina Kartika',
          fileSize: '1.2 MB',
          status: 'completed',
          downloadUrl: '#',
        },
        {
          id: 'RPT-2025-006',
          name: 'Analisis Survival Rate 2020-2025',
          type: 'Klinis',
          generatedAt: '2025-11-17 15:30',
          generatedBy: 'Dr. Hendra Gunawan',
          fileSize: '4.2 MB',
          status: 'completed',
          downloadUrl: '#',
        },
        {
          id: 'RPT-2025-007',
          name: 'Laporan Tahunan 2024',
          type: 'Administrasi',
          generatedAt: '2025-11-16 10:00',
          generatedBy: 'Admin Dharmais',
          fileSize: '8.5 MB',
          status: 'completed',
          downloadUrl: '#',
        },
        {
          id: 'RPT-2025-008',
          name: 'Pola Pengobatan Kanker Payudara',
          type: 'Klinis',
          generatedAt: '2025-11-15 13:45',
          generatedBy: 'Dr. Dewi Lestari',
          fileSize: '-',
          status: 'failed',
        },
        {
          id: 'RPT-2025-009',
          name: 'Distribusi Geografis Kasus Oktober',
          type: 'Epidemiologi',
          generatedAt: '2025-11-14 09:30',
          generatedBy: 'Dr. Eko Prasetyo',
          fileSize: '2.1 MB',
          status: 'completed',
          downloadUrl: '#',
        },
        {
          id: 'RPT-2025-010',
          name: 'Evaluasi Screening Program 2025',
          type: 'Kualitas',
          generatedAt: '2025-11-13 14:15',
          generatedBy: 'Dr. Lina Marlina',
          fileSize: '1.5 MB',
          status: 'completed',
          downloadUrl: '#',
        },
        {
          id: 'RPT-2025-011',
          name: 'Laporan Kanker Serviks Nasional',
          type: 'Epidemiologi',
          generatedAt: '2025-10-28 11:00',
          generatedBy: 'Dr. Siti Nurhaliza',
          fileSize: '3.8 MB',
          status: 'expired',
        },
        {
          id: 'RPT-2025-012',
          name: 'Statistik Kemoterapi Q3 2025',
          type: 'Klinis',
          generatedAt: '2025-10-15 16:20',
          generatedBy: 'Dr. Ahmad Wijaya',
          fileSize: '2.7 MB',
          status: 'completed',
          downloadUrl: '#',
        },
        {
          id: 'RPT-2025-013',
          name: 'Audit Kelengkapan Data September',
          type: 'Kualitas',
          generatedAt: '2025-10-01 08:45',
          generatedBy: 'Admin RSCM',
          fileSize: '1.1 MB',
          status: 'completed',
          downloadUrl: '#',
        },
        {
          id: 'RPT-2025-014',
          name: 'Perbandingan Treatment Outcomes',
          type: 'Klinis',
          generatedAt: '2025-09-20 13:30',
          generatedBy: 'Dr. Budi Santoso',
          fileSize: '5.2 MB',
          status: 'completed',
          downloadUrl: '#',
        },
        {
          id: 'RPT-2025-015',
          name: 'Laporan Insiden Kanker Anak 2025',
          type: 'Epidemiologi',
          generatedAt: '2025-09-10 10:15',
          generatedBy: 'Dr. Rina Kartika',
          fileSize: '2.9 MB',
          status: 'expired',
        },
      ];

      setReports(mockReports);
      setFilteredReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(report => report.type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(report => report.status === filterStatus);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.generatedAt);
        return reportDate >= new Date(dateFrom);
      });
    }
    if (dateTo) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.generatedAt);
        return reportDate <= new Date(dateTo + ' 23:59:59');
      });
    }

    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100 border-green-200';
      case 'processing': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'failed': return 'text-red-700 bg-red-100 border-red-200';
      case 'expired': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'processing': return 'Diproses';
      case 'failed': return 'Gagal';
      case 'expired': return 'Kadaluarsa';
      default: return status;
    }
  };

  const handleDownload = (report: ReportHistory) => {
    alert(`Mengunduh: ${report.name}\nUkuran: ${report.fileSize}`);
  };

  const handleView = (report: ReportHistory) => {
    alert(`Menampilkan pratinjau: ${report.name}`);
  };

  const handleRetry = (report: ReportHistory) => {
    alert(`Mencoba ulang generate laporan: ${report.name}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
    setDateFrom('');
    setDateTo('');
  };

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

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
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Laporan</h1>
        <p className="text-gray-600">Lihat dan kelola riwayat laporan yang telah dibuat</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Pencarian</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Laporan
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nama laporan atau ID..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Laporan
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Semua Tipe</option>
              <option value="Epidemiologi">Epidemiologi</option>
              <option value="Klinis">Klinis</option>
              <option value="Administrasi">Administrasi</option>
              <option value="Kualitas">Kualitas</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="completed">Selesai</option>
              <option value="processing">Diproses</option>
              <option value="failed">Gagal</option>
              <option value="expired">Kadaluarsa</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

      {/* Results Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-green-800">
          Menampilkan <strong>{currentReports.length}</strong> dari <strong>{filteredReports.length}</strong> laporan
          {(searchTerm || filterType !== 'all' || filterStatus !== 'all' || dateFrom || dateTo) && ' (terfilter)'}
        </p>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Nama Laporan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat Oleh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ukuran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-2">Tidak ada laporan ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        <div className="text-xs text-gray-500">{report.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.generatedAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.generatedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.fileSize}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {report.status === 'completed' && (
                          <>
                            <button
                              onClick={() => handleView(report)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                              title="Lihat"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDownload(report)}
                              className="text-green-600 hover:text-green-900 font-medium"
                              title="Download"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </>
                        )}
                        {report.status === 'processing' && (
                          <span className="text-yellow-600 text-xs">Sedang diproses...</span>
                        )}
                        {report.status === 'failed' && (
                          <button
                            onClick={() => handleRetry(report)}
                            className="text-red-600 hover:text-red-900 font-medium text-xs"
                          >
                            Coba Lagi
                          </button>
                        )}
                        {report.status === 'expired' && (
                          <span className="text-gray-500 text-xs">Tidak tersedia</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
