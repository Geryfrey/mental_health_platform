-- Create appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    appointment_at TIMESTAMPTZ NOT NULL,
    notes TEXT DEFAULT '',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_student_id ON public.appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON public.appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_appointment_at ON public.appointments(appointment_at);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY IF NOT EXISTS "Students can view their own appointments" ON public.appointments
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Students can create their own appointments" ON public.appointments
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Professionals can view their appointments" ON public.appointments
    FOR SELECT USING (professional_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Professionals can update their appointments" ON public.appointments
    FOR UPDATE USING (professional_id = auth.uid());

-- Allow anonymous access for demo purposes (you may want to restrict this in production)
CREATE POLICY IF NOT EXISTS "Allow anonymous appointment creation" ON public.appointments
    FOR ALL USING (true);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_appointments_updated_at 
    BEFORE UPDATE ON public.appointments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
