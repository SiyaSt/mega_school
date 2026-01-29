const TOKEN_KEY = 'mega_school_token';

const getBaseUrl = () => {
  if (import.meta.env.DEV) return '/api';
  return (import.meta.env.VITE_API_URL as string) || '/api';
};

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: object; headers?: HeadersInit } = {}
): Promise<T> {
  const { body, method = 'GET', headers: optHeaders } = options;
  const base = getBaseUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(typeof optHeaders === 'object' && !(optHeaders instanceof Headers)
      ? (optHeaders as Record<string, string>)
      : {}),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const init: RequestInit = {
    method,
    headers: { ...headers },
    body: body != null ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(url, init);

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const err = (data as { error?: string })?.error ?? res.statusText ?? 'Ошибка запроса';
    throw new Error(err);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: object) => apiRequest<T>(path, { method: 'POST', body }),
};
