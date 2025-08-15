export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toISOString().substring(0, 10); // "YYYY-MM-DD"
};