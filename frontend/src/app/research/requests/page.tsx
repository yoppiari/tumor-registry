'use client';

import { Layout } from '@/components/layout/Layout';

export default function ResearchRequestsPage() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Permintaan Data Penelitian</h1>
        <p className="text-gray-600">Kelola permintaan akses data untuk penelitian</p>
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Permintaan Data Penelitian</h3>
          <p className="mt-2 text-sm text-gray-500">
            Fitur ini sedang dalam pengembangan. Segera hadir!
          </p>
        </div>
      </div>
    </Layout>
  );
}
