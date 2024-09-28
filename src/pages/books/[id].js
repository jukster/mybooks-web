import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';
import BookActions from '../../components/BookActions';

const BookDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('books_with_latest_status')
          .select()
          .eq('book_id', id)
          .single();

        if (error) throw error;
        setBook(data);

      } catch (error) {
        console.error('Error: ', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
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
      <h1>{book.title}</h1>
      <p>by {book.author}</p>
      <div>
        <h2>Current Status</h2>
        <p>{book.status || 'Unknown'}</p>
      </div>
      <div>
        <h2>Format</h2>
        <p>{book.format || 'Unknown'}</p>
      </div>
      
      <BookActions book={book} />
    </div>
  );
};

export default BookDetail;
