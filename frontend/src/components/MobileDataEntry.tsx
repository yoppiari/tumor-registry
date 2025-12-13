import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  DevicePhoneMobileIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  WifiIcon,
  SignalSlashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Simple debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface PatientData {
  id?: string;
  patientName?: string;
  idNumber?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE';
  tumorType?: string;
  diagnosisDate?: string;
  stage?: string;
  notes?: string;
  lastSyncStatus?: 'synced' | 'pending' | 'error';
  lastModified?: string;
  isDraft?: boolean;
  pendingSync?: boolean;
}

interface DraftStorage {
  drafts: Record<string, PatientData>;
  pendingSync: string[];
}

const MOBILE_BREAKPOINT = 768;

// IndexedDB for offline storage
class OfflineStorage {
  private dbName = 'INAMSOS_Offline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('drafts')) {
          const store = db.createObjectStore('drafts', { keyPath: 'id' });
          store.createIndex('lastModified', 'lastModified');
          store.createIndex('pendingSync', 'pendingSync');
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  async saveDraft(data: PatientData): Promise<void> {
    if (!this.db) await this.init();

    const draft = {
      ...data,
      lastModified: new Date().toISOString(),
      pendingSync: true,
      isDraft: true
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readwrite');
      const store = transaction.objectStore('drafts');
      const request = store.put(draft);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getDrafts(): Promise<PatientData[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readonly');
      const store = transaction.objectStore('drafts');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async deleteDraft(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readwrite');
      const store = transaction.objectStore('drafts');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async markSynced(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readwrite');
      const store = transaction.objectStore('drafts');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const draft = request.result;
        if (draft) {
          draft.pendingSync = false;
          draft.lastSyncStatus = 'synced';
          const updateRequest = store.put(draft);
          updateRequest.onerror = () => reject(updateRequest.error);
          updateRequest.onsuccess = () => resolve();
        } else {
          resolve();
        }
      };
    });
  }

  async clearSynced(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readwrite');
      const store = transaction.objectStore('drafts');
      const request = store.index('pendingSync').openCursor(IDBKeyRange.only(false));

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }
}

const offlineStorage = new OfflineStorage();

interface ConnectionStatus {
  isOnline: boolean;
  connectionType?: string;
  effectiveType?: string;
}

const useConnectionStatus = (): ConnectionStatus => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine
  });

  useEffect(() => {
    const updateStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      setStatus({
        isOnline: navigator.onLine,
        connectionType: connection?.type,
        effectiveType: connection?.effectiveType
      });
    };

    const handleOnline = () => updateStatus();
    const handleOffline = () => updateStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateStatus);
    }

    updateStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  return status;
};

interface MobileFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'date' | 'select';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const MobileFormField: React.FC<MobileFormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  options,
  placeholder,
  required = false,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
          `}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
          `}
        />
      )}
    </div>
  );
};

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  disabled?: boolean;
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  onClick,
  color = 'blue',
  disabled = false
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white hover:bg-blue-600',
    green: 'bg-green-500 text-white hover:bg-green-600',
    red: 'bg-red-500 text-white hover:bg-red-600',
    yellow: 'bg-yellow-500 text-white hover:bg-yellow-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200
        ${colorClasses[color]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
      `}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

interface DraftListItemProps {
  draft: PatientData;
  onSelect: (draft: PatientData) => void;
  onDelete: (id: string) => void;
  onSync: (draft: PatientData) => void;
  isOnline: boolean;
}

const DraftListItem: React.FC<DraftListItemProps> = ({
  draft,
  onSelect,
  onDelete,
  onSync,
  isOnline
}) => {
  const getStatusIcon = () => {
    switch (draft.lastSyncStatus) {
      case 'synced':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (draft.lastSyncStatus) {
      case 'synced':
        return 'Synced';
      case 'pending':
        return 'Pending sync';
      case 'error':
        return 'Sync failed';
      default:
        return 'Draft';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">
            {draft.patientName || 'Unnamed Patient'}
          </h3>
          <p className="text-sm text-gray-500">
            {draft.tumorType || 'No tumor type'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-xs text-gray-500">{getStatusText()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {draft.lastModified
            ? `Modified ${new Date(draft.lastModified).toLocaleString()}`
            : 'Not modified'
          }
        </p>

        <div className="flex items-center gap-2">
          {isOnline && draft.lastSyncStatus !== 'synced' && (
            <button
              onClick={() => onSync(draft)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onSelect(draft)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <DevicePhoneMobileIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(draft.id!)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ExclamationTriangleIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileDataEntry: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentDraft, setCurrentDraft] = useState<PatientData | null>(null);
  const [drafts, setDrafts] = useState<PatientData[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const connectionStatus = useConnectionStatus();
  const autoSaveRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const savedDrafts = await offlineStorage.getDrafts();
        setDrafts(savedDrafts);
      } catch (error) {
        console.error('Failed to load drafts:', error);
      }
    };

    loadDrafts();
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAutoSave = useCallback(async (data: PatientData) => {
    if (!data.patientName) return;

    try {
      const id = data.id || `draft_${Date.now()}`;
      await offlineStorage.saveDraft({ ...data, id });

      // Refresh drafts list
      const updatedDrafts = await offlineStorage.getDrafts();
      setDrafts(updatedDrafts);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, []);

  const debouncedAutoSave = useCallback(
    debounce(handleAutoSave, 2000),
    [handleAutoSave]
  );

  const handleFieldChange = useCallback((field: keyof PatientData, value: string) => {
    if (!currentDraft) {
      setCurrentDraft({ [field]: value });
      return;
    }

    const updatedDraft = { ...currentDraft, [field]: value };
    setCurrentDraft(updatedDraft);
    debouncedAutoSave(updatedDraft);
  }, [currentDraft, debouncedAutoSave]);

  const handleSave = useCallback(async () => {
    if (!currentDraft || !currentDraft.patientName) {
      alert('Please enter patient name');
      return;
    }

    try {
      if (isOnline) {
        // Simulate online save
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Patient data saved successfully!');
        setCurrentDraft(null);
      } else {
        // Save as draft
        await handleAutoSave(currentDraft);
        alert('Draft saved. Will sync when online.');
      }
    } catch (error) {
      alert('Failed to save data');
    }
  }, [currentDraft, isOnline, handleAutoSave]);

  const handleDraftSelect = useCallback((draft: PatientData) => {
    setCurrentDraft(draft);
    setShowDrafts(false);
  }, []);

  const handleDraftDelete = useCallback(async (id: string) => {
    if (confirm('Delete this draft?')) {
      try {
        await offlineStorage.deleteDraft(id);
        const updatedDrafts = await offlineStorage.getDrafts();
        setDrafts(updatedDrafts);
      } catch (error) {
        alert('Failed to delete draft');
      }
    }
  }, []);

  const handleDraftSync = useCallback(async (draft: PatientData) => {
    if (!isOnline) {
      alert('Cannot sync while offline');
      return;
    }

    try {
      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      await offlineStorage.markSynced(draft.id!);

      // Refresh drafts
      const updatedDrafts = await offlineStorage.getDrafts();
      setDrafts(updatedDrafts);

      alert('Draft synced successfully!');
    } catch (error) {
      alert('Failed to sync draft');
    }
  }, [isOnline]);

  const handleNewEntry = useCallback(() => {
    setCurrentDraft({});
    setShowDrafts(false);
  }, []);

  const isValid = currentDraft?.patientName &&
                  currentDraft.idNumber &&
                  currentDraft.gender &&
                  currentDraft.tumorType;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900">
              {currentDraft ? 'Edit Patient' : 'Data Entry'}
            </h1>

            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <WifiIcon className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600">Online</span>
                </>
              ) : (
                <>
                  <SignalSlashIcon className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600">Offline</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {drafts.length > 0 && (
              <button
                onClick={() => setShowDrafts(!showDrafts)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <DevicePhoneMobileIcon className="w-5 h-5" />
                {drafts.filter(d => d.pendingSync).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Connection Status Banner */}
      {!isOnline && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <SignalSlashIcon className="w-4 h-4" />
            <span>You're offline. Changes will be saved locally and synced when you're back online.</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {showDrafts ? (
          /* Drafts List */
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Drafts ({drafts.length})
              </h2>
              <button
                onClick={() => setShowDrafts(false)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Back
              </button>
            </div>

            <div className="space-y-3">
              {drafts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No drafts found</p>
                </div>
              ) : (
                drafts.map(draft => (
                  <DraftListItem
                    key={draft.id}
                    draft={draft}
                    onSelect={handleDraftSelect}
                    onDelete={handleDraftDelete}
                    onSync={handleDraftSync}
                    isOnline={isOnline}
                  />
                ))
              )}
            </div>
          </div>
        ) : currentDraft ? (
          /* Form */
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-xl p-4 space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>

              <MobileFormField
                label="Patient Name"
                value={currentDraft.patientName || ''}
                onChange={(value) => handleFieldChange('patientName', value)}
                placeholder="Enter patient name"
                required
              />

              <MobileFormField
                label="ID Number"
                value={currentDraft.idNumber || ''}
                onChange={(value) => handleFieldChange('idNumber', value)}
                placeholder="Enter NIK or passport number"
                required
              />

              <MobileFormField
                label="Birth Date"
                value={currentDraft.birthDate || ''}
                onChange={(value) => handleFieldChange('birthDate', value)}
                type="date"
                required
              />

              <MobileFormField
                label="Gender"
                value={currentDraft.gender || ''}
                onChange={(value) => handleFieldChange('gender', value as 'MALE' | 'FEMALE')}
                type="select"
                options={[
                  { value: 'MALE', label: 'Male' },
                  { value: 'FEMALE', label: 'Female' }
                ]}
                required
              />

              <MobileFormField
                label="Tumor Type"
                value={currentDraft.tumorType || ''}
                onChange={(value) => handleFieldChange('tumorType', value)}
                placeholder="Enter tumor type"
                required
              />

              <MobileFormField
                label="Diagnosis Date"
                value={currentDraft.diagnosisDate || ''}
                onChange={(value) => handleFieldChange('diagnosisDate', value)}
                type="date"
                required
              />

              <MobileFormField
                label="Stage"
                value={currentDraft.stage || ''}
                onChange={(value) => handleFieldChange('stage', value)}
                type="select"
                options={[
                  { value: 'STAGE_I', label: 'Stage I' },
                  { value: 'STAGE_II', label: 'Stage II' },
                  { value: 'STAGE_III', label: 'Stage III' },
                  { value: 'STAGE_IV', label: 'Stage IV' }
                ]}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  value={currentDraft.notes || ''}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={4}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Quick Actions */
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-4">
              <QuickAction
                icon={<DevicePhoneMobileIcon className="w-6 h-6" />}
                label="New Patient"
                onClick={handleNewEntry}
                color="blue"
              />

              <QuickAction
                icon={<CloudArrowUpIcon className="w-6 h-6" />}
                label="Sync All"
                onClick={async () => {
                  const pendingDrafts = drafts.filter(d => d.pendingSync);
                  for (const draft of pendingDrafts) {
                    await handleDraftSync(draft);
                  }
                }}
                color="green"
                disabled={!isOnline || drafts.filter(d => d.pendingSync).length === 0}
              />
            </div>

            {drafts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Drafts</h3>
                <div className="space-y-3">
                  {drafts.slice(0, 3).map(draft => (
                    <DraftListItem
                      key={draft.id}
                      draft={draft}
                      onSelect={handleDraftSelect}
                      onDelete={handleDraftDelete}
                      onSync={handleDraftSync}
                      isOnline={isOnline}
                    />
                  ))}
                  {drafts.length > 3 && (
                    <button
                      onClick={() => setShowDrafts(true)}
                      className="w-full py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View all {drafts.length} drafts
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      {currentDraft && (
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentDraft(null)}
              className="flex-1 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`
                flex-1 py-3 rounded-xl font-medium transition-all duration-200
                ${isValid && isOnline
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
                ${!isOnline ? 'bg-yellow-500 text-white hover:bg-yellow-600' : ''}
              `}
            >
              {!isOnline ? 'Save Draft' : 'Save Patient'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDataEntry;