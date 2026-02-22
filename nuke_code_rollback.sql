-- ROLLBACK PHASE 2 SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR TO DROP ALL TABLES CREATED FOR THE ADMIN AND QUIZ FEATURES

-- 1. Drop the Quiz related tables
DROP TABLE IF EXISTS public.quiz_attempts CASCADE;
DROP TABLE IF EXISTS public.quiz_questions CASCADE;

-- 2. Drop the Announcements table
DROP TABLE IF EXISTS public.announcements CASCADE;

-- 3. Drop the Profiles table (used for Role Based Access Control)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 4. Revert any role-based policies on registrations (if you want to completely clear them)
-- This drops the table and re-creates it if you want to nuke the dummy registrations too.
-- If you just want to keep the registrations but remove the new columns:
-- ALTER TABLE public.registrations DROP COLUMN IF EXISTS status;

-- NOTE: If you added a trigger for profiles on auth.users, you should remove it.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- If you are starting completely fresh with the old version, this script removes the new components.
