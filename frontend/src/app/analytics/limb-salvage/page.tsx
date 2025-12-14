'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface LimbSalvageMetrics {
  totalProcedures: number;
  salvageCount: number;
  amputationCount: number;
  salvageRate: number;
}

interface SalvageByTumorType {
  tumorType: string;
  total: number;
  salvage: number;
  amputation: number;
  salvageRate: number;
}

interface SalvageByStaging {
  stage: string;
  total: number;
  salvage: number;
  amputation: number;
  salvageRate: number;
}

interface SalvageByCenter {
  centerId: string;
  centerName: string;
  total: number;
  salvage: number;
  amputation: number;
  salvageRate: number;
  rank: number;
}

export default function LimbSalvageAnalyticsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<LimbSalvageMetrics>({
    totalProcedures: 0,
    salvageCount: 0,
    amputationCount: 0,
    salvageRate: 0,
  });
  const [salvageByTumorType, setSalvageByTumorType] = useState<SalvageByTumorType[]>([]);
  const [salvageByStaging, setSalvageByStaging] = useState<SalvageByStaging[]>([]);
  const [salvageByCenter, setSalvageByCenter] = useState<SalvageByCenter[]>([]);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, authLoading, router, timeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const data = await analyticsService.getLimbSalvageAnalytics(timeRange);

      // Mock data for demonstration
      setMetrics({
        totalProcedures: 847,
        salvageCount: 698,
        amputationCount: 149,
        salvageRate: 82.4,
      });

      setSalvageByTumorType([
        { tumorType: 'Osteosarcoma', total: 285, salvage: 225, amputation: 60, salvageRate: 78.9 },
        { tumorType: 'Ewing Sarcoma', total: 156, salvage: 138, amputation: 18, salvageRate: 88.5 },
        { tumorType: 'Chondrosarcoma', total: 134, salvage: 121, amputation: 13, salvageRate: 90.3 },
        { tumorType: 'Giant Cell Tumor', total: 98, salvage: 95, amputation: 3, salvageRate: 96.9 },
        { tumorType: 'Soft Tissue Sarcoma', total: 174, salvage: 119, amputation: 55, salvageRate: 68.4 },
      ]);

      setSalvageByStaging([
        { stage: 'IA (Low grade, intracompartmental)', total: 245, salvage: 241, amputation: 4, salvageRate: 98.4 },
        { stage: 'IB (Low grade, extracompartmental)', total: 189, salvage: 178, amputation: 11, salvageRate: 94.2 },
        { stage: 'IIA (High grade, intracompartmental)', total: 168, salvage: 142, amputation: 26, salvageRate: 84.5 },
        { stage: 'IIB (High grade, extracompartmental)', total: 156, salvage: 95, amputation: 61, salvageRate: 60.9 },
        { stage: 'III (Metastasis)', total: 89, salvage: 42, amputation: 47, salvageRate: 47.2 },
      ]);

      setSalvageByCenter([
        { centerId: '1', centerName: 'RSUPN Dr. Cipto Mangunkusumo', total: 156, salvage: 139, amputation: 17, salvageRate: 89.1, rank: 1 },
        { centerId: '2', centerName: 'RSUP Dr. Sardjito', total: 134, salvage: 116, amputation: 18, salvageRate: 86.6, rank: 2 },
        { centerId: '3', centerName: 'RSUP Dr. Soetomo', total: 128, salvage: 109, amputation: 19, salvageRate: 85.2, rank: 3 },
        { centerId: '4', centerName: 'RSUP Dr. Hasan Sadikin', total: 98, salvage: 81, amputation: 17, salvageRate: 82.7, rank: 4 },
        { centerId: '5', centerName: 'RSOP Prof. Dr. Soeharso', total: 89, salvage: 72, amputation: 17, salvageRate: 80.9, rank: 5 },
      ]);
    } catch (error) {
      console.error('Error loading limb salvage analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSalvageRateColor = (rate: number) => {
    if (rate >= 85) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSalvageRateBg = (rate: number) => {
    if (rate >= 85) return 'bg-green-100';
    if (rate >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading limb salvage analytics...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Limb Salvage vs Amputation Analytics</h1>
            <p className="text-gray-600">Key surgical outcome metrics for musculoskeletal tumors</p>
          </div>
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="1y">Last Year</option>
              <option value="6m">Last 6 Months</option>
              <option value="3m">Last 3 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Procedures</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.totalProcedures}</p>
            </div>
            <div className="text-4xl">🏥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Limb Salvage</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{metrics.salvageCount}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{metrics.salvageRate}% of total</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Amputation</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{metrics.amputationCount}</p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{(100 - metrics.salvageRate).toFixed(1)}% of total</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Salvage Rate</p>
              <p className={`text-3xl font-bold mt-2 ${getSalvageRateColor(metrics.salvageRate)}`}>
                {metrics.salvageRate}%
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className={`h-2 rounded-full ${
                metrics.salvageRate >= 85 ? 'bg-green-500' : metrics.salvageRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.salvageRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Salvage Rate by Tumor Type */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Limb Salvage Rate by Tumor Type</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tumor Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salvage
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amputation
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salvage Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salvageByTumorType.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.tumorType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{item.total}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-green-600 font-medium">{item.salvage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-red-600 font-medium">{item.amputation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getSalvageRateBg(
                        item.salvageRate
                      )} ${getSalvageRateColor(item.salvageRate)}`}
                    >
                      {item.salvageRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salvage Rate by Enneking Staging */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Limb Salvage Rate by Enneking Staging</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enneking Stage
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salvage
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amputation
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salvage Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salvageByStaging.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.stage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{item.total}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-green-600 font-medium">{item.salvage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-red-600 font-medium">{item.amputation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getSalvageRateBg(
                        item.salvageRate
                      )} ${getSalvageRateColor(item.salvageRate)}`}
                    >
                      {item.salvageRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Center Performance Leaderboard */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Center Performance Leaderboard</h2>
        <div className="space-y-4">
          {salvageByCenter.map((center) => (
            <div key={center.centerId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                {center.rank <= 3 ? (
                  <span className="text-2xl">{center.rank === 1 ? '🥇' : center.rank === 2 ? '🥈' : '🥉'}</span>
                ) : (
                  <span className="text-gray-500 font-semibold text-lg">{center.rank}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{center.centerName}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                  <span>{center.total} procedures</span>
                  <span>•</span>
                  <span className="text-green-600">{center.salvage} salvage</span>
                  <span>•</span>
                  <span className="text-red-600">{center.amputation} amputation</span>
                </div>
              </div>
              <div>
                <span
                  className={`px-4 py-2 rounded-full text-lg font-bold ${getSalvageRateBg(
                    center.salvageRate
                  )} ${getSalvageRateColor(center.salvageRate)}`}
                >
                  {center.salvageRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
