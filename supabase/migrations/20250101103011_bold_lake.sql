-- Create admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'ADMIN001@rmkec.ac.in',
  crypt('admin1', gen_salt('bf')),
  now(),
  '{"full_name": "System Administrator", "role": "admin"}'
);