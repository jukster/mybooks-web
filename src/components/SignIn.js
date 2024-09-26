// src/components/SignIn.js
import React, { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const SignIn = () => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('id', session.user.id)
          .single();

        if (!existingUser) {
          const { error } = await supabase.from('users').insert({
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata.full_name,
            created_at: new Date().toISOString()
          });

          if (error) console.error('Error creating user:', error);
        }
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
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={signInWithGoogle}
        className="bg-red-500 text-white p-4 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;