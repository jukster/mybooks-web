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
      <nav className="container-fluid">
        <ul>
          <li><Link href="/archive">Archive</Link></li>
          <li ><Link href="#" onClick={onSignOut}>Sign Out</Link></li>
        </ul>
      </nav>
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
