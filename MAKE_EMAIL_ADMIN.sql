-- ============================================================
-- CRYPTO GENIX — MAKE USER ADMIN
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Promote snipeking0936@gmail.com to admin
UPDATE public.users
SET role = 'admin'
WHERE email = 'snipeking0936@gmail.com';

-- Confirm it worked
SELECT id, email, name, role, account_balance, unique_user_id
FROM public.users
WHERE email = 'snipeking0936@gmail.com';
