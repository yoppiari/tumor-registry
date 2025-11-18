-- Create base tables for INAMSOS system
-- These tables support the core functionality across all epics

-- SYSTEM SCHEMA TABLES

-- Centers table for multi-tenant architecture
CREATE TABLE IF NOT EXISTS system.centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    province VARCHAR(100) NOT NULL,
    regency VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add spatial reference for centers
ALTER TABLE system.centers
ADD COLUMN IF NOT EXISTS location GEOMETRY(POINT, 4326);

-- Users table with role-based access control
CREATE TABLE IF NOT EXISTS system.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID REFERENCES system.centers(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('data_entry', 'researcher', 'admin', 'national_stakeholder')),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for authentication management
CREATE TABLE IF NOT EXISTS system.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES system.users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- AUDIT SCHEMA TABLES

-- Comprehensive audit trail for HIPAA compliance
CREATE TABLE IF NOT EXISTS audit.access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES system.users(id) ON DELETE SET NULL,
    center_id UUID REFERENCES system.centers(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    table_name VARCHAR(255),
    operation VARCHAR(20) CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT')),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data changes tracking for compliance
CREATE TABLE IF NOT EXISTS audit.data_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES system.users(id) ON DELETE SET NULL,
    center_id UUID REFERENCES system.centers(id) ON DELETE SET NULL,
    table_name VARCHAR(255) NOT NULL,
    record_id VARCHAR(255) NOT NULL,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    change_reason TEXT,
    approved_by UUID REFERENCES system.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STORAGE SCHEMA TABLES

-- File metadata for medical images and documents
CREATE TABLE IF NOT EXISTS storage.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID REFERENCES system.centers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES system.users(id) ON DELETE SET NULL,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL UNIQUE,
    file_path VARCHAR(1000) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('dicom', 'jpeg', 'png', 'pdf', 'doc', 'xls')),
    category VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ANALYTICS SCHEMA TABLES

-- Materialized view refresh tracking
CREATE TABLE IF NOT EXISTS analytics.view_refresh_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    view_name VARCHAR(255) NOT NULL,
    refresh_started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_completed_at TIMESTAMP WITH TIME ZONE,
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    rows_affected BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_centers_province ON system.centers(province);
CREATE INDEX IF NOT EXISTS idx_centers_active ON system.centers(is_active);
CREATE INDEX IF NOT EXISTS idx_users_center_id ON system.users(center_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON system.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON system.users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON system.users(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON system.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON system.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON audit.access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_created ON audit.access_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_access_logs_center_id ON audit.access_logs(center_id);
CREATE INDEX IF NOT EXISTS idx_data_changes_table ON audit.data_changes(table_name);
CREATE INDEX IF NOT EXISTS idx_data_changes_record ON audit.data_changes(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_files_center_id ON storage.files(center_id);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON storage.files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_type ON storage.files(file_type);

-- Create spatial index for centers location
CREATE INDEX IF NOT EXISTS idx_centers_location ON system.centers USING GIST(location);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_centers_updated_at BEFORE UPDATE ON system.centers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON system.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON storage.files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Log successful table creation
DO $$
BEGIN
    RAISE NOTICE 'INAMSOS Base Tables Created Successfully';
    RAISE NOTICE '- System Tables: centers, users, user_sessions';
    RAISE NOTICE '- Audit Tables: access_logs, data_changes';
    RAISE NOTICE '- Storage Tables: files';
    RAISE NOTICE '- Analytics Tables: view_refresh_log';
    RAISE NOTICE '- Indexes and triggers created';
END $$;