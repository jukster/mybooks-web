import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function useAuth() {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      };
  
    getSession();
  
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      });
  
      return () => subscription.unsubscribe();
    }, []);
  
    const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      } else {
        setSession(null);
        setUser(null);
      }
    };
  
    return { session, user, signOut };
  }