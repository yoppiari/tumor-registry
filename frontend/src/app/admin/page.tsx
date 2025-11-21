'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPage() {
  const { user, isAuthenticated, api } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemStats, setSystemStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🎛️' },
    { id: 'users', label: 'Manajemen User', icon: '👥' },
    { id: 'centers', label: 'Pusat Layanan', icon: '🏥' },
    { id: 'settings', label: 'Pengaturan', icon: '⚙️' },
    { id: 'audit', label: 'Audit Log', icon: '📋' },
    { id: 'backup', label: 'Backup & Restore', icon: '💾' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    // Check if user has admin privileges
    if (user?.role !== 'admin' && user?.role !== 'super_admin' && user?.role !== 'SYSTEM_ADMIN') {
      window.location.href = '/dashboard';
      return;
    }

    fetchAdminData();
  }, [isAuthenticated, user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

      // Mock admin data
      const mockSystemStats = {
        totalUsers: 1247,
        activeUsers: 987,
        totalCenters: 45,
        activeCenters: 42,
        totalPatients: 12475,
        todayRegistrations: 23,
        systemUptime: '99.97%',
        storageUsed: '2.4 TB / 5 TB',
        apiCallsToday: 45678,
        avgResponseTime: '145ms',
        errorRate: '0.12%',
      };

      const mockUsers = [
        {
          id: '1',
          name: 'Dr. Sarah Wijaya',
          email: 'sarah.wijaya@rscm.com',
          role: 'doctor',
          center: 'RSCM Jakarta',
          status: 'active',
          lastLogin: '2024-06-18T14:30:00Z',
          createdAt: '2023-01-15T10:00:00Z',
        },
        {
          id: '2',
          name: 'Dr. Budi Santoso',
          email: 'budi.santoso@rsup.com',
          role: 'doctor',
          center: 'RSUP Dr. Sardjito',
          status: 'active',
          lastLogin: '2024-06-18T09:15:00Z',
          createdAt: '2023-02-20T11:30:00Z',
        },
        {
          id: '3',
          name: 'Nur Hidayah',
          email: 'nur.hidayah@rs.com',
          role: 'nurse',
          center: 'RSUP Kariadi',
          status: 'active',
          lastLogin: '2024-06-17T16:45:00Z',
          createdAt: '2023-03-10T08:15:00Z',
        },
        {
          id: '4',
          name: 'Ahmad Fauzi',
          email: 'ahmad.fauzi@rs.com',
          role: 'admin',
          center: 'RSUP Hasan Sadikin',
          status: 'inactive',
          lastLogin: '2024-06-10T13:20:00Z',
          createdAt: '2023-01-25T14:00:00Z',
        },
      ];

      const mockCenters = [
        {
          id: '1',
          name: 'RSCM Jakarta',
          code: 'RSCM-JKT',
          type: 'hospital',
          address: 'Jl. Diponegoro No. 71, Jakarta Pusat',
          phone: '+62-21-3154238',
          email: 'info@rscm.co.id',
          status: 'active',
          patientCount: 3456,
          doctorCount: 45,
          nurseCount: 78,
          licenseExpiry: '2025-12-31',
          lastActivity: '2024-06-18T15:30:00Z',
        },
        {
          id: '2',
          name: 'RSUP Dr. Sardjito',
          code: 'RSUP-SDJ',
          type: 'hospital',
          address: 'Jl. Kesehatan No. 1, Yogyakarta',
          phone: '+62-274-587333',
          email: 'info@rsup.sardjito.go.id',
          status: 'active',
          patientCount: 2876,
          doctorCount: 38,
          nurseCount: 65,
          licenseExpiry: '2025-08-15',
          lastActivity: '2024-06-18T14:20:00Z',
        },
      ];

      const mockAuditLogs = [
        {
          id: '1',
          action: 'CREATE_PATIENT',
          user: 'Dr. Sarah Wijaya',
          userId: '1',
          resource: 'Patient #12476',
          resourceId: '12476',
          timestamp: '2024-06-18T15:45:00Z',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'success',
        },
        {
          id: '2',
          action: 'UPDATE_MEDICAL_RECORD',
          user: 'Dr. Budi Santoso',
          userId: '2',
          resource: 'Medical Record #9876',
          resourceId: '9876',
          timestamp: '2024-06-18T15:30:00Z',
          ip: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          status: 'success',
        },
        {
          id: '3',
          action: 'LOGIN_FAILED',
          user: 'Unknown',
          userId: null,
          resource: 'Authentication',
          resourceId: null,
          timestamp: '2024-06-18T15:25:00Z',
          ip: '192.168.1.200',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6)',
          status: 'failed',
        },
      ];

      setSystemStats(mockSystemStats);
      setUsers(mockUsers);
      setCenters(mockCenters);
      setAuditLogs(mockAuditLogs);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = (action, userId) => {
    console.log(`${action} user ${userId}`);
    // Implement user management actions
  };

  const handleCenterAction = (action, centerId) => {
    console.log(`${action} center ${centerId}`);
    // Implement center management actions
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

  if (user?.role !== 'admin' && user?.role !== 'super_admin' && user?.role !== 'SYSTEM_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Access Denied</div>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
              <p className="text-gray-600">INAMSOS - Sistem Informasi Kanker Nasional</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Logged in as: <span className="font-medium">{user?.name}</span>
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                user?.role === 'SYSTEM_ADMIN' ? 'bg-red-100 text-red-800' :
                user?.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.role === 'SYSTEM_ADMIN' ? 'Super Administrator' :
                 user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </span>
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
            {/* System Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{systemStats?.totalUsers}</p>
                    <p className="text-xs text-green-600">{systemStats?.activeUsers} active</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Centers</p>
                    <p className="text-2xl font-semibold text-gray-900">{systemStats?.activeCenters}</p>
                    <p className="text-xs text-gray-500">of {systemStats?.totalCenters} total</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">System Uptime</p>
                    <p className="text-2xl font-semibold text-gray-900">{systemStats?.systemUptime}</p>
                    <p className="text-xs text-green-600">Excellent</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Storage Used</p>
                    <p className="text-lg font-semibold text-gray-900">{systemStats?.storageUsed}</p>
                    <p className="text-xs text-gray-500">48% utilized</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">API Calls Today</span>
                    <span className="text-sm font-medium text-gray-900">{systemStats?.apiCallsToday?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Response Time</span>
                    <span className="text-sm font-medium text-gray-900">{systemStats?.avgResponseTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Error Rate</span>
                    <span className="text-sm font-medium text-green-600">{systemStats?.errorRate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">{systemStats?.todayRegistrations} new patients today</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">12 centers updated data</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">3 scheduled maintenance tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add New User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Center
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((userItem) => (
                      <tr key={userItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                            <div className="text-sm text-gray-500">{userItem.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            userItem.role === 'SYSTEM_ADMIN' || userItem.role === 'admin' || userItem.role === 'super_admin'
                              ? 'bg-purple-100 text-purple-800'
                              : userItem.role === 'doctor'
                              ? 'bg-blue-100 text-blue-800'
                              : userItem.role === 'nurse'
                              ? 'bg-green-100 text-green-800'
                              : userItem.role === 'researcher'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {userItem.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {userItem.center}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            userItem.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userItem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(userItem.lastLogin).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUserAction('edit', userItem.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleUserAction('reset', userItem.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Reset
                            </button>
                            {userItem.status === 'active' ? (
                              <button
                                onClick={() => handleUserAction('disable', userItem.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Disable
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction('enable', userItem.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Enable
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'centers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Center Management</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add New Center
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Center
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statistics
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        License
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {centers.map((center) => (
                      <tr key={center.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{center.name}</div>
                            <div className="text-sm text-gray-500">{center.address}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {center.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{center.phone}</div>
                          <div className="text-sm text-gray-500">{center.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{center.patientCount} patients</div>
                          <div>{center.doctorCount} doctors, {center.nurseCount} nurses</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{new Date(center.licenseExpiry).toLocaleDateString('id-ID')}</div>
                          <div className="text-xs text-green-600">Valid</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCenterAction('edit', center.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCenterAction('view', center.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleCenterAction('deactivate', center.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Deactivate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">System Settings</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">General Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        System Name
                      </label>
                      <input
                        type="text"
                        defaultValue="INAMSOS - Sistem Informasi Kanker Nasional"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Language
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Bahasa Indonesia</option>
                        <option>English</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Security Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Policy
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Standard (8 chars, letters+numbers)</option>
                        <option>Strong (12 chars, special chars)</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Notification Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      <span className="text-sm text-gray-700">Email notifications for system alerts</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      <span className="text-sm text-gray-700">Daily summary reports</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-sm text-gray-700">SMS notifications for critical events</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Audit Logs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resource
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
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.resource}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.ip}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            log.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status}
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

        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Management</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Daily Backup</span>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Every day at 2:00 AM WIB</p>
                    <div className="text-sm text-gray-500">
                      Last backup: June 18, 2024 at 2:00 AM<br />
                      Next backup: June 19, 2024 at 2:00 AM
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Weekly Full Backup</span>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Every Sunday at 3:00 AM WIB</p>
                    <div className="text-sm text-gray-500">
                      Last backup: June 16, 2024 at 3:00 AM<br />
                      Next backup: June 23, 2024 at 3:00 AM
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create Manual Backup
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Restore Management</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Backup File
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3">
                      <option>backup_2024_06_18_02_00.sql</option>
                      <option>backup_2024_06_17_02_00.sql</option>
                      <option>backup_2024_06_16_02_00.sql</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restore Options
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="restore" defaultChecked className="mr-2" />
                        <span className="text-sm text-gray-700">Full restore (replace all data)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="restore" className="mr-2" />
                        <span className="text-sm text-gray-700">Partial restore (select tables)</span>
                      </label>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    Restore Database
                  </button>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Warning:</strong> Database restore will overwrite current data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}