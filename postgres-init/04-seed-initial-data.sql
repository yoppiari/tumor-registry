-- Seed initial data for INAMSOS development
-- Create default admin user and sample centers

-- Insert sample centers for testing
INSERT INTO system.centers (name, code, province, regency, address, phone, email, location) VALUES
('Rumah Sakit Cipto Mangunkusumo', 'RS_CM', 'DKI Jakarta', 'Jakarta Pusat', 'Jl. Diponegoro No. 71, Jakarta Pusat', '(021) 3903745', 'info@rumahsakitcm.co.id', ST_GeomFromText('POINT(-6.1944 106.8229)', 4326)),
('Rumah Sakit Dharmais Cancer Center', 'RS_DC', 'DKI Jakarta', 'Jakarta Pusat', 'Jl. Letjen S. Parman Kav. 84-86, Jakarta Barat', '(021) 5682500', 'info@dharmais.co.id', ST_GeomFromText('POINT(-6.1802 106.7991)', 4326)),
('Rumah Sakit Hasan Sadikin', 'RS_HS', 'Jawa Barat', 'Bandung', 'Jl. Pasteur No. 38, Bandung', '(022) 2034952', 'info@rshs.co.id', ST_GeomFromText('POINT(-6.8915 107.6107)', 4326)),
('Rumah Sakit Dr. Sardjito', 'RS_SD', 'DI Yogyakarta', 'Sleman', 'Jl. Kesehatan No. 1, Sleman', '(0274) 587333', 'info@sardjito.co.id', ST_GeomFromText('POINT(-7.7702 110.3784)', 4326)),
('Rumah Sakit Soetomo', 'RS_ST', 'Jawa Timur', 'Surabaya', 'Jl. Mayjen Prof. Dr. Moestopo No. 6-8, Surabaya', '(031) 5501021', 'info@soetomo.co.id', ST_GeomFromText('POINT(-7.2575 112.7521)', 4326));

-- Insert default system administrator
-- Password: admin123 (hashed with bcrypt)
INSERT INTO system.users (id, center_id, email, password_hash, name, role, phone, email_verified, is_active) VALUES
('00000000-0000-0000-0000-000000000001',
 (SELECT id FROM system.centers WHERE code = 'RS_CM' LIMIT 1),
 'admin@inamsos.id',
 '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK',
 'System Administrator',
 'national_stakeholder',
 '+6281234567890',
 true,
 true
);

-- Insert sample users for testing different roles
INSERT INTO system.users (center_id, email, password_hash, name, role, phone, email_verified, is_active) VALUES
-- Data entry staff
((SELECT id FROM system.centers WHERE code = 'RS_CM' LIMIT 1), 'dataentry@rscm.co.id', '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', 'Dr. Ahmad Wijaya', 'data_entry', '+6281122334455', true, true),
((SELECT id FROM system.centers WHERE code = 'RS_HS' LIMIT 1), 'dataentry@rshs.co.id', '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', 'Siti Nurhaliza', 'data_entry', '+6282233445566', true, true),

-- Researchers
((SELECT id FROM system.centers WHERE code = 'RS_DC' LIMIT 1), 'researcher@dharmais.co.id', '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', 'Dr. Budi Santoso', 'researcher', '+6283344556677', true, true),
((SELECT id FROM system.centers WHERE code = 'RS_SD' LIMIT 1), 'researcher@sardjito.co.id', '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', 'Dr. Dewi Lestari', 'researcher', '+6284455667788', true, true),

-- Center administrators
((SELECT id FROM system.centers WHERE code = 'RS_CM' LIMIT 1), 'admin@rscm.co.id', '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', 'Dr. Hendra Kusuma', 'admin', '+6285566778899', true, true),
((SELECT id FROM system.centers WHERE code = 'RS_HS' LIMIT 1), 'admin@rshs.co.id', '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', 'Dr. Ratna Sari', 'admin', '+6286677889900', true, true),

-- National stakeholders
((SELECT id FROM system.centers WHERE code = 'RS_CM' LIMIT 1), 'stakeholder@inamsos.id', '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', 'Dr. Prabowo Subianto', 'national_stakeholder', '+6287788990011', true, true);

-- Create sample audit log entries for testing
INSERT INTO audit.access_logs (user_id, center_id, action, resource_type, resource_id, operation, ip_address, success) VALUES
((SELECT id FROM system.users WHERE email = 'admin@inamsos.id' LIMIT 1), (SELECT id FROM system.centers WHERE code = 'RS_CM' LIMIT 1), 'USER_LOGIN', 'authentication', 'login', 'SELECT', '127.0.0.1', true),
((SELECT id FROM system.users WHERE email = 'admin@inamsos.id' LIMIT 1), (SELECT id FROM system.centers WHERE code = 'RS_CM' LIMIT 1), 'CREATE_CENTER', 'center', (SELECT id FROM system.centers WHERE code = 'RS_CM' LIMIT 1), 'INSERT', '127.0.0.1', true);

-- Log successful data seeding
DO $$
DECLARE
    center_count INTEGER;
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO center_count FROM system.centers;
    SELECT COUNT(*) INTO user_count FROM system.users;

    RAISE NOTICE 'INAMSOS Initial Data Seeded Successfully';
    RAISE NOTICE '- Centers created: %', center_count;
    RAISE NOTICE '- Users created: %', user_count;
    RAISE NOTICE '- Default admin: admin@inamsos.id / admin123';
    RAISE NOTICE '- Sample users available for each role';
END $$;