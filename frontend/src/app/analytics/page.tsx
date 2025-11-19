'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AnalyticsPage() {
  const { user, isAuthenticated, api } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedProvince, setSelectedProvince] = useState('');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'trends', label: 'Tren Kanker', icon: '📈' },
    { id: 'geographic', label: 'Analisis Geografis', icon: '🗺️' },
    { id: 'predictive', label: 'Analisis Prediktif', icon: '🤖' },
    { id: 'reports', label: 'Laporan', icon: '📑' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    fetchAnalyticsData();
  }, [isAuthenticated, timeRange, selectedProvince]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

      // Mock analytics data
      const mockData = {
        overview: {
          totalPatients: 12475,
          newCasesThisMonth: 342,
          activeTreatments: 8765,
          survivalRate: 72.5,
          averageAge: 52.3,
          femalePercentage: 67.8,
        },
        cancerDistribution: [
          { type: 'Payudara', count: 3420, percentage: 27.4, trend: '+2.3%' },
          { type: 'Serviks', count: 2187, percentage: 17.5, trend: '+1.8%' },
          { type: 'Paru-paru', count: 1987, percentage: 15.9, trend: '-0.5%' },
          { type: 'Hati', count: 1543, percentage: 12.4, trend: '+3.2%' },
          { type: 'Usus Besar', count: 1234, percentage: 9.9, trend: '+1.1%' },
          { type: 'Lainnya', count: 2104, percentage: 16.9, trend: '+0.8%' },
        ],
        treatmentStatus: [
          { status: 'Aktif', count: 8765, percentage: 70.3 },
          { status: 'Selesai', count: 2234, percentage: 17.9 },
          { status: 'Paliatif', count: 1098, percentage: 8.8 },
          { status: 'Hilang Follow-up', count: 378, percentage: 3.0 },
        ],
        monthlyTrends: [
          { month: 'Jan', cases: 245, deaths: 67, newPatients: 89 },
          { month: 'Feb', cases: 267, deaths: 71, newPatients: 92 },
          { month: 'Mar', cases: 289, deaths: 73, newPatients: 101 },
          { month: 'Apr', cases: 312, deaths: 78, newPatients: 108 },
          { month: 'May', cases: 298, deaths: 82, newPatients: 95 },
          { month: 'Jun', cases: 334, deaths: 85, newPatients: 112 },
        ],
        geographicData: [
          { province: 'DKI Jakarta', cases: 2876, population: 10562088, rate: 27.23 },
          { province: 'Jawa Barat', cases: 2341, population: 48274162, rate: 4.85 },
          { province: 'Jawa Tengah', cases: 1876, population: 36516035, rate: 5.14 },
          { province: 'Jawa Timur', cases: 1654, population: 40665696, rate: 4.07 },
          { province: 'Sumatera Utara', cases: 1234, population: 14799361, rate: 8.34 },
        ],
        riskFactors: [
          { factor: 'Merokok', percentage: 32.5, impact: 'High' },
          { factor: 'Obesitas', percentage: 28.7, impact: 'Medium' },
          { factor: 'Alkohol', percentage: 12.3, impact: 'Medium' },
          { factor: 'Paparan Kimia', percentage: 8.9, impact: 'High' },
          { factor: 'Riwayat Keluarga', percentage: 15.6, impact: 'High' },
        ],
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Intelligence</h1>
              <p className="text-gray-600">INAMSOS - Sistem Informasi Kanker Nasional</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">7 Hari Terakhir</option>
                <option value="30d">30 Hari Terakhir</option>
                <option value="90d">90 Hari Terakhir</option>
                <option value="1y">1 Tahun</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                📥 Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Total Pasien</span>
                  <span className="text-green-600 text-sm">+12.3%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview?.totalPatients.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total terdaftar</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Kasus Baru</span>
                  <span className="text-green-600 text-sm">+5.7%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview?.newCasesThisMonth}
                </div>
                <div className="text-sm text-gray-500">Bulan ini</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Survival Rate</span>
                  <span className="text-green-600 text-sm">+2.1%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview?.survivalRate}%
                </div>
                <div className="text-sm text-gray-500">5-year survival</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Usia Rata-rata</span>
                  <span className="text-red-600 text-sm">-0.5%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardData?.overview?.averageAge} tahun
                </div>
                <div className="text-sm text-gray-500">Diagnosis</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cancer Distribution */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Jenis Kanker</h3>
                <div className="space-y-3">
                  {dashboardData?.cancerDistribution?.map((cancer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{cancer.type}</span>
                          <span className="text-sm text-gray-500">{cancer.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${cancer.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="ml-4 text-sm text-green-600">{cancer.trend}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Pengobatan</h3>
                <div className="space-y-3">
                  {dashboardData?.treatmentStatus?.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{status.status}</span>
                          <span className="text-sm text-gray-500">{status.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${status.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="ml-4 text-sm font-medium text-gray-900">
                        {status.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tren Bulanan</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bulan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Kasus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kematian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pasien Baru
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mortalitas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData?.monthlyTrends?.map((trend, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trend.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trend.cases}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trend.deaths}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trend.newPatients}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            ((trend.deaths / trend.cases) * 100) < 25
                              ? 'bg-green-100 text-green-800'
                              : ((trend.deaths / trend.cases) * 100) < 30
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {((trend.deaths / trend.cases) * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            {/* Cancer Trends Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisis Tren Kanker</h3>

              {/* Risk Factors */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Faktor Risiko Utama</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardData?.riskFactors?.map((risk, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{risk.factor}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          risk.impact === 'High'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {risk.impact} Risk
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-600 h-2 rounded-full"
                              style={{ width: `${risk.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          {risk.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Predictive Insights */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Insight Prediktif</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h5 className="font-medium text-gray-900 mb-3">Prediksi Kasus 6 Bulan ke Depan</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Bulan 1-3 (Q3)</span>
                        <span className="text-sm font-medium text-gray-900">1,245 - 1,320 kasus</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Bulan 4-6 (Q4)</span>
                        <span className="text-sm font-medium text-gray-900">1,380 - 1,450 kasus</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h5 className="font-medium text-gray-900 mb-3">Area Perhatian Khusus</h5>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                        <span className="text-sm text-gray-600">Penurunan survival rate kanker paru</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                        <span className="text-sm text-gray-600">Peningkatan kasus kanker hati di Jawa Timur</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                        <span className="text-sm text-gray-600">Kebutuhan tambahan fasilitas di area timur</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'geographic' && (
          <div className="space-y-6">
            {/* Geographic Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisis Geografis</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter berdasarkan Provinsi
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Provinsi</option>
                  {dashboardData?.geographicData?.map((geo) => (
                    <option key={geo.province} value={geo.province}>
                      {geo.province}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provinsi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Kasus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Populasi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate per 100rb
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risiko
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData?.geographicData?.map((geo, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {geo.province}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {geo.cases.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {geo.population.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {geo.rate.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            geo.rate > 20
                              ? 'bg-red-100 text-red-800'
                              : geo.rate > 10
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {geo.rate > 20 ? 'Tinggi' : geo.rate > 10 ? 'Sedang' : 'Rendah'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'predictive' && (
          <div className="space-y-6">
            {/* Predictive Analytics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Model Prediktif & AI</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Early Detection Model</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Machine learning model untuk deteksi dini kanker berdasarkan data klinis dan demografis
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Accuracy</span>
                      <span className="text-sm font-medium text-gray-900">87.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Precision</span>
                      <span className="text-sm font-medium text-gray-900">85.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Recall</span>
                      <span className="text-sm font-medium text-gray-900">89.1%</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Test Model
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Survival Prediction</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Prediksi survival rate 5-tahun berdasarkan karakteristik pasien dan jenis kanker
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cox Regression</span>
                      <span className="text-sm font-medium text-gray-900">AUC: 0.82</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Random Forest</span>
                      <span className="text-sm font-medium text-gray-900">AUC: 0.85</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Neural Network</span>
                      <span className="text-sm font-medium text-gray-900">AUC: 0.88</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Run Prediction
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Reports Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Laporan Tersedia</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Buat Laporan Baru
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-4">📊</div>
                  <h4 className="font-medium text-gray-900 mb-2">Monthly Report</h4>
                  <p className="text-sm text-gray-600 mb-4">Laporan bulanan lengkap dengan semua metrik</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>Updated: 2 hari lalu</span>
                    <span>PDF, Excel</span>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Download
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-4">🗺️</div>
                  <h4 className="font-medium text-gray-900 mb-2">Geographic Report</h4>
                  <p className="text-sm text-gray-600 mb-4">Analisis distribusi kanker per provinsi</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>Updated: 1 minggu lalu</span>
                    <span>PDF, Maps</span>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Download
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-4">🔬</div>
                  <h4 className="font-medium text-gray-900 mb-2">Research Report</h4>
                  <p className="text-sm text-gray-600 mb-4">Laporan penelitian dan analisis mendalam</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>Updated: 2 minggu lalu</span>
                    <span>PDF, Raw Data</span>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}