-- ============================================================
-- CRYPTO GENIX — ADD USERS VIA SQL
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor
--
-- HOW IT WORKS:
--   1. Inserts into auth.users with bcrypt-hashed passwords
--   2. The trigger handle_new_user auto-creates public.users
--   3. Safety net syncs any missed public.users records
--   4. Sets balances and promotes admins
--
-- FIX: Uses IF NOT EXISTS instead of ON CONFLICT (email)
--      because auth.users constraint name is not public.
-- ============================================================


-- ============================================================
-- STEP 1: INSERT USERS INTO auth.users
-- ============================================================

DO $$
DECLARE
  v_user1_id UUID := gen_random_uuid();
  v_user2_id UUID := gen_random_uuid();
  v_user3_id UUID := gen_random_uuid();
  v_user4_id UUID := gen_random_uuid();
  v_user5_id UUID := gen_random_uuid();
  v_user6_id UUID := gen_random_uuid(); -- snipeking0936 (admin)
BEGIN

  -- ── USER 1: Alice ──────────────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'alice@cryptogenix.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      v_user1_id,
      '00000000-0000-0000-0000-000000000000',
      'alice@cryptogenix.com',
      crypt('Password123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Alice Johnson"}',
      false, 'authenticated', 'authenticated',
      '', '', '', ''
    );
  END IF;

  -- ── USER 2: Bob ────────────────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'bob@cryptogenix.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      v_user2_id,
      '00000000-0000-0000-0000-000000000000',
      'bob@cryptogenix.com',
      crypt('Password123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Bob Smith"}',
      false, 'authenticated', 'authenticated',
      '', '', '', ''
    );
  END IF;

  -- ── USER 3: Platform Admin ─────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@cryptogenix.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      v_user3_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@cryptogenix.com',
      crypt('Admin@Secure99!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Platform Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', ''
    );
  END IF;

  -- ── USER 4: Charlie ────────────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'charlie@cryptogenix.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      v_user4_id,
      '00000000-0000-0000-0000-000000000000',
      'charlie@cryptogenix.com',
      crypt('Password123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Charlie Davis"}',
      false, 'authenticated', 'authenticated',
      '', '', '', ''
    );
  END IF;

  -- ── USER 5: Diana ──────────────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'diana@cryptogenix.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      v_user5_id,
      '00000000-0000-0000-0000-000000000000',
      'diana@cryptogenix.com',
      crypt('Password123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Diana Prince"}',
      false, 'authenticated', 'authenticated',
      '', '', '', ''
    );
  END IF;

  -- ── USER 6: Snipe King (ADMIN) ─────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'snipeking0936@gmail.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      v_user6_id,
      '00000000-0000-0000-0000-000000000000',
      'snipeking0936@gmail.com',
      crypt('Admin@Secure99!', gen_salt('bf')), -- ← change if needed
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Snipe King"}',
      false, 'authenticated', 'authenticated',
      '', '', '', ''
    );
  END IF;

END $$;


-- ============================================================
-- STEP 2: SAFETY NET — sync public.users for any missed rows
-- ============================================================
-- The trigger normally handles this automatically.
-- This catches any users the trigger may have missed.
-- ============================================================

INSERT INTO public.users (
  id, email, name, account_balance, total_invested,
  trading_level, member_since, unique_user_id, role
)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  1500,
  0,
  'Beginner',
  NOW(),
  'USER' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0'),
  'client'
FROM auth.users au
WHERE au.email IN (
  'alice@cryptogenix.com',
  'bob@cryptogenix.com',
  'admin@cryptogenix.com',
  'charlie@cryptogenix.com',
  'diana@cryptogenix.com',
  'snipeking0936@gmail.com'
)
AND NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- STEP 3: SET CUSTOM BALANCES
-- ============================================================

UPDATE public.users SET account_balance = 5000  WHERE email = 'alice@cryptogenix.com';
UPDATE public.users SET account_balance = 2500  WHERE email = 'bob@cryptogenix.com';
UPDATE public.users SET account_balance = 99999 WHERE email = 'admin@cryptogenix.com';
UPDATE public.users SET account_balance = 1500  WHERE email = 'charlie@cryptogenix.com';
UPDATE public.users SET account_balance = 10000 WHERE email = 'diana@cryptogenix.com';
UPDATE public.users SET account_balance = 99999 WHERE email = 'snipeking0936@gmail.com';


-- ============================================================
-- STEP 4: PROMOTE ADMINS
-- ============================================================

UPDATE public.users
SET role = 'admin'
WHERE email IN (
  'admin@cryptogenix.com',
  'snipeking0936@gmail.com'
);


-- ============================================================
-- STEP 5: VERIFY
-- ============================================================

SELECT
  pu.email,
  pu.name,
  pu.role,
  pu.account_balance,
  pu.unique_user_id,
  pu.account_status,
  au.email_confirmed_at IS NOT NULL AS email_verified
FROM public.users pu
JOIN auth.users au ON au.id = pu.id
WHERE pu.email IN (
  'alice@cryptogenix.com',
  'bob@cryptogenix.com',
  'admin@cryptogenix.com',
  'charlie@cryptogenix.com',
  'diana@cryptogenix.com',
  'snipeking0936@gmail.com'
)
ORDER BY pu.role DESC, pu.email;
