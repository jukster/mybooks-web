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