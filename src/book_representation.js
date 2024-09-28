export function formatBookInfo(book) {
  const { title, author, status, format, current_page } = book;
  console.log(book);
  if (status === 'Wishlist') {
    return `${title} by ${author}`;
  }

  if (status === 'Up Next' || status === 'To Summarise') {
    if (format === 'Real Book') {
      return `${title} by ${author} as real book`;
    } else {
      return `${title} by ${author} on ${format}`;
    }
  }

  if (status === 'In Progress' && format === 'Real Book') {
    return `${title} by ${author} on page ${current_page || 'unknown'}`;
  }

  // Default case
  return `${title} by ${author} on ${format}`;
}
