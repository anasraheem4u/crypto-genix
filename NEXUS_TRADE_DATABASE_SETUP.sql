-- Database Schema for Crypto Genix
-- Run this in your Supabase SQL Editor

-- Create public.users FIRST because it is referenced by other tables
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  name text,
  avatar_url text,
  account_balance numeric NOT NULL DEFAULT 1500,
  total_invested numeric NOT NULL DEFAULT 0,
  member_since timestamp without time zone NOT NULL DEFAULT now(),
  trading_level text NOT NULL DEFAULT 'Beginner'::text,
  role text NOT NULL DEFAULT 'client'::text CHECK (role = ANY (ARRAY['admin'::text, 'client'::text])),
  unique_user_id text UNIQUE,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  credit_score integer DEFAULT 100 CHECK (credit_score >= 0 AND credit_score <= 100),
  level integer DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  account_status text DEFAULT 'active'::text CHECK (account_status = ANY (ARRAY['active'::text, 'frozen'::text, 'blocked'::text])),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Independent Tables
CREATE TABLE public.market_state (
  symbol text NOT NULL,
  price numeric NOT NULL,
  trend text DEFAULT 'RANDOM'::text,
  last_updated timestamp with time zone DEFAULT now(),
  CONSTRAINT market_state_pkey PRIMARY KEY (symbol)
);

CREATE TABLE public.trade_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  duration_seconds integer NOT NULL UNIQUE,
  profit_percentage integer NOT NULL CHECK (profit_percentage >= 0 AND profit_percentage <= 100),
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT trade_settings_pkey PRIMARY KEY (id)
);

-- Tables referencing auth.users (can be created anytime, but grouping here)
CREATE TABLE public.admin_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  name text NOT NULL,
  requested_at timestamp with time zone DEFAULT now(),
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_requests_pkey PRIMARY KEY (id),
  CONSTRAINT admin_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT admin_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id)
);

CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  client_id uuid NOT NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id),
  CONSTRAINT audit_logs_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.users(id)
);

CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info'::text CHECK (type = ANY (ARRAY['info'::text, 'success'::text, 'warning'::text, 'error'::text])),
  from_admin boolean DEFAULT false,
  admin_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT notifications_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id)
);

-- Tables referencing public.users (MUST be created after public.users)
CREATE TABLE public.credit_transfers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  from_user_id uuid NOT NULL,
  to_user_id uuid NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT credit_transfers_pkey PRIMARY KEY (id),
  CONSTRAINT credit_transfers_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.users(id),
  CONSTRAINT credit_transfers_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.users(id)
);

CREATE TABLE public.portfolio_positions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  symbol text NOT NULL,
  quantity numeric NOT NULL CHECK (quantity > 0::numeric),
  average_price numeric NOT NULL CHECK (average_price > 0::numeric),
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT portfolio_positions_pkey PRIMARY KEY (id),
  CONSTRAINT portfolio_positions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.trade_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  symbol text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  duration integer NOT NULL CHECK (duration >= 60),
  start_time timestamp without time zone DEFAULT now(),
  end_time timestamp without time zone,
  status text DEFAULT 'PENDING'::text CHECK (status = ANY (ARRAY['PENDING'::text, 'WON'::text, 'LOST'::text])),
  outcome_override text CHECK (outcome_override = ANY (ARRAY['WIN'::text, 'LOSS'::text, NULL::text])),
  created_at timestamp without time zone DEFAULT now(),
  profit_percentage integer DEFAULT 80,
  trade_type text DEFAULT 'call'::text,
  CONSTRAINT trade_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT trade_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  symbol text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['buy'::text, 'sell'::text])),
  quantity numeric NOT NULL CHECK (quantity > 0::numeric),
  price numeric NOT NULL CHECK (price > 0::numeric),
  total_amount numeric NOT NULL CHECK (total_amount > 0::numeric),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.watchlist (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  symbol text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT watchlist_pkey PRIMARY KEY (id),
  CONSTRAINT watchlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.withdrawal_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  network text NOT NULL CHECK (network = ANY (ARRAY['ERC20'::text, 'TRC20'::text, 'BTC'::text])),
  wallet_address text NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  admin_reason text,
  processed_by uuid,
  processed_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT withdrawal_requests_pkey PRIMARY KEY (id),
  CONSTRAINT withdrawal_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT withdrawal_requests_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id)
);
