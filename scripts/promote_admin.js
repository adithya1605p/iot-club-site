import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glkaksrfoznewagmeusk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseKey) {
    console.error('Missing VITE_SUPABASE_KEY env variable.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function promoteAdmin() {
    console.log('Finding user...');
    const email = '24r11a0535@gcet.edu.in';

    try {
        // First find the user's ID
        const { data: profiles, error: findError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email);

        if (findError || !profiles || profiles.length === 0) {
            console.error('Could not find user in profiles table. Ensure they have signed in at least once or verified their email.', findError);
            return;
        }

        const userId = profiles[0].id;
        console.log('User found with ID:', userId);

        console.log('Promoting to admin role...');
        const { error: roleError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);

        if (roleError) {
            console.error('Failed to promote user to admin:', roleError.message);
        } else {
            console.log('Successfully promoted to admin!');
        }

    } catch (e) {
        console.error(e);
    }
}

promoteAdmin();
