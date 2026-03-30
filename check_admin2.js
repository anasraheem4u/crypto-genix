const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars manually
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing key/url');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAdmin2() {
    const email = 'admin2@obrixlabs.com';
    console.log(`Checking role for: ${email}`);

    // 1. Check if user exists in public.users
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return;
    }

    if (!user) {
        console.log('User not found in public.users table!');
        return;
    }

    console.log('User found:', {
        id: user.id,
        email: user.email,
        role: user.role
    });

    if (user.role === 'admin') {
        console.log('✅ User IS admin.');
    } else {
        console.log('❌ User is NOT admin.');

        // Fix it automatically
        console.log('Attempting to fix...');
        const { error: updateError } = await supabase
            .from('users')
            .update({ role: 'admin' })
            .eq('id', user.id);

        if (updateError) {
            console.error('Failed to update role:', updateError);
        } else {
            console.log('✅ User role updated to admin successfully!');
        }
    }
}

checkAdmin2();
