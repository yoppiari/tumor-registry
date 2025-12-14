'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MstsScoreCalculator } from '@/components/musculoskeletal/MstsScoreCalculator';
import { Layout } from '@/components/layout/Layout';
import patientService, { Patient } from '@/services/patient.service';
import mstsService from '@/services/msts.service';

export default function MstsCalculatorPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [scoreHistory, setScoreHistory] = useState<any[]>([]);

  const patientId = params.patientId as string;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && patientId) {
      loadPatientData();
      loadScoreHistory();
    }
  }, [isAuthenticated, authLoading, patientId, router]);

  const loadPatientData = async () => {
    try {
      setLoading(true);

      // Use patientService instead of raw axios for proper token handling
      const patientData = await patientService.getPatientById(patientId);
      setPatient(patientData);
    } catch (error) {
      console.error('Error loading patient:', error);
      alert('Failed to load patient data');
      router.push('/msts');
    } finally {
      setLoading(false);
    }
  };

  const loadScoreHistory = async () => {
    try {
      const history = await mstsService.getPatientHistory(patientId);
      setScoreHistory(history.scores || []);
    } catch (error) {
      console.error('Error loading MSTS history:', error);
      // Don't block the page if history fails to load
      setScoreHistory([]);
    }
  };

  const handleSave = async (scoreId: string) => {
    console.log('MSTS score saved with ID:', scoreId);
    // Reload history after save
    await loadScoreHistory();
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patient data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">Patient not found</p>
          <button
            onClick={() => router.push('/msts')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Patient Selection
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push('/msts')}
              className="text-blue-600 hover:text-blue-700 font-medium mb-2 flex items-center"
            >
              ← Back to Patient Selection
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              MSTS Score Calculator - {patient.name}
            </h1>
            <p className="text-gray-600">MR Number: {patient.medicalRecordNumber}</p>
          </div>
        </div>

        {/* Score History */}
        {scoreHistory && scoreHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Assessments</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scoreHistory.slice(0, 3).map((score) => (
                <div
                  key={score.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500">
                      {new Date(score.assessmentDate).toLocaleDateString('id-ID')}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {score.totalScore}/30
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">By: {score.assessedBy}</p>
                </div>
              ))}
            </div>
            {scoreHistory.length > 3 && (
              <button
                onClick={() => router.push(`/patients/${patientId}`)}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700"
              >
                View all {scoreHistory.length} assessments →
              </button>
            )}
          </div>
        )}

        {/* MSTS Calculator Component */}
        <MstsScoreCalculator
          patientId={patientId}
          patientName={patient.name}
          autoSave={true}
          onSave={handleSave}
        />
      </div>
    </Layout>
  );
}
