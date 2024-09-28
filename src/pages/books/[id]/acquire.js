import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';

const AcquireBook = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchFormats();
    }
  }, [id]);

  const fetchFormats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('formats')
        .select('*');
      if (error) throw error;
      setFormats(data);
    } catch (error) {
      console.error('Error: ', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const bookId = parseInt(id, 10);
      console.log(bookId); // Convert id to integer

      // Save the format in the book_formats table
      const { error: formatError } = await supabase
        .from('book_formats')
        .insert({ book_id: bookId, format_id: selectedFormat });
      if (formatError) throw formatError;

      // Update the book status to 2 (Acquired)
      const { error: statusError } = await supabase
        .from('book_status_history')
        .insert({ book_id: bookId, status_id: 2 });
      if (statusError) throw statusError;

      router.push(`/books/${id}`);
    } catch (error) {
      console.error('Error: ', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Link href={`/books/${id}`}>
        <span>← Back to Book Details</span>
      </Link>
      <h1>Acquire Book</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Select Format</h2>
          {formats.map((format) => (
            <div key={format.id}>
              <input
                type="radio"
                id={`format-${format.id}`}
                name="format"
                value={format.id}
                checked={selectedFormat === format.id}
                onChange={(e) => setSelectedFormat(e.target.value)}
              />
              <label htmlFor={`format-${format.id}`}>{format.name}</label>
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={!selectedFormat}
        >
          Confirm Acquisition
        </button>
      </form>
    </div>
  );
};

export default AcquireBook;