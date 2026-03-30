import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration error: Missing required environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !supabaseServiceKey) {
  console.warn('⚠️  Supabase service role key not set. Admin operations may not work.');
}

/**
 * Client-side Supabase client
 * Use this in React components and client-side code
 * Automatically handles authentication and RLS policies
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: { 'x-application-name': 'nexus-trade' },
  },
});

/**
 * Server-side Supabase client for API routes
 * Uses anon key for proper RLS policy enforcement
 * Use this in Next.js API routes
 */
export function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Admin Supabase client with service role key
 * Bypasses Row Level Security (RLS) policies
 * Use ONLY for admin operations or when RLS bypass is required
 * ⚠️  WARNING: Use with caution - this bypasses all security policies
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('Supabase URL is not configured (NEXT_PUBLIC_SUPABASE_URL)');
  }

  if (!key) {
    throw new Error('Supabase Service Role Key is not configured (SUPABASE_SERVICE_ROLE_KEY)');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Safely create admin client with fallback
 * Returns null if admin client cannot be created
 */
export function tryCreateAdminClient() {
  try {
    return createAdminClient();
  } catch (error) {
    // Only log distinct errors to avoid noise
    if (process.env.NODE_ENV !== 'test') {
      console.error('FAILED TO CREATE ADMIN CLIENT:', error instanceof Error ? error.message : String(error));
    }
    return null;
  }
}

// Export configuration for debugging (client-side only)
if (typeof window !== 'undefined') {
  (window as any).__SUPABASE_CONFIG__ = {
    url: supabaseUrl ? '✅ Configured' : '❌ Missing',
    anonKey: supabaseAnonKey ? '✅ Configured' : '❌ Missing',
    serviceKey: supabaseServiceKey ? '✅ Configured' : '⚠️  Optional',
  };
}

