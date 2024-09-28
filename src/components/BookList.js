// src/components/BookList.js
import React, { useState, useEffect } from 'react';
import { fetchBooks } from '../lib/supabaseClient';
import Link from 'next/link';

const BookList = ({ userId, firstName }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchBooksData(userId, false);
    }
  }, [userId]);

  const fetchBooksData = async (userId) => {
    try {
      setLoading(true);
      const data = await fetchBooks(userId);
      setBooks(data);
    } catch (error) {
      console.error('Error: ', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // New constant for ordered statuses
  const orderedStatuses = ['In Progress', 'To Summarise', 'Up Next', 'Wishlist'];

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

  // New function to sort grouped books
  const sortedGroupedBooks = () => {
    return orderedStatuses
      .filter(status => groupedBooks[status])
      .reduce((acc, status) => {
        acc[status] = groupedBooks[status];
        return acc;
      }, {});
  };

  const getBookRowContent = (book) => {
    let content = `${book.title} by ${book.author}`;
    if (book.status !== 'Wishlist') {
      content += ` - ${book.format}`;
    }
    if (book.status === 'Physical' && book.page_number) {
      content += ` Currently on page (${book.page_number})`;
    }
    return content;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{firstName}&apos;s Books</h1>
      <Link href="/add-book">
        <span>
          Add Book
        </span>
      </Link>
      {Object.entries(sortedGroupedBooks()).map(([status, booksInStatus]) => (
        <div key={status} >
          <h2>{status}</h2>
          <ul>
            {booksInStatus.map((book) => (
              <li key={book.book_id} >
                <Link href={`/books/${book.book_id}`}>
                  <span>{getBookRowContent(book)}</span>
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