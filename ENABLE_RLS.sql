-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- DROP EXISTING POLICIES TO AVOID CONFLICTS
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Market state is public" ON public.market_state;
DROP POLICY IF EXISTS "Trade settings are public" ON public.trade_settings;
DROP POLICY IF EXISTS "Users can manage own admin requests" ON public.admin_requests;
DROP POLICY IF EXISTS "Admins can manage all requests" ON public.admin_requests;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users view own portfolio" ON public.portfolio_positions;
DROP POLICY IF EXISTS "Users view own sessions" ON public.trade_sessions;
DROP POLICY IF EXISTS "Users create own sessions" ON public.trade_sessions;
DROP POLICY IF EXISTS "Users view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users manage own watchlist" ON public.watchlist;
DROP POLICY IF EXISTS "Users manage own withdrawals" ON public.withdrawal_requests;
DROP POLICY IF EXISTS "Users view own transfers" ON public.credit_transfers;

-- RECREATE POLICIES

-- 1. USERS Table
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. MARKET_STATE (Public Read, Admin Write)
CREATE POLICY "Market state is public" ON public.market_state
  FOR SELECT USING (true);

-- 3. TRADE_SETTINGS (Public Read, Admin Write)
CREATE POLICY "Trade settings are public" ON public.trade_settings
  FOR SELECT USING (true);

-- 4. ADMIN_REQUESTS
-- Users can view/create their own requests
CREATE POLICY "Users can manage own admin requests" ON public.admin_requests
  FOR ALL USING (user_id = auth.uid());

-- Admins can view/manage all requests
CREATE POLICY "Admins can manage all requests" ON public.admin_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. AUDIT_LOGS (Admin Only)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. PRIVATE USER DATA TABLES
-- (notifications, portfolio_positions, trade_sessions, transactions, watchlist, withdrawal_requests, credit_transfers)

-- Generic policy for tables where user owns the row via 'user_id'
-- Notifications
CREATE POLICY "Users manage own notifications" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

-- Portfolio Positions
CREATE POLICY "Users view own portfolio" ON public.portfolio_positions
  FOR SELECT USING (user_id = auth.uid());

-- Trade Sessions
CREATE POLICY "Users view own sessions" ON public.trade_sessions
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users create own sessions" ON public.trade_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Transactions
CREATE POLICY "Users view own transactions" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

-- Watchlist
CREATE POLICY "Users manage own watchlist" ON public.watchlist
  FOR ALL USING (user_id = auth.uid());

-- Withdrawal Requests
CREATE POLICY "Users manage own withdrawals" ON public.withdrawal_requests
  FOR ALL USING (user_id = auth.uid());

-- Credit Transfers (involves from_user_id and to_user_id)
CREATE POLICY "Users view own transfers" ON public.credit_transfers
  FOR SELECT USING (from_user_id = auth.uid() OR to_user_id = auth.uid());
