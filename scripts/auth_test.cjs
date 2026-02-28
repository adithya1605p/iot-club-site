// Auth diagnostic — run with: node scripts/auth_test.cjs
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://glkaksrfoznewagmeusk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsa2Frc3Jmb3puZXdhZ21ldXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDk3MTksImV4cCI6MjA4NzA4NTcxOX0.BShNaOeAT_zq-asB30WJYydAw3S2hPdYAOFLwquG7WY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const TEST_EMAIL = `authtest_${Date.now()}@gcet.edu.in`;
const TEST_PASS = 'TestPass123!';

async function run() {
    console.log('\n=== SUPABASE AUTH DIAGNOSTIC ===');
    console.log('Test email:', TEST_EMAIL);

    // 1. Register
    console.log('\n[1] REGISTERING...');
    const { data: sd, error: se } = await supabase.auth.signUp({
        email: TEST_EMAIL, password: TEST_PASS,
        options: { data: { display_name: 'Test User', roll_number: '24T99Z0001', department: 'CSE' } }
    });
    if (se) { console.error('SIGNUP ERR:', se.message, se.code); return; }
    console.log('   user id:', sd?.user?.id);
    console.log('   email_confirmed_at:', sd?.user?.email_confirmed_at ?? 'null — CONFIRMATION REQUIRED');
    console.log('   session after signup:', sd?.session ? 'YES (auto-login ok)' : 'NO (email confirm needed)');

    // 2. Login immediately
    console.log('\n[2] LOGGING IN immediately...');
    const { data: ld, error: le } = await supabase.auth.signInWithPassword({
        email: TEST_EMAIL, password: TEST_PASS
    });
    if (le) {
        console.error('LOGIN ERR:', le.message, '| code:', le.code);
        if (le.message.toLowerCase().includes('invalid') || le.message.toLowerCase().includes('credentials')) {
            console.log('\n💡 ROOT CAUSE: Email confirmation is ENABLED in Supabase.');
            console.log('   FIX: Supabase Dashboard → Authentication → Providers → Email');
            console.log('        Turn OFF "Confirm email" and Save.');
        }
    } else {
        console.log('LOGIN OK ✅ — user:', ld?.user?.email);
        await supabase.auth.signOut();
    }
    console.log('\n================================\n');
}
run().catch(e => console.error('Fatal:', e));
