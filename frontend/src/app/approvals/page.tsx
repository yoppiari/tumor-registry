'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ResearchRequestReviewModal } from '@/components/approvals/ResearchRequestReviewModal';
import researchRequestsService, { ResearchRequest } from '@/services/research-requests.service';

export default function ApprovalsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    review: 0,
  });
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ResearchRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ResearchRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchApprovalsData();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredRequests(requests);
    } else {
      // Map filter status to ResearchRequest statuses
      let statusesToMatch: string[] = [];
      if (filterStatus === 'pending') {
        statusesToMatch = ['SUBMITTED', 'PENDING_REVIEW'];
      } else if (filterStatus === 'review') {
        statusesToMatch = ['UNDER_REVIEW', 'NEED_MORE_INFO'];
      } else if (filterStatus === 'approved') {
        statusesToMatch = ['APPROVED', 'APPROVED_WITH_CONDITIONS'];
      } else if (filterStatus === 'rejected') {
        statusesToMatch = ['REJECTED'];
      }

      setFilteredRequests(requests.filter(r => statusesToMatch.includes(r.status)));
    }
  }, [filterStatus, requests]);

  const fetchApprovalsData = async () => {
    try {
      setLoading(true);
      // Fetch pending research requests (SUBMITTED, PENDING_REVIEW, UNDER_REVIEW)
      const pendingRequests = await researchRequestsService.getPending();

      setRequests(pendingRequests);
      setFilteredRequests(pendingRequests);

      // Calculate stats based on status
      const statusCounts = {
        pending: 0,
        approved: 0,
        rejected: 0,
        review: 0,
      };

      pendingRequests.forEach((r) => {
        if (r.status === 'SUBMITTED' || r.status === 'PENDING_REVIEW') {
          statusCounts.pending++;
        } else if (r.status === 'UNDER_REVIEW' || r.status === 'NEED_MORE_INFO') {
          statusCounts.review++;
        } else if (r.status === 'APPROVED' || r.status === 'APPROVED_WITH_CONDITIONS') {
          statusCounts.approved++;
        } else if (r.status === 'REJECTED') {
          statusCounts.rejected++;
        }
      });

      setStats(statusCounts);
    } catch (error) {
      console.error('Error fetching approvals data:', error);
      alert('Gagal memuat data approvals. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowDetailModal(true);
    }
  };

  const handleDecisionMade = () => {
    // Refresh data after decision is made
    fetchApprovalsData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'text-gray-600 bg-gray-100';
      case 'SUBMITTED':
      case 'PENDING_REVIEW': return 'text-yellow-600 bg-yellow-100';
      case 'UNDER_REVIEW':
      case 'NEED_MORE_INFO': return 'text-blue-600 bg-blue-100';
      case 'APPROVED':
      case 'APPROVED_WITH_CONDITIONS': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'DATA_READY':
      case 'ACTIVE': return 'text-purple-600 bg-purple-100';
      case 'COMPLETED':
      case 'EXPIRED': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Draft';
      case 'SUBMITTED': return 'Submitted';
      case 'PENDING_REVIEW': return 'Menunggu Review';
      case 'UNDER_REVIEW': return 'Dalam Review';
      case 'NEED_MORE_INFO': return 'Perlu Info';
      case 'APPROVED': return 'Disetujui';
      case 'APPROVED_WITH_CONDITIONS': return 'Disetujui (Bersyarat)';
      case 'REJECTED': return 'Ditolak';
      case 'DATA_READY': return 'Data Siap';
      case 'ACTIVE': return 'Aktif';
      case 'COMPLETED': return 'Selesai';
      case 'EXPIRED': return 'Expired';
      default: return status;
    }
  };

  const getSensitivityColor = (score: number) => {
    if (score <= 25) return 'text-green-600 bg-green-100';
    if (score <= 50) return 'text-yellow-600 bg-yellow-100';
    if (score <= 75) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getSensitivityLabel = (score: number) => {
    if (score <= 25) return 'LOW';
    if (score <= 50) return 'MEDIUM';
    if (score <= 75) return 'HIGH';
    return 'VERY HIGH';
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
        <h1 className="text-2xl font-bold text-gray-900">Persetujuan Akses Data</h1>
        <p className="text-gray-600">Kelola permintaan akses data penelitian</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Menunggu</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dalam Review</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.review}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ditolak</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter Status:</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua ({requests.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Menunggu ({stats.pending})
            </button>
            <button
              onClick={() => setFilterStatus('review')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'review'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Review ({stats.review})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Disetujui ({stats.approved})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ditolak ({stats.rejected})
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID / Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peneliti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Submit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sensitivity
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
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-xs font-mono text-gray-500">{request.requestNumber || 'DRAFT'}</div>
                    <div className="text-sm font-medium text-gray-900">{request.title}</div>
                    <div className="text-xs text-gray-500">{request.researchType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.user?.name || '-'}</div>
                    <div className="text-xs text-gray-500">{request.user?.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.researcherInstitution || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {request.submittedAt ? new Date(request.submittedAt).toLocaleDateString('id-ID') : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSensitivityColor(request.dataSensitivityScore || 0)}`}>
                      {getSensitivityLabel(request.dataSensitivityScore || 0)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{request.dataSensitivityScore || 0}/100</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                    {request.isAutoApprovalEligible && (
                      <div className="text-xs text-blue-600 mt-1">✓ Auto-eligible</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleReview(request.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-4 text-gray-500">Tidak ada permintaan dengan status ini</p>
          </div>
        )}
      </div>

      {/* Research Request Review Modal */}
      {showDetailModal && selectedRequest && (
        <ResearchRequestReviewModal
          request={selectedRequest}
          onClose={() => setShowDetailModal(false)}
          onDecisionMade={handleDecisionMade}
        />
      )}
    </Layout>
  );
}
