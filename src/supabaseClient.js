// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
console.log(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase client created successfully');