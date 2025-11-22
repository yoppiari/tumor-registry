'use client';

import { Layout } from '@/components/layout/Layout';

export default function ApprovalsHistoryPage() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Persetujuan</h1>
        <p className="text-gray-600">Lihat riwayat persetujuan permintaan data</p>
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Riwayat Persetujuan</h3>
          <p className="mt-2 text-sm text-gray-500">
            Fitur ini sedang dalam pengembangan. Segera hadir!
          </p>
        </div>
      </div>
    </Layout>
  );
}
