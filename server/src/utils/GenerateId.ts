import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generates a random ID with specified length
 * @param length - Length of the ID to generate (default: 10)
 * @returns Random alphanumeric string
 */
export const generateRandomId = (length: number = 10): string => {
  const nanoid = customAlphabet(alphabet, length);
  return nanoid();
};

/**
 * Generates a unique order ID with prefix
 * @returns Order ID string (e.g., "ORD-ABC123XYZ")
 */
export const generateOrderId = (): string => {
  return `ORD-${generateRandomId(8)}`;
};

/**
 * Generates a unique product ID with prefix
 * @returns Product ID string (e.g., "PRD-ABC123XYZ")
 */
export const generateProductId = (): string => {
  return `PRD-${generateRandomId(8)}`;
};

/**
 * Generates a unique appointment ID with prefix
 * @returns Appointment ID string (e.g., "APT-ABC123XYZ")
 */
export const generateAppointmentId = (): string => {
  return `APT-${generateRandomId(8)}`;
};

/**
 * Generates a unique adoption ID with prefix
 * @returns Adoption ID string (e.g., "ADP-ABC123XYZ")
 */
export const generateAdoptionId = (): string => {
  return `ADP-${generateRandomId(8)}`;
};
