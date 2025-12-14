'use client';

import React, { useState, useEffect } from 'react';

interface PathologyReport {
  id: string;
  patientId: string;
  reportType: string;
  specimenType?: string;
  reportDate: string;
  pathologist?: string;
  diagnosis?: string;
  findings?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

interface PathologyReportsTabProps {
  patientId: string;
  patientName: string;
}

export function PathologyReportsTab({ patientId, patientName }: PathologyReportsTabProps) {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<PathologyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<PathologyReport | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, [patientId]);

  const loadReports = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const data = await pathologyService.getReportsByPatient(patientId);
      setReports([]);
    } catch (error) {
      console.error('Error loading pathology reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = typeFilter === 'all'
    ? reports
    : reports.filter(report => report.reportType === typeFilter);

  const getReportTypeBadge = (reportType: string) => {
    const colors: Record<string, string> = {
      BIOPSY: 'bg-blue-100 text-blue-800',
      FNAB: 'bg-green-100 text-green-800',
      CORE_BIOPSY: 'bg-purple-100 text-purple-800',
      SURGICAL_PATHOLOGY: 'bg-pink-100 text-pink-800',
      CYTOLOGY: 'bg-yellow-100 text-yellow-800',
      IHK: 'bg-red-100 text-red-800',
    };

    const color = colors[reportType] || 'bg-gray-100 text-gray-800';
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{reportType}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pathology reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pathology Reports</h3>
          <p className="text-sm text-gray-600">{reports.length} reports for {patientName}</p>
        </div>
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Report Types</option>
            <option value="BIOPSY">Biopsy</option>
            <option value="FNAB">FNAB</option>
            <option value="CORE_BIOPSY">Core Biopsy</option>
            <option value="SURGICAL_PATHOLOGY">Surgical Pathology</option>
            <option value="CYTOLOGY">Cytology</option>
            <option value="IHK">IHK (Immunohistochemistry)</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Biopsy</p>
          <p className="text-2xl font-bold text-blue-900">{reports.filter(r => r.reportType === 'BIOPSY').length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">FNAB</p>
          <p className="text-2xl font-bold text-green-900">{reports.filter(r => r.reportType === 'FNAB').length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">Core Biopsy</p>
          <p className="text-2xl font-bold text-purple-900">{reports.filter(r => r.reportType === 'CORE_BIOPSY').length}</p>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🔬</div>
          <p className="text-lg font-medium">No pathology reports yet</p>
          <p className="text-sm mt-2">
            {reports.length === 0
              ? 'Pathology reports will appear here when uploaded through the patient entry form'
              : 'Try adjusting the report type filter'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specimen Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Date
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
                  <td className="px-6 py-4 whitespace-nowrap">{getReportTypeBadge(report.reportType)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.specimenType || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(report.reportDate).toLocaleDateString('id-ID')}
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
                      <p className="text-xs text-gray-600">Report Date</p>
                      <p className="font-medium">{new Date(selectedReport.reportDate).toLocaleDateString('id-ID')}</p>
                    </div>
                    {selectedReport.pathologist && (
                      <div>
                        <p className="text-xs text-gray-600">Pathologist</p>
                        <p className="font-medium">{selectedReport.pathologist}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Patient Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Patient Name</p>
                      <p className="font-medium">{patientName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedReport.diagnosis && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Diagnosis</h3>
                  <p className="text-gray-900 bg-yellow-50 p-4 rounded-lg font-medium">{selectedReport.diagnosis}</p>
                </div>
              )}

              {selectedReport.findings && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Findings</h3>
                  <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{selectedReport.findings}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                {selectedReport.fileUrl && (
                  <button
                    onClick={() => window.open(selectedReport.fileUrl, '_blank')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Download Report
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
    </div>
  );
}
