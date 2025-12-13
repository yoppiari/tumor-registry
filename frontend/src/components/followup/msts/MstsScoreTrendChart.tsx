'use client';

import React, { useState } from 'react';
import { MstsScoreTrendChartProps } from '../types/msts.types';
import { useMstsTrend } from './hooks/useMstsTrend';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  MinusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

/**
 * MSTS Score Trend Chart Component
 * Visualizes MSTS scores over time across multiple follow-up visits
 */
export const MstsScoreTrendChart: React.FC<MstsScoreTrendChartProps> = ({
  patientId,
  extremityType,
  data: externalData,
  showDomains = false,
  highlightChanges = true,
  maxVisits = 14,
}) => {
  const [showIndividualDomains, setShowIndividualDomains] = useState(showDomains);

  // Fetch trend data if not provided externally
  const { data: fetchedData, isLoading, error, refetch, averageScore, trend } = useMstsTrend(
    patientId,
    extremityType
  );

  const data = externalData || fetchedData;

  // Limit to max visits
  const displayData = data.slice(-maxVisits);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <ArrowPathIcon className="w-6 h-6 animate-spin" />
          <span>Loading trend data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-8">
        <div className="text-center text-red-600">
          <p className="font-medium">Error loading trend data</p>
          <p className="text-sm mt-1">{error.message}</p>
          <button
            onClick={refetch}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (displayData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center text-gray-500">
          <ChartBarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No trend data available</p>
          <p className="text-sm mt-1">
            MSTS scores will appear here after follow-up assessments
          </p>
        </div>
      </div>
    );
  }

  // Calculate chart dimensions and scaling
  const maxScore = 30;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 800;
  const dataWidth = chartWidth - chartPadding.left - chartPadding.right;
  const dataHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Calculate point positions
  const pointSpacing = displayData.length > 1 ? dataWidth / (displayData.length - 1) : 0;

  const getY = (score: number) => {
    return chartPadding.top + dataHeight - (score / maxScore) * dataHeight;
  };

  const getX = (index: number) => {
    return chartPadding.left + index * pointSpacing;
  };

  // Create path for total score line
  const totalScorePath = displayData
    .map((d, i) => {
      const x = getX(i);
      const y = getY(d.totalScore);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Domain line paths (if enabled)
  const domainPaths = showIndividualDomains
    ? [
        {
          name: 'Pain',
          color: 'rgb(239, 68, 68)',
          path: displayData
            .map((d, i) => {
              const x = getX(i);
              const y = getY(d.pain);
              return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            })
            .join(' '),
        },
        {
          name: 'Function',
          color: 'rgb(59, 130, 246)',
          path: displayData
            .map((d, i) => {
              const x = getX(i);
              const y = getY(d.function);
              return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            })
            .join(' '),
        },
        {
          name: 'Emotional',
          color: 'rgb(168, 85, 247)',
          path: displayData
            .map((d, i) => {
              const x = getX(i);
              const y = getY(d.emotionalAcceptance);
              return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            })
            .join(' '),
        },
      ]
    : [];

  // Trend indicator
  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUpIcon className="w-5 h-5 text-green-600" />;
      case 'declining':
        return <TrendingDownIcon className="w-5 h-5 text-red-600" />;
      case 'stable':
        return <MinusIcon className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'improving':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'declining':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'stable':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">MSTS Score Trend</h3>
            <p className="text-sm text-blue-100 mt-1">
              Tracking functional outcome over {displayData.length} visit
              {displayData.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {averageScore !== null && (
              <div className="text-right">
                <div className="text-sm text-blue-100">Average Score</div>
                <div className="text-2xl font-bold">{averageScore}</div>
              </div>
            )}
            {trend !== 'insufficient-data' && (
              <div className={`px-3 py-1.5 rounded-lg border ${getTrendColor()} flex items-center gap-2`}>
                {getTrendIcon()}
                <span className="font-medium capitalize">{trend}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showIndividualDomains}
            onChange={(e) => setShowIndividualDomains(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Show individual domain scores
          </span>
        </label>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <svg width={chartWidth} height={chartHeight} className="mx-auto">
            {/* Grid lines */}
            {[0, 5, 10, 15, 20, 25, 30].map((score) => {
              const y = getY(score);
              return (
                <g key={score}>
                  <line
                    x1={chartPadding.left}
                    y1={y}
                    x2={chartWidth - chartPadding.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray={score === 15 || score === 20 || score === 25 ? '4,4' : ''}
                  />
                  <text
                    x={chartPadding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-gray-500"
                  >
                    {score}
                  </text>
                </g>
              );
            })}

            {/* Domain lines (if enabled) */}
            {showIndividualDomains &&
              domainPaths.map((domain) => (
                <path
                  key={domain.name}
                  d={domain.path}
                  fill="none"
                  stroke={domain.color}
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  opacity="0.6"
                />
              ))}

            {/* Total score line */}
            <path
              d={totalScorePath}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="3"
            />

            {/* Data points */}
            {displayData.map((d, i) => {
              const x = getX(i);
              const y = getY(d.totalScore);

              // Highlight changes
              let changeColor = 'rgb(59, 130, 246)';
              if (highlightChanges && i > 0) {
                const prevScore = displayData[i - 1].totalScore;
                if (d.totalScore > prevScore) {
                  changeColor = 'rgb(34, 197, 94)'; // green
                } else if (d.totalScore < prevScore) {
                  changeColor = 'rgb(239, 68, 68)'; // red
                }
              }

              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="6" fill={changeColor} stroke="white" strokeWidth="2" />
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-gray-700"
                  >
                    {d.totalScore}
                  </text>
                  {/* Visit number */}
                  <text
                    x={x}
                    y={chartHeight - chartPadding.bottom + 15}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    V{d.visitNumber}
                  </text>
                  {/* Date */}
                  <text
                    x={x}
                    y={chartHeight - chartPadding.bottom + 30}
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                  >
                    {new Date(d.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-blue-500 rounded"></div>
            <span className="text-gray-700">Total Score</span>
          </div>
          {showIndividualDomains &&
            domainPaths.map((domain) => (
              <div key={domain.name} className="flex items-center gap-2">
                <div
                  className="w-8 h-1 rounded opacity-60"
                  style={{ backgroundColor: domain.color, borderTop: '2px dashed' }}
                ></div>
                <span className="text-gray-700">{domain.name}</span>
              </div>
            ))}
        </div>

        {/* Score interpretation zones */}
        <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-center">
          <div className="p-2 bg-red-50 border border-red-200 rounded">
            <div className="font-semibold text-red-800">Poor</div>
            <div className="text-red-600">&lt;15</div>
          </div>
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div className="font-semibold text-yellow-800">Fair</div>
            <div className="text-yellow-600">15-19</div>
          </div>
          <div className="p-2 bg-blue-50 border border-blue-200 rounded">
            <div className="font-semibold text-blue-800">Good</div>
            <div className="text-blue-600">20-24</div>
          </div>
          <div className="p-2 bg-green-50 border border-green-200 rounded">
            <div className="font-semibold text-green-800">Excellent</div>
            <div className="text-green-600">≥25</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MstsScoreTrendChart;
