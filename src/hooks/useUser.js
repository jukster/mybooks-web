import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authListener = null;

    async function setupAuthListener() {

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
    
        setUser(data.session?.user ?? null);

        authListener = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        );
      
        setLoading(false);
      
    }

    setupAuthListener();

    return () => {
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      }
    };
  }, []);

  return { user, loading };
}