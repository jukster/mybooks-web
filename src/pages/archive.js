import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { fetchBooks } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Archive = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchBooksData(user.id);
    }
  }, [user]);

  const fetchBooksData = async (userId) => {
    try {
      const data = await fetchBooks(userId, true);
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term)
    );
    setFilteredBooks(filtered);
  };

  const handleBookClick = (bookId) => {
    router.push(`/books/${bookId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in to view your archive.</div>;

  return (
    <div>
    <Link href="/">
        <span>← Back to Book List</span>
      </Link>
      <h1>Book Archive</h1>
      <input
        type="text"
        placeholder="Search books or authors"
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {filteredBooks.map((book) => (
          <li key={book.book_id}>
            <span
              onClick={() => handleBookClick(book.book_id)}
            >
              {book.title} by {book.author}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Archive;