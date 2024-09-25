import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../supabaseClient';
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
      
      // Save the format in the book_formats table
      const { error: formatError } = await supabase
        .from('book_formats')
        .insert({ book_id: id, format_id: selectedFormat });
      if (formatError) throw formatError;

      // Update the book status to 2 (Acquired)
      const { error: statusError } = await supabase
        .from('book_status_history')
        .insert({ book_id: id, status_id: 2 });
      if (statusError) throw statusError;

      router.push(`/books/${id}`);
    } catch (error) {
      console.error('Error: ', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error: {error}</div>;

  return (
    <div className="p-4">
      <Link href={`/books/${id}`}>
        <span className="text-blue-500 hover:underline cursor-pointer">← Back to Book Details</span>
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">Acquire Book</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Select Format</h2>
          {formats.map((format) => (
            <div key={format.id} className="mb-2">
              <input
                type="radio"
                id={`format-${format.id}`}
                name="format"
                value={format.id}
                checked={selectedFormat === format.id}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="mr-2"
              />
              <label htmlFor={`format-${format.id}`}>{format.name}</label>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={!selectedFormat}
        >
          Confirm Acquisition
        </button>
      </form>
    </div>
  );
};

export default AcquireBook;