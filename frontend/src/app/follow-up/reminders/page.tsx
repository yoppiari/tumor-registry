'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import followUpService, { FollowUpVisit } from '@/services/followup.service';
import { useRouter } from 'next/navigation';

interface ReminderQueue {
  id: string;
  patientId: string;
  patientName: string;
  mrNumber: string;
  visitNumber: number;
  scheduledDate: string;
  daysUntil: number;
  reminderSent: boolean;
  reminderDate?: string;
  reminderMethod?: string;
  status: 'pending' | 'sent' | 'failed';
}

export default function FollowUpRemindersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState<FollowUpVisit[]>([]);
  const [reminderQueue, setReminderQueue] = useState<ReminderQueue[]>([]);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(7);
  const [selectedVisits, setSelectedVisits] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get scheduled visits
      const allVisits = await followUpService.getAllVisits(undefined, 'scheduled');
      setVisits(allVisits);

      // Build reminder queue
      const now = new Date();
      const queue: ReminderQueue[] = allVisits
        .map(visit => {
          const visitDate = new Date(visit.scheduledDate);
          const diffTime = visitDate.getTime() - now.getTime();
          const daysUntil = Math.ceil(diffTime / (1000 * 3600 * 24));

          return {
            id: visit.id,
            patientId: visit.patientId,
            patientName: visit.patient?.name || 'Unknown',
            mrNumber: visit.patient?.medicalRecordNumber || '-',
            visitNumber: visit.visitNumber,
            scheduledDate: visit.scheduledDate,
            daysUntil,
            reminderSent: false, // Mock - would come from database
            status: 'pending' as const,
          };
        })
        .filter(item => item.daysUntil <= 30 && item.daysUntil >= 0) // Next 30 days
        .sort((a, b) => a.daysUntil - b.daysUntil);

      setReminderQueue(queue);
    } catch (error) {
      console.error('Error loading reminder data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectVisit = (id: string) => {
    const newSelected = new Set(selectedVisits);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedVisits(newSelected);
  };

  const selectAllVisible = () => {
    const visibleIds = reminderQueue.filter(r => r.daysUntil <= reminderDaysBefore).map(r => r.id);
    setSelectedVisits(new Set(visibleIds));
  };

  const clearSelection = () => {
    setSelectedVisits(new Set());
  };

  const handleSendReminders = () => {
    alert(
      `🚧 Automated Reminder System - In Development\n\n` +
      `This feature will send automated reminders via:\n` +
      `• SMS (patient mobile number)\n` +
      `• Email (patient email address)\n` +
      `• WhatsApp (if enabled)\n\n` +
      `${selectedVisits.size} reminder(s) would be queued for sending.\n\n` +
      `Backend integration with notification service is required.`
    );
  };

  const getPriorityBadge = (daysUntil: number) => {
    if (daysUntil <= 1) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Urgent</span>;
    }
    if (daysUntil <= 3) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">High</span>;
    }
    if (daysUntil <= 7) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Medium</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Low</span>;
  };

  const visitsNeedingReminder = reminderQueue.filter(r => r.daysUntil <= reminderDaysBefore);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reminder queue...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Follow-up Reminder Management</h1>
        <p className="text-gray-600">Automated reminder system for upcoming follow-up visits</p>
      </div>

      {/* Development Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <span className="text-2xl mr-3">🚧</span>
          <div>
            <h3 className="text-sm font-semibold text-yellow-900">Feature In Development</h3>
            <p className="text-sm text-yellow-800 mt-1">
              Automated SMS/Email reminder system requires backend integration with notification service.
              This page currently shows the reminder queue and allows manual tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total in Queue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reminderQueue.length}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Need Reminder</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{visitsNeedingReminder.length}</p>
            </div>
            <div className="text-4xl">🔔</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Within {reminderDaysBefore} days</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent (≤3 days)</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {reminderQueue.filter(r => r.daysUntil <= 3).length}
              </p>
            </div>
            <div className="text-4xl">🚨</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Selected</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{selectedVisits.size}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reminder Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send Reminder (Days Before Visit)
            </label>
            <select
              value={reminderDaysBefore}
              onChange={(e) => setReminderDaysBefore(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 day before</option>
              <option value={3}>3 days before</option>
              <option value={7}>7 days before</option>
              <option value={14}>14 days before</option>
              <option value={30}>30 days before</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Method
            </label>
            <select
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            >
              <option>SMS + Email (Default)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Requires backend configuration</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Template
            </label>
            <select
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            >
              <option>Default Template</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Requires backend configuration</p>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {visitsNeedingReminder.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={selectAllVisible}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Select All ({visitsNeedingReminder.length})
              </button>
              <button
                onClick={clearSelection}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear Selection
              </button>
            </div>
            <button
              onClick={handleSendReminders}
              disabled={selectedVisits.size === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              📧 Send Reminders ({selectedVisits.size})
            </button>
          </div>
        </div>
      )}

      {/* Reminder Queue Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Reminder Queue ({reminderQueue.length} visits)
          </h2>
        </div>

        {reminderQueue.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">✉️</div>
            <p className="text-lg font-medium">No upcoming visits</p>
            <p className="text-sm mt-2">All visits are completed or scheduled beyond 30 days</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVisits.size === visitsNeedingReminder.length && visitsNeedingReminder.length > 0}
                      onChange={() => {
                        if (selectedVisits.size === visitsNeedingReminder.length) {
                          clearSelection();
                        } else {
                          selectAllVisible();
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
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
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reminderQueue.map((reminder) => (
                  <tr key={reminder.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVisits.has(reminder.id)}
                        onChange={() => toggleSelectVisit(reminder.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reminder.patientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reminder.mrNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        Visit #{reminder.visitNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(reminder.scheduledDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        reminder.daysUntil <= 1 ? 'text-red-600' :
                        reminder.daysUntil <= 3 ? 'text-orange-600' :
                        reminder.daysUntil <= 7 ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {reminder.daysUntil === 0 ? 'Today' :
                         reminder.daysUntil === 1 ? 'Tomorrow' :
                         `${reminder.daysUntil} days`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(reminder.daysUntil)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">ℹ️ About Automated Reminders</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>When implemented, the reminder system will:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Automatically send SMS/Email reminders based on configured schedule</li>
            <li>Track delivery status and failed attempts</li>
            <li>Support custom reminder templates</li>
            <li>Allow bulk reminder sending for multiple patients</li>
            <li>Provide reminder history and analytics</li>
            <li>Support WhatsApp Business API integration (optional)</li>
          </ul>
          <p className="mt-4">
            <strong>Required Backend Services:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>SMS Gateway (Twilio, AWS SNS, or local provider)</li>
            <li>Email Service (SendGrid, AWS SES, or SMTP)</li>
            <li>Notification Queue (Bull/Redis)</li>
            <li>Scheduled Jobs (Cron or Task Scheduler)</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
