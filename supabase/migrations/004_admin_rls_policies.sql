-- Migration: Admin RLS Policies
-- Description: Add RLS policies for admin users to manage all data and user balances
-- Created: 2025-10-18

-- Create a helper function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  -- Admin email: gmpfaraz@gmail.com
  -- You can add more admin emails to this list
  RETURN user_email = 'gmpfaraz@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PROFILES TABLE - Admin can read and update all profiles
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "admin_read_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_update_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_delete_profiles" ON public.profiles;

-- Admin can read all profiles (for user management)
CREATE POLICY "admin_read_all_profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    current_user_is_admin()
  );

-- Admin can update all profiles (for balance top-up, role changes, etc)
CREATE POLICY "admin_update_all_profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    current_user_is_admin()
  )
  WITH CHECK (
    current_user_is_admin()
  );

-- Admin can delete user profiles
CREATE POLICY "admin_delete_profiles"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (
    current_user_is_admin()
  );

-- ============================================================================
-- PROJECTS TABLE - Admin can access all projects
-- ============================================================================

DROP POLICY IF EXISTS "admin_read_all_projects" ON public.projects;
DROP POLICY IF EXISTS "admin_update_all_projects" ON public.projects;
DROP POLICY IF EXISTS "admin_delete_all_projects" ON public.projects;

-- Admin can read all projects
CREATE POLICY "admin_read_all_projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (
    current_user_is_admin()
  );

-- Admin can update all projects
CREATE POLICY "admin_update_all_projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (
    current_user_is_admin()
  )
  WITH CHECK (
    current_user_is_admin()
  );

-- Admin can delete all projects
CREATE POLICY "admin_delete_all_projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (
    current_user_is_admin()
  );

-- ============================================================================
-- TRANSACTIONS TABLE - Admin can access all transactions
-- ============================================================================

DROP POLICY IF EXISTS "admin_read_all_transactions" ON public.transactions;
DROP POLICY IF EXISTS "admin_update_all_transactions" ON public.transactions;
DROP POLICY IF EXISTS "admin_delete_all_transactions" ON public.transactions;

-- Admin can read all transactions
CREATE POLICY "admin_read_all_transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (
    current_user_is_admin()
  );

-- Admin can update all transactions
CREATE POLICY "admin_update_all_transactions"
  ON public.transactions
  FOR UPDATE
  TO authenticated
  USING (
    current_user_is_admin()
  )
  WITH CHECK (
    current_user_is_admin()
  );

-- Admin can delete all transactions
CREATE POLICY "admin_delete_all_transactions"
  ON public.transactions
  FOR DELETE
  TO authenticated
  USING (
    current_user_is_admin()
  );

-- ============================================================================
-- ACTION HISTORY TABLE - Admin can access all history
-- ============================================================================

DROP POLICY IF EXISTS "admin_read_all_history" ON public.action_history;

-- Admin can read all action history
CREATE POLICY "admin_read_all_history"
  ON public.action_history
  FOR SELECT
  TO authenticated
  USING (
    current_user_is_admin()
  );

-- ============================================================================
-- FILTER PRESETS TABLE - Admin can access all presets
-- ============================================================================

DROP POLICY IF EXISTS "admin_read_all_presets" ON public.filter_presets;

-- Admin can read all filter presets
CREATE POLICY "admin_read_all_presets"
  ON public.filter_presets
  FOR SELECT
  TO authenticated
  USING (
    current_user_is_admin()
  );

-- ============================================================================
-- USER PREFERENCES TABLE - Admin can access all preferences
-- ============================================================================

DROP POLICY IF EXISTS "admin_read_all_preferences" ON public.user_preferences;

-- Admin can read all user preferences
CREATE POLICY "admin_read_all_preferences"
  ON public.user_preferences
  FOR SELECT
  TO authenticated
  USING (
    current_user_is_admin()
  );

-- Add comment
COMMENT ON FUNCTION public.is_admin IS 'Checks if a given email is an admin email';
COMMENT ON FUNCTION public.current_user_is_admin IS 'Checks if the current authenticated user has admin role';

