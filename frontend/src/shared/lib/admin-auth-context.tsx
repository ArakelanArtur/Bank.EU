'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { adminGetMe, adminLogin as adminLoginApi, type AdminUser } from '@/shared/api/admin';

type AdminAuthContextType = {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const ADMIN_STORAGE_KEY = 'lbf_admin_auth';

function loadAdminAuth(): { token: string; admin: AdminUser } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveAdminAuth(token: string, admin: AdminUser) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({ token, admin }));
}

function clearAdminAuth() {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const saved = loadAdminAuth();
    if (saved) {
      adminGetMe()
        .then((user) => {
          setToken(saved.token);
          setAdmin(user);
        })
        .catch(() => clearAdminAuth())
        .finally(() => setIsAuthLoading(false));
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const login = useCallback(async (loginVal: string, password: string) => {
    const res = await adminLoginApi(loginVal, password);
    saveAdminAuth(res.token, res.admin);
    setToken(res.token);
    setAdmin(res.admin);
  }, []);

  const logout = useCallback(() => {
    clearAdminAuth();
    setToken(null);
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ token, admin, isAuthenticated: !!token && !!admin, isAuthLoading, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
