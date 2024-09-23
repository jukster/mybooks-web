// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://skmqwcqkbdrauqjdrlxy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbXF3Y3FrYmRyYXVxamRybHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcwODU1ODgsImV4cCI6MjA0MjY2MTU4OH0.wEXWmCGJQe0Zc3B_qbRuTBeUxk3E8eS_J9FhHuM2gbo';
export const supabase = createClient(supabaseUrl, supabaseKey);