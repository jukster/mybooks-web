// src/pages/index.js
import BookList from '../components/BookList';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <h1>Welcome, {session.user.name}!</h1>
      ) : (
        <h1>Welcome, Guest!</h1>
      )}
      <BookList />
    </div>
  );
}