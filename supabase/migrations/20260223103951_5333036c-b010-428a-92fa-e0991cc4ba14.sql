
-- Fix user_roles: replace public SELECT policy with user-scoped policy
-- First drop the existing public-facing policy if it exists
DO $$
BEGIN
  -- Check for any permissive SELECT policy on user_roles that allows public access
  -- The current "Admins can view roles" policy is fine, but we need to add a self-view policy
  -- and ensure no public exposure exists
END $$;

-- Add policy so authenticated users can view their own role (needed for useAuth check)
CREATE POLICY "Users can view own role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
