// src/utils/errorHandler.ts
import { Alert } from 'react-native';

/**
 * A standardized error shape for use throughout the application.
 * This ensures that error objects are predictable.
 */
export interface AppError {
  message: string;
  // Optional: Add other fields like a specific error code or details
  code?: string;
  details?: unknown;
}

/**
 * Normalizes an unknown error into a standardized AppError object.
 * This is the safest way to handle errors from different sources.
 * @param error The error to normalize, of unknown type.
 * @param fallbackMessage A message to use if the error cannot be parsed.
 * @returns A standardized AppError object.
 */
export function normalizeError(
  error: unknown,
  fallbackMessage: string = 'An unexpected error occurred.'
): AppError {
  if (error instanceof Error) {
    return { message: error.message };
  }

  // Check if it's an object with a message property (like from Axios)
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return { message: (error as { message: string }).message };
  }

  if (typeof error === 'string' && error.length > 0) {
    return { message: error };
  }

  // If we can't determine the error, use the fallback.
  return {
    message: fallbackMessage,
    details: error, // Keep the original error for debugging
  };
}

/**
 * A generic error handler for services and other non-API logic.
 * It logs the error to the console and shows a user-friendly alert.
 *
 * @param error The raw error object, of an unknown type.
 * @param context A string describing the context in which the error occurred,
 *                used for developer logs.
 */
export function handleServiceError(
  error: unknown,
  context: string = 'Service Error'
) {
  const normalizedError = normalizeError(error);

  // 1. Log the detailed error for developers
  console.error(`[${context}]:`, normalizedError.message, {
    originalError: error,
  });

  // 2. Show a user-friendly alert.
  // In a real app, you might replace this with a more sophisticated
  // toast/snackbar system that doesn't block the UI.
  Alert.alert('An Error Occurred', normalizedError.message, [{ text: 'OK' }]);
}
