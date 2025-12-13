'use client';

import React, { useState, useEffect } from 'react';
import mstsService, { CreateMstsScoreDto } from '@/services/msts.service';

interface MstsScoreCalculatorProps {
  patientId: string;
  patientName?: string;
  followUpVisitId?: string;
  onSave?: (scoreId: string) => void;
  autoSave?: boolean;
}

interface MstsDomainScores {
  pain: number;
  function: number;
  emotionalAcceptance: number;
  supports: number;
  walking: number;
  gait: number;
}

const DOMAIN_DESCRIPTIONS = {
  pain: {
    title: 'Pain',
    levels: [
      { value: 5, label: 'No pain', description: 'No pain or discomfort' },
      { value: 4, label: 'Mild pain', description: 'Occasional pain, no medication needed' },
      { value: 3, label: 'Moderate pain', description: 'Pain controlled with NSAIDs' },
      { value: 2, label: 'Moderate-severe pain', description: 'Pain requires stronger medication' },
      { value: 1, label: 'Severe pain', description: 'Severe pain, limited activities' },
      { value: 0, label: 'Disabling pain', description: 'Constant, disabling pain' },
    ],
  },
  function: {
    title: 'Function',
    levels: [
      { value: 5, label: 'No restriction', description: 'No functional limitations' },
      { value: 4, label: 'Minor restriction', description: 'Minor recreational restrictions' },
      { value: 3, label: 'Moderate restriction', description: 'Restricted recreational activities' },
      { value: 2, label: 'Partial restriction', description: 'Partial restriction of daily activities' },
      { value: 1, label: 'Severe restriction', description: 'Severe restriction of daily activities' },
      { value: 0, label: 'Total disability', description: 'Total disability' },
    ],
  },
  emotionalAcceptance: {
    title: 'Emotional Acceptance',
    levels: [
      { value: 5, label: 'Enthusiastic', description: 'Enthusiastic about condition' },
      { value: 4, label: 'Satisfied', description: 'Satisfied with condition' },
      { value: 3, label: 'Accepting', description: 'Accepts condition' },
      { value: 2, label: 'Moderate concerns', description: 'Moderate concerns' },
      { value: 1, label: 'Disappointed', description: 'Disappointed with condition' },
      { value: 0, label: 'Unaccepting', description: 'Does not accept condition' },
    ],
  },
  supports: {
    title: 'Supports/Aids',
    levels: [
      { value: 5, label: 'None', description: 'No external supports needed' },
      { value: 4, label: 'Brace only', description: 'Brace or wrap for activities' },
      { value: 3, label: 'One cane/crutch', description: 'One cane or crutch' },
      { value: 2, label: 'Two canes/crutches', description: 'Two canes or crutches' },
      { value: 1, label: 'Walker/frame', description: 'Walker or frame' },
      { value: 0, label: 'Unable to walk', description: 'Unable to walk' },
    ],
  },
  walking: {
    title: 'Walking Ability',
    levels: [
      { value: 5, label: 'Unlimited', description: 'Unlimited walking ability' },
      { value: 4, label: '>6 blocks', description: 'Can walk more than 6 blocks' },
      { value: 3, label: '3-6 blocks', description: 'Can walk 3-6 blocks' },
      { value: 2, label: '1-2 blocks', description: 'Can walk 1-2 blocks only' },
      { value: 1, label: 'Indoors only', description: 'Indoor walking only' },
      { value: 0, label: 'Unable to walk', description: 'Unable to walk' },
    ],
  },
  gait: {
    title: 'Gait',
    levels: [
      { value: 5, label: 'Normal', description: 'Normal gait' },
      { value: 4, label: 'Minor limp', description: 'Minor cosmetic limp' },
      { value: 3, label: 'Moderate limp', description: 'Moderate limp, noticeable' },
      { value: 2, label: 'Major limp', description: 'Major limp, significantly abnormal' },
      { value: 1, label: 'Severe limp', description: 'Severe limp, barely ambulatory' },
      { value: 0, label: 'Unable to walk', description: 'Unable to walk' },
    ],
  },
};

export const MstsScoreCalculator: React.FC<MstsScoreCalculatorProps> = ({
  patientId,
  patientName,
  followUpVisitId,
  onSave,
  autoSave = false,
}) => {
  const [scores, setScores] = useState<MstsDomainScores>({
    pain: 0,
    function: 0,
    emotionalAcceptance: 0,
    supports: 0,
    walking: 0,
    gait: 0,
  });

  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [assessedBy, setAssessedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const totalScore = mstsService.calculateTotalScore(scores);
  const functionalStatus = mstsService.getFunctionalStatus(totalScore);

  useEffect(() => {
    if (autoSave && scores && assessedBy) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [scores, assessmentDate, assessedBy, notes, autoSave]);

  const handleScoreChange = (domain: keyof MstsDomainScores, value: number) => {
    setScores((prev) => ({ ...prev, [domain]: value }));
    setSaved(false);
  };

  const handleAutoSave = async () => {
    if (!assessedBy) return;
    await handleSave(true);
  };

  const handleSave = async (silent = false) => {
    try {
      setSaving(true);
      setError('');

      if (!assessedBy) {
        setError('Please enter the assessor name');
        return;
      }

      const data: CreateMstsScoreDto = {
        patientId,
        followUpVisitId,
        ...scores,
        assessmentDate,
        assessedBy,
        notes: notes || undefined,
      };

      const result = await mstsService.createScore(data);

      if (!silent) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }

      if (onSave) {
        onSave(result.id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save MSTS score');
    } finally {
      setSaving(false);
    }
  };

  const renderDomainSelector = (
    domain: keyof MstsDomainScores,
    info: typeof DOMAIN_DESCRIPTIONS.pain
  ) => {
    return (
      <div key={domain} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{info.title}</h3>
        <div className="space-y-2">
          {info.levels.map((level) => (
            <button
              key={level.value}
              onClick={() => handleScoreChange(domain, level.value)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                scores[domain] === level.value
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mr-3">
                      {level.value}
                    </span>
                    <span className="font-medium text-gray-900">{level.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-11 mt-1">{level.description}</p>
                </div>
                {scores[domain] === level.value && (
                  <svg
                    className="w-6 h-6 text-blue-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
        <h2 className="text-2xl font-bold">MSTS Score Calculator</h2>
        <p className="text-blue-100 mt-1">
          Musculoskeletal Tumor Society Functional Rating System
        </p>
        {patientName && (
          <p className="text-blue-100 mt-2">
            Patient: <span className="font-semibold">{patientName}</span>
          </p>
        )}
      </div>

      {/* Total Score Display */}
      <div className="bg-white border-x border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
            <div className="text-sm font-medium text-blue-700 mb-1">Total MSTS Score</div>
            <div className="text-5xl font-bold text-blue-900">{totalScore}</div>
            <div className="text-sm text-blue-600 mt-1">out of 30 points</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
            <div className="text-sm font-medium text-green-700 mb-1">Functional Status</div>
            <div className="text-2xl font-bold text-green-900">{functionalStatus}</div>
            <div className="text-sm text-green-600 mt-2">
              Based on total score interpretation
            </div>
          </div>
        </div>

        {/* Assessment Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Date *
            </label>
            <input
              type="date"
              value={assessmentDate}
              onChange={(e) => {
                setAssessmentDate(e.target.value);
                setSaved(false);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessed By *
            </label>
            <input
              type="text"
              value={assessedBy}
              onChange={(e) => {
                setAssessedBy(e.target.value);
                setSaved(false);
              }}
              placeholder="Physician or clinician name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !assessedBy}
              className={`w-full px-6 py-2 rounded-lg font-medium transition-colors ${
                saving || !assessedBy
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : saved
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Score'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {autoSave && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
            Auto-save enabled: Changes will be saved automatically
          </div>
        )}
      </div>

      {/* Domain Selectors */}
      <div className="bg-gray-50 border border-gray-200 rounded-b-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Assessment Domains</h3>
        <p className="text-gray-600 mb-6">
          Rate each domain from 0 (worst) to 5 (best) based on the patient's current functional status.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(Object.keys(DOMAIN_DESCRIPTIONS) as Array<keyof MstsDomainScores>).map((domain) =>
            renderDomainSelector(domain, DOMAIN_DESCRIPTIONS[domain])
          )}
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinical Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setSaved(false);
            }}
            rows={4}
            placeholder="Additional observations, limitations, or context for this assessment..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Info Panel */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="h-6 w-6 text-blue-500 flex-shrink-0"
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
              <h4 className="text-sm font-semibold text-blue-800">About MSTS Score</h4>
              <p className="text-sm text-blue-700 mt-1">
                The MSTS score evaluates 6 functional domains (Pain, Function, Emotional Acceptance,
                Supports, Walking, and Gait). Each domain is scored 0-5, for a total of 0-30 points.
                Higher scores indicate better functional outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
