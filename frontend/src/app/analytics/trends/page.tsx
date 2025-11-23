'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

export default function AnalyticsTrendsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedCancerType, setSelectedCancerType] = useState('breast');

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
    { value: 'breast', label: 'Kanker Payudara' },
    { value: 'cervical', label: 'Kanker Serviks' },
    { value: 'lung', label: 'Kanker Paru-paru' },
    { value: 'colorectal', label: 'Kanker Kolorektal' },
    { value: 'liver', label: 'Kanker Hati' },
  ];

  // Mock monthly data for the last 12 months
  const monthlyData = [
    { month: 'Nov 2023', cases: 78, change: 0 },
    { month: 'Des 2023', cases: 82, change: 5.1 },
    { month: 'Jan 2024', cases: 89, change: 8.5 },
    { month: 'Feb 2024', cases: 91, change: 2.2 },
    { month: 'Mar 2024', cases: 95, change: 4.4 },
    { month: 'Apr 2024', cases: 88, change: -7.4 },
    { month: 'Mei 2024', cases: 103, change: 17.0 },
    { month: 'Jun 2024', cases: 98, change: -4.9 },
    { month: 'Jul 2024', cases: 106, change: 8.2 },
    { month: 'Agu 2024', cases: 112, change: 5.7 },
    { month: 'Sep 2024', cases: 108, change: -3.6 },
    { month: 'Okt 2024', cases: 115, change: 6.5 },
  ];

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const yearAgo = monthlyData[0];

  const avgCases = Math.round(monthlyData.reduce((sum, d) => sum + d.cases, 0) / monthlyData.length);
  const totalCases = monthlyData.reduce((sum, d) => sum + d.cases, 0);
  const yoyGrowth = ((currentMonth.cases - yearAgo.cases) / yearAgo.cases * 100).toFixed(1);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analisis Tren Temporal</h1>
        <p className="text-gray-600 mt-2">Analisis tren kasus kanker dari waktu ke waktu</p>
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
              Periode Waktu
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>12 Bulan Terakhir</option>
              <option>6 Bulan Terakhir</option>
              <option>3 Bulan Terakhir</option>
              <option>Tahun 2024</option>
              <option>Tahun 2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentMonth.cases}</p>
              <div className="flex items-center mt-2">
                {currentMonth.change > 0 ? (
                  <svg className="w-4 h-4 text-red-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span className={`text-sm font-medium ${currentMonth.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.abs(currentMonth.change)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs bulan lalu</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Bulanan</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{avgCases}</p>
              <p className="text-xs text-gray-500 mt-2">kasus per bulan</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total 12 Bulan</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalCases.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">kasus terdaftar</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pertumbuhan YoY</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{yoyGrowth}%</p>
              <div className="flex items-center mt-2">
                {parseFloat(yoyGrowth) > 0 ? (
                  <svg className="w-4 h-4 text-red-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-xs text-gray-500">vs tahun lalu</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Tren Kasus - 12 Bulan Terakhir</h2>
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8" style={{ minHeight: '400px' }}>
          <div className="flex items-end justify-around h-80 pb-8">
            {monthlyData.map((data, index) => {
              const height = (data.cases / Math.max(...monthlyData.map(d => d.cases))) * 100;
              return (
                <div key={data.month} className="flex flex-col items-center flex-1 mx-1">
                  <div className="relative w-full flex items-end justify-center" style={{ height: '280px' }}>
                    <div className="group relative">
                      <div
                        className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all hover:from-green-700 hover:to-green-500 cursor-pointer"
                        style={{ height: `${height}%`, minWidth: '24px' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            {data.cases} kasus
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-top-left">
                    {data.month}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Rincian Bulanan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bulan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Kasus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perubahan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyData.slice().reverse().map((data, index) => (
                  <tr key={data.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{data.month}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{data.cases}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${data.change > 0 ? 'text-red-600' : data.change < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {data.change > 0 ? '+' : ''}{data.change.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {data.change > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          Naik
                        </span>
                      ) : data.change < 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Turun
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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

        {/* Year-over-Year Comparison */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Perbandingan Tahunan</h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">2024</span>
                <span className="text-lg font-bold text-green-600">{totalCases}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">2023</span>
                <span className="text-lg font-bold text-gray-600">937</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gray-500 h-3 rounded-full" style={{ width: `${(937 / totalCases) * 100}%` }}></div>
              </div>
            </div>

            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">2022</span>
                <span className="text-lg font-bold text-gray-600">824</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gray-400 h-3 rounded-full" style={{ width: `${(824 / totalCases) * 100}%` }}></div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mt-6">
              <p className="text-sm font-medium text-blue-900 mb-2">Insight</p>
              <p className="text-xs text-blue-700">
                Terjadi peningkatan kasus sebesar {yoyGrowth}% dibandingkan tahun lalu.
                Peningkatan tertinggi terjadi di bulan {monthlyData.reduce((max, d) => d.cases > max.cases ? d : max).month}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
