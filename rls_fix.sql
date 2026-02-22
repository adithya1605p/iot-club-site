-- RLS FIX SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR TO RESTORE ADMIN PANEL DELETIONS

-- During Phase 2, we enabled Row Level Security (RLS) on the registrations table to secure it for authenticated users.
-- Now that we rolled back to the pre-auth version, the admin panel needs anonymous access to delete again.
-- This script disables RLS so the admin panel can function normally.

ALTER TABLE public.registrations DISABLE ROW LEVEL SECURITY;
