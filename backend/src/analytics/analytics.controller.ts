import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsQueryDto } from './dto/create-analytics-query.dto';
import { CreateMLPredictionDto } from './dto/create-ml-prediction.dto';
import { CreateMonitoringRuleDto } from './dto/create-monitoring-rule.dto';
import { CreateExecutiveDashboardDto } from './dto/create-executive-dashboard.dto';
import { GenerateAnalyticsReportDto } from './dto/generate-analytics-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Analytics Query Engine
  @Post('query')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Execute analytics query' })
  @ApiResponse({ status: 200, description: 'Analytics query executed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async executeAnalyticsQuery(@Req() req: any, @Body() queryDto: CreateAnalyticsQueryDto) {
    return this.analyticsService.executeAnalyticsQuery(queryDto);
  }

  @Get('cached-queries')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get cached analytics results' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of cached results to return' })
  @ApiResponse({ status: 200, description: 'Cached results retrieved successfully' })
  async getCachedQueries(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    // Implementation would fetch cached analytics results
    return {
      cachedResults: [
        {
          id: 'query-1',
          query: 'Patient volume trends',
          result: { value: 2543, trend: 'up' },
          cachedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000)
        }
      ],
      total: 1
    };
  }

  // Machine Learning Predictions
  @Post('ml/predict')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Generate ML prediction' })
  @ApiResponse({ status: 201, description: 'ML prediction generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid prediction request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('clinician', 'researcher', 'admin')
  async generateMLPrediction(@Req() req: any, @Body() predictionDto: CreateMLPredictionDto) {
    return this.analyticsService.generateMLPrediction(predictionDto);
  }

  @Get('ml/models')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get available ML models' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by model type' })
  @ApiResponse({ status: 200, description: 'ML models retrieved successfully' })
  @Roles('clinician', 'researcher', 'admin')
  async getMLModels(@Query('type') type?: string) {
    const models = [
      {
        id: 'survival-cox-v1.0',
        name: 'Survival Prediction Model',
        type: 'survival',
        algorithm: 'cox_regression',
        version: '1.0',
        accuracy: 0.87,
        features: 15,
        trainingData: 5000,
        lastUpdated: new Date('2024-06-01'),
        description: 'Predicts overall and progression-free survival based on clinical and demographic factors'
      },
      {
        id: 'response-gb-v2.1',
        name: 'Treatment Response Model',
        type: 'response',
        algorithm: 'gradient_boosting',
        version: '2.1',
        accuracy: 0.83,
        features: 22,
        trainingData: 3500,
        lastUpdated: new Date('2024-05-15'),
        description: 'Predicts treatment response rate and duration'
      },
      {
        id: 'toxicity-rf-v1.5',
        name: 'Toxicity Prediction Model',
        type: 'toxicity',
        algorithm: 'random_forest',
        version: '1.5',
        accuracy: 0.79,
        features: 18,
        trainingData: 4200,
        lastUpdated: new Date('2024-04-20'),
        description: 'Predicts likelihood of treatment-related toxicities'
      }
    ];

    const filteredModels = type ? models.filter(m => m.type === type) : models;
    return { models: filteredModels, total: filteredModels.length };
  }

  @Get('ml/predictions')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get ML prediction history' })
  @ApiQuery({ name: 'patientId', required: false, description: 'Filter by patient ID' })
  @ApiQuery({ name: 'modelType', required: false, description: 'Filter by model type' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results to return' })
  @ApiResponse({ status: 200, description: 'Prediction history retrieved successfully' })
  @Roles('clinician', 'researcher', 'admin')
  async getMLPredictions(
    @Query('patientId') patientId?: string,
    @Query('modelType') modelType?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number
  ) {
    // Implementation would fetch prediction history from database
    return {
      predictions: [
        {
          id: 'pred-1',
          patientId: 'patient-123',
          modelType: 'survival',
          prediction: { overallSurvival: 42.3, probability: 0.75 },
          confidence: 0.82,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ],
      total: 1
    };
  }

  // Real-time Monitoring
  @Post('monitoring/rules')
  @Throttle({ default: { limit: 15, ttl: 60000 } }) // 15 requests per minute
  @ApiOperation({ summary: 'Create monitoring rule' })
  @ApiResponse({ status: 201, description: 'Monitoring rule created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid rule parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('admin', 'system_operator')
  async createMonitoringRule(@Req() req: any, @Body() ruleDto: CreateMonitoringRuleDto) {
    return this.analyticsService.createMonitoringRule(ruleDto);
  }

  @Get('monitoring/rules')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get monitoring rules' })
  @ApiQuery({ name: 'enabled', required: false, description: 'Filter by enabled status' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiResponse({ status: 200, description: 'Monitoring rules retrieved successfully' })
  @Roles('admin', 'system_operator')
  async getMonitoringRules(
    @Query('enabled') enabled?: boolean,
    @Query('category') category?: string
  ) {
    // Implementation would fetch monitoring rules
    return {
      rules: [
        {
          id: 'rule-1',
          name: 'High Toxicity Rate Alert',
          category: 'clinical',
          enabled: true,
          severity: 'warning',
          lastTriggered: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ],
      total: 1
    };
  }

  @Get('monitoring/alerts')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  @ApiOperation({ summary: 'Get active monitoring alerts' })
  @ApiQuery({ name: 'severity', required: false, description: 'Filter by severity level' })
  @ApiQuery({ name: 'resolved', required: false, description: 'Filter by resolution status' })
  @ApiResponse({ status: 200, description: 'Alerts retrieved successfully' })
  async getMonitoringAlerts(
    @Query('severity') severity?: string,
    @Query('resolved') resolved?: boolean
  ) {
    return this.analyticsService.getActiveAlerts(severity);
  }

  @Post('monitoring/alerts/:alertId/resolve')
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  @ApiOperation({ summary: 'Resolve monitoring alert' })
  @ApiParam({ name: 'alertId', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert resolved successfully' })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  @Roles('admin', 'system_operator')
  async resolveAlert(
    @Req() req: any,
    @Param('alertId') alertId: string,
    @Body() resolutionData: { notes?: string; assignedTo?: string }
  ) {
    // Implementation would mark alert as resolved
    return {
      success: true,
      message: 'Alert resolved successfully',
      resolvedAt: new Date()
    };
  }

  // Executive Dashboard
  @Post('dashboards')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Create executive dashboard' })
  @ApiResponse({ status: 201, description: 'Dashboard created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid dashboard configuration' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('admin', 'executive', 'manager')
  async createExecutiveDashboard(@Req() req: any, @Body() dashboardDto: CreateExecutiveDashboardDto) {
    return this.analyticsService.createExecutiveDashboard(dashboardDto);
  }

  @Get('dashboards')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get executive dashboards' })
  @ApiQuery({ name: 'shared', required: false, description: 'Filter by shared dashboards' })
  @ApiResponse({ status: 200, description: 'Dashboards retrieved successfully' })
  @Roles('admin', 'executive', 'manager')
  async getExecutiveDashboards(
    @Query('shared') shared?: boolean
  ) {
    const userId = req.user.sub;
    return this.analyticsService.getExecutiveDashboards(userId);
  }

  @Get('dashboards/:dashboardId')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  @ApiOperation({ summary: 'Get dashboard by ID' })
  @ApiParam({ name: 'dashboardId', description: 'Dashboard ID' })
  @ApiResponse({ status: 200, description: 'Dashboard retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  @Roles('admin', 'executive', 'manager')
  async getDashboardById(@Param('dashboardId') dashboardId: string) {
    // Implementation would fetch specific dashboard with its widgets
    return {
      id: dashboardId,
      name: 'Executive Overview',
      widgets: [
        {
          id: 'widget-1',
          type: 'kpi',
          title: 'Patient Volume',
          value: 2543,
          trend: 'up'
        }
      ],
      lastRefreshed: new Date()
    };
  }

  @Get('kpis')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get executive KPIs' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by KPI category' })
  @ApiQuery({ name: 'period', required: false, description: 'Time period for KPIs' })
  @ApiResponse({ status: 200, description: 'KPIs retrieved successfully' })
  @Roles('admin', 'executive', 'manager')
  async getExecutiveKPIs(
    @Query('category') category?: string,
    @Query('period') period?: string
  ) {
    return this.analyticsService.calculateExecutiveKPIs();
  }

  @Get('kpis/trends')
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  @ApiOperation({ summary: 'Get KPI trends over time' })
  @ApiQuery({ name: 'kpi', required: true, description: 'KPI name' })
  @ApiQuery({ name: 'period', required: false, description: 'Time period (days)' })
  @ApiQuery({ name: 'granularity', required: false, description: 'Time granularity (hour/day/week/month)' })
  @ApiResponse({ status: 200, description: 'KPI trends retrieved successfully' })
  @Roles('admin', 'executive', 'manager')
  async getKPITrends(
    @Query('kpi') kpi: string,
    @Query('period', new DefaultValuePipe(30), ParseIntPipe) period: number,
    @Query('granularity') granularity?: string
  ) {
    // Generate mock trend data
    const dataPoints = [];
    const now = new Date();

    for (let i = period; i >= 0; i -= Math.ceil(period / 20)) {
      dataPoints.push({
        date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
        value: Math.round(2000 + Math.random() * 1000),
        target: 2500
      });
    }

    return {
      kpi,
      period,
      granularity: granularity || 'day',
      dataPoints,
      trend: {
        direction: 'up',
        percentage: 8.5
      }
    };
  }

  // Data Quality & Governance
  @Post('data-quality/reports')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Generate data quality report' })
  @ApiQuery({ name: 'dataSource', required: true, description: 'Data source to analyze' })
  @ApiResponse({ status: 201, description: 'Data quality report generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data source' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('admin', 'data_manager')
  async generateDataQualityReport(@Query('dataSource') dataSource: string) {
    return this.analyticsService.generateDataQualityReport(dataSource);
  }

  @Get('data-quality/reports')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Get data quality reports' })
  @ApiQuery({ name: 'dataSource', required: false, description: 'Filter by data source' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of reports to return' })
  @ApiResponse({ status: 200, description: 'Data quality reports retrieved successfully' })
  @Roles('admin', 'data_manager')
  async getDataQualityReports(
    @Query('dataSource') dataSource?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    // Implementation would fetch data quality reports
    return {
      reports: [
        {
          id: 'dq-1',
          reportDate: new Date(),
          dataSource: 'patient_management',
          overallScore: 87.3,
          status: 'good'
        }
      ],
      total: 1
    };
  }

  @Post('compliance/audits')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
  @ApiOperation({ summary: 'Generate compliance audit' })
  @ApiQuery({ name: 'auditType', required: true, description: 'Type of compliance audit' })
  @ApiResponse({ status: 201, description: 'Compliance audit generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid audit type' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('admin', 'compliance_officer')
  async generateComplianceAudit(@Query('auditType') auditType: string) {
    return this.analyticsService.generateComplianceAudit(auditType);
  }

  @Get('compliance/audits')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Get compliance audits' })
  @ApiQuery({ name: 'auditType', required: false, description: 'Filter by audit type' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by audit status' })
  @ApiResponse({ status: 200, description: 'Compliance audits retrieved successfully' })
  @Roles('admin', 'compliance_officer')
  async getComplianceAudits(
    @Query('auditType') auditType?: string,
    @Query('status') status?: string
  ) {
    // Implementation would fetch compliance audits
    return {
      audits: [
        {
          id: 'audit-1',
          auditType: 'hipaa',
          auditDate: new Date(),
          status: 'partial',
          overallScore: 91.2
        }
      ],
      total: 1
    };
  }

  // Advanced Reporting
  @Post('reports/generate')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Generate advanced analytics report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid report parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('researcher', 'admin', 'national_stakeholder')
  async generateAdvancedReport(@Req() req: any, @Body() reportDto: GenerateAnalyticsReportDto) {
    return this.analyticsService.generateAnalyticsReport(reportDto);
  }

  @Get('reports/templates')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get available report templates' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by report category' })
  @ApiResponse({ status: 200, description: 'Report templates retrieved successfully' })
  async getReportTemplates(@Query('category') category?: string) {
    const templates = [
      {
        id: 'template-1',
        name: 'Treatment Outcomes Analysis',
        category: 'clinical',
        description: 'Comprehensive analysis of treatment outcomes and survival data',
        parameters: ['dateRange', 'cancerType', 'treatmentType'],
        outputFormats: ['pdf', 'excel', 'json']
      },
      {
        id: 'template-2',
        name: 'Quality Metrics Dashboard',
        category: 'quality',
        description: 'Quality indicators and performance metrics',
        parameters: ['dateRange', 'department', 'kpis'],
        outputFormats: ['pdf', 'excel', 'json']
      },
      {
        id: 'template-3',
        name: 'Operational Efficiency Report',
        category: 'operational',
        description: 'Resource utilization and operational efficiency analysis',
        parameters: ['dateRange', 'facility', 'metrics'],
        outputFormats: ['pdf', 'excel', 'json']
      }
    ];

    const filteredTemplates = category ? templates.filter(t => t.category === category) : templates;
    return { templates: filteredTemplates, total: filteredTemplates.length };
  }

  @Get('reports/history')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get report generation history' })
  @ApiQuery({ name: 'reportType', required: false, description: 'Filter by report type' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of reports to return' })
  @ApiResponse({ status: 200, description: 'Report history retrieved successfully' })
  async getReportHistory(
    @Query('reportType') reportType?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    // Implementation would fetch report generation history
    return {
      reports: [
        {
          id: 'report-1',
          reportType: 'treatment_outcomes',
          title: 'Q3 2024 Treatment Outcomes Analysis',
          generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          generatedBy: 'dr.smith',
          status: 'completed',
          fileUrl: '/reports/outcomes-q3-2024.pdf'
        }
      ],
      total: 1
    };
  }

  // System Performance Metrics
  @Get('system/performance')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  @ApiOperation({ summary: 'Get system performance metrics' })
  @ApiQuery({ name: 'timeframe', required: false, description: 'Timeframe for metrics (minutes)' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved successfully' })
  @Roles('admin', 'system_operator')
  async getSystemPerformance(@Query('timeframe', new DefaultValuePipe(60), ParseIntPipe) timeframe: number) {
    return {
      timestamp: new Date(),
      responseTime: 145, // milliseconds
      throughput: 1250, // requests per minute
      errorRate: 0.2, // percentage
      cpuUsage: 65.3, // percentage
      memoryUsage: 72.8, // percentage
      diskUsage: 45.1, // percentage
      networkLatency: 23.4, // milliseconds
      databaseConnections: 18,
      activeUsers: 234,
      cacheHitRate: 87.2, // percentage
      uptime: 99.97, // percentage
      lastRestart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    };
  }

  // API Health and Status
  @Get('health')
  @Throttle({ default: { limit: 200, ttl: 60000 } }) // 200 requests per minute
  @ApiOperation({ summary: 'Analytics service health check' })
  @ApiResponse({ status: 200, description: 'Analytics service is healthy' })
  async getHealthStatus() {
    return {
      status: 'healthy',
      timestamp: new Date(),
      version: '1.0.0',
      services: {
        analyticsEngine: 'healthy',
        mlModels: 'healthy',
        monitoring: 'healthy',
        dataQuality: 'healthy'
      },
      metrics: {
        cacheSize: 1024, // MB
        activeQueries: 3,
        queuedJobs: 0,
        errorRate: 0.1
      }
    };
  }

  // Advanced Analytics Features
  @Post('insights/discover')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Discover insights from data' })
  @ApiResponse({ status: 200, description: 'Insights discovered successfully' })
  @Roles('researcher', 'admin', 'national_stakeholder')
  async discoverInsights(@Body() insightRequest: { dataSource: string; insightTypes: string[] }) {
    // Implementation would run ML algorithms to discover patterns and anomalies
    return {
      insights: [
        {
          type: 'correlation',
          title: 'Age and Treatment Response Correlation',
          description: 'Strong positive correlation found between patient age under 65 and higher response rates',
          confidence: 0.89,
          significance: 0.003,
          impact: 'medium',
          actionable: true
        },
        {
          type: 'anomaly',
          title: 'Unusual Toxicity Pattern',
          description: 'Elevated neurotoxicity rates detected in recent treatment cycle',
          confidence: 0.95,
          significance: 0.001,
          impact: 'high',
          actionable: true
        }
      ],
      discoveryTime: 2345 // milliseconds
    };
  }

  @Post('predictions/batch')
  @Throttle({ default: { limit: 2, ttl: 60000 } }) // 2 requests per minute
  @ApiOperation({ summary: 'Generate batch ML predictions' })
  @ApiResponse({ status: 200, description: 'Batch predictions generated successfully' })
  @Roles('researcher', 'admin', 'national_stakeholder')
  async generateBatchPredictions(@Body() batchRequest: { patientIds: string[]; modelType: string }) {
    // Implementation would process multiple predictions efficiently
    return {
      batchId: uuidv4(),
      totalPatients: batchRequest.patientIds.length,
      completedPredictions: batchRequest.patientIds.length,
      predictions: batchRequest.patientIds.map(patientId => ({
        patientId,
        prediction: { value: 0.75, category: 'good' },
        confidence: 0.82
      })),
      processingTime: 3421 // milliseconds
    };
  }
}