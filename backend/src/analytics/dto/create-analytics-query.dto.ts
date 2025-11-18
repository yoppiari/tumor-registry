import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum, IsOptional, IsObject, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAnalyticsQueryDto {
  @ApiProperty({ description: 'Metric to analyze', example: 'patient_volume' })
  @IsString()
  metric: string;

  @ApiProperty({
    description: 'Dimensions for grouping',
    example: ['cancer_type', 'stage', 'treatment_type'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  dimensions: string[];

  @ApiPropertyOptional({
    description: 'Filters to apply',
    type: [AnalyticsFilterDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnalyticsFilterDto)
  @IsOptional()
  filters?: AnalyticsFilterDto[];

  @ApiProperty({
    description: 'Date range for the query',
    type: DateRangeDto
  })
  @IsObject()
  @ValidateNested()
  @Type(() => DateRangeDto)
  dateRange: DateRangeDto;

  @ApiPropertyOptional({
    description: 'Aggregation function',
    enum: ['sum', 'avg', 'count', 'min', 'max', 'median']
  })
  @IsEnum(['sum', 'avg', 'count', 'min', 'max', 'median'])
  @IsOptional()
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median';

  @ApiPropertyOptional({ description: 'Fields to group by', example: ['cancer_type', 'month'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  groupBy?: string[];

  @ApiPropertyOptional({ description: 'Sort field', example: 'patient_volume' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc']
  })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Limit results', example: 100 })
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class AnalyticsFilterDto {
  @ApiProperty({ description: 'Field to filter on', example: 'cancer_type' })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Comparison operator',
    enum: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains', 'regex']
  })
  @IsEnum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains', 'regex'])
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'regex';

  @ApiProperty({ description: 'Filter value', example: 'Breast' })
  value: any;

  @ApiPropertyOptional({
    description: 'Logical operator for multiple filters',
    enum: ['and', 'or']
  })
  @IsEnum(['and', 'or'])
  @IsOptional()
  logicalOperator?: 'and' | 'or';
}

export class DateRangeDto {
  @ApiProperty({ description: 'Start date', example: '2024-01-01' })
  @IsString()
  startDate: string;

  @ApiProperty({ description: 'End date', example: '2024-12-31' })
  @IsString()
  endDate: string;
}

export class CreateMLPredictionDto {
  @ApiProperty({
    description: 'ML model type',
    enum: ['survival', 'response', 'toxicity', 'readmission', 'prognosis']
  })
  @IsEnum(['survival', 'response', 'toxicity', 'readmission', 'prognosis'])
  modelType: 'survival' | 'response' | 'toxicity' | 'readmission' | 'prognosis';

  @ApiPropertyOptional({ description: 'Patient ID' })
  @IsString()
  @IsOptional()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Treatment plan ID' })
  @IsString()
  @IsOptional()
  treatmentPlanId?: string;

  @ApiProperty({
    description: 'Input features for the ML model',
    type: [MLFeatureDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MLFeatureDto)
  features: MLFeatureDto[];
}

export class MLFeatureDto {
  @ApiProperty({ description: 'Feature name', example: 'age' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Feature value', example: 65 })
  value: any;

  @ApiPropertyOptional({ description: 'Feature importance', example: 0.35 })
  @IsNumber()
  @IsOptional()
  importance?: number;

  @ApiProperty({
    description: 'Feature category',
    enum: ['demographic', 'clinical', 'laboratory', 'treatment', 'imaging', 'genomic']
  })
  @IsEnum(['demographic', 'clinical', 'laboratory', 'treatment', 'imaging', 'genomic'])
  category: 'demographic' | 'clinical' | 'laboratory' | 'treatment' | 'imaging' | 'genomic';
}

export class CreateMonitoringRuleDto {
  @ApiProperty({ description: 'Rule name', example: 'High Toxicity Rate Alert' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Rule description', example: 'Alert when toxicity rate exceeds threshold' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Rule category',
    enum: ['clinical', 'operational', 'quality', 'system', 'security']
  })
  @IsEnum(['clinical', 'operational', 'quality', 'system', 'security'])
  category: 'clinical' | 'operational' | 'quality' | 'system' | 'security';

  @ApiProperty({ description: 'Monitoring condition', type: MonitoringConditionDto })
  @IsObject()
  @ValidateNested()
  @Type(() => MonitoringConditionDto)
  condition: MonitoringConditionDto;

  @ApiProperty({
    description: 'Actions to take when condition is met',
    type: [MonitoringActionDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonitoringActionDto)
  actions: MonitoringActionDto[];

  @ApiPropertyOptional({ description: 'Whether rule is enabled' })
  @IsOptional()
  enabled?: boolean;

  @ApiProperty({
    description: 'Alert severity',
    enum: ['info', 'warning', 'error', 'critical']
  })
  @IsEnum(['info', 'warning', 'error', 'critical'])
  severity: 'info' | 'warning' | 'error' | 'critical';

  @ApiPropertyOptional({ description: 'Cooldown period in minutes', example: 30 })
  @IsNumber()
  @IsOptional()
  cooldownPeriod?: number;

  @ApiPropertyOptional({ description: 'Monitoring schedule', type: MonitoringScheduleDto })
  @IsObject()
  @ValidateNested()
  @Type(() => MonitoringScheduleDto)
  @IsOptional()
  schedule?: MonitoringScheduleDto;
}

export class MonitoringConditionDto {
  @ApiProperty({ description: 'Metric to monitor', example: 'toxicity_rate' })
  @IsString()
  metric: string;

  @ApiProperty({
    description: 'Comparison operator',
    enum: ['gt', 'gte', 'lt', 'lte', 'eq', 'ne', 'in', 'nin', 'between', 'outside']
  })
  @IsEnum(['gt', 'gte', 'lt', 'lte', 'eq', 'ne', 'in', 'nin', 'between', 'outside'])
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne' | 'in' | 'nin' | 'between' | 'outside';

  @ApiProperty({ description: 'Threshold value', example: 0.4 })
  value: any;

  @ApiPropertyOptional({ description: 'Time window in minutes', example: 60 })
  @IsNumber()
  @IsOptional()
  timeWindow?: number;

  @ApiPropertyOptional({
    description: 'Aggregation function',
    enum: ['avg', 'sum', 'count', 'min', 'max']
  })
  @IsEnum(['avg', 'sum', 'count', 'min', 'max'])
  @IsOptional()
  aggregation?: 'avg' | 'sum' | 'count' | 'min' | 'max';

  @ApiPropertyOptional({ description: 'Field to group by', example: 'patient_id' })
  @IsString()
  @IsOptional()
  groupBy?: string;
}

export class MonitoringActionDto {
  @ApiProperty({
    description: 'Action type',
    enum: ['alert', 'email', 'sms', 'webhook', 'notification', 'escalation']
  })
  @IsEnum(['alert', 'email', 'sms', 'webhook', 'notification', 'escalation'])
  type: 'alert' | 'email' | 'sms' | 'webhook' | 'notification' | 'escalation';

  @ApiProperty({ description: 'Action parameters', example: { recipients: ['admin@hospital.com'], subject: 'High toxicity alert' } })
  @IsObject()
  parameters: Record<string, any>;

  @ApiPropertyOptional({ description: 'Whether action is enabled' })
  @IsOptional()
  enabled?: boolean;
}

export class MonitoringScheduleDto {
  @ApiProperty({
    description: 'Schedule type',
    enum: ['continuous', 'interval', 'cron']
  })
  @IsEnum(['continuous', 'interval', 'cron'])
  type: 'continuous' | 'interval' | 'cron';

  @ApiPropertyOptional({ description: 'Interval in minutes', example: 15 })
  @IsNumber()
  @IsOptional()
  interval?: number;

  @ApiPropertyOptional({ description: 'Cron expression', example: '0 */6 * * *' })
  @IsString()
  @IsOptional()
  cronExpression?: string;

  @ApiPropertyOptional({ description: 'Timezone', example: 'Asia/Jakarta' })
  @IsString()
  @IsOptional()
  timezone?: string;
}

export class CreateExecutiveDashboardDto {
  @ApiProperty({ description: 'Dashboard name', example: 'Executive Overview' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Dashboard description', example: 'Key metrics and KPIs for executive leadership' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Dashboard layout configuration', type: DashboardLayoutDto })
  @IsObject()
  @ValidateNested()
  @Type(() => DashboardLayoutDto)
  layout: DashboardLayoutDto;

  @ApiPropertyOptional({ description: 'Date range for dashboard data', type: DateRangeDto })
  @IsObject()
  @ValidateNested()
  @Type(() => DateRangeDto)
  @IsOptional()
  dateRange?: DateRangeDto;

  @ApiPropertyOptional({ description: 'Refresh interval in minutes', example: 15 })
  @IsNumber()
  @IsOptional()
  refreshInterval?: number;

  @ApiPropertyOptional({ description: 'Whether dashboard is shared' })
  @IsOptional()
  shared?: boolean;

  @ApiPropertyOptional({ description: 'Dashboard owners', example: ['user-123'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  owners?: string[];

  @ApiPropertyOptional({ description: 'Dashboard viewers', example: ['user-456', 'user-789'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  viewers?: string[];

  @ApiPropertyOptional({ description: 'Dashboard settings', type: DashboardSettingsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => DashboardSettingsDto)
  @IsOptional()
  settings?: DashboardSettingsDto;
}

export class DashboardLayoutDto {
  @ApiProperty({
    description: 'Layout type',
    enum: ['grid', 'flex', 'custom']
  })
  @IsEnum(['grid', 'flex', 'custom'])
  type: 'grid' | 'flex' | 'custom';

  @ApiProperty({ description: 'Number of columns', example: 12 })
  @IsNumber()
  columns: number;

  @ApiPropertyOptional({ description: 'Responsive breakpoints' })
  @IsObject()
  @IsOptional()
  breakpoints?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export class DashboardSettingsDto {
  @ApiPropertyOptional({ description: 'Auto-refresh enabled' })
  @IsOptional()
  autoRefresh?: boolean;

  @ApiPropertyOptional({
    description: 'Theme',
    enum: ['light', 'dark', 'auto']
  })
  @IsEnum(['light', 'dark', 'auto'])
  @IsOptional()
  theme?: 'light' | 'dark' | 'auto';

  @ApiPropertyOptional({ description: 'Language', example: 'en' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ description: 'Timezone', example: 'Asia/Jakarta' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Default export format',
    enum: ['pdf', 'excel', 'png', 'csv']
  })
  @IsEnum(['pdf', 'excel', 'png', 'csv'])
  @IsOptional()
  exportFormat?: 'pdf' | 'excel' | 'png' | 'csv';

  @ApiPropertyOptional({ description: 'Enable notifications' })
  @IsOptional()
  notifications?: boolean;

  @ApiPropertyOptional({
    description: 'Drill-down mode',
    enum: ['modal', 'page', 'inline']
  })
  @IsEnum(['modal', 'page', 'inline'])
  @IsOptional()
  drillDownMode?: 'modal' | 'page' | 'inline';
}

export class GenerateAnalyticsReportDto {
  @ApiProperty({
    description: 'Report type',
    enum: ['treatment_outcomes', 'quality_metrics', 'operational_efficiency', 'financial_analysis']
  })
  @IsEnum(['treatment_outcomes', 'quality_metrics', 'operational_efficiency', 'financial_analysis'])
  reportType: 'treatment_outcomes' | 'quality_metrics' | 'operational_efficiency' | 'financial_analysis';

  @ApiProperty({ description: 'Report title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Report description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Patient IDs to include' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  patientIds?: string[];

  @ApiPropertyOptional({ description: 'Treatment plan IDs to include' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  treatmentPlanIds?: string[];

  @ApiProperty({ description: 'Date range for report', type: DateRangeDto })
  @IsObject()
  @ValidateNested()
  @Type(() => DateRangeDto)
  dateRange: DateRangeDto;

  @ApiPropertyOptional({ description: 'Additional report parameters' })
  @IsObject()
  @IsOptional()
  parameters?: any;

  @ApiPropertyOptional({
    description: 'Output format',
    enum: ['json', 'pdf', 'excel', 'csv']
  })
  @IsEnum(['json', 'pdf', 'excel', 'csv'])
  @IsOptional()
  format?: 'json' | 'pdf' | 'excel' | 'csv';

  @ApiPropertyOptional({ description: 'Email recipients for report delivery' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  emailRecipients?: string[];

  @ApiPropertyOptional({ description: 'Schedule report generation', type: ReportScheduleDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ReportScheduleDto)
  @IsOptional()
  schedule?: ReportScheduleDto;
}

export class ReportScheduleDto {
  @ApiProperty({
    description: 'Schedule type',
    enum: ['once', 'recurring']
  })
  @IsEnum(['once', 'recurring'])
  type: 'once' | 'recurring';

  @ApiPropertyOptional({
    description: 'Frequency for recurring reports',
    enum: ['daily', 'weekly', 'monthly', 'quarterly']
  })
  @IsEnum(['daily', 'weekly', 'monthly', 'quarterly'])
  @IsOptional()
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';

  @ApiPropertyOptional({ description: 'Cron expression for complex scheduling' })
  @IsString()
  @IsOptional()
  cronExpression?: string;

  @ApiPropertyOptional({ description: 'Timezone for scheduling', example: 'Asia/Jakarta' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({ description: 'Start date for recurring schedule' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for recurring schedule' })
  @IsString()
  @IsOptional()
  endDate?: string;
}