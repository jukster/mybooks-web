-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add user_id to books table
ALTER TABLE books
ADD COLUMN user_id UUID;

-- Add foreign key constraint to books table
ALTER TABLE books
ADD CONSTRAINT fk_books_user
FOREIGN KEY (user_id) REFERENCES users(id);

-- Create book_status_history table
CREATE TABLE book_status_history (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- Drop the old book_statuses table
DROP TABLE book_statuses;

-- Update other tables to include user_id if necessary
ALTER TABLE physical_books
ADD COLUMN user_id UUID NOT NULL,
ADD CONSTRAINT fk_physical_books_user
FOREIGN KEY (user_id) REFERENCES users(id);

-- Add NOT NULL constraint to books.user_id
ALTER TABLE books
ALTER COLUMN user_id SET NOT NULL;

-- Add NOT NULL constraint to physical_books.user_id
ALTER TABLE physical_books
ALTER COLUMN user_id SET NOT NULL;