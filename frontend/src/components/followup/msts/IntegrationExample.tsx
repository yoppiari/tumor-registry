/**
 * MSTS Score Calculator - Integration Example
 *
 * This file demonstrates how to integrate MSTS components
 * into a follow-up visit form in the tumor registry system.
 */

'use client';

import React, { useState } from 'react';
import {
  MstsScoreCalculator,
  MstsScoreSummary,
  MstsScoreTrendChart,
} from './index';
import type { MstsScoreResult, ExtremityType } from '../types/msts.types';

interface FollowUpVisit {
  id?: string;
  patientId: string;
  patientName: string;
  visitNumber: number;
  visitDate: Date;
  extremityType: ExtremityType;
  mstsScore?: MstsScoreResult;
  clinicalNotes?: string;
}

/**
 * Example: Complete Follow-up Visit Form with MSTS Assessment
 */
export const FollowUpVisitWithMsts: React.FC<{
  patientId: string;
  patientName: string;
  extremityType: ExtremityType;
  visitNumber: number;
  previousMstsScore?: MstsScoreResult;
}> = ({
  patientId,
  patientName,
  extremityType,
  visitNumber,
  previousMstsScore,
}) => {
  const [visit, setVisit] = useState<FollowUpVisit>({
    patientId,
    patientName,
    visitNumber,
    visitDate: new Date(),
    extremityType,
  });

  const [activeTab, setActiveTab] = useState<'assessment' | 'history'>('assessment');
  const [showMstsCalculator, setShowMstsCalculator] = useState(
    !visit.mstsScore
  );

  // Handle MSTS score save
  const handleSaveMstsScore = async (score: MstsScoreResult) => {
    try {
      // In production, save to backend API
      const response = await fetch('/api/follow-up-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...visit,
          mstsScore: score,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save visit data');
      }

      const savedVisit = await response.json();

      // Update local state
      setVisit({ ...visit, mstsScore: score, id: savedVisit.id });
      setShowMstsCalculator(false);

      alert('MSTS score saved successfully!');
    } catch (error) {
      console.error('Error saving MSTS score:', error);
      alert('Failed to save MSTS score. Please try again.');
    }
  };

  // Handle visit save
  const handleSaveVisit = async () => {
    if (!visit.mstsScore) {
      alert('Please complete the MSTS assessment before saving the visit.');
      return;
    }

    try {
      // Save complete visit to backend
      const response = await fetch('/api/follow-up-visits', {
        method: visit.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visit),
      });

      if (!response.ok) {
        throw new Error('Failed to save visit');
      }

      alert('Follow-up visit saved successfully!');
    } catch (error) {
      console.error('Error saving visit:', error);
      alert('Failed to save visit. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Follow-up Visit Assessment
            </h1>
            <p className="text-gray-600 mt-1">
              {patientName} - Visit #{visitNumber}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Visit Date</div>
            <input
              type="date"
              value={visit.visitDate.toISOString().split('T')[0]}
              onChange={(e) =>
                setVisit({ ...visit, visitDate: new Date(e.target.value) })
              }
              className="mt-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'assessment'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Current Assessment
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Score History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              {/* MSTS Score Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    MSTS Functional Assessment
                  </h2>
                  {visit.mstsScore && !showMstsCalculator && (
                    <button
                      onClick={() => setShowMstsCalculator(true)}
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      Edit Score
                    </button>
                  )}
                </div>

                {showMstsCalculator ? (
                  <MstsScoreCalculator
                    extremityType={extremityType}
                    initialValues={visit.mstsScore}
                    onSave={handleSaveMstsScore}
                    previousScore={previousMstsScore}
                    showResetButton={true}
                  />
                ) : visit.mstsScore ? (
                  <MstsScoreSummary
                    score={visit.mstsScore}
                    showBreakdown={true}
                    editable={false}
                  />
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      MSTS assessment not yet completed. Please complete the assessment
                      above.
                    </p>
                  </div>
                )}
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Clinical Notes
                </label>
                <textarea
                  value={visit.clinicalNotes || ''}
                  onChange={(e) =>
                    setVisit({ ...visit, clinicalNotes: e.target.value })
                  }
                  rows={4}
                  placeholder="Enter any additional clinical observations, complications, or notes about this visit..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVisit}
                  disabled={!visit.mstsScore}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    visit.mstsScore
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Save Visit
                </button>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <MstsScoreTrendChart
                patientId={patientId}
                extremityType={extremityType}
                showDomains={true}
                highlightChanges={true}
                maxVisits={14}
              />
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              About MSTS Assessment
            </h4>
            <p className="text-sm text-blue-800">
              The MSTS score is a standardized functional outcome measure used for
              musculoskeletal tumor patients. Complete all 6 domains to calculate the
              total score (0-30 points). Higher scores indicate better functional
              outcomes. This assessment should be completed at each follow-up visit to
              track patient progress over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Example: Simple MSTS Assessment Page
 */
export const SimpleMstsAssessmentPage: React.FC<{
  patientId: string;
  extremityType: ExtremityType;
}> = ({ patientId, extremityType }) => {
  const handleSave = async (score: MstsScoreResult) => {
    console.log('Saving MSTS score:', score);

    // API call
    await fetch('/api/msts-scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...score,
        patientId,
      }),
    });

    alert('Score saved successfully!');
  };

  return (
    <div className="container mx-auto p-6">
      <MstsScoreCalculator extremityType={extremityType} onSave={handleSave} />
    </div>
  );
};

/**
 * Example: Dashboard Widget with Compact Summary
 */
export const MstsDashboardWidget: React.FC<{
  latestScore?: MstsScoreResult;
  patientId: string;
  extremityType: ExtremityType;
}> = ({ latestScore, patientId, extremityType }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-3">Latest MSTS Score</h3>

      {latestScore ? (
        <MstsScoreSummary score={latestScore} compact={true} editable={false} />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No MSTS assessment recorded yet</p>
          <button
            onClick={() => (window.location.href = `/patients/${patientId}/msts`)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Start Assessment
          </button>
        </div>
      )}
    </div>
  );
};

export default FollowUpVisitWithMsts;
