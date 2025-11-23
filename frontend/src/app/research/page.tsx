'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface ResearchData {
  id: string;
  patientId: string;
  cancerType: string;
  stage: string;
  age: number;
  gender: string;
  diagnosisDate: string;
  treatment: string;
  outcome: string;
}

interface FilterCriteria {
  cancerType: string;
  stage: string;
  ageMin: string;
  ageMax: string;
  gender: string;
  yearFrom: string;
  yearTo: string;
}

export default function ResearchPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState({
    totalRecords: 0,
    filteredRecords: 0,
    cancerTypes: 0,
    avgAge: 0,
  });
  const [data, setData] = useState<ResearchData[]>([]);
  const [filteredData, setFilteredData] = useState<ResearchData[]>([]);
  const [filters, setFilters] = useState<FilterCriteria>({
    cancerType: '',
    stage: '',
    ageMin: '',
    ageMax: '',
    gender: '',
    yearFrom: '',
    yearTo: '',
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchResearchData();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    applyFilters();
  }, [filters, data]);

  const fetchResearchData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData: ResearchData[] = [
        {
          id: '1',
          patientId: 'P-2025-001',
          cancerType: 'Kanker Payudara',
          stage: 'II',
          age: 45,
          gender: 'Perempuan',
          diagnosisDate: '2025-01-15',
          treatment: 'Kemoterapi + Radiasi',
          outcome: 'Remisi Parsial',
        },
        {
          id: '2',
          patientId: 'P-2025-002',
          cancerType: 'Kanker Paru',
          stage: 'III',
          age: 58,
          gender: 'Laki-laki',
          diagnosisDate: '2025-02-20',
          treatment: 'Targeted Therapy',
          outcome: 'Stabil',
        },
        {
          id: '3',
          patientId: 'P-2025-003',
          cancerType: 'Kanker Serviks',
          stage: 'I',
          age: 38,
          gender: 'Perempuan',
          diagnosisDate: '2025-03-10',
          treatment: 'Operasi',
          outcome: 'Remisi Lengkap',
        },
        {
          id: '4',
          patientId: 'P-2025-004',
          cancerType: 'Kanker Kolorektal',
          stage: 'IV',
          age: 62,
          gender: 'Laki-laki',
          diagnosisDate: '2025-04-05',
          treatment: 'Kemoterapi',
          outcome: 'Progresif',
        },
        {
          id: '5',
          patientId: 'P-2025-005',
          cancerType: 'Kanker Payudara',
          stage: 'III',
          age: 52,
          gender: 'Perempuan',
          diagnosisDate: '2025-05-12',
          treatment: 'Kemoterapi + Imunoterapi',
          outcome: 'Remisi Parsial',
        },
        {
          id: '6',
          patientId: 'P-2025-006',
          cancerType: 'Kanker Hati',
          stage: 'II',
          age: 55,
          gender: 'Laki-laki',
          diagnosisDate: '2025-06-18',
          treatment: 'Operasi + Kemoterapi',
          outcome: 'Stabil',
        },
        {
          id: '7',
          patientId: 'P-2025-007',
          cancerType: 'Kanker Paru',
          stage: 'I',
          age: 48,
          gender: 'Laki-laki',
          diagnosisDate: '2025-07-22',
          treatment: 'Operasi',
          outcome: 'Remisi Lengkap',
        },
        {
          id: '8',
          patientId: 'P-2025-008',
          cancerType: 'Kanker Ovarium',
          stage: 'III',
          age: 60,
          gender: 'Perempuan',
          diagnosisDate: '2025-08-30',
          treatment: 'Operasi + Kemoterapi',
          outcome: 'Remisi Parsial',
        },
      ];

      setData(mockData);
      setFilteredData(mockData);

      const uniqueCancerTypes = new Set(mockData.map(d => d.cancerType)).size;
      const avgAge = mockData.reduce((sum, d) => sum + d.age, 0) / mockData.length;

      setStats({
        totalRecords: mockData.length,
        filteredRecords: mockData.length,
        cancerTypes: uniqueCancerTypes,
        avgAge: Math.round(avgAge),
      });
    } catch (error) {
      console.error('Error fetching research data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...data];

    if (filters.cancerType) {
      filtered = filtered.filter(d => d.cancerType === filters.cancerType);
    }
    if (filters.stage) {
      filtered = filtered.filter(d => d.stage === filters.stage);
    }
    if (filters.gender) {
      filtered = filtered.filter(d => d.gender === filters.gender);
    }
    if (filters.ageMin) {
      filtered = filtered.filter(d => d.age >= parseInt(filters.ageMin));
    }
    if (filters.ageMax) {
      filtered = filtered.filter(d => d.age <= parseInt(filters.ageMax));
    }
    if (filters.yearFrom) {
      filtered = filtered.filter(d => new Date(d.diagnosisDate).getFullYear() >= parseInt(filters.yearFrom));
    }
    if (filters.yearTo) {
      filtered = filtered.filter(d => new Date(d.diagnosisDate).getFullYear() <= parseInt(filters.yearTo));
    }

    setFilteredData(filtered);
    setStats(prev => ({ ...prev, filteredRecords: filtered.length }));
  };

  const handleFilterChange = (field: keyof FilterCriteria, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      cancerType: '',
      stage: '',
      ageMin: '',
      ageMax: '',
      gender: '',
      yearFrom: '',
      yearTo: '',
    });
  };

  const handleExportData = () => {
    alert('Exporting data...\nFitur ini akan segera diimplementasikan.');
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Browse Data Penelitian</h1>
            <p className="text-gray-600">Akses dan analisis data kanker untuk penelitian</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              {showFilters ? 'Sembunyikan' : 'Tampilkan'} Filter
            </button>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Filtered Records</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.filteredRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancer Types</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.cancerTypes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Age</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgAge}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filter Data</h2>
            <button
              onClick={handleResetFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Reset Filter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kanker</label>
              <select
                value={filters.cancerType}
                onChange={(e) => handleFilterChange('cancerType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Semua</option>
                <option value="Kanker Payudara">Kanker Payudara</option>
                <option value="Kanker Paru">Kanker Paru</option>
                <option value="Kanker Serviks">Kanker Serviks</option>
                <option value="Kanker Kolorektal">Kanker Kolorektal</option>
                <option value="Kanker Hati">Kanker Hati</option>
                <option value="Kanker Ovarium">Kanker Ovarium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stadium</label>
              <select
                value={filters.stage}
                onChange={(e) => handleFilterChange('stage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Semua</option>
                <option value="I">Stadium I</option>
                <option value="II">Stadium II</option>
                <option value="III">Stadium III</option>
                <option value="IV">Stadium IV</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Semua</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usia (Min-Max)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={filters.ageMin}
                  onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  value={filters.ageMax}
                  onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Hasil Penelusuran ({filteredData.length} records)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Kanker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stadium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Kelamin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Treatment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outcome
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.patientId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.cancerType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {record.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.gender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.diagnosisDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{record.treatment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.outcome === 'Remisi Lengkap' ? 'bg-green-100 text-green-800' :
                      record.outcome === 'Remisi Parsial' ? 'bg-yellow-100 text-yellow-800' :
                      record.outcome === 'Stabil' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-500">Tidak ada data yang sesuai dengan kriteria filter</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
