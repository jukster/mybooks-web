import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { updateBookStatus } from '../lib/supabaseClient'; // Assume this function exists to update the book status

const statusActionsDictionary = {
  "Wishlist": ["Acquire"],
  "Up Next": ["Start", "Summarise", "Archive"],
  "In Progress": ["Summarise", "Archive"],
  "To Summarise": ["Archive"],
  "Archived": ["Up Next", "Start", "Summarise"],
};

const actionStatusIdDictionary = {
  "Up Next": 2,
  "Start": 3,
  "Summarise": 4,
  "Archive": 5,
};

export default function BookActions({ book }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsLoading(true);
    try {
      const newStatusId = actionStatusIdDictionary[newStatus];
      await updateBookStatus(book.book_id, newStatusId);
      router.push('/'); // Redirect to homepage after status change
    } catch (error) {
      console.error('Error updating book status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const actions = [...statusActionsDictionary[book.status]];
  if (book.status === "In Progress" && book.format === "Real Book") {
    actions.push("Mark Page");
  }

  return (
    <div>
      {actions.map((action) => (
        <div key={action}>
          <Link
            href={
              action === "Acquire" ? `/books/${book.book_id}/acquire` :
              action === "Mark Page" ? `/books/${book.book_id}/mark-page` :
              '#'
            }
            onClick={
              action !== "Acquire" && action !== "Mark Page" 
                ? (e) => {
                    e.preventDefault();
                    handleStatusChange(action);
                  } 
                : undefined
            }
            className={isLoading ? 'disabled' : ''}
            aria-disabled={isLoading}
          >
            {action}
          </Link>
        </div>
      ))}
    </div>
  );
}
