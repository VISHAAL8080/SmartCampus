import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { UserRole } from '../../../types/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(registerNumber: string, password: string, expectedRole: UserRole) {
    setLoading(true);
    setError(null);

    try {
      // Ensure register number is uppercase
      const formattedRegNumber = registerNumber.toUpperCase();
      const email = `${formattedRegNumber}@rmkec.ac.in`;

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw new Error('Invalid credentials');

      // Verify user role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || profile?.role !== expectedRole) {
        throw new Error('Unauthorized access');
      }

      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}