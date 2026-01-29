import { api, setToken, clearToken, getToken } from './apiClient';

export type Role = 'parent' | 'student';

export interface ApiUser {
  id: string;
  login: string;
  email: string;
  role: Role;
}

export interface ApiChild {
  id: string;
  fullName: string;
  grade: string;
  subjectIds: string[];
}

export interface LoginResponse {
  token: string;
  user: ApiUser;
  children: ApiChild[];
}

export interface RegisterResponse {
  token: string;
  user: ApiUser;
  child: ApiChild | null;
}

export interface MeResponse {
  user: ApiUser;
  children: ApiChild[];
}

export async function registerParent(params: {
  login: string;
  password: string;
  email?: string;
  child?: { fullName: string; grade: string; subjectIds: string[] };
}): Promise<RegisterResponse> {
  const res = await api.post<RegisterResponse>('/auth/register', params);
  setToken(res.token);
  return res;
}

export async function login(login: string, password: string): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login', { login, password });
  setToken(res.token);
  return res;
}

export function logout(): void {
  clearToken();
}

export async function getCurrentUser(): Promise<MeResponse | null> {
  if (!getToken()) return null;
  try {
    return await api.get<MeResponse>('/auth/me');
  } catch {
    clearToken();
    return null;
  }
}
