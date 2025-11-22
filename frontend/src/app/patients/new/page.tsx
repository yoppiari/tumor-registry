'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PatientProvider } from '@/contexts/PatientContext';
import PatientChatEntry from '@/components/patients/PatientChatEntry';

function NewPatientContent() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Entry Data Pasien Baru</h1>
        <p className="text-gray-600">Masukkan data pasien kanker baru ke dalam sistem</p>
      </div>

      <PatientChatEntry onShowListView={() => window.location.href = '/patients'} />
    </Layout>
  );
}

export default function NewPatientPage() {
  return (
    <PatientProvider>
      <NewPatientContent />
    </PatientProvider>
  );
}
