    -- migrations/20211010123456_create-books-schema.sql

    -- Table to store authors
    CREATE TABLE authors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

    -- Table to store books
    CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author_id INTEGER NOT NULL,
        FOREIGN KEY (author_id) REFERENCES authors(id)
    );

    -- Table to store formats
    CREATE TABLE formats (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL
    );

    -- Table to store statuses
    CREATE TABLE statuses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL
    );

    -- Table to store the format information for each book
    CREATE TABLE book_formats (
        book_id INTEGER NOT NULL,
        format_id INTEGER NOT NULL,
        FOREIGN KEY (book_id) REFERENCES books(id),
        FOREIGN KEY (format_id) REFERENCES formats(id),
        PRIMARY KEY (book_id, format_id)
    );

    -- Table to store the status information for each book
    CREATE TABLE book_statuses (
        book_id INTEGER NOT NULL,
        status_id INTEGER NOT NULL,
        FOREIGN KEY (book_id) REFERENCES books(id),
        FOREIGN KEY (status_id) REFERENCES statuses(id),
        PRIMARY KEY (book_id, status_id)
    );

    -- Table to store additional information for physical books
    CREATE TABLE physical_books (
        book_id INTEGER PRIMARY KEY,
        current_page INTEGER,
        is_current_book BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (book_id) REFERENCES books(id)
    );

    -- Insert initial data into formats table
    INSERT INTO formats (name) VALUES
    ('Physical'),
    ('Kindle'),
    ('Kobo'),
    ('eBook');

    -- Insert initial data into statuses table
    INSERT INTO statuses (name) VALUES
    ('Wishlist'),
    ('Up Next'),
    ('In Progress'),
    ('To Summarise'),
    ('Archived');