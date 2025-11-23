'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: 'Login' | 'Create' | 'Update' | 'Delete' | 'View' | 'Export';
  resource: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

export default function AdminAuditPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Auto-refresh
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter, statusFilter, startDate, endDate]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchLogs();
      }, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          timestamp: '2025-11-22 14:35:22',
          user: 'Dr. Ahmad Sutanto',
          userId: '1',
          action: 'Create',
          resource: 'Patient Record',
          details: 'Created patient record #12345',
          ipAddress: '192.168.1.101',
          status: 'success',
        },
        {
          id: '2',
          timestamp: '2025-11-22 14:30:15',
          user: 'Siti Nurhaliza',
          userId: '2',
          action: 'Update',
          resource: 'Patient Record',
          details: 'Updated diagnosis for patient #12340',
          ipAddress: '192.168.1.102',
          status: 'success',
        },
        {
          id: '3',
          timestamp: '2025-11-22 14:25:43',
          user: 'Budi Santoso',
          userId: '3',
          action: 'View',
          resource: 'Patient Record',
          details: 'Viewed patient record #12338',
          ipAddress: '192.168.1.103',
          status: 'success',
        },
        {
          id: '4',
          timestamp: '2025-11-22 14:20:08',
          user: 'Ratna Dewi',
          userId: '4',
          action: 'Login',
          resource: 'Authentication',
          details: 'User login failed - incorrect password',
          ipAddress: '192.168.1.104',
          status: 'failed',
        },
        {
          id: '5',
          timestamp: '2025-11-22 14:15:55',
          user: 'Eko Prasetyo',
          userId: '5',
          action: 'Export',
          resource: 'Report',
          details: 'Exported monthly cancer registry report',
          ipAddress: '192.168.1.105',
          status: 'success',
        },
        {
          id: '6',
          timestamp: '2025-11-22 14:10:32',
          user: 'Maya Sari',
          userId: '6',
          action: 'Create',
          resource: 'User Account',
          details: 'Created new user account for Joko Widodo',
          ipAddress: '192.168.1.106',
          status: 'success',
        },
        {
          id: '7',
          timestamp: '2025-11-22 14:05:18',
          user: 'Dr. Ahmad Sutanto',
          userId: '1',
          action: 'Update',
          resource: 'Center Settings',
          details: 'Updated center contact information',
          ipAddress: '192.168.1.101',
          status: 'success',
        },
        {
          id: '8',
          timestamp: '2025-11-22 14:00:44',
          user: 'Dewi Lestari',
          userId: '8',
          action: 'Delete',
          resource: 'Patient Record',
          details: 'Attempted to delete patient record #12330',
          ipAddress: '192.168.1.108',
          status: 'failed',
        },
        {
          id: '9',
          timestamp: '2025-11-22 13:55:27',
          user: 'Hendra Gunawan',
          userId: '9',
          action: 'Login',
          resource: 'Authentication',
          details: 'User login successful',
          ipAddress: '192.168.1.109',
          status: 'success',
        },
        {
          id: '10',
          timestamp: '2025-11-22 13:50:12',
          user: 'Rina Kusuma',
          userId: '10',
          action: 'View',
          resource: 'Analytics Dashboard',
          details: 'Viewed cancer statistics dashboard',
          ipAddress: '192.168.1.110',
          status: 'success',
        },
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.resource.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((log) => log.status === statusFilter);
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter((log) => log.timestamp >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((log) => log.timestamp <= endDate + ' 23:59:59');
    }

    setFilteredLogs(filtered);
  };

  const handleExportLogs = () => {
    console.log('Exporting logs...');
    alert('Ekspor log audit dimulai');
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Login':
        return 'text-blue-600 bg-blue-100';
      case 'Create':
        return 'text-green-600 bg-green-100';
      case 'Update':
        return 'text-yellow-600 bg-yellow-100';
      case 'Delete':
        return 'text-red-600 bg-red-100';
      case 'View':
        return 'text-purple-600 bg-purple-100';
      case 'Export':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'success'
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
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Log Audit</h1>
            <p className="text-gray-600">Pantau aktivitas dan log sistem</p>
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span>Auto-refresh (30s)</span>
            </label>
            <button
              onClick={handleExportLogs}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Ekspor Log
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari
            </label>
            <input
              type="text"
              placeholder="User atau aksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Aksi
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Semua Aksi</option>
              <option value="Login">Login</option>
              <option value="Create">Create</option>
              <option value="Update">Update</option>
              <option value="Delete">Delete</option>
              <option value="View">View</option>
              <option value="Export">Export</option>
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
              <option value="success">Berhasil</option>
              <option value="failed">Gagal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              100 Log Terakhir
            </h2>
            <span className="text-sm text-gray-500">
              {filteredLogs.length} dari {logs.length} log
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.timestamp}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {log.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{log.resource}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {log.details}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{log.ipAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        log.status
                      )}`}
                    >
                      {log.status === 'success' ? 'Berhasil' : 'Gagal'}
                    </span>
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
