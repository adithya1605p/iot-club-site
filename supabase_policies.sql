-- Run this in the Supabase SQL Editor to fix the profiles table and add roles!

-- 1. Add 'role' column (default is 'tinkerer')
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'tinkerer';

-- 2. Allow users to read all profiles (so the admin panel works)
CREATE POLICY "Profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

-- 3. Allow users to insert their *own* profile when they sign up
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- 4. Allow users to update their own profile
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );
