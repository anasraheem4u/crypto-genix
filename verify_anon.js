const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('URL:', supabaseUrl);
console.log('Anon Key (first 10 chars):', supabaseAnonKey ? supabaseAnonKey.substring(0, 10) : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing keys');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUserAnon() {
    const userId = '88b170f7-b3f1-4610-8bbb-2cffd7a5f4b2';
    console.log(`Checking user: ${userId} with ANON key`);

    const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('❌ Error fetching user with anon key:', error);
        if (error.code === 'PGRST116') {
            console.log('User not found or RLS policy prevents viewing.');
        }
    } else {
        console.log('✅ Success! User data:', data);
        console.log('Role:', data.role);
    }
}

checkUserAnon();
