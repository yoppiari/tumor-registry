'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface StagingDistribution {
  stage: string;
  count: number;
  percentage: number;
  avgAge: number;
  maleCount: number;
  femaleCount: number;
}

interface StagingByTumorType {
  tumorType: string;
  IA: number;
  IB: number;
  IIA: number;
  IIB: number;
  III: number;
  total: number;
}

interface StagingTrends {
  year: string;
  earlyStage: number; // IA + IB
  locallyAdvanced: number; // IIA + IIB
  metastatic: number; // III
}

interface SurvivalByStage {
  stage: string;
  oneYear: number;
  threeYear: number;
  fiveYear: number;
  patientCount: number;
}

export default function StagingAnalyticsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [distribution, setDistribution] = useState<StagingDistribution[]>([]);
  const [stagingByTumorType, setStagingByTumorType] = useState<StagingByTumorType[]>([]);
  const [stagingTrends, setStagingTrends] = useState<StagingTrends[]>([]);
  const [survivalByStage, setSurvivalByStage] = useState<SurvivalByStage[]>([]);
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
      // const data = await analyticsService.getStagingAnalytics(timeRange);

      // Mock data for demonstration
      setDistribution([
        { stage: 'IA (Low grade, intracompartmental)', count: 245, percentage: 28.9, avgAge: 34.2, maleCount: 138, femaleCount: 107 },
        { stage: 'IB (Low grade, extracompartmental)', count: 189, percentage: 22.3, avgAge: 38.7, maleCount: 105, femaleCount: 84 },
        { stage: 'IIA (High grade, intracompartmental)', count: 168, percentage: 19.8, avgAge: 28.5, maleCount: 95, femaleCount: 73 },
        { stage: 'IIB (High grade, extracompartmental)', count: 156, percentage: 18.4, avgAge: 31.2, maleCount: 87, femaleCount: 69 },
        { stage: 'III (Metastasis)', count: 89, percentage: 10.5, avgAge: 35.8, maleCount: 48, femaleCount: 41 },
      ]);

      setStagingByTumorType([
        { tumorType: 'Osteosarcoma', IA: 45, IB: 38, IIA: 78, IIB: 89, III: 35, total: 285 },
        { tumorType: 'Ewing Sarcoma', IA: 28, IB: 32, IIA: 42, IIB: 38, III: 16, total: 156 },
        { tumorType: 'Chondrosarcoma', IA: 52, IB: 48, IIA: 22, IIB: 8, III: 4, total: 134 },
        { tumorType: 'Giant Cell Tumor', IA: 58, IB: 32, IIA: 6, IIB: 2, III: 0, total: 98 },
        { tumorType: 'Soft Tissue Sarcoma', IA: 62, IB: 39, IIA: 20, IIB: 19, III: 34, total: 174 },
      ]);

      setStagingTrends([
        { year: '2020', earlyStage: 156, locallyAdvanced: 98, metastatic: 28 },
        { year: '2021', earlyStage: 178, locallyAdvanced: 112, metastatic: 32 },
        { year: '2022', earlyStage: 189, locallyAdvanced: 125, metastatic: 35 },
        { year: '2023', earlyStage: 212, locallyAdvanced: 138, metastatic: 38 },
        { year: '2024', earlyStage: 245, locallyAdvanced: 156, metastatic: 45 },
      ]);

      setSurvivalByStage([
        { stage: 'IA', oneYear: 98.4, threeYear: 94.2, fiveYear: 89.7, patientCount: 245 },
        { stage: 'IB', oneYear: 96.8, threeYear: 91.5, fiveYear: 85.3, patientCount: 189 },
        { stage: 'IIA', oneYear: 89.3, threeYear: 72.8, fiveYear: 58.4, patientCount: 168 },
        { stage: 'IIB', oneYear: 78.2, threeYear: 54.6, fiveYear: 38.9, patientCount: 156 },
        { stage: 'III', oneYear: 52.8, threeYear: 28.3, fiveYear: 15.7, patientCount: 89 },
      ]);
    } catch (error) {
      console.error('Error loading staging analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    if (stage.includes('IA')) return 'bg-green-100 text-green-800';
    if (stage.includes('IB')) return 'bg-blue-100 text-blue-800';
    if (stage.includes('IIA')) return 'bg-yellow-100 text-yellow-800';
    if (stage.includes('IIB')) return 'bg-orange-100 text-orange-800';
    if (stage.includes('III')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getSurvivalColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    if (rate >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading staging analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const totalPatients = distribution.reduce((sum, item) => sum + item.count, 0);
  const earlyStageCount = distribution.filter(d => d.stage.includes('IA') || d.stage.includes('IB')).reduce((sum, item) => sum + item.count, 0);
  const earlyStagePercentage = totalPatients > 0 ? ((earlyStageCount / totalPatients) * 100).toFixed(1) : '0.0';

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enneking Staging Analysis</h1>
            <p className="text-gray-600">Staging distribution and outcomes for musculoskeletal tumors</p>
          </div>
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="5y">Last 5 Years</option>
              <option value="3y">Last 3 Years</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalPatients}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Early Stage (IA-IB)</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{earlyStageCount}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{earlyStagePercentage}% of total</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Advanced (IIA-IIB)</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {distribution.filter(d => d.stage.includes('IIA') || d.stage.includes('IIB')).reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Metastatic (III)</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {distribution.filter(d => d.stage.includes('III')).reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
            <div className="text-4xl">🔴</div>
          </div>
        </div>
      </div>

      {/* Staging Distribution */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Enneking Staging Distribution</h2>
        <div className="space-y-4">
          {distribution.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStageColor(item.stage)}`}>
                    {item.stage}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.count} patients ({item.percentage}%)
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <span>Avg Age: {item.avgAge} yrs</span>
                  <span>M: {item.maleCount}</span>
                  <span>F: {item.femaleCount}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    item.stage.includes('IA')
                      ? 'bg-green-500'
                      : item.stage.includes('IB')
                      ? 'bg-blue-500'
                      : item.stage.includes('IIA')
                      ? 'bg-yellow-500'
                      : item.stage.includes('IIB')
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staging by Tumor Type */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Staging Distribution by Tumor Type</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tumor Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IA
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IB
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IIA
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IIB
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  III
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stagingByTumorType.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.tumorType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-green-600 font-medium">{item.IA}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-blue-600 font-medium">{item.IB}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-yellow-600 font-medium">{item.IIA}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-orange-600 font-medium">{item.IIB}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-red-600 font-medium">{item.III}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-gray-900">{item.total}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Staging Trends Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Staging Trends Over Time</h2>
          <div className="space-y-4">
            {stagingTrends.map((trend, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{trend.year}</span>
                  <span className="text-sm text-gray-600">
                    Total: {trend.earlyStage + trend.locallyAdvanced + trend.metastatic}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Early Stage (IA-IB)</span>
                    <span className="text-green-600 font-medium">{trend.earlyStage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Locally Advanced (IIA-IIB)</span>
                    <span className="text-yellow-600 font-medium">{trend.locallyAdvanced}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Metastatic (III)</span>
                    <span className="text-red-600 font-medium">{trend.metastatic}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Survival Rates by Stage */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Survival Rates by Enneking Stage</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    1-Yr
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    3-Yr
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    5-Yr
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {survivalByStage.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStageColor(item.stage)}`}>
                        {item.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`text-sm font-semibold ${getSurvivalColor(item.oneYear)}`}>
                        {item.oneYear}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`text-sm font-semibold ${getSurvivalColor(item.threeYear)}`}>
                        {item.threeYear}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`text-sm font-semibold ${getSurvivalColor(item.fiveYear)}`}>
                        {item.fiveYear}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className="text-sm text-gray-600">{item.patientCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
