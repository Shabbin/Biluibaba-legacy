export const formatDate = (dateString: string): string => {
  // Create a Date object from the ISO string
  const date = new Date(dateString);

  // Array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract day, month name, and year
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  // Format as "30 April, 2025"
  return `${day} ${monthName}, ${year}`;
};
