'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '@/shared/lib/admin-auth-context';
import { LogoIcon } from '@/shared/ui/logo-icon';
import { Button } from '@/shared/ui/button';
import { ApiError } from '@/shared/api/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdminAuth();
  const [loginVal, setLoginVal] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/admin');
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginVal, password);
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="block text-center">
            <div className="mx-auto flex size-[100px] items-center justify-center">
              <LogoIcon className="size-[100px]" />
            </div>
            <h1 className="text-xl font-bold text-black">LumenBridge</h1>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-[var(--color-on-surface)]">Административная панель</h1>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">Войдите для управления системой</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-black/20 bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <div className="mb-4">
            <label htmlFor="login" className="mb-1.5 block text-sm font-medium text-[var(--color-on-surface-variant)]">
              Логин
            </label>
            <input
              id="login"
              type="text"
              value={loginVal}
              onChange={(e) => setLoginVal(e.target.value)}
              placeholder="admin@lumenbridge.example"
              required
              className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[var(--color-on-surface-variant)]">
              Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Вход...' : 'Войти'}
          </Button>

          <div className="mt-4 text-center text-xs text-[var(--color-on-surface-variant)]">
            <p>Демо: admin / admin123 или admin@lumenbridge.example / admin123</p>
            <p>Оператор: operator@lumenbridge.example / operator123</p>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] hover:underline">
            Вход для клиентов
          </Link>
        </div>
      </div>
    </div>
  );
}
