'use client';

import React, { useState } from 'react';
import { MstsScoreCalculator } from '@/components/musculoskeletal/MstsScoreCalculator';
import { Layout } from '@/components/layout/Layout';

export default function MstsCalculatorDemoPage() {
  const [patientId] = useState('demo-patient-001');
  const [patientName] = useState('John Doe');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
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
    </Layout>
  );
}
