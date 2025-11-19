'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ResearchPage() {
  const { user, isAuthenticated, api } = useAuth();
  const [activeTab, setActiveTab] = useState('discovery');
  const [datasets, setDatasets] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'discovery', label: 'Data Discovery', icon: '🔍' },
    { id: 'collaboration', label: 'Kolaborasi', icon: '🤝' },
    { id: 'analysis', label: 'Analisis', icon: '📊' },
    { id: 'publications', label: 'Publikasi', icon: '📚' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    fetchResearchData();
  }, [isAuthenticated]);

  const fetchResearchData = async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

      // Mock data for demonstration
      const mockDatasets = [
        {
          id: '1',
          name: 'Data Kanker Payudara Indonesia 2020-2024',
          description: 'Dataset komprehensif 50,000 pasien kanker payudara dari 20 rumah sakit',
          size: '2.5 GB',
          records: 50000,
          variables: 127,
          accessibility: 'open',
          centerId: user?.centerId,
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          name: 'Survival Analysis - Kanker Paru',
          description: 'Analisis survival 15,000 pasien kanker paru dengan follow-up 5 tahun',
          size: '850 MB',
          records: 15000,
          variables: 89,
          accessibility: 'restricted',
          centerId: user?.centerId,
          createdAt: '2024-03-20',
        },
        {
          id: '3',
          name: 'Molecular Markers Study',
          description: 'Data marker molekuler untuk kanker serviks dan ovarium',
          size: '1.2 GB',
          records: 8500,
          variables: 156,
          accessibility: 'collaborative',
          centerId: user?.centerId,
          createdAt: '2024-06-10',
        },
      ];

      const mockCollaborations = [
        {
          id: '1',
          title: 'Multi-Center Breast Cancer Study',
          description: 'Studi kolaboratif pola penyebaran dan faktor risiko kanker payudara',
          status: 'active',
          participants: 12,
          centers: ['RSCM Jakarta', 'RSUP Dr. Sardjito', 'RSUP Kariadi', 'RSUP Hasan Sadikin'],
          role: 'contributor',
          progress: 68,
        },
        {
          id: '2',
          title: 'Molecular Profiling of Lung Cancer',
          description: 'Profil molekuler kanker paru pada populasi Indonesia',
          status: 'planning',
          participants: 8,
          centers: ['RSCM Jakarta', 'RSUP Cipto Mangunkusumo'],
          role: 'lead',
          progress: 15,
        },
      ];

      setDatasets(mockDatasets);
      setCollaborations(mockCollaborations);
    } catch (error) {
      console.error('Error fetching research data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold text-gray-900">Platform Penelitian</h1>
              <p className="text-gray-600">INAMSOS - Sistem Informasi Kanker Nasional</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Buat Proposal Penelitian
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Unduh Data
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
        {activeTab === 'discovery' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Jelajahi Dataset</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Cari dataset..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Semua Tipe</option>
                    <option>Klinis</option>
                    <option>Genomik</option>
                    <option>Survival</option>
                  </select>
                </div>
              </div>

              {/* Dataset Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDatasets.map((dataset) => (
                  <div key={dataset.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">{dataset.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        dataset.accessibility === 'open'
                          ? 'bg-green-100 text-green-800'
                          : dataset.accessibility === 'restricted'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {dataset.accessibility === 'open' ? 'Open' :
                         dataset.accessibility === 'restricted' ? 'Restricted' : 'Collaborative'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{dataset.description}</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>{dataset.records.toLocaleString()} records</span>
                      <span>{dataset.variables} variabel</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>Ukuran: {dataset.size}</span>
                      <span>{new Date(dataset.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                        Akses Data
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                        Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collaboration' && (
          <div className="space-y-6">
            {/* Active Collaborations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Kolaborasi Aktif</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Ajukan Kolaborasi Baru
                </button>
              </div>

              <div className="space-y-4">
                {collaborations.map((collab) => (
                  <div key={collab.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{collab.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{collab.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>👥 {collab.participants} peserta</span>
                          <span>🏥 {collab.centers.length} rumah sakit</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            collab.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {collab.status === 'active' ? 'Aktif' : 'Perencanaan'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-2">
                          {collab.role === 'lead' ? 'Lead Investigator' : 'Kontributor'}
                        </span>
                        <div className="text-sm text-gray-500">Progress: {collab.progress}%</div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-2 bg-blue-600 rounded-full"
                            style={{ width: `${collab.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Lihat Detail
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Buka Ruang Kerja
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaboration Opportunities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Peluang Kolaborasi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Multi-Center Lung Cancer Study</h3>
                  <p className="text-sm text-gray-600 mb-3">Mencari partner untuk studi kanker paru multi-center</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Deadline: 30 hari lagi</span>
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      Daftar
                    </button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Molecular Data Integration</h3>
                  <p className="text-sm text-gray-600 mb-3">Integrasi data klinis dan genomik kanker payudara</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Deadline: 45 hari lagi</span>
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      Daftar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Analysis Tools */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Alat Analisis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-3xl mb-4">📈</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Survival Analysis</h3>
                  <p className="text-sm text-gray-600 mb-4">Analisis Kaplan-Meier dan Cox Regression</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Mulai Analisis
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-3xl mb-4">🧬</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Genomic Analysis</h3>
                  <p className="text-sm text-gray-600 mb-4">Analisis marker molekuler dan pathway</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Mulai Analisis
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-3xl mb-4">🗺️</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Geospatial Analysis</h3>
                  <p className="text-sm text-gray-600 mb-4">Pemetaan distribusi kanker regional</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Mulai Analisis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'publications' && (
          <div className="space-y-6">
            {/* Publications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Publikasi</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Tambah Publikasi
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Breast Cancer Survival Rates in Indonesian Population: A 5-Year Retrospective Study
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Published in Journal of Cancer Epidemiology, Volume 42, Issue 3
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>👥 8 authors</span>
                      <span>📊 15,000 samples</span>
                      <span>🏥 12 centers</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                        View PDF
                      </button>
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                        Cite
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}