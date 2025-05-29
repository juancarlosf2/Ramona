-- Row Level Security (RLS) Policies for Multi-Tenant Architecture
-- This file sets up comprehensive RLS policies to ensure data isolation by dealer

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE concesionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's dealer_id from profiles table
CREATE OR REPLACE FUNCTION get_user_dealer_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT dealer_id FROM profiles WHERE id = auth.uid();
$$;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role = 'admin' FROM profiles WHERE id = auth.uid();
$$;

-- =============================================================================
-- PROFILES TABLE POLICIES
-- =============================================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Users can update their own profile (but not change dealer_id or role)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND 
    dealer_id = (SELECT dealer_id FROM profiles WHERE id = auth.uid()) AND
    role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- Admins can read all profiles in their dealer
CREATE POLICY "Admins can read dealer profiles" ON profiles
  FOR SELECT USING (
    is_user_admin() AND 
    dealer_id = get_user_dealer_id()
  );

-- Only service role can insert profiles (managed by app)
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- =============================================================================
-- DEALERS TABLE POLICIES
-- =============================================================================

-- Users can read their own dealer information
CREATE POLICY "Users can read own dealer" ON dealers
  FOR SELECT USING (id = get_user_dealer_id());

-- Admins can update their own dealer information
CREATE POLICY "Admins can update own dealer" ON dealers
  FOR UPDATE USING (
    is_user_admin() AND 
    id = get_user_dealer_id()
  );

-- Only service role can insert/delete dealers (managed by app)
CREATE POLICY "Service role can manage dealers" ON dealers
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================================================
-- CONCESIONARIOS TABLE POLICIES
-- =============================================================================

-- Users can read concesionarios in their dealer
CREATE POLICY "Users can read dealer concesionarios" ON concesionarios
  FOR SELECT USING (dealer_id = get_user_dealer_id());

-- Admins can manage concesionarios in their dealer
CREATE POLICY "Admins can manage dealer concesionarios" ON concesionarios
  FOR ALL USING (
    is_user_admin() AND 
    dealer_id = get_user_dealer_id()
  );

-- Regular users cannot modify concesionarios
CREATE POLICY "Regular users cannot modify concesionarios" ON concesionarios
  FOR INSERT WITH CHECK (false);

CREATE POLICY "Regular users cannot update concesionarios" ON concesionarios
  FOR UPDATE USING (false);

CREATE POLICY "Regular users cannot delete concesionarios" ON concesionarios
  FOR DELETE USING (false);

-- =============================================================================
-- VEHICLES TABLE POLICIES
-- =============================================================================

-- Users can read vehicles in their dealer
CREATE POLICY "Users can read dealer vehicles" ON vehicles
  FOR SELECT USING (dealer_id = get_user_dealer_id());

-- Users can insert vehicles in their dealer
CREATE POLICY "Users can insert dealer vehicles" ON vehicles
  FOR INSERT WITH CHECK (dealer_id = get_user_dealer_id());

-- Users can update vehicles in their dealer
CREATE POLICY "Users can update dealer vehicles" ON vehicles
  FOR UPDATE USING (dealer_id = get_user_dealer_id())
  WITH CHECK (dealer_id = get_user_dealer_id());

-- Only admins can delete vehicles
CREATE POLICY "Admins can delete dealer vehicles" ON vehicles
  FOR DELETE USING (
    is_user_admin() AND 
    dealer_id = get_user_dealer_id()
  );

-- =============================================================================
-- CLIENTS TABLE POLICIES
-- =============================================================================

-- Users can read clients in their dealer
CREATE POLICY "Users can read dealer clients" ON clients
  FOR SELECT USING (dealer_id = get_user_dealer_id());

-- Users can insert clients in their dealer
CREATE POLICY "Users can insert dealer clients" ON clients
  FOR INSERT WITH CHECK (dealer_id = get_user_dealer_id());

-- Users can update clients in their dealer
CREATE POLICY "Users can update dealer clients" ON clients
  FOR UPDATE USING (dealer_id = get_user_dealer_id())
  WITH CHECK (dealer_id = get_user_dealer_id());

-- Only admins can delete clients
CREATE POLICY "Admins can delete dealer clients" ON clients
  FOR DELETE USING (
    is_user_admin() AND 
    dealer_id = get_user_dealer_id()
  );

-- =============================================================================
-- CONTRACTS TABLE POLICIES
-- =============================================================================

-- Users can read contracts in their dealer
CREATE POLICY "Users can read dealer contracts" ON contracts
  FOR SELECT USING (dealer_id = get_user_dealer_id());

-- Users can insert contracts in their dealer
CREATE POLICY "Users can insert dealer contracts" ON contracts
  FOR INSERT WITH CHECK (
    dealer_id = get_user_dealer_id() AND
    -- Ensure client and vehicle belong to same dealer
    EXISTS (SELECT 1 FROM clients WHERE id = client_id AND dealer_id = get_user_dealer_id()) AND
    EXISTS (SELECT 1 FROM vehicles WHERE id = vehicle_id AND dealer_id = get_user_dealer_id())
  );

-- Users can update contracts in their dealer
CREATE POLICY "Users can update dealer contracts" ON contracts
  FOR UPDATE USING (dealer_id = get_user_dealer_id())
  WITH CHECK (
    dealer_id = get_user_dealer_id() AND
    -- Ensure client and vehicle still belong to same dealer
    EXISTS (SELECT 1 FROM clients WHERE id = client_id AND dealer_id = get_user_dealer_id()) AND
    EXISTS (SELECT 1 FROM vehicles WHERE id = vehicle_id AND dealer_id = get_user_dealer_id())
  );

-- Only admins can delete contracts
CREATE POLICY "Admins can delete dealer contracts" ON contracts
  FOR DELETE USING (
    is_user_admin() AND 
    dealer_id = get_user_dealer_id()
  );

-- =============================================================================
-- INSURANCE TABLE POLICIES
-- =============================================================================

-- Users can read insurance in their dealer
CREATE POLICY "Users can read dealer insurance" ON insurance
  FOR SELECT USING (dealer_id = get_user_dealer_id());

-- Users can insert insurance in their dealer
CREATE POLICY "Users can insert dealer insurance" ON insurance
  FOR INSERT WITH CHECK (
    dealer_id = get_user_dealer_id() AND
    -- Ensure vehicle belongs to same dealer
    EXISTS (SELECT 1 FROM vehicles WHERE id = vehicle_id AND dealer_id = get_user_dealer_id()) AND
    -- If client_id is provided, ensure it belongs to same dealer
    (client_id IS NULL OR EXISTS (SELECT 1 FROM clients WHERE id = client_id AND dealer_id = get_user_dealer_id())) AND
    -- If contract_id is provided, ensure it belongs to same dealer
    (contract_id IS NULL OR EXISTS (SELECT 1 FROM contracts WHERE id = contract_id AND dealer_id = get_user_dealer_id()))
  );

-- Users can update insurance in their dealer
CREATE POLICY "Users can update dealer insurance" ON insurance
  FOR UPDATE USING (dealer_id = get_user_dealer_id())
  WITH CHECK (
    dealer_id = get_user_dealer_id() AND
    -- Ensure related entities still belong to same dealer
    EXISTS (SELECT 1 FROM vehicles WHERE id = vehicle_id AND dealer_id = get_user_dealer_id()) AND
    (client_id IS NULL OR EXISTS (SELECT 1 FROM clients WHERE id = client_id AND dealer_id = get_user_dealer_id())) AND
    (contract_id IS NULL OR EXISTS (SELECT 1 FROM contracts WHERE id = contract_id AND dealer_id = get_user_dealer_id()))
  );

-- Only admins can delete insurance
CREATE POLICY "Admins can delete dealer insurance" ON insurance
  FOR DELETE USING (
    is_user_admin() AND 
    dealer_id = get_user_dealer_id()
  );

-- =============================================================================
-- SECURITY NOTES
-- =============================================================================

-- IMPORTANT SECURITY CONSIDERATIONS:
-- 1. The auth.users table is managed by Supabase and has its own RLS
-- 2. All policies ensure data isolation by dealer_id
-- 3. Regular users can read/write data in their dealer but cannot delete
-- 4. Only admins can delete records and manage concesionarios
-- 5. Cross-table references are validated to prevent data leaks
-- 6. The service role can bypass RLS for administrative tasks

-- =============================================================================
-- TESTING QUERIES (Run these to verify RLS is working)
-- =============================================================================

/*
-- Test as authenticated user (replace with actual user ID):

-- 1. Test profile access
SELECT * FROM profiles; -- Should only return current user's profile

-- 2. Test dealer data isolation
SELECT * FROM vehicles; -- Should only return vehicles for user's dealer

-- 3. Test admin privileges (if user is admin)
DELETE FROM vehicles WHERE id = 'some-test-id'; -- Should work for admins only

-- 4. Test cross-dealer access prevention
INSERT INTO contracts (client_id, vehicle_id, dealer_id, ...)
VALUES ('client-from-other-dealer', 'vehicle-from-this-dealer', ...);
-- Should fail due to RLS policy validation

*/
