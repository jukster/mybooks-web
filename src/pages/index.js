import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import BookList from "../components/BookList";

export default function Home() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });



    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome {user?.user_metadata?.full_name || user?.email || 'User'}!</h1>
      <button onClick={handleSignOut}>Sign Out</button>
      <BookList />
    </div>
  );
}
