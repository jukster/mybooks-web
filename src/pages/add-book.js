import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import { useUser } from '../hooks/useUser';

export default function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const router = useRouter();
  const { user, loading } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Step 1: Insert author and get the author_id
    const { data: authorData, error: authorError } = await supabase
      .from('authors')
      .insert([{ name: author }])
      .select('id')
      .single();

    if (authorError) {
      console.error('Error inserting author: ', authorError.message);
      return;
    }

    const authorId = authorData.id;

    // Step 2: Get the current user's ID
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    // Step 3: Insert book with user_id and author_id
    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .insert([{ title, user_id: user.id, author_id: authorId }])
      .select('id')
      .single();

    if (bookError) {
      console.error('Error inserting book: ', bookError.message);
      return;
    }

    const bookId = bookData.id;

    // Step 4: Add an event to book_status_history
    const { error: historyError } = await supabase
      .from('book_status_history')
      .insert([{ book_id: bookId, status_id: 1, changed_at: new Date().toISOString() }]);

    if (historyError) {
      console.error('Error inserting book status history: ', historyError.message);
      return;
    }

    router.push('/'); // Redirect to the book list page
  };
  return (
    <div>
      <h1>Add a New Book</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <a href="#" onClick={handleSubmit} role="button">
          Add Book
        </a>
      </form>
    </div>
  );
}