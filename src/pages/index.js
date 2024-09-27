import BookList from "../components/BookList";
import SignIn from "../components/SignIn";
import useAuth from "../hooks/useAuth";
import dotenv from 'dotenv';
import Link from 'next/link';

dotenv.config();

// Component for authenticated view
function AuthenticatedView({ user, onSignOut }) {

  const firstName = user.user_metadata.full_name?.split(' ')[0] || 'User';

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 text-right">{user.user_metadata.email}</div>
      <button 
        className="absolute top-4 right-4 py-2 px-4 border border-gray-300 rounded hover:bg-gray-100" 
        onClick={onSignOut}
      >
        Sign Out
      </button>
      <Link href="/archive">
        <span className="bg-blue-500 text-white p-2 rounded mb-4 cursor-pointer inline-block">
          archive
        </span>
      </Link>
      <BookList userId={user.id} firstName={firstName} />
    </div>
  );
}

// Component for unauthenticated view
function UnauthenticatedView() {
  return (
    <div>
      <h1>Not authenticated</h1>
      <SignIn />
    </div>
  );
}

export default function Home() {
  const { session, user, signOut } = useAuth();

  return (
    <div>
      {!session ? (
        <UnauthenticatedView />
      ) : (
        <AuthenticatedView user={user} onSignOut={signOut} />
      )}
    </div>
  );
}
