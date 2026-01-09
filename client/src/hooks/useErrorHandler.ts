import { useState, useCallback } from 'react';
import { AppError } from '../components/shared/ErrorDisplay';

interface UseErrorHandlerReturn {
  error: AppError | null;
  setError: (error: AppError | null) => void;
  handleError: (error: unknown) => void;
  clearError: () => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<AppError | null>(null);

  const parseError = useCallback((error: unknown): AppError => {
    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        type: 'network',
        message: 'Cannot connect to server',
        details: 'The Teaching Assistant server is not responding.',
        suggestion: 'Check your internet connection and ensure the server is running.',
      };
    }

    // HTTP errors
    if (error instanceof Response) {
      const status = error.status;

      if (status === 401 || status === 403) {
        return {
          type: 'auth',
          message: 'API key not configured',
          details: 'The server needs a valid Anthropic API key to function.',
          suggestion: 'Add ANTHROPIC_API_KEY to your .env file or contact your administrator.',
          docLink: '/docs/setup#api-key',
        };
      }

      if (status === 429) {
        return {
          type: 'rate-limit',
          message: 'Rate limit exceeded',
          details: 'Too many requests were made in a short time.',
          suggestion: 'Wait a few minutes before trying again.',
        };
      }

      if (status === 504) {
        return {
          type: 'timeout',
          message: 'Request timed out',
          details: 'The AI took too long to generate content.',
          suggestion: 'Try again with a simpler request.',
        };
      }

      if (status >= 500) {
        return {
          type: 'server',
          message: 'Server error',
          details: 'The server encountered an error while processing your request.',
          suggestion: 'Please try again in a few moments.',
          technicalDetails: `HTTP ${status}: ${error.statusText}`,
        };
      }

      if (status >= 400) {
        return {
          type: 'validation',
          message: 'Invalid request',
          details: 'The request could not be processed.',
          suggestion: 'Check your input and try again.',
          technicalDetails: `HTTP ${status}: ${error.statusText}`,
        };
      }
    }

    // Validation errors (custom)
    if (
      error &&
      typeof error === 'object' &&
      'type' in error &&
      error.type === 'validation'
    ) {
      return error as AppError;
    }

    // Error objects with message
    if (error instanceof Error) {
      // Timeout errors
      if (error.message.includes('timeout') || error.message.includes('timed out')) {
        return {
          type: 'timeout',
          message: 'Request timed out',
          details: error.message,
          suggestion: 'Try again with a simpler request or wait a few minutes.',
        };
      }

      // Auth errors
      if (
        error.message.includes('API key') ||
        error.message.includes('unauthorized') ||
        error.message.includes('authentication')
      ) {
        return {
          type: 'auth',
          message: 'Authentication failed',
          details: error.message,
          suggestion: 'Check your API key configuration.',
          docLink: '/docs/setup#api-key',
        };
      }

      // Rate limit errors
      if (error.message.includes('rate limit') || error.message.includes('too many')) {
        return {
          type: 'rate-limit',
          message: 'Rate limit exceeded',
          details: error.message,
          suggestion: 'Wait a few minutes before trying again.',
        };
      }

      // Generic error with message
      return {
        type: 'server',
        message: 'Something went wrong',
        details: error.message,
        suggestion: 'Please try again or contact support if the problem persists.',
        technicalDetails: error.stack,
      };
    }

    // String errors
    if (typeof error === 'string') {
      return {
        type: 'server',
        message: 'Error occurred',
        details: error,
        suggestion: 'Please try again.',
      };
    }

    // Unknown errors
    return {
      type: 'server',
      message: 'An unexpected error occurred',
      details: 'Something went wrong while processing your request.',
      suggestion: 'Please try again or contact support if the problem persists.',
      technicalDetails: JSON.stringify(error, null, 2),
    };
  }, []);

  const handleError = useCallback(
    (error: unknown) => {
      const parsedError = parseError(error);
      setError(parsedError);

      // Log to console for debugging
      console.error('[ErrorHandler]', {
        type: parsedError.type,
        message: parsedError.message,
        originalError: error,
      });
    },
    [parseError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,
    handleError,
    clearError,
  };
};

// Helper function to create validation errors
export const createValidationError = (
  message: string,
  fields?: string[]
): AppError => {
  const fieldList = fields ? fields.join(', ') : '';
  return {
    type: 'validation',
    message: message,
    details: fields
      ? `The following fields need attention: ${fieldList}`
      : 'Please check your input and try again.',
    suggestion: 'Review the form and ensure all required fields are filled correctly.',
  };
};

// Helper function to check if fetch response is ok, throw structured error if not
export const handleFetchResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    // Try to get error details from response body
    let errorDetails = '';
    try {
      const data = await response.json();
      errorDetails = data.error || data.message || response.statusText;
    } catch {
      errorDetails = response.statusText;
    }

    const error: AppError = {
      type: response.status === 401 || response.status === 403
        ? 'auth'
        : response.status === 429
        ? 'rate-limit'
        : response.status === 504
        ? 'timeout'
        : response.status >= 500
        ? 'server'
        : 'validation',
      message: `Request failed (${response.status})`,
      details: errorDetails,
      suggestion: 'Please try again or contact support.',
      technicalDetails: `HTTP ${response.status}: ${response.statusText}`,
    };

    throw error;
  }

  return response.json();
};
