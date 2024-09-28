import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchBook, updateCurrentPage } from '../../../lib/supabaseClient';

export default function MarkPage() {
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) loadBook();
  }, [id]);

  async function loadBook() {
    const bookData = await fetchBook(id);
    if (bookData) {
      setBook(bookData);
    } else {
      console.error('Error fetching book');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateCurrentPage(book.book_id, parseInt(currentPage));
      setBook({ ...book, current_page: parseInt(currentPage) });
      setIsEditing(false);
      // Route back to the root of the application
      router.push('/');
    } catch (error) {
      console.error('Error updating current page:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  }

  if (!book) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>{book.title}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="currentPage">Current Page:</label>
        <input
          type="number"
          id="currentPage"
          value={currentPage}
          onChange={(e) => setCurrentPage(e.target.value)}
          required
        />
        <button type="submit">Mark Page</button>
      </form>
    </div>
  );
}
