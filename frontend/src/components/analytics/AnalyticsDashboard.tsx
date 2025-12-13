'use client';

import React, { useState, useEffect } from 'react';
import analyticsService, {
  DashboardSummary,
  LimbSalvageRate,
  MstsTrend,
  TreatmentEffectiveness,
  WhoClassificationDistribution,
  SurvivalAnalysis,
  CenterPerformance,
  FollowUpCompliance,
} from '@/services/analytics.service';

export const AnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [limbSalvageData, setLimbSalvageData] = useState<LimbSalvageRate[]>([]);
  const [mstsTrends, setMstsTrends] = useState<MstsTrend[]>([]);
  const [treatmentData, setTreatmentData] = useState<TreatmentEffectiveness[]>([]);
  const [whoDistribution, setWhoDistribution] = useState<WhoClassificationDistribution[]>([]);
  const [survivalData, setSurvivalData] = useState<SurvivalAnalysis[]>([]);
  const [centerPerformance, setCenterPerformance] = useState<CenterPerformance[]>([]);
  const [complianceData, setComplianceData] = useState<FollowUpCompliance[]>([]);

  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryData, salvageData, trendsData, treatmentEff, whoDist, survival, performance, compliance] =
        await Promise.all([
          analyticsService.getDashboardSummary(),
          analyticsService.getLimbSalvageRate(),
          analyticsService.getMstsTrends(12),
          analyticsService.getTreatmentEffectiveness(),
          analyticsService.getWhoClassificationDistribution(),
          analyticsService.getSurvivalAnalysis(),
          analyticsService.getCenterPerformance(),
          analyticsService.getFollowUpCompliance(),
        ]);

      setSummary(summaryData);
      setLimbSalvageData(salvageData);
      setMstsTrends(trendsData);
      setTreatmentData(treatmentEff);
      setWhoDistribution(whoDist);
      setSurvivalData(survival);
      setCenterPerformance(performance);
      setComplianceData(compliance);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'limb-salvage', label: 'Limb Salvage', icon: '🦴' },
    { id: 'msts-trends', label: 'MSTS Trends', icon: '📈' },
    { id: 'treatment', label: 'Treatment', icon: '💊' },
    { id: 'survival', label: 'Survival', icon: '❤️' },
    { id: 'centers', label: 'Centers', icon: '🏥' },
    { id: 'compliance', label: 'Compliance', icon: '✅' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <h1 className="text-3xl font-bold">INAMSOS Analytics Dashboard</h1>
        <p className="text-blue-100 mt-2">Indonesian Musculoskeletal Tumor Registry - Analytics & Insights</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'overview' && <OverviewTab summary={summary} />}
        {activeTab === 'limb-salvage' && <LimbSalvageTab data={limbSalvageData} />}
        {activeTab === 'msts-trends' && <MstsTrendsTab data={mstsTrends} />}
        {activeTab === 'treatment' && <TreatmentTab data={treatmentData} />}
        {activeTab === 'survival' && <SurvivalTab data={survivalData} whoDistribution={whoDistribution} />}
        {activeTab === 'centers' && <CentersTab data={centerPerformance} />}
        {activeTab === 'compliance' && <ComplianceTab data={complianceData} />}
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab: React.FC<{ summary: DashboardSummary | null }> = ({ summary }) => {
  if (!summary) return null;

  const metrics = [
    { label: 'Total Patients', value: summary.totalPatients, color: 'blue', icon: '👥' },
    { label: 'Active Centers', value: summary.totalCenters, color: 'green', icon: '🏥' },
    { label: 'MSTS Assessments', value: summary.totalMstsScores, color: 'purple', icon: '📋' },
    { label: 'Follow-up Visits', value: summary.totalFollowUpVisits, color: 'orange', icon: '📅' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: `var(--color-${metric.color}-500)` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">{metric.label}</span>
              <span className="text-3xl">{metric.icon}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{metric.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Limb Salvage Rate</h3>
          <div className="flex items-end space-x-4">
            <div className="text-5xl font-bold text-green-600">
              {summary.overallSalvageRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 pb-2">across all centers</div>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 rounded-full h-3 transition-all duration-500"
              style={{ width: `${summary.overallSalvageRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Average MSTS Score</h3>
          <div className="flex items-end space-x-4">
            <div className="text-5xl font-bold text-blue-600">
              {summary.averageMstsScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 pb-2">out of 30 points</div>
          </div>
          <div className="mt-4 flex space-x-2">
            {['Poor', 'Fair', 'Good', 'Excellent'].map((level, idx) => {
              const isActive = summary.averageMstsScore >= (idx + 1) * 6;
              return (
                <div
                  key={level}
                  className={`flex-1 h-3 rounded ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}
                  title={level}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Limb Salvage Tab
const LimbSalvageTab: React.FC<{ data: LimbSalvageRate[] }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Limb Salvage Rate by Center</h2>
        <p className="text-gray-600 mt-1">Comparison of limb-sparing vs amputation procedures across centers</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Center</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Cases</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Limb Salvage</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Amputation</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Salvage Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((center) => (
              <tr key={center.centerId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {center.centerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                  {center.totalCases}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-semibold">
                  {center.limbSalvage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600 font-semibold">
                  {center.amputation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-bold text-gray-900">{center.salvageRate.toFixed(1)}%</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 rounded-full h-2"
                        style={{ width: `${center.salvageRate}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// MSTS Trends Tab
const MstsTrendsTab: React.FC<{ data: MstsTrend[] }> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">MSTS Score Trends (Last 12 Months)</h2>
        <div className="space-y-4">
          {data.map((trend) => (
            <div key={trend.month} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-gray-900">{trend.month}</span>
                  <span className="text-sm text-gray-600 ml-2">({trend.totalAssessments} assessments)</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{trend.averageScore.toFixed(1)}</div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-green-800 font-semibold">{trend.excellentCount}</div>
                  <div className="text-green-600 text-xs">Excellent</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-blue-800 font-semibold">{trend.goodCount}</div>
                  <div className="text-blue-600 text-xs">Good</div>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <div className="text-yellow-800 font-semibold">{trend.fairCount}</div>
                  <div className="text-yellow-600 text-xs">Fair</div>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <div className="text-red-800 font-semibold">{trend.poorCount}</div>
                  <div className="text-red-600 text-xs">Poor</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Treatment Tab
const TreatmentTab: React.FC<{ data: TreatmentEffectiveness[] }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Treatment Modality Effectiveness</h2>
        <p className="text-gray-600 mt-1">Comparison of outcomes across different treatment approaches</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Treatment</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Patients</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg MSTS</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Salvage Rate</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Recurrence</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Survival</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((treatment) => (
              <tr key={treatment.treatmentModality} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {treatment.treatmentModality}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{treatment.totalPatients}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-blue-600">
                  {treatment.averageMstsScore.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-green-600">
                  {treatment.salvageRate.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-orange-600">
                  {treatment.recurrenceRate.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-green-600">
                  {treatment.survivalRate.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Survival Tab
const SurvivalTab: React.FC<{ data: SurvivalAnalysis[]; whoDistribution: WhoClassificationDistribution[] }> = ({
  data,
  whoDistribution,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">5-Year Survival Analysis by Tumor Type</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tumor Type</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Patients</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">1-Year</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">3-Year</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">5-Year</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Survival</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.tumorType} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.tumorType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{item.totalPatients}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-green-600">
                    {item.oneYearSurvival.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-green-600">
                    {item.threeYearSurvival.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-green-600">
                    {item.fiveYearSurvival.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {item.averageSurvivalMonths.toFixed(0)} months
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">WHO Classification Distribution</h3>
        <div className="space-y-3">
          {whoDistribution.map((item) => (
            <div key={item.classification}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-900">{item.classification}</span>
                <span className="text-gray-600">
                  {item.count} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Centers Tab
const CentersTab: React.FC<{ data: CenterPerformance[] }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Center Performance Comparison</h2>
        <p className="text-gray-600 mt-1">Key performance indicators across all participating centers</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Center</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Patients</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg MSTS</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Salvage Rate</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Follow-up Rate</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Data Quality</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((center) => (
              <tr key={center.centerId} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{center.centerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{center.totalPatients}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-blue-600">
                  {center.averageMstsScore.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-green-600">
                  {center.salvageRate.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-purple-600">
                  {center.completedFollowUpRate.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-semibold">{center.dataCompletenessScore.toFixed(0)}%</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`rounded-full h-2 ${
                          center.dataCompletenessScore >= 80
                            ? 'bg-green-600'
                            : center.dataCompletenessScore >= 60
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${center.dataCompletenessScore}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Compliance Tab
const ComplianceTab: React.FC<{ data: FollowUpCompliance[] }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Follow-up Compliance Tracking</h2>
        <p className="text-gray-600 mt-1">Patient follow-up visit compliance by center</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Center</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Scheduled</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Completed</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Missed</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cancelled</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Compliance</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Delay</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.centerId} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.centerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{item.totalScheduled}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-green-600">
                  {item.completed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-red-600">
                  {item.missed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                  {item.cancelled}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span
                      className={`font-bold ${
                        item.complianceRate >= 80
                          ? 'text-green-600'
                          : item.complianceRate >= 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {item.complianceRate.toFixed(1)}%
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`rounded-full h-2 ${
                          item.complianceRate >= 80
                            ? 'bg-green-600'
                            : item.complianceRate >= 60
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${item.complianceRate}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                  {item.averageDelayDays.toFixed(1)} days
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
