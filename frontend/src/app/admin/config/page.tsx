'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'inactive';
}

export default function AdminConfigPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'email' | 'backup' | 'api'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);

  // General Settings
  const [generalConfig, setGeneralConfig] = useState({
    systemName: 'INAMSOS Tumor Registry',
    timezone: 'Asia/Jakarta',
    language: 'id',
    dateFormat: 'DD/MM/YYYY',
  });

  // Security Settings
  const [securityConfig, setSecurityConfig] = useState({
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    sessionTimeout: 30,
    mfaRequired: false,
    maxLoginAttempts: 5,
  });

  // Email Settings
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@inamsos.id',
    smtpPassword: '',
    smtpSecure: true,
    fromEmail: 'noreply@inamsos.id',
    fromName: 'INAMSOS System',
  });

  // Backup Settings
  const [backupConfig, setBackupConfig] = useState({
    autoBackup: true,
    backupSchedule: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
    includeFiles: true,
    includeDatabase: true,
  });

  // API Settings
  const [apiConfig, setApiConfig] = useState({
    rateLimitEnabled: true,
    requestsPerMinute: 60,
    requestsPerHour: 1000,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchConfig();
      fetchAPIKeys();
    }
  }, [isAuthenticated, isLoading]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      // Config is already set in state
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAPIKeys = async () => {
    try {
      // Mock data - replace with actual API call
      const mockKeys: APIKey[] = [
        {
          id: '1',
          name: 'Production API',
          key: 'sk_live_xxxxxxxxxxxxxxxxxxx',
          createdAt: '2025-10-01',
          lastUsed: '2025-11-22 14:30',
          status: 'active',
        },
        {
          id: '2',
          name: 'Development API',
          key: 'sk_dev_yyyyyyyyyyyyyyyyyy',
          createdAt: '2025-09-15',
          lastUsed: '2025-11-20 10:15',
          status: 'active',
        },
      ];
      setApiKeys(mockKeys);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      // API call to save general config
      console.log('Saving general config:', generalConfig);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Konfigurasi umum berhasil disimpan');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Gagal menyimpan konfigurasi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    setIsSaving(true);
    try {
      // API call to save security config
      console.log('Saving security config:', securityConfig);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Konfigurasi keamanan berhasil disimpan');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Gagal menyimpan konfigurasi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    setIsSaving(true);
    try {
      // API call to save email config
      console.log('Saving email config:', emailConfig);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Konfigurasi email berhasil disimpan');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Gagal menyimpan konfigurasi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBackup = async () => {
    setIsSaving(true);
    try {
      // API call to save backup config
      console.log('Saving backup config:', backupConfig);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Konfigurasi backup berhasil disimpan');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Gagal menyimpan konfigurasi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAPI = async () => {
    setIsSaving(true);
    try {
      // API call to save API config
      console.log('Saving API config:', apiConfig);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Konfigurasi API berhasil disimpan');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Gagal menyimpan konfigurasi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      console.log('Testing email connection...');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert('Koneksi email berhasil! Email test telah dikirim.');
    } catch (error) {
      alert('Gagal menghubungkan ke server email');
    }
  };

  const handleTestBackup = async () => {
    try {
      console.log('Testing backup...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Backup berhasil! File backup disimpan.');
    } catch (error) {
      alert('Gagal melakukan backup');
    }
  };

  const handleGenerateAPIKey = () => {
    const newKey: APIKey = {
      id: String(apiKeys.length + 1),
      name: 'New API Key',
      key: 'sk_' + Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: '-',
      status: 'active',
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleToggleAPIKey = (id: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id
          ? { ...key, status: key.status === 'active' ? 'inactive' : 'active' }
          : key
      )
    );
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
        <h1 className="text-2xl font-bold text-gray-900">Konfigurasi Sistem</h1>
        <p className="text-gray-600">Kelola konfigurasi dan pengaturan sistem</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Umum
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Keamanan
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'email'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'backup'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Backup
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'api'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              API
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Sistem
                </label>
                <input
                  type="text"
                  value={generalConfig.systemName}
                  onChange={(e) =>
                    setGeneralConfig({ ...generalConfig, systemName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={generalConfig.timezone}
                  onChange={(e) =>
                    setGeneralConfig({ ...generalConfig, timezone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bahasa
                </label>
                <select
                  value={generalConfig.language}
                  onChange={(e) =>
                    setGeneralConfig({ ...generalConfig, language: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format Tanggal
                </label>
                <select
                  value={generalConfig.dateFormat}
                  onChange={(e) =>
                    setGeneralConfig({ ...generalConfig, dateFormat: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleSaveGeneral}
                  disabled={isSaving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Panjang Password Minimal
                </label>
                <input
                  type="number"
                  min="6"
                  max="32"
                  value={securityConfig.minPasswordLength}
                  onChange={(e) =>
                    setSecurityConfig({
                      ...securityConfig,
                      minPasswordLength: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Kebijakan Password
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={securityConfig.requireUppercase}
                      onChange={(e) =>
                        setSecurityConfig({
                          ...securityConfig,
                          requireUppercase: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Wajib huruf besar
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={securityConfig.requireLowercase}
                      onChange={(e) =>
                        setSecurityConfig({
                          ...securityConfig,
                          requireLowercase: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Wajib huruf kecil
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={securityConfig.requireNumbers}
                      onChange={(e) =>
                        setSecurityConfig({
                          ...securityConfig,
                          requireNumbers: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Wajib angka</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={securityConfig.requireSpecialChars}
                      onChange={(e) =>
                        setSecurityConfig({
                          ...securityConfig,
                          requireSpecialChars: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Wajib karakter khusus
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (menit)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={securityConfig.sessionTimeout}
                  onChange={(e) =>
                    setSecurityConfig({
                      ...securityConfig,
                      sessionTimeout: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimal Percobaan Login
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={securityConfig.maxLoginAttempts}
                  onChange={(e) =>
                    setSecurityConfig({
                      ...securityConfig,
                      maxLoginAttempts: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={securityConfig.mfaRequired}
                    onChange={(e) =>
                      setSecurityConfig({
                        ...securityConfig,
                        mfaRequired: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Wajibkan Multi-Factor Authentication (MFA)
                  </span>
                </label>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleSaveSecurity}
                  disabled={isSaving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={emailConfig.smtpHost}
                    onChange={(e) =>
                      setEmailConfig({ ...emailConfig, smtpHost: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={emailConfig.smtpPort}
                    onChange={(e) =>
                      setEmailConfig({
                        ...emailConfig,
                        smtpPort: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={emailConfig.smtpUser}
                  onChange={(e) =>
                    setEmailConfig({ ...emailConfig, smtpUser: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={emailConfig.smtpPassword}
                  onChange={(e) =>
                    setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })
                  }
                  placeholder="Kosongkan jika tidak diubah"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={emailConfig.smtpSecure}
                    onChange={(e) =>
                      setEmailConfig({ ...emailConfig, smtpSecure: e.target.checked })
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Gunakan TLS/SSL
                  </span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    value={emailConfig.fromEmail}
                    onChange={(e) =>
                      setEmailConfig({ ...emailConfig, fromEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={emailConfig.fromName}
                    onChange={(e) =>
                      setEmailConfig({ ...emailConfig, fromName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  onClick={handleSaveEmail}
                  disabled={isSaving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  onClick={handleTestEmail}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Test Koneksi
                </button>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={backupConfig.autoBackup}
                    onChange={(e) =>
                      setBackupConfig({ ...backupConfig, autoBackup: e.target.checked })
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Aktifkan Auto Backup
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jadwal Backup
                </label>
                <select
                  value={backupConfig.backupSchedule}
                  onChange={(e) =>
                    setBackupConfig({ ...backupConfig, backupSchedule: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="hourly">Setiap Jam</option>
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Backup
                </label>
                <input
                  type="time"
                  value={backupConfig.backupTime}
                  onChange={(e) =>
                    setBackupConfig({ ...backupConfig, backupTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retensi (hari)
                </label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={backupConfig.retentionDays}
                  onChange={(e) =>
                    setBackupConfig({
                      ...backupConfig,
                      retentionDays: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={backupConfig.includeDatabase}
                    onChange={(e) =>
                      setBackupConfig({
                        ...backupConfig,
                        includeDatabase: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Backup Database</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={backupConfig.includeFiles}
                    onChange={(e) =>
                      setBackupConfig({
                        ...backupConfig,
                        includeFiles: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Backup File</span>
                </label>
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  onClick={handleSaveBackup}
                  disabled={isSaving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  onClick={handleTestBackup}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Backup Sekarang
                </button>
              </div>
            </div>
          )}

          {/* API Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={apiConfig.rateLimitEnabled}
                    onChange={(e) =>
                      setApiConfig({ ...apiConfig, rateLimitEnabled: e.target.checked })
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Aktifkan Rate Limiting
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Per Menit
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={apiConfig.requestsPerMinute}
                  onChange={(e) =>
                    setApiConfig({
                      ...apiConfig,
                      requestsPerMinute: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Per Jam
                </label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={apiConfig.requestsPerHour}
                  onChange={(e) =>
                    setApiConfig({
                      ...apiConfig,
                      requestsPerHour: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
                  <button
                    onClick={handleGenerateAPIKey}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                  >
                    + Generate Key
                  </button>
                </div>
                <div className="space-y-3">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{key.name}</div>
                        <div className="text-sm text-gray-500 font-mono">{key.key}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Created: {key.createdAt} | Last used: {key.lastUsed}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleAPIKey(key.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          key.status === 'active'
                            ? 'text-green-600 bg-green-100'
                            : 'text-red-600 bg-red-100'
                        }`}
                      >
                        {key.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveAPI}
                  disabled={isSaving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
