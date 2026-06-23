'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Key } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth-context';
import { LogoIcon } from '@/shared/ui/logo-icon';
import { Button } from '@/shared/ui/button';
import { ApiError } from '@/shared/api/client';
import * as v from 'valibot';

const phoneSchema = v.pipe(v.string(), v.minLength(5, 'Введите корректный номер телефона'));
const passwordSchema = v.pipe(v.string(), v.minLength(1, 'Введите пароль'));

export default function ClientLoginPage() {
  const router = useRouter();
  const { isAuthenticated, loginWithPassword } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/cabinet');
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const phoneResult = v.safeParse(phoneSchema, phone);
    if (!phoneResult.success) { setError(phoneResult.issues[0].message); return; }
    const passwordResult = v.safeParse(passwordSchema, password);
    if (!passwordResult.success) { setError(passwordResult.issues[0].message); return; }

    setLoading(true);
    try {
      await loginWithPassword(phone, password);
      router.replace('/cabinet');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Неверный номер или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-0 text-center">
          <Link href="/" className="block text-center">
            <div className="mx-auto flex size-[120px] items-center justify-center">
              <LogoIcon className="size-[120px]" />
            </div>
            <h1 className="text-xl font-bold text-[var(--color-on-surface)]">LumenBridge</h1>
          </Link>
          <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
            Вход в личный кабинет
          </p>
        </div>

        <div className="rounded-2xl border-2 border-[var(--color-secondary)] bg-white p-6 shadow-md transition hover:shadow-lg">
          <div className="mb-5 flex items-center gap-4 rounded-xl border-2 border-black/20 bg-[var(--color-secondary)]/5 px-5 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-black/10 text-black">
              <Key className="size-5 text-black" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-on-surface)]">Войти по паролю</p>
              <p className="text-xs font-normal text-[var(--color-on-surface-variant)]">Используйте номер и пароль</p>
            </div>
          </div>

          <form onSubmit={handlePasswordLogin}>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-on-surface-variant)]">
                Номер телефона
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+353 XX XXX XXXX"
                required
                className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20"
              />
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-on-surface-variant)]">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ваш пароль"
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

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-[var(--color-on-surface-variant)]">
            Нет аккаунта?{' '}
            <Link href="/register" className="font-semibold text-[var(--color-secondary)] hover:underline">
              Зарегистрироваться
            </Link>
          </p>

          <div className="mt-4 border-t border-black/20 pt-4 text-center">
            <Link href="/admin/login" className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] hover:underline">
              Вход для сотрудников
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
