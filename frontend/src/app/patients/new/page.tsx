'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { FormProvider } from '@/components/patients/wizard/FormContext';
import { MultiStepWizard } from '@/components/patients/wizard/MultiStepWizard';
import { Section1CenterPathology } from '@/components/patients/wizard/sections/Section1CenterPathology';
import { Section2PatientIdentity } from '@/components/patients/wizard/sections/Section2PatientIdentity';
import { Section3ClinicalData } from '@/components/patients/wizard/sections/Section3ClinicalData';
import { Section4DiagnosticInvestigations } from '@/components/patients/wizard/sections/Section4DiagnosticInvestigations';
import { Section5DiagnosisLocation } from '@/components/patients/wizard/sections/Section5DiagnosisLocation';
import { Section10Review } from '@/components/patients/wizard/sections/Section10Review';
import {
  validateSection1,
  validateSection2,
  validateSection3,
  validateSection4,
  validateSection5,
} from '@/components/patients/wizard/ValidationUtils';

function NewPatientContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleComplete = async (data: any) => {
    try {
      const response = await fetch('/api/v1/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create patient');
      }

      const result = await response.json();
      router.push(`/patients/${result.data.id}`);
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  };

  const handleSaveDraft = async (data: any) => {
    try {
      // Save draft to localStorage for now
      localStorage.setItem('patient-draft', JSON.stringify(data));
      console.log('Draft saved:', data);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  // Define wizard sections
  const sections = [
    {
      id: 'section1',
      title: 'Pusat & Patologi',
      description: 'Pilih pusat pengobatan dan jenis patologi tumor',
      component: Section1CenterPathology,
      validate: validateSection1,
    },
    {
      id: 'section2',
      title: 'Identitas Pasien',
      description: 'Data identitas dan demografi pasien',
      component: Section2PatientIdentity,
      validate: validateSection2,
    },
    {
      id: 'section3',
      title: 'Data Klinis',
      description: 'Karnofsky Score, Pain Scale, BMI, dan pemeriksaan fisik',
      component: Section3ClinicalData,
      validate: validateSection3,
    },
    {
      id: 'section4',
      title: 'Pemeriksaan Penunjang',
      description: 'Laboratorium, Radiologi, Mirrel Score, dan Patologi',
      component: Section4DiagnosticInvestigations,
      validate: validateSection4,
    },
    {
      id: 'section5',
      title: 'Diagnosis & Lokasi',
      description: 'Klasifikasi WHO dan lokasi anatomis tumor',
      component: Section5DiagnosisLocation,
      validate: validateSection5,
    },
    {
      id: 'section10',
      title: 'Review & Submit',
      description: 'Tinjau dan kirim data pasien',
      component: Section10Review,
    },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Registrasi Pasien Tumor Muskuloskeletal
        </h1>
        <p className="text-gray-600 mt-2">
          Sistem registrasi tumor muskuloskeletal berdasarkan{' '}
          <strong>WHO Classification 5th Edition</strong>
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            6 Bagian Form (50% Lengkap)
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            57 Klasifikasi Tumor Tulang WHO
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            68 Klasifikasi Tumor Jaringan Lunak WHO
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Mirrel Score Calculator
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
            MSTS Score Ready
          </div>
        </div>
      </div>

      <FormProvider autoSaveInterval={120000}>
        <MultiStepWizard
          sections={sections}
          onComplete={handleComplete}
          onSaveDraft={handleSaveDraft}
          autoSaveInterval={120000}
        />
      </FormProvider>
    </Layout>
  );
}

export default function NewPatientPage() {
  return <NewPatientContent />;
}
