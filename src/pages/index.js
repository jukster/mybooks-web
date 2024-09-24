import BookList from "../components/BookList";
import SignIn from "../components/SignIn";
import useAuth from "../hooks/useAuth";

// Component for authenticated view
function AuthenticatedView({ user, onSignOut }) {
  return (
    <div>
      <h1>Welcome {user?.user_metadata?.full_name || user?.email || 'User'}!</h1>
      <button onClick={onSignOut}>Sign Out</button>
      <BookList />
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
