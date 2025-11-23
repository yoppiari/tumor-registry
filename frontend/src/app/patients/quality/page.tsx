'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface QualityMetrics {
  overallScore: number;
  completeness: number;
  accuracy: number;
  timeliness: number;
  consistency: number;
}

interface StaffPerformance {
  staffId: string;
  staffName: string;
  entriesCount: number;
  avgQualityScore: number;
  completionRate: number;
  rank: number;
}

interface MissingDataHeatmap {
  field: string;
  missingCount: number;
  missingPercentage: number;
  priority: 'high' | 'medium' | 'low';
}

interface QualityTrend {
  date: string;
  score: number;
  entries: number;
}

export default function QualityCheckPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics>({
    overallScore: 0,
    completeness: 0,
    accuracy: 0,
    timeliness: 0,
    consistency: 0,
  });
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>([]);
  const [missingDataHeatmap, setMissingDataHeatmap] = useState<MissingDataHeatmap[]>([]);
  const [qualityTrends, setQualityTrends] = useState<QualityTrend[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchQualityDashboardData();
    }
  }, [isAuthenticated, isLoading, timeRange]);

  const fetchQualityDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      // Fetch data quality summary from backend
      const response = await fetch(`/api/v1/analytics/v2/data-quality/summary?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Update metrics from API
        if (data.overallQuality) {
          setQualityMetrics({
            overallScore: data.overallQuality.score || 85,
            completeness: data.overallQuality.completeness || 92,
            accuracy: data.overallQuality.accuracy || 88,
            timeliness: data.overallQuality.timeliness || 78,
            consistency: data.overallQuality.consistency || 90,
          });
        }

        if (data.recommendations) {
          setRecommendations(data.recommendations);
        }
      } else {
        // Use mock data for demo if API fails
        setMockData();
      }
    } catch (error) {
      console.error('Error fetching quality dashboard data:', error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    // Quality Metrics
    setQualityMetrics({
      overallScore: 85,
      completeness: 92,
      accuracy: 88,
      timeliness: 78,
      consistency: 90,
    });

    // Staff Performance
    setStaffPerformance([
      { staffId: '1', staffName: 'Dr. Ahmad Sutanto', entriesCount: 145, avgQualityScore: 94, completionRate: 98, rank: 1 },
      { staffId: '2', staffName: 'Siti Nurhaliza', entriesCount: 132, avgQualityScore: 91, completionRate: 95, rank: 2 },
      { staffId: '3', staffName: 'Budi Santoso', entriesCount: 128, avgQualityScore: 88, completionRate: 92, rank: 3 },
      { staffId: '4', staffName: 'Ratna Dewi', entriesCount: 115, avgQualityScore: 85, completionRate: 89, rank: 4 },
      { staffId: '5', staffName: 'Eko Prasetyo', entriesCount: 98, avgQualityScore: 82, completionRate: 85, rank: 5 },
    ]);

    // Missing Data Heatmap
    setMissingDataHeatmap([
      { field: 'Histologi Lengkap', missingCount: 45, missingPercentage: 18, priority: 'high' },
      { field: 'Stadium TNM Detail', missingCount: 38, missingPercentage: 15, priority: 'high' },
      { field: 'Tanggal Diagnosis', missingCount: 12, missingPercentage: 5, priority: 'medium' },
      { field: 'Riwayat Keluarga', missingCount: 67, missingPercentage: 27, priority: 'medium' },
      { field: 'Status Merokok', missingCount: 52, missingPercentage: 21, priority: 'low' },
      { field: 'BMI', missingCount: 89, missingPercentage: 36, priority: 'low' },
    ]);

    // Quality Trends (last 30 days)
    const trends: QualityTrend[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trends.push({
        date: date.toISOString().split('T')[0],
        score: 75 + Math.random() * 15 + (i < 15 ? i : 0), // Trending upward
        entries: Math.floor(Math.random() * 20) + 5,
      });
    }
    setQualityTrends(trends);

    // Recommendations
    setRecommendations([
      'Fokus pada kelengkapan data histologi - tingkat kelengkapan 82%',
      'Tingkatkan ketepatan waktu entry data - rata-rata delay 3.2 hari',
      'Lakukan validasi cross-field untuk meningkatkan konsistensi',
      'Latihan refresher untuk staff dengan skor < 85%',
      'Implementasi peer review untuk data stadium TNM',
    ]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreColorBar = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading quality dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Kualitas Data</h1>
            <p className="text-gray-600">Monitor dan tingkatkan kualitas data pasien</p>
          </div>
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="7d">7 Hari Terakhir</option>
              <option value="30d">30 Hari Terakhir</option>
              <option value="90d">90 Hari Terakhir</option>
              <option value="1y">1 Tahun Terakhir</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overall Quality Score */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">Skor Kualitas Keseluruhan</h2>
          <div className="text-6xl font-bold mb-2">{qualityMetrics.overallScore}</div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-3 mb-4">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${qualityMetrics.overallScore}%` }}
            ></div>
          </div>
          <p className="text-sm opacity-90">
            {qualityMetrics.overallScore >= 90 ? 'Excellent' : qualityMetrics.overallScore >= 75 ? 'Good' : 'Needs Improvement'}
          </p>
        </div>
      </div>

      {/* Quality Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Kelengkapan</h3>
            <span className={`text-2xl font-bold px-3 py-1 rounded-full ${getScoreColor(qualityMetrics.completeness)}`}>
              {qualityMetrics.completeness}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full ${getScoreColorBar(qualityMetrics.completeness)}`} style={{ width: `${qualityMetrics.completeness}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Akurasi</h3>
            <span className={`text-2xl font-bold px-3 py-1 rounded-full ${getScoreColor(qualityMetrics.accuracy)}`}>
              {qualityMetrics.accuracy}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full ${getScoreColorBar(qualityMetrics.accuracy)}`} style={{ width: `${qualityMetrics.accuracy}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Ketepatan Waktu</h3>
            <span className={`text-2xl font-bold px-3 py-1 rounded-full ${getScoreColor(qualityMetrics.timeliness)}`}>
              {qualityMetrics.timeliness}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full ${getScoreColorBar(qualityMetrics.timeliness)}`} style={{ width: `${qualityMetrics.timeliness}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Konsistensi</h3>
            <span className={`text-2xl font-bold px-3 py-1 rounded-full ${getScoreColor(qualityMetrics.consistency)}`}>
              {qualityMetrics.consistency}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full ${getScoreColorBar(qualityMetrics.consistency)}`} style={{ width: `${qualityMetrics.consistency}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Missing Data Heatmap */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data yang Sering Hilang</h2>
          <div className="space-y-3">
            {missingDataHeatmap.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{item.field}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.missingPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${item.missingPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.missingCount} records hilang</p>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance Leaderboard */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performa Staff Data Entry</h2>
          <div className="space-y-3">
            {staffPerformance.map((staff) => (
              <div key={staff.staffId} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  {staff.rank <= 3 ? (
                    <span className="text-2xl">
                      {staff.rank === 1 ? '🥇' : staff.rank === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="text-gray-500 font-semibold">{staff.rank}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{staff.staffName}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{staff.entriesCount} entries</span>
                    <span>•</span>
                    <span>{staff.completionRate}% completion</span>
                  </div>
                </div>
                <div className={`text-lg font-bold px-3 py-1 rounded-full ${getScoreColor(staff.avgQualityScore)}`}>
                  {staff.avgQualityScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Trend Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tren Kualitas Data</h2>
        <div className="h-64 flex items-end space-x-1">
          {qualityTrends.map((trend, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                style={{ height: `${(trend.score / 100) * 100}%` }}
                title={`${trend.date}: ${trend.score.toFixed(1)}% (${trend.entries} entries)`}
              ></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <span>{qualityTrends[0]?.date}</span>
          <span>Hari Ini</span>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rekomendasi Peningkatan Kualitas</h2>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
