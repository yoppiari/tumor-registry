import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BellIcon,
  UserIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface PatientFollowUp {
  id: string;
  patientId: string;
  patientName: string;
  patientInfo: {
    age: number;
    gender: string;
    tumorType: string;
    stage: string;
  };
  scheduledDate: string;
  followUpType: 'routine' | 'treatment_review' | 'lab_results' | 'imaging' | 'emergency';
  status: 'scheduled' | 'completed' | 'missed' | 'rescheduled' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  assignedTo?: string;
  completedDate?: string;
  completedBy?: string;
  outcome?: string;
  nextFollowUp?: string;
  reminders: FollowUpReminder[];
  createdAt: string;
  updatedAt: string;
}

interface FollowUpReminder {
  id: string;
  type: 'email' | 'sms' | 'push' | 'call';
  scheduledTime: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  message?: string;
}

interface FollowUpTemplate {
  id: string;
  name: string;
  type: 'routine' | 'treatment_review' | 'lab_results' | 'imaging' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  defaultInterval: number; // days
  description: string;
  questions: FollowUpQuestion[];
}

interface FollowUpQuestion {
  id: string;
  question: string;
  type: 'text' | 'choice' | 'scale' | 'date' | 'yes_no';
  required: boolean;
  options?: string[];
}

const FOLLOW_UP_TYPES = [
  { value: 'routine', label: 'Routine Check-up', color: 'bg-blue-100 text-blue-700' },
  { value: 'treatment_review', label: 'Treatment Review', color: 'bg-purple-100 text-purple-700' },
  { value: 'lab_results', label: 'Lab Results Review', color: 'bg-green-100 text-green-700' },
  { value: 'imaging', label: 'Imaging Follow-up', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'emergency', label: 'Emergency Follow-up', color: 'bg-red-100 text-red-700' }
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' }
];

const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  missed: 'bg-red-100 text-red-700',
  rescheduled: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-gray-100 text-gray-700'
};

const FollowUpCard: React.FC<{
  followUp: PatientFollowUp;
  onComplete: (id: string, data: any) => void;
  onReschedule: (id: string) => void;
  onCancel: (id: string) => void;
}> = ({ followUp, onComplete, onReschedule, onCancel }) => {
  const typeConfig = FOLLOW_UP_TYPES.find(t => t.value === followUp.followUpType);
  const priorityConfig = PRIORITY_LEVELS.find(p => p.value === followUp.priority);
  const isOverdue = new Date(followUp.scheduledDate) < new Date() && followUp.status === 'scheduled';
  const daysUntil = Math.ceil((new Date(followUp.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleComplete = () => {
    onComplete(followUp.id, {
      outcome: '',
      notes: '',
      nextFollowUp: ''
    });
  };

  return (
    <div className={`
      bg-white rounded-lg border p-4 hover:shadow-md transition-all duration-200
      ${isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'}
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-gray-900">{followUp.patientName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[followUp.status]}`}>
              {followUp.status}
            </span>
            {isOverdue && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                Overdue
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span>Age: {followUp.patientInfo.age}</span>
            <span>{followUp.patientInfo.gender}</span>
            <span>{followUp.patientInfo.tumorType}</span>
            <span>{followUp.patientInfo.stage}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig?.color}`}>
              {typeConfig?.label}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig?.color}`}>
              {priorityConfig?.label} Priority
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(followUp.scheduledDate).toLocaleDateString()}</span>
          </div>

          {followUp.status === 'scheduled' && (
            <div className="text-xs text-gray-500">
              {daysUntil === 0 ? 'Today' :
               daysUntil === 1 ? 'Tomorrow' :
               daysUntil > 0 ? `In ${daysUntil} days` :
               `${Math.abs(daysUntil)} days ago`}
            </div>
          )}
        </div>
      </div>

      {followUp.notes && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
          <strong>Notes:</strong> {followUp.notes}
        </div>
      )}

      {followUp.reminders.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <BellIcon className="w-4 h-4" />
            <span>{followUp.reminders.length} reminder{followUp.reminders.length > 1 ? 's' : ''} set</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {followUp.assignedTo && (
            <>
              <UserIcon className="w-3 h-3" />
              <span>Assigned to: {followUp.assignedTo}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {followUp.status === 'scheduled' && (
            <>
              <button
                onClick={handleComplete}
                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
              >
                Complete
              </button>
              <button
                onClick={() => onReschedule(followUp.id)}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              >
                Reschedule
              </button>
            </>
          )}

          <button
            onClick={() => onCancel(followUp.id)}
            className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const FollowUpSchedule: React.FC<{
  followUp: PatientFollowUp | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  patients: Array<{ id: string; name: string; tumorType: string }>;
}> = ({ followUp, onSave, onCancel, patients }) => {
  const [formData, setFormData] = useState({
    patientId: followUp?.patientId || '',
    scheduledDate: followUp?.scheduledDate || '',
    followUpType: followUp?.followUpType || 'routine',
    priority: followUp?.priority || 'medium',
    notes: followUp?.notes || '',
    assignedTo: followUp?.assignedTo || '',
    reminders: followUp?.reminders || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {followUp ? 'Edit Follow-up' : 'Schedule Follow-up'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient *
            </label>
            <select
              value={formData.patientId}
              onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.tumorType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Date *
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Type *
            </label>
            <select
              value={formData.followUpType}
              onChange={(e) => setFormData(prev => ({ ...prev, followUpType: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {FOLLOW_UP_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {PRIORITY_LEVELS.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedPatient && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Patient:</strong> {selectedPatient.name}<br />
              <strong>Tumor Type:</strong> {selectedPatient.tumorType}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          <input
            type="text"
            value={formData.assignedTo}
            onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
            placeholder="Assign to staff member"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Add notes for this follow-up..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {followUp ? 'Update' : 'Schedule'} Follow-up
          </button>
        </div>
      </form>
    </div>
  );
};

const FollowUpAnalytics: React.FC<{
  followUps: PatientFollowUp[];
}> = ({ followUps }) => {
  const analytics = useMemo(() => {
    const total = followUps.length;
    const completed = followUps.filter(f => f.status === 'completed').length;
    const missed = followUps.filter(f => f.status === 'missed').length;
    const overdue = followUps.filter(f =>
      f.status === 'scheduled' && new Date(f.scheduledDate) < new Date()
    ).length;

    const typeDistribution = followUps.reduce((acc, followUp) => {
      acc[followUp.followUpType] = (acc[followUp.followUpType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityDistribution = followUps.reduce((acc, followUp) => {
      acc[followUp.priority] = (acc[followUp.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      completed,
      missed,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      typeDistribution,
      priorityDistribution
    };
  }, [followUps]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Follow-ups</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.total}</p>
          </div>
          <CalendarIcon className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold text-green-600">{analytics.completionRate}%</p>
          </div>
          <CheckCircleIcon className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Missed</p>
            <p className="text-2xl font-bold text-red-600">{analytics.missed}</p>
          </div>
          <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-2xl font-bold text-orange-600">{analytics.overdue}</p>
          </div>
          <ClockIcon className="w-8 h-8 text-orange-500" />
        </div>
      </div>
    </div>
  );
};

interface PatientFollowUpProps {
  centerId?: string;
}

export const PatientFollowUp: React.FC<PatientFollowUpProps> = ({ centerId }) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<PatientFollowUp | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    search: ''
  });

  // Mock data
  const mockFollowUps: PatientFollowUp[] = [
    {
      id: '1',
      patientId: 'p1',
      patientName: 'John Doe',
      patientInfo: { age: 45, gender: 'Male', tumorType: 'Breast Cancer', stage: 'Stage II' },
      scheduledDate: new Date(Date.now() + 86400000).toISOString(),
      followUpType: 'routine',
      status: 'scheduled',
      priority: 'medium',
      notes: 'Routine 3-month check-up',
      assignedTo: 'Dr. Smith',
      reminders: [
        { id: 'r1', type: 'email', scheduledTime: new Date(Date.now() + 3600000).toISOString(), status: 'pending' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Jane Smith',
      patientInfo: { age: 38, gender: 'Female', tumorType: 'Lung Cancer', stage: 'Stage III' },
      scheduledDate: new Date(Date.now() - 86400000).toISOString(),
      followUpType: 'treatment_review',
      status: 'completed',
      priority: 'high',
      notes: 'Post-treatment evaluation',
      assignedTo: 'Dr. Johnson',
      completedDate: new Date().toISOString(),
      completedBy: 'Dr. Johnson',
      outcome: 'Patient responding well to treatment',
      nextFollowUp: new Date(Date.now() + 7 * 86400000).toISOString(),
      reminders: [],
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const mockPatients = [
    { id: 'p1', name: 'John Doe', tumorType: 'Breast Cancer' },
    { id: 'p2', name: 'Jane Smith', tumorType: 'Lung Cancer' },
    { id: 'p3', name: 'Bob Johnson', tumorType: 'Colon Cancer' }
  ];

  const filteredFollowUps = useMemo(() => {
    return mockFollowUps.filter(followUp => {
      const matchesStatus = filters.status === 'all' || followUp.status === filters.status;
      const matchesType = filters.type === 'all' || followUp.followUpType === filters.type;
      const matchesPriority = filters.priority === 'all' || followUp.priority === filters.priority;
      const matchesSearch = filters.search === '' ||
        followUp.patientName.toLowerCase().includes(filters.search.toLowerCase()) ||
        followUp.notes?.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesType && matchesPriority && matchesSearch;
    });
  }, [mockFollowUps, filters]);

  const handleScheduleNew = () => {
    setSelectedFollowUp(null);
    setShowSchedule(true);
  };

  const handleEdit = (followUp: PatientFollowUp) => {
    setSelectedFollowUp(followUp);
    setShowSchedule(true);
  };

  const handleSave = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowSchedule(false);
    setSelectedFollowUp(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patient Follow-up</h1>
          <p className="text-gray-500 mt-1">Manage patient follow-up schedules and track outcomes</p>
        </div>

        <button
          onClick={handleScheduleNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Schedule Follow-up
        </button>
      </div>

      {/* Analytics Overview */}
      <FollowUpAnalytics followUps={mockFollowUps} />

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="rescheduled">Rescheduled</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {FOLLOW_UP_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            {PRIORITY_LEVELS.map(priority => (
              <option key={priority.value} value={priority.value}>{priority.label}</option>
            ))}
          </select>

          <div className="flex-1 max-w-xs">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search patients..."
                className="w-full pl-10 pr-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFollowUps.map(followUp => (
          <FollowUpCard
            key={followUp.id}
            followUp={followUp}
            onComplete={(id, data) => console.log('Complete:', id, data)}
            onReschedule={(id) => console.log('Reschedule:', id)}
            onCancel={(id) => console.log('Cancel:', id)}
          />
        ))}
      </div>

      {filteredFollowUps.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No follow-ups found</p>
        </div>
      )}

      {/* Schedule Modal */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <FollowUpSchedule
              followUp={selectedFollowUp}
              onSave={handleSave}
              onCancel={() => {
                setShowSchedule(false);
                setSelectedFollowUp(null);
              }}
              patients={mockPatients}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientFollowUp;