'use client';

const TOKEN_KEY = 'sifix_api_token';

export const API_BASE_URL = '';

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(input, {
    ...init,
    headers,
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('sifix_api_token');
    localStorage.removeItem('sifix_api_token_expires');
  }

  return res;
}

export async function apiCall(input: string, init: RequestInit = {}): Promise<unknown> {
  const res = await apiFetch(input, init);

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      data?.error?.message ||
      data?.error ||
      data?.message ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}
