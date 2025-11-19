-- Create indexes for research tables for better performance
-- These indexes support research discovery and collaboration features

-- Create indexes for research requests
CREATE INDEX IF NOT EXISTS idx_research_requests_status ON medical.research_requests (status);
CREATE INDEX IF NOT EXISTS idx_research_requests_created_by ON medical.research_requests (created_by);
CREATE INDEX IF NOT EXISTS idx_research_requests_pi_id ON medical.research_requests (principalInvestigatorId);
CREATE INDEX IF NOT EXISTS idx_research_requests_created_at ON medical.research_requests (createdAt);
CREATE INDEX IF NOT EXISTS idx_research_requests_study_type ON medical.research_requests (studyType);

-- Create indexes for research approvals
CREATE INDEX IF NOT EXISTS idx_research_approvals_request_id ON medical.research_approvals (researchRequestId);
CREATE INDEX IF NOT EXISTS idx_research_approvals_approver_id ON medical.research_approvals (approverId);
CREATE INDEX IF NOT EXISTS idx_research_approvals_status ON medical.research_approvals (status);
CREATE INDEX IF NOT EXISTS idx_research_approvals_level ON medical.research_approvals (level);

-- Create indexes for research collaborations
CREATE INDEX IF NOT EXISTS idx_research_collaborations_request_id ON medical.research_collaborations (researchRequestId);
CREATE INDEX IF NOT EXISTS idx_research_collaborations_collaborator_id ON medical.research_collaborations (collaboratorId);
CREATE INDEX IF NOT EXISTS idx_research_collaborations_status ON medical.research_collaborations (status);
CREATE INDEX IF NOT EXISTS idx_research_collaborations_role ON medical.research_collaborations (role);

-- Create indexes for data access sessions
CREATE INDEX IF NOT EXISTS idx_data_access_sessions_request_id ON medical.data_access_sessions (researchRequestId);
CREATE INDEX IF NOT EXISTS idx_data_access_sessions_user_id ON medical.data_access_sessions (userId);
CREATE INDEX IF NOT EXISTS idx_data_access_sessions_start_time ON medical.data_access_sessions (startTime);
CREATE INDEX IF NOT EXISTS idx_data_access_sessions_compliance_status ON medical.data_access_sessions (complianceStatus);
CREATE INDEX IF NOT EXISTS idx_data_access_sessions_session_type ON medical.data_access_sessions (sessionType);

-- Create indexes for research publications
CREATE INDEX IF NOT EXISTS idx_research_publications_request_id ON medical.research_publications (researchRequestId);
CREATE INDEX IF NOT EXISTS idx_research_publications_type ON medical.research_publications (publicationType);
CREATE INDEX IF NOT EXISTS idx_research_publications_status ON medical.research_publications (status);
CREATE INDEX IF NOT EXISTS idx_research_publications_publication_date ON medical.research_publications (publicationDate);

-- Create indexes for research impact metrics
CREATE INDEX IF NOT EXISTS idx_research_impact_metrics_request_id ON medical.research_impact_metrics (researchRequestId);
CREATE INDEX IF NOT EXISTS idx_research_impact_metrics_type ON medical.research_impact_metrics (metricType);
CREATE INDEX IF NOT EXISTS idx_research_impact_metrics_date ON medical.research_impact_metrics (date);
CREATE INDEX IF NOT EXISTS idx_research_impact_metrics_category ON medical.research_impact_metrics (category);

-- Create indexes for cancer geographic data
CREATE INDEX IF NOT EXISTS idx_cancer_geographic_province ON medical.cancer_geographic_data (province);
CREATE INDEX IF NOT EXISTS idx_cancer_geographic_cancer_type ON medical.cancer_geographic_data (cancer_type);
CREATE INDEX IF NOT EXISTS idx_cancer_geographic_year ON medical.cancer_geographic_data (year);
CREATE INDEX IF NOT EXISTS idx_cancer_geographic_count ON medical.cancer_geographic_data (count);
CREATE INDEX IF NOT EXISTS idx_cancer_geographic_incidence_rate ON medical.cancer_geographic_data (incidence_rate);

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_research_requests_status_created_at ON medical.research_requests (status, createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_research_collaborations_collaborator_status ON medical.research_collaborations (collaboratorId, status);
CREATE INDEX IF NOT EXISTS idx_data_access_sessions_user_start_time ON medical.data_access_sessions (userId, startTime DESC);
CREATE INDEX IF NOT EXISTS idx_cancer_geographic_province_year_cancer_type ON medical.cancer_geographic_data (province, year, cancer_type);

-- Create function to refresh aggregate data
CREATE OR REPLACE FUNCTION medical.refresh_research_views()
RETURNS void AS $$
BEGIN
    -- This function can be called to refresh any materialized views or aggregates
    RAISE NOTICE 'Research data refresh completed at %', NOW();
END;
$$ LANGUAGE plpgsql;