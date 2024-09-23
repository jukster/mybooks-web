// src/components/SignIn.js
import React from 'react';
import { supabase } from '../supabaseClient';

const SignIn = () => {
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