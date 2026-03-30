const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars manually since we're running a standalone script
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', supabaseUrl);
console.log('Service Key (first 10 chars):', supabaseServiceKey ? supabaseServiceKey.substring(0, 10) : 'MISSING');

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing keys');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUser() {
    const userId = '88b170f7-b3f1-4610-8bbb-2cffd7a5f4b2'; // The ID from your request
    console.log(`Checking user: ${userId}`);

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
    } else {
        console.log('User data:', data);
        console.log('Role:', data.role);
        if (data.role === 'admin') {
            console.log('✅ User IS admin in the database.');
        } else {
            console.log('❌ User is NOT admin. Current role:', data.role);
        }
    }
}

checkUser();
