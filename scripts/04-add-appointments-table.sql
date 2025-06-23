-- Create appointments table for booking system
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    confirmed_date DATE,
    confirmed_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_student_id ON appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);

-- Add RLS policies for appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Students can view their own appointments
CREATE POLICY "Students can view own appointments" ON appointments
    FOR SELECT USING (student_id = auth.uid());

-- Students can create appointments
CREATE POLICY "Students can create appointments" ON appointments
    FOR INSERT WITH CHECK (student_id = auth.uid());

-- Professionals can view appointments for them
CREATE POLICY "Professionals can view their appointments" ON appointments
    FOR SELECT USING (professional_id = auth.uid());

-- Professionals can update their appointments
CREATE POLICY "Professionals can update their appointments" ON appointments
    FOR UPDATE USING (professional_id = auth.uid());
