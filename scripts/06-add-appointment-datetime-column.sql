-- Add appointment_at (TIMESTAMPTZ) if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'appointments' AND column_name = 'appointment_at'
  ) THEN
    ALTER TABLE public.appointments
      ADD COLUMN appointment_at TIMESTAMPTZ NOT NULL 
      DEFAULT NOW();           -- temporary default, safe for ALTER
  END IF;
END $$;

-- Optional: drop the old appointment_time column if it exists
DO $$
BEGIN
  IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'appointments' AND column_name = 'appointment_time'
  ) THEN
    ALTER TABLE public.appointments
      DROP COLUMN appointment_time;
  END IF;
END $$;

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_appointments_at 
  ON public.appointments(appointment_at);
