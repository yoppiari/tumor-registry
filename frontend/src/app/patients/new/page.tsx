'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { PatientProvider } from '@/contexts/PatientContext';
import PatientChatEntry from '@/components/patients/PatientChatEntry';

function NewPatientContent() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Entry Data Pasien Baru</h1>
        <p className="text-gray-600">Masukkan data pasien kanker baru ke dalam sistem</p>
      </div>

      <PatientChatEntry />
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
