import React, { useState, useCallback, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentIcon,
  TableCellsIcon,
  FunnelIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface ImportJob {
  id: string;
  fileName: string;
  fileType: 'csv' | 'excel' | 'json' | 'hl7';
  status: 'uploading' | 'processing' | 'validating' | 'importing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  startTime: string;
  endTime?: string;
  createdBy: string;
  centerId?: string;
  mapping?: FieldMapping;
  preview?: ImportPreview;
}

interface ImportError {
  row: number;
  field: string;
  value: any;
  message: string;
  severity: 'error' | 'warning';
}

interface ImportWarning {
  row: number;
  field: string;
  message: string;
  suggestion?: string;
}

interface FieldMapping {
  [sourceField: string]: {
    targetField: string;
    required: boolean;
    transform?: string;
  };
}

interface ImportPreview {
  headers: string[];
  sampleData: any[][];
  detectedFormat: string;
  estimatedRecords: number;
  suggestedMapping: FieldMapping;
}

interface ImportTemplate {
  id: string;
  name: string;
  description: string;
  fileType: 'csv' | 'excel';
  templateUrl: string;
  fieldMapping: FieldMapping;
  sampleData: any[];
  lastUpdated: string;
}

const SUPPORTED_FORMATS = [
  {
    type: 'csv',
    label: 'CSV (Comma Separated Values)',
    icon: <DocumentIcon className="w-6 h-6" />,
    accept: '.csv'
  },
  {
    type: 'excel',
    label: 'Excel (.xlsx, .xls)',
    icon: <TableCellsIcon className="w-6 h-6" />,
    accept: '.xlsx,.xls'
  },
  {
    type: 'json',
    label: 'JSON',
    icon: <DocumentIcon className="w-6 h-6" />,
    accept: '.json'
  },
  {
    type: 'hl7',
    label: 'HL7 FHIR',
    icon: <DocumentIcon className="w-6 h-6" />,
    accept: '.json,.xml,.hl7'
  }
];

const FIELD_MAPPINGS: Record<string, FieldMapping> = {
  patient_basic: {
    'name': { targetField: 'patientName', required: true },
    'patient_name': { targetField: 'patientName', required: true },
    'id_number': { targetField: 'idNumber', required: true },
    'nik': { targetField: 'idNumber', required: true },
    'birth_date': { targetField: 'birthDate', required: true },
    'date_of_birth': { targetField: 'birthDate', required: true },
    'gender': { targetField: 'gender', required: true },
    'sex': { targetField: 'gender', required: true },
    'tumor_type': { targetField: 'tumorType', required: true },
    'cancer_type': { targetField: 'tumorType', required: true },
    'diagnosis_date': { targetField: 'diagnosisDate', required: true },
    'stage': { targetField: 'stage', required: false }
  }
};

const ImportTemplates: ImportTemplate[] = [
  {
    id: 'patient_basic_csv',
    name: 'Basic Patient Information (CSV)',
    description: 'Template for basic patient data import',
    fileType: 'csv',
    templateUrl: '/templates/patient_basic.csv',
    fieldMapping: FIELD_MAPPINGS.patient_basic,
    sampleData: [
      ['John Doe', '3201011234560001', '1980-01-15', 'Male', 'Breast Cancer', '2023-01-15', 'Stage II'],
      ['Jane Smith', '3301022345670001', '1985-05-20', 'Female', 'Lung Cancer', '2023-02-20', 'Stage I']
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'patient_detailed_excel',
    name: 'Detailed Patient Information (Excel)',
    description: 'Comprehensive template including medical history and treatment data',
    fileType: 'excel',
    templateUrl: '/templates/patient_detailed.xlsx',
    fieldMapping: {
      ...FIELD_MAPPINGS.patient_basic,
      'medical_history': { targetField: 'medicalHistory', required: false },
      'family_history': { targetField: 'familyHistory', required: false },
      'previous_treatments': { targetField: 'previousTreatments', required: false },
      'notes': { targetField: 'notes', required: false }
    },
    sampleData: [
      ['John Doe', '3201011234560001', '1980-01-15', 'Male', 'Breast Cancer', '2023-01-15', 'Stage II', 'Hypertension, Diabetes', 'Mother had breast cancer', 'Chemotherapy 2022', 'Patient responding well'],
      ['Jane Smith', '3301022345670001', '1985-05-20', 'Female', 'Lung Cancer', '2023-02-20', 'Stage I', 'Asthma', 'No family history', 'None', 'Early diagnosis']
    ],
    lastUpdated: new Date().toISOString()
  }
];

const ImportProgress: React.FC<{
  job: ImportJob;
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
}> = ({ job, onCancel, onRetry }) => {
  const getStatusIcon = () => {
    switch (job.status) {
      case 'uploading':
      case 'processing':
      case 'validating':
      case 'importing':
        return <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <DocumentIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'uploading':
      case 'processing':
      case 'validating':
      case 'importing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const duration = endTime.getTime() - startTime.getTime();

    if (duration < 1000) return '< 1s';
    if (duration < 60000) return `${Math.floor(duration / 1000)}s`;
    if (duration < 3600000) return `${Math.floor(duration / 60000)}m ${Math.floor((duration % 60000) / 1000)}s`;
    return `${Math.floor(duration / 3600000)}h ${Math.floor((duration % 3600000) / 60000)}m`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium text-gray-900">{job.fileName}</h3>
              <p className="text-sm text-gray-500 capitalize">{job.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Records:</span>
              <span className="ml-2 font-medium">
                {job.processedRecords} / {job.totalRecords}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Success Rate:</span>
              <span className="ml-2 font-medium text-green-600">
                {job.totalRecords > 0
                  ? Math.round((job.successfulRecords / job.totalRecords) * 100)
                  : 0}%
              </span>
            </div>
            <div>
              <span className="text-gray-500">Duration:</span>
              <span className="ml-2 font-medium">
                {formatDuration(job.startTime, job.endTime)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Errors:</span>
              <span className="ml-2 font-medium text-red-600">
                {job.failedRecords}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {job.status === 'processing' || job.status === 'validating' || job.status === 'importing' ? (
            <button
              onClick={() => onCancel(job.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          ) : job.status === 'failed' ? (
            <button
              onClick={() => onRetry(job.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
            </button>
          ) : null}

          {(job.status === 'completed' || job.status === 'failed') && (
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <EyeIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {(job.status === 'uploading' || job.status === 'processing' || job.status === 'validating' || job.status === 'importing') && (
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{Math.round(job.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Errors and Warnings */}
      {(job.errors.length > 0 || job.warnings.length > 0) && (
        <div className="border-t border-gray-200 pt-3">
          {job.errors.length > 0 && (
            <div className="mb-2">
              <p className="text-sm font-medium text-red-600 mb-1">
                {job.errors.length} Error{job.errors.length > 1 ? 's' : ''}:
              </p>
              <div className="max-h-20 overflow-y-auto space-y-1">
                {job.errors.slice(0, 3).map((error, index) => (
                  <p key={index} className="text-xs text-red-600">
                    Row {error.row}: {error.message}
                  </p>
                ))}
                {job.errors.length > 3 && (
                  <p className="text-xs text-red-400">
                    +{job.errors.length - 3} more errors...
                  </p>
                )}
              </div>
            </div>
          )}

          {job.warnings.length > 0 && (
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">
                {job.warnings.length} Warning{job.warnings.length > 1 ? 's' : ''}:
              </p>
              <div className="max-h-20 overflow-y-auto space-y-1">
                {job.warnings.slice(0, 3).map((warning, index) => (
                  <p key={index} className="text-xs text-yellow-600">
                    Row {warning.row}: {warning.message}
                  </p>
                ))}
                {job.warnings.length > 3 && (
                  <p className="text-xs text-yellow-400">
                    +{job.warnings.length - 3} more warnings...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TemplateCard: React.FC<{
  template: ImportTemplate;
  onDownload: (template: ImportTemplate) => void;
  onUse: (template: ImportTemplate) => void;
}> = ({ template, onDownload, onUse }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <TableCellsIcon className="w-4 h-4" />
          <span className="uppercase">{template.fileType}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {template.sampleData.length} sample rows • {Object.keys(template.fieldMapping).length} fields
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDownload(template)}
            className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => onUse(template)}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
};

const FieldMappingEditor: React.FC<{
  mapping: FieldMapping;
  onChange: (mapping: FieldMapping) => void;
  previewHeaders: string[];
}> = ({ mapping, onChange, previewHeaders }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleFieldMapping = (sourceField: string, targetField: string) => {
    const newMapping = {
      ...mapping,
      [sourceField]: {
        targetField,
        required: targetField !== '',
        transform: mapping[sourceField]?.transform
      }
    };
    onChange(newMapping);
  };

  const applyTemplate = (templateId: string) => {
    const template = ImportTemplates.find(t => t.id === templateId);
    if (template) {
      onChange(template.fieldMapping);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Field Mapping</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Templates
        </label>
        <select
          value={selectedTemplate}
          onChange={(e) => {
            setSelectedTemplate(e.target.value);
            if (e.target.value) {
              applyTemplate(e.target.value);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a template...</option>
          {ImportTemplates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Map your file columns to database fields:</p>

        {previewHeaders.slice(0, 10).map((header, index) => (
          <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{header}</p>
              <p className="text-xs text-gray-500">Column {index + 1}</p>
            </div>

            <select
              value={mapping[header]?.targetField || ''}
              onChange={(e) => handleFieldMapping(header, e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Ignore field</option>
              <optgroup label="Required Fields">
                <option value="patientName">Patient Name</option>
                <option value="idNumber">ID Number</option>
                <option value="birthDate">Birth Date</option>
                <option value="gender">Gender</option>
                <option value="tumorType">Tumor Type</option>
                <option value="diagnosisDate">Diagnosis Date</option>
              </optgroup>
              <optgroup label="Optional Fields">
                <option value="stage">Stage</option>
                <option value="medicalHistory">Medical History</option>
                <option value="familyHistory">Family History</option>
                <option value="previousTreatments">Previous Treatments</option>
                <option value="notes">Notes</option>
              </optgroup>
            </select>
          </div>
        ))}

        {previewHeaders.length > 10 && (
          <p className="text-sm text-gray-500">
            +{previewHeaders.length - 10} more columns (shown above first 10)
          </p>
        )}
      </div>
    </div>
  );
};

interface BatchImportManagerProps {
  centerId?: string;
}

export const BatchImportManager: React.FC<BatchImportManagerProps> = ({ centerId }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentJob, setCurrentJob] = useState<ImportJob | null>(null);
  const [showMapping, setShowMapping] = useState(false);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});
  const [previewData, setPreviewData] = useState<ImportPreview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock import jobs
  const [importJobs, setImportJobs] = useState<ImportJob[]>([
    {
      id: '1',
      fileName: 'patients_january.csv',
      fileType: 'csv',
      status: 'completed',
      progress: 100,
      totalRecords: 150,
      processedRecords: 150,
      successfulRecords: 145,
      failedRecords: 5,
      errors: [
        { row: 23, field: 'idNumber', value: 'invalid', message: 'Invalid ID format', severity: 'error' }
      ],
      warnings: [
        { row: 45, field: 'stage', message: 'Stage not specified', suggestion: 'Consider adding stage information' }
      ],
      startTime: new Date(Date.now() - 60000).toISOString(),
      endTime: new Date(Date.now() - 30000).toISOString(),
      createdBy: 'Dr. Smith'
    },
    {
      id: '2',
      fileName: 'follow_up_data.xlsx',
      fileType: 'excel',
      status: 'processing',
      progress: 65,
      totalRecords: 200,
      processedRecords: 130,
      successfulRecords: 125,
      failedRecords: 5,
      errors: [],
      warnings: [],
      startTime: new Date(Date.now() - 120000).toISOString(),
      createdBy: 'Nurse Johnson'
    }
  ]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray]);

    // Process first file for preview
    if (fileArray.length > 0) {
      processFilePreview(fileArray[0]);
    }
  }, []);

  const processFilePreview = async (file: File) => {
    // Simulate file processing and preview generation
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const headers = lines[0]?.split(',') || [];
        const sampleData = lines.slice(1, 6).map(line => line.split(','));

        const detectedMapping = detectFieldMapping(headers);

        setPreviewData({
          headers,
          sampleData,
          detectedFormat: 'CSV',
          estimatedRecords: lines.length - 1,
          suggestedMapping: detectedMapping
        });

        setFieldMapping(detectedMapping);
        setShowMapping(true);
      }
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const detectFieldMapping = (headers: string[]): FieldMapping => {
    const mapping: FieldMapping = {};

    headers.forEach(header => {
      const normalizedHeader = header.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

      // Map common field names to target fields
      for (const [templateName, templateMapping] of Object.entries(FIELD_MAPPINGS.patient_basic)) {
        if (normalizedHeader.includes(templateName.replace(/_/g, ''))) {
          mapping[header] = templateMapping[templateName];
          break;
        }
      }

      // If no match found, mark as ignored
      if (!mapping[header]) {
        mapping[header] = { targetField: '', required: false };
      }
    });

    return mapping;
  };

  const handleImport = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    const newJob: ImportJob = {
      id: `job_${Date.now()}`,
      fileName: selectedFiles[0].name,
      fileType: selectedFiles[0].name.endsWith('.csv') ? 'csv' :
                selectedFiles[0].name.endsWith('.xlsx') ? 'excel' : 'json',
      status: 'uploading',
      progress: 0,
      totalRecords: previewData?.estimatedRecords || 0,
      processedRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      errors: [],
      warnings: [],
      startTime: new Date().toISOString(),
      createdBy: 'Current User',
      centerId,
      mapping: fieldMapping,
      preview: previewData
    };

    setCurrentJob(newJob);
    setImportJobs(prev => [newJob, ...prev]);
    setSelectedFiles([]);
    setShowMapping(false);

    // Simulate import process
    simulateImportProgress(newJob);
  }, [selectedFiles, fieldMapping, previewData, centerId]);

  const simulateImportProgress = async (job: ImportJob) => {
    const stages = [
      { status: 'uploading', duration: 2000 },
      { status: 'validating', duration: 3000 },
      { status: 'processing', duration: 5000 },
      { status: 'importing', duration: 3000 }
    ];

    for (const stage of stages) {
      job.status = stage.status as any;

      // Simulate progress within this stage
      const progressStart = job.progress;
      const progressEnd = progressStart + (100 / stages.length);

      for (let progress = progressStart; progress <= progressEnd; progress += 5) {
        job.progress = Math.min(progress, 100);

        // Calculate processed records
        const processed = Math.floor((job.progress / 100) * job.totalRecords);
        job.processedRecords = processed;
        job.successfulRecords = Math.floor(processed * 0.95); // 95% success rate
        job.failedRecords = processed - job.successfulRecords;

        setImportJobs(prev => prev.map(j => j.id === job.id ? { ...j } : j));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Finalize
    job.status = 'completed';
    job.progress = 100;
    job.endTime = new Date().toISOString();

    setImportJobs(prev => prev.map(j => j.id === job.id ? { ...j } : j));
    setCurrentJob(null);
  };

  const handleCancel = useCallback((jobId: string) => {
    setImportJobs(prev => prev.map(job =>
      job.id === jobId
        ? { ...job, status: 'cancelled', endTime: new Date().toISOString() }
        : job
    ));
  }, []);

  const handleRetry = useCallback((jobId: string) => {
    const job = importJobs.find(j => j.id === jobId);
    if (job) {
      const retryJob: ImportJob = {
        ...job,
        id: `job_${Date.now()}`,
        status: 'uploading',
        progress: 0,
        processedRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        errors: [],
        warnings: [],
        startTime: new Date().toISOString(),
        endTime: undefined
      };

      setCurrentJob(retryJob);
      setImportJobs(prev => [retryJob, ...prev.filter(j => j.id !== jobId)]);
      simulateImportProgress(retryJob);
    }
  }, [importJobs]);

  const handleDownloadTemplate = useCallback((template: ImportTemplate) => {
    // Simulate template download
    const csvContent = template.sampleData.map(row => row.join(',')).join('\n');
    const headers = Object.keys(template.fieldMapping).filter(key => template.fieldMapping[key].required);

    const blob = new Blob([`${headers.join(',')}\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleUseTemplate = useCallback((template: ImportTemplate) => {
    setFieldMapping(template.fieldMapping);
    setSelectedFiles([]);
    setShowMapping(false);

    // Trigger file selection
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const activeJobs = importJobs.filter(job =>
    ['uploading', 'processing', 'validating', 'importing'].includes(job.status)
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Batch Import</h1>
          <p className="text-gray-500 mt-1">Import patient data in bulk from various file formats</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,.xlsx,.xls,.json,.xml,.hl7"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <CloudArrowUpIcon className="w-4 h-4" />
          Import Files
        </button>
      </div>

      {/* Import Templates */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Import Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ImportTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onDownload={handleDownloadTemplate}
              onUse={handleUseTemplate}
            />
          ))}
        </div>
      </div>

      {/* Field Mapping Modal */}
      {showMapping && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Map Fields for {selectedFiles[0]?.name}
              </h2>

              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Detected:</strong> {previewData.estimatedRecords} rows • {previewData.headers.length} columns
                </p>
              </div>

              <FieldMappingEditor
                mapping={fieldMapping}
                onChange={setFieldMapping}
                previewHeaders={previewData.headers}
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowMapping(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Active Imports</h2>
          <div className="space-y-4">
            {activeJobs.map(job => (
              <ImportProgress
                key={job.id}
                job={job}
                onCancel={handleCancel}
                onRetry={handleRetry}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Import History</h2>

        {importJobs.filter(job => job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled').length === 0 ? (
          <div className="text-center py-12">
            <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No import history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {importJobs
              .filter(job => job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled')
              .map(job => (
                <ImportProgress
                  key={job.id}
                  job={job}
                  onCancel={handleCancel}
                  onRetry={handleRetry}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchImportManager;