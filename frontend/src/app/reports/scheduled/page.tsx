'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface ScheduledReport {
  id: string;
  name: string;
  schedule: 'daily' | 'weekly' | 'monthly';
  nextRun: string;
  recipients: string[];
  status: 'active' | 'inactive';
  lastRun?: string;
  reportType: string;
}

export default function ReportsScheduledPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    reportType: '',
    schedule: 'weekly' as 'daily' | 'weekly' | 'monthly',
    recipients: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchScheduledReports();
    }
  }, [isAuthenticated, isLoading]);

  const fetchScheduledReports = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockReports: ScheduledReport[] = [
        {
          id: 'SCH-001',
          name: 'Laporan Insidensi Mingguan',
          schedule: 'weekly',
          nextRun: '2025-11-29 08:00',
          recipients: ['dr.siti@rscm.co.id', 'admin@kemenkes.go.id'],
          status: 'active',
          lastRun: '2025-11-22 08:00',
          reportType: 'Epidemiologi',
        },
        {
          id: 'SCH-002',
          name: 'Kualitas Data Bulanan',
          schedule: 'monthly',
          nextRun: '2025-12-01 09:00',
          recipients: ['dr.budi@dharmais.co.id', 'quality@inamsos.id'],
          status: 'active',
          lastRun: '2025-11-01 09:00',
          reportType: 'Kualitas',
        },
        {
          id: 'SCH-003',
          name: 'Dashboard Eksekutif Harian',
          schedule: 'daily',
          nextRun: '2025-11-23 07:00',
          recipients: ['direktur@rscm.co.id', 'kabid@kemenkes.go.id'],
          status: 'active',
          lastRun: '2025-11-22 07:00',
          reportType: 'Administrasi',
        },
        {
          id: 'SCH-004',
          name: 'Analisis Treatment Outcomes',
          schedule: 'monthly',
          nextRun: '2025-12-15 10:00',
          recipients: ['dr.ahmad@rscm.co.id', 'research@inamsos.id'],
          status: 'active',
          lastRun: '2025-11-15 10:00',
          reportType: 'Klinis',
        },
        {
          id: 'SCH-005',
          name: 'Distribusi Geografis Kasus',
          schedule: 'weekly',
          nextRun: '2025-11-30 11:00',
          recipients: ['dr.rina@dharmais.co.id', 'epidemio@kemenkes.go.id'],
          status: 'inactive',
          lastRun: '2025-11-16 11:00',
          reportType: 'Epidemiologi',
        },
        {
          id: 'SCH-006',
          name: 'Performa Pusat Kesehatan',
          schedule: 'monthly',
          nextRun: '2025-12-01 14:00',
          recipients: ['admin@rscm.co.id', 'admin@dharmais.co.id'],
          status: 'active',
          lastRun: '2025-11-01 14:00',
          reportType: 'Administrasi',
        },
        {
          id: 'SCH-007',
          name: 'Update Pasien Baru',
          schedule: 'daily',
          nextRun: '2025-11-23 16:00',
          recipients: ['registrar@rscm.co.id'],
          status: 'inactive',
          lastRun: '2025-11-22 16:00',
          reportType: 'Administrasi',
        },
      ];

      setScheduledReports(mockReports);
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScheduleText = (schedule: string) => {
    switch (schedule) {
      case 'daily': return 'Harian';
      case 'weekly': return 'Mingguan';
      case 'monthly': return 'Bulanan';
      default: return schedule;
    }
  };

  const getScheduleBadgeColor = (schedule: string) => {
    switch (schedule) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleStatus = (report: ScheduledReport) => {
    const newStatus = report.status === 'active' ? 'inactive' : 'active';
    setScheduledReports(reports =>
      reports.map(r =>
        r.id === report.id ? { ...r, status: newStatus } : r
      )
    );
    alert(`Laporan "${report.name}" ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}`);
  };

  const handleEdit = (report: ScheduledReport) => {
    setEditingReport(report);
    setFormData({
      name: report.name,
      reportType: report.reportType,
      schedule: report.schedule,
      recipients: report.recipients.join(', '),
      status: report.status,
    });
    setShowModal(true);
  };

  const handleDelete = (report: ScheduledReport) => {
    if (confirm(`Apakah Anda yakin ingin menghapus jadwal laporan "${report.name}"?`)) {
      setScheduledReports(reports => reports.filter(r => r.id !== report.id));
      alert(`Laporan "${report.name}" berhasil dihapus`);
    }
  };

  const handleNewReport = () => {
    setEditingReport(null);
    setFormData({
      name: '',
      reportType: '',
      schedule: 'weekly',
      recipients: '',
      status: 'active',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.reportType || !formData.recipients) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const recipientsArray = formData.recipients.split(',').map(email => email.trim());

    if (editingReport) {
      // Update existing report
      setScheduledReports(reports =>
        reports.map(r =>
          r.id === editingReport.id
            ? {
                ...r,
                name: formData.name,
                reportType: formData.reportType,
                schedule: formData.schedule,
                recipients: recipientsArray,
                status: formData.status,
              }
            : r
        )
      );
      alert(`Laporan "${formData.name}" berhasil diupdate`);
    } else {
      // Create new report
      const newReport: ScheduledReport = {
        id: `SCH-${String(scheduledReports.length + 1).padStart(3, '0')}`,
        name: formData.name,
        reportType: formData.reportType,
        schedule: formData.schedule,
        recipients: recipientsArray,
        status: formData.status,
        nextRun: '2025-11-25 08:00',
        lastRun: undefined,
      };
      setScheduledReports([...scheduledReports, newReport]);
      alert(`Laporan "${formData.name}" berhasil dijadwalkan`);
    }

    setShowModal(false);
  };

  const handleRunNow = (report: ScheduledReport) => {
    alert(`Menjalankan laporan "${report.name}" sekarang...\nLaporan akan dikirim ke ${report.recipients.length} penerima.`);
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
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan Terjadwal</h1>
            <p className="text-gray-600">Kelola laporan yang dijadwalkan secara otomatis</p>
          </div>
          <button
            onClick={handleNewReport}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            + Jadwalkan Laporan Baru
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Laporan Aktif</p>
              <p className="text-2xl font-semibold text-gray-900">
                {scheduledReports.filter(r => r.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tidak Aktif</p>
              <p className="text-2xl font-semibold text-gray-900">
                {scheduledReports.filter(r => r.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jadwal</p>
              <p className="text-2xl font-semibold text-gray-900">{scheduledReports.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Laporan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jadwal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eksekusi Berikutnya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penerima
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
              {scheduledReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2">Belum ada laporan terjadwal</p>
                    </div>
                  </td>
                </tr>
              ) : (
                scheduledReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        <div className="text-xs text-gray-500">
                          {report.reportType} - {report.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getScheduleBadgeColor(report.schedule)}`}>
                        {getScheduleText(report.schedule)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.nextRun}</div>
                      {report.lastRun && (
                        <div className="text-xs text-gray-500">Terakhir: {report.lastRun}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {report.recipients.length} penerima
                      </div>
                      <div className="text-xs text-gray-500">
                        {report.recipients[0]}
                        {report.recipients.length > 1 && `, +${report.recipients.length - 1} lainnya`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(report)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          report.status === 'active' ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            report.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRunNow(report)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Jalankan Sekarang"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(report)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(report)}
                          className="text-red-600 hover:text-red-900"
                          title="Hapus"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Wizard Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingReport ? 'Edit Laporan Terjadwal' : 'Jadwalkan Laporan Baru'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Report Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Laporan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Laporan Insidensi Mingguan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Laporan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih Tipe Laporan</option>
                  <option value="Epidemiologi">Epidemiologi</option>
                  <option value="Klinis">Klinis</option>
                  <option value="Administrasi">Administrasi</option>
                  <option value="Kualitas">Kualitas</option>
                </select>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frekuensi Jadwal
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['daily', 'weekly', 'monthly'] as const).map((sched) => (
                    <button
                      key={sched}
                      type="button"
                      onClick={() => setFormData({ ...formData, schedule: sched })}
                      className={`px-4 py-3 border-2 rounded-lg font-medium transition-colors ${
                        formData.schedule === sched
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      {getScheduleText(sched)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Penerima <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  placeholder="Masukkan email penerima, pisahkan dengan koma&#10;Contoh: admin@rscm.co.id, dr.budi@dharmais.co.id"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma untuk multiple email</p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                      className="mr-2"
                    />
                    <span>Aktif</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                      className="mr-2"
                    />
                    <span>Tidak Aktif</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingReport ? 'Simpan Perubahan' : 'Jadwalkan Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
