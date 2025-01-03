/*
  # Ensure Admin User Setup
  
  This migration:
  1. Creates the admin user if not exists
  2. Ensures proper profile setup
  3. Sets correct authentication credentials
*/

-- First ensure the admin user exists in auth.users
DO $$
DECLARE
    admin_id uuid;
BEGIN
    -- Try to get existing admin user
    SELECT id INTO admin_id
    FROM auth.users
    WHERE email = 'ADMIN001@rmkec.ac.in';
    
    -- Create admin user if doesn't exist
    IF admin_id IS NULL THEN
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
        ) RETURNING id INTO admin_id;
    ELSE
        -- Update existing admin password
        UPDATE auth.users 
        SET encrypted_password = crypt('admin123', gen_salt('bf')),
            raw_user_meta_data = '{"full_name":"System Administrator","role":"admin"}',
            email_confirmed_at = NOW()
        WHERE id = admin_id;
    END IF;

    -- Ensure admin profile exists
    INSERT INTO public.profiles (id, register_number, full_name, role)
    VALUES (
        admin_id,
        'ADMIN001',
        'System Administrator',
        'admin'
    )
    ON CONFLICT (id) DO UPDATE
    SET register_number = 'ADMIN001',
        full_name = 'System Administrator',
        role = 'admin';
END $$;