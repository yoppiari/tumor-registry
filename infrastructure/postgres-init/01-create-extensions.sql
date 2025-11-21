-- Create required extensions for INAMSOS
-- Run this script when database is first created

-- UUID generation for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Geographic data support for Indonesia provinces mapping
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Cryptographic functions for data encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Text search capabilities for medical records
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Statistics and analytics support
CREATE EXTENSION IF NOT EXISTS "tablefunc";

-- Enable timestamp with timezone support
SET timezone = 'UTC';

-- Log successful extensions creation
DO $$
BEGIN
    RAISE NOTICE 'INAMSOS Database Extensions Created Successfully';
    RAISE NOTICE '- uuid-ossp: %', EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp');
    RAISE NOTICE '- postgis: %', EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'postgis');
    RAISE NOTICE '- pgcrypto: %', EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto');
    RAISE NOTICE '- pg_trgm: %', EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm');
    RAISE NOTICE '- tablefunc: %', EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'tablefunc');
END $$;