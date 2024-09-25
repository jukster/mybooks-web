import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Link from 'next/link';

const BookDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);

        const { data, error } = await supabase
          .from('books')
          .select(`
            *,
            book_status_history(
              status_id,
              statuses(name)
            ),
            authors(name)
          `)
          .eq('id', id)
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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error: {error}</div>;
  if (!book) return <div className="p-4">Book not found</div>;

  return (
    <div className="p-4">
      <Link href="/">
        <span className="text-blue-500 hover:underline cursor-pointer">← Back to Book List</span>
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{book.title}</h1>
      <p className="text-xl mb-4">by {book.authors.name}</p>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Current Status</h2>
        <p>{book.book_status_history[0]?.statuses.name || 'Unknown'}</p>
      </div>
      
      <Link href={`/books/${id}/acquire`}>
        <span className="text-blue-500 hover:underline cursor-pointer">Acquired</span>
      </Link>
    </div>
  );
};

export default BookDetail;
