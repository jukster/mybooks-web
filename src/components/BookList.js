// src/components/BookList.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();//this probably does not need to be here

      if (user) {
        const { data, error } = await supabase
          .from('books_with_latest_status')
          .select(`
            book_id,
            title,
            author,
            status,
            format,
            current_page,
            is_current_book`)
          .eq('user_id', user.id)

        if (error) throw error;
        setBooks(data);
      } else {
        throw new Error('No user logged in');
      }
    } catch (error) {
      console.error('Error: ', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // New function to group books by status
  const groupBooksByStatus = () => {
    const groupedBooks = {};
    books.forEach((book) => {
      const status = book.status || 'Unknown';
      if (!groupedBooks[status]) {
        groupedBooks[status] = [];
      }
      groupedBooks[status].push(book);
    });
    return groupedBooks;
  };

  const groupedBooks = groupBooksByStatus();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">My Book List</h1>
      <Link href="/add-book">
        <span className="bg-blue-500 text-white p-2 rounded mb-4 cursor-pointer inline-block">
          Add Book
        </span>
      </Link>
      {Object.entries(groupedBooks).map(([status, booksInStatus]) => (
        <div key={status} className="mt-6">
          <h2 className="text-xl font-semibold mb-2">{status}</h2>
          <ul>
            {booksInStatus.map((book) => (
              <li key={book.book_id} className="border-b p-2">
                <Link href={`/books/${book.book_id}`}>
                  <span className="text-blue-600 hover:underline cursor-pointer">{book.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BookList;