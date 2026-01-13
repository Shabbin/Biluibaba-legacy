/**
 * Parses a time string (HH:MM) to minutes
 */
export const parseTime = (timeStr: string): number => {
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0] ?? '0', 10);
  const minutes = parseInt(parts[1] ?? '0', 10);
  return hours * 60 + minutes;
};

/**
 * Converts minutes to HH:MM format
 */
export const convertHours = (mins: number): string => {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${pad(hours, 2)}:${pad(minutes, 2)}`;
};

/**
 * Pads a number or string with leading zeros
 */
export const pad = (value: number | string, maxLength: number): string => {
  let str = value.toString();
  while (str.length < maxLength) {
    str = '0' + str;
  }
  return str;
};

/**
 * Calculates available time slots based on start time, end time, duration, and interval
 * @param startTime - Start time in minutes
 * @param endTime - End time in minutes
 * @param duration - Duration of each slot in minutes
 * @param interval - Interval between slots in minutes
 * @returns Array of time slots in HH:MM format
 */
export const calculateTimeSlot = (
  startTime: number,
  endTime: number,
  duration: number,
  interval: number
): string[] => {
  const timeSlots: string[] = [];

  for (let i = startTime; i <= endTime; i += duration + interval) {
    const formattedTime = convertHours(i);
    timeSlots.push(formattedTime);
  }

  return timeSlots;
};

/**
 * Formats a date to a human-readable string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Checks if a date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
};

/**
 * Gets the start of the day for a given date
 */
export const getStartOfDay = (date: Date): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

/**
 * Gets the end of the day for a given date
 */
export const getEndOfDay = (date: Date): Date => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};
