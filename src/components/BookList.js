// src/components/BookList.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data, error } = await supabase.from('books').select('*');
    if (error) console.error('Error: ', error.message);
    else setBooks(data);
  };

  const addBook = async () => {
    const { data, error } = await supabase.from('books').insert([{ title: newBook }]);
    if (error) console.error('Error: ', error.message);
    else setBooks([...books, data[0]]);
    setNewBook('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">My Book List</h1>
      <input
        type="text"
        value={newBook}
        onChange={(e) => setNewBook(e.target.value)}
        className="border p-2 mb-4 w-full"
        placeholder="Add a new book"
      />
      <button onClick={addBook} className="bg-blue-500 text-white p-2 rounded">
        Add Book
      </button>
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