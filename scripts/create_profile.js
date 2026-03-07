import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glkaksrfoznewagmeusk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseKey) {
    console.error('Missing VITE_SUPABASE_KEY env variable.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProfileAndPromote() {
    console.log('Finding user by email in auth...');
    const email = '24r11a0535@gcet.edu.in';

    try {
        // Create profile row manually since trigger might not have run or failed
        const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
        if (authError && authError.status !== 403) { // 403 means anon key can't use admin API, which is expected
            // Let's just try inserting the profile since we can't search auth directly with anon key
        }

        // Let's assume the user IS in auth and we just need to create the profile.
        // But we need the auth.user ID to create the profile.
        console.log('Trying to sign in to get auth ID...');
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: 'iot@2026'
        });

        if (error) {
            console.error("Sign in failed. Are the credentials correct? Error:", error.message);
            return;
        }

        const userId = data.user.id;
        console.log('Successfully signed in. User ID is:', userId);

        console.log('Creating or updating profile...');
        const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email: email,
                display_name: 'Head Admin',
                roll_number: '24R11A0535',
                department: 'cse',
                role: 'admin' // Force promote
            });

        if (upsertError) {
            console.error('Upsert profile failed:', upsertError.message);
            return;
        }

        console.log('Successfully created profile and promoted to Admin!');

    } catch (e) {
        console.error(e);
    }
}

createProfileAndPromote();
