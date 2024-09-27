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