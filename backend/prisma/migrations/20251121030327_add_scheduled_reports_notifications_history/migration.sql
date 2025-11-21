-- CreateEnum
CREATE TYPE "medical"."analytics_metric_types" AS ENUM ('PATIENT_VOLUME', 'DATA_QUALITY', 'REPORTING_TIMELINESS', 'TREATMENT_OUTCOMES', 'SURVIVAL_RATES', 'SCREENING_COVERAGE', 'EARLY_DETECTION', 'COST_EFFICIENCY', 'RESOURCE_UTILIZATION', 'RESEARCH_PRODUCTIVITY', 'PATIENT_SATISFACTION', 'CLINICAL_TRIAL_ENROLLMENT', 'WAITING_TIMES', 'READMISSION_RATES', 'COMPLICATION_RATES');

-- CreateEnum
CREATE TYPE "medical"."predictive_model_types" AS ENUM ('CANCER_RISK_PREDICTION', 'TREATMENT_RESPONSE', 'SURVIVAL_ANALYSIS', 'RECURRENCE_RISK', 'POPULATION_HEALTH_TRENDS', 'RESOURCE_UTILIZATION', 'DEMAND_FORECASTING', 'QUALITY_OUTCOMES', 'COST_PREDICTION', 'READMISSION_PREDICTION');

-- CreateEnum
CREATE TYPE "medical"."deployment_statuses" AS ENUM ('DEVELOPMENT', 'TESTING', 'STAGING', 'PRODUCTION', 'DEPRECATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "medical"."prediction_types" AS ENUM ('CLASSIFICATION', 'REGRESSION', 'SURVIVAL_ANALYSIS', 'TIME_SERIES', 'CLUSTERING', 'ANOMALY_DETECTION', 'RECOMMENDATION', 'RISK_SCORE');

-- CreateEnum
CREATE TYPE "medical"."dashboard_types" AS ENUM ('EXECUTIVE_OVERVIEW', 'CLINICAL_PERFORMANCE', 'RESEARCH_INSIGHTS', 'OPERATIONAL_METRICS', 'PATIENT_OUTCOMES', 'QUALITY_IMPROVEMENT', 'FINANCIAL_ANALYTICS', 'POPULATION_HEALTH');

-- CreateEnum
CREATE TYPE "medical"."report_types" AS ENUM ('DAILY_SUMMARY', 'WEEKLY_ANALYTICS', 'MONTHLY_PERFORMANCE', 'QUARTERLY_REVIEW', 'ANNUAL_REPORT', 'AD_HOC_ANALYSIS', 'RESEARCH_IMPACT', 'QUALITY_METRICS', 'EXECUTIVE_BRIEFING');

-- CreateEnum
CREATE TYPE "medical"."report_formats" AS ENUM ('PDF', 'EXCEL', 'CSV', 'JSON', 'HTML', 'POWERPOINT');

-- CreateEnum
CREATE TYPE "medical"."delivery_methods" AS ENUM ('EMAIL', 'FILE_SHARE', 'API_WEBHOOK', 'SFTP', 'CLOUD_STORAGE', 'PRINT');

-- CreateEnum
CREATE TYPE "medical"."trend_directions" AS ENUM ('INCREASING', 'DECREASING', 'STABLE', 'FLUCTUATING', 'SEASONAL', 'INSUFFICIENT_DATA');

-- CreateEnum
CREATE TYPE "medical"."cache_types" AS ENUM ('DASHBOARD_DATA', 'ANALYTICS_QUERY', 'AGGREGATE_METRICS', 'PATIENT_STATS', 'RESEARCH_DATA', 'TREND_ANALYSIS', 'BENCHMARK_DATA', 'EXECUTIVE_SUMMARY');

-- CreateEnum
CREATE TYPE "medical"."refresh_statuses" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "audit"."analytics_event_types" AS ENUM ('DASHBOARD_VIEW', 'REPORT_GENERATED', 'QUERY_EXECUTED', 'CACHE_HIT', 'CACHE_MISS', 'MODEL_PREDICTION', 'DATA_EXPORT', 'ALERT_TRIGGERED', 'USER_LOGIN', 'PERFORMANCE_METRIC', 'ERROR_OCCURRED', 'SCHEDULE_EXECUTED');

-- CreateEnum
CREATE TYPE "system"."template_types" AS ENUM ('STANDARD', 'CUSTOM', 'SYSTEM', 'USER_DEFINED');

-- CreateEnum
CREATE TYPE "system"."report_statuses" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "system"."execution_statuses" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'RETRYING');

-- CreateEnum
CREATE TYPE "system"."delivery_statuses" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED', 'OPENED', 'CLICKED');

-- CreateEnum
CREATE TYPE "system"."backup_types" AS ENUM ('FULL', 'INCREMENTAL', 'DIFFERENTIAL', 'TRANSACTION_LOG', 'SNAPSHOT', 'CONTINUOUS');

-- CreateEnum
CREATE TYPE "system"."backup_statuses" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'CORRUPTED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "system"."verification_modes" AS ENUM ('NONE', 'CHECKSUM', 'FULL', 'SAMPLE', 'INTEGRITY_CHECK');

-- CreateEnum
CREATE TYPE "audit"."activity_types" AS ENUM ('LOGIN', 'LOGOUT', 'PAGE_VIEW', 'DATA_ACCESS', 'DATA_MODIFY', 'REPORT_GENERATE', 'EXPORT', 'IMPORT', 'CONFIG_CHANGE', 'PRIVILEGE_ESCALATION', 'SECURITY_EVENT', 'ERROR_OCCURRED', 'SYSTEM_ACTION');

-- CreateEnum
CREATE TYPE "audit"."security_event_types" AS ENUM ('LOGIN_FAILURE', 'UNAUTHORIZED_ACCESS', 'PRIVILEGE_ESCALATION', 'DATA_BREACH', 'MALICIOUS_REQUEST', 'SUSPICIOUS_ACTIVITY', 'BRUTE_FORCE_ATTACK', 'INJECTION_ATTACK', 'XSS_ATTEMPT', 'CSRF_ATTEMPT', 'DOS_ATTACK', 'POLICY_VIOLATION', 'COMPLIANCE_BREACH', 'ANOMALOUS_BEHAVIOR', 'THREAT_DETECTION');

-- CreateEnum
CREATE TYPE "audit"."security_severities" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "audit"."threat_levels" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "audit"."event_statuses" AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED', 'FALSE_POSITIVE', 'ESCALATED');

-- CreateEnum
CREATE TYPE "system"."notification_categories" AS ENUM ('SYSTEM', 'SECURITY', 'REPORTS', 'BACKUPS', 'PERFORMANCE', 'COMPLIANCE', 'USER_MANAGEMENT', 'INTEGRATIONS', 'HEALTH_CHECKS', 'ALERTS');

-- CreateEnum
CREATE TYPE "system"."notification_channels" AS ENUM ('EMAIL', 'SMS', 'IN_APP', 'PUSH', 'WEBHOOK', 'SLACK', 'TELEGRAM', 'MICROSOFT_TEAMS');

-- CreateEnum
CREATE TYPE "system"."notification_types" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'ALERT', 'REMINDER', 'SYSTEM_UPDATE', 'SECURITY_ALERT', 'REPORT_READY', 'BACKUP_COMPLETED', 'THRESHOLD_EXCEEDED');

-- CreateEnum
CREATE TYPE "system"."notification_priorities" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "system"."notification_statuses" AS ENUM ('PENDING', 'SCHEDULED', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED', 'EXPIRED', 'READ');

-- CreateEnum
CREATE TYPE "system"."recipient_types" AS ENUM ('USER', 'ROLE', 'EMAIL', 'PHONE', 'GROUP', 'SYSTEM');

-- CreateEnum
CREATE TYPE "system"."integration_types" AS ENUM ('API_REST', 'API_GRAPHQL', 'DATABASE', 'FILE_TRANSFER', 'WEBHOOK', 'MESSAGE_QUEUE', 'BLOCKCHAIN', 'IOT_DEVICE');

-- CreateEnum
CREATE TYPE "system"."integration_categories" AS ENUM ('HEALTHCARE_SYSTEMS', 'LABORATORY_SYSTEMS', 'IMAGING_SYSTEMS', 'BILLING_SYSTEMS', 'PHARMACY_SYSTEMS', 'GOVERNMENT_SYSTEMS', 'RESEARCH_PLATFORMS', 'CLOUD_SERVICES', 'MONITORING_TOOLS', 'SECURITY_TOOLS', 'COMMUNICATION_PLATFORMS');

-- CreateEnum
CREATE TYPE "system"."sync_types" AS ENUM ('FULL', 'INCREMENTAL', 'REAL_TIME', 'BATCH', 'ON_DEMAND');

-- CreateEnum
CREATE TYPE "system"."sync_directions" AS ENUM ('INBOUND', 'OUTBOUND', 'BIDIRECTIONAL');

-- CreateEnum
CREATE TYPE "system"."sync_statuses" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'ROLLING_BACK', 'ROLLED_BACK');

-- CreateEnum
CREATE TYPE "system"."performance_metric_types" AS ENUM ('CPU_USAGE', 'MEMORY_USAGE', 'DISK_USAGE', 'NETWORK_IO', 'DATABASE_CONNECTIONS', 'RESPONSE_TIME', 'THROUGHPUT', 'ERROR_RATE', 'QUEUE_SIZE', 'CACHE_HIT_RATE', 'ACTIVE_USERS', 'API_REQUESTS', 'BATCH_JOBS', 'BACKUP_DURATION', 'DATA_VOLUME');

-- CreateEnum
CREATE TYPE "system"."aggregation_methods" AS ENUM ('AVERAGE', 'SUM', 'MIN', 'MAX', 'COUNT', 'PERCENTILE_50', 'PERCENTILE_90', 'PERCENTILE_95', 'PERCENTILE_99');

-- CreateEnum
CREATE TYPE "system"."alert_types" AS ENUM ('THRESHOLD', 'ANOMALY', 'SYSTEM_DOWN', 'PERFORMANCE_DEGRADATION', 'SECURITY_BREACH', 'COMPLIANCE_VIOLATION', 'CAPACITY_LIMIT', 'ERROR_RATE', 'DATA_QUALITY', 'BACKUP_FAILURE', 'INTEGRATION_FAILURE', 'HEALTH_CHECK_FAILURE');

-- CreateEnum
CREATE TYPE "system"."alert_severities" AS ENUM ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "system"."alert_conditions" AS ENUM ('GREATER_THAN', 'LESS_THAN', 'EQUALS', 'NOT_EQUALS', 'GREATER_EQUAL', 'LESS_EQUAL', 'PERCENTAGE_CHANGE', 'ANOMALY_DETECTED', 'SYSTEM_DOWN', 'PATTERN_MATCHED');

-- CreateEnum
CREATE TYPE "system"."export_types" AS ENUM ('PATIENT_DATA', 'MEDICAL_RECORDS', 'ANALYTICS_DATA', 'REPORT_DATA', 'CONFIGURATION_DATA', 'AUDIT_LOGS', 'PERFORMANCE_DATA', 'BACKUP_DATA', 'FULL_EXPORT', 'CUSTOM_QUERY');

-- CreateEnum
CREATE TYPE "system"."export_formats" AS ENUM ('CSV', 'EXCEL', 'JSON', 'XML', 'PDF', 'PARQUET', 'SQL_DUMP', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "system"."import_types" AS ENUM ('PATIENT_DATA', 'MEDICAL_RECORDS', 'MASTER_DATA', 'CONFIGURATION', 'BULK_UPDATE', 'MIGRATION', 'RESTORE', 'SYNC_IMPORT');

-- CreateEnum
CREATE TYPE "system"."import_source_types" AS ENUM ('CSV_FILE', 'EXCEL_FILE', 'JSON_FILE', 'XML_FILE', 'DATABASE', 'API_IMPORT', 'FTP_IMPORT', 'ARCHIVE_FILE');

-- CreateEnum
CREATE TYPE "system"."job_statuses" AS ENUM ('PENDING', 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PAUSED', 'RETRYING');

-- CreateEnum
CREATE TYPE "system"."task_types" AS ENUM ('BACKUP', 'CLEANUP', 'REPORT_GENERATION', 'DATA_SYNC', 'HEALTH_CHECK', 'NOTIFICATION', 'CACHE_REFRESH', 'LOG_ROTATION', 'INDEX_REBUILD', 'STATISTICS_UPDATE', 'COMPLIANCE_CHECK', 'MAINTENANCE', 'CUSTOM_SCRIPT');

-- CreateEnum
CREATE TYPE "system"."task_statuses" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT', 'SKIPPED');

-- CreateEnum
CREATE TYPE "system"."health_check_types" AS ENUM ('HTTP_ENDPOINT', 'DATABASE_CONNECTION', 'FILE_SYSTEM', 'SERVICE_PORT', 'API_HEALTH', 'SSL_CERTIFICATE', 'DOMAIN_DNS', 'NETWORK_CONNECTIVITY', 'CUSTOM_CHECK');

-- CreateEnum
CREATE TYPE "system"."health_statuses" AS ENUM ('HEALTHY', 'DEGRADED', 'UNHEALTHY', 'UNKNOWN', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "system"."http_methods" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS');

-- CreateEnum
CREATE TYPE "audit"."compliance_types" AS ENUM ('SECURITY', 'PRIVACY', 'DATA_PROTECTION', 'ACCESS_CONTROL', 'AUDIT_TRAIL', 'BUSINESS_CONTINUITY', 'DISASTER_RECOVERY', 'RISK_ASSESSMENT');

-- CreateEnum
CREATE TYPE "audit"."compliance_frameworks" AS ENUM ('GDPR', 'HIPAA', 'ISO_27001', 'ISO_27701', 'NIST', 'SOC_2', 'PDPA', 'HITECH', 'PCI_DSS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "audit"."compliance_statuses" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'EXCEPTION', 'WAIVED', 'REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "audit"."compliance_risks" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "system"."notification_frequencies" AS ENUM ('IMMEDIATE', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "system"."digest_statuses" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "system"."calendar_providers" AS ENUM ('GOOGLE_CALENDAR', 'MICROSOFT_OUTLOOK', 'APPLE_CALENDAR', 'CALDAV', 'CUSTOM');

-- CreateEnum
CREATE TYPE "system"."history_report_types" AS ENUM ('GENERATED', 'SCHEDULED', 'AD_HOC', 'AUTOMATED');

-- CreateEnum
CREATE TYPE "system"."report_access_types" AS ENUM ('VIEW', 'DOWNLOAD', 'PRINT', 'SHARE', 'EXPORT', 'EDIT', 'DELETE');

-- CreateEnum
CREATE TYPE "medical"."alert_frequencies" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'IMMEDIATE');

-- CreateEnum
CREATE TYPE "medical"."project_statuses" AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "medical"."project_visibilities" AS ENUM ('PRIVATE', 'TEAM_ONLY', 'INSTITUTION', 'PUBLIC');

-- CreateEnum
CREATE TYPE "medical"."project_roles" AS ENUM ('LEAD', 'CO_LEAD', 'MEMBER', 'CONTRIBUTOR', 'OBSERVER');

-- CreateEnum
CREATE TYPE "medical"."member_statuses" AS ENUM ('INVITED', 'ACTIVE', 'INACTIVE', 'REMOVED');

-- CreateEnum
CREATE TYPE "medical"."annotation_types" AS ENUM ('COMMENT', 'QUESTION', 'OBSERVATION', 'ISSUE', 'INSIGHT', 'TODO');

-- CreateEnum
CREATE TYPE "medical"."match_statuses" AS ENUM ('SUGGESTED', 'CONTACTED', 'ACCEPTED', 'DECLINED', 'COLLABORATED');

-- CreateEnum
CREATE TYPE "medical"."innovation_types" AS ENUM ('PATENT', 'DIAGNOSTIC_TOOL', 'CLINICAL_PROTOCOL', 'POLICY_CHANGE', 'HEALTHCARE_GUIDELINE', 'TREATMENT_METHOD', 'PREVENTION_STRATEGY', 'SCREENING_PROGRAM', 'CARE_PATHWAY', 'TECHNOLOGY_TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "medical"."innovation_statuses" AS ENUM ('PROPOSED', 'IN_DEVELOPMENT', 'PATENT_PENDING', 'PATENT_GRANTED', 'IMPLEMENTED', 'PILOT_TESTING', 'SCALED_UP', 'ADOPTED', 'DISCONTINUED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "medical"."contribution_types" AS ENUM ('PRINCIPAL_INVESTIGATOR', 'CO_INVESTIGATOR', 'DATA_PROVIDER', 'ANALYST', 'METHODOLOGY_EXPERT', 'DOMAIN_EXPERT', 'STUDENT', 'COLLABORATOR', 'ADVISOR', 'REVIEWER');

-- CreateEnum
CREATE TYPE "medical"."contribution_levels" AS ENUM ('MINIMAL', 'MODERATE', 'SUBSTANTIAL', 'MAJOR', 'LEAD');

-- CreateEnum
CREATE TYPE "medical"."outcome_types" AS ENUM ('POLICY_CHANGE', 'CLINICAL_GUIDELINE', 'PRACTICE_CHANGE', 'HEALTHCARE_IMPROVEMENT', 'PUBLIC_AWARENESS', 'CAPACITY_BUILDING', 'SYSTEM_STRENGTHENING', 'COST_REDUCTION', 'QUALITY_IMPROVEMENT', 'ACCESS_IMPROVEMENT');

-- CreateTable
CREATE TABLE "medical"."analytics_performance_metrics" (
    "id" TEXT NOT NULL,
    "centerId" TEXT,
    "metricType" "medical"."analytics_metric_types" NOT NULL,
    "metricName" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "baseline" DOUBLE PRECISION,
    "target" DOUBLE PRECISION,
    "percentileRank" DOUBLE PRECISION,
    "comparisonGroup" TEXT,
    "timeFrame" TEXT NOT NULL,
    "dataQuality" "medical"."data_qualities" NOT NULL DEFAULT 'STANDARD',
    "confidenceInterval" JSONB,
    "riskAdjustmentFactors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."predictive_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "modelType" "medical"."predictive_model_types" NOT NULL,
    "description" TEXT,
    "trainingDataSize" INTEGER NOT NULL,
    "validationDataSize" INTEGER,
    "accuracy" DOUBLE PRECISION,
    "precision" DOUBLE PRECISION,
    "recall" DOUBLE PRECISION,
    "f1Score" DOUBLE PRECISION,
    "aucScore" DOUBLE PRECISION,
    "calibrationScore" DOUBLE PRECISION,
    "features" JSONB NOT NULL,
    "hyperparameters" JSONB,
    "trainingDate" TIMESTAMP(3) NOT NULL,
    "lastValidated" TIMESTAMP(3),
    "validationMetrics" JSONB,
    "deploymentStatus" "medical"."deployment_statuses" NOT NULL DEFAULT 'STAGING',
    "modelVersion" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "retrainingFrequency" INTEGER,
    "lastRetrainedAt" TIMESTAMP(3),
    "nextRetrainingDue" TIMESTAMP(3),
    "performanceHistory" JSONB,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "predictive_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."model_predictions" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "patientId" TEXT,
    "inputFeatures" JSONB NOT NULL,
    "prediction" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "predictionType" "medical"."prediction_types" NOT NULL,
    "actualOutcome" JSONB,
    "accuracyScore" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "model_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."model_performance_metrics" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataSlice" TEXT,
    "additionalMetrics" JSONB,

    CONSTRAINT "model_performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."executive_dashboards" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dashboardType" "medical"."dashboard_types" NOT NULL,
    "layout" JSONB NOT NULL,
    "widgets" JSONB NOT NULL,
    "filters" JSONB,
    "accessLevel" "medical"."data_access_levels" NOT NULL DEFAULT 'AGGREGATE_ONLY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "refreshInterval" INTEGER,
    "lastRefreshed" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "executive_dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."report_schedules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "reportType" "medical"."report_types" NOT NULL,
    "schedule" TEXT NOT NULL,
    "recipients" JSONB NOT NULL,
    "parameters" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastRun" TIMESTAMP(3),
    "nextRun" TIMESTAMP(3),
    "format" "medical"."report_formats" NOT NULL DEFAULT 'PDF',
    "deliveryMethod" "medical"."delivery_methods" NOT NULL DEFAULT 'EMAIL',
    "templateId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."center_benchmarks" (
    "id" TEXT NOT NULL,
    "centerId" TEXT NOT NULL,
    "benchmarkPeriod" TEXT NOT NULL,
    "totalPatients" INTEGER NOT NULL,
    "newPatients" INTEGER NOT NULL,
    "dataQualityScore" DOUBLE PRECISION NOT NULL,
    "reportingCompleteness" DOUBLE PRECISION NOT NULL,
    "timelinessScore" DOUBLE PRECISION NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER,
    "percentileRank" DOUBLE PRECISION,
    "peerGroup" TEXT,
    "improvementAreas" JSONB,
    "strengths" JSONB,
    "recommendations" JSONB,
    "comparisonMetrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_benchmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."research_impact_analyses" (
    "id" TEXT NOT NULL,
    "researchRequestId" TEXT NOT NULL,
    "analysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "impactScore" DOUBLE PRECISION NOT NULL,
    "citationCount" INTEGER NOT NULL,
    "publicationCount" INTEGER NOT NULL,
    "patentCount" INTEGER,
    "guidelineCount" INTEGER,
    "policyImpactCount" INTEGER,
    "clinicalAdoptions" INTEGER,
    "patientImpactScore" DOUBLE PRECISION,
    "economicImpact" DOUBLE PRECISION,
    "collaborationIndex" DOUBLE PRECISION,
    "innovationIndex" DOUBLE PRECISION,
    "reachScore" DOUBLE PRECISION,
    "influenceScore" DOUBLE PRECISION,
    "trendData" JSONB,
    "comparativeAnalysis" JSONB,
    "recommendations" JSONB,
    "verifiedBy" TEXT,
    "verificationDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_impact_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."cancer_trend_analyses" (
    "id" TEXT NOT NULL,
    "cancerType" TEXT NOT NULL,
    "geographicLevel" TEXT NOT NULL,
    "geographicArea" TEXT,
    "trendPeriod" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "baselineIncidence" DOUBLE PRECISION,
    "currentIncidence" DOUBLE PRECISION,
    "trendDirection" "medical"."trend_directions" NOT NULL,
    "trendSignificance" DOUBLE PRECISION,
    "confidenceInterval" JSONB,
    "predictedValues" JSONB,
    "seasonalFactors" JSONB,
    "riskFactors" JSONB,
    "recommendations" JSONB,
    "dataQuality" "medical"."data_qualities" NOT NULL DEFAULT 'STANDARD',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cancer_trend_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."real_time_analytics_cache" (
    "id" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "cacheValue" JSONB NOT NULL,
    "cacheType" "medical"."cache_types" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "refreshInterval" INTEGER NOT NULL,
    "lastRefreshed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hitCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,

    CONSTRAINT "real_time_analytics_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."national_cancer_intelligence" (
    "id" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalRegisteredCases" INTEGER NOT NULL,
    "newCasesThisMonth" INTEGER NOT NULL,
    "activeCases" INTEGER NOT NULL,
    "mortalityRate" DOUBLE PRECISION,
    "survivalRate" DOUBLE PRECISION,
    "screeningCoverage" DOUBLE PRECISION,
    "earlyDetectionRate" DOUBLE PRECISION,
    "topCancerTypes" JSONB NOT NULL,
    "demographicBreakdown" JSONB NOT NULL,
    "geographicDistribution" JSONB NOT NULL,
    "trendAnalysis" JSONB,
    "riskFactorAnalysis" JSONB,
    "healthcareSystemLoad" JSONB,
    "resourceUtilization" JSONB,
    "qualityMetrics" JSONB,
    "policyRecommendations" JSONB,
    "dataQuality" "medical"."data_qualities" NOT NULL DEFAULT 'STANDARD',
    "reportingCompleteness" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedBy" TEXT,
    "verificationDate" TIMESTAMP(3),

    CONSTRAINT "national_cancer_intelligence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."materialized_view_refresh" (
    "id" TEXT NOT NULL,
    "viewName" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "refreshSchedule" TEXT NOT NULL,
    "lastRefreshed" TIMESTAMP(3),
    "nextRefresh" TIMESTAMP(3),
    "refreshDuration" INTEGER,
    "status" "medical"."refresh_statuses" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "rowCount" INTEGER,
    "sizeInMB" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "dependencies" JSONB,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materialized_view_refresh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit"."analytics_event_logs" (
    "id" TEXT NOT NULL,
    "eventType" "audit"."analytics_event_types" NOT NULL,
    "eventCategory" TEXT NOT NULL,
    "description" TEXT,
    "eventData" JSONB,
    "userId" TEXT,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "success" BOOLEAN NOT NULL,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "metadata" JSONB,

    CONSTRAINT "analytics_event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."system_configurations" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "defaultValue" JSONB,
    "validationRules" JSONB,
    "environment" TEXT,
    "centerId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastModifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."report_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reportType" "medical"."report_types" NOT NULL,
    "templateType" "system"."template_types" NOT NULL DEFAULT 'CUSTOM',
    "dataSource" TEXT NOT NULL,
    "parameters" JSONB,
    "layout" JSONB NOT NULL,
    "styling" JSONB,
    "filters" JSONB,
    "aggregations" JSONB,
    "charts" JSONB,
    "accessLevel" "medical"."data_access_levels" NOT NULL DEFAULT 'AGGREGATE_ONLY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "centerId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."generated_reports" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parameters" JSONB,
    "format" "medical"."report_formats" NOT NULL DEFAULT 'PDF',
    "status" "system"."report_statuses" NOT NULL DEFAULT 'PENDING',
    "filePath" TEXT,
    "fileSize" INTEGER,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "generatedBy" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,

    CONSTRAINT "generated_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."scheduled_reports" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "schedule" TEXT NOT NULL,
    "recipients" JSONB NOT NULL,
    "parameters" JSONB,
    "format" "medical"."report_formats" NOT NULL DEFAULT 'PDF',
    "deliveryMethod" "medical"."delivery_methods" NOT NULL DEFAULT 'EMAIL',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastRun" TIMESTAMP(3),
    "nextRun" TIMESTAMP(3),
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."report_executions" (
    "id" TEXT NOT NULL,
    "scheduledReportId" TEXT NOT NULL,
    "executionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "system"."execution_statuses" NOT NULL,
    "filePath" TEXT,
    "fileSize" INTEGER,
    "duration" INTEGER,
    "recipients" JSONB,
    "success" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "deliveryStatus" "system"."delivery_statuses",
    "retryCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "report_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."report_history" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "reportType" "system"."history_report_types" NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateVersion" TEXT,
    "name" TEXT NOT NULL,
    "format" "medical"."report_formats" NOT NULL,
    "parameters" JSONB,
    "status" "system"."report_statuses" NOT NULL,
    "generatedBy" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "fileSize" INTEGER,
    "filePath" TEXT,
    "fileHash" TEXT,
    "changeDescription" TEXT,
    "previousVersion" TEXT,
    "retentionUntil" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."report_distributions" (
    "id" TEXT NOT NULL,
    "reportHistoryId" TEXT,
    "reportExecutionId" TEXT,
    "recipientType" "system"."recipient_types" NOT NULL,
    "recipientId" TEXT NOT NULL,
    "recipientEmail" TEXT,
    "recipientName" TEXT,
    "deliveryMethod" "medical"."delivery_methods" NOT NULL,
    "deliveryStatus" "system"."delivery_statuses" NOT NULL,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "downloadedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."report_access_logs" (
    "id" TEXT NOT NULL,
    "reportHistoryId" TEXT NOT NULL,
    "userId" TEXT,
    "userName" TEXT,
    "accessType" "system"."report_access_types" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "pagesViewed" INTEGER,
    "actionsPerformed" JSONB,
    "metadata" JSONB,

    CONSTRAINT "report_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "system"."notification_categories" NOT NULL,
    "channel" "system"."notification_channels" NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "frequency" "system"."notification_frequencies" NOT NULL DEFAULT 'IMMEDIATE',
    "quietHoursStart" TEXT,
    "quietHoursEnd" TEXT,
    "digestSchedule" TEXT,
    "priority" "system"."notification_priorities" NOT NULL DEFAULT 'MEDIUM',
    "filters" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."notification_history" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "recipientType" "system"."recipient_types" NOT NULL,
    "channel" "system"."notification_channels" NOT NULL,
    "status" "system"."notification_statuses" NOT NULL,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "deliveryDuration" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."notification_digests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "system"."notification_categories" NOT NULL,
    "frequency" "system"."notification_frequencies" NOT NULL,
    "lastSentAt" TIMESTAMP(3),
    "nextScheduledAt" TIMESTAMP(3),
    "notificationCount" INTEGER NOT NULL DEFAULT 0,
    "notificationIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "system"."digest_statuses" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_digests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."calendar_integrations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "system"."calendar_providers" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "calendarId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "syncEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."backup_jobs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "backupType" "system"."backup_types" NOT NULL,
    "dataSource" TEXT NOT NULL,
    "schedule" TEXT,
    "retentionDays" INTEGER NOT NULL DEFAULT 30,
    "compression" BOOLEAN NOT NULL DEFAULT true,
    "encryption" BOOLEAN NOT NULL DEFAULT true,
    "storageLocation" TEXT NOT NULL,
    "storagePath" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastBackup" TIMESTAMP(3),
    "nextBackup" TIMESTAMP(3),
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "totalSize" BIGINT NOT NULL DEFAULT 0,
    "estimatedSize" BIGINT,
    "backupOptions" JSONB,
    "verificationMode" "system"."verification_modes" NOT NULL DEFAULT 'CHECKSUM',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "backup_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."backup_executions" (
    "id" TEXT NOT NULL,
    "backupJobId" TEXT NOT NULL,
    "executionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "system"."backup_statuses" NOT NULL DEFAULT 'RUNNING',
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "fileSize" BIGINT,
    "compressedSize" BIGINT,
    "filesCount" INTEGER,
    "filePath" TEXT,
    "checksum" TEXT,
    "verificationPassed" BOOLEAN,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,

    CONSTRAINT "backup_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit"."user_activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "activityType" "audit"."activity_types" NOT NULL,
    "activity" TEXT NOT NULL,
    "resource" TEXT,
    "resourceId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceId" TEXT,
    "location" JSONB,
    "duration" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit"."security_events" (
    "id" TEXT NOT NULL,
    "eventType" "audit"."security_event_types" NOT NULL,
    "severity" "audit"."security_severities" NOT NULL DEFAULT 'MEDIUM',
    "threatLevel" "audit"."threat_levels" NOT NULL DEFAULT 'LOW',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT,
    "sessionId" TEXT,
    "resource" TEXT,
    "resourceId" TEXT,
    "details" JSONB,
    "mitigationActions" JSONB,
    "status" "audit"."event_statuses" NOT NULL DEFAULT 'OPEN',
    "assignedTo" TEXT,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "falsePositive" BOOLEAN NOT NULL DEFAULT false,
    "isCorrelated" BOOLEAN NOT NULL DEFAULT false,
    "correlationId" TEXT,
    "externalReference" TEXT,
    "complianceImpact" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."notification_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "system"."notification_categories" NOT NULL,
    "channel" "system"."notification_channels" NOT NULL,
    "templateType" "system"."template_types" NOT NULL DEFAULT 'STANDARD',
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "htmlContent" TEXT,
    "attachments" JSONB,
    "variables" JSONB,
    "styling" JSONB,
    "priority" "system"."notification_priorities" NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'en',
    "centerId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."notifications" (
    "id" TEXT NOT NULL,
    "templateId" TEXT,
    "recipientId" TEXT,
    "recipientType" "system"."recipient_types" NOT NULL DEFAULT 'USER',
    "channel" "system"."notification_channels" NOT NULL,
    "type" "system"."notification_types" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "priority" "system"."notification_priorities" NOT NULL DEFAULT 'MEDIUM',
    "status" "system"."notification_statuses" NOT NULL DEFAULT 'PENDING',
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "responseRequired" BOOLEAN NOT NULL DEFAULT false,
    "response" JSONB,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."external_integrations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "system"."integration_types" NOT NULL,
    "category" "system"."integration_categories" NOT NULL,
    "description" TEXT,
    "endpoint" TEXT NOT NULL,
    "authentication" JSONB NOT NULL,
    "configuration" JSONB,
    "dataMapping" JSONB,
    "syncFrequency" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSync" TIMESTAMP(3),
    "nextSync" TIMESTAMP(3),
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "timeout" INTEGER NOT NULL DEFAULT 30000,
    "retryPolicy" JSONB,
    "rateLimit" JSONB,
    "centerId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."integration_sync_logs" (
    "id" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "syncType" "system"."sync_types" NOT NULL DEFAULT 'FULL',
    "direction" "system"."sync_directions" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "status" "system"."sync_statuses" NOT NULL DEFAULT 'RUNNING',
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "recordsSucceeded" INTEGER NOT NULL DEFAULT 0,
    "recordsFailed" INTEGER NOT NULL DEFAULT 0,
    "recordsSkipped" INTEGER NOT NULL DEFAULT 0,
    "dataVolume" BIGINT,
    "errorMessage" TEXT,
    "errorDetails" JSONB,
    "checksumBefore" TEXT,
    "checksumAfter" TEXT,
    "rollbackAvailable" BOOLEAN NOT NULL DEFAULT false,
    "rollbackUntil" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "integration_sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."performance_metrics" (
    "id" TEXT NOT NULL,
    "metricType" "system"."performance_metric_types" NOT NULL,
    "metricName" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" JSONB,
    "dimensions" JSONB,
    "threshold" JSONB,
    "aggregationMethod" "system"."aggregation_methods" DEFAULT 'AVERAGE',
    "interval" INTEGER NOT NULL DEFAULT 60,
    "source" TEXT,
    "hostname" TEXT,
    "service" TEXT,
    "environment" TEXT,
    "centerId" TEXT,

    CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."system_alerts" (
    "id" TEXT NOT NULL,
    "alertType" "system"."alert_types" NOT NULL,
    "severity" "system"."alert_severities" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT,
    "metricName" TEXT,
    "currentValue" DOUBLE PRECISION,
    "thresholdValue" DOUBLE PRECISION,
    "condition" "system"."alert_conditions" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedBy" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "falsePositive" BOOLEAN NOT NULL DEFAULT false,
    "escalationLevel" INTEGER NOT NULL DEFAULT 0,
    "maxEscalation" INTEGER NOT NULL DEFAULT 3,
    "lastEscalatedAt" TIMESTAMP(3),
    "notificationsSent" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."data_export_jobs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exportType" "system"."export_types" NOT NULL,
    "dataSource" TEXT NOT NULL,
    "format" "system"."export_formats" NOT NULL DEFAULT 'CSV',
    "filters" JSONB,
    "fields" JSONB,
    "options" JSONB,
    "compression" BOOLEAN NOT NULL DEFAULT true,
    "encryption" BOOLEAN NOT NULL DEFAULT false,
    "retentionDays" INTEGER NOT NULL DEFAULT 7,
    "status" "system"."job_statuses" NOT NULL DEFAULT 'PENDING',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalRecords" BIGINT,
    "processedRecords" BIGINT,
    "filePath" TEXT,
    "fileSize" BIGINT,
    "downloadUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "errorMessage" TEXT,
    "validationResults" JSONB,
    "requestedBy" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "data_export_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."data_import_jobs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "importType" "system"."import_types" NOT NULL,
    "sourceType" "system"."import_source_types" NOT NULL,
    "filePath" TEXT NOT NULL,
    "targetTable" TEXT NOT NULL,
    "mapping" JSONB,
    "validation" JSONB,
    "options" JSONB,
    "batchSize" INTEGER NOT NULL DEFAULT 1000,
    "skipDuplicates" BOOLEAN NOT NULL DEFAULT false,
    "updateExisting" BOOLEAN NOT NULL DEFAULT false,
    "dryRun" BOOLEAN NOT NULL DEFAULT false,
    "status" "system"."job_statuses" NOT NULL DEFAULT 'PENDING',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalRecords" BIGINT,
    "processedRecords" BIGINT,
    "successfulRecords" BIGINT,
    "failedRecords" BIGINT,
    "duplicateRecords" BIGINT,
    "errorFilePath" TEXT,
    "validationErrors" JSONB,
    "rollbackAvailable" BOOLEAN NOT NULL DEFAULT false,
    "rollbackUntil" TIMESTAMP(3),
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "errorMessage" TEXT,
    "requestedBy" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "data_import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."scheduled_tasks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taskType" "system"."task_types" NOT NULL,
    "description" TEXT,
    "schedule" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "concurrency" INTEGER NOT NULL DEFAULT 1,
    "timeout" INTEGER,
    "retryAttempts" INTEGER NOT NULL DEFAULT 0,
    "retryDelay" INTEGER NOT NULL DEFAULT 60,
    "maxRunTime" INTEGER,
    "lastRun" TIMESTAMP(3),
    "nextRun" TIMESTAMP(3),
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "averageDuration" INTEGER,
    "configuration" JSONB,
    "environment" TEXT,
    "centerId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."task_executions" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "status" "system"."task_statuses" NOT NULL DEFAULT 'RUNNING',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "result" JSONB,
    "errorMessage" TEXT,
    "errorDetails" JSONB,
    "workerId" TEXT,
    "queuedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,

    CONSTRAINT "task_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."health_checks" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "checkType" "system"."health_check_types" NOT NULL,
    "endpoint" TEXT,
    "expectedStatus" INTEGER NOT NULL DEFAULT 200,
    "timeout" INTEGER NOT NULL DEFAULT 30000,
    "interval" INTEGER NOT NULL DEFAULT 60000,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "threshold" INTEGER NOT NULL DEFAULT 3,
    "configuration" JSONB,
    "lastCheck" TIMESTAMP(3),
    "nextCheck" TIMESTAMP(3),
    "status" "system"."health_statuses" NOT NULL DEFAULT 'UNKNOWN',
    "responseTime" INTEGER,
    "uptime" DOUBLE PRECISION,
    "consecutiveFails" INTEGER NOT NULL DEFAULT 0,
    "consecutivePasses" INTEGER NOT NULL DEFAULT 0,
    "lastFailure" TIMESTAMP(3),
    "lastSuccess" TIMESTAMP(3),
    "totalChecks" INTEGER NOT NULL DEFAULT 0,
    "totalFailures" INTEGER NOT NULL DEFAULT 0,
    "totalSuccesses" INTEGER NOT NULL DEFAULT 0,
    "averageResponseTime" DOUBLE PRECISION,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."health_check_results" (
    "id" TEXT NOT NULL,
    "healthCheckId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "system"."health_statuses" NOT NULL,
    "responseTime" INTEGER,
    "statusCode" INTEGER,
    "errorMessage" TEXT,
    "details" JSONB,
    "metrics" JSONB,
    "checkedBy" TEXT,

    CONSTRAINT "health_check_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."api_endpoints" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "method" "system"."http_methods" NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1',
    "description" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "requiresAuth" BOOLEAN NOT NULL DEFAULT true,
    "rateLimit" JSONB,
    "requestSchema" JSONB,
    "responseSchema" JSONB,
    "deprecated" BOOLEAN NOT NULL DEFAULT false,
    "deprecationDate" TIMESTAMP(3),
    "sunsetDate" TIMESTAMP(3),
    "migrationGuide" TEXT,
    "documentationUrl" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit"."api_usage" (
    "id" TEXT NOT NULL,
    "endpointId" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "requestTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseTime" INTEGER,
    "statusCode" INTEGER NOT NULL,
    "requestSize" INTEGER,
    "responseSize" INTEGER,
    "success" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "apiVersion" TEXT,
    "rateLimited" BOOLEAN NOT NULL DEFAULT false,
    "cached" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,

    CONSTRAINT "api_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit"."compliance_audits" (
    "id" TEXT NOT NULL,
    "auditType" "audit"."compliance_types" NOT NULL,
    "framework" "audit"."compliance_frameworks" NOT NULL,
    "scope" JSONB NOT NULL,
    "status" "audit"."compliance_statuses" NOT NULL DEFAULT 'PENDING',
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "auditor" TEXT,
    "findings" JSONB,
    "riskLevel" "audit"."compliance_risks" NOT NULL DEFAULT 'LOW',
    "recommendations" JSONB,
    "correctiveActions" JSONB,
    "evidence" JSONB,
    "score" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "nextAuditDate" TIMESTAMP(3),
    "recurrence" TEXT,
    "automated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."saved_searches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "searchCriteria" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "alertsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "alertFrequency" "medical"."alert_frequencies",
    "lastExecuted" TIMESTAMP(3),
    "executionCount" INTEGER NOT NULL DEFAULT 0,
    "resultCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."researcher_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "department" TEXT,
    "institution" TEXT,
    "researchInterests" TEXT[],
    "expertise" TEXT[],
    "qualifications" TEXT,
    "publications" INTEGER NOT NULL DEFAULT 0,
    "hIndex" INTEGER,
    "totalCitations" INTEGER,
    "orcidId" TEXT,
    "googleScholarId" TEXT,
    "researchGateId" TEXT,
    "linkedInUrl" TEXT,
    "bio" TEXT,
    "profilePictureUrl" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isAvailableForCollab" BOOLEAN NOT NULL DEFAULT true,
    "preferredCollabTypes" TEXT[],
    "languages" TEXT[],
    "timezone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "researcher_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."research_projects" (
    "id" TEXT NOT NULL,
    "researchRequestId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" TEXT,
    "status" "medical"."project_statuses" NOT NULL DEFAULT 'PLANNING',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "estimatedEndDate" TIMESTAMP(3),
    "fundingSource" TEXT,
    "totalBudget" DOUBLE PRECISION,
    "ethicsApprovalId" TEXT,
    "tags" TEXT[],
    "visibility" "medical"."project_visibilities" NOT NULL DEFAULT 'TEAM_ONLY',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."project_members" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "researcherProfileId" TEXT NOT NULL,
    "role" "medical"."project_roles" NOT NULL,
    "permissions" JSONB,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitedBy" TEXT,
    "status" "medical"."member_statuses" NOT NULL DEFAULT 'ACTIVE',
    "contributionLevel" TEXT,
    "lastActive" TIMESTAMP(3),

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."dataset_annotations" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "datasetType" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "annotationType" "medical"."annotation_types" NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "parentId" TEXT,
    "attachments" JSONB,
    "mentions" TEXT[],
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dataset_annotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."expert_matches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expertUserId" TEXT NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "matchReason" TEXT,
    "researchArea" TEXT NOT NULL,
    "basedOn" JSONB NOT NULL,
    "status" "medical"."match_statuses" NOT NULL DEFAULT 'SUGGESTED',
    "contactedAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."data_availability" (
    "id" TEXT NOT NULL,
    "cancerType" TEXT NOT NULL,
    "province" TEXT,
    "regency" TEXT,
    "yearFrom" INTEGER NOT NULL,
    "yearTo" INTEGER NOT NULL,
    "totalRecords" INTEGER NOT NULL,
    "completeRecords" INTEGER NOT NULL,
    "partialRecords" INTEGER NOT NULL,
    "dataQualityScore" DOUBLE PRECISION NOT NULL,
    "availableFields" JSONB NOT NULL,
    "missingFields" JSONB,
    "updateFrequency" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "data_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."similar_studies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "studyType" "medical"."study_types" NOT NULL,
    "cancerType" TEXT NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "methodology" TEXT NOT NULL,
    "findings" TEXT,
    "strengths" TEXT,
    "limitations" TEXT,
    "citation" TEXT,
    "doi" TEXT,
    "pmid" TEXT,
    "tags" TEXT[],
    "relevanceScore" DOUBLE PRECISION,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "similar_studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."feasibility_assessments" (
    "id" TEXT NOT NULL,
    "researchRequestId" TEXT,
    "userId" TEXT NOT NULL,
    "studyType" "medical"."study_types" NOT NULL,
    "cancerType" TEXT NOT NULL,
    "inclusionCriteria" TEXT NOT NULL,
    "exclusionCriteria" TEXT NOT NULL,
    "desiredSampleSize" INTEGER NOT NULL,
    "studyDuration" INTEGER NOT NULL,
    "estimatedAvailable" INTEGER NOT NULL,
    "feasibilityScore" DOUBLE PRECISION NOT NULL,
    "powerAnalysis" JSONB,
    "recommendations" JSONB,
    "barriers" JSONB,
    "mitigationStrategies" JSONB,
    "estimatedCost" DOUBLE PRECISION,
    "estimatedTimeline" TEXT,
    "assessmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feasibility_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."research_citations" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "citingTitle" TEXT NOT NULL,
    "citingAuthors" TEXT,
    "citingJournal" TEXT,
    "citationDate" TIMESTAMP(3),
    "citingDoi" TEXT,
    "citingPmid" TEXT,
    "citationType" TEXT,
    "citationContext" TEXT,
    "source" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verificationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_citations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."research_innovations" (
    "id" TEXT NOT NULL,
    "researchRequestId" TEXT NOT NULL,
    "innovationType" "medical"."innovation_types" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "applicationNumber" TEXT,
    "status" "medical"."innovation_statuses" NOT NULL DEFAULT 'PROPOSED',
    "filingDate" TIMESTAMP(3),
    "approvalDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "organizations" TEXT,
    "inventors" TEXT,
    "expectedImpact" TEXT,
    "actualImpact" TEXT,
    "economicValue" DOUBLE PRECISION,
    "adoptionRate" DOUBLE PRECISION,
    "relatedPublications" TEXT,
    "metadata" JSONB,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_innovations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."researcher_contributions" (
    "id" TEXT NOT NULL,
    "researcherId" TEXT NOT NULL,
    "researchRequestId" TEXT,
    "contributionType" "medical"."contribution_types" NOT NULL,
    "contributionLevel" "medical"."contribution_levels" NOT NULL DEFAULT 'MODERATE',
    "role" TEXT,
    "publicationCount" INTEGER NOT NULL DEFAULT 0,
    "citationCount" INTEGER NOT NULL DEFAULT 0,
    "hIndex" DOUBLE PRECISION,
    "i10Index" INTEGER,
    "totalImpactScore" DOUBLE PRECISION,
    "dataContributions" INTEGER NOT NULL DEFAULT 0,
    "analysisContributions" INTEGER NOT NULL DEFAULT 0,
    "mentoringCount" INTEGER NOT NULL DEFAULT 0,
    "grantsFunded" DOUBLE PRECISION,
    "collaborationScore" DOUBLE PRECISION,
    "innovationCount" INTEGER NOT NULL DEFAULT 0,
    "policyInfluence" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "researcher_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."research_outcomes" (
    "id" TEXT NOT NULL,
    "researchRequestId" TEXT NOT NULL,
    "outcomeType" "medical"."outcome_types" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "outcomeDate" TIMESTAMP(3) NOT NULL,
    "affectedPopulation" TEXT,
    "geographicScope" TEXT,
    "policyDocument" TEXT,
    "implementationStatus" TEXT,
    "impactMetrics" JSONB,
    "stakeholders" TEXT,
    "sustainabilityPlan" TEXT,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "verificationDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "real_time_analytics_cache_cacheKey_key" ON "medical"."real_time_analytics_cache"("cacheKey");

-- CreateIndex
CREATE UNIQUE INDEX "system_configurations_category_key_centerId_key" ON "system"."system_configurations"("category", "key", "centerId");

-- CreateIndex
CREATE INDEX "report_history_reportId_reportType_idx" ON "system"."report_history"("reportId", "reportType");

-- CreateIndex
CREATE INDEX "report_history_templateId_idx" ON "system"."report_history"("templateId");

-- CreateIndex
CREATE INDEX "report_history_generatedAt_idx" ON "system"."report_history"("generatedAt");

-- CreateIndex
CREATE INDEX "report_distributions_reportHistoryId_idx" ON "system"."report_distributions"("reportHistoryId");

-- CreateIndex
CREATE INDEX "report_distributions_reportExecutionId_idx" ON "system"."report_distributions"("reportExecutionId");

-- CreateIndex
CREATE INDEX "report_distributions_recipientId_idx" ON "system"."report_distributions"("recipientId");

-- CreateIndex
CREATE INDEX "report_access_logs_reportHistoryId_idx" ON "system"."report_access_logs"("reportHistoryId");

-- CreateIndex
CREATE INDEX "report_access_logs_userId_idx" ON "system"."report_access_logs"("userId");

-- CreateIndex
CREATE INDEX "report_access_logs_accessedAt_idx" ON "system"."report_access_logs"("accessedAt");

-- CreateIndex
CREATE INDEX "notification_preferences_userId_idx" ON "system"."notification_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_category_channel_key" ON "system"."notification_preferences"("userId", "category", "channel");

-- CreateIndex
CREATE INDEX "notification_history_notificationId_idx" ON "system"."notification_history"("notificationId");

-- CreateIndex
CREATE INDEX "notification_history_recipientId_idx" ON "system"."notification_history"("recipientId");

-- CreateIndex
CREATE INDEX "notification_history_status_idx" ON "system"."notification_history"("status");

-- CreateIndex
CREATE INDEX "notification_history_createdAt_idx" ON "system"."notification_history"("createdAt");

-- CreateIndex
CREATE INDEX "notification_digests_userId_category_idx" ON "system"."notification_digests"("userId", "category");

-- CreateIndex
CREATE INDEX "notification_digests_nextScheduledAt_idx" ON "system"."notification_digests"("nextScheduledAt");

-- CreateIndex
CREATE INDEX "calendar_integrations_userId_idx" ON "system"."calendar_integrations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "calendar_integrations_userId_provider_key" ON "system"."calendar_integrations"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "task_executions_executionId_key" ON "system"."task_executions"("executionId");

-- CreateIndex
CREATE UNIQUE INDEX "researcher_profiles_userId_key" ON "medical"."researcher_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_projectId_researcherProfileId_key" ON "medical"."project_members"("projectId", "researcherProfileId");

-- CreateIndex
CREATE INDEX "dataset_annotations_projectId_datasetType_datasetId_idx" ON "medical"."dataset_annotations"("projectId", "datasetType", "datasetId");

-- CreateIndex
CREATE INDEX "expert_matches_userId_matchScore_idx" ON "medical"."expert_matches"("userId", "matchScore");

-- CreateIndex
CREATE UNIQUE INDEX "data_availability_cancerType_province_regency_yearFrom_year_key" ON "medical"."data_availability"("cancerType", "province", "regency", "yearFrom", "yearTo");

-- CreateIndex
CREATE INDEX "similar_studies_cancerType_studyType_idx" ON "medical"."similar_studies"("cancerType", "studyType");

-- AddForeignKey
ALTER TABLE "medical"."analytics_performance_metrics" ADD CONSTRAINT "analytics_performance_metrics_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "system"."centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."model_predictions" ADD CONSTRAINT "model_predictions_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "medical"."predictive_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."model_performance_metrics" ADD CONSTRAINT "model_performance_metrics_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "medical"."predictive_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."center_benchmarks" ADD CONSTRAINT "center_benchmarks_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "system"."centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_impact_analyses" ADD CONSTRAINT "research_impact_analyses_researchRequestId_fkey" FOREIGN KEY ("researchRequestId") REFERENCES "medical"."research_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."system_configurations" ADD CONSTRAINT "system_configurations_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "system"."centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."report_templates" ADD CONSTRAINT "report_templates_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "system"."centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."generated_reports" ADD CONSTRAINT "generated_reports_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "system"."report_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."scheduled_reports" ADD CONSTRAINT "scheduled_reports_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "system"."report_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."report_executions" ADD CONSTRAINT "report_executions_scheduledReportId_fkey" FOREIGN KEY ("scheduledReportId") REFERENCES "system"."scheduled_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."report_distributions" ADD CONSTRAINT "report_distributions_reportHistoryId_fkey" FOREIGN KEY ("reportHistoryId") REFERENCES "system"."report_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."report_distributions" ADD CONSTRAINT "report_distributions_reportExecutionId_fkey" FOREIGN KEY ("reportExecutionId") REFERENCES "system"."report_executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."report_access_logs" ADD CONSTRAINT "report_access_logs_reportHistoryId_fkey" FOREIGN KEY ("reportHistoryId") REFERENCES "system"."report_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."backup_executions" ADD CONSTRAINT "backup_executions_backupJobId_fkey" FOREIGN KEY ("backupJobId") REFERENCES "system"."backup_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."user_activity_logs" ADD CONSTRAINT "user_activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."security_events" ADD CONSTRAINT "security_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."notifications" ADD CONSTRAINT "notifications_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "system"."notification_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."external_integrations" ADD CONSTRAINT "external_integrations_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "system"."centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."integration_sync_logs" ADD CONSTRAINT "integration_sync_logs_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "system"."external_integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."performance_metrics" ADD CONSTRAINT "performance_metrics_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "system"."centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."scheduled_tasks" ADD CONSTRAINT "scheduled_tasks_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "system"."centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."task_executions" ADD CONSTRAINT "task_executions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "system"."scheduled_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."health_check_results" ADD CONSTRAINT "health_check_results_healthCheckId_fkey" FOREIGN KEY ("healthCheckId") REFERENCES "system"."health_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."api_usage" ADD CONSTRAINT "api_usage_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "system"."api_endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."api_usage" ADD CONSTRAINT "api_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_projects" ADD CONSTRAINT "research_projects_researchRequestId_fkey" FOREIGN KEY ("researchRequestId") REFERENCES "medical"."research_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."project_members" ADD CONSTRAINT "project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "medical"."research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."project_members" ADD CONSTRAINT "project_members_researcherProfileId_fkey" FOREIGN KEY ("researcherProfileId") REFERENCES "medical"."researcher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."dataset_annotations" ADD CONSTRAINT "dataset_annotations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "medical"."research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_citations" ADD CONSTRAINT "research_citations_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "medical"."research_publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_innovations" ADD CONSTRAINT "research_innovations_researchRequestId_fkey" FOREIGN KEY ("researchRequestId") REFERENCES "medical"."research_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."researcher_contributions" ADD CONSTRAINT "researcher_contributions_researchRequestId_fkey" FOREIGN KEY ("researchRequestId") REFERENCES "medical"."research_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_outcomes" ADD CONSTRAINT "research_outcomes_researchRequestId_fkey" FOREIGN KEY ("researchRequestId") REFERENCES "medical"."research_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
