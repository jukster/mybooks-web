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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error: {error}</div>;
  if (!book) return <div className="p-4">Book not found</div>;

  return (
    <div className="p-4">
      <Link href="/">
        <span className="text-blue-500 hover:underline cursor-pointer">← Back to Book List</span>
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{book.title}</h1>
      <p className="text-xl mb-4">by {book.author}</p>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Current Status</h2>
        <p>{book.status || 'Unknown'}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Format</h2>
        <p>{book.format || 'Unknown'}</p>
      </div>
      
      <BookActions book={book} />
    </div>
  );
};

export default BookDetail;
