'use client';

import React, { useState, useEffect } from 'react';
import MobilePage, { MobileStatusCard, MobileStats, MobileCard, MobileAlert, MobileLoading, MobileListItem } from '@/components/mobile/MobilePage';
import {
  HomeIcon,
  UserIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  HeartIcon,
  DocumentTextIcon,
  ClockIcon,
  PlusIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function MobileDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <MobilePage title="Dashboard" showSearch={false}>
        <MobileLoading message="Memuat dashboard..." />
      </MobilePage>
    );
  }

  const stats = [
    {
      label: 'Total Pasien',
      value: '2,543',
      change: 12.5,
      icon: <UserGroupIcon />
    },
    {
      label: 'Janji Hari Ini',
      value: '28',
      change: -5.3,
      icon: <CalendarIcon />
    },
    {
      label: 'Dalam Pengobatan',
      value: '156',
      change: 8.7,
      icon: <HeartIcon />
    },
    {
      label: 'Tingkat Kepatuhan',
      value: '94.2%',
      change: 2.1,
      icon: <CheckCircleIcon />
    }
  ];

  const alerts = [
    {
      type: 'warning' as const,
      title: '3 Pasien Menunggu Persetujuan',
      message: 'Butuh persetujuan untuk rencana pengobatan',
      action: {
        label: 'Lihat Detail',
        onPress: () => console.log('Navigate to pending approvals')
      }
    },
    {
      type: 'info' as const,
      title: 'Backup Berhasil',
      message: 'Data harian berhasil di-backup',
      dismissible: true
    }
  ];

  const renderOverview = () => (
    <div className="space-y-4 p-4">
      <MobileStats stats={stats} />

      {/* Quick Actions */}
      <MobileCard title="Aksi Cepat" color="blue">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <UserGroupIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Pasien Baru</p>
          </button>
          <button className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <CalendarIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Buat Janji</p>
          </button>
          <button className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <HeartIcon className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text text-sm font-medium text-gray-900">Tracking</p>
          </button>
          <button className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <DocumentTextIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Laporan</p>
          </button>
        </div>
      </MobileCard>

      {/* Alerts */}
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <MobileAlert
            key={index}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            action={alert.action}
            onDismiss={alert.dismissible ? () => console.log('Dismiss alert') : undefined}
          />
        ))}
      </div>

      {/* Recent Activities */}
      <MobileCard title="Aktivitas Terkini" color="green">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <ClockIcon className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Janji dengan Pasien John Doe</p>
              <p className="text-xs text-gray-500">2 menit yang lalu</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            </div>
            <div className="f lex-1">
              <p className="text-sm text-gray-900">Lab Results Available</p>
              <p className="text-xs text-gray-500">Hasil lab untuk 3 pasien</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Stok Obat Menipis</p>
              <p className="text-xs text-gray-500">Beberapa obat hampir 3 hari</p>
            </div>
          </div>
        </div>
      </MobileCard>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-4 p-4">
      <MobileCard title="Pasien Prioritas" color="red">
        <div className="space-y-3">
          <MobileListItem
            title="John Doe"
            subtitle="Kanker Payudara - Stadium III"
            badge="Tinggi Tinggi"
            icon={<UserGroupIcon />}
            showChevron={true}
          />
          <MobileListItem
            title="Sarah Putri"
            subtitle="Kanker Serviks - Stadium II"
            badge="Perlu Follow-up"
            icon={<UserGroupIcon />}
            showChevron={true}
          />
          <MobileListItem
            title="Ahmad Wijaya"
            subtitle="Kanker Paru - Stadium I"
            badge="Respons Baik"
            icon={<UserGroupIcon />}
            showChevron={true}
          />
        </div>
      </MobileCard>

      <MobileCard title="Statistik Pasien" color="blue">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-600">Pasien Aktif</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-gray-600">Baru Bulan Ini</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">Breast</p>
              <p className="text-xs text-gray-500">42%</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">Lung</p>
              <p className="text-xs text-gray-500">28%</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">Colon</p>
              <p className="text-xs text-gray-500">18%</p>
            </div>
          </div>
        </div>
      </MobileCard>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-4 p-4">
      {/* Today's Appointments */}
      <MobileCard title="Janji Hari Ini" color="green">
        <div className="space-y-3">
          <MobileListItem
            title="09:00 - Dr. Sarah Putri"
            subtitle="John Doe - Follow-up Checkup"
            badge="09:00"
            icon={<CalendarIcon />}
          />
          <MobileListItem
            title="10:30 - Dr. Ahmad Wijaya"
            subtitle="Sarah Putri - Konsultasi"
            badge="10:30"
            icon={<CalendarIcon />}
          />
          <MobileListItem
            title="13:00 - Dr. Lisa Chen"
            subtitle="Ahmad Wijaya - Kemoterapi"
            badge="13:00"
            icon={<CalendarIcon />}
          />
          <MobileListItem
            title="15:30 - Dr. Budi Santoso"
            subtitle="New Patient - Pemeriksaan Awal"
            badge="15:30"
            icon={<CalendarIcon />}
          />
        </div>
      </MobileCard>

      {/* Appointment Stats */}
      <MobileCard title="Statistik Janji" color="blue">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Janji</span>
            <span className="font-semibold">28</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Selesai</span>
            <span className="font-semibold text-green-600">22</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Dibatalkan</span>
            <span className="font-semibold text-yellow-600">3</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Dibatalkan</span>
            <span className="font-semibold text-red-600">3</span>
          </div>
        </div>
      </MobileCard>

      {/* Upcoming Appointments */}
      <MobileCard title="Janji Mendatang" color="purple">
        <div className="space-y-3">
          <MobileListItem
            title="Besok 10:00"
            subtitle="Dr. Sarah Putri - John Doe (Follow-up)"
            icon={<CalendarIcon />}
          />
          <MobileListItem
            title="Selasa 11:00"
            subtitle="Dr. Ahmad Wijaya - Lisa Chen (Hasil Lab)"
            icon={<CalendarIcon />}
          />
          <MobileListItem
            title="Rabu 14:00"
            subtitle="Dr. Budi Santoso - New Patient (Screening)"
            icon={<CalendarIcon />}
          />
        </div>
      </MobileCard>
    </div>
  );

  const renderTreatments = () => (
    <div className="space-y-4 p-4">
      {/* Treatment Overview */}
      <MobileStats
        stats={[
          {
            label: 'Dalam Pengobatan',
            value: '156',
            change: 8.7,
            icon: <HeartIcon />
          },
          {
            label: 'Selesai',
            value: '89',
            change: -3.2,
            icon: <CheckCircleIcon />
          },
          {
            label: 'Dijadwal',
            value: '12',
            change: 2.1,
            icon: <ClockIcon />
          }
        ]}
      />

      {/* Treatment Alerts */}
      <MobileCard title="Perlu Perhatian" color="yellow">
        <div className="space-y-3">
          <MobileAlert
            type="warning"
            title="3 Pasien Perlu Evaluasi"
            message="Perlu evaluasi sebelum melanjutkan siklus berikutnya"
          />
        </div>
      </MobileCard>

      {/* Active Treatments */}
      <MobileCard title="Pengobatan Aktif" color="red">
        <div className="space-y-3">
          <MobileListItem
            title="Kemoterapi Neoadjuvan"
            subtitle="John Doe - Siklus 3 dari 6"
            badge="65%"
            icon={<HeartIcon />}
          />
          <MobileListItem
            title="Radioterapi"
            subtitle="Sarah Putri - Hari ke 15 dari 25"
            badge="60%"
            icon={<HeartIcon />}
          />
          <MobileListItem
            title="Terapi Targeted"
            subtitle="Ahmad Wijaya - Minggu ke 4 dari 12"
            badge="40%"
            icon={<HeartIcon />}
          />
        </div>
      </MobileCard>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-4 p-4">
      {/* Report Generation */}
      <MobileCard title="Buat Laporan" color="green">
        <div className="space-y-3">
          <button className="w-full bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Laporan Bulanan</p>
                  <p className="text-xs text-gray-500">Pasien dan Pengobatan</p>
                </div>
              </div>
              <TrendingUpIcon className="h-5 w-5 text-green-500" />
            </div>
          </button>
          <button className="w-full bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Analitik Treatment</p>
                  <p className="text-xs text-gray-500">Outcome dan KPI</p>
                </div>
              </div>
              <TrendingUpIcon className="h-5 w-5 text-green-500" />
            </div>
          </button>
        </div>
      </MobileCard>

      {/* Recent Reports */}
      <MobileCard title="Laporan Terbaru" color="blue">
        <div className="space-y-3">
          <MobileListItem
            title="Laporan Bulanan - Oktober 2024"
            subtitle="Diunduh pada 1 November 2024"
            badge="PDF"
            icon={<DocumentTextIcon />}
          />
          <MobileListItem
            title="Analisis Treatment Q3 2024"
            subtitle="Diunduh pada 15 Oktober 2024"
            badge="Excel"
            icon={<ChartBarIcon />}
          />
          <MobileListItem
            title="Kualitas Care Dashboard"
            subtitle="Diunduh pada 10 Oktober 2024"
            badge="PDF"
            icon={<ChartBarIcon />}
          />
        </div>
      </MobileCard>

      {/* Report Stats */}
      <MobileCard title="Statistik Laporan" color="purple">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Laporan</span>
            <span className="font-semibold">156</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Bulan Ini</span>
            <span className="font-semibold">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Unduh</span>
            <span className="font-semibold">1,234</span>
          </div>
        </div>
      </MobileCard>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Beranda', icon: <HomeIcon /> },
    { id: 'patients', label: 'Pasien', icon: <UserIcon /> },
    { id: 'appointments', label: 'Janji', icon: <CalendarIcon /> },
    { id: 'treatments', label: 'Pengobatan', icon: <HeartIcon /> },
    { id: 'reports', label: 'Laporan', icon: <DocumentTextIcon /> }
  ];

  return (
    <MobilePage
      title="Mobile Dashboard"
      showSearch={false}
      floatingAction={{
        icon: <PlusIcon className="h-6 w-6" />,
        onPress: () => console.log('Add new item')
      }}
    >
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto bg-white border-b border-gray-200">
        <div className="flex space-x-1 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'patients' && renderPatients()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'treatments' && renderTreatments()}
        {activeTab === 'reports' && renderReports()}
      </div>
    </MobilePage>
  );
}