-- Create super admin user with known credentials for auto-login
-- Email: admin@laundry.com
-- Password: Admin@123456

-- Note: This creates a user profile. You'll need to create the auth user in Supabase Auth manually
-- or through the signup process with these credentials.

-- Insert super admin user profile (this assumes the auth.users entry exists)
-- You can create the auth user by signing up with these credentials, or through Supabase dashboard

-- Create a function to handle super admin creation
CREATE OR REPLACE FUNCTION create_super_admin_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid := '00000000-0000-0000-0000-000000000999'::uuid;
  v_branch_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  -- Check if super admin profile exists
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE role = 'super_admin') THEN
    -- Insert super admin profile
    INSERT INTO user_profiles (id, email, full_name, role, branch_id, phone)
    VALUES (
      v_user_id,
      'admin@laundry.com',
      'Super Administrator',
      'super_admin',
      v_branch_id,
      '+234 800 000 0000'
    )
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Super admin profile created. Please create auth user with email: admin@laundry.com and password: Admin@123456';
  END IF;
END;
$$;

-- Execute the function
SELECT create_super_admin_if_not_exists();

-- Grant super admin appropriate permissions
COMMENT ON FUNCTION create_super_admin_if_not_exists IS 'Creates default super admin profile for initial system access';
