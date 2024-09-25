// src/components/BookList.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Link from 'next/link';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data, error } = await supabase.from('books').select('*');
    if (error) console.error('Error: ', error.message);
    else setBooks(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">My Book List</h1>
      <Link href="/add-book">
        <span className="bg-blue-500 text-white p-2 rounded mb-4 cursor-pointer inline-block">
          Add Book
        </span>
      </Link>
      <ul className="mt-4">
        {books.map((book) => (
          <li key={book.id} className="border-b p-2">
            {book.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;