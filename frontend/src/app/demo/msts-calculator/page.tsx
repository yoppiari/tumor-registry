'use client';

import React, { useState } from 'react';
import { MstsScoreCalculator } from '@/components/musculoskeletal/MstsScoreCalculator';

export default function MstsCalculatorDemoPage() {
  const [patientId] = useState('demo-patient-001');
  const [patientName] = useState('John Doe');

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

      <MstsScoreCalculator
        patientId={patientId}
        patientName={patientName}
        autoSave={false}
        onSave={(scoreId) => {
          console.log('MSTS score saved with ID:', scoreId);
          alert(`MSTS score saved successfully! ID: ${scoreId}`);
        }}
      />
    </div>
  );
}
