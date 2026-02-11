export const convertSize = (size: string | number): string => {
  // Handle numeric strings
  const value = parseInt(size);

  if (value >= 1000) {
    return `${value / 1000}kg`;
  }

  return `${value}g`;
};
