// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// book related functions

export async function updateBookStatus(bookId, statusId) {
    if (!Number.isInteger(statusId)) {
        throw new Error('statusId must be an integer');
    }

    const { data, error } = await supabase
      .from('book_status_history')
      .insert({ book_id: bookId, status_id: statusId })
  
    if (error) throw error
    return data
}

export const fetchBooks = async (userId, archive = false) => {
    let query = supabase
      .from('books_with_latest_status')
      .select(`
        book_id,
        title,
        author,
        status,
        format,
        current_page,
        is_current_book,
        status_id`)
      .eq('user_id', userId);
  
    if (archive) {
      query = query.eq('status_id', 5);
    } else {
      query = query.neq('status_id', 5);
    }
  
    const { data, error } = await query;
  
    if (error) throw error;
    return data || [];
  };

  export async function updateCurrentPage(bookId, pageNumber) {
    if (!Number.isInteger(pageNumber) || pageNumber < 0) {
      throw new Error('Page number must be a non-negative integer');
    }
  
    const { data, error } = await supabase
      .from('physical_books')
      .update({ current_page: pageNumber })
      .eq('book_id', bookId);
  
    if (error) throw error;
    return data;
  }

  export const fetchBook = async (bookId) => {
    const { data, error } = await supabase
      .from('books_with_latest_status')
      .select()
      .eq('book_id', bookId)
      .single();
  
    if (error) {
      throw error;
    }
  
    return data;
  };

  export const acquireBook = async (bookId, formatId) => {
    // Save the format in the book_formats table
    const { error: formatError } = await supabase
      .from('book_formats')
      .insert({ book_id: bookId, format_id: formatId });
    if (formatError) throw formatError;
  
    // Update the book status to 2 (Acquired)
    const { error: statusError } = await supabase
      .from('book_status_history')
      .insert({ book_id: bookId, status_id: 2 });
    if (statusError) throw statusError;

    // Add a new entry to physical books table if this is the format
    const { physicalError } = await supabase
          .from('physical_books')
          .insert({ book_id: bookId, current_page: 0, is_current_book: false })

        if (formatError) throw physicalError
  };

// user related functions

export async function getUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('id', 'email')
      .eq('id', userId)
    if (error) throw error
      return data 
}

export async function createUserIfNotExists(user) {
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('id', user.id)
      .single();

    if (!existingUser) {
      const { error } = await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        username: user.user_metadata.full_name,
        created_at: new Date().toISOString()
      });

      if (error) console.error('Error creating user:', error);
    }
  };

