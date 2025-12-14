'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import researchRequestsService from '@/services/research-requests.service';

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
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DataRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);

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
      const apiRequests = await researchRequestsService.findAll();

      // Map API response to DataRequest format
      const mappedRequests: DataRequest[] = apiRequests.map((req) => ({
        id: req.requestNumber || req.id,
        title: req.title,
        requestedDate: req.submittedAt ? new Date(req.submittedAt).toISOString().split('T')[0] : new Date(req.createdAt).toISOString().split('T')[0],
        status: mapStatus(req.status),
        dataType: 'Anonymized' as 'Aggregate' | 'Anonymized' | 'Identified',
        purpose: req.objectives || '',
        justification: req.researchAbstract || '',
        datasetDescription: Object.keys(req.requestedDataFields || {}).filter((k: string) => (req.requestedDataFields as any)[k]?.selected).join(', '),
        timeline: `${req.accessDurationMonths || 0} months`,
        reviewerNotes: req.adminNotes,
      }));

      setRequests(mappedRequests);
      setFilteredRequests(mappedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (apiStatus: string): 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed' => {
    const statusMap: Record<string, 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed'> = {
      'DRAFT': 'Draft',
      'SUBMITTED': 'Submitted',
      'PENDING_REVIEW': 'Under Review',
      'UNDER_REVIEW': 'Under Review',
      'NEED_MORE_INFO': 'Under Review',
      'APPROVED': 'Approved',
      'APPROVED_WITH_CONDITIONS': 'Approved',
      'REJECTED': 'Rejected',
      'DATA_READY': 'Approved',
      'ACTIVE': 'In Progress',
      'COMPLETED': 'Completed',
      'EXPIRED': 'Completed',
    };
    return statusMap[apiStatus] || 'Submitted';
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
    router.push('/research/requests/new');
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
                        <button
                          onClick={() => handleSubmitForReview(request.id)}
                          className="text-purple-600 hover:text-purple-900 font-medium"
                        >
                          Submit
                        </button>
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
