import { Patient, TreatmentPlan, TreatmentSession, MedicalRecord } from '../types';

// Core Analytics Types
export interface AnalyticsQuery {
  metric: string;
  dimensions: string[];
  filters: AnalyticsFilter[];
  dateRange: DateRange;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median';
  groupBy?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface AnalyticsFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'regex';
  value: any;
  logicalOperator?: 'and' | 'or';
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsResult {
  query: AnalyticsQuery;
  data: AnalyticsDataRow[];
  metadata: AnalyticsMetadata;
  insights?: AnalyticsInsight[];
  recommendations?: AnalyticsRecommendation[];
  generatedAt: Date;
  executionTime: number; // milliseconds
}

export interface AnalyticsDataRow {
  dimensions: Record<string, any>;
  metrics: Record<string, number>;
  metadata?: Record<string, any>;
}

export interface AnalyticsMetadata {
  totalRows: number;
  cached: boolean;
  lastUpdated: Date;
  dataSource: string;
  confidence?: number; // 0-1 for ML predictions
}

export interface AnalyticsInsight {
  type: 'trend' | 'anomaly' | 'correlation' | 'outlier' | 'pattern' | 'prediction';
  title: string;
  description: string;
  confidence: number; // 0-1
  significance: number; // p-value or similar
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations?: string[];
  data: any;
  discoveredAt: Date;
}

export interface AnalyticsRecommendation {
  type: 'clinical' | 'operational' | 'quality' | 'financial' | 'strategic';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  expectedImpact: string;
  implementation: string;
  resources?: string[];
  kpi?: string[];
  timeframe: string;
}

// Machine Learning Models
export interface MLPrediction {
  id: string;
  modelType: 'survival' | 'response' | 'toxicity' | 'readmission' | 'prognosis';
  modelName: string;
  version: string;
  inputFeatures: MLFeature[];
  prediction: MLPredictionResult;
  confidence: number;
  explanation?: MLExplanation;
  metadata: MLPredictionMetadata;
  createdAt: Date;
}

export interface MLFeature {
  name: string;
  value: any;
  importance?: number; // feature importance for this prediction
  category: 'demographic' | 'clinical' | 'laboratory' | 'treatment' | 'imaging' | 'genomic';
}

export interface MLPredictionResult {
  value: number; // prediction score
  category?: string; // classification category
  probability?: number; // confidence probability
  riskLevel?: 'low' | 'medium' | 'high' | 'very_high';
  timeframe?: string; // prediction timeframe
  interpretation: string;
  confidenceInterval?: {
    lower: number;
    upper: number;
  };
}

export interface MLExplanation {
  method: 'shap' | 'lime' | 'feature_importance' | 'decision_tree';
  factors: ExplanationFactor[];
  summary: string;
  visualization?: string; // base64 encoded chart or data for visualization
}

export interface ExplanationFactor {
  feature: string;
  value: any;
  contribution: number; // positive or negative contribution to prediction
  importance: number; // relative importance
  description: string;
}

export interface MLPredictionMetadata {
  patientId?: string;
  treatmentPlanId?: string;
  modelTrainingDate: Date;
  lastCalibrated: Date;
  validationScore: number;
  trainingDatasetSize: number;
  featureCount: number;
  algorithm: 'random_forest' | 'gradient_boosting' | 'neural_network' | 'svm' | 'logistic_regression' | 'cox_regression';
}

// Specific ML Model Types
export interface SurvivalPrediction extends MLPrediction {
  prediction: {
    overallSurvival: {
      months: number;
      probability: number;
    };
    progressionFreeSurvival: {
      months: number;
      probability: number;
    };
    cancerSpecificSurvival?: {
      months: number;
      probability: number;
    };
  };
}

export interface TreatmentResponsePrediction extends MLPrediction {
  prediction: {
    responseRate: number; // probability of response
    responseCategory: 'CR' | 'PR' | 'SD' | 'PD'; // predicted response
    timeToResponse: number; // months
    durationOfResponse: number; // months
  };
}

export interface ToxicityPrediction extends MLPrediction {
  prediction: {
    overallToxicityRisk: number; // 0-1
    grade3PlusRisk: number; // probability of grade 3+ toxicity
    specificToxicities: {
      toxicityType: string;
      risk: number;
      severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
    }[];
  };
}

// Real-time Monitoring
export interface MonitoringAlert {
  id: string;
  patientId?: string;
  treatmentPlanId?: string;
  alertType: 'clinical' | 'operational' | 'quality' | 'system' | 'security';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  description?: string;
  category: string;
  source: string;
  timestamp: Date;
  resolved: boolean;
  resolutionTimestamp?: Date;
  resolutionNotes?: string;
  assignedTo?: string;
  metadata?: any;
  actions?: AlertAction[];
}

export interface AlertAction {
  type: 'investigate' | 'notify' | 'escalate' | 'resolve' | 'ignore';
  description: string;
  timestamp: Date;
  performedBy: string;
  notes?: string;
}

export interface MonitoringRule {
  id: string;
  name: string;
  description: string;
  category: 'clinical' | 'operational' | 'quality' | 'system' | 'security';
  condition: MonitoringCondition;
  actions: MonitoringAction[];
  enabled: boolean;
  severity: 'info' | 'warning' | 'error' | 'critical';
  cooldownPeriod: number; // minutes
  lastTriggered?: Date;
  schedule?: MonitoringSchedule;
  metadata?: any;
}

export interface MonitoringCondition {
  metric: string;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne' | 'in' | 'nin' | 'between' | 'outside';
  value: any;
  timeWindow?: number; // minutes for time-based conditions
  aggregation?: 'avg' | 'sum' | 'count' | 'min' | 'max';
  groupBy?: string;
}

export interface MonitoringAction {
  type: 'alert' | 'email' | 'sms' | 'webhook' | 'notification' | 'escalation';
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface MonitoringSchedule {
  type: 'continuous' | 'interval' | 'cron';
  interval?: number; // minutes
  cronExpression?: string;
  timezone?: string;
}

// Executive Dashboard KPIs
export interface ExecutiveKPI {
  id: string;
  name: string;
  description: string;
  category: 'clinical' | 'operational' | 'financial' | 'quality' | 'satisfaction';
  value: number;
  previousValue?: number;
  target?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastUpdated: Date;
  dataSource: string;
  drillDownPath?: string;
  insights?: string[];
}

export interface ExecutiveDashboard {
  id: string;
  name: string;
  description: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  dateRange: DateRange;
  lastRefreshed: Date;
  refreshInterval: number; // minutes
  shared: boolean;
  owners: string[];
  viewers: string[];
  settings: DashboardSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardLayout {
  type: 'grid' | 'flex' | 'custom';
  columns: number;
  breakpoints?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'metric' | 'alert' | 'map' | 'custom';
  title: string;
  description?: string;
  position: WidgetPosition;
  size: WidgetSize;
  config: WidgetConfig;
  data?: any;
  loading?: boolean;
  error?: string;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface WidgetConfig {
  query?: AnalyticsQuery;
  chartType?: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'gauge' | 'funnel';
  colors?: string[];
  legend?: boolean;
  grid?: boolean;
  axes?: any;
  refreshInterval?: number;
  drillDown?: boolean;
  exportOptions?: string[];
  thresholds?: WidgetThreshold[];
}

export interface WidgetThreshold {
  type: 'value' | 'trend' | 'anomaly';
  condition: string;
  color: string;
  alert?: boolean;
}

export interface DashboardFilter {
  id: string;
  name: string;
  field: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number' | 'boolean';
  options?: FilterOption[];
  defaultValue?: any;
  required: boolean;
}

export interface FilterOption {
  label: string;
  value: any;
}

export interface DashboardSettings {
  autoRefresh: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  exportFormat: 'pdf' | 'excel' | 'png' | 'csv';
  notifications: boolean;
  drillDownMode: 'modal' | 'page' | 'inline';
}

// Data Quality & Governance
export interface DataQualityReport {
  id: string;
  reportDate: Date;
  dataSource: string;
  overallScore: number; // 0-100
  dimensions: DataQualityDimension[];
  issues: DataQualityIssue[];
  recommendations: DataQualityRecommendation[];
  generatedBy: string;
  createdAt: Date;
}

export interface DataQualityDimension {
  name: string;
  score: number; // 0-100
  status: 'excellent' | 'good' | 'fair' | 'poor';
  metrics: {
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
    validity: number;
    uniqueness: number;
  };
  details?: string;
}

export interface DataQualityIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'missing_data' | 'invalid_format' | 'duplicate' | 'inconsistent' | 'outdated' | 'range_violation';
  field: string;
  recordId?: string;
  description: string;
  count: number;
  percentage: number;
  firstDetected: Date;
  lastDetected: Date;
  status: 'open' | 'investigating' | 'resolved';
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface DataQualityRecommendation {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'data_entry' | 'validation' | 'process' | 'system' | 'training';
  title: string;
  description: string;
  expectedImpact: string;
  implementation: string;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  owner?: string;
}

// Performance Metrics
export interface SystemPerformanceMetrics {
  timestamp: Date;
  responseTime: number; // milliseconds
  throughput: number; // requests per second
  errorRate: number; // percentage
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  diskUsage: number; // percentage
  networkLatency: number; // milliseconds
  databaseConnections: number;
  activeUsers: number;
  cacheHitRate: number; // percentage
}

// Compliance & Audit
export interface ComplianceAudit {
  id: string;
  auditDate: Date;
  auditType: 'hipaa' | 'gdpr' | 'sox' | 'quality' | 'security' | 'custom';
  scope: string[];
  findings: ComplianceFinding[];
  overallScore: number; // 0-100
  status: 'compliant' | 'partial' | 'non_compliant';
  recommendations: ComplianceRecommendation[];
  nextAuditDate: Date;
  auditor: string;
  reviewedBy: string;
  createdAt: Date;
}

export interface ComplianceFinding {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'needs_improvement';
  evidence?: string[];
  remediationPlan?: string;
  dueDate?: Date;
  responsibleParty?: string;
}

export interface ComplianceRecommendation {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  requirements: string[];
  implementation: string;
  timeline: string;
  resources?: string[];
  riskMitigation: string;
}

// Export & Integration
export interface AnalyticsExport {
  id: string;
  name: string;
  description: string;
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'xml' | 'hl7' | 'fhir';
  query: AnalyticsQuery;
  template?: string;
  schedule?: ExportSchedule;
  recipients: string[];
  delivery: 'email' | 'ftp' | 'api' | 'download';
  encryption: boolean;
  watermark?: boolean;
  lastRun?: Date;
  nextRun?: Date;
  status: 'active' | 'paused' | 'error';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExportSchedule {
  type: 'once' | 'recurring';
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  cronExpression?: string;
  timezone?: string;
  startDate?: Date;
  endDate?: Date;
}

// API Integration
export interface ExternalSystemIntegration {
  id: string;
  name: string;
  type: 'hl7' | 'fhir' | 'rest_api' | 'database' | 'file' | 'websocket';
  status: 'active' | 'inactive' | 'error';
  configuration: IntegrationConfiguration;
  mappings: FieldMapping[];
  syncSchedule?: SyncSchedule;
  lastSync?: Date;
  errorCount: number;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationConfiguration {
  endpoint?: string;
  authentication: {
    type: 'none' | 'basic' | 'bearer' | 'oauth2' | 'api_key';
    credentials?: any;
  };
  headers?: Record<string, string>;
  parameters?: Record<string, any>;
  timeout: number; // seconds
  retryAttempts: number;
  retryDelay: number; // seconds
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  validation?: string;
  required: boolean;
}

export interface SyncSchedule {
  type: 'real_time' | 'batch' | 'scheduled';
  interval?: number; // minutes
  cronExpression?: string;
  timezone?: string;
}