-- INAMSOS Local Development Database
CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER REFERENCES hospitals(id),
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    diagnosis TEXT,
    treatment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample hospitals
INSERT OR IGNORE INTO hospitals (name, type, location) VALUES
('RS Kanker Dharmais', 'National Cancer Hospital', 'Jakarta'),
('RSUPN Cipto Mangunkusumo', 'Teaching Hospital', 'Jakarta'),
('RS Kanker Soeharto', 'Cancer Hospital', 'Surabaya');
