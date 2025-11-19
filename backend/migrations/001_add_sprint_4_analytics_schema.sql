-- Sprint 4: Analytics & Intelligence Schema Migration
-- This migration adds comprehensive analytics tables for real-time intelligence

-- Create analytics performance metrics table
CREATE TABLE IF NOT EXISTS medical.analytics_performance_metrics (
    id VARCHAR(255) PRIMARY KEY,
    center_id VARCHAR(255) REFERENCES system.centers(id) ON DELETE SET NULL,
    metric_type VARCHAR(100) NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    value DECIMAL(15,4) NOT NULL,
    unit VARCHAR(50),
    baseline DECIMAL(15,4),
    target DECIMAL(15,4),
    percentile_rank DECIMAL(5,2),
    comparison_group VARCHAR(255),
    time_frame VARCHAR(50) NOT NULL,
    data_quality VARCHAR(20) DEFAULT 'STANDARD',
    confidence_interval JSONB,
    risk_adjustment_factors JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for analytics performance metrics
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_center_id ON medical.analytics_performance_metrics(center_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_type ON medical.analytics_performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_time_frame ON medical.analytics_performance_metrics(time_frame);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_created_at ON medical.analytics_performance_metrics(created_at);

-- Create predictive models table
CREATE TABLE IF NOT EXISTS medical.predictive_models (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    description TEXT,
    training_data_size INTEGER NOT NULL,
    validation_data_size INTEGER,
    accuracy DECIMAL(5,4),
    precision DECIMAL(5,4),
    recall DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    auc_score DECIMAL(5,4),
    calibration_score DECIMAL(5,4),
    features JSONB NOT NULL,
    hyperparameters JSONB,
    training_date TIMESTAMP NOT NULL,
    last_validated TIMESTAMP,
    validation_metrics JSONB,
    deployment_status VARCHAR(50) DEFAULT 'STAGING',
    model_version VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    retraining_frequency INTEGER, -- days
    last_retrained_at TIMESTAMP,
    next_retraining_due TIMESTAMP,
    performance_history JSONB,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for predictive models
CREATE INDEX IF NOT EXISTS idx_predictive_models_type ON medical.predictive_models(model_type);
CREATE INDEX IF NOT EXISTS idx_predictive_models_active ON medical.predictive_models(is_active);
CREATE INDEX IF NOT EXISTS idx_predictive_models_status ON medical.predictive_models(deployment_status);

-- Create model predictions table
CREATE TABLE IF NOT EXISTS medical.model_predictions (
    id VARCHAR(255) PRIMARY KEY,
    model_id VARCHAR(255) NOT NULL REFERENCES medical.predictive_models(id) ON DELETE CASCADE,
    patient_id VARCHAR(255) REFERENCES medical.patients(id) ON DELETE SET NULL,
    input_features JSONB NOT NULL,
    prediction JSONB NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    prediction_type VARCHAR(100) NOT NULL,
    actual_outcome JSONB,
    accuracy_score DECIMAL(5,4),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for model predictions
CREATE INDEX IF NOT EXISTS idx_model_predictions_model_id ON medical.model_predictions(model_id);
CREATE INDEX IF NOT EXISTS idx_model_predictions_patient_id ON medical.model_predictions(patient_id);
CREATE INDEX IF NOT EXISTS idx_model_predictions_created_at ON medical.model_predictions(created_at);
CREATE INDEX IF NOT EXISTS idx_model_predictions_type ON medical.model_predictions(prediction_type);

-- Create model performance metrics table
CREATE TABLE IF NOT EXISTS medical.model_performance_metrics (
    id VARCHAR(255) PRIMARY KEY,
    model_id VARCHAR(255) NOT NULL REFERENCES medical.predictive_models(id) ON DELETE CASCADE,
    metric_name VARCHAR(255) NOT NULL,
    value DECIMAL(15,4) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_slice VARCHAR(100), -- e.g., 'validation', 'test', 'production'
    additional_metrics JSONB
);

-- Create indexes for model performance metrics
CREATE INDEX IF NOT EXISTS idx_model_perf_metrics_model_id ON medical.model_performance_metrics(model_id);
CREATE INDEX IF NOT EXISTS idx_model_perf_metrics_timestamp ON medical.model_performance_metrics(timestamp);

-- Create executive dashboards table
CREATE TABLE IF NOT EXISTS medical.executive_dashboards (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    dashboard_type VARCHAR(100) NOT NULL,
    layout JSONB NOT NULL,
    widgets JSONB NOT NULL,
    filters JSONB,
    access_level VARCHAR(50) DEFAULT 'AGGREGATE_ONLY',
    is_active BOOLEAN DEFAULT TRUE,
    refresh_interval INTEGER, -- minutes
    last_refreshed TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for executive dashboards
CREATE INDEX IF NOT EXISTS idx_exec_dashboards_type ON medical.executive_dashboards(dashboard_type);
CREATE INDEX IF NOT EXISTS idx_exec_dashboards_active ON medical.executive_dashboards(is_active);

-- Create report schedules table
CREATE TABLE IF NOT EXISTS medical.report_schedules (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(100) NOT NULL,
    schedule VARCHAR(255) NOT NULL, -- cron expression
    recipients JSONB NOT NULL,
    parameters JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    last_run TIMESTAMP,
    next_run TIMESTAMP,
    format VARCHAR(20) DEFAULT 'PDF',
    delivery_method VARCHAR(50) DEFAULT 'EMAIL',
    template_id VARCHAR(255),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for report schedules
CREATE INDEX IF NOT EXISTS idx_report_schedules_active ON medical.report_schedules(is_active);
CREATE INDEX IF NOT EXISTS idx_report_schedules_next_run ON medical.report_schedules(next_run);

-- Create center benchmarks table
CREATE TABLE IF NOT EXISTS medical.center_benchmarks (
    id VARCHAR(255) PRIMARY KEY,
    center_id VARCHAR(255) NOT NULL REFERENCES system.centers(id) ON DELETE CASCADE,
    benchmark_period VARCHAR(50) NOT NULL,
    total_patients INTEGER NOT NULL,
    new_patients INTEGER NOT NULL,
    data_quality_score DECIMAL(5,2) NOT NULL,
    reporting_completeness DECIMAL(5,2) NOT NULL,
    timeliness_score DECIMAL(5,2) NOT NULL,
    overall_score DECIMAL(5,2) NOT NULL,
    rank INTEGER,
    percentile_rank DECIMAL(5,2),
    peer_group VARCHAR(255),
    improvement_areas JSONB,
    strengths JSONB,
    recommendations JSONB,
    comparison_metrics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for center benchmarks
CREATE INDEX IF NOT EXISTS idx_center_benchmarks_center_id ON medical.center_benchmarks(center_id);
CREATE INDEX IF NOT EXISTS idx_center_benchmarks_period ON medical.center_benchmarks(benchmark_period);
CREATE INDEX IF NOT EXISTS idx_center_benchmarks_rank ON medical.center_benchmarks(rank);

-- Create research impact analyses table
CREATE TABLE IF NOT EXISTS medical.research_impact_analyses (
    id VARCHAR(255) PRIMARY KEY,
    research_request_id VARCHAR(255) NOT NULL REFERENCES medical.research_requests(id) ON DELETE CASCADE,
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    impact_score DECIMAL(5,2) NOT NULL,
    citation_count INTEGER DEFAULT 0,
    publication_count INTEGER DEFAULT 0,
    patent_count INTEGER DEFAULT 0,
    guideline_count INTEGER DEFAULT 0,
    policy_impact_count INTEGER DEFAULT 0,
    clinical_adoptions INTEGER DEFAULT 0,
    patient_impact_score DECIMAL(5,2),
    economic_impact DECIMAL(15,2),
    collaboration_index DECIMAL(5,4),
    innovation_index DECIMAL(5,4),
    reach_score DECIMAL(5,2),
    influence_score DECIMAL(5,2),
    trend_data JSONB,
    comparative_analysis JSONB,
    recommendations JSONB,
    verified_by VARCHAR(255),
    verification_date TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for research impact analyses
CREATE INDEX IF NOT EXISTS idx_research_impact_request_id ON medical.research_impact_analyses(research_request_id);
CREATE INDEX IF NOT EXISTS idx_research_impact_score ON medical.research_impact_analyses(impact_score);
CREATE INDEX IF NOT EXISTS idx_research_impact_analysis_date ON medical.research_impact_analyses(analysis_date);

-- Create cancer trend analyses table
CREATE TABLE IF NOT EXISTS medical.cancer_trend_analyses (
    id VARCHAR(255) PRIMARY KEY,
    cancer_type VARCHAR(255) NOT NULL,
    geographic_level VARCHAR(50) NOT NULL,
    geographic_area VARCHAR(255),
    trend_period VARCHAR(50) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    baseline_incidence DECIMAL(10,6),
    current_incidence DECIMAL(10,6),
    trend_direction VARCHAR(50) NOT NULL,
    trend_significance DECIMAL(5,4),
    confidence_interval JSONB,
    predicted_values JSONB,
    seasonal_factors JSONB,
    risk_factors JSONB,
    recommendations JSONB,
    data_quality VARCHAR(20) DEFAULT 'STANDARD',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for cancer trend analyses
CREATE INDEX IF NOT EXISTS idx_cancer_trends_type ON medical.cancer_trend_analyses(cancer_type);
CREATE INDEX IF NOT EXISTS idx_cancer_trends_geographic_level ON medical.cancer_trend_analyses(geographic_level);
CREATE INDEX IF NOT EXISTS idx_cancer_trends_period ON medical.cancer_trend_analyses(trend_period);
CREATE INDEX IF NOT EXISTS idx_cancer_trends_direction ON medical.cancer_trend_analyses(trend_direction);

-- Create real-time analytics cache table
CREATE TABLE IF NOT EXISTS medical.real_time_analytics_cache (
    id VARCHAR(255) PRIMARY KEY,
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    cache_value JSONB NOT NULL,
    cache_type VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    refresh_interval INTEGER NOT NULL, -- minutes
    last_refreshed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hit_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB
);

-- Create indexes for real-time analytics cache
CREATE INDEX IF NOT EXISTS idx_analytics_cache_key ON medical.real_time_analytics_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_type ON medical.real_time_analytics_cache(cache_type);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_expires_at ON medical.real_time_analytics_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_active ON medical.real_time_analytics_cache(is_active);

-- Create national cancer intelligence table
CREATE TABLE IF NOT EXISTS medical.national_cancer_intelligence (
    id VARCHAR(255) PRIMARY KEY,
    report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_registered_cases INTEGER NOT NULL,
    new_cases_this_month INTEGER NOT NULL,
    active_cases INTEGER NOT NULL,
    mortality_rate DECIMAL(5,4),
    survival_rate DECIMAL(5,4),
    screening_coverage DECIMAL(5,4),
    early_detection_rate DECIMAL(5,4),
    top_cancer_types JSONB,
    demographic_breakdown JSONB,
    geographic_distribution JSONB,
    trend_analysis JSONB,
    risk_factor_analysis JSONB,
    healthcare_system_load JSONB,
    resource_utilization JSONB,
    quality_metrics JSONB,
    policy_recommendations JSONB,
    data_quality VARCHAR(20) DEFAULT 'STANDARD',
    reporting_completeness DECIMAL(5,4),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by VARCHAR(255),
    verification_date TIMESTAMP
);

-- Create indexes for national cancer intelligence
CREATE INDEX IF NOT EXISTS idx_national_intelligence_report_date ON medical.national_cancer_intelligence(report_date);
CREATE INDEX IF NOT EXISTS idx_national_intelligence_quality ON medical.national_cancer_intelligence(data_quality);

-- Create materialized view refresh tracking table
CREATE TABLE IF NOT EXISTS medical.materialized_view_refresh (
    id VARCHAR(255) PRIMARY KEY,
    view_name VARCHAR(255) NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    refresh_schedule VARCHAR(255) NOT NULL, -- cron expression
    last_refreshed TIMESTAMP,
    next_refresh TIMESTAMP,
    refresh_duration INTEGER, -- seconds
    status VARCHAR(50) DEFAULT 'PENDING',
    error_message TEXT,
    row_count INTEGER,
    size_in_mb DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    dependencies JSONB, -- other views/tables
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for materialized view refresh
CREATE INDEX IF NOT EXISTS idx_mv_refresh_view_name ON medical.materialized_view_refresh(view_name);
CREATE INDEX IF NOT EXISTS idx_mv_refresh_status ON medical.materialized_view_refresh(status);
CREATE INDEX IF NOT EXISTS idx_mv_refresh_next_refresh ON medical.materialized_view_refresh(next_refresh);

-- Create analytics event logs table
CREATE TABLE IF NOT EXISTS audit.analytics_event_logs (
    id VARCHAR(255) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(100) NOT NULL,
    description TEXT,
    event_data JSONB,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration INTEGER, -- milliseconds
    success BOOLEAN NOT NULL,
    error_code VARCHAR(100),
    error_message TEXT,
    metadata JSONB
);

-- Create indexes for analytics event logs
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON audit.analytics_event_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON audit.analytics_event_logs(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON audit.analytics_event_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON audit.analytics_event_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_success ON audit.analytics_event_logs(success);

-- Create updated_at function and trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_analytics_performance_metrics_updated_at
    BEFORE UPDATE ON medical.analytics_performance_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictive_models_updated_at
    BEFORE UPDATE ON medical.predictive_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_model_predictions_updated_at
    BEFORE UPDATE ON medical.model_predictions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_executive_dashboards_updated_at
    BEFORE UPDATE ON medical.executive_dashboards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_schedules_updated_at
    BEFORE UPDATE ON medical.report_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_center_benchmarks_updated_at
    BEFORE UPDATE ON medical.center_benchmarks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_impact_analyses_updated_at
    BEFORE UPDATE ON medical.research_impact_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cancer_trend_analyses_updated_at
    BEFORE UPDATE ON medical.cancer_trend_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materialized_view_refresh_updated_at
    BEFORE UPDATE ON medical.materialized_view_refresh
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create materialized views for performance optimization
CREATE MATERIALIZED VIEW IF NOT EXISTS medical.cancer_stats_mv AS
SELECT
    pd.diagnosis_name as cancer_type,
    EXTRACT(YEAR FROM pd.onset_date) as year,
    EXTRACT(MONTH FROM pd.onset_date) as month,
    p.gender,
    DATE_PART('year', AGE(pd.onset_date, p.date_of_birth)) as age_group,
    COUNT(*) as case_count,
    c.province,
    c.code as center_code,
    AVG(CASE WHEN pd.severity = 'SEVERE' OR pd.severity = 'CRITICAL' THEN 1 ELSE 0 END) * 100 as severity_rate
FROM medical.patient_diagnoses pd
JOIN medical.patients p ON pd.patient_id = p.id
JOIN system.centers c ON p.center_id = c.id
WHERE pd.diagnosis_type = 'PRIMARY'
    AND pd.status = 'ACTIVE'
    AND pd.onset_date IS NOT NULL
GROUP BY pd.diagnosis_name, EXTRACT(YEAR FROM pd.onset_date), EXTRACT(MONTH FROM pd.onset_date),
         p.gender, DATE_PART('year', AGE(pd.onset_date, p.date_of_birth)), c.province, c.code;

CREATE INDEX IF NOT EXISTS idx_cancer_stats_mv_cancer_type ON medical.cancer_stats_mv(cancer_type);
CREATE INDEX IF NOT EXISTS idx_cancer_stats_mv_year ON medical.cancer_stats_mv(year);
CREATE INDEX IF NOT EXISTS idx_cancer_stats_mv_province ON medical.cancer_stats_mv(province);

CREATE MATERIALIZED VIEW IF NOT EXISTS medical.treatment_outcomes_mv AS
SELECT
    pd.diagnosis_name as cancer_type,
    pd.severity,
    pp.procedure_name as treatment_type,
    pp.status as treatment_status,
    pp.outcome,
    DATE_PART('day', pp.end_date - pp.start_date) as treatment_duration_days,
    c.province,
    COUNT(*) as treatment_count,
    AVG(CASE WHEN pp.outcome = 'SUCCESS' THEN 1 ELSE 0 END) * 100 as success_rate,
    AVG(CASE WHEN pp.complications IS NOT NULL THEN 1 ELSE 0 END) * 100 as complication_rate
FROM medical.patient_procedures pp
JOIN medical.patients p ON pp.patient_id = p.id
JOIN medical.patient_diagnoses pd ON p.id = pd.patient_id
JOIN system.centers c ON p.center_id = c.id
WHERE pp.start_date IS NOT NULL
    AND pp.status = 'COMPLETED'
GROUP BY pd.diagnosis_name, pd.severity, pp.procedure_name, pp.status, pp.outcome, c.province;

CREATE INDEX IF NOT EXISTS idx_treatment_outcomes_mv_cancer_type ON medical.treatment_outcomes_mv(cancer_type);
CREATE INDEX IF NOT EXISTS idx_treatment_outcomes_mv_treatment_type ON medical.treatment_outcomes_mv(treatment_type);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.analytics_performance_metrics TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.predictive_models TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.model_predictions TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.model_performance_metrics TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.executive_dashboards TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.report_schedules TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.center_benchmarks TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.research_impact_analyses TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.cancer_trend_analyses TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.real_time_analytics_cache TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.national_cancer_intelligence TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON medical.materialized_view_refresh TO inamsos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON audit.analytics_event_logs TO inamsos_app;

GRANT SELECT ON medical.cancer_stats_mv TO inamsos_app;
GRANT SELECT ON medical.treatment_outcomes_mv TO inamsos_app;

-- Grant refresh materialized view permissions
GRANT USAGE ON SCHEMA medical TO inamsos_app;

COMMIT;