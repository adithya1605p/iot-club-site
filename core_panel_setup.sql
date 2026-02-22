-- Run this in the Supabase SQL Editor to prepare for the Core Panel

-- 1. Create Announcements table for meeting links & updates
CREATE TABLE public.announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  link text,
  created_at timestamptz default now(),
  created_by uuid references auth.users
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 2. Allow everyone to read announcements
CREATE POLICY "Announcements viewable by everyone" 
  ON public.announcements FOR SELECT 
  USING (true);

-- 3. Allow only 'core' members to insert announcements
CREATE POLICY "Core team can insert announcements" 
  ON public.announcements FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'core')
  );

-- 4. CRITCAL: Update the profiles UPDATE policy to allow 'core' members to edit OTHER people's roles
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Users can update own profile OR core can update anyone"
  ON public.profiles FOR UPDATE
  USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'core')
  );
