import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
}

export function useProfile() {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setState({ profile: null, loading: false, error: new Error('User not authenticated') });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setState({ profile: data, loading: false, error: null });
    } catch (error) {
      setState({
        profile: null,
        loading: false,
        error: error as Error
      });
    }
  };

  const updateProfile = async (updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...data } : data
      }));

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return {
    ...state,
    updateProfile,
    refetch: fetchProfile
  };
}
