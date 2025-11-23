'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      const response = await fetch('/api/v1/analytics/v2/dashboard/executive', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        // Mock data for demo
        setDashboardData({
          totalPatients: 1247,
          newThisMonth: 45,
          activeCenters: 12,
          researchRequests: 23,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        totalPatients: 1247,
        newThisMonth: 45,
        activeCenters: 12,
        researchRequests: 23,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  const analyticsModules = [
    {
      title: 'Distribusi Kanker',
      description: 'Peta geografis distribusi kasus kanker di Indonesia',
      href: '/analytics/distribution',
      icon: '🗺️',
      color: 'bg-blue-500',
    },
    {
      title: 'Analisis Tren',
      description: 'Tren temporal dan pola kasus kanker dari waktu ke waktu',
      href: '/analytics/trends',
      icon: '📈',
      color: 'bg-green-500',
    },
    {
      title: 'Prediksi AI',
      description: 'Prediksi dan proyeksi berbasis machine learning',
      href: '/analytics/predictions',
      icon: '🤖',
      color: 'bg-purple-500',
    },
    {
      title: 'Perbandingan Pusat',
      description: 'Benchmarking performa antar pusat kesehatan',
      href: '/analytics/centers',
      icon: '🏥',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Analitik</h1>
        <p className="text-gray-600 mt-2">Visualisasi data, tren, dan prediksi berbasis AI</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pasien</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.totalPatients?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Baru Bulan Ini</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.newThisMonth || '0'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pusat Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.activeCenters || '0'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Riset Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.researchRequests || '0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Modules */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Modul Analitik</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsModules.map((module) => (
            <Link key={module.href} href={module.href}>
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className={`${module.color} rounded-t-lg p-6 text-white text-center`}>
                  <div className="text-5xl mb-2">{module.icon}</div>
                  <h3 className="text-lg font-semibold">{module.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">{module.description}</p>
                  <div className="mt-4 text-center">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      Lihat Detail →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Insight Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-blue-100 text-sm">Jenis Kanker Terbanyak</p>
            <p className="text-2xl font-bold mt-1">Payudara (28%)</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Rata-rata Usia Diagnosis</p>
            <p className="text-2xl font-bold mt-1">52 Tahun</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Provinsi Tertinggi</p>
            <p className="text-2xl font-bold mt-1">Jawa Barat</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
