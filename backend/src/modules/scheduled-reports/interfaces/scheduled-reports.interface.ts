export interface ScheduleConfig {
  schedule: string; // cron expression
  timezone?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ReportScheduleData {
  templateId: string;
  name: string;
  description?: string;
  schedule: string;
  recipients: RecipientConfig[];
  parameters?: Record<string, any>;
  format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON' | 'HTML';
  deliveryMethod: 'EMAIL' | 'FILE_SHARE' | 'API_WEBHOOK' | 'SFTP' | 'CLOUD_STORAGE';
  isActive?: boolean;
}

export interface RecipientConfig {
  type: 'USER' | 'ROLE' | 'EMAIL' | 'GROUP';
  value: string;
  personalization?: Record<string, any>;
}

export interface ExecutionContext {
  scheduledReportId: string;
  executionTime: Date;
  parameters?: Record<string, any>;
  retryCount?: number;
}

export interface ExecutionResult {
  success: boolean;
  filePath?: string;
  fileSize?: number;
  duration: number;
  errorMessage?: string;
  deliveryStatus?: string;
}

export interface ReportValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  dataQuality?: {
    completeness: number;
    accuracy: number;
    timeliness: number;
  };
}

export interface ExecutiveSummary {
  title: string;
  period: string;
  keyMetrics: KeyMetric[];
  insights: Insight[];
  recommendations: string[];
  generatedAt: Date;
}

export interface KeyMetric {
  name: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  status?: 'good' | 'warning' | 'critical';
}

export interface Insight {
  category: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  data?: any;
}

export interface ThresholdAlert {
  metricName: string;
  currentValue: number;
  thresholdValue: number;
  condition: 'greater_than' | 'less_than' | 'equals';
  severity: 'info' | 'warning' | 'critical';
  message: string;
}
