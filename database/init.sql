-- INAMSOS Database Initialization Script
-- Indonesian National Cancer Database
-- Local Development Environment

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types
CREATE TYPE blood_type AS ENUM ('A', 'B', 'AB', 'O');
CREATE TYPE rh_factor AS ENUM ('positive', 'negative');
CREATE TYPE gender AS ENUM ('male', 'female');
CREATE TYPE marital_status AS ENUM ('single', 'married', 'divorced', 'widowed');
CREATE TYPE education_level AS ENUM ('elementary', 'junior_high', 'senior_high', 'diploma', 'bachelor', 'master', 'doctorate');
CREATE TYPE employment_status AS ENUM ('employed', 'unemployed', 'self_employed', 'student', 'retired');
CREATE TYPE cancer_stage AS ENUM ('0', 'I', 'II', 'III', 'IV');
CREATE TYPE histology_type AS ENUM ('adenocarcinoma', 'squamous_cell', 'small_cell', 'large_cell', 'neuroendocrine', 'other');
CREATE TYPE treatment_status AS ENUM ('planned', 'ongoing', 'completed', 'suspended', 'cancelled');

-- Create user roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    is_email_verified BOOLEAN DEFAULT false,
    role_id UUID REFERENCES user_roles(id),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create centers table
CREATE TABLE IF NOT EXISTS centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'hospital', 'clinic', 'research_center'
    address TEXT NOT NULL,
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    bed_capacity INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medical_record_number VARCHAR(50) UNIQUE NOT NULL,
    national_id VARCHAR(50) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(100),
    gender gender NOT NULL,
    blood_type blood_type,
    rh_factor rh_factor,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT NOT NULL,
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10),
    marital_status marital_status,
    education_level education_level,
    employment_status employment_status,
    occupation VARCHAR(100),
    religion VARCHAR(50),
    ethnicity VARCHAR(50),
    nationality VARCHAR(50) DEFAULT 'Indonesian',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create diagnoses table
CREATE TABLE IF NOT EXISTS diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    center_id UUID NOT NULL REFERENCES centers(id),
    primary_site VARCHAR(255) NOT NULL, -- ICD-O-3 topography code
    histology histology_type NOT NULL,
    behavior VARCHAR(10), -- ICD-O-3 behavior code
    grade VARCHAR(10),
    cancer_stage cancer_stage,
    tnm_stage VARCHAR(50), -- TNM staging
    date_of_diagnosis DATE NOT NULL,
    diagnostic_methods TEXT[], -- Array of diagnostic methods
    diagnosis_status VARCHAR(50) DEFAULT 'confirmed',
    physician_name VARCHAR(255),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create treatment_plans table
CREATE TABLE IF NOT EXISTS treatment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    diagnosis_id UUID NOT NULL REFERENCES diagnoses(id),
    center_id UUID NOT NULL REFERENCES centers(id),
    plan_name VARCHAR(255) NOT NULL,
    treatment_type VARCHAR(100) NOT NULL, -- 'surgery', 'chemotherapy', 'radiation', 'immunotherapy', etc.
    treatment_status treatment_status DEFAULT 'planned',
    start_date DATE,
    end_date DATE,
    protocol VARCHAR(255),
    dosage TEXT,
    frequency VARCHAR(100),
    physician_name VARCHAR(255),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create research_requests table
CREATE TABLE IF NOT EXISTS research_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    researcher_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    purpose TEXT NOT NULL,
    data_required JSONB NOT NULL, -- Array of required data fields
    sample_size INTEGER,
    inclusion_criteria TEXT,
    exclusion_criteria TEXT,
    methodology TEXT,
    expected_outcome TEXT,
    ethical_approval BOOLEAN DEFAULT false,
    ethical_approval_file VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
    reviewed_by UUID REFERENCES users(id),
    review_date TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(medical_record_number);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_diagnoses_patient ON diagnoses(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_center ON diagnoses(center_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_date ON diagnoses(date_of_diagnosis);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_patient ON treatment_plans(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_status ON treatment_plans(treatment_status);
CREATE INDEX IF NOT EXISTS idx_centers_province ON centers(province);
CREATE INDEX IF NOT EXISTS idx_research_requests_status ON research_requests(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Create trigger function for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_centers_updated_at BEFORE UPDATE ON centers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagnoses_updated_at BEFORE UPDATE ON diagnoses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_plans_updated_at BEFORE UPDATE ON treatment_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_requests_updated_at BEFORE UPDATE ON research_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for audit logging
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (action, resource_type, resource_id, new_values)
        VALUES ('INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (action, resource_type, resource_id, old_values, new_values)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (action, resource_type, resource_id, old_values)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers
CREATE TRIGGER audit_users
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_patients
    AFTER INSERT OR UPDATE OR DELETE ON patients
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_diagnoses
    AFTER INSERT OR UPDATE OR DELETE ON diagnoses
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_treatment_plans
    AFTER INSERT OR UPDATE OR DELETE ON treatment_plans
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

COMMIT;