-- NUKE CODES: REVERT ALL PHASE 2 CHANGES
-- Run this script ONLY if you want to wipe the Authentication & Dashboard changes
-- and return to the original Phase 1 state (just the 'registrations' table).

-- 1. DROP THE NEW TABLES
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. NOTE ON AUTH.USERS
-- The Supabase 'auth.users' table is built-in and manages passwords/emails.
-- If you want to wipe all user logins too, run this command to clear them out.
-- (Warning: This deletes ALL login credentials)
DELETE FROM auth.users;

-- 3. RESET REGISTRATIONS TABLE (OPTIONAL)
-- If you also want to delete all test registrations you made during testing:
-- DELETE FROM public.registrations;

-- After running this, your database is back to original.
-- (You would also need to revert the React code changes via Git)
