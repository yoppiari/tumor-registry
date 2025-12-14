'use client';

import { useState } from 'react';
import researchRequestsService, { ResearchRequest, DataFieldsSelection } from '@/services/research-requests.service';

interface Props {
  request: ResearchRequest;
  onClose: () => void;
  onDecisionMade: () => void;
}

const DATA_CATEGORIES = [
  { key: 'demographics', label: 'Demographics (Basic)', score: 10 },
  { key: 'demographicsIdentifiable', label: 'Demographics Identifiable ⚠️', score: 40 },
  { key: 'clinicalPresentation', label: 'Clinical Presentation', score: 5 },
  { key: 'diagnosisClassification', label: 'Diagnosis & Classification', score: 5 },
  { key: 'stagingData', label: 'Staging Data', score: 5 },
  { key: 'diagnosticInvestigations', label: 'Diagnostic Investigations', score: 10 },
  { key: 'treatmentManagement', label: 'Treatment Management', score: 10 },
  { key: 'followUpOutcomes', label: 'Follow-up & Outcomes', score: 10 },
  { key: 'clinicalPhotosImaging', label: 'Clinical Photos/Imaging ⚠️', score: 35 },
];

export function ResearchRequestReviewModal({ request, onClose, onDecisionMade }: Props) {
  const [decision, setDecision] = useState<'APPROVE' | 'APPROVE_WITH_CONDITIONS' | 'REJECT' | 'REQUEST_MORE_INFO' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [conditions, setConditions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingExport, setIsGeneratingExport] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'data-fields' | 'filters' | 'ethics'>('overview');

  const getSensitivityColor = (score: number) => {
    if (score <= 25) return 'bg-green-100 text-green-800';
    if (score <= 50) return 'bg-yellow-100 text-yellow-800';
    if (score <= 75) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getSensitivityLabel = (score: number) => {
    if (score <= 25) return 'LOW';
    if (score <= 50) return 'MEDIUM';
    if (score <= 75) return 'HIGH';
    return 'VERY HIGH';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'PENDING_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW': return 'bg-orange-100 text-orange-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitDecision = async () => {
    if (!decision) {
      alert('Silakan pilih keputusan terlebih dahulu');
      return;
    }

    if (!adminNotes.trim()) {
      alert('Silakan tambahkan catatan admin');
      return;
    }

    if (decision === 'APPROVE_WITH_CONDITIONS' && !conditions.trim()) {
      alert('Silakan tambahkan kondisi yang harus dipenuhi');
      return;
    }

    setIsSubmitting(true);
    try {
      await researchRequestsService.approveOrReject(request.id, {
        decision,
        adminNotes,
        conditions: decision === 'APPROVE_WITH_CONDITIONS' ? conditions : undefined,
      });

      alert('✅ Keputusan berhasil disimpan!');
      onDecisionMade();
      onClose();
    } catch (error: any) {
      console.error('Error submitting decision:', error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan keputusan';
      alert(`❌ Gagal menyimpan keputusan: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateExport = async () => {
    if (!confirm('Generate data export for this approved request?')) {
      return;
    }

    setIsGeneratingExport(true);
    try {
      const result = await researchRequestsService.generateExport(request.id);
      alert(`✅ Export generated successfully!\n${result.exportedCount || 0} patients exported`);
      onDecisionMade();
      onClose();
    } catch (error: any) {
      console.error('Error generating export:', error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat generate export';
      alert(`❌ Gagal generate export: ${errorMessage}`);
    } finally {
      setIsGeneratingExport(false);
    }
  };

  const requestedFields = request.requestedDataFields as DataFieldsSelection;
  const dataFilters = request.dataFilters as any;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Research Request</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-gray-600">{request.requestNumber || 'DRAFT'}</span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
                {request.isAutoApprovalEligible && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    ✓ Auto-Approval Eligible
                  </span>
                )}
                {(request.status === 'APPROVED' || request.status === 'APPROVED_WITH_CONDITIONS') && !request.dataExportUrl && (
                  <button
                    onClick={handleGenerateExport}
                    disabled={isGeneratingExport}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isGeneratingExport ? 'Generating...' : '🔄 Generate Export'}
                  </button>
                )}
                {request.dataExportUrl && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    ✓ Export Ready
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('data-fields')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'data-fields'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Data Fields Requested
            </button>
            <button
              onClick={() => setActiveTab('filters')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'filters'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Data Criteria & Filters
            </button>
            <button
              onClick={() => setActiveTab('ethics')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'ethics'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ethics & Timeline
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Sensitivity Score */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Data Sensitivity Assessment</h4>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{request.dataSensitivityScore || 0}</div>
                    <div className="text-sm text-gray-600">/ 100</div>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getSensitivityColor(request.dataSensitivityScore || 0)}`}
                        style={{ width: `${request.dataSensitivityScore || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getSensitivityColor(request.dataSensitivityScore || 0)}`}>
                        {getSensitivityLabel(request.dataSensitivityScore || 0)} SENSITIVITY
                      </span>
                      {request.estimatedPatientCount !== null && (
                        <span className="text-sm text-gray-600">
                          ~{request.estimatedPatientCount} patients estimated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Research Title</label>
                  <p className="text-gray-900 font-medium">{request.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Research Type</label>
                  <p className="text-gray-900">{request.researchType}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Research Abstract</label>
                <p className="text-gray-900">{request.researchAbstract || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Research Objectives</label>
                <p className="text-gray-900">{request.objectives || '-'}</p>
              </div>

              {/* Researcher Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-3">Researcher Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">Name</label>
                    <p className="text-sm text-blue-900">{request.user?.name || request.userId}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">Email</label>
                    <p className="text-sm text-blue-900">{request.user?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">Institution</label>
                    <p className="text-sm text-blue-900">{request.researcherInstitution || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">Phone</label>
                    <p className="text-sm text-blue-900">{request.researcherPhone || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Fields Tab */}
          {activeTab === 'data-fields' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Review carefully:</strong> Researcher has requested access to the following data categories.
                  Each category has a sensitivity score and justification.
                </p>
              </div>

              {DATA_CATEGORIES.map((category) => {
                const fieldData = requestedFields?.[category.key as keyof DataFieldsSelection];
                const isSelected = fieldData?.selected || false;

                if (!isSelected) return null;

                return (
                  <div key={category.key} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-semibold text-blue-900">{category.label}</h4>
                          <p className="text-xs text-blue-700">Sensitivity Score: +{category.score} points</p>
                        </div>
                      </div>
                    </div>
                    {fieldData.justification && (
                      <div className="mt-2 ml-8">
                        <label className="block text-xs font-medium text-blue-700 mb-1">Justification:</label>
                        <p className="text-sm text-blue-900 bg-white border border-blue-200 rounded p-2">
                          {fieldData.justification}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {Object.keys(requestedFields || {}).filter(key => requestedFields[key as keyof DataFieldsSelection]?.selected).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No data fields selected
                </div>
              )}
            </div>
          )}

          {/* Filters Tab */}
          {activeTab === 'filters' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Date Range</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">From</label>
                    <p className="text-sm text-gray-900">{dataFilters?.periodStart || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <p className="text-sm text-gray-900">{dataFilters?.periodEnd || '-'}</p>
                  </div>
                </div>
              </div>

              {dataFilters?.ageMin !== undefined && dataFilters?.ageMax !== undefined && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Age Range</h4>
                  <p className="text-sm text-gray-900">{dataFilters.ageMin} - {dataFilters.ageMax} years</p>
                </div>
              )}

              {dataFilters?.gender && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Gender</h4>
                  <p className="text-sm text-gray-900">{dataFilters.gender}</p>
                </div>
              )}

              {request.estimatedPatientCount !== null && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-sm text-green-600 mb-1">Estimated Patient Count</div>
                    <div className="text-3xl font-bold text-green-900">~{request.estimatedPatientCount}</div>
                    <div className="text-xs text-green-700 mt-1">patients matching criteria</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ethics Tab */}
          {activeTab === 'ethics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">IRB/Ethics Approval Status</label>
                  <p className={`text-gray-900 font-medium ${request.irbStatus === 'APPROVED' ? 'text-green-600' : ''}`}>
                    {request.irbStatus || '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Access Duration</label>
                  <p className="text-gray-900">{request.accessDurationMonths || '-'} months</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Research Start Date</label>
                  <p className="text-gray-900">{request.researchStart || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Research End Date</label>
                  <p className="text-gray-900">{request.researchEnd || '-'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Data Protection Agreement</label>
                <p className={`text-gray-900 font-medium ${request.agreementSigned ? 'text-green-600' : 'text-red-600'}`}>
                  {request.agreementSigned ? '✓ Signed' : '✗ Not Signed'}
                </p>
                {request.agreementDate && (
                  <p className="text-xs text-gray-600 mt-1">Signed on: {new Date(request.agreementDate).toLocaleDateString()}</p>
                )}
              </div>

              {request.irbCertificateUrl && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-blue-900 mb-2">IRB Certificate</label>
                  <a
                    href={request.irbCertificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    View IRB Certificate
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Admin Decision Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Admin Decision</h4>

            {/* Decision Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setDecision('APPROVE')}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  decision === 'APPROVE'
                    ? 'border-green-600 bg-green-50 text-green-900'
                    : 'border-gray-300 text-gray-700 hover:border-green-400'
                }`}
              >
                ✓ Approve
              </button>
              <button
                onClick={() => setDecision('APPROVE_WITH_CONDITIONS')}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  decision === 'APPROVE_WITH_CONDITIONS'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-300 text-gray-700 hover:border-blue-400'
                }`}
              >
                ⚠ Approve with Conditions
              </button>
              <button
                onClick={() => setDecision('REQUEST_MORE_INFO')}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  decision === 'REQUEST_MORE_INFO'
                    ? 'border-yellow-600 bg-yellow-50 text-yellow-900'
                    : 'border-gray-300 text-gray-700 hover:border-yellow-400'
                }`}
              >
                ? Request More Info
              </button>
              <button
                onClick={() => setDecision('REJECT')}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  decision === 'REJECT'
                    ? 'border-red-600 bg-red-50 text-red-900'
                    : 'border-gray-300 text-gray-700 hover:border-red-400'
                }`}
              >
                ✗ Reject
              </button>
            </div>

            {/* Conditions (only for APPROVE_WITH_CONDITIONS) */}
            {decision === 'APPROVE_WITH_CONDITIONS' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditions to be Met <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="Jelaskan kondisi yang harus dipenuhi peneliti (contoh: Harus melengkapi IRB approval dalam 30 hari)"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            {/* Admin Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes <span className="text-red-600">*</span>
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Catatan internal untuk tracking dan audit trail"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmitDecision}
                disabled={isSubmitting || !decision || !adminNotes.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Decision'}
              </button>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
