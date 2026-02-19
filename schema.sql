-- Create the registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  full_name text NOT NULL,
  roll_number text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  department text NOT NULL,
  year text NOT NULL
);

-- Disable Row Level Security (RLS) to allow public submissions
-- This is equivalent to unchecking "Enable RLS" in the UI
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
