'use client';

import { Layout } from '@/components/layout/Layout';

export default function AdminUsersPage() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Kelola pengguna sistem INAMSOS</p>
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">User Management</h3>
          <p className="mt-2 text-sm text-gray-500">
            Fitur ini sedang dalam pengembangan. Segera hadir!
          </p>
        </div>
      </div>
    </Layout>
  );
}
