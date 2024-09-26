DROP VIEW IF EXISTS books_with_latest_status;

CREATE VIEW books_with_latest_status AS
SELECT
    book_status_history.id as status_change_id,
    books.id as book_id,
    books.title,
    authors.name AS author,
    statuses.name AS status,
    formats.name AS format,
    physical_books.current_page,
    physical_books.is_current_book,
    books.user_id
FROM 
    books
    INNER JOIN book_status_history ON book_status_history.book_id = books.id
    INNER JOIN authors ON authors.id = books.author_id
    INNER JOIN statuses ON book_status_history.status_id = statuses.id
    LEFT JOIN book_formats ON book_formats.book_id = books.id
    LEFT JOIN formats ON formats.id = book_formats.format_id
    LEFT JOIN physical_books ON physical_books.book_id = books.id
WHERE 
    book_status_history.id = (
        SELECT MAX(id) 
        FROM book_status_history 
        WHERE book_status_history.book_id = books.id
    )
ORDER BY 
    books.id DESC;