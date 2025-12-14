'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface PathologyReport {
  id: string;
  patientId: string;
  patientName?: string;
  mrNumber?: string;
  reportType: string;
  specimenType?: string;
  biopsyDate: string;
  reportDate: string;
  diagnosis?: string;
  microscopicDescription?: string;
  grossDescription?: string;
  ihcMarkers?: string;
  fileUrl?: string;
  uploadDate: string;
  uploadedBy?: string;
}

export default function PathologyReportsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<PathologyReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<PathologyReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<PathologyReport | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadReports();
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    filterReports();
  }, [reports, searchQuery, reportTypeFilter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const data = await pathologyService.getAllReports();
      setReports([]);
    } catch (error) {
      console.error('Error loading pathology reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.mrNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.specimenType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (reportTypeFilter !== 'all') {
      filtered = filtered.filter((report) => report.reportType === reportTypeFilter);
    }

    filtered.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());

    setFilteredReports(filtered);
  };

  const getReportTypeBadge = (reportType: string) => {
    const colors: Record<string, string> = {
      'CORE-BIOPSY': 'bg-blue-100 text-blue-800',
      'FNAB': 'bg-green-100 text-green-800',
      'EXCISIONAL': 'bg-purple-100 text-purple-800',
      'INCISIONAL': 'bg-yellow-100 text-yellow-800',
      'IHC': 'bg-pink-100 text-pink-800',
      'CYTOLOGY': 'bg-orange-100 text-orange-800',
    };

    const color = colors[reportType] || 'bg-gray-100 text-gray-800';
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{reportType}</span>;
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pathology reports...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pathology Reports</h1>
            <p className="text-gray-600">Manage histopathology and cytology reports</p>
          </div>
          <button
            onClick={() => router.push('/patients/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <span className="mr-2">📤</span>
            Upload Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reports.length}</p>
            </div>
            <div className="text-4xl">🔬</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Core Biopsy</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {reports.filter((r) => r.reportType === 'CORE-BIOPSY').length}
              </p>
            </div>
            <div className="text-2xl">💉</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">FNAB</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {reports.filter((r) => r.reportType === 'FNAB').length}
              </p>
            </div>
            <div className="text-2xl">🧪</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">IHC</p>
              <p className="text-3xl font-bold text-pink-600 mt-2">
                {reports.filter((r) => r.reportType === 'IHC').length}
              </p>
            </div>
            <div className="text-2xl">🧬</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Patient name, MR number, diagnosis, or specimen type"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportTypeFilter}
              onChange={(e) => setReportTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="CORE-BIOPSY">Core Biopsy</option>
              <option value="FNAB">FNAB</option>
              <option value="EXCISIONAL">Excisional Biopsy</option>
              <option value="INCISIONAL">Incisional Biopsy</option>
              <option value="IHC">Immunohistochemistry</option>
              <option value="CYTOLOGY">Cytology</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pathology Reports ({filteredReports.length})</h2>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">🔬</div>
            <p className="text-lg font-medium">No pathology reports found</p>
            <p className="text-sm mt-2">
              {reports.length === 0
                ? 'Pathology reports will appear here when uploaded'
                : 'Try adjusting your search filters'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MR Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specimen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Biopsy Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diagnosis
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.patientName || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.mrNumber || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getReportTypeBadge(report.reportType)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.specimenType || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(report.biopsyDate).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{report.diagnosis || 'Pending'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Pathology Report Detail</h2>
                <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Patient Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Patient Name</p>
                      <p className="font-medium">{selectedReport.patientName || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">MR Number</p>
                      <p className="font-medium">{selectedReport.mrNumber || '-'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Report Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Report Type</p>
                      <div className="mt-1">{getReportTypeBadge(selectedReport.reportType)}</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Specimen Type</p>
                      <p className="font-medium">{selectedReport.specimenType || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Biopsy Date</p>
                      <p className="font-medium">{new Date(selectedReport.biopsyDate).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Report Date</p>
                      <p className="font-medium">{new Date(selectedReport.reportDate).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedReport.diagnosis && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Diagnosis</h3>
                  <p className="text-gray-900 font-medium">{selectedReport.diagnosis}</p>
                </div>
              )}

              {selectedReport.grossDescription && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Gross Description</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedReport.grossDescription}</p>
                </div>
              )}

              {selectedReport.microscopicDescription && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Microscopic Description</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedReport.microscopicDescription}</p>
                </div>
              )}

              {selectedReport.ihcMarkers && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">IHC Markers</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedReport.ihcMarkers}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                {selectedReport.fileUrl && (
                  <button
                    onClick={() => window.open(selectedReport.fileUrl, '_blank')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Download PDF
                  </button>
                )}
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
