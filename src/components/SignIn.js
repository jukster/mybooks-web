// src/components/SignIn.js
import React, { useEffect } from 'react';
import { supabase, createUserIfNotExists } from '../lib/supabaseClient';

const SignIn = () => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        await createUserIfNotExists(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const redirectTo = process.env.NODE_ENV === 'production'
    ? 'https://https://mybooks-web.vercel.app/'
    : 'http://localhost:3000';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
      },
    });
    if (error) console.error('Error: ', error.message);
  };

  return (
    <div>
      <button
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;