import { getSession } from "next-auth/react";
import BookList from "../components/BookList";

function HomePage({ session }) {
  if (!session) {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <h1>Welcome {session.user.name}!</h1>
      <BookList />
      {/* Rest of your component */}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  console.log("Session data:", session); // Add this line to log session data

  return {
    props: {
      session,
    },
  };
}

export default HomePage;