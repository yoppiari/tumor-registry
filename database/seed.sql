-- INAMSOS Database Seed Script
-- Indonesian National Cancer Database - Sample Data
-- Local Development Environment

-- Insert user roles
INSERT INTO user_roles (name, description, permissions) VALUES
('super_admin', 'Super Administrator with full system access', '["users:create", "users:read", "users:update", "users:delete", "centers:create", "centers:read", "centers:update", "centers:delete", "patients:create", "patients:read", "patients:update", "patients:delete", "diagnoses:create", "diagnoses:read", "diagnoses:update", "diagnoses:delete", "research:create", "research:read", "research:update", "research:delete", "analytics:read", "system:admin"]'),
('hospital_admin', 'Hospital Administrator with center-level access', '["users:create", "users:read", "users:update", "centers:read", "centers:update", "patients:create", "patients:read", "patients:update", "diagnoses:create", "diagnoses:read", "diagnoses:update", "treatment:create", "treatment:read", "treatment:update", "analytics:read"]'),
('data_manager', 'Data Manager with patient and diagnosis access', '["patients:create", "patients:read", "patients:update", "diagnoses:create", "diagnoses:read", "diagnoses:update", "treatment:read", "analytics:read"]'),
('oncologist', 'Oncologist with clinical access', '["patients:read", "patients:update", "diagnoses:create", "diagnoses:read", "diagnoses:update", "treatment:create", "treatment:read", "treatment:update"]'),
('researcher', 'Researcher with read-only access', '["patients:read", "diagnoses:read", "treatment:read", "research:read", "analytics:read"]');

-- Insert sample users
INSERT INTO users (email, password_hash, first_name, last_name, phone, role_id, is_email_verified) VALUES
('admin@inamsos.dev', '$2b$10$example_hash_replace_with_actual', 'Super', 'Admin', '+6281234567890', (SELECT id FROM user_roles WHERE name = 'super_admin'), true),
('hospital@siloam.dev', '$2b$10$example_hash_replace_with_actual', 'Hospital', 'Administrator', '+6281234567891', (SELECT id FROM user_roles WHERE name = 'hospital_admin'), true),
('datamanager@dharmais.dev', '$2b$10$example_hash_replace_with_actual', 'Data', 'Manager', '+6281234567892', (SELECT id FROM user_roles WHERE name = 'data_manager'), true),
('dr.santoso@cancer.dev', '$2b$10$example_hash_replace_with_actual', 'Dr. Budi', 'Santoso', '+6281234567893', (SELECT id FROM user_roles WHERE name = 'oncologist'), true),
('researcher@ui.dev', '$2b$10$example_hash_replace_with_actual', 'Researcher', 'UI', '+6281234567894', (SELECT id FROM user_roles WHERE name = 'researcher'), true);

-- Insert sample centers across Indonesian provinces
INSERT INTO centers (name, type, address, province, city, postal_code, phone, email, website, bed_capacity) VALUES
-- Major cancer hospitals in Jakarta
('RS Kanker Dharmais', 'hospital', 'Jl. RS. Dharmais No. 2-4, Kemanggisan', 'DKI Jakarta', 'Jakarta Barat', '11440', '+62153670100', 'info@dharmais.co.id', 'https://dharmais.co.id', 400),
('RS Kanker Cipto Mangunkusumo', 'hospital', 'Jl. Diponegoro No. 71, Salemba', 'DKI Jakarta', 'Jakarta Pusat', '10430', '+62131930343', 'cancer@rscm.co.id', 'https://rscm.co.id', 800),
('RS Siloam Hospitals Sarinah', 'hospital', 'Jl. MH Thamrin No. 21, Gondangdia', 'DKI Jakarta', 'Jakarta Pusat', '10350', '+62127651000', 'info@siloamhospitals.com', 'https://siloamhospitals.com', 300),

-- Hospitals in West Java
('RS Hasan Sadikin Bandung', 'hospital', 'Jl. Pasteur No. 38, Sukajadi', 'Jawa Barat', 'Bandung', '40161', '+62222036000', 'info@rshs.co.id', 'https://rshs.co.id', 800),
('RS Al Islam Bandung', 'hospital', 'Jl. Sukajadi No. 54A, Sukajadi', 'Jawa Barat', 'Bandung', '40161', '+62222014488', 'info@rsalislam.co.id', 'https://rsalislam.co.id', 300),

-- Hospitals in Central Java
('RS Dr Kariadi Semarang', 'hospital', 'Jl. Dr. Sutomo No. 16, Kota Semarang', 'Jawa Tengah', 'Semarang', '50244', '+62418419292', 'info@rskariadi.co.id', 'https://rskariadi.co.id', 750),
('RS Moewardi Surakarta', 'hospital', 'Jl. Kolonel Sutarto No. 132, Jebres', 'Jawa Tengah', 'Surakarta', '57126', '+62271640772', 'info@rsmoewardi.co.id', 'https://rsmoewardi.co.id', 600),

-- Hospitals in East Java
('RS Dr Soetomo Surabaya', 'hospital', 'Jl. Mayjen Prof. Dr. Moestopo No. 6-8, Ketabang', 'Jawa Timur', 'Surabaya', '60286', '+62315462663', 'info@rsudrsoetomo.jatimprov.go.id', 'https://rsudrsoetomo.jatimprov.go.id', 1500),
('RS Sanglah Denpasar', 'hospital', 'Jl. Rumah Sakit No. 1, Denpasar Selatan', 'Bali', 'Denpasar', '80225', '+61361224703', 'info@rs.sanglah.go.id', 'https://rs.sanglah.go.id', 700),

-- Hospitals in Sumatra
('RS M. Djamil Padang', 'hospital', 'Jl. Perintis Kemerdekaan No. 1, Padang Utara', 'Sumatera Barat', 'Padang', '25128', '+62751291400', 'info@rsmdjamil.co.id', 'https://rsmdjamil.co.id', 500),
('RS Haji Adam Malik Medan', 'hospital', 'Jl. Bunga Lau No. 17, Medan Baru', 'Sumatera Utara', 'Medan', '20136', '+624136364535', 'info@rsaham.co.id', 'https://rsaham.co.id', 650),

-- Hospitals in Kalimantan
('RS Abdul Wahab Sjahranie Samarinda', 'hospital', 'Jl. AW. Syahranie No. 36, Sempaja Selatan', 'Kalimantan Timur', 'Samarinda', '75119', '+62541741639', 'info@rsaws-smd.co.id', 'https://rsaws-smd.co.id', 400),

-- Hospitals in Sulawesi
('RS Wahidin Sudirohusodo Makassar', 'hospital', 'Jl. Perintis Kemerdekaan KM. 17, Tamalanrea', 'Sulawesi Selatan', 'Makassar', '90245', '+62411581455', 'info@rswahidin.co.id', 'https://rswahidin.co.id', 900),

-- Research Centers
('Pusat Kanker Nasional', 'research_center', 'Jl. Rasuna Said Kav. C-22, Kuningan', 'DKI Jakarta', 'Jakarta Selatan', '12940', '+6215226678', 'info@cancer.go.id', 'https://cancer.go.id', 0),
('Lembaga Biologi Molekuler Eijkman', 'research_center', 'Jl. Diponegoro No. 69, Salemba', 'DKI Jakarta', 'Jakarta Pusat', '10430', '+6213163765', 'info@eijkman.go.id', 'https://eijkman.go.id', 0);

-- Insert sample patients (20 records with diverse Indonesian names)
INSERT INTO patients (medical_record_number, national_id, first_name, last_name, date_of_birth, place_of_birth, gender, blood_type, rh_factor, phone, email, address, province, city, postal_code, marital_status, education_level, employment_status, occupation, religion, ethnicity, created_by) VALUES
('MRN202500001', '3171011234560001', 'Siti', 'Aminah', '1985-03-15', 'Jakarta', 'female', 'A', 'positive', '+628112345678', 'siti.aminah@email.com', 'Jl. Merdeka No. 45, Menteng', 'DKI Jakarta', 'Jakarta Pusat', '10310', 'married', 'bachelor', 'employed', 'Teacher', 'Islam', 'Javanese', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500002', '3171011234560002', 'Budi', 'Santoso', '1978-07-22', 'Bandung', 'male', 'B', 'negative', '+628123456789', 'budi.santoso@email.com', 'Jl. Asia Afrika No. 112, Coblong', 'Jawa Barat', 'Bandung', '40113', 'married', 'diploma', 'self_employed', 'Business Owner', 'Islam', 'Sundanese', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500003', '3171011234560003', 'Maria', 'Luisa', '1990-11-08', 'Surabaya', 'female', 'O', 'positive', '+628134567890', 'maria.luisa@email.com', 'Jl. Raya Gubeng Pojok No. 23', 'Jawa Timur', 'Surabaya', '60281', 'single', 'senior_high', 'employed', 'Sales Representative', 'Christianity', 'Javanese', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500004', '3171011234560004', 'Ahmad', 'Rizki', '1975-01-30', 'Medan', 'male', 'AB', 'positive', '+628145678901', 'ahmad.rizki@email.com', 'Jl. Sisingamangaraja No. 78', 'Sumatera Utara', 'Medan', '20112', 'married', 'bachelor', 'employed', 'Bank Manager', 'Islam', 'Batak', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500005', '3171011234560005', 'Dewi', 'Kusuma', '1982-09-17', 'Yogyakarta', 'female', 'A', 'negative', '+628156789012', 'dewi.kusuma@email.com', 'Jl. Malioboro No. 67', 'DI Yogyakarta', 'Yogyakarta', '55213', 'married', 'master', 'employed', 'University Lecturer', 'Islam', 'Javanese', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500006', '3171011234560006', 'John', 'Wijaya', '1988-05-25', 'Jakarta', 'male', 'B', 'positive', '+628167890123', 'john.wijaya@email.com', 'Jl. Sudirman No. 234, Senayan', 'DKI Jakarta', 'Jakarta Pusat', '10270', 'single', 'bachelor', 'employed', 'IT Consultant', 'Christianity', 'Chinese Indonesian', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500007', '3171011234560007', 'Ratna', 'Sari', '1973-12-03', 'Semarang', 'female', 'O', 'positive', '+628178901234', 'ratna.sari@email.com', 'Jl. Pemuda No. 156, Semarang Tengah', 'Jawa Tengah', 'Semarang', '50139', 'widowed', 'senior_high', 'retired', 'Teacher', 'Islam', 'Javanese', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500008', '3171011234560008', 'Made', 'Sudiana', '1980-06-14', 'Denpasar', 'male', 'A', 'negative', '+628189012345', 'made.sudiana@email.com', 'Jl. Raya Kuta No. 89, Badung', 'Bali', 'Denpasar', '80361', 'married', 'diploma', 'self_employed', 'Tourism Business', 'Hinduism', 'Balinese', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500009', '3171011234560009', 'Fatimah', 'Zahra', '1992-08-21', 'Palembang', 'female', 'B', 'positive', '+628190123456', 'fatimah.zahra@email.com', 'Jl. Sudirman No. 123', 'Sumatera Selatan', 'Palembang', '30126', 'single', 'bachelor', 'employed', 'Nurse', 'Islam', 'Palembang', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500010', '3171011234560010', 'Agus', 'Prabowo', '1976-04-10', 'Makassar', 'male', 'O', 'negative', '+628191234567', 'agus.prabowo@email.com', 'Jl. AP Pettarani No. 67', 'Sulawesi Selatan', 'Makassar', '90222', 'married', 'senior_high', 'employed', 'Driver', 'Islam', 'Buginese', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500011', '3171011234560011', 'Nining', 'Indriani', '1984-10-28', 'Bandung', 'female', 'AB', 'positive', '+628192345678', 'nining.indriani@email.com', 'Jl. Dago No. 45', 'Jawa Barat', 'Bandung', '40135', 'married', 'bachelor', 'employed', 'Marketing Manager', 'Islam', 'Sundanese', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500012', '3171011234560012', 'Eko', 'Haryanto', '1971-02-14', 'Surakarta', 'male', 'A', 'negative', '+628193456789', 'eko.haryanto@email.com', 'Jl. Slamet Riyadi No. 234', 'Jawa Tengah', 'Surakarta', '57141', 'divorced', 'junior_high', 'employed', 'Factory Worker', 'Islam', 'Javanese', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500013', '3171011234560013', 'Lina', 'Marlina', '1989-07-05', 'Pekanbaru', 'female', 'B', 'positive', '+628194567890', 'lina.marlina@email.com', 'Jl. Sudirman No. 456', 'Riau', 'Pekanbaru', '28116', 'single', 'diploma', 'employed', 'Accountant', 'Islam', 'Malay', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500014', '3171011234560014', 'Bambang', 'Sutrisno', '1977-11-19', 'Malang', 'male', 'O', 'positive', '+628195678901', 'bambang.sutrisno@email.com', 'Jl. Ijen No. 67', 'Jawa Timur', 'Malang', '65115', 'married', 'senior_high', 'self_employed', 'Shop Owner', 'Islam', 'Javanese', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500015', '3171011234560015', 'Rina', 'Kartika', '1986-03-28', 'Manado', 'female', 'A', 'negative', '+628196789012', 'rina.kartika@email.com', 'Jl. Sam Ratulangi No. 89', 'Sulawesi Utara', 'Manado', '95111', 'married', 'bachelor', 'employed', 'Civil Servant', 'Christianity', 'Minahasa', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500016', '3171011234560016', 'Hendra', 'Kurniawan', '1974-09-12', 'Pontianak', 'male', 'AB', 'positive', '+628197890123', 'hendra.kurniawan@email.com', 'Jl. Ahmad Yani No. 234', 'Kalimantan Barat', 'Pontianak', '78121', 'married', 'diploma', 'employed', 'Merchant', 'Islam', 'Dayak', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500017', '3171011234560017', 'Susi', 'Andriani', '1983-06-07', 'Mataram', 'female', 'B', 'negative', '+628198901234', 'susi.andriani@email.com', 'Jl. Pejanggik No. 45', 'Nusa Tenggara Barat', 'Mataram', '83125', 'single', 'bachelor', 'employed', 'Teacher', 'Islam', 'Sasak', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500018', '3171011234560018', 'Toni', 'Rahman', '1979-04-22', 'Banjarmasin', 'male', 'O', 'positive', '+628199012345', 'toni.rahman@email.com', 'Jl. Pangeran Antasari No. 123', 'Kalimantan Selatan', 'Banjarmasin', '70235', 'married', 'senior_high', 'employed', 'Police Officer', 'Islam', 'Banjar', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500019', '3171011234560019', 'Maya', 'Putri', '1991-12-16', 'Kupang', 'female', 'A', 'positive', '+628200123456', 'maya.putri@email.com', 'Jl. El Tari No. 67', 'Nusa Tenggara Timur', 'Kupang', '85228', 'single', 'bachelor', 'employed', 'NGO Worker', 'Christianity', 'Timorese', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev')),
('MRN202500020', '3171011234560020', 'Doni', 'Pratama', '1987-08-03', 'Jayapura', 'male', 'B', 'negative', '+628201234567', 'doni.pratama@email.com', 'Jl. Sentani No. 89', 'Papua', 'Jayapura', '99351', 'married', 'diploma', 'employed', 'Government Employee', 'Christianity', 'Papuan', (SELECT id FROM users WHERE email = 'datamanager@dharmais.dev'));

-- Insert sample diagnoses for the first 10 patients
INSERT INTO diagnoses (patient_id, center_id, primary_site, histology, cancer_stage, date_of_diagnosis, diagnostic_methods, physician_name, notes, created_by) VALUES
-- Patient 1: Breast cancer
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500001'), (SELECT id FROM centers WHERE name = 'RS Kanker Dharmais'), 'C50.9', 'adenocarcinoma', 'II', '2024-01-15', '{"mammography", "biopsy", "ultrasound"}', 'Dr. Anita Wijaya', 'Invasive ductal carcinoma, hormone receptor positive', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev')),

-- Patient 2: Lung cancer
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500002'), (SELECT id FROM centers WHERE name = 'RS Hasan Sadikin Bandung'), 'C34.9', 'squamous_cell', 'III', '2024-02-20', '{"CT scan", "bronchoscopy", "biopsy"}', 'Dr. Budi Hartono', 'Non-small cell lung cancer, metastatic', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev')),

-- Patient 3: Cervical cancer
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500003'), (SELECT id FROM centers WHERE name = 'RS Dr Soetomo Surabaya'), 'C53.9', 'adenocarcinoma', 'I', '2024-03-10', '{"Pap smear", "colposcopy", "biopsy"}', 'Dr. Ratna Sari', 'Early stage cervical cancer, good prognosis', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev')),

-- Patient 4: Prostate cancer
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500004'), (SELECT id FROM centers WHERE name = 'RS M. Djamil Padang'), 'C61.9', 'adenocarcinoma', 'II', '2024-01-28', '{"PSA test", "biopsy", "MRI"}', 'Dr. Hendra Kusuma', 'Prostate adenocarcinoma, Gleason score 7', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev')),

-- Patient 5: Colorectal cancer
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500005'), (SELECT id FROM centers WHERE name = 'RS Dr Kariadi Semarang'), 'C18.9', 'adenocarcinoma', 'III', '2024-02-05', '{"colonoscopy", "biopsy", "CT scan"}', 'Dr. Sutanto Wibowo', 'Colon adenocarcinoma with lymph node involvement', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev')),

-- Patient 6: Stomach cancer
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500006'), (SELECT id FROM centers WHERE name = 'RS Kanker Cipto Mangunkusumo'), 'C16.9', 'adenocarcinoma', 'IV', '2024-01-12', '{"endoscopy", "biopsy", "CT scan"}', 'Dr. Ahmad Fauzi', 'Advanced gastric adenocarcinoma with distant metastasis', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev')),

-- Patient 7: Liver cancer
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500007'), (SELECT id FROM centers WHERE name = 'RS Sanglah Denpasar'), 'C22.9', 'hepatocellular', 'II', '2024-03-18', '{"ultrasound", "AFP test", "liver biopsy"}', 'Dr. Made Wijaya', 'Hepatocellular carcinoma, background cirrhosis', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev')),

-- Patient 8: Nasopharyngeal cancer
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500008'), (SELECT id FROM centers WHERE name = 'RS Wahidin Sudirohusodo Makassar'), 'C11.9', 'squamous_cell', 'III', '2024-02-15', '{"nasal endoscopy", "MRI", "biopsy"}', 'Dr. Muhammad Arif', 'Nasopharyngeal carcinoma, WHO type 3', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev')),

-- Patient 9: Ovarian cancer
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500009'), (SELECT id FROM centers WHERE name = 'RS Haji Adam Malik Medan'), 'C56.9', 'adenocarcinoma', 'II', '2024-01-25', '{"CA-125", "ultrasound", "surgery"}', 'Dr. Sarah Lubis', 'Serous ovarian carcinoma', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev')),

-- Patient 10: Pancreatic cancer
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500010'), (SELECT id FROM centers WHERE name = 'RS Abdul Wahab Sjahranie Samarinda'), 'C25.9', 'adenocarcinoma', 'IV', '2024-03-01', '{"CT scan", "ERCP", "biopsy"}', 'Dr. Bambang Prasetyo', 'Pancreatic adenocarcinoma, unresectable', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev'));

-- Insert sample treatment plans for the diagnosed patients
INSERT INTO treatment_plans (patient_id, diagnosis_id, center_id, plan_name, treatment_type, treatment_status, start_date, end_date, protocol, physician_name, notes, created_by) VALUES
-- Patient 1: Breast cancer treatment
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500001'),
 (SELECT id FROM diagnoses WHERE patient_id = (SELECT id FROM patients WHERE medical_record_number = 'MRN202500001')),
 (SELECT id FROM centers WHERE name = 'RS Kanker Dharmais'),
 'Neoadjuvant Chemotherapy', 'chemotherapy', 'completed', '2024-01-20', '2024-04-20', 'AC-T regimen (4 cycles)', 'Dr. Anita Wijaya', 'Good response to treatment', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev')),

-- Patient 2: Lung cancer treatment
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500002'),
 (SELECT id FROM diagnoses WHERE patient_id = (SELECT id FROM patients WHERE medical_record_number = 'MRN202500002')),
 (SELECT id FROM centers WHERE name = 'RS Hasan Sadikin Bandung'),
 'Palliative Chemotherapy', 'chemotherapy', 'ongoing', '2024-02-25', NULL, 'Carboplatin + Paclitaxel', 'Dr. Budi Hartono', 'Symptom control and quality of life focus', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev')),

-- Patient 3: Cervical cancer treatment
((SELECT id FROM patients WHERE medical_record_number = 'MRN202500003'),
 (SELECT id FROM diagnoses WHERE patient_id = (SELECT id FROM patients WHERE medical_record_number = 'MRN202500003')),
 (SELECT id FROM centers WHERE name = 'RS Dr Soetomo Surabaya'),
 'Concurrent Chemoradiation', 'radiation', 'planned', '2024-04-01', '2024-06-01', '45 Gy external beam + Brachytherapy', 'Dr. Ratna Sari', 'Definitive chemoradiation for early stage', (SELECT id FROM users WHERE email = 'dr.santoso@cancer.dev'));

-- Insert sample research requests
INSERT INTO research_requests (title, description, researcher_name, institution, email, phone, purpose, data_required, sample_size, inclusion_criteria, exclusion_criteria, methodology, expected_outcome, ethical_approval, status) VALUES
('Epidemiological Study of Breast Cancer in Indonesian Women', 'A comprehensive study analyzing the incidence, risk factors, and survival rates of breast cancer among Indonesian women aged 20-70 years.', 'Dr. Prasetyo Nugroho', 'Universitas Indonesia', 'prasetyo@ui.ac.id', '+6281122334455', 'To identify risk factors specific to Indonesian population and develop preventive strategies.', '{"patient_demographics", "diagnosis_details", "treatment_outcomes", "survival_data"}', 500, 'Female patients with confirmed breast cancer diagnosis between 2019-2023', 'Patients with incomplete medical records or lost to follow-up', 'Retrospective cohort study with multivariate analysis', 'Publication in international journal and development of national guidelines', true, 'approved'),

('Effectiveness of Immunotherapy in Advanced Lung Cancer', 'Study comparing the effectiveness and side effects of different immunotherapy regimens in advanced non-small cell lung cancer patients.', 'Dr. Sarah Wijaya', 'RS Kanker Dharmais', 'sarah@dharmais.co.id', '+6211234567890', 'To evaluate real-world effectiveness and identify factors predicting response to immunotherapy.', '{"patient_demographics", "cancer_stage", "treatment_regimens", "response_rates", "adverse_events", "survival_data"}', 200, 'Stage III/IV NSCLC patients treated with immunotherapy', 'Patients with autoimmune diseases or other active malignancies', 'Prospective observational study with biomarker analysis', 'Improved treatment selection criteria and outcome prediction', true, 'pending'),

('Quality of Life in Cancer Survivors', 'Assessment of quality of life, psychological wellbeing, and social support among cancer survivors who completed treatment more than 2 years ago.', 'Dr. Budi Santoso', 'Universitas Gadjah Mada', 'budi@ugm.ac.id', '+6276112345678', 'To understand long-term psychosocial impact and develop supportive care programs.', '{"patient_demographics", "diagnosis_history", "treatment_details", "follow_up_data", "quality_of_life_scores"}', 1000, 'Cancer survivors who completed treatment >2 years ago', 'Patients with recurrent disease or significant cognitive impairment', 'Cross-sectional survey with validated QoL instruments', 'Development of survivorship care program recommendations', false, 'rejected');

COMMIT;