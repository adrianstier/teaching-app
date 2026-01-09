import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '../../hooks/useErrorHandler';

describe('useErrorHandler', () => {
  test('should initialize with no error', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toBeNull();
  });

  test('should handle Error objects', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(new Error('Test error'));
    });

    expect(result.current.error).toMatchObject({
      type: 'error',
      message: 'Test error',
    });
  });

  test('should handle string errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError('String error');
    });

    expect(result.current.error).toMatchObject({
      type: 'error',
      message: 'String error',
    });
  });

  test('should handle axios errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    const axiosError = {
      response: {
        status: 404,
        data: { message: 'Not found' },
      },
      message: 'Request failed',
    };

    act(() => {
      result.current.handleError(axiosError);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('Not found');
  });

  test('should clear error', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError('Test error');
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  test('should handle unknown error types', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(null);
    });

    expect(result.current.error).toMatchObject({
      type: 'error',
      message: expect.stringContaining('Unknown error'),
    });
  });

  test('should handle multiple sequential errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError('First error');
    });

    expect(result.current.error?.message).toBe('First error');

    act(() => {
      result.current.handleError('Second error');
    });

    expect(result.current.error?.message).toBe('Second error');
  });

  test('should handle validation errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    const validationError = {
      response: {
        status: 400,
        data: {
          message: 'Validation failed',
          details: 'Title is required',
        },
      },
    };

    act(() => {
      result.current.handleError(validationError);
    });

    expect(result.current.error?.type).toBe('validation');
    expect(result.current.error?.details).toContain('Title is required');
  });

  test('should handle network errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    const networkError = {
      message: 'Network Error',
      code: 'ERR_NETWORK',
    };

    act(() => {
      result.current.handleError(networkError);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('Network');
  });
});
