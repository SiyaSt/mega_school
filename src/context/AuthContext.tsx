import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ApiUser, ApiChild } from '../services/authService';
import * as authService from '../services/authService';

interface AuthState {
  user: ApiUser | null;
  children: ApiChild[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  register: (params: {
    login: string;
    password: string;
    email?: string;
    child?: { fullName: string; grade: string; subjectIds: string[] };
  }) => Promise<void>;
  loadMe: () => Promise<void>;
}

const defaultState: AuthState = {
  user: null,
  children: [],
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);

  const loadMe = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    const data = await authService.getCurrentUser();
    if (data) {
      setState({
        user: data.user,
        children: data.children,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState({ ...defaultState, isLoading: false });
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = useCallback(async (loginName: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    const res = await authService.login(loginName, password);
    setState({
      user: res.user,
      children: res.children,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setState({ ...defaultState, isLoading: false });
  }, []);

  const register = useCallback(
    async (params: {
      login: string;
      password: string;
      email?: string;
      child?: { fullName: string; grade: string; subjectIds: string[] };
    }) => {
      setState((s) => ({ ...s, isLoading: true }));
      const res = await authService.registerParent(params);
      setState({
        user: res.user,
        children: res.child ? [res.child] : [],
        isAuthenticated: true,
        isLoading: false,
      });
    },
    []
  );

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    register,
    loadMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
