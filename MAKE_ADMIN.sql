-- Make user an Admin
UPDATE public.users
SET role = 'admin'
WHERE id = '88b170f7-b3f1-4610-8bbb-2cffd7a5f4b2';

-- Approve the request (optional, but keeps records clean)
UPDATE public.admin_requests
SET status = 'approved',
    reviewed_at = now()
WHERE id = 'f265cba1-4d77-4688-8623-008003c6dfed';
