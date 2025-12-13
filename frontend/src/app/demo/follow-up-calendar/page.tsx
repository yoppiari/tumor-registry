'use client';

import React, { useState } from 'react';
import { FollowUpCalendar } from '@/components/musculoskeletal/FollowUpCalendar';
import { FollowUpVisit } from '@/services/followup.service';

export default function FollowUpCalendarDemoPage() {
  const [patientId] = useState('demo-patient-001');
  const [patientName] = useState('John Doe');
  const [selectedVisit, setSelectedVisit] = useState<FollowUpVisit | null>(null);

  const handleVisitClick = (visit: FollowUpVisit) => {
    setSelectedVisit(visit);
    console.log('Selected visit:', visit);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      <FollowUpCalendar
        patientId={patientId}
        patientName={patientName}
        onVisitClick={handleVisitClick}
      />

      {/* Visit Detail Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Visit #{selectedVisit.visitNumber} Details
              </h3>
              <button
                onClick={() => setSelectedVisit(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Type:</span> {selectedVisit.visitType}
              </div>
              <div>
                <span className="font-semibold">Scheduled:</span>{' '}
                {new Date(selectedVisit.scheduledDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Status:</span> {selectedVisit.status}
              </div>
              {selectedVisit.clinicalStatus && (
                <div>
                  <span className="font-semibold">Clinical Status:</span>{' '}
                  {selectedVisit.clinicalStatus}
                </div>
              )}
              {selectedVisit.notes && (
                <div>
                  <span className="font-semibold">Notes:</span> {selectedVisit.notes}
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedVisit(null)}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
