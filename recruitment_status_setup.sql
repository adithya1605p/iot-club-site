-- RUN THIS IN SUPABASE SQL EDITOR TO ADD APPLICANT STATUS

-- 1. Add status column to the registrations table
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- 2. Allow Core team to update registrations (previously we didn't have a policy for this)
-- Since we are doing it via the client, we need an RLS policy if RLS is enabled on registrations.
-- Assuming registrations RLS is either disabled or we need an update policy:
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow insert for anyone (for the registration form)
CREATE POLICY "Anyone can insert registrations"
ON public.registrations FOR INSERT
WITH CHECK (true);

-- Allow reading for everyone (or just core, but let's keep it simple for now)
CREATE POLICY "Registrations viewable by everyone"
ON public.registrations FOR SELECT
USING (true);

-- Allow UPDATE for core members only
CREATE POLICY "Core can update registrations"
ON public.registrations FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'core')
);
