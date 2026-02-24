import { createClient } from '@supabase/supabase-js';

// We intentionally do NOT use VITE_SUPABASE_URL here.
// Instead, we proxy the requests through our own domain (Vercel/Vite) 
// to bypass strict ISP firewalls (like Jio/Airtel) that block supabase.co domains.
const supabaseProxyUrl = `${window.location.origin}/supabase`;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseProxyUrl, supabaseKey);
