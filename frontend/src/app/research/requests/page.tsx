'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface DataRequest {
  id: string;
  title: string;
  requestedDate: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed';
  dataType: 'Aggregate' | 'Anonymized' | 'Identified';
  purpose: string;
  justification: string;
  datasetDescription: string;
  timeline: string;
  reviewerNotes?: string;
}

export default function ResearchRequestsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DataRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    dataType: 'Aggregate' as 'Aggregate' | 'Anonymized' | 'Identified',
    justification: '',
    datasetDescription: '',
    timeline: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (statusFilter) {
      setFilteredRequests(requests.filter(r => r.status === statusFilter));
    } else {
      setFilteredRequests(requests);
    }
  }, [statusFilter, requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockRequests: DataRequest[] = [
        {
          id: 'REQ-2025-001',
          title: 'Analisis Survival Rate Kanker Payudara Stadium II-III',
          requestedDate: '2025-11-01',
          status: 'Approved',
          dataType: 'Anonymized',
          purpose: 'Penelitian untuk tesis magister tentang faktor prognostik kanker payudara',
          justification: 'Data diperlukan untuk menganalisis faktor-faktor yang mempengaruhi survival rate pada pasien kanker payudara stadium II-III di Indonesia',
          datasetDescription: 'Data pasien kanker payudara stadium II-III, termasuk karakteristik demografi, riwayat pengobatan, dan outcome klinis',
          timeline: '6 bulan (November 2025 - April 2026)',
          reviewerNotes: 'Disetujui dengan syarat data dianonimkan dan hasil penelitian dibagikan ke INAMSOS',
        },
        {
          id: 'REQ-2025-002',
          title: 'Studi Epidemiologi Kanker Paru di Indonesia',
          requestedDate: '2025-11-10',
          status: 'Under Review',
          dataType: 'Aggregate',
          purpose: 'Publikasi jurnal internasional tentang tren kanker paru',
          justification: 'Membutuhkan data agregat untuk mengidentifikasi pola epidemiologis dan faktor risiko kanker paru di populasi Indonesia',
          datasetDescription: 'Data agregat kasus kanker paru 2020-2025, termasuk distribusi geografis, tipe histologi, dan stadium saat diagnosis',
          timeline: '3 bulan (November 2025 - Januari 2026)',
        },
        {
          id: 'REQ-2025-003',
          title: 'Efektivitas Kemoterapi pada Kanker Kolorektal',
          requestedDate: '2025-11-15',
          status: 'In Progress',
          dataType: 'Anonymized',
          purpose: 'Penelitian kolaborasi multi-center tentang protokol kemoterapi',
          justification: 'Evaluasi efektivitas berbagai protokol kemoterapi untuk meningkatkan standar terapi kanker kolorektal',
          datasetDescription: 'Data pasien kanker kolorektal dengan riwayat kemoterapi lengkap, termasuk regimen, dosis, efek samping, dan respons terapi',
          timeline: '12 bulan (November 2025 - Oktober 2026)',
        },
        {
          id: 'REQ-2025-004',
          title: 'Faktor Risiko Kanker Serviks pada Wanita Usia Muda',
          requestedDate: '2025-11-18',
          status: 'Submitted',
          dataType: 'Anonymized',
          purpose: 'Disertasi doktoral tentang faktor risiko kanker serviks',
          justification: 'Mengidentifikasi faktor risiko spesifik pada wanita usia <35 tahun untuk program pencegahan yang lebih targeted',
          datasetDescription: 'Data pasien kanker serviks usia <35 tahun, termasuk faktor risiko, riwayat screening, dan karakteristik tumor',
          timeline: '8 bulan (Desember 2025 - Juli 2026)',
        },
        {
          id: 'REQ-2025-005',
          title: 'Analisis Biaya Pengobatan Kanker di Indonesia',
          requestedDate: '2025-11-20',
          status: 'Draft',
          dataType: 'Aggregate',
          purpose: 'Policy brief untuk Kementerian Kesehatan',
          justification: 'Menyediakan evidence base untuk policy making terkait pembiayaan pengobatan kanker',
          datasetDescription: 'Data agregat biaya pengobatan berbagai jenis kanker, termasuk biaya diagnostik, terapi, dan follow-up',
          timeline: '4 bulan (Desember 2025 - Maret 2026)',
        },
        {
          id: 'REQ-2025-006',
          title: 'Genetic Markers pada Kanker Hati',
          requestedDate: '2025-10-05',
          status: 'Completed',
          dataType: 'Identified',
          purpose: 'Penelitian genomik kanker hati',
          justification: 'Identifikasi genetic markers untuk personalized medicine',
          datasetDescription: 'Data klinis dan hasil pemeriksaan genomik pasien kanker hati',
          timeline: '18 bulan (Mei 2024 - Oktober 2025)',
          reviewerNotes: 'Penelitian selesai, hasil telah dipublikasikan di jurnal internasional',
        },
        {
          id: 'REQ-2025-007',
          title: 'Pengaruh Status Gizi terhadap Outcome Terapi Kanker',
          requestedDate: '2025-10-28',
          status: 'Rejected',
          dataType: 'Identified',
          purpose: 'Penelitian individu',
          justification: 'Evaluasi pengaruh status gizi pre-treatment terhadap outcome terapi',
          datasetDescription: 'Data identitas dan status gizi pasien',
          timeline: '6 bulan',
          reviewerNotes: 'Ditolak karena justifikasi penggunaan data identified kurang kuat. Disarankan menggunakan data anonymized',
        },
      ];

      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDataTypeColor = (dataType: string) => {
    switch (dataType) {
      case 'Aggregate': return 'bg-blue-50 text-blue-700';
      case 'Anonymized': return 'bg-green-50 text-green-700';
      case 'Identified': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const handleNewRequest = () => {
    setFormData({
      title: '',
      purpose: '',
      dataType: 'Aggregate',
      justification: '',
      datasetDescription: '',
      timeline: '',
    });
    setIsEditing(false);
    setShowNewRequestModal(true);
  };

  const handleEditRequest = (request: DataRequest) => {
    if (request.status !== 'Draft') {
      alert('Hanya permintaan dengan status Draft yang dapat diedit');
      return;
    }
    setFormData({
      title: request.title,
      purpose: request.purpose,
      dataType: request.dataType,
      justification: request.justification,
      datasetDescription: request.datasetDescription,
      timeline: request.timeline,
    });
    setSelectedRequest(request);
    setIsEditing(true);
    setShowNewRequestModal(true);
  };

  const handleSubmitRequest = () => {
    // Validation
    if (!formData.title || !formData.purpose || !formData.justification ||
        !formData.datasetDescription || !formData.timeline) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    if (isEditing && selectedRequest) {
      // Update existing request
      setRequests(prev => prev.map(r =>
        r.id === selectedRequest.id
          ? { ...r, ...formData, status: 'Draft' as const }
          : r
      ));
      alert('Permintaan berhasil diperbarui');
    } else {
      // Create new request
      const newRequest: DataRequest = {
        id: `REQ-2025-${String(requests.length + 1).padStart(3, '0')}`,
        ...formData,
        requestedDate: new Date().toISOString().split('T')[0],
        status: 'Draft',
      };
      setRequests(prev => [newRequest, ...prev]);
      alert('Permintaan baru berhasil dibuat sebagai Draft');
    }

    setShowNewRequestModal(false);
    setSelectedRequest(null);
  };

  const handleViewDetails = (request: DataRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleSubmitForReview = (requestId: string) => {
    setRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, status: 'Submitted' as const } : r
    ));
    alert('Permintaan berhasil diajukan untuk review');
  };

  const handleCancelRequest = (requestId: string) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan permintaan ini?')) return;
    setRequests(prev => prev.filter(r => r.id !== requestId));
    alert('Permintaan dibatalkan');
  };

  const handleDownloadData = (requestId: string) => {
    alert(`Mengunduh data untuk permintaan ${requestId}...\nFitur download akan segera diimplementasikan.`);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Permintaan Data Penelitian</h1>
            <p className="text-gray-600">Kelola permintaan akses data untuk penelitian</p>
          </div>
          <button
            onClick={handleNewRequest}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            + Permintaan Baru
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Permintaan</p>
              <p className="text-2xl font-semibold text-gray-900">{requests.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Dalam Review</p>
              <p className="text-2xl font-semibold text-gray-900">
                {requests.filter(r => r.status === 'Under Review' || r.status === 'Submitted').length}
              </p>
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
              <p className="text-sm font-medium text-gray-600">Disetujui</p>
              <p className="text-2xl font-semibold text-gray-900">
                {requests.filter(r => r.status === 'Approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-teal-100 rounded-lg">
              <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Selesai</p>
              <p className="text-2xl font-semibold text-gray-900">
                {requests.filter(r => r.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Semua Status</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {statusFilter && (
            <button
              onClick={() => setStatusFilter('')}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Permintaan Saya ({filteredRequests.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tujuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{request.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.requestedDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getDataTypeColor(request.dataType)}`}>
                      {request.dataType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">{request.purpose}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Detail
                      </button>
                      {request.status === 'Draft' && (
                        <>
                          <button
                            onClick={() => handleEditRequest(request)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleSubmitForReview(request.id)}
                            className="text-purple-600 hover:text-purple-900 font-medium"
                          >
                            Submit
                          </button>
                        </>
                      )}
                      {(request.status === 'Draft' || request.status === 'Submitted') && (
                        <button
                          onClick={() => handleCancelRequest(request.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Batal
                        </button>
                      )}
                      {(request.status === 'Approved' || request.status === 'Completed') && (
                        <button
                          onClick={() => handleDownloadData(request.id)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Download
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-gray-500">Tidak ada permintaan yang sesuai dengan filter</p>
          </div>
        )}
      </div>

      {/* New/Edit Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? 'Edit Permintaan' : 'Permintaan Data Baru'}
                </h2>
                <button
                  onClick={() => setShowNewRequestModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Penelitian *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Masukkan judul penelitian"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tujuan Penelitian *
                  </label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Jelaskan tujuan penelitian"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Data *
                  </label>
                  <select
                    value={formData.dataType}
                    onChange={(e) => setFormData({ ...formData, dataType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Aggregate">Aggregate - Data statistik agregat</option>
                    <option value="Anonymized">Anonymized - Data individual tanpa identitas</option>
                    <option value="Identified">Identified - Data dengan identitas (perlu justifikasi kuat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justifikasi *
                  </label>
                  <textarea
                    value={formData.justification}
                    onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Jelaskan mengapa data ini diperlukan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Dataset *
                  </label>
                  <textarea
                    value={formData.datasetDescription}
                    onChange={(e) => setFormData({ ...formData, datasetDescription: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Jelaskan data apa saja yang dibutuhkan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline *
                  </label>
                  <input
                    type="text"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contoh: 6 bulan (November 2025 - April 2026)"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewRequestModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitRequest}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Buat Permintaan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Detail Permintaan</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Request ID</label>
                  <p className="mt-1 text-gray-900 font-medium">{selectedRequest.id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Judul</label>
                  <p className="mt-1 text-gray-900">{selectedRequest.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tanggal Permintaan</label>
                    <p className="mt-1 text-gray-900">{selectedRequest.requestedDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Tipe Data</label>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${getDataTypeColor(selectedRequest.dataType)}`}>
                    {selectedRequest.dataType}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Tujuan Penelitian</label>
                  <p className="mt-1 text-gray-900">{selectedRequest.purpose}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Justifikasi</label>
                  <p className="mt-1 text-gray-900">{selectedRequest.justification}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Deskripsi Dataset</label>
                  <p className="mt-1 text-gray-900">{selectedRequest.datasetDescription}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Timeline</label>
                  <p className="mt-1 text-gray-900">{selectedRequest.timeline}</p>
                </div>

                {selectedRequest.reviewerNotes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-blue-900">Catatan Reviewer</label>
                    <p className="mt-1 text-blue-800">{selectedRequest.reviewerNotes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
