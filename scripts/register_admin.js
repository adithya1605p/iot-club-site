import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glkaksrfoznewagmeusk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseKey) {
    console.error('Missing VITE_SUPABASE_KEY env variable.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function registerAdmin() {
    console.log('Registering admin user...');

    const email = '24r11a0535@gcet.edu.in';
    const password = 'iot@2026';
    const displayName = 'Head Admin';
    const rollNumber = '24R11A0535';
    const department = 'cse';

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                    roll_number: rollNumber,
                    department: department
                }
            }
        });

        if (error) {
            console.error('Error signing up:', error.message);
            return;
        }

        console.log('Admin user successfully registered:', data.user?.id);

        // Now wait a second for the trigger to fire, then promote to admin role
        setTimeout(async () => {
            console.log('Promoting to admin role...');
            const { error: roleError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', data.user.id);

            if (roleError) {
                console.error('Failed to promote user to admin:', roleError.message);
            } else {
                console.log('Successfully promoted to admin!');
            }
            process.exit(0);
        }, 2000);

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

registerAdmin();
