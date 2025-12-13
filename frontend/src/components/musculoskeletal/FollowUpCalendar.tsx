'use client';

import React, { useState, useEffect } from 'react';
import followUpService, {
  FollowUpVisit,
  FollowUpSummary,
  GenerateFollowUpScheduleDto,
} from '@/services/followup.service';

interface FollowUpCalendarProps {
  patientId: string;
  patientName?: string;
  onVisitClick?: (visit: FollowUpVisit) => void;
}

export const FollowUpCalendar: React.FC<FollowUpCalendarProps> = ({
  patientId,
  patientName,
  onVisitClick,
}) => {
  const [visits, setVisits] = useState<FollowUpVisit[]>([]);
  const [summary, setSummary] = useState<FollowUpSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [treatmentCompletionDate, setTreatmentCompletionDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [visitsData, summaryData] = await Promise.all([
        followUpService.getVisitsByPatient(patientId),
        followUpService.getPatientSummary(patientId),
      ]);
      setVisits(visitsData);
      setSummary(summaryData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load follow-up data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSchedule = async () => {
    try {
      setGenerating(true);
      setError('');
      const data: GenerateFollowUpScheduleDto = {
        patientId,
        treatmentCompletionDate,
      };
      await followUpService.generateSchedule(data);
      setShowGenerateModal(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate schedule');
    } finally {
      setGenerating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      missed: 'bg-red-100 text-red-800 border-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getClinicalStatusBadge = (clinicalStatus?: string) => {
    const colors: Record<string, string> = {
      NED: 'bg-green-100 text-green-800',
      AWD: 'bg-yellow-100 text-yellow-800',
      DOD: 'bg-red-100 text-red-800',
      DOC: 'bg-gray-100 text-gray-800',
    };
    return colors[clinicalStatus || ''] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isUpcoming = (visit: FollowUpVisit) => {
    return (
      visit.status === 'scheduled' && new Date(visit.scheduledDate) > new Date()
    );
  };

  const isPastDue = (visit: FollowUpVisit) => {
    return (
      visit.status === 'scheduled' && new Date(visit.scheduledDate) < new Date()
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading follow-up schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">14-Visit Follow-up Schedule</h2>
            <p className="text-purple-100 mt-1">
              Musculoskeletal Tumor Registry - Standard Protocol
            </p>
            {patientName && (
              <p className="text-purple-100 mt-2">
                Patient: <span className="font-semibold">{patientName}</span>
              </p>
            )}
          </div>
          {visits.length === 0 && (
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-6 py-3 bg-white text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg"
            >
              Generate Schedule
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-x border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && visits.length > 0 && (
        <div className="bg-white border-x border-gray-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{summary.totalVisits}</div>
              <div className="text-sm text-gray-600">Total Visits</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-900">{summary.completed}</div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{summary.scheduled}</div>
              <div className="text-sm text-blue-700">Scheduled</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-900">{summary.missed}</div>
              <div className="text-sm text-red-700">Missed</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-900">
                {summary.recurrence.local || summary.recurrence.distant ? 'Yes' : 'No'}
              </div>
              <div className="text-sm text-yellow-700">Recurrence</div>
            </div>
          </div>

          {/* Upcoming Visit */}
          {summary.upcomingVisit && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Next Scheduled Visit</h3>
              <div className="text-blue-800">
                Visit #{summary.upcomingVisit.visitNumber} -{' '}
                {formatDate(summary.upcomingVisit.scheduledDate)}
                <span className="ml-2 text-sm text-blue-600">
                  ({summary.upcomingVisit.visitType})
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visit Schedule */}
      <div className="bg-white border border-gray-200 rounded-b-lg p-6">
        {visits.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No follow-up schedule yet
            </h3>
            <p className="mt-2 text-gray-600">
              Generate a 14-visit follow-up schedule to begin tracking patient progress.
            </p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Generate Schedule
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {visits.map((visit) => (
              <div
                key={visit.id}
                onClick={() => onVisitClick && onVisitClick(visit)}
                className={`border-2 rounded-lg p-4 transition-all ${
                  onVisitClick ? 'cursor-pointer hover:shadow-md' : ''
                } ${
                  isUpcoming(visit)
                    ? 'border-blue-300 bg-blue-50'
                    : isPastDue(visit)
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold">
                        {visit.visitNumber}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Visit #{visit.visitNumber} - {visit.visitType}
                        </div>
                        <div className="text-sm text-gray-600">
                          Scheduled: {formatDate(visit.scheduledDate)}
                          {visit.actualDate && (
                            <span className="ml-2">
                              | Completed: {formatDate(visit.actualDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {visit.clinicalStatus && (
                      <div className="mt-2 ml-13">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${getClinicalStatusBadge(
                            visit.clinicalStatus
                          )}`}
                        >
                          {visit.clinicalStatus}
                        </span>
                        {visit.localRecurrence && (
                          <span className="ml-2 inline-block px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                            Local Recurrence
                          </span>
                        )}
                        {visit.distantMetastasis && (
                          <span className="ml-2 inline-block px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                            Distant Metastasis
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadge(
                        visit.status
                      )}`}
                    >
                      {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                    </span>
                    {onVisitClick && (
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Protocol Info */}
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="h-6 w-6 text-purple-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-purple-800">
                Standard Follow-up Protocol
              </h4>
              <p className="text-sm text-purple-700 mt-1">
                <strong>Year 1-2:</strong> 8 visits every 3 months (Visits 1-8)
                <br />
                <strong>Year 3-5:</strong> 6 visits every 6 months (Visits 9-14)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Schedule Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Generate Follow-up Schedule
            </h3>
            <p className="text-gray-600 mb-4">
              This will create a 14-visit follow-up schedule based on the treatment completion
              date.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treatment Completion Date *
              </label>
              <input
                type="date"
                value={treatmentCompletionDate}
                onChange={(e) => setTreatmentCompletionDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateSchedule}
                disabled={generating}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {generating ? 'Generating...' : 'Generate'}
              </button>
              <button
                onClick={() => setShowGenerateModal(false)}
                disabled={generating}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
