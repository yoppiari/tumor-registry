'use client';

import React, { useEffect } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { PatientStatistics } from '@/types/patient';

interface PatientDashboardProps {
  className?: string;
}

export default function PatientDashboard({ className = '' }: PatientDashboardProps) {
  const { statistics, getStatistics, isLoading } = usePatient();

  useEffect(() => {
    getStatistics();
  }, [getStatistics]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return '0';
    return ((value / total) * 100).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Data Tidak Tersedia</h3>
          <p className="text-sm">Statistik pasien saat ini tidak dapat dimuat</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Pasien</h2>
        <p className="text-gray-600">Ringkasan statistik data pasien INAMSOS</p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pasien"
          value={formatNumber(statistics.total)}
          icon="users"
          color="blue"
        />
        <StatCard
          title="Pasien Aktif"
          value={formatNumber(statistics.active)}
          subtitle={`${getPercentage(statistics.active, statistics.total)}%`}
          icon="active"
          color="green"
        />
        <StatCard
          title="Pasien Meninggal"
          value={formatNumber(statistics.deceased)}
          subtitle={`${getPercentage(statistics.deceased, statistics.total)}%`}
          icon="deceased"
          color="red"
        />
        <StatCard
          title="Kasus Baru"
          value={formatNumber(statistics.newCases)}
          icon="new"
          color="purple"
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Jenis Kelamin</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Laki-laki</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{formatNumber(statistics.byGender.male)}</span>
                <span className="text-gray-500 ml-2 text-sm">
                  ({getPercentage(statistics.byGender.male, statistics.total)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-pink-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Perempuan</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{formatNumber(statistics.byGender.female)}</span>
                <span className="text-gray-500 ml-2 text-sm">
                  ({getPercentage(statistics.byGender.female, statistics.total)}%)
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${getPercentage(statistics.byGender.male, statistics.total)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Usia</h3>
          <div className="space-y-3">
            {Object.entries(statistics.byAgeGroup).map(([ageGroup, count]) => (
              <div key={ageGroup}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">
                    {ageGroup === '0-17' ? '0-17 tahun' :
                     ageGroup === '18-35' ? '18-35 tahun' :
                     ageGroup === '36-50' ? '36-50 tahun' :
                     ageGroup === '51-65' ? '51-65 tahun' :
                     ageGroup === '65+' ? '65+ tahun' : ageGroup}
                  </span>
                  <span className="text-sm font-medium">
                    {formatNumber(count)} ({getPercentage(count, statistics.total)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getPercentage(count, statistics.total)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancer Stage Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Stadium Kanker</h3>
          <div className="space-y-3">
            {Object.entries(statistics.byCancerStage)
              .sort(([a], [b]) => {
                // Sort by stage order: I, II, III, IV
                const stageOrder = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 };
                return (stageOrder[a as keyof typeof stageOrder] || 99) - (stageOrder[b as keyof typeof stageOrder] || 99);
              })
              .map(([stage, count]) => (
              <div key={stage}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">Stadium {stage}</span>
                  <span className="text-sm font-medium">
                    {formatNumber(count)} ({getPercentage(count, statistics.total)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getPercentage(count, statistics.total)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Pengobatan</h3>
          <div className="space-y-3">
            {Object.entries(statistics.byTreatmentStatus).map(([status, count]) => {
              const statusLabels: Record<string, string> = {
                'new': 'Baru',
                'ongoing': 'Sedang Berjalan',
                'completed': 'Selesai',
                'palliative': 'Paliatif',
                'lost_to_followup': 'Hilang Follow-up',
                'deceased': 'Meninggal'
              };

              const statusColors: Record<string, string> = {
                'new': 'bg-blue-500',
                'ongoing': 'bg-yellow-500',
                'completed': 'bg-green-500',
                'palliative': 'bg-purple-500',
                'lost_to_followup': 'bg-orange-500',
                'deceased': 'bg-red-500'
              };

              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{statusLabels[status] || status}</span>
                    <span className="text-sm font-medium">
                      {formatNumber(count)} ({getPercentage(count, statistics.total)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${statusColors[status] || 'bg-gray-500'} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${getPercentage(count, statistics.total)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      {statistics.recentRegistrations && statistics.recentRegistrations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pendaftaran Terbaru</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. RM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi Primer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Daftar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {statistics.recentRegistrations.slice(0, 5).map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.medicalRecordNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.primaryCancerDiagnosis?.primarySite || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(patient.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color: string;
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const iconColors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  const bgColors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  const getIcon = () => {
    switch (icon) {
      case 'users':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'active':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'deceased':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'new':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${iconColors[color]}`}>
          {getIcon()}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}