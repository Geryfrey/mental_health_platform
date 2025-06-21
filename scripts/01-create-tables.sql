-- Create tables for SWAP platform

-- Users table (students, professionals, admins)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  registration_number VARCHAR(50) UNIQUE, -- For students
  password VARCHAR(255) NOT NULL,  -- Changed from password_hash to password
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'professional', 'admin')),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mental health professionals/clinics
CREATE TABLE IF NOT EXISTS professionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  clinic_name VARCHAR(255),
  specialization VARCHAR(255),
  license_number VARCHAR(100),
  address TEXT,
  district VARCHAR(100),
  province VARCHAR(100),
  availability_hours JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student assessments
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text_content TEXT NOT NULL,
  ai_analysis JSONB, -- Store AI response
  detected_conditions TEXT[],
  sentiment VARCHAR(50),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
  wellness_score INTEGER CHECK (wellness_score >= 0 AND wellness_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT NOT NULL,
  mood VARCHAR(50),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mental health resources (articles, blogs)
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  url VARCHAR(500),
  resource_type VARCHAR(50) DEFAULT 'article',
  conditions TEXT[], -- Tags for conditions this resource helps with
  author VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_registration ON users(registration_number);
CREATE INDEX IF NOT EXISTS idx_assessments_student ON assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_assessments_risk ON assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_journal_student ON journal_entries(student_id);
CREATE INDEX IF NOT EXISTS idx_appointments_student ON appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional ON appointments(professional_id);
