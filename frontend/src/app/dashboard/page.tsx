'use client';

import React from 'react';
import { PatientProvider } from '@/contexts/PatientContext';
import PatientDashboard from '@/components/patients/PatientDashboard';

export default function DashboardPage() {
  return (
    <PatientProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Statistik dan analitik data pasien INAMSOS</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PatientDashboard />
        </div>
      </div>
    </PatientProvider>
  );
}