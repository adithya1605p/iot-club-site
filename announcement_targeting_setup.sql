-- RUN THIS IN SUPABASE SQL EDITOR TO ADD TARGETED ANNOUNCEMENTS

-- 1. Add target_audience column to announcements table
-- Default is 'all' so existing announcements are seen by everyone
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS target_audience text DEFAULT 'all';

-- Possible values for target_audience:
-- 'all' - everyone sees it
-- 'pending' - only people with pending registration status
-- 'shortlisted' - only people who are shortlisted for round 2
-- 'selected' - only people who are selected
-- 'member' - only people with role = 'member'
-- 'core' - only people with role = 'core'
