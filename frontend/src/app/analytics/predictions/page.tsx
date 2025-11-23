'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

export default function AnalyticsPredictionsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');

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

  // AI prediction models
  const predictionModels = [
    {
      title: 'Prediksi 3 Bulan Ke Depan',
      timeframe: 'Nov 2024 - Jan 2025',
      predictedCases: 348,
      confidence: 87,
      trend: 'up',
      change: '+12.4%',
      color: 'bg-blue-500',
    },
    {
      title: 'Prediksi 6 Bulan Ke Depan',
      timeframe: 'Nov 2024 - Apr 2025',
      predictedCases: 712,
      confidence: 82,
      trend: 'up',
      change: '+15.8%',
      color: 'bg-purple-500',
    },
    {
      title: 'Prediksi Puncak Kasus',
      timeframe: 'Maret 2025',
      predictedCases: 134,
      confidence: 79,
      trend: 'peak',
      change: 'Puncak',
      color: 'bg-red-500',
    },
  ];

  // Risk factors
  const riskFactors = [
    { factor: 'Urbanisasi Tinggi', impact: 'Tinggi', score: 8.5, color: 'bg-red-500' },
    { factor: 'Polusi Udara', impact: 'Tinggi', score: 8.2, color: 'bg-red-500' },
    { factor: 'Gaya Hidup Tidak Sehat', impact: 'Sedang', score: 7.1, color: 'bg-yellow-500' },
    { factor: 'Penuaan Populasi', impact: 'Sedang', score: 6.8, color: 'bg-yellow-500' },
    { factor: 'Akses Layanan Kesehatan', impact: 'Rendah', score: 4.5, color: 'bg-green-500' },
  ];

  // Predicted hotspots
  const predictedHotspots = [
    {
      province: 'DKI Jakarta',
      currentCases: 276,
      predictedCases: 312,
      increase: 13.0,
      riskLevel: 'Sangat Tinggi',
      color: 'text-red-600'
    },
    {
      province: 'Jawa Barat',
      currentCases: 324,
      predictedCases: 368,
      increase: 13.6,
      riskLevel: 'Sangat Tinggi',
      color: 'text-red-600'
    },
    {
      province: 'Jawa Timur',
      currentCases: 298,
      predictedCases: 334,
      increase: 12.1,
      riskLevel: 'Tinggi',
      color: 'text-orange-600'
    },
    {
      province: 'Banten',
      currentCases: 156,
      predictedCases: 181,
      increase: 16.0,
      riskLevel: 'Tinggi',
      color: 'text-orange-600'
    },
    {
      province: 'Sumatera Utara',
      currentCases: 187,
      predictedCases: 207,
      increase: 10.7,
      riskLevel: 'Sedang',
      color: 'text-yellow-600'
    },
  ];

  // Model accuracy metrics
  const modelMetrics = [
    { metric: 'Akurasi Model', value: '84.7%', description: 'Tingkat akurasi prediksi' },
    { metric: 'Mean Absolute Error', value: '8.2', description: 'Rata-rata kesalahan absolut' },
    { metric: 'R² Score', value: '0.89', description: 'Koefisien determinasi' },
    { metric: 'Training Data', value: '3,247', description: 'Jumlah data pelatihan' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Prediksi AI</h1>
        <p className="text-gray-600 mt-2">Prediksi dan proyeksi kasus kanker berbasis machine learning</p>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {predictionModels.map((model) => (
          <div key={model.title} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`${model.color} p-4 text-white`}>
              <h3 className="text-lg font-semibold">{model.title}</h3>
              <p className="text-sm opacity-90 mt-1">{model.timeframe}</p>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-gray-900">{model.predictedCases}</div>
                <div className="text-sm text-gray-600 mt-1">Kasus Diprediksi</div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Tingkat Kepercayaan</span>
                <span className="text-lg font-semibold text-green-600">{model.confidence}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${model.confidence}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-center">
                {model.trend === 'up' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {model.change}
                  </span>
                )}
                {model.trend === 'peak' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                    {model.change}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Risk Factors Visualization */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Faktor Risiko Utama</h2>
          <div className="space-y-4">
            {riskFactors.map((risk) => (
              <div key={risk.factor}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{risk.factor}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      risk.impact === 'Tinggi' ? 'bg-red-100 text-red-800' :
                      risk.impact === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.impact}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{risk.score}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${risk.color} h-3 rounded-full transition-all`}
                    style={{ width: `${risk.score * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Rekomendasi AI</p>
                <p className="text-xs text-blue-700">
                  Fokus pencegahan pada daerah urban dengan tingkat polusi tinggi.
                  Kampanye edukasi gaya hidup sehat dapat mengurangi risiko hingga 23%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Model Accuracy */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Akurasi Model</h2>
          <div className="space-y-6">
            {modelMetrics.map((metric) => (
              <div key={metric.metric} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                  <span className="text-lg font-bold text-green-600">{metric.value}</span>
                </div>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            ))}

            <div className="bg-green-50 rounded-lg p-4 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-green-900">Model Terverifikasi</p>
              </div>
              <p className="text-xs text-green-700">
                Model telah divalidasi dengan data historis 3 tahun terakhir
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Predicted Hotspots */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-xl font-semibold text-gray-900">Prediksi Hotspot Regional</h2>
          <p className="text-sm text-gray-600 mt-1">Provinsi dengan prediksi peningkatan kasus tertinggi - 3 bulan ke depan</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provinsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kasus Saat Ini
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prediksi Kasus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peningkatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tingkat Risiko
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictedHotspots.map((hotspot) => (
                <tr key={hotspot.province} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <svg className={`w-5 h-5 mr-2 ${hotspot.color}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{hotspot.province}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{hotspot.currentCases}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{hotspot.predictedCases}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-red-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-red-600">+{hotspot.increase}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      hotspot.riskLevel === 'Sangat Tinggi' ? 'bg-red-100 text-red-800' :
                      hotspot.riskLevel === 'Tinggi' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {hotspot.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Berdasarkan model prediktif AI dengan data historis 2021-2024</span>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Download Laporan Lengkap
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
