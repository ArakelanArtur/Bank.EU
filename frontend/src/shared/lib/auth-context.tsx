'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { requestOtp, verifyOtp, loginUser, getMe, type AuthResponse } from '@/shared/api/auth';

type User = AuthResponse['user'];

type AuthContextType = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  requestOtpCode: (phone: string) => Promise<void>;
  verifyOtpCode: (phone: string, code: string) => Promise<void>;
  loginWithPassword: (phone: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function loadAuth(): { token: string | null; user: User | null } {
  if (typeof window === 'undefined') return { token: null, user: null };
  try {
    const raw = localStorage.getItem('lbf_auth');
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw);
    return { token: parsed.token || null, user: parsed.user || null };
  } catch {
    return { token: null, user: null };
  }
}

function saveAuth(token: string, user: User) {
  localStorage.setItem('lbf_auth', JSON.stringify({ token, user }));
}

function clearAuth() {
  localStorage.removeItem('lbf_auth');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const { token: savedToken, user: savedUser } = loadAuth();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      getMe()
        .then((freshUser) => {
          setUser(freshUser);
          saveAuth(savedToken, freshUser);
        })
        .catch(() => {
          clearAuth();
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsAuthLoading(false));
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const requestOtpCode = useCallback(async (phone: string) => {
    await requestOtp({ phone });
  }, []);

  const verifyOtpCode = useCallback(async (phone: string, code: string) => {
    const res = await verifyOtp({ phone, code });
    setToken(res.token);
    setUser(res.user);
    saveAuth(res.token, res.user);
  }, []);

  const loginWithPassword = useCallback(async (phone: string, password: string) => {
    const res = await loginUser({ phone, password });
    setToken(res.token);
    setUser(res.user);
    saveAuth(res.token, res.user);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isAuthLoading,
        requestOtpCode,
        verifyOtpCode,
        loginWithPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
