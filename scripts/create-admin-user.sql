-- Create Admin User Profile Script
-- This script creates an admin user profile that can be linked to a Supabase Auth user

-- First, let's see what dealers are available
SELECT id, name FROM dealers;

-- Create a profile for an admin user
-- Replace 'YOUR_AUTH_USER_ID' with the actual auth.users.id from Supabase Auth
-- Replace 'DEALER_ID' with one of the dealer IDs from the query above

/*
Example usage:
1. Sign up a user through your app's auth system
2. Get the user ID from Supabase Auth dashboard
3. Replace 'YOUR_AUTH_USER_ID' below with that ID
4. Replace 'DEALER_ID' with the dealer ID you want to associate the admin with
5. Run this script
*/

-- INSERT INTO profiles (id, email, full_name, role, dealer_id, created_at, updated_at)
-- VALUES (
--   'YOUR_AUTH_USER_ID',  -- This should match auth.users.id
--   'admin@ramona.com',   -- Admin email
--   'Admin User',         -- Full name
--   'admin',              -- Role (admin)
--   'DEALER_ID',          -- Replace with actual dealer ID
--   NOW(),
--   NOW()
-- );

-- Verify the profile was created
-- SELECT p.*, d.name as dealer_name 
-- FROM profiles p 
-- JOIN dealers d ON p.dealer_id = d.id 
-- WHERE p.role = 'admin';
