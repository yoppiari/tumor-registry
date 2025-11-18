import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

interface QualityScore {
  score: number;
  completeness: number;
  requiredCompleteness: number;
  medicalCompleteness: number;
  imageCount: number;
  recommendations: QualityRecommendation[];
  lastUpdated: string;
  category: 'excellent' | 'good' | 'fair' | 'poor';
}

interface QualityRecommendation {
  type: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
  field?: string;
}

interface QualityTrend {
  date: string;
  score: number;
  completeness: number;
  imageCount: number;
  recommendations: number;
}

interface CenterQualitySummary {
  centerId: string;
  totalPatients: number;
  averageScore: number;
  qualityDistribution: {
    high: number;
    medium: number;
    low: number;
    percentages: {
      high: number;
      medium: number;
      low: number;
    };
  };
  topRecommendations: {
    type: string;
    count: number;
    percentage: number;
  }[];
  lastUpdated: string;
}

const QualityScoreCard: React.FC<{
  score: QualityScore;
  patientName: string;
}> = ({ score, patientName }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircleIcon className="w-8 h-8 text-green-500" />;
    if (score >= 80) return <CheckCircleIcon className="w-8 h-8 text-blue-500" />;
    if (score >= 70) return <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />;
    return <XCircleIcon className="w-8 h-8 text-red-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">{patientName}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(score.score)} ${getScoreColor(score.score)}`}>
          {score.category.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        {getScoreIcon(score.score)}
        <div>
          <p className="text-3xl font-bold text-gray-900">{score.score}%</p>
          <p className="text-sm text-gray-500">Quality Score</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Required Fields</span>
            <span className="font-medium">{score.requiredCompleteness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${score.requiredCompleteness}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Medical Information</span>
            <span className="font-medium">{score.medicalCompleteness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${score.medicalCompleteness}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Imaging</span>
            <span className="font-medium">{score.imageCount} images</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(score.imageCount * 20, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {score.recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {score.recommendations.length} Recommendation{score.recommendations.length > 1 ? 's' : ''}
          </p>
          <div className="space-y-1">
            {score.recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  rec.priority === 'high' ? 'bg-red-500' :
                  rec.priority === 'medium' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <p className="text-xs text-gray-600 flex-1">{rec.message}</p>
              </div>
            ))}
            {score.recommendations.length > 2 && (
              <p className="text-xs text-gray-500">
                +{score.recommendations.length - 2} more...
              </p>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">
        Last updated: {new Date(score.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
};

const QualityTrendChart: React.FC<{ trends: QualityTrend[] }> = ({ trends }) => {
  const maxScore = Math.max(...trends.map(t => t.score));
  const minScore = Math.min(...trends.map(t => t.score));
  const range = maxScore - minScore || 1;

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDownIcon className="w-4 h-4 text-red-500" />;
    return <MinusIcon className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-medium text-gray-900 mb-4">Quality Trend</h3>

      <div className="relative h-48 mb-4">
        {trends.length > 0 ? (
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {trends.map((trend, index) => {
              const height = ((trend.score - minScore) / range) * 100;
              const previousScore = index > 0 ? trends[index - 1].score : trend.score;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full flex justify-center">
                    <div
                      className="w-8 bg-blue-500 rounded-t transition-all duration-300"
                      style={{ height: `${height}%` }}
                    />
                    {index > 0 && (
                      <div className="absolute -top-6">
                        {getTrendIcon(trend.score, previousScore)}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-600 text-center">
                    <p className="font-medium">{trend.score}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(trend.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No trend data available</p>
          </div>
        )}
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>Min: {minScore}%</span>
        <span>Max: {maxScore}%</span>
      </div>
    </div>
  );
};

const CenterOverview: React.FC<{ data: CenterQualitySummary }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-medium text-gray-900 mb-4">Center Quality Overview</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-2xl font-bold text-gray-900">{data.totalPatients}</p>
          <p className="text-sm text-gray-500">Total Patients</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{data.averageScore}%</p>
          <p className="text-sm text-gray-500">Average Score</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-medium text-gray-900">Quality Distribution</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">High (90-100%)</span>
            </div>
            <span className="text-sm font-medium">
              {data.qualityDistribution.high} ({data.qualityDistribution.percentages.high}%)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-sm text-gray-600">Medium (70-89%)</span>
            </div>
            <span className="text-sm font-medium">
              {data.qualityDistribution.medium} ({data.qualityDistribution.percentages.medium}%)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-gray-600">Low (&lt;70%)</span>
            </div>
            <span className="text-sm font-medium">
              {data.qualityDistribution.low} ({data.qualityDistribution.percentages.low}%)
            </span>
          </div>
        </div>
      </div>

      {data.topRecommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Top Recommendations</h4>
          <div className="space-y-2">
            {data.topRecommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {rec.type.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500">
                  {rec.count} patients ({rec.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface QualityDashboardProps {
  centerId?: string;
  patientIds?: string[];
}

export const QualityDashboard: React.FC<QualityDashboardProps> = ({
  centerId,
  patientIds = []
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<number>(30);

  // Mock data for demonstration
  const mockQualityScores: QualityScore[] = [
    {
      score: 92,
      completeness: 88,
      requiredCompleteness: 95,
      medicalCompleteness: 82,
      imageCount: 4,
      recommendations: [
        { type: 'missing_family_history', priority: 'low', message: 'Consider adding family history' }
      ],
      lastUpdated: new Date().toISOString(),
      category: 'excellent'
    },
    {
      score: 78,
      completeness: 82,
      requiredCompleteness: 90,
      medicalCompleteness: 75,
      imageCount: 2,
      recommendations: [
        { type: 'insufficient_imaging', priority: 'medium', message: 'Add more diagnostic images' },
        { type: 'missing_medical_info', priority: 'medium', message: 'Complete medical information' }
      ],
      lastUpdated: new Date(Date.now() - 86400000).toISOString(),
      category: 'good'
    },
    {
      score: 65,
      completeness: 70,
      requiredCompleteness: 85,
      medicalCompleteness: 55,
      imageCount: 1,
      recommendations: [
        { type: 'missing_treatment_plan', priority: 'high', message: 'Create treatment plan' },
        { type: 'insufficient_imaging', priority: 'medium', message: 'Add more diagnostic images' }
      ],
      lastUpdated: new Date(Date.now() - 172800000).toISOString(),
      category: 'fair'
    }
  ];

  const mockTrends: QualityTrend[] = [
    { date: new Date(Date.now() - 604800000).toISOString(), score: 65, completeness: 70, imageCount: 1, recommendations: 3 },
    { date: new Date(Date.now() - 518400000).toISOString(), score: 72, completeness: 75, imageCount: 2, recommendations: 2 },
    { date: new Date(Date.now() - 432000000).toISOString(), score: 78, completeness: 82, imageCount: 2, recommendations: 2 },
    { date: new Date(Date.now() - 345600000).toISOString(), score: 85, completeness: 85, imageCount: 3, recommendations: 1 },
    { date: new Date(Date.now() - 259200000).toISOString(), score: 88, completeness: 87, imageCount: 3, recommendations: 1 },
    { date: new Date(Date.now() - 172800000).toISOString(), score: 92, completeness: 88, imageCount: 4, recommendations: 1 },
    { date: new Date().toISOString(), score: 95, completeness: 92, imageCount: 4, recommendations: 0 }
  ];

  const mockCenterData: CenterQualitySummary = {
    centerId: centerId || 'center-1',
    totalPatients: 156,
    averageScore: 82,
    qualityDistribution: {
      high: 67,
      medium: 71,
      low: 18,
      percentages: {
        high: 43,
        medium: 45,
        low: 12
      }
    },
    topRecommendations: [
      { type: 'missing_treatment_plan', count: 45, percentage: 29 },
      { type: 'insufficient_imaging', count: 38, percentage: 24 },
      { type: 'missing_medical_info', count: 32, percentage: 21 },
      { type: 'missing_family_history', count: 28, percentage: 18 },
      { type: 'incomplete_treatment_plan', count: 22, percentage: 14 }
    ],
    lastUpdated: new Date().toISOString()
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quality Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor data quality and completeness</p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <ChartBarIcon className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Quality Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockCenterData.qualityDistribution.high}</p>
              <p className="text-sm text-gray-500">High Quality</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockCenterData.qualityDistribution.medium}</p>
              <p className="text-sm text-gray-500">Medium Quality</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockCenterData.qualityDistribution.low}</p>
              <p className="text-sm text-gray-500">Needs Improvement</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUpIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockCenterData.averageScore}%</p>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Individual Patient Scores */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Patient Quality Scores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockQualityScores.map((score, index) => (
                <QualityScoreCard
                  key={index}
                  score={score}
                  patientName={`Patient ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Quality Trend */}
          <QualityTrendChart trends={mockTrends} />
        </div>

        <div className="space-y-6">
          {/* Center Overview */}
          <CenterOverview data={mockCenterData} />

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-medium text-gray-900">Generate Quality Report</p>
                <p className="text-sm text-gray-500">Export comprehensive quality analysis</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-medium text-gray-900">Set Quality Alerts</p>
                <p className="text-sm text-gray-500">Configure notifications for low scores</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-medium text-gray-900">Review Recommendations</p>
                <p className="text-sm text-gray-500">View and action improvement items</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityDashboard;