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
    <div>
      <div>{user.user_metadata.email}</div>
      <button 
        onClick={onSignOut}
      >
        Sign Out
      </button>
      <Link href="/archive">
        <span>
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
