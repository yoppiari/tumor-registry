'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import followUpService, { FollowUpVisit } from '@/services/followup.service';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalActivePatients: number;
  upcomingVisits: number;
  overdueVisits: number;
  complianceRate: number;
}

export default function FollowUpProtocolPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalActivePatients: 0,
    upcomingVisits: 0,
    overdueVisits: 0,
    complianceRate: 0,
  });
  const [visits, setVisits] = useState<FollowUpVisit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<FollowUpVisit[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [visitNumberFilter, setVisitNumberFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    filterVisits();
  }, [visits, statusFilter, visitNumberFilter, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get all visits
      const allVisits = await followUpService.getAllVisits();
      setVisits(allVisits);

      // Calculate stats
      const now = new Date();
      const uniquePatients = new Set(allVisits.map(v => v.patientId)).size;

      const scheduled = allVisits.filter(v => v.status === 'scheduled');
      const upcoming = scheduled.filter(v => {
        const visitDate = new Date(v.scheduledDate);
        const diffDays = Math.ceil((visitDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diffDays >= 0 && diffDays <= 30;
      });

      const overdue = scheduled.filter(v => {
        const visitDate = new Date(v.scheduledDate);
        return visitDate < now;
      });

      const completed = allVisits.filter(v => v.status === 'completed').length;
      const total = allVisits.length;
      const compliance = total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({
        totalActivePatients: uniquePatients,
        upcomingVisits: upcoming.length,
        overdueVisits: overdue.length,
        complianceRate: compliance,
      });
    } catch (error) {
      console.error('Error loading follow-up data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVisits = () => {
    let filtered = [...visits];

    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'overdue') {
        const now = new Date();
        filtered = filtered.filter(v => {
          const visitDate = new Date(v.scheduledDate);
          return v.status === 'scheduled' && visitDate < now;
        });
      } else {
        filtered = filtered.filter(v => v.status === statusFilter);
      }
    }

    // Filter by visit number
    if (visitNumberFilter !== 'all') {
      filtered = filtered.filter(v => v.visitNumber === parseInt(visitNumberFilter));
    }

    // Search by patient name or MR number
    if (searchQuery) {
      filtered = filtered.filter(v =>
        v.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.patient?.medicalRecordNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by scheduled date
    filtered.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

    setFilteredVisits(filtered);
  };

  const getStatusBadge = (visit: FollowUpVisit) => {
    const now = new Date();
    const visitDate = new Date(visit.scheduledDate);
    const isOverdue = visit.status === 'scheduled' && visitDate < now;

    if (isOverdue) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>;
    }

    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      missed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    const color = colors[visit.status] || 'bg-gray-100 text-gray-800';
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{visit.status}</span>;
  };

  const getDaysUntil = (scheduledDate: string) => {
    const now = new Date();
    const visitDate = new Date(scheduledDate);
    const diffTime = visitDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `in ${diffDays} days`;
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading follow-up data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">14-Visit Follow-up Protocol</h1>
        <p className="text-gray-600">Monitor and manage longitudinal follow-up visits over 5 years</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Patients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalActivePatients}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming (30 days)</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.upcomingVisits}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Visits</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdueVisits}</p>
            </div>
            <div className="text-4xl">🚨</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.complianceRate}%</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Patient</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name or MR Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visit Number</label>
            <select
              value={visitNumberFilter}
              onChange={(e) => setVisitNumberFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Visits</option>
              {[...Array(14)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Visit #{i + 1}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={loadData}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Visits Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Follow-up Visits ({filteredVisits.length})
          </h2>
        </div>

        {filteredVisits.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-lg font-medium">No visits found</p>
            <p className="text-sm mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MR Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visit #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {visit.patient?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {visit.patient?.medicalRecordNumber || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        Visit #{visit.visitNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(visit.scheduledDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {getDaysUntil(visit.scheduledDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(visit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/patients/${visit.patientId}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View Patient
                      </button>
                      {visit.status === 'scheduled' && (
                        <button
                          onClick={() => router.push(`/demo/follow-up-calendar?patient=${visit.patientId}`)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Enter Data
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Visit Distribution Chart */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Visit Completion Rate by Visit Number</h2>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(14)].map((_, i) => {
            const visitNum = i + 1;
            const totalForVisit = visits.filter(v => v.visitNumber === visitNum).length;
            const completedForVisit = visits.filter(v => v.visitNumber === visitNum && v.status === 'completed').length;
            const rate = totalForVisit > 0 ? Math.round((completedForVisit / totalForVisit) * 100) : 0;

            return (
              <div key={visitNum} className="text-center">
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-600 mb-1">V{visitNum}</div>
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${Math.max(rate, 5)}px` }}
                    title={`${rate}% completed`}
                  ></div>
                  <div className="text-xs font-semibold text-gray-900 mt-1">{rate}%</div>
                </div>
                <div className="text-xs text-gray-500">{completedForVisit}/{totalForVisit}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
