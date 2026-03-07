import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glkaksrfoznewagmeusk.supabase.co';
// WARNING: Service role key is required for admin.deleteUser()
// Since we don't have it in .env, we will just use anon key to try to sign up again 
// and intercept the error. If we can't delete it, we'll instruct the user.

const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseKey) {
    console.error('Missing VITE_SUPABASE_KEY env variable.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceCreateAdmin() {
    const email = '24r11a0535@gcet.edu.in';
    const password = 'iot@2026';

    try {
        // Wait, maybe we can just sign in with the *correct* password if they made it already?
        // We just tried that and it failed. 
        // Let's check if the Admin emails list in Auth.jsx even matters. 
        // We actually just set an array in Auth.jsx but didn't assign the "admin" role to existing users.
        console.log("Since we lack the SERVICE_ROLE_KEY, we cannot programmatically delete the user from Auth.");
        console.log("Please delete the user '24r11a0535@gcet.edu.in' manually in the Supabase Dashboard -> Authentication -> Users.");
        console.log("Then you can register them normally on the site, and the AdminDashboard.jsx role promotion will work.");
    } catch (e) {
        console.error(e);
    }
}

forceCreateAdmin();
