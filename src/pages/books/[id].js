import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { fetchBook } from '../../lib/supabaseClient';
import Link from 'next/link';
import BookActions from '../../components/BookActions';

const BookDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchBook(id);
        setBook(data);
      } catch (error) {
        console.error('Error: ', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getBookDetails();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div>
      <Link href="/">
        <span>← Back to Book List</span>
      </Link>
      <h1>{book.title} by {book.author}</h1>
      <div>
        {book.status || 'Unknown'}
      </div>
      <div>

      {book.format || 'Unknown'}
      
      
      </div>
      <p></p>
      <BookActions book={book} />
    </div>
  );
};

export default BookDetail;
