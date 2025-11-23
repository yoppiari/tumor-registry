'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

export default function AnalyticsCentersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('all');

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

  // Mock center performance data
  const centerData = [
    {
      rank: 1,
      name: 'RSUPN Dr. Cipto Mangunkusumo',
      region: 'DKI Jakarta',
      qualityScore: 94.5,
      patientVolume: 456,
      timeliness: 96.2,
      completeness: 98.1,
      overallPerformance: 96.2,
      medal: 'gold',
    },
    {
      rank: 2,
      name: 'RSUP Dr. Sardjito',
      region: 'DI Yogyakarta',
      qualityScore: 92.8,
      patientVolume: 398,
      timeliness: 94.5,
      completeness: 96.8,
      overallPerformance: 94.7,
      medal: 'silver',
    },
    {
      rank: 3,
      name: 'RSUP Dr. Soetomo',
      region: 'Jawa Timur',
      qualityScore: 91.3,
      patientVolume: 512,
      timeliness: 91.8,
      completeness: 95.2,
      overallPerformance: 92.8,
      medal: 'bronze',
    },
    {
      rank: 4,
      name: 'RSUP Dr. Hasan Sadikin',
      region: 'Jawa Barat',
      qualityScore: 89.7,
      patientVolume: 423,
      timeliness: 90.4,
      completeness: 94.1,
      overallPerformance: 91.4,
      medal: null,
    },
    {
      rank: 5,
      name: 'RSUP Dr. Kariadi',
      region: 'Jawa Tengah',
      qualityScore: 88.9,
      patientVolume: 367,
      timeliness: 89.2,
      completeness: 93.7,
      overallPerformance: 90.6,
      medal: null,
    },
    {
      rank: 6,
      name: 'RSUP H. Adam Malik',
      region: 'Sumatera Utara',
      qualityScore: 86.4,
      patientVolume: 289,
      timeliness: 87.8,
      completeness: 91.5,
      overallPerformance: 88.6,
      medal: null,
    },
    {
      rank: 7,
      name: 'RSUP Dr. Wahidin Sudirohusodo',
      region: 'Sulawesi Selatan',
      qualityScore: 85.1,
      patientVolume: 245,
      timeliness: 86.3,
      completeness: 90.2,
      overallPerformance: 87.2,
      medal: null,
    },
    {
      rank: 8,
      name: 'RSUP Sanglah',
      region: 'Bali',
      qualityScore: 83.7,
      patientVolume: 198,
      timeliness: 84.9,
      completeness: 89.6,
      overallPerformance: 86.1,
      medal: null,
    },
    {
      rank: 9,
      name: 'RSUP Dr. M. Djamil',
      region: 'Sumatera Barat',
      qualityScore: 82.3,
      patientVolume: 176,
      timeliness: 83.1,
      completeness: 88.4,
      overallPerformance: 84.6,
      medal: null,
    },
    {
      rank: 10,
      name: 'RSUD Dr. Soetomo',
      region: 'Kalimantan Timur',
      qualityScore: 79.8,
      patientVolume: 134,
      timeliness: 81.2,
      completeness: 86.9,
      overallPerformance: 82.6,
      medal: null,
    },
  ];

  const regions = [
    { value: 'all', label: 'Semua Wilayah' },
    { value: 'jawa', label: 'Jawa' },
    { value: 'sumatera', label: 'Sumatera' },
    { value: 'kalimantan', label: 'Kalimantan' },
    { value: 'sulawesi', label: 'Sulawesi' },
    { value: 'bali-nusa', label: 'Bali & Nusa Tenggara' },
  ];

  const getMedalIcon = (medal: string | null) => {
    if (medal === 'gold') {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
          <span className="text-xl">🥇</span>
        </div>
      );
    }
    if (medal === 'silver') {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
          <span className="text-xl">🥈</span>
        </div>
      );
    }
    if (medal === 'bronze') {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
          <span className="text-xl">🥉</span>
        </div>
      );
    }
    return null;
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Sangat Baik</span>;
    }
    if (score >= 80) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Baik</span>;
    }
    if (score >= 70) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Cukup</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Perlu Perbaikan</span>;
  };

  const topCenter = centerData[0];
  const avgQuality = centerData.reduce((sum, c) => sum + c.qualityScore, 0) / centerData.length;
  const avgVolume = Math.round(centerData.reduce((sum, c) => sum + c.patientVolume, 0) / centerData.length);
  const totalVolume = centerData.reduce((sum, c) => sum + c.patientVolume, 0);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Perbandingan Performa Pusat Kanker</h1>
        <p className="text-gray-600 mt-2">Benchmarking dan evaluasi kinerja antar pusat kesehatan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pusat</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{centerData.length}</p>
              <p className="text-xs text-gray-500 mt-1">Pusat aktif</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Skor Kualitas Rata-rata</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{avgQuality.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Across all centers</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume Pasien</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalVolume.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Rata-rata {avgVolume} per pusat</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Pusat Terbaik</p>
              <p className="text-lg font-bold mt-1 line-clamp-1">{topCenter.name}</p>
              <p className="text-xs opacity-90 mt-1">Skor {topCenter.overallPerformance}%</p>
            </div>
            <div className="text-4xl">🥇</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Wilayah
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periode Evaluasi
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Q3 2024 (Jul-Sep)</option>
              <option>Q2 2024 (Apr-Jun)</option>
              <option>Q1 2024 (Jan-Mar)</option>
              <option>Tahun 2024</option>
              <option>Tahun 2023</option>
            </select>
          </div>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Laporan
          </button>
        </div>
      </div>

      {/* Performance Comparison Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <h2 className="text-xl font-semibold text-gray-900">Tabel Perbandingan Performa</h2>
          <p className="text-sm text-gray-600 mt-1">Benchmarking komprehensif seluruh pusat kanker</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peringkat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Pusat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wilayah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skor Kualitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume Pasien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ketepatan Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelengkapan Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performa Overall
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {centerData.map((center) => (
                <tr key={center.rank} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getMedalIcon(center.medal)}
                      <span className="text-sm font-bold text-gray-900">#{center.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{center.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{center.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${center.qualityScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{center.qualityScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{center.patientVolume.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${center.timeliness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{center.timeliness}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${center.completeness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{center.completeness}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-900">{center.overallPerformance}%</span>
                      {getPerformanceBadge(center.overallPerformance)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Metrics Legend */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Skor Kualitas</h3>
          </div>
          <p className="text-xs text-gray-600">
            Evaluasi kualitas data, akurasi diagnosis, dan kepatuhan terhadap standar pelayanan
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Volume Pasien</h3>
          </div>
          <p className="text-xs text-gray-600">
            Jumlah total pasien yang ditangani dalam periode evaluasi
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Ketepatan Waktu</h3>
          </div>
          <p className="text-xs text-gray-600">
            Persentase pelaporan data tepat waktu sesuai standar registry nasional
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Kelengkapan Data</h3>
          </div>
          <p className="text-xs text-gray-600">
            Tingkat kelengkapan field data wajib pada setiap entri pasien
          </p>
        </div>
      </div>
    </Layout>
  );
}
