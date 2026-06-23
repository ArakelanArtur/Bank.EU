const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('lbf_auth');
    if (!raw) return null;
    return JSON.parse(raw).token;
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options?: Omit<RequestInit, 'body'> & { body?: unknown }): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const body = options?.body;
  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {
    ...authHeaders(),
    ...(options?.headers as Record<string, string>),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const fetchBody: BodyInit | undefined = isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined;

  const res = await fetch(url, {
    method: options?.method || 'GET',
    headers,
    body: fetchBody,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || `Request failed (${res.status})`);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) =>
    request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),
};
