-- Create schemas for INAMSOS multi-tenant architecture
-- Each center will have its own schema for data isolation

-- System schema for shared system data
CREATE SCHEMA IF NOT EXISTS system;
COMMENT ON SCHEMA system IS 'System-wide data including users, centers, and configurations';

-- Audit schema for compliance and logging
CREATE SCHEMA IF NOT EXISTS audit;
COMMENT ON SCHEMA audit IS 'Audit trails and compliance logs for HIPAA requirements';

-- Analytics schema for aggregated data and reporting
CREATE SCHEMA IF NOT EXISTS analytics;
COMMENT ON SCHEMA analytics IS 'Aggregated analytics data and materialized views';

-- File storage metadata schema
CREATE SCHEMA IF NOT EXISTS storage;
COMMENT ON SCHEMA storage IS 'File metadata and storage references';

-- Create schema permissions
DO $$
DECLARE
    schema_record RECORD;
BEGIN
    FOR schema_record IN
        SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name IN ('system', 'audit', 'analytics', 'storage')
    LOOP
        EXECUTE format('GRANT USAGE ON SCHEMA %I TO inamsos', schema_record.schema_name);
        EXECUTE format('GRANT CREATE ON SCHEMA %I TO inamsos', schema_record.schema_name);
    END LOOP;

    RAISE NOTICE 'INAMSOS Schemas Created Successfully';
    RAISE NOTICE '- system: User and center management';
    RAISE NOTICE '- audit: Compliance and audit trails';
    RAISE NOTICE '- analytics: Aggregated data and reporting';
    RAISE NOTICE '- storage: File metadata and references';
END $$;