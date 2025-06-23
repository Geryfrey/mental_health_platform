-- If the appointments table has not been created yet, create it.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                 WHERE table_schema = 'public'
                   AND table_name   = 'appointments') THEN
    CREATE TABLE public.appointments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      student_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      professional_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending' 
             CHECK (status IN ('pending','confirmed','cancelled','completed')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- If the table exists but the columns do not, add them.
DO $$
BEGIN
  IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='appointments' AND column_name='appointment_date'
     ) THEN
       ALTER TABLE public.appointments
       ADD COLUMN appointment_date DATE NOT NULL DEFAULT CURRENT_DATE;
  END IF;

  IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='appointments' AND column_name='appointment_time'
     ) THEN
       ALTER TABLE public.appointments
       ADD COLUMN appointment_time TIME NOT NULL DEFAULT NOW()::time;
  END IF;
END $$;

-- Add helpful indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_appointments_student    ON public.appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_appointments_prof       ON public.appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status     ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date       ON public.appointments(appointment_date);
