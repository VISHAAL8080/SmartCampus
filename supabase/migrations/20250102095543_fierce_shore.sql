/*
  # Create or Update Admin User
  
  Ensures the admin user exists with correct credentials:
  - Register Number: ADMIN001
  - Password: admin123
  - Email: ADMIN001@rmkec.ac.in
*/

DO $$
BEGIN
    -- Only insert if the admin user doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'ADMIN001@rmkec.ac.in'
    ) THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'ADMIN001@rmkec.ac.in',
            crypt('admin123', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"System Administrator","role":"admin"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
    ELSE
        -- Update the existing admin user's password if needed
        UPDATE auth.users 
        SET encrypted_password = crypt('admin123', gen_salt('bf')),
            raw_user_meta_data = '{"full_name":"System Administrator","role":"admin"}'
        WHERE email = 'ADMIN001@rmkec.ac.in';
    END IF;
END $$;