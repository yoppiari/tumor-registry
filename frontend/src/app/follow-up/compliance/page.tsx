'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import followUpService, { FollowUpVisit, FollowUpSummary } from '@/services/followup.service';
import { useRouter } from 'next/navigation';

interface CenterCompliance {
  centerId: string;
  centerName: string;
  totalPatients: number;
  totalVisits: number;
  completedVisits: number;
  missedVisits: number;
  complianceRate: number;
  averageDaysLate: number;
  lostToFollowUp: number;
}

interface StaffPerformance {
  staffId: string;
  staffName: string;
  patientsAssigned: number;
  visitsCompleted: number;
  complianceRate: number;
  avgTimeToComplete: number;
}

export default function FollowUpCompliancePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState<FollowUpVisit[]>([]);
  const [overallCompliance, setOverallCompliance] = useState(0);
  const [avgDaysLate, setAvgDaysLate] = useState(0);
  const [lostToFollowUp, setLostToFollowUp] = useState(0);
  const [timeRange, setTimeRange] = useState('30d');

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

      // Get all visits
      const allVisits = await followUpService.getAllVisits();
      setVisits(allVisits);

      // Calculate overall compliance
      const completed = allVisits.filter(v => v.status === 'completed').length;
      const total = allVisits.length;
      const compliance = total > 0 ? Math.round((completed / total) * 100) : 0;
      setOverallCompliance(compliance);

      // Calculate average days late for overdue visits
      const now = new Date();
      const overdueVisits = allVisits.filter(v => {
        const visitDate = new Date(v.scheduledDate);
        return v.status === 'scheduled' && visitDate < now;
      });

      if (overdueVisits.length > 0) {
        const totalDaysLate = overdueVisits.reduce((sum, v) => {
          const visitDate = new Date(v.scheduledDate);
          const diffTime = now.getTime() - visitDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
          return sum + diffDays;
        }, 0);
        setAvgDaysLate(Math.round(totalDaysLate / overdueVisits.length));
      } else {
        setAvgDaysLate(0);
      }

      // Calculate lost to follow-up (no visit in last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const patientsWithRecentVisit = new Set(
        allVisits
          .filter(v => new Date(v.scheduledDate) > sixMonthsAgo)
          .map(v => v.patientId)
      );

      const allPatients = new Set(allVisits.map(v => v.patientId));
      const lostCount = allPatients.size - patientsWithRecentVisit.size;
      setLostToFollowUp(lostCount);
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplianceColor = (rate: number): string => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceBadge = (rate: number): string => {
    if (rate >= 90) return 'bg-green-100 text-green-800';
    if (rate >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getVisitComplianceByNumber = () => {
    const result: { visitNumber: number; total: number; completed: number; rate: number }[] = [];

    for (let i = 1; i <= 14; i++) {
      const visitsForNumber = visits.filter(v => v.visitNumber === i);
      const completedForNumber = visitsForNumber.filter(v => v.status === 'completed');
      const rate = visitsForNumber.length > 0
        ? Math.round((completedForNumber.length / visitsForNumber.length) * 100)
        : 0;

      result.push({
        visitNumber: i,
        total: visitsForNumber.length,
        completed: completedForNumber.length,
        rate,
      });
    }

    return result;
  };

  const visitCompliance = getVisitComplianceByNumber();

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading compliance data...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Follow-up Compliance Tracking</h1>
            <p className="text-gray-600">Monitor adherence to 14-visit follow-up protocol</p>
          </div>
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Overall Compliance Rate</h3>
            <span className="text-2xl">✅</span>
          </div>
          <div className={`text-4xl font-bold ${getComplianceColor(overallCompliance)}`}>
            {overallCompliance}%
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                overallCompliance >= 90 ? 'bg-green-500' :
                overallCompliance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${overallCompliance}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {visits.filter(v => v.status === 'completed').length} of {visits.length} visits completed
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Average Days Late</h3>
            <span className="text-2xl">⏱️</span>
          </div>
          <div className={`text-4xl font-bold ${avgDaysLate > 7 ? 'text-red-600' : 'text-green-600'}`}>
            {avgDaysLate}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {avgDaysLate > 7 ? 'Needs improvement' : 'Within acceptable range'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Lost to Follow-up</h3>
            <span className="text-2xl">🚫</span>
          </div>
          <div className={`text-4xl font-bold ${lostToFollowUp > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {lostToFollowUp}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Patients with no visit in last 6 months
          </p>
        </div>
      </div>

      {/* Visit-by-Visit Compliance */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Compliance by Visit Number</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visit Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Visits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visitCompliance.map((vc) => {
                const schedule = vc.visitNumber <= 8
                  ? `Month ${vc.visitNumber * 3}`
                  : `Month ${24 + (vc.visitNumber - 8) * 6}`;

                return (
                  <tr key={vc.visitNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
                        Visit #{vc.visitNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {schedule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vc.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vc.completed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${
                              vc.rate >= 90 ? 'bg-green-500' :
                              vc.rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${vc.rate}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-semibold ${getComplianceColor(vc.rate)}`}>
                          {vc.rate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getComplianceBadge(vc.rate)}`}>
                        {vc.rate >= 90 ? 'Excellent' : vc.rate >= 75 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Trend Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Compliance Trend (Year 1-5)</h2>
        <div className="flex items-end space-x-2 h-64">
          {visitCompliance.map((vc) => {
            const year = vc.visitNumber <= 8 ? Math.ceil(vc.visitNumber / 4) : Math.ceil((vc.visitNumber - 8) / 2) + 2;
            const height = Math.max(vc.rate, 5);

            return (
              <div key={vc.visitNumber} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t ${
                    vc.rate >= 90 ? 'bg-green-500' :
                    vc.rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  } hover:opacity-75 transition-opacity cursor-pointer`}
                  style={{ height: `${height}%` }}
                  title={`Visit ${vc.visitNumber}: ${vc.rate}%`}
                ></div>
                <div className="mt-2 text-xs font-medium text-gray-600">
                  V{vc.visitNumber}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <span>Year 1-2 (Q3M)</span>
          <span>Year 3-5 (Q6M)</span>
        </div>
      </div>

      {/* Action Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Recommendations</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          {overallCompliance < 90 && (
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Overall compliance is below target. Consider implementing automated reminder system.</span>
            </li>
          )}
          {avgDaysLate > 7 && (
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Average delay exceeds 7 days. Review scheduling and reminder processes.</span>
            </li>
          )}
          {lostToFollowUp > 0 && (
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{lostToFollowUp} patient(s) lost to follow-up. Initiate contact and re-engagement protocol.</span>
            </li>
          )}
          {visitCompliance.some(vc => vc.visitNumber > 10 && vc.rate < 75) && (
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Late-stage visits (Year 3-5) showing low compliance. Focus retention efforts on long-term follow-up.</span>
            </li>
          )}
        </ul>
      </div>
    </Layout>
  );
}
