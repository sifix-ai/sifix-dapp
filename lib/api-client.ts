'use client';

import { toast } from '@/store/app-store';

const TOKEN_KEY = 'sifix_api_token';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Enhanced fetch wrapper with automatic error handling and toast notifications
 * 
 * Features:
 * - Automatic JWT token injection from localStorage
 * - Automatic error toast notifications for 4xx and 5xx errors
 * - Session expiry handling (401)
 * - Network error handling
 * - Structured error responses with ApiError class
 * 
 * @param input - URL or Request object
 * @param init - RequestInit options
 * @returns Promise<Response>
 * @throws ApiError with status, code, and details
 */
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const res = await fetch(input, {
      ...init,
      headers,
    });

    // Handle 401 Unauthorized
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('sifix_api_token');
      localStorage.removeItem('sifix_api_token_expires');
      toast.error('Session expired. Please reconnect your wallet.');
      throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    // Handle other error status codes
    if (!res.ok) {
      let errorMessage = `Request failed with status ${res.status}`;
      let errorCode = 'UNKNOWN_ERROR';
      let errorDetails = null;

      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        errorCode = errorData.code || errorCode;
        errorDetails = errorData.details || errorData;
      } catch {
        // If response is not JSON, use status text
        errorMessage = res.statusText || errorMessage;
      }

      // Show toast for client-side errors (4xx) and server errors (5xx)
      if (typeof window !== 'undefined') {
        // Don't show toast for 401 (already handled above)
        if (res.status !== 401) {
          if (res.status >= 500) {
            toast.error(`Server error: ${errorMessage}`);
          } else if (res.status >= 400) {
            toast.error(errorMessage);
          }
        }
      }

      throw new ApiError(errorMessage, res.status, errorCode, errorDetails);
    }

    return res;
  } catch (error) {
    // Handle network errors
    if (error instanceof ApiError) {
      throw error;
    }

    if (typeof window !== 'undefined') {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0,
      'NETWORK_ERROR'
    );
  }
}
