import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { updateBookStatus } from '../lib/supabaseClient'; // Assume this function exists to update the book status

const statusActionsDictionary = {
  "Wishlist": ["Acquire"],
  "Up Next": ["Start", "Summarise", "Archive"],
  "In Progress": ["Summarise", "Archive"],
  "To Summarise": ["Archive"],
  "Archive": ["Up Next", "Start", "Summarise"],
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

  return (
    <div className="flex flex-wrap gap-2">
      {statusActionsDictionary[book.status].map((action) => (
        action === "Acquire" ? (
          <Link
            key={action}
            href={`/books/${book.book_id}/acquire`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {action}
          </Link>
        ) : (
          <button
            key={action}
            onClick={() => handleStatusChange(action)}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            {action}
          </button>
        )
      ))}
    </div>
  );
}
