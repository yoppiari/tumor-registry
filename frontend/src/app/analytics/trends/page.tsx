'use client';

import { Layout } from '@/components/layout/Layout';

export default function AnalyticsTrendsPage() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Trend Analysis</h1>
        <p className="text-gray-600">Analisis tren kasus kanker dari waktu ke waktu</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Trend Analysis</h3>
          <p className="mt-2 text-sm text-gray-500">
            Fitur ini sedang dalam pengembangan. Segera hadir!
          </p>
        </div>
      </div>
    </Layout>
  );
}
