'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import centersService, { Center } from '@/services/centers.service';

interface CenterUI {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  activeUsers: number;
  totalPatients: number;
  status: 'active' | 'inactive';
  code: string;
  regency?: string | null;
}

export default function AdminCentersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [centers, setCenters] = useState<CenterUI[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<CenterUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<CenterUI | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    province: '',
    phone: '',
    email: '',
  });

  // Stats
  const [stats, setStats] = useState({
    totalCenters: 0,
    activeCenters: 0,
    totalPatients: 0,
    totalUsers: 0,
  });

  const provinces = [
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'DI Yogyakarta',
    'Banten',
    'Sumatera Utara',
    'Sumatera Barat',
    'Sumatera Selatan',
    'Riau',
    'Aceh',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Sulawesi Selatan',
    'Bali',
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchCenters();
      fetchStatistics();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    filterCenters();
    calculateStats();
  }, [centers, searchTerm, provinceFilter, statusFilter]);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await centersService.fetchCenters(true); // Include inactive centers

      // Transform backend data to UI format
      const transformedCenters: CenterUI[] = data.map((center) => ({
        id: center.id,
        name: center.name,
        code: center.code,
        address: center.address || 'N/A',
        city: center.regency || 'N/A',
        province: center.province,
        phone: 'N/A', // Not in backend schema yet
        email: 'N/A', // Not in backend schema yet
        activeUsers: center._count?.users || 0,
        totalPatients: 0, // Will need to be calculated from patients count in future
        status: center.isActive ? 'active' : 'inactive',
        regency: center.regency,
      }));

      setCenters(transformedCenters);
    } catch (error: any) {
      console.error('Error fetching centers:', error);
      setError(error.response?.data?.message || 'Gagal memuat data pusat');
      alert('Gagal memuat data pusat. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await centersService.fetchStatistics();

      // Note: totalPatients and totalUsers will need to be calculated differently
      // For now, using centerUserStats for user count
      const totalUsers = stats.centerUserStats.reduce((sum, center) => sum + center.userCount, 0);

      setStats({
        totalCenters: stats.totalCenters,
        activeCenters: stats.activeCenters,
        totalPatients: 0, // TODO: Calculate from patients
        totalUsers: totalUsers,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Don't show alert for stats error, just use local calculation
    }
  };

  const filterCenters = () => {
    let filtered = [...centers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Province filter
    if (provinceFilter !== 'all') {
      filtered = filtered.filter((c) => c.province === provinceFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredCenters(filtered);
  };

  const calculateStats = () => {
    const activeCenters = centers.filter((c) => c.status === 'active').length;
    const totalPatients = centers.reduce((sum, c) => sum + c.totalPatients, 0);
    const totalUsers = centers.reduce((sum, c) => sum + c.activeUsers, 0);

    setStats({
      totalCenters: centers.length,
      activeCenters,
      totalPatients,
      totalUsers,
    });
  };

  const handleAddCenter = () => {
    setFormData({
      name: '',
      code: '',
      address: '',
      city: '',
      province: '',
      phone: '',
      email: '',
    });
    setShowAddModal(true);
  };

  const handleEditCenter = (center: CenterUI) => {
    setSelectedCenter(center);
    setFormData({
      name: center.name,
      code: center.code,
      address: center.address,
      city: center.city,
      province: center.province,
      phone: center.phone,
      email: center.email,
    });
    setShowEditModal(true);
  };

  const handleViewDetails = (center: CenterUI) => {
    setSelectedCenter(center);
    setShowDetailsModal(true);
  };

  const handleToggleStatus = async (centerId: string) => {
    const center = centers.find((c) => c.id === centerId);
    if (!center) return;

    try {
      if (center.status === 'active') {
        await centersService.deactivateCenter(centerId);
        alert('Pusat berhasil dinonaktifkan');
      } else {
        await centersService.activateCenter(centerId);
        alert('Pusat berhasil diaktifkan');
      }

      // Refresh centers list
      await fetchCenters();
      await fetchStatistics();
    } catch (error: any) {
      console.error('Error toggling center status:', error);
      const errorMessage = error.response?.data?.message || 'Gagal mengubah status pusat';
      alert(errorMessage);
    }
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await centersService.createCenter({
        name: formData.name,
        code: formData.code.toUpperCase(),
        province: formData.province,
        regency: formData.city || undefined,
        address: formData.address || undefined,
      });

      alert('Pusat berhasil ditambahkan');
      setShowAddModal(false);

      // Refresh centers list
      await fetchCenters();
      await fetchStatistics();
    } catch (error: any) {
      console.error('Error creating center:', error);
      const errorMessage = error.response?.data?.message || 'Gagal menambahkan pusat';
      alert(errorMessage);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCenter) return;

    try {
      await centersService.updateCenter(selectedCenter.id, {
        name: formData.name,
        province: formData.province,
        regency: formData.city || undefined,
        address: formData.address || undefined,
      });

      alert('Pusat berhasil diperbarui');
      setShowEditModal(false);

      // Refresh centers list
      await fetchCenters();
      await fetchStatistics();
    } catch (error: any) {
      console.error('Error updating center:', error);
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui pusat';
      alert(errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'text-green-600 bg-green-100'
      : 'text-red-600 bg-red-100';
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Mengarahkan ke login...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Pusat</h1>
            <p className="text-gray-600">Kelola pusat tumor muskuloskeletal</p>
          </div>
          <button
            onClick={handleAddCenter}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            + Tambah Pusat
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pusat</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCenters}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pusat Aktif</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeCenters}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pasien</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari
            </label>
            <input
              type="text"
              placeholder="Nama, kota, atau kode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provinsi
            </label>
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Semua Provinsi</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Centers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Pusat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provinsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengguna Aktif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Pasien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCenters.map((center) => (
                <tr key={center.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{center.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{center.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{center.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{center.province}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{center.activeUsers}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{center.totalPatients}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(center.id)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        center.status
                      )} hover:opacity-80`}
                    >
                      {center.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEditCenter(center)}
                      className="text-green-600 hover:text-green-900 font-medium mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleViewDetails(center)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCenters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data pusat yang ditemukan
            </div>
          )}
        </div>
      </div>

      {/* Add Center Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tambah Pusat Baru
            </h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pusat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Pusat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="Contoh: RSCM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kota/Kabupaten
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provinsi <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Tambah Pusat
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Center Modal */}
      {showEditModal && selectedCenter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Edit Pusat
            </h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Pusat
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.code}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Kode pusat tidak dapat diubah</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pusat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kota/Kabupaten
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provinsi <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedCenter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Detail Pusat
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Kode Pusat</label>
                <p className="text-sm text-gray-900 mt-1 font-mono">{selectedCenter.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Nama Pusat</label>
                <p className="text-sm text-gray-900 mt-1">{selectedCenter.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Alamat</label>
                <p className="text-sm text-gray-900 mt-1">{selectedCenter.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Kota/Kabupaten</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedCenter.city}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Provinsi</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedCenter.province}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Pengguna Aktif</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedCenter.activeUsers}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Total Pasien</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedCenter.totalPatients}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      selectedCenter.status
                    )}`}
                  >
                    {selectedCenter.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
