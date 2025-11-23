'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

export default function AnalyticsDistributionPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedCancerType, setSelectedCancerType] = useState('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  const cancerTypes = [
    { value: 'all', label: 'Semua Jenis Kanker' },
    { value: 'breast', label: 'Kanker Payudara' },
    { value: 'cervical', label: 'Kanker Serviks' },
    { value: 'lung', label: 'Kanker Paru-paru' },
    { value: 'colorectal', label: 'Kanker Kolorektal' },
    { value: 'liver', label: 'Kanker Hati' },
  ];

  // Mock data for Indonesian provinces
  const provinceData = [
    { province: 'Jawa Barat', cases: 324, percentage: 18.5, trend: 'up', color: 'bg-red-600' },
    { province: 'Jawa Timur', cases: 298, percentage: 17.0, trend: 'up', color: 'bg-red-500' },
    { province: 'DKI Jakarta', cases: 276, percentage: 15.8, trend: 'stable', color: 'bg-orange-600' },
    { province: 'Jawa Tengah', cases: 234, percentage: 13.4, trend: 'down', color: 'bg-orange-500' },
    { province: 'Sumatera Utara', cases: 187, percentage: 10.7, trend: 'up', color: 'bg-yellow-500' },
    { province: 'Banten', cases: 156, percentage: 8.9, trend: 'stable', color: 'bg-yellow-400' },
    { province: 'Sulawesi Selatan', cases: 134, percentage: 7.7, trend: 'up', color: 'bg-green-400' },
    { province: 'Sumatera Barat', cases: 98, percentage: 5.6, trend: 'stable', color: 'bg-green-300' },
    { province: 'Kalimantan Timur', cases: 45, percentage: 2.6, trend: 'down', color: 'bg-blue-300' },
    { province: 'Bali', cases: 23, percentage: 1.3, trend: 'stable', color: 'bg-blue-200' },
  ];

  const totalCases = provinceData.reduce((sum, p) => sum + p.cases, 0);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Distribusi Geografis Kanker</h1>
        <p className="text-gray-600 mt-2">Peta distribusi kasus kanker di seluruh Indonesia</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Kanker
            </label>
            <select
              value={selectedCancerType}
              onChange={(e) => setSelectedCancerType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {cancerTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periode
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Tahun 2024</option>
              <option>Tahun 2023</option>
              <option>6 Bulan Terakhir</option>
              <option>3 Bulan Terakhir</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Map Visualization Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Peta Indonesia</h2>

          {/* SVG Map Placeholder */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 mb-6" style={{ minHeight: '400px' }}>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="mx-auto h-32 w-32 text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-gray-600 font-medium">Peta Interaktif Indonesia</p>
                <p className="text-sm text-gray-500 mt-2">
                  Visualisasi distribusi kasus kanker berdasarkan provinsi
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{provinceData.length}</div>
                    <div className="text-sm text-gray-600">Provinsi Terdampak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{totalCases.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Kasus</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Legenda Intensitas Kasus</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-red-600 rounded"></div>
                <span className="text-sm text-gray-600">Sangat Tinggi (300+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-600">Tinggi (150-299)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-yellow-400 rounded"></div>
                <span className="text-sm text-gray-600">Sedang (50-149)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-green-300 rounded"></div>
                <span className="text-sm text-gray-600">Rendah (20-49)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-blue-200 rounded"></div>
                <span className="text-sm text-gray-600">Sangat Rendah (&lt;20)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Provinces */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 5 Provinsi</h2>
          <div className="space-y-4">
            {provinceData.slice(0, 5).map((province, index) => (
              <div key={province.province} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                      <span className="text-green-700 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{province.province}</p>
                      <p className="text-sm text-gray-500">{province.cases.toLocaleString()} kasus</p>
                    </div>
                  </div>
                  {province.trend === 'up' && (
                    <div className="flex items-center text-red-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {province.trend === 'down' && (
                    <div className="flex items-center text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${province.percentage * 5}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{province.percentage}% dari total</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Province Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Semua Provinsi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peringkat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provinsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Kasus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Persentase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intensitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tren
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {provinceData.map((province, index) => (
                <tr key={province.province} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{province.province}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{province.cases.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{province.percentage}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${province.color} text-white`}>
                      {province.cases >= 300 ? 'Sangat Tinggi' :
                       province.cases >= 150 ? 'Tinggi' :
                       province.cases >= 50 ? 'Sedang' :
                       province.cases >= 20 ? 'Rendah' : 'Sangat Rendah'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {province.trend === 'up' && (
                      <span className="inline-flex items-center text-red-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        Naik
                      </span>
                    )}
                    {province.trend === 'down' && (
                      <span className="inline-flex items-center text-green-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Turun
                      </span>
                    )}
                    {province.trend === 'stable' && (
                      <span className="inline-flex items-center text-gray-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Stabil
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
