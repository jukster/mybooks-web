import BookList from "../components/BookList";
import SignIn from "../components/SignIn";
import useAuth from "../hooks/useAuth";
import Link from 'next/link';


// Component for authenticated view
function AuthenticatedView({ user, onSignOut }) {
  const firstName = user.user_metadata.full_name?.split(' ')[0] || 'User';

  return (
    <div>
      <BookList userId={user.id} firstName={firstName} />
      <div>
        <Link href="/archive">Archive</Link>
      </div>
      <div>
        <Link href="#" onClick={onSignOut}>Sign Out</Link>
      </div>
      <div>
        <Link href="/add-book">Add Book</Link>
      </div>
    </div>
  );
}

// Component for unauthenticated view
function UnauthenticatedView() {
  return (
    <div>
      <h1>mybooks</h1>
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
